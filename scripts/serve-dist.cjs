const http = require('http');
const fs = require('fs');
const path = require('path');

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

http.createServer((req, res) => {
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
}).listen(PORT, HOST, () => {
  console.log(`[serve] ${ROOT} on http://${HOST}:${PORT}`);
});
