/* =====================================================================
   skills/vocabulaire.js — L'alphabet et les familles de mots (fr-vocabulaire)
     fr-alphabet, fr-familles-mots
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const D = 'fr-vocabulaire';
  const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const VOY = ['a', 'e', 'i', 'o', 'u', 'y'];
  const first = (w) => w.normalize('NFD').charAt(0).toLowerCase();
  const BIGL = (l) => `<span class="fr-big" style="font-size:2rem">${l}</span>`;

  /* ---------------- 🔤 L'ordre alphabétique ---------------- */
  M.registerSkill({
    id: 'fr-alphabet', domain: D, title: 'L\'ordre alphabétique', icon: '🔤', learn: 'fr-alphabet-dico',
    desc: 'Quelle lettre vient avant ? Après ? Place les mots dans l\'ordre.',
    pda: 'Orthographe d\'usage B.1–B.3 (lettres, voyelles et consonnes, ordre alphabétique — ★ 1re, réinvesti); Lexique C.2 (1re lettre seulement)',
    gen({ lvl }) {
      if (lvl === 0 || (lvl === 1 && Math.random() < 0.3)) {
        const i = M.rnd(1, 24);
        const after = Math.random() < 0.5;
        const ans = ABC[after ? i + 1 : i - 1];
        const opts = M.shuffle([ans, ...M.shuffle(ABC.filter((l) => l !== ans && Math.abs(ABC.indexOf(l) - i) <= 3 && l !== ABC[i])).slice(0, 2)]);
        return {
          prompt: `Quelle lettre vient <b>${after ? 'après' : 'avant'}</b> la lettre ${BIGL(ABC[i])} ?`, say: `Quelle lettre vient ${after ? 'après' : 'avant'} la lettre ${ABC[i]} ?`,
          format: 'choice', answer: ans, cols: 3, choices: opts.map((l) => ({ label: BIGL(l), value: l, say: l })),
          hint: 'Chante l\'alphabet dans ta tête.',
          viz: (el) => { el.innerHTML = `<div style="font-size:1.2rem;font-weight:800;letter-spacing:2px;text-align:center;word-break:break-all">${ABC.map((l, k) => (k === i ? `<span class="fr-hl">${l}</span>` : l)).join(' ')}</div>`; },
          explain: `${ABC[i - 1]} → <b>${ABC[i]}</b> → ${ABC[i + 1]} : ${after ? `après ${ABC[i]}, il y a <b>${ans}</b>` : `avant ${ABC[i]}, il y a <b>${ans}</b>`}.`,
        };
      }
      if (lvl === 2 && Math.random() < 0.35) {
        const ls = M.shuffle(ABC).slice(0, 6);
        if (!ls.some((l) => VOY.includes(l))) ls[0] = M.pick(VOY);
        if (ls.every((l) => VOY.includes(l))) ls[1] = 'm';
        return {
          prompt: 'Classe les lettres : <b>voyelles</b> ou <b>consonnes</b> ?', format: 'sort',
          bins: [{ id: 'v', label: '🔴 Voyelles' }, { id: 'c', label: '🔵 Consonnes' }],
          items: ls.map((l) => ({ label: `<span style="font-size:1.6rem">${l}</span>`, bin: VOY.includes(l) ? 'v' : 'c', say: l })),
          hint: 'Les voyelles sont <b>a, e, i, o, u, y</b>. Toutes les autres sont des consonnes.',
          explain: 'Les voyelles : <b>a e i o u y</b>. Les 20 autres lettres sont des consonnes.',
        };
      }
      const n = lvl === 2 ? 5 : 3;
      const pool = M.shuffle(FR.mots((m) => m.em && m.cls === 'nom' && /^[a-zéèêàâîôûœ]/.test(m.w)));
      const picked = [];
      for (const m of pool) { if (picked.length >= n) break; if (!picked.some((x) => first(x.w) === first(m.w))) picked.push(m); }
      const sorted = picked.slice().sort((a, b) => first(a.w).localeCompare(first(b.w)));
      return {
        prompt: 'Place les mots dans l\'<b>ordre alphabétique</b>.', format: 'order',
        choices: picked.map((m) => ({ label: `${m.em}<br><b>${m.w}</b>`, value: m.w, say: m.w })), answer: sorted.map((m) => m.w),
        hint: 'Regarde la <b>première lettre</b> de chaque mot. Laquelle vient en premier dans l\'alphabet ?',
        explain: sorted.map((m) => `<b>${first(m.w)}</b>${m.w.slice(1)}`).join(' → ') + ' : on regarde la première lettre.',
      };
    },
    check(q) { if (q.format === 'order') { const f = q.choices.map((c) => first(c.value)); if (new Set(f).size !== f.length) return 'premières lettres en double'; } },
  });

  /* ---------------- 👨‍👩‍👧 Les familles de mots ---------------- */
  const F = () => FR.FAMILLES;
  M.registerSkill({
    id: 'fr-familles-mots', domain: D, title: 'Les familles de mots', icon: '👪', learn: 'fr-alphabet-dico',
    desc: '<i>Fleur, fleuriste, fleurir</i> : c\'est la même famille !',
    pda: 'Lexique B.1 — familles de mots (→ 2e); Orthographe d\'usage C.2 b.i (lettre muette justifiée par la famille)',
    gen({ lvl }) {
      const fam = M.pick(F());
      const [base, ...kids] = fam.mots;
      if (lvl === 1 && Math.random() < 0.5) {
        const f2 = M.pick(F().filter((x) => x.id !== fam.id && !x.mots.some((w) => fam.mots.includes(w))));
        const items = [...M.shuffle(fam.mots).slice(0, 3).map((w) => ({ label: w, bin: fam.id, say: w })), ...M.shuffle(f2.mots).slice(0, 3).map((w) => ({ label: w, bin: f2.id, say: w }))];
        return {
          prompt: 'Classe les mots dans leur <b>famille</b>.', format: 'sort',
          bins: [{ id: fam.id, label: `${fam.em} famille de <b>${base}</b>` }, { id: f2.id, label: `${f2.em} famille de <b>${f2.mots[0]}</b>` }],
          items: M.shuffle(items),
          hint: 'Cherche le petit mot caché dans chaque mot.',
          explain: `Famille de <b>${base}</b> : ${fam.mots.join(', ')}. Famille de <b>${f2.mots[0]}</b> : ${f2.mots.join(', ')}.`,
        };
      }
      if (lvl === 2) {
        const good = M.shuffle(kids).slice(0, Math.min(3, kids.length));
        const others = M.shuffle([...fam.piege, ...fam.loin]).slice(0, 6 - good.length);
        return {
          prompt: `Touche <b>tous</b> les mots de la famille de <b>${base}</b> ${fam.em}.`,
          format: 'multi', cols: 3, answer: good, choices: M.shuffle([...good, ...others]).map((w) => ({ label: w, value: w, say: w })),
          hint: `Un mot de la même famille contient <b>${base}</b> et parle de la même chose.`,
          explain: `${good.map((w) => `<b>${w}</b>`).join(', ')} : on y entend <b>${base}</b>, et ça parle de la même chose. ${fam.piege.length ? `Attention : <b>${fam.piege[0]}</b> ressemble à ${base}, mais ça ne parle pas de la même chose !` : ''}`,
        };
      }
      const good = M.pick(kids);
      const opts = [good, M.pick(fam.piege), M.pick(fam.loin)];
      return {
        prompt: `Quel mot est de la même <b>famille</b> que <b>${base}</b> ${fam.em} ?`,
        format: 'choice', answer: good, cols: 3, choices: M.shuffle(opts).map((w) => ({ label: `<span style="font-size:1.3rem">${w}</span>`, value: w, say: w })),
        hint: 'Un mot de la même famille <b>contient</b> le mot et parle de la même chose.',
        explain: `<b>${good}</b> est de la famille de <b>${base}</b> : ${fam.mots.join(', ')}. <b>${opts[1]}</b> ressemble, mais ce n'est pas la même idée. <b>${opts[2]}</b> parle du même thème, mais ce n'est pas le même mot.`,
      };
    },
    check(q) {
      const vals = q.choices ? q.choices.map((c) => c.value) : q.items.map((i) => i.label);
      if (!FR.uniqueNorm(vals)) return 'mots en double';
    },
  });
})();
