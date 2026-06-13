# Roadmap

## Phase 0: Taxonomy Restructuring (Current)
- [x] Define 11 categories
- [x] Define all subcategories
- [x] Map old 32 categories to new 11
- [ ] Execute directory migration
- [ ] Update all meta.json files
- [ ] Generate category index files

## Phase 1: Fill Missing Books
Priority order (by category, in learning sequence):

| Phase | Category | Books Needed | Priority |
|---|---|---|---|
| 1a | 01 Learning & Productivity | 30 | High |
| 1b | 02 Psychology & Human Behavior | 40 | High |
| 1c | 03 Decision Making & Systems | 35 | High |
| 1d | 04 Philosophy & Religion | 35 | High |
| 1e | 05 Health, Medicine & Life Sci | 25 | High |
| 2a | 06 Finance & Investing | 45 | Medium |
| 2b | 07 Business & Entrepreneurship | 55 | Medium |
| 2c | 08 Communication & Writing | 30 | Medium |
| 3a | 09 History, Society & Politics | 60 | Low |
| 3b | 10 Math, Science & Technology | 80 | Low |
| 3c | 11 Arts, Media & Fiction | 55 | Low |

## Phase 2: Validation
- Run pnpm typecheck on all files
- Verify every subcategory has ≥2 books
- Verify counterpoint coverage
- Check for duplicates

## Phase 3: Content Enhancement
- Add Mermaid diagrams to 02-content.mdx
- Enhance 04-narration.mdx for TTS quality
- Cross-link related books across categories
