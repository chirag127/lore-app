#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { run } from './run.js';

async function fetchIssueBody(repo: string, n: number, token?: string): Promise<{ title: string; author: string; body: string; notes?: string }> {
  const [owner, name] = repo.split('/');
  const url = `https://api.github.com/repos/${owner}/${name}/issues/${n}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: token ? `Bearer ${token}` : '',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'KnowledgeAtlas-Pipeline',
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub issue fetch failed (${res.status}): ${t.slice(0, 300)}`);
  }
  const issue = (await res.json()) as { title: string; body: string };
  const m = (re: RegExp) => issue.body.match(re)?.[1]?.trim();
  const title = m(/\*\*Title:\*\*\s*(.+)/i) ?? issue.title.replace(/^Add Book:\s*/i, '').split(' — ')[0] ?? '';
  const author = m(/\*\*Author:\*\*\s*(.+)/i) ?? '';
  const notes = m(/\*\*Notes:\*\*\s*([\s\S]+?)(?:\n---|$)/i);
  return { title, author, body: issue.body, notes };
}

async function main() {
  const { values } = parseArgs({
    options: {
      issue: { type: 'string', short: 'i' },
      title: { type: 'string', short: 't' },
      author: { type: 'string', short: 'a' },
      notes: { type: 'string', short: 'n' },
      publish: { type: 'boolean', default: false, short: 'p' },
      'output-dir': { type: 'string' },
    },
    allowPositionals: false,
  });

  let issueBody = '';
  let issueNumber = 0;
  let title = values.title ?? '';
  let author = values.author ?? '';
  let notes = values.notes;

  if (values.issue) {
    issueNumber = Number(values.issue);
    const repo = process.env.GITHUB_REPOSITORY ?? '';
    if (!repo) throw new Error('GITHUB_REPOSITORY env var required when --issue is used');
    const issue = await fetchIssueBody(repo, issueNumber, process.env.GITHUB_TOKEN);
    issueBody = issue.body;
    title = title || issue.title;
    author = author || issue.author;
    notes = notes ?? issue.notes;
  }
  if (!title || !author) {
    throw new Error('Provide --title and --author (or use --issue)');
  }

  // eslint-disable-next-line no-console
  console.log(`[pipeline] starting for "${title}" by ${author}`);
  const result = await run({
    issueNumber,
    issueBody,
    title,
    author,
    notes,
    publish: values.publish,
  });
  // eslint-disable-next-line no-console
  console.log(`[pipeline] generated ${result.files.length} files`);
  for (const f of result.files) {
    // eslint-disable-next-line no-console
    console.log(`  - ${f.path} (${f.content.length} bytes)`);
  }
  if (result.branch) {
    // eslint-disable-next-line no-console
    console.log(`[pipeline] branch: ${result.branch}`);
  }
  if (result.prUrl) {
    // eslint-disable-next-line no-console
    console.log(`[pipeline] PR: ${result.prUrl}`);
  }

  if (values['output-dir']) {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const out = path.resolve(values['output-dir']);
    await fs.mkdir(out, { recursive: true });
    for (const f of result.files) {
      const full = path.join(out, f.path);
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, f.content, 'utf8');
    }
    // eslint-disable-next-line no-console
    console.log(`[pipeline] wrote files to ${out}`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[pipeline] FAILED:', err);
  process.exit(1);
});
