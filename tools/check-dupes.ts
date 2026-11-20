#!/usr/bin/env node
/* Questions distinctes : liste les habiletés / niveaux qui ont moins de 16 questions différentes (deux séries de 8 sans
   répétition) et celles dont une série de 8 serait raccourcie faute de questions nouvelles. Usage : node tools/check-dupes.js [--only <motif>] */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

/** Ce que ce script utilise de window.M (site compilé, chargé dans un contexte vm). */
interface ToolM {
  userData: { useFixtures: boolean };
  skills: { id: string; gen(ctx: { lvl: number }): unknown }[];
  genUnique<Q>(make: () => Q, seen: Set<string>): Q | null;
  qSig(q: unknown): string;
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
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]).filter((f) => !f.endsWith('app.js'));
/** window.M (erreur claire si les scripts ne l'ont pas créé). */
const getM = (): ToolM => {
  if (!ctx.M) throw new Error('window.M absent : dist/ est-il compilé (node scripts/build.ts) ?');
  return ctx.M;
};
for (const f of scripts) {
  load(f);
  if (f === 'js/services.js') getM().userData.useFixtures = true;
}
const M = getM();
const rows: string[] = [];
const LEN = 8;
for (const sk of M.skills.filter((s) => !only || s.id.includes(only)))
  for (const lvl of [0, 1, 2]) {
    // série de 8 comme M.runSession : niveau de l'enfant puis niveaux voisins; on compte les séries raccourcies
    let short = 0,
      minLen = LEN;
    for (let r = 0; r < 20; r++) {
      const seen = new Set<string>();
      let n = 0;
      for (let i = 0; i < LEN; i++) {
        let q = null;
        for (const l of [lvl, lvl - 1, lvl + 1, lvl - 2, lvl + 2].filter((x) => x >= 0 && x <= 2)) {
          q = M.genUnique(() => sk.gen({ lvl: l }), seen);
          if (q) break;
        }
        if (!q) break;
        n++;
      }
      if (n < LEN) short++;
      minLen = Math.min(minLen, n);
    }
    const all = new Set<string>();
    for (let i = 0; i < 300; i++) all.add(M.qSig(sk.gen({ lvl })));
    if (all.size < LEN * 2 || short)
      rows.push(
        `${sk.id.padEnd(22)} niv. ${lvl}  questions distinctes ≈ ${String(all.size).padStart(3)}${short ? `  série raccourcie (min ${minLen}/${LEN})` : ''}`,
      );
  }
console.log(rows.join('\n') || 'Toutes les habiletés ont au moins 16 questions distinctes par niveau.');
