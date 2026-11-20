/* =====================================================================
   anglais/skills/parler.js — domaine en-parler (habiletés 10 à 13)
   Langage fonctionnel (M.EN.EXPR), questions courantes (M.EN.QA_TYPES), sentiments.
   ===================================================================== */

/** Réponse d'une question courante : phrase anglaise + image. */
interface EnQaAnswer {
  en: string;
  pic: string;
}
/** Question courante (M.EN.QA_TYPES) : question entendue, scène, bonne réponse, réponse proche (même type), sens. */
interface EnQa {
  q: string;
  pic: string;
  ok: EnQaAnswer;
  near: EnQaAnswer;
  fr: string;
}

interface EnglishApi {
  /** Deux expressions ne vont pas dans le même choix. */
  exprClash(a: EnExpr, b: EnExpr): boolean;
  /** Types de questions courantes (colour, count, what, weather, feel, age, name). */
  QA_TYPES: Record<string, (lvl: number) => EnQa>;
}

(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;
  const NEEDS: SkillNeed[] = ['speech:en'];

  /* Deux expressions ne vont pas dans le même choix : même groupe, même emoji ou un mot important en commun. */
  const STOP = new Set(['i', "i'm", 'you', 'a', 'the', 'me', 'can', 'is', 'it', 'to', 'and', 'my', 'your', 'go', 'good']);
  const words = (x: EnExpr): Set<string> =>
    new Set(
      x.en
        .toLowerCase()
        .replace(/[^a-z' ]/g, ' ')
        .split(/\s+/)
        .filter((w) => w && !STOP.has(w)),
    );
  const AVOID: [string, string][] = [
    ['thank-you', 'welcome'],
    ['how-are-you', 'fine'],
    ['please', 'yes-please'],
    ['my-turn', 'your-turn'],
    ['hungry', 'water'],
    ['look', 'listen'],
    ['lets-play', 'hello'],
    ['lets-play', 'hi'],
    ['come-here', 'line-up'],
    // paires défendables toutes les deux (audit) : jamais dans le même choix
    ['please', 'excuse-me'],
    ['please', 'help'],
    ['please', 'water'],
    ['please', 'washroom'],
    ['please', 'repeat'],
    ['sorry', 'excuse-me'],
    ['yes-please', 'thank-you'],
    ['here-you-go', 'welcome'],
    ['happy-birthday', 'hooray'],
    ['ready', 'lets-play'],
    ['hi', 'how-are-you'],
    ['hello', 'how-are-you'],
    ['good-job', 'happy-birthday'],
    ['lets-play', 'my-turn'],
  ];
  EN.exprClash = (a, b) => {
    if (a.id === b.id || a.group === b.group || a.emoji === b.emoji) return true;
    if (AVOID.some(([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id))) return true;
    const wa = words(a);
    return [...words(b)].some((w) => wa.has(w));
  };
  const checkExpr = (q: Question): CheckResult => {
    const xs = (('choices' in q && q.choices) || []).map((c) => EN.expr[c.value]).filter(Boolean);
    for (let i = 0; i < xs.length; i++)
      for (let j = i + 1; j < xs.length; j++)
        if (EN.exprClash(xs[i], xs[j])) return `expressions incompatibles : ${xs[i].id} / ${xs[j].id}`;
  };
  const sit = (x: EnExpr): string => `<span class="en-sit"><span class="en-emo">${x.emoji}</span><span>${M.esc(x.situation)}</span></span>`;
  const sayLabel = (text: string): string => `<span class="en-say" lang="en">${M.esc(text)}</span>`;
  const explainExpr = (x: EnExpr): string =>
    `${EN.ear(x.en, x.say)} veut dire <b>« ${M.esc(x.fr)} »</b>. On le dit quand : ${M.esc(x.situation.charAt(0).toLowerCase() + x.situation.slice(1))}`;

  /* ------------------------------ 10. Quand dit-on ça ? ------------------------------ */
  const KINDS: Record<number, string[]> = {
    0: ['greeting', 'courtesy', 'pairwork', 'cheer'],
    1: ['greeting', 'courtesy', 'pairwork', 'cheer', 'needs'],
    2: ['greeting', 'courtesy', 'pairwork', 'cheer', 'needs', 'feelings', 'classroom'],
  };
  M.registerSkill({
    id: 'en-reagir',
    domain: 'en-parler',
    title: 'Quand dit-on ça ?',
    icon: '🤔',
    needs: NEEDS,
    learn: 'en-hello',
    desc: "Écoute l'expression et choisis la situation.",
    pda: 'ALS 1er cycle — C2 : réagir à des messages (courtesy, needs)',
    check: checkExpr,
    gen({ lvl = 0 }) {
      const n = [3, 4, 4][lvl];
      const pool = EN.EXPR.filter((x) => x.lvl <= lvl && KINDS[lvl].includes(x.kind) && x.id !== 'fine');
      const t = M.pickWeighted(pool, (x) => x.id, 'en-reagir');
      const set = EN.pickSet(
        pool.filter((x) => x !== t),
        n,
        t,
        EN.exprClash,
      );
      return {
        prompt: 'Écoute. Quand dit-on ça ?',
        audio: EN.audio(t.say),
        format: 'choice',
        cols: 1,
        choices: set.map((x) => ({ label: sit(x), value: x.id, say: x.situation, lang: 'fr-CA' })),
        answer: t.id, // 🔊 : chaque situation se lit
        hint: 'Pense à ce que tu dirais en français. Réécoute avec 🐢.',
        explain: explainExpr(t),
      };
    },
  });

  /* ------------------------------ 11. Qu'est-ce que tu dis ? ------------------------------ */
  M.registerSkill({
    id: 'en-que-dire',
    domain: 'en-parler',
    title: "Qu'est-ce que tu dis ?",
    icon: '💬',
    needs: NEEDS,
    learn: 'en-hello',
    desc: "Lis la situation et choisis ce qu'on dit en anglais.",
    pda: 'ALS 1er cycle — C2 : amorcer des messages (courtesy, needs, pair work)',
    check: checkExpr,
    gen({ lvl = 0 }) {
      const n = [2, 3, 3][lvl];
      const pool = EN.SAYABLE.filter((x) => x.lvl <= Math.max(1, lvl));
      const t = M.pickWeighted(
        pool.filter((x) => x.lvl <= lvl),
        (x) => x.id,
        'en-que-dire',
      );
      const set = EN.pickSet(
        pool.filter((x) => x !== t),
        n,
        t,
        EN.exprClash,
      );
      return {
        prompt: `${M.esc(t.situation)} Qu'est-ce que tu dis ?`,
        scene: [{ emoji: t.emoji, label: t.situation }],
        format: 'choice',
        cols: 1,
        lang: LANG,
        audioOnly: lvl === 2,
        choices: set.map((x) => ({ label: sayLabel(x.en), value: x.id, say: x.say, lang: LANG })),
        answer: t.id,
        hint: 'Touche 🔊 pour écouter chaque phrase. Pense à ce que tu dirais en français.',
        explain: explainExpr(t),
      };
    },
  });

  /* ------------------------------ 12. Réponds à la question ------------------------------ */
  // Types de questions courantes; chaque type donne une scène, une bonne réponse (image + phrase) et des réponses « d'un autre type ».
  const NAMES: [name: string, emoji: string][] = [
    ['Max', '🦫'],
    ['Lily', '🐰'],
    ['Sam', '🐻'],
    ['Mia', '🦊'],
  ];
  const QA_TYPES: Record<string, (lvl: number) => EnQa> = {
    colour() {
      const o = M.pick(EN.COLOR_OBJ.filter((x) => x.art !== 'en-mittens'));
      const c = M.pick(EN.ofTheme('colours', 1));
      const other = M.pick(EN.ofTheme('colours', 1).filter((x) => x !== c));
      return {
        q: 'What colour is it?',
        pic: EN.pic({ art: o.art, color: c.id }, 110),
        ok: { en: `It's ${c.word}.`, pic: EN.pic({ art: 'en-swatch', color: c.id }, 56) },
        near: { en: `It's ${other.word}.`, pic: EN.pic({ art: 'en-swatch', color: other.id }, 56) },
        fr: `« Quelle couleur est-ce ? » — « C'est ${c.fr}. »`,
      };
    },
    count(lvl) {
      const [emoji] = M.pick([['🍎'], ['🦆'], ['⭐'], ['🎈'], ['🐟']]);
      const n = M.rnd(2, lvl === 0 ? 5 : 9);
      const m = n + M.pick([-1, 1]);
      // k de 1 à 10 : toujours dans le vocabulaire des nombres (0 à 20)
      const w = (k: number): string => EN.word[EN.VOCAB.find((x) => x.theme === 'numbers' && x.n === k)!.id].word;
      return {
        q: 'How many?',
        pic: `<span class="en-coll" style="font-size:2.2rem">${Array(n)
          .fill(emoji)
          .map((e) => `<span>${e}</span>`)
          .join('')}</span>`,
        ok: { en: M.fr.cap(w(n)) + '.', pic: EN.digit(n) },
        near: { en: M.fr.cap(w(m)) + '.', pic: EN.digit(m) },
        fr: `« Combien ? » — « ${M.fr.cap(M.frNum(n))}. »`,
      };
    },
    what() {
      const ws = EN.pickSet(
        EN.VOCAB.filter(
          (w) =>
            ['animals', 'food', 'toys'].includes(w.theme) &&
            w.picture === 'ok' &&
            w.lvl <= 1 &&
            w.emoji &&
            !['grapes', 'pancakes', 'skates'].includes(w.id),
        ),
        2,
      );
      return {
        q: "What's this?",
        pic: EN.pic(ws[0], 110),
        ok: { en: `It's ${ws[0].say}.`, pic: EN.pic(ws[0], 52) },
        near: { en: `It's ${ws[1].say}.`, pic: EN.pic(ws[1], 52) },
        fr: `« Qu'est-ce que c'est ? » — ${M.esc(ws[0].fr)} ${ws[0].emoji}`,
      };
    },
    weather() {
      const ws = EN.pickSet(EN.ofTheme('weather', 1), 2);
      return {
        q: "What's the weather today?",
        pic: EN.pic(ws[0], 110),
        ok: { en: ws[0].say, pic: EN.pic(ws[0], 52) },
        near: { en: ws[1].say, pic: EN.pic(ws[1], 52) },
        fr: `« Quel temps fait-il aujourd'hui ? » — « ${M.fr.cap(ws[0].fr)}. »`,
      };
    },
    feel() {
      const ws = EN.pickSet(EN.ofTheme('feelings', 1), 2);
      return {
        q: 'How are you?',
        pic: EN.pic(ws[0], 110),
        ok: { en: ws[0].say, pic: EN.pic(ws[0], 52) },
        near: { en: ws[1].say, pic: EN.pic(ws[1], 52) },
        fr: `« Comment ça va ? » — « Je suis ${ws[0].fr}. »`,
      };
    },
    age() {
      const n = M.rnd(5, 9),
        m = n === 9 ? 8 : n + 1;
      // k de 5 à 10 : toujours dans le vocabulaire des nombres (0 à 20)
      const w = (k: number): string => EN.VOCAB.find((x) => x.theme === 'numbers' && x.n === k)!.word;
      return {
        q: 'How old are you?',
        pic: `<span class="en-emo" style="font-size:80px">🎂</span>${EN.digit(n)}`,
        ok: { en: `I'm ${w(n)}.`, pic: EN.digit(n) },
        near: { en: `I'm ${w(m)}.`, pic: EN.digit(m) },
        fr: `« Quel âge as-tu ? » — « J'ai ${M.frNum(n)} ans. »`,
      };
    },
    name() {
      const [[n, e], [m]] = M.shuffle(NAMES);
      return {
        q: "What's your name?",
        pic: `<span class="en-emo" style="font-size:80px">${e}</span><span class="tag">🏷️ ${n}</span>`,
        ok: { en: `My name is ${n}.`, pic: `🏷️ ${n}` },
        near: { en: `My name is ${m}.`, pic: `🏷️ ${m}` },
        fr: `« Comment t'appelles-tu ? » — « Je m'appelle ${n}. »`,
      };
    },
  };
  EN.QA_TYPES = QA_TYPES;
  const QA_BY_LVL: Record<number, string[]> = {
    0: ['colour', 'count', 'what'],
    1: ['colour', 'count', 'what', 'weather', 'feel', 'age', 'name'],
    2: ['colour', 'count', 'what', 'weather', 'feel', 'age', 'name'],
  };
  M.registerSkill({
    id: 'en-questions',
    domain: 'en-parler',
    title: 'Réponds à la question',
    icon: '❓',
    needs: NEEDS,
    learn: 'en-emotions-meteo',
    desc: 'Écoute la question et choisis la bonne réponse.',
    pda: "ALS 1er cycle — Contextual Language : routines (common inquiries : What's your name? How are you? What colour is it?)",
    gen({ lvl = 0 }) {
      const types = QA_BY_LVL[lvl];
      const type = M.pick(types);
      if (lvl === 0) {
        // réponse en image : comprendre le MOT de question (couleur ? combien ? quoi ?)
        const c = QA_TYPES.colour(0),
          k = QA_TYPES.count(0),
          w = QA_TYPES.what(0);
        const mains: Record<string, EnQa> = { colour: c, count: k, what: w };
        const m = mains[type];
        const set = [
          { ...m.ok, v: 'ok' },
          { ...(type === 'colour' ? k : c).ok, v: 'x1' },
          { ...(type === 'what' ? k : w).ok, v: 'x2' },
        ];
        return {
          prompt: `Écoute la question et touche la bonne réponse.<div class="en-qpic">${m.pic}</div>`,
          audio: EN.audio(m.q),
          format: 'choice',
          cols: 3,
          choices: M.shuffle(set).map((a) => ({ label: `<span class="en-pic-lbl">${a.pic}</span>`, value: a.v })),
          answer: 'ok',
          hint: 'Écoute le mot de question : <span lang="en">colour</span> (couleur), <span lang="en">how many</span> (combien), <span lang="en">what</span> (quoi).',
          explain: `${EN.ear(m.q)} ${EN.ear(m.ok.en)} — ${m.fr}`,
        };
      }
      const main = QA_TYPES[type](lvl);
      // une réponse du même type mais fausse + des réponses à d'autres questions
      const others = M.shuffle(types.filter((t) => t !== type))
        .slice(0, 2)
        .map((t) => QA_TYPES[t](lvl).ok);
      let set = [{ ...main.ok, v: 'ok' }, { ...main.near, v: 'near' }, ...others.map((o, i) => ({ ...o, v: 'o' + i }))].slice(
        0,
        lvl === 2 ? 3 : 4,
      );
      const seen = new Set<string>();
      set = set.filter((a) => (seen.has(a.en) ? false : seen.add(a.en)));
      return {
        prompt:
          (lvl === 2 ? 'Écoute la question, puis écoute chaque réponse.' : 'Écoute la question et choisis la bonne réponse.') +
          `<div class="en-qpic">${main.pic}</div>`,
        audio: EN.audio(main.q),
        format: 'choice',
        cols: 1,
        lang: LANG,
        audioOnly: lvl === 2,
        choices: M.shuffle(set).map((a) => ({ label: sayLabel(a.en), value: a.v, say: a.en, lang: LANG })),
        answer: 'ok',
        hint: "Regarde bien l'image et réécoute la question avec 🐢.",
        explain: `${EN.ear(main.q)} ${EN.ear(main.ok.en)} — ${main.fr}`,
      };
    },
  });

  /* ------------------------------ 13. Comment ça va ? ------------------------------ */
  const REASONS: Record<string, string[]> = {
    happy: ["I'm happy. It's my birthday!", "I'm happy. I have a new puppy!"],
    sad: ["I'm sad. I lost my ball.", "I'm sad. My friend is not here today."],
    angry: ["I'm angry! My brother broke my toy!", "I'm angry! It's not fair!"],
    tired: ["I'm tired. I want to go to bed.", "I'm tired. I ran all day."],
    scared: ["I'm scared. There is a big spider!", "I'm scared. It's dark!"],
    sick: ["I'm sick. My tummy hurts.", "I'm sick. I have a fever."],
    surprised: ["I'm surprised. Look, it's snowing!", "I'm surprised. A big box for me?", "I'm surprised. Wow, a rainbow!"],
  };
  REASONS.happy.push("I'm happy. We go to the park!", "I'm happy. Grandma is here!");
  REASONS.sad.push("I'm sad. My fish is sick.", "I'm sad. It's raining. No park today.");
  REASONS.angry.push("I'm angry! My sister took my crayons!");
  REASONS.tired.push("I'm tired. It's late.");
  REASONS.scared.push("I'm scared. The dog is very big!");
  const PEOPLE = ['Max', 'Lily', 'Sam', 'Zoe', 'Noah', 'Ava', 'Leo', 'Mia', 'Ben'];
  // Niveau 0 : les visages les plus faciles à distinguer (sans « sick » ni « surprised »)
  const FEEL0 = ['happy', 'sad', 'angry', 'tired', 'scared'];
  M.registerSkill({
    id: 'en-sentiments',
    domain: 'en-parler',
    title: 'Comment ça va ?',
    icon: '😀',
    starter: true,
    needs: NEEDS,
    learn: 'en-emotions-meteo',
    desc: "Écoute comment se sent l'enfant et touche le bon visage.",
    pda: 'ALS 1er cycle — Contextual Language : ideas, feelings (« Happy, today. »)',
    check: EN.checkChoices,
    gen({ lvl = 0 }) {
      const pool = lvl === 0 ? FEEL0.map((id) => EN.word[id]) : EN.ofTheme('feelings', 1);
      const n = [3, 5, 6][lvl];
      const t = M.pickWeighted(pool, (w) => w.id, 'en-sentiments');
      const set = EN.pickSet(
        pool.filter((w) => w !== t),
        n,
        t,
      );
      // phrase entendue : « I'm sad. » · « Max is sad. » · avec une raison « I'm happy. It's my birthday! »
      const r = Math.random(),
        who = M.pick(PEOPLE);
      let text = t.say;
      if (lvl === 0) text = r < 0.4 ? t.say : r < 0.7 ? `${who} is ${t.word}.` : REASONS[t.id][0];
      if (lvl === 1) text = r < 0.3 ? t.say : r < 0.6 ? `${who} is ${t.word}.` : M.pick(REASONS[t.id]);
      if (lvl === 2) text = r < 0.6 ? M.pick(REASONS[t.id]) : `${who} says: ${M.pick(REASONS[t.id])}`;
      return {
        prompt: 'Écoute. Comment se sent cet enfant ? Touche le bon visage.',
        audio: EN.audio(text),
        format: 'choice',
        cols: 3,
        choices: set.map((w) => EN.picChoice(w, 60)),
        answer: t.id,
        hint: 'Écoute le mot de sentiment. Fais la tête avec ton visage !',
        explain: `${EN.ear(text)} — ${EN.ear(t.word)} veut dire <b>${M.esc(t.fr)}</b> ${t.emoji}.`,
      };
    },
  });
})();
