/* Univers social — page Apprendre « Vivre ensemble » (us-moi-autres) :
   émotions (sélecteur, rien n'est enregistré), besoins, civilité, message clair, mini-quiz. */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const ui = M.ui;

  M.registerLearn({
    id: 'us-vivre-ensemble',
    domain: 'us-moi-autres',
    title: 'Vivre ensemble',
    icon: '💛',
    short: 'Émotions, besoins, gestes de civilité, régler un conflit',
    intro: 'Pour bien vivre ensemble, on apprend à reconnaître les émotions, à connaître nos besoins et à faire des gestes qui aident.',
    parentNote:
      "Le sélecteur d'émotions de cette page n'enregistre rien : il sert à mettre des mots sur les émotions. Les émotions de l'enfant ne sont jamais notées.",
    render(el) {
      const E = U.d('emotions'),
        B = U.d('besoins');
      const ETAPES = [
        { icon: '🛑', label: "Je m'arrête", detail: 'Je respire pour me calmer.' },
        { icon: '💬', label: 'Je dis comment je me sens', detail: '« Je suis fâché quand… »' },
        { icon: '👂', label: "J'écoute", detail: "L'autre me dit comment il se sent." },
        { icon: '🤝', label: 'On trouve une solution', detail: 'Une solution juste pour les deux.' },
        { icon: '🙋', label: "Je demande de l'aide", detail: 'Si ça ne marche pas : un adulte.' },
      ];
      el.innerHTML = [
        ui.section({
          icon: '😊',
          title: '1. Les émotions',
          intro: "Touche un visage pour entendre le nom de l'émotion. Rien n'est noté ni enregistré : c'est juste pour mettre des mots.",
          body:
            '<div class="us-feel"></div><div class="viz-status us-feel-st"></div>' +
            ui.vocab(E.map((e) => ({ emoji: e.emoji, word: U.cap(e.nom.replace(/^(la |l')/, '')), note: e.note, say: e.nom }))) +
            ui.callout(
              "On devine l'émotion d'une personne avec des <b>indices</b> : son visage, ses gestes, ses paroles. Mais chaque personne peut ressentir les choses à sa façon !",
            ),
        }),
        ui.section({
          icon: '🍎',
          title: '2. Mes besoins',
          intro:
            "Un <b>besoin</b>, c'est ce qu'il faut pour vivre et bien grandir. Une <b>envie</b>, c'est agréable, mais on peut vivre sans.",
          body:
            `<div class="l-grid">${B.types.map((t) => `<div class="l-tile"><h3>${t.label}</h3>${ui.vocab(B.items.filter((i) => i.type === t.id).map((i) => ({ emoji: i.emoji, word: i.label })))}</div>`).join('')}</div>` +
            ui.callout("Jouer, c'est aussi un besoin : c'est un <b>droit</b> des enfants ! 🪀", { tone: 'info' }),
        }),
        ui.section({
          icon: '🙏',
          title: '3. Les gestes de civilité',
          intro: 'Lis la situation, puis retourne la carte pour voir un geste qui aide.',
          body: '<div class="us-civ"></div>',
        }),
        ui.section({
          icon: '🤝',
          title: '4. Régler un conflit : le message clair',
          intro: 'Quand il y a une chicane, on suit ces étapes :',
          body:
            ui.demarche(ETAPES) +
            ui.callout(
              "Un <b>message clair</b> commence par « Je » : « Je suis triste quand tu ris de mon dessin. » On dit ce qu'on ressent, sans insulter.",
            ),
        }),
        ui.section({ icon: '✅', title: '5. Vérifie ta compréhension', body: '<div class="us-mq"></div>' }),
      ].join('');
      ui.feelings(M.$('.us-feel', el)!, {
        onPick: (f) => {
          M.$('.us-feel-st', el)!.textContent = `${f.emoji} ${f.label}`;
        },
      });
      // Cartes courtes (situation → geste) : le texte doit tenir sur une carte de téléphone.
      ui.flashcards(
        M.$('.us-civ', el)!,
        [
          ['👋', 'On me dit bonjour', '« Bonjour ! »'],
          ['✏️', 'On me prête un crayon', '« Merci ! »'],
          ['🚪', 'Je veux passer', '« Excuse-moi »'],
          ['🗑️', "J'ai un déchet", 'À la poubelle !'],
          ['🤧', 'Je vais éternuer', 'Dans mon coude'],
          ['💬', 'Un ami parle', "J'attends mon tour"],
          ['📚', 'À la bibliothèque', 'Je chuchote'],
          ['🧱', "J'ai fini de jouer", 'Je range'],
        ].map(([e, f, b]) => ({
          front: `<span style="font-size:2.4rem">${e}</span><br>${f}`,
          back: b,
          say: `${f} : ${b.replace(/[«»]/g, '')}`,
        })),
      );
      ui.miniQuiz(
        M.$('.us-mq', el)!,
        ['us-emotions', 'us-civilite', 'us-besoins', 'us-conflits'].map((id) => () => M.skillById[id].gen({ lvl: 0 })),
      );
    },
  });
})();
