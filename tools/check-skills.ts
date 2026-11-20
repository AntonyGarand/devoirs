#!/usr/bin/env node
/* Vérifie que chaque habileté génère des questions valides (sans navigateur).
   Usage : node tools/check-skills.js [--only <motif>]
   Charge les scripts dans l'ordre d'index.html (sauf app.js), active les données
   d'essai (M.userData.fixture), puis génère 300 questions par niveau et par habileté :
   - validate() du format,
   - skill.check(q) / skill.lint(q) (contrôles de sens propres à l'habileté),
   - subject.lint(q, skill) (règles de la matière, ex. pas de format text en anglais),
   - texte sans undefined / NaN / [object Object]. */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

/** Question générée, non vérifiée : on n'en suppose que les champs lus ici. */
interface GenQuestion {
  prompt?: unknown;
  format?: string;
  input?: string;
  passage?: string | { tokens?: unknown } | null;
  explain?: string;
  hint?: string;
  choices?: unknown;
  steps?: unknown;
  check?: unknown;
  pairs?: unknown;
  items?: unknown;
}
type Hook = (q: GenQuestion) => unknown;
interface ToolSkill {
  id: string;
  domain: string;
  title: string;
  pda: string;
  learn?: string;
  gen(ctx: { lvl: number }): GenQuestion | null | undefined;
  check?: Hook;
  lint?: Hook;
}
interface ToolLearn {
  id: string;
  domain: string;
}
/** Ce que ce script utilise de window.M (site compilé, chargé dans un contexte vm). */
interface ToolM {
  userData: { useFixtures: boolean };
  skills: ToolSkill[];
  learns: ToolLearn[];
  formats: Record<string, { validate?(q: GenQuestion): unknown } | undefined>;
  FORMAT_SAMPLES?: Record<string, () => GenQuestion>;
  subjectById: Record<string, { lint?(q: GenQuestion, sk: ToolSkill): unknown } | undefined>;
  subjectOf(x: { domain: string }): string | null;
  domainById: Record<string, unknown>;
  learnById: Record<string, unknown>;
}
/** Global du contexte vm : window = le contexte lui-même; les scripts y ajoutent M. */
interface SandboxCtx {
  [name: string]: unknown;
  window?: SandboxCtx;
  M?: ToolM;
}

const root = path.join(import.meta.dirname, '..', 'dist'); // site compilé (npm run build)
const only = (() => {
  const i = process.argv.indexOf('--only');
  return i > 0 ? process.argv[i + 1] : null;
})();
const esc = (v: unknown): string => String(v).replace(/</g, '&lt;');
const fakeEl = () => ({
  _h: undefined as unknown,
  style: { setProperty() {} },
  dataset: {},
  childNodes: [],
  classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  appendChild() {},
  remove() {},
  addEventListener() {},
  setAttribute() {},
  getAttribute: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  set innerHTML(v) {
    this._h = v;
  },
  get innerHTML() {
    return this._h || '';
  },
  set textContent(v) {
    this._h = esc(v);
  },
  get textContent() {
    return String(this._h || '').replace(/<[^>]*>/g, '');
  },
});
const ctx: SandboxCtx = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  Math,
  JSON,
  Date,
  Array,
  Object,
  String,
  Number,
  Set,
  Map,
  Intl,
  RegExp,
  Error,
  localStorage: { getItem: () => null, setItem() {} },
  document: {
    createElement: fakeEl,
    head: fakeEl(),
    body: fakeEl(),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
  },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (f: (t: number) => void) => setTimeout(() => f(Date.now()), 0),
  matchMedia: () => ({ matches: false }),
};
ctx.window = ctx;
vm.createContext(ctx);
const load = (f: string): unknown => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"?]+)(?:[?][^"]*)?"><\/script>/g)].map((m) => m[1]).filter((f) => !f.endsWith('app.js'));
// Chargés à la demande par app.js (#/style, #/test) : styleguide.js fournit M.FORMAT_SAMPLES, vérifiés plus bas.
const LAZY = ['js/styleguide.js', 'js/selftest.js'];
/** window.M (erreur claire si les scripts ne l'ont pas créé). */
const getM = (): ToolM => {
  if (!ctx.M) throw new Error('window.M absent : dist/ est-il compilé (node scripts/build.ts) ?');
  return ctx.M;
};
for (const f of [...scripts, LAZY[0]]) {
  load(f);
  if (f === 'js/services.js') getM().userData.useFixtures = true;
}
// Fichiers présents mais oubliés dans index.html
for (const d of fs.readdirSync(path.join(root, 'js'), { withFileTypes: true }).filter((e) => e.isDirectory())) {
  const walk = (dir: string): string[] =>
    fs
      .readdirSync(path.join(root, dir), { withFileTypes: true })
      .flatMap((e): string[] => (e.isDirectory() ? walk(dir + '/' + e.name) : e.name.endsWith('.js') ? [dir + '/' + e.name] : []));
  walk('js/' + d.name).forEach((f) => {
    if (!scripts.includes(f) && f !== 'js/musique/samples.js' /* chargé à la demande par M.MU.load */ && !LAZY.includes(f))
      console.log(`⚠ ${f} n'est pas chargé par index.html`);
  });
}

const M = getM();
let errors = 0;
const show = (q: unknown): string => JSON.stringify(q, (_k, v: unknown) => (typeof v === 'function' ? undefined : v)).slice(0, 320);
const fail = (id: string, msg: unknown, q?: unknown): void => {
  errors++;
  if (errors < 50) console.log(`✗ ${id}: ${msg}`, q ? show(q) : '');
};

function checkQuestion(id: string, q: GenQuestion | null | undefined, sk?: ToolSkill): boolean {
  if (!q || typeof q.prompt !== 'string' || (!q.prompt && (q.format || q.input) !== 'reflect'))
    return (fail(id, 'prompt manquant', q), false);
  const name = q.format || q.input;
  const f = M.formats[name ?? 'undefined'];
  if (!f) return (fail(id, `format inconnu : ${name}`, q), false);
  if (q.passage && typeof q.passage === 'object' && q.passage.tokens && !Array.isArray(q.passage.tokens))
    return (fail(id, 'passage.tokens invalide', q), false);
  const e = f.validate && f.validate(q);
  if (e) return (fail(id, e, q), false);
  const text =
    q.prompt +
    (q.explain || '') +
    (q.hint || '') +
    JSON.stringify(q.choices || '') +
    JSON.stringify(q.steps || '') +
    JSON.stringify(q.passage || '') +
    JSON.stringify(q.check || '') +
    JSON.stringify(q.pairs || '') +
    JSON.stringify(q.items || '');
  if (/undefined|NaN|\[object Object\]/.test(text)) return (fail(id, 'texte contient undefined/NaN/[object Object]', q), false);
  if (sk) {
    for (const hook of ['check', 'lint'] as const) {
      const fn: Hook | undefined = sk[hook];
      if (typeof fn === 'function') {
        const r = fn.call(sk, q);
        if (r) return (fail(id, `${hook} : ${r}`, q), false);
      }
    }
    const subj = M.subjectById[String(M.subjectOf(sk))];
    if (subj && typeof subj.lint === 'function') {
      const r = subj.lint(q, sk);
      if (r) return (fail(id, `règle de matière : ${r}`, q), false);
    }
  }
  return true;
}

const ids = new Set<string>();
for (const s of M.skills) {
  if (only && !s.id.includes(only)) continue;
  if (ids.has(s.id)) fail(s.id, 'id en double');
  ids.add(s.id);
  for (const k of ['id', 'domain', 'title', 'gen', 'pda'] as const) if (!s[k]) fail(s.id, `champ manquant : ${k}`);
  if (!M.domainById[s.domain]) fail(s.id, `domaine inconnu ${s.domain}`);
  if (s.learn && !M.learnById[s.learn]) fail(s.id, `page Apprendre inconnue : ${s.learn}`);
  for (let lvl = 0; lvl <= 2; lvl++) {
    for (let n = 0; n < 300; n++) {
      let q;
      try {
        q = s.gen({ lvl });
      } catch (e) {
        fail(s.id, 'gen() a planté : ' + (e as Error).message);
        break;
      }
      if (!checkQuestion(s.id, q, s)) break;
    }
  }
}
if (!only) {
  for (const [name, mk] of Object.entries(M.FORMAT_SAMPLES || {})) checkQuestion('exemple:' + name, mk());
  for (const name of Object.keys(M.formats)) if (!(M.FORMAT_SAMPLES || {})[name]) fail('guide', `pas d'exemple pour le format ${name}`);
  const lids = new Set<string>();
  M.learns.forEach((l) => {
    if (lids.has(l.id)) fail(l.id, 'page Apprendre en double');
    lids.add(l.id);
    if (!M.domainById[l.domain]) fail(l.id, `page Apprendre : domaine inconnu ${l.domain}`);
  });
}

const bySubj: Record<string, number> = {};
M.skills.forEach((s) => {
  const sj = M.subjectOf(s) || '?';
  bySubj[sj] = (bySubj[sj] || 0) + 1;
});
console.log(
  `${M.skills.length} habiletés, ${M.learns.length} pages Apprendre (${Object.entries(bySubj)
    .map(([k, v]) => k + ' ' + v)
    .join(', ')}) — ${errors ? errors + ' erreur(s)' : 'OK'}`,
);
process.exit(errors ? 1 : 0);
