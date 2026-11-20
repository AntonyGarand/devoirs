/* =====================================================================
   musique/skills/ecoute.js — domaine mu-ecoute (Apprécier; structures)
     mu-forme      : pareil / différent, forme A-B (1er cycle), A-B-A (enrichissement)
     mu-caractere  : le caractère d'une musique (joyeuse, triste, calme, agitée) et POURQUOI
                     (tempo, nuance, registre) — compétence 3 « Apprécier ». On compare deux
                     musiques très contrastées; le ressenti personnel passe par une carte de réflexion (jamais notée).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  const pick = M.pick, shuffle = M.shuffle;
  const MAJ = [0, 2, 4, 7, 9, 12], MIN = [0, 2, 3, 5, 7, 8, 12];

  /** Une phrase de 8 notes; rythme : 'egal' (croches régulières) ou 'saute' (long-court). */
  function phrase({ inst = 'xylo', root = 67, scale = MAJ, rhythm = 'egal', spb = 0.3, notes } = {}) {
    const ns = notes || MU.seq(8).map((i) => (i === 7 ? 0 : pick(scale)));
    const durs = rhythm === 'egal' ? MU.seq(8).map(() => spb) : MU.seq(8).map((i) => (i % 2 ? spb * 0.5 : spb * 1.5));
    let t = 0;
    return ns.map((n, i) => { const e = { t, inst, midi: root + n, vel: 0.75, dur: durs[i] * 0.9 }; t += durs[i]; return e; });
  }
  const shift = (evs, dt) => evs.map((e) => ({ ...e, t: e.t + dt }));
  const LET_COL = { A: '#3a86ff', B: '#f78c40' };
  const blocks = (letters) => `<div class="mu-blocks">${letters.map((l) => `<span style="background:${LET_COL[l]}22;border-color:${LET_COL[l]}">${l}</span>`).join('')}</div>`;

  M.registerSkill({
    id: 'mu-forme', domain: 'mu-ecoute', title: 'Pareil ou différent ? (forme A-B)', icon: '🧩', learn: 'mu-l-ecouter',
    desc: 'Une musique a des parties : la partie A, puis une partie B différente. Qu\'est-ce qui se répète ?',
    pda: 'Structures G.1.a — forme personnelle et forme A-B; procédés de composition F.a — contraste, reproduction sonore (1er cycle); lvl 2 : forme A-B-A (G.1.b, 2e cycle, enrichissement)',
    gen({ lvl }) {
      const instA = pick(['xylo', 'piano']), instB = lvl === 0 ? (instA === 'xylo' ? 'flute' : 'xylo') : instA;
      const A = phrase({ inst: instA, root: 67, rhythm: 'egal' });
      const B = phrase({ inst: instB, root: lvl === 0 ? 60 : 64, rhythm: 'saute' });
      if (lvl === 0) {
        const same = pick([true, false]);
        const items = [{ label: 'Partie 1', events: A }, { label: 'Partie 2', events: same ? A : B }];
        return {
          prompt: 'Écoute la partie 1, puis la partie 2. Sont-elles pareilles ou différentes ?', format: 'choice', cols: 2, answer: same ? 'pareil' : 'diff',
          choices: [{ label: '🟦🟦 Pareilles', value: 'pareil' }, { label: '🟦🟧 Différentes', value: 'diff' }],
          hint: 'Écoute les notes et l\'instrument. Est-ce la même chose qui revient ?',
          explain: same ? 'C\'est la même partie qui se <b>répète</b> : A puis A.' : 'La 2e partie est différente : c\'est un <b>contraste</b>. On appelle ça la forme <b>A-B</b>.',
          _mu: { items }, viz: (el) => MU.player(el, items),
        };
      }
      if (lvl === 1) {
        const odd = pick([0, 1, 2]);
        const parts = MU.seq(3).map((i) => (i === odd ? B : A));
        const items = parts.map((p, i) => ({ label: `Partie ${i + 1}`, events: p }));
        return {
          prompt: 'Écoute les trois parties. Laquelle est <b>différente</b> des autres ?', format: 'choice', cols: 3, answer: String(odd),
          choices: items.map((it, i) => ({ label: MU.tag(i, it.label), value: String(i) })),
          hint: 'Deux parties sont pareilles. Trouve celle qui ne ressemble pas.',
          explain: `La partie ${odd + 1} est différente (B). Les deux autres sont pareilles (A).`,
          _mu: { items }, viz: (el) => MU.player(el, items),
        };
      }
      const form = pick(['AB', 'ABA', 'AA']);
      const L = form.split('');
      const dur = (p) => p[p.length - 1].t + p[p.length - 1].dur + 0.5;
      let t = 0;
      const evs = L.flatMap((l) => { const p = shift(l === 'A' ? A : B, t); t += dur(l === 'A' ? A : B); return p; });
      return {
        prompt: 'Écoute toute la musique. Quelle est sa forme ?', format: 'choice', cols: 3, answer: form,
        choices: ['AA', 'AB', 'ABA'].map((f) => ({ label: blocks(f.split('')), value: f })),
        hint: 'Combien de parties entends-tu ? La dernière ressemble-t-elle à la première ?',
        explain: form === 'AB' ? 'Une partie A, puis une partie B différente : forme <b>A-B</b>.' : form === 'ABA' ? 'A, puis B, puis A revient : forme <b>A-B-A</b>, comme un sandwich 🥪.' : 'La même partie deux fois : A-A, c\'est une <b>répétition</b>.',
        _mu: { items: [{ events: evs }] }, viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });

  /* ---------------------------------------------------------------- caractère */
  function piece(mood) {
    if (mood === 'joyeuse') return phrase({ inst: 'xylo', root: 72, scale: MAJ, rhythm: 'saute', spb: 0.22 }).concat(phrase({ inst: 'xylo', root: 72, scale: MAJ, rhythm: 'egal', spb: 0.18 }).map((e) => ({ ...e, t: e.t + 1.9 })));
    if (mood === 'triste') return phrase({ inst: 'flute', root: 57, scale: MIN, rhythm: 'egal', spb: 0.75 }).slice(0, 6).map((e) => ({ ...e, vel: 0.5, dur: 0.72 }));
    if (mood === 'calme') return MU.seq(12).map((i) => ({ t: i * 0.5, inst: 'piano', midi: 60 + [0, 4, 7, 12, 7, 4][i % 6] + (i >= 6 ? 5 : 0), vel: 0.3, dur: 0.9 }));
    // agitée : fort, rapide, grave, avec tambour
    const ev = [];
    for (let i = 0; i < 16; i++) { ev.push({ t: i * 0.16, inst: 'tambour', vel: 1 }); if (i % 2 === 0) ev.push({ t: i * 0.16, inst: 'piano', midi: 40 + pick([0, 1, 6]), vel: 1, dur: 0.2 }); }
    return ev;
  }
  MU.phrase = phrase; MU.piece = piece;
  const PAIRS = [['joyeuse', 'triste'], ['calme', 'agitee'], ['joyeuse', 'calme'], ['triste', 'agitee']];
  M.registerSkill({
    id: 'mu-caractere', domain: 'mu-ecoute', title: 'Ce que la musique exprime', icon: '😊', learn: 'mu-l-ecouter',
    desc: 'Joyeuse, triste, calme ou agitée ? Et pourquoi : le tempo, les nuances, aigu ou grave.',
    pda: 'Compétence 3 — Apprécier des œuvres musicales : exprimer ce qu\'on ressent et le justifier avec le vocabulaire (tempo, nuances, registre) (1er cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'paire' : lvl === 1 ? pick(['paire', 'paire', 'senti']) : pick(['pourquoi', 'pourquoi', 'paire']);
      const D = MU.MOODS;
      if (t === 'senti') {
        const mood = pick(Object.keys(D));
        const evs = piece(mood);
        return {
          prompt: 'Écoute cette musique. Comment te fait-elle sentir ? Dis-le à un adulte, et explique pourquoi : est-elle rapide ou lente ? forte ou douce ? aiguë ou grave ?', format: 'reflect',
          actions: ['💬 J\'en ai parlé ✔', '🔁 Je veux la réécouter d\'abord'],
          explain: `Moi, je la trouve plutôt ${D[mood].label} ${D[mood].icon} : ${D[mood].why}. Toi, tu as peut-être ressenti autre chose, et c'est correct si tu peux dire pourquoi !`,
          _mu: { items: [{ events: evs }] }, viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
        };
      }
      const [a, b] = shuffle(pick(PAIRS));
      if (t === 'paire') {
        const want = pick([a, b]);
        const items = [{ label: 'Musique 1', events: piece(a) }, { label: 'Musique 2', events: piece(b) }];
        const ans = want === a ? 0 : 1;
        return {
          prompt: `Écoute les deux musiques. Laquelle semble la plus <b>${D[want].label}</b> ${D[want].icon} ?`, format: 'choice', cols: 2, answer: String(ans),
          choices: items.map((it, i) => ({ label: MU.tag(i, it.label), value: String(i) })),
          hint: 'Écoute la vitesse (rapide ou lente), la force (forte ou douce) et la hauteur (aiguë ou grave).',
          explain: `La musique ${ans + 1} semble ${D[want].label} : ${D[want].why}.`,
          _mu: { items }, viz: (el) => MU.player(el, items),
        };
      }
      const mood = pick(Object.keys(D));
      const evs = piece(mood);
      // triste et calme sont toutes deux lentes et douces : jamais l'une comme distracteur de l'autre
      const near = { triste: 'calme', calme: 'triste' };
      const others = shuffle(Object.keys(D).filter((k) => k !== mood && k !== near[mood])).slice(0, 2);
      return {
        prompt: `Cette musique semble <b>${D[mood].label}</b> ${D[mood].icon}. Pourquoi ?`, format: 'choice', answer: mood,
        choices: shuffle([mood, ...others]).map((k) => ({ label: `Parce qu'${D[k].why}`, value: k })),
        hint: 'Écoute-la encore : la vitesse, la force, la hauteur des sons.',
        explain: `On l'entend : ${D[mood].why}.`,
        _mu: { items: [{ events: evs }] }, viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });
})();
