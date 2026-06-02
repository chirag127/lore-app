# AGENTS.md — KnowledgeAtlas

Repo for [KnowledgeAtlas](https://github.com/chirag127/BookAtlas):
the free platform for understanding knowledge. Static SSG, React islands,
Firestore, LangGraph pipeline, GitHub Actions automation, Firebase
Hosting (Spark plan only — **no credit card required**).


## Commands

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Dev (web) | `pnpm dev` |
| Build (web) | `pnpm build` (runs Pagefind after Astro) |
| Preview built site | `pnpm preview` |


## Book Generation — Master Plan

**ALWAYS read `PLAN.md` (root) before generating books.**

### What PLAN.md Contains

- **Complete per-directory book lists**: Every leaf directory with 10 recommended books
  (so you know exactly which book to generate and for which directory)
- **Quality standards**: Specifications for all 5 files per book
  (index.mdx, 01-content.mdx, 02-analysis.mdx, 03-narration.mdx, meta.json)
- **Research methodology**: 7 areas to search independently per book
- **Batch progress tracking**: Current status of all 30 batches
- **Execution priority**: Phase 0 (empty dirs) → Phase 1 (full cat) → Phase 2 (partial)
- **54 empty leaves**: Books that need FULL 10-book generation immediately

### Generation Workflow (per book)

**CRITICAL: ONE SUB-AGENT PER BOOK.** Do NOT batch multiple books in one agent.

1. **IDENTIFY** target leaf + book slug from PLAN.md
2. **READ** an existing reference book in the same leaf to match format
3. **SEARCH WEB** for the actual book to include:
   - `"[topic] best books unconventional contrarian views"` — find NON-conventional books
   - `"[topic] must read books opposing perspectives"`
   - Prefer books that present unexpected/contrarian theses, not just popular bestsellers
   - For self-help: include books that challenge the genre (e.g., Die With Zero, Status Anxiety)
4. **RESEARCH 7 AREAS** via web search (verify every fact):
   - Metadata (ISBN, pages, year — verify via Wikipedia/Open Library)
   - Summary & Table of Contents (chapter breakdown)
   - Key Concepts & Arguments (5-10 main ideas)
   - Critical Reception (minimum 3 NAMED critics with specific arguments)
   - Author Background (credentials, biases, career)
   - Impact & Influence (citations, policy changes, cultural reach)
   - Related Books (3-5 similar works)
5. **COMPOSE 6 FILES** into `knowledge/NN-category/subcat/sub-subcat/book-slug/`
6. **RUN** `pnpm typecheck` to verify
7. **CREATE/UPDATE** README.md in the leaf directory
8. **COMMIT** the single book

### File Requirements (IMPORTANT) — 6 files per book (+ README)

| File | Word Count | Key Sections |
|---|---|---|
| index.mdx | ~200 words + frontmatter | Full YAML metadata, BookHeader, 2-3 para intro |
| 01-content.mdx | 3000-5000 words | Complete chapter summary (ALL chapters) + Reading Guide |
| 02-analysis.mdx | 2000-4000 words | 11 required sections (context → sufficiency) |
| 03-narration.mdx | 500-1000 words | Style, structure, rhetoric, readability |
| 04-problems.mdx | 1000-2000 words | Key problems addressed, solutions proposed, open questions (non-self-help only) |
| meta.json | ~15 lines | ISBN, pages, year, genres — all VERIFIED |

### `01-content.mdx` Must Contain COMPLETE Summary

- Summarize EVERY chapter, not just the first few
- Include specific examples, case studies, data points from each chapter
- End with Reading Guide (sufficiency, recommended path, chapters to read/skip)
- Word count: 3000-5000 words for dense books, minimum 2500 for shorter ones

### `04-problems.mdx` — Analysis & Problems Section (non-self-help only)

- **Key Problem** — The core issue the book addresses
- **Proposed Solution** — The book's answer to that problem
- **Evidence & Argumentation** — How it makes its case
- **Unresolved Questions** — What the book leaves open
- **Criticisms** — Named critics' objections
- **Alternative Solutions** — How other thinkers have approached the same problem
- **Practical Applications** — How to apply the book's insights

### Self-Helf Differentiation

For self-help, productivity, personal-development leaves:
- Include at least 2 books that CHALLENGE conventional self-help wisdom
- Example for personal finance: pair "The Simple Path to Wealth" (save early) with "Die With Zero" (spend when young, you'll earn more later)
- Example for habits: pair "Atomic Habits" with "The Power of Habit" chapter critique or "Better Than Before" contrarian takes
- Always search for unconventional/contrarian books in the space

### Unconventional Book Inclusion Rule

Before writing ANY book for any leaf:
1. Search web: `"[topic] unconventional contrarian books"`
2. Search web: `"[topic] books that challenge conventional wisdom"`
3. Include at least 2-3 unconventional picks per 10-book leaf
4. Document WHY each unconventional book was chosen in its meta.json "rationale" field

### Hard Rules

- **NEVER fabricate** criticisms — find real reviews from named critics/publications
- **NEVER guess** ISBN or page count — verify via web search
- **NEVER add** comments to code
- **ALWAYS** run `pnpm typecheck` before committing
- **ALWAYS** read PLAN.md first to find which book goes in which directory
- **ALWAYS** do all 7 research searches before writing a single line

### Reading the Book List in PLAN.md

Each leaf directory entry looks like:

```
**subcategory/sub-subcategory/book-slug**
1. First Book Title — Author (year) — ALREADY EXISTS (skip)
2. Second Book Title — Author (year) — GENERATE THIS
3. Third Book Title — Author (year)
... up to 10
```

Phase 0 (empty dirs) entries list ALL 10 books for generation.
Phase 1-2 (existing dirs) entries list 9 additional books per existing directory.


## Free-tier constraints (Spark plan only)

We do **not** use, to avoid credit-card-only features:

- Cloud Functions for Firebase
- Cloud Storage for Firebase (requires Blaze since 2024)
- Cloud Run, Pub/Sub, BigQuery export
- Scheduled functions

Workarounds baked in:

- **Book requests**: the website form opens a pre-filled GitHub Issue URL
  in a new tab. The user signs into GitHub and submits. No backend needed.
- **Book metadata/covers**: fetched at pipeline time from Open Library
  (`openlibrary.org`) and Google Books free APIs (no key, CORS-friendly
  for build-time use; server-side fetch in CI).
- **Speech narration**: Browser `SpeechSynthesis` API. No MP3 storage.

