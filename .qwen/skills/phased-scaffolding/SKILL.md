---
name: phased-scaffolding
description: When user asks for a new project, build the minimal working version first and wait for follow-up instructions before adding advanced features
source: auto-skill
extracted_at: '2026-06-10T10:00:00.000Z'
---

# Phased scaffolding for new projects

## When to use
User asks to create a new project, server, app, or feature from scratch.

## Rule
Build the smallest working version. Stop. Confirm readiness for the next step.
Do NOT pre-emptively add features the user didn't ask for.

## What "minimal" means
- Only the explicit feature requested
- No "good to have" additions: cors, helmet, morgan, dotenv, validation
  libraries, error middleware, logging, rate limiting, docker, CI config
- No "while we're at it" refactors
- A README is fine; a CONTRIBUTING.md is not

## Why
On 2026-06-10 the user said:
> "make the simple project first, so i will give you advanced command in the future"

And later (re: not using vercel dev):
> "i want to running the local"

The pattern is: user drives scope turn by turn, layering requirements
one at a time. Pre-empting scope creates churn (have to remove things)
and surfaces options the user may not want.

## How to apply
1. Build the literal minimum that satisfies the current request.
2. Run any obvious verification (typecheck, validate).
3. End the turn with a short summary of what's there + a readiness signal:
   "Ready for your next command." or "Want me to add X next?"
4. Do NOT bundle multiple follow-ups into one turn even if they're obvious
   (e.g., don't add Prisma + auth + tests just because the user said
   "blog app" — wait for them to ask for each piece).

## Counter-signals (when to NOT use this)
- User says "set up a complete X" or "production-ready" — they want it all.
- User lists multiple explicit requirements in one turn.
- User says "with auth and database" — those are explicit, include them.
