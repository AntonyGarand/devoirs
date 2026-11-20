/* =====================================================================
   ui-extra.js — composants d'interface supplémentaires (demandés par les HLD)
     M.ui.slider(el, {label, stops|min/max/step, value, onChange, speak?})  → {get, set}
     M.ui.cycle({stages:[{emoji|art, label, say?}], hide?:[i], hot?:true})  → html (zones data-hot="c<i>")
     M.ui.wordParts(word, parts, {mode:'syllabes'|'sons', say?:[str], colors?})   → html (toucher = lire)
     M.ui.tagged([{w, tag}], {arrows?:[[from,to]]})                          → html (classes de mots)
     M.ui.gloss(word, fr, {lang})                                             → html (mot + 🔊 + sens au 2e toucher)
     M.ui.feelings(el, {onPick?})                                             → sélecteur d'émotions (rien n'est enregistré)
     M.ui.compare({left:{title, items}, right:{title, items}})                → html (avant | maintenant, ici | ailleurs)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const ui = M.ui;

  ui.slider = function (
    el,
    { label = '', stops, min = 0, max = 10, step = 1, value, onChange = () => {}, speak = false, format = (v) => v },
  ) {
    const discrete = Array.isArray(stops);
    let v = value ?? (discrete ? stops[0].value : min);
    const idx = () =>
      discrete
        ? Math.max(
            0,
            stops.findIndex((s) => s.value === v),
          )
        : v;
    el.innerHTML = `<div class="slider">${label ? `<b class="sl-label">${label}</b>` : ''}
      <input type="range" class="sl-range" min="${discrete ? 0 : min}" max="${discrete ? stops.length - 1 : max}" step="${discrete ? 1 : step}" value="${idx()}">
      ${discrete ? `<div class="sl-stops">${stops.map((s, i) => `<button class="sl-stop" data-i="${i}" title="${M.esc(s.label || '')}"><span>${s.icon || ''}</span><small>${s.label || ''}</small></button>`).join('')}</div>` : '<div class="sl-val"></div>'}</div>`;
    const r = M.$('.sl-range', el);
    const text = () => (discrete ? stops[idx()].label || '' : String(format(v)));
    const sync = (silent) => {
      r.value = idx();
      r.setAttribute('aria-valuetext', text());
      if (discrete) M.$$('.sl-stop', el).forEach((b) => b.classList.toggle('on', +b.dataset.i === idx()));
      else M.$('.sl-val', el).textContent = text();
      if (!silent) {
        onChange(v);
        if (speak) M.say(text());
      }
    };
    const set = (nv, silent) => {
      v = discrete ? nv : Math.max(min, Math.min(max, nv));
      sync(silent);
    };
    r.oninput = () => set(discrete ? stops[+r.value].value : +r.value);
    if (discrete)
      M.$('.sl-stops', el).onclick = (e) => {
        const b = e.target.closest('.sl-stop');
        if (b) {
          M.sfx.tap();
          set(stops[+b.dataset.i].value);
        }
      };
    sync(true);
    return { get: () => v, set };
  };

  /** Cycle en cercle (saisons, vie d'une plante…). Les étapes cachées affichent « ? ». */
  ui.cycle = function ({ stages, hide = [], size = 320 }) {
    const n = stages.length,
      c = size / 2,
      R = size / 2 - 52;
    const pos = (i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [c + R * Math.cos(a), c + R * Math.sin(a)];
    };
    let s = `<svg class="cycle" viewBox="0 0 ${size} ${size}" role="img" aria-label="Cycle : ${M.esc(stages.map((x) => x.label).join(', '))}">`;
    s +=
      '<defs><marker id="cyc-arr" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7a7f99"/></marker></defs>';
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pos(i),
        [x2, y2] = pos((i + 1) % n);
      const mx = (x1 + x2) / 2 + (c - (x1 + x2) / 2) * -0.25,
        my = (y1 + y2) / 2 + (c - (y1 + y2) / 2) * -0.25;
      const sh = (a, b, t) => a + (b - a) * t;
      s += `<path d="M${sh(x1, mx, 0.45)} ${sh(y1, my, 0.45)} Q${mx} ${my} ${sh(x2, mx, 0.45)} ${sh(y2, my, 0.45)}" fill="none" stroke="#7a7f99" stroke-width="3" marker-end="url(#cyc-arr)"/>`;
    }
    stages.forEach((st, i) => {
      const [x, y] = pos(i),
        hidden = hide.includes(i);
      s += `<g class="cyc-st ${hidden ? 'hidden' : ''}" data-hot="c${i}"><circle cx="${x}" cy="${y}" r="40" fill="${hidden ? '#fff8e6' : '#fff'}" stroke="${hidden ? '#e9b949' : '#e7e1d3'}" stroke-width="4" ${hidden ? 'stroke-dasharray="6 5"' : ''}/>
        <text x="${x}" y="${y + 12}" text-anchor="middle" font-size="34">${hidden ? '?' : st.emoji || ''}</text>
        ${hidden ? '' : `<text x="${x}" y="${y + 58}" text-anchor="middle" class="cyc-lbl">${M.esc(st.label)}</text>`}</g>`;
    });
    return s + '</svg>';
  };

  /** Mot découpé en syllabes ou en sons; chaque partie se lit au toucher. */
  ui.wordParts = function (
    word,
    parts,
    { mode = 'syllabes', say = null, colors = ['#ef476f', '#118ab2', '#06a77d', '#f78c40', '#9b5de5'] } = {},
  ) {
    return `<span class="wparts ${mode}" aria-label="${M.esc(word)}">${parts.map((p, i) => `<button class="wp" data-say="${M.esc(say ? say[i] : p)}" style="--wp:${colors[i % colors.length]}">${M.esc(p)}</button>`).join('')}<button class="btn icon wp-all" data-say="${M.esc(word)}" title="Écouter le mot">🔊</button></span>`;
  };

  /** Phrase annotée : chaque mot avec sa classe (nom, det, adj, verbe, pron…). */
  const TAGS = { nom: 'nom', det: 'déterminant', adj: 'adjectif', verbe: 'verbe', pron: 'pronom', autre: '' };
  ui.tagged = function (tokens, { arrows = [] } = {}) {
    return (
      `<div class="tagged">${tokens.map((t, i) => `<span class="tg tg-${t.tag || 'autre'}" data-i="${i}"><b>${M.esc(t.w)}</b><small>${t.tag ? TAGS[t.tag] || t.tag : '&nbsp;'}</small></span>`).join('')}</div>` +
      (arrows.length
        ? `<div class="tg-arrows">${arrows.map(([a, b]) => `<span class="chip">${M.esc(tokens[a].w)} ➜ ${M.esc(tokens[b].w)}</span>`).join(' ')}</div>`
        : '')
    );
  };

  /** Mot avec 🔊; second toucher : son sens en français. */
  ui.gloss = (word, fr, { lang = 'en-CA' } = {}) =>
    `<button class="gloss" data-say="${M.esc(word)}" data-lang="${lang}" data-fr="${M.esc(fr)}" onclick="this.classList.toggle('open')">${M.esc(word)} 🔊<span class="gloss-fr">${M.esc(fr)}</span></button>`;

  ui.FEELINGS = [
    { emoji: '😊', label: 'content' },
    { emoji: '😢', label: 'triste' },
    { emoji: '😠', label: 'fâché' },
    { emoji: '😨', label: 'effrayé' },
    { emoji: '😮', label: 'surpris' },
    { emoji: '😴', label: 'fatigué' },
    { emoji: '😳', label: 'gêné' },
    { emoji: '🤩', label: 'fier' },
  ];
  ui.feelings = function (el, { onPick = () => {} } = {}) {
    el.innerHTML = `<div class="feelings">${ui.FEELINGS.map((f, i) => `<button class="feel" data-i="${i}"><span>${f.emoji}</span><small>${f.label}</small></button>`).join('')}</div>`;
    el.onclick = (e) => {
      const b = e.target.closest('.feel');
      if (!b) return;
      const f = ui.FEELINGS[+b.dataset.i];
      M.$$('.feel', el).forEach((x) => x.classList.toggle('on', x === b));
      M.say(f.label);
      onPick(f);
    };
  };

  ui.compare = ({ left, right }) =>
    `<div class="compare">${[left, right].map((c) => `<div class="cmp-col"><h3>${c.title}</h3>${(c.items || []).map((it) => `<div class="cmp-item">${typeof it === 'string' ? it : `<span class="cmp-emoji">${it.emoji || ''}</span>${it.label || ''}`}</div>`).join('')}</div>`).join('<div class="cmp-vs">↔</div>')}</div>`;
})();
