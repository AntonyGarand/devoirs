/* =====================================================================
   musique/skills/sources.js — domaine mu-sources
     mu-instruments (instruments de percussion de la classe, matériaux)
     mu-voix-corps  (voix chantée, effets vocaux, percussions corporelles)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  const pick = M.pick,
    shuffle = M.shuffle;
  const pic = (x: MuInstrument, size = 64) => M.art.html(x.art, { size, alt: x.nom });
  const card = (x: MuInstrument) => `<span class="mu-lblv">${pic(x, 50)}<span>${x.nom}</span></span>`;
  const MAT: Record<string, string> = { bois: 'en <b>bois</b>', metal: 'en <b>métal</b>', peau: 'avec une <b>peau tendue</b>' };
  // instruments faciles à distinguer à l'oreille, deux à deux
  const DISTINCT = ['tambour', 'triangle', 'maracas', 'claves', 'grelots', 'cymbales', 'xylophone', 'tambourin'];

  M.registerSkill({
    id: 'mu-instruments',
    domain: 'mu-sources',
    title: 'Les instruments de la classe',
    icon: '🪇',
    starter: true,
    learn: 'mu-l-instruments',
    desc: "Reconnaître à l'oreille le tambour, le triangle, les maracas… et dire de quoi ils sont faits.",
    pda: 'Sources sonores C.2.a — nommer des instruments de percussion; C.3.a — objets de bois et de métal; Timbre A.4.a — instruments de percussion de la classe (1er cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'oreille' : lvl === 1 ? pick(['oreille', 'matiere', 'matiere']) : pick(['oreille', 'trier', 'geste']);
      if (t === 'oreille') {
        const n = lvl === 0 ? 3 : 4;
        const ids = shuffle(DISTINCT).slice(0, n);
        const x = MU.instById[ids[0]];
        const evs =
          x.id === 'xylophone'
            ? MU.tune(130, { inst: 'xylo' }).slice(0, 5)
            : x.id === 'maracas'
              ? [0, 0.25, 0.5, 0.62, 0.75].map((at) => ({ t: at, inst: 'maracas', vel: 0.8 }))
              : [0, 0.6, 1.2].map((at) => ({ t: at, inst: x.inst, vel: 0.85, dur: x.qualite === 'sec' ? 0.2 : 1.5 }));
        return {
          prompt: 'Écoute. Quel instrument entends-tu ?',
          format: 'choice',
          answer: x.id,
          cols: 2,
          choices: shuffle(ids).map((id) => ({ label: card(MU.instById[id]), value: id })),
          hint: 'Est-ce que ça fait « boum » (une peau), « dinnng » (du métal), « toc » (du bois) ou « tchik » (des graines) ?',
          explain: `C'était <b>${x.le}</b> : ${x.geste}.`,
          _mu: { items: [{ events: evs }] },
          viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
        };
      }
      if (t === 'matiere') {
        const x = pick(MU.INSTRUMENTS.filter((i) => MU.MATIERES.some((m) => m.id === i.matiere)));
        return {
          prompt: `Qu'est-ce qui fait le son de cet instrument (${x.nom}) : du bois, du métal ou une peau ? <div class="mu-row">${pic(x, 96)}</div>`,
          format: 'choice',
          answer: x.matiere,
          cols: 3,
          choices: MU.MATIERES.map((m) => ({ label: `${m.icon} ${m.label}`, value: m.id })),
          hint: "Regarde l'instrument : est-ce du bois brun, du métal brillant ou une peau tendue comme sur un tambour ?",
          explain: `${x.le.replace(/^./, (c) => c.toUpperCase())} : c'est un instrument ${MAT[x.matiere]}; ${x.geste}.`,
          viz: (el) => MU.player(el, [{ label: x.nom, events: [{ inst: x.inst, vel: 0.85, dur: 1.2 }] }], { autoplay: false }),
        };
      }
      if (t === 'trier') {
        const its = shuffle(MU.INSTRUMENTS.filter((i) => i.matiere !== 'graines')).slice(0, 5);
        return {
          prompt: 'Classe les instruments selon leur matière.',
          format: 'sort',
          bins: MU.MATIERES.map((m) => ({ id: m.id, label: `${m.icon} ${m.label}` })),
          items: its.map((x) => ({ label: `${pic(x, 36)} ${x.nom}`, bin: x.matiere, key: x.id })),
          hint: 'Bois : brun, on fait « toc ». Métal : brillant, ça résonne. Peau : on frappe dessus comme un tambour.',
          explain: its.map((x) => `${x.nom} : ${MAT[x.matiere].replace(/<\/?b>/g, '')}`).join(' · ') + '.',
        };
      }
      const x = pick(MU.INSTRUMENTS);
      const others = shuffle(MU.INSTRUMENTS.filter((i) => i.id !== x.id && i.geste !== x.geste)).slice(0, 2);
      return {
        prompt: `Comment joue-t-on de cet instrument : <b>${x.nom}</b> ? <div class="mu-row">${pic(x, 96)}</div>`,
        format: 'choice',
        answer: x.id,
        choices: shuffle([x, ...others]).map((i) => ({ label: i.geste.replace(/^./, (c) => c.toUpperCase()), value: i.id })),
        hint: 'Regarde bien sa forme : on le frappe, on le secoue ?',
        explain: `${x.le.replace(/^./, (c) => c.toUpperCase())} : ${x.geste}.`,
      };
    },
  });

  M.registerSkill({
    id: 'mu-voix-corps',
    domain: 'mu-sources',
    title: 'La voix et le corps',
    icon: '👏',
    learn: 'mu-l-instruments',
    desc: 'Notre corps est un instrument : chanter, faire des effets avec la voix, taper des mains, des pieds…',
    pda: 'Sources sonores C.1.a — voix chantée, effets vocaux, percussions corporelles (1er cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'oreille' : lvl === 1 ? pick(['trier', 'oreille']) : pick(['suite', 'trier']);
      if (t === 'oreille') {
        const pool = lvl === 0 ? MU.CORPS.filter((c) => c.id !== 'cuisses') : MU.CORPS;
        const x = pick(pool);
        const gap = pick([0.5, 0.65]);
        const evs = MU.seq(pick([2, 3, 4])).map((i) => ({ t: i * gap, inst: x.inst, vel: 0.9 }));
        return {
          prompt: 'Écoute. Avec quelle partie du corps fait-on ce son ?',
          format: 'choice',
          answer: x.id,
          cols: pool.length,
          choices: shuffle(pool).map((c) => ({
            label: `<span class="mu-lblv"><span class="mu-big">${c.icon}</span><span>${c.nom}</span></span>`,
            value: c.id,
          })),
          hint: 'Essaie toi-même : tape des mains, des pieds, claque des doigts… Lequel ressemble au son ?',
          explain: `C'était : <b>${x.nom}</b> ${x.icon}. C'est une <b>percussion corporelle</b> : le corps devient un instrument !`,
          _mu: { items: [{ events: evs }] },
          viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
        };
      }
      if (t === 'trier') {
        const its: MuSourceItem[] = [];
        MU.SOURCE_BINS.forEach((b) =>
          shuffle(MU.SOURCES.filter((s) => s.bin === b.id))
            .slice(0, lvl === 1 ? 1 : 2)
            .forEach((s) => its.push(s)),
        );
        return {
          prompt: 'Quelle source sonore utilise-t-on ? Classe chaque action.',
          format: 'sort',
          bins: MU.SOURCE_BINS,
          items: shuffle(its).map((s) => ({ label: s.t, bin: s.bin, key: s.t })),
          hint: 'Chanter un air = voix chantée. Imiter un bruit avec la bouche = effet vocal. Faire un son avec son corps = percussion corporelle.',
          explain:
            "La <b>voix chantée</b> fait des airs avec des paroles. Un <b>effet vocal</b> imite un bruit avec la bouche (vent, animal…). Une <b>percussion corporelle</b>, c'est frapper, taper ou frotter son corps.",
        };
      }
      const seq = MU.seq(4).map(() => pick(MU.CORPS.slice(0, 3)));
      if (new Set(seq.map((s) => s.id)).size < 2) seq[3] = MU.CORPS.find((c) => c.id !== seq[0].id) ?? seq[3]; // toujours trouvé (4 gestes différents)
      const key = (s: MuBodySound[]) => s.map((c) => c.id).join('-');
      const alts = new Map<string, MuBodySound[]>();
      for (let i = 0; i < 40 && alts.size < 2; i++) {
        const v = seq.slice();
        v[M.pick(MU.seq(4))] = pick(MU.CORPS.slice(0, 3));
        if (key(v) !== key(seq)) alts.set(key(v), v);
      }
      const evs = seq.map((c, i) => ({ t: i * 0.6, inst: c.inst, vel: 0.9 }));
      return {
        prompt: 'Écoute la suite de percussions corporelles. Laquelle as-tu entendue ?',
        format: 'choice',
        answer: key(seq),
        cols: 1,
        choices: shuffle([seq, ...alts.values()]).map((s) => ({
          label: `<span class="mu-big">${s.map((c) => c.icon).join(' ')}</span>`,
          value: key(s),
        })),
        hint: 'Écoute un son à la fois. Tu peux réécouter.',
        explain: `On a entendu : ${seq.map((c) => `${c.icon} ${c.nom}`).join(', ')}.`,
        _mu: { items: [{ events: evs }] },
        viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });

  try {
    M.css(
      '.mu-lblv { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; line-height: 1.1; text-align: center; font-weight: 800 }',
    );
  } catch (e) {}
})();
