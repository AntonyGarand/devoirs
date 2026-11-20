/* learn/verbes.js — 🏃 Être, avoir et les verbes fréquents (fr-verbes-present) */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const gen = (id, lvl) => () => M.skillById[id].gen({ lvl });
  const PERS = [['je'], ['tu'], ['il', 'elle', 'on'], ['nous'], ['vous'], ['ils', 'elles']];
  // Petites comptines originales pour mémoriser (rythme à taper dans les mains)
  const COMPTINE = {
    etre: "Je suis, tu es, il est, elle est. Nous sommes, vous êtes, ils sont, elles sont. Être, être, c'est facile à chanter !",
    avoir: "J'ai, tu as, il a, elle a. Nous avons, vous avez, ils ont, elles ont. Avoir, avoir, on l'a dans la tête !",
    aimer: "J'aime, tu aimes, il aime la neige. Nous aimons, vous aimez, ils aiment glisser !",
    aller: 'Je vais, tu vas, il va au parc. Nous allons, vous allez, ils vont, en avant !',
    dire: 'Je dis, tu dis, il dit bonjour. Nous disons, vous dites, ils disent merci !',
    faire: 'Je fais, tu fais, il fait un dessin. Nous faisons, vous faites, ils font de la peinture !',
  };

  M.registerLearn({
    id: 'fr-verbes-present',
    domain: 'fr-verbes',
    title: 'Être, avoir et les verbes fréquents',
    icon: '🏃',
    short: "Je suis, j'ai, je vais, je fais… avec une comptine pour chaque verbe.",
    intro:
      "Ces six verbes reviennent tout le temps. On les apprend <b>par cœur</b>, avec le pronom, comme une comptine. Touche une ligne pour l'entendre.",
    render(el) {
      el.innerHTML =
        M.ui.section({ icon: '📋', title: 'Choisis un verbe', body: '<div class="fr-vtabs"></div>' }) +
        M.ui.section({
          icon: '🃏',
          title: 'Cartes-éclair',
          intro: 'Lis le pronom et le verbe, dis la bonne forme, puis retourne la carte.',
          body: '<div class="fr-flash"></div>',
        }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      M.ui.tabs(
        M.$('.fr-vtabs', el),
        Object.entries(FR.VERBES).map(([id, V]) => ({
          id,
          label: `${V.em} ${V.inf}`,
          render(p) {
            const rows = PERS.map((ps, k) => {
              const g = ps.map((x) => FR.conj(id, x)).join(' · ');
              const html = ps
                .map((x) => {
                  const c = FR.conj(id, x);
                  const i = c.endsWith(V.f[k]) ? c.length - V.f[k].length : c.length;
                  return `<span class="p">${M.esc(c.slice(0, i))}</span><span class="v">${M.esc(V.f[k])}</span>`;
                })
                .join(' · ');
              return `<tr><td>${html}</td><td>${M.ui.speak(g.replace(/ · /g, ', '))}</td></tr>`;
            }).join('');
            p.innerHTML =
              `<table class="fr-table">${rows}</table>${M.ui.callout(`🎵 <b>Ma comptine</b> : ${COMPTINE[id]} ${M.ui.speak(COMPTINE[id])}`)}` +
              (['etre', 'faire', 'dire'].includes(id)
                ? M.ui.callout(`Attention : <b>vous ${V.f[4]}</b> ne finit pas par <b>-ez</b> !`, { tone: 'warn' })
                : '');
          },
        })),
      );
      const cards = M.shuffle([].concat(...Object.keys(FR.VERBES).map((id) => [0, 1, 2, 3, 4, 5].map((k) => ({ id, k }))))).slice(0, 12);
      M.ui.flashcards(
        M.$('.fr-flash', el),
        cards.map(({ id, k }) => {
          const p = PERS[k][0];
          const g = FR.conj(id, p);
          return {
            front: `<span style="font-size:1.6rem">${p === 'je' && g.startsWith("j'") ? "je (j')" : p} + <b>${FR.VERBES[id].inf}</b></span>`,
            back: `<span style="font-size:2rem;font-weight:900">${M.esc(g)}</span>`,
            say: g,
          };
        }),
      );
      M.ui.miniQuiz(M.$('.fr-mq', el), [gen('fr-etre-avoir', 0), gen('fr-etre-avoir', 1), gen('fr-verbes-frequents', 1)]);
    },
  });
})();
