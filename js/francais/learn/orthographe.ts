/* learn/orthographe.js — ✍️ Bien écrire un mot (fr-bien-ecrire) et 📝 Étudier ma liste (fr-ma-liste-etude) */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const gen = (id, lvl) => () => M.skillById[id].gen({ lvl });
  const ETUDE = [
    { icon: '👀', label: 'Je regarde', detail: 'Je regarde le mot lettre par lettre.' },
    { icon: '🗣️', label: 'Je le dis', detail: "Je dis le mot et je l'épelle." },
    { icon: '🙈', label: 'Je le cache', detail: 'Je cache le mot avec ma main.' },
    { icon: '✏️', label: "Je l'écris", detail: "Je l'écris de mémoire." },
    { icon: '✅', label: 'Je vérifie', detail: 'Je compare avec le modèle. Je corrige.' },
  ];

  M.registerLearn({
    id: 'fr-bien-ecrire',
    domain: 'fr-orthographe',
    title: 'Bien écrire un mot',
    icon: '✍️',
    short: "Regarde, dis, cache, écris, vérifie. Les lettres muettes, la majuscule et l'apostrophe.",
    intro: "Pour bien écrire un mot, on l'étudie avec une méthode. Et on connaît quelques trucs pour les lettres qu'on n'entend pas !",
    render(el) {
      const muets = FR.mots((m) => m.mu && m.why && m.w.endsWith(m.mu) && m.lo >= 1).slice(0, 8);
      const flash = M.shuffle(FR.mots((m) => m.lo >= 1 && m.em)).slice(0, 10);
      el.innerHTML =
        M.ui.section({
          icon: '🧠',
          title: 'Ma méthode pour étudier un mot',
          body: M.ui.demarche(ETUDE),
        }) +
        M.ui.section({
          icon: '🤫',
          title: 'Les lettres muettes',
          intro:
            "Certaines lettres ne s'entendent pas, souvent à la fin du mot. Pour les trouver, on pense au <b>féminin</b> ou à un mot de la même <b>famille</b>.",
          body:
            `<table class="fr-table">${muets.map((m) => `<tr><td style="font-size:1.3rem">${M.esc(m.w.slice(0, -m.mu.length))}<span class="fr-gr">${m.mu}</span></td><td>→ on l'entend dans <b>${M.esc(m.why)}</b></td><td>${M.ui.speak(m.w + ', ' + m.why)}</td></tr>`).join('')}</table>` +
            M.ui.callout(
              "Truc : « grand », c'est comme « gran<b>d</b>e » sans le <b>e</b>. Le <b>d</b> est là, même si on ne l'entend pas !",
            ),
        }) +
        M.ui.section({
          icon: '🅰️',
          title: 'Majuscule et apostrophe',
          intro: "Un <b>nom propre</b> (prénom, nom d'animal, ville) commence par une majuscule : <b>L</b>éa, <b>M</b>inou, <b>Q</b>uébec.",
          body:
            `<div class="row" style="font-size:1.2rem"><span class="chip">le + arbre → <b>l'arbre</b></span><span class="chip">la + école → <b>l'école</b></span><span class="chip">je + aime → <b>j'aime</b></span><span class="chip">ne + est → <b>n'est</b></span></div>` +
            M.ui.callout(
              'Devant une voyelle (ou un <b>h</b> muet), <b>le, la, je, ne</b> perdent leur voyelle : on met une <b>apostrophe</b>.',
              { tone: 'info' },
            ),
        }) +
        M.ui.section({
          icon: '🃏',
          title: 'Mes cartes-éclair',
          intro: "Regarde l'image, dis le mot dans ta tête, puis retourne la carte pour vérifier.",
          body: '<div class="fr-flash"></div>',
        }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      M.ui.flashcards(
        M.$('.fr-flash', el),
        flash.map((m) => ({
          front: `<span style="font-size:3rem">${m.em}</span>`,
          back: `<span style="font-size:2rem;font-weight:900">${M.esc(m.w)}</span>`,
          say: m.w,
        })),
      );
      M.ui.miniQuiz(M.$('.fr-mq', el), [gen('fr-bonne-orthographe', 1), gen('fr-lettres-muettes', 1), gen('fr-majuscule-apostrophe', 1)]);
    },
  });

  M.registerLearn({
    id: 'fr-ma-liste-etude',
    domain: 'fr-orthographe',
    title: 'Étudier ma liste',
    icon: '📝',
    short: 'Les mots de ta liste de la semaine : cartes-éclair et petite dictée.',
    intro: "Les mots que ton enseignante t'a donnés cette semaine. Regarde, dis, cache, écris, vérifie !",
    render(el) {
      const l = FR.listeActive && FR.listeActive();
      if (!l) {
        el.innerHTML =
          M.ui.callout(
            'Pas encore de liste ! Demande à un adulte d\'ajouter ta liste de mots sur la page <a href="#/parents">Parents</a>.',
            { tone: 'info' },
          ) + M.ui.section({ icon: '🧠', title: 'Ma méthode pour étudier un mot', body: M.ui.demarche(ETUDE) });
        return;
      }
      const label = (o) => (o.det ? (o.det === "l'" ? "l'" : o.det + ' ') : '') + o.t;
      el.innerHTML =
        M.ui.section({
          icon: '🃏',
          title: `${M.esc(l.titre)} — ${l.mots.length} mots`,
          intro: 'Touche 🔊 pour entendre le mot. Dis-le dans ta tête, puis retourne la carte.',
          body: '<div class="fr-flash"></div>',
        }) +
        M.ui.section({
          icon: '🧠',
          title: 'Regarde, dis, cache, écris, vérifie',
          body: M.ui.demarche(ETUDE) + '<div class="fr-mq"></div>',
        });
      M.ui.flashcards(
        M.$('.fr-flash', el),
        l.mots.map((o) => {
          const k = FR.mot(o.t);
          const ph = o.phrase || (k && k.phrase) || '';
          return {
            front: `<span style="font-size:3rem">${k && k.em ? k.em : '🔊'}</span><br><small>Écoute !</small>`,
            back: `<span style="font-size:1.8rem;font-weight:900">${M.esc(label(o))}</span>${ph ? `<br><small>${M.esc(ph)}</small>` : ''}`,
            say: o.t,
          };
        }),
      );
      const pick = M.shuffle(l.mots).slice(0, 5);
      M.ui.miniQuiz(
        M.$('.fr-mq', el),
        pick.map((o) => () => {
          const k = FR.mot(o.t);
          return FR.dictee(o.t, { phrase: o.phrase || (k && k.phrase) || null, caseSensitive: o.nomPropre ? 'first' : undefined });
        }),
        { title: "Petite dictée (pour s'exercer)" },
      );
    },
  });
})();
