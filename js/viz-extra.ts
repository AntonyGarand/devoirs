/* =====================================================================
   viz-extra.js — visuels partagés supplémentaires
     M.viz.barModelHtml(spec) / M.viz.barModel(el, spec) → {showMe}   modèle en barres (problèmes)
     M.viz.timeline(spec)  → html SVG (événements et graduations avec data-hot)
     M.viz.plan(spec)      → html (plan/carte avec légende, quadrillage, rose des vents)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const V = M.viz;

  /* ------------------------------------------------------------------
     Modèle en barres
     spec = {
       type: 'tout' | 'comparaison' | 'groupes',
       rows: [{ label?, emoji?, segs: [{ v: 15 | null, text?, tone?: 'A'|'B'|'E'|'X' }] }],
       total?: { v, text?, unknown? },   // accolade au-dessus de la 1re barre
       diff?:  { v, text?, unknown? },   // comparaison : écart pointillé après la barre la plus courte
       scale?: 'prop' | 'schema',
       answer?: nombre                   // remplace « ? » au showMe
     }
     ------------------------------------------------------------------ */
  const TONES = {
    A: ['#ffe1e8', '#ef476f'],
    B: ['#dff3fb', '#118ab2'],
    C: ['#dcf7ee', '#06a77d'],
    E: ['#ffffff', '#c7c2b4'],
    X: ['#f1eee6', '#9a968a'],
    Q: ['#fff1b8', '#e9b949'],
  };
  V.barModelHtml = function (spec, opts = {}) {
    const rows = spec.rows || [];
    const hasLabels = rows.some((r) => r.label || r.emoji);
    const LBL = hasLabels ? 110 : 10,
      H = 46,
      GAP = 30,
      TOP = spec.total ? 56 : 14,
      MIN = 54,
      AREA = spec.compact || opts.compact ? 300 : 440;
    const known = (s) => (s.v == null ? null : s.v);
    const sums = rows.map((r) => r.segs.reduce((a, s) => a + (known(s) ?? 0), 0));
    const unknownGuess = (() => {
      const vals = rows.flatMap((r) => r.segs.map(known)).filter((v) => v != null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 5;
    })();
    const tot = Math.max(
      spec.total && spec.total.v != null ? spec.total.v : 0,
      spec.diff && spec.diff.v != null ? Math.max(...sums) : 0,
      ...rows.map((r) => r.segs.reduce((a, s) => a + (known(s) ?? unknownGuess), 0)),
    );
    const unit = spec.scale === 'schema' ? AREA / Math.max(1, ...rows.map((r) => r.segs.length)) : AREA / Math.max(1, tot);
    const segW = (s) => (spec.scale === 'schema' ? unit : Math.max(MIN, (known(s) ?? unknownGuess) * unit));
    let maxX = 0;
    let body = '';
    const rowW = [];
    let k = 0;
    rows.forEach((r, ri) => {
      const y = TOP + ri * (H + GAP);
      let x = LBL;
      if (hasLabels)
        body += `<text x="${LBL - 10}" y="${y + H / 2 + 7}" text-anchor="end" class="bm-lbl">${r.emoji ? r.emoji + ' ' : ''}${M.esc(r.label || '')}</text>`;
      r.segs.forEach((s) => {
        const w = segW(s),
          unknown = s.v == null;
        const tone = unknown ? 'Q' : s.tone || 'A';
        const [fill, stroke] = TONES[tone] || TONES.A;
        const txt = s.text ?? (unknown ? '?' : String(s.v));
        body +=
          `<g class="bm-seg ${unknown ? 'bm-unknown' : ''} ${s.isNew ? 'bm-new' : ''}" style="--i:${k++}"><rect x="${x}" y="${y}" width="${w}" height="${H}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3" ${tone === 'E' || unknown ? 'stroke-dasharray="7 5"' : ''}/>` +
          (tone === 'X'
            ? `<line x1="${x + 6}" y1="${y + 6}" x2="${x + w - 6}" y2="${y + H - 6}" stroke="#d62828" stroke-width="3"/>`
            : '') +
          `<text x="${x + w / 2}" y="${y + H / 2 + 8}" text-anchor="middle" class="bm-txt">${M.esc(txt)}</text></g>`;
        x += w;
      });
      rowW.push(x);
      maxX = Math.max(maxX, x);
    });
    if (spec.diff && rows.length >= 2) {
      const short = rowW[0] <= rowW[1] ? 0 : 1,
        long = 1 - short;
      const y = TOP + short * (H + GAP),
        x1 = rowW[short],
        x2 = rowW[long];
      const unknown = spec.diff.unknown || spec.diff.v == null;
      body += `<g class="bm-diff ${unknown ? 'bm-unknown' : ''} ${spec.diff.isNew ? 'bm-new' : ''}" style="--i:${k++}"><rect x="${x1}" y="${y}" width="${Math.max(MIN, x2 - x1)}" height="${H}" rx="6" fill="${unknown ? TONES.Q[0] : '#fff'}" stroke="${unknown ? TONES.Q[1] : '#7a7f99'}" stroke-width="3" stroke-dasharray="7 5"/>
        <text x="${x1 + Math.max(MIN, x2 - x1) / 2}" y="${y + H / 2 + 8}" text-anchor="middle" class="bm-txt">${M.esc(spec.diff.text ?? (unknown ? '?' : String(spec.diff.v)))}</text></g>`;
      maxX = Math.max(maxX, x1 + Math.max(MIN, x2 - x1));
    }
    if (spec.total) {
      const x1 = LBL,
        x2 = Math.max(rowW[0] || LBL, spec.type === 'groupes' ? rowW[0] : rowW[0]);
      const y = TOP - 14,
        unknown = spec.total.unknown || spec.total.v == null;
      body += `<g class="${unknown ? 'bm-unknown' : ''}"><path class="bm-brace" pathLength="1" d="M${x1} ${y + 8} Q${x1} ${y} ${x1 + 10} ${y} L${(x1 + x2) / 2 - 10} ${y} Q${(x1 + x2) / 2} ${y} ${(x1 + x2) / 2} ${y - 8} Q${(x1 + x2) / 2} ${y} ${(x1 + x2) / 2 + 10} ${y} L${x2 - 10} ${y} Q${x2} ${y} ${x2} ${y + 8}" fill="none" stroke="#2b2d42" stroke-width="3"/>
        <text x="${(x1 + x2) / 2}" y="${y - 14}" text-anchor="middle" class="bm-txt ${unknown ? 'bm-q' : ''}">${M.esc(spec.total.text ?? (unknown ? '?' : String(spec.total.v)))}</text></g>`;
    }
    const Wd = Math.max(maxX + 14, 300),
      Ht = TOP + rows.length * (H + GAP);
    const aria = opts.aria || spec.aria || 'Modèle en barres';
    return `<svg class="barmodel${opts.static ? ' no-enter' : ''}" viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="${M.esc(aria)}" style="max-width:${Math.round(Wd * (opts.scale || 1.1))}px">${body}</svg>`;
  };
  V.barModel = function (el, spec) {
    const draw = (s, again) => (el.innerHTML = `<div class="bm-wrap">${V.barModelHtml(s, { static: again })}</div>`);
    draw(spec);
    return {
      async showMe() {
        if (spec.answer == null) return;
        const fill = (o) =>
          o && (o.v == null || o.unknown) ? { ...o, v: spec.answer, text: String(spec.answer), unknown: false, isNew: true } : o;
        const s2 = {
          ...spec,
          rows: spec.rows.map((r) => ({
            ...r,
            segs: r.segs.map((sg) => (sg.v == null ? { ...sg, v: spec.answer, text: String(spec.answer), tone: 'C', isNew: true } : sg)),
          })),
          total: fill(spec.total),
          diff: fill(spec.diff),
        };
        await M.sleep(250);
        if (!el.isConnected) return;
        draw(s2, true);
        M.sfx.pop();
      },
    };
  };

  /* ------------------------------------------------------------------
     Ligne du temps : { from, to, step=1, unit?, title?, events:[{at, label, emoji, id}], hide?:[ids], tickLabel?(v) }
     Graduations : data-hot="t<valeur>" ; événements : data-hot="<id>"
     ------------------------------------------------------------------ */
  V.timeline = function ({ from, to, step = 1, title = '', events = [], hide = [], tickLabel = (v) => v }) {
    const X0 = 50,
      X1 = 950,
      Y = 150,
      span = to - from || 1;
    const x = (v) => X0 + ((v - from) * (X1 - X0)) / span;
    const uid = 'tl' + ++tlUid;
    let s = `<svg class="timeline" viewBox="0 0 1000 220" role="img" aria-label="${M.esc(title || 'Ligne du temps')}"><defs>
      <linearGradient id="${uid}-band" x1="0" x2="1"><stop offset="0" stop-color="#fff1d6"/><stop offset=".5" stop-color="#fdf7ea"/><stop offset="1" stop-color="#e3f4fb"/></linearGradient>
      <filter id="${uid}-sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#2b2d42" flood-opacity=".14"/></filter></defs>`;
    s += `<rect x="12" y="${title ? 40 : 8}" width="976" height="${title ? 172 : 204}" rx="22" fill="url(#${uid}-band)"/>`;
    if (title) s += `<text x="500" y="28" text-anchor="middle" class="tl-title">${M.esc(title)}</text>`;
    s += `<line class="tl-axis" pathLength="1" x1="${X0 - 20}" y1="${Y}" x2="${X1 + 25}" y2="${Y}" stroke="#2b2d42" stroke-width="5" stroke-linecap="round"/><path class="tl-arrow" d="M${X1 + 25} ${Y - 10} L${X1 + 40} ${Y} L${X1 + 25} ${Y + 10} z" fill="#2b2d42"/>`;
    let i = 0;
    for (let v = from; v <= to; v += step)
      s += `<g data-hot="t${v}" class="tl-tick" style="--i:${i++}"><rect x="${x(v) - 22}" y="${Y - 16}" width="44" height="66" fill="transparent"/><line x1="${x(v)}" y1="${Y - 12}" x2="${x(v)}" y2="${Y + 12}" stroke="#2b2d42" stroke-width="3" stroke-linecap="round"/><text x="${x(v)}" y="${Y + 40}" text-anchor="middle" class="tl-lbl">${M.esc(tickLabel(v))}</text></g>`;
    const lanes = {};
    events.forEach((e, j) => {
      const lane = (lanes[e.at] = (lanes[e.at] || 0) + 1) - 1;
      const ex = x(e.at),
        ey = Y - 52 - lane * 58,
        hidden = hide.includes(e.id);
      s += `<g data-hot="${M.esc(e.id)}" class="tl-ev ${hidden ? 'hidden' : ''}" style="--i:${j}"><line x1="${ex}" y1="${ey + 22}" x2="${ex}" y2="${Y - 6}" stroke="#c7c2b4" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/><circle cx="${ex}" cy="${Y}" r="7" fill="${hidden ? '#e9b949' : '#118ab2'}" stroke="#fff" stroke-width="2.5"/>
        <g class="tl-card"><rect x="${ex - 40}" y="${ey - 26}" width="80" height="48" rx="14" fill="${hidden ? '#fff8e6' : '#fff'}" stroke="${hidden ? '#e9b949' : '#e7e1d3'}" stroke-width="3" ${hidden ? 'stroke-dasharray="6 5"' : ''} filter="url(#${uid}-sh)"/>
        <text x="${ex}" y="${ey + 10}" text-anchor="middle" font-size="28" ${hidden ? 'font-weight="900" fill="#b8860b"' : ''}>${hidden ? '?' : e.emoji || ''}</text></g>
        <title>${M.esc(hidden ? '?' : e.label || '')}</title></g>`;
    });
    return s + '</svg>';
  };
  let tlUid = 0;

  /* ------------------------------------------------------------------
     Plan / carte (vue d'oiseau)
     { title?, cols, rows, cell=64, grid?:false (A,B,C… / 1,2,3…), north?:false,
       ground?: 'grass' | 'floor' | 'tiles' (défaut : herbe),
       roads?:[{x1,y1,x2,y2}] (en cases), water?:[{x,y,w,h}],
       places:[{id, x, y, w=1, h=1, emoji, art?, fill?: 'repeat'|'stretch', label, color?}], legend?:true,
       decor?: arbres et fleurs dans l'herbe libre (défaut : oui dehors, sans quadrillage),
       alive?: autos sur les rues et nuages qui passent (défaut : oui) }
     Lieux : data-hot="<id>". Toucher un élément de légende surligne le lieu.
     Les décors (arbres, autos, nuages) sont dessinés, jamais en émoji : ils ne se confondent pas
     avec les symboles de la légende. Le hasard des décors est fixé par le titre (même plan = même dessin).
     ------------------------------------------------------------------ */
  let planUid = 0;
  const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const seeded = (str) => {
    let h = 2166136261;
    for (const ch of String(str)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => {
      h = Math.imul(h ^ (h >>> 15), h | 1);
      h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
      return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };
  };
  const segDist = (px, py, r) => {
    const dx = r.x2 - r.x1,
      dy = r.y2 - r.y1,
      L = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - r.x1) * dx + (py - r.y1) * dy) / L));
    return Math.hypot(px - (r.x1 + t * dx), py - (r.y1 + t * dy));
  };
  const CAR_COLORS = ['#ef476f', '#118ab2', '#ffd166', '#06a77d', '#9b5de5', '#f78c40'];
  /** Petite auto vue de dessus, centrée sur l'origine, qui regarde vers +x. */
  const carShape = (len, color) => {
    const w = len * 0.52,
      l = len / 2;
    return (
      `<rect x="${-l + 2}" y="${-w / 2 + 3}" width="${len}" height="${w}" rx="${w * 0.3}" fill="rgba(0,0,0,.2)"/>` +
      `<rect x="${-l}" y="${-w / 2}" width="${len}" height="${w}" rx="${w * 0.3}" fill="${color}" stroke="#2b2d42" stroke-width="1.5"/>` +
      `<rect x="${l * 0.05}" y="${-w / 2 + 2.5}" width="${l * 0.45}" height="${w - 5}" rx="2.5" fill="#cfeefa" stroke="#2b2d42" stroke-width="1"/>` +
      `<rect x="${-l * 0.62}" y="${-w / 2 + 3}" width="${l * 0.3}" height="${w - 6}" rx="2" fill="#cfeefa" opacity=".7"/>` +
      `<circle cx="${l - 2}" cy="${-w / 2 + 3}" r="1.8" fill="#fff6b0"/><circle cx="${l - 2}" cy="${w / 2 - 3}" r="1.8" fill="#fff6b0"/>`
    );
  };
  /** Nuage (ou son ombre) : quelques cercles fondus. */
  const puff = (x, y, sc, fill, op) =>
    `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${sc * 0.55}" fill="${fill}"/><circle cx="${x + sc * 0.6}" cy="${y - sc * 0.25}" r="${sc * 0.7}" fill="${fill}"/><circle cx="${x + sc * 1.3}" cy="${y}" r="${sc * 0.5}" fill="${fill}"/><ellipse cx="${x + sc * 0.65}" cy="${y + sc * 0.2}" rx="${sc * 1.1}" ry="${sc * 0.4}" fill="${fill}"/></g>`;

  V.plan = function ({
    title = '',
    cols,
    rows,
    cell = 64,
    grid = false,
    north = false,
    ground = 'grass',
    roads = [],
    water = [],
    places = [],
    legend = true,
    decor,
    alive = true,
  }) {
    const id = 'pl' + ++planUid,
      rnd = seeded(title + cols + 'x' + rows + places.map((p) => p.id).join());
    const OX = grid ? 34 : 12,
      OY = 12,
      GW = cols * cell,
      GH = rows * cell;
    const W = OX + GW + (north ? 76 : 12),
      H = OY + GH + (grid ? 34 : 14);
    const X = (v) => OX + v * cell,
      Y = (v) => OY + v * cell;
    const indoor = ground === 'floor' || ground === 'tiles';
    if (decor == null) decor = !indoor && !grid;
    const motion = alive && !reducedMotion();
    let s = `<svg class="plan-svg ${indoor ? 'indoor' : 'outdoor'}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${M.esc(title || 'Plan')}"><defs>
      <pattern id="${id}-grass" width="36" height="36" patternUnits="userSpaceOnUse"><rect width="36" height="36" fill="#c9e7ae"/><path d="M5 9 l2 -5 l2 5 M23 27 l2 -5 l2 5 M27 8 l1.5 -4 l1.5 4 M9 30 l1.5 -4 l1.5 4" stroke="#a9d68a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="17" cy="16" r="1.4" fill="#e2f3d2"/><circle cx="33" cy="20" r="1.2" fill="#e2f3d2"/></pattern>
      <pattern id="${id}-floor" width="96" height="24" patternUnits="userSpaceOnUse"><rect width="96" height="24" fill="#f1dcb8"/><rect y="12" width="96" height="12" fill="#ecd3a9"/><path d="M0 12 H96 M0 24 H96 M30 0 V12 M78 0 V12 M54 12 V24 M8 12 V24" stroke="#dcc092" stroke-width="1.5"/><path d="M12 5 q8 2 14 0 M60 18 q8 2 14 0" stroke="#e3c99c" stroke-width="1" fill="none"/></pattern>
      <pattern id="${id}-tiles" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#eef3f6"/><rect width="16" height="16" fill="#e2eaef"/><rect x="16" y="16" width="16" height="16" fill="#e2eaef"/></pattern>
      <radialGradient id="${id}-vig" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#2b2d42" stop-opacity=".16"/></radialGradient>
      <clipPath id="${id}-clip"><rect x="${OX}" y="${OY}" width="${GW}" height="${GH}" rx="10"/></clipPath>
      <filter id="${id}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>`;
    // Sol
    s += `<rect x="${OX}" y="${OY + 6}" width="${GW}" height="${GH}" rx="10" fill="#e7e1d3"/><rect x="${OX}" y="${OY}" width="${GW}" height="${GH}" rx="10" fill="url(#${id}-${indoor ? ground : 'grass'})"/><g clip-path="url(#${id}-clip)">`;
    // Eau
    water.forEach((w) => {
      const wx = X(w.x),
        wy = Y(w.y),
        ww = w.w * cell,
        wh = w.h * cell;
      s += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="${cell * 0.4}" fill="#7cc8e8" stroke="#4aa8d0" stroke-width="3"/><path class="plan-water" d="M${wx + 12} ${wy + 16} q8 -6 16 0 t16 0 M${wx + ww * 0.45} ${wy + wh * 0.6} q8 -6 16 0 t16 0" stroke="#e6f6fd" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    });
    // Rues : trottoirs, puis asphalte, puis lignes (les intersections se fondent proprement)
    const rl = (r) => `x1="${X(r.x1)}" y1="${Y(r.y1)}" x2="${X(r.x2)}" y2="${Y(r.y2)}"`;
    roads.forEach((r) => {
      s += `<line ${rl(r)} stroke="#e9e3d2" stroke-width="${cell * 0.58}" stroke-linecap="square"/>`;
    });
    roads.forEach((r) => {
      s += `<line ${rl(r)} stroke="#80869a" stroke-width="${cell * 0.42}" stroke-linecap="square"/>`;
    });
    roads.forEach((r) => {
      s += `<line ${rl(r)} stroke="#fff6c8" stroke-width="2.5" stroke-dasharray="11 9"/>`;
    });
    // Arbres et fleurs dans l'herbe libre
    if (decor) {
      const inside = (px, py, b, m) => px > b.x - m && px < b.x + (b.w || 1) + m && py > b.y - m && py < b.y + (b.h || 1) + m;
      const free = (px, py) =>
        !places.some((p) => inside(px, py, p, 0.16)) &&
        !water.some((w) => inside(px, py, w, 0.12)) &&
        !roads.some((r) => segDist(px, py, r) < 0.48);
      let k = 0;
      for (let gx = 0.22; gx < cols - 0.1; gx += 0.42) {
        for (let gy = 0.22; gy < rows - 0.1; gy += 0.42) {
          const px = gx + (rnd() - 0.5) * 0.14,
            py = gy + (rnd() - 0.5) * 0.14;
          if (!free(px, py) || rnd() > 0.55) continue;
          const cx = X(px),
            cy = Y(py),
            r = cell * (0.12 + rnd() * 0.07);
          if (rnd() < 0.22) {
            // massif de fleurs
            const c = ['#ff8fab', '#ffd166', '#ffffff', '#c39bff'][Math.floor(rnd() * 4)];
            s += `<g class="plan-tree" style="--i:${k++}"><circle cx="${cx}" cy="${cy}" r="${r * 0.8}" fill="#9fd07f"/>${[0, 1, 2, 3, 4].map((j) => `<circle cx="${cx + Math.cos(j * 1.26) * r * 0.45}" cy="${cy + Math.sin(j * 1.26) * r * 0.45}" r="${r * 0.2}" fill="${c}"/>`).join('')}</g>`;
          } else {
            const g = ['#5fae5a', '#4f9e55', '#6dbb5e'][Math.floor(rnd() * 3)];
            s += `<g class="plan-tree" style="--i:${k++}"><ellipse cx="${cx + r * 0.35}" cy="${cy + r * 0.45}" rx="${r}" ry="${r * 0.8}" fill="rgba(30,60,20,.18)"/><g class="sway"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${g}" stroke="#3d7d3f" stroke-width="1.5"/><circle cx="${cx - r * 0.3}" cy="${cy - r * 0.32}" r="${r * 0.45}" fill="#8fd27d" opacity=".75"/></g></g>`;
          }
        }
      }
    }
    // Autos : deux sens, une voie chacune, qui entrent et sortent par les bords
    if (motion) {
      roads.forEach((r, ri) => {
        const len = Math.hypot(r.x2 - r.x1, r.y2 - r.y1) * cell;
        if (len < cell) return;
        const ux = (X(r.x2) - X(r.x1)) / len,
          uy = (Y(r.y2) - Y(r.y1)) / len,
          nx = -uy,
          ny = ux,
          ext = cell * 0.8;
        [1, -1].forEach((dirn, j) => {
          const A = dirn > 0 ? [X(r.x1) - ux * ext, Y(r.y1) - uy * ext] : [X(r.x2) + ux * ext, Y(r.y2) + uy * ext];
          const B = dirn > 0 ? [X(r.x2) + ux * ext, Y(r.y2) + uy * ext] : [X(r.x1) - ux * ext, Y(r.y1) - uy * ext];
          const o = cell * 0.1 * dirn,
            dur = (len + 2 * ext) / (cell * (0.6 + rnd() * 0.4));
          s += `<g class="plan-car">${carShape(cell * 0.36, CAR_COLORS[(ri * 2 + j) % CAR_COLORS.length])}<animateMotion dur="${dur.toFixed(1)}s" begin="-${(rnd() * dur).toFixed(1)}s" repeatCount="indefinite" rotate="auto" path="M${(A[0] + nx * o).toFixed(1)} ${(A[1] + ny * o).toFixed(1)} L${(B[0] + nx * o).toFixed(1)} ${(B[1] + ny * o).toFixed(1)}"/></g>`;
        });
      });
    }
    // Quadrillage
    if (grid) {
      for (let c = 0; c <= cols; c++)
        s += `<line x1="${X(c)}" y1="${OY}" x2="${X(c)}" y2="${OY + GH}" stroke="rgba(43,45,66,.22)" stroke-width="1.5"/>`;
      for (let r = 0; r <= rows; r++)
        s += `<line x1="${OX}" y1="${Y(r)}" x2="${OX + GW}" y2="${Y(r)}" stroke="rgba(43,45,66,.22)" stroke-width="1.5"/>`;
    }
    // Lieux : ombre au sol, tuile en relief qui se soulève au survol, anneau de surbrillance
    places.forEach((p, i) => {
      const w = (p.w || 1) * cell,
        h = (p.h || 1) * cell,
        d = Math.max(4, cell * 0.08);
      const x = X(p.x) + 4,
        y = Y(p.y) + 4,
        bw = w - 8,
        bh = h - 8 - d;
      const fill = p.color || '#fff',
        rx = Math.min(12, cell * 0.18);
      s +=
        `<g data-hot="${M.esc(p.id)}" class="plan-place" style="--i:${i}">` +
        `<rect class="pl-shadow" x="${x + d}" y="${y + d * 2}" width="${bw}" height="${bh}" rx="${rx}" fill="#1d2a1a" opacity=".22" filter="url(#${id}-soft)"/>` +
        `<rect class="pl-ring" x="${x - 6}" y="${y - 6}" width="${bw + 12}" height="${bh + d + 12}" rx="${rx + 6}"/>` +
        `<g class="pl-lift"><rect x="${x}" y="${y + d}" width="${bw}" height="${bh}" rx="${rx}" fill="${fill}" stroke="#2b2d42" stroke-width="2.5"/><rect x="${x}" y="${y + d}" width="${bw}" height="${bh}" rx="${rx}" fill="rgba(43,45,66,.2)"/>` +
        `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="${rx}" fill="${fill}" stroke="#2b2d42" stroke-width="2.5"/><rect x="${x + 6}" y="${y + 4}" width="${Math.max(0, bw - 12)}" height="${Math.min(9, bh * 0.14)}" rx="4.5" fill="#fff" opacity=".6"/>` +
        (p.art && M.art.has(p.art)
          ? (() => {
              if (p.fill === 'stretch')
                return M.art
                  .svg(p.art, { x: x + 6, y: y + 6, w: bw - 12, h: bh - 12 })
                  .replace('<svg ', '<svg preserveAspectRatio="none" ');
              const z = Math.min(bw, bh) * 0.84,
                n = p.fill === 'repeat' ? Math.max(1, Math.floor((bw - 8) / (z * 0.95))) : 1;
              return M.range(0, n - 1)
                .map((k) => M.art.svg(p.art, { x: x + (bw - n * z) / 2 + k * z, y: y + (bh - z) / 2, w: z, h: z }))
                .join('');
            })()
          : `<text x="${x + bw / 2}" y="${y + bh / 2 + cell * 0.17}" text-anchor="middle" font-size="${cell * 0.5}">${p.emoji || ''}</text>`) +
        `</g><title>${M.esc(p.label || '')}</title></g>`;
    });
    // Nuages qui passent et leur ombre (dehors seulement)
    if (motion && !indoor) {
      [
        [0.22, 48, -9, 0.55],
        [0.72, 64, -37, 0.7],
      ].forEach(([fy, dur, delay, k]) => {
        const sc = cell * k,
          cy = OY + GH * fy;
        s +=
          `<g class="plan-cloud" style="--from:${(-sc * 3).toFixed(0)}px;--to:${(W + sc).toFixed(0)}px;animation-duration:${dur}s;animation-delay:${delay}s">` +
          `<g filter="url(#${id}-soft)">${puff(sc * 0.6, cy + sc * 1.3, sc, '#1d2a1a', 0.13)}</g><g filter="url(#${id}-soft)">${puff(0, cy, sc, '#fff', 0.42)}</g></g>`;
      });
    }
    s += `</g><rect x="${OX}" y="${OY}" width="${GW}" height="${GH}" rx="10" fill="url(#${id}-vig)" pointer-events="none"/>`;
    s += `<rect x="${OX}" y="${OY}" width="${GW}" height="${GH}" rx="10" fill="none" stroke="${indoor ? '#8d7b68' : '#2b2d42'}" stroke-width="${indoor ? 8 : 3}" pointer-events="none"/>`;
    if (grid) {
      for (let c = 0; c < cols; c++)
        s += `<text x="${X(c) + cell / 2}" y="${OY + GH + 24}" text-anchor="middle" class="plan-ax">${String.fromCharCode(65 + c)}</text>`;
      for (let r = 0; r < rows; r++)
        s += `<text x="${OX - 14}" y="${Y(rows - r - 1) + cell / 2 + 7}" text-anchor="middle" class="plan-ax">${r + 1}</text>`;
    }
    if (north) {
      s +=
        `<g class="plan-north" transform="translate(${OX + GW + 40},${OY + 50})"><circle r="28" fill="#fff" stroke="#2b2d42" stroke-width="2.5"/><circle r="22" fill="none" stroke="#e7e1d3" stroke-width="1.5"/>` +
        [0, 90, 180, 270]
          .map((a) => `<line x1="0" y1="-25" x2="0" y2="-20" stroke="#2b2d42" stroke-width="2" transform="rotate(${a})"/>`)
          .join('') +
        `<g class="needle"><path d="M0 -20 L6 0 L0 0 Z" fill="#d62828"/><path d="M0 -20 L-6 0 L0 0 Z" fill="#ef476f"/><path d="M0 20 L6 0 L0 0 Z" fill="#2b2d42"/><path d="M0 20 L-6 0 L0 0 Z" fill="#7a7f99"/></g>` +
        `<circle r="3" fill="#ffd166" stroke="#2b2d42" stroke-width="1.5"/><text y="-35" text-anchor="middle" class="plan-ax">N</text></g>`;
    }
    s += '</svg>';
    const leg = legend
      ? `<div class="plan-leg">${places.map((p) => `<button class="chip plan-leg-it" data-for="${M.esc(p.id)}" data-say="${M.esc(p.label || '')}">${p.art && M.art.has(p.art) ? M.art.html(p.art, { size: 26, alt: p.label || '' }) : p.emoji || ''} ${M.esc(p.label || '')}</button>`).join('')}</div>`
      : '';
    return `<div class="plan">${title ? `<div class="plan-title">🗺️ ${M.esc(title)}</div>` : ''}${s}${leg}</div>`;
  };
  // Légende ↔ lieu : l'élément touché s'allume, le lieu saute et pulse
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.plan-leg-it');
    if (!b) return;
    const plan = b.closest('.plan');
    M.$$('.plan-leg-it', plan).forEach((c) => c.classList.toggle('on', c === b));
    M.$$('.plan-place', plan).forEach((g) => {
      g.classList.remove('flash-on');
      if (g.dataset.hot === b.dataset.for) requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add('flash-on')));
    });
  });
})();
