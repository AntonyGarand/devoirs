/* learn/lecture.js — 🕵️ Lire comme un détective (fr-lire-detective) */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const gen = (id: string, lvl: number) => () => M.skillById[id].gen({ lvl });

  M.registerLearn({
    id: 'fr-lire-detective',
    domain: 'fr-lecture',
    title: 'Lire comme un détective',
    icon: '🕵️',
    short: 'Mes trucs quand je bloque sur un mot, et les questions qui, quoi, où, quand.',
    intro: "Un bon lecteur, c'est comme un détective : il cherche des <b>indices</b> pour lire les mots et pour comprendre l'histoire.",
    render(el) {
      const STRAT = [
        { icon: '👀', label: "Je regarde l'image", detail: "L'image peut me donner un indice." },
        { icon: '✂️', label: 'Je découpe en syllabes', detail: 'pa-pil-lon : je lis un morceau à la fois.' },
        { icon: '🔁', label: 'Je relis la phrase', detail: 'Je recommence depuis le début de la phrase.' },
        { icon: '🤔', label: 'Est-ce que ça a du sens ?', detail: "Le mot que je lis va-t-il avec l'histoire ?" },
      ];
      const t = FR.TEXTES.find((x) => x.id === 'cabane') || FR.TEXTES[0];
      const QQ = [
        ['👤 Qui ?', 'les personnages'],
        ['❓ Quoi ?', 'ce qui se passe'],
        ['📍 Où ?', 'le lieu'],
        ['🕒 Quand ?', 'le moment'],
      ];
      const qs = t.questions.filter((q) => ['qui', 'ou', 'quand', 'quoi'].includes(q.type)).slice(0, 3);
      el.innerHTML =
        M.ui.section({
          icon: '🧩',
          title: 'Quand je bloque sur un mot',
          intro: "J'essaie mes trucs, un à la fois :",
          body: M.ui.demarche(STRAT),
        }) +
        M.ui.section({
          icon: '🔍',
          title: 'Qui ? Quoi ? Où ? Quand ?',
          intro:
            'Pour comprendre une histoire, je cherche les réponses à ces questions. La réponse est souvent <b>écrite dans le texte</b> : je la retrouve et je la montre avec mon doigt.',
          body: `<div class="row">${QQ.map(([q, d]) => `<span class="chip">${q} <small>${d}</small></span>`).join(' ')}</div><div class="fr-read"></div>
          ${qs.map((q) => `<details class="callout blue" style="margin:6px 0"><summary><b>${M.esc(q.q)}</b> (touche pour voir)</summary>✔️ ${M.esc(q.choices[0])} — <i>${M.esc(q.explain)}</i></details>`).join('')}`,
        }) +
        M.ui.section({
          icon: '🤔',
          title: 'Deviner avec des indices',
          intro:
            "Parfois, le texte ne dit pas tout. Exemple : « Des gouttes tombent sur le toit. » Le texte ne dit pas qu'il pleut… mais des gouttes qui tombent, c'est de la pluie ! C'est ça, <b>deviner avec des indices</b>.",
          body: M.ui.callout(
            "Les petits mots <b>il, elle, ils, elles</b> remplacent quelqu'un dont on a déjà parlé. Demande-toi : <i>de qui parle-t-on ?</i>",
          ),
        }) +
        M.ui.section({
          icon: '🔢',
          title: 'Début, milieu, fin',
          intro:
            "Une histoire a un <b>début</b>, un <b>milieu</b> et une <b>fin</b>. Les mots <b>d'abord</b>, <b>ensuite</b>, <b>puis</b> et <b>enfin</b> m'aident à trouver l'ordre.",
          body: '<div class="row" style="font-size:1.1rem">🥚 <b>D\'abord</b>, la poule pond un œuf. → 🐣 <b>Ensuite</b>, le poussin sort. → 🐔 <b>Enfin</b>, il devient une poule.</div>',
        }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      M.ui.reading(M.$('.fr-read', el)!, { title: t.titre, text: t.texte });
      M.ui.miniQuiz(M.$('.fr-mq', el)!, [gen('fr-lire-mots', 1), gen('fr-lire-phrases', 0), gen('fr-ordre-histoire', 0)]);
    },
  });
})();
