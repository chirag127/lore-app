# Oriz Lore — Knowledge summaries

[![GitHub stars](https://img.shields.io/github/stars/chirag127/lore?style=social)](https://github.com/chirag127/lore/stargazers)

> Free, ad-supported library of structured summaries across books, courses, documentaries, lectures, podcasts, and research papers — overview, content map, critical analysis, narration script.

**Live at**: <https://lore.oriz.in> · **Status**: production

## What this is

Each book gets a four-part MDX artifact set (`01-index`, `02-content`, `03-analysis`, `04-narration`) plus a `meta.json`. Books are organised under `mdx/NN-top-category/NN-discipline-subcategory/NN-topic-leaf/NNN-book-slug/`; `schemas/` and `templates/` document the authoring conventions.

## Per-feature inventory

| Feature | Status |
| --- | --- |
| Home (`/`) | ✅ live |
| Books index (`/books`) and per-book pages (`books/[slug]`) | ✅ live |
| Categories index (`/categories`) | ✅ live |
| Account / sign-in (shared) | ✅ live |
| Legal pages | ✅ live |
| Per-category landing pages | 🚧 WIP |
| Audio narration playback | 📜 planned |

## App-specific env vars

None beyond the family-wide set at `templates/.env.example`.

## Local dev

```bash
# from the workspace root (c:/D/oriz)
pnpm -F book-lore dev
```

## Knowledge

See [`./knowledge/`](./knowledge/) for app-specific decisions, runbooks, and services. Family rules / decisions / architecture live at the master repo's [`knowledge/`](../../../../knowledge/).

## License

MIT License. See master [`LICENSE`](../../../../LICENSE) — same terms across the family.
