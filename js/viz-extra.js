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
  const TONES = { A: ['#ffe1e8', '#ef476f'], B: ['#dff3fb', '#118ab2'], C: ['#dcf7ee', '#06a77d'], E: ['#ffffff', '#c7c2b4'], X: ['#f1eee6', '#9a968a'], Q: ['#fff1b8', '#e9b949'] };
  V.barModelHtml = function (spec, opts = {}) {
    const rows = spec.rows || [];
    const hasLabels = rows.some((r) => r.label || r.emoji);
    const LBL = hasLabels ? 110 : 10, H = 46, GAP = 30, TOP = spec.total ? 56 : 14, MIN = 54, AREA = spec.compact || opts.compact ? 300 : 440;
    const known = (s) => (s.v == null ? null : s.v);
    const sums = rows.map((r) => r.segs.reduce((a, s) => a + (known(s) ?? 0), 0));
    const unknownGuess = (() => { const vals = rows.flatMap((r) => r.segs.map(known)).filter((v) => v != null); return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 5; })();
    const tot = Math.max(spec.total && spec.total.v != null ? spec.total.v : 0, spec.diff && spec.diff.v != null ? Math.max(...sums) : 0, ...rows.map((r) => r.segs.reduce((a, s) => a + (known(s) ?? unknownGuess), 0)));
    const unit = spec.scale === 'schema' ? AREA / Math.max(1, ...rows.map((r) => r.segs.length)) : AREA / Math.max(1, tot);
    const segW = (s) => (spec.scale === 'schema' ? unit : Math.max(MIN, (known(s) ?? unknownGuess) * unit));
    let maxX = 0;
    let body = '';
    const rowW = [];
    rows.forEach((r, ri) => {
      const y = TOP + ri * (H + GAP);
      let x = LBL;
      if (hasLabels) body += `<text x="${LBL - 10}" y="${y + H / 2 + 7}" text-anchor="end" class="bm-lbl">${r.emoji ? r.emoji + ' ' : ''}${M.esc(r.label || '')}</text>`;
      r.segs.forEach((s) => {
        const w = segW(s), unknown = s.v == null;
        const tone = unknown ? 'Q' : s.tone || 'A';
        const [fill, stroke] = TONES[tone] || TONES.A;
        const txt = s.text ?? (unknown ? '?' : String(s.v));
        body += `<g class="bm-seg ${unknown ? 'bm-unknown' : ''}"><rect x="${x}" y="${y}" width="${w}" height="${H}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3" ${tone === 'E' || unknown ? 'stroke-dasharray="7 5"' : ''}/>`
          + (tone === 'X' ? `<line x1="${x + 6}" y1="${y + 6}" x2="${x + w - 6}" y2="${y + H - 6}" stroke="#d62828" stroke-width="3"/>` : '')
          + `<text x="${x + w / 2}" y="${y + H / 2 + 8}" text-anchor="middle" class="bm-txt">${M.esc(txt)}</text></g>`;
        x += w;
      });
      rowW.push(x);
      maxX = Math.max(maxX, x);
    });
    if (spec.diff && rows.length >= 2) {
      const short = rowW[0] <= rowW[1] ? 0 : 1, long = 1 - short;
      const y = TOP + short * (H + GAP), x1 = rowW[short], x2 = rowW[long];
      const unknown = spec.diff.unknown || spec.diff.v == null;
      body += `<g class="${unknown ? 'bm-unknown' : ''}"><rect x="${x1}" y="${y}" width="${Math.max(MIN, x2 - x1)}" height="${H}" rx="6" fill="${unknown ? TONES.Q[0] : '#fff'}" stroke="${unknown ? TONES.Q[1] : '#7a7f99'}" stroke-width="3" stroke-dasharray="7 5"/>
        <text x="${x1 + Math.max(MIN, x2 - x1) / 2}" y="${y + H / 2 + 8}" text-anchor="middle" class="bm-txt">${M.esc(spec.diff.text ?? (unknown ? '?' : String(spec.diff.v)))}</text></g>`;
      maxX = Math.max(maxX, x1 + Math.max(MIN, x2 - x1));
    }
    if (spec.total) {
      const x1 = LBL, x2 = Math.max(rowW[0] || LBL, spec.type === 'groupes' ? rowW[0] : rowW[0]);
      const y = TOP - 14, unknown = spec.total.unknown || spec.total.v == null;
      body += `<g class="${unknown ? 'bm-unknown' : ''}"><path d="M${x1} ${y + 8} Q${x1} ${y} ${x1 + 10} ${y} L${(x1 + x2) / 2 - 10} ${y} Q${(x1 + x2) / 2} ${y} ${(x1 + x2) / 2} ${y - 8} Q${(x1 + x2) / 2} ${y} ${(x1 + x2) / 2 + 10} ${y} L${x2 - 10} ${y} Q${x2} ${y} ${x2} ${y + 8}" fill="none" stroke="#2b2d42" stroke-width="3"/>
        <text x="${(x1 + x2) / 2}" y="${y - 14}" text-anchor="middle" class="bm-txt ${unknown ? 'bm-q' : ''}">${M.esc(spec.total.text ?? (unknown ? '?' : String(spec.total.v)))}</text></g>`;
    }
    const Wd = Math.max(maxX + 14, 300), Ht = TOP + rows.length * (H + GAP);
    const aria = opts.aria || spec.aria || 'Modèle en barres';
    return `<svg class="barmodel" viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="${M.esc(aria)}" style="max-width:${Math.round(Wd * (opts.scale || 1.1))}px">${body}</svg>`;
  };
  V.barModel = function (el, spec) {
    const draw = (s) => (el.innerHTML = `<div class="bm-wrap">${V.barModelHtml(s)}</div>`);
    draw(spec);
    return {
      async showMe() {
        if (spec.answer == null) return;
        const fill = (o) => (o && (o.v == null || o.unknown) ? { ...o, v: spec.answer, text: String(spec.answer), unknown: false } : o);
        const s2 = { ...spec, rows: spec.rows.map((r) => ({ ...r, segs: r.segs.map((sg) => (sg.v == null ? { ...sg, v: spec.answer, text: String(spec.answer), tone: 'C' } : sg)) })), total: fill(spec.total), diff: fill(spec.diff) };
        await M.sleep(250);
        if (!el.isConnected) return;
        draw(s2);
        M.$$('.bm-seg, g', el).forEach((g) => g.classList.add('pop'));
        M.sfx.pop();
      },
    };
  };

  /* ------------------------------------------------------------------
     Ligne du temps : { from, to, step=1, unit?, title?, events:[{at, label, emoji, id}], hide?:[ids], tickLabel?(v) }
     Graduations : data-hot="t<valeur>" ; événements : data-hot="<id>"
     ------------------------------------------------------------------ */
  V.timeline = function ({ from, to, step = 1, title = '', events = [], hide = [], tickLabel = (v) => v }) {
    const X0 = 50, X1 = 950, Y = 150, span = to - from || 1;
    const x = (v) => X0 + ((v - from) * (X1 - X0)) / span;
    let s = `<svg class="timeline" viewBox="0 0 1000 220" role="img" aria-label="${M.esc(title || 'Ligne du temps')}">`;
    if (title) s += `<text x="500" y="26" text-anchor="middle" class="tl-title">${M.esc(title)}</text>`;
    s += `<line x1="${X0 - 20}" y1="${Y}" x2="${X1 + 25}" y2="${Y}" stroke="#2b2d42" stroke-width="5" stroke-linecap="round"/><path d="M${X1 + 25} ${Y - 10} L${X1 + 40} ${Y} L${X1 + 25} ${Y + 10} z" fill="#2b2d42"/>`;
    for (let v = from; v <= to; v += step) s += `<g data-hot="t${v}" class="tl-tick"><rect x="${x(v) - 22}" y="${Y - 16}" width="44" height="66" fill="transparent"/><line x1="${x(v)}" y1="${Y - 12}" x2="${x(v)}" y2="${Y + 12}" stroke="#2b2d42" stroke-width="3"/><text x="${x(v)}" y="${Y + 40}" text-anchor="middle" class="tl-lbl">${M.esc(tickLabel(v))}</text></g>`;
    const lanes = {};
    events.forEach((e) => {
      const lane = (lanes[e.at] = (lanes[e.at] || 0) + 1) - 1;
      const ex = x(e.at), ey = Y - 52 - lane * 58, hidden = hide.includes(e.id);
      s += `<g data-hot="${M.esc(e.id)}" class="tl-ev ${hidden ? 'hidden' : ''}"><line x1="${ex}" y1="${ey + 22}" x2="${ex}" y2="${Y - 6}" stroke="#c7c2b4" stroke-width="3"/>
        <rect x="${ex - 40}" y="${ey - 26}" width="80" height="48" rx="12" fill="${hidden ? '#fff8e6' : '#fff'}" stroke="${hidden ? '#e9b949' : '#e7e1d3'}" stroke-width="3" ${hidden ? 'stroke-dasharray="6 5"' : ''}/>
        <text x="${ex}" y="${ey + 10}" text-anchor="middle" font-size="28">${hidden ? '?' : e.emoji || ''}</text>
        <title>${M.esc(hidden ? '?' : e.label || '')}</title></g>`;
    });
    return s + '</svg>';
  };

  /* ------------------------------------------------------------------
     Plan / carte
     { title?, cols, rows, cell=64, grid?:true (A,B,C… / 1,2,3…), north?:true,
       roads?:[{x1,y1,x2,y2}] (en cases), places:[{id, x, y, w=1, h=1, emoji, label, color?}], legend?:true }
     Lieux : data-hot="<id>". Toucher un élément de légende surligne le lieu.
     ------------------------------------------------------------------ */
  V.plan = function ({ title = '', cols, rows, cell = 64, grid = false, north = false, roads = [], places = [], legend = true }) {
    const OX = grid ? 34 : 10, OY = grid ? 10 : 10;
    const W = OX + cols * cell + (north ? 64 : 10), H = OY + rows * cell + (grid ? 34 : 10);
    let s = `<svg class="plan-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${M.esc(title || 'Plan')}"><rect x="${OX}" y="${OY}" width="${cols * cell}" height="${rows * cell}" fill="#f4f9ec" stroke="#2b2d42" stroke-width="3" rx="8"/>`;
    if (grid) {
      for (let c = 0; c <= cols; c++) s += `<line x1="${OX + c * cell}" y1="${OY}" x2="${OX + c * cell}" y2="${OY + rows * cell}" stroke="#d9d3c3" stroke-width="1.5"/>`;
      for (let r = 0; r <= rows; r++) s += `<line x1="${OX}" y1="${OY + r * cell}" x2="${OX + cols * cell}" y2="${OY + r * cell}" stroke="#d9d3c3" stroke-width="1.5"/>`;
      for (let c = 0; c < cols; c++) s += `<text x="${OX + c * cell + cell / 2}" y="${OY + rows * cell + 24}" text-anchor="middle" class="plan-ax">${String.fromCharCode(65 + c)}</text>`;
      for (let r = 0; r < rows; r++) s += `<text x="${OX - 14}" y="${OY + (rows - r - 1) * cell + cell / 2 + 7}" text-anchor="middle" class="plan-ax">${r + 1}</text>`;
    }
    roads.forEach((r) => { s += `<line x1="${OX + r.x1 * cell}" y1="${OY + r.y1 * cell}" x2="${OX + r.x2 * cell}" y2="${OY + r.y2 * cell}" stroke="#b9b4a6" stroke-width="${cell * 0.38}" stroke-linecap="round"/><line x1="${OX + r.x1 * cell}" y1="${OY + r.y1 * cell}" x2="${OX + r.x2 * cell}" y2="${OY + r.y2 * cell}" stroke="#fff" stroke-width="2.5" stroke-dasharray="10 9"/>`; });
    places.forEach((p) => {
      const w = (p.w || 1) * cell, h = (p.h || 1) * cell, x = OX + p.x * cell, y = OY + p.y * cell;
      s += `<g data-hot="${M.esc(p.id)}" class="plan-place"><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="10" fill="${p.color || '#fff'}" stroke="#2b2d42" stroke-width="2.5"/><text x="${x + w / 2}" y="${y + h / 2 + cell * 0.17}" text-anchor="middle" font-size="${cell * 0.48}">${p.emoji || ''}</text><title>${M.esc(p.label || '')}</title></g>`;
    });
    if (north) s += `<g class="plan-north" transform="translate(${OX + cols * cell + 34},${OY + 40})"><circle r="22" fill="#fff" stroke="#2b2d42" stroke-width="2"/><path d="M0 -17 L6 4 L0 0 L-6 4 z" fill="#d62828"/><path d="M0 17 L6 -4 L0 0 L-6 -4 z" fill="#2b2d42"/><text y="-26" text-anchor="middle" class="plan-ax">N</text></g>`;
    s += '</svg>';
    const leg = legend ? `<div class="plan-leg">${places.map((p) => `<button class="chip plan-leg-it" data-for="${M.esc(p.id)}" data-say="${M.esc(p.label || '')}">${p.emoji || ''} ${M.esc(p.label || '')}</button>`).join('')}</div>` : '';
    return `<div class="plan">${title ? `<div class="plan-title">${M.esc(title)}</div>` : ''}${s}${leg}</div>`;
  };
  // Légende ↔ lieu
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.plan-leg-it');
    if (!b) return;
    const plan = b.closest('.plan');
    M.$$('.plan-place', plan).forEach((g) => g.classList.toggle('flash-on', g.dataset.hot === b.dataset.for));
  });
})();
