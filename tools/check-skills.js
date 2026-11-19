#!/usr/bin/env node
/* Vérifie que chaque habileté génère des questions valides (sans navigateur).
   Usage : node tools/check-skills.js [fichier-habiletés.js ...]
   Sans argument : tous les fichiers de js/skills/. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const fakeEl = () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, remove() {}, set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h || ''; }, set textContent(v) { this._h = M_esc(v); }, get textContent() { return String(this._h || '').replace(/<[^>]*>/g, ''); } });
const M_esc = (v) => String(v).replace(/</g, '&lt;');
const ctx = {
  console, setTimeout, clearTimeout, Promise, Math, JSON, Date, Array, Object, String, Number, Set, Map,
  localStorage: { getItem: () => null, setItem() {} },
  document: { createElement: fakeEl, head: fakeEl(), body: fakeEl(), querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, removeEventListener() {} },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (f) => setTimeout(() => f(Date.now()), 0),
};
ctx.window = ctx;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
load(path.join(root, 'js/core.js'));
load(path.join(root, 'js/viz.js'));

let files = process.argv.slice(2);
if (!files.length) files = fs.readdirSync(path.join(root, 'js/skills')).map((f) => path.join(root, 'js/skills', f));
files.forEach((f) => load(path.resolve(f)));

let errors = 0;
const fail = (id, msg, q) => { errors++; if (errors < 40) console.log(`✗ ${id}: ${msg}`, q ? JSON.stringify({ ...q, viz: undefined, showMe: undefined }).slice(0, 300) : ''); };
const M = ctx.M;
for (const s of M.skills) {
  for (const k of ['id', 'domain', 'title', 'gen', 'pda']) if (!s[k]) fail(s.id, `champ manquant : ${k}`);
  if (!M.DOMAINS.find((d) => d.id === s.domain)) fail(s.id, `domaine inconnu ${s.domain}`);
  for (let lvl = 0; lvl <= 2; lvl++) {
    for (let n = 0; n < 300; n++) {
      let q;
      try { q = s.gen({ lvl }); } catch (e) { fail(s.id, 'gen() a planté : ' + e.message); break; }
      if (!q || typeof q.prompt !== 'string' || !q.prompt) { fail(s.id, 'prompt manquant', q); break; }
      if (!['number', 'choice', 'order'].includes(q.input)) { fail(s.id, 'input invalide', q); break; }
      if (q.answer === undefined || q.answer === null || Number.isNaN(q.answer)) { fail(s.id, 'answer manquant', q); break; }
      if (q.input === 'number' && (!Number.isInteger(q.answer) || q.answer < 0)) { fail(s.id, 'answer number non entier ≥ 0', q); break; }
      if (q.input === 'choice') {
        if (!Array.isArray(q.choices) || q.choices.length < 2) { fail(s.id, 'choices < 2', q); break; }
        const hits = q.choices.filter((c) => String(c.value) === String(q.answer)).length;
        if (hits !== 1) { fail(s.id, `la bonne réponse apparaît ${hits} fois dans choices`, q); break; }
        const vals = q.choices.map((c) => String(c.value));
        if (new Set(vals).size !== vals.length) { fail(s.id, 'choices en double', q); break; }
      }
      if (q.input === 'order') {
        if (!Array.isArray(q.answer) || !Array.isArray(q.choices) || q.answer.length !== q.choices.length) { fail(s.id, 'order : answer/choices incohérents', q); break; }
      }
      if (/undefined|NaN/.test(q.prompt + (q.explain || '') + (q.hint || '') + JSON.stringify(q.choices || ''))) { fail(s.id, 'texte contient undefined/NaN', q); break; }
    }
  }
}
console.log(`${M.skills.length} habiletés vérifiées — ${errors ? errors + ' erreur(s)' : 'OK'}`);
process.exit(errors ? 1 : 0);
