/* =====================================================================
   sciences/ciel.js — scènes du ciel, dessinées en SVG (remplacent les anciennes versions de art.js)
     SC.svg.terre({ sunLeft, hot, angle, houses })  La Terre vue du pôle Nord : océans, continents,
         banquise, nuages, terminateur doux, lumières des villes côté nuit, atmosphère, Soleil qui rayonne.
         Les continents tournent dans un groupe .sc-spin (sens antihoraire) : SC.earthAngle(racine, angle)
         fait tourner la Terre sans redessiner (transition douce, ou image par image pendant ▶).
     SC.svg.ombre({ h, side?, arc?, labels? })      Paysage à l'heure h (6 à 18) : couleur du ciel, Soleil,
         collines, nuages, arbre et ombre floue du côté opposé au Soleil.
     SC.svg.arbre({ moment, shadowSide })           Même scène en petit (choix de réponse).
     SC.svg.erable(saison)                           L'érable en hiver / printemps / été / automne,
         avec neige ou feuilles qui tombent.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC || !SC.svg) return;
  let uid = 0;
  const f1 = (v) => Math.round(v * 10) / 10;
  const V = (w, h, inner, cls, label) =>
    `<svg class="${cls}" viewBox="0 0 ${w} ${h}" role="img"${label ? ` aria-label="${M.esc(label)}"` : ''} xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  /** Bruit déterministe doux (somme de sinus). */
  const wob = (a, k) => Math.sin(a * 3 + k) * 0.5 + Math.sin(a * 7 + k * 2.3) * 0.3 + Math.sin(a * 13 + k * 0.7) * 0.2;
  /** Tache en coordonnées polaires autour de (cx, cy) : de l'angle a0 à a1 (degrés), du rayon r0 à r1. */
  const polarBlob = (cx, cy, a0, a1, r0, r1, k) => {
    const N = 26,
      pts = [];
    for (let i = 0; i <= N; i++) {
      const a = a0 + ((a1 - a0) * i) / N,
        t = (a * Math.PI) / 180,
        e = Math.sin((Math.PI * i) / N);
      const r = r1 - (r1 - r0) * (1 - e) * 0.85 + wob(t, k) * 7 * e;
      pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    for (let i = N; i >= 0; i--) {
      const a = a0 + ((a1 - a0) * i) / N,
        t = (a * Math.PI) / 180,
        e = Math.sin((Math.PI * i) / N);
      const r = r0 + (r1 - r0) * (1 - e) * 0.15 + wob(t, k + 5) * 4 * e;
      pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    return 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L') + ' Z';
  };
  const stars = (W, H, n, seed) => {
    let s = '',
      x = seed;
    const r = () => (x = (x * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < n; i++) {
      const big = r() < 0.18;
      s += `<circle class="${big ? 'sc-twinkle' : ''}" style="--d:${f1(r() * 3)}s" cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${big ? 1.9 : f1(0.6 + r() * 0.8)}" fill="#fff" opacity="${big ? 1 : f1(0.4 + r() * 0.5)}"/>`;
    }
    return s;
  };
  const sunBody = (id, x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#${id}-glow)"/>
    <g class="art-spin" style="transform-origin:${x}px ${y}px">${M.range(0, 11)
      .map(
        (i) =>
          `<path d="M${x} ${y - r * 1.75} L${x + r * 0.2} ${y - r * 1.2} H${x - r * 0.2} Z" fill="#ffc94d" transform="rotate(${i * 30} ${x} ${y})"/>`,
      )
      .join('')}</g>
    <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}-sun)"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="#fff" opacity=".4"/>`;
  const sunDefs = (
    id,
  ) => `<radialGradient id="${id}-sun" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#fff7c2"/><stop offset=".55" stop-color="#ffd166"/><stop offset="1" stop-color="#f7941d"/></radialGradient>
    <radialGradient id="${id}-glow"><stop offset=".3" stop-color="#ffe08a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>`;
  const houseArt = (x, y, s) =>
    M.art.has('pl-maison')
      ? M.art.svg('pl-maison', { x: x - s / 2, y: y - s / 2, w: s, h: s })
      : `<text x="${x}" y="${y + s * 0.3}" text-anchor="middle" font-size="${s * 0.8}">🏠</text>`;

  /* ---------------- La Terre vue du pôle Nord ---------------- */
  // Continents (angles dans le repère de la Terre; la maison du Québec est à 180°).
  const LANDS = [
    [150, 215, 34, 96, 1],
    [222, 246, 40, 70, 2],
    [262, 352, 36, 98, 3],
    [-10, 40, 44, 96, 4],
    [60, 110, 50, 88, 5],
  ];
  const LIGHTS = (cx, cy) => {
    let s = '',
      k = 7;
    LANDS.forEach(([a0, a1, r0, r1]) => {
      for (let i = 0; i < 9; i++) {
        k = (k * 31 + 17) % 97;
        const a = a0 + (a1 - a0) * (0.15 + 0.7 * ((k % 10) / 10)),
          r = r0 + (r1 - r0) * (0.25 + 0.55 * (((k * 7) % 10) / 10));
        const t = (a * Math.PI) / 180;
        s += `<circle cx="${f1(cx + r * Math.cos(t))}" cy="${f1(cy + r * Math.sin(t))}" r="${k % 3 ? 1.6 : 2.4}" fill="#ffe08a"/>`;
      }
    });
    return s;
  };
  SC.svg.terre = function ({ sunLeft = true, hot = true, angle = null, houses = true, cls = 'sc-fig' } = {}) {
    const id = 'te' + ++uid,
      cx = sunLeft ? 245 : 155,
      cy = 150,
      r = 100,
      sx = sunLeft ? 40 : 360;
    const rot = angle == null ? 0 : angle - 180; // la maison (180°) suit l'angle demandé
    const spinStyle = `style="transform:rotate(${rot}deg)"`;
    const lands = LANDS.map(
      ([a0, a1, r0, r1, k]) =>
        `<path d="${polarBlob(cx, cy, a0, a1, r0, r1, k)}" fill="url(#${id}-land)" stroke="#2f7a37" stroke-width="1.5" stroke-linejoin="round"/>`,
    ).join('');
    const clouds = [
      [200, 70],
      [20, 82],
      [300, 60],
      [110, 76],
    ]
      .map(([a, rr], i) => {
        const t = (a * Math.PI) / 180;
        return `<ellipse cx="${f1(cx + rr * Math.cos(t))}" cy="${f1(cy + rr * Math.sin(t))}" rx="${16 + i * 3}" ry="5" fill="#fff" opacity=".55" transform="rotate(${a + 90} ${f1(cx + rr * Math.cos(t))} ${f1(cy + rr * Math.sin(t))})"/>`;
      })
      .join('');
    const ice = `<path d="${(() => {
      const pts = [];
      for (let i = 0; i < 24; i++) {
        const t = (i / 24) * Math.PI * 2,
          rr = 24 + wob(t, 9) * 6;
        pts.push(`${f1(cx + rr * Math.cos(t))} ${f1(cy + rr * Math.sin(t))}`);
      }
      return 'M' + pts.join(' L') + ' Z';
    })()}" fill="#f4fbff" stroke="#cfe6f5" stroke-width="2"/>`;
    const nightSide = sunLeft
      ? `<rect x="${cx}" y="${cy - r - 10}" width="${r + 10}" height="${2 * r + 20}"/>`
      : `<rect x="${cx - r - 10}" y="${cy - r - 10}" width="${r + 10}" height="${2 * r + 20}"/>`;
    // Maisons touchables (habileté « jour ou nuit ? »)
    const dayA = sunLeft ? [150, 180, 210] : [-30, 0, 30],
      nightA = sunLeft ? [-30, 0, 30] : [150, 180, 210];
    const house = (a, kind) => {
      const t = (a * Math.PI) / 180,
        x = f1(cx + 64 * Math.cos(t)),
        y = f1(cy + 64 * Math.sin(t)),
        night = kind === 'nuit';
      return `<g${hot ? ` data-hot="${kind}"` : ''} class="sc-house"><circle cx="${x}" cy="${y}" r="21" fill="${night ? '#1b2a55' : '#fff'}" stroke="${night ? '#ffe08a' : '#2b2d42'}" stroke-width="2.5" opacity=".95"/>${houseArt(x, y, 30)}${night ? `<circle cx="${x}" cy="${y}" r="19" fill="#0b1430" opacity=".35"/>` : ''}</g>`;
    };
    const marker =
      angle == null
        ? ''
        : `<g class="sc-orbit" ${spinStyle}><circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none"/><g transform="translate(${cx - 84} ${cy})"><g class="sc-upright" style="transform:rotate(${-rot}deg)">
      <circle r="17" fill="#fff" stroke="#ef476f" stroke-width="3.5"/><circle r="23" fill="none" stroke="#ef476f" stroke-width="2" class="sc-ping"/>${houseArt(0, 0, 26)}</g></g></g>`;
    return V(
      400,
      300,
      `<defs>${sunDefs(id)}
      <radialGradient id="${id}-space" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="#1d2a5c"/><stop offset="1" stop-color="#070b1e"/></radialGradient>
      <radialGradient id="${id}-sea" cx="${sunLeft ? '30%' : '70%'}" cy="45%" r="75%"><stop offset="0" stop-color="#6fd0f5"/><stop offset=".6" stop-color="#2a8fd0"/><stop offset="1" stop-color="#1b5e9c"/></radialGradient>
      <linearGradient id="${id}-land" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc96a"/><stop offset=".6" stop-color="#4fae55"/><stop offset="1" stop-color="#c9b06a"/></linearGradient>
      <linearGradient id="${id}-night" x1="${sunLeft ? 0 : 1}" y1="0" x2="${sunLeft ? 1 : 0}" y2="0"><stop offset=".44" stop-color="#050a24" stop-opacity="0"/><stop offset=".56" stop-color="#050a24" stop-opacity=".72"/><stop offset="1" stop-color="#050a24" stop-opacity=".82"/></linearGradient>
      <linearGradient id="${id}-beam" gradientUnits="userSpaceOnUse" x1="${sx}" y1="0" x2="${cx}" y2="0"><stop offset="0" stop-color="#ffd166" stop-opacity=".95"/><stop offset="1" stop-color="#ffd166" stop-opacity=".25"/></linearGradient>
      <radialGradient id="${id}-atmo"><stop offset=".86" stop-color="#8fd8ff" stop-opacity=".55"/><stop offset="1" stop-color="#8fd8ff" stop-opacity="0"/></radialGradient>
      <clipPath id="${id}-clip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><clipPath id="${id}-dark">${nightSide}</clipPath>
    </defs>
    <rect width="400" height="300" rx="16" fill="url(#${id}-space)"/>${stars(400, 300, 70, 11)}
    ${[-70, -35, 0, 35, 70].map((d) => `<line class="sc-beam" x1="${sx + (sunLeft ? 44 : -44)}" y1="${cy + d * 0.3}" x2="${cx + (sunLeft ? -r - 8 : r + 8)}" y2="${cy + d}" stroke="url(#${id}-beam)" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 9"/>`).join('')}
    ${sunBody(id, sx, cy, 26)}
    <circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="url(#${id}-atmo)"/>
    <g clip-path="url(#${id}-clip)">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-sea)"/>
      <g class="sc-spin" ${spinStyle}><circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none"/>${lands}${ice}${clouds}</g>
      <rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="url(#${id}-night)"/>
      <g clip-path="url(#${id}-dark)"><g class="sc-spin" ${spinStyle}><circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none"/>${LIGHTS(cx, cy)}</g></g>
    </g>
    <path d="M${cx} ${cy - r} A${r} ${r} 0 0 ${sunLeft ? 0 : 1} ${cx} ${cy + r}" fill="none" stroke="#bfeaff" stroke-width="3" opacity=".8"/>
    <circle cx="${cx}" cy="${cy}" r="2.5" fill="#9fb3d9"/>
    <text x="${sunLeft ? 70 : 330}" y="${cy + 64}" text-anchor="middle" class="sc-sky-lbl">Soleil</text>
    ${houses ? dayA.map((a) => house(a, 'jour')).join('') + nightA.map((a) => house(a, 'nuit')).join('') : ''}${marker}`,
      cls,
      'La Terre vue du pôle Nord, éclairée par le Soleil',
    );
  };
  /** Tourne la Terre déjà dessinée dans root (sans la redessiner). smooth=false pendant une animation image par image. */
  SC.earthAngle = function (root, angle, smooth = true) {
    const rot = angle - 180;
    M.$$('.sc-spin, .sc-orbit', root).forEach((g) => {
      g.classList.toggle('smooth', smooth);
      g.style.transform = `rotate(${rot}deg)`;
    });
    M.$$('.sc-upright', root).forEach((g) => {
      g.classList.toggle('smooth', smooth);
      g.style.transform = `rotate(${-rot}deg)`;
    });
  };

  /* ---------------- Paysage, Soleil et ombre de l'arbre ---------------- */
  const mix = (a, b, t) => {
    const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const A = p(a),
      B = p(b);
    return (
      '#' +
      A.map((v, i) =>
        Math.round(v + (B[i] - v) * t)
          .toString(16)
          .padStart(2, '0'),
      ).join('')
    );
  };
  /** h : heure de 6 à 18. side : côté forcé de l'ombre (+1 droite, −1 gauche, 0 aucune). */
  SC.svg.ombre = function ({ h = 12, side = null, arc = false, labels = false, cls = 'sc-fig', W = 300, H = 200 } = {}) {
    const id = 'om' + ++uid,
      f = (h - 6) / 12; // 0 matin → 1 soir
    const GY = H - 34,
      TX = W / 2;
    const sx = 24 + f * (W - 48),
      alt = Math.max(0.1, Math.sin(Math.PI * f)),
      sy = GY - 8 - alt * (GY - 40);
    const warm = 1 - Math.min(1, alt / 0.55); // 1 = Soleil bas (lever, coucher)
    const skyTop = mix('#4aa6ef', '#7d8fd8', warm * 0.6),
      skyBot = mix('#cdeeff', '#ffc98f', warm);
    const dir = side != null ? side : sx < TX - 4 ? 1 : sx > TX + 4 ? -1 : 0;
    const L = dir === 0 ? 0 : Math.min(W * 0.55, 58 / Math.tan(alt * 1.05));
    const tree = `<path d="M${TX - 5} ${GY + 2} Q${TX - 3} ${GY - 30} ${TX - 6} ${GY - 46} L${TX + 6} ${GY - 46} Q${TX + 3} ${GY - 30} ${TX + 5} ${GY + 2} Z" fill="url(#${id}-bark)" stroke="#5b3a1e" stroke-width="1.5"/>
      <path d="M${TX} ${GY - 34} q-12 -6 -16 -16 M${TX + 2} ${GY - 40} q10 -6 14 -14" stroke="#6b4425" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g class="sc-sway" style="transform-origin:${TX}px ${GY}px">
        <circle cx="${TX - 18}" cy="${GY - 62}" r="20" fill="#3d9a47"/><circle cx="${TX + 18}" cy="${GY - 60}" r="21" fill="#3d9a47"/><circle cx="${TX}" cy="${GY - 80}" r="24" fill="#47a851"/>
        <circle cx="${TX - 6}" cy="${GY - 58}" r="20" fill="#4fb55a"/><circle cx="${TX + 4}" cy="${GY - 72}" r="18" fill="#5cc265"/>
        <circle cx="${TX + (sx < TX ? -12 : 12)}" cy="${GY - 84}" r="10" fill="#8fd27d" opacity=".75"/></g>`;
    const shadow =
      dir === 0
        ? `<ellipse cx="${TX}" cy="${GY + 4}" rx="26" ry="6" fill="#1d2a1a" opacity=".38" filter="url(#${id}-blur)"/>`
        : `<g opacity=".55" filter="url(#${id}-blur)"><path d="M${TX - 5} ${GY + 3} L${TX + dir * L * 0.62} ${GY + 2} L${TX + dir * L * 0.62} ${GY + 7} L${TX + 5} ${GY + 7} Z" fill="#1d2a1a"/><ellipse cx="${TX + dir * L * 0.8}" cy="${GY + 5}" rx="${Math.max(14, L * 0.25)}" ry="7" fill="#1d2a1a"/></g>`;
    const cloud = (x, y, s, d, dl) =>
      `<g class="plan-cloud" style="--from:${-60}px;--to:${W + 40}px;animation-duration:${d}s;animation-delay:${dl}s"><g opacity=".85" fill="#fff"><circle cx="${x}" cy="${y}" r="${8 * s}"/><circle cx="${x + 10 * s}" cy="${y - 5 * s}" r="${10 * s}"/><circle cx="${x + 22 * s}" cy="${y}" r="${8 * s}"/><rect x="${x}" y="${y}" width="${22 * s}" height="${8 * s}" rx="${4 * s}"/></g></g>`;
    return V(
      W,
      H,
      `<defs>${sunDefs(id)}
        <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBot}"/></linearGradient>
        <linearGradient id="${id}-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd06a"/><stop offset="1" stop-color="#5faa45"/></linearGradient>
        <linearGradient id="${id}-bark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a4f2a"/><stop offset=".5" stop-color="#9c6a3c"/><stop offset="1" stop-color="#6b4425"/></linearGradient>
        <filter id="${id}-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
        <clipPath id="${id}-c"><rect width="${W}" height="${H}" rx="16"/></clipPath></defs>
      <g clip-path="url(#${id}-c)">
      <rect width="${W}" height="${H}" fill="url(#${id}-sky)"/>
      ${arc ? `<path d="M24 ${GY - 8} Q${TX} ${GY - 8 - 2 * (GY - 40)} ${W - 24} ${GY - 8}" stroke="#fff" stroke-width="2" stroke-dasharray="3 6" fill="none" opacity=".8"/>` : ''}
      ${sunBody(id, f1(sx), f1(sy), 15)}
      ${cloud(30, 40, 1, 70, -20)}${cloud(150, 28, 0.8, 90, -60)}
      <path d="M0 ${GY - 18} Q${W * 0.2} ${GY - 44} ${W * 0.42} ${GY - 22} T${W} ${GY - 26} V${H} H0 Z" fill="${mix('#9fcf8a', '#c6a77d', warm * 0.5)}" opacity=".85"/>
      <path d="M0 ${GY - 4} Q${W * 0.3} ${GY - 22} ${W * 0.6} ${GY - 8} T${W} ${GY - 10} V${H} H0 Z" fill="${mix('#7fbf62', '#a8a06a', warm * 0.4)}"/>
      <rect y="${GY}" width="${W}" height="${H - GY}" fill="url(#${id}-grass)"/>
      ${M.range(0, 14)
        .map((i) => `<path d="M${10 + i * 21} ${GY + 14 + (i % 3) * 5} l2 -6 l2 6" stroke="#4f9a3a" stroke-width="1.5" fill="none"/>`)
        .join('')}
      ${shadow}${tree}
      ${labels ? `<text x="12" y="${H - 9}" class="sc-sky-lbl dark">Est</text><text x="${W - 12}" y="${H - 9}" text-anchor="end" class="sc-sky-lbl dark">Ouest</text>` : ''}
      </g><rect width="${W}" height="${H}" rx="16" fill="none" stroke="#e7e1d3" stroke-width="3"/>`,
      cls,
      "L'arbre et son ombre",
    );
  };
  SC.svg.arbre = function ({ moment = 'midi', shadowSide = null, cls = 'sc-choice-fig' } = {}) {
    const h = { matin: 7.5, midi: 12, soir: 16.5 }[moment] || 12;
    return SC.svg.ombre({ h, side: shadowSide, cls, W: 210, H: 150 });
  };

  /* ---------------- L'érable au fil des saisons ---------------- */
  const LEAF = 'M10 0 L12 5 L16 3 L15 8 L20 8 L16 12 L17 14 L11 13 L11 20 L9 20 L9 13 L3 14 L4 12 L0 8 L5 8 L4 3 L8 5 Z';
  SC.svg.erable = function (saison, { cls = 'sc-choice-fig' } = {}) {
    const id = 'er' + ++uid;
    const sky = {
      hiver: ['#b9cde6', '#eef4fb'],
      printemps: ['#8fd0f5', '#e6f7ff'],
      ete: ['#5fb4f5', '#cdeeff'],
      automne: ['#86b7e0', '#fde8c8'],
    }[saison];
    const ground = { hiver: '#fbfdff', printemps: '#8fd06a', ete: '#6cc04f', automne: '#c9a25a' }[saison];
    const trunk = `<path d="M94 126 Q96 96 92 70 L108 70 Q104 96 106 126 Z" fill="url(#${id}-bark)" stroke="#5b3a1e" stroke-width="1.5"/>`;
    const branches = `<path d="M100 92 Q86 78 72 66 M100 84 Q116 70 130 60 M99 74 Q90 56 86 44 M101 74 Q110 54 116 42 M76 70 Q66 64 60 56 M126 62 Q136 58 142 50 M100 70 V36" stroke="#6b4425" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const canopy = (cols) =>
      `<g class="sc-sway" style="transform-origin:100px 126px">${[
        [72, 60, 24],
        [128, 58, 25],
        [100, 40, 28],
        [84, 44, 20],
        [118, 42, 20],
        [100, 66, 24],
      ]
        .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${cols[i % cols.length]}"/>`)
        .join('')}<circle cx="86" cy="36" r="9" fill="#fff" opacity=".18"/></g>`;
    let scene = '',
      fx = '';
    if (saison === 'hiver') {
      scene =
        trunk +
        branches +
        '<path d="M70 64 q4 -4 8 0 M126 58 q4 -4 8 0 M84 42 q4 -4 6 0 M112 40 q4 -4 6 0" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>';
      fx = M.range(0, 22)
        .map(
          (i) =>
            `<circle class="sc-fall" style="--x:${(i * 37) % 200}px;--dur:${4 + (i % 5)}s;--dl:${-(i * 0.7) % 6}s;--dx:${(i % 2 ? 1 : -1) * 12}px" cx="0" cy="0" r="${1.6 + (i % 3) * 0.6}" fill="#fff"/>`,
        )
        .join('');
      scene += `<path d="M0 124 Q40 112 80 122 T160 118 T200 122 V140 H0 Z" fill="#fff"/><path d="M20 128 q20 -6 40 0 M120 130 q20 -6 40 0" stroke="#cfe0f2" stroke-width="2.5" fill="none"/>`;
    } else if (saison === 'printemps') {
      scene =
        trunk +
        branches +
        [
          [72, 66],
          [128, 60],
          [86, 44],
          [116, 42],
          [60, 56],
          [142, 50],
          [100, 36],
          [80, 70],
          [120, 64],
        ]
          .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${5 + (i % 3)}" fill="${i % 3 ? '#a8e06a' : '#c8f08a'}"/>`)
          .join('') +
        '<path d="M105 100 h10 v12 h-12 Z" fill="#9aa3b5" stroke="#5f6878" stroke-width="1.5"/><path d="M106 96 h6" stroke="#5f6878" stroke-width="2"/><circle class="sc-drip" cx="109" cy="99" r="1.6" fill="#ffd27a"/>' +
        '<ellipse cx="160" cy="130" rx="22" ry="4" fill="#9fd4ec" opacity=".8"/>';
    } else if (saison === 'ete') {
      scene =
        trunk +
        branches +
        canopy(['#3d9a47', '#47a851', '#4fb55a', '#3d9a47', '#5cc265', '#47a851']) +
        [
          [30, 130, '#ff8fab'],
          [44, 134, '#ffd166'],
          [158, 132, '#fff'],
          [172, 128, '#c39bff'],
        ]
          .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3" fill="${c}"/>`)
          .join('');
    } else {
      scene =
        trunk +
        branches +
        canopy(['#ef6f2e', '#f4b400', '#d62828', '#f78c40', '#ffcf3d', '#e8551f']) +
        M.range(0, 7)
          .map(
            (i) =>
              `<path d="${LEAF}" fill="${['#d62828', '#ef6f2e', '#f4b400'][i % 3]}" transform="translate(${18 + i * 26} ${124 + (i % 2) * 6}) scale(.45) rotate(${i * 40} 10 10)"/>`,
          )
          .join('');
      fx = M.range(0, 7)
        .map(
          (i) =>
            `<g class="sc-fall leaf" style="--x:${40 + i * 20}px;--dur:${5 + (i % 3)}s;--dl:${-i * 1.1}s;--dx:${(i % 2 ? 1 : -1) * 26}px"><path d="${LEAF}" transform="scale(.55)" fill="${['#d62828', '#ef6f2e', '#f4b400'][i % 3]}"/></g>`,
        )
        .join('');
    }
    return V(
      200,
      140,
      `<defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
      <linearGradient id="${id}-bark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a4f2a"/><stop offset=".5" stop-color="#9c6a3c"/><stop offset="1" stop-color="#6b4425"/></linearGradient>
      <clipPath id="${id}-c"><rect width="200" height="140" rx="12"/></clipPath></defs>
      <g clip-path="url(#${id}-c)"><rect width="200" height="140" fill="url(#${id}-sky)"/>
      ${saison === 'ete' ? `<circle cx="172" cy="24" r="12" fill="#ffd166"/><circle cx="172" cy="24" r="20" fill="#ffd166" opacity=".25"/>` : ''}
      <path d="M0 112 Q50 98 100 108 T200 104 V140 H0 Z" fill="${saison === 'hiver' ? '#e6eef8' : saison === 'automne' ? '#d9b46a' : '#a6dc84'}"/>
      <rect y="124" width="200" height="16" fill="${ground}"/>${scene}${fx}</g>`,
      cls,
      "L'érable : " + saison,
    );
  };
})();
