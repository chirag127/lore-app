#!/usr/bin/env node
/* eslint-disable no-console */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.BASE_URL || 'https://bookatlas-13392.web.app';
const OUT = process.env.OUT_DIR || path.join(process.env.TEMP || '/tmp', 'bookatlas-smoke');
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'atlas', path: '/books' },
  { name: 'book-atomic-habits', path: '/books/atomic-habits-james-clear' },
  { name: 'narration', path: '/books/atomic-habits-james-clear/narration' },
  { name: 'signin', path: '/signin' },
  { name: 'request', path: '/request' },
  { name: 'search', path: '/search' },
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const results = [];

  for (const { name, path: p } of PAGES) {
    const url = `${BASE}${p}`;
    const errs = [];
    page.removeAllListeners('pageerror');
    page.on('pageerror', (e) => errs.push(String(e)));
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('load', { timeout: 15000 }).catch(() => undefined);
      const status = resp ? resp.status() : 0;
      const title = await page.title();
      await page.screenshot({
        path: path.join(OUT, `${name}.png`),
        fullPage: false,
      });
      results.push({ name, url, status, title, errs });
      console.log(`  ${status}  ${name.padEnd(22)}  ${title}`);
    } catch (e) {
      results.push({ name, url, status: 'ERR', errs: [String(e)] });
      console.log(`  ERR  ${name.padEnd(22)}  ${e.message}`);
    }
  }

  await browser.close();
  fs.writeFileSync(
    path.join(OUT, 'summary.json'),
    JSON.stringify({ base: BASE, results, ts: new Date().toISOString() }, null, 2),
  );
  const bad = results.filter((r) => r.status !== 200 || r.errs.length > 0);
  console.log(`\n${results.length - bad.length}/${results.length} pages OK`);
  if (bad.length) {
    console.error('Failed:');
    for (const r of bad) console.error(`  ${r.name}: status=${r.status} errs=${r.errs.join('; ')}`);
    process.exit(1);
  }
})();
