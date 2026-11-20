#!/usr/bin/env node
/* Récolte toutes les phrases que l'application peut lire à voix haute.
   Usage : (cd tools && npm i)  puis  node tools/tts-collect.js [--max 1500]
   Sortie : tools/tts/phrases.json  → [{ t, lang, kind: 'full'|'piece'|'num', n }]

   Comment : charge les scripts d'index.html dans jsdom et remplace M.clips.plan
   par un enregistreur — on passe donc par le vrai M.say / M.sayHtml (mêmes
   conversions « + → plus », mêmes segments de langue).
   - Habiletés : on génère des questions jusqu'à saturation (plus de phrase
     nouvelle). Les habiletés « infinies » (nombres au hasard) ne saturent pas :
     leurs phrases sont découpées en nombres + morceaux (M.clips.split), qu'on
     enregistre séparément et qu'on recolle à la lecture.
   - Pages Apprendre : rendues, puis on touche chaque bouton / tuile.
   - Nombres 0 à 1000 et messages fixes (bravo, encouragements…). */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const MAX = +arg('--max', 1500);
const BATCH = 40;

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]).filter((f) => !/app\.js$/.test(f))
  .concat(['js/styleguide.js']); // chargé à la demande dans l'app; ses phrases d'exemple doivent quand même être enregistrées
const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' });
const w = dom.window;
w.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {}, addListener() {} }); // mouvement réduit : pas d'animations
w.HTMLElement.prototype.animate = function () { return { finished: Promise.resolve(), cancel() {}, onfinish: null }; };
w.HTMLElement.prototype.scrollIntoView = function () {};
w.HTMLCanvasElement.prototype.getContext = () => null;
w.SVGElement && (w.SVGElement.prototype.getTotalLength = () => 100);
w.console.error = () => {};
for (const f of scripts) {
  const code = fs.readFileSync(path.join(root, f), 'utf8');
  try { w.eval(code); } catch (e) { console.log('⚠', f, e.message); }
  if (f === 'js/services.js') w.M.userData.useFixtures = true;
}
const M = w.M;

/* ---- enregistreur ---- */
const full = new Map(); // clé -> { t, lang, n, src:Set }
let src = '';
const record = (t, lang) => {
  const k = M.clips.key(t, lang);
  if (!M.clips.clean(t)) return;
  const e = full.get(k);
  if (e) { e.n++; e.src.add(src); } else full.set(k, { t: M.clips.clean(t), lang: lang.slice(0, 2), n: 1, src: new Set([src]) });
};
M.CLIP_INDEX = 'x'; M.clips._set = null;
M.clips.plan = (t, lang) => { record(t, lang); return null; };
M.sleep = () => Promise.resolve();
let queue = Promise.resolve();
const say0 = M.say;
M.say = (t, o) => (queue = queue.then(() => say0(t, o)));
const flush = async () => { await queue; await new Promise((r) => setTimeout(r, 0)); await queue; };

const host = w.document.createElement('div');
w.document.body.appendChild(host);
const tap = (root) => root.querySelectorAll('button, [data-say], .ptok, .sc-tile, .feel, .flash-card, [data-i], [data-v]').forEach((b) => { try { b.click(); } catch (e) {} });

(async () => {
  /* 1. habiletés (point de reprise : --resume relit tools/tts/_habiletes.json) */
  const CK = path.join(__dirname, 'tts', '_habiletes.json');
  const infinite = new Set();
  const resume = process.argv.includes('--resume') && fs.existsSync(CK);
  if (resume) {
    const ck = JSON.parse(fs.readFileSync(CK, 'utf8'));
    ck.infinite.forEach((x) => infinite.add(x));
    ck.full.forEach(([k, e]) => full.set(k, { ...e, src: new Set(e.src) }));
    console.log(`reprise : ${full.size} phrases, ${infinite.size} habiletés infinies`);
  }
  const ONLY = arg('--only', null);
  for (const sk of resume ? [] : M.skills.filter((s) => !ONLY || s.id.includes(ONLY))) {
    src = 'skill:' + sk.id;
    if (sk.available && sk.available() !== true) { console.log('  (indisponible)', sk.id); continue; }
    let gens = 0, stale = 0;
    for (const lvl of [0, 1, 2]) {
      const cap = infinite.has(sk.id) ? Math.min(MAX, 250) : MAX; // déjà infinie : inutile d'insister
      for (let made = 0; made < cap;) {
        const before = full.size;
        for (let i = 0; i < BATCH; i++, made++) {
          let q; try { q = sk.gen({ lvl }); } catch (e) { continue; }
          try {
            M.heard.clear();
            host.innerHTML = '';
            const inst = M.renderQuestion(host, q, { skill: sk, record: false });
            host.querySelectorAll('.q-speak, .q-listen, .q-slow, .q-read').forEach((b) => b.onclick && b.onclick());
            host.querySelectorAll('.ptok').forEach((t) => t.click());
            await flush();
            if (inst && inst.destroy) inst.destroy();
          } catch (e) {}
          gens++;
        }
        const added = full.size - before;
        if (added === 0) { if (++stale >= 3) break; } else stale = 0;
      }
      if (stale < 3) infinite.add(sk.id);
      stale = 0;
    }
    process.stdout.write(`\r${sk.id.padEnd(28)} ${String(gens).padStart(5)} questions, ${full.size} phrases ${infinite.has(sk.id) ? '(∞)' : ''}      \n`);
  }

  if (!resume && !ONLY) {
    fs.mkdirSync(path.dirname(CK), { recursive: true });
    fs.writeFileSync(CK, JSON.stringify({ infinite: [...infinite], full: [...full].map(([k, e]) => [k, { ...e, src: [...e.src] }]) }));
  }

  /* 2. pages Apprendre */
  for (const l of M.learns) {
    src = 'learn:' + l.id;
    try {
      host.innerHTML = '';
      M.say(M.text(l.intro || l.title));
      l.render(host);
      tap(host); await flush(); tap(host); await flush();
    } catch (e) { console.log('  ⚠ learn', l.id, e.message); }
  }
  /* 3. messages fixes */
  src = 'fixed';
  M.BRAVO.forEach((b) => M.say(b));
  M.say('Bonjour ! Je suis la voix française.'); M.say('Hello! I am the English voice.', { lang: 'en-CA', raw: true });
  Object.values(M.subjectById).forEach((s) => (s.cheers || []).forEach((c) => M.say(c.text, c.lang ? { lang: c.lang, raw: true } : {})));
  (M.ui.FEELINGS || []).forEach((f) => M.say(f.label));
  await flush();

  /* 4. classement */
  const out = new Map();
  const add = (t, lang, kind, n = 1) => {
    const k = M.clips.key(t, lang);
    const e = out.get(k);
    if (e) { e.n += n; if (kind === 'full') e.kind = 'full'; } else out.set(k, { t: M.clips.clean(t), lang, kind, n });
  };
  let dropped = 0;
  for (const e of full.values()) {
    const fromInfinite = [...e.src].every((s) => s.startsWith('skill:') && infinite.has(s.slice(6)));
    const parts = M.clips.split(e.t);
    const hasNum = parts.some((p) => p.num);
    if (!fromInfinite || !hasNum) { if (!fromInfinite || e.n >= 2 || e.t.length < 60) add(e.t, e.lang, 'full', e.n); else dropped++; }
    if (fromInfinite && hasNum) parts.forEach((p) => add(p.text, e.lang, p.num ? 'num' : 'piece'));
  }
  for (let i = 0; i <= 1000; i++) add(String(i), 'fr', 'num');
  for (let i = 0; i <= 100; i++) add(String(i), 'en', 'num');
  // morceaux rares (noms, objets) : seulement s'ils servent au moins 2 fois
  const list = [...out.values()].filter((e) => e.kind !== 'piece' || e.n >= 2);
  const rarePieces = out.size - list.length;
  list.sort((a, b) => a.lang.localeCompare(b.lang) || a.kind.localeCompare(b.kind) || a.t.localeCompare(b.t));
  fs.mkdirSync(path.join(__dirname, 'tts'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'tts', 'phrases.json'), JSON.stringify(list, null, 0).replace(/},{/g, '},\n{'));
  const by = (k) => list.filter((e) => e.kind === k).length;
  const chars = list.reduce((s, e) => s + e.t.length, 0);
  console.log(`\n${list.length} enregistrements (${by('full')} phrases, ${by('piece')} morceaux, ${by('num')} nombres; ${list.filter((e) => e.lang === 'en').length} en anglais), ${chars} caractères.`);
  console.log(`Habiletés infinies (${infinite.size}) : ${[...infinite].join(', ')}`);
  console.log(`Ignorés : ${dropped} longues phrases uniques sans nombre, ${rarePieces} morceaux rares (voix du navigateur).`);
  process.exit(0);
})();
