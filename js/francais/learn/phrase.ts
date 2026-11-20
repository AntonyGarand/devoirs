/* learn/phrase.js — 💬 La phrase (fr-la-phrase) */
(function () {
  'use strict';
  const M = window.M;
  const gen = (id, lvl) => () => M.skillById[id].gen({ lvl });
  const big = (h) => `<div class="fr-big" style="font-size:1.6rem">${h}</div>`;

  M.registerLearn({
    id: 'fr-la-phrase',
    domain: 'fr-phrase',
    title: 'La phrase',
    icon: '💬',
    short: "Majuscule, point, mots dans l'ordre, ? et !, ne… pas.",
    intro:
      "Une phrase, c'est une suite de mots <b>dans le bon ordre</b> qui veut dire quelque chose. Elle commence par une <b>majuscule</b> et finit par un <b>point</b>.",
    render(el) {
      el.innerHTML =
        M.ui.section({
          icon: '✅',
          title: 'Majuscule au début, point à la fin',
          body:
            big('<span class="fr-gr">L</span>e chat dort sur le lit<span class="fr-gr">.</span>') +
            M.ui.callout('Je regarde le <b>début</b> : une majuscule ? Je regarde la <b>fin</b> : un point ?'),
        }) +
        M.ui.section({
          icon: '🧱',
          title: "Les mots dans l'ordre",
          intro: 'Si on mélange les mots, la phrase ne veut plus rien dire !',
          body:
            `<div class="row" style="font-size:1.25rem"><span class="chip">✖️ chat le dort lit le sur</span><span class="chip">✔️ Le chat dort sur le lit.</span></div>` +
            M.ui.callout("Truc : je dis d'abord <b>qui</b> (le chat), puis <b>ce qu'il fait</b> (dort), puis le reste (sur le lit)."),
        }) +
        M.ui.section({
          icon: '❓',
          title: "Le point d'interrogation et le point d'exclamation",
          body:
            `<table class="fr-table"><tr><td style="font-size:2rem">.</td><td>Je dis quelque chose.</td><td><i>Il neige.</i></td></tr><tr><td style="font-size:2rem">?</td><td>Je pose une question.</td><td><i>Est-ce qu'il neige ?</i></td></tr><tr><td style="font-size:2rem">!</td><td>Je m'exclame (joie, surprise, peur).</td><td><i>Wow, il neige !</i></td></tr></table>` +
            M.ui.callout(
              'Une question commence souvent par <b>est-ce que</b>, <b>qui</b>, <b>où</b>, <b>quand</b>, <b>comment</b> ou <b>pourquoi</b>.',
              { tone: 'info' },
            ),
        }) +
        M.ui.section({
          icon: '🚫',
          title: 'Dire le contraire : ne… pas',
          intro: '<b>ne</b> et <b>pas</b> entourent le verbe comme un sandwich.',
          body:
            big('Le chien <span class="fr-gr">ne</span> dort <span class="fr-gr">pas</span>.') +
            big('Le chien <span class="fr-gr">n\'</span>aime <span class="fr-gr">pas</span> la pluie.') +
            M.ui.callout("Devant une voyelle, <b>ne</b> devient <b>n'</b>."),
        }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      M.ui.miniQuiz(M.$('.fr-mq', el), [gen('fr-phrase-ponctuation', 0), gen('fr-ordre-mots', 0), gen('fr-phrase-ponctuation', 1)]);
    },
  });
})();
