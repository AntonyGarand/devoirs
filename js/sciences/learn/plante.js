/* =====================================================================
   sciences/learn/plante.js — « Le jardin de Castor » (habiletés 2 et 3)
   1. Simulation de croissance (déterministe) : eau × lumière, semaine par semaine, carnet.
   2. Les parties de la plante (toucher = nom + rôle).
   3. Vérifie ta compréhension.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC) return;

  const EAU = [{ value: 0, icon: '🚫', label: 'Rien' }, { value: 1, icon: '💧', label: 'Un peu' }, { value: 2, icon: '💧💧', label: 'Juste assez' }, { value: 3, icon: '🌊', label: 'Trop' }];
  const LUM = [{ value: 0, icon: '🌑', label: 'Placard noir' }, { value: 1, icon: '⛅', label: 'Ombre' }, { value: 2, icon: '☀️', label: 'Fenêtre' }];

  /** Règle fixe (HLD § 4) → { size 0–4, color, flower, wilt, msg, emo } */
  function stateAt(eau, lum, w) {
    if (w === 0) return { size: 0, color: 'vert', msg: 'On vient de planter une petite pousse. Choisis l\'eau et la lumière, puis avance d\'une semaine !', emo: '🌱' };
    if (eau === 0) return w >= 2 ? { size: 0.5, color: 'fane', wilt: true, msg: 'Sans eau, la plante <b>se fane</b> : ses racines n\'ont rien à boire.', emo: '🥀' } : { size: 0.5, color: 'vert', msg: 'La terre devient sèche…', emo: '🌱' };
    if (lum === 0) return { size: Math.min(4, w), color: 'pale', tall: true, msg: 'Dans le noir, la tige s\'allonge pour chercher la lumière, mais la plante est <b>pâle et faible</b>. Pas de fleur.', emo: '🌿' };
    if (eau === 3) return w >= 3 ? { size: w * 0.5, color: 'jaune', msg: '<b>Trop d\'eau</b> : les racines manquent d\'air. Les feuilles deviennent jaunes.', emo: '🍂' } : { size: w * 0.5, color: 'vert', msg: 'La terre est toute détrempée…', emo: '🌱' };
    if (eau === 2 && lum === 2) return { size: w, color: 'vert', flower: w >= 4, msg: w >= 4 ? 'De l\'eau juste assez et de la lumière : la plante est grande et <b>fleurit</b> ! 🌼' : 'La plante pousse bien, avec de belles feuilles vertes.', emo: w >= 4 ? '🌼' : '🌿' };
    return { size: w * 0.5, color: 'pale', msg: eau === 1 ? 'Avec un peu d\'eau seulement, la plante pousse <b>lentement</b>; ses feuilles sont pâles.' : 'À l\'ombre, la plante pousse <b>lentement</b>; ses feuilles sont pâles.', emo: '🌱' };
  }
  const COL = { vert: ['#3f8a37', '#4fbf5a'], pale: ['#9fbf6a', '#cfe39a'], jaune: ['#a39a3a', '#e9d36b'], fane: ['#8a6a3c', '#b89a6a'] };

  function drawPlant(eau, lum, s) {
    const [stem, leaf] = COL[s.color];
    const bg = ['#2f2a45', '#c3cfdb', '#fff3c4'][lum];
    const h = 18 + s.size * (s.tall ? 34 : 26);
    const top = 190 - h;
    const nLeaves = Math.max(1, Math.floor(s.size * 2));
    let leaves = '';
    for (let i = 0; i < nLeaves; i++) {
      const y = 186 - ((i + 1) * h) / (nLeaves + 1), side = i % 2 ? 1 : -1, L = s.tall ? 16 : 24;
      leaves += `<path d="M150 ${y} q${side * L} ${-12} ${side * (L + 10)} ${s.wilt ? 14 : -2} q${-side * 14} ${10} ${-side * (L + 10)} ${s.wilt ? -14 : 2} z" fill="${leaf}" stroke="${stem}" stroke-width="1.5"/>`;
    }
    const stemPath = s.wilt ? `M150 190 Q150 ${top + 10} ${168} ${top + 18}` : `M150 190 L150 ${top}`;
    const flower = s.flower ? M.range(0, 5).map((i) => { const a = (i * Math.PI) / 3; return `<circle cx="${150 + 11 * Math.cos(a)}" cy="${top - 4 + 11 * Math.sin(a)}" r="8" fill="#ef7fb0"/>`; }).join('') + `<circle cx="150" cy="${top - 4}" r="7" fill="#f4b400"/>` : '';
    const sun = lum === 2 ? '<circle cx="40" cy="40" r="18" fill="#ffd166"/>' : lum === 1 ? '<text x="24" y="52" font-size="34">⛅</text>' : '<text x="30" y="50" font-size="26">🌑</text>';
    const flood = eau === 3 ? '<rect x="110" y="188" width="80" height="8" fill="#4cb4e6" opacity=".9"/>' : '';
    const dry = eau === 0 ? '<path d="M118 194 l10 4 l8 -4 l10 5 l12 -5 l10 4" stroke="#5a3a1a" stroke-width="2" fill="none"/>' : '';
    return `<svg viewBox="0 0 300 260" class="sc-fig" role="img" aria-label="La plante" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="260" rx="16" fill="${bg}"/>${sun}
      <path d="${stemPath}" stroke="${stem}" stroke-width="6" fill="none" stroke-linecap="round"/>${leaves}${flower}
      <polygon points="104,190 196,190 184,250 116,250" fill="#d9774b" stroke="#a5532d" stroke-width="3"/><rect x="104" y="186" width="92" height="10" rx="3" fill="#6b4420"/>${flood}${dry}</svg>`;
  }

  M.registerLearn({
    id: 'sc-l-plante', domain: 'sc-vivant', title: 'Le jardin de Castor', icon: '🌱',
    short: 'Fais pousser une plante : eau, lumière… et observe !',
    intro: 'Castor fait pousser des plantes. De quoi une plante a-t-elle besoin pour bien grandir ? Fais l\'expérience : choisis l\'eau et la lumière, puis regarde ce qui se passe, semaine après semaine.',
    render(el) {
      el.innerHTML = M.ui.section({ icon: '🧪', title: '1. L\'expérience du jardin', intro: 'Choisis la quantité d\'<b>eau</b> et la <b>lumière</b>. Ensuite, touche « Une semaine plus tard ». Note ce que tu observes dans le carnet !',
        body: `<div class="sc-sim"><div><div class="sc-pl-stage"></div><div class="sc-msg sc-pl-msg"></div></div>
          <div class="sc-ctrls"><div class="sc-pl-eau"></div><div class="sc-pl-lum"></div>
          <div class="row"><button class="btn primary big sc-pl-next">⏭️ Une semaine plus tard</button><button class="btn sc-pl-reset">↺ Recommencer</button></div>
          <table class="sc-log"><thead><tr><th>Semaine</th><th>💧 Eau</th><th>☀️ Lumière</th><th>Plante</th></tr></thead><tbody class="sc-pl-log"></tbody></table></div></div>
          ${SC.castor('Un scientifique change <b>une seule chose à la fois</b>. Essaie : garde la lumière pareille et change seulement l\'eau. Que remarques-tu ?')}` })
        + M.ui.section({ icon: '🌻', title: '2. Les parties de la plante', intro: 'Touche une partie de la plante pour savoir comment elle s\'appelle et à quoi elle sert.',
          body: `<div class="sc-explore sc-pl-parts">${SC.svg.plante()}</div><div class="callout blue sc-pl-part">Touche une partie de la plante ☝️</div>
          ${M.ui.callout('La plante ne <b>mange</b> pas la terre ! Ses racines y boivent de l\'eau et des minéraux. Avec la lumière du soleil, la plante fabrique elle-même sa nourriture dans ses feuilles.', { tone: 'info', who: '💡' })}` })
        + M.ui.section({ icon: '✅', title: '3. Vérifie ta compréhension', body: '<div class="sc-pl-quiz"></div>' });

      const $ = (s) => M.$(s, el);
      const st = { eau: 2, lum: 2, w: 0, log: [] };
      const draw = () => {
        const s = stateAt(st.eau, st.lum, st.w);
        $('.sc-pl-stage').innerHTML = `<div class="sc-stage">${drawPlant(st.eau, st.lum, s)}</div>`;
        $('.sc-pl-msg').innerHTML = `${st.w ? `Semaine ${st.w} : ` : ''}${s.msg}`;
        $('.sc-pl-next').disabled = st.w >= 4;
        $('.sc-pl-log').innerHTML = st.log.map((r) => `<tr><td>${r.w}</td><td>${EAU[r.eau].icon}</td><td>${LUM[r.lum].icon}</td><td style="font-size:1.4rem">${r.emo}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">Le carnet est vide.</td></tr>';
      };
      const reset = () => { st.w = 0; st.log = []; draw(); };
      M.ui.slider($('.sc-pl-eau'), { label: '💧 Eau', stops: EAU, value: st.eau, onChange: (v) => { st.eau = v; reset(); } });
      M.ui.slider($('.sc-pl-lum'), { label: '☀️ Lumière', stops: LUM, value: st.lum, onChange: (v) => { st.lum = v; reset(); } });
      $('.sc-pl-next').onclick = () => {
        if (st.w >= 4) return;
        st.w++;
        const s = stateAt(st.eau, st.lum, st.w);
        st.log.push({ w: st.w, eau: st.eau, lum: st.lum, emo: s.emo });
        M.sfx.pop(); draw(); M.sayHtml(s.msg);
      };
      $('.sc-pl-reset').onclick = () => { M.sfx.tap(); reset(); };
      draw();

      $('.sc-pl-parts').onclick = (e) => {
        const z = e.target.closest('[data-hot]');
        if (!z) return;
        const p = SC.PARTIES_PLANTE.find((x) => x.id === z.dataset.hot);
        M.$$('[data-hot]', $('.sc-pl-parts')).forEach((x) => x.classList.toggle('sc-hl', x.dataset.hot === p.id));
        $('.sc-pl-part').innerHTML = `<b>${SC.cap(p.nom)}</b> : ${p.role.toLowerCase()}.`;
        M.say(`${p.nom}. ${p.role}.`);
      };

      M.ui.miniQuiz($('.sc-pl-quiz'), [
        () => M.skillById['sc-besoins'].gen({ lvl: 0 }),
        () => M.skillById['sc-besoins'].gen({ lvl: 1 }),
        () => M.skillById['sc-plante-parties'].gen({ lvl: 0 }),
      ]);
    },
  });
})();
