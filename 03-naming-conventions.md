# Naming Conventions

## Numbering

All entities use zero-padded numbers for alphabetical sort order.

| Entity | Format | Example |
|---|---|---|
| Category folder | `NN-name-with-hyphens` | `01-learning-productivity` |
| Subcategory folder | `NN-name-with-hyphens` | `01-learning-foundations` |
| Book folder | `NNN-slug-author-name` | `001-how-to-read-a-book-mortimer-adler` |
| Book file | `NN-name.ext` | `01-index.mdx` |
| Category file | `NN-name.ext` | `01-index.mdx` |

## Slug Rules

- Lowercase only
- Hyphens between words
- No special characters (commas, colons, quotes, periods)
- Max 80 chars for folder names
- `&` → `and`
- Remove parentheses

## File Order per Book

```
01-index.mdx      # Overview + metadata (read first)
02-content.mdx    # Full summary (read second)
03-analysis.mdx   # Critical analysis (read third)
04-narration.mdx  # TTS narration (listen)
05-meta.json      # Structured metadata (machine)
```

## Category/Subcategory Files

```
01-index.mdx       # Overview, scope, description
02-reading-order.mdx # Recommended reading sequence
03-book-list.mdx    # Complete list with numbers
04-meta.json        # Category metadata
```

## Book Numbering

Books are numbered sequentially within each subcategory.
Numbers start at 001 and increment by 1.
The counterpoint book is placed last in its subcategory.
