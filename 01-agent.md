# Agent Workflow

## Main Agent Behavior

1. **Read 00-plan.md** first for taxonomy overview
2. **Read this file** for workflow
3. **Read scripts/01-curriculum.py** for the full book list
4. Generate books using isolated sub-agents (one per book)
5. Validate with `pnpm typecheck`

## Sub-Agent Isolation

Each book gets its own sub-agent via `task()`. The sub-agent:
- Researches ONLY that one book
- Writes all 5 files (01-index.mdx → 05-meta.json)
- Validates the files
- Terminates

The main agent never holds full book context — only orchestrates.

## File Numbering

```
book-slug/
  01-index.mdx      # Overview + metadata
  02-content.mdx    # Full summary
  03-analysis.mdx   # Critical analysis
  04-narration.mdx  # TTS-ready prose
  05-meta.json      # Structured metadata
```

## Category/Subcategory Index Files

Every category and subcategory folder must have:
```
01-index.mdx
02-reading-order.mdx
03-book-list.mdx
04-meta.json
```

## Validation

- `pnpm typecheck` after every batch
- Every subcategory needs ≥2 books, ≥1 counterpoint
- No duplicate books across categories
- No fabricated data
