/* =====================================================================
   musique/skills/rythme.js — domaine mu-rythme
     mu-vite-lent · mu-pulsation · mu-ta-titi
   ta = noire (1 temps), ti-ti = 2 croches (1 temps), chut = soupir (1 temps de silence),
   ta-a = blanche (2 temps, enrichissement 2e cycle).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  const pick = M.pick,
    shuffle = M.shuffle;
  const PENTA = [0, 2, 4, 7, 9, 12, 14];

  /** Petit air de 8 notes (pentatonique), joué au tempo bpm. */
  MU.tune = (bpm, { inst = 'xylo', root = 67, notes } = {}) => {
    const ns = notes || MU.seq(8).map((i) => (i === 0 || i === 7 ? 0 : pick(PENTA.slice(0, 6))));
    const spb = 60 / bpm;
    return ns.map((n, i) => ({ t: i * spb, inst, midi: root + n, vel: 0.75, dur: spb * 0.9 }));
  };
  const SON = (i) => `Son ${i + 1}`;
  const its2 = (evA, evB) => [
    { label: SON(0), events: evA },
    { label: SON(1), events: evB },
  ];
  const choice2 = (items, ans, extra) => ({
    format: 'choice',
    answer: String(ans),
    cols: 2,
    _mu: { items },
    choices: items.map((it, i) => ({ label: MU.tag(i, it.label), value: String(i) })),
    viz: (el) => MU.player(el, items),
    ...extra,
  });

  /* ---------------------------------------------------------------- vite / lent */
  const SCENES = [
    { t: 'une course de chevaux 🐎', v: 'rapide' },
    { t: 'des souris qui courent partout 🐭', v: 'rapide' },
    { t: 'une partie de tague dans la cour 🏃', v: 'rapide' },
    { t: 'endormir un bébé 👶', v: 'lent' },
    { t: 'une tortue qui avance 🐢', v: 'lent' },
    { t: 'un gros éléphant qui marche 🐘', v: 'lent' },
    { t: 'la neige qui tombe doucement ❄️', v: 'lent' },
  ];
  M.registerSkill({
    id: 'mu-vite-lent',
    domain: 'mu-rythme',
    title: 'Rapide ou lent',
    icon: '🐇',
    starter: true,
    learn: 'mu-l-rythme',
    desc: "Le tempo, c'est la vitesse de la musique : rapide comme un lapin, lent comme une tortue.",
    pda: 'Structures G.2.a — tempos lent et rapide (1er cycle); lvl 2 : accelerando / rallentando (G.2.c, 3e cycle, enrichissement : « accélère / ralentit »)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'paire' : lvl === 1 ? pick(['paire', 'scene']) : pick(['change', 'change', 'scene']);
      const notes = MU.seq(8).map((i) => (i === 0 || i === 7 ? 0 : pick(PENTA.slice(0, 6))));
      const inst = pick(['xylo', 'piano']);
      const fast = pick([150, 170]),
        slow = pick([56, 62]);
      if (t === 'paire' || t === 'scene') {
        const fastFirst = pick([true, false]);
        const items = its2(MU.tune(fastFirst ? fast : slow, { inst, notes }), MU.tune(fastFirst ? slow : fast, { inst, notes }));
        if (t === 'paire') {
          const want = pick(['rapide', 'lente']);
          const ans = (want === 'rapide') === fastFirst ? 0 : 1;
          return {
            prompt: `Écoute les deux musiques. Laquelle est la plus <b>${want}</b> ?`,
            ...choice2(items, ans),
            hint: "C'est le même air. Écoute la vitesse : 🐇 ou 🐢 ?",
            explain: `La musique ${ans + 1} est la plus <b>${want}</b>. La vitesse de la musique s'appelle le <b>tempo</b>.`,
          };
        }
        const sc = pick(SCENES);
        const ans = (sc.v === 'rapide') === fastFirst ? 0 : 1;
        return {
          prompt: `Quelle musique va le mieux avec <b>${sc.t}</b> ?`,
          ...choice2(items, ans),
          hint: 'Est-ce que ça va vite ou lentement ?',
          explain: `Pour ${sc.t.replace(/\s\S+$/, '')}, on choisit un tempo <b>${sc.v}</b> : la musique ${ans + 1}.`,
        };
      }
      const acc = pick([true, false]);
      const spbs = MU.seq(12).map((i) => (acc ? 0.62 - i * 0.042 : 0.18 + i * 0.042));
      let tt = 0;
      const evs = spbs.map((s) => {
        const e = { t: tt, inst: 'woodblock', vel: 0.8, dur: 0.1 };
        tt += s;
        return e;
      });
      return {
        prompt: 'Écoute le bloc de bois. Que fait le tempo ?',
        format: 'choice',
        answer: acc ? 'acc' : 'ral',
        choices: shuffle([
          { label: '🐇 Il <b>accélère</b> (de plus en plus vite)', value: 'acc' },
          { label: '🐢 Il <b>ralentit</b> (de plus en plus lent)', value: 'ral' },
          { label: '➡️ Il reste pareil', value: 'pareil', why: 'Compare le début et la fin : les coups sont-ils aussi rapprochés ?' },
        ]),
        hint: 'Au début, les coups sont-ils loin les uns des autres ? Et à la fin ?',
        explain: acc ? 'Les coups se rapprochent : la musique <b>accélère</b>.' : "Les coups s'éloignent : la musique <b>ralentit</b>.",
        _mu: { items: [{ events: evs }] },
        viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });

  /* ---------------------------------------------------------------- pulsation */
  M.registerSkill({
    id: 'mu-pulsation',
    domain: 'mu-rythme',
    title: 'La pulsation',
    icon: '💓',
    learn: 'mu-l-rythme',
    desc: "Compter des coups, reconnaître une pulsation régulière (comme le tic-tac d'une horloge).",
    pda: 'Structures G.3.a — organisation rythmique : la pulsation (1er cycle); Règles de groupe E.b — directives indiquant la pulsation',
    gen({ lvl }) {
      const inst = pick(['tambour', 'woodblock', 'mains', 'claves']);
      if (lvl === 0 || (lvl === 2 && Math.random() < 0.3)) {
        const n = lvl === 0 ? M.pick([2, 3, 4, 5]) : M.pick([5, 6, 7, 8]);
        const spb = lvl === 0 ? 0.6 : 0.42;
        const evs = MU.seq(n).map((i) => ({ t: i * spb, inst, vel: 0.85, dur: 0.15 }));
        return {
          prompt: 'Écoute bien et compte les coups. Combien de coups as-tu entendus ?',
          format: 'number',
          answer: n,
          hint: 'Lève un doigt à chaque coup. Tu peux réécouter !',
          explain: `Il y avait <b>${n}</b> coups.`,
          _mu: { items: [{ events: evs }] },
          viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
        };
      }
      const regular = (spb) => MU.seq(8).map((i) => ({ t: i * spb, inst, vel: 0.85, dur: 0.15 }));
      const irregular = () => {
        const off = M.pick(MU.seq(7));
        let t = 0;
        return MU.seq(8).map((i) => {
          const e = { t, inst, vel: 0.85, dur: 0.15 };
          t += [0.3, 0.75, 0.42, 0.9, 0.25, 0.6, 0.35][(i + off) % 7];
          return e;
        });
      };
      if (lvl === 1) {
        const reg = pick([true, false]);
        const evs = reg ? regular(pick([0.45, 0.5, 0.55, 0.62, 0.7])) : irregular();
        return {
          prompt: "Écoute. Les coups sont-ils <b>réguliers</b>, comme le tic-tac d'une horloge ?",
          format: 'tf',
          answer: reg,
          labels: [{ label: '🕰️ Oui, réguliers' }, { label: '🎲 Non, pas réguliers' }],
          hint: 'Tape doucement sur la table avec les coups. Est-ce toujours la même attente ?',
          explain: reg
            ? "Oui : le temps entre les coups est toujours pareil. C'est une <b>pulsation</b> régulière, comme un cœur qui bat 💓."
            : "Non : parfois les coups sont rapprochés, parfois éloignés. Ce n'est pas une pulsation régulière.",
          _mu: { items: [{ events: evs }] },
          viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
        };
      }
      const regFirst = pick([true, false]);
      const items = its2(regFirst ? regular(0.5) : irregular(), regFirst ? irregular() : regular(0.5));
      return {
        prompt: 'Écoute les deux. Lequel a une <b>pulsation régulière</b> ?',
        ...choice2(items, regFirst ? 0 : 1),
        hint: "La pulsation, c'est comme le cœur : toujours le même temps entre deux battements.",
        explain: `Le son ${regFirst ? 1 : 2} est régulier : on peut marcher dessus au pas, comme un soldat 🥁.`,
      };
    },
  });

  /* ---------------------------------------------------------------- ta / ti-ti / chut */
  const KEY = (p) => p.join('-');
  function patterns(lvl) {
    const pool = lvl === 0 ? ['ta', 'titi'] : ['ta', 'titi', 'chut'];
    let p;
    do {
      p = MU.seq(4).map(() => pick(pool));
    } while (new Set(p).size < 2 || p[0] === 'chut' || (lvl === 2 && !p.includes('chut') && Math.random() < 0.5));
    return p;
  }
  function variants(p, pool) {
    const out = new Map();
    for (let i = 0; i < 60 && out.size < 2; i++) {
      const v = p.slice();
      const k = M.pick(MU.seq(4));
      v[k] = pick(pool.filter((x) => x !== v[k]));
      if (v[0] !== 'chut' && KEY(v) !== KEY(p)) out.set(KEY(v), v);
    }
    return [...out.values()];
  }
  M.registerSkill({
    id: 'mu-ta-titi',
    domain: 'mu-rythme',
    title: 'Ta, ti-ti, chut !',
    icon: '🎶',
    learn: 'mu-l-rythme',
    desc: 'Lire et reconnaître des rythmes : la noire (ta), les deux croches (ti-ti) et le soupir (chut).',
    pda: 'Durée A.2.a — noire, deux croches, silence; organisation rythmique G.3.a; code traditionnel B.1.a — symboles de durée (1er cycle); lvl 2 : la blanche (A.2.b, 2e cycle, enrichissement)',
    gen({ lvl }) {
      const t =
        lvl === 0
          ? pick(['ecoute', 'ecoute', 'nom'])
          : lvl === 1
            ? pick(['ecoute', 'ecoute', 'nom', 'compte'])
            : pick(['ecoute', 'compte', 'blanche']);
      if (t === 'nom') {
        const k = pick(lvl === 0 ? ['ta', 'titi'] : ['ta', 'titi', 'chut']);
        const opts = ['ta', 'titi', 'chut'];
        return {
          prompt: `Comment dit-on ce rythme ? ${MU.rhythmSvg([k], { labels: false })}`,
          format: 'choice',
          answer: k,
          cols: 3,
          choices: opts.map((o) => ({ label: `« ${MU.SYL[o]} »`, value: o })),
          hint: 'Une note seule = « ta ». Deux notes attachées = « ti-ti ». Le petit éclair = un silence, « chut ».',
          explain: `C'est ${k === 'chut' ? 'un <b>soupir</b> : un temps de silence, « chut »' : k === 'ta' ? 'une <b>noire</b> : « ta », un son sur un temps' : 'deux <b>croches</b> : « ti-ti », deux sons rapides sur un temps'}.`,
        };
      }
      if (t === 'compte') {
        const p = patterns(1);
        const n = p.reduce((s, x) => s + MU.BEATS[x].length, 0);
        return {
          prompt: `Combien de <b>sons</b> joue-t-on dans ce rythme ? (Un silence ne fait pas de son.) ${MU.rhythmSvg(p, { labels: false })}`,
          format: 'number',
          answer: n,
          hint: '« ta » = 1 son, « ti-ti » = 2 sons, « chut » = 0 son.',
          explain: `${p.map((x) => `« ${MU.SYL[x]} »`).join(' ')} : ${p.map((x) => MU.BEATS[x].length).join(' + ')} = <b>${n}</b> son${n > 1 ? 's' : ''}.`,
        };
      }
      if (t === 'blanche') {
        const p = shuffle(['taa', 'ta', 'titi']);
        const beats = p.reduce((s, x) => s + MU.beatsOf(x), 0);
        return {
          prompt: `La <b>blanche</b> (une note vide) dure <b>2 temps</b> : « ta-a ». Combien de <b>temps</b> dure ce rythme ? ${MU.rhythmSvg(p)}`,
          format: 'number',
          answer: beats,
          hint: 'ta-a = 2 temps, ta = 1 temps, ti-ti = 1 temps.',
          explain: p.map((x) => `${MU.SYL[x]} = ${MU.beatsOf(x)}`).join(', ') + ` → <b>${beats}</b> temps.`,
        };
      }
      const p = patterns(lvl);
      const pool = lvl === 0 ? ['ta', 'titi'] : ['ta', 'titi', 'chut'];
      const opts = shuffle([p, ...variants(p, pool)]);
      const bpm = lvl === 0 ? 80 : 92;
      const evs = MU.rhythm(p, { bpm, inst: pick(['claves', 'tambour', 'woodblock', 'mains']), countIn: true });
      return {
        prompt: 'Écoute le rythme (après les 4 petits clics). Quel rythme as-tu entendu ?',
        format: 'choice',
        answer: KEY(p),
        cols: 1,
        choices: opts.map((o) => ({ label: MU.rhythmSvg(o, { labels: lvl === 0 }), value: KEY(o) })),
        hint: 'Dis-le dans ta tête pendant que tu écoutes : « ta », « ti-ti », « chut »…',
        explain: `Le rythme était : ${p.map((x) => `« ${MU.SYL[x]} »`).join(' ')}.`,
        _mu: { items: [{ events: evs }], pattern: p },
        viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });
})();
