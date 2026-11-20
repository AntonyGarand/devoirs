/* =====================================================================
   anglais/skills/mots.js — domaine en-mots (habiletés 1 à 6)
   + aides partagées par toutes les habiletés d'anglais (M.EN.*) :
     EN.audio(text|seq)       audio anglais (🔊 Écoute / 🐢 Lentement)
     EN.pickSet(pool, n, t)   n éléments sans conflit (sameAs, homophones, même image), t inclus
     EN.picChoice(w)          choix-image pour un mot
     EN.explainWord(w)        « cat 🔊 veut dire chat 🐱 »
   Les générateurs gen() ne touchent jamais au DOM.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;
  const NEEDS = ['speech:en'];

  /* ------------------------------ aides partagées ------------------------------ */
  EN.audio = (x, extra = {}) => (Array.isArray(x) ? { seq: x, lang: LANG, pause: 900, ...extra } : { text: x, lang: LANG, ...extra });
  /** n éléments distincts (sans conflit deux à deux) de pool; target est inclus. clash(a, b) facultatif. */
  EN.pickSet = (pool, n, target, clash = EN.clash) => {
    for (let guard = 0; guard < 40; guard++) {
      const out = target ? [target] : [];
      for (const c of M.shuffle(pool)) {
        if (out.length >= n) break;
        if (out.some((o) => clash(o, c))) continue;
        out.push(c);
      }
      if (out.length >= n) return M.shuffle(out);
    }
    throw new Error('pickSet : pas assez d\'éléments compatibles (' + (target && target.id) + ')');
  };
  EN.picChoice = (w, size = 64) => ({ label: `<span class="en-pic-lbl">${EN.wordPic(w, size)}</span>`, value: w.id });
  EN.explainWord = (w) => `${EN.ear(w.word, w.say)} veut dire <b>${M.esc(w.fr)}</b> ${EN.wordPic(w, 30)}.`;
  const THEME_HINT = {
    animals: 'C\'est un animal.', food: 'Ça se mange ou ça se boit.', clothes: 'C\'est un vêtement.', family: 'C\'est une personne de la famille.',
    school: 'On le trouve à l\'école.', body: 'C\'est une partie du corps.', weather: 'C\'est la météo.', seasons: 'C\'est une saison.',
    feelings: 'C\'est un sentiment.', toys: 'C\'est un jouet.', things: 'On le voit autour de soi.', colours: 'C\'est une couleur.',
  };
  EN.themeHint = (w) => THEME_HINT[w.theme] || '';
  const listenHint = (w) => `Écoute encore avec 🐢. ${EN.themeHint(w)}${w.cognate ? ' Ça ressemble à un mot français !' : ''}`;
  /** Le choix ne doit contenir que des valeurs sans conflit (sameAs, homophones, même image). */
  EN.checkChoices = (q) => {
    const ids = (q.choices || []).map((c) => c.value).filter((v) => EN.word[v]);
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if (EN.clash(ids[i], ids[j])) return `conflit entre ${ids[i]} et ${ids[j]}`;
  };

  /* Mots imageables pour l'écoute (pas les nombres, couleurs, actions, ni les images « en contexte »). */
  const LISTEN_THEMES = ['animals', 'food', 'clothes', 'family', 'school', 'body', 'weather', 'seasons', 'feelings', 'toys', 'things'];
  const imageable = (maxLvl, themes = LISTEN_THEMES) => EN.VOCAB.filter((w) => w.picture === 'ok' && w.lvl <= maxLvl && themes.includes(w.theme));

  /* ------------------------------ 1. Écoute et touche l'image ------------------------------ */
  M.registerSkill({
    id: 'en-ecoute-image', domain: 'en-mots', title: 'Écoute et touche l\'image', icon: '👂', starter: true, needs: NEEDS, learn: 'en-mots-themes',
    desc: 'Écoute un mot anglais et touche la bonne image.',
    pda: 'ALS 1er cycle — C2 : décoder des messages (repertoire : objects, people)',
    check: EN.checkChoices,
    gen({ lvl = 0 }) {
      const n = [3, 4, 6][lvl];
      let target, pool;
      if (lvl < 2) {
        // même thème : l'image seule ne trahit pas la réponse
        const themes = LISTEN_THEMES.filter((t) => imageable(lvl, [t]).length >= n + 1);
        const t = M.pick(themes);
        pool = imageable(lvl, [t]);
        target = M.pickWeighted(pool, (w) => w.id, 'en-ecoute-image');
      } else {
        pool = imageable(2);
        target = M.pickWeighted(pool, (w) => w.id, 'en-ecoute-image');
      }
      const set = EN.pickSet(pool.filter((w) => w !== target), n, target);
      return {
        prompt: 'Écoute et touche la bonne image.',
        audio: EN.audio(target.say),
        format: 'choice', cols: n === 4 ? 2 : 3,
        choices: set.map((w) => EN.picChoice(w, 64)),
        answer: target.id,
        hint: listenHint(target),
        explain: EN.explainWord(target),
      };
    },
  });

  /* ------------------------------ 2. Les couleurs ------------------------------ */
  /** « a red ball » / « an orange ball » : an devant un son voyelle. */
  const aAn = (w) => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
  EN.aAn = aAn;
  /** Couleur accordée au nom français : « maison blanche », « mitaines grises », « chandail vert ». */
  const FEM = { bleu: 'bleue', vert: 'verte', brun: 'brune', noir: 'noire', gris: 'grise', blanc: 'blanche' };
  EN.frColour = (fr, { f = false, pl = false } = {}) => {
    let w = f ? FEM[fr] || fr : fr;
    if (pl && fr !== 'orange' && !/s$/.test(w)) w += 's';
    return w;
  };
  const COLOR_OBJ = [
    { art: 'en-ball', say: (c, b) => aAn(`${b ? b + ' ' : ''}${c} ball`), fr: 'ballon', le: 'le ballon', sized: true },
    { art: 'en-car', say: (c, b) => aAn(`${b ? b + ' ' : ''}${c} car`), fr: 'auto', le: 'l\'auto', f: true, sized: true },
    { art: 'en-house', say: (c, b) => aAn(`${b ? b + ' ' : ''}${c} house`), fr: 'maison', le: 'la maison', f: true, sized: true },
    { art: 'en-tuque', say: (c, b) => aAn(`${b ? b + ' ' : ''}${c} toque`), fr: 'tuque', le: 'la tuque', f: true, sized: true },
    { art: 'en-mittens', say: (c) => `${c} mittens`, fr: 'mitaines', le: 'les mitaines', f: true, pl: true },
    { art: 'en-sweater', say: (c) => aAn(`${c} sweater`), fr: 'chandail', le: 'le chandail' },
  ];
  /** « maison blanche », « gros ballon rouge » */
  EN.frObjColour = (o, c, size) => `${size ? (size === 'big' ? (o.f ? 'grosse' : 'gros') : (o.f ? 'petite' : 'petit')) + (o.pl ? 's' : '') + ' ' : ''}${o.fr} ${EN.frColour(c.fr, o)}`;
  EN.COLOR_OBJ = COLOR_OBJ;
  const colourWords = (maxLvl) => EN.ofTheme('colours', maxLvl);
  M.registerSkill({
    id: 'en-couleurs', domain: 'en-mots', title: 'Les couleurs', icon: '🎨', starter: true, needs: NEEDS, learn: 'en-mots-themes',
    desc: 'Écoute la couleur, puis une petite description.',
    pda: 'ALS 1er cycle — Repertoire : description (« Big blue pants »)',
    gen({ lvl = 0 }) {
      if (lvl === 0) {
        const pool = colourWords(0);
        const target = M.pickWeighted(pool, (w) => w.id, 'en-couleurs');
        const set = EN.pickSet(pool.filter((w) => w !== target), 4, target);
        return {
          prompt: 'Écoute la couleur et touche-la.', audio: EN.audio(target.word), format: 'choice', cols: 4,
          choices: set.map((w) => EN.picChoice(w, 64)), answer: target.id,
          hint: 'Écoute encore avec 🐢.' + (target.cognate ? ' Ça ressemble à un mot français !' : ''),
          explain: EN.explainWord(target),
        };
      }
      const pool = colourWords(2);
      if (lvl === 1) {
        const obj = M.pick(COLOR_OBJ);
        const set = EN.pickSet(pool, 4);
        const target = M.pick(set);
        return {
          prompt: 'Écoute et touche le bon dessin.', audio: EN.audio(obj.say(target.word)), format: 'choice', cols: 4,
          choices: set.map((c) => ({ label: EN.pic({ art: obj.art, color: c.id, fr: EN.frObjColour(obj, c) }, 72), value: c.id })),
          answer: target.id,
          hint: 'Écoute bien le mot de couleur. Réécoute avec 🐢.',
          explain: `${EN.ear(obj.say(target.word))} : ${obj.fr} <b>${M.esc(EN.frColour(target.fr, obj))}</b> ${EN.pic({ art: obj.art, color: target.id }, 30)}.`,
        };
      }
      // lvl 2 : taille + couleur + objet (6 choix : 3 couleurs × gros/petit)
      const obj = M.pick(COLOR_OBJ.filter((o) => o.sized));
      const cols = EN.pickSet(pool, 3);
      const all = [];
      cols.forEach((c) => ['big', 'little'].forEach((b) => all.push({ c, b, value: b + '-' + c.id })));
      const t = M.pick(all);
      return {
        prompt: 'Écoute bien : la taille et la couleur !', audio: EN.audio(obj.say(t.c.word, t.b)), format: 'choice', cols: 3,
        choices: M.shuffle(all).map((x) => ({ label: `<span class="en-pic-lbl" style="min-height:84px;justify-content:flex-end">${EN.pic({ art: obj.art, color: x.c.id, fr: EN.frObjColour(obj, x.c, x.b) }, x.b === 'big' ? 80 : 40)}</span>`, value: x.value })),
        answer: t.value,
        hint: `<span lang="en">Big</span> = gros, <span lang="en">little</span> = petit. Écoute encore avec 🐢.`,
        explain: `${EN.ear(obj.say(t.c.word, t.b))} : ${EN.frObjColour(obj, t.c, t.b).replace(EN.frColour(t.c.fr, obj), `<b>${M.esc(EN.frColour(t.c.fr, obj))}</b>`)}. ${EN.ear('big')} = gros, ${EN.ear('little')} = petit.`,
      };
    },
  });

  /* ------------------------------ 3. Les nombres ------------------------------ */
  const COUNT_OBJ = [['🍎', 'apples'], ['🦆', 'ducks'], ['⭐', 'stars'], ['🎈', 'balloons'], ['🍪', 'cookies'], ['🐟', 'fish'], ['🌲', 'trees'], ['🧦', 'socks']];
  const collection = (emoji, n) => `<span class="en-coll" role="img" aria-label="${n}">${Array(n).fill(`<span>${emoji}</span>`).join('')}</span>`;
  M.registerSkill({
    id: 'en-nombres', domain: 'en-mots', title: 'Les nombres en anglais', icon: '🔢', needs: NEEDS, learn: 'en-mots-themes',
    desc: 'Écoute un nombre et écris-le en chiffres.',
    pda: 'ALS 1er cycle — Repertoire; routines (counting)',
    gen({ lvl = 0 }) {
      const nums = EN.ofTheme('numbers', 2);
      // niveaux 0–1 : surtout la dictée de nombres, parfois « Show me … » (collections plus petites)
      const showMe = lvl === 2 ? Math.random() >= 0.4 : Math.random() < 0.35;
      if (!showMe) {
        const pool = lvl === 0 ? nums.filter((w) => w.n <= 10) : lvl === 1 ? nums.filter((w) => w.n >= 6) : nums.filter((w) => w.n >= 11);
        const t = M.pickWeighted(pool, (w) => w.id, 'en-nombres');
        return {
          prompt: 'Écoute le nombre et écris-le avec des chiffres.', audio: EN.audio(t.word), format: 'number', answer: t.n,
          hint: t.n > 12 ? 'Les nombres en <span lang="en">-teen</span> sont entre 13 et 19 : <span lang="en">thirteen</span> = 13. Écoute avec 🐢.' : 'Compte en anglais sur tes doigts : <span lang="en">one, two, three…</span>',
          explain: `${EN.ear(t.word)} = <b>${t.n}</b> (${M.esc(t.fr)}).`,
        };
      }
      // « Show me eight apples. » → la bonne collection
      const [emoji, plural] = M.pick(COUNT_OBJ);
      const n = lvl === 0 ? M.rnd(2, 6) : lvl === 1 ? M.rnd(3, 9) : M.rnd(4, 12);
      const vals = M.shuffle([n, n - 1, n + 1, n + (Math.random() < 0.5 ? 2 : -2)].filter((v, i, a) => v >= 2 && a.indexOf(v) === i)).slice(0, 4);
      if (!vals.includes(n)) vals[0] = n;
      const word = EN.word[nums[n].id].word;
      return {
        prompt: 'Écoute et touche la bonne collection.', audio: EN.audio(`Show me ${word} ${plural}.`), format: 'choice', cols: 2,
        choices: M.shuffle(vals).map((v) => ({ label: collection(emoji, v), value: v })), answer: n,
        hint: 'Écoute le nombre, puis compte les images une par une.',
        explain: `${EN.ear(word)} = <b>${n}</b>. On compte : ${n} ${emoji}.`,
      };
    },
  });

  /* ------------------------------ 4. Écoute plusieurs mots ------------------------------ */
  const LIST_THEMES = ['animals', 'food', 'clothes', 'school', 'toys', 'things'];
  M.registerSkill({
    id: 'en-ecoute-liste', domain: 'en-mots', title: 'Écoute plusieurs mots', icon: '🎧', needs: NEEDS, learn: 'en-mots-themes',
    desc: 'Touche toutes les images que tu entends.',
    pda: 'ALS 1er cycle — Stratégie : attention dirigée; C2 décoder des messages',
    check: EN.checkChoices,
    gen({ lvl = 0 }) {
      const pool = imageable(lvl === 0 ? 0 : 1, LIST_THEMES);
      if (lvl < 2) {
        const [k, n] = lvl === 0 ? [2, 6] : [3, 8];
        const set = EN.pickSet(pool, n);
        const heard = M.shuffle(set).slice(0, k);
        return {
          prompt: `Écoute bien : tu vas entendre ${k} mots. Touche les ${k} images.`,
          audio: EN.audio(heard.map((w) => w.say)), format: 'multi', cols: lvl === 0 ? 3 : 4,
          choices: set.map((w) => EN.picChoice(w, 56)), answer: heard.map((w) => w.id),
          hint: 'Réécoute avec 🐢 et touche chaque image quand tu l\'entends.',
          explain: heard.map((w) => EN.explainWord(w)).join('<br>'),
        };
      }
      const set = EN.pickSet(imageable(2, LIST_THEMES), 4);
      return {
        prompt: 'Écoute les 4 mots. Touche les images dans l\'ordre où tu les entends.',
        audio: EN.audio(set.map((w) => w.say)), format: 'order',
        choices: M.shuffle(set).map((w) => EN.picChoice(w, 56)), answer: set.map((w) => w.id),
        hint: 'Réécoute avec 🐢. Quel mot vient en premier ?',
        explain: 'L\'ordre : ' + set.map((w) => `${EN.ear(w.word, w.say)} ${EN.wordPic(w, 26)}`).join(' → '),
      };
    },
  });

  /* ------------------------------ 5. Le mot et l'image ------------------------------ */
  const MATCH_THEMES = ['animals', 'food', 'clothes', 'school', 'toys', 'colours', 'body', 'family', 'things', 'feelings'];
  M.registerSkill({
    id: 'en-associer', domain: 'en-mots', title: 'Le mot et l\'image', icon: '🔗', needs: NEEDS, learn: 'en-mots-themes',
    desc: 'Associe chaque mot anglais à son image.',
    pda: 'ALS 1er cycle — Repertoire; stratégie : utiliser les ressources (images)',
    gen({ lvl = 0 }) {
      const n = [3, 4, 5][lvl];
      const themes = MATCH_THEMES.filter((t) => EN.ofTheme(t, lvl).filter((w) => w.picture === 'ok').length >= n + 1);
      const t = M.pick(themes);
      const set = EN.pickSet(EN.ofTheme(t, lvl).filter((w) => w.picture === 'ok'), n);
      return {
        prompt: 'Touche un mot pour l\'entendre, puis touche son image.',
        format: 'match', lang: LANG,
        pairs: set.map((w) => ({ left: `🔊 <span lang="en">${M.esc(w.word)}</span>`, sayLeft: w.say, langLeft: LANG, right: EN.wordPic(w, 44) })),
        hint: 'Écoute le mot, puis cherche l\'image. Pense aux mots qui ressemblent au français !',
        explain: set.map((w) => EN.explainWord(w)).join('<br>'),
      };
    },
  });

  /* ------------------------------ 6. Range les mots ------------------------------ */
  const SORT_THEMES = ['animals', 'food', 'clothes', 'school', 'toys'];
  const SORT_SKIP = ['teddy-bear', 'skates', 'bus', 'school', 'desk', 'chair'];
  M.registerSkill({
    id: 'en-trier', domain: 'en-mots', title: 'Range les mots', icon: '🗂️', needs: NEEDS, learn: 'en-mots-themes',
    desc: 'Écoute chaque mot et range-le dans la bonne boîte.',
    pda: 'ALS 1er cycle — Repertoire (catégories); stratégie : inférence',
    gen({ lvl = 0 }) {
      const [nb, ni] = [[2, 4], [2, 6], [3, 6]][lvl];
      const themes = M.shuffle(SORT_THEMES).slice(0, nb);
      const per = Math.floor(ni / nb);
      const items = [];
      themes.forEach((t) => {
        const pool = EN.ofTheme(t, Math.max(1, lvl)).filter((w) => w.picture === 'ok' && !SORT_SKIP.includes(w.id));
        EN.pickSet(pool, per).forEach((w) => items.push({ label: `${EN.wordPic(w, 34)} <small lang="en">${M.esc(w.word)}</small>`, bin: t, say: w.say, lang: LANG }));
      });
      return {
        prompt: 'Touche un mot pour l\'entendre, puis range-le dans la bonne boîte.',
        format: 'sort', lang: LANG,
        bins: themes.map((t) => ({ id: t, label: EN.THEMES[t].box })),
        items,
        hint: 'Regarde bien l\'image : c\'est un animal ? Ça se mange ?',
        explain: themes.map((t) => `<b>${EN.THEMES[t].box}</b> : ${items.filter((i) => i.bin === t).map((i) => EN.ear(i.say.replace(/^(a|an) /, ''), i.say)).join(' ')}`).join('<br>'),
      };
    },
  });
})();
