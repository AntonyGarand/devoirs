/* =====================================================================
   skills/phrase.js — La phrase (fr-phrase)
     fr-phrase-ponctuation, fr-ordre-mots
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const D = 'fr-phrase';
  const words = (ph: FrPhrase) => FR.phraseWords(ph).map((x) => x.w);
  const sentence = (ph: FrPhrase) => {
    const w = words(ph);
    w[0] = M.fr.cap(w[0]);
    return w.join(' ') + '.';
  };
  const QUESTIONS = [
    'Est-ce que tu viens jouer',
    'Où est mon chat',
    'Qui veut une pomme',
    "Comment s'appelle ton chien",
    'Pourquoi le ciel est bleu',
    "Quand part l'autobus",
    'As-tu vu ma tuque',
    "Est-ce qu'il neige dehors",
    'Qui a mangé le gâteau',
    'Où vont les oiseaux en hiver',
  ];
  const EXCL = [
    'Quelle belle journée',
    'Bravo',
    'Attention, le bébé dort',
    'Wow, quelle grosse citrouille',
    'Que la neige est belle',
    "Youpi, c'est congé",
    'Aïe, je me suis cogné',
  ];
  const BIG = (t: string) => `<div class="fr-big" style="font-size:1.6rem">${M.esc(t)}</div>`;

  /* ---------------- ✅ Majuscule et point ---------------- */
  M.registerSkill({
    id: 'fr-phrase-ponctuation',
    domain: D,
    title: 'Majuscule et point',
    icon: '✅',
    starter: true,
    learn: 'fr-la-phrase',
    desc: 'Une phrase commence par une majuscule et finit par un point.',
    pda: 'Syntaxe B.1 a.i, b (majuscule et point, → 1re, ★ 2e); a.ii–iii (? et !, → 2e); Lire C.2.2 a',
    gen({ lvl }) {
      const r = Math.random();
      if (lvl >= 1 && r < 0.45) {
        const kinds = lvl === 1 ? ['.', '?'] : ['.', '?', '!'];
        const k = M.pick(kinds);
        const base =
          k === '?' ? M.pick(QUESTIONS) : k === '!' ? M.pick(EXCL) : sentence(M.pick(FR.PHRASES.filter((p) => p.lvl <= 1))).slice(0, -1);
        const names = { '.': 'le point', '?': "le point d'interrogation", '!': "le point d'exclamation" };
        return {
          prompt: `Quel signe va à la fin de la phrase ?${BIG(base + ' __')}`,
          say: `Quel signe va à la fin de la phrase ? ${base}`,
          format: 'choice',
          answer: k,
          cols: kinds.length,
          choices: kinds.map((x) => ({ label: `<span class="fr-big" style="font-size:2.4rem">${x}</span>`, value: x })),
          hint: "Est-ce qu'on pose une <b>question</b> ? Est-ce qu'on s'<b>exclame</b> (joie, surprise, peur) ? Sinon, c'est un point.",
          explain:
            k === '?'
              ? `On pose une question : on met <b>?</b> (${names[k]}).`
              : k === '!'
                ? `On s'exclame : on met <b>!</b> (${names[k]}).`
                : "C'est une phrase qui dit quelque chose : on met un <b>point</b>.",
        };
      }
      if (lvl === 2 && r < 0.75) {
        // texte sans ponctuation : touche le premier mot de chaque phrase
        const firsts = FR.PHRASES.filter(
          (p) => p.lvl <= 1 && p.toks[p.toks.length - 2].tag === 'n' && p.toks[0].tag === 'd' && !p.toks.some((t) => t.tag === 'x'),
        );
        const p1 = M.pick(firsts),
          p2 = M.pick(FR.PHRASES.filter((p) => p.lvl <= 1 && p !== p1 && p.toks[0].tag === 'd'));
        const w1 = words(p1).map((w) => w.toLocaleLowerCase('fr-CA')),
          w2 = words(p2).map((w) => w.toLocaleLowerCase('fr-CA'));
        return {
          prompt:
            'Il y a <b>deux phrases</b>, mais on a oublié les majuscules et les points. Touche le <b>premier mot</b> de chaque phrase.',
          format: 'tapwords',
          words: w1.concat(w2),
          answer: [0, w1.length],
          select: 'many',
          hint: "Lis lentement. Où est-ce qu'une idée finit et qu'une autre commence ?",
          explain: `<b>${sentence(p1)}</b> <b>${sentence(p2)}</b> Chaque phrase commence par une majuscule et finit par un point.`,
        };
      }
      const ph = M.pick(FR.PHRASES.filter((p) => p.lvl <= Math.min(1, lvl + 0)));
      const good = sentence(ph);
      if (Math.random() < 0.35) {
        const w = good.slice(0, -1).split(' ');
        const shown = w.map((x, i) => (i === 0 ? x.charAt(0).toLocaleLowerCase('fr-CA') + x.slice(1) : x));
        shown[shown.length - 1] += '.';
        return {
          prompt: 'Touche le mot qui doit avoir une <b>majuscule</b>.',
          format: 'tapwords',
          words: shown,
          answer: [0],
          hint: 'Une phrase commence toujours par une majuscule.',
          explain: `On écrit <b>${M.esc(good)}</b> : la majuscule va au <b>premier mot</b> de la phrase.`,
        };
      }
      const err = M.pick(['ok', 'ok', 'maj', 'point']);
      let shown = good;
      if (err === 'maj') shown = good.charAt(0).toLocaleLowerCase('fr-CA') + good.slice(1);
      if (err === 'point') shown = good.slice(0, -1);
      return {
        prompt: `Cette phrase est-elle <b>bien écrite</b> ?${BIG(shown)}`,
        say: 'Cette phrase est-elle bien écrite ? Regarde le début et la fin.',
        format: 'tf',
        answer: err === 'ok',
        labels: [{ label: '✔️ Oui' }, { label: '✖️ Non' }],
        hint: 'Regarde la <b>première lettre</b> et la <b>fin</b> de la phrase.',
        explain:
          err === 'ok'
            ? 'Oui : elle commence par une majuscule et finit par un point.'
            : err === 'maj'
              ? `Il manque la <b>majuscule</b> au début : <b>${M.esc(good)}</b>`
              : `Il manque le <b>point</b> à la fin : <b>${M.esc(good)}</b>`,
      };
    },
    check(q) {
      if (q.format === 'tapwords' && q.answer.some((i) => i >= (q.words?.length ?? 0))) return 'indice';
    },
  });

  /* ---------------- 🧱 Je construis une phrase ---------------- */
  const INTRUS = ['avec', 'sur', 'pour', 'dans', 'sous'];
  M.registerSkill({
    id: 'fr-ordre-mots',
    domain: D,
    title: 'Je construis une phrase',
    icon: '🧱',
    learn: 'fr-la-phrase',
    desc: "Mets les mots dans l'ordre pour faire une phrase.",
    pda: 'Syntaxe A.1 b–d — mots dans le bon ordre, phrase qui a du sens (→ 1re, ★ 2e); D.1 a — négation (→ 2e)',
    gen({ lvl }) {
      const pool = FR.PHRASES.filter((p) => !p.multi && p.lvl === lvl);
      const ph = M.pick(pool);
      const ws = words(ph).map((w, i) => (i === 0 && !/^(Papa|Maman)$/.test(w) ? w.charAt(0).toLocaleLowerCase('fr-CA') + w.slice(1) : w));
      const tiles = ws.slice();
      if (lvl === 2) tiles.push(M.pick(INTRUS.filter((x) => !ws.includes(x))));
      return {
        prompt:
          lvl === 2 ? 'Construis la phrase. <b>Attention</b> : un mot est en trop !' : "Mets les mots dans l'ordre pour faire une phrase.",
        format: 'build',
        join: ' ',
        capitalizeFirst: true,
        fixedEnd: '.',
        tiles,
        answer: ws,
        hint:
          lvl === 2
            ? "Qui fait l'action ? Commence par lui. Les petits mots <b>ne</b> et <b>pas</b> entourent le verbe."
            : "Qui fait l'action ? Commence par lui. Ensuite : qu'est-ce qu'il fait ?",
        explain: `<b>${M.esc(sentence(ph))}</b> On dit d'abord <b>qui</b>, puis <b>ce qu'il fait</b>.`,
      };
    },
  });
})();
