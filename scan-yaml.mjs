import fs from 'fs';
import path from 'path';

const BOOKS_DIR = 'C:\\AM\\GitHub\\BookAtlas\\books';

const issues = [];

function addIssue(file, lines, desc, fix) {
  issues.push({ file, lines: Array.isArray(lines) ? lines : [lines], description: desc, fix });
}

// Find all .mdx and meta.json files
function findFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findFiles(full));
    } else if (entry.name.endsWith('.mdx') || entry.name === 'meta.json') {
      results.push(full);
    }
  }
  return results;
}

const files = findFiles(BOOKS_DIR);
console.log(`Found ${files.length} files to check\n`);

for (const file of files) {
  const rel = path.relative(BOOKS_DIR, file);
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split('\n');

    if (file.endsWith('.mdx')) {
      // Extract frontmatter: between first two ---
      const fmStart = lines.findIndex(l => l.trim() === '---');
      if (fmStart === -1) {
        addIssue(rel, 1, 'Missing frontmatter opening (---)', 'Add --- at top of file');
        continue;
      }
      const fmEnd = lines.findIndex((l, i) => i > fmStart && l.trim() === '---');
      if (fmEnd === -1) {
        addIssue(rel, fmStart + 1, 'Missing frontmatter closing (---)', 'Add closing --- after frontmatter');
        continue;
      }

      const fmLines = lines.slice(fmStart + 1, fmEnd);

      for (let i = 0; i < fmLines.length; i++) {
        const lineNum = fmStart + 1 + i;
        const line = fmLines[i];

        // Check for tab characters
        if (line.includes('\t')) {
          addIssue(rel, lineNum, `Tab character in YAML frontmatter`, 'Replace tab with spaces');
        }

        // Check for backslash-escaped single quotes inside single-quoted strings
        // Pattern: starts with spaces + ' then contains \'
        const singleQuoteMatch = line.match(/^(\s*)'(.+)'/s);
        if (singleQuoteMatch && singleQuoteMatch[2].includes("\\'")) {
          addIssue(rel, lineNum, 'Backslash-escaped single quote inside single-quoted string', 'Remove backslash from escaping');
        }

        // Check for backslash-escaped double quotes inside double-quoted strings
        const doubleQuoteMatch = line.match(/^(\s*)"(.+)"/s);
        if (doubleQuoteMatch && doubleQuoteMatch[2].includes('\\"')) {
          addIssue(rel, lineNum, `Backslash-escaped double quote (\\") inside double-quoted string`, 'Remove backslash from \\" or use single quotes instead');
        }

        // Check for unquoted colons in values (e.g. `key: Some: text` where value is unquoted)
        // Find the first colon after the key, then check if remaining contains unquoted colons
        const firstColon = line.indexOf(':');
        if (firstColon !== -1) {
          const afterColon = line.slice(firstColon + 1).trim();
          if (afterColon && !afterColon.startsWith('|') && !afterColon.startsWith('>') && !afterColon.startsWith("'") && !afterColon.startsWith('"') && !afterColon.startsWith('- ') && !afterColon.startsWith('[') && !afterColon.startsWith('#')) {
            // Count colons in the value - if more than one, might be unquoted colon issue
            const colonCount = (afterColon.match(/:/g) || []).length;
            // Also check if it looks like a time/ratio (more careful)
            const valuePart = afterColon;
            const hasUnquotedColon = /[^\\]:/.test(valuePart) && !valuePart.startsWith('http') && colonCount > 0;
            // More specific: check for patterns like "Part I: Something" or "Monday: Something"
            const problemPattern = /:[A-Z]/.test(valuePart) || /:\s/.test(valuePart);
            if (hasUnquotedColon && problemPattern && !valuePart.startsWith('http')) {
              // Don't flag if it's clearly boolean/null or number
              if (!/^(true|false|null|yes|no|on|off|\d+\.?\d*|-\d+\.?\d*|\[.+\]|\{.+\})$/.test(valuePart.replace(/:\s.*/, ''))) {
                addIssue(rel, lineNum, `Unquoted colon in value: "${afterColon.slice(0, 60)}"`, 'Wrap value in double quotes');
              }
            }
          }
        }

        // Check for literal newlines inside unquoted values
        // This happens when a value spans multiple lines without proper YAML syntax
        if (i < fmLines.length - 1) {
          const trimmed = line.trim();
          if (trimmed.length > 0 && !line.startsWith(' ') && !line.startsWith('\t') && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('|') && !trimmed.startsWith('>') && !trimmed.startsWith(':') && !trimmed.startsWith('[') && !trimmed.startsWith('{') && !trimmed.startsWith("'") && !trimmed.startsWith('"')) {
            const nextTrimmed = fmLines[i + 1].trim();
            if (nextTrimmed.length > 0 && !fmLines[i + 1].startsWith('  ') && !fmLines[i + 1].startsWith('  -') && nextTrimmed !== '---') {
              // Could be a wrapped unquoted value
              if (fmLines[i + 1].length > 0 && !fmLines[i + 1].startsWith('  ') && !/[:\-\[\{\|]/.test(nextTrimmed[0]) && !nextTrimmed.startsWith('#')) {
                // This might be a wrapped value - check for indentation issues
                const currentSpaces = line.search(/\S/);
                const nextSpaces = fmLines[i + 1].search(/\S/);
                if (currentSpaces >= 0 && nextSpaces >= 0 && nextSpaces <= currentSpaces && fmLines[i + 1].trim().length > 0) {
                  addIssue(rel, lineNum, `Possible literal newline/unquoted multiline value at line ${lineNum + 1}`, 'Use pipe (|) or angle bracket (>) for multiline, or \\n for newlines');
                }
              }
            }
          }
        }
      }

      // Check for empty/null values that should have content
      for (let i = 0; i < fmLines.length; i++) {
        const lineNum = fmStart + 1 + i;
        const line = fmLines[i];
        const trimmed = line.trim();
        // key with empty value followed by another key at same or lower indent
        if (/^\w[\w\s-]*:\s*$/.test(trimmed) && i + 1 < fmLines.length) {
          const nextLine = fmLines[i + 1];
          const nextTrimmed = nextLine.trim();
          const currentIndent = line.search(/\S/);
          const nextIndent = nextLine.search(/\S/);
          // If next line is another key at same or lower indent, this is an empty value
          if (nextIndent !== -1 && (nextIndent <= currentIndent || /^\w[\w\s-]*:/.test(nextTrimmed))) {
            // Check if it's actually supposed to be empty
            const key = trimmed.replace(/:$/, '').trim().toLowerCase();
            const nullableKeys = ['hero', 'summary', 'subtitle', 'author', 'title', 'slug', 'cover', 'readingTime', 'tags'];
            if (!nullableKeys.includes(key) && key !== 'description') {
              addIssue(rel, lineNum, `Empty value for key "${trimmed.replace(/:$/, '')}"`, 'Provide a value or remove the key');
            }
          }
        }
      }

      // Check indentation consistency - all keys should be at the same level (no unexpected indents)
      const keyLines = fmLines.filter(l => /^\s*\w[\w\s-]*:/.test(l.trim()));
      if (keyLines.length > 0) {
        const indents = keyLines.map(l => l.search(/\S/)).filter(i => i >= 0);
        if (indents.length > 1) {
          const minIndent = Math.min(...indents);
          for (const kl of keyLines) {
            const indent = kl.search(/\S/);
            if (indent !== minIndent && indent !== minIndent + 2) {
              // Allow 2-space increments
            }
          }
          // Check for inconsistent key indentation (should all be at base level for top-level frontmatter)
          const baseIndents = indents.filter(i => i === indents[0]);
          if (baseIndents.length !== indents.length) {
            for (let i = 0; i < keyLines.length; i++) {
              const indent = keyLines[i].search(/\S/);
              const lineNum = fmStart + 1 + fmLines.indexOf(keyLines[i]);
              if (indent !== indents[0] && indent !== indents[0] + 2) {
                addIssue(rel, lineNum, `Inconsistent key indentation (${indent} spaces, expected ${indents[0]} or ${indents[0] + 2})`, 'Fix indentation to match other keys');
              }
            }
          }
        }
      }

      // Check for unquoted URL values (strings that look like URLs)
      for (let i = 0; i < fmLines.length; i++) {
        const lineNum = fmStart + 1 + i;
        const line = fmLines[i];
        const firstColon = line.indexOf(':');
        if (firstColon !== -1) {
          const afterColon = line.slice(firstColon + 1).trim();
          // Unquoted http URL - actually URLs can be unquoted in YAML, so skip this check
        }
      }

    } else if (file.endsWith('meta.json')) {
      // Check for literal newlines in string values
      try {
        const parsed = JSON.parse(raw);
        function checkObj(obj, path) {
          for (const [key, val] of Object.entries(obj)) {
            const fullPath = path ? `${path}.${key}` : key;
            if (typeof val === 'string' && (val.includes('\n') || val.includes('\r') || val.includes('\t'))) {
              const lineNum = raw.indexOf(val) + 1;
              addIssue(rel, lineNum || '?', `JSON string value at "${fullPath}" contains literal newline/control character`, 'Use \\n escape or JSON.stringify properly');
            }
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
              checkObj(val, fullPath);
            } else if (Array.isArray(val)) {
              for (let j = 0; j < val.length; j++) {
                if (typeof val[j] === 'object' && val[j] !== null) {
                  checkObj(val[j], `${fullPath}[${j}]`);
                }
              }
            }
          }
        }
        checkObj(parsed, '');
      } catch (e) {
        addIssue(rel, 1, `JSON parse error: ${e.message}`, 'Fix JSON syntax');
      }
    }
  } catch (e) {
    addIssue(rel, '?', `File read error: ${e.message}`, 'Check file encoding');
  }
}

// Print results
if (issues.length === 0) {
  console.log('No issues found!');
} else {
  console.log(`\n=== FOUND ${issues.length} POTENTIAL ISSUES ===\n`);
  const byFile = {};
  for (const iss of issues) {
    const key = iss.file;
    if (!byFile[key]) byFile[key] = [];
    byFile[key].push(iss);
  }
  for (const [file, fileIssues] of Object.entries(byFile)) {
    console.log(`\n--- ${file} (${fileIssues.length} issue(s)) ---`);
    for (const iss of fileIssues) {
      console.log(`  Line(s): ${iss.lines.join(', ')}`);
      console.log(`  Problem: ${iss.description}`);
      console.log(`  Fix: ${iss.fix}`);
    }
  }
}
