/* =====================================================================
   learn/mesure.js — Pages « Apprendre » : mesurer, l'heure, le calendrier
   Réutilise les dessins de M.mesure (js/skills/mesure.js)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const X = M.mesure;
  if (!X) return;
  const D = 'mesure';

  try {
    M.css(`
    .me-say { padding: 4px 10px; font-size: 1.1rem }
    .me-big { font-size: 1.25rem; font-weight: 900; margin: 8px 0; min-height: 1.5em; text-align: center }
    .me-phrase { font-size: 1.3rem; font-weight: 900; color: #04805f; text-align: center; min-height: 1.6em; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap }
    .me-two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: center }
    @media (max-width: 760px) { .me-two { grid-template-columns: 1fr } }
    .me-tl { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px }
    .me-tl .me-tile { min-height: 74px; cursor: pointer }
    .me-tl .me-tile b { font-size: .95rem }
    .me-reveal { cursor: pointer }
    .me-reveal .ans { display: none; color: #04805f; font-weight: 900; margin-top: 4px }
    .me-reveal.open .ans { display: block }
    .me-reveal.open .q { color: #7a7f99 }
    .me-wheel .seg { cursor: pointer; stroke: #fff; stroke-width: 3; transition: opacity .15s }
    .me-wheel .seg:hover { opacity: .85 }
    .me-wheel .seg.on { stroke: #2b2d42; stroke-width: 4 }
    .me-wheel text { pointer-events: none }
    .me-mpanel { background: #fbfaf6; border: 3px solid #e7e1d3; border-radius: 18px; padding: 12px 14px; min-height: 140px }
    .me-mpanel h3 { margin: 0 0 6px; font-size: 1.3rem }
    .me-mpanel ul { margin: 6px 0 0; padding-left: 0; list-style: none }
    .me-mpanel li { margin: 4px 0; font-weight: 700 }
    .me-calnav { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 6px }
    `);
  } catch (e) {}

  const sayBtn = (cls) => `<button class="btn icon me-say ${cls || ''}" title="Écouter">🔊</button>`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* =====================================================================
     Page 1 — Mesurer des longueurs
     ===================================================================== */
  /* Empreinte de pied horizontale (talon à gauche) de longueur w */
  function footSvg(x, y, w, color) {
    const r = w / 2 - 3;
    let s = `<ellipse cx="${x + w / 2 - 4}" cy="${y + 18}" rx="${r - 4}" ry="13" fill="${color}"/>`;
    const toes = [
      [0.88, 6, 6],
      [0.95, 13, 5],
      [0.97, 20, 4.5],
      [0.93, 26, 4],
      [0.86, 31, 3.5],
    ];
    toes.forEach(([fx, dy, rr]) => {
      s += `<circle cx="${x + w * fx}" cy="${y + dy}" r="${rr}" fill="${color}"/>`;
    });
    return s;
  }
  function feetSection(sec) {
    const K = 4,
      X0 = 20,
      TL = 120; // 4 px par cm, table de 120 cm
    const W = X0 * 2 + TL * K,
      H = 150;
    const table =
      `<rect x="${X0}" y="20" width="${TL * K}" height="22" rx="4" fill="#b07a46" stroke="#7a4f27" stroke-width="2"/>` +
      `<rect x="${X0 + 14}" y="42" width="14" height="40" fill="#8c5c30"/><rect x="${X0 + TL * K - 28}" y="42" width="14" height="40" fill="#8c5c30"/>`;
    const host = M.$('.me-feet', sec);
    const st = M.$('.viz-status', sec);
    const draw = (inner) => {
      host.innerHTML = X.svg(W, H, table + `<g class="me-fg">${inner || ''}</g>`, { max: W });
    };
    draw();
    const modes = {
      papa: { w: 30, c: '#118ab2', who: 'les pieds de papa', n: 4, unit: 'pieds' },
      leo: { w: 20, c: '#ef476f', who: 'les pieds de Léo', n: 6, unit: 'pieds' },
    };
    const results = {};
    async function run(k) {
      const alive = X.claim(host);
      if (k === 'cm') {
        draw();
        const g = M.$('.me-fg', host);
        for (let i = 0; i <= 12; i++) {
          if (!g || !(await X.wait(alive, 120))) return;
          X.addSvg(
            g,
            `<line x1="${X0 + i * 40}" y1="96" x2="${X0 + i * 40}" y2="${i % 5 === 0 ? 116 : 108}" stroke="#2b2d42" stroke-width="2"/>` +
              (i
                ? `<text x="${X0 + i * 40}" y="134" class="me-t mid small">${i * 10}</text>`
                : `<text x="${X0}" y="134" class="me-t mid small">0</text>`),
          );
        }
        X.addSvg(
          g,
          `<line x1="${X0}" y1="96" x2="${X0 + TL * K}" y2="96" stroke="#2b2d42" stroke-width="3"/><text x="${X0 + TL * K}" y="148" class="me-t" text-anchor="end">120 cm</text>`,
        );
        results.cm = true;
        st.innerHTML = "Avec une règle, tout le monde trouve <b>120 cm</b> : c'est la même unité pour tous !";
        M.say('Avec une règle, tout le monde trouve 120 centimètres.');
        return;
      }
      const m = modes[k];
      draw();
      const g = M.$('.me-fg', host);
      for (let i = 0; i < m.n; i++) {
        if (!g || !(await X.wait(alive, 380))) return;
        X.addSvg(
          g,
          footSvg(X0 + i * m.w * K, 96, m.w * K, i % 2 ? m.c : m.c + 'bb') +
            `<text x="${X0 + i * m.w * K + (m.w * K) / 2}" y="144" class="me-t mid">${i + 1}</text>`,
        );
        M.sfx.pop();
      }
      results[k] = m.n;
      st.innerHTML =
        `Avec ${m.who}, la table mesure <b>${m.n} pieds</b>.` +
        (results.papa && results.leo ? " Papa trouve 4, Léo trouve 6… mais c'est la même table ! 🤔" : '');
      M.say(`Avec ${m.who}, la table mesure ${m.n} pieds.`);
    }
    M.$('.me-feet-btns', sec).onclick = (e) => {
      const b = e.target.closest('button[data-k]');
      if (b) {
        M.sfx.tap();
        run(b.dataset.k);
      }
    };
  }

  /* --- Règle manipulable --- */
  function rulerSection(sec) {
    const RX = 26,
      PX = 40,
      RN = 15,
      RY = 74;
    const W = RX * 2 + RN * PX,
      H = RY + 64;
    const host = M.$('.me-rul', sec),
      out = M.$('.me-rul-out', sec);
    let s = 0,
      L = 6,
      count = false;
    const color = '#9b5de5';
    host.innerHTML = X.svg(W, H, X.rulerSvg(RX, RY, RN, PX) + '<g class="me-cnt"></g><g class="me-objg"></g>', { max: W });
    const svgEl = M.$('svg', host),
      og = M.$('.me-objg', host),
      cg = M.$('.me-cnt', host);
    svgEl.style.touchAction = 'none';
    function draw() {
      const x = RX + s * PX,
        y = RY - 40,
        len = L * PX;
      og.innerHTML =
        `<g class="me-body" style="cursor:grab">${X.objSvg('crayon', x, y, len, color, 28)}<rect x="${x}" y="${y - 6}" width="${len}" height="40" fill="transparent"/></g>` +
        `<line x1="${x}" y1="${y + 30}" x2="${x}" y2="${RY}" stroke="#f78c40" stroke-width="2" stroke-dasharray="4 3"/>` +
        `<line x1="${x + len}" y1="${y + 30}" x2="${x + len}" y2="${RY}" stroke="#f78c40" stroke-width="2" stroke-dasharray="4 3"/>` +
        `<g class="me-handle" style="cursor:ew-resize"><circle cx="${x + len}" cy="${y - 14}" r="14" fill="#ffd166" stroke="#e9b949" stroke-width="3"/><text x="${x + len}" y="${y - 9}" class="me-t mid" style="font-size:14px">↔</text></g>`;
      cg.innerHTML = count
        ? M.range(0, L - 1)
            .map(
              (i) =>
                `<rect x="${RX + (s + i) * PX + 2}" y="${RY + 1}" width="${PX - 4}" height="20" rx="4" fill="#06a77d" opacity=".85"/><text x="${RX + (s + i) * PX + PX / 2}" y="${RY + 16}" class="me-mk">${i + 1}</text>`,
            )
            .join('')
        : '';
      out.innerHTML =
        s === 0
          ? `Le crayon commence à <b>0</b> et finit à <b>${L}</b> : il mesure <b>${L} cm</b>.`
          : `Le crayon va de <b>${s}</b> à <b>${s + L}</b> : ${s + L} − ${s} = <b>${L} cm</b>.`;
    }
    draw();
    let mode = null,
      grab = 0;
    const cmAt = (e) => {
      const p = X.svgPoint(svgEl, e);
      return p ? (p.x - RX) / PX : null;
    };
    svgEl.addEventListener('pointerdown', (e) => {
      const c = cmAt(e);
      if (c == null) return;
      if (e.target.closest('.me-handle')) mode = 'size';
      else if (e.target.closest('.me-body')) {
        mode = 'move';
        grab = c - s;
      } else return;
      try {
        svgEl.setPointerCapture(e.pointerId);
      } catch (err) {}
      e.preventDefault();
    });
    svgEl.addEventListener('pointermove', (e) => {
      if (!mode) return;
      const c = cmAt(e);
      if (c == null) return;
      if (mode === 'move') {
        const ns = clamp(Math.round(c - grab), 0, RN - L);
        if (ns !== s) {
          s = ns;
          M.sfx.tap();
          draw();
        }
      } else {
        const nl = clamp(Math.round(c) - s, 1, RN - s);
        if (nl !== L) {
          L = nl;
          M.sfx.tap();
          draw();
        }
      }
    });
    const stop = () => {
      mode = null;
    };
    svgEl.addEventListener('pointerup', stop);
    svgEl.addEventListener('pointercancel', stop);
    M.$('.me-rul-btns', sec).onclick = (e) => {
      const b = e.target.closest('button[data-a]');
      if (!b) return;
      const a = b.dataset.a;
      if (a === 'left') s = Math.max(0, s - 1);
      else if (a === 'right') s = Math.min(RN - L, s + 1);
      else if (a === 'grow') L = Math.min(RN - s, L + 1);
      else if (a === 'shrink') L = Math.max(1, L - 1);
      else if (a === 'zero') s = 0;
      else if (a === 'count') {
        count = !count;
        b.classList.toggle('on', count);
      } else if (a === 'say') {
        M.say(
          s === 0
            ? `Le crayon commence à zéro et finit à ${L}. Il mesure ${L} centimètres.`
            : `Le crayon va de ${s} à ${s + L}. Il mesure ${L} centimètres.`,
        );
        return;
      }
      M.sfx.tap();
      draw();
    };
  }

  /* --- 10 cm = 1 dm ; 10 dm = 1 m --- */
  function dmSection(sec) {
    const host = M.$('.me-dm', sec),
      st = M.$('.me-dm-out', sec);
    const CW = 34;
    let n = 0;
    function draw() {
      let s = '';
      for (let i = 0; i < n; i++)
        s += `<rect x="${10 + i * CW}" y="20" width="${CW}" height="${CW}" fill="${i % 2 ? '#3fd3a7' : '#06a77d'}" stroke="#04805f" stroke-width="1.5"/><text x="${10 + i * CW + CW / 2}" y="${20 + CW / 2 + 5}" class="me-mk">${i + 1}</text>`;
      for (let i = n; i < 10; i++)
        s += `<rect x="${10 + i * CW + 2}" y="22" width="${CW - 4}" height="${CW - 4}" fill="none" stroke="#c7c2b4" stroke-width="2" stroke-dasharray="4 3"/>`;
      if (n === 10)
        s += `<rect x="8" y="18" width="${10 * CW + 4}" height="${CW + 4}" rx="4" fill="none" stroke="#f78c40" stroke-width="4"/><text x="${10 + 5 * CW}" y="${CW + 44}" class="me-t mid big">1 dm = 10 cm</text>`;
      host.innerHTML = X.svg(10 * CW + 20, CW + 56, s, { max: 10 * CW + 20 });
      st.innerHTML = n === 10 ? '🎉 Bravo ! <b>10 centimètres = 1 décimètre</b>.' : `${n} ${M.plural(n, 'centimètre')}`;
    }
    draw();
    M.$('.me-dm-btns', sec).onclick = async (e) => {
      const b = e.target.closest('button[data-a]');
      if (!b) return;
      if (b.dataset.a === 'add') {
        if (n < 10) {
          n++;
          M.sfx.pop();
          draw();
          if (n === 10) {
            M.sfx.good();
            M.say('Dix centimètres égale un décimètre !');
          }
        }
      } else if (b.dataset.a === 'reset') {
        n = 0;
        M.sfx.tap();
        draw();
      } else if (b.dataset.a === 'm') showMeter();
    };
    const mHost = M.$('.me-m', sec),
      mOut = M.$('.me-m-out', sec);
    async function showMeter() {
      const alive = X.claim(mHost);
      const R = 56,
        x0 = 10;
      mHost.innerHTML = X.svg(x0 * 2 + R * 10, 80, '<g class="me-mg"></g>', { max: 640 });
      const g = M.$('.me-mg', mHost);
      for (let i = 0; i < 10; i++) {
        if (!g || !(await X.wait(alive, 260))) return;
        let s = '';
        for (let j = 0; j < 10; j++)
          s += `<rect x="${x0 + i * R + j * (R / 10)}" y="10" width="${R / 10}" height="26" fill="${(i + j) % 2 ? '#3fd3a7' : '#06a77d'}"/>`;
        s += `<rect x="${x0 + i * R}" y="10" width="${R}" height="26" fill="none" stroke="#04805f" stroke-width="2"/><text x="${x0 + (i + 1) * R}" y="54" class="me-t mid small">${(i + 1) * 10}</text>`;
        X.addSvg(g, s);
        M.sfx.pop();
        mOut.innerHTML = `${i + 1} dm = ${(i + 1) * 10} cm`;
      }
      X.addSvg(g, `<text x="${x0 + 5 * R}" y="76" class="me-t mid">1 m = 10 dm = 100 cm</text>`);
      mOut.innerHTML = '🎉 <b>1 mètre = 10 décimètres = 100 centimètres</b>';
      M.say('Un mètre égale dix décimètres, ou cent centimètres.');
    }
  }

  M.registerLearn({
    id: 'mesurer',
    domain: D,
    title: 'Mesurer des longueurs',
    icon: '📏',
    short: 'Même unité, la règle, cm, dm et m',
    intro:
      "Mesurer, c'est trouver combien de fois une unité entre dans une longueur. Pour que tout le monde trouve la même réponse, on utilise la même unité : le centimètre, le décimètre ou le mètre.",
    render(el) {
      el.innerHTML = `
      <section class="l-sec me-s1"><h2>🦶 Pourquoi utiliser la même unité ?</h2>
        <p>Léo et son papa mesurent <b>la même table</b> avec leurs pieds, placés bout à bout. Essaie les trois façons !</p>
        <div class="me-feet viz-box"></div>
        <div class="row me-feet-btns">
          <button class="btn" data-k="papa">🦶 Pieds de papa</button>
          <button class="btn" data-k="leo">👣 Pieds de Léo</button>
          <button class="btn primary" data-k="cm">📏 Avec une règle</button>
        </div>
        <div class="viz-status"></div>
        <div class="callout">🦫 <b>Castor t'explique :</b> les pieds de papa sont plus longs, alors il en faut <b>moins</b>. Les pieds de Léo sont plus petits, alors il en faut <b>plus</b>. Pour que tout le monde trouve le même nombre, on utilise une unité qui est pareille pour tous : le <b>centimètre</b> !</div>
      </section>

      <section class="l-sec me-s2"><h2>📏 Lire une règle</h2>
        <p>Glisse le crayon ou tire la poignée jaune ↔ pour changer sa longueur. Tu peux aussi utiliser les boutons.</p>
        <div class="me-rul viz-box"></div>
        <div class="row me-rul-btns">
          <button class="btn" data-a="left">◀ Gauche</button>
          <button class="btn" data-a="right">Droite ▶</button>
          <button class="btn" data-a="shrink">➖ Plus court</button>
          <button class="btn" data-a="grow">➕ Plus long</button>
          <button class="btn" data-a="zero">↩ Au 0</button>
          <button class="btn" data-a="count">🔢 Compter les cm</button>
          <button class="btn icon" data-a="say" title="Écouter">🔊</button>
        </div>
        <div class="me-big me-rul-out"></div>
        <div class="callout">🦫 <b>Truc de Castor :</b> place le bout de l'objet sur le <b>0</b>, puis lis le nombre à l'autre bout. Si l'objet ne commence pas au 0, compte les <b>espaces</b> entre les traits (pas les traits !).</div>
      </section>

      <section class="l-sec me-s3"><h2>🧱 10 cm = 1 dm et 10 dm = 1 m</h2>
        <p>Ajoute des petits cubes de <b>1 cm</b>, un à la fois, pour fabriquer une réglette.</p>
        <div class="me-dm viz-box"></div>
        <div class="row me-dm-btns">
          <button class="btn primary" data-a="add">➕ Ajoute 1 cm</button>
          <button class="btn" data-a="reset">↺ Recommencer</button>
          <button class="btn blue" data-a="m">📏 Fabriquer 1 mètre</button>
        </div>
        <div class="me-big me-dm-out"></div>
        <div class="me-m"></div>
        <div class="me-big me-m-out"></div>
        <div class="l-grid">
          <div class="l-tile"><div style="font-size:2rem">▪️</div><h3>1 cm</h3>un centimètre<br><span class="muted">la largeur de ton petit doigt</span></div>
          <div class="l-tile"><div style="font-size:2rem">✋</div><h3>1 dm = 10 cm</h3>un décimètre<br><span class="muted">à peu près la largeur de ta main</span></div>
          <div class="l-tile"><div style="font-size:2rem">🚶</div><h3>1 m = 100 cm</h3>un mètre<br><span class="muted">un grand pas d'adulte</span></div>
        </div>
        <div class="callout green">🦫 Petit objet ➜ <b>centimètres</b> (un crayon). Très grand ➜ <b>mètres</b> (une porte, un autobus). Le décimètre est entre les deux.</div>
      </section>

      <section class="l-sec me-s4"><h2>🏠 Trouve dans ta maison</h2>
        <p>Devine d'abord, puis touche la carte pour voir la réponse. Ensuite, vérifie avec une vraie règle ou un ruban à mesurer !</p>
        <div class="l-grid me-est">
          ${[
            ['✏️', 'Un crayon neuf', 'environ 15 cm'],
            ['🚪', "La hauteur d'une porte", 'environ 2 m'],
            ['📎', 'Un trombone', 'environ 3 cm'],
            ['🛏️', 'Ton lit', 'environ 2 m'],
            ['🥄', 'Une cuillère', 'environ 15 cm (ou 1 dm et demi)'],
            ['🧒', 'Toi !', 'un peu plus de 1 m'],
          ]
            .map(
              ([e, t, a]) =>
                `<div class="l-tile me-reveal" role="button" tabindex="0" data-say="${M.esc(t + ' : ' + a)}"><div style="font-size:2.2rem">${e}</div><h3 class="q">${t}</h3><div>Combien ? 🤔</div><div class="ans">${a}</div></div>`,
            )
            .join('')}
        </div>
        <div class="callout">🦫 <b>Défi :</b> trouve dans ta maison un objet qui mesure environ <b>1 cm</b>, un autre d'environ <b>1 dm</b> et un autre d'environ <b>1 m</b>. Mesure-les pour vérifier !</div>
      </section>`;
      feetSection(M.$('.me-s1', el));
      rulerSection(M.$('.me-s2', el));
      dmSection(M.$('.me-s3', el));
      const est = M.$('.me-est', el);
      const flip = (t) => {
        t.classList.toggle('open');
        M.sfx.tap();
        if (t.classList.contains('open')) M.say(t.dataset.say);
      };
      est.onclick = (e) => {
        const t = e.target.closest('.me-reveal');
        if (t) flip(t);
      };
      est.onkeydown = (e) => {
        const t = e.target.closest('.me-reveal');
        if (t && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          flip(t);
        }
      };
    },
  });

  /* =====================================================================
     Page 2 — L'heure
     ===================================================================== */
  M.registerLearn({
    id: 'heure',
    domain: D,
    title: "Lire l'heure",
    icon: '🕒',
    short: 'Les aiguilles, et quart, et demie, ma journée',
    intro:
      "L'horloge a deux aiguilles. La petite aiguille montre les heures. La grande aiguille montre les minutes. Joue avec l'horloge pour apprendre à lire l'heure !",
    render(el) {
      const keyTimes = [
        [3, 0, 'heure juste'],
        [3, 15, 'et quart'],
        [3, 30, 'et demie'],
        [3, 45, 'moins le quart'],
      ];
      const day = [
        [7, 0, '⏰', 'Je me lève'],
        [8, 0, '🏫', "L'école commence"],
        [11, 30, '🥪', 'Le dîner'],
        [15, 15, '🎒', "Fin de l'école"],
        [17, 30, '🍝', 'Le souper'],
        [19, 30, '😴', 'Dodo'],
      ];
      el.innerHTML = `
      <section class="l-sec me-h1"><h2>🔴🔵 Les deux aiguilles</h2>
        <div class="l-grid">
          <div class="l-tile">${X.clockSvg(4, 0, { size: 170, hl: 'h' })}<h3>🔴 La petite aiguille</h3>Elle montre les <b>heures</b>. Elle avance lentement, d'un nombre au suivant en 1 heure.</div>
          <div class="l-tile">${X.clockSvg(4, 0, { size: 170, hl: 'm' })}<h3>🔵 La grande aiguille</h3>Elle montre les <b>minutes</b>. Elle fait un tour complet en 1 heure (60 minutes).</div>
        </div>
        <div class="callout">🦫 Quand la grande aiguille est sur le <b>12</b>, c'est une <b>heure juste</b> : on lit seulement la petite aiguille. Ici, il est <b>4 h</b>, quatre heures.</div>
      </section>

      <section class="l-sec me-h2"><h2>🕹️ Joue avec l'horloge</h2>
        <p>Utilise les boutons ou glisse la grande aiguille avec ton doigt.</p>
        <div class="me-two">
          <div class="me-hw"></div>
          <div>
            <div class="me-phrase"><span class="me-hp"></span>${sayBtn('me-hsay')}</div>
            <div class="row me-hq" style="justify-content:center">
              <button class="btn" data-m="0">heure juste</button>
              <button class="btn" data-m="15">et quart</button>
              <button class="btn" data-m="30">et demie</button>
              <button class="btn" data-m="45">moins le quart</button>
              <button class="btn me-htog">🔢 Les minutes</button>
            </div>
            <div class="callout blue">🦫 La grande aiguille compte par <b>5</b> : sur le 1, c'est 5 minutes; sur le 2, 10 minutes; sur le 3, 15 minutes…</div>
          </div>
        </div>
      </section>

      <section class="l-sec me-h3"><h2>⭐ Les moments à connaître</h2>
        <p>Touche une horloge pour l'entendre.</p>
        <div class="l-grid me-hk">
          ${keyTimes.map(([h, m, t], i) => `<button class="l-tile me-tile" data-i="${i}">${X.clockSvg(h, m, { size: 140 })}<b class="me-dig">${X.fmt(h, m)}</b><span>${X.timeWords(h, m)}</span><small>${t}</small></button>`).join('')}
        </div>
        <div class="callout">🦫 <b>Attention au piège !</b> À 3 h 30, la petite aiguille n'est pas sur le 3 : elle est <b>entre le 3 et le 4</b>, au milieu. À 3 h 45, elle est presque sur le 4 : on dit « quatre heures moins le quart ».</div>
      </section>

      <section class="l-sec me-h4"><h2>🌞 Ma journée</h2>
        <p>Touche un moment de la journée pour voir l'heure sur l'horloge.</p>
        <div class="me-tl me-day">${day.map(([h, m, e, t], i) => `<button class="me-tile" data-i="${i}"><span class="me-em">${e}</span><b>${t}</b><small class="me-dig">${X.fmt(h, m)}</small></button>`).join('')}</div>
        <div class="me-two" style="margin-top:12px">
          <div class="me-dw"></div>
          <div><div class="me-phrase me-dp"></div><div class="me-big me-dx muted"></div></div>
        </div>
        <div class="callout">🦫 Au Québec, on peut écrire les heures de l'après-midi avec <b>13 h, 14 h, 15 h…</b> Par exemple, <b>15 h 15</b>, c'est 3 h 15 de l'après-midi. Midi, c'est <b>12 h</b>.</div>
      </section>

      <section class="l-sec me-h5"><h2>⏳ Combien de temps ?</h2>
        <div class="l-grid">
          <div class="l-tile"><div style="font-size:2rem">⚡</div><h3>1 seconde</h3>Le temps de cligner des yeux.</div>
          <div class="l-tile"><div style="font-size:2rem">⏱️</div><h3>1 minute = 60 secondes</h3>Le temps de mettre tes bottes.</div>
          <div class="l-tile"><div style="font-size:2rem">🕐</div><h3>1 heure = 60 minutes</h3>Un cours de natation.</div>
          <div class="l-tile"><div style="font-size:2rem">☀️🌙</div><h3>1 jour = 24 heures</h3>Le jour et la nuit.</div>
        </div>
        <div class="me-two" style="margin-top:12px">
          <div class="me-hrw"></div>
          <div><button class="btn primary big me-hrgo">▶ Regarder 1 heure passer</button><div class="me-big me-hrout"></div></div>
        </div>
        <div class="callout">🦫 Pendant <b>1 heure</b>, la grande aiguille fait <b>un tour complet</b>, et la petite aiguille avance seulement <b>d'un nombre</b>.</div>
      </section>`;

      /* Horloge à manipuler */
      const hp = M.$('.me-hp', el);
      let cur = [3, 0];
      const w = X.clockWidget(M.$('.me-hw', el), {
        t: 3 * 60,
        ring: true,
        size: 300,
        buttons: [-60, 60, -5, 5, 15],
        onChange: (h, m) => {
          cur = [h, m];
          hp.textContent = X.phrase(h, m) + '.';
        },
      });
      M.$('.me-hsay', el).onclick = () => M.say(X.phrase(cur[0], cur[1]));
      const mins = M.$('.me-hw .me-mins', el);
      M.$('.me-hq', el).onclick = (e) => {
        if (e.target.closest('.me-htog')) {
          if (mins) mins.style.display = mins.style.display === 'none' ? '' : 'none';
          M.sfx.tap();
          return;
        }
        const b = e.target.closest('button[data-m]');
        if (!b) return;
        const t = w.get();
        w.set(Math.floor(t / 60) * 60 + +b.dataset.m);
        M.sfx.tap();
        M.say(X.phrase(cur[0], cur[1]));
      };

      /* Moments clés */
      M.$('.me-hk', el).onclick = (e) => {
        const b = e.target.closest('button[data-i]');
        if (!b) return;
        const [h, m] = keyTimes[+b.dataset.i];
        M.say(X.phrase(h, m));
      };

      /* Ma journée (24 h) */
      const dp = M.$('.me-dp', el),
        dx = M.$('.me-dx', el),
        dwHost = M.$('.me-dw', el);
      const dw = X.clockWidget(dwHost, { t: 7 * 60, day: true, buttons: [], size: 240 });
      const showDay = (h, m) => {
        dp.textContent = X.phrase(h, m, true) + '.';
        dx.textContent = h > 12 ? `${X.fmt(h, m)}, c'est ${X.fmt(h - 12, m)} ${h < 18 ? "de l'après-midi" : 'du soir'}.` : '';
      };
      showDay(7, 0);
      const dayStrip = M.$('.me-day', el);
      dayStrip.onclick = async (e) => {
        const b = e.target.closest('.me-tile');
        if (!b) return;
        M.$$('.me-tile', dayStrip).forEach((x) => x.classList.toggle('on', x === b));
        const [h, m, , t] = day[+b.dataset.i];
        const alive = X.claim(dwHost);
        M.say(`${t}. ${X.phrase(h, m, true)}.`);
        await dw.animateTo(h * 60 + m, alive, 'auto');
        if (alive()) showDay(h, m);
      };

      /* Une heure qui passe */
      const hrHost = M.$('.me-hrw', el),
        hrOut = M.$('.me-hrout', el);
      hrHost.innerHTML = X.clockSvg(2, 0, { size: 240 });
      M.$('.me-hrgo', el).onclick = async () => {
        const alive = X.claim(hrHost);
        X.setHands(hrHost, 120);
        hrOut.textContent = '2 h…';
        const ok = await X.tween(alive, 5000, (k) => {
          X.setHands(hrHost, 120 + 60 * k);
          hrOut.textContent = `${Math.floor(60 * k + 1e-6)} minutes`;
        });
        if (ok) {
          hrOut.innerHTML = '3 h : <b>1 heure</b> est passée ! (60 minutes)';
          M.sfx.good();
        }
      };
    },
  });

  /* =====================================================================
     Page 3 — Le calendrier
     ===================================================================== */
  const MONTH_EVENTS = [
    ["🥳 Le Jour de l'An (1<sup>er</sup> janvier)", '⛸️ On patine dehors'],
    ['❤️ La Saint-Valentin (14 février)', '⛄ Bonhommes de neige'],
    ['⛷️ La semaine de relâche (début mars)', '🍯 Le temps des sucres commence', '🌷 Le printemps commence (vers le 20 mars)'],
    ['🍯 Le temps des sucres', '🐣 Pâques (en mars ou en avril)'],
    ['💐 La fête des Mères', '🌱 On plante le jardin'],
    ["🏁 La fin de l'école", '⚜️ La Saint-Jean-Baptiste, fête nationale du Québec (24 juin)', "☀️ L'été commence (vers le 21 juin)"],
    ['🎆 La fête du Canada (1<sup>er</sup> juillet)', "🏖️ Les vacances d'été"],
    ['🏊 Les vacances continuent', '🎒 La rentrée scolaire (fin août)'],
    ['🍎 Les pommes au verger', "🍁 L'automne commence (vers le 22 septembre)"],
    ["🎃 L'Halloween (31 octobre)", '🍂 Les feuilles tombent'],
    ['🌨️ Les premiers flocons de neige'],
    ['🎄 Noël (25 décembre)', "❄️ L'hiver commence (vers le 21 décembre)"],
  ];
  const SEASON_COL = { printemps: '#bfeec0', été: '#ffe08a', automne: '#ffc49b', hiver: '#cfe8ff' };
  const MAB = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const seasonOf = (mo) => X.SEASONS.find((s) => s.months.includes(mo));
  function wheelSvg(cur) {
    const C = 170,
      R1 = 158,
      R0 = 62,
      rad = (d) => ((d - 90) * Math.PI) / 180;
    const pt = (r, d) => `${(C + r * Math.cos(rad(d))).toFixed(1)},${(C + r * Math.sin(rad(d))).toFixed(1)}`;
    let s = '';
    for (let i = 0; i < 12; i++) {
      const a0 = i * 30,
        a1 = a0 + 30,
        se = seasonOf(i);
      s += `<path class="seg${i === cur ? ' on' : ''}" data-m="${i}" d="M${pt(R0, a0)} L${pt(R1, a0)} A${R1},${R1} 0 0 1 ${pt(R1, a1)} L${pt(R0, a1)} A${R0},${R0} 0 0 0 ${pt(R0, a0)} Z" fill="${SEASON_COL[se.id]}"/>`;
      const am = a0 + 15;
      const [lx, ly] = pt(122, am).split(',');
      const [ex, ey] = pt(88, am).split(',');
      s += `<text x="${lx}" y="${+ly + 5}" class="me-t mid" style="font-size:15px">${MAB[i]}</text><text x="${ex}" y="${+ey + 7}" text-anchor="middle" style="font-size:18px">${MONTH_EVENTS[i][0].split(' ')[0]}</text>`;
    }
    s += `<circle cx="${C}" cy="${C}" r="${R0 - 4}" fill="#fff" stroke="#e7e1d3" stroke-width="3"/><text x="${C}" y="${C - 4}" class="me-t mid" style="font-size:30px">${seasonOf(cur).em}</text><text x="${C}" y="${C + 22}" class="me-t mid small me-wc">${seasonOf(cur).id}</text>`;
    return X.svg(C * 2, C * 2, s, { cls: 'me-wheel', max: 360 });
  }

  M.registerLearn({
    id: 'calendrier',
    domain: D,
    title: 'Le calendrier',
    icon: '📅',
    short: 'Jours, mois, saisons et fêtes du Québec',
    intro:
      'Le temps tourne en cycles : les jours de la semaine reviennent toutes les semaines, et les mois et les saisons reviennent chaque année.',
    render(el) {
      const today = new Date();
      const td = today.getDay(),
        tm = today.getMonth(),
        ty = today.getFullYear(),
        tdate = today.getDate();
      el.innerHTML = `
      <section class="l-sec me-c1"><h2>📆 Les 7 jours de la semaine</h2>
        <p>Touche un jour : ce sera « aujourd'hui ». Regarde hier et demain !</p>
        <div class="me-week"></div>
        <div class="me-phrase"><span class="me-wp"></span>${sayBtn('me-wsay')}</div>
        <div class="callout">🦫 Sur les calendriers du Québec, la semaine commence le <b>dimanche</b>. Samedi et dimanche, c'est la <b>fin de semaine</b>. Après samedi, on recommence : dimanche, lundi, mardi…</div>
      </section>

      <section class="l-sec me-c2"><h2>🍁 Les 12 mois et les 4 saisons</h2>
        <p>Touche un mois sur la roue pour découvrir sa saison et ses fêtes.</p>
        <div class="me-two">
          <div class="me-wh"></div>
          <div class="me-mpanel"></div>
        </div>
        <div class="l-grid" style="margin-top:12px">
          ${X.SEASONS.map((s) => `<div class="l-tile" style="background:${SEASON_COL[s.id]}"><div style="font-size:2rem">${s.em}</div><h3>${X.cap(s.id)}</h3><small>commence ${s.start}</small></div>`).join('')}
        </div>
        <div class="callout">🦫 Les saisons ne commencent pas le 1<sup>er</sup> du mois, mais <b>vers le 21</b>. Sur la roue, les couleurs montrent la saison de la plus grande partie du mois… à peu près !</div>
      </section>

      <section class="l-sec me-c3"><h2>🗓️ Le calendrier du mois</h2>
        <p>Touche une date : la colonne te dit quel jour de la semaine c'est. Aujourd'hui est en bleu.</p>
        <div class="me-calnav"><button class="btn me-prev" title="Mois d'avant">◀</button><button class="btn me-now">Aujourd'hui</button><button class="btn me-next" title="Mois d'après">▶</button></div>
        <div class="me-calbox"></div>
        <div class="me-phrase"><span class="me-cp"></span>${sayBtn('me-csay')}</div>
        <div class="callout">🦫 Pour trouver le jour d'une date, <b>monte tout droit</b> dans la colonne jusqu'au nom du jour, en haut.</div>
      </section>

      <section class="l-sec me-c4"><h2>🔁 Les cycles du temps</h2>
        <div class="l-grid">
          <div class="l-tile"><div style="font-size:2rem">🌅 ☀️ 🌇 🌙</div><h3>Chaque jour</h3>Le matin, le midi, le soir, la nuit… puis le soleil se lève encore. 1 jour = 24 heures.</div>
          <div class="l-tile"><div style="font-size:2rem">📅</div><h3>Chaque semaine</h3>7 jours : dimanche, lundi, mardi, mercredi, jeudi, vendredi, samedi.</div>
          <div class="l-tile"><div style="font-size:2rem">🎂</div><h3>Chaque année</h3>12 mois et 4 saisons. Ton anniversaire revient une fois par année !</div>
        </div>
      </section>`;

      /* Semaine */
      const wk = M.$('.me-week', el),
        wp = M.$('.me-wp', el);
      let cur = td;
      const drawWeek = () => {
        const y = (cur + 6) % 7,
          n = (cur + 1) % 7;
        wk.innerHTML = X.stripHtml(
          X.DAYS.map((d, i) => ({
            t: d,
            cls: (i === 0 || i === 6 ? 'we ' : '') + (i === cur ? 'today' : i === y ? 'y' : i === n ? 'on' : ''),
          })),
          7,
        );
        const tiles = M.$$('.me-tile', wk);
        X.badge(tiles[cur], "aujourd'hui");
        X.badge(tiles[y], 'hier');
        X.badge(tiles[n], 'demain');
        wp.innerHTML = `Si aujourd'hui c'est <b>${X.DAYS[cur]}</b>, hier c'était <b>${X.DAYS[y]}</b> et demain ce sera <b>${X.DAYS[n]}</b>.`;
      };
      drawWeek();
      wk.onclick = (e) => {
        const t = e.target.closest('.me-tile');
        if (!t) return;
        cur = +t.dataset.i;
        M.sfx.tap();
        drawWeek();
        M.say(M.text(wp.innerHTML));
      };
      M.$('.me-wsay', el).onclick = () => M.say(M.text(wp.innerHTML));

      /* Roue des mois */
      const wh = M.$('.me-wh', el),
        panel = M.$('.me-mpanel', el);
      const showMonth = (mo, speak) => {
        wh.innerHTML = wheelSvg(mo);
        const se = seasonOf(mo);
        panel.innerHTML = `<h3>${X.cap(X.MONTHS[mo])} ${se.em}</h3><div>${mo + 1}<sup>${mo ? 'e' : 'er'}</sup> mois de l'année · saison : <b>${se.id}</b>${mo === tm ? " · <b>c'est ce mois-ci !</b>" : ''}</div><ul>${MONTH_EVENTS[mo].map((x) => `<li>${x}</li>`).join('')}</ul>`;
        if (speak) M.say(`${X.MONTHS[mo]}. ${M.text(MONTH_EVENTS[mo].join('. ')).replace(/[^\p{L}\p{N}\s.,'’()-]/gu, '')}`);
      };
      showMonth(tm, false);
      wh.onclick = (e) => {
        const p = e.target.closest('.seg');
        if (!p) return;
        M.sfx.tap();
        showMonth(+p.dataset.m, true);
      };

      /* Calendrier du mois */
      const box = M.$('.me-calbox', el),
        cp = M.$('.me-cp', el);
      let vy = ty,
        vm = tm,
        lastSay = '';
      const drawCal = () => {
        box.innerHTML = X.calHtml(vy, vm, { today: vy === ty && vm === tm ? tdate : null });
        cp.textContent = '';
        lastSay = '';
      };
      drawCal();
      box.onclick = (e) => {
        const c = e.target.closest('td[data-d]');
        if (!c) return;
        const d = +c.dataset.d,
          col = +c.dataset.c;
        X.calMark(box, col, d);
        const isToday = vy === ty && vm === tm && d === tdate;
        cp.innerHTML = `${isToday ? "Aujourd'hui, le" : 'Le'} ${X.dateHtml(d)} ${X.MONTHS[vm]} ${vy}, c'est un <b>${X.DAYS[col]}</b>.`;
        lastSay = `${isToday ? "Aujourd'hui, le" : 'Le'} ${X.dateSay(d)} ${X.MONTHS[vm]} ${vy}, c'est un ${X.DAYS[col]}.`;
        M.sfx.tap();
        M.say(lastSay);
      };
      M.$('.me-prev', el).onclick = () => {
        vm--;
        if (vm < 0) {
          vm = 11;
          vy--;
        }
        M.sfx.tap();
        drawCal();
      };
      M.$('.me-next', el).onclick = () => {
        vm++;
        if (vm > 11) {
          vm = 0;
          vy++;
        }
        M.sfx.tap();
        drawCal();
      };
      M.$('.me-now', el).onclick = () => {
        vy = ty;
        vm = tm;
        M.sfx.tap();
        drawCal();
        const c = M.$(`td[data-d="${tdate}"]`, box);
        if (c) c.click();
      };
      M.$('.me-csay', el).onclick = () => M.say(lastSay || 'Touche une date du calendrier.');
    },
  });
})();
