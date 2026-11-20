/* =====================================================================
   anglais/subject.js — Anglais, langue seconde (programme de base, 1er cycle)
   Voir docs/hld/anglais.md. Consignes en français; l'anglais est ENTENDU
   (voix en-CA/en-US, jamais une voix française) et MONTRÉ (mot + image).

   M.EN : espace de noms de la matière
     M.EN.LANG                    'en-CA'
     M.EN.en(text)                <span lang="en"> (lu avec la voix anglaise dans une consigne)
     M.EN.ear(text, say?)         mot anglais + bouton 🔊 (explications, indices, pages Apprendre)
     M.EN.pic(item, size?)        image d'un mot : emoji ou dessin M.art (repli emoji)
     M.EN.COLORS                  couleurs (id → hex) pour les dessins recoloriables
     M.EN.lint(q)                 règles de la matière (aussi exposées comme subject.lint)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = (M.EN = M.EN || {});
  EN.LANG = 'en-CA';

  M.registerSubject({
    id: 'anglais', title: 'Anglais', icon: '🗣️', color: '#118ab2', soft: '#dff3fb',
    desc: 'Écouter, comprendre et parler en anglais.',
    // Encouragements du programme (« Hooray! Good job! »), lus avec la voix anglaise
    cheers: ['Good job!', 'Great!', 'Super!', 'Hooray!', 'Well done!', 'Awesome!', 'Yes! You got it!'].map((text) => ({ text, lang: 'en-CA' })),
    lint: (q, skill) => EN.lint(q, skill),
  });
  [
    { id: 'en-mots', title: 'Mes mots en anglais', icon: '🍎', color: '#118ab2', soft: '#dff3fb', pda: 'ALS 1er cycle — C2 Communiquer oralement : Contextual Language, repertoire (objects, people, description); décoder des messages' },
    { id: 'en-bouger', title: 'J\'écoute et je bouge', icon: '🙋', color: '#06a77d', soft: '#dcf7ee', pda: 'ALS 1er cycle — Contextual Language : routines (instructions, action words); stratégie : réponse physique (TPR)' },
    { id: 'en-parler', title: 'Parler en anglais', icon: '💬', color: '#f78c40', soft: '#ffe9d6', pda: 'ALS 1er cycle — C2 Communiquer oralement : courtesy, needs, ideas, pair work, common inquiries' },
    { id: 'en-histoires', title: 'Histoires et comptines', icon: '📖', color: '#9b5de5', soft: '#efe4fb', pda: 'ALS 1er cycle — C1 Agir sur sa compréhension de textes : éléments clés, événements, chansons et comptines' },
  ].forEach((d) => M.registerDomain({ subject: 'anglais', ...d }));

  /* ---------------- Couleurs (dessins recoloriables, pastilles) ---------------- */
  EN.COLORS = {
    red: '#e63946', blue: '#1d6fd8', yellow: '#ffd60a', green: '#2a9d50', orange: '#f77f00', purple: '#8e44ad',
    pink: '#ff8fc7', brown: '#8d5524', black: '#2b2b2b', white: '#ffffff', grey: '#9aa0a6',
  };
  EN.hex = (c) => EN.COLORS[c] || c || '#1d6fd8';
  /** Assombrit/éclaircit une couleur hex (k entre -1 et 1). */
  EN.shade = (hex, k) => {
    const h = EN.hex(hex).replace('#', '');
    const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
    return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join('');
  };

  /* ---------------- Aides HTML ---------------- */
  EN.en = (text) => `<span lang="en">${M.esc(text)}</span>`;
  EN.ear = (text, say) => `<b class="en-w" lang="en">${M.esc(text)}</b> ${M.ui.speak(say || text, { lang: EN.LANG })}`;
  /** Image d'un élément {emoji | art, color?, size?}. */
  EN.pic = (it, size = 64) => {
    if (!it) return '';
    if (it.art && M.art.has(it.art)) return M.art.html(it.art, { ...it, size, alt: it.fr || it.word || it.art });
    if (it.art) return `<span class="en-emo" style="font-size:${Math.round(size * 0.8)}px">${M.art.emoji(it.art) || '❓'}</span>`;
    return `<span class="en-emo" style="font-size:${Math.round(size * 0.8)}px">${it.emoji || ''}</span>`;
  };
  /** Nombre affiché en chiffres (vocabulaire des nombres). */
  EN.digit = (n) => `<span class="en-digit">${n}</span>`;

  /** Vérifie qu'aucune voix anglaise ne manque; sinon renvoie un encadré (pages Apprendre). */
  EN.voiceWarn = (el) => {
    if (!el || !M.voices) return;
    M.voices.ready().then(() => {
      if (!el.isConnected || !M.voices.all().length) return;
      const st = M.voices.status(EN.LANG);
      if (st.state !== 'none') return;
      const box = document.createElement('div');
      box.innerHTML = M.ui.callout('Ton appareil n\'a pas de voix anglaise : les 🔊 resteront muets. Demande à un adulte (page Parents → Anglais).', { tone: 'warn', who: '🔇' });
      el.prepend(box.firstChild);
    });
  };

  /* ---------------- Règles de la matière (tools/check-skills.js) ---------------- */
  const hasEn = (html) => /lang="en/.test(String(html || ''));
  EN.lint = function (q, skill) {
    const fmt = q.format || q.input;
    if (fmt === 'text') return 'format text interdit en anglais (pas d\'écriture au 1er cycle)';
    if (fmt === 'steps' && (q.steps || []).some((s) => (s.format || s.input) === 'text')) return 'étape text interdite en anglais';
    if (q.audio) {
      const a = typeof q.audio === 'string' ? { text: q.audio } : q.audio;
      if (!a.lang || !/^en/.test(a.lang)) return 'audio sans lang anglaise (jamais lu par une voix française)';
    }
    if (q.passage && q.passage.lang && !/^en/.test(q.passage.lang)) return 'passage : lang doit être anglaise';
    if (q.passage && !q.passage.lang) return 'passage sans lang';
    if (q.sayLang && !/^en/.test(q.sayLang)) return 'sayLang inattendu';
    if (q.choices) {
      for (const c of q.choices) {
        if (hasEn(c.label) && !c.say) return `choix anglais sans audio : ${M.text ? c.value : ''}`;
        // say français permis seulement s'il est explicite (lang: 'fr-CA') sur un choix sans anglais (ex. situations lues)
        if (c.say && !/^en/.test(c.lang || q.lang || '') && !(/^fr/.test(c.lang || '') && !hasEn(c.label))) return 'choix avec say sans lang anglaise';
      }
      const labels = q.choices.map((c) => String(c.label));
      if (new Set(labels).size !== labels.length) return 'deux choix ont la même image/étiquette';
    }
    if (q.pairs) for (const p of q.pairs) {
      if (hasEn(p.left) && !p.sayLeft) return 'match : mot anglais à gauche sans sayLeft';
      if (hasEn(p.right) && !p.sayRight) return 'match : mot anglais à droite sans sayRight';
    }
    if (q.items) for (const it of q.items) if (hasEn(it.label) && !it.say) return 'sort : élément anglais sans say';
    if (q.bins) for (const b of q.bins) if (hasEn(b.label)) return 'sort : boîte en anglais (pas d\'audio pour les boîtes)';
    if (fmt === 'hotspot' && q.answerSay && !/^en/.test(q.lang || '')) return 'hotspot : answerSay sans lang anglaise';
    if (skill && !(skill.needs || []).includes('speech:en') && (q.audio || q.passage)) return 'habileté avec audio anglais sans needs speech:en';
    // L'anglais dans la consigne doit être balisé (sinon lu avec l'accent français)
    const bare = String(q.prompt || '').replace(/<span lang="en">[^<]*<\/span>/g, '');
    if (/\b(the|you|your|touch|what|is it|it's)\b/i.test(M.text ? bare.replace(/<[^>]*>/g, '') : bare)) return 'mot anglais non balisé dans la consigne';
  };

  /* ---------------- Styles (préfixe en-) ---------------- */
  try {
    M.css(`
    .en-emo { display: inline-block; line-height: 1.1 }
    .en-digit { font-size: 2.4rem; font-weight: 900; color: var(--B); line-height: 1 }
    .en-w { color: var(--B) }
    .en-pic-lbl { display: flex; flex-direction: column; align-items: center; gap: 2px }
    .en-pic-lbl small { font-size: .95rem; font-weight: 800; color: var(--ink) }
    .en-say { font-size: 1.15rem }
    .choice-btn .en-say { padding-right: 26px }
    .en-sit { display: flex; align-items: center; gap: 8px; font-size: 1.05rem; text-align: left }
    .en-sit .en-emo { font-size: 2.2rem }
    .en-coll { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0 2px; font-size: 1.35rem; line-height: 1.25 }
    .en-story { display: grid; gap: 6px }
    .en-line { display: grid; grid-template-columns: 92px 1fr auto; align-items: center; gap: 10px; background: #fff; border: 2px solid var(--line); border-radius: 14px; padding: 4px 8px }
    .en-line .en-lpic { font-size: 2.2rem; text-align: center; display: flex; justify-content: center; gap: 2px }
    .en-line .en-ltext { font-size: 1.15rem; line-height: 1.4 }
    .en-line .en-lfr { display: block; font-size: .9rem; color: var(--muted); font-weight: 700 }
    .choice-btn:has(.en-pose) { min-width: 0; padding: 6px }
    .en-pose { display: block; width: 100%; text-align: center } .en-pose .art { max-width: 100%; height: auto !important; aspect-ratio: 1 }
    .en-qpic { display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap; margin: 10px 0 0; font-weight: 800 }
    .hotspot svg.en-scene, svg.en-scene { width: 100%; max-width: 560px }
    .hotspot svg.en-body, svg.en-body { width: 100%; max-width: 300px; max-height: 64vh }
    .en-poses .vocab-emoji, .en-poses .art { margin: 0 auto }
    .en-chant { background: #fffdf6; border: 3px solid var(--line); border-radius: 18px; padding: 10px 14px }
    .en-chant ol { margin: 0; padding-left: 0; list-style: none; display: grid; gap: 6px }
    .en-chant li { display: flex; align-items: center; gap: 8px; font-size: 1.2rem; font-weight: 700 }
    .en-chant li .g { font-size: 1.6rem; width: 2em; text-align: center }
    .en-chant li .rw { cursor: pointer; border-radius: 6px } .en-chant li .rw:hover { background: var(--Bb) }
    .en-chant-head { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 8px }
    .en-dialog { display: grid; gap: 8px; max-width: 560px }
    .en-bubble { display: flex; align-items: center; gap: 8px }
    .en-bubble .who { font-size: 2rem }
    .en-bubble .txt { background: #fff; border: 3px solid var(--line); border-radius: 18px; padding: 6px 12px; font-size: 1.15rem; font-weight: 700 }
    .en-bubble.r { flex-direction: row-reverse } .en-bubble.r .txt { background: var(--Bb) }
    .en-pairs { display: flex; flex-wrap: wrap; gap: 10px }
    .en-pair { display: flex; flex-wrap: wrap; max-width: 100%; align-items: center; gap: 6px; background: #fff; border: 3px solid var(--line); border-radius: 16px; padding: 6px 10px; font-weight: 800 }
    .en-pair .en-emo { font-size: 1.8rem }
    button.en-pair { cursor: pointer; font: inherit; font-weight: 800; min-height: var(--touch) }
    .en-pair.sel { border-color: var(--B); background: var(--Bb) }
    .en-pair .btn.icon { min-width: 0; font-weight: 800 }
    .en-bodybox { display: grid; grid-template-columns: minmax(220px, 340px) 1fr; gap: 16px; align-items: start }
    @media (max-width: 700px) { .en-bodybox { grid-template-columns: 1fr } .en-line { grid-template-columns: 70px 1fr auto } .en-line .en-lpic .en-emo { font-size: 26px !important } .en-line .en-lpic .art { width: 34px !important; height: 34px !important } }
    .en-bodybox svg [data-hot] { cursor: pointer }
    .en-bodybox svg .on { filter: drop-shadow(0 0 6px #118ab2) }
    .en-heard { font-weight: 900; font-size: 1.3rem; color: var(--B); min-height: 1.6em }
    `);
  } catch (e) { /* hors navigateur (tools/check-skills.js) */ }

  /* ---------------- Outil parent : voix anglaise ---------------- */
  M.registerParentTool({
    id: 'en-voix', subject: 'anglais', title: 'Anglais : la voix anglaise', icon: '🗣️',
    render(el) {
      el.innerHTML = `<p>La matière Anglais est surtout <b>orale</b> : l'enfant écoute des mots et des phrases lus par une voix anglaise
        (canadienne si possible, sinon américaine). L'appli ne lit <b>jamais</b> l'anglais avec une voix française. Sans voix anglaise,
        les exercices d'anglais sont verrouillés; les pages Apprendre restent visibles.</p>
        <div class="row en-vstate"><span class="chip">⏳ Vérification…</span></div>
        <p class="muted">Ajouter une voix anglaise — <b>Windows</b> : Paramètres → Heure et langue → Voix → Ajouter des voix (English (Canada) ou English (United States)).
        <b>Edge</b> offre aussi des voix « Online (Natural) » (Internet requis). <b>iPad/iPhone</b> : Réglages → Accessibilité → Contenu énoncé → Voix → English.
        <b>Android</b> : Paramètres → Synthèse vocale → moteur Google → installer English.</p>
        <p class="muted">Ce que l'appli entraîne : la <b>compréhension orale</b> (C1 et l'écoute de C2). La production orale se vit en classe;
        encouragez l'enfant à répéter les mots à voix haute.</p>`;
      M.voices.ready().then(() => {
        const box = M.$('.en-vstate', el);
        if (!box) return;
        const st = M.voices.status(EN.LANG);
        const icon = st.state === 'exact' ? '✅ Voix canadienne' : st.state === 'fallback' ? '🟡 Voix anglaise (pas canadienne, c\'est correct)' : '❌ Aucune voix anglaise';
        box.innerHTML = `<span class="chip">${icon}${st.name ? ' : ' + M.esc(st.name) : ''}</span>${M.ui.speak('Hello! I am a beaver.', { lang: EN.LANG, label: '▶ Tester la voix' })}`;
      });
    },
  });
})();
