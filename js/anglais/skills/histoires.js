/* =====================================================================
   anglais/skills/histoires.js — domaine en-histoires (habiletés 14 à 16)
   Histoires originales (M.EN.STORIES), comptines et rimes (M.EN.RHYMES).
   Le texte d'une histoire n'est jamais lu automatiquement (bouton 🔊).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;
  const NEEDS = ['speech:en'];
  const YESNO = [{ label: '👍 Yes', say: 'Yes', lang: LANG }, { label: '👎 No', say: 'No', lang: LANG }];
  EN.YESNO = YESNO;

  /** Passage illustré : une ligne par phrase (image + texte + 🔊); 🔊 en haut = toute l'histoire. */
  EN.storyPassage = (st) => ({ title: st.title, html: EN.storyHtml(st), say: EN.storyText(st), lang: LANG });

  /** Question d'histoire → question du cadre. */
  EN.storyQuestion = (st, sq) => {
    const line = st.lines[sq.line];
    const base = {
      prompt: sq.fr,
      hint: sq.hint || `Réécoute la phrase avec l'image ${EN.picStr(line.pic, 26)}.`,
      explain: `${EN.ear(line.en)}<br>« ${M.esc(line.fr)} »`,
    };
    if (sq.audio) base.audio = EN.audio(sq.audio);
    if (sq.type === 'tf') return { ...base, format: 'tf', answer: sq.answer, labels: YESNO, lang: LANG };
    if (sq.type === 'say') {
      return { ...base, format: 'choice', cols: 1, lang: LANG,
        choices: M.shuffle(sq.choices.map((en, i) => ({ label: `<span class="en-say" lang="en">${M.esc(en)}</span>`, value: 'c' + i, say: en, lang: LANG }))), answer: 'c0' };
    }
    return { ...base, format: 'choice', cols: sq.choices.length === 4 ? 2 : 3,
      choices: M.shuffle(sq.choices.map((p, i) => ({ label: `<span class="en-pic-lbl">${EN.picStr(p, 56)}</span>`, value: 'c' + i }))), answer: 'c0' };
  };

  /* ------------------------------ 14. Écoute une histoire ------------------------------ */
  M.registerSkill({
    id: 'en-histoire', domain: 'en-histoires', title: 'Écoute une histoire', icon: '📖', needs: NEEDS, learn: 'en-histoires',
    desc: 'Écoute la petite histoire et réponds aux questions.',
    pda: 'ALS 1er cycle — C1 : éléments clés (personnages, objets, lieux) et événements d\'une histoire entendue',
    gen({ lvl = 0 }) {
      const stories = EN.STORIES.filter((s) => s.lvl <= lvl + 1);
      // questions du niveau (au niveau 2 : surtout les questions entendues en anglais)
      const items = [];
      stories.forEach((st) => st.questions.forEach((sq) => { if (sq.lvl <= lvl && (lvl < 2 || sq.lvl >= 1)) items.push({ st, sq }); }));
      const it = M.pickWeighted(items, (x) => x.st.id + ':' + x.st.questions.indexOf(x.sq), 'en-histoire');
      return { passage: EN.storyPassage(it.st), ...EN.storyQuestion(it.st, it.sq) };
    },
  });

  /* ------------------------------ 15. Remets l'histoire en ordre ------------------------------ */
  M.registerSkill({
    id: 'en-histoire-ordre', domain: 'en-histoires', title: 'Remets l\'histoire en ordre', icon: '🔢', needs: NEEDS, learn: 'en-histoires',
    desc: 'Écoute l\'histoire et place les images dans l\'ordre.',
    pda: 'ALS 1er cycle — C1 : événements et séquence d\'une histoire (redire l\'histoire)',
    gen({ lvl = 0 }) {
      const n = [3, 4, 5][lvl];
      const st = M.pick(EN.STORIES.filter((s) => s.lines.length >= n && s.lvl <= lvl + 1));
      // n phrases dans l'ordre (la première est toujours gardée : c'est le début de l'histoire)
      const rest = M.shuffle(M.range(1, st.lines.length - 1)).slice(0, n - 1).sort((a, b) => a - b);
      const idx = [0, ...rest];
      return {
        prompt: 'Écoute l\'histoire avec 🔊, puis touche les images dans l\'ordre.',
        passage: { title: st.title, tokens: M.tokenize(EN.storyText(st)), lang: LANG, listenOnly: true },
        format: 'order', lang: LANG,
        choices: M.shuffle(idx.map((i) => ({ label: `<span class="en-pic-lbl">${EN.picStr(st.lines[i].pic, 46)}</span>`, value: 'l' + i, say: st.lines[i].en, lang: LANG }))),
        answer: idx.map((i) => 'l' + i),
        hint: 'Touche le petit 🔊 de chaque image pour entendre sa phrase. Qu\'est-ce qui arrive en premier ?',
        explain: idx.map((i, k) => `${k + 1}. ${EN.picStr(st.lines[i].pic, 24)} ${EN.ear(st.lines[i].en)} — « ${M.esc(st.lines[i].fr)} »`).join('<br>'),
      };
    },
  });

  /* ------------------------------ 16. Ça rime ! ------------------------------ */
  const RW = () => EN.RW;
  const rwChoice = (w) => ({ label: `<span class="en-pic-lbl">${EN.picStr(w.pic, 56)}</span>`, value: w.id, say: w.id, lang: LANG });
  /** Distracteurs : voyelle différente de la cible (pas de quasi-rime), images toutes différentes. */
  const nonRhymes = (target, n, exclude = []) => {
    const pool = Object.values(RW()).filter((w) => w.v !== RW()[target].v && !exclude.includes(w.id));
    return EN.pickSet(pool, n, null, (a, b) => a.id === b.id || a.v === b.v || a.pic === b.pic);
  };
  M.registerSkill({
    id: 'en-rimes', domain: 'en-histoires', title: 'Ça rime !', icon: '🎵', needs: NEEDS, learn: 'en-comptines',
    desc: 'Écoute la comptine et trouve le mot qui rime.',
    pda: 'ALS 1er cycle — C1 : rythme, chansons et comptines (rimes)',
    check(q) {
      const ok = q.answer, vs = q.choices.filter((c) => c.value !== ok).map((c) => EN.RW[c.value].v);
      if (vs.includes(EN.RW[ok].v)) return 'un distracteur rime avec la réponse';
    },
    gen({ lvl = 0 }) {
      const sets = EN.RHYMES.filter((r) => r.lvl <= lvl);
      const r = M.pickWeighted(sets, (x) => x.target, 'en-rimes');
      if (lvl < 2) {
        const ans = M.pick(r.rhymes);
        const n = lvl === 0 ? 3 : 4;
        const T = RW()[r.target];
        const choices = M.shuffle([rwChoice(RW()[ans]), ...nonRhymes(r.target, n - 1).map(rwChoice)]);
        return {
          prompt: `Quel mot rime avec <span lang="en">${r.target}</span> ? Touche 🔊 pour écouter chaque image.`,
          scene: [{ emoji: T.pic.startsWith('art:') ? '' : T.pic, art: T.pic.startsWith('art:') ? T.pic.split(':')[1] : undefined, label: T.fr }],
          audio: EN.audio([`${r.target}.`, `Which one rhymes with ${r.target}?`], { pause: 700 }),
          format: 'choice', cols: n === 4 ? 2 : 3, lang: LANG, choices, answer: ans,
          hint: `Dis les deux mots tout haut : <span lang="en">${r.target}… ${ans.charAt(0)}…</span> La fin sonne pareil !`,
          explain: `${EN.ear(r.target)} et ${EN.ear(ans)} riment : ils finissent par le même son. ${EN.picStr(T.pic, 26)} ${EN.picStr(RW()[ans].pic, 26)}`,
        };
      }
      // niveau 2 : compléter un vers (le mot manquant rime avec un mot du vers)
      const [verse, ans] = r.couplet;
      const group = [r.target, ...r.rhymes];
      const choices = M.shuffle([rwChoice(RW()[ans]), ...nonRhymes(ans, 3, group).map(rwChoice)]);
      return {
        prompt: 'Écoute le vers. Quel mot manque ? Il doit rimer !',
        audio: EN.audio(verse),
        format: 'choice', cols: 2, lang: LANG, choices, answer: ans,
        hint: `Le mot qui manque rime avec <span lang="en">${ans === r.target ? r.rhymes[0] : r.target}</span>.`,
        explain: `${EN.ear(verse.replace('…', ' ' + ans + '!'))} — ${EN.ear(ans)} rime avec ${EN.ear(ans === r.target ? r.rhymes[0] : r.target)}.`,
      };
    },
  });
})();
