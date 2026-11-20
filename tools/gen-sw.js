#!/usr/bin/env node
/* =====================================================================
   tools/gen-sw.js — met à jour la liste de l'application (coquille) dans sw.js
   Lit index.html (feuilles de style, scripts, manifeste, icônes), ajoute les
   scripts chargés à la demande, calcule une empreinte du contenu et réécrit le
   bloc « GÉNÉRÉ » de sw.js. Une empreinte différente = nouveau service worker :
   les appareils téléchargent la nouvelle version et la page se recharge
   (hors série de questions).
   Usage : node tools/gen-sw.js        (après toute modification de css/, js/, index.html)
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const LAZY = ['js/styleguide.js', 'js/selftest.js']; // chargés par app.js (#/style, #/test)
const local = (u) => u && !/^(data:|https?:|\/\/)/.test(u);

const files = [
  'index.html',
  ...[...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]),
  ...LAZY,
  'icons/icon-192.png', 'icons/icon-512.png',
].filter(local);
const shell = [...new Set(files)];
const missing = shell.filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length) { console.error('Fichiers introuvables :', missing.join(', ')); process.exit(1); }

const hash = (list) => {
  const h = crypto.createHash('sha256');
  list.forEach((f) => { h.update(f); h.update(fs.readFileSync(path.join(root, f))); });
  return h.digest('hex').slice(0, 12);
};
const version = hash(shell);
const samples = 'js/musique/samples.js';
const samplesVersion = fs.existsSync(path.join(root, samples)) ? hash([samples]) : '0';

const swPath = path.join(root, 'sw.js');
const sw = fs.readFileSync(swPath, 'utf8');
const block = `// GÉNÉRÉ:debut — node tools/gen-sw.js (ne pas modifier à la main)
const VERSION = '${version}';
const SAMPLES_VERSION = '${samplesVersion}';
const SHELL = ${JSON.stringify(['./', ...shell], null, 1).replace(/\n\s*/g, '\n  ').replace(/\n  \]$/, '\n]')};
// GÉNÉRÉ:fin`;
const out = sw.replace(/\/\/ GÉNÉRÉ:debut[\s\S]*?\/\/ GÉNÉRÉ:fin/, block);
if (out === sw && !sw.includes(block)) { console.error('Bloc GÉNÉRÉ introuvable dans sw.js'); process.exit(1); }
fs.writeFileSync(swPath, out);
console.log(`sw.js : ${shell.length + 1} fichiers, version ${version}, sons ${samplesVersion}`);
