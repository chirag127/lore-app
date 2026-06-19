/**
 * remarkStripUnknownJsx — unwrap or drop MDX JSX nodes that reference custom
 * component names. Any element whose name starts with an uppercase letter
 * (a custom component, not a regular HTML element) is replaced by its
 * children — the content survives as plain Markdown but the wrapper goes.
 *
 * This lets us render MDX content that was authored against legacy chrome
 * components (BookIndexLayout, Exercise, Card, …) without those components
 * being defined at runtime.
 *
 * Operates on the mdast (`mdxJsxFlowElement`, `mdxJsxTextElement`) and the
 * MDX-esm nodes (`mdxjsEsm`) which we drop entirely so that author imports
 * to non-existent files don't break the bundler.
 */
export default function remarkStripUnknownJsx() {
  return (tree) => {
    walk(tree)
  }

  function walk(node) {
    if (!node || typeof node !== 'object') return
    const children = node.children
    if (!Array.isArray(children)) return
    const out = []
    for (const child of children) {
      // Drop `import …` / `export …` esm blocks at the top of MDX files.
      // They reference layout components / data files we no longer ship.
      if (child.type === 'mdxjsEsm') continue
      // For custom-component JSX nodes, splice their children up.
      if (
        (child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement') &&
        typeof child.name === 'string' &&
        /^[A-Z]/.test(child.name)
      ) {
        const inner = child.children || []
        for (const grand of inner) walk(grand)
        out.push(...inner)
        continue
      }
      walk(child)
      out.push(child)
    }
    node.children = out
  }
}
