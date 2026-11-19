/* =====================================================================
   styleguide.js — guide de style vivant (#/style)
   Montre les jetons, les composants et chaque format de question en action.
   Tout nouveau format ou composant doit y avoir un exemple.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;

  /** Un exemple par format (sert aussi de référence pour les auteurs). */
  M.FORMAT_SAMPLES = {
    number: () => ({ prompt: '<div class="eq">7 + 5 = {?}</div>', format: 'number', answer: 12, hint: '7 + 3 = 10, puis encore 2.', explain: '7 + 5 = 12 : on fait 10, puis on ajoute 2.' }),
    choice: () => ({ prompt: 'Quel animal vit dans un barrage ?', format: 'choice', answer: 'castor', choices: [{ label: '🦫 castor', value: 'castor' }, { label: '🐻 ours', value: 'ours' }, { label: '🦌 chevreuil', value: 'chevreuil' }] }),
    tf: () => ({ prompt: 'Le mot « chat » commence par le son [ch].', format: 'tf', answer: true }),
    multi: () => ({ prompt: 'Touche les nombres <b>pairs</b>.', format: 'multi', answer: [4, 8, 10], choices: [3, 4, 7, 8, 10, 11].map((n) => ({ label: String(n), value: n })), cols: 3 }),
    order: () => ({ prompt: 'Place les mots dans l\'ordre alphabétique.', format: 'order', choices: ['pomme', 'banane', 'kiwi'].map((w) => ({ label: w, value: w })), answer: ['banane', 'kiwi', 'pomme'] }),
    text: () => ({ prompt: 'Écoute et écris le mot.', audio: 'école', format: 'text', answer: 'école', hint: 'Il y a un accent aigu sur le e du début.' }),
    match: () => ({ prompt: 'Associe chaque mot anglais à son image.', format: 'match', pairs: [{ left: 'cat', right: '🐱' }, { left: 'dog', right: '🐶' }, { left: 'fish', right: '🐟' }] }),
    sort: () => ({ prompt: 'Classe les mots : masculin ou féminin ?', format: 'sort', bins: [{ id: 'm', label: 'un 👦' }, { id: 'f', label: 'une 👧' }], items: [{ label: 'chat', bin: 'm' }, { label: 'maison', bin: 'f' }, { label: 'tuque', bin: 'f' }, { label: 'ballon', bin: 'm' }] }),
    cloze: () => ({ prompt: 'Complète la phrase.', format: 'cloze', text: 'Les {0} jouent dans la {1}.', blanks: [{ choices: ['enfant', 'enfants'], answer: 'enfants' }, { choices: ['neige', 'neiges'], answer: 'neige' }] }),
    tapwords: () => ({ prompt: 'Touche le <b>verbe</b>.', format: 'tapwords', words: ['Le', 'castor', 'construit', 'un', 'barrage.'], answer: [2] }),
    hotspot: () => ({ prompt: 'Touche le <b>triangle</b>.', format: 'hotspot', answer: 'tri', html: M.viz.svg(300, 110, '<rect data-hot="car" x="10" y="20" width="70" height="70" fill="#ef476f"/><polygon data-hot="tri" points="150,20 190,90 110,90" fill="#118ab2"/><circle data-hot="cer" cx="255" cy="55" r="36" fill="#06a77d"/>') }),
    steps: () => ({
      prompt: 'Résous le problème étape par étape.',
      passage: { title: 'Le problème', html: '<p>Léa a <mark>8 billes</mark>. Son ami lui en donne <mark>5</mark>. <b>Combien de billes Léa a-t-elle maintenant ?</b></p>' },
      format: 'steps',
      steps: [
        { label: '🔍 Je comprends', prompt: 'Que cherche-t-on ?', format: 'choice', answer: 'total', choices: [{ label: 'Le nombre de billes de Léa à la fin', value: 'total' }, { label: 'Le nombre de billes de l\'ami', value: 'ami' }] },
        { label: '✏️ Je planifie', prompt: 'Quelle opération ?', format: 'choice', answer: '+', choices: [{ label: '➕ Addition', value: '+' }, { label: '➖ Soustraction', value: '-' }], after: 'On ajoute : c\'est une addition.' },
        { label: '🧮 Je calcule', prompt: '8 + 5 = {?}', format: 'number', answer: 13 },
        { label: '💬 Je réponds', prompt: 'Choisis la phrase-réponse.', format: 'choice', answer: 'a', choices: [{ label: 'Léa a 13 billes maintenant.', value: 'a' }, { label: 'L\'ami a 13 billes.', value: 'b' }] },
      ],
    }),
  };

  M.styleguide = function (app) {
    const sw = (name, v, light) => `<div class="sg-sw ${light ? 'light' : ''}" style="background:var(${v})">${name}<br>${v}</div>`;
    const formats = Object.values(M.formats);
    app.innerHTML = `
      <div class="learn-top"><a class="btn ghost" href="#/parents">← Parents</a><h1>🎨 Guide de style</h1></div>
      <p class="learn-intro">Le cadre commun de toutes les matières : jetons de design, composants et formats de questions. Voir aussi <code>docs/framework.md</code>.</p>
      ${M.ui.section({ icon: '🎨', title: 'Couleurs', body: `<div class="sg-swatches">${sw('Encre', '--ink')}${sw('Fond', '--bg', 1)}${sw('Ligne', '--line', 1)}${sw('Rouge A', '--A')}${sw('Bleu B', '--B')}${sw('Vert C (réussite)', '--C')}${sw('Jaune', '--yel', 1)}${sw('Orange', '--org')}${sw('Violet', '--pur')}${sw('Erreur', '--red')}</div>
        <h3>Matières</h3><div class="sg-swatches">${M.SUBJECTS.map((s) => `<div class="sg-sw" style="background:${s.color}">${s.icon} ${s.title}</div>`).join('')}</div>` })}
      ${M.ui.section({ icon: '🔤', title: 'Typographie et ton', body: `<p style="font-size:var(--fs-xxl);font-weight:900;margin:0">7 + 5 = 12</p><p style="font-size:var(--fs-xl);font-weight:800;margin:0">Consigne : courte, au « tu », un seul verbe d'action.</p><p>Texte courant 18 px, interligne 1,45. Explications au « on » : « On fait 10, puis on ajoute 2. »</p>
        ${M.ui.callout('Typographie française : espace avant <b>? ! :</b>, guillemets « … », nombres avec espace des milliers (1 000).', { tone: 'info' })}` })}
      ${M.ui.section({ icon: '🧱', title: 'Composants', body: `
        <div class="row"><button class="btn">Bouton</button><button class="btn primary">Principal</button><button class="btn blue">Bleu</button><button class="btn yellow">👀 Montre-moi</button><button class="btn ghost">← Retour</button>${M.ui.speak('Bonjour !')}</div>
        <div class="row">${M.ui.tag('Étiquette', 'var(--A)', 'var(--Aa)')}<span class="chip">Pastille</span>${M.starsHtml(2)}</div>
        ${M.ui.callout('Astuce de Castor (tone: tip)')}${M.ui.callout('Information (tone: info)', { tone: 'info' })}${M.ui.callout('Bravo (tone: success)', { tone: 'success' })}${M.ui.callout('Attention (tone: warn)', { tone: 'warn' })}
        <h3>Onglets</h3><div id="sgTabs"></div>
        <h3>Stepper</h3><div id="sgStep"></div>
        <h3>Mots illustrés (vocab)</h3>${M.ui.vocab([{ emoji: '🍎', word: 'apple', lang: 'en-CA', note: 'pomme' }, { emoji: '🐱', word: 'cat', lang: 'en-CA', note: 'chat' }, { emoji: '🦫', word: 'castor' }])}
        <h3>Cartes-éclair</h3><div id="sgFlash"></div>
        <h3>Lecture (toucher un mot pour l'entendre)</h3><div id="sgRead"></div>
        <h3>Démarche de résolution</h3>${M.ui.demarche()}` })}
      ${M.ui.section({ icon: '❓', title: 'Formats de questions', intro: 'Chaque format se teste ci-dessous. Une question = une carte : texte à lire (passage) ou écoute (audio) au besoin, consigne, visuel, réponse, rétroaction, explication.', body: formats.map((f) => `<h3>${f.name}</h3><p class="muted">${f.doc || ''}</p><div class="sg-q" data-f="${f.name}"></div>`).join('') })}`;
    M.ui.tabs(M.$('#sgTabs'), [{ id: 'a', label: '🔴 Jetons', render: (p) => (p.innerHTML = '<p>Panneau A</p>') }, { id: 'b', label: '🐸 Droite', render: (p) => (p.innerHTML = '<p>Panneau B</p>') }]);
    M.ui.stepper(M.$('#sgStep'), { label: 'Nombre', value: 4, min: 0, max: 10 });
    M.ui.flashcards(M.$('#sgFlash'), [{ front: '🍎', back: 'apple', say: 'apple', lang: 'en-CA' }, { front: '🐶', back: 'dog', say: 'dog', lang: 'en-CA' }]);
    M.ui.reading(M.$('#sgRead'), { title: 'Le castor', text: 'Le castor vit au bord de la rivière. Il construit un barrage avec des branches.' });
    M.$$('.sg-q').forEach((el) => {
      const mk = M.FORMAT_SAMPLES[el.dataset.f];
      if (mk) M.ui.miniQuiz(el, [mk], { title: 'Exemple' });
      else el.innerHTML = M.ui.callout('Pas d\'exemple pour ce format.', { tone: 'warn' });
    });
  };
})();
