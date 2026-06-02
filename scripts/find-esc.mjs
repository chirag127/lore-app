import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const BOOKS = path.join('C:', 'AM', 'GitHub', 'BookAtlas', 'books');
for (const d of readdirSync(BOOKS)) {
  try {
    const l = path.join(BOOKS, d, 'index.mdx');
    const t = readFileSync(l, 'utf8');
    if (t.includes("\\'")) console.log(d + ': has backslash-escape');
  } catch (e) {
    // skip meta-only dirs
  }
}
for (const d of readdirSync(BOOKS)) {
  try {
    const l = path.join(BOOKS, d, '01-content.mdx');
    const t = readFileSync(l, 'utf8');
    if (t.includes("\\'")) console.log(d + '/01-content.mdx: has backslash-escape');
  } catch (e) {
    // skip
  }
}
