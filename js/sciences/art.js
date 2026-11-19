/* =====================================================================
   sciences/art.js — dessins SVG originaux (aucun fichier externe)
   1) M.art.register('sc-…') : animaux sans emoji (lynx, porc-épic, marmotte, huard),
      replis d'emoji récents (castor, orignal…), objets et stades de cycles.
   2) M.SC.svg.* : scènes avec zones data-hot (plante, corps, Terre, arbre et ombre,
      paysage, pots, bac d'eau, aimants). Les zones fines ont une surface touchable
      élargie (cercle ou rectangle transparent).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = (M.SC = M.SC || {});
  const V = (w, h, inner, cls = '') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const R = (name, emoji, fn) => M.art.register(name, fn, emoji);
  const INK = '#2b2d42';

  /* ================= Animaux ================= */
  R('sc-lynx', '🐱', () => V(100, 100, `
    <path d="M24 56 L8 74 L22 70 L18 84 L34 78 L50 90 L66 78 L82 84 L78 70 L92 74 L76 56 Z" fill="#e2d3bb" stroke="#8a7458" stroke-width="1.5"/>
    <path d="M20 70 l8 -4 M80 70 l-8 -4 M28 80 l6 -6 M72 80 l-6 -6" stroke="#3b2f25" stroke-width="2"/>
    <polygon points="25,42 31,13 46,32" fill="#b99b72" stroke="#5a4632" stroke-width="2"/><polygon points="75,42 69,13 54,32" fill="#b99b72" stroke="#5a4632" stroke-width="2"/>
    <polygon points="29,36 31,20 40,32" fill="#f1e2cc"/><polygon points="71,36 69,20 60,32" fill="#f1e2cc"/>
    <path d="M31 14 L29 2 M69 14 L71 2" stroke="#1b1b1b" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="50" cy="52" r="26" fill="#c9ad86" stroke="#5a4632" stroke-width="2"/>
    <circle cx="44" cy="34" r="1.6" fill="#5a4632"/><circle cx="56" cy="34" r="1.6" fill="#5a4632"/><circle cx="50" cy="31" r="1.6" fill="#5a4632"/>
    <ellipse cx="40" cy="49" rx="5" ry="5.5" fill="#e3b23c" stroke="#3b2f25"/><ellipse cx="60" cy="49" rx="5" ry="5.5" fill="#e3b23c" stroke="#3b2f25"/>
    <ellipse cx="40" cy="49" rx="1.6" ry="4" fill="#111"/><ellipse cx="60" cy="49" rx="1.6" ry="4" fill="#111"/>
    <ellipse cx="50" cy="65" rx="12" ry="9" fill="#f4ece0"/>
    <polygon points="45,58 55,58 50,64" fill="#3b2a20"/><path d="M50 64 v4 M50 68 q-5 4 -9 1 M50 68 q5 4 9 1" stroke="#3b2a20" stroke-width="1.6" fill="none"/>
    <path d="M38 62 h-14 M38 66 h-13 M62 62 h14 M62 66 h13" stroke="#fff" stroke-width="1"/>`));

  R('sc-porcepic', '🦔', () => {
    let q = '';
    for (let i = 0; i <= 26; i++) {
      const a = Math.PI * (1.05 + (i / 26) * 0.95);
      const x = 46 + 33 * Math.cos(a), y = 64 + 22 * Math.sin(a);
      const L = 13 + (i % 3) * 3;
      q += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + L * Math.cos(a)).toFixed(1)}" y2="${(y + L * Math.sin(a)).toFixed(1)}" stroke="${i % 2 ? '#f1e6d2' : '#8c7a66'}" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    return V(100, 100, `${q}
      <ellipse cx="46" cy="66" rx="34" ry="22" fill="#4d3b2d"/>
      <ellipse cx="80" cy="72" rx="13" ry="10" fill="#3e3026"/><circle cx="92" cy="74" r="3.2" fill="#111"/>
      <circle cx="83" cy="68" r="2.2" fill="#111"/><circle cx="76" cy="63" r="3" fill="#2c221b"/>
      <rect x="28" y="84" width="8" height="8" rx="3" fill="#2c221b"/><rect x="58" y="84" width="8" height="8" rx="3" fill="#2c221b"/>
      <path d="M12 66 q-8 2 -8 8" stroke="#4d3b2d" stroke-width="6" stroke-linecap="round" fill="none"/>`);
  });

  R('sc-marmotte', '🐹', () => V(100, 100, `
    <ellipse cx="78" cy="84" rx="9" ry="5" fill="#5b4330" transform="rotate(-25 78 84)"/>
    <ellipse cx="50" cy="64" rx="22" ry="29" fill="#8b6a45" stroke="#5b4330" stroke-width="2"/>
    <ellipse cx="50" cy="70" rx="13" ry="19" fill="#c9a77d"/>
    <circle cx="37" cy="15" r="4.5" fill="#6d5034"/><circle cx="63" cy="15" r="4.5" fill="#6d5034"/>
    <circle cx="50" cy="28" r="16" fill="#7a5a3a" stroke="#5b4330" stroke-width="2"/>
    <ellipse cx="50" cy="35" rx="8" ry="6" fill="#c9a77d"/><circle cx="50" cy="31.5" r="2.4" fill="#1b1b1b"/>
    <rect x="48" y="38" width="4" height="5" rx="1" fill="#fff" stroke="#bbb" stroke-width=".6"/>
    <circle cx="43" cy="24" r="2.3" fill="#111"/><circle cx="57" cy="24" r="2.3" fill="#111"/>
    <ellipse cx="42" cy="51" rx="4" ry="8" fill="#6d5034" transform="rotate(25 42 51)"/><ellipse cx="58" cy="51" rx="4" ry="8" fill="#6d5034" transform="rotate(-25 58 51)"/>
    <ellipse cx="40" cy="93" rx="8" ry="4" fill="#5b4330"/><ellipse cx="60" cy="93" rx="8" ry="4" fill="#5b4330"/>`));

  R('sc-huard', '🦆', () => {
    let dots = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) dots += `<rect x="${22 + c * 6 + (r % 2) * 3}" y="${56 + r * 4}" width="2.6" height="2.2" fill="#fff"/>`;
    return V(100, 100, `
      <path d="M0 72 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 v28 h-96 z" fill="#8fcbe8"/>
      <path d="M10 66 Q20 50 52 52 Q70 52 76 60 L78 70 Q50 76 14 72 Z" fill="#1d2126"/>${dots}
      <path d="M66 62 Q68 46 74 38 L84 40 Q80 50 78 64 Z" fill="#17201d"/>
      <path d="M70 52 l2 -1 M72 49 l2 -1 M74 46 l2 -1 M78 50 l2 0 M77 53 l2 0" stroke="#fff" stroke-width="1.6"/>
      <circle cx="80" cy="38" r="10" fill="#17201d"/><circle cx="83" cy="36" r="2.3" fill="#d62828"/>
      <polygon points="88,36 100,39 88,42" fill="#1b1b1b"/>
      <path d="M0 74 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#5aa9d6" stroke-width="2" fill="none"/>`);
  });

  R('sc-castor', '🦫', () => V(100, 100, `
    <ellipse cx="18" cy="82" rx="16" ry="7" fill="#3e3026"/><path d="M8 80 l20 4 M10 84 l18 -4" stroke="#5b4a3a" stroke-width="1.2"/>
    <ellipse cx="46" cy="66" rx="25" ry="21" fill="#8a5a33" stroke="#5b3a20" stroke-width="2"/>
    <circle cx="69" cy="45" r="14" fill="#8a5a33" stroke="#5b3a20" stroke-width="2"/>
    <circle cx="62" cy="33" r="4" fill="#6b4425"/><circle cx="73" cy="41" r="2.2" fill="#111"/>
    <ellipse cx="80" cy="48" rx="5" ry="4" fill="#6b4425"/><circle cx="83" cy="46" r="2.2" fill="#111"/>
    <rect x="76" y="52" width="5" height="7" rx="1" fill="#f2a33a" stroke="#b86e12" stroke-width=".8"/>
    <ellipse cx="62" cy="68" rx="5" ry="8" fill="#6b4425"/><ellipse cx="40" cy="87" rx="8" ry="4" fill="#5b3a20"/><ellipse cx="58" cy="87" rx="8" ry="4" fill="#5b3a20"/>`));

  R('sc-orignal', '🦌', () => V(100, 100, `
    <path d="M38 30 C26 30 18 26 10 14 L16 16 L12 8 L20 13 L20 4 L26 12 L30 4 L32 14 L38 10 L40 22 Z" fill="#d8c29a" stroke="#8a7656" stroke-width="1.5"/>
    <path d="M62 30 C74 30 82 26 90 14 L84 16 L88 8 L80 13 L80 4 L74 12 L70 4 L68 14 L62 10 L60 22 Z" fill="#d8c29a" stroke="#8a7656" stroke-width="1.5"/>
    <ellipse cx="33" cy="36" rx="7" ry="4" fill="#4a3020" transform="rotate(-20 33 36)"/><ellipse cx="67" cy="36" rx="7" ry="4" fill="#4a3020" transform="rotate(20 67 36)"/>
    <path d="M38 28 Q50 22 62 28 L64 66 Q50 72 36 66 Z" fill="#5a3d28"/>
    <ellipse cx="50" cy="74" rx="16" ry="12" fill="#4a3020"/><ellipse cx="44" cy="76" rx="2.5" ry="3.5" fill="#1b1b1b"/><ellipse cx="56" cy="76" rx="2.5" ry="3.5" fill="#1b1b1b"/>
    <circle cx="42" cy="44" r="2.5" fill="#111"/><circle cx="58" cy="44" r="2.5" fill="#111"/>
    <path d="M48 86 Q50 98 54 86 Z" fill="#3a2618"/>`));

  /* ================= Objets ================= */
  R('sc-bouchon', '🟫', () => V(100, 100, `<rect x="30" y="22" width="40" height="60" rx="6" fill="#c8a26b" stroke="#8a6a3c" stroke-width="2"/><ellipse cx="50" cy="22" rx="20" ry="7" fill="#d9b981" stroke="#8a6a3c" stroke-width="2"/>
    ${[[38, 40], [56, 46], [44, 58], [60, 66], [40, 72], [52, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#8a6a3c"/>`).join('')}`));
  R('sc-clou', '📍', () => V(100, 100, `<rect x="30" y="12" width="40" height="8" rx="3" fill="#8d99ae" stroke="#5c677d" stroke-width="2"/><polygon points="45,20 55,20 55,76 50,92 45,76" fill="#adb5c4" stroke="#5c677d" stroke-width="2"/>`));
  R('sc-canette', '🥤', () => V(100, 100, `<rect x="30" y="16" width="40" height="72" rx="8" fill="#dfe3ea" stroke="#7d8597" stroke-width="2"/><rect x="30" y="36" width="40" height="30" fill="#ef476f"/><ellipse cx="50" cy="16" rx="20" ry="5" fill="#c7ccd6" stroke="#7d8597" stroke-width="2"/><ellipse cx="54" cy="15" rx="5" ry="2" fill="none" stroke="#7d8597" stroke-width="1.5"/><text x="50" y="57" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">ALU</text>`));
  R('sc-orange-pelee', '🍊', () => V(100, 100, `<circle cx="50" cy="54" r="32" fill="#f8b25a" stroke="#e48a1b" stroke-width="2"/>${[0, 45, 90, 135].map((a) => `<line x1="50" y1="22" x2="50" y2="86" stroke="#fde7c4" stroke-width="2.5" transform="rotate(${a} 50 54)"/>`).join('')}<circle cx="50" cy="54" r="5" fill="#fde7c4"/>`));
  R('sc-pingpong', '⚪', () => V(100, 100, `<circle cx="50" cy="52" r="30" fill="#fff" stroke="#b0b5c2" stroke-width="3"/><circle cx="40" cy="42" r="8" fill="#f1f3f7"/>`));
  R('sc-bille', '🔵', () => V(100, 100, `<circle cx="50" cy="52" r="28" fill="#bfe6f7" stroke="#5aa9d6" stroke-width="3"/><path d="M30 58 Q50 30 70 50" stroke="#118ab2" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="40" cy="40" r="6" fill="#fff" opacity=".85"/>`));
  R('sc-pate', '🔴', () => V(100, 100, `<circle cx="50" cy="56" r="28" fill="#f28fb1" stroke="#c45b85" stroke-width="2.5"/><path d="M36 50 q8 -8 18 -4" stroke="#fbc3d7" stroke-width="4" fill="none" stroke-linecap="round"/>`));
  R('sc-bateau-pate', '⛵', () => V(100, 100, `<path d="M12 50 Q14 76 50 78 Q86 76 88 50 Q70 60 50 60 Q30 60 12 50 Z" fill="#f28fb1" stroke="#c45b85" stroke-width="2.5"/><path d="M14 52 Q50 66 86 52" stroke="#c45b85" stroke-width="2" fill="none"/>`));
  R('sc-piece', '🪙', () => V(100, 100, `<circle cx="50" cy="50" r="32" fill="#e9c46a" stroke="#b8901f" stroke-width="3"/><circle cx="50" cy="50" r="24" fill="none" stroke="#b8901f" stroke-width="2"/><text x="50" y="58" text-anchor="middle" font-size="22" font-weight="900" fill="#8a6a10">1¢</text>`));
  R('sc-plume', '🪶', () => V(100, 100, `<path d="M78 10 Q30 20 22 84 Q60 70 78 10 Z" fill="#cdb4f5" stroke="#7b5cc4" stroke-width="2"/><path d="M80 8 L18 92" stroke="#5a3fa0" stroke-width="2.5"/>`));
  R('sc-buche', '🪵', () => V(100, 100, `<rect x="14" y="34" width="66" height="36" rx="10" fill="#8a5a33" stroke="#5b3a20" stroke-width="2"/><ellipse cx="80" cy="52" rx="10" ry="18" fill="#e3c08f" stroke="#5b3a20" stroke-width="2"/><ellipse cx="80" cy="52" rx="5" ry="9" fill="none" stroke="#b08550" stroke-width="1.5"/><path d="M20 44 h40 M24 58 h44" stroke="#5b3a20" stroke-width="1.5"/>`));
  R('sc-caillou', '🪨', () => V(100, 100, `<path d="M16 70 Q12 44 36 34 Q58 24 78 40 Q92 56 82 72 Q60 82 16 70 Z" fill="#9aa1ad" stroke="#5c6370" stroke-width="2.5"/><path d="M36 46 q8 -4 14 0" stroke="#c9ced6" stroke-width="3" fill="none"/>`));
  R('sc-vitre', '🪟', () => V(100, 100, `<rect x="16" y="14" width="68" height="72" rx="4" fill="#dff3fb" stroke="#8a6a3c" stroke-width="5"/><line x1="50" y1="14" x2="50" y2="86" stroke="#8a6a3c" stroke-width="4"/><line x1="16" y1="50" x2="84" y2="50" stroke="#8a6a3c" stroke-width="4"/><path d="M24 28 l10 -8 M58 28 l10 -8" stroke="#fff" stroke-width="3"/>`));
  R('sc-bocal', '🫙', () => V(100, 100, `<rect x="26" y="14" width="48" height="12" rx="3" fill="#8d99ae"/><path d="M28 26 h44 v54 q0 8 -8 8 h-28 q-8 0 -8 -8 z" fill="#e6f6fd" stroke="#7fb8d6" stroke-width="3"/><path d="M36 36 v36" stroke="#fff" stroke-width="4"/>`));
  R('sc-sac', '🛍️', () => V(100, 100, `<path d="M24 30 h52 l6 58 h-64 z" fill="#eef3f8" stroke="#9aa6b6" stroke-width="2.5" opacity=".95"/><path d="M36 30 q0 -18 14 -18 q14 0 14 18" fill="none" stroke="#9aa6b6" stroke-width="3"/><path d="M30 46 l8 30 M60 44 l10 34" stroke="#d3dbe5" stroke-width="2"/>`));
  R('sc-papier-cire', '📄', () => V(100, 100, `<rect x="10" y="20" width="80" height="60" rx="4" fill="#f4f1e6" stroke="#c8c1a8" stroke-width="2" opacity=".75"/><path d="M14 40 q20 -6 40 0 t32 0 M14 60 q20 -6 40 0 t32 0" stroke="#fff" stroke-width="3" fill="none"/>`));
  R('sc-verre-givre', '🧊', () => V(100, 100, `<rect x="16" y="10" width="68" height="80" rx="4" fill="#e8eef3" stroke="#9aa6b6" stroke-width="3"/>${M.range(0, 29).map((i) => `<circle cx="${22 + ((i * 37) % 58)}" cy="${16 + ((i * 23) % 70)}" r="2.2" fill="#fff"/>`).join('')}`));
  R('sc-papier-soie', '🎀', () => V(100, 100, `<path d="M12 26 L40 18 L66 26 L90 18 L86 80 L60 74 L34 82 L14 76 Z" fill="#f9c6dc" stroke="#e48bb1" stroke-width="2" opacity=".8"/><path d="M40 18 L34 82 M66 26 L60 74" stroke="#f3a6c8" stroke-width="1.5"/>`));
  R('sc-papier-sable', '🟨', () => V(100, 100, `<rect x="12" y="20" width="76" height="60" rx="4" fill="#e3c27d" stroke="#a8843d" stroke-width="2"/>${M.range(0, 44).map((i) => `<circle cx="${18 + ((i * 29) % 66)}" cy="${25 + ((i * 17) % 50)}" r="1.4" fill="#8a6a2c"/>`).join('')}`));
  R('sc-regle', '📏', () => V(100, 100, `<rect x="8" y="38" width="84" height="24" rx="3" fill="#bfe6f7" stroke="#118ab2" stroke-width="2" opacity=".9"/>${M.range(0, 10).map((i) => `<line x1="${14 + i * 7.2}" y1="38" x2="${14 + i * 7.2}" y2="${i % 5 ? 46 : 52}" stroke="#118ab2" stroke-width="1.5"/>`).join('')}`));

  /* ================= Stades des cycles ================= */
  R('sc-frai', '🫧', () => V(100, 100, `${[[30, 40], [48, 34], [66, 42], [38, 58], [56, 56], [72, 62], [46, 74], [28, 72], [62, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#dff3fb" stroke="#7fb8d6" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3.5" fill="#1b1b1b"/>`).join('')}`));
  R('sc-tetard', '〰️', () => V(100, 100, `<path d="M52 50 Q70 40 92 54 Q74 52 70 60 Q66 52 52 54 Z" fill="#4a5a3a"/><ellipse cx="40" cy="52" rx="18" ry="13" fill="#3c4a2e"/><circle cx="32" cy="48" r="2.6" fill="#fff"/><circle cx="32" cy="48" r="1.2" fill="#111"/>`));
  R('sc-tetard-pattes', '🦵', () => V(100, 100, `<path d="M56 50 Q72 44 86 52 Q72 52 68 58 Q64 52 56 54 Z" fill="#4a5a3a"/><ellipse cx="42" cy="52" rx="18" ry="13" fill="#3e5a30"/><path d="M50 62 l6 12 l6 0 M36 62 l-4 12 l-6 0" stroke="#3e5a30" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="33" cy="47" r="2.8" fill="#fff"/><circle cx="33" cy="47" r="1.3" fill="#111"/>`));
  R('sc-oeuf-papillon', '⚪', () => V(100, 100, `<path d="M10 70 Q50 20 92 64 Q50 86 10 70 Z" fill="#7cc36b" stroke="#3f8a37" stroke-width="2"/><path d="M14 69 Q50 52 88 64" stroke="#3f8a37" stroke-width="1.5" fill="none"/><ellipse cx="54" cy="56" rx="6" ry="8" fill="#fff6d6" stroke="#c9b26b" stroke-width="1.5"/>`));
  R('sc-chrysalide', '💚', () => V(100, 100, `<line x1="20" y1="8" x2="80" y2="8" stroke="#6b4425" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="8" x2="50" y2="18" stroke="#333" stroke-width="2"/><path d="M50 18 Q72 30 68 58 Q64 84 50 90 Q36 84 32 58 Q28 30 50 18 Z" fill="#6cc48a" stroke="#2f8a54" stroke-width="2"/><path d="M36 36 Q50 32 64 36" stroke="#1b1b1b" stroke-width="2.5" fill="none"/>${[[40, 38], [46, 40], [54, 40], [60, 38], [44, 70], [56, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#f4c430"/>`).join('')}`));
  R('sc-graine', '🫘', () => V(100, 100, `<path d="M26 56 Q22 30 50 30 Q80 30 76 56 Q72 76 50 72 Q42 70 40 64 Q34 72 26 56 Z" fill="#a85a3a" stroke="#6b3420" stroke-width="2.5"/><path d="M40 58 q4 -6 8 0" stroke="#f2d6c2" stroke-width="3" fill="none"/>`));
  R('sc-gousse', '🫛', () => V(100, 100, `<path d="M12 70 Q30 30 88 24 Q74 60 12 70 Z" fill="#7cc36b" stroke="#3f8a37" stroke-width="2.5"/>${[[34, 56], [50, 46], [66, 37]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#a7dc8f" stroke="#3f8a37" stroke-width="1.5"/>`).join('')}`));

  /* ================= Scènes (M.SC.svg) ================= */
  const S = (SC.svg = {});
  const hit = (attrs) => `<rect ${attrs} fill="transparent"/>`;

  /** Plante à fleur. opts.parts : ids à rendre touchables (data-hot); anchors pour le format label. */
  S.plante = function ({ hot = true, flowerColor = '#ef7fb0', cls = 'sc-fig' } = {}) {
    const h = (id, anchor) => (hot ? ` data-hot="${id}" data-anchor="${anchor}"` : '');
    const petals = M.range(0, 5).map((i) => { const a = (i * Math.PI) / 3; return `<circle cx="${(180 + 20 * Math.cos(a)).toFixed(1)}" cy="${(64 + 20 * Math.sin(a)).toFixed(1)}" r="14" fill="${flowerColor}" stroke="#c4507f" stroke-width="1.5"/>`; }).join('');
    return V(360, 310, `
      <rect x="0" y="0" width="360" height="200" fill="#eef8ff"/>
      <rect x="0" y="200" width="360" height="110" fill="#8a5a2b"/><rect x="0" y="200" width="360" height="8" fill="#6b4420"/>
      <g${h('racines', '290,262')}>${hit('x="110" y="206" width="140" height="100"')}
        <path d="M180 202 C175 230 158 246 140 274 M180 202 C182 236 180 258 182 296 M180 202 C188 232 204 250 222 272 M166 236 l-18 6 M192 246 l18 4 M181 270 l-14 14" stroke="#f1e2c6" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g${h('tige', '262,170')}>${hit('x="164" y="84" width="32" height="118"')}<path d="M180 202 L180 86" stroke="#3f8a37" stroke-width="9" stroke-linecap="round"/></g>
      <g${h('feuille', '64,108')}>
        <path d="M178 160 Q136 126 104 146 Q140 176 178 160 Z" fill="#4fbf5a" stroke="#2f7a37" stroke-width="2"/><path d="M176 159 L110 147" stroke="#2f7a37" stroke-width="2"/>
        <path d="M182 128 Q224 96 254 116 Q218 144 182 128 Z" fill="#4fbf5a" stroke="#2f7a37" stroke-width="2"/><path d="M184 127 L248 116" stroke="#2f7a37" stroke-width="2"/></g>
      <g${h('fleur', '286,48')}><circle cx="180" cy="64" r="44" fill="transparent"/>${petals}<circle cx="180" cy="64" r="12" fill="#f4b400" stroke="#b07d00" stroke-width="2"/></g>`, cls);
  };

  /** Silhouette neutre de face (aucune indication gauche/droite). */
  S.corps = function ({ hot = true, cls = 'sc-fig' } = {}) {
    const BODY = '#a9cdeb', LINE = '#3f5a7a', J = '#7fa9cf';
    const A = { tete: '300,40', cou: '60,96', epaule: '300,118', bras: '50,170', coude: '300,210', main: '50,290', ventre: '300,170', jambe: '50,350', genou: '300,330', pied: '300,412' };
    const h = (id) => (hot ? ` data-hot="${id}" data-anchor="${A[id]}"` : '');
    const limb = (pts) => `<polyline points="${pts}" fill="none" stroke="${BODY}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="${LINE}" stroke-width="2" stroke-dasharray="0" opacity="0"/>`;
    const joint = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${J}"/><circle cx="${x}" cy="${y}" r="22" fill="transparent"/>`;
    return V(360, 430, `
      <g${h('bras')}>${limb('132,116 110,196 98,268')}${limb('228,116 250,196 262,268')}</g>
      <g${h('jambe')}>${limb('160,236 154,330 150,396')}${limb('200,236 206,330 210,396')}</g>
      <g${h('ventre')}><rect x="132" y="100" width="96" height="146" rx="34" fill="${BODY}" stroke="${LINE}" stroke-width="2"/><circle cx="180" cy="190" r="3" fill="${LINE}"/></g>
      <g${h('cou')}><rect x="166" y="80" width="28" height="26" fill="${BODY}"/><rect x="156" y="78" width="48" height="30" fill="transparent"/></g>
      <g${h('tete')}><circle cx="180" cy="48" r="36" fill="${BODY}" stroke="${LINE}" stroke-width="2"/><circle cx="167" cy="44" r="4" fill="${LINE}"/><circle cx="193" cy="44" r="4" fill="${LINE}"/><path d="M168 60 q12 10 24 0" stroke="${LINE}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g${h('epaule')}><circle cx="140" cy="112" r="16" fill="${J}" opacity=".85"/><circle cx="220" cy="112" r="16" fill="${J}" opacity=".85"/><circle cx="140" cy="112" r="22" fill="transparent"/><circle cx="220" cy="112" r="22" fill="transparent"/></g>
      <g${h('coude')}>${joint(110, 196)}${joint(250, 196)}</g>
      <g${h('genou')}>${joint(154, 330)}${joint(206, 330)}</g>
      <g${h('main')}><circle cx="96" cy="282" r="17" fill="${BODY}" stroke="${LINE}" stroke-width="2"/><circle cx="264" cy="282" r="17" fill="${BODY}" stroke="${LINE}" stroke-width="2"/><circle cx="96" cy="282" r="23" fill="transparent"/><circle cx="264" cy="282" r="23" fill="transparent"/></g>
      <g${h('pied')}><ellipse cx="140" cy="410" rx="26" ry="12" fill="${BODY}" stroke="${LINE}" stroke-width="2"/><ellipse cx="220" cy="410" rx="26" ry="12" fill="${BODY}" stroke="${LINE}" stroke-width="2"/></g>`, cls);
  };

  // S.terre, S.arbre (et S.ombre, S.erable) : voir sciences/ciel.js

  /** Paysage québécois : forêt, lac, champ, ville (data-hot = foret | eau | champ | ville). */
  S.paysage = function ({ hot = true, cls = 'sc-fig' } = {}) {
    const h = (id) => (hot ? ` data-hot="${id}"` : '');
    const pine = (x, y, s = 1) => `<polygon points="${x},${y - 46 * s} ${x - 18 * s},${y} ${x + 18 * s},${y}" fill="#2f7a37"/><rect x="${x - 3}" y="${y}" width="6" height="${10 * s}" fill="#6b4425"/>`;
    return V(600, 300, `<rect width="600" height="300" fill="#cfeafc"/><circle cx="520" cy="46" r="22" fill="#ffd166"/>
      <path d="M0 150 L70 70 L130 130 L190 80 L260 150 Z" fill="#9db4c8"/>
      <g${h('foret')}>${hit('x="0" y="100" width="190" height="200"')}<rect x="0" y="150" width="190" height="150" fill="#7cc36b"/>
        ${[[24, 200], [62, 186], [100, 204], [140, 190], [40, 260], [84, 250], [128, 266], [168, 244]].map(([x, y]) => pine(x, y)).join('')}<text x="95" y="292" text-anchor="middle" class="sc-hot-label">Forêt</text></g>
      <g${h('eau')}>${hit('x="190" y="150" width="160" height="150"')}<rect x="190" y="150" width="160" height="150" fill="#9ed36a"/><ellipse cx="270" cy="222" rx="74" ry="44" fill="#4cb4e6" stroke="#2c86b8" stroke-width="3"/>
        <path d="M230 214 q10 -6 20 0 M272 234 q10 -6 20 0" stroke="#dff3fb" stroke-width="3" fill="none"/><text x="270" y="292" text-anchor="middle" class="sc-hot-label">Lac</text></g>
      <g${h('champ')}>${hit('x="350" y="150" width="120" height="150"')}<rect x="350" y="150" width="120" height="150" fill="#e9d36b"/>
        ${M.range(0, 11).map((i) => `<path d="M${360 + (i % 4) * 28} ${176 + Math.floor(i / 4) * 34} l4 -14 l4 14" stroke="#b08d1f" stroke-width="3" fill="none"/>`).join('')}<text x="410" y="292" text-anchor="middle" class="sc-hot-label">Champ</text></g>
      <g${h('ville')}>${hit('x="470" y="80" width="130" height="220"')}<rect x="470" y="150" width="130" height="150" fill="#c9c9d1"/>
        <rect x="478" y="96" width="36" height="120" fill="#8d99ae"/><rect x="520" y="120" width="30" height="96" fill="#adb5c4"/><rect x="556" y="104" width="36" height="112" fill="#7d8597"/>
        ${M.range(0, 8).map((i) => `<rect x="${484 + (i % 3) * 38}" y="${110 + Math.floor(i / 3) * 30}" width="10" height="12" fill="#ffd166"/>`).join('')}
        <rect x="470" y="226" width="130" height="16" fill="#555"/><text x="535" y="292" text-anchor="middle" class="sc-hot-label">Ville</text></g>`, cls);
  };

  /** Pot de plante (expérience) : eau 0–3, lumière 0–2; état facultatif (pour la simulation). */
  S.pot = function ({ eau = 2, lum = 2, cls = 'sc-choice-fig' } = {}) {
    const bg = ['#3b3355', '#b7c4d1', '#fff3c4'][lum];
    const drops = eau === 0 ? '<text x="96" y="30" font-size="18" text-anchor="middle">🚫</text>' : `<text x="98" y="30" font-size="15" text-anchor="middle">${'💧'.repeat(Math.min(eau, 3))}</text>`;
    const deco = lum === 2 ? '<text x="20" y="30" font-size="22">☀️</text>' : lum === 1 ? '<text x="20" y="30" font-size="22">⛅</text>' : '<text x="20" y="30" font-size="20">🌑</text>';
    const flood = eau === 3 ? '<rect x="38" y="84" width="44" height="8" fill="#4cb4e6" opacity=".85"/>' : '';
    return V(120, 140, `<rect width="120" height="140" rx="12" fill="${bg}"/>${deco}${drops}
      <path d="M60 88 L60 60" stroke="#3f8a37" stroke-width="4"/><path d="M60 70 q-14 -10 -20 -2 q10 8 20 2 M60 64 q14 -10 20 -2 q-10 8 -20 2" fill="#4fbf5a" stroke="#2f7a37" stroke-width="1.2"/>
      <polygon points="34,88 86,88 78,128 42,128" fill="#d9774b" stroke="#a5532d" stroke-width="2"/><rect x="34" y="84" width="52" height="8" rx="2" fill="#6b4420"/>${flood}`, cls);
  };

  /** Bac d'eau : l'objet (html) est placé dans <g class="sc-obj">; retourne le SVG. */
  S.bac = function (objHtml, { y = 26 } = {}) {
    return V(300, 220, `<rect width="300" height="220" rx="16" fill="#f6f1ff"/>
      <rect x="30" y="90" width="240" height="110" fill="#8fd0f0" opacity=".75"/>
      <path class="sc-wave" d="M30 90 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="#2c86b8" stroke-width="3" fill="none"/>
      <path d="M26 40 V204 H274 V40" fill="none" stroke="#7d8597" stroke-width="5" stroke-linejoin="round"/>
      <g class="sc-obj" transform="translate(150 ${y})">${objHtml}</g>`, 'sc-fig');
  };
  /** Objet dessiné dans un bac (emoji ou art, centré sur 0,0, 56 px). */
  S.objInSvg = function (o) {
    if (o.art && (!o.emoji || (o.recent && !SC.emojiOk(o.emoji))) && M.art.has(o.art)) return M.art.html(o.art).replace(/^<span[^>]*>/, '').replace(/<\/span>$/, '').replace('<svg ', '<svg x="-30" y="-30" width="60" height="60" ');
    return `<text x="0" y="16" text-anchor="middle" font-size="44">${o.emoji}</text>`;
  };

  /** Aimant en U (rouge N / bleu S), ouverture vers le bas. */
  S.aimantU = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-30 0 V-34 A30 30 0 0 1 30 -34 V0 H16 V-34 A16 16 0 0 0 -16 -34 V0 Z" fill="#d62828" stroke="#7a1010" stroke-width="2"/><rect x="-30" y="-6" width="14" height="14" fill="#c9ced6" stroke="#7d8597"/><rect x="16" y="-6" width="14" height="14" fill="#c9ced6" stroke="#7d8597"/></g>`;
  /** Aimant droit : flip = pôles inversés. Largeur 120, centré sur x. */
  S.barre = (x, y, flip = false) => {
    const [a, b] = flip ? [['S', '#118ab2'], ['N', '#d62828']] : [['N', '#d62828'], ['S', '#118ab2']];
    return `<g transform="translate(${x} ${y})"><rect x="-60" y="-18" width="60" height="36" fill="${a[1]}" stroke="#2b2d42" stroke-width="2"/><rect x="0" y="-18" width="60" height="36" fill="${b[1]}" stroke="#2b2d42" stroke-width="2"/>
      <text x="-30" y="9" text-anchor="middle" font-size="24" font-weight="900" fill="#fff">${a[0]}</text><text x="30" y="9" text-anchor="middle" font-size="24" font-weight="900" fill="#fff">${b[0]}</text></g>`;
  };
  SC.INK = INK;
})();
