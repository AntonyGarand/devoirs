#!/usr/bin/env node
/* Régénère les tableaux de docs/curriculum.md à partir du registre (habiletés, pages Apprendre).
   Usage : npm run curriculum   — remplace tout ce qui suit le marqueur <!-- tableaux --> */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

interface Entry {
  id: string;
  title: string;
  icon?: string;
}
/** Ce que ce script utilise de window.M (site compilé, chargé dans un contexte vm). */
interface ToolM {
  SUBJECTS: Entry[];
  DOMAINS: (Entry & { subject: string; pda?: string })[];
  skills: (Entry & { domain: string; order: number; pda: string; learn?: string; enrichment?: boolean; ungraded?: boolean })[];
  learns: (Entry & { domain: string; short?: string })[];
  learnById: Record<string, Entry | undefined>;
}
/** Global du contexte vm : window = le contexte lui-même; les scripts y ajoutent M. */
interface SandboxCtx {
  [name: string]: unknown;
  window?: SandboxCtx;
  M?: ToolM;
}
const root = path.join(import.meta.dirname, '..');
const web = path.join(root, 'dist'); // site compilé (npm run build)
const fakeEl = () => ({
  style: { setProperty() {} },
  dataset: {},
  childNodes: [],
  classList: { add() {}, remove() {}, toggle() {} },
  appendChild() {},
  remove() {},
  addEventListener() {},
  setAttribute() {},
  getAttribute: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  set innerHTML(v) {},
  get innerHTML() {
    return '';
  },
  set textContent(v) {},
  get textContent() {
    return '';
  },
});
const ctx: SandboxCtx = {
  console: { log() {}, warn() {}, error() {} },
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
  performance: { now: () => 0 },
  requestAnimationFrame() {},
  matchMedia: () => ({ matches: false }),
};
ctx.window = ctx;
vm.createContext(ctx);
const html = fs.readFileSync(path.join(web, 'index.html'), 'utf8');
[...html.matchAll(/<script src="([^"]+)"><\/script>/g)]
  .map((m) => m[1])
  .filter((f) => !f.endsWith('app.js'))
  .forEach((f) => vm.runInContext(fs.readFileSync(path.join(web, f), 'utf8'), ctx, { filename: f }));
if (!ctx.M) throw new Error('window.M absent : dist/ est-il compilé (node scripts/build.ts) ?');
const M = ctx.M;
const strip = (s: unknown): string =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\|/g, '/');
let out = '<!-- tableaux -->\n';
for (const subj of M.SUBJECTS) {
  const doms = M.DOMAINS.filter((d) => d.subject === subj.id);
  const n = M.skills.filter((s) => doms.some((d) => d.id === s.domain)).length;
  out += `\n# ${subj.icon} ${subj.title} (${n} habiletés)\n`;
  for (const d of doms) {
    const sk = M.skills.filter((s) => s.domain === d.id).sort((a, b) => a.order - b.order);
    const ls = M.learns.filter((l) => l.domain === d.id);
    if (!sk.length && !ls.length) continue;
    out += `\n## ${d.icon} ${d.title}\n\n${d.pda ? '*' + strip(d.pda) + '*\n\n' : ''}| Habileté | Référence au programme | Page Apprendre |\n|---|---|---|\n`;
    sk.forEach((s) => {
      out += `| ${s.icon || ''} ${strip(s.title)} (\`${s.id}\`)${s.enrichment ? ' 🌟' : ''}${s.ungraded ? ' 💬' : ''} | ${strip(s.pda)} | ${s.learn && M.learnById[s.learn] ? strip(M.learnById[s.learn]?.title) : ''} |\n`;
    });
    if (ls.length)
      out += `\nPages Apprendre : ${ls.map((l) => '**' + strip(l.title) + '**' + (l.short ? ' (' + strip(l.short) + ')' : '')).join(' · ')}\n`;
  }
}
out += '\n🌟 = enrichissement (au-delà du programme de 2e année, exclu de la révision automatique) · 💬 = carte de discussion non notée.\n';
const file = path.join(root, 'docs', 'curriculum.md');
let doc = fs.readFileSync(file, 'utf8');
const k = doc.indexOf('<!-- tableaux -->');
doc = (k >= 0 ? doc.slice(0, k) : doc.slice(0, doc.indexOf('\n## ')) + '\n\n') + out;
fs.writeFileSync(file, doc);
console.log(`docs/curriculum.md : ${M.skills.length} habiletés, ${M.learns.length} pages`);
