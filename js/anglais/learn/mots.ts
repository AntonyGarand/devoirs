/* =====================================================================
   anglais/learn/mots.js — page « Mes premiers mots » (en-mots-themes)
   + aides des pages Apprendre d'anglais :
     EN.tiles(words, size)      tuiles M.ui.vocab (image + mot + sens) lues en anglais
     EN.mountChant(el, chant)   comptine : 🔊 / 🐢, vers par vers, mots touchables
     EN.dialog(lines)           bulles de dialogue (🔊 par réplique, ▶ tout le dialogue)
     EN.quiz(skillId, lvl)      question de miniQuiz générée par une habileté
   ===================================================================== */

/** Réplique d'un dialogue (M.EN.dialog) : qui parle (emoji), texte, sens, voix (pitch), bulle à droite. */
interface EnDialogLine {
  who: string;
  name?: string;
  en: string;
  fr?: string;
  pitch?: number;
  right?: boolean;
}

interface EnglishApi {
  /** Tuiles M.ui.vocab (image + mot + sens) lues en anglais. */
  tiles(words: EnWord[], size?: number): string;
  exprTiles(xs: EnExpr[]): string;
  /** Question de miniQuiz générée par une habileté. */
  quiz(skillId: string, lvl?: number): () => Question;
  /** Comptine : 🔊 / 🐢, vers par vers, mots touchables. */
  mountChant(el: HTMLElement, ch: EnChant): void;
  /** Bulles de dialogue (🔊 par réplique, ▶ tout le dialogue : voir bindDialog). */
  dialog(lines: EnDialogLine[], opts?: { id?: string }): string;
  /** Branche le bouton ▶ d'un dialogue (deux hauteurs de voix). */
  bindDialog(el: HTMLElement, lines: Pick<EnDialogLine, 'en' | 'pitch' | 'right'>[], id?: string): void;
}

(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;

  try {
    M.css(`
    .en-tiles .vocab-emoji { display: flex; align-items: center; justify-content: center; min-height: 64px }
    .en-tiles .vocab-tile b { font-size: 1.15rem }
    .en-hidefr .en-lfr { display: none }
    .en-cog { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px }
    .en-dlg-play { margin-bottom: 8px }
    `);
  } catch (e) {
    /* hors navigateur */
  }

  EN.tiles = (words, size = 56) =>
    `<div class="en-tiles">${M.ui.vocab(words.map((w) => ({ emoji: EN.wordPic(w, size), word: M.esc(w.word), say: w.say, lang: LANG, note: M.esc(w.fr) })))}</div>`;
  EN.exprTiles = (xs) =>
    `<div class="en-tiles">${M.ui.vocab(xs.map((x) => ({ emoji: x.emoji, word: M.esc(x.en), say: x.say, lang: LANG, note: M.esc(x.fr) })))}</div>`;
  EN.quiz =
    (skillId, lvl = 0) =>
    () =>
      M.skillById[skillId].gen({ lvl });

  /** Comptine : en-tête (🔊 normal, 🐢 lent), vers numérotés avec image, 🔊 par vers, mot lu au toucher. */
  EN.mountChant = (el, ch) => {
    const words = (s: string): string =>
      s
        .split(/(\s+)/)
        .map((w) => (/\s/.test(w) || !w ? w : `<span class="rw">${M.esc(w)}</span>`))
        .join('');
    el.innerHTML = `<div class="en-chant"><div class="en-chant-head"><b>🎵 ${M.esc(ch.title)}</b><span class="muted">${M.esc(ch.fr)}</span>
      <button class="btn blue en-play">🔊 Écouter</button><button class="btn en-slow">🐢 Lentement</button></div>
      <ol lang="en">${ch.lines.map((l) => `<li><span class="g">${EN.picStr(l.g, 34)}</span><span>${words(l.en)}</span>${M.ui.speak(l.en, { lang: LANG })}</li>`).join('')}</ol>
      <div class="muted reading-tip">Touche un mot pour l'entendre. Dis chaque vers avec la voix !</div></div>`;
    const segs = (rate?: number): SaySegment[] => ch.lines.map((l) => ({ text: l.en, lang: LANG, raw: true, rate }));
    el.onclick = (e) => {
      if (M.closest(e, '.en-play')) return M.say(segs(), { pause: 450 });
      if (M.closest(e, '.en-slow')) return M.say(segs(0.6), { pause: 650 });
      const w = M.closest(e, '.rw');
      if (w) {
        M.$$('.rw.on', el).forEach((x) => x.classList.remove('on'));
        w.classList.add('on');
        M.say((w.textContent || '').replace(/[.,!?;:«»"()…]/g, ''), { lang: LANG, raw: true });
      }
    };
  };

  /** Dialogue : [{ who: '🦫', name, en, fr?, pitch? , right? }] → bulles + bouton ▶ (deux hauteurs de voix). */
  EN.dialog = (lines, { id = 'dlg' } = {}) => `<div class="en-dialog" data-dlg="${id}">
    <button class="btn blue en-dlg-play" data-dlg-play="${id}">▶ Écouter tout le dialogue</button>
    ${lines.map((l) => `<div class="en-bubble ${l.right ? 'r' : ''}"><span class="who" title="${M.esc(l.name || '')}">${l.who}</span><span class="txt"><span lang="en">${M.esc(l.en)}</span>${l.fr ? `<small class="en-lfr" style="display:block;color:var(--muted)">${M.esc(l.fr)}</small>` : ''}</span>${M.ui.speak(l.en, { lang: LANG })}</div>`).join('')}</div>`;
  EN.bindDialog = (el, lines, id = 'dlg') => {
    const b = M.$(`[data-dlg-play="${id}"]`, el);
    if (b)
      b.onclick = () =>
        M.say(
          lines.map((l) => ({ text: l.en, lang: LANG, raw: true, pitch: l.pitch || (l.right ? 1.25 : 0.95) })),
          { pause: 500 },
        );
  };

  /* ------------------------------ Mes premiers mots ------------------------------ */
  const TABS = [
    ['colours', '🎨 Couleurs'],
    ['numbers', '🔢 Nombres'],
    ['animals', '🐾 Animaux'],
    ['food', '🍎 Nourriture'],
    ['clothes', '🧣 Vêtements'],
    ['family', '👪 Famille'],
    ['school', '🏫 École'],
    ['toys', '🧸 Jouets'],
    ['things', '🏠 Autour de moi'],
  ];
  M.registerLearn({
    id: 'en-mots-themes',
    domain: 'en-mots',
    title: 'Mes premiers mots',
    icon: '🍎',
    short: 'Couleurs, nombres, animaux, nourriture, vêtements…',
    intro:
      "Touche une image pour entendre le mot en anglais. Répète-le à voix haute ! On n'a pas besoin de savoir l'écrire : on l'écoute et on le dit.",
    render(el) {
      const cognates = EN.VOCAB.filter((w) => w.cognate);
      el.innerHTML = `
        ${M.ui.section({ icon: '📚', title: 'Les mots par thème', intro: "Choisis un thème. Touche les images pour écouter, puis joue avec les cartes-éclair : regarde l'image, dis le mot, retourne la carte pour vérifier.", body: '<div class="en-themes"></div>' })}
        ${M.ui.section({ icon: '🤝', title: 'Les mots amis', body: M.ui.callout('Certains mots anglais ressemblent au français ! Ce sont des <b>mots amis</b>. Écoute-les : tu les comprends déjà.', { tone: 'tip' }) + `<div class="en-cog">${cognates.map((w) => `${EN.wordPic(w, 28)} ${M.ui.gloss(w.word, w.fr, { lang: LANG })}`).join(' ')}</div><p class="muted">Touche une fois pour écouter, une 2<sup>e</sup> fois pour voir le mot français.</p>` })}
        ${M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="en-mq"></div>' })}`;
      M.ui.tabs(
        M.$('.en-themes', el)!,
        TABS.map(([t, label]) => ({
          id: t,
          label,
          render(panel) {
            const ws = EN.ofTheme(t, 2);
            panel.innerHTML = EN.tiles(ws) + '<h3>🃏 Cartes-éclair</h3><div class="en-fc"></div>';
            M.ui.flashcards(
              M.$('.en-fc', panel)!,
              M.shuffle(ws).map((w) => ({
                front: EN.wordPic(w, 96),
                back: `<span lang="en">${M.esc(w.word)}</span><small style="font-size:1rem;color:var(--muted)">${M.esc(w.fr)}</small>`,
                say: w.say,
                lang: LANG,
              })),
            );
          },
        })),
      );
      M.ui.miniQuiz(M.$('.en-mq', el)!, [EN.quiz('en-ecoute-image', 0), EN.quiz('en-couleurs', 0), EN.quiz('en-nombres', 0)]);
      EN.voiceWarn(el);
    },
  });
})();
