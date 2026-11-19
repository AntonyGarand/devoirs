/* =====================================================================
   art-lib.js — illustrations SVG partagées (remplacent les emoji des plans et des astres)
   Style commun : vue 100 × 100, contour encre #2b2d42 de 3 px, aplats doux, un reflet clair.
   Utilisation : M.art.html('pl-ecole', { size: 28, alt: 'école' })  ou  M.art.svg('pl-ecole')
   (chaîne <svg> nue, pour l'imbriquer dans un autre SVG : M.art.svg(nom, {x, y, w, h})).
     Plans  : pl-maison pl-caserne pl-ecole pl-clinique pl-biblio pl-parc pl-epicerie pl-piscine
              pl-tableau pl-porte pl-livres pl-pupitres pl-evier pl-sac pl-plante
              pl-glissoire pl-balancoire pl-soccer pl-abreuvoir pl-velo
              pl-cuisine pl-divan pl-lit pl-bain pl-laveuse
     Ciel   : ciel-soleil ciel-terre ciel-lune
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const O = '#2b2d42';
  let uid = 0;
  const V = (body) => `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const R = (name, emoji, fn) => M.art.register(name, (o) => V(fn(o || {}, 'a' + ++uid)), emoji);
  const st = `stroke="${O}" stroke-width="3" stroke-linejoin="round"`;
  const win = (x, y, w = 12, h = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#cfeefa" ${st}/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="${O}" stroke-width="1.5"/>`;
  const shine = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="4" rx="2" fill="#fff" opacity=".55"/>`;

  /** Chaîne <svg> à imbriquer dans un autre SVG, positionnée en x,y avec la taille w × h. */
  M.art.svg = function (name, { x = 0, y = 0, w = 100, h = 100 } = {}) {
    const html = M.art.html(name, { size: 10 });
    const inner = html.replace(/^<span[^>]*>/, '').replace(/<\/span>$/, '');
    return inner.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `).replace('width="100%" height="100%" ', '');
  };

  /* ---------------- Bâtiments du quartier ---------------- */
  R('pl-maison', '🏠', () => `
    <rect x="62" y="16" width="10" height="20" fill="#b5651d" ${st}/>
    <rect x="22" y="46" width="56" height="40" fill="#fff3d6" ${st}/>
    <path d="M12 50 L50 16 L88 50 Z" fill="#ef476f" ${st}/><path d="M24 44 L50 22 L76 44" stroke="#fff" stroke-width="2" opacity=".45" fill="none"/>
    <rect x="44" y="62" width="14" height="24" rx="2" fill="#8a5a33" ${st}/><circle cx="54" cy="75" r="1.6" fill="#ffd166"/>
    ${win(27, 56)}${win(64, 56, 10, 10)}`);
  R('pl-caserne', '🚒', () => `
    <rect x="12" y="30" width="76" height="56" fill="#e63946" ${st}/><rect x="12" y="30" width="76" height="10" fill="#b81d2a" ${st}/>
    <rect x="24" y="50" width="52" height="36" fill="#eef1f5" ${st}/>${[58, 66, 74].map((y) => `<path d="M24 ${y} H76" stroke="#b9c1cc" stroke-width="2"/>`).join('')}
    <circle cx="50" cy="22" r="7" fill="#ffd166" ${st}/><path d="M42 22 h-6 M58 22 h6 M50 12 v-4" stroke="#f4b400" stroke-width="3" stroke-linecap="round"/>
    <rect x="18" y="42" width="12" height="4" fill="#fff" opacity=".6"/><rect x="70" y="42" width="12" height="4" fill="#fff" opacity=".6"/>`);
  R('pl-ecole', '🏫', () => `
    <rect x="10" y="44" width="80" height="42" fill="#ffd166" ${st}/>
    <path d="M34 44 V30 L50 16 L66 30 V44" fill="#f78c40" ${st}/><circle cx="50" cy="32" r="6" fill="#fff" ${st}/><path d="M50 29 v3 h3" stroke="${O}" stroke-width="1.6" fill="none"/>
    <path d="M78 44 V10" stroke="${O}" stroke-width="2.5"/><path d="M78 11 h14 l-3 5 l3 5 h-14 Z" fill="#118ab2" ${st}/>
    ${win(16, 54)}${win(32, 54)}${win(56, 54)}${win(72, 54)}
    <rect x="43" y="64" width="14" height="22" rx="2" fill="#8a5a33" ${st}/>${shine(14, 47, 30)}`);
  R('pl-clinique', '🏥', () => `
    <rect x="16" y="22" width="68" height="64" rx="3" fill="#fff" ${st}/><rect x="16" y="22" width="68" height="10" fill="#dff3fb" ${st}/>
    <path d="M42 38 h16 v12 h12 v16 h-12 v12 h-16 v-12 h-12 v-16 h12 Z" transform="translate(0 -4) scale(1) " fill="#ef476f" ${st}/>
    ${win(22, 70, 10, 10)}${win(68, 70, 10, 10)}`);
  R('pl-biblio', '📚', () => `
    <rect x="16" y="66" width="68" height="16" rx="3" fill="#118ab2" ${st}/><path d="M22 72 H78" stroke="#fff" stroke-width="2" opacity=".6"/>
    <rect x="22" y="48" width="58" height="16" rx="3" fill="#06a77d" ${st}/><path d="M28 54 H74" stroke="#fff" stroke-width="2" opacity=".6"/>
    <rect x="18" y="30" width="56" height="16" rx="3" fill="#ef476f" ${st}/><path d="M24 36 H68" stroke="#fff" stroke-width="2" opacity=".6"/>
    <path d="M60 30 V14 l6 5 l6 -5 V30" fill="#ffd166" ${st}/>`);
  R('pl-parc', '🌳', () => `
    <ellipse cx="50" cy="80" rx="42" ry="10" fill="#9fd07f"/>
    <rect x="30" y="54" width="7" height="26" fill="#8a5a33" ${st}/><circle cx="34" cy="42" r="20" fill="#4fbf5a" ${st}/><circle cx="28" cy="36" r="7" fill="#8fd27d"/>
    <rect x="66" y="62" width="6" height="18" fill="#8a5a33" ${st}/><circle cx="69" cy="52" r="14" fill="#3fae49" ${st}/><circle cx="65" cy="48" r="5" fill="#8fd27d"/>
    <path d="M44 74 h20 M46 74 v8 M62 74 v8 M44 68 h20" stroke="#b5651d" stroke-width="3.5" stroke-linecap="round"/>`);
  R('pl-epicerie', '🛒', () => `
    <path d="M8 22 H22 L32 66 H78" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 30 H90 L82 58 H30 Z" fill="#dff3fb" ${st}/>${[40, 52, 64, 76].map((x) => `<path d="M${x} 30 L${x - 2} 58" stroke="#8fc7dc" stroke-width="2"/>`).join('')}<path d="M27 44 H86" stroke="#8fc7dc" stroke-width="2"/>
    <circle cx="44" cy="22" r="9" fill="#ef476f" ${st}/><path d="M44 13 q3 -5 7 -4" stroke="#06a77d" stroke-width="3" fill="none"/>
    <rect x="56" y="12" width="14" height="18" rx="3" fill="#ffd166" ${st}/>
    <circle cx="38" cy="78" r="7" fill="#7a7f99" ${st}/><circle cx="72" cy="78" r="7" fill="#7a7f99" ${st}/>`);
  R('pl-piscine', '🏊', (o, id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fdcf5"/><stop offset="1" stop-color="#2fa9d8"/></linearGradient></defs>
    <rect x="8" y="12" width="84" height="76" rx="12" fill="#f1e9d6" ${st}/>
    <rect x="18" y="22" width="64" height="56" rx="8" fill="url(#${id})" stroke="#1b7fa8" stroke-width="3"/>
    ${[36, 50, 64].map((x) => `<path d="M${x} 26 V74" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 4" opacity=".85"/>`).join('')}
    <path d="M24 40 q5 -4 10 0 t10 0 M54 60 q5 -4 10 0 t10 0" stroke="#e6f6fd" stroke-width="2" fill="none"/>
    <path d="M84 30 v14 M90 30 v14 M84 34 h6 M84 40 h6" stroke="${O}" stroke-width="2.5"/>`);

  /* ---------------- La classe ---------------- */
  R('pl-tableau', '🟩', () => `
    <rect x="10" y="16" width="80" height="50" rx="4" fill="#2f7a5b" stroke="#8a5a33" stroke-width="6"/>
    <path d="M22 32 h10 M27 27 v10 M40 32 h8 M56 28 q6 -4 8 2 q0 5 -8 9 h10" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M22 50 q14 -6 28 0" stroke="#fff" stroke-width="2" fill="none" opacity=".55"/>
    <rect x="58" y="66" width="20" height="4" rx="2" fill="#fff" ${st}/>
    <rect x="24" y="74" width="52" height="8" rx="2" fill="#c98b52" ${st}/><path d="M30 82 V92 M70 82 V92" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`);
  R('pl-porte', '🚪', () => `
    <rect x="26" y="8" width="48" height="84" rx="3" fill="#e7e1d3" ${st}/>
    <rect x="32" y="14" width="36" height="78" rx="2" fill="#b5651d" ${st}/>
    <rect x="38" y="22" width="24" height="22" rx="2" fill="#c98b52" stroke="${O}" stroke-width="2"/><rect x="38" y="52" width="24" height="30" rx="2" fill="#c98b52" stroke="${O}" stroke-width="2"/>
    <circle cx="62" cy="52" r="3.2" fill="#ffd166" stroke="${O}" stroke-width="1.5"/>`);
  R('pl-livres', '📚', () => `
    <rect x="12" y="12" width="76" height="78" rx="4" fill="#c98b52" ${st}/><path d="M12 50 H88" stroke="${O}" stroke-width="3"/>
    ${[['#ef476f', 18, 8, 32], ['#118ab2', 27, 9, 30], ['#ffd166', 37, 7, 34], ['#06a77d', 45, 10, 28], ['#9b5de5', 56, 8, 32]].map(([c, x, w, h]) => `<rect x="${x}" y="${50 - h + 2}" width="${w}" height="${h - 2}" rx="1.5" fill="${c}" stroke="${O}" stroke-width="2"/>`).join('')}
    <rect x="66" y="22" width="9" height="28" rx="1.5" fill="#f78c40" stroke="${O}" stroke-width="2" transform="rotate(14 70 50)"/>
    ${[['#06a77d', 18, 9, 30], ['#ef476f', 28, 8, 26], ['#118ab2', 37, 11, 32], ['#ffd166', 49, 8, 28], ['#f78c40', 58, 9, 30], ['#9b5de5', 68, 9, 26]].map(([c, x, w, h]) => `<rect x="${x}" y="${88 - h}" width="${w}" height="${h}" rx="1.5" fill="${c}" stroke="${O}" stroke-width="2"/>`).join('')}`);
  R('pl-pupitres', '🪑', () => `
    ${[18, 56].map((x) => `<rect x="${x}" y="40" width="30" height="7" rx="2" fill="#c98b52" ${st}/><path d="M${x + 4} 47 V72 M${x + 26} 47 V72" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="${x + 7}" y="56" width="16" height="5" rx="2" fill="#118ab2" ${st}/><path d="M${x + 9} 61 V76 M${x + 21} 61 V76 M${x + 21} 56 V46" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
      <rect x="${x + 6}" y="34" width="10" height="6" rx="1" fill="#fff" stroke="${O}" stroke-width="1.5"/><path d="M${x + 19} 38 l8 -6" stroke="#f4b400" stroke-width="3" stroke-linecap="round"/>`).join('')}`);
  R('pl-evier', '🚰', () => `
    <rect x="12" y="50" width="76" height="40" rx="4" fill="#d6dde5" ${st}/>
    <path d="M22 50 Q22 70 50 70 Q78 70 78 50 Z" fill="#9fd4ec" ${st}/>
    <path d="M44 50 V26 Q44 18 52 18 H64 V26" fill="none" stroke="#7a8696" stroke-width="7" stroke-linecap="round"/><path d="M44 50 V26 Q44 18 52 18 H64 V26" fill="none" stroke="#b9c3cf" stroke-width="3" stroke-linecap="round"/>
    <path d="M64 30 q-4 8 0 12 q4 -4 0 -12 Z" fill="#4cb4e6" stroke="#1b7fa8" stroke-width="1.5"/>
    <rect x="30" y="74" width="14" height="10" rx="2" fill="#ffd166" stroke="${O}" stroke-width="2"/>`);
  R('pl-sac', '🎒', () => `
    <path d="M34 26 Q34 12 50 12 Q66 12 66 26" fill="none" stroke="${O}" stroke-width="5"/>
    <rect x="22" y="24" width="56" height="66" rx="16" fill="#ef476f" ${st}/>
    <path d="M22 44 Q50 54 78 44" fill="#d63a5c" ${st}/>
    <rect x="32" y="60" width="36" height="22" rx="7" fill="#ffd166" ${st}/><path d="M38 66 H62" stroke="${O}" stroke-width="2"/>
    ${shine(30, 30, 18)}`);
  R('pl-plante', '🪴', () => `
    <path d="M50 64 V40" stroke="#2f7a37" stroke-width="4"/>
    <path d="M50 52 Q30 50 26 32 Q44 32 50 52 Z" fill="#4fbf5a" ${st}/><path d="M50 46 Q68 44 74 24 Q54 26 50 46 Z" fill="#3fae49" ${st}/><path d="M50 40 Q42 24 50 12 Q58 24 50 40 Z" fill="#6dbb5e" ${st}/>
    <path d="M28 62 H72 L66 90 H34 Z" fill="#d9774b" ${st}/><rect x="25" y="58" width="50" height="9" rx="3" fill="#b5532d" ${st}/>`);

  /* ---------------- La cour ---------------- */
  R('pl-glissoire', '🛝', () => `
    <path d="M22 88 V30 M38 88 V30" stroke="${O}" stroke-width="4" stroke-linecap="round"/>${[42, 54, 66, 78].map((y) => `<path d="M22 ${y} H38" stroke="${O}" stroke-width="3"/>`).join('')}
    <rect x="18" y="24" width="26" height="8" rx="2" fill="#118ab2" ${st}/><path d="M24 24 L30 12 L36 24" fill="#ef476f" ${st}/>
    <path d="M40 30 Q60 30 70 62 Q76 84 92 86 L92 76 Q82 74 78 58 Q68 26 42 22 Z" fill="#ffd166" ${st}/>`);
  R('pl-balancoire', '🎠', () => `
    <path d="M10 90 L28 14 L46 90 M54 90 L72 14 L90 90" fill="none" stroke="#b5651d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 16 H76" stroke="#8a5a33" stroke-width="7" stroke-linecap="round"/>
    <path d="M42 18 V62 M58 18 V62" stroke="${O}" stroke-width="2"/><rect x="38" y="60" width="24" height="7" rx="3" fill="#ef476f" ${st}/>`);
  R('pl-soccer', '⚽', () => `
    <rect x="6" y="14" width="88" height="72" rx="6" fill="#5fbf5a" ${st}/>
    ${[17, 39, 61].map((x) => `<rect x="${x}" y="15.5" width="11" height="69" fill="#53b04e"/>`).join('')}
    <rect x="12" y="20" width="76" height="60" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M50 20 V80" stroke="#fff" stroke-width="2.5"/><circle cx="50" cy="50" r="11" fill="none" stroke="#fff" stroke-width="2.5"/>
    <rect x="12" y="38" width="10" height="24" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="78" y="38" width="10" height="24" fill="none" stroke="#fff" stroke-width="2.5"/>
    <circle cx="62" cy="58" r="7" fill="#fff" stroke="${O}" stroke-width="2"/><path d="M62 54 l3 2.5 l-1 3.5 h-4 l-1 -3.5 Z" fill="${O}"/>`);
  R('pl-abreuvoir', '🚰', () => `
    <path d="M44 88 V52 H56 V88" fill="#b9c3cf" ${st}/><rect x="34" y="84" width="32" height="7" rx="2" fill="#7a8696" ${st}/>
    <path d="M24 44 H76 Q74 58 50 58 Q26 58 24 44 Z" fill="#d6dde5" ${st}/>
    <path d="M44 42 Q48 16 66 22" fill="none" stroke="#4cb4e6" stroke-width="5" stroke-linecap="round"/><path d="M44 42 Q48 16 66 22" fill="none" stroke="#bfe8f8" stroke-width="2" stroke-linecap="round"/>
    <circle cx="70" cy="28" r="2.5" fill="#4cb4e6"/><circle cx="66" cy="34" r="2" fill="#4cb4e6"/>`);
  R('pl-velo', '🚲', () => `
    <circle cx="26" cy="64" r="17" fill="none" stroke="${O}" stroke-width="4"/><circle cx="74" cy="64" r="17" fill="none" stroke="${O}" stroke-width="4"/>
    <circle cx="26" cy="64" r="3" fill="${O}"/><circle cx="74" cy="64" r="3" fill="${O}"/>
    <path d="M26 64 L42 40 H66 L74 64 M42 40 L50 64 L66 40 M50 64 H26" fill="none" stroke="#ef476f" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M40 34 H50" stroke="${O}" stroke-width="5" stroke-linecap="round"/><path d="M66 40 L62 28 H72" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`);

  /* ---------------- La maison ---------------- */
  R('pl-cuisine', '🍳', () => `
    <rect x="16" y="34" width="68" height="56" rx="4" fill="#eef1f5" ${st}/><rect x="16" y="34" width="68" height="12" fill="#d6dde5" ${st}/>
    ${[28, 42, 58, 72].map((x) => `<circle cx="${x}" cy="40" r="2.6" fill="${O}"/>`).join('')}
    <rect x="24" y="54" width="52" height="28" rx="3" fill="#2b2d42"/><rect x="28" y="58" width="44" height="18" rx="2" fill="#f78c40" opacity=".35"/>
    <path d="M28 34 V22 H58 V34" fill="#7a8696" ${st}/><path d="M58 26 H70" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
    <path d="M36 16 q-3 -5 0 -10 M46 16 q-3 -5 0 -10" stroke="#9aa3b5" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  R('pl-divan', '🛋️', () => `
    <rect x="16" y="30" width="68" height="30" rx="10" fill="#118ab2" ${st}/>
    <rect x="8" y="46" width="18" height="34" rx="7" fill="#0f7aa0" ${st}/><rect x="74" y="46" width="18" height="34" rx="7" fill="#0f7aa0" ${st}/>
    <rect x="24" y="54" width="52" height="22" rx="6" fill="#36a3cc" ${st}/><path d="M50 54 V76" stroke="${O}" stroke-width="2"/>
    <rect x="30" y="38" width="16" height="14" rx="4" fill="#ffd166" stroke="${O}" stroke-width="2" transform="rotate(-10 38 45)"/>
    <path d="M16 80 v6 M84 80 v6" stroke="${O}" stroke-width="4" stroke-linecap="round"/>`);
  R('pl-lit', '🛏️', () => `
    <rect x="10" y="30" width="12" height="56" rx="3" fill="#b5651d" ${st}/><rect x="78" y="50" width="12" height="36" rx="3" fill="#b5651d" ${st}/>
    <rect x="20" y="50" width="60" height="22" rx="4" fill="#fff" ${st}/>
    <rect x="24" y="40" width="20" height="12" rx="5" fill="#fff" ${st}/>
    <path d="M42 46 H80 V72 H42 Z" fill="#9b5de5" ${st}/><path d="M48 54 h28 M48 62 h28" stroke="#c6a4f2" stroke-width="2.5"/>`);
  R('pl-bain', '🛁', () => `
    <circle cx="34" cy="30" r="7" fill="#dff3fb" stroke="#8fc7dc" stroke-width="2"/><circle cx="48" cy="24" r="9" fill="#dff3fb" stroke="#8fc7dc" stroke-width="2"/><circle cx="62" cy="32" r="6" fill="#dff3fb" stroke="#8fc7dc" stroke-width="2"/>
    <path d="M16 18 V48" stroke="#7a8696" stroke-width="4" stroke-linecap="round"/><path d="M16 18 Q16 12 22 12 H26" stroke="#7a8696" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M8 48 H92 V58 Q92 80 70 80 H30 Q8 80 8 58 Z" fill="#fff" ${st}/><path d="M14 52 H86" stroke="#4cb4e6" stroke-width="4" stroke-linecap="round"/>
    <path d="M24 80 l-4 8 M76 80 l4 8" stroke="${O}" stroke-width="4" stroke-linecap="round"/>`);
  R('pl-laveuse', '🧺', () => `
    <rect x="18" y="10" width="64" height="80" rx="6" fill="#eef1f5" ${st}/><path d="M18 26 H82" stroke="${O}" stroke-width="3"/>
    <circle cx="30" cy="18" r="3" fill="#ef476f"/><circle cx="40" cy="18" r="3" fill="#06a77d"/><rect x="58" y="15" width="18" height="6" rx="2" fill="#2b2d42"/>
    <circle cx="50" cy="58" r="22" fill="#cfeefa" ${st}/><path d="M32 62 Q42 52 50 62 T68 60 Q66 76 50 78 Q34 76 32 62 Z" fill="#4cb4e6" opacity=".8"/>
    <circle cx="50" cy="58" r="15" fill="none" stroke="#fff" stroke-width="2" opacity=".6" stroke-dasharray="10 8"/>`);

  /* ---------------- Ciel ---------------- */
  R('ciel-soleil', '☀️', (o, id) => `<defs><radialGradient id="${id}" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#fff7c2"/><stop offset=".55" stop-color="#ffd166"/><stop offset="1" stop-color="#f7941d"/></radialGradient>
    <radialGradient id="${id}g"><stop offset=".55" stop-color="#ffd166" stop-opacity=".55"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient></defs>
    <circle cx="50" cy="50" r="48" fill="url(#${id}g)"/>
    <g class="art-spin" style="transform-origin:50px 50px">${M.range(0, 11).map((i) => `<path d="M50 6 L54 18 H46 Z" fill="#f7a825" transform="rotate(${i * 30} 50 50)"/>`).join('')}</g>
    <circle cx="50" cy="50" r="26" fill="url(#${id})" stroke="#e98a10" stroke-width="2"/><circle cx="42" cy="42" r="7" fill="#fff" opacity=".45"/>`);
  R('ciel-terre', '🌍', (o, id) => `<defs><radialGradient id="${id}" cx="35%" cy="32%" r="75%"><stop offset="0" stop-color="#7fd3f7"/><stop offset=".7" stop-color="#2a8fd0"/><stop offset="1" stop-color="#1b5e9c"/></radialGradient>
    <radialGradient id="${id}s" cx="30%" cy="28%" r="80%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0b1430" stop-opacity=".45"/></radialGradient>
    <clipPath id="${id}c"><circle cx="50" cy="50" r="38"/></clipPath></defs>
    <circle cx="50" cy="50" r="44" fill="#9fdcff" opacity=".35"/>
    <circle cx="50" cy="50" r="38" fill="url(#${id})"/>
    <g clip-path="url(#${id}c)" fill="#55b85a" stroke="#2f7a37" stroke-width="1.5">
      <path d="M20 26 Q30 14 46 18 Q54 24 48 32 Q40 34 40 42 Q44 50 36 54 Q28 50 26 42 Q16 38 20 26 Z"/>
      <path d="M44 56 Q54 54 56 62 Q58 74 50 84 Q44 78 46 68 Q40 62 44 56 Z"/>
      <path d="M60 20 Q74 18 82 28 Q86 38 76 40 Q68 36 62 40 Q56 32 60 20 Z"/><path d="M70 50 Q80 50 82 58 Q78 64 70 60 Z"/>
      <path d="M14 8 H86 V14 Q50 20 14 14 Z" fill="#fff" stroke="none"/></g>
    <g clip-path="url(#${id}c)" fill="#fff" opacity=".7"><ellipse cx="66" cy="70" rx="12" ry="4"/><ellipse cx="30" cy="62" rx="9" ry="3"/></g>
    <circle cx="50" cy="50" r="38" fill="url(#${id}s)"/><circle cx="50" cy="50" r="38" fill="none" stroke="#1b5e9c" stroke-width="2"/>`);
  R('ciel-lune', '🌙', (o, id) => `<defs><radialGradient id="${id}" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#fbfbf4"/><stop offset=".75" stop-color="#d9d8cf"/><stop offset="1" stop-color="#b4b3aa"/></radialGradient></defs>
    <circle cx="50" cy="50" r="44" fill="#fffbe0" opacity=".25"/>
    <circle cx="50" cy="50" r="36" fill="url(#${id})" stroke="#9c9b92" stroke-width="2"/>
    ${[[38, 36, 7], [60, 30, 4], [62, 58, 9], [40, 64, 5], [28, 50, 3.5], [72, 44, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#c4c3ba" stroke="#a9a89f" stroke-width="1.2"/><path d="M${x - r * 0.7} ${y - r * 0.2} a${r} ${r} 0 0 1 ${r * 1.4} 0" stroke="#ecebe3" stroke-width="1.2" fill="none"/>`).join('')}`);
})();
