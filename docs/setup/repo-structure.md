# Repo Structure

## Decision
Use a monorepo with top-level `apps`, `packages`, `services`, `scripts`, and `docs`.

## Why
- Keeps product code separate from shared code
- Makes it easy to add services later
- Scales better than a flat root
- Works well with pnpm workspaces and Turbo

## Notes
- Start with one app in `apps/web`
- Only promote code into `packages` when at least two parts of the repo need it
- Keep business/domain logic out of UI packages