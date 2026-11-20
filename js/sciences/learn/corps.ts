/* =====================================================================
   sciences/learn/corps.js — page Apprendre « Mon corps, mes sens » (habiletés 8 et 9)
   Silhouette neutre à explorer, fonctions du corps, 5 sens avec mini-défis, saines habitudes.
   Aucune donnée personnelle; jamais gauche / droite.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC) return;

  try {
    M.css(`
    .sc-body-box { display: grid; grid-template-columns: minmax(220px, 360px) 1fr; gap: 14px; align-items: center }
    @media (max-width: 700px) { .sc-body-box { grid-template-columns: 1fr } }
    .sc-body-box .sc-fig { max-width: 340px }
    .sc-body-msg { font-size: 1.4rem; font-weight: 900; text-align: center; min-height: 2em }
    .sc-sens-defi { margin-top: 10px; font-size: 1.1rem }
    .sc-sens .sc-tile { cursor: pointer; min-height: 96px; font-size: 1.1rem }
    .sc-sens .sc-tile small { font-size: .9rem }
    `);
  } catch (e) {
    /* hors navigateur */
  }

  const DEFIS: Record<string, string> = {
    vue: 'Regarde par la fenêtre : nomme 3 couleurs que tu vois. Tes <b>yeux</b> travaillent !',
    ouie: "Ferme les yeux 10 secondes, sans parler. Qu'est-ce que tu entends ? Tes <b>oreilles</b> travaillent !",
    odorat: 'Avec un adulte, sens une orange, puis du savon, les yeux fermés. Lequel est lequel ? Ton <b>nez</b> travaille !',
    gout: 'Avec un adulte, goûte un petit morceau de citron, puis de pomme. Lequel est acide ? Lequel est sucré ? Ta <b>langue</b> travaille !',
    toucher:
      'Touche ton chandail, puis une table, puis une feuille de papier. Doux, dur, lisse ? Le toucher passe par <b>toute la peau</b>, pas seulement par les mains !',
  };

  M.registerLearn({
    id: 'sc-l-corps',
    domain: 'sc-vivant',
    title: 'Mon corps, mes sens',
    icon: '🧍',
    short: 'Les parties du corps, les 5 sens et les saines habitudes',
    intro:
      "Ton corps est une machine extraordinaire ! Découvre ses parties, tes cinq sens et les habitudes qui t'aident à grandir en forme.",
    render(el) {
      el.innerHTML = `
        ${M.ui.section({
          icon: '🧍',
          title: '1. Les parties du corps',
          intro: 'Touche une partie du corps pour entendre son nom. Montre-la aussi sur ton propre corps !',
          body: `<div class="sc-body-box"><div class="sc-explore">${SC.svg.corps()}</div><div><div class="callout blue sc-body-msg">👆 Touche le dessin</div></div></div>`,
        })}
        ${M.ui.section({
          icon: '❤️',
          title: '2. À quoi ça sert ?',
          intro: "À l'intérieur et à l'extérieur, chaque partie a un travail. Touche une carte pour l'entendre.",
          body: M.ui.vocab(
            SC.FONCTIONS.map((f) => {
              const [e, ...w] = f.left.split(' ');
              return { emoji: e, word: w.join(' '), note: f.right, say: w.join(' ') + ' : ' + f.right };
            }),
          ),
        })}
        ${M.ui.section({
          icon: '👀',
          title: '3. Mes cinq sens',
          intro: 'Nos sens nous font connaître le monde. Touche un sens pour un petit défi.',
          body: `<div class="sc-tiles sc-sens">${SC.SENS.map((s) => `<button class="sc-tile" data-id="${s.id}"><span class="sc-big">${s.icon}</span>${SC.cap(s.sens)}<small>${SC.cap(s.organe)}</small></button>`).join('')}</div>
            <div class="callout sc-sens-defi">👆 Choisis un sens.</div>`,
        })}
        ${M.ui.section({
          icon: '💪',
          title: '4. Mes saines habitudes',
          intro: 'Dormir assez, bouger, bien manger et se laver les mains aident le corps à grandir et à rester en forme.',
          body: '<div class="sc-hab-quiz"></div>',
        })}`;
      const $ = <E extends Element = HTMLElement>(s: string): E => M.$<E>(s, el)!; // élément qu'on vient de rendre

      $('.sc-explore').onclick = (e) => {
        const z = M.closest(e, '[data-hot]');
        if (!z) return;
        const id = z.dataset.hot,
          p = SC.CORPS.find((x) => x.id === id);
        M.$$('.sc-explore [data-hot]', el).forEach((x) => x.classList.toggle('sc-hl', x.dataset.hot === id));
        M.sfx.tap();
        if (p) {
          $('.sc-body-msg').textContent = SC.cap(p.nom);
          M.say(p.nom);
        }
      };
      $('.sc-sens').onclick = (e) => {
        const b = M.closest(e, '.sc-tile');
        if (!b) return;
        const s = SC.must(
          SC.SENS.find((x) => x.id === b.dataset.id),
          'sens ' + b.dataset.id,
        );
        M.$$('.sc-sens .sc-tile', el).forEach((x) => x.classList.toggle('on', x === b));
        M.sfx.tap();
        $('.sc-sens-defi').innerHTML = `${s.icon} <b>${SC.cap(s.sens)}</b> (${s.organe}) : ${DEFIS[s.id]}`;
        M.say(SC.cap(s.sens) + '. ' + SC.plain(DEFIS[s.id]));
      };

      const DAY = [
        '😴 Se réveiller',
        '🥣 Déjeuner',
        "🎒 Aller à l'école",
        '🍽️ Souper',
        '🪥 Se brosser les dents avant de dormir',
        '🛏️ Se coucher',
      ];
      M.ui.miniQuiz($('.sc-hab-quiz'), [
        () => ({
          prompt: "Une journée en santé : touche les moments dans l'ordre, du matin au soir.",
          format: 'order',
          choices: M.shuffle(DAY.map((l, i) => ({ label: l, value: 'd' + i }))),
          answer: DAY.map((l, i) => 'd' + i),
          explain: DAY.join(' → ') + ". Et une bonne nuit d'environ 10 heures !",
        }),
        () => {
          const items = [
            ...M.shuffle(SC.HABITUDES.saine.slice())
              .slice(0, 3)
              .map((l) => ({ label: l, bin: 'oui' })),
            ...M.shuffle(SC.HABITUDES.pas.slice())
              .slice(0, 3)
              .map((l) => ({ label: l, bin: 'non' })),
          ];
          return {
            prompt: 'Est-ce bon pour mon corps ? Classe les habitudes.',
            format: 'sort',
            items,
            bins: [
              { id: 'oui', label: '💪 Bon pour mon corps' },
              { id: 'non', label: '⚠️ Pas bon pour mon corps' },
            ],
            explain: 'Bouger, bien dormir, bien manger et être propre : ce sont de <b>saines habitudes</b>.',
          };
        },
      ]);
    },
  });
})();
