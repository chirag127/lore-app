# Book Generation Specification

## 5 Files per Book

### 01-index.mdx — Overview
- Title, author, year, publisher
- Difficulty rating (beginner/intermediate/advanced)
- Reading time estimate
- Executive summary (2-3 paragraphs)
- Key takeaways (4-6 bullet points)
- Who should read / who should skip
- Related books (3-5 slugs)
- Final verdict

### 02-content.mdx — Full Summary
- Core concepts and frameworks
- Chapter-by-chapter breakdown
- Mermaid diagrams for conceptual models
- Tables for comparisons
- Examples and applications
- Actionable advice
- ~2000-4000 words

### 03-analysis.mdx — Critical Analysis
- Strengths (3-5 specific)
- Weaknesses (3-5 specific, with named critics)
- Counterarguments and alternative views
- Scientific/empirical support
- Historical context
- Long-term relevance
- Final assessment with score (1-10)

### 04-narration.mdx — TTS Narration
- Pure prose, no headings
- No dialogue, no podcast format
- No speaker labels
- Minimal bullet points
- Natural audiobook-style summary
- ~500-1000 words

### 05-meta.json — Metadata
```json
{
  "slug": "book-slug-author-name",
  "title": "Full Book Title",
  "authors": ["Author Name"],
  "year": YYYY,
  "category": "NN-category-slug",
  "subcategory": "NN-subcategory-slug",
  "pages": NNN,
  "isbn": "978XXXXXXXXXXXXX",
  "language": "en",
  "genres": ["Primary", "Secondary"],
  "difficulty": "beginner|intermediate|advanced",
  "source": "generated"
}
```

## Research Requirements
- Verify ISBN, pages, year via web search
- Minimum 3 named critics with specific arguments
- Real chapter breakdown from table of contents
- Author background and credentials
- No fabricated data
