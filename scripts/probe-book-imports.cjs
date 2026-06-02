const fs = require('fs');
const dirs = fs.readdirSync('books');
const all = new Set();
for (const d of dirs) {
  const dir = 'books/' + d;
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.mdx')) continue;
    const txt = fs.readFileSync(dir + '/' + f, 'utf8');
    const re = /from\s+['"](?:\.\.\/\.\.\/src\/components\/|@\/components\/)([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(txt)) !== null) all.add(m[1]);
  }
}
console.log([...all].sort().join('\n'));
