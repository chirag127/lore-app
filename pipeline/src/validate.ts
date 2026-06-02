import { BookFrontmatterSchema, BookMetaSchema } from '@knowledgeatlas/schemas';

export function validateMeta(meta: unknown): void {
  BookMetaSchema.parse(meta);
}

export function validateFrontmatter(meta: unknown): void {
  BookFrontmatterSchema.parse(meta);
}

export function validateMdx(name: string, body: string): void {
  if (!body || body.length < 200) {
    throw new Error(`${name}: too short (${body?.length ?? 0} chars)`);
  }
  if (!/^---\s*\n/.test(body)) {
    throw new Error(`${name}: missing frontmatter opening`);
  }
  if (!/\n---\s*(\n|$)/.test(body)) {
    throw new Error(`${name}: missing frontmatter closing`);
  }
}
