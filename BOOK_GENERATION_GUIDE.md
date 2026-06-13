# Book Generation Guide

## Process for Adding a New Book

### 1. Research Phase
- Verify book exists and get metadata (Wikipedia, Open Library, Google Books)
- Get table of contents and chapter summaries
- Find 3+ named critical reviews
- Identify 2-3 similar/similarly-themed books

### 2. Metadata Creation
Create `meta.json`:
```json
{
  "slug": "book-title-author-last-name",
  "title": "Book Title",
  "authors": ["Author Name"],
  "year": 2020,
  "category": "Category Name",
  "subcategory": "Subcategory Name",
  "pages": 300,
  "isbn": "978-XXXXXXXXXXXXX",
  "language": "en",
  "difficulty": "intermediate"
}
```

### 3. File Generation
Create 5 files using templates:
- `index.mdx` - Overview
- `01-content.mdx` - Summary
- `02-analysis.mdx` - Analysis
- `03-narration.mdx` - Audio version
- `meta.json` - Metadata

### 4. Validation
Run validation:
```bash
python scripts/02_validate_structure.py
```

### 5. Cross-Linking
Update related books in:
- Book's index.mdx
- Related books' index.mdx files

## Research Sources

1. **Metadata**: Wikipedia, Open Library, Google Books
2. **Summaries**: Publisher website, Goodreads, Amazon
3. **Reviews**: Literary journals, academic reviews, named blogger reviews
4. **Author background**: Official website, interviews, other works

## Quality Checklist

- [ ] ISBN verified from at least 2 sources
- [ ] Page count matches publisher
- [ ] Publication year confirmed
- [ ] 3+ named critics cited in analysis
- [ ] Similar books identified
- [ ] All files use consistent terminology
- [ ] No content duplication across files