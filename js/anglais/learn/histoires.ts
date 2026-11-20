/* =====================================================================
   anglais/learn/histoires.js — pages « L'heure du conte » (en-histoires)
   et « Comptines et rimes » (en-comptines)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const LANG = EN.LANG;

  /* ------------------------------ L'heure du conte ------------------------------ */
  M.registerLearn({
    id: 'en-histoires',
    domain: 'en-histoires',
    title: "L'heure du conte",
    icon: '📖',
    short: 'De petites histoires à écouter, avec des images',
    intro: "Choisis une histoire. Écoute-la avec 🔊 en regardant les images. Les images t'aident à comprendre : c'est un bon truc !",
    render(el) {
      el.innerHTML = `${M.ui.callout("Écoute d'abord toute l'histoire. Ensuite, touche le 🔊 d'une phrase pour la réécouter. Tu peux aussi voir le sens en français.", { tone: 'tip' })}<div class="en-st"></div>`;
      M.ui.tabs(
        M.$('.en-st', el),
        EN.STORIES.map((st) => ({
          id: st.id,
          label: `${EN.picStr(st.lines[0].pic.split('|')[0], 22)} ${M.esc(st.title)}`,
          render(panel) {
            panel.innerHTML = `<h2 style="margin:8px 0">${M.esc(st.title)} <small class="muted">— ${M.esc(st.fr)}</small></h2>
            <div class="row" style="margin-bottom:8px"><button class="btn blue en-all">🔊 Toute l'histoire</button><button class="btn en-allslow">🐢 Lentement</button><button class="btn en-fr-toggle">💡 Voir le sens en français</button></div>
            <div class="en-hidefr en-stbox">${EN.storyHtml(st, { fr: true })}</div>
            <h3>📖 Mot à mot</h3><div class="en-rd"></div>
            <h3>✅ Vérifie ta compréhension</h3><div class="en-mq"></div>`;
            const segs = (rate) => st.lines.map((l) => ({ text: l.en, lang: LANG, raw: true, rate }));
            M.$('.en-all', panel).onclick = () => M.say(segs(), { pause: 600 });
            M.$('.en-allslow', panel).onclick = () => M.say(segs(0.6), { pause: 800 });
            M.$('.en-fr-toggle', panel).onclick = (e) => {
              const b = M.$('.en-stbox', panel);
              b.classList.toggle('en-hidefr');
              e.target.textContent = b.classList.contains('en-hidefr') ? '💡 Voir le sens en français' : '🙈 Cacher le français';
            };
            M.ui.reading(M.$('.en-rd', panel), { text: EN.storyText(st), lang: LANG });
            const qs = st.questions
              .slice()
              .sort((a, b) => a.lvl - b.lvl)
              .slice(0, 3);
            M.ui.miniQuiz(
              M.$('.en-mq', panel),
              qs.map((sq) => () => EN.storyQuestion(st, sq)),
            );
          },
        })),
      );
      EN.voiceWarn(el);
    },
  });

  /* ------------------------------ Comptines et rimes ------------------------------ */
  M.registerLearn({
    id: 'en-comptines',
    domain: 'en-histoires',
    title: 'Comptines et rimes',
    icon: '🎵',
    short: 'Des comptines originales et des mots qui riment',
    intro: "Les comptines aident à entendre la musique de l'anglais. Écoute, puis répète chaque vers avec la voix… et fais les gestes !",
    render(el) {
      el.innerHTML = `
        ${M.ui.section({ icon: '🎵', title: 'Mes comptines', body: '<div class="en-chs"></div>' + M.ui.callout('Répète avec la voix : écoute un vers, puis dis-le à ton tour. Essaie ensuite avec 🐢 pour bien entendre chaque mot.', { tone: 'tip' }) })}
        ${M.ui.section({ icon: '🔔', title: 'Des mots qui riment', intro: 'Deux mots <b>riment</b> quand ils finissent par le même son. Touche-les pour les entendre.', body: `<div class="en-pairs">${EN.RHYMES.map((r) => `<div class="en-pair">${[r.target, ...r.rhymes].map((id) => `${EN.picStr(EN.RW[id].pic, 34)}${M.ui.speak(id, { lang: LANG, label: id })}`).join(' ')}</div>`).join('')}</div>` })}
        ${M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="en-mq"></div>' })}`;
      M.ui.tabs(
        M.$('.en-chs', el),
        EN.CHANTS.map((ch) => ({
          id: ch.id,
          label: `${EN.picStr(ch.lines[0].g, 22)} ${M.esc(ch.title)}`,
          render: (panel) => EN.mountChant(panel, ch),
        })),
      );
      M.ui.miniQuiz(M.$('.en-mq', el), [EN.quiz('en-rimes', 0), EN.quiz('en-rimes', 0), EN.quiz('en-rimes', 1)]);
      EN.voiceWarn(el);
    },
  });
})();
