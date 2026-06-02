# Future Features & Roadmap

## Scaling to 5000 Books

The current 257 books are the seed. The goal is 5000+ across all
30 categories. Books arrive via two channels:

### Channel 1: GitHub Issue Pipeline
1. User submits book via `/request` form → pre-filled GitHub Issue
2. Issue triggers `book-automation` workflow
3. Pipeline (LangGraph) fetches metadata from Open Library / Google Books
4. LLM generates 5-file content package (index.mdx, 01-content.mdx,
   02-analysis.mdx, 03-narration.mdx, meta.json)
5. PR created with generated content → auto-merge after validation

### Channel 2: Bulk Import Script (for seed books)
```bash
pnpm pipeline -- --bulk knowledge/**
```
Reads all meta.json files, validates schema, generates missing content.

## Pipeline Architecture

```
GitHub Issue → Webhook → LangGraph DAG
                         ├─ fetchMetadata (OL + GB APIs)
                         ├─ generateContent (LLM waterfall)
                         ├─ generateAnalysis (LLM waterfall)
                         ├─ generateNarration (LLM waterfall)
                         └─ validate → PR
```

Each step uses the first-successful LLM from `models.llm.models.json`.
Waterfall order: Groq → OpenAI → OpenRouter → Gemini.

## Content Package Format

Each book directory contains 5 files:

| File | Purpose |
|------|---------|
| `index.mdx` | Overview, key ideas, who should read |
| `01-content.mdx` | Full structured summary with sections |
| `02-analysis.mdx` | Critical analysis, strengths, weaknesses |
| `03-narration.mdx` | Narration script for SpeechSynthesis |
| `meta.json` | Metadata (slug, authors, ISBN, cover, tags) |

## Planned Features

### Near-term
- [ ] Category landing pages with curated book lists
- [ ] Author pages with aggregated works
- [ ] Reading streak tracking and gamification
- [ ] LLM-generated reading paths ("if you liked X, read Y")
- [ ] Dark mode refinements
- [ ] Mobile navigation improvements

### Medium-term
- [ ] Multi-language support (MDX content in Hindi, Spanish, etc.)
- [ ] Community annotations on book pages
- [ ] Spaced repetition flashcards from key ideas
- [ ] PDF/epub export of content packages
- [ ] Browser extension for highlighting web articles → save to library

### Long-term
- [ ] Visual knowledge graph (books → ideas → connections)
- [ ] Collaborative collections / reading groups
- [ ] AI tutor integration (ask questions about any book)
- [ ] Offline-first PWA
- [ ] User-contributed content with moderation pipeline

## Technical Decisions

### Why not Cloud Functions?
Spark plan forbids Cloud Functions. Workaround: GitHub Actions for
backend work, browser SpeechSynthesis for narration, prefilled GitHub
Issues for book requests.

### Why MDX, not a database?
MDX is the SSG content layer. User data (notes, reviews, progress)
lives in Firestore. MDX gives us version-controlled, reviewable,
portable content that works without a backend.

### Why 30 categories?
Balanced between comprehensive (covers all human knowledge) and
navigable (fits in one screen of a taxonomy picker). Based on modified
DDC with PKM-friendly naming.

### Why nested paths?
`knowledge/<category>/<subcategory>/<book>/` enables:
- Content collection glob patterns by category
- URL hierarchy for breadcrumbs
- Logical filesystem navigation
- Category-level SSG pages without additional routing logic

## Technical Appendix

### Free Tier Constraints (Firebase Spark)
| Cannot Use | Workaround |
|---|---|
| Cloud Functions | GitHub Actions |
| Cloud Storage | Open Library API → direct URLs |
| Scheduled functions | Manual trigger or cron on free CI |
| Pub/Sub | N/A (no event-driven architecture needed) |

### Dependencies by Layer
- **SSG**: Astro 6 + React 18 + Tailwind + MDX
- **Content**: MDX with Shiki code highlighting + Mermaid diagrams
- **Search**: Pagefind (static, zero server cost)
- **Auth**: Firebase Auth (Email, Google, GitHub)
- **User data**: Firestore Standard (notes, reviews, progress, collections)
- **Pipeline**: Node 22 + LangGraph + LangChain
- **LLM**: OpenAI-compatible waterfall (Groq, OpenAI, OpenRouter, Gemini)
- **CI/CD**: GitHub Actions → Firebase Hosting

### Environment Variables
```
# LLM API keys (at least one)
GROQ_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
GEMINI_API_KEY=

# Firebase (from Firebase Console)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

## Contributing

See AGENTS.md for commands and conventions. To add a new book:
1. Create directory under correct category/subcategory
2. Create meta.json with at minimum: slug, title, author
3. Create (or let pipeline generate) the 4 MDX files
4. Run `pnpm typecheck` to validate schema
5. Submit PR
