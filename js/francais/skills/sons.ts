/* =====================================================================
   skills/sons.js — Les sons et les syllabes (fr-sons)
     fr-syllabes, fr-rimes, fr-entendre-son, fr-sons-ecrits
   Aucun son isolé n'est lu à voix haute : on dit toujours un mot-repère.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const D = 'fr-sons';
  const claps = (n) => '👏'.repeat(n);
  const pic = (m) => `<div class="fr-em">${m.em}</div>`;

  /* ---------------- 👏 Je compte les syllabes ---------------- */
  const SYL = () => FR.mots((m) => m.syl && m.em);
  M.registerSkill({
    id: 'fr-syllabes',
    domain: D,
    title: 'Je compte les syllabes',
    icon: '👏',
    starter: true,
    learn: 'fr-carte-sons',
    desc: 'Tape dans tes mains pour chaque syllabe.',
    pda: 'Lire C.1 b.iv — décodage par syllabes (→ 1re, ★ 2e)',
    parentNote:
      "On compte les syllabes <b>orales</b> (ce qu'on entend). Les mots où le compte varie à l'oral (<i>e</i> muet, « ch'val ») sont exclus.",
    gen({ lvl }) {
      const pool = SYL().filter((m) => (lvl === 0 ? m.syl.length <= 2 : lvl === 1 ? m.syl.length >= 2 : m.syl.length >= 2));
      const m = M.pick(pool);
      const n = m.syl.length;
      const showMe = async (el) => {
        el.innerHTML = `${pic(m)}<div style="text-align:center">${M.ui.wordParts(m.w, m.syl)}</div><div class="fr-big fr-claps"></div>`;
        const box = M.$('.fr-claps', el);
        for (let i = 0; i < n; i++) {
          await M.sleep(450);
          if (!el.isConnected) return;
          box.textContent += '👏';
          M.sfx.pop();
        }
      };
      const explain = `<b>${m.w}</b> : ${m.syl.join('-')} → ${n} syllabe${n > 1 ? 's' : ''} ${claps(n)}.`;
      if (lvl === 2) {
        const others = M.shuffle(
          SYL()
            .filter((x) => x.w !== m.w)
            .flatMap((x) => x.syl),
        ).filter((s) => !m.syl.includes(s) && s.length >= 2);
        return {
          prompt: `Écoute, puis construis le mot <b>à l'écrit</b> avec les syllabes.`,
          audio: { text: m.w, autoplay: 'once' },
          scene: [{ emoji: m.em, label: m.w }],
          format: 'build',
          join: '',
          tiles: m.syl.concat(others.slice(0, 1)),
          answer: m.syl.slice(),
          hint: 'Dis le mot lentement en tapant dans tes mains. Quelle syllabe vient en premier ?',
          explain,
        };
      }
      const opts = lvl === 0 ? [1, 2] : M.range(Math.max(1, n - 1), Math.max(1, n - 1) + 2);
      if (!opts.includes(n)) opts.push(n);
      return {
        prompt: `Combien de syllabes entends-tu dans <b>${m.w}</b> ?`,
        audio: { text: m.w, autoplay: 'once' },
        viz: (el) => {
          el.innerHTML = `${pic(m)}<div class="fr-big">${m.w}</div>`;
        },
        showMe,
        format: 'choice',
        answer: n,
        cols: opts.length,
        choices: opts.map((k) => ({ label: `<span class="fr-claps">${claps(k)}</span><br><small>${k}</small>`, value: k })),
        hint: 'Dis le mot lentement en tapant dans tes mains.',
        explain,
      };
    },
  });

  /* ---------------- 🎵 Les mots qui riment ---------------- */
  const RIM = () => FR.mots((m) => m.r && m.em);
  const byRime = () => {
    const g = {};
    RIM().forEach((m) => (g[m.r] = g[m.r] || []).push(m));
    return g;
  };
  const imgChoice = (m) => ({ label: `<span style="font-size:2.2rem">${m.em}</span><br>${m.w}`, value: m.w, say: m.w });
  M.registerSkill({
    id: 'fr-rimes',
    domain: D,
    title: 'Les mots qui riment',
    icon: '🎵',
    learn: 'fr-carte-sons',
    desc: 'Trouve les mots qui finissent par le même son.',
    pda: 'Lire A.3 j — jeux de sonorités : la rime (→ 1re, → 2e)',
    gen({ lvl }) {
      const G = byRime();
      const keys = Object.keys(G).filter((k) => G[k].length >= (lvl === 2 ? 4 : 2));
      if (lvl === 1) {
        const ks = M.shuffle(Object.keys(G).filter((k) => G[k].length >= 2)).slice(0, 3);
        const pairs = ks.map((k) => {
          const [a, b] = M.shuffle(G[k]);
          return { left: `${a.em} ${a.w}`, right: `${b.em} ${b.w}`, sayLeft: a.w, sayRight: b.w };
        });
        return {
          prompt: 'Associe les mots qui <b>riment</b>.',
          format: 'match',
          pairs,
          hint: 'Écoute la fin de chaque mot.',
          explain: pairs.map((p) => `${p.sayLeft} – ${p.sayRight}`).join(' · ') + ' : la fin des mots sonne pareil.',
        };
      }
      const k = M.pick(keys);
      const [target, ...rest] = M.shuffle(G[k]);
      const others = M.shuffle(RIM().filter((m) => m.r !== k));
      if (lvl === 2) {
        const good = rest.slice(0, 3);
        const bad = [];
        for (const o of others) {
          if (bad.length >= 3) break;
          if (!bad.some((b) => b.r === o.r)) bad.push(o);
        }
        return {
          prompt: `Touche <b>tous</b> les mots qui riment avec <b>${target.w}</b> ${target.em}.`,
          audio: { text: target.w, autoplay: 'once' },
          format: 'multi',
          answer: good.map((m) => m.w),
          cols: 3,
          choices: M.shuffle(good.concat(bad)).map(imgChoice),
          hint: `Écoute la fin du mot : <b>${target.w}</b>.`,
          explain: `${good.map((m) => m.w).join(', ')} riment avec <b>${target.w}</b> : ils finissent par le même son.`,
        };
      }
      const good = rest[0];
      const bad = [];
      for (const o of others) {
        if (bad.length >= 2) break;
        if (!bad.some((b) => b.r === o.r)) bad.push(o);
      }
      return {
        prompt: `Quel mot rime avec <b>${target.w}</b> ${target.em} ?`,
        audio: { text: target.w, autoplay: 'once' },
        format: 'choice',
        answer: good.w,
        choices: M.shuffle([good, ...bad]).map(imgChoice),
        hint: `Écoute la fin du mot : <b>${target.w}</b>.`,
        explain: `<b>${target.w}</b> et <b>${good.w}</b> finissent par le même son : ils riment !`,
      };
    },
    check(q) {
      if (q.format === 'choice' && q.choices.filter((c) => FR.mot(c.value).r === FR.mot(q.answer).r).length !== 1)
        return 'plusieurs rimes possibles';
    },
  });

  /* ---------------- 👂 J'entends le son ---------------- */
  const SON_IDS = ['ou', 'on', 'an', 'in', 'oi', 'o', 'ch', 'j', 'z', 'f', 'eu', 'é', 'è', 'k', 's', 'gn', 'ill'];
  const SONW = () => FR.mots((m) => m.gr && m.em);
  const posLabel = { debut: '⬅️ au début', milieu: '⏺️ au milieu', fin: '➡️ à la fin' };
  /** Syllabe (début/milieu/fin) où l'on entend le son — null si ambigu. */
  const sylPos = (m, id) => {
    if (!m.syl || m.syl.length < 2 || m.syl.join('') !== m.w) return null;
    const idx = FR.letterIdx(m, id);
    if (!idx.length) return null;
    const parts = m.gr.filter((p) => p.s === id);
    if (parts.length !== 1) return null;
    let acc = 0;
    const sylOf = (i) => {
      acc = 0;
      for (let k = 0; k < m.syl.length; k++) {
        acc += m.syl[k].length;
        if (i < acc) return k;
      }
      return m.syl.length - 1;
    };
    const k0 = sylOf(idx[0]),
      k1 = sylOf(idx[idx.length - 1]);
    if (k0 !== k1) return null;
    return { k: k0, p: k0 === 0 ? 'debut' : k0 === m.syl.length - 1 ? 'fin' : 'milieu' };
  };
  M.registerSkill({
    id: 'fr-entendre-son',
    domain: D,
    title: "J'entends le son",
    icon: '👂',
    learn: 'fr-carte-sons',
    desc: 'Est-ce que tu entends le son dans le mot ?',
    pda: 'Lire C.1 c.ii — correspondances lettres-sons (→ 1re, ★ 2e)',
    gen({ lvl }) {
      const W = SONW();
      const ids = SON_IDS.filter((id) => W.filter((m) => FR.hasSon(m, id)).length >= 3);
      if (lvl === 2) {
        const cand = [];
        ids.forEach((id) =>
          W.forEach((m) => {
            const r = sylPos(m, id);
            if (r) cand.push({ id, m, p: r.p, k: r.k });
          }),
        );
        const { id, m, p, k } = M.pick(cand);
        const opts = m.syl.length >= 3 ? ['debut', 'milieu', 'fin'] : ['debut', 'fin'];
        return {
          prompt: `Où entends-tu ${FR.sonRef(id)} dans <b>${m.w}</b> ?`,
          say: `Où entends-tu ${FR.sonSay(id)} dans ${m.w} ?`,
          audio: { text: m.w, autoplay: 'once' },
          viz: (el) => {
            el.innerHTML = `${pic(m)}<div style="text-align:center">${M.ui.wordParts(m.w, m.syl)}</div>`;
          },
          format: 'choice',
          answer: p,
          cols: opts.length,
          choices: opts.map((o) => ({ label: posLabel[o], value: o })),
          hint: 'Dis le mot lentement, une syllabe à la fois.',
          explain: `${m.syl.map((s, i) => (i === k ? `<b>${s}</b>` : s)).join('-')} : on entend ${FR.son(id).label} ${p === 'debut' ? 'au début' : p === 'fin' ? 'à la fin' : 'au milieu'} (${FR.grHtml(m, id)}).`,
        };
      }
      const id = M.pick(ids);
      const yes = M.shuffle(W.filter((m) => FR.hasSon(m, id)));
      const no = M.shuffle(W.filter((m) => !FR.hasNear(m, id)));
      if (lvl === 0) {
        const ans = Math.random() < 0.5;
        const m = ans ? yes[0] : no[0];
        return {
          prompt: `Entends-tu ${FR.sonRef(id)} dans ce mot ?`,
          say: `Entends-tu ${FR.sonSay(id)} dans le mot ${m.w} ?`,
          audio: { text: m.w, autoplay: 'once' },
          scene: [{ emoji: m.em, label: 'écoute le mot' }],
          format: 'tf',
          answer: ans,
          labels: [{ label: "👂 Oui, je l'entends" }, { label: '🙉 Non' }],
          hint: 'Écoute le mot lentement, une syllabe à la fois.',
          explain: ans
            ? `Dans <b>${FR.grHtml(m, id)}</b>, on entend ${FR.son(id).label}.`
            : `Dans <b>${m.w}</b>, on n'entend pas ${FR.son(id).label}.`,
        };
      }
      const good = yes.slice(0, M.rnd(2, 3));
      const bad = no.slice(0, 6 - good.length);
      return {
        prompt: `Touche les images où tu entends ${FR.sonRef(id)}.`,
        say: `Touche les images où tu entends ${FR.sonSay(id)}. Touche le petit haut-parleur pour écouter chaque mot.`,
        format: 'multi',
        cols: 3,
        answer: good.map((m) => m.w),
        choices: M.shuffle(good.concat(bad)).map((m) => ({ label: `<span style="font-size:2.4rem">${m.em}</span>`, value: m.w, say: m.w })),
        hint: 'Dis chaque mot à voix basse. Écoute bien.',
        explain: `On entend ${FR.son(id).label} dans : ${good.map((m) => FR.grHtml(m, id)).join(', ')}.`,
      };
    },
    check(q) {
      if (q.format === 'multi') {
        const bad = q.choices.filter((c) => !q.answer.includes(c.value));
        if (!bad.length) return 'aucun « non »';
      }
    },
  });

  /* ---------------- 🔡 Les sons qui s'écrivent de plusieurs façons ---------------- */
  const SIMPLE = { ou: ['o', 'u'], on: ['an', 'o'], oi: ['oa', 'o'], ch: ['c', 'sh'] };
  const MULTI = { o: ['o', 'au', 'eau'], an: ['an', 'en'], in: ['in', 'ain', 'ein'], è: ['è', 'ê', 'ai', 'ei'], é: ['é', 'er', 'ez'] };
  /** Mot à trou : le graphème du son remplacé par « __ ». */
  const holed = (m, part) => m.gr.map((p) => (p === part ? '<span class="fr-hl">&nbsp;?&nbsp;</span>' : M.esc(p.g))).join('');
  const fillWith = (m, part, g) => m.gr.map((p) => (p === part ? g : p.g)).join('');
  const RULES2 = [
    {
      w: 'garçon',
      hole: 3,
      opts: ['ç', 'c', 's'],
      ans: 'ç',
      why: 'Devant <b>o</b>, le <b>c</b> fait [k]. Pour faire [s], on ajoute une cédille : <b>ç</b>.',
    },
    { w: 'leçon', hole: 2, opts: ['ç', 'c', 'ss'], ans: 'ç', why: 'Devant <b>o</b>, il faut une cédille pour faire [s] : <b>ç</b>.' },
    { w: 'chambre', hole: 3, opts: ['m', 'n'], ans: 'm', why: 'Devant <b>b</b> et <b>p</b>, on écrit <b>m</b> : cha<b>m</b>bre.' },
    { w: 'campagne', hole: 2, opts: ['m', 'n'], ans: 'm', why: 'Devant <b>p</b>, on écrit <b>m</b> : ca<b>m</b>pagne.' },
    { w: 'printemps', hole: 6, opts: ['m', 'n'], ans: 'm', why: 'Devant <b>p</b>, on écrit <b>m</b> : printe<b>m</b>ps.' },
    { w: 'champignon', hole: 3, opts: ['m', 'n'], ans: 'm', why: 'Devant <b>p</b>, on écrit <b>m</b> : cha<b>m</b>pignon.' },
    { w: 'neige', hole: 3, opts: ['g', 'j'], ans: 'g', why: 'Devant <b>e</b>, le <b>g</b> fait [j] : nei<b>g</b>e.' },
    { w: 'orange', hole: 4, opts: ['g', 'j'], ans: 'g', why: 'Devant <b>e</b>, le <b>g</b> fait [j] : oran<b>g</b>e.' },
    { w: 'girafe', hole: 0, opts: ['g', 'j'], ans: 'g', why: 'Devant <b>i</b>, le <b>g</b> fait [j] : <b>g</b>irafe.' },
    { w: 'citron', hole: 0, opts: ['c', 's'], ans: 'c', why: 'Devant <b>i</b>, le <b>c</b> fait [s] : <b>c</b>itron.' },
  ];
  M.registerSkill({
    id: 'fr-sons-ecrits',
    domain: D,
    title: "Les sons qui s'écrivent de plusieurs façons",
    icon: '🔡',
    learn: 'fr-carte-sons',
    desc: "<i>o</i>, <i>au</i> ou <i>eau</i> ? Choisis la bonne façon d'écrire le son.",
    pda: "Orthographe d'usage C.1 a–b (→ 1re, ★ 2e); C.3 a — c/ç, g/ge, m devant b et p (→ 2e, défi)",
    gen({ lvl }) {
      const W = FR.mots((m) => m.gr && m.em);
      if (lvl === 2 && Math.random() < 0.5) {
        const r = M.pick(RULES2);
        const shown = [...r.w].map((c, i) => (i === r.hole ? '<span class="fr-hl">&nbsp;?&nbsp;</span>' : c)).join('');
        return {
          prompt: `Quelle lettre manque ? <div class="fr-big">${shown}</div>`,
          say: `Quelle lettre manque dans le mot ${r.w} ?`,
          audio: { text: r.w, autoplay: 'once' },
          format: 'choice',
          answer: r.ans,
          cols: r.opts.length,
          choices: r.opts.map((o) => ({ label: `<span class="fr-big">${o}</span>`, value: o })),
          hint: 'Regarde la lettre qui vient juste après le trou.',
          explain: r.why,
        };
      }
      if (lvl === 2) {
        const ids = ['an', 'in', 'on', 'o', 'oi', 'ou', 'eu', 'ch', 'è', 'gn', 'ill'];
        const cand = W.filter((m) => ids.some((id) => FR.hasSon(m, id) && m.gr.some((p) => p.s === id && p.g.length > 1)));
        const m = M.pick(cand);
        const id = M.pick(ids.filter((id) => FR.hasSon(m, id) && m.gr.some((p) => p.s === id && p.g.length > 1)));
        const idx = FR.letterIdx(m, id);
        return {
          prompt: `Touche les lettres qui font ${FR.sonRef(id)} dans <b>${m.w}</b>.`,
          say: `Touche les lettres qui font ${FR.sonSay(id)} dans le mot ${m.w}.`,
          scene: [{ emoji: m.em, label: m.w }],
          format: 'tapwords',
          mode: 'letters',
          words: [...m.w],
          answer: idx,
          select: idx.length > 1 ? 'many' : 'one',
          hint: "Un son peut s'écrire avec plusieurs lettres.",
          explain: `<b>${FR.grHtml(m, id)}</b> : ${FR.son(id).label} s'écrit ici <b>${m.gr
            .filter((p) => p.s === id)
            .map((p) => p.g)
            .join(' et ')}</b>.`,
        };
      }
      const table = lvl === 0 ? SIMPLE : MULTI;
      const cand = [];
      W.forEach((m) =>
        m.gr.forEach((p) => {
          if (lvl === 0 && table[p.s] && p.g === p.s && m.gr.filter((x) => x.s === p.s).length === 1) cand.push({ m, p, id: p.s });
          if (lvl === 1 && table[p.s] && table[p.s].includes(p.g) && m.gr.filter((x) => x.s === p.s).length === 1)
            cand.push({ m, p, id: p.s });
        }),
      );
      // lvl 1 : parfois classer des mots selon la graphie
      if (lvl === 1 && Math.random() < 0.35) {
        const id = M.pick(['o', 'an', 'in', 'è']);
        const gs = table[id];
        const items = [];
        M.shuffle(cand.filter((c) => c.id === id)).forEach((c) => {
          if (items.length < 6 && items.filter((x) => x.bin === c.p.g).length < 2 && !items.some((x) => x.w === c.m.w))
            items.push({ label: `${c.m.em} ${FR.grHtml(c.m, id)}`, bin: c.p.g, say: c.m.w, w: c.m.w });
        });
        const usedBins = gs.filter((g) => items.some((it) => it.bin === g));
        if (usedBins.length >= 2 && items.length >= 4) {
          return {
            prompt: `Classe les mots selon la façon d'écrire ${FR.sonRef(id)}.`,
            say: `Classe les mots selon la façon d'écrire ${FR.sonSay(id)}.`,
            format: 'sort',
            bins: usedBins.map((g) => ({ id: g, label: `<span class="fr-big" style="font-size:1.6rem">${g}</span>` })),
            items: items.map(({ w, ...it }) => it),
            hint: 'Regarde les lettres en couleur dans chaque mot.',
            explain: FR.son(id).regle || '',
          };
        }
      }
      let m, p, id, opts;
      for (let t = 0; t < 50; t++) {
        ({ m, p, id } = M.pick(cand));
        const wrong = (lvl === 0 ? SIMPLE[id] : MULTI[id].filter((g) => g !== p.g)).filter((g) => !FR.isReal(fillWith(m, p, g)));
        opts = [p.g, ...M.shuffle(wrong).slice(0, 2)];
        if (opts.length >= 2) break;
      }
      return {
        prompt: `Complète le mot : <div class="fr-big">${holed(m, p)}</div>`,
        say: `Complète le mot ${m.w}. On entend ${FR.sonSay(id)}.`,
        audio: { text: m.w, autoplay: 'once' },
        scene: [{ emoji: m.em, label: m.w }],
        format: 'choice',
        answer: p.g,
        cols: opts.length,
        choices: M.shuffle(opts).map((g) => ({ label: `<span class="fr-big" style="font-size:1.8rem">${g}</span>`, value: g })),
        hint: FR.son(id).regle || `Le son ${FR.son(id).label} s'écrit avec plusieurs lettres.`,
        explain: `On écrit <b>${FR.grHtml(m, id)}</b>. ${FR.son(id).regle || ''}`,
      };
    },
    check(q) {
      if (q.format === 'choice' && q.choices.length < 2) return 'pas assez de choix';
    },
  });
})();
