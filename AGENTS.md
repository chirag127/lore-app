# BookAtlas Agents

## Master Agent

**Responsibilities:**
- Orchestrate the entire BookAtlas system
- Coordinate between category and book agents
- Ensure quality standards are met
- Manage the knowledge base lifecycle

**Inputs:**
- User requests
- Book generation tasks
- Category creation requests

**Outputs:**
- Completed books
- Updated category pages
- System reports

**Rules:**
- Never skip validation
- Always verify research sources
- Maintain separation of concerns

---

## Category Agent

**Responsibilities:**
- Create and maintain category index.mdx files
- Define category boundaries
- Cross-link related categories
- Update category documentation

**Inputs:**
- Category name and description
- Related categories list
- Essential books list

**Outputs:**
- index.mdx for each leaf category
- Updated cross-references

**Rules:**
- Use the category template
- Follow the 10-category structure
- Never create nested categories

---

## Book Agent

**Responsibilities:**
- Research and validate book metadata
- Generate all 5 required files per book
- Ensure quality standards
- Validate final output

**Inputs:**
- Book title and author
- Research sources
- Category and subcategory

**Outputs:**
- index.mdx (overview)
- 01-content.mdx (summary)
- 02-analysis.mdx (analysis)
- 03-narration.mdx (audio)
- meta.json (metadata)

**Rules:**
- Use the book templates
- Never fabricate metadata
- Always verify ISBN and page count
- Run validation after creation

---

## Research Agent

**Responsibilities:**
- Find book information on the web
- Verify metadata accuracy
- Gather critical reception
- Identify related books

**Inputs:**
- Book title and author
- Search queries

**Outputs:**
- Verified metadata
- Summary and TOC
- Criticisms and reviews
- Related books list

**Rules:**
- Only use official sources
- Never guess or assume
- Document all sources
- Cross-reference information

---

## Metadata Agent

**Responsibilities:**
- Structure metadata in JSON format
- Validate all fields
- Generate slug
- Ensure consistency

**Inputs:**
- Research data
- Category information

**Outputs:**
- meta.json file

**Rules:**
- Use exact field names
- Validate ISBN format
- Verify publication year
- Generate consistent slugs

---

## Content Agent

**Responsibilities:**
- Write comprehensive book summaries
- Create chapter-by-chapter breakdowns
- Develop actionable insights
- Add reading guides

**Inputs:**
- Research findings
- Book structure

**Outputs:**
- 01-content.mdx file

**Rules:**
- Cover all major chapters
- Include examples and case studies
- Provide reading recommendations
- Use proper MDX formatting

---

## Analysis Agent

**Responsibilities:**
- Write critical analysis
- Gather named criticisms
- Compare with similar works
- Assess long-term relevance

**Inputs:**
- Book content
- Review sources
- Related books

**Outputs:**
- 02-analysis.mdx file

**Rules:**
- Use real criticisms only
- Cite named reviewers
- Compare fairly
- Rate sufficiency 1-10

---

## Narration Agent

**Responsibilities:**
- Create audio-friendly version
- Optimize for text-to-speech
- Write natural flowing prose
- Remove markdown formatting

**Inputs:**
- Book insights
- Writing style

**Outputs:**
- 03-narration.mdx file

**Rules:**
- No headings in body
- No bullet lists
- No dialogue
- Sound like audiobook

---

## Validation Agent

**Responsibilities:**
- Check all file requirements
- Validate metadata
- Verify MDX syntax
- Ensure anti-duplication

**Inputs:**
- Book files
- Templates

**Outputs:**
- Validation report
- Error list

**Rules:**
- Run after every book
- Fix all errors
- Never skip validation

---

## Cross-link Agent

**Responsibilities:**
- Update related book links
- Maintain cross-references
- Sync category links

**Inputs:**
- Book slugs
- Category structure

**Outputs:**
- Updated links
- Cross-reference map

**Rules:**
- Keep links current
- Avoid broken links
- Use consistent format