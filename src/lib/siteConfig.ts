/*
 * Site config — small bag of strings. Used by the BaseLayout for canonical URL,
 * page titles, and JSON-LD descriptions.
 */
export interface SiteConfig {
  slug: string
  name: string
  origin: string
  tagline: string
  description: string
}

export const SITE_CONFIG: SiteConfig = {
  slug: 'book-lore',
  name: 'book·lore',
  origin: 'https://book-lore.oriz.in',
  tagline: 'a reading commons of structured book commentary',
  description:
    'book·lore is a reading commons of structured book commentary — overview, content map, analysis, narration. Set on aged cream with marginalia in pencil red.',
}
