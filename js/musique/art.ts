/* =====================================================================
   musique/art.js — instruments de percussion de la classe (M.art, préfixe mu-)
   Même style que js/art-lib.js : vue 100 × 100, contour encre 3 px, aplats doux, reflet clair.
     mu-tambour mu-tambourin mu-triangle mu-maracas mu-claves mu-woodblock
     mu-xylophone mu-cymbales mu-grelots mu-gong mu-flute
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  if (!M.art) return;
  const O = '#2b2d42';
  const st = `stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const V = (body: string) =>
    `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const R = (name: string, emoji: string, fn: () => string) => M.art.register(name, () => V(fn()), emoji);
  const shine = (x: number, y: number, w: number, r = 2) =>
    `<rect x="${x}" y="${y}" width="${w}" height="4" rx="${r}" fill="#fff" opacity=".6"/>`;

  R(
    'mu-tambour',
    '🥁',
    () => `
    <path d="M18 40 V70 Q50 86 82 70 V40" fill="#d1495b" ${st}/>
    <path d="M18 48 L30 76 M34 44 L46 80 M50 46 L62 80 M66 44 L76 74 M82 48" stroke="#ffd166" stroke-width="3" fill="none"/>
    <path d="M30 76 L34 44 M46 80 L50 46 M62 80 L66 44 M76 74 L82 48" stroke="#ffd166" stroke-width="3" fill="none"/>
    <ellipse cx="50" cy="40" rx="32" ry="11" fill="#f6e7c8" ${st}/>
    <ellipse cx="50" cy="40" rx="22" ry="6" fill="#fff" opacity=".45"/>
    <path d="M64 14 L54 34" ${st}/><circle cx="66" cy="11" r="5" fill="#fff3d6" ${st}/>
    <path d="M86 18 L68 34" ${st}/><circle cx="89" cy="15" r="5" fill="#fff3d6" ${st}/>`,
  );
  R(
    'mu-tambourin',
    '🪘',
    () => `
    <circle cx="50" cy="52" r="34" fill="#c98b4a" ${st}/>
    <circle cx="50" cy="52" r="26" fill="#f6e7c8" ${st}/>
    <circle cx="44" cy="45" r="8" fill="#fff" opacity=".5"/>
    ${[0, 72, 144, 216, 288]
      .map((a) => {
        const r = 30,
          x = 50 + r * Math.cos(((a - 90) * Math.PI) / 180),
          y = 52 + r * Math.sin(((a - 90) * Math.PI) / 180);
        return `<rect x="${x - 6}" y="${y - 3.5}" width="12" height="7" rx="2" fill="#ffd166" ${st} stroke-width="2" transform="rotate(${a} ${x} ${y})"/>`;
      })
      .join('')}`,
  );
  R(
    'mu-triangle',
    '🔺',
    () => `
    <path d="M50 14 L84 78 L22 78 L44 36" fill="none" stroke="${O}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M50 14 L84 78 L22 78 L44 36" fill="none" stroke="#c4ccd8" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M52 20 L80 74" stroke="#fff" stroke-width="1.5" opacity=".8"/>
    <path d="M50 14 V4" stroke="#e85d9e" stroke-width="3"/>
    <path d="M60 90 L82 56" stroke="${O}" stroke-width="6" stroke-linecap="round"/><path d="M60 90 L82 56" stroke="#c4ccd8" stroke-width="2.5" stroke-linecap="round"/>`,
  );
  R(
    'mu-maracas',
    '🪇',
    () => `
    <path d="M30 60 L18 92" stroke="${O}" stroke-width="9" stroke-linecap="round"/><path d="M30 60 L18 92" stroke="#c98b4a" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="38" cy="38" rx="17" ry="23" transform="rotate(22 38 38)" fill="#ef476f" ${st}/>
    <path d="M28 30 Q38 26 46 34 M26 42 Q36 38 46 46" stroke="#ffd166" stroke-width="3" fill="none"/>
    <path d="M70 62 L82 92" stroke="${O}" stroke-width="9" stroke-linecap="round"/><path d="M70 62 L82 92" stroke="#c98b4a" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="62" cy="40" rx="17" ry="23" transform="rotate(-22 62 40)" fill="#06d6a0" ${st}/>
    <path d="M54 34 Q62 28 72 32 M54 46 Q64 40 74 44" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>`,
  );
  R(
    'mu-claves',
    '🥢',
    () => `
    <rect x="12" y="38" width="76" height="13" rx="6.5" transform="rotate(-20 50 44)" fill="#c98b4a" ${st}/>
    <rect x="12" y="54" width="76" height="13" rx="6.5" transform="rotate(14 50 60)" fill="#e0a96d" ${st}/>
    ${shine(22, 41, 40)}
    <path d="M46 40 l4 -8 M54 42 l7 -6 M42 44 l-6 -6" stroke="#ffd166" stroke-width="3"/>`,
  );
  R(
    'mu-woodblock',
    '🪵',
    () => `
    <rect x="16" y="34" width="68" height="34" rx="10" fill="#d08c4e" ${st}/>
    <path d="M24 46 H76" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
    <path d="M24 58 H76" stroke="#8a5a33" stroke-width="2" opacity=".5"/>
    ${shine(24, 38, 38)}
    <path d="M62 24 L44 34" stroke="${O}" stroke-width="5" stroke-linecap="round"/><path d="M80 10 L62 24" stroke="${O}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="44" cy="34" r="6" fill="#ffd166" ${st}/>`,
  );
  R(
    'mu-xylophone',
    '🎼',
    () => `
    <path d="M14 40 L86 30 M14 74 L86 84" stroke="#8a5a33" stroke-width="6" stroke-linecap="round"/>
    ${['#ef476f', '#f78c40', '#ffd166', '#06d6a0', '#118ab2', '#9b5de5']
      .map((c, i) => {
        const x = 18 + i * 11.5,
          top = 30 + i * 1.6,
          bot = 82 - i * 1.6;
        return `<rect x="${x}" y="${top}" width="9" height="${bot - top}" rx="3" fill="${c}" ${st} stroke-width="2.5"/>`;
      })
      .join('')}
    <path d="M70 16 L52 44" stroke="${O}" stroke-width="3"/><circle cx="52" cy="46" r="5" fill="#fff3d6" ${st} stroke-width="2.5"/>`,
  );
  R(
    'mu-cymbales',
    '🥏',
    () => `
    <ellipse cx="34" cy="50" rx="24" ry="9" transform="rotate(-62 34 50)" fill="#f4c542" ${st}/>
    <ellipse cx="66" cy="50" rx="24" ry="9" transform="rotate(62 66 50)" fill="#f4c542" ${st}/>
    <path d="M28 34 L34 66 M72 34 L66 66" stroke="#fff" stroke-width="2" opacity=".6"/>
    <circle cx="34" cy="50" r="4" fill="#c98b4a" ${st} stroke-width="2"/><circle cx="66" cy="50" r="4" fill="#c98b4a" ${st} stroke-width="2"/>
    <path d="M47 30 l3 -8 M53 30 l-3 -8 M44 70 l-4 6 M56 70 l4 6" stroke="#e85d9e" stroke-width="3"/>`,
  );
  R(
    'mu-grelots',
    '🔔',
    () => `
    <path d="M20 40 Q50 82 80 40" fill="none" stroke="#d1495b" stroke-width="9" stroke-linecap="round"/>
    ${[
      [26, 50],
      [40, 62],
      [56, 64],
      [72, 52],
    ]
      .map(
        ([x, y]) =>
          `<circle cx="${x}" cy="${y}" r="9" fill="#f4c542" ${st}/><path d="M${x - 5} ${y + 2} H${x + 5}" stroke="${O}" stroke-width="2.5"/><circle cx="${x - 3}" cy="${y - 4}" r="2.2" fill="#fff" opacity=".8"/>`,
      )
      .join('')}`,
  );
  R(
    'mu-gong',
    '🟠',
    () => `
    <path d="M18 16 V88 M82 16 V88 M12 16 H88" stroke="#8a5a33" stroke-width="6" stroke-linecap="round"/>
    <path d="M38 16 V24 M62 16 V24" stroke="${O}" stroke-width="2"/>
    <circle cx="50" cy="52" r="27" fill="#e9b949" ${st}/><circle cx="50" cy="52" r="9" fill="#d69e2e" ${st} stroke-width="2"/>
    <circle cx="42" cy="44" r="6" fill="#fff" opacity=".45"/>`,
  );
  R(
    'mu-flute',
    '🪈',
    () => `
    <rect x="44" y="10" width="13" height="82" rx="6" fill="#f6e7c8" ${st}/>
    <path d="M44 22 H57" stroke="${O}" stroke-width="2.5"/>
    ${[34, 44, 54, 64, 74].map((y) => `<circle cx="50.5" cy="${y}" r="2.8" fill="${O}"/>`).join('')}
    ${shine(46, 26, 3, 1)}`,
  );
})();
