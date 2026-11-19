#!/usr/bin/env node
/* Vérifie que chaque habileté génère des questions valides (sans navigateur).
   Usage : node tools/check-skills.js [fichier-habiletés.js ...]
   Sans argument : toutes les matières (js/<matière>/subject.js + skills/*.js)
   et les exemples du guide de style. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const esc = (v) => String(v).replace(/</g, '&lt;');
const fakeEl = () => ({
  style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, remove() {}, addEventListener() {}, setAttribute() {},
  set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h || ''; },
  set textContent(v) { this._h = esc(v); }, get textContent() { return String(this._h || '').replace(/<[^>]*>/g, ''); },
});
const ctx = {
  console, setTimeout, clearTimeout, Promise, Math, JSON, Date, Array, Object, String, Number, Set, Map, Intl,
  localStorage: { getItem: () => null, setItem() {} },
  document: { createElement: fakeEl, head: fakeEl(), body: fakeEl(), querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, removeEventListener() {} },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (f) => setTimeout(() => f(Date.now()), 0),
};
ctx.window = ctx;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
['core', 'formats', 'session', 'ui', 'viz'].forEach((f) => load(path.join(root, 'js', f + '.js')));

const subjects = fs.readdirSync(path.join(root, 'js'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
subjects.forEach((s) => { const f = path.join(root, 'js', s, 'subject.js'); if (fs.existsSync(f)) load(f); });

let files = process.argv.slice(2).map((f) => path.resolve(f));
if (!files.length) subjects.forEach((s) => { const d = path.join(root, 'js', s, 'skills'); if (fs.existsSync(d)) fs.readdirSync(d).filter((f) => f.endsWith('.js')).sort().forEach((f) => files.push(path.join(d, f))); });
files.forEach((f) => load(f));
load(path.join(root, 'js', 'styleguide.js'));

const M = ctx.M;
let errors = 0;
const show = (q) => JSON.stringify(q, (k, v) => (typeof v === 'function' ? undefined : v)).slice(0, 300);
const fail = (id, msg, q) => { errors++; if (errors < 40) console.log(`✗ ${id}: ${msg}`, q ? show(q) : ''); };

function checkQuestion(id, q) {
  if (!q || typeof q.prompt !== 'string' || !q.prompt) return fail(id, 'prompt manquant', q), false;
  const name = q.format || q.input;
  const f = M.formats[name];
  if (!f) return fail(id, `format inconnu : ${name}`, q), false;
  const e = f.validate && f.validate(q);
  if (e) return fail(id, e, q), false;
  const text = q.prompt + (q.explain || '') + (q.hint || '') + JSON.stringify(q.choices || '') + JSON.stringify(q.steps || '') + JSON.stringify(q.passage || '');
  if (/undefined|NaN|\[object Object\]/.test(text)) return fail(id, 'texte contient undefined/NaN/[object Object]', q), false;
  return true;
}

const ids = new Set();
for (const s of M.skills) {
  if (ids.has(s.id)) fail(s.id, 'id en double'); ids.add(s.id);
  for (const k of ['id', 'domain', 'title', 'gen', 'pda']) if (!s[k]) fail(s.id, `champ manquant : ${k}`);
  if (!M.domainById[s.domain]) fail(s.id, `domaine inconnu ${s.domain}`);
  for (let lvl = 0; lvl <= 2; lvl++) {
    for (let n = 0; n < 300; n++) {
      let q;
      try { q = s.gen({ lvl }); } catch (e) { fail(s.id, 'gen() a planté : ' + e.message); break; }
      if (!checkQuestion(s.id, q)) break;
    }
  }
}
for (const [name, mk] of Object.entries(M.FORMAT_SAMPLES || {})) checkQuestion('exemple:' + name, mk());
for (const name of Object.keys(M.formats)) if (!(M.FORMAT_SAMPLES || {})[name]) fail('guide', `pas d'exemple pour le format ${name}`);

const bySubj = {};
M.skills.forEach((s) => { const sj = M.subjectOf(s) || '?'; bySubj[sj] = (bySubj[sj] || 0) + 1; });
console.log(`${M.skills.length} habiletés vérifiées (${Object.entries(bySubj).map(([k, v]) => k + ' ' + v).join(', ')}) — ${errors ? errors + ' erreur(s)' : 'OK'}`);
process.exit(errors ? 1 : 0);
