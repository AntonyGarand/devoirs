#!/usr/bin/env node
/* Vérifie que chaque habileté génère des questions valides (sans navigateur).
   Usage : node tools/check-skills.js [--only <motif>]
   Charge les scripts dans l'ordre d'index.html (sauf app.js), active les données
   d'essai (M.userData.fixture), puis génère 300 questions par niveau et par habileté :
   - validate() du format,
   - skill.check(q) / skill.lint(q) (contrôles de sens propres à l'habileté),
   - subject.lint(q, skill) (règles de la matière, ex. pas de format text en anglais),
   - texte sans undefined / NaN / [object Object]. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const only = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const esc = (v) => String(v).replace(/</g, '&lt;');
const fakeEl = () => ({
  style: { setProperty() {} }, dataset: {}, childNodes: [], classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  appendChild() {}, remove() {}, addEventListener() {}, setAttribute() {}, getAttribute: () => null, querySelector: () => null, querySelectorAll: () => [],
  set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h || ''; },
  set textContent(v) { this._h = esc(v); }, get textContent() { return String(this._h || '').replace(/<[^>]*>/g, ''); },
});
const ctx = {
  console, setTimeout, clearTimeout, Promise, Math, JSON, Date, Array, Object, String, Number, Set, Map, Intl, RegExp, Error,
  localStorage: { getItem: () => null, setItem() {} },
  document: { createElement: fakeEl, head: fakeEl(), body: fakeEl(), querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, removeEventListener() {} },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (f) => setTimeout(() => f(Date.now()), 0),
  matchMedia: () => ({ matches: false }),
};
ctx.window = ctx;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]).filter((f) => !/app\.js$/.test(f));
for (const f of scripts) {
  load(f);
  if (f === 'js/services.js') ctx.M.userData.useFixtures = true;
}
// Fichiers présents mais oubliés dans index.html
for (const d of fs.readdirSync(path.join(root, 'js'), { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(dir + '/' + e.name) : e.name.endsWith('.js') ? [dir + '/' + e.name] : []));
  walk('js/' + d.name).forEach((f) => { if (!scripts.includes(f) && f !== 'js/musique/samples.js' /* chargé à la demande par M.MU.load */) console.log(`⚠ ${f} n'est pas chargé par index.html`); });
}

const M = ctx.M;
let errors = 0;
const show = (q) => JSON.stringify(q, (k, v) => (typeof v === 'function' ? undefined : v)).slice(0, 320);
const fail = (id, msg, q) => { errors++; if (errors < 50) console.log(`✗ ${id}: ${msg}`, q ? show(q) : ''); };

function checkQuestion(id, q, sk) {
  if (!q || typeof q.prompt !== 'string' || (!q.prompt && (q.format || q.input) !== 'reflect')) return fail(id, 'prompt manquant', q), false;
  const name = q.format || q.input;
  const f = M.formats[name];
  if (!f) return fail(id, `format inconnu : ${name}`, q), false;
  if (q.passage && q.passage.tokens && !Array.isArray(q.passage.tokens)) return fail(id, 'passage.tokens invalide', q), false;
  const e = f.validate && f.validate(q);
  if (e) return fail(id, e, q), false;
  const text = q.prompt + (q.explain || '') + (q.hint || '') + JSON.stringify(q.choices || '') + JSON.stringify(q.steps || '') + JSON.stringify(q.passage || '') + JSON.stringify(q.check || '') + JSON.stringify(q.pairs || '') + JSON.stringify(q.items || '');
  if (/undefined|NaN|\[object Object\]/.test(text)) return fail(id, 'texte contient undefined/NaN/[object Object]', q), false;
  if (sk) {
    for (const hook of ['check', 'lint']) if (typeof sk[hook] === 'function') { const r = sk[hook](q); if (r) return fail(id, `${hook} : ${r}`, q), false; }
    const subj = M.subjectById[M.subjectOf(sk)];
    if (subj && typeof subj.lint === 'function') { const r = subj.lint(q, sk); if (r) return fail(id, `règle de matière : ${r}`, q), false; }
  }
  return true;
}

const ids = new Set();
for (const s of M.skills) {
  if (only && !s.id.includes(only)) continue;
  if (ids.has(s.id)) fail(s.id, 'id en double'); ids.add(s.id);
  for (const k of ['id', 'domain', 'title', 'gen', 'pda']) if (!s[k]) fail(s.id, `champ manquant : ${k}`);
  if (!M.domainById[s.domain]) fail(s.id, `domaine inconnu ${s.domain}`);
  if (s.learn && !M.learnById[s.learn]) fail(s.id, `page Apprendre inconnue : ${s.learn}`);
  for (let lvl = 0; lvl <= 2; lvl++) {
    for (let n = 0; n < 300; n++) {
      let q;
      try { q = s.gen({ lvl }); } catch (e) { fail(s.id, 'gen() a planté : ' + e.message); break; }
      if (!checkQuestion(s.id, q, s)) break;
    }
  }
}
if (!only) {
  for (const [name, mk] of Object.entries(M.FORMAT_SAMPLES || {})) checkQuestion('exemple:' + name, mk());
  for (const name of Object.keys(M.formats)) if (!(M.FORMAT_SAMPLES || {})[name]) fail('guide', `pas d'exemple pour le format ${name}`);
  const lids = new Set();
  M.learns.forEach((l) => { if (lids.has(l.id)) fail(l.id, 'page Apprendre en double'); lids.add(l.id); if (!M.domainById[l.domain]) fail(l.id, `page Apprendre : domaine inconnu ${l.domain}`); });
}

const bySubj = {};
M.skills.forEach((s) => { const sj = M.subjectOf(s) || '?'; bySubj[sj] = (bySubj[sj] || 0) + 1; });
console.log(`${M.skills.length} habiletés, ${M.learns.length} pages Apprendre (${Object.entries(bySubj).map(([k, v]) => k + ' ' + v).join(', ')}) — ${errors ? errors + ' erreur(s)' : 'OK'}`);
process.exit(errors ? 1 : 0);
