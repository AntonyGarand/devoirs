/* learn/grammaire.js — 🏷️ Les sortes de mots (fr-sortes-de-mots) et 🔗 Masculin, féminin, singulier, pluriel (fr-accords) */
(function () {
  'use strict';
  const M = window.M;
  const gen = (id: string, lvl: number) => () => M.skillById[id].gen({ lvl });
  try {
    M.css(`
    .fr-gn { display: flex; gap: 10px; justify-content: center; align-items: flex-end; flex-wrap: wrap; font-size: 2rem; font-weight: 900; margin: 10px 0 }
    .fr-gn .add { color: var(--subj-francais); background: #ffe1e8; border-radius: 8px; padding: 0 3px; animation: fr-pop .4s ease-out }
    .fr-gn-pic { font-size: 2.6rem; text-align: center; min-height: 3.2rem }
    @keyframes fr-pop { from { transform: scale(1.6) } to { transform: scale(1) } }
    @media (prefers-reduced-motion: reduce) { .fr-gn .add { animation: none } }
    `);
  } catch (e) {}

  const T = (arr: [string, string][]) => M.ui.tagged(arr.map(([w, tag]) => ({ w, tag })));
  M.registerLearn({
    id: 'fr-sortes-de-mots',
    domain: 'fr-grammaire',
    title: 'Les sortes de mots',
    icon: '🏷️',
    short: 'Nom, déterminant, adjectif, verbe : les trucs pour les reconnaître.',
    intro:
      "Les mots sont comme une équipe : chacun a son rôle. Pour savoir quelle sorte de mot c'est, on fait un petit <b>test</b> avec un truc.",
    render(el) {
      el.innerHTML =
        M.ui.section({ icon: '🏷️', title: 'Choisis une sorte de mot', body: '<div class="fr-cls-tabs"></div>' }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      M.ui.tabs(M.$('.fr-cls-tabs', el)!, [
        {
          id: 'nom',
          label: '🔵 Nom',
          render: (p) => {
            p.innerHTML = `<p>Le <b>nom</b> désigne une personne, un animal, une chose ou une idée : <i>Léa, chat, ballon, joie</i>.</p>${T(
              [
                ['Le', 'det'],
                ['chat', 'nom'],
                ['mange', 'verbe'],
                ['une', 'det'],
                ['souris', 'nom'],
              ],
            )}${M.ui.callout('Truc : je peux mettre <b>un</b> ou <b>une</b> devant. « un chat » ✔️, « une souris » ✔️, « un mange » ✖️.')}`;
          },
        },
        {
          id: 'det',
          label: '🟣 Déterminant',
          render: (p) => {
            p.innerHTML = `<p>Le <b>déterminant</b> est le petit mot qui va <b>devant le nom</b> : <i>le, la, les, un, une, des, mon, ma, mes, ce, cette…</i></p>${T(
              [
                ['Ma', 'det'],
                ['sœur', 'nom'],
                ['lit', 'verbe'],
                ['un', 'det'],
                ['livre', 'nom'],
              ],
            )}${M.ui.callout('Truc : le déterminant change selon le nom : <b>le</b> chat, <b>la</b> chatte, <b>les</b> chats.')}`;
          },
        },
        {
          id: 'adj',
          label: '🟢 Adjectif',
          render: (p) => {
            p.innerHTML = `<p>L'<b>adjectif</b> dit comment est le nom : <i>petit, grand, rouge, joli…</i></p>${T([
              ['Le', 'det'],
              ['petit', 'adj'],
              ['chien', 'nom'],
              ['noir', 'adj'],
              ['jappe', 'verbe'],
            ])}${M.ui.callout('Truc : je peux mettre <b>très</b> devant. « très petit » ✔️, « très noir » ✔️, « très chien » ✖️.')}`;
          },
        },
        {
          id: 'verbe',
          label: '🔴 Verbe',
          render: (p) => {
            p.innerHTML = `<p>Le <b>verbe</b> dit souvent ce qu'on fait : <i>court, mange, dort, chante…</i></p>${T([
              ['Le', 'det'],
              ['bébé', 'nom'],
              ['dort', 'verbe'],
              ['.', ''],
            ])}${M.ui.callout("Truc : je peux l'encadrer par <b>ne… pas</b>. « Le bébé <b>ne</b> dort <b>pas</b>. » ✔️")}`;
          },
        },
      ]);
      M.ui.miniQuiz(M.$('.fr-mq', el)!, [gen('fr-classes-mots', 0), gen('fr-classes-mots', 1), gen('fr-classes-mots', 2)]);
    },
  });

  M.registerLearn({
    id: 'fr-accords',
    domain: 'fr-grammaire',
    title: 'Masculin, féminin, singulier, pluriel',
    icon: '🔗',
    short: 'Un ou une ? Un ou plusieurs ? Le nom donne ses marques.',
    intro:
      "Un nom a un <b>genre</b> (masculin ou féminin) et un <b>nombre</b> (singulier ou pluriel). Il les donne aux mots qui l'accompagnent.",
    render(el) {
      el.innerHTML =
        M.ui.section({
          icon: '👦',
          title: 'Le genre : un ou une ?',
          intro: 'On dit <b>un</b> devant un nom masculin et <b>une</b> devant un nom féminin.',
          body: M.ui.vocab([
            { emoji: '🐱', word: 'un chat' },
            { emoji: '🏠', word: 'une maison' },
            { emoji: '🚲', word: 'un vélo' },
            { emoji: '🌸', word: 'une fleur' },
            { emoji: '⛵', word: 'un bateau' },
            { emoji: '🥕', word: 'une carotte' },
          ]),
        }) +
        M.ui.section({
          icon: '🔢',
          title: 'Le nombre : un ou plusieurs ?',
          intro: "Touche le bouton pour passer d'un seul à plusieurs. Regarde les lettres qui s'ajoutent : on ne les entend pas !",
          body: '<div class="fr-nb"></div>',
        }) +
        M.ui.section({
          icon: '🔗',
          title: 'Le nom donne ses marques',
          intro: "Le nom est le chef du groupe : il donne son genre et son nombre au déterminant et à l'adjectif.",
          body:
            M.ui.tagged(
              [
                { w: 'les', tag: 'det' },
                { w: 'petites', tag: 'adj' },
                { w: 'souris', tag: 'nom' },
              ],
              {
                arrows: [
                  [2, 0],
                  [2, 1],
                ],
              },
            ) +
            M.ui.callout(
              '<b>souris</b> est féminin pluriel → <b>les petites souris</b> : un <b>e</b> pour le féminin, un <b>s</b> pour le pluriel.',
            ) +
            M.ui.callout(
              'Au pluriel, on ajoute souvent un <b>s</b>. Mais : un chap<b>eau</b> → des chapeau<b>x</b>, un chev<b>al</b> → des chev<b>aux</b>.',
              { tone: 'info' },
            ),
        }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      const EX: { em: string; s: [string, string][]; p: [string, string][] }[] = [
        {
          em: '🐱',
          s: [
            ['le', ''],
            ['petit', ''],
            ['chat', ''],
          ],
          p: [
            ['le', 's'],
            ['petit', 's'],
            ['chat', 's'],
          ],
        },
        {
          em: '🌸',
          s: [
            ['la', ''],
            ['jolie', ''],
            ['fleur', ''],
          ],
          p: [
            ['', 'les'],
            ['jolie', 's'],
            ['fleur', 's'],
          ],
        },
        {
          em: '🐴',
          s: [
            ['le', ''],
            ['grand', ''],
            ['cheval', ''],
          ],
          p: [
            ['le', 's'],
            ['grand', 's'],
            ['chev', 'aux'],
          ],
        },
      ];
      let k = 0,
        many = false;
      const box = M.$('.fr-nb', el)!;
      const draw = () => {
        const ex = EX[k];
        const parts = many ? ex.p : ex.s;
        box.innerHTML = `<div class="fr-gn-pic">${many ? ex.em.repeat(3) : ex.em}</div><div class="fr-gn">${parts.map(([a, b]) => `<span>${M.esc(a)}${b ? `<span class="add">${b}</span>` : ''}</span>`).join('')}</div>
          <div class="row-center"><button class="btn primary fr-nb-t">${many ? '1️⃣ Un seul' : '🔢 Plusieurs'}</button><button class="btn fr-nb-n">Autre exemple ➜</button></div>`;
        M.$('.fr-nb-t', box)!.onclick = () => {
          many = !many;
          M.sfx.pop();
          draw();
          M.say(parts.length && (many ? ex.p : ex.s).map(([a, b]) => a + b).join(' '));
        };
        M.$('.fr-nb-n', box)!.onclick = () => {
          k = (k + 1) % EX.length;
          many = false;
          draw();
        };
      };
      draw();
      M.ui.miniQuiz(M.$('.fr-mq', el)!, [gen('fr-genre-nombre', 0), gen('fr-accords-gn', 1), gen('fr-accords-gn', 2)]);
    },
  });
})();
