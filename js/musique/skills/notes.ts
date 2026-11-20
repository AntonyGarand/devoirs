/* =====================================================================
   musique/skills/notes.js — domaine mu-notes
     MU.NOTES, MU.noteCol, MU.keyboardSvg (petit piano SVG, touches data-midi)
     mu-do-re-mi : nommer les notes de la gamme, les trouver sur le piano, plus aigu / plus grave.
   Les noms absolus ne s'entendent pas (oreille absolue) : on nomme à partir du piano ou d'un « do » de départ.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  const pick = M.pick,
    shuffle = M.shuffle;

  MU.NOTES = ['do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'];
  const WHITE = [0, 2, 4, 5, 7, 9, 11];
  // couleurs de type « boomwhackers » (do rouge, ré orange, mi jaune…), courantes en classe de musique
  const COL = ['#e63946', '#f78c40', '#f4c430', '#06a77d', '#2bb3c9', '#5e60ce', '#c050c8'];
  MU.noteCol = (i) => COL[((i % 7) + 7) % 7];
  /** midi → index dans la gamme (0 = do), ou -1 pour une touche noire. */
  MU.degree = (midi) => {
    const k = WHITE.indexOf(((midi % 12) + 12) % 12);
    return k < 0 ? -1 : k + 7 * (Math.floor(midi / 12) - 5);
  };
  MU.noteName = (midi) => {
    const d = MU.degree(midi);
    return d < 0 ? '' : MU.NOTES[((d % 7) + 7) % 7];
  };
  MU.midiOf = (deg) => 60 + 12 * Math.floor(deg / 7) + WHITE[((deg % 7) + 7) % 7];

  /**
   * Petit piano. from/to : midi des touches blanches aux extrémités.
   * opts : labels (noms sur les touches), colors (pastilles de couleur), mark (midi marqué d'une étoile),
   *        hide (midi dont le nom devient « ? »), w (largeur d'une touche blanche).
   */
  MU.keyboardSvg = (from = 60, to = 72, { labels = true, colors = true, mark = null, hide = null, w = 46, cls = '' } = {}) => {
    const whites = [],
      blacks = [];
    for (let m = from; m <= to; m++) (MU.degree(m) < 0 ? blacks : whites).push(m);
    const H = 168,
      BH = 100,
      BW = w * 0.58,
      W = whites.length * w + 4;
    const xOf = (m) => 2 + whites.indexOf(m) * w;
    let body = '';
    whites.forEach((m) => {
      const x = xOf(m),
        d = MU.degree(m),
        name = m === hide ? '?' : MU.noteName(m);
      body += `<g class="mu-key w" data-midi="${m}"><rect x="${x}" y="2" width="${w - 2}" height="${H - 4}" rx="7" fill="#fff" stroke="#2b2d42" stroke-width="2.5"/>`;
      if (m === mark) body += `<text x="${x + w / 2 - 1}" y="${BH + 30}" text-anchor="middle" font-size="24" class="mu-star">⭐</text>`;
      if (labels) {
        const c = m === hide ? '#fff3c4' : colors ? MU.noteCol(d) : '#fff';
        body += `<circle cx="${x + w / 2 - 1}" cy="${H - 26}" r="16" fill="${c}" stroke="${colors || m === hide ? '#2b2d42' : 'none'}" stroke-width="2"/><text x="${x + w / 2 - 1}" y="${H - 20}" text-anchor="middle" class="mu-key-lbl">${name}</text>`;
      }
      body += '</g>';
    });
    blacks.forEach((m) => {
      const x = xOf(m - 1) + w - BW / 2 - 1;
      body += `<g class="mu-key b" data-midi="${m}"><rect x="${x}" y="2" width="${BW}" height="${BH}" rx="5" fill="#2b2d42" stroke="#2b2d42" stroke-width="2"/></g>`;
    });
    return `<svg class="mu-kbd ${cls}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Piano">${body}</svg>`;
  };

  const nm = (d) => MU.NOTES[((d % 7) + 7) % 7];
  const B = (s) => `<b>${s}</b>`;
  const choicesOf = (ans, pool) =>
    shuffle([ans, ...shuffle(pool.filter((x) => x !== ans)).slice(0, 2)]).map((x) => ({
      label: `<span class="mu-big">${x}</span>`,
      value: x,
    }));
  const pno = (deg, t = 0, dur = 0.5) => ({ t, inst: 'piano', midi: MU.midiOf(deg), vel: 0.75, dur });

  M.registerSkill({
    id: 'mu-do-re-mi',
    domain: 'mu-notes',
    title: 'Do, ré, mi',
    icon: '🎹',
    starter: true,
    learn: 'mu-l-piano',
    desc: 'Connaître la gamme do, ré, mi, fa, sol, la, si et trouver les notes sur le piano.',
    pda: "Langage musical A.3 — hauteur : nommer les sons de la gamme (do, ré, mi…) à l'aide du piano; G.4.a — sons ascendants (vers la droite, plus aigu)",
    gen({ lvl }) {
      const t =
        lvl === 0
          ? pick(['manque', 'manque', 'apres'])
          : lvl === 1
            ? pick(['touche', 'apres', 'avant', 'manque'])
            : pick(['touche', 'aigu', 'ecoute', 'avant']);
      const scale = MU.seq(8).map((i) => pno(i, i * 0.35, 0.4));
      if (t === 'manque') {
        const d = 1 + Math.floor(Math.random() * 6); // jamais do : le do d'en haut le montrerait
        return {
          prompt: `Quelle note se cache sous le « ? » ? <div class="mu-row">${MU.keyboardSvg(60, 72, { hide: MU.midiOf(d), colors: lvl === 0, w: 40 })}</div>`,
          format: 'choice',
          answer: nm(d),
          cols: 3,
          choices: choicesOf(nm(d), MU.NOTES),
          hint: 'Récite la gamme en touchant chaque touche blanche : do, ré, mi, fa, sol, la, si, do.',
          explain: `C'est ${B(nm(d))} : ${MU.NOTES.map((n, i) => (i === d ? B(n) : n)).join(', ')}, do.`,
          viz: (el) => MU.player(el, [{ label: 'La gamme', events: scale }], { autoplay: false }),
        };
      }
      if (t === 'apres' || t === 'avant') {
        const d = t === 'apres' ? Math.floor(Math.random() * 6) : 1 + Math.floor(Math.random() * 6);
        const a = t === 'apres' ? d + 1 : d - 1;
        return {
          prompt: `Dans la gamme, quelle note vient juste ${t === 'apres' ? B('après') : B('avant')} ${B(nm(d))} ?`,
          format: 'choice',
          answer: nm(a),
          cols: 3,
          choices: choicesOf(
            nm(a),
            MU.NOTES.filter((x) => x !== nm(d)),
          ),
          hint:
            t === 'apres'
              ? 'Récite la gamme en montant : do, ré, mi, fa, sol, la, si.'
              : 'Récite la gamme en descendant : si, la, sol, fa, mi, ré, do.',
          explain: `${t === 'apres' ? `Après ${nm(d)}, il y a` : `Avant ${nm(d)}, il y a`} ${B(nm(a))} : ${MU.NOTES.map((n, i) => (i === d || i === a ? B(n) : n)).join(', ')}.`,
          viz: (el) => MU.player(el, [{ label: 'Écouter', events: [pno(Math.min(d, a)), pno(Math.max(d, a), 0.5)] }], { autoplay: false }),
        };
      }
      if (t === 'touche') {
        // do, mi, fa, si sont faciles à trouver grâce aux touches noires; les autres au niveau 2
        const d = lvl === 1 ? pick([0, 2, 3, 6]) : pick([1, 4, 5, 2, 3]);
        return {
          prompt: `Quelle est la note marquée d'une étoile ⭐ ? <div class="mu-row">${MU.keyboardSvg(60, 71, { labels: false, mark: MU.midiOf(d), w: 42 })}</div>`,
          format: 'choice',
          answer: nm(d),
          cols: 3,
          choices: choicesOf(nm(d), MU.NOTES),
          hint: 'Le <b>do</b> est juste à gauche des <b>deux</b> touches noires. Pars du do et compte les touches blanches : do, ré, mi…',
          explain: `C'est ${B(nm(d))}. ${d === 0 ? 'Le do est juste à gauche du groupe de deux touches noires.' : `Du do, on compte ${MU.NOTES.slice(0, d + 1).join(', ')}.`}`,
          viz: (el) => MU.player(el, [{ label: 'Écouter la note', events: [pno(d, 0, 0.8)] }], { autoplay: false }),
        };
      }
      if (t === 'aigu') {
        const [a, b] = shuffle(MU.seq(7)).slice(0, 2);
        const want = pick(['aiguë', 'grave']);
        const ans = (want === 'aiguë') === a > b ? a : b;
        return {
          prompt: `Quelle note est la plus ${B(want)} : ${B(nm(a))} ou ${B(nm(b))} ?`,
          format: 'choice',
          answer: nm(ans),
          cols: 2,
          choices: [a, b].map((d) => ({ label: `<span class="mu-big">${nm(d)}</span>`, value: nm(d) })),
          hint: "Dans la gamme, les notes montent : le do est le plus grave, puis ré, mi… jusqu'à si. Sur le piano, plus on va vers la droite, plus c'est aigu.",
          // « la note la plus aiguë », mais « le ré est plus aigu » (les noms de notes sont masculins)
          explain: `Le ${B(nm(ans))} est plus ${want === 'aiguë' ? 'aigu' : 'grave'} : il vient ${want === 'aiguë' ? 'plus loin dans la gamme (plus à droite sur le piano)' : 'plus tôt dans la gamme (plus à gauche sur le piano)'}.`,
          viz: (el) =>
            MU.player(
              el,
              [a, b].map((d) => ({ label: nm(d), events: [pno(d, 0, 0.7)] })),
              { autoplay: false },
            ),
        };
      }
      // ecoute : un do, puis une note proche (ré, mi) ou lointaine (sol, la, si — jamais le do aigu, qui s'appelle aussi « do »)
      const near = pick([1, 2]),
        far = pick([4, 5, 6]);
      const isNear = Math.random() < 0.5,
        d = isNear ? near : far;
      const evs = [pno(0, 0, 0.6), pno(d, 0.8, 0.8)];
      return {
        prompt: `Écoute : on joue ${B('do')}, puis une autre note. Laquelle ?`,
        format: 'choice',
        answer: nm(d),
        cols: 2,
        choices: shuffle([near, far]).map((x) => ({ label: `<span class="mu-big">${nm(x)}</span>`, value: nm(x) })),
        hint: `Le ${nm(near)} est proche du do : la 2e note monte un petit peu. Le ${nm(far)} est loin : la 2e note monte beaucoup.`,
        explain: `C'était le ${B(nm(d))} : la note ${isNear ? `monte un petit peu (le ${nm(d)} est proche du do)` : `monte beaucoup (le ${nm(d)} est loin du do dans la gamme)`}.`,
        _mu: { items: [{ events: evs }] },
        viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });

  try {
    M.css(`
    .mu-kbd { max-width: 100%; height: auto; user-select: none; -webkit-user-select: none; touch-action: manipulation }
    .mu-kbd .mu-key { cursor: pointer }
    .mu-kbd .mu-key rect { transition: fill .12s }
    .mu-kbd .mu-key.w.on rect { fill: #ffe08a }
    .mu-kbd .mu-key.b.on rect { fill: #6b6f86 }
    .mu-kbd .mu-key.next rect { animation: mu-next 1s ease-in-out infinite }
    @keyframes mu-next { 50% { fill: #fff3c4 } }
    .mu-kbd .mu-key.oops rect { fill: #ffd6d6 }
    .mu-key-lbl { font: 900 15px var(--font, system-ui); fill: #2b2d42; pointer-events: none }
    .mu-star { pointer-events: none }
    `);
  } catch (e) {}
})();
