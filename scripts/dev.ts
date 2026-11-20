#!/usr/bin/env node
/* =====================================================================
   scripts/dev.ts — compile, puis sert dist/ sur http://localhost:8080 et recompile à chaque modification
   Usage : node scripts/dev.ts [--port 8080] [--host 0.0.0.0]   (--host 0.0.0.0 : essayer sur une tablette du réseau)
   Les bons types MIME sont envoyés (le service worker exige application/javascript).
   ===================================================================== */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const arg = (k: string, d: string): string => {
  const i = process.argv.indexOf(k);
  return i >= 0 ? (process.argv[i + 1] ?? d) : d;
};
const port = Number(arg('--port', '8080'));
const host = arg('--host', '127.0.0.1');

const build = (): void => {
  spawnSync(process.execPath, [path.join(root, 'scripts', 'build.ts')], { cwd: root, stdio: 'inherit' });
};
build();

let timer: ReturnType<typeof setTimeout> | undefined;
for (const dir of ['js', 'css', 'sw', 'icons']) {
  fs.watch(path.join(root, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 200);
  });
}
fs.watch(path.join(root, 'index.html'), () => {
  clearTimeout(timer);
  timer = setTimeout(build, 200);
});

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
};
http
  .createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    let file = path.normalize(path.join(dist, decodeURIComponent(url.pathname)));
    if (!file.startsWith(dist)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404).end('introuvable');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, host, () => console.log(`→ http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/  (Ctrl+C pour arrêter)`));
