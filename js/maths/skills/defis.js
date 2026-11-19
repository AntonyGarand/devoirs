/* =====================================================================
   skills/defis.js — domaine « Défis et énigmes » (enrichissement, voir
   docs/hld/maths-problemes.md § 6) : mini-sudoku, balances mystères,
   Qui suis-je ?, compter l'argent (sans virgule, jamais ¢ et $ ensemble).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const D = 'defis';
  const rnd = M.rnd, pick = M.pick, shuffle = M.shuffle;
  const NB = ' ';
  const T = (s) => (M.pb ? M.pb.typo(s) : s);
  const css = (str) => { try { M.css(str); } catch (e) { /* hors navigateur */ } };

  M.registerDomain({ id: D, subject: 'maths', title: 'Défis et énigmes', icon: '🧠', color: '#8338ec', soft: '#efe4fb', pda: 'Enrichissement — Compétence 2 (raisonner); régularités, égalité, argent (2e cycle)' });

  css(`
  .df-grid { display: inline-grid; grid-template-columns: repeat(4, 54px); gap: 0; border: 4px solid var(--ink); border-radius: 10px; overflow: hidden; background: #fff }
  .df-cell { width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; font-size: 30px; border: 1px solid #d9d3c3 }
  .df-cell.r1 { border-bottom: 3px solid var(--ink) } .df-cell.c1 { border-right: 3px solid var(--ink) }
  .df-cell.q { background: #fff1b8; font-size: 26px }
  .df-cell.e { background: #f6f3ea }
  .df-wrap { text-align: center; margin: 6px 0 }
  .df-bal { display: flex; align-items: flex-end; justify-content: center; gap: 10px; margin: 8px 0; flex-wrap: wrap }
  .df-pan { min-width: 110px; min-height: 56px; border-bottom: 6px solid var(--ink); border-radius: 0 0 40px 40px; display: flex; align-items: center; justify-content: center; font-size: 32px; padding: 4px 10px; background: #fbfaf6 }
  .df-pan b { font-size: 34px }
  .df-eqs { font-size: 34px; font-weight: 900 }
  .df-clues { font-size: 1.2rem; font-weight: 700; line-height: 1.8; margin: 0; padding-left: 1.2em }
  .df-money { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: center; margin: 8px 0 }
  .df-money svg { height: 64px; width: auto }
  `);

  /* ==================================================================
     Mini-sudoku 4 × 4 (une case à trouver, solution déterminée)
     ================================================================== */
  const FRUITS = [['🍎', 'pomme'], ['🍌', 'banane'], ['🍇', 'raisins'], ['🍓', 'fraise'], ['🍊', 'orange'], ['🫐', 'bleuets']];
  function latin() {
    let g = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
    if (Math.random() < 0.5) g = [g[1], g[0], g[2], g[3]];
    if (Math.random() < 0.5) g = [g[0], g[1], g[3], g[2]];
    if (Math.random() < 0.5) g = [g[2], g[3], g[0], g[1]];
    const cp = [[0, 1, 2, 3], [1, 0, 2, 3], [0, 1, 3, 2], [2, 3, 0, 1]][rnd(0, 3)];
    g = g.map((r) => cp.map((c) => r[c]));
    const sym = shuffle([0, 1, 2, 3]);
    return g.map((r) => r.map((v) => sym[v]));
  }
  /** Candidats d'une case selon rangée, colonne et bloc 2 × 2 (cases visibles seulement). */
  const cands = (g, hide, r, c) => [0, 1, 2, 3].filter((v) => {
    for (let k = 0; k < 4; k++) {
      if (!hide.has(r * 4 + k) && g[r][k] === v) return false;
      if (!hide.has(k * 4 + c) && g[k][c] === v) return false;
    }
    const br = r - (r % 2), bc = c - (c % 2);
    for (let i = br; i < br + 2; i++) for (let j = bc; j < bc + 2; j++) if (!hide.has(i * 4 + j) && g[i][j] === v) return false;
    return true;
  });
  M.registerSkill({
    id: 'defi-sudoku', domain: D, title: 'Mini-sudoku', icon: '🧩', enrichment: true,
    desc: 'Chaque fruit une seule fois par rangée, par colonne et par carré.',
    pda: 'Enrichissement — C2 : raisonner (déduction logique)',
    gen({ lvl }) {
      const fr = shuffle(FRUITS).slice(0, 4);
      for (let g0 = 0; g0 < 200; g0++) {
        const g = latin();
        const qr = rnd(0, 3), qc = rnd(0, 3), qi = qr * 4 + qc;
        const hide = new Set([qi]);
        const extra = lvl === 0 ? 2 : lvl === 1 ? 6 : 9;
        while (hide.size < extra + 1) hide.add(rnd(0, 15));
        const cs = cands(g, hide, qr, qc);
        if (cs.length !== 1 || cs[0] !== g[qr][qc]) continue;
        const cell = (i) => { const r = Math.floor(i / 4), c = i % 4; return `<span class="df-cell ${r === 1 ? 'r1' : ''} ${c === 1 ? 'c1' : ''} ${i === qi ? 'q' : hide.has(i) ? 'e' : ''}">${i === qi ? '❓' : hide.has(i) ? '' : fr[g[r][c]][0]}</span>`; };
        const ans = g[qr][qc];
        return {
          prompt: T('Chaque fruit va <b>une seule fois</b> dans chaque rangée, chaque colonne et chaque carré. Quel fruit va dans la case ❓ ?'),
          say: 'Chaque fruit va une seule fois dans chaque rangée, chaque colonne et chaque carré. Quel fruit va dans la case jaune ?',
          scene: undefined,
          viz: (el) => { el.innerHTML = `<div class="df-wrap"><div class="df-grid">${Array.from({ length: 16 }, (_, i) => cell(i)).join('')}</div></div>`; },
          format: 'choice', cols: 4, answer: ans,
          choices: fr.map((f, i) => ({ label: `<span style="font-size:2rem" title="${f[1]}">${f[0]}</span>`, value: i })),
          hint: 'Regarde la rangée, la colonne et le carré de la case ❓. Quel fruit manque partout ?',
          explain: `Il manque seulement ${fr[ans][0]} : les autres fruits sont déjà dans la rangée, la colonne ou le carré.`,
          _sudoku: { g, hide: [...hide], qr, qc },
        };
      }
      throw new Error('sudoku introuvable');
    },
    check(q) {
      const s = q._sudoku, cs = cands(s.g, new Set(s.hide), s.qr, s.qc);
      if (cs.length !== 1 || cs[0] !== q.answer) return 'case ❓ non déterminée';
      for (let i = 0; i < 4; i++) if (new Set(s.g[i]).size !== 4 || new Set(s.g.map((r) => r[i])).size !== 4) return 'grille non latine';
    },
  });

  /* ==================================================================
     Balances mystères (objets de valeur inconnue)
     ================================================================== */
  const OBJ = ['🍎', '🍌', '🍐', '🧸', '⚽', '🎁'];
  const pan = (l, r) => `<div class="df-bal"><div class="df-pan">${l}</div><span class="df-eqs">=</span><div class="df-pan"><b>${r}</b></div></div>`;
  M.registerSkill({
    id: 'defi-balances', domain: D, title: 'Les balances mystères', icon: '⚖️', enrichment: true,
    desc: 'Les deux plateaux sont en équilibre. Combien vaut chaque objet ?',
    pda: 'Enrichissement — égalité (Opérations A.4) et C2 : raisonner',
    gen({ lvl }) {
      const [a, b] = shuffle(OBJ);
      if (lvl < 2) {
        const n = lvl === 0 ? 2 : rnd(2, 4), v = rnd(2, lvl === 0 ? 5 : 9), t = n * v;
        return {
          prompt: T(`La balance est en équilibre. Combien vaut un ${a} ? {?}`), format: 'number', answer: v,
          viz: (el) => { el.innerHTML = pan(Array(n).fill(a).join(' '), t); },
          hint: `${n} ${a} pareils font ${t}. Essaie : ${Array(n).fill('?').join(' + ')} = ${t}.`,
          explain: `${Array(n).fill(v).join(' + ')} = ${t}, donc un ${a} vaut ${v}.`, _bal: { n, v, t },
        };
      }
      const v = rnd(2, 6), w = rnd(2, 9);
      if (v === w) return this.gen({ lvl });
      return {
        prompt: T('Deux balances en équilibre. Trouve la valeur de chaque objet.'), format: 'steps',
        passage: undefined,
        steps: [
          { label: `1. ${a}`, prompt: T(`${a} + ${a} = ${2 * v}. Un ${a} vaut {?}`), format: 'number', answer: v, viz: (el) => { el.innerHTML = pan(`${a} ${a}`, 2 * v); }, hint: `Quel double fait ${2 * v} ?` },
          { label: `2. ${b}`, prompt: T(`${a} + ${b} = ${v + w}. Comme ${a} vaut {s1}, un ${b} vaut {?}`), format: 'number', answer: w, viz: (el) => { el.innerHTML = pan(`${a} ${b}`, v + w); }, hint: `${v} + ? = ${v + w}` },
        ],
        explain: `${a} = ${v}, car ${v} + ${v} = ${2 * v}. Puis ${v} + ${w} = ${v + w}, donc ${b} = ${w}.`, _bal: { v, w },
      };
    },
    check(q) {
      const b = q._bal;
      if (q.format === 'number') { if (b.n * b.v !== b.t || q.answer !== b.v) return 'balance fausse'; }
      else if (q.steps[0].answer !== b.v || q.steps[1].answer !== b.w || b.v === b.w) return 'balances fausses';
    },
  });

  /* ==================================================================
     Qui suis-je ? (indices sur un nombre < 100)
     ================================================================== */
  M.registerSkill({
    id: 'defi-qui-suis-je', domain: D, title: 'Qui suis-je ?', icon: '🕵️', enrichment: true,
    desc: 'Lis les indices et trouve le nombre mystère.',
    pda: 'Nombres naturels < 100 (pair/impair, dizaines, unités) et C2 : raisonner',
    gen({ lvl }) {
      const max = lvl === 0 ? 30 : 99;
      const n = rnd(lvl === 0 ? 11 : 12, max);
      const d = Math.floor(n / 10), u = n % 10;
      const clues = [
        { t: `Je suis ${n % 2 ? 'impair' : 'pair'}.`, f: (x) => x % 2 === n % 2 },
        { t: `Je suis entre ${d * 10} et ${d * 10 + 10}.`, f: (x) => x > d * 10 && x < d * 10 + 10 },
        { t: `Mon chiffre des unités est ${u}.`, f: (x) => x % 10 === u },
      ];
      if (u === 0) clues[1] = { t: `J'ai ${d} dizaines.`, f: (x) => Math.floor(x / 10) === d };
      const use = lvl === 0 ? [clues[1], clues[2]] : lvl === 1 ? clues : (() => { const k = n - rnd(1, 3); return [clues[0], clues[1], { t: `Je suis plus grand que ${k}.`, f: (x) => x > k }]; })();
      const ok = (x) => use.every((c) => c.f(x));
      const pool = shuffle([n + 1, n - 1, n + 10, n - 10, n + 2, n - 2, u * 10 + d, n + 5].filter((x) => x > 0 && x <= 99 && x !== n && !ok(x)));
      const opts = [...new Set([n, ...pool])].slice(0, 4);
      if (opts.length < 3) return this.gen({ lvl });
      return {
        prompt: T('Qui suis-je ? Lis les indices.'), format: 'choice', answer: n, cols: 4,
        viz: (el) => { el.innerHTML = `<ol class="df-clues">${use.map((c) => `<li>${T(c.t)}</li>`).join('')}</ol>`; },
        say: 'Qui suis-je ? ' + use.map((c) => c.t).join(' '),
        choices: shuffle(opts).map((x) => ({ label: String(x), value: x, why: x === n ? '' : `Relis les indices : ${x} n'en respecte pas un.` })),
        hint: 'Barre les nombres qui ne respectent pas le premier indice, puis le deuxième…',
        explain: `${n} respecte tous les indices : ${use.map((c) => c.t).join(' ')}`, _clues: use.map((c) => c.f), _n: n,
      };
    },
    check(q) {
      const good = q.choices.filter((c) => q._clues.every((f) => f(c.value)));
      if (good.length !== 1 || good[0].value !== q._n) return `${good.length} choix respectent les indices`;
    },
  });

  /* ==================================================================
     L'argent : compter des pièces ou des billets (enrichissement)
     ================================================================== */
  const COIN = {
    5: { r: 21, fill: '#d9d9d9', txt: '5 ¢' }, 10: { r: 18, fill: '#e6e6e6', txt: '10 ¢' }, 25: { r: 24, fill: '#cfcfcf', txt: '25 ¢' },
    100: { r: 26, fill: '#e9b949', txt: '1 $' }, 200: { r: 28, fill: '#e9b949', ring: '#c7c7c7', txt: '2 $' },
  };
  const BILL = { 5: '#7fb3e6', 10: '#b48ad6', 20: '#7cc79a' };
  const coinSvg = (v) => { const c = COIN[v]; return `<svg viewBox="0 0 64 64" role="img" aria-label="${c.txt}"><circle cx="32" cy="32" r="${c.r + 3}" fill="${c.ring || c.fill}" stroke="#7a7466" stroke-width="2"/><circle cx="32" cy="32" r="${c.r - 2}" fill="${c.fill}"/><text x="32" y="38" text-anchor="middle" font-size="${c.r > 22 ? 15 : 13}" font-weight="900" fill="#2b2d42">${c.txt}</text></svg>`; };
  const billSvg = (v) => `<svg viewBox="0 0 110 60" role="img" aria-label="${v} $"><rect x="3" y="3" width="104" height="54" rx="6" fill="${BILL[v]}" stroke="#2b2d42" stroke-width="2"/><circle cx="55" cy="30" r="15" fill="#ffffffaa"/><text x="55" y="37" text-anchor="middle" font-size="20" font-weight="900" fill="#2b2d42">${v} $</text></svg>`;
  M.registerSkill({
    id: 'argent-compter', domain: D, title: 'Compter l\'argent', icon: '💰', enrichment: true,
    desc: 'Compte les pièces et les billets. (Les cents et les dollars ne se mélangent pas.)',
    pda: 'Enrichissement — argent (matériel de numération, Nombres naturels A.4c); notation décimale au 2e cycle',
    parentNote: 'Pièces et billets génériques (pas de reproduction officielle). Pas de virgule : on compte soit des cents, soit des dollars entiers.',
    gen({ lvl }) {
      let items, unit;
      if (lvl === 0) { const c = pick([5, 10]); const n = rnd(2, c === 5 ? 9 : 8); items = Array(n).fill(c); unit = '¢'; }
      else if (lvl === 1 && Math.random() < 0.5) { const [x, y] = pick([[10, 5], [25, 10], [25, 5]]); items = [...Array(rnd(1, 3)).fill(x), ...Array(rnd(1, 3)).fill(y)]; unit = '¢'; }
      else if (lvl === 1) { items = [...Array(rnd(1, 4)).fill(200), ...Array(rnd(1, 4)).fill(100)]; unit = '$'; }
      else { items = [...Array(rnd(0, 1)).fill('b20'), ...Array(rnd(1, 2)).fill('b10'), ...Array(rnd(0, 1)).fill('b5'), ...Array(rnd(1, 3)).fill(200), ...Array(rnd(0, 3)).fill(100)]; unit = '$'; }
      const val = (it) => (typeof it === 'string' ? +it.slice(1) : unit === '$' ? it / 100 : it);
      const total = items.reduce((s, it) => s + val(it), 0);
      if (total >= 100 || (lvl === 2 && total > 50)) return this.gen({ lvl });
      const html = items.map((it) => (typeof it === 'string' ? billSvg(+it.slice(1)) : coinSvg(it))).join('');
      const steps = items.map(val);
      return {
        prompt: T(`Combien d'argent y a-t-il ? {?}${NB}${unit}`), format: 'number', answer: total, unit: undefined,
        viz: (el) => { el.innerHTML = `<div class="df-money">${html}</div>`; },
        hint: unit === '¢' ? `Compte par bonds : commence par les plus grosses valeurs.` : 'Commence par les billets, puis les pièces de 2 $, puis celles de 1 $.',
        explain: `On compte par bonds : ${steps.reduce((acc, v, i) => (acc.push((i ? acc[i - 1] : 0) + v), acc), []).join(', ')}. Il y a ${total}${NB}${unit}.`, _money: { steps, total },
      };
    },
    check(q) { if (q._money.steps.reduce((a, b) => a + b, 0) !== q.answer) return 'total faux'; },
  });
})();
