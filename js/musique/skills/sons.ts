/* =====================================================================
   musique/skills/sons.js — domaine mu-sons (les propriétés du son)
     mu-fort-doux · mu-aigu-grave · mu-long-court · mu-sec-resonnant
   On COMPARE des sons (Son 1 / Son 2) plutôt que de juger un son seul :
   « fort » dépend du volume de l'appareil, « plus fort que » non.
   Aussi : M.MU.codeSvg — code non traditionnel (PDA B.2.a) : traits longs / courts, points, gros / petits, haut / bas.
   ===================================================================== */

/** Durées du code non traditionnel. */
type MuCodeKind = 'tres-court' | 'court' | 'long' | 'tres-long' | 'silence';
/** Un son du code : k durée, v taille (intensité, 0 à 1), y hauteur (0 à 1). */
interface MuCodePart {
  k: MuCodeKind;
  v?: number;
  y?: number;
}
interface MusiqueApi {
  /** Code non traditionnel (traits longs / courts, points, gros / petits, haut / bas). */
  codeSvg(parts: readonly MuCodePart[], opts?: { w?: number; h?: number; cls?: string; color?: string }): string;
  /** Points : levels = hauteurs (0 à 1), sizes = tailles (0 à 1). */
  dotsSvg(levels: readonly number[], opts?: { sizes?: readonly number[]; w?: number; h?: number; cls?: string }): string;
}

(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  const ink = '#2b2d42';

  /** Code non traditionnel. parts : [{ k: 'court'|'long'|'tres-court'|'tres-long'|'silence', v?: 0..1 (taille), y?: 0..1 (hauteur) }] */
  MU.codeSvg = (parts, { w = 300, h = 90, cls = 'mu-choice-fig', color = ink } = {}) => {
    const LEN = { 'tres-court': 0, court: 26, long: 74, 'tres-long': 120, silence: 34 };
    const wid = (p: MuCodePart) => (p.k === 'tres-court' ? 6 + (p.v ?? 0.5) * 14 + 4 : LEN[p.k]);
    const total = parts.reduce((s, p) => s + wid(p), 0) + 24 * (parts.length - 1);
    const W = Math.max(w, total + 28);
    let x = (W - total) / 2,
      body = ''; // centré
    parts.forEach((p) => {
      const thick = 6 + (p.v ?? 0.5) * 14,
        y = h - 18 - (p.y ?? 0.5) * (h - 40);
      if (p.k === 'silence')
        body += `<rect x="${x}" y="${y - 12}" width="${LEN.silence}" height="24" rx="6" fill="none" stroke="#9aa0ae" stroke-width="2.5" stroke-dasharray="5 4"/><text x="${x + LEN.silence / 2}" y="${y + 5}" text-anchor="middle" font-size="12" font-weight="800" fill="#9aa0ae">chut</text>`;
      else if (p.k === 'tres-court') body += `<circle cx="${x + thick / 2}" cy="${y}" r="${thick / 2 + 2}" fill="${color}"/>`;
      else body += `<rect x="${x}" y="${y - thick / 2}" width="${LEN[p.k]}" height="${thick}" rx="${thick / 2}" fill="${color}"/>`;
      x += wid(p) + 24;
    });
    return `<svg class="${cls}" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" aria-hidden="true">${body}</svg>`;
  };
  /** Points (hauteur / intensité) : levels = [0..1] hauteur, sizes = [0..1] taille. */
  MU.dotsSvg = (
    levels,
    { sizes, w = 220, h = 100, cls = 'mu-choice-fig' }: { sizes?: readonly number[]; w?: number; h?: number; cls?: string } = {},
  ) => {
    const n = levels.length,
      step = (w - 40) / Math.max(1, n - 1);
    return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path d="M10 ${h - 8} H${w - 10}" stroke="#e3e6ef" stroke-width="2"/>${levels.map((l, i) => `<circle cx="${20 + i * step}" cy="${h - 18 - l * (h - 40)}" r="${5 + (sizes ? sizes[i] : 0.15) * 15}" fill="${ink}"/>`).join('')}</svg>`;
  };

  const pick = M.pick,
    shuffle = M.shuffle;
  const SON = (i: number) => `Son ${i + 1}`;
  interface WhichOpts {
    prompt: string;
    items: { events: MuEvent[] }[];
    answer: number;
    hint: string;
    explain: string;
    why?: (i: number) => string;
  }
  /** Question « lequel ? » : items = [{events}], answer = index. */
  function which({ prompt, items, answer, hint, explain, why }: WhichOpts): QuestionOf<'choice'> {
    const its = items.map((it, i) => ({ label: SON(i), events: it.events }));
    return {
      prompt,
      format: 'choice',
      answer: String(answer),
      cols: its.length,
      choices: its.map((it, i) => ({ label: MU.tag(i, it.label), value: String(i), ...(why && i !== answer ? { why: why(i) } : {}) })),
      hint,
      explain,
      _mu: { items: its },
      viz: (el) => MU.player(el, its),
    };
  }
  const note = (inst: string, midi: number, vel = 0.8, dur = 0.5, t = 0): MuEvent => ({ inst, midi, vel, dur, t });

  /* ---------------------------------------------------------------- fort / doux */
  M.registerSkill({
    id: 'mu-fort-doux',
    domain: 'mu-sons',
    title: 'Fort ou doux',
    icon: '📢',
    starter: true,
    learn: 'mu-l-sons',
    desc: 'Écoute deux sons : lequel est le plus fort ? le plus doux ? Le son devient-il de plus en plus fort ?',
    pda: 'Langage musical A.1.a — sons forts et doux (1er cycle); B.2.a — symboles fort / doux (code non traditionnel); lvl 2 : A.1.b crescendo / decrescendo (2e cycle, enrichissement)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'paire' : lvl === 1 ? pick(['trois', 'code', 'paire']) : pick(['cresc', 'cresc', 'trois']);
      const inst = pick(['tambour', 'piano', 'xylo', 'woodblock']),
        midi = pick([60, 64, 67]);
      const want = pick(['fort', 'doux']);
      if (t === 'paire' || t === 'trois') {
        const vels = t === 'paire' ? [1, 0.12] : [1, 0.38, 0.1];
        const order = shuffle(vels.map((v, i) => i));
        const items = order.map((k) => ({ events: [note(inst, midi, vels[k], 0.6)], v: vels[k] }));
        const target = want === 'fort' ? Math.max(...items.map((x) => x.v)) : Math.min(...items.map((x) => x.v));
        const ans = items.findIndex((x) => x.v === target);
        return which({
          prompt: `Écoute les sons. Lequel est le plus <b>${want}</b> ?`,
          items,
          answer: ans,
          hint: 'Un son <b>fort</b> fait beaucoup de bruit. Un son <b>doux</b> est tout petit, comme un murmure.',
          explain: `Le son ${ans + 1} est le plus <b>${want}</b>. C'est le même son, joué ${want === 'fort' ? 'avec beaucoup de force' : 'tout doucement'} : on parle d'<b>intensité</b>.`,
        });
      }
      if (t === 'code') {
        const big = { label: MU.dotsSvg([0.5], { sizes: [1], w: 90 }), value: 'gros' },
          small = { label: MU.dotsSvg([0.5], { sizes: [0.05], w: 90 }), value: 'petit' };
        return {
          prompt: `Dans le code de la musique, on dessine un <b>gros</b> point ou un <b>petit</b> point. Quel dessin veut dire un son <b>${want}</b> ?`,
          format: 'choice',
          cols: 2,
          answer: want === 'fort' ? 'gros' : 'petit',
          choices: shuffle([big, small]),
          hint: 'Plus le son est fort, plus on le dessine gros.',
          explain: 'Un <b>gros</b> dessin = un son <b>fort</b>. Un <b>petit</b> dessin = un son <b>doux</b>.',
        };
      }
      // crescendo / decrescendo
      const up = pick([true, false]);
      const evs = MU.seq(8).map((i) => note(inst === 'piano' ? 'tambour' : inst, midi, up ? 0.08 + i * 0.13 : 1 - i * 0.13, 0.3, i * 0.4));
      return {
        prompt: 'Écoute bien. Comment change le son ?',
        format: 'choice',
        answer: up ? 'cresc' : 'decresc',
        choices: shuffle([
          { label: '📈 De plus en plus <b>fort</b>', value: 'cresc' },
          { label: '📉 De plus en plus <b>doux</b>', value: 'decresc' },
          { label: '➡️ Toujours pareil', value: 'pareil', why: 'Écoute encore : le premier coup et le dernier ne sont pas pareils.' },
        ]),
        hint: 'Compare le début et la fin.',
        explain: up
          ? "Le son devient de plus en plus fort : c'est un <b>crescendo</b> 📈."
          : "Le son devient de plus en plus doux : c'est un <b>decrescendo</b> 📉.",
        _mu: { items: [{ events: evs }] },
        viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });

  /* ---------------------------------------------------------------- aigu / grave */
  const UP = {
    monte: { label: '⬆️ Les sons <b>montent</b>', svg: [0, 0.25, 0.5, 0.75, 1] },
    descend: { label: '⬇️ Les sons <b>descendent</b>', svg: [1, 0.75, 0.5, 0.25, 0] },
    pareil: { label: '➡️ Les sons <b>se répètent</b> (pareils)', svg: [0.5, 0.5, 0.5, 0.5, 0.5] },
  };
  const SCALE = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76];
  M.registerSkill({
    id: 'mu-aigu-grave',
    domain: 'mu-sons',
    title: 'Aigu ou grave',
    icon: '🐦',
    starter: true,
    learn: 'mu-l-sons',
    desc: 'Un son aigu (comme un oiseau) ou grave (comme un ours) ? Des sons qui montent, descendent ou se répètent.',
    pda: 'Langage musical A.3.b — registres aigu et grave; organisation mélodique G.4.a — série de sons ascendants, descendants, répétés (1er cycle); B.2.a — symboles aigu / grave, ascendant / descendant',
    gen({ lvl }) {
      const t = lvl === 0 ? 'paire' : lvl === 1 ? pick(['ligne', 'ligne', 'paire']) : pick(['ligne', 'code', 'proche']);
      const inst = pick(['piano', 'xylo', 'flute']);
      if (t === 'paire' || t === 'proche') {
        const want = pick(['aigu', 'grave']);
        const [lo, hi] = t === 'paire' ? [pick([45, 48, 50]), pick([79, 81, 84])] : [pick([57, 60, 62]), pick([67, 69, 72])];
        const highFirst = pick([true, false]);
        const items = (highFirst ? [hi, lo] : [lo, hi]).map((m) => ({ events: [note(inst === 'flute' ? 'piano' : inst, m, 0.7, 0.8)] }));
        const ans = (want === 'aigu') === highFirst ? 0 : 1;
        return which({
          prompt: `Écoute les deux sons. Lequel est le plus <b>${want}</b> ?`,
          items,
          answer: ans,
          hint: 'Un son <b>aigu</b> est haut et fin, comme un petit oiseau 🐦. Un son <b>grave</b> est bas et gros, comme un ours 🐻.',
          explain: `Le son ${ans + 1} est le plus <b>${want}</b>. ${want === 'aigu' ? 'Aigu = haut, comme un oiseau 🐦.' : 'Grave = bas, comme un ours 🐻.'} (Attention : aigu ne veut pas dire fort !)`,
        });
      }
      const dir = pick(['monte', 'descend', 'pareil']);
      const start = dir === 'monte' ? pick([0, 1, 2]) : dir === 'descend' ? pick([7, 8, 9]) : pick([2, 3, 4, 5]);
      const notes = MU.seq(5)
        .map((i) => SCALE[start + (dir === 'monte' ? i * (lvl === 1 ? 2 : 1) : dir === 'descend' ? -i * (lvl === 1 ? 2 : 1) : 0)])
        .map((m) => Math.max(48, Math.min(84, m)));
      const evs = notes.map((m, i) => note(inst, m, 0.7, 0.4, i * 0.45));
      if (t === 'code') {
        return {
          prompt: 'Écoute les sons. Quel dessin va avec ?',
          format: 'choice',
          answer: dir,
          cols: 3,
          choices: shuffle(Object.entries(UP).map(([k, u]) => ({ label: MU.dotsSvg(u.svg, { w: 150, h: 80 }), value: k }))),
          hint: 'Si le son monte, le point monte aussi sur le dessin.',
          explain: `Les sons ${dir === 'monte' ? 'montent ⬆️ : chaque point est plus haut' : dir === 'descend' ? 'descendent ⬇️ : chaque point est plus bas' : 'se répètent ➡️ : les points restent à la même hauteur'}.`,
          _mu: { items: [{ events: evs }] },
          viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
        };
      }
      return {
        prompt: 'Écoute la suite de sons. Que font les sons ?',
        format: 'choice',
        answer: dir,
        choices: shuffle(Object.entries(UP).map(([k, u]) => ({ label: u.label, value: k }))),
        hint: 'Compare le premier son et le dernier : lequel est le plus aigu ?',
        explain:
          dir === 'monte'
            ? "Les sons <b>montent</b> : du grave vers l'aigu, comme un escalier qu'on monte."
            : dir === 'descend'
              ? "Les sons <b>descendent</b> : de l'aigu vers le grave, comme une glissade."
              : "C'est toujours le <b>même son</b> : il se répète.",
        _mu: { items: [{ events: evs }] },
        viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });

  /* ---------------------------------------------------------------- long / court */
  const DUR: Record<MuCodeKind, number> = { 'tres-court': 0.08, court: 0.28, long: 1.1, 'tres-long': 2.2, silence: 0.6 };
  const seqEvents = (parts: MuCodeKind[], inst = 'flute', midi = 69) => {
    let t = 0;
    return parts.reduce<MuEvent[]>((ev, p) => {
      if (p !== 'silence') ev.push(note(inst, midi, 0.7, DUR[p], t));
      t += DUR[p] + 0.32;
      return ev;
    }, []);
  };
  const LBL: Record<MuCodeKind, string> = {
    'tres-court': 'très court',
    court: 'court',
    long: 'long',
    'tres-long': 'très long',
    silence: 'silence',
  };
  M.registerSkill({
    id: 'mu-long-court',
    domain: 'mu-sons',
    title: 'Long ou court',
    icon: '〰️',
    learn: 'mu-l-sons',
    desc: 'Écoute des sons longs, courts et des silences, puis trouve le dessin qui va avec.',
    pda: 'Langage musical A.2.a — durée : long, très long, court, très court, silence (code non traditionnel); B.2.a — symboles de durée (1er cycle)',
    gen({ lvl }) {
      if (lvl === 0) {
        const want = pick(['long', 'court']);
        const longFirst = pick([true, false]);
        const midi = pick([62, 65, 67, 69, 72]); // hauteur variée : pas toujours la même question
        const items = (longFirst ? ['long', 'court'] : ['court', 'long']).map((k) => ({
          events: seqEvents([k === 'long' ? 'tres-long' : 'court'], 'flute', midi),
        }));
        const ans = (want === 'long') === longFirst ? 0 : 1;
        return which({
          prompt: `Écoute les deux sons. Lequel est le plus <b>${want}</b> ?`,
          items,
          answer: ans,
          hint: "Un son <b>long</b> dure longtemps : « ouuuuuu ». Un son <b>court</b> s'arrête vite : « pic ! »",
          explain: `Le son ${ans + 1} est le plus <b>${want}</b>. La <b>durée</b>, c'est le temps que dure un son.`,
        });
      }
      const kinds: MuCodeKind[] = lvl === 1 ? ['court', 'long', 'silence'] : ['tres-court', 'court', 'long', 'tres-long', 'silence'];
      const n = lvl === 1 ? 3 : 4;
      let parts: MuCodeKind[];
      do {
        parts = MU.seq(n).map(() => pick(kinds));
      } while (new Set(parts).size < 2 || parts[0] === 'silence' || parts.filter((p) => p === 'silence').length > 1);
      const key = (ps: MuCodeKind[]) => ps.join(',');
      const wrongs = new Map<string, MuCodeKind[]>();
      for (let i = 0; i < 40 && wrongs.size < 2; i++) {
        const w = parts.slice();
        if (i % 2) {
          const a = M.pick(MU.seq(n)),
            b = M.pick(MU.seq(n));
          [w[a], w[b]] = [w[b], w[a]];
        } else w[M.pick(MU.seq(n))] = pick(kinds);
        if (key(w) !== key(parts) && w[0] !== 'silence') wrongs.set(key(w), w);
      }
      const evs = seqEvents(parts);
      const opts = shuffle([parts, ...wrongs.values()]);
      return {
        prompt: 'Écoute. Quel dessin montre ces sons ?',
        format: 'choice',
        answer: key(parts),
        cols: 1,
        choices: opts.map((ps) => ({
          label: MU.codeSvg(
            ps.map((k) => ({ k })),
            { w: 260, h: 60 },
          ),
          value: key(ps),
        })),
        hint: 'Un long trait = un son long. Un petit trait = un son court. Une case pointillée = un silence.',
        explain: `On a entendu : ${parts.map((p) => `<b>${LBL[p]}</b>`).join(', ')}.`,
        _mu: { items: [{ events: evs }] },
        viz: (el) => MU.player(el, [{ label: 'Écoute', events: evs }], { big: true }),
      };
    },
  });

  /* ---------------------------------------------------------------- sec / résonnant */
  M.registerSkill({
    id: 'mu-sec-resonnant',
    domain: 'mu-sons',
    title: 'Sec ou résonnant',
    icon: '🔔',
    learn: 'mu-l-instruments',
    desc: "Un son sec s'arrête tout de suite; un son résonnant continue de vibrer.",
    pda: 'Langage musical A.5.a — qualités du son : sec, résonnant (1er cycle); B.2.a — symboles sec / résonnant',
    gen({ lvl }) {
      const sec = MU.INSTRUMENTS.filter((x) => x.qualite === 'sec'),
        res = MU.INSTRUMENTS.filter((x) => x.qualite === 'resonnant' && x.id !== 'xylophone');
      if (lvl === 0 || (lvl === 1 && Math.random() < 0.5)) {
        const a = pick(sec),
          b = pick(res),
          want = pick(['sec', 'resonnant']);
        const secFirst = pick([true, false]);
        const pair = secFirst ? [a, b] : [b, a];
        const items = pair.map((x) => ({ events: [{ inst: x.inst, vel: 0.85, dur: x.qualite === 'sec' ? 0.2 : 2 }] }));
        const ans = (want === 'sec') === secFirst ? 0 : 1;
        return which({
          prompt: `Écoute les deux sons. Lequel est <b>${want === 'sec' ? 'sec' : 'résonnant'}</b> ?`,
          items,
          answer: ans,
          hint: "Un son <b>sec</b> s'arrête tout de suite : « toc ! ». Un son <b>résonnant</b> continue de vibrer : « dinnnng… ».",
          explain: `Le son ${ans + 1} est ${want === 'sec' ? 'sec' : 'résonnant'}. Le son 1, c'était ${pair[0].le}; le son 2, ${pair[1].le}. ${b.le.replace(/^./, (c) => c.toUpperCase())} ${/^les /i.test(b.le) ? 'continuent' : 'continue'} de vibrer après le coup.`,
        });
      }
      if (lvl === 1) {
        const x = pick([...sec, ...res]);
        const evs = [{ inst: x.inst, vel: 0.85, dur: x.qualite === 'sec' ? 0.2 : 2 }];
        return {
          prompt: `Écoute ${x.le}. Son son est-il sec ou résonnant ?`,
          format: 'choice',
          cols: 2,
          answer: x.qualite,
          choices: [
            { label: "✋ Sec (il s'arrête tout de suite)", value: 'sec' },
            { label: '〰️ Résonnant (il continue de vibrer)', value: 'resonnant' },
          ],
          hint: 'Après le coup, est-ce que le son continue ?',
          explain: `${x.le.replace(/^./, (c) => c.toUpperCase())} : ${x.qualite === 'sec' ? "son <b>sec</b>, il s'arrête tout de suite" : 'son <b>résonnant</b>, il continue de vibrer'}.`,
          _mu: { items: [{ events: evs }] },
          viz: (el) => MU.player(el, [{ label: x.nom, events: evs, fig: M.art.html(x.art, { size: 72, alt: x.nom }) }], { big: true }),
        };
      }
      const its = shuffle([...M.shuffle(sec).slice(0, 2), ...M.shuffle(res).slice(0, 2)]);
      return {
        prompt: 'Écoute chaque instrument avec les boutons, puis classe-les : son sec ou son résonnant ?',
        format: 'sort',
        bins: [
          { id: 'sec', label: '✋ Sec' },
          { id: 'resonnant', label: '〰️ Résonnant' },
        ],
        items: its.map((x) => ({ label: `${M.art.html(x.art, { size: 40, alt: x.nom })} ${x.nom}`, bin: x.qualite, key: x.id })),
        hint: "Le métal vibre longtemps; un petit morceau de bois s'arrête vite.",
        explain: its.map((x) => `${x.nom} : <b>${x.qualite === 'sec' ? 'sec' : 'résonnant'}</b>`).join(' · ') + '.',
        viz: (el) =>
          MU.player(
            el,
            its.map((x, i) => ({
              label: x.nom,
              color: MU.color(i),
              events: [{ inst: x.inst, vel: 0.85, dur: 1 }],
              fig: M.art.html(x.art, { size: 40, alt: '' }),
            })),
            { autoplay: false },
          ),
      };
    },
  });
})();
