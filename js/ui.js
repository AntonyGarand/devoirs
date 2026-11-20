/* =====================================================================
   ui.js — composants d'interface partagés (pages Apprendre, guides)

   Chaînes HTML (à insérer) :
     M.ui.section({icon, title, intro?, body, id?})
     M.ui.callout(html, {tone:'tip'|'info'|'success'|'warn', who:'🦫'})
     M.ui.speak(text, {lang?, label?})        bouton 🔊 (géré globalement)
     M.ui.vocab([{emoji, word, say?, lang?, note?}])   grille de mots illustrés
     M.ui.demarche(steps?)                    pictogrammes de la démarche
     M.ui.tag(text, color?, soft?)
   Composants montés (el = conteneur) :
     M.ui.tabs(el, [{id, label, render(panel)}], startId?)
     M.ui.stepper(el, {label, value, min, max, step, onChange})  → {get, set}
     M.ui.flashcards(el, [{front, back, say?, lang?}])
     M.ui.reading(el, {title?, text, lang?})  texte où chaque mot se lit au toucher
     M.ui.miniQuiz(el, [questions], {title?}) petites questions sans enregistrement
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const ui = (M.ui = {});

  ui.section = ({ icon = '', title, intro = '', body = '', id = '' }) =>
    `<section class="l-sec"${id ? ` id="${id}"` : ''}><h2>${icon} ${title}</h2>${intro ? `<p>${intro}</p>` : ''}${body}</section>`;

  ui.callout = (html, { tone = 'tip', who = '🦫' } = {}) =>
    `<div class="callout ${tone === 'tip' ? '' : tone === 'info' ? 'blue' : tone === 'success' ? 'green' : 'warn'}">${who ? who + ' ' : ''}${html}</div>`;

  ui.speak = (text, { lang = 'fr-CA', label = '🔊' } = {}) =>
    `<button class="btn icon" data-say="${M.esc(text)}" data-lang="${lang}" title="Écouter">${label}</button>`;

  ui.tag = (text, color = 'var(--ink)', soft = 'var(--bg)') => `<span class="tag" style="background:${soft};color:${color}">${text}</span>`;

  ui.vocab = (items) =>
    `<div class="vocab">${items.map((it) => `<button class="vocab-tile" data-say="${M.esc(it.say || it.word)}" data-lang="${it.lang || 'fr-CA'}"><span class="vocab-emoji">${it.emoji || ''}</span><b>${it.word}</b>${it.note ? `<small>${it.note}</small>` : ''}</button>`).join('')}</div>`;

  /** Démarche de résolution de problèmes (affiche les étapes avec pictogrammes). */
  ui.DEMARCHE = [
    { icon: '📖', label: 'Je lis', detail: 'Je lis le problème deux fois.' },
    { icon: '🔍', label: 'Je comprends', detail: 'Je trouve la question et les informations utiles.' },
    { icon: '✏️', label: 'Je planifie', detail: 'Je fais un dessin et je choisis l\'opération.' },
    { icon: '🧮', label: 'Je calcule', detail: 'Je fais mon calcul.' },
    { icon: '✅', label: 'Je vérifie', detail: 'Est-ce que ma réponse a du sens ?' },
    { icon: '💬', label: 'Je réponds', detail: 'J\'écris une phrase-réponse.' },
  ];
  ui.demarche = (steps = ui.DEMARCHE, active = -1) =>
    `<ol class="demarche">${steps.map((s, i) => `<li class="${i === active ? 'on' : ''}"><span class="d-ic">${s.icon}</span><b>${s.label}</b><small>${s.detail || ''}</small></li>`).join('')}</ol>`;

  ui.tabs = function (el, tabs, startId) {
    el.innerHTML = `<div class="tabs" role="tablist">${tabs.map((t) => `<button class="tab" role="tab" data-id="${t.id}">${t.label}</button>`).join('')}</div><div class="tab-panel"></div>`;
    const panel = M.$('.tab-panel', el);
    const show = (id) => {
      M.$$('.tab', el).forEach((b) => b.classList.toggle('on', b.dataset.id === id));
      const t = tabs.find((x) => x.id === id) || tabs[0];
      panel.innerHTML = '';
      panel.onclick = null;
      t.render(panel);
    };
    M.$('.tabs', el).onclick = (e) => { const b = e.target.closest('.tab'); if (b) { M.sfx.tap(); show(b.dataset.id); } };
    show(startId || tabs[0].id);
    return { show };
  };

  ui.stepper = function (el, { label = '', value = 0, min = 0, max = 10, step = 1, onChange = () => {} }) {
    let v = value;
    el.innerHTML = `<span class="stepper">${label ? `<b>${label}</b>` : ''}<button class="btn st-dec" aria-label="Moins">−</button><span class="st-val">${v}</span><button class="btn st-inc" aria-label="Plus">+</button></span>`;
    const set = (n, silent) => { v = Math.max(min, Math.min(max, n)); M.$('.st-val', el).textContent = v; if (!silent) onChange(v); };
    M.$('.st-dec', el).onclick = () => { M.sfx.tap(); set(v - step); };
    M.$('.st-inc', el).onclick = () => { M.sfx.tap(); set(v + step); };
    return { get: () => v, set };
  };

  ui.flashcards = function (el, cards) {
    let i = 0, flipped = false;
    const draw = () => {
      const c = cards[i];
      el.innerHTML = `<div class="flash"><button class="flash-card ${flipped ? 'flipped' : ''}" aria-label="Retourner la carte">
          <span class="flash-face front">${c.front}</span><span class="flash-face back">${c.back}</span></button>
        <div class="row-center"><button class="btn fc-prev">←</button><span class="chip">${i + 1} / ${cards.length}</span>${c.say ? ui.speak(c.say, { lang: c.lang }) : ''}<button class="btn fc-next">→</button></div></div>`;
      M.$('.flash-card', el).onclick = () => { flipped = !flipped; M.sfx.tap(); M.$('.flash-card', el).classList.toggle('flipped', flipped); if (flipped && c.say) M.say(c.say, { lang: c.lang, raw: true }); };
      M.$('.fc-prev', el).onclick = () => { i = (i - 1 + cards.length) % cards.length; flipped = false; draw(); };
      M.$('.fc-next', el).onclick = () => { i = (i + 1) % cards.length; flipped = false; draw(); };
    };
    draw();
  };

  ui.reading = function (el, { title = '', text, lang = 'fr-CA' }) {
    const paras = String(text).split(/\n\s*\n/);
    el.innerHTML = `<div class="reading">${title ? `<div class="q-passage-head"><b>📖 ${M.esc(title)}</b>${ui.speak(text, { lang })}</div>` : ''}
      ${paras.map((p) => `<p>${p.split(/(\s+)/).map((w) => (/\s/.test(w) || !w ? w : `<span class="rw">${M.esc(w)}</span>`)).join('')}</p>`).join('')}
      <div class="muted reading-tip">Touche un mot pour l'entendre.</div></div>`;
    el.onclick = (e) => {
      const w = e.target.closest('.rw');
      if (!w) return;
      M.$$('.rw.on', el).forEach((x) => x.classList.remove('on'));
      w.classList.add('on');
      M.say(w.textContent.replace(/[.,!?;:«»"()]/g, ''), { lang, raw: true });
    };
  };

  ui.miniQuiz = function (el, questions, { title = 'Vérifie ta compréhension' } = {}) {
    let i = 0, ok = 0, cur = null;
    const all = questions.slice();
    let seen = new Set(), prev = null; // jamais deux fois la même question; « Recommencer » évite la ronde précédente
    const show = () => {
      if (cur) cur.destroy();
      if (i >= questions.length) {
        el.innerHTML = `<div class="callout green">🎉 ${ok} sur ${questions.length} du premier coup ! <button class="btn mq-again">Recommencer</button></div>`;
        M.$('.mq-again', el).onclick = () => { i = 0; ok = 0; prev = seen; seen = new Set(); questions = all.slice(); show(); };
        return;
      }
      el.innerHTML = `<div class="mq-head"><b>${title}</b> <span class="chip">${i + 1} / ${questions.length}</span></div><div class="mq-q"></div>`;
      const q = typeof questions[i] === 'function' ? M.genUnique(questions[i], seen, { avoid: prev }) : questions[i];
      if (!q) { questions = questions.filter((_, k) => k !== i); return show(); } // plus de question nouvelle : on la saute
      cur = M.renderQuestion(M.$('.mq-q', el), q, {
        record: false,
        nextLabel: i === questions.length - 1 ? 'Terminer ✔' : 'Suivant ➜',
        onResult: ({ first }) => { if (first) ok++; },
        onNext: () => { i++; show(); },
      });
    };
    show();
    M.onCleanup(() => cur && cur.destroy());
  };

  // Boutons 🔊 déclaratifs : <button data-say="texte" data-lang="en-CA">
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-say]');
    if (b) M.say(b.dataset.say, { lang: b.dataset.lang || 'fr-CA', raw: (b.dataset.lang || '').startsWith('en') });
  });
})();
