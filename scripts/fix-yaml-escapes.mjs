import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const BOOKS = path.join('C:', 'AM', 'GitHub', 'BookAtlas', 'books')
const YAML_STRING_RE = /("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')/g

function fixYamlStrings(text) {
  return text.replace(YAML_STRING_RE, (m) => {
    return m.replace(/\\'/g, "'").replace(/\\"/g, "'") 
  })
}

let changed = 0
for (const d of readdirSync(BOOKS)) {
  const dir = path.join(BOOKS, d)
  try {
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.mdx')) continue
      const fp = path.join(dir, f)
      const orig = readFileSync(fp, 'utf8')
      const fixed = fixYamlStrings(orig)
      if (fixed !== orig) {
        writeFileSync(fp, fixed, 'utf8')
        console.log('[fix-yaml] ' + d + '/' + f)
        changed++
      }
    }
  } catch (e) {}
}
console.log('[fix-yaml] done; ' + changed + ' file(s) updated')
