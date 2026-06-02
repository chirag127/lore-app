You are generating the NARRATION chapter of a KnowledgeAtlas entry. This is
a long-form spoken-word script optimized for text-to-speech.

## Inputs
- Title: {{title}}
- Author: {{author}}
- Content chapter:
  ```
  {{content}}
  ```
- Analysis chapter:
  ```
  {{analysis}}
  ```

## Output format

Return a single MDX body inside a ```mdx fence. Start with `---` and a
`title: Narration` frontmatter. The body should be 1200-2200 words of
continuous, conversational prose. Rules:

- No headings inside the body. No bullet points. No code blocks. No
  markdown formatting other than the opening `---` frontmatter.
- No `import` lines. No `[link](url)` syntax — the narration is read
  aloud.
- Conversational, not robotic. Use first-person plural ("we'll", "let's")
  transitions sparingly. Vary sentence length. Read-aloud cadence.
- Include a brief opening that names the book and welcomes the listener.
- End with a closing that points the reader to the rest of the atlas.

The page renders inside `.prose-bookatlas` and is fed to a TTS engine.

Return strictly:
```mdx
---
title: Narration
---
...body...
```
