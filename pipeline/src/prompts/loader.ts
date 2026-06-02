import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const promptsDir = resolve(here, '..', 'prompts');

export function loadPrompt(name: string): string {
  const p = resolve(promptsDir, `${name}.md`);
  if (!existsSync(p)) throw new Error(`Prompt not found: ${p}`);
  return readFileSync(p, 'utf8');
}

export function renderTemplate(
  tpl: string,
  vars: Record<string, string | number | undefined>,
): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{{${k}}}`,
  );
}

export { writeFileSync };
