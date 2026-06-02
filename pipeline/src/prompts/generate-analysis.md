You are generating the ANALYSIS chapter of a KnowledgeAtlas entry — a
critical, intellectually honest review.

## Inputs
- Title: {{title}}
- Author: {{author}}
- Research dossier:
  ```
  {{research}}
  ```
- Content chapter:
  ```
  {{content}}
  ```

## Output format

Return a single MDX body inside a ```mdx fence. Start with `---` and a
`title: Analysis` frontmatter. Aim for 1000-2000 words. Use H2 sections:

- Strengths
- Weaknesses
- Counterarguments
- Scientific evidence (cite real studies or meta-analyses; be honest)
- Community reception
- A short "verdict" coda (3-5 sentences)

Style: critic, not fan. Praise what's genuinely good. Name the
failure modes. Avoid both hero worship and contrarian sneer.

Return strictly:
```mdx
---
title: Analysis
---
...body...
```
