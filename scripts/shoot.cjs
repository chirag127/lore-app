const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/chira/.agents/skills/playwright/node_modules/playwright');

const ROOT = path.join(__dirname, '..', 'web', 'dist');
const PORT = 4321;
const HOST = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.wasm': 'application/wasm',
};

const send = (res, code, body, type = 'text/plain; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
};

const tryFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let p = path.normalize(path.join(ROOT, url));
  if (!p.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  if (url.endsWith('/')) p = path.join(p, 'index.html');
  if (tryFile(p)) {
    const ext = path.extname(p).toLowerCase();
    return send(res, 200, fs.readFileSync(p), MIME[ext] || 'application/octet-stream');
  }
  const fallback = p + '.html';
  if (tryFile(fallback)) {
    return send(res, 200, fs.readFileSync(fallback), 'text/html; charset=utf-8');
  }
  const dir = p.endsWith('/') ? p : p + '/';
  const idx = path.join(dir, 'index.html');
  if (tryFile(idx)) {
    return send(res, 200, fs.readFileSync(idx), 'text/html; charset=utf-8');
  }
  send(res, 404, 'Not Found');
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await new Promise((r) => server.listen(PORT, HOST, r));
  console.log(`[serve] ready on http://${HOST}:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push('CONSOLE: ' + msg.text()); });

  const shot = async (path, label) => {
    await page.goto('http://127.0.0.1:4321' + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(800);
    await page.screenshot({ path: `C:/Users/chira/AppData/Local/Temp/light-${label}.png`, fullPage: true });
    console.log('shot:', label);
  };

  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('bookatlas:theme', 'light'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1000);
  await page.screenshot({ path: 'C:/Users/chira/AppData/Local/Temp/light-home.png', fullPage: true });
  console.log('shot: home');

  await shot('/books', 'atlas');
  await shot('/books/atomic-habits-james-clear/narration', 'narration');
  await shot('/books/atomic-habits-james-clear/content', 'content');
  await shot('/dashboard', 'dashboard');
  await shot('/request', 'request');
  await shot('/signin', 'signin');
  await shot('/books/a-mind-for-numbers-barbara-oakley', 'a-mind-for-numbers');

  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('bookatlas:theme', 'dark'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1000);
  await page.screenshot({ path: 'C:/Users/chira/AppData/Local/Temp/dark-home.png', fullPage: true });
  console.log('shot: dark-home');

  await page.goto('http://127.0.0.1:4321/books', { waitUntil: 'domcontentloaded' });
  await sleep(800);
  await page.screenshot({ path: 'C:/Users/chira/AppData/Local/Temp/dark-atlas.png', fullPage: true });
  console.log('shot: dark-atlas');

  await page.goto('http://127.0.0.1:4321/books/atomic-habits-james-clear/narration', { waitUntil: 'domcontentloaded' });
  await sleep(800);
  await page.screenshot({ path: 'C:/Users/chira/AppData/Local/Temp/dark-narration.png', fullPage: true });
  console.log('shot: dark-narration');

  await page.goto('http://127.0.0.1:4321/books/a-mind-for-numbers-barbara-oakley', { waitUntil: 'domcontentloaded' });
  await sleep(800);
  await page.screenshot({ path: 'C:/Users/chira/AppData/Local/Temp/dark-a-mind-for-numbers.png', fullPage: true });
  console.log('shot: dark-a-mind-for-numbers');

  console.log('---ERRORS---');
  consoleErrors.forEach((e) => console.log(e));
  console.log('---END---');

  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
