/* =====================================================================
   skills/stats.js — Statistique et probabilité (1er cycle)
   Dessins réutilisables exposés dans M.stats (aussi utilisés par learn/stats.js) :
   barChart, picto, tally, table, spinner, bag, dieFace, dieRow, device,
   resultsTable, pLine…
   Les générateurs gen() ne touchent jamais au DOM (seulement viz/showMe).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const S = (M.stats = {});
  const INK = '#2b2d42';

  /* ------------------------------------------------------------------
     Styles du domaine (préfixe st-)
     ------------------------------------------------------------------ */
  try { M.css(`
  .st-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100% }
  .st-chart { width: 100%; height: auto; display: block; margin: 0 auto; user-select: none }
  .st-chart [data-i] { cursor: pointer }
  .st-picto { background: #fff; border: 3px solid var(--line); border-radius: 16px; padding: 10px 12px; width: 100%; max-width: 640px }
  .st-ptitle { font-weight: 900; text-align: center; font-size: 1.15rem; margin-bottom: 6px }
  .st-prow { display: flex; align-items: stretch; border-top: 2px solid var(--line); min-height: 50px }
  .st-prows { border-bottom: 2px solid var(--line) }
  .st-prow.hl { background: #fff6d6 }
  .st-pcat { flex: 0 0 122px; font-weight: 800; font-size: 1rem; display: flex; align-items: center; gap: 6px; padding-right: 8px; border-right: 4px solid ${INK} }
  .st-pcat .st-pic { font-size: 1.5rem }
  .st-ppics { display: flex; flex-wrap: nowrap; align-items: center; padding-left: 6px }
  .st-pp { display: inline-flex; flex-direction: column; align-items: center; width: 1.7em; font-size: 1.4rem; line-height: 1.15 }
  .st-pp i { font-style: normal; font-size: .75rem; font-weight: 900; color: #fff; background: var(--B); border-radius: 8px; padding: 0 4px; line-height: 1.3 }
  .st-pleg { margin-top: 10px; border: 3px dashed var(--pur); border-radius: 12px; padding: 4px 12px; display: inline-flex; align-items: center; gap: 6px; font-weight: 800; background: #f6effe; flex-wrap: wrap }
  .st-pleg .st-pp { width: auto }
  .st-table { border-collapse: collapse; background: #fff; font-size: 1.1rem; margin: 0 auto }
  .st-table th, .st-table td { border: 3px solid var(--line); padding: 6px 12px; text-align: center; vertical-align: middle }
  .st-table th { background: #efe4fb; font-size: 1rem }
  .st-table td:first-child { text-align: left; font-weight: 800; white-space: nowrap }
  .st-table td.num { font-weight: 900; font-size: 1.25rem; min-width: 2.4em }
  .st-table tr.hl td { background: #fff6d6 }
  .st-table .q { color: var(--red); font-weight: 900 }
  .st-table caption { font-weight: 900; padding-bottom: 6px; font-size: 1.05rem }
  .st-mini { font-size: .95rem } .st-mini th, .st-mini td { padding: 3px 8px; border-width: 2px } .st-mini td.num { font-size: 1rem }
  .st-tally { display: inline-block; vertical-align: middle; max-width: 100%; height: auto }
  .st-none { color: var(--muted); font-weight: 800 }
  .st-dot { display: inline-block; width: .9em; height: .9em; border-radius: 50%; vertical-align: -.08em; border: 2px solid rgba(0,0,0,.22) }
  .st-dev { display: flex; justify-content: center }
  .st-spin { width: 220px; max-width: 100%; height: auto; display: block }
  .st-bagbox { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center }
  .st-bag { width: 210px; max-width: 100%; height: auto; display: block }
  .st-shake { animation: shake .45s }
  .st-hand { min-width: 96px; min-height: 84px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; text-align: center }
  .st-hand svg { animation: pop .5s }
  .st-diebox { display: flex; flex-direction: column; align-items: center; gap: 8px }
  .st-faces { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; justify-content: center; font-weight: 800; color: var(--muted); font-size: .95rem }
  .st-die { display: inline-block; vertical-align: middle }
  .st-exp { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-start; justify-content: center; width: 100% }
  .st-exp-side { flex: 1; min-width: 220px; display: flex; flex-direction: column; align-items: center; gap: 8px }
  .st-items { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; max-width: 480px }
  .st-item { font-size: 1.8rem; width: 52px; height: 52px; border: 3px solid var(--line); border-radius: 12px; background: #fff; display: flex; align-items: center; justify-content: center; position: relative; padding: 0 }
  .st-item.on { border-color: var(--C); background: var(--Cc) }
  .st-item.on::after { content: "✓"; position: absolute; right: -7px; top: -9px; background: var(--C); color: #fff; border-radius: 50%; font-size: .8rem; width: 21px; height: 21px; display: flex; align-items: center; justify-content: center; font-weight: 900 }
  .st-item.hl { border-color: var(--org); background: #ffe9d6 }
  .st-item b { position: absolute; left: -7px; top: -9px; background: var(--org); color: #fff; border-radius: 11px; font-size: .8rem; min-width: 21px; height: 21px; display: flex; align-items: center; justify-content: center; padding: 0 4px }
  .st-pline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; width: 100%; max-width: 560px; position: relative }
  .st-pz { border-radius: 14px; padding: 8px 4px; text-align: center; font-weight: 900; border: 3px solid; font-size: 1rem }
  .st-pz.imp { background: #ffe5e5; border-color: #f3a3a3 }
  .st-pz.pos { background: #fff6d6; border-color: #f2d27a }
  .st-pz.cer { background: var(--Cc); border-color: #8fdcc3 }
  .st-pz.hl { outline: 4px solid ${INK}; outline-offset: 2px; animation: pop .5s }
  .st-event { font-size: 3.4rem; text-align: center; line-height: 1.2 }
  .st-fiche { background: #fff; border: 3px solid var(--line); border-top: 14px solid var(--pur); border-radius: 16px; padding: 12px 14px; max-width: 460px; width: 100% }
  .st-fiche h3 { margin: 0 0 6px; font-size: 1.1rem }
  .st-fiche .big { font-size: 2.2rem; text-align: center; letter-spacing: 4px }
  .st-tiles { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center }
  .st-tile { font-size: 2.2rem; background: #fff; border: 3px solid var(--line); border-radius: 14px; padding: 6px 10px; text-align: center; min-width: 80px }
  .st-tile small { display: block; font-size: .85rem; font-weight: 800 }
  .st-tile.hl { border-color: var(--red); background: #ffe5e5 }
  .st-instr { display: block; font-size: 1.05rem; color: var(--pur); font-weight: 800; margin-bottom: 4px }
  .st-res { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100% }
  `); } catch (e) { /* hors navigateur (tools/check-skills.js) */ }

  /* ------------------------------------------------------------------
     Données de base
     ------------------------------------------------------------------ */
  // Couleurs : m = adjectif masculin, f = féminin, fp = féminin pluriel, nom = « le rouge »
  const COL = {
    rouge: { hex: '#ef476f', emo: '🔴', lbl: 'Rouge', m: 'rouge', f: 'rouge', fp: 'rouges', nom: 'le rouge' },
    bleu: { hex: '#118ab2', emo: '🔵', lbl: 'Bleu', m: 'bleu', f: 'bleue', fp: 'bleues', nom: 'le bleu' },
    vert: { hex: '#06a77d', emo: '🟢', lbl: 'Vert', m: 'vert', f: 'verte', fp: 'vertes', nom: 'le vert' },
    jaune: { hex: '#ffd166', emo: '🟡', lbl: 'Jaune', m: 'jaune', f: 'jaune', fp: 'jaunes', nom: 'le jaune' },
    orange: { hex: '#f78c40', emo: '🟠', lbl: 'Orange', m: 'orange', f: 'orange', fp: 'orange', nom: "l'orange" },
    mauve: { hex: '#9b5de5', emo: '🟣', lbl: 'Mauve', m: 'mauve', f: 'mauve', fp: 'mauves', nom: 'le mauve' },
  };
  S.COL = COL;
  S.COLOR_KEYS = Object.keys(COL);
  const PAL = ['#118ab2', '#ef476f', '#06a77d', '#f78c40', '#9b5de5'];
  S.PAL = PAL;

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  /** Texte brut (sans balises ni émojis) pour la lecture à voix haute — sans DOM. */
  const plain = (html) => String(html).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
  S.plain = plain;
  const dot = (key) => `<span class="st-dot" style="background:${COL[key].hex}"></span>`;
  S.dot = dot;
  /** n valeurs distinctes entre lo et hi (pas = step). */
  function distinct(n, lo, hi, step = 1) {
    const pool = [];
    for (let v = lo; v <= hi; v += step) pool.push(v);
    return M.shuffle(pool).slice(0, n);
  }
  S.distinct = distinct;
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  /** Index de l'unique maximum (ou minimum), -1 s'il y a égalité. */
  function uniqueExt(vals, dir = 1) {
    let best = -1, bv = null, tie = false;
    vals.forEach((v, i) => {
      if (bv === null || v * dir > bv * dir) { best = i; bv = v; tie = false; }
      else if (v === bv) tie = true;
    });
    return tie ? -1 : best;
  }
  S.uniqueExt = uniqueExt;

  /* Contextes d'enquête (diagrammes à bandes, pictogrammes, tableaux) */
  const vote = (o) => ({
    kind: 'vote', unit: ['élève', 'élèves'], axis: "Nombre d'élèves", sym: '🙂',
    how: (c) => `Combien d'élèves ont choisi <b>${c.icon} ${c.the}</b> ?`,
    more: (a, b) => `Combien de votes de plus pour <b>${a.icon} ${a.the}</b> que pour <b>${b.icon} ${b.the}</b> ?`,
    most: `${o.which} a reçu <b>le plus</b> de votes ?`,
    least: `${o.which} a reçu <b>le moins</b> de votes ?`,
    total: "Combien d'élèves ont voté <b>en tout</b> ?",
    ...o,
  });
  const people = (o) => ({
    kind: 'people', axis: o.axis,
    cats: [['Léa', 1], ['Samuel', 0], ['Jade', 1], ['Félix', 0], ['Florence', 1], ['Thomas', 0], ['Zoé', 1], ['Noah', 0]]
      .map(([n, f]) => ({ label: n, icon: f ? '👧' : '👦', f })),
    ...o,
  });
  const pr = (c) => (c.f ? 'elle' : 'il');
  S.CTX = [
    vote({
      id: 'collation', q: 'Quelle est ta collation préférée ?', title: 'Notre collation préférée', which: 'Quelle collation',
      cats: [
        { label: 'Pomme', icon: '🍎', the: 'la pomme' }, { label: 'Banane', icon: '🍌', the: 'la banane' },
        { label: 'Fromage', icon: '🧀', the: 'le fromage' }, { label: 'Carotte', icon: '🥕', the: 'la carotte' },
        { label: 'Raisins', icon: '🍇', the: 'les raisins' },
      ],
    }),
    vote({
      id: 'animal', q: 'Quel est ton animal préféré ?', title: 'Notre animal préféré', which: 'Quel animal',
      cats: [
        { label: 'Chien', icon: '🐶', the: 'le chien' }, { label: 'Chat', icon: '🐱', the: 'le chat' },
        { label: 'Lapin', icon: '🐰', the: 'le lapin' }, { label: 'Poisson', icon: '🐠', the: 'le poisson' },
        { label: 'Cheval', icon: '🐴', the: 'le cheval' },
      ],
    }),
    vote({
      id: 'sport', q: 'Quel est ton sport préféré ?', title: 'Notre sport préféré', which: 'Quel sport',
      cats: [
        { label: 'Hockey', icon: '🏒', the: 'le hockey' }, { label: 'Soccer', icon: '⚽', the: 'le soccer' },
        { label: 'Natation', icon: '🏊', the: 'la natation' }, { label: 'Ski', icon: '⛷️', the: 'le ski' },
        { label: 'Vélo', icon: '🚲', the: 'le vélo' },
      ],
    }),
    vote({
      id: 'saison', q: 'Quelle est ta saison préférée ?', title: 'Notre saison préférée', which: 'Quelle saison',
      cats: [
        { label: 'Hiver', icon: '❄️', the: "l'hiver" }, { label: 'Printemps', icon: '🌷', the: 'le printemps' },
        { label: 'Été', icon: '☀️', the: "l'été" }, { label: 'Automne', icon: '🍁', the: "l'automne" },
      ],
    }),
    {
      id: 'meteo', kind: 'weather', title: 'La météo notée par la classe', axis: 'Nombre de jours', unit: ['jour', 'jours'],
      cats: [
        { label: 'Soleil', icon: '☀️', de: 'jours de soleil' }, { label: 'Nuages', icon: '☁️', de: 'jours nuageux' },
        { label: 'Pluie', icon: '🌧️', de: 'jours de pluie' }, { label: 'Neige', icon: '❄️', de: 'jours de neige' },
      ],
      how: (c) => `Combien y a-t-il eu de <b>${c.icon} ${c.de}</b> ?`,
      more: (a, b) => `Combien de <b>${a.icon} ${a.de}</b> de plus que de <b>${b.icon} ${b.de}</b> ?`,
      most: 'Quel temps a-t-il fait <b>le plus souvent</b> ?',
      least: 'Quel temps a-t-il fait <b>le moins souvent</b> ?',
      total: 'Combien de jours sont notés <b>en tout</b> ?',
    },
    {
      id: 'tuques', kind: 'tuque', title: 'Les tuques de la classe', axis: 'Nombre de tuques', unit: ['tuque', 'tuques'],
      cats: ['rouge', 'bleu', 'vert', 'jaune', 'mauve'].map((k) => ({ label: cap(COL[k].f), icon: COL[k].emo, fp: COL[k].fp, color: COL[k].hex })),
      how: (c) => `Combien y a-t-il de tuques <b>${c.icon} ${c.fp}</b> ?`,
      more: (a, b) => `Combien de tuques <b>${a.icon} ${a.fp}</b> de plus que de tuques <b>${b.icon} ${b.fp}</b> ?`,
      most: 'Quelle couleur de tuque est <b>la plus nombreuse</b> ?',
      least: 'Quelle couleur de tuque est <b>la moins nombreuse</b> ?',
      total: 'Combien de tuques y a-t-il <b>en tout</b> ?',
    },
    people({
      id: 'verger', title: 'Les pommes cueillies au verger', axis: 'Nombre de pommes', unit: ['pomme', 'pommes'], sym: '🍎',
      how: (c) => `Combien de pommes <b>${c.label}</b> a-t-${pr(c)} cueillies ?`,
      more: (a, b) => `Combien de pommes <b>${a.label}</b> a-t-${pr(a)} cueillies de plus que <b>${b.label}</b> ?`,
      most: 'Qui a cueilli <b>le plus</b> de pommes ?', least: 'Qui a cueilli <b>le moins</b> de pommes ?',
      total: 'Combien de pommes ont été cueillies <b>en tout</b> ?',
    }),
    people({
      id: 'lecture', title: 'Les livres lus ce mois-ci', axis: 'Nombre de livres', unit: ['livre', 'livres'], sym: '📕',
      how: (c) => `Combien de livres <b>${c.label}</b> a-t-${pr(c)} lus ?`,
      more: (a, b) => `Combien de livres <b>${a.label}</b> a-t-${pr(a)} lus de plus que <b>${b.label}</b> ?`,
      most: 'Qui a lu <b>le plus</b> de livres ?', least: 'Qui a lu <b>le moins</b> de livres ?',
      total: 'Combien de livres ont été lus <b>en tout</b> ?',
    }),
  ];
  S.VOTES = S.CTX.filter((c) => c.kind === 'vote');
  function pickCats(ctx, n) {
    return M.shuffle(ctx.cats).slice(0, n).map((c, i) => ({ ...c, color: c.color || PAL[i % PAL.length] }));
  }
  S.pickCats = pickCats;

  /* ------------------------------------------------------------------
     Dessins
     ------------------------------------------------------------------ */
  const f1 = (x) => Math.round(x * 10) / 10;

  /**
   * Diagramme à bandes (SVG).
   * o = { cats:[{label, icon, value, color}], title?, axis?, max?, step?, horizontal?, small?,
   *       guide?: index (ligne pointillée), reveal?: [index] (ligne + nombre), parts?: true (data-part) }
   */
  S.barChart = function (o) {
    const cats = o.cats, n = cats.length;
    const maxV = Math.max(1, ...cats.map((c) => c.value));
    const max = o.max || (maxV <= 10 ? 10 : 20);
    const step = o.step || (max <= 10 ? 1 : 2);
    const reveal = o.reveal || [];
    const guide = o.guide == null ? -1 : o.guide;
    const sm = !!o.small;
    const grid = '#d9d3c3';
    let s = '', W, H;
    const title = o.title && !sm;
    const bubble = (x, y, v) => `<g data-part="val"><circle cx="${f1(x)}" cy="${f1(y)}" r="${sm ? 13 : 18}" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="${f1(x)}" y="${f1(y + (sm ? 5 : 7))}" text-anchor="middle" font-size="${sm ? 15 : 20}" font-weight="900" fill="${INK}">${v}</text></g>`;
    if (!o.horizontal) {
      const L = sm ? 34 : 78, T = title ? 58 : 18, PH = sm ? 140 : 270, BW = sm ? 62 : 104, bar = sm ? 40 : 64, B = sm ? 40 : 82;
      W = L + n * BW + 14; H = T + PH + B;
      const y = (v) => T + PH - (v / max) * PH;
      if (title) s += `<text data-part="title" x="${W / 2}" y="36" text-anchor="middle" font-size="23" font-weight="900" fill="${INK}">${o.title}</text>`;
      s += '<g data-part="axis">';
      for (let v = 0; v <= max; v += step) {
        s += `<line x1="${L}" x2="${W - 8}" y1="${f1(y(v))}" y2="${f1(y(v))}" stroke="${v === 0 ? INK : grid}" stroke-width="${v === 0 ? 3 : 1.5}"/>`;
        s += `<text x="${L - 9}" y="${f1(y(v) + 6)}" text-anchor="end" font-size="${sm ? 13 : 18}" font-weight="800" fill="${INK}">${v}</text>`;
      }
      s += `<line x1="${L}" x2="${L}" y1="${T - 6}" y2="${T + PH}" stroke="${INK}" stroke-width="3"/>`;
      if (o.axis && !sm) s += `<text transform="rotate(-90)" x="${-(T + PH / 2)}" y="20" text-anchor="middle" font-size="17" font-weight="800" fill="#7a7f99">${o.axis}</text>`;
      s += '</g>';
      cats.forEach((c, i) => {
        const x = L + i * BW + (BW - bar) / 2, h = (c.value / max) * PH;
        s += `<g data-i="${i}" data-part="bars"><rect x="${L + i * BW}" y="${T - 6}" width="${BW}" height="${PH + 6}" fill="transparent"/>`;
        if (c.value > 0) s += `<rect x="${f1(x)}" y="${f1(T + PH - h)}" width="${bar}" height="${f1(h)}" rx="3" fill="${c.color}" stroke="rgba(0,0,0,.25)" stroke-width="2" class="st-bar" style="--i:${i}"/>`;
        s += '</g>';
        s += `<g data-part="cats"><text x="${f1(x + bar / 2)}" y="${T + PH + (sm ? 28 : 36)}" text-anchor="middle" font-size="${sm ? 22 : 30}">${c.icon || ''}</text>`;
        if (!sm) s += `<text x="${f1(x + bar / 2)}" y="${T + PH + 64}" text-anchor="middle" font-size="17" font-weight="800" fill="${INK}">${c.label}</text>`;
        s += '</g>';
        if (i === guide || reveal.includes(i)) {
          s += `<line x1="${L}" x2="${f1(x + bar / 2)}" y1="${f1(y(c.value))}" y2="${f1(y(c.value))}" stroke="${INK}" stroke-width="3" stroke-dasharray="7 6" pointer-events="none"/>`;
        }
        if (reveal.includes(i)) s += bubble(x + bar / 2, y(c.value) - (sm ? 18 : 24), c.value);
      });
    } else {
      const L = sm ? 44 : 158, T = title ? 56 : 14, RH = sm ? 40 : 58, bh = sm ? 26 : 38, PW = sm ? 200 : 400, B = sm ? 28 : 66;
      W = L + PW + 34; H = T + n * RH + B;
      const x = (v) => L + (v / max) * PW, bot = T + n * RH;
      if (title) s += `<text data-part="title" x="${W / 2}" y="36" text-anchor="middle" font-size="23" font-weight="900" fill="${INK}">${o.title}</text>`;
      s += '<g data-part="axis">';
      for (let v = 0; v <= max; v += step) {
        s += `<line x1="${f1(x(v))}" x2="${f1(x(v))}" y1="${T}" y2="${bot}" stroke="${v === 0 ? INK : grid}" stroke-width="${v === 0 ? 3 : 1.5}"/>`;
        s += `<text x="${f1(x(v))}" y="${bot + (sm ? 18 : 24)}" text-anchor="middle" font-size="${sm ? 13 : 18}" font-weight="800" fill="${INK}">${v}</text>`;
      }
      s += `<line x1="${L}" x2="${L + PW + 8}" y1="${bot}" y2="${bot}" stroke="${INK}" stroke-width="3"/>`;
      if (o.axis && !sm) s += `<text x="${L + PW / 2}" y="${bot + 54}" text-anchor="middle" font-size="17" font-weight="800" fill="#7a7f99">${o.axis}</text>`;
      s += '</g>';
      cats.forEach((c, i) => {
        const y0 = T + i * RH + (RH - bh) / 2, w = (c.value / max) * PW;
        s += `<g data-i="${i}" data-part="bars"><rect x="${L}" y="${T + i * RH}" width="${PW + 8}" height="${RH}" fill="transparent"/>`;
        if (c.value > 0) s += `<rect x="${L}" y="${f1(y0)}" width="${f1(w)}" height="${bh}" rx="3" fill="${c.color}" stroke="rgba(0,0,0,.25)" stroke-width="2" class="st-bar" style="--i:${i}"/>`;
        s += '</g>';
        s += `<g data-part="cats"><text x="${sm ? 22 : 26}" y="${f1(y0 + bh / 2 + (sm ? 8 : 10))}" text-anchor="middle" font-size="${sm ? 20 : 27}">${c.icon || ''}</text>`;
        if (!sm) s += `<text x="50" y="${f1(y0 + bh / 2 + 6)}" font-size="17" font-weight="800" fill="${INK}">${c.label}</text>`;
        s += '</g>';
        if (i === guide || reveal.includes(i)) {
          s += `<line x1="${f1(x(c.value))}" x2="${f1(x(c.value))}" y1="${f1(y0 + bh / 2)}" y2="${bot}" stroke="${INK}" stroke-width="3" stroke-dasharray="7 6" pointer-events="none"/>`;
        }
        if (reveal.includes(i)) s += bubble(x(c.value) + (sm ? 18 : 24), y0 + bh / 2, c.value);
      });
    }
    return `<svg class="st-chart${guide < 0 && !reveal.length ? ' grow' : ''}${o.horizontal ? ' horiz' : ''}" viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W * (sm ? 1 : 1.12))}px" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  };

  /**
   * Diagramme à pictogrammes (HTML).
   * o = { title, cats:[{label, icon, value}], sym, per (1|2), unit:[s,p], reveal?: [index], hl?: index }
   * Les valeurs doivent être des multiples de per (pas de demi-images).
   */
  S.picto = function (o) {
    const per = o.per || 1, reveal = o.reveal || [];
    const rows = o.cats.map((c, i) => {
      const k = Math.floor(c.value / per);
      let pics = '';
      for (let j = 0; j < k; j++) pics += `<span class="st-pp" style="--i:${i * 2 + j}">${o.sym}${reveal.includes(i) ? `<i>${(j + 1) * per}</i>` : ''}</span>`;
      return `<div class="st-prow${o.hl === i || reveal.includes(i) ? ' hl' : ''}" data-i="${i}"><div class="st-pcat"><span class="st-pic">${c.icon}</span>${c.label}</div><div class="st-ppics">${pics}</div></div>`;
    }).join('');
    const u = M.plural(per, o.unit[0], o.unit[1]);
    return `<div class="st-picto">${o.title ? `<div class="st-ptitle">${o.title}</div>` : ''}<div class="st-prows">${rows}</div>
      <div class="st-pleg"><b>Légende :</b> <span class="st-pp">${o.sym}</span> = ${per} ${u}</div></div>`;
  };

  /** Traits de dénombrement (SVG) : paquets de 5 (4 traits + 1 barre en diagonale). */
  S.tally = function (n, o = {}) {
    if (!n) return '<span class="st-none">—</span>';
    const h = o.h || 40, gw = Math.round(h * 1.1), sp = Math.round(h * 0.2);
    const groups = Math.floor(n / 5), rem = n % 5, lab = !!o.labels;
    const W = Math.max(12, groups * gw + rem * sp + 8), H = h + (lab ? 24 : 0);
    const col = o.color || INK, sw = Math.max(3, h / 11);
    let s = '';
    for (let g = 0; g < groups; g++) {
      const x0 = 6 + g * gw;
      for (let k = 0; k < 4; k++) s += `<line x1="${x0 + k * sp}" x2="${x0 + k * sp}" y1="4" y2="${h - 4}"/>`;
      s += `<line x1="${x0 - 5}" y1="${h - 9}" x2="${x0 + 3 * sp + 5}" y2="9" stroke="${o.diag || col}"/>`;
      if (lab) s += `<text x="${x0 + 1.5 * sp}" y="${h + 19}" text-anchor="middle" font-size="17" font-weight="900" fill="#118ab2" stroke="none">${(g + 1) * 5}</text>`;
    }
    for (let k = 0; k < rem; k++) {
      const x = 6 + groups * gw + k * sp;
      s += `<line x1="${x}" x2="${x}" y1="4" y2="${h - 4}"/>`;
      if (lab) s += `<text x="${x}" y="${h + 19}" text-anchor="middle" font-size="13" font-weight="800" fill="#7a7f99" stroke="none">${groups * 5 + k + 1}</text>`;
    }
    return `<svg class="st-tally" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><g stroke="${col}" stroke-width="${sw}" stroke-linecap="round">${s}</g></svg>`;
  };

  /** Tableau HTML. o = { head:[...], rows:[[cell, ...]], hl?: index, caption?, mini? } (cellules : HTML) */
  S.table = function (o) {
    return `<table class="st-table${o.mini ? ' st-mini' : ''}">${o.caption ? `<caption>${o.caption}</caption>` : ''}
      <thead><tr>${o.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${o.rows.map((r, i) => `<tr${o.hl === i ? ' class="hl"' : ''}>${r.map((c, j) => `<td${j > 0 && j === r.length - 1 ? ' class="num"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  };

  /** Roulette (SVG). sectors = [clé couleur, ...] (parts égales, dans le sens des aiguilles). o = { angle, hl } */
  S.spinner = function (sectors, o = {}) {
    const n = sectors.length, cx = 120, cy = 120, r = 104;
    const pt = (a) => [f1(cx + r * Math.sin((a * Math.PI) / 180)), f1(cy - r * Math.cos((a * Math.PI) / 180))];
    const runs = [];
    sectors.forEach((c, i) => {
      const last = runs[runs.length - 1];
      if (last && last.c === c) last.e = i + 1;
      else runs.push({ c, s: i, e: i + 1 });
    });
    if (runs.length > 1 && runs[0].c === runs[runs.length - 1].c) { runs[0].s = runs[runs.length - 1].s - n; runs.pop(); }
    const op = (c) => (o.hl && o.hl !== c ? ' opacity=".28"' : '');
    let s = '';
    if (runs.length === 1) s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${COL[runs[0].c].hex}"${op(runs[0].c)}/>`;
    else runs.forEach((rn) => {
      const a0 = (rn.s * 360) / n, a1 = (rn.e * 360) / n;
      const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
      s += `<path d="M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1} Z" fill="${COL[rn.c].hex}" stroke="#fff" stroke-width="3"${op(rn.c)}/>`;
    });
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="5"/>`;
    s += `<g class="st-arrow" transform="rotate(${f1(o.angle || 0)} ${cx} ${cy})"><path d="M120,24 L135,60 L125,57 L125,130 L115,130 L115,57 L105,60 Z" fill="${INK}" stroke="#fff" stroke-width="2"/></g>`;
    s += `<circle cx="${cx}" cy="${cy}" r="12" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/>`;
    return `<svg class="st-spin" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  };

  /** Une bille (SVG). */
  S.marble = (key, size = 30) => `<svg width="${size}" height="${size}" viewBox="0 0 40 40" class="st-die"><circle cx="20" cy="20" r="17" fill="${COL[key].hex}" stroke="rgba(0,0,0,.28)" stroke-width="2.5"/><circle cx="14" cy="13" r="5" fill="#fff" opacity=".6"/></svg>`;

  /** Sac de billes (SVG). marbles = [clé couleur, ...] (max 15). o = { hl } */
  const BAG_POS = [];
  [[130, [83, 117, 151, 185]], [165, [83, 117, 151, 185]], [200, [88, 122, 156, 190]], [232, [100, 134, 168]]]
    .forEach(([y, xs]) => xs.forEach((x) => BAG_POS.push([x, y])));
  S.BAG_MAX = BAG_POS.length;
  S.bag = function (marbles, o = {}) {
    let s = `<path d="M78,92 C18,122 16,258 134,258 C252,258 250,122 190,92 Z" fill="#d9b48a" stroke="#8a6440" stroke-width="5"/>
      <path d="M86,94 C44,124 40,240 134,244 C228,240 224,124 182,94 Z" fill="#f1dcc2"/>
      <path d="M78,92 L66,62 Q134,44 202,62 L190,92 Q134,78 78,92 Z" fill="#d9b48a" stroke="#8a6440" stroke-width="5" stroke-linejoin="round"/>
      <path d="M80,92 Q134,108 188,92" stroke="#7a4f2a" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    marbles.slice(0, BAG_POS.length).forEach((k, i) => {
      const [x, y] = BAG_POS[i], dim = o.hl && o.hl !== k && !(Array.isArray(o.hl) && o.hl.includes(k));
      const on = o.hl && !dim;
      s += `<g${dim ? ' opacity=".25"' : ''}><circle cx="${x}" cy="${y}" r="15" fill="${COL[k].hex}" stroke="${on ? INK : 'rgba(0,0,0,.28)'}" stroke-width="${on ? 4 : 2.5}"/><circle cx="${x - 5}" cy="${y - 6}" r="4.5" fill="#fff" opacity=".6"/></g>`;
    });
    return `<svg class="st-bag" viewBox="0 0 268 268" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
  };

  /** Face de dé (SVG). o = { size, hl, dim } */
  const PIPS = {
    1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
  };
  S.dieFace = function (v, o = {}) {
    const size = o.size || 60;
    const pips = (PIPS[v] || []).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${INK}"/>`).join('');
    return `<svg class="st-die" width="${size}" height="${size}" viewBox="0 0 100 100"${o.dim ? ' opacity=".3"' : ''}><rect x="5" y="5" width="90" height="90" rx="18" fill="${o.hl ? '#fff1b8' : '#fff'}" stroke="${o.hl ? '#e0a800' : INK}" stroke-width="${o.hl ? 8 : 5}"/>${pips}</svg>`;
  };
  /** Les faces d'un dé côte à côte. o = { hl: [valeurs], size } */
  S.dieRow = (faces, o = {}) => faces.map((v) => S.dieFace(v, { size: o.size || 38, hl: o.hl && o.hl.includes(v), dim: o.hl && !o.hl.includes(v) })).join('');

  /** Ligne des probabilités : impossible — possible — certain. hl = 'impossible' | 'possible' | 'certain' */
  S.pLine = (hl) => `<div class="st-pline">
      <div class="st-pz imp${hl === 'impossible' ? ' hl' : ''}">❌<br>Impossible</div>
      <div class="st-pz pos${hl === 'possible' ? ' hl' : ''}">🤔<br>Possible</div>
      <div class="st-pz cer${hl === 'certain' ? ' hl' : ''}">✅<br>Certain</div></div>`;

  /* ------------------------------------------------------------------
     Appareils du hasard : spec = { type:'spinner', sectors } | { type:'bag', marbles } | { type:'die', faces? }
     ------------------------------------------------------------------ */
  const facesOf = (spec) => spec.faces || [1, 2, 3, 4, 5, 6];
  /** Catégories de résultats possibles : [{ key, label, icon }] */
  S.catsOf = function (spec) {
    if (spec.type === 'die') {
      return [...new Set(facesOf(spec))].sort((a, b) => a - b).map((v) => ({ key: v, label: String(v), icon: S.dieFace(v, { size: 26 }) }));
    }
    const list = spec.type === 'spinner' ? spec.sectors : spec.marbles;
    return [...new Set(list)].map((k) => ({ key: k, label: COL[k].lbl, icon: dot(k) }));
  };
  /** Un résultat au hasard (sans DOM — utilisable dans gen()). */
  S.drawOutcome = function (spec) {
    if (spec.type === 'die') return M.pick(facesOf(spec));
    return M.pick(spec.type === 'spinner' ? spec.sectors : spec.marbles);
  };
  S.countOf = (spec, key) => (spec.type === 'die' ? facesOf(spec) : spec.type === 'spinner' ? spec.sectors : spec.marbles).filter((k) => k === key).length;

  function anim(ms, fn, alive) {
    return new Promise((res) => {
      const t0 = performance.now();
      const tick = (now) => {
        if (!alive.isConnected) return res();
        const t = Math.min(1, (now - t0) / ms);
        fn(t);
        if (t < 1) requestAnimationFrame(tick); else res();
      };
      requestAnimationFrame(tick);
    });
  }

  /**
   * Monte un appareil (roulette, sac ou dé) dans host.
   * Retourne { root, cats, render(o), play(key, ms) → Promise }.
   */
  S.device = function (host, spec) {
    const root = document.createElement('div');
    root.className = 'st-dev';
    host.appendChild(root);
    const st = { angle: 0, face: facesOf(spec)[0], picked: null };
    function render(o = {}) {
      if (spec.type === 'spinner') root.innerHTML = S.spinner(spec.sectors, { angle: st.angle, hl: o.hl });
      else if (spec.type === 'bag') {
        root.innerHTML = `<div class="st-bagbox">${S.bag(spec.marbles, { hl: o.hl })}<div class="st-hand">${st.picked ? S.marble(st.picked, 46) + `<span>${COL[st.picked].lbl}</span>` : '<span class="muted">✋</span>'}</div></div>`;
      } else {
        root.innerHTML = `<div class="st-diebox"><div class="st-dieface">${S.dieFace(st.face, { size: 104 })}</div>
          <div class="st-faces">Les faces du dé : ${S.dieRow(facesOf(spec), { hl: o.hl })}</div></div>`;
      }
    }
    async function play(key, ms = 900) {
      if (!root.isConnected) return;
      if (spec.type === 'spinner') {
        const n = spec.sectors.length;
        const idx = spec.sectors.map((c, i) => (c === key ? i : -1)).filter((i) => i >= 0);
        const i = M.pick(idx);
        const target = ((i + 0.2 + Math.random() * 0.6) * 360) / n;
        const from = st.angle;
        let to = from - (from % 360) + 360 * (ms > 500 ? 2 : 1) + target;
        if (to - from < 300) to += 360;
        const arrow = root.querySelector('.st-arrow');
        if (!arrow) { st.angle = to; render(); return; }
        M.sfx.tap();
        await anim(ms, (t) => {
          const e = 1 - Math.pow(1 - t, 3);
          arrow.setAttribute('transform', `rotate(${f1(from + (to - from) * e)} 120 120)`);
        }, root);
        st.angle = to % 360;
        if (root.isConnected) arrow.setAttribute('transform', `rotate(${f1(st.angle)} 120 120)`);
      } else if (spec.type === 'bag') {
        const svg = root.querySelector('.st-bag'), hand = root.querySelector('.st-hand');
        if (svg) { svg.classList.remove('st-shake'); void svg.getBoundingClientRect(); svg.classList.add('st-shake'); }
        if (hand) hand.innerHTML = '<span class="muted">✋</span>';
        await M.sleep(ms * 0.55);
        if (!root.isConnected) return;
        st.picked = key;
        M.sfx.pop();
        if (hand) hand.innerHTML = S.marble(key, 46) + `<span>${COL[key].lbl}</span>`;
        await M.sleep(ms * 0.45);
      } else {
        const face = root.querySelector('.st-dieface');
        const t0 = Date.now(), faces = facesOf(spec);
        while (face && Date.now() - t0 < ms * 0.75) {
          face.innerHTML = S.dieFace(M.pick(faces), { size: 104 });
          await M.sleep(Math.max(50, ms / 12));
          if (!root.isConnected) return;
        }
        st.face = key;
        M.sfx.pop();
        if (face) face.innerHTML = S.dieFace(key, { size: 104 });
        await M.sleep(ms * 0.25);
      }
    }
    render();
    return { root, cats: S.catsOf(spec), render, play, state: st };
  };

  /** Tableau des résultats d'une expérience : Résultat | Traits | Nombre */
  S.resultsTable = function (cats, counts, o = {}) {
    return S.table({
      caption: o.caption,
      head: ['Résultat', 'Traits', ...(o.nums !== false ? ['Nombre'] : [])],
      rows: cats.map((c) => [`${c.icon} ${c.label}`, S.tally(counts[c.key] || 0, { h: 28 }), ...(o.nums !== false ? [String(counts[c.key] || 0)] : [])]),
      hl: o.hl == null ? undefined : cats.findIndex((c) => String(c.key) === String(o.hl)),
    });
  };

  /** Monte un visuel dans el (nouveau conteneur à chaque fois). */
  function mount(el, html) {
    el.onclick = null; // évite un gestionnaire laissé par un autre visuel
    el.innerHTML = `<div class="st-wrap">${html}</div>`;
    return el.firstElementChild;
  }
  S.mount = mount;

  /* ------------------------------------------------------------------
     Questions sur un ensemble de catégories (bandes, pictogrammes)
     ------------------------------------------------------------------ */
  function catChoices(cats) {
    return cats.map((c) => ({ label: `<span style="font-size:1.6rem">${c.icon}</span>${c.label}`, value: c.label }));
  }
  /** Construit la question (sans visuel) : type = how | most | least | more | total */
  function dataQuestion(ctx, cats, type) {
    const vals = cats.map((c) => c.value);
    if (type === 'how') {
      const i = M.rnd(0, cats.length - 1), c = cats[i];
      return { i: [i], prompt: ctx.how(c), input: 'number', answer: c.value, c };
    }
    if (type === 'most' || type === 'least') {
      const i = uniqueExt(vals, type === 'most' ? 1 : -1), c = cats[i];
      return { i: [i], prompt: ctx[type], input: 'choice', answer: c.label, choices: catChoices(cats), c };
    }
    if (type === 'more') {
      const [a, b] = M.shuffle(cats.map((_, k) => k)).slice(0, 2).sort((p, q) => vals[q] - vals[p]);
      return { i: [a, b], prompt: ctx.more(cats[a], cats[b]), input: 'number', answer: vals[a] - vals[b], a: cats[a], b: cats[b] };
    }
    return { i: cats.map((_, k) => k), prompt: ctx.total, input: 'number', answer: sum(vals) };
  }

  /* ==================================================================
     1. Lire un diagramme à bandes
     ================================================================== */
  M.registerSkill({
    id: 'lire-diagramme', domain: 'stats', title: 'Lire un diagramme à bandes', icon: '📊', starter: true,
    desc: 'Lire les bandes pour répondre : combien, le plus, le moins, en tout.',
    pda: 'Statistique 3a — interpréter des données à l\'aide d\'un diagramme à bandes',
    learn: 'diagrammes',
    gen({ lvl }) {
      const ctx = M.pick(S.CTX);
      const n = lvl === 0 ? 3 : lvl === 1 ? 4 : Math.min(ctx.cats.length, M.pick([4, 5]));
      const cats = pickCats(ctx, n);
      const values = lvl === 2 ? distinct(n, 2, 20, 2) : distinct(n, 1, lvl === 0 ? 9 : 10);
      cats.forEach((c, k) => (c.value = values[k]));
      const max = lvl === 2 ? 20 : 10;
      const horizontal = lvl > 0 && Math.random() < 0.4;
      const type = M.pick(lvl === 0 ? ['how', 'how', 'most', 'least'] : lvl === 1 ? ['how', 'how', 'most', 'least', 'more', 'total'] : ['how', 'more', 'more', 'total', 'least', 'most']);
      const d = dataQuestion(ctx, cats, type);
      const base = { cats, title: ctx.title, axis: ctx.axis, max, horizontal };
      const far = horizontal ? 'en bas' : 'à gauche';
      const end = horizontal ? 'le bout' : 'le haut';
      const hints = {
        how: `Trouve la bande ${d.c ? d.c.icon : ''}. Suis ${end} de la bande jusqu'aux nombres, ${far}.`,
        most: horizontal ? 'Cherche la bande la plus longue.' : 'Cherche la bande la plus haute.',
        least: horizontal ? 'Cherche la bande la plus courte.' : 'Cherche la bande la plus basse.',
        more: 'Lis les deux nombres, puis enlève le plus petit du plus grand.',
        total: 'Lis le nombre de chaque bande, puis additionne-les tous.',
      };
      let explain;
      if (type === 'how') explain = `La bande ${d.c.icon} ${d.c.label} s'arrête à la ligne du <b>${d.c.value}</b>.`;
      else if (type === 'most' || type === 'least') explain = `La bande ${d.c.icon} ${d.c.label} est la plus ${type === 'most' ? (horizontal ? 'longue' : 'haute') : (horizontal ? 'courte' : 'basse')} : elle arrive à <b>${d.c.value}</b>.`;
      else if (type === 'more') explain = `${d.a.icon} ${d.a.label} : ${d.a.value}. ${d.b.icon} ${d.b.label} : ${d.b.value}. ${d.a.value} − ${d.b.value} = <b>${d.answer}</b>.`;
      else explain = `On additionne toutes les bandes : ${values.join(' + ')} = <b>${d.answer}</b>.`;
      return {
        prompt: d.prompt, say: plain(d.prompt), input: d.input, answer: d.answer, choices: d.choices,
        hint: hints[type], explain,
        viz(el) {
          const draw = (guide) => {
            const w = mount(el, `<div class="viz-hint">👆 Touche une bande pour tracer sa ligne jusqu'aux nombres.</div>${S.barChart({ ...base, guide })}`);
            w.onclick = (e) => {
              const g = e.target.closest && e.target.closest('[data-i]');
              if (!g || !w.contains(g)) return;
              M.sfx.tap();
              draw(+g.getAttribute('data-i'));
            };
          };
          draw();
        },
        showMe(el) {
          mount(el, `<div class="viz-hint">👀 Regarde les lignes pointillées.</div>${S.barChart({ ...base, reveal: d.i })}`);
        },
      };
    },
  });

  /* ==================================================================
     2. Diagramme à pictogrammes
     ================================================================== */
  M.registerSkill({
    id: 'pictogramme', domain: 'stats', title: 'Le diagramme à pictogrammes', icon: '🙂', starter: true,
    desc: 'Compter les images, en suivant la légende.',
    pda: 'Statistique 3a — interpréter des données à l\'aide d\'un diagramme à pictogrammes',
    learn: 'diagrammes',
    gen({ lvl }) {
      const ctx = M.pick(S.CTX.filter((c) => c.sym));
      const per = lvl === 0 ? 1 : 2;
      const n = lvl === 0 ? 3 : M.pick([3, 4]);
      const cats = pickCats(ctx, n);
      const values = lvl === 0 ? distinct(n, 1, 8) : distinct(n, 2, lvl === 1 ? 14 : 20, 2);
      cats.forEach((c, k) => (c.value = values[k]));
      const type = M.pick(lvl === 0 ? ['how', 'how', 'most', 'least'] : lvl === 1 ? ['how', 'how', 'how', 'most', 'least', 'more'] : ['how', 'more', 'total', 'draw', 'draw']);
      const unitP = ctx.unit[1];
      const base = { title: ctx.title, cats, sym: ctx.sym, per, unit: ctx.unit };
      let q;
      if (type === 'draw') {
        const v = M.pick([4, 6, 8, 10, 12, 14, 16].filter((x) => !values.includes(x)));
        const prompt = `Légende : ${ctx.sym} = 2 ${unitP}.<br>Pour montrer <b>${v} ${unitP}</b>, combien d'images ${ctx.sym} faut-il dessiner ?`;
        q = {
          prompt, input: 'number', answer: v / 2, idx: [],
          hint: `Compte par bonds de 2 jusqu'à ${v} : chaque bond, c'est une image.`,
          explain: `Chaque ${ctx.sym} vaut 2. On compte par 2 : ${M.range(2, v, 2).join(', ')}. Ça fait <b>${v / 2}</b> images.`,
        };
      } else {
        const d = dataQuestion(ctx, cats, type);
        const valTxt = (c) => (per === 1 ? `${c.value} ${ctx.sym}` : `${c.value / 2} ${ctx.sym}, et on compte par 2 : ${M.range(2, c.value, 2).join(', ')}`);
        let explain;
        if (type === 'how') explain = `${d.c.icon} ${d.c.label} : ${valTxt(d.c)}. Ça fait <b>${d.c.value}</b>.`;
        else if (type === 'more') explain = `${d.a.label} : ${d.a.value}. ${d.b.label} : ${d.b.value}. ${d.a.value} − ${d.b.value} = <b>${d.answer}</b>.`;
        else if (type === 'total') explain = `${values.join(' + ')} = <b>${d.answer}</b>.`;
        else explain = `La rangée ${d.c.icon} ${d.c.label} a ${type === 'most' ? 'le plus' : 'le moins'} d'images (${d.c.value / per} ${M.plural(d.c.value / per, 'image')}).`;
        q = {
          prompt: d.prompt, input: d.input, answer: d.answer, choices: d.choices, idx: d.i, explain,
          hint: per === 1
            ? (type === 'most' || type === 'least' ? 'Compare la longueur des rangées d\'images.' : 'Chaque image vaut 1. Compte les images de la rangée.')
            : (type === 'most' || type === 'least' ? 'Compare la longueur des rangées d\'images.' : `Regarde la légende : chaque ${ctx.sym} vaut 2. Compte par bonds de 2 : 2, 4, 6…`),
        };
        if (per === 2 && type === 'more') q.hint = `Chaque ${ctx.sym} vaut 2. Trouve les deux nombres, puis enlève le plus petit du plus grand.`;
      }
      return {
        prompt: q.prompt, say: plain(q.prompt), input: q.input, answer: q.answer, choices: q.choices, hint: q.hint, explain: q.explain,
        viz(el) {
          const draw = (hl) => {
            const w = mount(el, `<div class="viz-hint">👆 Touche une rangée pour la surligner. Regarde bien la légende !</div>${S.picto({ ...base, hl })}`);
            w.onclick = (e) => {
              const r = e.target.closest && e.target.closest('.st-prow');
              if (!r || !w.contains(r)) return;
              M.sfx.tap();
              draw(+r.getAttribute('data-i'));
            };
          };
          draw();
        },
        showMe(el) {
          if (type === 'draw') {
            mount(el, `<div class="viz-hint">👀 Chaque ${ctx.sym} vaut 2 : on compte par bonds de 2.</div><div class="st-picto" style="text-align:center">${M.range(2, q.answer * 2, 2).map((v) => `<span class="st-pp">${ctx.sym}<i>${v}</i></span>`).join('')}</div>`);
            return;
          }
          mount(el, `<div class="viz-hint">👀 On compte ${per === 1 ? 'les images une par une' : 'par bonds de 2'}.</div>${S.picto({ ...base, reveal: q.idx })}`);
        },
      };
    },
  });

  /* ==================================================================
     3. Traits et tableaux
     ================================================================== */
  const SORT_SETS = [
    { title: 'Les fruits du panier', cats: [['🍎', 'pommes rouges'], ['🍏', 'pommes vertes'], ['🍐', 'poires'], ['🍌', 'bananes']] },
    { title: 'Les animaux de la ferme', cats: [['🐄', 'vaches'], ['🐷', 'cochons'], ['🐔', 'poules'], ['🐑', 'moutons']] },
    { title: 'Les jouets de la classe', cats: [['⚽', 'ballons'], ['🧸', 'oursons'], ['🚗', 'petites autos'], ['🎲', 'dés']] },
    { title: 'La météo du mois', cats: [['☀️', 'jours de soleil'], ['🌧️', 'jours de pluie'], ['❄️', 'jours de neige'], ['☁️', 'jours nuageux']] },
  ];
  /** « 2 paquets de 5 et 3 traits » */
  function tallyTxt(n) {
    const g = Math.floor(n / 5), r = n % 5;
    const a = g ? `${g} ${M.plural(g, 'paquet')} de 5` : '', b = r ? `${r} ${M.plural(r, 'trait')}` : '';
    return a && b ? `${a} et ${b}` : a || b;
  }
  S.tallyTxt = tallyTxt;
  M.registerSkill({
    id: 'tableau-donnees', domain: 'stats', title: 'Traits et tableaux', icon: '🧮',
    desc: 'Compter des traits, classer des objets et remplir un tableau.',
    pda: 'Statistique 2, 3a, 4a — collecter, organiser et représenter des données à l\'aide de tableaux',
    learn: 'diagrammes',
    gen({ lvl }) {
      const type = M.pick(lvl === 0 ? ['tally', 'tally', 'sort', 'sort', 'pickTally'] : lvl === 1 ? ['tally', 'sort', 'pickTally', 'match', 'tallyTable'] : ['tally', 'sort', 'match', 'match', 'tallyTable', 'pickTally']);

      if (type === 'tally') {
        const n = lvl === 0 ? M.rnd(3, 12) : lvl === 1 ? M.rnd(6, 20) : M.rnd(11, 30);
        const g = Math.floor(n / 5), r = n % 5;
        return {
          prompt: 'Quel nombre ces <b>traits</b> montrent-ils ?', input: 'number', answer: n,
          hint: 'Chaque paquet barré vaut 5. Compte par 5, puis ajoute les traits seuls.',
          explain: g ? `${g} ${M.plural(g, 'paquet')} de 5${g > 1 ? ` (${M.range(5, g * 5, 5).join(', ')})` : ''}${r ? ` et ${r} ${M.plural(r, 'trait')} de plus : ${g * 5} + ${r}` : ''} = <b>${n}</b>.` : `On compte les traits un par un : <b>${n}</b>.`,
          viz(el) { mount(el, `<div class="viz-hint">Un paquet de 5 = 4 traits + 1 trait barré en travers.</div>${S.tally(n, { h: 64 })}`); },
          showMe(el) { mount(el, `<div class="viz-hint">👀 On compte par 5, puis par 1.</div>${S.tally(n, { h: 64, labels: true, diag: '#ef476f' })}`); },
        };
      }

      if (type === 'pickTally') {
        const n = lvl === 0 ? M.rnd(3, 9) : M.rnd(6, 19);
        const set = new Set([n]);
        [n + 1, n - 1, n + 5, n - 5, n + 2].filter((v) => v >= 1).forEach((v) => set.size < (lvl === 0 ? 3 : 4) && set.add(v));
        const choices = M.shuffle([...set]).map((v) => ({ label: S.tally(v, { h: 36 }), value: v }));
        return {
          prompt: `Quels traits montrent le nombre <b>${n}</b> ?`, input: 'choice', answer: n, choices, cols: 1,
          hint: 'Compte par 5 les paquets barrés, puis ajoute les traits seuls.',
          explain: `${n}, c'est ${tallyTxt(n)}.`,
          viz(el) { mount(el, `<div class="viz-hint">Rappel : un paquet de 5</div>${S.tally(5, { h: 64 })}<div class="big-num">= 5</div>`); },
        };
      }

      if (type === 'sort') {
        const set = M.pick(SORT_SETS);
        const n = lvl === 0 ? 3 : 4;
        const cats = M.shuffle(set.cats).slice(0, n).map(([icon, p]) => ({ icon, p }));
        const vals = distinct(n, 2, lvl === 0 ? 6 : lvl === 1 ? 8 : 10);
        cats.forEach((c, k) => (c.value = vals[k]));
        const ask = M.rnd(0, n - 1), c = cats[ask];
        const items = M.shuffle(cats.flatMap((cc, k) => Array(cc.value).fill(k)));
        const tableHtml = () => S.table({
          caption: set.title, head: ['Catégorie', 'Nombre'], hl: ask,
          rows: cats.map((cc, k) => [`${cc.icon} ${cap(cc.p)}`, k === ask ? '<span class="q">?</span>' : String(cc.value)]),
        });
        const itemsHtml = (show) => `<div class="st-items">${items.map((k, i) => {
          const nth = show ? items.slice(0, i + 1).filter((x) => x === ask).length : 0;
          return `<button class="st-item${show && k === ask ? ' hl' : ''}" data-i="${i}">${cats[k].icon}${show && k === ask ? `<b>${nth}</b>` : ''}</button>`;
        }).join('')}</div>`;
        return {
          prompt: `Classe les objets pour compléter le tableau.<br>Combien y a-t-il de <b>${c.icon} ${c.p}</b> ?`, input: 'number', answer: c.value,
          say: `Classe les objets pour compléter le tableau. Combien y a-t-il de ${c.p} ?`,
          hint: `Touche chaque ${c.icon} pour le cocher pendant que tu comptes.`,
          explain: `Il y a <b>${c.value}</b> ${c.icon} ${c.p}. On écrit ${c.value} dans le tableau.`,
          viz(el) {
            const w = mount(el, `<div class="viz-hint">👆 Touche les objets pour les cocher.</div>${itemsHtml(false)}${tableHtml()}`);
            w.onclick = (e) => {
              const b = e.target.closest && e.target.closest('.st-item');
              if (!b || !w.contains(b)) return;
              b.classList.toggle('on');
              M.sfx.tap();
            };
          },
          showMe(el) { mount(el, `<div class="viz-hint">👀 On compte seulement les ${c.icon}.</div>${itemsHtml(true)}${tableHtml()}`); },
        };
      }

      if (type === 'tallyTable') {
        const ctx = M.pick(S.VOTES);
        const n = 3 + (lvl === 2 ? 1 : 0);
        const cats = pickCats(ctx, n);
        const vals = distinct(n, 3, lvl === 1 ? 14 : 22);
        cats.forEach((c, k) => (c.value = vals[k]));
        const ask = M.rnd(0, n - 1), c = cats[ask];
        const tbl = (show) => S.table({
          caption: ctx.q, head: ['Réponse', 'Votes', 'Nombre'], hl: ask,
          rows: cats.map((cc, k) => [`${cc.icon} ${cc.label}`, S.tally(cc.value, { h: 30, labels: show && k === ask }), k === ask ? (show ? String(cc.value) : '<span class="q">?</span>') : String(cc.value)]),
        });
        return {
          prompt: `Lis les traits dans le tableau. ${ctx.how(c)}`, input: 'number', answer: c.value,
          hint: 'Compte les paquets de 5, puis ajoute les traits seuls.',
          explain: `${tallyTxt(c.value)} : <b>${c.value}</b>.`,
          viz(el) { mount(el, tbl(false)); },
          showMe(el) { mount(el, tbl(true)); },
        };
      }

      // match : relier un tableau et un diagramme à bandes
      const ctx = M.pick(S.VOTES);
      const cats = pickCats(ctx, 3);
      const vals = distinct(3, 1, 9);
      const opts = [vals.slice()];
      const key = (a) => a.join(',');
      const sw = vals.slice(); const [p, r] = M.shuffle([0, 1, 2]).slice(0, 2); [sw[p], sw[r]] = [sw[r], sw[p]];
      opts.push(sw);
      let guard = 0;
      while (opts.length < 3 && guard++ < 50) {
        const alt = vals.slice(), k = M.rnd(0, 2);
        alt[k] = Math.max(1, Math.min(10, alt[k] + M.pick([-2, -1, 1, 2])));
        if (!opts.some((o) => key(o) === key(alt))) opts.push(alt);
      }
      const order = M.shuffle(opts.map((_, k) => k));
      const letters = ['A', 'B', 'C'];
      const withVals = (arr) => cats.map((c, k) => ({ ...c, value: arr[k] }));
      const reverse = Math.random() < 0.5;
      const answer = letters[order.indexOf(0)];
      const tableOf = (arr, mini) => S.table({ mini, caption: mini ? '' : ctx.title, head: ['Réponse', 'Nombre'], rows: withVals(arr).map((c) => [`${c.icon} ${c.label}`, String(c.value)]) });
      const choices = order.map((oi, k) => ({
        label: `<b>${letters[k]}</b>${reverse ? tableOf(opts[oi], true) : S.barChart({ cats: withVals(opts[oi]), max: 10, small: true })}`,
        value: letters[k],
      }));
      const truth = cats.map((c, k) => `${c.icon} ${vals[k]}`).join(', ');
      return {
        prompt: reverse ? 'Quel <b>tableau</b> montre les mêmes données que le diagramme à bandes ?' : 'Quel <b>diagramme à bandes</b> montre les mêmes données que le tableau ?',
        input: 'choice', answer, choices, cols: 1,
        hint: 'Vérifie chaque catégorie, une à la fois : le nombre doit être pareil.',
        explain: `Les bonnes données : ${truth}. C'est le choix <b>${answer}</b>.`,
        viz(el) {
          mount(el, reverse ? S.barChart({ cats: withVals(vals), title: ctx.title, axis: ctx.axis, max: 10 }) : tableOf(vals, false));
        },
        showMe(el) {
          mount(el, `${S.barChart({ cats: withVals(vals), title: ctx.title, axis: ctx.axis, max: 10, reveal: [0, 1, 2] })}${tableOf(vals, false)}`);
        },
      };
    },
  });

  /* ==================================================================
     4. Mon enquête
     ================================================================== */
  const TOPICS = [
    { grp: 'food', goal: 'le <b>fruit préféré</b> des élèves de ta classe', good: 'Quel est ton fruit préféré ?', yesno: 'Aimes-tu les pommes ?', silly: 'Combien y a-t-il de fruits dans le monde ?', cats: [['🍎', 'pomme'], ['🍌', 'banane'], ['🍇', 'raisins'], ['🍓', 'fraise']] },
    { goal: "l'<b>animal préféré</b> des élèves de ta classe", good: 'Quel est ton animal préféré ?', yesno: 'As-tu un chien ?', silly: 'Combien pèse un éléphant ?', cats: [['🐶', 'chien'], ['🐱', 'chat'], ['🐰', 'lapin'], ['🐠', 'poisson']] },
    { goal: 'le <b>sport préféré</b> des élèves de ta classe', good: 'Quel est ton sport préféré ?', yesno: 'Joues-tu au hockey ?', silly: 'Qui a inventé le soccer ?', cats: [['🏒', 'hockey'], ['⚽', 'soccer'], ['🏊', 'natation'], ['⛷️', 'ski']] },
    { goal: 'la <b>saison préférée</b> des élèves de ta classe', good: 'Quelle est ta saison préférée ?', yesno: "Aimes-tu l'hiver ?", silly: 'Combien de jours dure une saison ?', cats: [['❄️', 'hiver'], ['🌷', 'printemps'], ['☀️', 'été'], ['🍁', 'automne']] },
    { goal: 'la <b>couleur préférée</b> des élèves de ta classe', good: 'Quelle est ta couleur préférée ?', yesno: 'Aimes-tu le rouge ?', silly: "Combien y a-t-il de couleurs dans l'arc-en-ciel ?", cats: [['🔴', 'rouge'], ['🔵', 'bleu'], ['🟢', 'vert'], ['🟡', 'jaune']] },
    { goal: "<b>comment</b> les élèves de ta classe <b>viennent à l'école</b>", good: "Comment viens-tu à l'école ?", yesno: "Viens-tu à l'école en autobus ?", silly: 'Combien de roues a un autobus ?', cats: [['🚌', 'autobus'], ['🚗', 'auto'], ['🚶', 'à pied'], ['🚲', 'vélo']] },
    { grp: 'food', goal: 'la <b>collation préférée</b> des élèves de ta classe', good: 'Quelle est ta collation préférée ?', yesno: "As-tu une collation aujourd'hui ?", silly: "Combien coûte une pomme à l'épicerie ?", cats: [['🍎', 'pomme'], ['🧀', 'fromage'], ['🥕', 'carotte'], ['🥨', 'bretzels']] },
  ];
  const CLASSES = [
    { name: 'fruits', items: [['🍎', 'pomme'], ['🍌', 'banane'], ['🍇', 'raisins'], ['🍓', 'fraise'], ['🍐', 'poire'], ['🍒', 'cerises']], intr: [['🥕', 'carotte'], ['🥦', 'brocoli'], ['🧀', 'fromage'], ['🍞', 'pain']] },
    { name: 'légumes', items: [['🥕', 'carotte'], ['🥦', 'brocoli'], ['🌽', 'maïs'], ['🥔', 'patate'], ['🥒', 'concombre']], intr: [['🍌', 'banane'], ['🍓', 'fraise'], ['🍪', 'biscuit'], ['🧀', 'fromage']] },
    { name: 'animaux de la ferme', items: [['🐄', 'vache'], ['🐷', 'cochon'], ['🐔', 'poule'], ['🐑', 'mouton'], ['🐴', 'cheval']], intr: [['🦁', 'lion'], ['🦒', 'girafe'], ['🐘', 'éléphant']] },
    { name: "vêtements d'hiver", items: [['🧣', 'foulard'], ['🧤', 'mitaines'], ['🧥', 'manteau'], ['👢', 'bottes']], intr: [['🩳', 'short'], ['🩴', 'sandales'], ['👙', 'maillot de bain']] },
    { name: "sports d'hiver", items: [['⛷️', 'ski'], ['🏒', 'hockey'], ['⛸️', 'patin'], ['🏂', 'planche à neige']], intr: [['🏊', 'natation'], ['🏄', 'surf'], ['⚾', 'baseball']] },
    { name: 'moyens de transport', items: [['🚌', 'autobus'], ['🚗', 'auto'], ['🚲', 'vélo'], ['🚂', 'train'], ['✈️', 'avion']], intr: [['🏠', 'maison'], ['🌳', 'arbre'], ['🛏️', 'lit']] },
  ];
  /** n sujets différents (jamais deux sujets « nourriture » ensemble). */
  function pickTopics(n) {
    const out = [];
    M.shuffle(TOPICS).forEach((t) => { if (out.length < n && !out.some((o) => o.grp && o.grp === t.grp)) out.push(t); });
    return out;
  }
  const tilesHtml = (list, hlIdx) => `<div class="st-tiles">${list.map(([e, l], i) => `<div class="st-tile${i === hlIdx ? ' hl' : ''}">${e}<small>${l}</small></div>`).join('')}</div>`;
  M.registerSkill({
    id: 'enquete', domain: 'stats', title: 'Mon enquête', icon: '📋',
    desc: 'Choisir une bonne question d\'enquête et classer les réponses.',
    pda: 'Statistique 1, 2 — formuler des questions d\'enquête ; classifier des données',
    learn: 'diagrammes',
    gen({ lvl }) {
      const type = M.pick(lvl === 0 ? ['question', 'question', 'intrus', 'intrus'] : lvl === 1 ? ['question', 'intrus', 'answers', 'classify', 'whichQ'] : ['question', 'answers', 'classify', 'whichQ', 'intrus']);

      if (type === 'question') {
        const [t, other] = pickTopics(2);
        const raw = [{ v: 'good', l: t.good }, { v: 'yesno', l: t.yesno }, { v: 'silly', l: t.silly }];
        if (lvl > 0) raw.push({ v: 'other', l: other.good });
        return {
          prompt: `Tu veux savoir ${t.goal}. Quelle question poses-tu à chaque élève ?`, input: 'choice', answer: 'good', cols: 1,
          choices: M.shuffle(raw).map((c) => ({ label: `« ${c.l} »`, value: c.v })),
          hint: 'Une bonne question d\'enquête : chaque élève peut y répondre, et sa réponse nous apprend ce qu\'on veut savoir.',
          explain: `« ${t.good} » : chaque élève donne sa réponse. « ${t.yesno} » se répond seulement par oui ou non, et « ${t.silly} » ne nous apprend rien sur les élèves de la classe.`,
          viz(el) {
            mount(el, `<div class="st-fiche"><h3>📋 Mon enquête</h3><p>🎯 Je veux savoir ${t.goal}.</p><div class="big">${t.cats.map((c) => c[0]).join(' ')}</div></div>`);
          },
          showMe(el) {
            mount(el, `<div class="st-fiche"><h3>📋 Mon enquête</h3><p>🎯 Je veux savoir ${t.goal}.</p><p>✅ <b>« ${t.good} »</b></p><p class="muted">❌ « ${t.yesno} » → oui ou non seulement</p><div class="big">${t.cats.map((c) => c[0]).join(' ')}</div></div>`);
          },
        };
      }

      if (type === 'answers') {
        const [t, o1, o2] = pickTopics(3);
        const fmt = (list) => list.map(([e, l]) => `${e} ${l}`).join(', ');
        const mixed = [t.cats[0], o1.cats[1], o2.cats[2]];
        const choices = M.shuffle([
          { label: fmt(t.cats.slice(0, 3)), value: 'good' },
          { label: fmt(o1.cats.slice(0, 3)), value: 'other' },
          { label: fmt(mixed), value: 'mixed' },
          { label: '👍 oui, 👎 non', value: 'yesno' },
        ]);
        return {
          prompt: `Tu poses la question <b>« ${t.good} »</b>. Quelles <b>réponses</b> écris-tu dans ton tableau ?`, input: 'choice', answer: 'good', choices, cols: 1,
          hint: 'Les réponses doivent répondre à la question… et aller ensemble !',
          explain: `Pour « ${t.good} », les élèves répondront : ${fmt(t.cats)}…`,
          viz(el) {
            mount(el, `<div class="st-fiche"><h3>📋 Mon tableau d'enquête</h3><p><b>« ${t.good} »</b></p>${S.table({ head: ['Réponse', 'Votes'], rows: [['?', ''], ['?', ''], ['?', '']] })}</div>`);
          },
          showMe(el) {
            mount(el, `<div class="st-fiche"><h3>📋 Mon tableau d'enquête</h3><p><b>« ${t.good} »</b></p>${S.table({ head: ['Réponse', 'Votes'], rows: t.cats.slice(0, 3).map(([e, l]) => [`${e} ${l}`, '']) })}</div>`);
          },
        };
      }

      if (type === 'intrus') {
        const cl = M.pick(CLASSES);
        const n = lvl === 0 ? 3 : 4;
        const good = M.shuffle(cl.items).slice(0, n - 1), bad = M.pick(cl.intr);
        const list = M.shuffle([...good, bad]);
        return {
          prompt: `Ces réponses vont dans la catégorie <b>« ${cl.name} »</b>. Laquelle n'est <b>pas</b> à sa place ?`, input: 'choice', answer: bad[1],
          choices: list.map(([e, l]) => ({ label: `<span style="font-size:2rem">${e}</span>${l}`, value: l })),
          hint: `Pour chaque réponse, demande-toi : « Est-ce que c'est un élément de la catégorie ${cl.name} ? »`,
          explain: `${bad[0]} ${cap(bad[1])} ne fait pas partie des ${cl.name}.`,
          viz(el) { mount(el, `<div class="viz-hint">Catégorie : ${cl.name}</div>${tilesHtml(list)}`); },
          showMe(el) { mount(el, `<div class="viz-hint">Catégorie : ${cl.name}</div>${tilesHtml(list, list.indexOf(bad))}`); },
        };
      }

      if (type === 'classify') {
        const cls = M.shuffle(CLASSES).slice(0, 3);
        const k = M.rnd(0, 2);
        // l'objet ne doit appartenir qu'à sa catégorie parmi les 3 choisies
        const item = M.pick(cls[k].items.filter(([, l]) => !cls.some((c, j) => j !== k && c.items.some((x) => x[1] === l))));
        return {
          prompt: `Tu classes tes réponses en 3 catégories. Dans quelle catégorie places-tu <b>${item[0]} ${item[1]}</b> ?`, input: 'choice', answer: cls[k].name, cols: 1,
          choices: cls.map((c) => ({ label: cap(c.name), value: c.name })),
          hint: 'Cherche la catégorie qui va avec cet objet.',
          explain: `${item[0]} ${cap(item[1])} va dans la catégorie <b>${cls[k].name}</b>.`,
          viz(el) { mount(el, `<div class="st-event">${item[0]}</div><div class="st-tiles">${cls.map((c) => `<div class="st-tile" style="font-size:1rem;font-weight:800">${c.items.filter((x) => x !== item).slice(0, 2).map((x) => x[0]).join(' ')}<small>${cap(c.name)}</small></div>`).join('')}</div>`); },
        };
      }

      // whichQ : quelle question a donné ce tableau ?
      const [t, o1, o2] = pickTopics(3);
      const vals = distinct(3, 2, 9);
      const rows = t.cats.slice(0, 3).map(([e, l], k) => [`${e} ${cap(l)}`, String(vals[k])]);
      return {
        prompt: 'Quelle question d\'enquête a-t-on posée pour remplir ce tableau ?', input: 'choice', answer: 'good', cols: 1,
        choices: M.shuffle([{ label: `« ${t.good} »`, value: 'good' }, { label: `« ${o1.good} »`, value: 'o1' }, { label: `« ${o2.good} »`, value: 'o2' }]),
        hint: 'Regarde les réponses dans le tableau : de quoi parlent-elles ?',
        explain: `Les réponses (${t.cats.slice(0, 3).map((c) => c[1]).join(', ')}) répondent à « ${t.good} ».`,
        viz(el) { mount(el, S.table({ caption: '📋 Résultats de l\'enquête', head: ['Réponse', 'Nombre'], rows })); },
      };
    },
  });

  /* ==================================================================
     5. Certain, possible ou impossible
     ================================================================== */
  const EVENTS = {
    certain: [
      ['📅', 'Après lundi, ce sera mardi.'],
      ['🌅', 'Demain matin, le soleil va se lever.'],
      ['🗓️', 'Après le mois de mai, ce sera le mois de juin.'],
      ['📅', 'Après dimanche, ce sera lundi.'],
      ['🍁', "Après l'été, ce sera l'automne."],
    ],
    possible: [
      ['🌧️', 'Demain, il va pleuvoir.'],
      ['🍝', 'Ce soir, on va manger du spaghetti.'],
      ['🚗', 'La prochaine auto qui passe dans ma rue sera rouge.'],
      ['🪙', "Je lance une pièce de monnaie : elle tombe sur « pile »."],
      ['📞', 'Mon ami va me téléphoner samedi.'],
    ],
    impossible: [
      ['🌙', 'Ce soir, je vais toucher la Lune avec ma main.'],
      ['🐘', 'Demain, mon chat va se transformer en éléphant.'],
      ['👴', 'Demain, je vais avoir 100 ans.'],
      ['📅', 'Après mardi, ce sera dimanche.'],
      ['🐟', 'Un poisson va sortir de l\'eau pour faire du vélo.'],
    ],
  };
  S.EVENTS = EVENTS;
  const CPI = [
    { label: '❌ Impossible', value: 'impossible' },
    { label: '🤔 Possible', value: 'possible' },
    { label: '✅ Certain', value: 'certain' },
  ];
  const WHY = {
    certain: 'ça va arriver à coup sûr',
    possible: 'ça peut arriver, mais on n\'en est pas sûr',
    impossible: 'ça ne peut pas arriver',
  };
  /** Petit visuel « appareil + bouton Essayer » (essais au hasard pour explorer). */
  function tryViz(el, spec, hintTxt, hl, line) {
    const w = mount(el, `<div class="viz-hint">${hintTxt}</div><div class="st-devhost"></div>
      <div class="row" style="justify-content:center"><button class="btn blue st-try">🎲 Essayer une fois</button></div><div class="viz-status"></div>`);
    const dev = S.device(M.$('.st-devhost', w), spec);
    let busy = false;
    M.$('.st-try', w).onclick = async () => {
      if (busy) return;
      busy = true;
      const k = S.drawOutcome(spec);
      await dev.play(k, 900);
      busy = false;
      if (!w.isConnected) return;
      const c = dev.cats.find((x) => x.key === k);
      M.$('.viz-status', w).innerHTML = `Résultat : ${c.icon} <b>${c.label}</b>. Essaie encore !`;
    };
    if (hl != null) dev.render({ hl });
    if (line) w.insertAdjacentHTML('beforeend', S.pLine(line));
    return { w, dev };
  }
  M.registerSkill({
    id: 'certain-possible', domain: 'stats', title: 'Certain, possible ou impossible ?', icon: '🎲',
    desc: 'Le hasard : est-ce que ça va arriver à coup sûr, peut-être ou jamais ?',
    pda: 'Probabilité 1, 5a — variabilité des résultats ; prédire qualitativement (certain, possible, impossible)',
    learn: 'hasard',
    gen({ lvl }) {
      const kind = M.pick(lvl === 0 ? ['bag', 'bag', 'event'] : lvl === 1 ? ['bag', 'spinner', 'die', 'event'] : ['bag', 'bagOr', 'spinner', 'die', 'event']);
      const target = M.pick(['certain', 'possible', 'impossible']);
      const base = { input: 'choice', answer: target, choices: CPI, cols: 1 };

      if (kind === 'event') {
        const [icon, txt] = M.pick(EVENTS[target]);
        return {
          ...base,
          prompt: `<span class="st-event" style="font-size:2.2rem">${icon}</span> « ${txt} »<br>C'est <b>certain</b>, <b>possible</b> ou <b>impossible</b> ?`,
          say: `${txt} C'est certain, possible ou impossible ?`,
          hint: 'Certain : ça arrive à coup sûr. Possible : peut-être. Impossible : jamais.',
          explain: `C'est <b>${target}</b> : ${WHY[target]}.`,
          viz(el) { mount(el, `<div class="st-event">${icon}</div>${S.pLine()}`); },
          showMe(el) { mount(el, `<div class="st-event">${icon}</div>${S.pLine(target)}`); },
        };
      }

      const keys = M.shuffle(S.COLOR_KEYS);
      const ask = keys[0];
      if (kind === 'bag' || kind === 'bagOr') {
        let marbles, prompt, hl, why;
        const n = M.rnd(lvl === 0 ? 3 : 5, lvl === 0 ? 6 : 10);
        if (kind === 'bagOr') {
          // « rouge ou bleue »
          const [a, b, c] = keys;
          const na = M.rnd(1, 4), nb = M.rnd(1, 4), nc = M.rnd(1, 3);
          if (target === 'certain') marbles = [...Array(na).fill(a), ...Array(nb).fill(b)];
          else if (target === 'possible') marbles = [...Array(na).fill(a), ...Array(nb).fill(b), ...Array(nc).fill(c)];
          else marbles = [...Array(nc + 1).fill(c), ...Array(M.rnd(1, 3)).fill(keys[3])];
          prompt = `Je pige une bille dans ce sac, sans regarder.<br>Piger une bille <b>${COL[a].f}</b> ${dot(a)} <b>ou ${COL[b].f}</b> ${dot(b)}, c'est…`;
          hl = [a, b];
          const k = marbles.filter((m) => m === a || m === b).length;
          why = target === 'certain' ? `Toutes les billes sont ${COL[a].fp} ou ${COL[b].fp} : c'est <b>certain</b>.`
            : target === 'possible' ? `${k} billes sur ${marbles.length} sont ${COL[a].fp} ou ${COL[b].fp}, mais pas toutes : c'est <b>possible</b>.`
              : `Il n'y a aucune bille ${COL[a].f} ni ${COL[b].f} : c'est <b>impossible</b>.`;
        } else {
          if (target === 'certain') marbles = Array(n).fill(ask);
          else if (target === 'possible') {
            const k = M.rnd(1, n - 1);
            marbles = [...Array(k).fill(ask), ...M.range(1, n - k).map(() => M.pick(keys.slice(1, 3)))];
          } else marbles = M.range(1, n).map(() => M.pick(keys.slice(1, lvl === 0 ? 2 : 4)));
          marbles = marbles.slice().sort((x, y) => S.COLOR_KEYS.indexOf(x) - S.COLOR_KEYS.indexOf(y));
          prompt = `Je pige une bille dans ce sac, sans regarder.<br>Piger une bille <b>${COL[ask].f}</b> ${dot(ask)}, c'est…`;
          hl = ask;
          const k = marbles.filter((m) => m === ask).length;
          why = target === 'certain' ? `Toutes les billes sont ${COL[ask].fp} : c'est <b>certain</b>.`
            : target === 'possible' ? `Il y a ${k} ${M.plural(k, 'bille')} ${k > 1 ? COL[ask].fp : COL[ask].f}, mais aussi d'autres couleurs : c'est <b>possible</b>.`
              : `Il n'y a aucune bille ${COL[ask].f} dans le sac : c'est <b>impossible</b>.`;
        }
        const spec = { type: 'bag', marbles };
        return {
          ...base, prompt, say: plain(prompt) + ' certain, possible ou impossible ?',
          hint: 'Regarde bien les couleurs des billes dans le sac.',
          explain: why,
          viz(el) { tryViz(el, spec, '🎒 Le sac de billes. Tu peux essayer de piger !'); },
          showMe(el) {
            tryViz(el, spec, '👀 Les billes qui comptent sont en avant.', hl, target);
          },
        };
      }

      if (kind === 'spinner') {
        const n = M.pick([3, 4, 6]);
        let sectors;
        if (target === 'certain') sectors = Array(n).fill(ask);
        else if (target === 'possible') { sectors = M.range(1, n).map((_, i) => keys[i % 3]); }
        else sectors = M.range(1, n).map((_, i) => keys[1 + (i % 2)]);
        const spec = { type: 'spinner', sectors };
        const k = sectors.filter((s) => s === ask).length;
        const prompt = `Je fais tourner la roulette.<br>La flèche va s'arrêter sur <b>${COL[ask].nom}</b> ${dot(ask)}. C'est…`;
        return {
          ...base, prompt, say: plain(prompt) + ' certain, possible ou impossible ?',
          hint: 'Regarde les couleurs de la roulette.',
          explain: target === 'certain' ? `Toute la roulette est ${COL[ask].f} : c'est <b>certain</b>.`
            : target === 'possible' ? `${k} ${M.plural(k, 'partie')} sur ${n} ${k > 1 ? 'sont' : 'est'} ${k > 1 ? COL[ask].fp : COL[ask].f}, mais pas toute la roulette : c'est <b>possible</b>.`
              : `Il n'y a pas de ${COL[ask].m} sur la roulette : c'est <b>impossible</b>.`,
          viz(el) { tryViz(el, spec, '🎡 La roulette. Tu peux essayer de la faire tourner !'); },
          showMe(el) { tryViz(el, spec, '👀 Regarde la couleur demandée.', ask, target); },
        };
      }

      // dé
      let faces = [1, 2, 3, 4, 5, 6], txt, hlv;
      const special = lvl === 2 && Math.random() < 0.5;
      if (special) {
        const pool = M.shuffle([1, 2, 3, 4, 5, 6]);
        const [a, b] = pool;
        if (target === 'certain') { faces = Array(6).fill(a); txt = `obtenir un <b>${a}</b>`; hlv = [a]; }
        else if (target === 'possible') { faces = [a, a, a, b, b, b].sort(); txt = `obtenir un <b>${a}</b>`; hlv = [a]; }
        else { faces = [a, a, a, b, b, b].sort(); const c = pool[2]; txt = `obtenir un <b>${c}</b>`; hlv = [c]; }
      } else if (target === 'certain') {
        txt = M.pick(['obtenir un nombre <b>plus petit que 7</b>', 'obtenir un nombre <b>de 1 à 6</b>']); hlv = faces;
      } else if (target === 'possible') {
        const v = M.rnd(1, 6);
        const opts = [[`obtenir un <b>${v}</b>`, [v]]];
        if (lvl === 2) opts.push(['obtenir un nombre <b>pair</b>', [2, 4, 6]], ['obtenir un nombre <b>plus grand que 4</b>', [5, 6]]);
        [txt, hlv] = M.pick(opts);
      } else {
        const v = M.pick([0, 7, 8, 9, 10]);
        txt = `obtenir un <b>${v}</b>`; hlv = [];
      }
      const spec = { type: 'die', faces };
      const prompt = `Je lance ${special ? 'ce dé spécial' : 'un dé'}. ${cap(txt)}, c'est…`;
      return {
        ...base, prompt, say: plain(prompt) + ' certain, possible ou impossible ?',
        hint: 'Regarde toutes les faces du dé.',
        explain: target === 'certain' ? `Toutes les faces du dé vont : c'est <b>certain</b>.`
          : target === 'possible' ? `Certaines faces vont, d'autres non : c'est <b>possible</b>.`
            : `Aucune face du dé ne montre ce nombre : c'est <b>impossible</b>.`,
        viz(el) { tryViz(el, spec, `🎲 ${special ? 'Un dé spécial ! Regarde ses 6 faces.' : 'Un dé à 6 faces.'}`); },
        showMe(el) { tryViz(el, spec, '👀 Les faces qui vont sont en jaune.', hlv, target); },
      };
    },
  });

  /* ==================================================================
     6. Expérience de hasard : prédiction et résultats
     ================================================================== */
  const NAMES = ['Léa', 'Samuel', 'Jade', 'Félix', 'Florence', 'Thomas', 'Zoé', 'Noah'];
  /** Textes selon l'appareil. */
  function devText(spec) {
    if (spec.type === 'spinner') return {
      todo: (n) => `Fais tourner la roulette ${n} fois avec le bouton ▶.`,
      count: (k) => `Combien de fois la flèche s'est-elle arrêtée sur <b>${COL[k].nom}</b> ${dot(k)} ?`,
      most: 'Sur quelle couleur la flèche s\'est-elle arrêtée <b>le plus souvent</b> ?',
      least: 'Sur quelle couleur la flèche s\'est-elle arrêtée <b>le moins souvent</b> ?',
      more: (a, b) => `Combien de fois de plus la flèche s'est-elle arrêtée sur <b>${COL[a].nom}</b> ${dot(a)} que sur <b>${COL[b].nom}</b> ${dot(b)} ?`,
      name: (k) => COL[k].nom, one: 'Tourner', verb: 'tours',
    };
    if (spec.type === 'bag') return {
      todo: (n) => `Pige ${n} billes avec le bouton ▶ (on remet chaque bille dans le sac).`,
      count: (k) => `Combien de fois as-tu pigé une bille <b>${COL[k].f}</b> ${dot(k)} ?`,
      most: 'Quelle couleur de bille as-tu pigée <b>le plus souvent</b> ?',
      least: 'Quelle couleur de bille as-tu pigée <b>le moins souvent</b> ?',
      more: (a, b) => `Combien de billes <b>${COL[a].fp}</b> ${dot(a)} de plus que de billes <b>${COL[b].fp}</b> ${dot(b)} as-tu pigées ?`,
      name: (k) => `la bille ${COL[k].f}`, one: 'Piger', verb: 'piges',
    };
    return {
      todo: (n) => `Lance le dé ${n} fois avec le bouton ▶.`,
      count: (k) => `Combien de fois as-tu obtenu <b>${k}</b> ?`,
      most: 'Quel nombre as-tu obtenu <b>le plus souvent</b> ?',
      least: 'Quel nombre as-tu obtenu <b>le moins souvent</b> ?',
      more: (a, b) => `Combien de fois de plus as-tu obtenu <b>${a}</b> que <b>${b}</b> ?`,
      name: (k) => `le ${k}`, one: 'Lancer', verb: 'lancers',
    };
  }
  /**
   * Expérience rejouable : les résultats (outcomes) sont fixés d'avance dans gen().
   * o = { spec, outcomes, nums, auto (showMe), hl }
   */
  S.experiment = function (el, o) {
    const N = o.outcomes.length, T = devText(o.spec);
    const w = mount(el, `<div class="st-exp"><div class="st-devhost"></div>
      <div class="st-exp-side">
        <div class="row" style="justify-content:center;margin-top:0"><button class="btn primary st-one">▶ ${T.one} 1 fois</button><button class="btn blue st-all">⏩ Faire les ${N}</button></div>
        <div class="viz-status st-status"></div><div class="st-res"></div>
      </div></div>`);
    const dev = S.device(M.$('.st-devhost', w), o.spec);
    if (o.devHl != null) dev.render({ hl: o.devHl });
    const counts = {};
    let done = 0, busy = false;
    const draw = (hl) => {
      M.$('.st-status', w).innerHTML = done === N ? `✔️ Expérience terminée : ${N} ${T.verb}.` : `Essai ${done} sur ${N}`;
      M.$('.st-res', w).innerHTML = S.resultsTable(dev.cats, counts, { nums: o.nums, hl });
      M.$$('button', M.$('.st-exp-side', w)).forEach((b) => (b.disabled = done === N));
    };
    async function step(ms) {
      const k = o.outcomes[done];
      await dev.play(k, ms);
      if (!w.isConnected) return false;
      counts[k] = (counts[k] || 0) + 1;
      done++;
      draw();
      return true;
    }
    async function run(all, ms) {
      if (busy || done >= N) return;
      busy = true;
      do { if (!(await step(ms))) return; } while (all && done < N);
      busy = false;
      if (done === N && o.hl != null) draw(o.hl);
    }
    M.$('.st-one', w).onclick = () => run(false, 900);
    M.$('.st-all', w).onclick = () => run(true, 380);
    draw();
    if (o.auto) run(true, 160);
    return w;
  };
  function countOutcomes(outcomes) {
    const c = {};
    outcomes.forEach((k) => (c[k] = (c[k] || 0) + 1));
    return c;
  }
  M.registerSkill({
    id: 'hasard-experience', domain: 'stats', title: 'Expériences de hasard', icon: '🎡',
    desc: 'Faire tourner, piger, lancer… puis lire ses résultats.',
    pda: 'Probabilité 4, 6, 7 — expérimenter le hasard ; distinguer prédiction et résultat ; colliger les résultats',
    learn: 'hasard',
    gen({ lvl }) {
      const N = 10;
      let type = M.pick(lvl === 0 ? ['count', 'count', 'most'] : lvl === 1 ? ['count', 'most', 'least', 'predict', 'vary'] : ['chances', 'chances', 'more', 'predict', 'count']);
      const keys = M.shuffle(S.COLOR_KEYS);
      let spec;
      if (type === 'chances') {
        const pat = M.pick([[4, 1, 1], [3, 2, 1], [5, 2, 1], [3, 1], [5, 1, 2]]);
        const cols = keys.slice(0, pat.length);
        const list = cols.flatMap((k, i) => Array(pat[i]).fill(k));
        spec = Math.random() < 0.5 ? { type: 'spinner', sectors: list } : { type: 'bag', marbles: list };
      } else {
        const r = Math.random();
        const dieOk = lvl > 0 && (type === 'count' || type === 'vary');
        if (dieOk && r < 0.3) spec = { type: 'die' };
        else if (r < 0.65) {
          const nc = lvl === 0 ? 3 : M.pick([3, 4]);
          spec = { type: 'spinner', sectors: keys.slice(0, nc) };
        } else {
          const nc = M.pick([2, 3]);
          const list = keys.slice(0, nc).flatMap((k) => Array(M.rnd(2, 4)).fill(k));
          spec = { type: 'bag', marbles: list };
        }
      }
      const cats = S.catsOf(spec);
      const T = devText(spec);
      // résultats tirés d'avance (rejoués à l'identique par le visuel)
      let outcomes, counts, guard = 0;
      const ok = () => {
        const v = cats.map((c) => counts[c.key] || 0);
        if (type === 'most' || type === 'predict') return uniqueExt(v, 1) >= 0;
        if (type === 'least') return uniqueExt(v, -1) >= 0;
        if (type === 'more') return new Set(v).size > 1;
        return true;
      };
      do { outcomes = M.range(1, N).map(() => S.drawOutcome(spec)); counts = countOutcomes(outcomes); } while (!ok() && guard++ < 200);
      if (!ok()) type = 'count';
      const vals = cats.map((c) => counts[c.key] || 0);
      const nums = lvl === 0;
      const todo = `<span class="st-instr">🧪 ${T.todo(N)}</span>`;
      const choicesCats = cats.map((c) => ({ label: `${c.icon} ${c.label}`, value: String(c.key) }));
      const listRes = cats.map((c) => `${c.icon} ${c.label} : ${counts[c.key] || 0}`).join(', ');
      let q;
      if (type === 'count') {
        const c = M.pick(cats);
        q = { prompt: todo + T.count(c.key), input: 'number', answer: counts[c.key] || 0, hl: c.key,
          hint: nums ? 'Regarde la colonne « Nombre » du tableau.' : 'Compte les traits dans le tableau : un paquet barré vaut 5.',
          explain: `Dans le tableau : ${listRes}. Réponse : <b>${counts[c.key] || 0}</b>.` };
      } else if (type === 'most' || type === 'least') {
        const i = uniqueExt(vals, type === 'most' ? 1 : -1), c = cats[i];
        q = { prompt: todo + T[type], input: 'choice', answer: String(c.key), choices: choicesCats, hl: c.key,
          hint: `Regarde le tableau : quelle rangée a ${type === 'most' ? 'le plus' : 'le moins'} de traits ?`,
          explain: `Résultats : ${listRes}. C'est ${c.icon} <b>${c.label}</b>.` };
      } else if (type === 'more') {
        // deux catégories avec des nombres différents (le plus grand en premier)
        const pairs = [];
        vals.forEach((x, p) => vals.forEach((y, r) => { if (x > y) pairs.push([p, r]); }));
        const [ia, ib] = M.pick(pairs);
        const A = cats[ia], B = cats[ib];
        q = { prompt: todo + T.more(A.key, B.key), input: 'number', answer: vals[ia] - vals[ib], hl: A.key,
          hint: 'Trouve les deux nombres dans le tableau, puis enlève le plus petit du plus grand.',
          explain: `${A.icon} ${A.label} : ${vals[ia]}. ${B.icon} ${B.label} : ${vals[ib]}. ${vals[ia]} − ${vals[ib]} = <b>${vals[ia] - vals[ib]}</b>.` };
      } else if (type === 'predict') {
        const iMax = uniqueExt(vals, 1);
        const pred = Math.random() < 0.5 ? cats[iMax] : M.pick(cats);
        const same = pred.key === cats[iMax].key;
        const who = M.pick(NAMES);
        q = {
          prompt: `Avant l'expérience, ${who} a fait une <b>prédiction</b> : « ${cap(T.name(pred.key))} ${pred.icon} va sortir le plus souvent. »<br>${todo}Le <b>résultat</b> est-il pareil à sa prédiction ?`,
          input: 'choice', answer: same ? 'oui' : 'non', hl: cats[iMax].key,
          choices: [{ label: '👍 Oui, pareil', value: 'oui' }, { label: '👎 Non, différent', value: 'non' }],
          hint: 'La prédiction, c\'est ce qu\'on pense avant. Le résultat, c\'est ce qui est vraiment arrivé : regarde le tableau.',
          explain: `Résultat : ${listRes}. Le plus souvent, c'est ${T.name(cats[iMax].key)} ${cats[iMax].icon}. ${same ? 'C\'est <b>pareil</b> à la prédiction !' : 'C\'est <b>différent</b> de la prédiction. Avec le hasard, une prédiction peut se tromper.'}`,
        };
      } else if (type === 'vary') {
        q = {
          prompt: `${todo}Si tu refais l'expérience ${N} autres fois, auras-tu <b>sûrement</b> les mêmes résultats ?`,
          input: 'choice', answer: 'hasard',
          choices: [{ label: '🔁 Oui, toujours les mêmes', value: 'pareil' }, { label: '🎲 Pas sûr : ça peut changer', value: 'hasard' }],
          hint: 'Avec le hasard, on ne peut pas savoir d\'avance ce qui va sortir.',
          explain: 'C\'est le <b>hasard</b> : à chaque essai, on ne sait pas ce qui va sortir. Une autre fois, les résultats peuvent être différents.',
        };
      } else {
        // chances (exposition) : la couleur qui occupe la plus grande place
        const amt = cats.map((c) => S.countOf(spec, c.key));
        const i = uniqueExt(amt, 1), c = cats[i];
        const tot = sum(amt);
        const where = spec.type === 'spinner' ? `${amt[i]} parties sur ${tot} de la roulette` : `${amt[i]} billes sur ${tot} dans le sac`;
        q = {
          prompt: `Regarde ${spec.type === 'spinner' ? 'la roulette' : 'le sac'}. Quelle couleur a <b>le plus de chances</b> de sortir ?<br><span class="st-instr">🧪 Tu peux faire l'expérience pour vérifier.</span>`,
          input: 'choice', answer: String(c.key), choices: choicesCats, hl: c.key,
          hint: spec.type === 'spinner' ? 'Quelle couleur prend la plus grande place sur la roulette ?' : 'De quelle couleur y a-t-il le plus de billes ?',
          explain: `${c.icon} ${c.label} : ${where}. C'est la couleur qui a le plus de chances de sortir… mais ce n'est pas certain !`,
        };
      }
      return {
        prompt: q.prompt, say: plain(q.prompt), input: q.input, answer: q.answer, choices: q.choices, cols: q.choices && q.choices.length === 2 ? 1 : undefined,
        hint: q.hint, explain: q.explain,
        viz(el) { S.experiment(el, { spec, outcomes, nums }); },
        showMe(el) {
          if (type === 'chances') S.experiment(el, { spec, outcomes, nums: true, devHl: q.hl });
          else S.experiment(el, { spec, outcomes, nums: true, auto: true, hl: q.hl });
        },
      };
    },
  });
})();
