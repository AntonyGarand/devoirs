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
    number: () => ({
      prompt: '<div class="eq">7 + 5 = {?}</div>',
      format: 'number',
      answer: 12,
      hint: '7 + 3 = 10, puis encore 2.',
      explain: '7 + 5 = 12 : on fait 10, puis on ajoute 2.',
    }),
    choice: () => ({
      prompt: 'Quel animal vit dans un barrage ?',
      format: 'choice',
      answer: 'castor',
      choices: [
        { label: '🦫 castor', value: 'castor' },
        { label: '🐻 ours', value: 'ours' },
        { label: '🦌 chevreuil', value: 'chevreuil' },
      ],
    }),
    tf: () => ({ prompt: 'Le mot « chat » commence par le son [ch].', format: 'tf', answer: true }),
    multi: () => ({
      prompt: 'Touche les nombres <b>pairs</b>.',
      format: 'multi',
      answer: [4, 8, 10],
      choices: [3, 4, 7, 8, 10, 11].map((n) => ({ label: String(n), value: n })),
      cols: 3,
    }),
    order: () => ({
      prompt: "Place les mots dans l'ordre alphabétique.",
      format: 'order',
      choices: ['pomme', 'banane', 'kiwi'].map((w) => ({ label: w, value: w })),
      answer: ['banane', 'kiwi', 'pomme'],
    }),
    text: () => ({
      prompt: 'Écoute et écris le mot.',
      audio: 'école',
      format: 'text',
      answer: 'école',
      hint: 'Il y a un accent aigu sur le e du début.',
    }),
    match: () => ({
      prompt: 'Associe chaque mot anglais à son image.',
      format: 'match',
      pairs: [
        { left: 'cat', right: '🐱' },
        { left: 'dog', right: '🐶' },
        { left: 'fish', right: '🐟' },
      ],
    }),
    sort: () => ({
      prompt: 'Classe les mots : masculin ou féminin ?',
      format: 'sort',
      bins: [
        { id: 'm', label: 'un 👦' },
        { id: 'f', label: 'une 👧' },
      ],
      items: [
        { label: 'chat', bin: 'm' },
        { label: 'maison', bin: 'f' },
        { label: 'tuque', bin: 'f' },
        { label: 'ballon', bin: 'm' },
      ],
    }),
    cloze: () => ({
      prompt: 'Complète la phrase.',
      format: 'cloze',
      text: 'Les {0} jouent dans la {1}.',
      blanks: [
        { choices: ['enfant', 'enfants'], answer: 'enfants' },
        { choices: ['neige', 'neiges'], answer: 'neige' },
      ],
    }),
    tapwords: () => ({
      prompt: 'Touche le <b>verbe</b>.',
      format: 'tapwords',
      words: ['Le', 'castor', 'construit', 'un', 'barrage.'],
      answer: [2],
    }),
    hotspot: () => ({
      prompt: 'Touche le <b>triangle</b>.',
      format: 'hotspot',
      answer: 'tri',
      html: M.viz.svg(
        300,
        110,
        '<rect data-hot="car" x="10" y="20" width="70" height="70" fill="#ef476f"/><polygon data-hot="tri" points="150,20 190,90 110,90" fill="#118ab2"/><circle data-hot="cer" cx="255" cy="55" r="36" fill="#06a77d"/>',
      ),
    }),
    steps: () => {
      const tokens = M.tokenize('Léa a 8 billes. Son ami lui en donne 5. Combien de billes Léa a-t-elle maintenant ?');
      return {
        prompt: 'Résous le problème étape par étape.',
        passage: { title: 'Le problème', tokens },
        format: 'steps',
        steps: [
          {
            demarche: 1,
            prompt: 'Touche la <b>question</b> dans le texte.',
            format: 'tapwords',
            target: 'passage',
            unit: 'sentence',
            mark: 'q',
            answer: [2],
          },
          {
            demarche: 1,
            prompt: 'Touche les deux <b>nombres utiles</b>.',
            format: 'tapwords',
            target: 'passage',
            mark: 'd',
            answer: [2, 9],
            select: 'many',
          },
          {
            demarche: 2,
            prompt: 'Quel schéma va avec le problème ?',
            format: 'choice',
            answer: 'tout',
            cols: 1,
            choices: [
              {
                label: M.viz.barModelHtml({ type: 'tout', rows: [{ segs: [{ v: 8 }, { v: 5, tone: 'B' }] }], total: { unknown: true } }),
                value: 'tout',
              },
              { label: M.viz.barModelHtml({ type: 'tout', rows: [{ segs: [{ v: 8 }, { v: null }] }], total: { v: 5 } }), value: 'partie' },
            ],
          },
          { demarche: 3, prompt: '8 + 5 = {?}', format: 'number', answer: 13 },
          {
            demarche: 5,
            prompt: 'Choisis la phrase-réponse.',
            format: 'cloze',
            text: 'Léa a {0} billes maintenant.',
            blanks: [{ choices: ['13', '3', '85'], answer: '13' }],
          },
        ],
      };
    },
    build: () => ({
      prompt: 'Écoute et construis le mot avec les syllabes.',
      audio: 'chocolat',
      format: 'build',
      join: '',
      tiles: ['cho', 'co', 'lat', 'la', 'ca'],
      answer: ['cho', 'co', 'lat'],
    }),
    label: () => ({
      prompt: 'Place les étiquettes sur la fleur.',
      format: 'label',
      labels: [
        { id: 'fleur', text: 'la fleur' },
        { id: 'tige', text: 'la tige' },
        { id: 'racines', text: 'les racines' },
      ],
      distractors: ['la patte'],
      html: M.viz.svg(
        300,
        300,
        '<rect data-hot="tige" data-anchor="200,170" x="140" y="110" width="20" height="120" fill="#06a77d"/><circle data-hot="fleur" data-anchor="150,40" cx="150" cy="80" r="45" fill="#ef476f"/><g data-hot="racines" data-anchor="150,285"><rect x="100" y="230" width="100" height="60" fill="transparent"/><path d="M150 230 L120 280 M150 230 L150 285 M150 230 L180 280" stroke="#8a5a2b" stroke-width="6"/></g>',
      ),
    }),
    estimate: () => ({ prompt: 'Place environ <b>50</b> sur la droite.', format: 'estimate', lo: 0, hi: 100, answer: 50, tolerance: 8 }),
    info: () => ({ prompt: 'Lis le problème deux fois.', format: 'info', html: '<p>Léa a 8 billes. Son ami lui en donne 5.</p>' }),
    reflect: () => ({
      prompt: "Raconte à un adulte une fois où tu as aidé quelqu'un. Comment tu te sentais ?",
      format: 'reflect',
      scene: [{ emoji: '🤝', label: 'aider' }],
    }),
    predict: () => ({
      prompt: "Une pomme dans l'eau…",
      format: 'predict',
      predict: {
        prompt: 'Je prédis que la pomme va…',
        choices: [
          { label: '🛟 flotter', value: 'flotte' },
          { label: '⚓ couler', value: 'coule' },
        ],
      },
      outcome: 'flotte',
      simulate: async (el) => {
        el.innerHTML =
          '<div style="font-size:3rem;text-align:center;background:#dff3fb;border-radius:14px;padding:10px">🍎<br>〰️〰️〰️</div>';
        await M.sleep(600);
      },
      result: 'La pomme reste à la surface.',
      check: {
        prompt: "Qu'est-ce que la pomme a fait ?",
        format: 'choice',
        answer: 'flotte',
        choices: [
          { label: 'Elle a flotté', value: 'flotte' },
          { label: 'Elle a coulé', value: 'coule' },
        ],
      },
    }),
  };

  M.styleguide = function (app) {
    const sw = (name, v, light) => `<div class="sg-sw ${light ? 'light' : ''}" style="background:var(${v})">${name}<br>${v}</div>`;
    const formats = Object.values(M.formats);
    app.innerHTML = `
      <div class="learn-top"><a class="btn ghost" href="#/parents">← Parents</a><h1>🎨 Guide de style</h1></div>
      <p class="learn-intro">Le cadre commun de toutes les matières : jetons de design, composants et formats de questions. Voir aussi <code>docs/framework.md</code>.</p>
      ${M.ui.section({
        icon: '🎨',
        title: 'Couleurs',
        body: `<div class="sg-swatches">${sw('Encre', '--ink')}${sw('Fond', '--bg', 1)}${sw('Ligne', '--line', 1)}${sw('Rouge A', '--A')}${sw('Bleu B', '--B')}${sw('Vert C (réussite)', '--C')}${sw('Jaune', '--yel', 1)}${sw('Orange', '--org')}${sw('Violet', '--pur')}${sw('Erreur', '--red')}</div>
        <h3>Matières</h3><div class="sg-swatches">${M.SUBJECTS.map((s) => `<div class="sg-sw" style="background:${s.color}">${s.icon} ${s.title}</div>`).join('')}</div>`,
      })}
      ${M.ui.section({
        icon: '🔤',
        title: 'Typographie et ton',
        body: `<p style="font-size:var(--fs-xxl);font-weight:900;margin:0">7 + 5 = 12</p><p style="font-size:var(--fs-xl);font-weight:800;margin:0">Consigne : courte, au « tu », un seul verbe d'action.</p><p>Texte courant 18 px, interligne 1,45. Explications au « on » : « On fait 10, puis on ajoute 2. »</p>
        ${M.ui.callout('Typographie française : espace avant <b>? ! :</b>, guillemets « … », nombres avec espace des milliers (1 000).', { tone: 'info' })}`,
      })}
      ${M.ui.section({
        icon: '🧱',
        title: 'Composants',
        body: `
        <div class="row"><button class="btn">Bouton</button><button class="btn primary">Principal</button><button class="btn blue">Bleu</button><button class="btn yellow">👀 Montre-moi</button><button class="btn ghost">← Retour</button>${M.ui.speak('Bonjour !')}</div>
        <div class="row">${M.ui.tag('Étiquette', 'var(--A)', 'var(--Aa)')}<span class="chip">Pastille</span>${M.starsHtml(2)}</div>
        ${M.ui.callout('Astuce de Castor (tone: tip)')}${M.ui.callout('Information (tone: info)', { tone: 'info' })}${M.ui.callout('Bravo (tone: success)', { tone: 'success' })}${M.ui.callout('Attention (tone: warn)', { tone: 'warn' })}
        <h3>Onglets</h3><div id="sgTabs"></div>
        <h3>Stepper</h3><div id="sgStep"></div>
        <h3>Mots illustrés (vocab)</h3>${M.ui.vocab([
          { emoji: '🍎', word: 'apple', lang: 'en-CA', note: 'pomme' },
          { emoji: '🐱', word: 'cat', lang: 'en-CA', note: 'chat' },
          { emoji: '🦫', word: 'castor' },
        ])}
        <h3>Cartes-éclair</h3><div id="sgFlash"></div>
        <h3>Lecture (toucher un mot pour l'entendre)</h3><div id="sgRead"></div>
        <h3>Démarche de résolution</h3>${M.ui.demarche()}
        <h3>Curseur (slider)</h3><div id="sgSlider"></div>
        <h3>Cycle</h3>${M.ui.cycle({
          stages: [
            { emoji: '🌱', label: 'graine' },
            { emoji: '🌿', label: 'pousse' },
            { emoji: '🌻', label: 'fleur' },
            { emoji: '🌰', label: 'graines' },
          ],
          hide: [2],
        })}
        <h3>Mot découpé (syllabes)</h3>${M.ui.wordParts('chocolat', ['cho', 'co', 'lat'])}
        <h3>Phrase annotée (classes de mots)</h3>${M.ui.tagged(
          [
            { w: 'Les', tag: 'det' },
            { w: 'petits', tag: 'adj' },
            { w: 'chats', tag: 'nom' },
            { w: 'dorment', tag: 'verbe' },
          ],
          {
            arrows: [
              [2, 0],
              [2, 1],
            ],
          },
        )}
        <h3>Glose bilingue</h3><p>Touche : ${M.ui.gloss('snow', 'neige')}</p>
        <h3>Émotions</h3><div id="sgFeel"></div>
        <h3>Comparaison</h3>${M.ui.compare({
          left: {
            title: 'Autrefois',
            items: [
              { emoji: '🕯️', label: 'chandelle' },
              { emoji: '✉️', label: 'lettre' },
            ],
          },
          right: {
            title: "Aujourd'hui",
            items: [
              { emoji: '💡', label: 'ampoule' },
              { emoji: '📱', label: 'téléphone' },
            ],
          },
        })}`,
      })}
      ${M.ui.section({
        icon: '📐',
        title: 'Visuels partagés',
        body: `
        <h3>Modèle en barres</h3><div id="sgBar"></div><button class="btn yellow" id="sgBarShow">👀 Montre-moi</button>
        ${M.viz.barModelHtml({
          type: 'comparaison',
          rows: [
            { label: 'Léa', emoji: '👧', segs: [{ v: 12 }] },
            { label: 'Félix', emoji: '👦', segs: [{ v: 7, tone: 'B' }] },
          ],
          diff: { unknown: true },
        })}
        <h3>Ligne du temps</h3>${M.viz.timeline({
          from: 0,
          to: 7,
          title: 'Ma vie',
          events: [
            { at: 0, label: 'naissance', emoji: '👶', id: 'nais' },
            { at: 1, label: 'premiers pas', emoji: '🚶', id: 'pas' },
            { at: 5, label: 'maternelle', emoji: '🎒', id: 'mat' },
            { at: 6, label: '1re année', emoji: '📚', id: 'a1' },
          ],
          hide: ['pas'],
          tickLabel: (v) => v + ' an' + (v > 1 ? 's' : ''),
        })}
        <h3>Plan</h3>${M.viz.plan({
          title: 'Mon quartier',
          cols: 6,
          rows: 4,
          grid: true,
          north: true,
          roads: [{ x1: 0, y1: 2, x2: 6, y2: 2 }],
          places: [
            { id: 'ecole', x: 0, y: 0, w: 2, emoji: '🏫', label: 'école' },
            { id: 'parc', x: 4, y: 0, w: 2, emoji: '🌳', label: 'parc', color: '#dcf7ee' },
            { id: 'maison', x: 1, y: 3, emoji: '🏠', label: 'maison' },
            { id: 'epicerie', x: 4, y: 3, emoji: '🛒', label: 'épicerie' },
          ],
        })}`,
      })}
      ${M.ui.section({ icon: '❓', title: 'Formats de questions', intro: 'Chaque format se teste ci-dessous. Une question = une carte : texte à lire (passage) ou écoute (audio) au besoin, consigne, visuel, réponse, rétroaction, explication.', body: formats.map((f) => `<h3>${f.name}</h3><p class="muted">${f.doc || ''}</p><div class="sg-q" data-f="${f.name}"></div>`).join('') })}`;
    M.ui.tabs(M.$('#sgTabs'), [
      { id: 'a', label: '🔴 Jetons', render: (p) => (p.innerHTML = '<p>Panneau A</p>') },
      { id: 'b', label: '🐸 Droite', render: (p) => (p.innerHTML = '<p>Panneau B</p>') },
    ]);
    M.ui.stepper(M.$('#sgStep'), { label: 'Nombre', value: 4, min: 0, max: 10 });
    M.ui.flashcards(M.$('#sgFlash'), [
      { front: '🍎', back: 'apple', say: 'apple', lang: 'en-CA' },
      { front: '🐶', back: 'dog', say: 'dog', lang: 'en-CA' },
    ]);
    M.ui.slider(M.$('#sgSlider'), {
      label: 'Arrosage',
      stops: [
        { value: 0, icon: '🏜️', label: 'rien' },
        { value: 1, icon: '💧', label: 'un peu' },
        { value: 2, icon: '🌊', label: 'trop' },
      ],
      value: 1,
    });
    M.ui.feelings(M.$('#sgFeel'));
    const bar = M.viz.barModel(M.$('#sgBar'), {
      type: 'tout',
      rows: [{ segs: [{ v: 8 }, { v: 5, tone: 'B' }] }],
      total: { unknown: true },
      answer: 13,
    });
    M.$('#sgBarShow').onclick = () => bar.showMe();
    M.ui.reading(M.$('#sgRead'), {
      title: 'Le castor',
      text: 'Le castor vit au bord de la rivière. Il construit un barrage avec des branches.',
    });
    M.$$('.sg-q').forEach((el) => {
      const mk = M.FORMAT_SAMPLES[el.dataset.f];
      if (mk) M.ui.miniQuiz(el, [mk], { title: 'Exemple' });
      else el.innerHTML = M.ui.callout("Pas d'exemple pour ce format.", { tone: 'warn' });
    });
  };
})();
