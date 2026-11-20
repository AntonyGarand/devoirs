/* =====================================================================
   anglais/art.js — dessins SVG (enregistrés dans M.art, réutilisables)
   Quand l'emoji est absent, ambigu ou récent : pastilles de couleur, tuque,
   mitaines, bottes d'hiver, habit de neige, chandail, ballon, auto, maison
   (recoloriables, opts.color), orignal, gomme à effacer, pupitre,
   12 poses d'enfant (consignes d'action), corps d'enfant (zones data-hot).
   M.EN.svg(name, opts)  → SVG brut (pour composer des scènes)
   M.EN.place(svg, x, y, w, h) → SVG imbriqué positionné
   ===================================================================== */

/** Options des dessins d'anglais : couleur (recoloriable), partie du corps illuminée. */
interface EnArtOpts extends ArtOpts {
  color?: string;
  part?: string;
}
/** Corps d'enfant (M.EN.bodySvg). */
interface EnBodyOpts {
  /** Zone illuminée. */
  highlight?: string;
  /** Zones actives (une zone inactive se fond dans sa zone « parent »). */
  zones?: string[];
  /** Parents qui absorbent leurs sous-zones. */
  fold?: string[];
  glow?: boolean;
}

interface EnglishApi {
  /** SVG brut d'un dessin (pour composer des scènes). */
  svg(name: string, opts?: EnArtOpts): string;
  /** SVG imbriqué positionné. */
  place(svg: string, x: number, y: number, w: number, h: number): string;
  /** Corps d'enfant de face, zones data-hot. */
  bodySvg(o?: EnBodyOpts): string;
}

(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const INK = '#2b2d42',
    SKIN = '#ffd3a8',
    SKIN_D = '#e9b48a';
  const hex = (c: string | undefined): string => EN.hex(c);
  const dk = (c: string, k = -0.3): string => EN.shade(hex(c), k);
  const strokeFor = (c: string): string => (hex(c).toLowerCase() === '#ffffff' ? '#9aa0a6' : dk(c, -0.35));
  const svg = (vb: string, body: string, label = ''): string =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"${label ? ` role="img" aria-label="${M.esc(label)}"` : ''}>${body}</svg>`;

  type Draw = (o: EnArtOpts) => string;
  const RAW: Record<string, Draw> = {};
  /** Enregistre un dessin à la fois dans M.art (partagé) et en brut (scènes). */
  const reg = (name: string, fn: Draw, emoji?: string): void => {
    RAW[name] = fn;
    M.art.register(name, fn, emoji);
  };
  EN.svg = (name, opts = {}) => (RAW[name] ? RAW[name](opts) : '');
  EN.place = (s, x, y, w, h) => s.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);

  /* ------------------------------ couleurs ------------------------------ */
  reg(
    'en-swatch',
    (o = {}) => {
      const c = hex(o.color || 'red');
      return svg(
        '0 0 100 100',
        `<path d="M50 8 C74 6 94 24 92 50 C95 74 76 94 50 92 C24 95 6 76 8 50 C6 26 26 9 50 8 Z" fill="${c}" stroke="${strokeFor(c)}" stroke-width="4"/>
      <ellipse cx="34" cy="32" rx="12" ry="7" fill="#fff" opacity=".35" transform="rotate(-30 34 32)"/>`,
      );
    },
    '🎨',
  );

  /* ------------------------------ vêtements ------------------------------ */
  reg(
    'en-tuque',
    (o = {}) => {
      const c = hex(o.color || 'red'),
        s = strokeFor(c);
      return svg(
        '0 0 100 100',
        `<circle cx="50" cy="15" r="11" fill="#fff" stroke="#b8bcc4" stroke-width="3"/>
      <path d="M17 70 Q15 24 50 22 Q85 24 83 70 Z" fill="${c}" stroke="${s}" stroke-width="3"/>
      <path d="M32 30 Q30 50 30 68 M50 24 L50 68 M68 30 Q70 50 70 68" stroke="${dk(c, -0.15)}" stroke-width="3" fill="none"/>
      <rect x="11" y="64" width="78" height="22" rx="9" fill="${dk(c, -0.12)}" stroke="${s}" stroke-width="3"/>
      ${[20, 30, 40, 50, 60, 70, 80].map((x) => `<line x1="${x}" y1="68" x2="${x}" y2="82" stroke="${s}" stroke-width="2" opacity=".5"/>`).join('')}`,
        'tuque',
      );
    },
    '🧶',
  );

  const mitten = (
    c: string,
    s: string,
  ): string => `<ellipse cx="12" cy="52" rx="8" ry="13" transform="rotate(-25 12 52)" fill="${c}" stroke="${s}" stroke-width="3"/>
    <path d="M14 82 L14 38 Q14 14 30 14 Q46 14 46 38 L46 82 Z" fill="${c}" stroke="${s}" stroke-width="3"/>
    <rect x="11" y="76" width="38" height="18" rx="6" fill="#fff" stroke="#b8bcc4" stroke-width="3"/>
    <path d="M22 50 l4 4 l4 -4 l4 4 l4 -4" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>`;
  reg(
    'en-mittens',
    (o = {}) => {
      const c = hex(o.color || 'blue'),
        s = strokeFor(c);
      return svg(
        '0 0 100 100',
        `<g transform="translate(0 2)">${mitten(c, s)}</g><g transform="translate(100 2) scale(-1 1)">${mitten(c, s)}</g>`,
        'mitaines',
      );
    },
    '🧤',
  );

  reg(
    'en-boots',
    (o = {}) => {
      const c = hex(o.color || 'brown'),
        s = strokeFor(c);
      const boot = `<path d="M10 20 L36 20 L38 62 Q60 62 66 74 L66 86 L8 86 Z" fill="${c}" stroke="${s}" stroke-width="3"/>
      <rect x="6" y="80" width="62" height="10" rx="4" fill="${INK}"/>
      <rect x="6" y="12" width="34" height="14" rx="7" fill="#fff" stroke="#b8bcc4" stroke-width="3"/>
      <path d="M14 40 h20 M14 52 h20" stroke="${dk(c, -0.2)}" stroke-width="3"/>`;
      return svg(
        '0 0 100 100',
        `<g transform="translate(30 4) scale(.9)">${boot}</g><g transform="translate(2 8) scale(.9)">${boot}</g>`,
        'bottes',
      );
    },
    '🥾',
  );

  reg(
    'en-snowsuit',
    (o = {}) => {
      const c = hex(o.color || 'purple'),
        s = strokeFor(c);
      return svg(
        '0 0 100 100',
        `<circle cx="50" cy="16" r="12" fill="${c}" stroke="${s}" stroke-width="3"/><circle cx="50" cy="17" r="7" fill="#fff" stroke="#b8bcc4" stroke-width="2"/>
      <path d="M30 30 L70 30 L88 62 L78 66 L68 48 L68 60 L64 94 L54 94 L50 66 L46 94 L36 94 L32 60 L32 48 L22 66 L12 62 Z" fill="${c}" stroke="${s}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="50" y1="30" x2="50" y2="62" stroke="${dk(c, -0.25)}" stroke-width="3"/>
      <rect x="40" y="38" width="20" height="4" fill="#ffd166"/>`,
        'habit de neige',
      );
    },
    '🧥',
  );

  reg(
    'en-sweater',
    (o = {}) => {
      const c = hex(o.color || 'green'),
        s = strokeFor(c);
      return svg(
        '0 0 100 100',
        `<path d="M34 14 Q50 24 66 14 L90 28 L94 62 L80 64 L78 44 L76 90 L24 90 L22 44 L20 64 L6 62 L10 28 Z" fill="${c}" stroke="${s}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 14 Q50 30 66 14" fill="none" stroke="${dk(c, -0.2)}" stroke-width="4"/>
      <rect x="24" y="82" width="52" height="8" fill="${dk(c, -0.12)}"/>`,
        'chandail',
      );
    },
    '👕',
  );

  /* ------------------------------ objets recoloriables ------------------------------ */
  reg(
    'en-ball',
    (o = {}) => {
      const c = hex(o.color || 'red'),
        s = strokeFor(c);
      return svg(
        '0 0 100 100',
        `<circle cx="50" cy="52" r="40" fill="${c}" stroke="${s}" stroke-width="4"/>
      <path d="M14 44 Q50 62 86 44" fill="none" stroke="${dk(c, -0.25)}" stroke-width="4"/>
      <path d="M50 12 Q34 52 50 92" fill="none" stroke="${dk(c, -0.25)}" stroke-width="4"/>
      <ellipse cx="34" cy="32" rx="10" ry="6" fill="#fff" opacity=".45" transform="rotate(-35 34 32)"/>`,
        'ballon',
      );
    },
    '⚽',
  );

  reg(
    'en-car',
    (o = {}) => {
      const c = hex(o.color || 'blue'),
        s = strokeFor(c);
      return svg(
        '0 0 100 100',
        `<path d="M8 66 L8 52 Q10 46 18 44 L30 28 Q34 24 42 24 L64 24 Q70 24 74 30 L84 44 Q94 46 94 54 L94 66 Z" fill="${c}" stroke="${s}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 30 L44 30 L44 44 L24 44 Z M50 30 L62 30 Q66 30 68 34 L74 44 L50 44 Z" fill="#cfe9f7" stroke="${s}" stroke-width="2"/>
      <circle cx="28" cy="68" r="11" fill="${INK}"/><circle cx="28" cy="68" r="4" fill="#ccc"/>
      <circle cx="74" cy="68" r="11" fill="${INK}"/><circle cx="74" cy="68" r="4" fill="#ccc"/>
      <rect x="86" y="50" width="7" height="5" rx="2" fill="#ffd166"/>`,
        'auto',
      );
    },
    '🚗',
  );

  reg(
    'en-house',
    (o = {}) => {
      const c = hex(o.color || 'yellow'),
        s = strokeFor(c);
      return svg(
        '0 0 100 100',
        `<rect x="18" y="44" width="64" height="48" fill="${c}" stroke="${s}" stroke-width="3"/>
      <path d="M8 48 L50 12 L92 48 Z" fill="${dk(c, -0.35)}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="42" y="64" width="16" height="28" fill="#8d5524" stroke="${INK}" stroke-width="2"/>
      <rect x="24" y="54" width="14" height="14" fill="#cfe9f7" stroke="${INK}" stroke-width="2"/>
      <rect x="62" y="54" width="14" height="14" fill="#cfe9f7" stroke="${INK}" stroke-width="2"/>`,
        'maison',
      );
    },
    '🏠',
  );

  /* ------------------------------ animaux et école ------------------------------ */
  reg(
    'en-moose',
    () =>
      svg(
        '0 0 100 100',
        `
    <path d="M30 26 Q18 10 8 16 Q14 20 12 26 Q20 24 22 30 Q26 26 30 32 Z" fill="#c9a26b" stroke="#6b4a1f" stroke-width="2"/>
    <path d="M52 26 Q64 10 74 16 Q68 20 70 26 Q62 24 60 30 Q56 26 52 32 Z" fill="#c9a26b" stroke="#6b4a1f" stroke-width="2"/>
    <rect x="40" y="56" width="50" height="22" rx="11" fill="#6b4a1f"/>
    <path d="M78 58 Q88 50 92 60" fill="none" stroke="#6b4a1f" stroke-width="6"/>
    <path d="M44 76 L44 96 M54 76 L54 96 M74 76 L74 96 M84 76 L84 96" stroke="#4a3313" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 30 Q42 26 50 32 L52 56 Q52 64 44 66 L36 66 Q28 64 28 56 Z" fill="#7a5426" stroke="#4a3313" stroke-width="2"/>
    <ellipse cx="40" cy="60" rx="13" ry="9" fill="#5c3d17"/>
    <circle cx="35" cy="59" r="2" fill="${INK}"/><circle cx="45" cy="59" r="2" fill="${INK}"/>
    <circle cx="34" cy="40" r="3" fill="#fff"/><circle cx="34" cy="40" r="1.6" fill="${INK}"/>
    <circle cx="46" cy="40" r="3" fill="#fff"/><circle cx="46" cy="40" r="1.6" fill="${INK}"/>
    <path d="M38 66 Q40 78 42 66" fill="#5c3d17"/>`,
        'orignal',
      ),
    '🦌',
  );

  reg(
    'en-eraser',
    () =>
      svg(
        '0 0 100 100',
        `<g transform="rotate(-20 50 50)"><rect x="14" y="34" width="72" height="32" rx="6" fill="#ffb3c7" stroke="#c9577a" stroke-width="3"/>
    <rect x="46" y="34" width="40" height="32" rx="4" fill="#4f8fd8" stroke="#2d5f9e" stroke-width="3"/>
    <path d="M18 66 L14 60" stroke="#c9577a" stroke-width="3"/></g>
    <path d="M14 86 q6 -4 12 0 t12 0" stroke="#bbb" stroke-width="3" fill="none"/>`,
        'gomme à effacer',
      ),
    '🩹',
  );

  reg(
    'en-desk',
    () =>
      svg(
        '0 0 100 100',
        `<rect x="10" y="40" width="80" height="10" rx="3" fill="#c98d4b" stroke="#7a4f22" stroke-width="3"/>
    <rect x="14" y="50" width="8" height="40" fill="#7a7f99"/><rect x="78" y="50" width="8" height="40" fill="#7a7f99"/>
    <rect x="22" y="52" width="56" height="14" fill="#d9a066" stroke="#7a4f22" stroke-width="2"/>
    <path d="M34 40 L34 28 L50 32 L66 28 L66 40" fill="#fff" stroke="${INK}" stroke-width="2"/><line x1="50" y1="32" x2="50" y2="40" stroke="${INK}" stroke-width="2"/>`,
        'pupitre',
      ),
    '🪑',
  );

  /* ------------------------------ poses (consignes d'action) ------------------------------ */
  /** Bonhomme : tête, tronc, bras et jambes à partir de points; extra = décor. */
  type Pt = [number, number];
  interface Pose {
    head: Pt;
    neck: Pt;
    hip: Pt;
    shoulder?: Pt;
    armL: Pt[];
    armR: Pt[];
    legL: Pt[];
    legR: Pt[];
    /** Yeux fermés. */
    closed?: boolean;
  }
  function kid(p: Pose, extra = '', under = ''): string {
    const line = (pts: Pt[], w: number, c: string): string =>
      `<polyline points="${pts.map((q) => q.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const sh = p.shoulder || [p.neck[0], p.neck[1] + 4];
    return svg(
      '0 0 100 120',
      `${under}
      ${line([p.hip, p.legL[0], p.legL[1]], 8, '#3d5a80')}${line([p.hip, p.legR[0], p.legR[1]], 8, '#3d5a80')}
      <circle cx="${p.legL[1][0]}" cy="${p.legL[1][1]}" r="4.5" fill="${INK}"/><circle cx="${p.legR[1][0]}" cy="${p.legR[1][1]}" r="4.5" fill="${INK}"/>
      ${line([p.neck, p.hip], 15, '#ef476f')}
      ${line([sh, p.armL[0], p.armL[1]], 6, '#ef476f')}${line([sh, p.armR[0], p.armR[1]], 6, '#ef476f')}
      <circle cx="${p.armL[1][0]}" cy="${p.armL[1][1]}" r="4.5" fill="${SKIN}" stroke="${SKIN_D}"/><circle cx="${p.armR[1][0]}" cy="${p.armR[1][1]}" r="4.5" fill="${SKIN}" stroke="${SKIN_D}"/>
      <circle cx="${p.head[0]}" cy="${p.head[1]}" r="11" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="2"/>
      <path d="M${p.head[0] - 11} ${p.head[1] - 2} Q${p.head[0]} ${p.head[1] - 18} ${p.head[0] + 11} ${p.head[1] - 2} Q${p.head[0]} ${p.head[1] - 8} ${p.head[0] - 11} ${p.head[1] - 2}Z" fill="#6b4a1f"/>
      ${p.closed ? `<path d="M${p.head[0] - 6} ${p.head[1] + 1} h4 M${p.head[0] + 2} ${p.head[1] + 1} h4" stroke="${INK}" stroke-width="2"/>` : `<circle cx="${p.head[0] - 4}" cy="${p.head[1] + 1}" r="1.6" fill="${INK}"/><circle cx="${p.head[0] + 4}" cy="${p.head[1] + 1}" r="1.6" fill="${INK}"/>`}
      <path d="M${p.head[0] - 4} ${p.head[1] + 5} Q${p.head[0]} ${p.head[1] + 8} ${p.head[0] + 4} ${p.head[1] + 5}" stroke="${INK}" stroke-width="1.6" fill="none"/>
      ${extra}`,
    );
  }
  const ground = '<line x1="6" y1="114" x2="94" y2="114" stroke="#c7c2b4" stroke-width="3" stroke-linecap="round"/>';
  const STAND: Pose = {
    head: [50, 22],
    neck: [50, 34],
    hip: [50, 72],
    armL: [
      [40, 52],
      [38, 70],
    ],
    armR: [
      [60, 52],
      [62, 70],
    ],
    legL: [
      [46, 92],
      [45, 110],
    ],
    legR: [
      [54, 92],
      [55, 110],
    ],
  };
  const POSES: Record<string, () => string> = {
    'stand-up': () =>
      kid(
        STAND,
        '<path d="M84 64 L84 30 M78 38 L84 30 L90 38" stroke="#06a77d" stroke-width="4" fill="none" stroke-linecap="round"/>',
        ground,
      ),
    'sit-down': () =>
      kid(
        {
          head: [38, 40],
          neck: [38, 52],
          hip: [40, 84],
          armL: [
            [46, 70],
            [58, 78],
          ],
          armR: [
            [50, 68],
            [62, 76],
          ],
          legL: [
            [66, 84],
            [66, 110],
          ],
          legR: [
            [70, 86],
            [72, 110],
          ],
        },
        '',
        ground +
          '<rect x="24" y="86" width="40" height="7" rx="2" fill="#c98d4b"/><rect x="24" y="52" width="7" height="62" fill="#a06a35"/><rect x="58" y="90" width="6" height="24" fill="#a06a35"/><rect x="26" y="92" width="5" height="22" fill="#a06a35"/>',
      ),
    jump: () =>
      kid(
        {
          head: [50, 20],
          neck: [50, 32],
          hip: [50, 64],
          armL: [
            [36, 22],
            [28, 10],
          ],
          armR: [
            [64, 22],
            [72, 10],
          ],
          legL: [
            [38, 78],
            [42, 94],
          ],
          legR: [
            [62, 78],
            [58, 94],
          ],
        },
        '<path d="M30 102 q4 -4 8 0 M62 102 q4 -4 8 0" stroke="#7a7f99" stroke-width="2.5" fill="none"/>',
        ground,
      ),
    clap: () =>
      kid(
        {
          head: [50, 22],
          neck: [50, 34],
          hip: [50, 72],
          armL: [
            [34, 52],
            [48, 46],
          ],
          armR: [
            [66, 52],
            [52, 46],
          ],
          legL: [
            [46, 92],
            [45, 110],
          ],
          legR: [
            [54, 92],
            [55, 110],
          ],
        },
        '<g stroke="#f4b400" stroke-width="3" stroke-linecap="round"><line x1="50" y1="38" x2="50" y2="34"/><line x1="40" y1="40" x2="36" y2="37"/><line x1="60" y1="40" x2="64" y2="37"/></g>',
        ground,
      ),
    'raise-hand': () =>
      kid(
        {
          ...STAND,
          armR: [
            [64, 20],
            [66, 4],
          ],
        },
        '',
        ground,
      ),
    wave: () =>
      kid(
        {
          ...STAND,
          armR: [
            [70, 46],
            [74, 24],
          ],
        },
        '<path d="M82 16 q6 8 0 16 M87 12 q9 12 0 24" stroke="#118ab2" stroke-width="3" fill="none" stroke-linecap="round"/>',
        ground,
      ),
    point: () =>
      kid(
        {
          ...STAND,
          armR: [
            [70, 40],
            [86, 40],
          ],
        },
        '<line x1="88" y1="40" x2="96" y2="40" stroke="#e9b48a" stroke-width="3" stroke-linecap="round"/>',
        ground,
      ),
    run: () =>
      kid(
        {
          head: [58, 22],
          neck: [56, 34],
          hip: [48, 70],
          armL: [
            [66, 50],
            [74, 40],
          ],
          armR: [
            [40, 52],
            [30, 46],
          ],
          legL: [
            [64, 86],
            [58, 106],
          ],
          legR: [
            [38, 88],
            [22, 98],
          ],
        },
        '<path d="M4 50 h14 M2 62 h12 M6 74 h12" stroke="#7a7f99" stroke-width="3" stroke-linecap="round"/>',
        ground,
      ),
    sleep: () =>
      svg(
        '0 0 100 120',
        `<rect x="6" y="78" width="88" height="14" rx="4" fill="#c98d4b"/><rect x="6" y="64" width="8" height="40" fill="#a06a35"/><rect x="86" y="72" width="8" height="32" fill="#a06a35"/>
      <rect x="14" y="66" width="20" height="12" rx="6" fill="#fff" stroke="#c7c2b4" stroke-width="2"/>
      <circle cx="26" cy="64" r="11" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="2"/><path d="M15 60 Q22 48 36 58 Q26 56 15 60Z" fill="#6b4a1f"/>
      <path d="M21 65 h4 M28 65 h4" stroke="${INK}" stroke-width="2"/>
      <path d="M34 62 Q60 56 86 64 L86 80 L34 80 Z" fill="#118ab2" stroke="#0b6585" stroke-width="2"/>
      <text x="52" y="38" font-size="16" font-weight="900" fill="#9b5de5" font-family="sans-serif">Z</text><text x="66" y="26" font-size="12" font-weight="900" fill="#9b5de5" font-family="sans-serif">z</text><text x="76" y="16" font-size="9" font-weight="900" fill="#9b5de5" font-family="sans-serif">z</text>`,
      ),
    eat: () =>
      kid(
        {
          ...STAND,
          armR: [
            [66, 52],
            [56, 30],
          ],
        },
        '<circle cx="58" cy="28" r="7" fill="#e63946" stroke="#9b1d27" stroke-width="2"/><path d="M58 21 q2 -4 5 -4" stroke="#2a9d50" stroke-width="2.5" fill="none"/>',
        ground,
      ),
    drink: () =>
      kid(
        {
          ...STAND,
          armR: [
            [66, 52],
            [57, 32],
          ],
        },
        '<path d="M53 18 L65 18 L63 36 L55 36 Z" fill="#cfe9f7" stroke="#118ab2" stroke-width="2"/><rect x="55" y="26" width="8" height="9" fill="#fff"/>',
        ground,
      ),
    read: () =>
      kid(
        {
          ...STAND,
          armL: [
            [38, 54],
            [40, 46],
          ],
          armR: [
            [62, 54],
            [60, 46],
          ],
        },
        '<path d="M32 40 L50 44 L68 40 L68 56 L50 60 L32 56 Z" fill="#fff" stroke="#118ab2" stroke-width="2.5"/><line x1="50" y1="44" x2="50" y2="60" stroke="#118ab2" stroke-width="2"/><path d="M36 47 h10 M36 51 h10 M54 47 h10 M54 51 h10" stroke="#c7c2b4" stroke-width="1.5"/>',
        ground,
      ),
  };
  Object.keys(POSES).forEach((k) => reg('en-pose-' + k, POSES[k], '🧍'));

  /* ------------------------------ corps d'enfant (zones data-hot) ------------------------------ */
  /** Corps d'enfant de face. Zones : head, hair, ears, eyes, nose, mouth, shoulders, arms, hands, tummy, legs, knees, feet, toes. */
  EN.bodySvg = (o = {}) => {
    const hl = o.highlight || '';
    // zones actives (o.zones) : une zone inactive se fond dans sa zone « parent » (nez → tête);
    // o.fold : parents qui absorbent leurs sous-zones (si on demande « head », toucher le nez compte).
    const PARENT: Record<string, string> = {
      eyes: 'head',
      nose: 'head',
      mouth: 'head',
      ears: 'head',
      hair: 'head',
      knees: 'legs',
      toes: 'feet',
      shoulders: 'arms',
    };
    const act = o.zones ? new Set(o.zones) : null,
      fold = o.fold || [];
    const hot = (id: string): string | null => {
      const p = PARENT[id];
      if (!act) return fold.includes(p) ? p : id;
      if (p && fold.includes(p) && act.has(p)) return p;
      if (act.has(id)) return id;
      return p && act.has(p) ? p : null;
    };
    const glow = o.glow ? ' style="filter:drop-shadow(0 0 9px #ffb703) drop-shadow(0 0 4px #ffb703)"' : '';
    const H = (id: string): string => {
      const h = hot(id);
      return (h ? `data-hot="${h}"` : '') + (hl === id ? ` class="on"${glow}` : '');
    };
    return `<svg class="en-body" viewBox="0 0 300 580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un enfant">
      <g ${H('legs')}><rect x="104" y="400" width="40" height="130" rx="14" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/><rect x="156" y="400" width="40" height="130" rx="14" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/></g>
      <g ${H('knees')}><ellipse cx="124" cy="468" rx="21" ry="17" fill="#f6bf91" stroke="${SKIN_D}" stroke-width="3"/><ellipse cx="176" cy="468" rx="21" ry="17" fill="#f6bf91" stroke="${SKIN_D}" stroke-width="3"/></g>
      <g ${H('feet')}><ellipse cx="114" cy="540" rx="36" ry="20" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/><ellipse cx="186" cy="540" rx="36" ry="20" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/></g>
      <g ${H('toes')}><rect x="74" y="546" width="50" height="30" fill="transparent"/><rect x="176" y="546" width="50" height="30" fill="transparent"/>
        ${[112, 101, 91, 82].map((x, i) => `<circle cx="${x}" cy="${556 + (i === 0 ? 2 : 0)}" r="${i === 0 ? 7 : 5.5}" fill="#f6bf91" stroke="${SKIN_D}" stroke-width="2"/>`).join('')}
        ${[188, 199, 209, 218].map((x, i) => `<circle cx="${x}" cy="${556 + (i === 0 ? 2 : 0)}" r="${i === 0 ? 7 : 5.5}" fill="#f6bf91" stroke="${SKIN_D}" stroke-width="2"/>`).join('')}</g>
      <rect x="98" y="352" width="104" height="62" rx="10" fill="#3d5a80"/>
      <g ${H('arms')}><path d="M96 238 Q66 244 62 280 L56 370 L86 372 L94 290 Z" fill="#ef476f" stroke="#b8304f" stroke-width="3"/><path d="M204 238 Q234 244 238 280 L244 370 L214 372 L206 290 Z" fill="#ef476f" stroke="#b8304f" stroke-width="3"/></g>
      <rect x="96" y="232" width="108" height="130" rx="22" fill="#ef476f" stroke="#b8304f" stroke-width="3"/>
      <g ${H('tummy')}><ellipse cx="150" cy="318" rx="44" ry="34" fill="#f26b8b" stroke="#b8304f" stroke-width="2" stroke-dasharray="5 5"/><circle cx="150" cy="322" r="3" fill="#b8304f"/></g>
      <g ${H('shoulders')}><circle cx="104" cy="246" r="24" fill="#f26b8b" stroke="#b8304f" stroke-width="3"/><circle cx="196" cy="246" r="24" fill="#f26b8b" stroke="#b8304f" stroke-width="3"/></g>
      <g ${H('hands')}><circle cx="70" cy="390" r="24" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/><circle cx="230" cy="390" r="24" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/>
        <path d="M52 380 l-8 -8 M88 380 l8 -8 M212 380 l-8 -8 M248 380 l8 -8" stroke="${SKIN_D}" stroke-width="6" stroke-linecap="round"/></g>
      <rect x="134" y="206" width="32" height="32" fill="${SKIN}"/>
      <g ${H('ears')}><circle cx="62" cy="128" r="20" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/><circle cx="238" cy="128" r="20" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/></g>
      <g ${H('head')}><circle cx="150" cy="124" r="88" fill="${SKIN}" stroke="${SKIN_D}" stroke-width="3"/><circle cx="100" cy="158" r="12" fill="#ffb3a7" opacity=".6"/><circle cx="200" cy="158" r="12" fill="#ffb3a7" opacity=".6"/></g>
      <g ${H('hair')}><path d="M62 112 Q60 30 150 30 Q240 30 238 112 Q222 70 190 64 Q170 82 128 70 Q100 66 62 112 Z" fill="#6b4a1f" stroke="#4a3313" stroke-width="3"/></g>
      <g ${H('eyes')}><rect x="96" y="96" width="108" height="40" rx="12" fill="transparent"/><ellipse cx="118" cy="116" rx="13" ry="15" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="120" cy="118" r="7" fill="${INK}"/>
        <ellipse cx="182" cy="116" rx="13" ry="15" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="180" cy="118" r="7" fill="${INK}"/></g>
      <g ${H('nose')}><rect x="124" y="138" width="52" height="30" rx="10" fill="transparent"/><path d="M150 140 Q140 160 146 164 Q150 166 156 162" fill="#f6bf91" stroke="${SKIN_D}" stroke-width="3"/></g>
      <g ${H('mouth')}><rect x="114" y="170" width="72" height="34" rx="12" fill="transparent"/><path d="M124 180 Q150 202 176 180 Q150 190 124 180 Z" fill="#c9374f" stroke="#8c1d33" stroke-width="2"/></g>
    </svg>`;
  };
  // Corps avec une partie illuminée (tuiles de vocabulaire : tête, cheveux, genoux…)
  reg('en-body', (o = {}) => EN.bodySvg({ highlight: o.part, glow: true }).replace(' class="en-body"', ''), '🧒');
})();
