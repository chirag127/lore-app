#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOKS = path.resolve(__dirname, '..', 'books');
const STUB_COMPONENTS = new Set([
'BookHeader', 'WhoShouldRead', 'RelatedBooks', 'KeyTakeaways',
'BookLayout', 'NarrationPlayer', 'BookHero', 'TableOfContents',
'Diagram', 'BookReview', 'BookMeta', 'ChapterDiagram',
'KeyTakeaway', 'RelatedBook', 'Mermaid', 'ChapterProgress',
'TakeawayBox', 'VerdictBox', 'NarrationSection', 'ProsCons',
'Quote', 'BookCover', 'BookStats', 'ConceptMap',
]);

const DIAGRAM_RE = /<Diagram(\s[^>]*)?>([\s\S]*?)<\/Diagram>/g;
const DIAGRAM_KEYS_RE = /\b(flowchart|graph|stateDiagram|sequenceDiagram|classDiagram|erDiagram|journey|gantt|mindmap|timeline|pie|quadrantChart|gitGraph|xychart-beta|block-beta|sankey-beta|zenuml-beta|requirementDiagram|C4Context|kanban|architecture-beta|radar-beta|packet-beta)\b/i;
const RELATIVE_RE = /^import\s+(?:\{\s*([A-Za-z_$][\w$]*)\s*(?:,\s*\{?\s*([A-Za-z_$][\w$]*)\s*\}?)?\s*\})?\s*([A-Za-z_$][\w$]*)?\s*from\s+['"]\.\.\/\.\.\/src\/components\/(?:[A-Za-z]+\/)?[A-Za-z]+(?:\.astro)?['"];?\s*$/gm;
const ALIAS_RE = /^import\s+(?:\{\s*([A-Za-z_$][\w$]*(?:\s*,\s*[A-Za-z_$][\w$]*)*)\s*\})?\s*(?:([A-Za-z_$][\w$]*))?\s*from\s+['"]@\/components\/(?:[A-Za-z]+\/)?[A-Za-z]+(?:\.astro)?['"];?\s*$/gm;

function findBooks(root) {
  return fs.readdir(root, { withFileTypes: true })
    .then(entries => entries.filter(e => e.isDirectory()).map(e => e.name));
}

function findMdxFiles(bookDir) {
  return fs.readdir(bookDir, { withFileTypes: true })
    .then(entries => entries.filter(e => e.isFile() && e.name.endsWith('.mdx')).map(e => e.name));
}

function stripDiagramBlocks(src) {
  let out = src;
  let removed = [];
  out = out.replace(DIAGRAM_RE, (match, attrs, body) => {
    const typeMatch = attrs?.match(/type\s*=\s*["']([^"']+)["']/);
    const chartType = typeMatch ? typeMatch[1] : null;
    if (DIAGRAM_KEYS_RE.test(body) || DIAGRAM_KEYS_RE.test(attrs ?? '')) {
      removed.push(`Diagram:mermaid`);
    } else if (attrs && !body.trim()) {
      removed.push(`Diagram:empty`);
    } else {
      removed.push(`Diagram:content`);
    }
    return '';
  });
  return { out, removed };
}

function stripImportsAndWrappers(src) {
  let out = src;
  let removed = [];
  out = out.replace(RELATIVE_RE, (match, named1, named2, defaultName) => {
    const names = [defaultName, named1, named2].filter(Boolean);
    removed.push(...names);
    return '';
  });
  out = out.replace(ALIAS_RE, (match, namesGroup, defaultName) => {
    const names = [];
    if (namesGroup) {
      names.push(...namesGroup.split(',').map(s => s.trim()).filter(Boolean));
    }
    if (defaultName) names.push(defaultName);
    removed.push(...names);
    return '';
  });
  for (const comp of STUB_COMPONENTS) {
    const openingRe = new RegExp(`<${comp}(\\s[^>]*)?>`, 'g');
    const closingRe = new RegExp(`</${comp}>`, 'g');
    const selfClosingRe = new RegExp(`<${comp}(\\s[^>]*)?\\s*/>`, 'g');
    if (openingRe.test(out) || closingRe.test(out) || selfClosingRe.test(out)) {
      out = out.replace(selfClosingRe, '');
      out = out.replace(openingRe, '');
      out = out.replace(closingRe, '');
    }
  }
  out = out.replace(/^[ \t]*\n{2,}/gm, '\n');
  return { out, removed };
}

async function main() {
const books = await findBooks(BOOKS);
let filesChanged = 0;
for (const book of books) {
  const dir = path.join(BOOKS, book);
  const files = await findMdxFiles(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const orig = await fs.readFile(filePath, 'utf8');
    const { out: wo, removed: wr } = stripImportsAndWrappers(orig);
    const { out: dOut, removed: dr } = stripDiagramBlocks(orig);
    if (wr.length === 0 && dr.length === 0) continue;
    const out = wr.length > 0 ? wo : dOut;
    const combined = [...wr, ...dr];
    await fs.writeFile(filePath, out, 'utf8');
    filesChanged++;
    console.log(`[strip-stubs] ${book}/${file} removed: ${[...new Set(combined)].join(', ')}`);
    }
  }
  console.log(`[strip-stubs] done; ${filesChanged} file(s) updated`);
}

main().catch(err => { console.error(err); process.exit(1); });
