/* =====================================================================
   anglais/skills/bouger.js — domaine en-bouger (habiletés 7 à 9, TPR)
   Corps d'enfant (M.EN.bodySvg), scènes SVG (M.EN.scene), poses d'action.
   ===================================================================== */

/** Objet d'une scène (M.EN.scene) : emoji ou dessin, zone data-hot = id. */
interface EnSceneObj {
  id: string;
  emoji?: string;
  art?: string;
  color?: string;
  /** Taille (px du viewBox, défaut 76). */
  size?: number;
}

interface EnglishApi {
  /** Partie du corps → « sa tête », « ses yeux »… */
  FR_POSS: Record<string, string>;
  /** Scène SVG : objets placés au hasard sur un décor (farm, bedroom, classroom, winter, home). */
  scene(bg: string, objs: EnSceneObj[], opts?: { label?: string }): string;
}

(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;
  const NEEDS: SkillNeed[] = ['speech:en'];

  /* ------------------------------ 7. Touche ton nez ! ------------------------------ */
  const PARTS: Record<number, string[]> = {
    0: ['head', 'hands', 'feet', 'tummy', 'arms', 'legs'],
    1: ['head', 'hands', 'feet', 'tummy', 'arms', 'legs', 'eyes', 'nose', 'mouth', 'ears'],
    2: ['head', 'hands', 'feet', 'tummy', 'arms', 'legs', 'eyes', 'nose', 'mouth', 'ears', 'hair', 'knees', 'toes', 'shoulders'],
  };
  const FR_POSS: Record<string, string> = {
    head: 'sa tête',
    eyes: 'ses yeux',
    nose: 'son nez',
    mouth: 'sa bouche',
    ears: 'ses oreilles',
    hair: 'ses cheveux',
    arms: 'ses bras',
    hands: 'ses mains',
    legs: 'ses jambes',
    knees: 'ses genoux',
    feet: 'ses pieds',
    toes: 'ses orteils',
    shoulders: 'ses épaules',
    tummy: 'son ventre',
  };
  EN.FR_POSS = FR_POSS;
  const SUBS: Record<string, string[]> = {
    head: ['eyes', 'nose', 'mouth', 'ears', 'hair'],
    legs: ['knees'],
    feet: ['toes'],
    arms: ['shoulders'],
  };
  M.registerSkill<QuestionOf<'hotspot'>>({
    id: 'en-corps',
    domain: 'en-bouger',
    title: 'Touche ton nez !',
    icon: '👃',
    needs: NEEDS,
    learn: 'en-corps',
    desc: 'Écoute « Touch your… » et touche la bonne partie du corps.',
    pda: 'ALS 1er cycle — Contextual Language : action words; stratégie : réponse physique (TPR)',
    check(q) {
      if (!/data-hot="[a-z]+"/.test(q.html)) return 'pas de zones';
    },
    gen({ lvl = 0 }) {
      const zones = PARTS[lvl];
      const part = M.pickWeighted(zones, (p) => p, 'en-corps');
      // au niveau 2, « head » seul serait trop petit (yeux, nez… sont des zones à part) : on le replie
      const fold = SUBS[part] ? [part] : [];
      // consignes variées (TPR) : Touch / Show me / Point to / Where is…?
      const plural = !['head', 'tummy', 'nose', 'mouth', 'hair'].includes(part);
      const forms = [`Touch your ${part}.`, `Show me your ${part}.`, `Point to your ${part}.`, `Touch your ${part}, please.`];
      if (lvl >= 1)
        forms.push(`Where ${plural ? 'are' : 'is'} your ${part}?`, `${M.pick(['Max', 'Lily', 'Sam', 'Mia'])}, touch your ${part}!`);
      const cmd = M.pick(forms);
      return {
        prompt: 'Écoute et touche la bonne partie du corps.',
        audio: EN.audio(cmd),
        format: 'hotspot',
        lang: LANG,
        html: EN.bodySvg({ zones, fold }),
        answer: part,
        answerText: `${FR_POSS[part]} (${part})`,
        answerSay: cmd,
        hint: "Montre-le d'abord sur toi ! Puis écoute encore avec 🐢.",
        explain: `${EN.ear(cmd)} : on touche <b>${FR_POSS[part]}</b>.`,
      };
    },
  });

  /* ------------------------------ 8. Trouve dans l'image ------------------------------ */
  const BG: Record<string, string> = {
    farm: '<rect width="400" height="300" fill="#bfe6ff"/><circle cx="350" cy="40" r="24" fill="#ffd166"/><rect y="105" width="400" height="195" fill="#9ad27a"/><path d="M20 105 L20 50 L60 22 L100 50 L100 105 Z" fill="#c0392b" stroke="#7b241c" stroke-width="3"/><rect x="48" y="70" width="24" height="35" fill="#fff"/><path d="M130 105 v-18 M150 105 v-18 M170 105 v-18 M190 105 v-18 M120 92 h80" stroke="#8d5524" stroke-width="5"/>',
    bedroom:
      '<rect width="400" height="300" fill="#fdf0d5"/><rect y="110" width="400" height="190" fill="#e0b98a"/><rect x="290" y="14" width="80" height="70" rx="6" fill="#cfe9f7" stroke="#8d5524" stroke-width="5"/><line x1="330" y1="14" x2="330" y2="84" stroke="#8d5524" stroke-width="4"/><rect x="20" y="40" width="110" height="64" rx="10" fill="#9b5de5" opacity=".35"/>',
    classroom:
      '<rect width="400" height="300" fill="#fef6e4"/><rect y="110" width="400" height="190" fill="#d9c7a7"/><rect x="70" y="12" width="260" height="84" rx="6" fill="#2e6b4f" stroke="#8d5524" stroke-width="6"/><text x="200" y="64" text-anchor="middle" font-size="26" fill="#fff" font-family="sans-serif">A B C 1 2 3</text>',
    winter:
      '<rect width="400" height="300" fill="#dbeefc"/><rect y="105" width="400" height="195" fill="#ffffff"/><path d="M0 105 Q100 90 200 105 T400 105" fill="#fff" stroke="#c9dff0" stroke-width="3"/><g fill="#9cc7e6"><circle cx="40" cy="30" r="3"/><circle cx="120" cy="60" r="3"/><circle cx="210" cy="24" r="3"/><circle cx="300" cy="66" r="3"/><circle cx="370" cy="30" r="3"/></g>',
    home: '<rect width="400" height="300" fill="#fff1e0"/><rect y="115" width="400" height="185" fill="#c9a27a"/><rect x="40" y="20" width="70" height="56" fill="#cfe9f7" stroke="#fff" stroke-width="6"/><rect x="270" y="30" width="90" height="60" rx="8" fill="#f2c14e" opacity=".5"/>',
  };
  const SLOTS: [number, number][] = [
    [52, 160],
    [150, 160],
    [250, 160],
    [348, 160],
    [52, 252],
    [150, 252],
    [250, 252],
    [348, 252],
  ];
  /** Scène : objets [{ id, emoji | art, color, size? }] placés au hasard. */
  EN.scene = (bg, objs, { label = 'Une scène' } = {}) => {
    const slots = M.shuffle(SLOTS).slice(0, objs.length);
    const body = objs
      .map((o, i) => {
        const [x, y] = slots[i],
          s = o.size || 76;
        const pic = o.art
          ? EN.place(EN.svg(o.art, { color: o.color }), x - s / 2, y - s / 2, s, s)
          : `<text x="${x}" y="${y + 4}" font-size="${Math.round(s * 0.74)}" text-anchor="middle" dominant-baseline="middle">${o.emoji}</text>`;
        return `<g data-hot="${o.id}"><ellipse cx="${x}" cy="${y + 40}" rx="30" ry="6" fill="#000" opacity=".1"/><rect x="${x - 44}" y="${y - 42}" width="88" height="84" rx="14" fill="transparent"/>${pic}</g>`;
      })
      .join('');
    return `<svg class="en-scene" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${M.esc(label)}">${BG[bg] || ''}${body}</svg>`;
  };
  const W = (id: string): EnWord => EN.word[id];
  const SCENES: Record<string, string[]> = {
    farm: ['cow', 'pig', 'horse', 'duck', 'dog', 'cat', 'rabbit', 'mouse', 'bird', 'frog'],
    bedroom: ['teddy-bear', 'robot', 'puzzle', 'train', 'kite', 'balloon', 'book', 'cat'],
    classroom: ['book', 'pencil', 'crayon', 'scissors', 'ruler', 'backpack', 'computer', 'eraser'],
    winter: ['snowman', 'tree', 'sled', 'skates', 'scarf', 'dog', 'boots', 'bird'],
  };
  const objOf = (w: EnWord): EnSceneObj => ({ id: w.id, emoji: w.emoji, art: w.art, color: w.color });
  M.registerSkill({
    id: 'en-trouve',
    domain: 'en-bouger',
    title: "Trouve dans l'image",
    icon: '🔎',
    needs: NEEDS,
    learn: 'en-classe',
    desc: "Écoute et touche l'objet dans la scène.",
    pda: 'ALS 1er cycle — Contextual Language : instructions; C1 éléments clés; description',
    gen({ lvl = 0 }) {
      const mode = lvl === 0 ? 'object' : lvl === 1 ? M.pick(['object', 'colour', 'colour']) : M.pick(['family', 'size', 'colour']);
      if (mode === 'object') {
        const bg = M.pick(Object.keys(SCENES));
        const ws = EN.pickSet(
          SCENES[bg].map(W).filter((w) => w.lvl <= lvl + 1),
          lvl === 0 ? 5 : 7,
        );
        const t = M.pick(ws);
        const cmd = `Touch the ${t.word}.`;
        return {
          prompt: "Écoute et touche la bonne chose dans l'image.",
          audio: EN.audio(cmd),
          format: 'hotspot',
          lang: LANG,
          html: EN.scene(bg, ws.map(objOf)),
          answer: t.id,
          answerText: t.fr,
          answerSay: cmd,
          hint: 'Écoute encore avec 🐢. ' + EN.themeHint(t),
          explain: `${EN.ear(cmd)} — ${EN.ear(t.word, t.say)} veut dire <b>${M.esc(t.fr)}</b> ${EN.wordPic(t, 28)}.`,
        };
      }
      if (mode === 'family') {
        const fam = EN.pickSet(['grandma', 'grandpa', 'mom', 'dad', 'baby'].map(W), 5);
        const t = M.pick(fam);
        const extra = [W('dog'), W('cat')];
        const cmd = `Where is ${t.id === 'baby' ? 'the baby' : t.word}? Touch ${t.id === 'baby' ? 'the baby' : t.word}.`;
        return {
          prompt: 'Écoute et touche la bonne personne.',
          audio: EN.audio(cmd),
          format: 'hotspot',
          lang: LANG,
          html: EN.scene('home', fam.concat(extra).map(objOf), { label: 'Une famille' }),
          answer: t.id,
          answerText: t.fr,
          answerSay: `Touch ${t.id === 'baby' ? 'the baby' : t.word}.`,
          hint: 'Réécoute avec 🐢 : qui est-ce dans la famille ?',
          explain: `${EN.ear(cmd)} — ${EN.ear(t.word)} = <b>${M.esc(t.fr)}</b> ${t.emoji}.`,
        };
      }
      // couleur (et taille au niveau 2) : plusieurs objets pareils de couleurs différentes
      const kinds = [
        { art: 'en-tuque', w: 'toque', bg: 'winter', fr: 'la tuque', f: true },
        { art: 'en-mittens', w: 'mittens', bg: 'winter', fr: 'les mitaines', f: true, pl: true },
        { art: 'en-ball', w: 'ball', bg: 'bedroom', fr: 'le ballon' },
        { art: 'en-car', w: 'car', bg: 'bedroom', f: true, fr: "l'auto" },
      ];
      const k = M.pick(mode === 'size' ? kinds.filter((x) => x.w !== 'mittens') : kinds);
      const cols = EN.pickSet(
        EN.ofTheme('colours', lvl).filter((c) => c.id !== 'white'),
        mode === 'size' ? 2 : 3,
      );
      const objs: (EnSceneObj & { c: EnWord; b?: string })[] = [];
      if (mode === 'size')
        cols.forEach((c) =>
          ['big', 'little'].forEach((b) => objs.push({ id: b + '-' + c.id, art: k.art, color: c.id, size: b === 'big' ? 84 : 46, c, b })),
        );
      else cols.forEach((c) => objs.push({ id: c.id, art: k.art, color: c.id, c }));
      const others = EN.pickSet(
        SCENES[k.bg].map(W).filter((w) => w.lvl <= 1),
        mode === 'size' ? 2 : 3,
      ).map(objOf);
      const t = M.pick(objs);
      const cmd = `Touch the ${t.b ? t.b + ' ' : ''}${t.c.word} ${k.w}.`;
      return {
        prompt: mode === 'size' ? 'Écoute bien la taille et la couleur, puis touche.' : 'Écoute bien la couleur, puis touche.',
        audio: EN.audio(cmd),
        format: 'hotspot',
        lang: LANG,
        html: EN.scene(k.bg, [...objs, ...others]),
        answer: t.id,
        answerText: `${k.fr} (${t.b ? (t.b === 'big' ? (k.f ? 'grosse, ' : 'gros, ') : k.f ? 'petite, ' : 'petit, ') : ''}${EN.frColour(t.c.fr, k)})`,
        answerSay: cmd,
        hint:
          (t.b ? '<span lang="en">Big</span> = gros, <span lang="en">little</span> = petit. ' : '') + 'Écoute le mot de couleur avec 🐢.',
        explain: `${EN.ear(cmd)} — ${t.b ? `${k.fr.startsWith('le ') ? 'le' : 'la'} ${t.b === 'big' ? (k.f ? 'grosse' : 'gros') : k.f ? 'petite' : 'petit'} ${k.fr.replace(/^(le |la |l')/, '')}` : k.fr} <b>${M.esc(EN.frColour(t.c.fr, k))}</b> ${EN.pic({ art: k.art, color: t.c.id }, 30)}.`,
      };
    },
  });

  /* ------------------------------ 9. Jacques a dit… en anglais ------------------------------ */
  // Poses qui se ressemblent : jamais ensemble avant le niveau 2
  const CONFUSE = [
    ['raise-hand', 'wave'],
    ['raise-hand', 'point'],
    ['wave', 'point'],
    ['eat', 'drink'],
    ['stand-up', 'point'],
    ['stand-up', 'wave'],
    ['stand-up', 'raise-hand'],
  ];
  const confuse = (a: EnWord, b: EnWord): boolean => CONFUSE.some(([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id));
  M.registerSkill({
    id: 'en-actions',
    domain: 'en-bouger',
    title: 'Jacques a dit… en anglais',
    icon: '🙋',
    needs: NEEDS,
    learn: 'en-classe',
    desc: "Écoute la consigne et touche l'enfant qui la fait.",
    pda: 'ALS 1er cycle — Contextual Language : routines (instructions, action words : Stand up. Come here.)',
    gen({ lvl = 0 }) {
      const n = [3, 4, 6][lvl];
      const pool = EN.ofTheme('actions', lvl);
      const t = M.pickWeighted(pool, (w) => w.id, 'en-actions');
      const set = EN.pickSet(
        pool.filter((w) => w !== t),
        n,
        t,
        lvl < 2 ? (a, b) => a.id === b.id || confuse(a, b) : (a, b) => a.id === b.id,
      );
      return {
        prompt: "Écoute la consigne et touche l'enfant qui la fait.",
        audio: EN.audio(t.word),
        format: 'choice',
        cols: 3,
        choices: set.map((w) => ({ label: `<span class="en-pose">${EN.pic(w, 112)}</span>`, value: w.id })),
        answer: t.id,
        hint: 'Fais le geste toi-même, puis regarde les dessins !',
        explain: `${EN.ear(t.word)} : <b>${M.esc(t.fr)}</b>`,
      };
    },
  });
})();
