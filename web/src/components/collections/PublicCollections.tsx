import { useEffect, useState } from 'react';

export function PublicCollections() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      const { getDocs, collection, query, where, limit } = await import('firebase/firestore');
      const { getDb } = await import('../../lib/firebase');
      try {
        const q = query(
          collection(getDb(), 'publicCollections'),
          where('public', '==', true),
          limit(20),
        );
        const snap = await getDocs(q);
        if (!active) return;
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch { /* ignore */ }
    })();
    return () => { active = false; };
  }, []);
  if (items.length === 0) return null;
  return (
    <section className="space-y-6">
      <h2 className="font-display text-display-md font-light">Public collections</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((c) => (
          <article key={c.id} className="grain-card grain-overlay p-5">
            <h3 className="font-display text-xl font-light">{c.title}</h3>
            {c.description && (
              <p className="mt-1 text-sm text-ink-soft">{c.description}</p>
            )}
            <ul className="mt-3 space-y-1">
              {(c.books as string[]).slice(0, 6).map((slug) => (
                <li key={slug}>
                  <a
                    href={`/books/${slug}`}
                    className="text-sm text-ink-soft hover:text-terracotta-500 truncate block"
                  >
                    · {slug.replace(/-/g, ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
