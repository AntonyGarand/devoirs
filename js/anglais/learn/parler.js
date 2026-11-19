/* =====================================================================
   anglais/learn/parler.js — pages « Hello ! Dire bonjour » (en-hello)
   et « Comment ça va ? Quel temps fait-il ? » (en-emotions-meteo)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;
  const X = (ids) => ids.map((id) => EN.expr[id]);

  /* ------------------------------ Hello ! ------------------------------ */
  const DIALOG = [
    { who: '🦫', name: 'Max', en: 'Hi, Lily!', fr: 'Salut, Lily !' },
    { who: '🐰', name: 'Lily', en: 'Hello, Max! How are you?', fr: 'Bonjour, Max ! Comment ça va ?', right: true },
    { who: '🦫', name: 'Max', en: 'I\'m fine, thank you. And you?', fr: 'Ça va bien, merci. Et toi ?' },
    { who: '🐰', name: 'Lily', en: 'I\'m happy! Let\'s play!', fr: 'Je suis contente ! Viens jouer !', right: true },
    { who: '🦫', name: 'Max', en: 'Okay! My turn!', fr: 'D\'accord ! C\'est mon tour !' },
    { who: '🐰', name: 'Lily', en: 'Good job, Max! Bye! See you tomorrow!', fr: 'Bravo, Max ! Bye ! À demain !', right: true },
  ];
  M.registerLearn({
    id: 'en-hello', domain: 'en-parler', title: 'Hello ! Dire bonjour', icon: '👋',
    short: 'Saluer, être poli, un petit dialogue',
    intro: 'Pour parler avec quelqu\'un en anglais, on commence par dire bonjour ! Touche chaque expression pour l\'entendre, puis répète-la.',
    render(el) {
      el.innerHTML = `
        ${M.ui.section({ icon: '👋', title: 'Bonjour et au revoir', body: EN.exprTiles(X(['hello', 'hi', 'good-morning', 'goodbye', 'bye', 'see-you', 'good-night'])) })}
        ${M.ui.section({ icon: '🙏', title: 'Les mots magiques', intro: 'Les mots de politesse, comme en français :', body: EN.exprTiles(X(['please', 'thank-you', 'welcome', 'sorry', 'excuse-me', 'yes-please', 'no-thanks'])) })}
        ${M.ui.section({ icon: '💬', title: 'Max et Lily se parlent', intro: 'Écoute le dialogue. Touche 🔊 pour une réplique. <button class="btn en-fr-toggle">💡 Voir le sens en français</button>', body: `<div class="en-dlg en-hidefr">${EN.dialog(DIALOG)}</div>` })}
        ${M.ui.section({ icon: '🃏', title: 'Qu\'est-ce qu\'on dit ?', intro: 'Lis la situation, dis la phrase en anglais, puis retourne la carte pour vérifier.', body: '<div class="en-fc"></div>' })}
        ${M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="en-mq"></div>' })}`;
      EN.bindDialog(el, DIALOG);
      M.$('.en-fr-toggle', el).onclick = (e) => { const d = M.$('.en-dlg', el); d.classList.toggle('en-hidefr'); e.target.textContent = d.classList.contains('en-hidefr') ? '💡 Voir le sens en français' : '🙈 Cacher le français'; };
      M.ui.flashcards(M.$('.en-fc', el), M.shuffle(EN.SAYABLE.filter((x) => x.lvl <= 1)).map((x) => ({
        front: `<span style="font-size:2.6rem">${x.emoji}</span><small style="font-size:1rem;padding:0 14px;text-align:center">${M.esc(x.situation)}</small>`,
        back: `<span lang="en">${M.esc(x.en)}</span><small style="font-size:1rem;color:var(--muted)">${M.esc(x.fr)}</small>`, say: x.say, lang: LANG,
      })));
      M.ui.miniQuiz(M.$('.en-mq', el), [EN.quiz('en-que-dire', 0), EN.quiz('en-reagir', 0), EN.quiz('en-que-dire', 1)]);
      EN.voiceWarn(el);
    },
  });

  /* ------------------------------ Émotions et météo ------------------------------ */
  M.registerLearn({
    id: 'en-emotions-meteo', domain: 'en-parler', title: 'Comment ça va ? Quel temps fait-il ?', icon: '🌦️',
    short: 'Les sentiments, la météo et les saisons',
    intro: 'Chaque matin, en classe d\'anglais, on se demande comment ça va et quel temps il fait. À toi !',
    render(el) {
      const feel = EN.ofTheme('feelings', 2), wx = EN.ofTheme('weather', 2), seasons = EN.ofTheme('seasons', 2);
      el.innerHTML = `
        ${M.ui.section({ icon: '😀', title: 'How are you? — Comment ça va ?', intro: 'Touche un visage : tu entends la phrase pour dire comment tu te sens.', body: EN.tiles(feel) })}
        ${M.ui.section({ icon: '🙂', title: 'Et toi, comment ça va ?', intro: 'Choisis ton visage d\'aujourd\'hui (rien n\'est enregistré).', body: `${EN.dialog([{ who: '🦫', name: 'Castor', en: 'How are you today?', fr: 'Comment ça va aujourd\'hui ?' }], { id: 'how' })}
          <div class="en-pairs en-me">${feel.map((w) => `<button class="en-pair" data-w="${w.id}"><span class="en-emo">${w.emoji}</span></button>`).join('')}</div><div class="en-heard en-me-said" aria-live="polite"></div>` })}
        ${M.ui.section({ icon: '☀️', title: 'What\'s the weather today? — Quel temps fait-il ?', body: EN.tiles(wx) + '<h3>🍂 Les saisons</h3>' + EN.tiles(seasons) })}
        ${M.ui.section({ icon: '💬', title: 'La routine du matin', body: EN.dialog([
          { who: '📣', name: 'Prof', en: 'Good morning, class! What\'s the weather today?', fr: 'Bonjour la classe ! Quel temps fait-il aujourd\'hui ?' },
          { who: '🙋', name: 'Élève', en: 'It\'s snowy! It\'s cold!', fr: 'Il neige ! Il fait froid !', right: true },
          { who: '📣', name: 'Prof', en: 'Yes! It\'s winter. How are you?', fr: 'Oui ! C\'est l\'hiver. Comment ça va ?' },
          { who: '🙋', name: 'Élève', en: 'I\'m happy!', fr: 'Je suis content !', right: true },
        ], { id: 'routine' }) })}
        ${M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="en-mq"></div>' })}`;
      EN.bindDialog(el, [{ en: 'How are you today?' }], 'how');
      EN.bindDialog(el, [{ en: 'Good morning, class! What\'s the weather today?' }, { en: 'It\'s snowy! It\'s cold!', right: true }, { en: 'Yes! It\'s winter. How are you?' }, { en: 'I\'m happy!', right: true }], 'routine');
      M.$('.en-me', el).onclick = (e) => {
        const b = e.target.closest('.en-pair');
        if (!b) return;
        const w = EN.word[b.dataset.w];
        M.$$('.en-pair', M.$('.en-me', el)).forEach((x) => x.classList.toggle('sel', x === b));
        M.$('.en-me-said', el).innerHTML = `<span lang="en">${M.esc(w.say)}</span> <span class="muted">— Je suis ${M.esc(w.fr)}.</span>`;
        M.say(w.say, { lang: LANG, raw: true });
      };
      M.ui.miniQuiz(M.$('.en-mq', el), [EN.quiz('en-sentiments', 0), EN.quiz('en-sentiments', 1), EN.quiz('en-questions', 1)]);
      EN.voiceWarn(el);
    },
  });
})();
