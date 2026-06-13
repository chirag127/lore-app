# Quality Checklist

## Validation Rules

### Before Accepting Any Book
- [ ] All 5 files exist (01-index.mdx → 05-meta.json)
- [ ] meta.json has valid category and subcategory
- [ ] meta.json has verified ISBN and page count
- [ ] meta.json year matches web-verified publication year
- [ ] 01-index.mdx has all required frontmatter fields
- [ ] 02-content.mdx has chapter-by-chapter summary
- [ ] 02-content.mdx ends with Reading Guide section
- [ ] 03-analysis.mdx has minimum 3 named critics
- [ ] 03-analysis.mdx has both strengths and weaknesses
- [ ] 04-narration.mdx is pure prose, no headings
- [ ] No fabricated data anywhere

### Numbering
- [ ] Category folder starts with NN-
- [ ] Subcategory folder starts with NN-
- [ ] Book folder starts with NNN-
- [ ] Each file inside starts with NN-
- [ ] Numbers are consistent with curriculum

### Content
- [ ] No duplicate books across categories
- [ ] No book assigned to wrong category
- [ ] At least 1 counterpoint per argumentative subcategory
- [ ] Mermaid diagrams valid syntax (test with pnpm typecheck)
- [ ] MDX syntax valid (test with pnpm typecheck)
