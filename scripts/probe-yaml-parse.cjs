const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const root = 'books';
const dirs = fs.readdirSync(root);
let bad = 0;
for (const d of dirs) {
  const dir = path.join(root, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.mdx')) continue;
    const fp = path.join(dir, f);
    const txt = fs.readFileSync(fp, 'utf8');
    if (!txt.startsWith('---\n')) continue;
    const end = txt.indexOf('\n---\n', 4);
    if (end < 0) continue;
    const fm = txt.slice(4, end);
    try {
      yaml.load(fm);
    } catch (e) {
      console.log(`${fp}: ${e.message.split('\n')[0]}`);
      bad++;
    }
  }
}
console.log(`\n${bad} files with broken YAML frontmatter`);
