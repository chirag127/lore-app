const fs = require('node:fs');
const path = require('node:path');

function fixFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  let out = '';
  let i = 0;
  let inStr = false;
  let esc = false;
  while (i < raw.length) {
    const c = raw[i];
    if (inStr) {
      if (esc) {
        out += c;
        esc = false;
        i++;
        continue;
      }
      if (c === '\\') {
        out += c;
        esc = true;
        i++;
        continue;
      }
      if (c === '"') {
        out += c;
        inStr = false;
        i++;
        continue;
      }
      if (c === '\n') {
        out += '\\n';
        i++;
        continue;
      }
      if (c === '\r') {
        i++;
        continue;
      }
      if (c === '\t') {
        out += '\\t';
        i++;
        continue;
      }
      out += c;
      i++;
      continue;
    }
    if (c === '"') {
      out += c;
      inStr = true;
      i++;
      continue;
    }
    out += c;
    i++;
  }
  if (out !== raw) {
    fs.writeFileSync(file, out);
    try {
      const j = JSON.parse(out);
      return { ok: true, title: j.title ?? '(no title)', before: raw.length, after: out.length };
    } catch (e) {
      return { ok: false, err: String(e) };
    }
  }
  return { ok: true, unchanged: true };
}

const booksDir = path.join(__dirname, '..', 'books');
const results = [];
for (const dir of fs.readdirSync(booksDir)) {
  const meta = path.join(booksDir, dir, 'meta.json');
  if (!fs.existsSync(meta)) continue;
  results.push({ file: path.relative(process.cwd(), meta), ...fixFile(meta) });
}
for (const r of results) {
  if (r.unchanged) {
    console.log('  ok  ', r.file);
  } else if (r.ok) {
    console.log(`  fix  ${r.file}  (${r.before} -> ${r.after})  ${r.title}`);
  } else {
    console.log(`  FAIL ${r.file}  ${r.err}`);
    process.exitCode = 1;
  }
}
