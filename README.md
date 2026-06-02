# KnowledgeAtlas

> The free platform for understanding knowledge.

The internet stores books. **KnowledgeAtlas stores understanding.**

A production-grade knowledge understanding platform. SSG for speed, React
islands for personal features, Firestore for user data, LangGraph for
content generation, GitHub Issues as the canonical request queue, and
GitHub Actions for the entire automation loop. No Cloud Functions. No
Cloud Storage. No credit card. Built for the Firebase Spark plan — free
forever.

## Layout

```
/web        Astro 6 + React + TS + Tailwind + MDX + Shiki + Mermaid
/pipeline   Node 22 + LangGraph + OpenAI-compat waterfall LLM
/schemas    Shared Zod schemas (used by web + pipeline)
/knowledge  Generated content MDX (committed by pipeline)
/.github    Workflows: deploy + book-automation
```
Cloud Storage. No credit card.

**Live stack (free tier only):**

- [Astro 6](https://astro.build/) + [React](https://react.dev/) + TypeScript + Tailwind CSS + MDX
- [Shiki](https://shiki.style/) for syntax highlighting, [Mermaid](https://mermaid.js.org/) for diagrams
- [Pagefind](https://pagefind.app/) for static search (no Algolia, no Elasticsearch)
- [Firebase Hosting](https://firebase.google.com/products/hosting) (Spark)
- [Firebase Auth](https://firebase.google.com/products/auth) (GitHub, Google, email link)
- [Firestore](https://firebase.google.com/products/firestore) + [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Analytics](https://firebase.google.com/products/analytics) (free unlimited events)
- [LangGraph](https://langchain-oss.github.io/langgraph/) (Node 22) for the content pipeline
- [Model Context Protocol](https://modelcontextprotocol.io/) for the research tool layer
- OpenAI-compatible LLM endpoints in a **waterfall** (`models.llm.models.json`)
- [Open Library](https://openlibrary.org/) free API for book metadata and covers
- [Browser `SpeechSynthesis`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) for narration (no MP3 storage)

---

## What it does

1. A user visits **knowledgeatlas.app** and browses the **atlas** — a curated
   collection of books. Every book has four reusable knowledge artifacts:
   - **Overview** — executive summary, key ideas, who should read
   - **Content** — long-form understanding, frameworks, mental models
   - **Analysis** — critical reading: strengths, weaknesses, counter-arguments
   - **Narration** — a long-form conversational script for `speechSynthesis`
2. The user can **request** a book. The form opens a pre-filled
   [GitHub Issue](https://github.com/chirag127/KnowledgeAtlas/issues/new) in a
   new tab. No backend needed.
3. A **GitHub Action** picks the issue up, runs the LangGraph pipeline,
   fetches metadata from Open Library, optionally augments research with
   a [Playwright](https://playwright.dev/)-backed **MCP** research server,
   generates the four MDX artifacts via a waterfall of LLM providers,
   validates them with [Zod](https://zod.dev/), commits them, and opens a
   PR.
4. Merge the PR → the **deploy workflow** builds the site (Astro +
   Pagefind) and pushes it to Firebase Hosting. No credit card required.

Every account feature (notes, reviews, bookmarks, collections, reading
progress) is a **React island** writing directly to Firestore under
tight **Security Rules**. Anonymous browsing is allowed.

---

## Project layout

```
.
├─ web/                  Astro 6 + React + Tailwind + MDX (the user app)
├─ pipeline/             Node 22 + LangGraph (the content generation engine)
├─ mcp/research/         MCP server (Playwright + DuckDuckGo + Open Library)
├─ schemas/              Shared Zod schemas (web + pipeline)
├─ books/                Generated book MDX (committed by the pipeline)
├─ .github/workflows/    deploy.yml, book-automation.yml, lint.yml
├─ firebase.json         Hosting (web/dist) + Firestore rules
├─ firestore.rules       Per-user data isolation; public collections readable
├─ firestore.indexes.json
├─ models.llm.models.json  Waterfall of OpenAI-compatible endpoints
├─ AGENTS.md             Agent-oriented documentation
└─ README.md
```

---

## Quick start

```bash
nvm use                  # Node 22
corepack enable
corepack prepare pnpm@9.12.0 --activate
pnpm install
cp web/.env.example web/.env.local
# Fill in Firebase web config (Spark plan is fine)
pnpm dev                 # Astro on http://localhost:4321
```

In a second terminal:

```bash
pnpm emulators           # Firebase Auth + Firestore + Hosting UI
```

If you'd like to test the pipeline locally:

```bash
# In another terminal
pnpm --filter mcp-research start   # MCP research server (uses Playwright)
pnpm pipeline -- --title "Sapiens" --author "Yuval Noah Harari" --publish false
```

---

## Free-tier discipline

We do **not** use any Firebase feature that requires the **Blaze** plan.
Confirmed via the [Firebase pricing docs](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
and the [Firestore quotas](https://firebase.google.com/docs/firestore/quotas):

| Feature                 | Spark | We use it? |
| ----------------------- | :---: | :--------: |
| Firebase Hosting        |  ✅   |     ✅     |
| Firebase Auth (most)    |  ✅   |     ✅     |
| Firestore (50K reads/d) |  ✅   |     ✅     |
| Firebase Analytics      |  ✅   |     ✅     |
| Cloud Functions         |  ❌   |     ❌     |
| Cloud Storage           |  ❌   |     ❌     |
| Cloud Run / Pub/Sub     |  ❌   |     ❌     |
| Phone Auth              |  ❌   |     ❌     |

What we do instead:

- **Server-side work** runs in **GitHub Actions** on a public repo (free,
  unlimited minutes).
- **Audio narration** uses the browser's `SpeechSynthesis` API (no MP3
  storage, no per-minute cost).
- **Book requests** become a pre-filled GitHub Issue URL opened in a new
  tab (no backend form processing).
- **Covers and metadata** come from Open Library's free public API at
  build time.

---

## AI provider configuration (waterfall)

Edit `models.llm.models.json`. Each entry is tried **in order**; the
first to respond successfully wins. Authentication is by **environment
variable name** — never put keys in this file.

```json
{
  "models": [
    { "id": "groq-llama-3.3-70b",  "baseUrl": "https://api.groq.com/openai/v1",        "apiKeyEnv": "GROQ_API_KEY",      "model": "llama-3.3-70b-versatile" },
    { "id": "openai-gpt-4o-mini",  "baseUrl": "https://api.openai.com/v1",              "apiKeyEnv": "OPENAI_API_KEY",    "model": "gpt-4o-mini" },
    { "id": "openrouter-auto",     "baseUrl": "https://openrouter.ai/api/v1",          "apiKeyEnv": "OPENROUTER_API_KEY","model": "anthropic/claude-3.5-sonnet" },
    { "id": "google-gemini",       "baseUrl": "https://generativelanguage.googleapis.com/v1beta/openai", "apiKeyEnv": "GEMINI_API_KEY", "model": "gemini-1.5-flash" }
  ]
}
```

Set the keys in your environment / GitHub Secrets. Add as many providers
as you like; later entries only run on transient failures (network /
timeout / 429). Hard failures (auth, bad schema) halt the pipeline
immediately so you can fix the config.

---

## The pipeline (LangGraph)

```
parseIssue → collectMetadata (Open Library) → research (LLM + MCP)
   → genIndex (LLM) → genContent (LLM) → genAnalysis (LLM)
   → genNarration (LLM) → assemble → validate (Zod) → publish (git PR)
```

The graph is defined in `pipeline/src/graph/buildGraph.ts`. State is
typed with `@langchain/langgraph`'s `Annotation.Root`. Each node is
replaceable.

### Prompts

All prompts live in `pipeline/src/prompts/*.md` and are rendered with
`{{var}}` interpolation. The `generate-*` prompts require strict fenced
output blocks (one `json` and one `mdx`) so the parsing is robust.

### MCP research (optional)

The pipeline can spawn a local MCP server (`mcp/research`) that exposes:

- `web_search(query, max)` — DuckDuckGo HTML, driven by Playwright
- `web_fetch(url, maxChars)` — fetches and cleans a page
- `open_library_lookup(title, author)` — Open Library record

Run it manually:

```bash
pnpm --filter mcp-research start
# In another terminal
pnpm pipeline -- --issue 42 --publish false
```

In CI, the `book-automation.yml` workflow starts the MCP server in the
background, points the pipeline at it, and tears it down at the end.

---

## GitHub Actions

- `deploy.yml` — push to `main` → build (with Pagefind) → deploy to
  Firebase Hosting + deploy Firestore rules + indexes.
- `book-automation.yml` — issues labeled `book-request` (or `/process`
  comment) → run the pipeline → open a PR.
- `lint.yml` — typecheck and JSON validation on PRs.

Required secrets:

```
FIREBASE_SERVICE_ACCOUNT         (JSON service account for Firebase)
PUBLIC_FIREBASE_*                (web config — see web/.env.example)
GROQ_API_KEY / OPENAI_API_KEY /  (LLM providers — at least one)
OPENROUTER_API_KEY / GEMINI_API_KEY
```

`PUBLIC_GH_REPO` defaults to the current repo and is set automatically
in CI.

---

## Book directory structure

Every book in `/books/<slug>/`:

```
meta.json          ← Zod-validated frontmatter (BookMetaSchema)
index.mdx          ← Overview (rendered as the default tab)
01-content.mdx     ← Content (deep understanding)
02-analysis.mdx    ← Analysis (critical reading)
03-narration.mdx   ← Narration (long-form script for TTS)
```

Covers are served from Open Library's CDN:
`https://covers.openlibrary.org/b/isbn/<isbn13>-L.jpg`.

---

## Security model

- **Public SSG output** — every book page is prerendered HTML. No
  server runtime means no public attack surface beyond static file
  serving.
- **Per-user Firestore data** — `users/{uid}/...` collections are
  readable and writable only by that user, validated by `firestore.rules`.
- **Public mirrors** — reviews and collections can be opted-in to
  `publicReviews` / `publicCollections` collections, where the rule checks
  `request.auth.uid == resource.data.ownerId`.
- **No secrets in the repo** — the LLM waterfall references env var
  *names*; the keys live in `models.llm.models.json` indirection.
- **Strict CSP-friendly headers** — see `firebase.json` for the
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
  `Permissions-Policy` defaults.
- **Firestore security rules** — deny by default, validate inputs, cap
  field sizes, rate-limit by design (Firestore's natural per-doc quotas).

---

## Roadmap

- [ ] Parallel fan-out of the four generator nodes in the graph
  (current implementation is sequential for predictability)
- [ ] A second MCP server for editorial voice and style consistency
- [ ] Per-user feed (`/feed`) of recently published books
- [ ] Public RSS per tag
- [ ] Lightweight "share a quote" cards with OG image generation
- [ ] Server-side rendering of `/notes`, `/reviews` for crawlers
  (still static, but with a read-only preview)

---

## Contributing

- Add a book by [opening an issue](https://github.com/chirag127/BookAtlas/issues/new)
  with the title `Add Book: <title> — <author>`.
- Edit a book's MDX directly in `books/<slug>/` and open a PR.
- Improve a prompt in `pipeline/src/prompts/` and open a PR — the
  pipeline's behavior is mostly in those files.

## License

MIT
