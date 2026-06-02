You are generating the CONTENT chapter of a KnowledgeAtlas entry.

## Inputs
- Title: {{title}}
- Author: {{author}}
- Research dossier:
  ```
  {{research}}
  ```
- Overview:
  ```
  {{overview}}
  ```

## Output format

Return a single MDX body inside a ```mdx fence. Start with `---` and a
`title: Content` frontmatter. Aim for 1500-3000 words. Cover:

- Core concepts, defined clearly.
- Frameworks and mental models (use a `##` heading per framework).
- Key lessons, each as a sub-section with a concrete example.
- Applications and actionable insights.
- A short, evidence-anchored coda.

Style: long-form editorial. Use H2 for sections, H3 for sub-concepts.
Pull-quote where it helps. No code blocks unless essential. No
`import` statements.

The page renders inside `.prose-bookatlas`; all standard MDX is fine.

Return strictly:
```mdx
---
title: Content
---
...body...
```
