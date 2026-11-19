/* =====================================================================
   anglais/learn/bouger.js — pages « Head, nose, toes ! » (en-corps)
   et « En classe d'anglais » (en-classe)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;

  /* ------------------------------ Head, nose, toes ! ------------------------------ */
  M.registerLearn({
    id: 'en-corps', domain: 'en-bouger', title: 'Head, nose, toes !', icon: '🙆',
    short: 'Les parties du corps et le chant « Touch your head »',
    intro: 'Touche une partie du corps sur le dessin : tu entends son nom en anglais. Touche la même partie sur toi !',
    render(el) {
      const parts = EN.ofTheme('body', 2);
      el.innerHTML = `
        ${M.ui.section({ icon: '🧒', title: 'Mon corps en anglais', body: `<div class="en-bodybox"><div class="en-bodyhost">${EN.bodySvg()}</div>
          <div><div class="en-heard" aria-live="polite">👆 Touche le dessin</div>
          <div class="en-pairs">${parts.map((w) => `<button class="en-pair" data-part="${w.id}"><span lang="en">${M.esc(w.word)}</span> <small class="muted">${M.esc(w.fr)}</small></button>`).join('')}</div></div></div>` })}
        ${M.ui.section({ icon: '🎵', title: 'Le chant « Touch your head »', intro: 'Écoute le chant, puis chante-le en faisant les gestes.', body: '<div class="en-ch"></div>' + M.ui.callout('Fais les gestes en même temps ! Ton corps t\'aide à te souvenir des mots.', { tone: 'tip' }) })}
        ${M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="en-mq"></div>' })}`;
      const host = M.$('.en-bodyhost', el), heard = M.$('.en-heard', el);
      const show = (id) => {
        const w = EN.word[id];
        if (!w) return;
        M.$$('[data-hot]', host).forEach((z) => z.classList.toggle('on', z.dataset.hot === id));
        M.$$('.en-pair', el).forEach((b) => b.classList.toggle('sel', b.dataset.part === id));
        heard.innerHTML = `<span lang="en">${M.esc(w.word)}</span> — <span class="muted">${M.esc(EN.FR_POSS[id] || w.fr)}</span>`;
        M.say(w.word, { lang: LANG, raw: true });
      };
      host.onclick = (e) => { const z = e.target.closest('[data-hot]'); if (z) show(z.dataset.hot); };
      M.$('.en-pairs', el).onclick = (e) => { const b = e.target.closest('.en-pair'); if (b) show(b.dataset.part); };
      EN.mountChant(M.$('.en-ch', el), EN.CHANTS.find((c) => c.id === 'touch-head'));
      M.ui.miniQuiz(M.$('.en-mq', el), [EN.quiz('en-corps', 0), EN.quiz('en-corps', 0), EN.quiz('en-corps', 1)]);
      EN.voiceWarn(el);
    },
  });

  /* ------------------------------ En classe d'anglais ------------------------------ */
  const CHEERS = [['🏆', 'Good job!', 'Bon travail !'], ['🎉', 'Hooray!', 'Hourra !'], ['⭐', 'Super!', 'Super !'], ['👏', 'Well done!', 'Bien fait !'], ['🤩', 'Awesome!', 'Génial !'], ['👍', 'Great!', 'Très bien !']];
  M.registerLearn({
    id: 'en-classe', domain: 'en-bouger', title: 'En classe d\'anglais', icon: '🏫',
    short: 'Les consignes, les encouragements et mes besoins',
    intro: 'En classe d\'anglais, le professeur parle en anglais. Voici ce qu\'on entend souvent… et ce qu\'on peut dire !',
    render(el) {
      const acts = EN.ofTheme('actions', 2);
      const cls = EN.EXPR.filter((x) => x.kind === 'classroom');
      const needs = ['washroom', 'water', 'help', 'repeat', 'dont-understand'].map((id) => EN.expr[id]);
      el.innerHTML = `
        ${M.ui.section({ icon: '🏃', title: 'Les consignes d\'action', intro: 'Touche un dessin, écoute la consigne… et fais le geste !', body: `<div class="en-poses">${EN.tiles(acts, 84)}</div>` })}
        ${M.ui.section({ icon: '📣', title: 'Le professeur dit…', body: EN.exprTiles(cls) })}
        ${M.ui.section({ icon: '🎉', title: 'Les encouragements', intro: 'Quand tu réussis, on te dit :', body: `<div class="en-tiles">${M.ui.vocab(CHEERS.map(([e, en, fr]) => ({ emoji: e, word: en, say: en, lang: LANG, note: fr })))}</div>` })}
        ${M.ui.section({ icon: '🙋', title: 'Mes besoins', intro: 'Pour demander quelque chose en anglais :', body: EN.exprTiles(needs) + M.ui.callout('Tu ne comprends pas ? C\'est normal ! Demande : ' + M.ui.gloss('Can you repeat, please?', 'Peux-tu répéter, s\'il te plaît ?', { lang: LANG }), { tone: 'tip' }) })}
        ${M.ui.section({ icon: '🦫', title: 'Castor a dit…', intro: 'Écoute la consigne et touche l\'enfant qui la fait.', body: '<div class="en-mq"></div>' })}`;
      M.ui.miniQuiz(M.$('.en-mq', el), [EN.quiz('en-actions', 0), EN.quiz('en-actions', 0), EN.quiz('en-actions', 1)], { title: 'Castor a dit…' });
      EN.voiceWarn(el);
    },
  });
})();
