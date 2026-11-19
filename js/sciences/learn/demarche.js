/* =====================================================================
   sciences/learn/demarche.js — « Comme une scientifique » (habiletés 16 et 13)
   1. Les étapes de la démarche.  2. Le labo des aimants (prédire → essayer → carnet).
   3. Deux aimants : retourner un aimant → attirent / repoussent.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC) return;

  const LAB = ['trombone', 'clou', 'canette', 'crayon', 'conserve', 'bille', 'epingle', 'regle'];

  M.registerLearn({
    id: 'sc-l-demarche', domain: 'sc-demarche', title: 'Comme une scientifique', icon: '🔎',
    short: 'Se questionner, prédire, observer… avec des aimants !',
    intro: 'Les scientifiques ne devinent pas au hasard : ils se posent une question, font une prédiction, puis vérifient avec une expérience. À ton tour, avec des aimants !',
    render(el) {
      el.innerHTML = M.ui.section({ icon: '🔎', title: '1. Les étapes', intro: 'Voici comment travaille une scientifique :', body: M.ui.demarche(SC.STEPS)
          + SC.castor('Se tromper dans une prédiction, ce n\'est pas grave du tout ! Une surprise, c\'est une occasion d\'apprendre quelque chose de nouveau.') })
        + M.ui.section({ icon: '🧲', title: '2. Le labo des aimants', intro: '❓ <b>Ma question</b> : « Quels objets l\'aimant attire-t-il ? » Pour chaque objet, 🤔 <b>prédis</b> (✔ attiré ou ✖ pas attiré), puis 👀 <b>essaie</b>. Le 📝 carnet note tout.',
          body: `<div class="sc-sim"><div><div class="sc-dm-stage"></div></div><div class="sc-lab-items sc-dm-lab"></div></div>
            <h3>📝 Mon carnet</h3><table class="sc-log"><thead><tr><th>Objet</th><th>🤔 Ma prédiction</th><th>👀 Résultat</th></tr></thead><tbody class="sc-dm-log"></tbody></table>
            <div class="sc-msg sc-dm-concl"></div>
            ${M.ui.callout('Les petits aimants ne vont <b>jamais dans la bouche</b>.', { tone: 'warn', who: '⚠️' })}` })
        + M.ui.section({ icon: '🤝', title: '3. Deux aimants', intro: 'Chaque aimant a deux côtés : <b>N</b> (rouge) et <b>S</b> (bleu). Retourne l\'aimant de droite et regarde ce qui arrive.',
          body: `<div class="sc-dm-poles"></div><div class="row"><button class="btn primary sc-dm-flip">🔄 Retourner l'aimant de droite</button></div>
            ${SC.castor('Deux côtés <b>différents</b> (N et S) s\'attirent. Deux côtés <b>pareils</b> (N et N, ou S et S) se repoussent.')}` })
        + M.ui.section({ icon: '✅', title: '4. Vérifie ta compréhension', body: '<div class="sc-dm-quiz"></div>' });
      const $ = (s) => M.$(s, el);

      /* 2. labo */
      const pred = {}, res = {};
      let busy = false;
      const draw = () => {
        $('.sc-dm-lab').innerHTML = LAB.map((id) => {
          const o = SC.objet(id), p = pred[id], r = res[id];
          return `<div class="sc-lab-item ${r ? (o.magnet ? 'yes' : 'no') : ''}" data-id="${id}"><span class="sc-big">${SC.pic(o, 44)}</span>${SC.cap(o.nom)}
            ${r ? `<div>${o.magnet ? '🧲 Attiré' : '😶 Pas attiré'}</div>` : `<div class="row"><button class="btn ${p === true ? 'on' : ''}" data-p="1" aria-label="Attiré">✔</button><button class="btn ${p === false ? 'on' : ''}" data-p="0" aria-label="Pas attiré">✖</button>${p != null ? '<button class="btn blue" data-go="1">🧲 Essayer</button>' : ''}</div>`}</div>`;
        }).join('');
        const done = LAB.filter((id) => res[id]);
        $('.sc-dm-log').innerHTML = done.map((id) => { const o = SC.objet(id); return `<tr><td>${SC.cap(o.nom)}</td><td>${pred[id] ? '✔ attiré' : '✖ pas attiré'}</td><td>${o.magnet ? '🧲 attiré' : '😶 pas attiré'} ${pred[id] === o.magnet ? '👀' : '😮'}</td></tr>`; }).join('') || '<tr><td colspan="3" class="muted">Pas encore d\'essai.</td></tr>';
        const surprises = done.filter((id) => pred[id] !== SC.objet(id).magnet).length;
        $('.sc-dm-concl').innerHTML = done.length === LAB.length
          ? `💬 <b>Je conclus</b> : l'aimant attire les objets en <b>fer</b> ou en <b>acier</b>. La canette est en aluminium : c'est un métal, mais elle n'est pas attirée ! Tu as eu ${surprises} ${M.plural(surprises, 'surprise')} : c'est comme ça qu'on apprend. 🌱`
          : done.length ? `Essais : ${done.length} / ${LAB.length}` : '';
      };
      $('.sc-dm-stage').innerHTML = '<div class="sc-stage"><svg viewBox="0 0 300 220" class="sc-fig" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="220" rx="16" fill="#f6f1ff"/>' + SC.svg.aimantU(150, 90) + '<text x="150" y="170" text-anchor="middle" font-size="16" font-weight="800">Choisis un objet 👉</text></svg></div>';
      $('.sc-dm-lab').onclick = async (e) => {
        const it = e.target.closest('.sc-lab-item');
        if (!it || busy) return;
        const id = it.dataset.id;
        const pb = e.target.closest('[data-p]');
        if (pb) { pred[id] = pb.dataset.p === '1'; M.sfx.tap(); draw(); return; }
        if (e.target.closest('[data-go]')) {
          busy = true;
          try { await SC.sim.aimant($('.sc-dm-stage'), SC.objet(id)); } finally { busy = false; }
          if (!el.isConnected) return;
          res[id] = true; draw();
        }
      };
      draw();

      /* 3. deux aimants */
      let flip = false;
      const poles = () => SC.sim.poles($('.sc-dm-poles'), { a: 'S', b: flip ? 'S' : 'N' });
      $('.sc-dm-flip').onclick = () => { flip = !flip; M.sfx.tap(); poles(); };
      poles();

      M.ui.miniQuiz($('.sc-dm-quiz'), [
        () => M.skillById['sc-demarche'].gen({ lvl: 0 }),
        () => M.skillById['sc-aimants'].gen({ lvl: 0 }),
        () => M.skillById['sc-demarche'].gen({ lvl: 2 }),
      ]);
    },
  });
})();
