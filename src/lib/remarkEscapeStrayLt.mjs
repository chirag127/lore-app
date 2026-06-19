/**
 * remarkEscapeStrayLt — escape `<` characters that look like comparisons
 * rather than JSX/HTML tag opens. MDX is strict: `<50` is treated as
 * "open a tag named `5`", which fails. Author content uses `<50%`, `<= 5`,
 * etc. casually. We post-process the AST to replace stray `<` with `&lt;`.
 *
 * Rule: a `<` immediately followed by anything that is NOT a tag-name start
 * character (letter, `$`, `_`, `/`) gets escaped. We only touch text and
 * inlineCode-adjacent text nodes; nodes already inside `code` / `inlineCode`
 * are left alone.
 */
export default function remarkEscapeStrayLt() {
  return (tree) => {
    visit(tree, (node) => {
      if (!node || typeof node !== 'object') return
      if (node.type !== 'text') return
      if (typeof node.value !== 'string') return
      if (!node.value.includes('<')) return
      // Replace `<` not followed by [A-Za-z/_$] with `\<` (MDX-safe escape).
      node.value = node.value.replace(/<(?![A-Za-z/_$])/g, '\\<')
    })
  }
}

function visit(node, fn) {
  fn(node)
  const children = node && node.children
  if (Array.isArray(children)) {
    for (const child of children) visit(child, fn)
  }
}
