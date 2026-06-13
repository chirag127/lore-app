# Validation Rules

## Duplicate Detection
- Check book titles across all subcategories
- If title similarity > 0.8, flag as potential duplicate
- Keep the more complete version
- Merge content if duplicates found

## Category Assignment
- Every book must belong to exactly 1 subcategory
- Category must exist in the 11-category taxonomy
- Subcategory must exist within its parent category

## Completeness Requirements
- Every category: ≥1 subcategory with ≥2 books
- Every subcategory: ≥2 books (goal: 10)
- Every argumentative subcategory: ≥1 counterpoint book
- Every book: all 5 files present

## MDX Validation
- Valid YAML frontmatter (--- delimited)
- Valid MDX syntax (no unclosed tags)
- Valid Mermaid syntax (if diagrams present)
- No broken internal links

## File Size Limits
- 01-index.mdx: 200-500 words
- 02-content.mdx: 2000-4000 words
- 03-analysis.mdx: 1500-3000 words
- 04-narration.mdx: 500-1000 words
- 05-meta.json: ~200 lines max

## Automation
Run after every batch:
```
pnpm typecheck
python scripts/inventory.py
```
