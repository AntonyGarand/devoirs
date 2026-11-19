/* Univers social — page Apprendre « Le Québec et ses fêtes » (us-quebec) :
   fêtes par saison, fêtes de plusieurs traditions (R8), emblèmes (enrichissement), vivre les saisons. */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const ui = M.ui;
  M.art.register('us-tuque', () => '<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><circle cx="50" cy="16" r="12" fill="#fff" stroke="#c7c2b4" stroke-width="2"/><path d="M18 72 C18 34 82 34 82 72 Z" fill="#ef476f"/><path d="M30 46 h40 M24 58 h52" stroke="#fff" stroke-width="5"/><rect x="14" y="70" width="72" height="16" rx="6" fill="#118ab2"/></svg>', '🧢');
  const tile = (f) => `<div class="us-tile" data-say="${M.esc(`${f.nom}. ${f.geste} ${f.pourquoi}`)}"><span class="em">${f.emoji}</span><b>${U.cap(f.court)}</b><small>${f.geste}</small></div>`;

  M.registerLearn({
    id: 'us-quebec', domain: 'us-quebec', title: 'Le Québec et ses fêtes', icon: '⚜️',
    short: 'Fêtes et traditions, fêtes de partout, emblèmes du Québec, saisons',
    intro: 'Au Québec, on fête beaucoup de choses pendant l\'année ! Découvre ce qu\'on fait pendant les fêtes et pourquoi.',
    parentNote: 'Les fêtes religieuses sont présentées comme des faits culturels (« certaines familles… »). Les emblèmes sont un enrichissement 🌟 (au-delà du 1er cycle); faits vérifiés sur quebec.ca.',
    render(el) {
      const F = U.d('fetes'), E = U.d('emblemes');
      const SAISONS = [['hiver', '❄️ Hiver'], ['printemps', '🌷 Printemps'], ['été', '☀️ Été'], ['automne', '🍁 Automne'], [null, '🎂 Toute l\'année']];
      el.innerHTML = [
        ui.section({ icon: '🎉', title: '1. Les fêtes de l\'année', intro: 'Choisis une saison, puis touche une fête pour l\'entendre.',
          body: '<div class="us-tabs"></div>' + ui.callout('Pour savoir <b>quand</b> tombent les fêtes (le mois, la date), va voir la page de mathématique <a href="#/apprendre/calendrier">📅 Le calendrier</a>.', { tone: 'info' }) }),
        ui.section({ icon: '🏮', title: '2. Des fêtes de partout, ici', intro: 'Au Québec, des familles viennent de partout et ont des traditions différentes. Voici quelques fêtes que <b>certaines familles</b> célèbrent.',
          body: `<div class="us-tiles">${F.filter((f) => ['noel', 'hanoucca', 'aid-el-fitr', 'diwali', 'nouvel-an-lunaire', 'paques'].includes(f.id)).map(tile).join('')}</div>` +
            ui.callout('Chaque famille peut fêter à sa façon, ou ne pas fêter certaines fêtes. Toutes les traditions méritent le respect.') }),
        ui.section({ icon: '⚜️', title: '3. Les emblèmes du Québec 🌟', intro: 'Défi bonus ! Retourne chaque carte pour découvrir un symbole du Québec.', body: '<div class="us-emb"></div>' }),
        ui.section({ icon: '🧣', title: '4. Vivre les saisons au Québec', intro: 'Au Québec, les saisons sont très différentes. On s\'habille et on s\'amuse selon la saison.',
          body: ui.vocab([
            { emoji: M.art.html('us-tuque', { size: 52, alt: 'tuque' }), word: 'tuque', note: 'hiver', say: 'une tuque, pour l\'hiver' }, { emoji: '🧤', word: 'mitaines', note: 'hiver' },
            { emoji: '⛸️', word: 'patin', note: 'hiver' }, { emoji: '🍯', word: 'cabane à sucre', note: 'printemps' },
            { emoji: '🏊', word: 'baignade', note: 'été' }, { emoji: '🍎', word: 'cueillette de pommes', note: 'automne' },
          ]) }),
        ui.section({ icon: '✅', title: '5. Vérifie ta compréhension', body: '<div class="us-mq"></div>' }),
      ].join('');
      ui.tabs(M.$('.us-tabs', el), SAISONS.map(([s, label]) => ({ id: s || 'annee', label, render(panel) { panel.innerHTML = `<div class="us-tiles">${F.filter((f) => f.saison === s && !['hanoucca', 'aid-el-fitr', 'diwali', 'nouvel-an-lunaire'].includes(f.id)).map(tile).join('')}</div>`; } })));
      ui.flashcards(M.$('.us-emb', el), E.list.map((e) => ({
        front: e.art ? M.art.html(e.art, { size: 110, alt: e.nom }) : e.html ? e.html() : `<span style="font-size:3rem">${e.emoji}</span><br>La devise du Québec`,
        back: e.fait, say: M.text(e.fait),
      })));
      ui.miniQuiz(M.$('.us-mq', el), [() => M.skillById['us-fetes'].gen({ lvl: 0 }), () => M.skillById['us-fetes'].gen({ lvl: 1 }), () => M.skillById['us-emblemes'].gen({ lvl: 0 })]);
    },
  });
})();
