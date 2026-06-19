/*
 * ReadingRibbon — 6px vertical bottle-green strip pinned to the article's
 * left padding (NOT the viewport edge). IntersectionObserver writes the
 * paragraph index to `localStorage[bookLore:${slug}:para]` whenever the
 * reader scrolls. On mount, if a value exists, scrollIntoView({block:'center'})
 * to that paragraph after a 200ms delay — silent (no modal, no toast).
 *
 * A single brass `--brass` notch (1px high) is rendered at the saved
 * position so the reader can see where the bookmark lives even when scrolling
 * past it.
 */
import { useEffect, useRef, useState } from 'react'

interface Props {
  /** Book slug — used as the localStorage key namespace. */
  slug: string
  /** CSS selector that returns paragraphs to track inside the article body. */
  paragraphSelector?: string
}

export default function ReadingRibbon({ slug, paragraphSelector = 'main p, main li' }: Props) {
  const ribbonRef = useRef<HTMLDivElement | null>(null)
  const [notchPct, setNotchPct] = useState<number | null>(null)
  const storageKey = `bookLore:${slug}:para`

  useEffect(() => {
    if (typeof window === 'undefined') return
    const all = Array.from(document.querySelectorAll<HTMLElement>(paragraphSelector))
    if (all.length === 0) return

    // Silent restore on mount.
    const stored = window.localStorage.getItem(storageKey)
    const restoreIdx = stored ? Number.parseInt(stored, 10) : Number.NaN
    if (Number.isFinite(restoreIdx) && restoreIdx > 0 && restoreIdx < all.length) {
      window.setTimeout(() => {
        all[restoreIdx]?.scrollIntoView({ block: 'center', behavior: 'auto' })
      }, 200)
      setNotchPct((restoreIdx / Math.max(1, all.length - 1)) * 100)
    }

    let lastWriteIdx = -1
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting entry as "currently reading".
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const top = visible[0]
        if (!top) return
        const idx = all.indexOf(top.target as HTMLElement)
        if (idx < 0 || idx === lastWriteIdx) return
        lastWriteIdx = idx
        try {
          window.localStorage.setItem(storageKey, String(idx))
        } catch {
          // Storage may be unavailable (private mode); fail silently.
        }
        setNotchPct((idx / Math.max(1, all.length - 1)) * 100)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    )
    for (const el of all) observer.observe(el)
    return () => observer.disconnect()
  }, [paragraphSelector, storageKey])

  return (
    <div className="ribbon" ref={ribbonRef} aria-hidden="true">
      {notchPct !== null && (
        <span
          className="ribbon-notch"
          style={{ top: `${Math.max(0, Math.min(100, notchPct))}%` }}
        />
      )}
      <style>{`
        .ribbon {
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: var(--bottle);
          pointer-events: none;
        }
        .ribbon-notch {
          position: absolute;
          left: -2px;
          width: 10px;
          height: 1px;
          background: var(--brass);
        }
        @media (max-width: 720px) {
          .ribbon { width: 4px; }
          .ribbon-notch { left: -3px; width: 10px; }
        }
      `}</style>
    </div>
  )
}
