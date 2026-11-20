/* =====================================================================
   sciences/learn/cycles.js — page Apprendre « Ça grandit ! » (habileté 4, enrichissement)
   Onglets Haricot · Grenouille · Monarque · Poule : cycle touchable + « ▶ Voir le cycle ».
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC) return;

  try {
    M.css(`
    .sc-cyc-txt { min-height: 96px; font-size: 1.1rem }
    .sc-cyc-list { margin: 6px 0 0; padding-left: 20px }
    .sc-cyc-list li { margin: 4px 0 }
    .sc-cyc-side { display: flex; flex-direction: column; gap: 10px }
    .sc-cyc { padding: 4px 34px 30px }
    .sc-cyc .cycle { overflow: visible }
    `);
  } catch (e) {
    /* hors navigateur */
  }

  const ORDER = ['haricot', 'grenouille', 'monarque', 'poule'];

  M.registerLearn({
    id: 'sc-l-cycles',
    domain: 'sc-vivant',
    title: 'Ça grandit !',
    icon: '🔄',
    // Enrichissement (au-delà du programme de 2e année).
    short: 'Le cycle de vie du haricot, de la grenouille, du monarque et de la poule',
    intro:
      "Les êtres vivants naissent, grandissent, deviennent adultes et ont des petits… puis ça recommence ! C'est un <b>cycle de vie</b>. Touche chaque étape pour la découvrir.",
    render(el) {
      let tok = 0; // arrête l'animation (changement d'onglet, sortie de page)
      M.onCleanup(() => {
        tok++;
      });
      el.innerHTML = `
        ${M.ui.section({ icon: '🔄', title: '1. Quatre cycles de vie', intro: "Choisis un être vivant, puis touche une étape du cercle. La flèche montre l'étape suivante.", body: '<div class="sc-cyc-tabs"></div>' })}
        ${M.ui.section({ icon: '🦋', title: '2. Chrysalide ou cocon ?', body: SC.castor("La chenille du monarque se transforme dans une <b>chrysalide</b> verte avec des points dorés. Le <b>cocon</b>, fait de fils de soie, c'est pour les papillons de nuit. On dit donc : la chrysalide du monarque !") })}
        ${M.ui.section({ icon: '✅', title: '3. Vérifie ta compréhension', body: '<div class="sc-cyc-quiz"></div>' })}`;

      M.ui.tabs(
        M.$('.sc-cyc-tabs', el)!,
        ORDER.map((k) => ({
          id: k,
          label: `${SC.CYCLES[k].icon} ${SC.cap(SC.CYCLES[k].titre.replace(/^(Le|La) /, ''))}`,
          render(panel) {
            tok++;
            const C = SC.CYCLES[k];
            panel.innerHTML = `<div class="sc-cycle-box"><div class="sc-cyc"></div>
            <div class="sc-cyc-side"><div class="callout blue sc-cyc-txt">👆 Touche une étape du cercle.</div>
            <div class="row"><button class="btn primary big sc-play">▶ Voir le cycle</button></div></div></div>`;
            SC.mountCycle(M.$('.sc-cyc', panel)!, C.stades);
            const txt = M.$('.sc-cyc-txt', panel)!;
            const show = (i: number, speak = true): void => {
              M.$$('.cyc-st', panel).forEach((g) => g.classList.toggle('sc-on', g.dataset.hot === 'c' + i));
              const st = C.stades[i];
              txt.innerHTML = `<b>${i + 1}. ${st.label}</b><br>${st.texte}`;
              if (speak) M.say(st.label + '. ' + SC.plain(st.texte));
            };
            panel.onclick = async (e) => {
              const g = M.closest(e, '[data-hot]');
              if (g) {
                tok++;
                M.sfx.tap();
                show(Number(String(g.dataset.hot).slice(1)));
                return;
              }
              if (M.closest(e, '.sc-play')) {
                const my = ++tok;
                if (SC.reduced()) {
                  txt.innerHTML = `<ol class="sc-cyc-list">${C.stades.map((s) => `<li><b>${s.label}</b> : ${s.texte}</li>`).join('')}</ol><div>… et le cycle recommence !</div>`;
                  return;
                }
                for (let i = 0; i < C.stades.length; i++) {
                  if (my !== tok || !panel.isConnected) return;
                  show(i, false);
                  await M.sleep(1200);
                }
                if (my === tok && panel.isConnected) {
                  M.$$('.cyc-st', panel).forEach((x) => x.classList.remove('sc-on'));
                  txt.innerHTML += '<div>🔁 … et le cycle recommence !</div>';
                }
              }
            };
          },
        })),
      );

      const P = SC.CYCLES.poule.stades;
      M.ui.miniQuiz(M.$('.sc-cyc-quiz', el)!, [
        () => ({
          prompt: "Le cycle de la poule : l'œuf est placé. Touche les autres étapes dans l'ordre.",
          format: 'order',
          fixed: [0],
          choices: M.shuffle(P.map((s) => ({ label: `${SC.stagePic(s, 26)} ${s.label}`, value: s.id }))),
          answer: P.map((s) => s.id),
          explain: P.map((s) => s.label).join(' → ') + ', puis la poule pond un œuf… et ça recommence !',
        }),
        () => ({
          prompt: 'Dans quoi la chenille du monarque se transforme-t-elle ?',
          format: 'choice',
          answer: 'chrysalide',
          choices: M.shuffle([
            { label: '💚 Une chrysalide', value: 'chrysalide' },
            { label: '🧶 Un cocon', value: 'cocon', why: "Le cocon, c'est pour les papillons de nuit." },
            { label: '🥚 Un œuf', value: 'oeuf', why: "L'œuf, c'est le tout début du cycle." },
          ]),
          explain: 'La chenille se transforme dans une <b>chrysalide</b>, puis le papillon en sort.',
        }),
        () => ({
          prompt: "Vrai ou faux ? « Le têtard vit dans l'eau et respire avec des branchies, comme un poisson. »",
          format: 'tf',
          answer: true,
          explain: "Vrai ! Le têtard respire avec des <b>branchies</b>. Devenue adulte, la grenouille respire de l'air.",
        }),
      ]);
    },
  });
})();
