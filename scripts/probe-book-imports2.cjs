const fs = require('fs');
const re = /from\s+['"](?:\.\.\/\.\.\/src\/components\/|@\/components\/)([^'"]+)['"]/g;
for (const d of fs.readdirSync('books')) {
  const dir = 'books/' + d;
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.mdx')) continue;
    const txt = fs.readFileSync(dir + '/' + f, 'utf8');
    const matches = [];
    let m;
    while ((m = re.exec(txt)) !== null) matches.push(m[1]);
    if (matches.length) console.log(d + '/' + f + ': ' + matches.join(', '));
  }
}
