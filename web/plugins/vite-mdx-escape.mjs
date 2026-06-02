const HTML_ELEMENTS = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body',
  'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del',
  'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
  'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input',
  'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'math', 'menu', 'menuitem', 'meta',
  'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre',
  'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'slot', 'small',
  'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',
  'speak', 'break', 'say-as', 'phoneme', 'voice', 'prosody', 'emphasis', 'audio', 'desc', 'tts', 'voice',
  'heading', 'sub', 'lang', 'lookup', 'mark', 'metadata', 'paragraph', 'sentence', 'say-as',
]);

const looksLikeMdxComponent = (name) => /^[A-Z]/.test(name);

function escapeAngleBrackets(value) {
  let out = value;
  out = rewriteHtmlComments(out);
  out = rewriteSpeakBlocks(out);
  out = rewriteDetailsBlocks(out);
  out = out.replace(/<\s*\d/g, '&lt; ');
  out = out.replace(/<\s*(\d[\d.,]*\s*%)/g, '&lt;$1');
  out = out.replace(/<\s*(\d+\s*hours?)\b/gi, '&lt;$1');
  out = out.replace(/<\s*(\d+\s*minutes?)\b/gi, '&lt;$1');
  out = out.replace(/<\s*(\d+\s*seconds?)\b/gi, '&lt;$1');
  out = out.replace(/<\s*(\d+\s*days?)\b/gi, '&lt;$1');
  out = out.replace(/<\s*(\d+\s*weeks?)\b/gi, '&lt;$1');
  out = out.replace(/<\s*(\/\s*[a-z][a-z0-9-]*\s*)>/g, '&lt;$1&gt;');
  out = out.replace(/<\s*([a-z][a-z0-9-]*)((?:\s+[^<>]*?)?)(\/?)>/g, (match, tag, rest, slash) => {
    if (HTML_ELEMENTS.has(tag.toLowerCase())) return match;
    if (looksLikeMdxComponent(tag)) return match;
    return `&lt;${tag}${rest}${slash}&gt;`;
  });
  out = out.replace(/^(\s*)\?<\s*[a-z][a-z0-9-]*\s*>/gim, (_, leading) => leading);
  return out;
}

function rewriteSpeakBlocks(src) {
  return src.replace(/<speak>([\s\S]*?)<\/speak>/g, (_, body) => {
    const text = body
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return `<SsmlScript text=${JSON.stringify(text)} />`;
  });
}

function rewriteHtmlComments(src) {
  return src.replace(/<!--([\s\S]*?)-->/g, (_, body) => {
    const safe = body.replace(/\*\//g, '* /');
    const lines = safe.split('\n').map((l) => l.replace(/\s--\s/g, ' ‐‐ '));
    return `{/*${lines.join('\n')}*/}`;
  });
}

function rewriteDetailsBlocks(src) {
  const lines = src.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^(\s*)<details>\s*$/);
    if (!m) {
      out.push(line);
      i++;
      continue;
    }
    const indent = m[1];
    const block = [];
    let j = i + 1;
    let depth = 1;
    while (j < lines.length && depth > 0) {
      const l = lines[j];
      if (/^\s*<details>\s*$/.test(l)) depth++;
      else if (/^\s*<\/details>\s*$/.test(l)) {
        depth--;
        if (depth === 0) break;
      }
      block.push(l);
      j++;
    }
    if (depth !== 0) {
      out.push(line);
      i++;
      continue;
    }
    const closeIdx = j;
    const inner = block.join('\n');
    const sm = inner.match(/^\s*<summary>([\s\S]*?)<\/summary>\s*(?:\n|$)/);
    if (!sm) {
      out.push(line);
      i++;
      continue;
    }
    const summary = sm[1].trim();
    const body = inner.slice(sm[0].length).replace(new RegExp(`^${indent}`, 'gm'), '').trim();
    out.push(`${indent}> **${summary}**`);
    if (body) {
      const quoted = body.split('\n').map((l) => l.length ? `> ${l}` : '>').join('\n');
      out.push(quoted);
    }
    out.push('');
    i = closeIdx + 1;
  }
  return out.join('\n');
}

function preserveFrontmatter(src) {
  if (!src.startsWith('---')) return { fm: '', body: src };
  const eol = src.indexOf('\n', 3);
  if (eol < 0) return { fm: '', body: src };
  if (src.slice(3, eol).trim() !== '') return { fm: '', body: src };
  const close = src.indexOf('\n---', eol);
  if (close < 0) return { fm: '', body: src };
  const closeEnd = src.indexOf('\n', close + 4);
  if (closeEnd < 0) return { fm: '', body: src };
  return { fm: src.slice(0, closeEnd + 1), body: src.slice(closeEnd + 1) };
}

export default function viteMdxEscape() {
  const plugin = {
    name: 'knowledgeatlas:mdx-escape',
    transform(code, id) {
      if (!/\.mdx?$/.test(id)) return null;
      const { fm, body } = preserveFrontmatter(code);
      const escaped = escapeAngleBrackets(body);
      if (escaped === body) return null;
      if (process.env.BOOKATLAS_MDX_DEBUG) {
        console.log('[mdx-escape] rewrote', id);
      }
      return { code: fm + escaped, map: null };
    },
  };
  Object.defineProperty(plugin, 'enforce', { value: 'pre' });
  return plugin;
}
