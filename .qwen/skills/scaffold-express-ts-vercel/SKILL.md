---
name: scaffold-express-ts-vercel
description: How to scaffold a fresh Express + TypeScript project in kata/server that runs locally on bun and deploys to Vercel
source: auto-skill
extracted_at: '2026-06-10T10:00:00.000Z'
---

# Scaffold Express + TypeScript + Vercel project

## When to use
User asks to bootstrap a new server in `kata/server` (or any Vercel-deployable
TS project) that should:
- run locally with `bun` (not `vercel dev`)
- be deployable to Vercel as serverless functions

## Layout
```
kata/server/
├── api/index.ts        # single Express app, default-exported
├── openapi/            # OpenAPI spec + validation script (optional)
├── package.json
├── tsconfig.json
├── vercel.json
├── .gitignore
└── .prettierrc
```

## `package.json` shape
- `"type": "module"`
- Scripts:
  - `dev`: `bun run --watch api/index.ts` (NOT `vercel dev` — see below)
  - `start`: `bun run api/index.ts`
  - `typecheck`: `tsc --noEmit`
- Dependencies: `express` only
- DevDependencies: `@types/express`, `@types/node`, `typescript`
- Do NOT include `vercel` in devDependencies — Vercel uses `@vercel/node`
  builder declared in `vercel.json`, not the npm package.

## `api/index.ts` pattern
Single file that defines Express, exports it for Vercel's serverless wrapper,
AND calls `app.listen` so local `bun run` works.

```ts
import express, { type Request, type Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello from kata server" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));

export default app;
```

The `app.listen` call is a no-op on Vercel (Vercel wraps the export), so it's
safe to keep both.

## `vercel.json` (kept for deploy, not for dev)
```json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }]
}
```

## `tsconfig.json` essentials
- `"target": "ES2022"`, `"module": "ESNext"`, `"moduleResolution": "Bundler"`
- `"strict": true`, `"esModuleInterop": true`, `"noEmit": true`
- `"include": ["api/**/*", "src/**/*"]`

## Why these choices
- `bun run --watch` for `dev` because user wants local dev without the
  Vercel CLI overhead (confirmed 2026-06-10).
- `api/index.ts` as single entry because Vercel's `@vercel/node` builder
  expects one default-exported request handler per file; this keeps the
  structure compatible with both local and serverless.
- "Why: User explicitly said 'dont use vercel when bun dev' on 2026-06-10."

## Pitfalls seen
- Bun + Vercel work fine together; the user's hesitation was about the CLI
  dev experience, not the deploy.
- Express 4 is the safe default. Express 5 is GA but many middleware packages
  still target v4 — stick with `^4.19.2` unless user requests otherwise.
