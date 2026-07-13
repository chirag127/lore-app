# Contributing

## Setup

```bash
# prereqs: Node >=22.12.0, pnpm >=10
pnpm install          # from workspace root or this dir
pnpm -F book-lore dev # start dev server at localhost:4321
```

## Build

```bash
pnpm -F book-lore build     # production build → dist/
pnpm -F book-lore typecheck # astro check (TypeScript)
```

## Tests

```bash
pnpm -F book-lore test        # vitest unit tests
pnpm -F book-lore test:e2e    # playwright e2e (needs build first)
```

## Lint / format

```bash
pnpm -F book-lore lint    # biome check
pnpm -F book-lore format  # biome format --write
```

## Branches + PRs

Commit direct to `main` for owned changes. For upstream-upstreamable fixes open a `pr/<topic>` branch and submit a PR. Follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`.

## Content authoring

MDX artifacts live under `mdx/`. Each book needs four files (`01-index`, `02-content`, `03-analysis`, `04-narration`) + `meta.json`. See `schemas/` and `templates/` for the spec.
