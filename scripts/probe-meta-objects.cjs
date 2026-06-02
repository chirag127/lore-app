const fs = require('fs');
const path = require('path');
const dirs = [
  'antifragile-nassim-taleb',
  'fooled-by-randomness-nassim-taleb',
  'good-strategy-bad-strategy-richard-rumelt',
  'high-output-management-andy-grove',
  'meditations-marcus-aurelius',
  'sapiens-yuval-noah-harari',
  'skin-in-the-game-nassim-taleb',
  'the-black-swan-nassim-taleb',
  'the-lessons-of-history-will-durant',
  'the-pragmatic-programmer-andrew-hunt',
];
for (const d of dirs) {
  const j = JSON.parse(fs.readFileSync(path.join('books', d, 'meta.json'), 'utf8'));
  const odd = [];
  for (const [k, v] of Object.entries(j)) {
    if (v == null) continue;
    if (typeof v === 'object' && !Array.isArray(v)) {
      odd.push(`${k}=${JSON.stringify(v).slice(0, 100)}`);
    }
  }
  if (odd.length) console.log(d, odd.join('; '));
}
