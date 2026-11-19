/* Univers social — page Apprendre « Avant et maintenant » (us-temps) :
   ligne du temps de Félix, âges de la vie, texte « Chez grand-papa », paires avant/maintenant,
   « Ma ligne du temps » avec un adulte (rien n'est enregistré). */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const ui = M.ui;
  const MES = [
    { id: 'nais', emoji: '👶', label: 'naissance' }, { id: 'pas', emoji: '🚶', label: 'premiers pas' }, { id: 'mot', emoji: '💬', label: 'premiers mots' },
    { id: 'garderie', emoji: '🧸', label: 'garderie' }, { id: 'mat', emoji: '🎒', label: 'maternelle' }, { id: 'a1', emoji: '📚', label: '1re année' },
    { id: 'a2', emoji: '✏️', label: '2e année' }, { id: 'velo', emoji: '🚲', label: 'vélo' }, { id: 'nage', emoji: '🏊', label: 'nager' },
  ];

  M.registerLearn({
    id: 'us-temps', domain: 'us-temps', title: 'Avant et maintenant', icon: '⏳',
    short: 'Ligne du temps, âges de la vie, la vie d\'il y a 100 ans',
    intro: 'Le temps passe et les choses changent ! On peut placer les moments d\'une vie sur une ligne du temps, et comparer la vie d\'avant avec celle d\'aujourd\'hui.',
    parentNote: 'L\'activité « Ma ligne du temps » se fait avec un adulte; rien n\'est enregistré, et l\'enfant choisit ce qu\'il veut y mettre.',
    render(el) {
      const T = U.d('lignes-temps'), A = U.d('autrefois');
      const felix = T.personnages[0];
      const DOM = [['maison', '🏠 Maison'], ['école', '🏫 École'], ['transport', '🚗 Transport'], ['communication', '✉️ Communication'], ['loisir', '🎲 Loisirs']];
      el.innerHTML = [
        ui.section({ icon: '📏', title: '1. La vie de Félix', intro: 'Une ligne du temps se lit de <b>gauche</b> (le plus ancien) à <b>droite</b> (le plus récent). Touche une image pour savoir ce qui s\'est passé.',
          body: `<div class="us-felix">${U.timelineHtml(felix)}</div><div class="us-plan-info us-felix-info">👆 Touche une image sur la ligne.</div>` }),
        ui.section({ icon: '👶', title: '2. Les âges de la vie', intro: 'Depuis la naissance, on passe par plusieurs âges.',
          body: ui.vocab(T.ages.map((a) => ({ emoji: a.emoji, word: U.cap(a.nom), note: a.activite }))) }),
        ui.section({ icon: '👴', title: '3. Chez grand-papa, il y a longtemps', intro: 'Il y a environ 100 ans, les arrière-grands-parents étaient des enfants. Écoute cette histoire.', body: '<div class="us-read"></div>' }),
        ui.section({ icon: '🕰️', title: '4. Avant et maintenant', intro: 'Choisis un thème pour comparer.', body: '<div class="us-tabs"></div>' }),
        ui.section({ icon: '✍️', title: '5. Ma ligne du temps (avec un adulte)', intro: 'Avec un adulte, place des moments de ta vie. Tu choisis ce que tu veux mettre. Rien n\'est enregistré : quand tu quittes la page, tout s\'efface.',
          body: `<div class="us-my-ctl"></div><div class="us-mytl">${MES.map((m) => `<button class="chip-btn us-me" data-id="${m.id}">${m.emoji} ${m.label}</button>`).join('')}</div><div class="us-mytl-out" style="margin-top:10px"></div><div class="row-center"><button class="btn us-my-clear">↺ Effacer</button></div>` }),
        ui.section({ icon: '✅', title: '6. Vérifie ta compréhension', body: '<div class="us-mq"></div>' }),
      ].join('');
      M.$('.us-felix', el).onclick = (e) => {
        const g = e.target.closest('.tl-ev'); if (!g) return;
        const ev = felix.evenements.find((x) => x.id === g.dataset.hot);
        const txt = `${ev.annee} : ${ev.emoji} ${ev.label}`;
        M.$('.us-felix-info', el).textContent = txt; M.say(`En ${ev.annee}, ${ev.label}.`);
      };
      ui.reading(M.$('.us-read', el), { title: 'Chez grand-papa', text: 'Quand grand-papa Émile était petit, il n\'y avait pas de télévision dans sa maison. Le soir, la famille écoutait la radio près du poêle à bois. Pour garder le lait au froid, on mettait un gros bloc de glace dans la glacière. L\'hiver, Émile marchait jusqu\'à l\'école de rang. Dans sa classe, il y avait des élèves de tous les âges avec une seule enseignante. Il écrivait sur une ardoise avec une craie. Aujourd\'hui, Émile aime raconter ses souvenirs à ses arrière-petits-enfants.' });
      ui.tabs(M.$('.us-tabs', el), DOM.map(([d, label]) => ({ id: d, label, render(panel) {
        const ps = A.paires.filter((p) => p.domaine === d);
        panel.innerHTML = '<div class="us-cmp">' + ui.compare({ left: { title: '🕰️ Autrefois', items: ps.map((p) => ({ emoji: U.pic(p.avant, 40), label: p.avant.nom })) }, right: { title: '📱 Aujourd\'hui', items: ps.map((p) => ({ emoji: U.pic(p.maintenant, 40), label: p.maintenant.nom })) } }) + '</div>';
      } })));
      // Ma ligne du temps : en mémoire seulement
      let age = 0;
      const mine = [];
      const ctl = ui.stepper(M.$('.us-my-ctl', el), { label: 'À quel âge ? ', value: 0, min: 0, max: 8, onChange: (v) => { age = v; } });
      const draw = () => {
        M.$('.us-mytl-out', el).innerHTML = `<div class="plan-title" style="text-align:center">Ma vie</div><div class="us-swipe">👉 Glisse la ligne du temps pour tout voir 👈</div><div class="us-tl">${M.viz.timeline({ from: 0, to: 8, title: '', events: mine, tickLabel: (v) => `${v} an${v > 1 ? 's' : ''}` })}</div>`;
      };
      M.$$('.us-me', el).forEach((b) => (b.onclick = () => {
        const m = MES.find((x) => x.id === b.dataset.id);
        const i = mine.findIndex((x) => x.id === m.id);
        if (i >= 0) mine.splice(i, 1);
        mine.push({ at: m.id === 'nais' ? 0 : age, emoji: m.emoji, label: m.label, id: m.id });
        M.sfx.pop(); draw();
      }));
      M.$('.us-my-clear', el).onclick = () => { mine.length = 0; ctl.set(0, true); age = 0; draw(); };
      draw();
      ui.miniQuiz(M.$('.us-mq', el), [() => M.skillById['us-ligne-temps'].gen({ lvl: 0 }), () => M.skillById['us-ligne-temps'].gen({ lvl: 1 }), () => M.skillById['us-avant-maintenant'].gen({ lvl: 0 })]);
    },
  });
})();
