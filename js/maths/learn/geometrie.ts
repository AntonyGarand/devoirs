/* =====================================================================
   learn/geometrie.js — pages « Apprendre » : La géométrie
   Réutilise M.geo (défini dans js/skills/geometrie.js)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const G = M.geo;
  if (!G) return;
  const DOM = 'geometrie';
  const alive = (el) => !!(el && el.isConnected);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  try {
    M.css(`
.geo-gal .l-tile { cursor: pointer; font: inherit; color: inherit; transition: transform .12s, border-color .12s }
.geo-gal .l-tile:hover { transform: translateY(-3px) }
.geo-gal .l-tile.on { border-color: var(--B); background: var(--Bb) }
.geo-gal .geo-ex { font-size: 1.5rem; letter-spacing: 3px }
.geo-fiche:empty { display: none }
.geo-fiche { margin-top: 14px; display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: center; background: #fbfaf6; border: 3px solid var(--B); border-radius: 20px; padding: 14px; animation: pop .4s }
.geo-fiche h3 { margin: 0 0 6px; font-size: 1.5rem }
.geo-fiche .chips { display: flex; flex-wrap: wrap; gap: 6px }
.geo-fiche .chip.yes { border-color: #8fdcc3; background: var(--Cc) }
.geo-fiche .chip.no { border-color: #f3b5b5; background: #ffeaea }
@media (max-width: 560px) { .geo-fiche { grid-template-columns: 1fr; text-align: center } .geo-fiche .chips { justify-content: center } }
.geo-ramp { position: relative; width: 100%; max-width: 440px; aspect-ratio: 2 / 1; margin: 10px auto 0 }
.geo-ramp > svg { position: absolute; inset: 0; width: 100%; height: 100% }
.geo-ramp .obj { position: absolute; width: 18%; left: 3%; top: 16%; transform-origin: 50% 50% }
.geo-ramp .obj svg { width: 100%; height: auto; display: block }
.geo-wobble { animation: geo-wob .7s }
@keyframes geo-wob { 25% { transform: rotate(-12deg) } 50% { transform: rotate(10deg) } 75% { transform: rotate(-6deg) } }
.geo-objs { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 70px }
.geo-objs button { font-size: 2.3rem; width: 66px; height: 66px; border: 3px solid var(--line); border-radius: 16px; background: #fff; display: flex; align-items: center; justify-content: center; padding: 0; box-shadow: 0 3px 0 var(--line) }
.geo-objs button svg { width: 46px; height: auto }
.geo-objs button.on { border-color: var(--org); background: #fff3e6; transform: translateY(-3px) }
.geo-bins { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-top: 14px }
.geo-bin { border: 3px dashed #c7c2b4; border-radius: 18px; background: #fbfaf6; padding: 8px; text-align: center; font: inherit; color: inherit; min-height: 130px }
.geo-bin b { display: block }
.geo-bin .in { font-size: 1.5rem; min-height: 1.6em; display: flex; flex-wrap: wrap; justify-content: center; gap: 2px }
.geo-bin .in svg { width: 26px; height: auto }
.geo-bin.good { border-color: var(--C); background: var(--Cc) }
.geo-bin.bad { border-color: var(--red); background: #ffe5e5; animation: shake .4s }
.geo-pick { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 10px }
.geo-pick .btn svg { width: 34px; height: auto }
.geo-cbox { background: #fbfaf6; border: 3px solid var(--line); border-radius: 20px; padding: 12px; max-width: 420px; margin: 0 auto; text-align: center }
.geo-marks .l-tile svg { width: 150px }
.geo-rot { transition: transform 1s ease-in-out }
.geo-lq { display: grid; gap: 10px; justify-items: center }
.geo-lq .row { justify-content: center; margin: 0 }
.geo-around .l-tile { cursor: pointer; font: inherit; color: inherit; min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px }
.geo-around .big { font-size: 3.4rem; line-height: 1.1 }
.geo-fold { position: relative; display: flex; perspective: 900px; margin: 0 auto; max-width: 100% }
.geo-fold > div { width: 50%; height: 100%; overflow: hidden }
.geo-fold .geo-fold-r { transform-origin: left center; transition: transform 1.3s ease-in-out; position: relative; z-index: 2 }
.geo-fold.folded .geo-fold-r { transform: rotateY(-180deg) }
.geo-fold .geo-fold-r > div { opacity: .92 }
.geo-paint { display: flex; justify-content: center; perspective: 1000px; user-select: none }
.geo-pgrid { display: grid; grid-template-columns: repeat(4, var(--pc, clamp(30px, 8vw, 44px))); gap: 3px; padding: 4px; background: #e9eef1; transition: transform 1.3s ease-in-out; transform-origin: left center }
.geo-pgrid.l { border-radius: 12px 0 0 12px }
.geo-pgrid.r { border-radius: 0 12px 12px 0; position: relative; z-index: 2; transform-origin: -3px center }
.geo-paint.folded .geo-pgrid.r { transform: rotateY(-180deg); opacity: .85 }
.geo-paxis { width: 0; border-left: 4px dashed #d62828; margin: 0 1px }
.geo-pc { aspect-ratio: 1; background: #fff; border-radius: 6px; border: none; padding: 0; transition: background .2s }
.geo-pc.pop { animation: pop .35s }
.geo-pc.miss { outline: 3px dashed var(--red); outline-offset: -3px }
.geo-pc.extra { outline: 3px solid var(--red); outline-offset: -3px }
.geo-pgrid.locked .geo-pc { cursor: default }
.geo-colors { display: flex; gap: 8px; justify-content: center; margin: 8px 0 }
.geo-colors button { width: 38px; height: 38px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 0 3px var(--line) }
.geo-colors button.on { box-shadow: 0 0 0 4px var(--ink) }
.geo-symq .l-tile .row { justify-content: center }
.geo-symq .l-tile .res { min-height: 2.6em; font-weight: 800; font-size: .95rem; margin-top: 6px }
.geo-fb { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; align-items: center; min-height: 64px; background: #fbfaf6; border: 3px solid var(--line); border-radius: 16px; padding: 8px; margin-top: 10px }
.geo-fb > span { animation: pop .35s }
.geo-fb .ax { width: 0; height: 52px; border-left: 3px dashed #d62828; opacity: .65 }
.geo-pos .l-tile .scene { font-size: 2.6rem; min-height: 120px; display: flex; align-items: center; justify-content: center; position: relative }
.geo-arrows { display: grid; grid-template-columns: repeat(3, 58px); grid-template-rows: repeat(2, 52px); gap: 6px; justify-content: center; margin-top: 12px }
.geo-arrows .btn { font-size: 1.4rem; padding: 0 }
.geo-arrows .up { grid-column: 2 }
.geo-arrows .left { grid-column: 1; grid-row: 2 }
.geo-arrows .down { grid-column: 2; grid-row: 2 }
.geo-arrows .right { grid-column: 3; grid-row: 2 }
.geo-plan-wrap .geo-cell { cursor: pointer }
.geo-mission { font-size: 1.2rem; font-weight: 800; text-align: center; margin: 4px 0 10px }
.geo-lrrow .geo-slot { cursor: pointer }
`);
  } catch (e) {
    /* hors navigateur */
  }

  /* ------------------------------------------------------------------
     Aide : pliage d'un dessin sur un axe vertical (au milieu)
     ------------------------------------------------------------------ */
  function foldHtml(svg, w) {
    return `<div class="geo-fold" style="width:${w}px;height:${w}px"><div class="geo-fold-l"><div style="width:${w}px">${svg}</div></div><div class="geo-fold-r"><div style="width:${w}px;margin-left:-${w / 2}px">${svg}</div></div></div>`;
  }

  /* ===================================================================
     LES SOLIDES
     =================================================================== */
  const EXAMPLES = { boule: '⚽🍊🎱', cone: '🍦🥕', cube: '🎲🧊', cylindre: '🥫🔋🧻🥁', prisme: '📦🧱🧈⛺', pyramide: '🔺' };
  M.registerLearn({
    id: 'solides',
    domain: DOM,
    title: 'Les solides',
    icon: '🧊',
    short: 'Boule, cône, cube, cylindre, prisme, pyramide',
    intro:
      "Un <b>solide</b>, c'est un objet qu'on peut prendre dans ses mains : il a de l'épaisseur. Touche chaque solide pour découvrir ses secrets !",
    render(el) {
      el.innerHTML = `
        <section class="l-sec"><h2>🧊 Les 6 solides</h2>
          <p>Touche un solide pour voir sa <b>fiche</b>. Les traits pointillés montrent les arêtes cachées, derrière.</p>
          <div class="l-grid geo-gal">${G.CATS.map((k) => `<button class="l-tile" data-k="${k}">${G.solid(k === 'prisme' ? 'prisme' : k, { size: 110 })}<h3>${cap(G.SOL[k].nom)}</h3><div class="geo-ex">${k === 'pyramide' ? '🏜️' : EXAMPLES[k]}</div></button>`).join('')}</div>
          <div class="geo-fiche"></div>
        </section>
        <section class="l-sec"><h2>📖 Les mots des solides</h2>
          <div class="l-grid">
            <div class="l-tile">${G.solid('cube', { size: 110 })}<h3>Une face</h3><p>Une surface <b>plane</b> (toute plate) d'un solide. Le cube a 6 faces carrées.</p></div>
            <div class="l-tile">${G.solid('cylindre', { size: 110 })}<h3>Surface plane ou courbe</h3><p>Le cylindre a 2 surfaces <b>planes</b> (les ronds) et 1 surface <b>courbe</b> (arrondie, tout autour).</p></div>
            <div class="l-tile">${G.solid('pyramide', { size: 110 })}<h3>La base</h3><p>La face sur laquelle le solide est posé. La base de cette pyramide est un <b>carré</b>.</p></div>
          </div>
          <div class="callout">🦫 <b>Truc de Castor :</b> passe ta main sur le solide. Si c'est tout plat, c'est une surface plane. Si c'est arrondi, c'est une surface courbe !</div>
        </section>
        <section class="l-sec"><h2>🛝 Roule ou glisse ?</h2>
          <p>Choisis un solide, puis essaie de le faire rouler ou glisser sur la pente.</p>
          <div class="geo-pick geo-rsol">${G.CATS.map((k, i) => `<button class="btn${i === 0 ? ' on' : ''}" data-k="${k}">${G.solid(k, { size: 34 })} ${G.SOL[k].nom}</button>`).join('')}</div>
          <div class="row" style="justify-content:center"><button class="btn blue geo-roll">🛞 Fais-le rouler</button><button class="btn blue geo-slide">🛷 Fais-le glisser</button></div>
          <div class="geo-ramp"><svg viewBox="0 0 300 150" preserveAspectRatio="none"><polygon points="0,70 300,146 300,150 0,150" fill="#c9ecb0" stroke="#7bbf5e" stroke-width="3"/></svg><div class="obj"></div></div>
          <div class="viz-status geo-rmsg" style="text-align:center"></div>
          <div class="callout">🦫 Ce qui a une surface <b>courbe</b> peut rouler. Ce qui a une surface <b>plane</b> peut glisser. Le cône et le cylindre ont les deux : ils font les deux !</div>
        </section>
        <section class="l-sec"><h2>🗂️ Trie les objets</h2>
          <p>Touche un objet, puis touche le solide auquel il ressemble.</p>
          <div class="geo-objs"></div>
          <div class="viz-status geo-tmsg" style="text-align:center"></div>
          <div class="geo-bins"></div>
          <div class="row" style="justify-content:center"><button class="btn geo-again">🔁 Recommencer</button></div>
        </section>`;

      /* --- fiche --- */
      const fiche = M.$('.geo-fiche', el);
      const yn = (b, txt) => `<span class="chip ${b ? 'yes' : 'no'}">${b ? '✔️' : '✖️'} ${txt}</span>`;
      M.$('.geo-gal', el).addEventListener('click', (e) => {
        const b = e.target.closest('.l-tile');
        if (!b) return;
        const k = b.dataset.k,
          S = G.SOL[k];
        M.$$('.geo-gal .l-tile', el).forEach((t) => t.classList.toggle('on', t === b));
        M.sfx.tap();
        let faces = '';
        if (k === 'cube') faces = '<span class="chip">6 faces carrées</span>';
        if (k === 'prisme')
          faces = '<span class="chip">Prisme rectangulaire : 6 faces</span><span class="chip">Prisme triangulaire : 5 faces</span>';
        if (k === 'pyramide') faces = '<span class="chip">5 faces : 1 base carrée + 4 triangles</span>';
        const pic = k === 'prisme' ? G.solid('prisme', { size: 120 }) + G.solid('prisme-tri', { size: 120 }) : G.solid(k, { size: 160 });
        const desc = {
          boule: "La boule est ronde partout. Elle n'a qu'une surface courbe.",
          cone: 'Le cône a une pointe et une base ronde.',
          cube: 'Le cube a 6 faces carrées, toutes pareilles.',
          cylindre: 'Le cylindre a deux bases rondes et une surface courbe.',
          prisme: 'Le prisme a deux bases pareilles, reliées par des rectangles. Ses bases peuvent être des rectangles ou des triangles.',
          pyramide: 'La pyramide a une base et des faces en triangle qui se rejoignent en pointe.',
        }[k];
        fiche.innerHTML = `<div class="geo-center">${pic}</div><div><h3>${cap(S.nom)}</h3><p>${desc}</p>
          <div class="chips">
            <span class="chip">Surfaces planes : ${k === 'prisme' ? '5 ou 6' : S.planes}</span>
            <span class="chip">Surface courbe : ${S.courbes}</span>
            ${faces}
            ${S.base ? `<span class="chip">Base : ${G.FIG[S.base].nom}${k === 'prisme' ? ' ou triangle' : ''}</span>` : ''}
            ${yn(S.roule, 'Roule')}${yn(S.glisse, 'Glisse')}${yn(S.empile, "S'empile")}
          </div>
          <p>Ça ressemble à : <span style="font-size:1.6rem">${k === 'pyramide' ? "les pyramides d'Égypte 🏜️" : EXAMPLES[k]}</span></p></div>`;
        M.say(`${S.un}. ${desc}`);
      });

      /* --- rampe --- */
      let cur = 'boule',
        anim = 0;
      const obj = M.$('.geo-ramp .obj', el),
        rmsg = M.$('.geo-rmsg', el);
      function place(k, lie) {
        obj.style.transition = 'none';
        obj.style.left = '3%';
        obj.style.top = '16%';
        obj.style.transform = 'none';
        obj.classList.remove('geo-wobble');
        obj.innerHTML = G.solid(k, { size: 120, lie });
        void obj.offsetWidth;
      }
      place(cur);
      M.$('.geo-rsol', el).addEventListener('click', (e) => {
        const b = e.target.closest('.btn');
        if (!b) return;
        cur = b.dataset.k;
        anim++;
        M.$$('.geo-rsol .btn', el).forEach((x) => x.classList.toggle('on', x === b));
        place(cur);
        rmsg.textContent = '';
      });
      async function go(roll) {
        const my = ++anim,
          S = G.SOL[cur];
        const can = roll ? S.roule : S.glisse;
        place(cur, roll && cur === 'cylindre');
        await M.sleep(60);
        if (!alive(obj) || my !== anim) return;
        if (!can) {
          obj.classList.add('geo-wobble');
          M.sfx.bad();
          rmsg.innerHTML = roll
            ? `${cap(S.le)} ne roule pas : ${cur === 'pyramide' ? 'elle' : 'il'} n'a pas de surface courbe.`
            : "La boule ne peut pas glisser : elle n'a pas de surface plane pour se poser. Elle roule tout de suite !";
          return;
        }
        obj.style.transition = `left 1.6s ease-in, top 1.6s ease-in, transform 1.6s ease-in`;
        obj.style.left = '76%';
        obj.style.top = '52%';
        obj.style.transform = roll ? 'rotate(600deg)' : 'none';
        M.sfx.hop();
        rmsg.innerHTML = roll ? `${cap(S.le)} roule grâce à sa surface courbe ! 🛞` : `${cap(S.le)} glisse sur sa surface plane ! 🛷`;
      }
      M.$('.geo-roll', el).onclick = () => go(true);
      M.$('.geo-slide', el).onclick = () => go(false);
      M.onCleanup(() => {
        anim++;
      });

      /* --- tri --- */
      const objsEl = M.$('.geo-objs', el),
        bins = M.$('.geo-bins', el),
        tmsg = M.$('.geo-tmsg', el);
      let sel = null,
        left = 0,
        items = [];
      function newGame() {
        const pyr = { html: G.solid('pyramide', { size: 46, color: '#e9c46a' }), n: "une pyramide d'Égypte", s: 'pyramide' };
        items = M.shuffle([
          ...M.shuffle(G.OBJ)
            .slice(0, 9)
            .map((o) => ({ html: o.e, n: o.n, s: o.s })),
          pyr,
        ]);
        left = items.length;
        sel = null;
        objsEl.innerHTML = items.map((o, i) => `<button data-i="${i}" title="${M.esc(o.n)}">${o.html}</button>`).join('');
        bins.innerHTML = G.CATS.map(
          (k) =>
            `<button class="geo-bin" data-k="${k}">${G.solid(k, { size: 64 })}<b>${cap(G.SOL[k].nom)}</b><div class="in"></div></button>`,
        ).join('');
        tmsg.textContent = 'Touche un objet 👆';
      }
      objsEl.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        sel = +b.dataset.i;
        M.$$('button', objsEl).forEach((x) => x.classList.toggle('on', x === b));
        M.sfx.tap();
        tmsg.innerHTML = `${cap(items[sel].n)} : à quel solide ressemble-t-il ? 👇`;
      });
      bins.addEventListener('click', (e) => {
        const bin = e.target.closest('.geo-bin');
        if (!bin) return;
        if (sel == null) {
          tmsg.textContent = "Touche d'abord un objet 👆";
          return;
        }
        const it = items[sel],
          k = bin.dataset.k;
        bin.classList.remove('good', 'bad');
        void bin.offsetWidth;
        if (it.s === k) {
          bin.classList.add('good');
          M.sfx.good();
          M.$('.in', bin).insertAdjacentHTML('beforeend', `<span>${it.html}</span>`);
          const ob = M.$(`button[data-i="${sel}"]`, objsEl);
          if (ob) ob.remove();
          tmsg.innerHTML = `Oui ! ${cap(it.n)} ressemble à ${G.SOL[k].un}.`;
          sel = null;
          left--;
          if (!left) {
            tmsg.innerHTML = 'Bravo, tout est trié ! 🎉';
            M.confetti();
            M.say('Bravo, tout est trié !');
          }
        } else {
          bin.classList.add('bad');
          M.sfx.bad();
          tmsg.innerHTML = `Hmm… ${it.n} n'est pas ${G.SOL[k].un}. ${G.SOL[it.s].courbes ? 'Regarde : il a une partie arrondie.' : 'Regarde : il est tout plat sur ses côtés.'}`;
        }
      });
      M.$('.geo-again', el).onclick = newGame;
      newGame();
    },
  });

  /* ===================================================================
     LES FIGURES PLANES ET LES LIGNES
     =================================================================== */
  /** Figure avec marques : petits traits = côtés pareils, petit carré = coin droit. */
  function markedFig(kind, color) {
    const P = G.figPts(kind, { W: 160, H: 120, pad: 22, ratio: kind === 'rectangle' ? 1.9 : 1.7 });
    const n = P.length;
    const st = G.dark(color, 0.3);
    let h = `<polygon points="${P.map((p) => p.join(',')).join(' ')}" fill="${G.light(color, 0.3)}" stroke="${st}" stroke-width="4" stroke-linejoin="round"/>`;
    P.forEach((a, i) => {
      const b = P[(i + 1) % n],
        m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const d = [b[0] - a[0], b[1] - a[1]],
        L = Math.hypot(d[0], d[1]),
        u = [d[0] / L, d[1] / L],
        nn = [-u[1] * 7, u[0] * 7];
      const ticks = kind === 'rectangle' ? (i % 2 === 0 ? 2 : 1) : 1;
      for (let t = 0; t < ticks; t++) {
        const o = (t - (ticks - 1) / 2) * 6,
          c = [m[0] + u[0] * o, m[1] + u[1] * o];
        h += `<line x1="${c[0] - nn[0]}" y1="${c[1] - nn[1]}" x2="${c[0] + nn[0]}" y2="${c[1] + nn[1]}" stroke="#d62828" stroke-width="3" stroke-linecap="round"/>`;
      }
    });
    if (kind !== 'losange')
      P.forEach((p, i) => {
        const a = P[(i + n - 1) % n],
          b = P[(i + 1) % n],
          s = 12;
        const ua = [a[0] - p[0], a[1] - p[1]],
          ub = [b[0] - p[0], b[1] - p[1]];
        const la = Math.hypot(...ua),
          lb = Math.hypot(...ub);
        const q1 = [p[0] + (ua[0] / la) * s, p[1] + (ua[1] / la) * s],
          q2 = [p[0] + (ua[0] / la) * s + (ub[0] / lb) * s, p[1] + (ua[1] / la) * s + (ub[1] / lb) * s],
          q3 = [p[0] + (ub[0] / lb) * s, p[1] + (ub[1] / lb) * s];
        h += `<polyline points="${[q1, q2, q3].map((q) => q.join(',')).join(' ')}" fill="none" stroke="${st}" stroke-width="2.5"/>`;
      });
    return G.svg(160, 120, h, { width: 160 });
  }

  const AROUND = [
    { e: '🚪', n: 'La porte', f: 'rectangle' },
    { e: '📱', n: 'Le téléphone', f: 'rectangle' },
    { e: '🍕', n: 'La pointe de pizza', f: 'triangle' },
    { e: '⚠️', n: 'Le panneau', f: 'triangle' },
    { e: '🕒', n: "L'horloge", f: 'cercle' },
    { e: '🍪', n: 'Le biscuit', f: 'cercle' },
    { e: '♦️', n: 'Le carreau des cartes', f: 'losange' },
    { e: '🧇', n: 'La gaufre', f: 'carre' },
  ];

  M.registerLearn({
    id: 'figures',
    domain: DOM,
    title: 'Les figures planes et les lignes',
    icon: '🔺',
    short: 'Carré, rectangle, triangle, losange, cercle; lignes',
    intro:
      'Une <b>figure plane</b> est toute plate, comme un dessin sur une feuille. On la reconnaît en comptant ses <b>côtés</b> et ses <b>sommets</b> (ses coins).',
    render(el) {
      const COL = { carre: '#06a77d', rectangle: '#9b5de5', triangle: '#ef476f', losange: '#f78c40', cercle: '#118ab2' };
      el.innerHTML = `
        <section class="l-sec"><h2>🔷 Les 5 figures</h2>
          <div class="l-grid">${G.FIG5.map((k) => `<div class="l-tile">${G.figure(k, { color: COL[k], size: 110, ratio: 1.7 })}<h3>${cap(G.FIG[k].nom)}</h3><p>${k === 'cercle' ? 'Tout rond : 0 côté, 0 sommet' : `${G.FIG[k].cotes} côtés, ${G.FIG[k].cotes} sommets`}</p></div>`).join('')}</div>
        </section>
        <section class="l-sec"><h2>👆 Compte les côtés et les sommets</h2>
          <p>Choisis une figure. Touche chaque <b>côté</b> (trait droit), puis chaque <b>sommet</b> (coin).</p>
          <div class="geo-pick geo-cpick">${[...G.FIG5, 'pentagone', 'hexagone'].map((k, i) => `<button class="btn${i === 2 ? ' on' : ''}" data-k="${k}">${G.figure(k, { color: COL[k] || '#2a9d8f', size: 34, sw: 6, ratio: 1.7 })} ${G.FIG[k].nom}</button>`).join('')}</div>
          <div class="geo-cbox"><div class="geo-cnt"></div><div class="row" style="justify-content:center"><button class="btn yellow geo-cshow">👀 Montre-moi</button><button class="btn geo-crot">🔄 Tourner</button></div></div>
          <div class="callout">🦫 Une figure a toujours <b>autant de côtés que de sommets</b>. Le triangle : 3 et 3. Le carré : 4 et 4 !</div>
        </section>
        <section class="l-sec"><h2>🟩 Carré, rectangle ou losange ?</h2>
          <p>Les petits traits rouges montrent les côtés <b>pareils</b>. Le petit coin carré montre un coin <b>droit</b>.</p>
          <div class="l-grid geo-marks">
            <div class="l-tile"><div class="geo-rot geo-sq">${markedFig('carre', COL.carre)}</div><h3>Carré</h3><p>4 côtés pareils<br>4 coins droits</p><button class="btn geo-turn">🔄 Tourne-le</button></div>
            <div class="l-tile">${markedFig('rectangle', COL.rectangle)}<h3>Rectangle</h3><p>2 côtés longs, 2 côtés courts<br>4 coins droits</p></div>
            <div class="l-tile">${markedFig('losange', COL.losange)}<h3>Losange</h3><p>4 côtés pareils<br>pas de coin droit : il est penché</p></div>
          </div>
          <div class="viz-status geo-turnmsg" style="text-align:center"></div>
          <div class="callout">🦫 Le carré, c'est un peu les deux : 4 coins droits comme le rectangle, et 4 côtés pareils comme le losange. Et même tourné, <b>un carré reste un carré</b> !</div>
        </section>
        <section class="l-sec"><h2>〰️ Les lignes</h2>
          <div class="l-grid">${Object.keys(G.LIGNES)
            .map(
              (k) =>
                `<div class="l-tile">${G.lineSvg(k, { size: 140 })}<h3>${cap(G.LIGNES[k])}</h3><p>${k.startsWith('courbe') ? 'Arrondie, sans coin.' : 'Des traits droits, avec des coins.'} ${k.endsWith('fermee') ? 'Pas de bout.' : 'Deux bouts.'}</p></div>`,
            )
            .join('')}</div>
          <div class="callout">🦫 Une ligne <b>fermée</b>, c'est comme une clôture : une fourmi qui marche dessus revient à son point de départ. Une ligne <b>ouverte</b> a deux bouts.</div>
          <h3>À toi ! Comment est cette ligne ?</h3>
          <div class="geo-lq">
            <div class="geo-lsvg"></div>
            <div class="row"><button class="btn" data-a="courbe">Courbe</button><button class="btn" data-a="brisee">Brisée</button></div>
            <div class="row"><button class="btn" data-b="ouverte">Ouverte</button><button class="btn" data-b="fermee">Fermée</button></div>
            <div class="viz-status geo-lmsg"></div>
            <button class="btn blue geo-lnext">Une autre ligne ➜</button>
          </div>
        </section>
        <section class="l-sec"><h2>🔍 Les figures autour de moi</h2>
          <p>Touche un objet pour découvrir la figure cachée.</p>
          <div class="l-grid geo-around">${M.shuffle(AROUND)
            .map(
              (o) =>
                `<button class="l-tile" data-f="${o.f}"><span class="big">${o.e}</span><b>${o.n}</b><span class="res"></span></button>`,
            )
            .join('')}</div>
        </section>`;

      /* --- compter --- */
      const cnt = M.$('.geo-cnt', el);
      let curK = 'triangle',
        rot = 0,
        w = null;
      function mount() {
        w = G.countFig(cnt, curK, {
          color: COL[curK] || '#2a9d8f',
          rot,
          ratio: 1.7,
          tri: 'equi',
          onDone: (n) => {
            M.sfx.good();
            M.say(`Bravo ! ${G.FIG[curK].le} a ${n} côtés et ${n} sommets.`);
          },
        });
      }
      mount();
      M.$('.geo-cpick', el).addEventListener('click', (e) => {
        const b = e.target.closest('.btn');
        if (!b) return;
        curK = b.dataset.k;
        rot = 0;
        M.$$('.geo-cpick .btn', el).forEach((x) => x.classList.toggle('on', x === b));
        mount();
      });
      M.$('.geo-cshow', el).onclick = () => w && w.showMe();
      M.$('.geo-crot', el).onclick = () => {
        rot = (rot + 30) % 360;
        mount();
      };

      /* --- carré tourné --- */
      let turned = 0;
      M.$('.geo-turn', el).onclick = () => {
        turned = (turned + 45) % 360;
        M.$('.geo-sq', el).style.transform = `rotate(${turned}deg)`;
        M.$('.geo-turnmsg', el).textContent = turned
          ? "Il est tourné… mais c'est encore un carré ! 4 côtés pareils, 4 coins droits."
          : 'De retour à sa place !';
      };

      /* --- quiz des lignes --- */
      const lq = { k: null, a: null, b: null };
      const lsvg = M.$('.geo-lsvg', el),
        lmsg = M.$('.geo-lmsg', el);
      function newLine() {
        lq.k = M.pick(Object.keys(G.LIGNES));
        lq.a = lq.b = null;
        lsvg.innerHTML = G.lineSvg(lq.k, { size: 220 });
        M.$$('.geo-lq [data-a], .geo-lq [data-b]', el).forEach((x) => x.classList.remove('on'));
        lmsg.textContent = 'Choisis un mot dans chaque rangée.';
      }
      M.$('.geo-lq', el).addEventListener('click', (e) => {
        const b = e.target.closest('[data-a],[data-b]');
        if (!b) return;
        if (b.dataset.a) {
          lq.a = b.dataset.a;
          M.$$('.geo-lq [data-a]', el).forEach((x) => x.classList.toggle('on', x === b));
        } else {
          lq.b = b.dataset.b;
          M.$$('.geo-lq [data-b]', el).forEach((x) => x.classList.toggle('on', x === b));
        }
        M.sfx.tap();
        if (lq.a && lq.b) {
          const ok = lq.k === lq.a + '-' + lq.b;
          if (ok) {
            M.sfx.good();
            lmsg.innerHTML = `Oui ! C'est une <b>${G.LIGNES[lq.k]}</b> 🎉`;
          } else {
            M.sfx.bad();
            lmsg.innerHTML = `Pas tout à fait… ${lq.k.startsWith('courbe') ? 'Elle est arrondie' : 'Elle a des coins'} et ${lq.k.endsWith('fermee') ? "elle n'a pas de bout" : 'elle a deux bouts'}.`;
          }
        }
      });
      M.$('.geo-lnext', el).onclick = newLine;
      newLine();

      /* --- figures autour de moi --- */
      M.$('.geo-around', el).addEventListener('click', (e) => {
        const b = e.target.closest('.l-tile');
        if (!b) return;
        const f = b.dataset.f;
        M.$('.res', b).innerHTML = `${G.figure(f, { color: COL[f], size: 54, ratio: 1.7, sw: 5 })}<b>${G.FIG[f].un}</b>`;
        M.sfx.pop();
        M.say(G.FIG[f].un);
      });
    },
  });

  /* ===================================================================
     LA SYMÉTRIE ET LES FRISES
     =================================================================== */
  const PCOLORS = ['#ef476f', '#118ab2', '#f4b400', '#06a77d'];
  M.registerLearn({
    id: 'symetrie',
    domain: DOM,
    title: 'La symétrie et les frises',
    icon: '🦋',
    short: 'Axe de réflexion, miroir, frises',
    intro:
      "Une figure est <b>symétrique</b> quand on peut la plier en deux et que les deux moitiés se superposent exactement. La ligne de pliage s'appelle l'<b>axe de réflexion</b> (ou axe de symétrie).",
    render(el) {
      el.innerHTML = `
        <section class="l-sec"><h2>🦋 L'axe de réflexion</h2>
          <p>Appuie sur <b>Plier</b> : la moitié de droite se retourne sur la moitié de gauche, comme une page de livre.</p>
          <div class="geo-pick geo-fpick">${['papillon', 'coeur', 'maison', 'sapin', 'drapeau'].map((k, i) => `<button class="btn${i === 0 ? ' on' : ''}" data-k="${k}">${G.symSvg(k, null, { size: 34 })}</button>`).join('')}</div>
          <div class="geo-foldbox"></div>
          <div class="row" style="justify-content:center"><button class="btn blue geo-dofold">📖 Plier</button></div>
          <div class="viz-status geo-fmsg" style="text-align:center"></div>
        </section>
        <section class="l-sec"><h2>🪞 Le miroir magique</h2>
          <p><b>Dessine :</b> touche des cases, le miroir dessine l'autre moitié. <b>Défi :</b> complète toi-même la moitié de droite, puis vérifie !</p>
          <div class="row" style="justify-content:center;margin-bottom:6px"><button class="btn on geo-mdraw">🎨 Dessine</button><button class="btn geo-mdefi">🧩 Défi</button></div>
          <div class="geo-colors">${PCOLORS.map((c, i) => `<button data-c="${c}" style="background:${c}" class="${i === 0 ? 'on' : ''}" title="Couleur"></button>`).join('')}</div>
          <div class="geo-paint"><div class="geo-pgrid l"></div><div class="geo-paxis"></div><div class="geo-pgrid r"></div></div>
          <div class="row" style="justify-content:center"><button class="btn blue geo-pfold">📖 Plier</button><button class="btn primary geo-pcheck" hidden>✔ Vérifier</button><button class="btn geo-pclear">🧽 Effacer</button></div>
          <div class="viz-status geo-pmsg" style="text-align:center"></div>
          <div class="callout">🦫 Une case collée à l'axe a son image collée à l'axe, de l'autre côté. Une case loin de l'axe a son image aussi loin. C'est ça, la <b>réflexion</b> !</div>
        </section>
        <section class="l-sec"><h2>🤔 Symétrique ou pas ?</h2>
          <p>La ligne pointillée rouge est-elle un axe de symétrie ?</p>
          <div class="l-grid geo-symq"></div>
          <div class="row" style="justify-content:center"><button class="btn geo-symnew">🔀 D'autres figures</button></div>
          <div class="callout">🦫 Attention au rectangle : sa <b>diagonale</b> n'est pas un axe de symétrie ! Si on plie, les coins ne se touchent pas.</div>
        </section>
        <section class="l-sec"><h2>🎏 Je fabrique une frise</h2>
          <p>Choisis un motif, puis choisis comment le répéter.</p>
          <div class="geo-pick geo-mpick">${Object.keys(G.MOTIFS)
            .map((k, i) => `<button class="btn${i === 0 ? ' on' : ''}" data-k="${k}">${G.motif(k, '#ef476f', 'n', 34)}</button>`)
            .join('')}</div>
          <div class="row" style="justify-content:center"><button class="btn blue geo-ftr">➡️ Glisser (translation)</button><button class="btn blue geo-frf">🪞 Réflexion (miroir)</button></div>
          <div class="geo-fb"></div>
          <div class="viz-status geo-fbmsg" style="text-align:center"></div>
          <div class="callout">🦫 Une <b>frise</b>, c'est un motif qui se répète en bande, comme une bordure de papier peint. Deux figures <b>isométriques</b> sont pareilles : même forme et même grandeur, même si l'une est tournée ou retournée.</div>
        </section>`;

      /* --- pliage --- */
      const fbox = M.$('.geo-foldbox', el),
        fmsg = M.$('.geo-fmsg', el);
      let fk = 'papillon';
      const FW = 220;
      function showFold() {
        fbox.innerHTML = foldHtml(G.symSvg(fk, 'v', { size: FW, color: '#9b5de5' }), FW);
        fmsg.textContent = '';
      }
      showFold();
      M.$('.geo-fpick', el).addEventListener('click', (e) => {
        const b = e.target.closest('.btn');
        if (!b) return;
        fk = b.dataset.k;
        M.$$('.geo-fpick .btn', el).forEach((x) => x.classList.toggle('on', x === b));
        showFold();
      });
      M.$('.geo-dofold', el).onclick = async () => {
        const f = M.$('.geo-fold', fbox);
        if (!f) return;
        const folded = f.classList.toggle('folded');
        M.sfx.hop();
        if (!folded) {
          fmsg.textContent = '';
          return;
        }
        await M.sleep(1300);
        if (!alive(f) || !f.classList.contains('folded')) return;
        const ok = G.SYM[fk].axes.includes('v');
        fmsg.innerHTML = ok
          ? 'Les deux moitiés se superposent exactement : la ligne est un <b>axe de symétrie</b> ✔️'
          : "Les deux moitiés ne se superposent pas : ce n'est <b>pas</b> un axe de symétrie ✖️";
        M.say(M.text(fmsg.innerHTML));
      };

      /* --- miroir magique --- */
      const ROWS = 6,
        COLS = 4;
      const gl = M.$('.geo-pgrid.l', el),
        gr = M.$('.geo-pgrid.r', el),
        paint = M.$('.geo-paint', el),
        pmsg = M.$('.geo-pmsg', el);
      let color = PCOLORS[0],
        mode = 'draw';
      let L = [],
        R = [],
        target = null;
      const blank = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
      function drawGrids() {
        const cells = (g, side) =>
          g
            .map((row, r) =>
              row
                .map(
                  (c, k) =>
                    `<button class="geo-pc" data-s="${side}" data-r="${r}" data-c="${k}" style="${c ? 'background:' + c : ''}" aria-label="case"></button>`,
                )
                .join(''),
            )
            .join('');
        gl.innerHTML = cells(L, 'l');
        gr.innerHTML = cells(R, 'r');
        gl.classList.toggle('locked', mode === 'defi');
      }
      function reset() {
        L = blank();
        R = blank();
        paint.classList.remove('folded');
        pmsg.textContent = '';
      }
      function newDefi() {
        reset();
        let n = 0;
        while (n < 6) {
          const r = M.rnd(0, ROWS - 1),
            c = M.rnd(0, COLS - 1);
          if (!L[r][c]) {
            L[r][c] = M.pick(PCOLORS);
            n++;
          }
        }
        target = L.map((row) => row.slice().reverse());
        drawGrids();
        pmsg.textContent = 'Complète la moitié de droite par réflexion.';
      }
      paint.addEventListener('click', async (e) => {
        const b = e.target.closest('.geo-pc');
        if (!b || paint.classList.contains('folded')) return;
        const side = b.dataset.s,
          r = +b.dataset.r,
          c = +b.dataset.c;
        if (mode === 'defi' && side === 'l') {
          pmsg.textContent = 'Dans le défi, on dessine seulement à droite 👉';
          return;
        }
        const G1 = side === 'l' ? L : R,
          G2 = side === 'l' ? R : L;
        const val = G1[r][c] === color ? null : color;
        G1[r][c] = val;
        b.style.background = val || '';
        b.classList.remove('pop');
        void b.offsetWidth;
        b.classList.add('pop');
        M.sfx.tap();
        M.$$('.geo-pc', paint).forEach((x) => x.classList.remove('miss', 'extra'));
        if (mode === 'draw') {
          const mc = COLS - 1 - c;
          G2[r][mc] = val;
          await M.sleep(220);
          const other = M.$(`.geo-pc[data-s="${side === 'l' ? 'r' : 'l'}"][data-r="${r}"][data-c="${mc}"]`, paint);
          if (!other) return;
          other.style.background = val || '';
          other.classList.remove('pop');
          void other.offsetWidth;
          other.classList.add('pop');
          M.sfx.pop();
        }
      });
      M.$('.geo-colors', el).addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        color = b.dataset.c;
        M.$$('.geo-colors button', el).forEach((x) => x.classList.toggle('on', x === b));
      });
      const setMode = (m) => {
        mode = m;
        M.$('.geo-mdraw', el).classList.toggle('on', m === 'draw');
        M.$('.geo-mdefi', el).classList.toggle('on', m === 'defi');
        M.$('.geo-pcheck', el).hidden = m !== 'defi';
        if (m === 'defi') newDefi();
        else {
          reset();
          drawGrids();
        }
      };
      M.$('.geo-mdraw', el).onclick = () => setMode('draw');
      M.$('.geo-mdefi', el).onclick = () => setMode('defi');
      M.$('.geo-pclear', el).onclick = () => {
        if (mode === 'defi') {
          R = blank();
          paint.classList.remove('folded');
          drawGrids();
        } else {
          reset();
          drawGrids();
        }
      };
      M.$('.geo-pfold', el).onclick = () => {
        const f = paint.classList.toggle('folded');
        M.sfx.hop();
        pmsg.textContent = f ? 'Plié ! Les cases de droite se posent-elles sur celles de gauche ?' : '';
      };
      M.$('.geo-pcheck', el).onclick = () => {
        if (!target) return;
        paint.classList.remove('folded');
        let miss = 0,
          extra = 0;
        M.$$('.geo-pc[data-s="r"]', paint).forEach((b) => {
          const r = +b.dataset.r,
            c = +b.dataset.c,
            want = target[r][c],
            got = R[r][c];
          if (want && got !== want) {
            miss++;
            b.classList.add('miss');
          } else if (!want && got) {
            extra++;
            b.classList.add('extra');
          }
        });
        if (!miss && !extra) {
          pmsg.innerHTML = "Parfait ! C'est exactement l'image miroir 🎉";
          M.sfx.good();
          M.confetti(30);
        } else {
          pmsg.innerHTML = `Presque ! ${miss ? `${miss} ${M.plural(miss, 'case')} à colorier (pointillés rouges)` : ''}${miss && extra ? ' et ' : ''}${extra ? `${extra} ${M.plural(extra, 'case')} en trop (cadre rouge)` : ''}. Vérifie aussi les couleurs.`;
          M.sfx.bad();
        }
      };
      reset();
      drawGrids();

      /* --- symétrique ou pas --- */
      const symq = M.$('.geo-symq', el);
      function newSym() {
        const pool = M.shuffle([
          ['papillon', 'v'],
          ['coeur', 'h'],
          ['rectangle', 'd1'],
          ['carre', 'd2'],
          ['poisson', 'h'],
          ['drapeau', 'v'],
          ['etoile', 'v'],
          ['maison', 'voff'],
          ['cercle', 'h'],
          ['eclair', 'v'],
          ['losange', 'h'],
          ['sapin', 'v'],
          ['triangle', 'h'],
        ]).slice(0, 4);
        symq.innerHTML = pool
          .map(
            (
              [k, a],
              i,
            ) => `<div class="l-tile" data-i="${i}" data-k="${k}" data-a="${a}"><div class="pic">${G.symSvg(k, a, { size: 130, color: PCOLORS[i % 4] })}</div>
          <div class="row"><button class="btn" data-v="oui">👍 Oui</button><button class="btn" data-v="non">👎 Non</button></div><div class="res"></div></div>`,
          )
          .join('');
      }
      symq.addEventListener('click', (e) => {
        const b = e.target.closest('[data-v]');
        if (!b) return;
        const t = b.closest('.l-tile'),
          k = t.dataset.k,
          a = t.dataset.a;
        const ok = G.SYM[k].axes.includes(a),
          right = (b.dataset.v === 'oui') === ok;
        M.$$('[data-v]', t).forEach((x) => (x.disabled = true));
        b.classList.add('on');
        M.$('.pic', t).innerHTML = G.symSvg(k, a, { size: 130, color: PCOLORS[+t.dataset.i % 4], ghost: true });
        M.$('.res', t).innerHTML =
          (right ? '✔️ Bravo ! ' : '✖️ Oups. ') +
          (ok ? "L'image miroir se pose exactement : c'est un axe." : "L'image miroir (pâle) ne se pose pas : ce n'est pas un axe.");
        right ? M.sfx.good() : M.sfx.bad();
      });
      M.$('.geo-symnew', el).onclick = newSym;
      newSym();

      /* --- frise --- */
      let mk = Object.keys(G.MOTIFS)[0],
        ftok = 0;
      const fb = M.$('.geo-fb', el),
        fbmsg = M.$('.geo-fbmsg', el);
      M.$('.geo-mpick', el).addEventListener('click', (e) => {
        const b = e.target.closest('.btn');
        if (!b) return;
        mk = b.dataset.k;
        ftok++;
        M.$$('.geo-mpick .btn', el).forEach((x) => x.classList.toggle('on', x === b));
        fb.innerHTML = G.motif(mk, '#ef476f', 'n', 52);
        fbmsg.textContent = '';
      });
      async function build(refl) {
        const my = ++ftok;
        fb.innerHTML = '';
        fbmsg.innerHTML = refl
          ? "Réflexion : le motif se retourne de l'autre côté de chaque axe rouge, comme dans un miroir."
          : 'Translation : le motif glisse, toujours dans le même sens.';
        for (let i = 0; i < 8; i++) {
          await M.sleep(300);
          if (!alive(fb) || my !== ftok) return;
          if (refl && i > 0) fb.insertAdjacentHTML('beforeend', '<i class="ax"></i>');
          fb.insertAdjacentHTML('beforeend', `<span>${G.motif(mk, '#ef476f', refl && i % 2 ? 'h' : 'n', 52)}</span>`);
          M.sfx.pop();
        }
      }
      M.$('.geo-ftr', el).onclick = () => build(false);
      M.$('.geo-frf', el).onclick = () => build(true);
      fb.innerHTML = G.motif(mk, '#ef476f', 'n', 52);
      M.onCleanup(() => {
        ftok++;
      });
    },
  });

  /* ===================================================================
     SE REPÉRER
     =================================================================== */
  M.registerLearn({
    id: 'reperage',
    domain: DOM,
    title: 'Se repérer',
    icon: '🧭',
    short: 'Gauche, droite, dessus, dessous… et le plan',
    intro:
      'Pour dire où est un objet, on utilise des mots de position : <b>gauche</b>, <b>droite</b>, <b>au-dessus</b>, <b>en dessous</b>, <b>devant</b>, <b>derrière</b>, <b>entre</b>, <b>à côté</b>. Sur un plan, on utilise une <b>lettre</b> et un <b>chiffre</b>.',
    render(el) {
      const row = M.shuffle(G.ANIMAUX).slice(0, 5);
      el.innerHTML = `
        <section class="l-sec"><h2>👈 Gauche et droite 👉</h2>
          <p>On regarde toujours l'écran : <b>ta gauche</b> et <b>ta droite</b>.</p>
          <div class="callout">🦫 <b>Truc de Castor :</b> lève tes deux mains devant toi, paumes vers l'écran. Le pouce et l'index de ta main <b>gauche</b> font un vrai <b>L</b> !</div>
          <p>Touche un animal pour savoir où il est.</p>
          <div class="geo-row geo-lrrow">${row.map((a, i) => `<div class="geo-slot" data-i="${i}">${a.e}</div>`).join('')}</div>
          <div class="geo-lr"><span>👈 ta gauche</span><span>ta droite 👉</span></div>
          <div class="viz-status geo-lrmsg" style="text-align:center"></div>
        </section>
        <section class="l-sec"><h2>📍 Les mots de position</h2>
          <div class="l-grid geo-pos">
            <div class="l-tile"><div class="scene" style="flex-direction:column;line-height:1.1"><span>🎈</span><span>🐶</span></div><h3>Au-dessus</h3><p>Le ballon est <b>au-dessus</b> du chien.</p></div>
            <div class="l-tile"><div class="scene" style="flex-direction:column;line-height:1.1"><span>☂️</span><span>🐱</span></div><h3>En dessous</h3><p>Le chat est <b>en dessous</b> du parapluie.</p></div>
            <div class="l-tile"><div class="scene">${G.svg(140, 110, '<text x="78" y="52" font-size="40" text-anchor="middle">🐰</text><text x="70" y="98" font-size="80" text-anchor="middle">🌳</text><text x="54" y="106" font-size="46" text-anchor="middle">🦊</text>', { width: 140 })}</div><h3>Devant, derrière</h3><p>Le renard est <b>devant</b> l'arbre. Le lapin est <b>derrière</b> : on le voit à moitié.</p></div>
            <div class="l-tile"><div class="scene">🐷🐸🐮</div><h3>Entre</h3><p>La grenouille est <b>entre</b> le cochon et la vache.</p></div>
            <div class="l-tile"><div class="scene">🐰🥕</div><h3>À côté</h3><p>La carotte est <b>à côté</b> du lapin : tout près, collée.</p></div>
          </div>
        </section>
        <section class="l-sec"><h2>🗺️ Le castor sur le plan</h2>
          <p>Chaque case a un nom : d'abord la <b>lettre</b> de la colonne (en bas), puis le <b>chiffre</b> de la rangée (sur le côté). Déplace le castor avec les flèches !</p>
          <div class="geo-mission"></div>
          <div class="geo-plan-wrap"></div>
          <div class="geo-arrows">
            <button class="btn up" data-d="0,1" title="Haut">⬆️</button>
            <button class="btn left" data-d="-1,0" title="Gauche">⬅️</button>
            <button class="btn down" data-d="0,-1" title="Bas">⬇️</button>
            <button class="btn right" data-d="1,0" title="Droite">➡️</button>
          </div>
          <div class="viz-status geo-pmsg2" style="text-align:center"></div>
          <div class="row" style="justify-content:center"><button class="btn blue geo-newm">🎯 Nouvelle mission</button></div>
          <div class="callout">🦫 Dans « C4 », la lettre <b>C</b> dit la colonne et le chiffre <b>4</b> dit la rangée. On écrit toujours la lettre en premier.</div>
        </section>`;

      /* --- rangée d'animaux --- */
      const lrmsg = M.$('.geo-lrmsg', el);
      M.$('.geo-lrrow', el).addEventListener('click', (e) => {
        const s = e.target.closest('.geo-slot');
        if (!s) return;
        const i = +s.dataset.i,
          a = row[i];
        M.$$('.geo-lrrow .geo-slot', el).forEach((x, k) => {
          x.classList.toggle('ref', k === i);
          x.classList.toggle('ans', k === i - 1 || k === i + 1);
        });
        let t = `${cap(a.n)} ${a.e} : `;
        if (i === 0) t += `personne à gauche 👈. Juste à droite 👉 : ${row[1].n} ${row[1].e}.`;
        else if (i === 4) t += `personne à droite 👉. Juste à gauche 👈 : ${row[3].n} ${row[3].e}.`;
        else
          t += `${a.n.startsWith('la') ? 'elle' : 'il'} est <b>entre</b> ${row[i - 1].n} ${row[i - 1].e} (à gauche) et ${row[i + 1].n} ${row[i + 1].e} (à droite).`;
        lrmsg.innerHTML = t;
        M.sfx.tap();
        M.say(M.text(t));
      });

      /* --- plan + castor --- */
      const wrap = M.$('.geo-plan-wrap', el),
        mission = M.$('.geo-mission', el),
        pmsg = M.$('.geo-pmsg2', el);
      const pos = [0, 1];
      let goal = null,
        moves = 0;
      function draw() {
        const items = {};
        if (goal) items[goal.cell] = goal.o.e;
        items[G.cell(pos[0], pos[1])] = '🦫';
        wrap.innerHTML = G.planHtml(items);
      }
      function newMission() {
        let c, r;
        do {
          c = M.rnd(0, 4);
          r = M.rnd(1, 5);
        } while (c === pos[0] && r === pos[1]);
        goal = { cell: G.cell(c, r), o: M.pick(G.PLAN_ITEMS) };
        moves = 0;
        mission.innerHTML = `🎯 Va chercher ${goal.o.n} ${goal.o.e} dans la case <b>${goal.cell}</b> !`;
        pmsg.innerHTML = `Le castor 🦫 est dans la case <b>${G.cell(pos[0], pos[1])}</b>.`;
        draw();
        M.say(`Va chercher ${goal.o.n} dans la case ${goal.cell[0]} ${goal.cell.slice(1)} !`);
      }
      function move(dx, dy) {
        const c = pos[0] + dx,
          r = pos[1] + dy;
        if (c < 0 || c > 4 || r < 1 || r > 5) {
          M.sfx.bad();
          pmsg.innerHTML = "Oups, c'est le bord du plan !";
          return;
        }
        pos[0] = c;
        pos[1] = r;
        moves++;
        M.sfx.hop();
        const here = G.cell(c, r);
        if (goal && here === goal.cell) {
          pmsg.innerHTML = `Bravo ! Le castor a trouvé ${goal.o.n} ${goal.o.e} en <b>${here}</b> en ${moves} pas 🎉`;
          M.sfx.good();
          M.confetti(30);
          M.say('Bravo !');
          goal = null;
          mission.innerHTML = '🎉 Mission réussie ! Touche « Nouvelle mission ».';
        } else pmsg.innerHTML = `Le castor 🦫 est dans la case <b>${here}</b>.`;
        draw();
      }
      M.$('.geo-arrows', el).addEventListener('click', (e) => {
        const b = e.target.closest('[data-d]');
        if (!b) return;
        const [dx, dy] = b.dataset.d.split(',').map(Number);
        move(dx, dy);
      });
      wrap.addEventListener('click', (e) => {
        const c = e.target.closest('.geo-cell');
        if (!c) return;
        const k = c.dataset.cell;
        pmsg.innerHTML = `Cette case s'appelle <b>${k}</b> : colonne ${k[0]}, rangée ${k.slice(1)}.`;
        M.sfx.tap();
        M.say(`${k[0]} ${k.slice(1)}`);
      });
      function onKey(e) {
        if (!alive(wrap)) return;
        const d = { ArrowUp: [0, 1], ArrowDown: [0, -1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
        if (!d) return;
        e.preventDefault();
        move(d[0], d[1]);
      }
      document.addEventListener('keydown', onKey);
      M.onCleanup(() => document.removeEventListener('keydown', onKey));
      M.$('.geo-newm', el).onclick = newMission;
      newMission();
    },
  });
})();
