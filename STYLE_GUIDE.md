# BookAtlas Style Guide

## Writing Style

- **Voice**: Clear, authoritative, accessible
- **Tone**: Educational, not academic
- **Sentence length**: 15-20 words average
- **Paragraphs**: 3-5 sentences

## File Structure

### index.mdx
- Frontmatter with metadata
- Executive summary (2-3 sentences)
- Key takeaways (4 items)
- Who should read
- Who should skip
- Difficulty rating
- Reading/listening time estimates
- Related books links
- Final verdict

### 01-content.mdx
- Core concepts and frameworks
- Chapter-by-chapter breakdown
- Real-world examples
- Practical applications
- Actionable lessons
- Reading guide with time estimates

### 02-analysis.mdx
- Strengths (specific, cited)
- Weaknesses (balanced)
- Named criticisms from real reviewers
- Counterarguments
- Scientific evidence
- Historical context
- Comparison with similar works
- Long-term relevance assessment
- Final assessment (1-10 scale)

### 03-narration.mdx
- Writing style description
- Narrative structure analysis
- Rhetorical techniques
- Readability assessment
- Comparative context

### meta.json
- slug (lowercase, hyphenated)
- title, subtitle
- authors (array)
- year (integer)
- category, subcategory
- pages (integer)
- isbn (string)
- language (default: "en")
- genres, subjects, themes (arrays)
- tags (array)
- difficulty (beginner/intermediate/advanced/mastery)
- estimatedReadingHours, estimatedListeningMinutes

## Naming Conventions

- Directory names: lowercase, hyphenated
- Slugs: lowercase, hyphenated, author-last-name
- Files: lowercase, with hyphens if needed

## Markdown Features

- Use emojis for visual hierarchy
- Tables for comparisons
- Admonitions for emphasis
- Code blocks for technical content
- Mermaid diagrams for systems

## Quality Checklist

- [ ] No duplicate content across files
- [ ] Metadata matches book content
- [ ] ISBN verified from official source
- [ ] All criticisms are from named sources
- [ ] Reading guide included in content file
- [ ] Narration file has no headings in body