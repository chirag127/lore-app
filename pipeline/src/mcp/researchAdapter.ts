import { McpClient } from './client';
import type { ResearchOutput } from '../llm/research';

export interface McpResearchContext {
  searchResults: Array<{ title: string; url: string; snippet: string }>;
  fetchedPages: Array<{ url: string; text: string }>;
  openLibrary: unknown;
}

export async function gatherMcpContext(
  client: McpClient,
  args: { title: string; author: string },
): Promise<McpResearchContext> {
  const searchResults = await safeSearch(client, `"${args.title}" ${args.author} review summary`);
  const extraQueries = [
    `"${args.title}" ${args.author} criticism limitations`,
    `"${args.title}" ${args.author} key ideas framework`,
    `${args.title} ${args.author} Goodreads Amazon rating`,
  ];
  for (const q of extraQueries) {
    const r = await safeSearch(client, q, 5);
    searchResults.push(...r);
  }
  const fetchedPages: McpResearchContext['fetchedPages'] = [];
  for (const r of searchResults.slice(0, 6)) {
    if (!r.url) continue;
    try {
      const text = await client.call('web_fetch', { url: r.url, maxChars: 6000 });
      fetchedPages.push({ url: r.url, text });
    } catch { /* skip */ }
  }
  const ol = await client
    .call('open_library_lookup', { title: args.title, author: args.author })
    .catch(() => '');
  return { searchResults, fetchedPages, openLibrary: safeJson(ol) };
}

async function safeSearch(
  client: McpClient,
  query: string,
  max = 8,
): Promise<McpResearchContext['searchResults']> {
  try {
    const raw = await client.call('web_search', { query, max });
    const parsed = safeJson(raw) as { results?: McpResearchContext['searchResults'] };
    return parsed.results ?? [];
  } catch {
    return [];
  }
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}

export function mdxToString(ctx: McpResearchContext): string {
  const lines: string[] = [];
  lines.push('## Web search results');
  for (const r of ctx.searchResults.slice(0, 12)) {
    lines.push(`- [${r.title}](${r.url}) — ${r.snippet}`);
  }
  if (ctx.fetchedPages.length > 0) {
    lines.push('\n## Page excerpts');
    for (const p of ctx.fetchedPages) {
      lines.push(`\n### ${p.url}\n${p.text.slice(0, 1500)}…`);
    }
  }
  if (ctx.openLibrary) {
    lines.push('\n## Open Library record\n```json\n' + JSON.stringify(ctx.openLibrary, null, 2) + '\n```');
  }
  return lines.join('\n');
}

export type { ResearchOutput };
