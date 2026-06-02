const fs = require('fs');
const path = require('path');
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
    const lines = fm.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      const m = ln.match(/^(\s*)([A-Za-z_][A-Za-z0-9_-]*):\s*(.+)$/);
      if (!m) continue;
      const val = m[3];
      if (val.startsWith('"') || val.startsWith("'") || val.startsWith('|') || val.startsWith('>')) continue;
      if (/[:#]/.test(val) || /^[{[\d]/.test(val.trim())) {
        console.log(`${fp}:${i + 2} unquoted value: ${ln.trim()}`);
        bad++;
      }
    }
  }
}
console.log(`\n${bad} bad lines`);
