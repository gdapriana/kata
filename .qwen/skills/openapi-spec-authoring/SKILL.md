---
name: openapi-spec-authoring
description: How to author an OpenAPI 3.1 spec for kata/server, including validation and known-pitfall fixes
source: auto-skill
extracted_at: '2026-06-10T10:00:00.000Z'
---

# OpenAPI 3.1 spec authoring for kata/server

## When to use
User asks to add an `openapi.yaml` / `openapi.json` for a new API surface
in the kata/server project.

## File location
`openapi/openapi.yaml` (YAML preferred — easier to read and review in PRs).

## Validation setup
1. `bun add -d @apidevtools/swagger-parser`
2. Create `openapi/validate.ts` that runs `SwaggerParser.validate(file)` and
   prints `✓ OpenAPI spec is valid` or exits 1 with the error.
3. Wire script: `"openapi:validate": "bun run openapi/validate.ts openapi/openapi.yaml"`

Run `bun run openapi:validate` after every spec edit.

## Spec structure that has worked
- `info`: title, version, summary, description, contact, license
- `servers`: at minimum local (`http://localhost:3000/api`) — keep
  production URL hardcoded (NOT templated with `variables`).
- `tags`: group operations (e.g. Posts, Comments, System)
- `paths`: one block per endpoint, with `parameters` shared via `parameters:`
  array on the path item when multiple ops share them (e.g. `postId`).
- `components.schemas`: all request/response bodies + shared types
  (`Pagination`, `Error`, `Health`, status enums).
- `components.parameters`: reusable path/query params referenced via `$ref`.
- `components.responses`: shared error responses (`Unauthorized`,
  `NotFound`, `ValidationError`, `InternalError`).
- `components.securitySchemes`: `bearerAuth` (JWT) declared even if the
  actual auth flow isn't wired — write endpoints still declare
  `security: [{ bearerAuth: [] }]` and return 401.

## Common shapes
```yaml
# Shared error
Error:
  type: object
  required: [error]
  properties:
    error:
      type: object
      required: [code, message]
      properties:
        code: { type: string, example: POST_NOT_FOUND }
        message: { type: string }
        details: { type: object, additionalProperties: true }

# Pagination
Pagination:
  type: object
  required: [page, limit, total, totalPages]
  properties:
    page: { type: integer, minimum: 1 }
    limit: { type: integer, minimum: 1 }
    total: { type: integer, minimum: 0 }
    totalPages: { type: integer, minimum: 0 }

# List response wrapper
XxxListResponse:
  type: object
  required: [data, pagination]
  properties:
    data: { type: array, items: { $ref: "#/components/schemas/Xxx" } }
    pagination: { $ref: "#/components/schemas/Pagination" }
```

## Pitfalls seen (and fixes)
1. **`info.license` shape in 3.1.** OpenAPI 3.1 license needs either
   `url` or `identifier` (SPDX). Just `name: MIT` is rejected.
   Fix: add `identifier: MIT` next to `name`.
2. **`servers[].variables` + `unevaluatedProperties: false`.** The
   ServerVariable `oneOf` schema can reject blocks with only `default` and
   `description` because the JSON Schema's discriminator doesn't resolve.
   Workaround: hardcode the deployment URL and drop the `variables` block.
   If templating is needed, add an explicit `enum` to the variable.
3. **Always validate after editing.** The errors are noisy but specific.
   Catch them in the same turn before telling the user "done".

## Why these choices
- YAML over JSON: git diffs are readable, comments allowed in tooling
  that strips them, easier to hand-edit.
- Bearer auth declared even when unwired: keeps the spec honest about
  the intended contract; handlers can be built to the spec.
- Shared `responses` blocks: cuts duplication across 5+ endpoints and
  makes the error contract consistent.

## Tooling that renders the spec well
- `bunx @redocly/cli preview-docs openapi/openapi.yaml` — local preview
- Stoplight Elements
- Swagger UI
- Redoc

## Don't
- Don't pre-emptively add an SDK generation step.
- Don't add request examples unless user asks — they bloat the file.
- Don't add `webhooks` / `callbacks` unless the API actually uses them.
