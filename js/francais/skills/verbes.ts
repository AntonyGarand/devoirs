/* =====================================================================
   skills/verbes.js — Les verbes au présent (fr-verbes)
     fr-etre-avoir, fr-verbes-frequents
   Formes MÉMORISÉES avec le pronom (PDA Conjugaison C.1) : on ne parle ni
   de radical ni de terminaison (système des verbes en -er : 3e année).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const D = 'fr-verbes';
  // Une personne (k) = un pronom représentatif choisi au hasard
  const REP = [['je'], ['tu'], ['il', 'elle', 'on'], ['nous'], ['vous'], ['ils', 'elles']];
  const pronOf = (k: number) => M.pick(REP[k]);
  const elided = (v: FrVerbeId, k: number) => k === 0 && /^[aeiouéêh]/.test(FR.VERBES[v].f[0]);
  const pronLabel = (v: FrVerbeId, k: number, p: string) => (elided(v, k) ? "j'" : p);
  const CAP = (s: string) => M.fr.cap(s);

  /** match pronom ↔ forme (formes toutes différentes). */
  function matchQ(v: FrVerbeId, ks: number[]): QuestionOf<'match'> {
    const V = FR.VERBES[v];
    const seen = new Set<string>();
    const ok = ks.filter((k) => {
      const f = V.f[k];
      if (seen.has(f)) return false;
      seen.add(f);
      return true;
    });
    const pairs = ok.map((k) => {
      const p = pronOf(k);
      return { left: pronLabel(v, k, p), right: V.f[k], sayLeft: FR.conj(v, p), sayRight: FR.conj(v, p) };
    });
    return {
      prompt: `Associe chaque pronom à la bonne forme du verbe <b>${V.inf}</b> ${V.em}.`,
      format: 'match',
      pairs,
      hint: `Dis la comptine : ${[0, 1, 2].map((k) => FR.conj(v, REP[k][0])).join(', ')}…`,
      explain: `<table class="fr-table">${pairs.map((p) => `<tr><td class="p">${p.left}</td><td class="v">${p.right}</td></tr>`).join('')}</table>`,
    };
  }
  /** Phrase à trous : « Nous {0} au parc. » — banque : bonne forme + autres personnes / autre verbe. */
  function clozeQ(v: FrVerbeId, k: number, others: string[]): QuestionOf<'cloze'> {
    const V = FR.VERBES[v];
    const p = pronOf(k);
    const good = V.f[k];
    const bank = [good];
    others.forEach((x) => {
      if (!bank.includes(x)) bank.push(x);
    });
    const suite = M.pick(FR.SUITE[v]);
    const lead = elided(v, k) ? "J'" : CAP(p) + ' ';
    return {
      prompt: 'Complète la phrase avec le bon verbe.',
      format: 'cloze',
      text: `${lead}{0} ${suite}.`,
      blanks: [{ choices: M.shuffle(bank.slice(0, 3)), answer: good }],
      hint: `Avec <b>${elided(v, k) ? 'je' : p}</b>, le verbe <b>${V.inf}</b> devient… Dis la comptine !`,
      explain: `Avec <b>${elided(v, k) ? 'je' : p}</b>, <b>${V.inf}</b> devient <b>${good}</b> : ${FR.conj(v, p)} ${suite}.`,
    };
  }
  /** Dictée d'une forme : on entend « vous êtes », on écrit « êtes » après le pronom affiché. */
  function textQ(v: FrVerbeId, k: number): QuestionOf<'text'> {
    const V = FR.VERBES[v];
    const p = pronOf(k);
    const g = FR.conj(v, p);
    const el = elided(v, k);
    return {
      prompt: `Écoute et écris le verbe <b>${V.inf}</b>.`,
      audio: { seq: [g, g], pause: 800, autoplay: 'once' },
      format: 'text',
      prefix: el ? "j'" : p,
      answer: V.f[k],
      keyboard: 'accents',
      hint: `Dis la comptine du verbe <b>${V.inf}</b> jusqu'à <b>${el ? 'je' : p}</b>.`,
      explain: `On écrit <b>${g}</b>.${/^(êtes|faites|dites)$/.test(V.f[k]) ? ' Attention : avec <b>vous</b>, ce verbe ne finit pas par <b>-ez</b> !' : ''}${V.f[k] === 'vont' || V.f[k] === 'font' || V.f[k] === 'sont' || V.f[k] === 'ont' ? ' Avec <b>ils</b> et <b>elles</b>, ce verbe finit par <b>-ont</b>.' : ''}`,
    };
  }
  const distinct = (v: FrVerbeId, n: number, pool: number[]) => {
    const out: number[] = [];
    for (const k of M.shuffle(pool)) {
      if (out.length >= n) break;
      if (!out.some((j) => FR.VERBES[v].f[j] === FR.VERBES[v].f[k])) out.push(k);
    }
    return out;
  };

  M.registerSkill({
    id: 'fr-etre-avoir',
    domain: D,
    title: 'Être et avoir au présent',
    icon: '⭐',
    learn: 'fr-verbes-present',
    desc: "<i>Je suis, tu es…</i> <i>J'ai, tu as…</i>",
    pda: "Conjugaison C.1 — formes mémorisées de être et avoir à l'indicatif présent (→ 1re, ★ 2e); Accords A.5 a–b (pronoms)",
    gen({ lvl }) {
      if (lvl === 0) {
        const v = 'etre';
        return Math.random() < 0.5 ? matchQ(v, [0, 1, 2]) : clozeQ(v, M.pick([0, 1, 2]), FR.VERBES.etre.f.slice(0, 3));
      }
      if (lvl === 1) {
        const v = M.pick<FrVerbeId>(['etre', 'avoir']);
        if (Math.random() < 0.5) return matchQ(v, distinct(v, 4, [0, 1, 2, 3, 4, 5]));
        const k = M.rnd(0, 5);
        const other = v === 'etre' ? 'avoir' : 'etre';
        // banque : même personne de l'autre verbe + une autre personne du même verbe
        return clozeQ(v, k, [FR.VERBES[other].f[k], M.pick(FR.VERBES[v].f.filter((f) => f !== FR.VERBES[v].f[k]))]);
      }
      const v = M.pick<FrVerbeId>(['etre', 'avoir']);
      return Math.random() < 0.6
        ? textQ(v, M.rnd(0, 5))
        : clozeQ(v, M.rnd(0, 5), [FR.VERBES[v === 'etre' ? 'avoir' : 'etre'].f[M.rnd(0, 5)], M.pick(FR.VERBES[v].f)]);
    },
    check(q) {
      if (q.format === 'cloze' && new Set(q.blanks[0].choices).size !== q.blanks[0].choices.length) return 'choix en double';
      if (q.format === 'cloze' && q.blanks[0].choices.length < 2) return 'pas assez de choix';
    },
  });

  M.registerSkill({
    id: 'fr-verbes-frequents',
    domain: D,
    title: 'Aimer, aller, dire, faire',
    icon: '🚶',
    learn: 'fr-verbes-present',
    desc: "Les verbes qu'on écrit tout le temps.",
    pda: "Conjugaison C.1 — formes mémorisées de aimer, aller, dire, faire à l'indicatif présent (→ 1re, ★ 2e)",
    gen({ lvl }) {
      if (lvl === 0) {
        const v = M.pick<FrVerbeId>(['aimer', 'aller']);
        return Math.random() < 0.5 ? matchQ(v, distinct(v, 3, [0, 1, 2])) : clozeQ(v, M.pick([0, 1, 2]), FR.VERBES[v].f.slice(0, 3));
      }
      const v = M.pick<FrVerbeId>(['aimer', 'aller', 'dire', 'faire']);
      if (lvl === 1) {
        if (Math.random() < 0.5) return matchQ(v, distinct(v, 4, [0, 1, 2, 3, 4, 5]));
        const k = M.rnd(0, 5);
        return clozeQ(v, k, M.shuffle(FR.VERBES[v].f.filter((f) => f !== FR.VERBES[v].f[k])));
      }
      // lvl 2 : formes difficiles
      const HARD: [FrVerbeId, number][] = [
        ['faire', 4],
        ['dire', 4],
        ['aller', 5],
        ['faire', 5],
        ['faire', 3],
        ['aller', 0],
        ['dire', 5],
        ['aller', 3],
      ];
      const [hv, hk] = M.pick(HARD);
      if (Math.random() < 0.6) return textQ(hv, hk);
      const V = FR.VERBES[hv];
      const trap =
        hk === 4
          ? hv === 'faire'
            ? 'faisez'
            : 'disez'
          : hk === 5
            ? hv === 'aller'
              ? 'allent'
              : hv === 'faire'
                ? 'faisent'
                : null
            : null;
      return clozeQ(
        hv,
        hk,
        M.shuffle([trap, ...V.f.filter((f) => f !== V.f[hk])].filter((x): x is string => !!x)).sort((a) => (a === trap ? -1 : 1)),
      );
    },
    check(q) {
      if (q.format === 'cloze' && new Set(q.blanks[0].choices).size !== q.blanks[0].choices.length) return 'choix en double';
      if (q.format === 'cloze' && q.blanks[0].choices.length < 2) return 'pas assez de choix';
    },
  });
})();
