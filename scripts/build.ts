#!/usr/bin/env node
/* =====================================================================
   scripts/build.ts — compile le site dans dist/ (ce que GitHub Pages publie)
     1. tsrs : js/**\/*.ts → dist/js/**\/*.js (même arborescence; scripts classiques, pas de modules)
              sw/sw.ts → dist/sw.js
     2. copie les fichiers statiques (index.html, css, icônes, voix enregistrée, sons d'instruments…)
     3. remplit le service worker : liste de la coquille + empreintes (nouvelle empreinte = mise à jour)
   Usage : node scripts/build.ts [--strict]
     --strict : échoue s'il reste des erreurs de types (CI). Sans --strict, le code est quand même
                émis (pratique pendant une conversion), mais les erreurs sont affichées.
   Le dossier dist/ fonctionne aussi en file:// (ouvrir dist/index.html).
   ===================================================================== */
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const strict = process.argv.includes('--strict');
const tsrsBin = path.join(root, 'node_modules', 'tsrs', 'bin', 'tsrs'); // lanceur Node de tsrs (pas besoin de shell)

/** Lance tsrs sur un tsconfig; retourne le nombre d'erreurs. */
function tsrs(project: string): number {
  const r = spawnSync(process.execPath, [tsrsBin, '-p', project, '--noEmitOnError', 'false'], { cwd: root, encoding: 'utf8' });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  const errors = out.split('\n').filter((l) => /error TS\d+/.test(l));
  if (errors.length) {
    console.error(errors.slice(0, 20).join('\n'));
    if (errors.length > 20) console.error(`… et ${errors.length - 20} autres`);
  }
  if (r.error) throw r.error;
  return errors.length;
}

const copy = (rel: string): void => {
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, path.join(dist, rel), { recursive: true });
};

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const t0 = Date.now();
const errors = tsrs('tsconfig.json') + tsrs('sw/tsconfig.json');
console.log(`tsrs : ${errors ? `${errors} erreur(s) de types` : 'aucune erreur'} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);

// Fichiers statiques (le code TypeScript est déjà compilé)
['index.html', 'manifest.webmanifest', 'CNAME', '.nojekyll', 'css', 'icons', 'audio', 'js/musique/samples.js'].forEach(copy);

// Service worker : coquille = tout ce que index.html charge + scripts chargés à la demande
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const LAZY = ['js/styleguide.js', 'js/selftest.js']; // chargés par app.js (#/style, #/test)
const local = (u: string): boolean => !/^(data:|https?:|\/\/)/.test(u);
const shell = [
  ...new Set(
    [
      'index.html',
      ...[...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map((m) => m[1] ?? ''),
      ...[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1] ?? ''),
      ...LAZY,
      'icons/icon-192.png',
      'icons/icon-512.png',
    ].filter((u) => u && local(u)),
  ),
];
const missing = shell.filter((f) => !fs.existsSync(path.join(dist, f)));
if (missing.length) {
  console.error('Fichiers introuvables dans dist/ :', missing.join(', '));
  process.exit(1);
}
const hash = (list: string[]): string => {
  const h = crypto.createHash('sha256');
  list.forEach((f) => {
    h.update(f);
    h.update(fs.readFileSync(path.join(dist, f)));
  });
  return h.digest('hex').slice(0, 12);
};
const samples = 'js/musique/samples.js';
const swFile = path.join(dist, 'sw.js');
const sw = fs
  .readFileSync(swFile, 'utf8')
  .replace('__VERSION__', hash(shell))
  .replace('__SAMPLES_VERSION__', fs.existsSync(path.join(dist, samples)) ? hash([samples]) : '0')
  .replace("'__SHELL__'", JSON.stringify(JSON.stringify(['./', ...shell])));
if (/__(VERSION|SAMPLES_VERSION|SHELL)__/.test(sw)) {
  console.error('sw.js : marqueurs non remplacés');
  process.exit(1);
}
fs.writeFileSync(swFile, sw);
console.log(`dist/ prêt : ${shell.length + 1} fichiers dans la coquille hors ligne`);

if (strict && errors) process.exit(1);
