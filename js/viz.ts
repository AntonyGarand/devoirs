/* =====================================================================
   viz.js — visuels réutilisables (approche concret → imagé → abstrait)
   M.viz.counters   : jetons dans des cadres de dix (compter, barrer, remplir)
   M.viz.blocks     : blocs base 10 (dizaines/unités/centaines)
   M.viz.base10Html : rendu statique de blocs base 10
   M.viz.numberLine : droite numérique avec grenouille qui fait des bonds
   M.viz.svg        : petit utilitaire pour fabriquer du SVG
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const V = (M.viz = {});

  /* ------------------------------------------------------------------
     Jetons dans des cadres de dix
     opts: { a, b, op:'add'|'sub', unknown:'r'|'a'|'b', emoji? }
     ou opts: { cells:[{kind:'A'|'B'|'E', crossed?}], mode:'count'|'cross'|'fill'|'none', hint? }
     Retourne { showMe() }
     ------------------------------------------------------------------ */
  V.counters = function (el, opts) {
    let cells, mode;
    const r = opts.cells ? 0 : opts.op === 'add' ? opts.a + opts.b : opts.a - opts.b;
    function build() {
      const c = [];
      const add = (kind, n, extra = {}) => {
        for (let i = 0; i < n; i++) c.push({ kind, orig: kind, crossed: false, label: null, ...extra });
      };
      if (opts.cells) {
        opts.cells.forEach((x) => c.push({ orig: x.kind, crossed: false, label: null, ...x }));
        mode = opts.mode || 'count';
      } else if (opts.op === 'add') {
        if (opts.unknown === 'b') {
          add('A', opts.a);
          add('E', opts.b, { fill: 'B' });
          mode = 'fill';
        } else if (opts.unknown === 'a') {
          add('E', opts.a, { fill: 'A' });
          add('B', opts.b);
          mode = 'fill';
        } else {
          add('A', opts.a);
          add('B', opts.b);
          mode = 'count';
        }
      } else {
        if (opts.unknown === 'a') {
          add('A', r);
          add('A', opts.b, { crossed: true });
          mode = 'count';
        } else {
          add('A', opts.a);
          mode = 'cross';
        }
      }
      cells = c;
    }
    const it = opts.emoji ? 'objet' : 'jeton';
    function hint() {
      if (opts.hint) return opts.hint;
      if (mode === 'count')
        return opts.op === 'sub' ? `Compte tous les ${it}s, même ceux qui sont barrés.` : `Touche chaque ${it} pour le compter.`;
      if (mode === 'fill') return 'Touche les cases vides pour les remplir. Combien en ajoutes-tu ?';
      if (mode === 'none') return '';
      if (opts.unknown === 'b') return `Barre des ${it}s jusqu'à ce qu'il en reste ${r}. Combien en as-tu barré ?`;
      return `Touche ${opts.b} ${it}s pour les barrer. Combien en reste-t-il ?`;
    }
    function status() {
      if (mode === 'count') {
        const n = cells.filter((x) => x.label).length;
        return n ? `Tu as compté : ${n}` : '';
      }
      if (mode === 'fill') {
        const f = cells.filter((x) => x.orig === 'E' && x.kind !== 'E').length,
          tot = cells.filter((x) => x.kind !== 'E').length;
        return `Ajoutés : ${f} · Total : ${tot}`;
      }
      if (mode === 'none') return '';
      const x = cells.filter((o) => o.crossed).length;
      return `Barrés : ${x} · Il reste : ${cells.length - x}`;
    }
    let firstRender = true;
    function render(flash) {
      const frames = Math.max(1, Math.ceil(cells.length / 10));
      let h = `<div class="viz-hint">${hint()}</div><div class="frames${firstRender ? ' enter' : ''}">`;
      firstRender = false;
      for (let f = 0; f < frames; f++) {
        h += '<div class="frame">';
        for (let i = 0; i < 10; i++) {
          const idx = f * 10 + i,
            o = cells[idx];
          if (!o) {
            h += '<div class="cell void"></div>';
            continue;
          }
          const inner = o.kind === 'E' ? '' : opts.emoji ? `<span class="e">${opts.emoji}</span>` : '<span class="dot"></span>';
          const lbl = o.label ? `<span class="lbl ${o.lcls || ''}">${o.label}</span>` : '';
          h += `<button class="cell k${o.kind} ${opts.emoji ? 'emo' : ''} ${o.crossed ? 'x' : ''} ${idx === flash ? 'flash' : ''}" data-i="${idx}" style="--i:${idx}">${inner}${lbl}</button>`;
        }
        h += '</div>';
      }
      h += `</div><div class="viz-status">${status()}</div>`;
      el.innerHTML = h;
    }
    let tok = 0;
    el.onclick = (e) => {
      const b = e.target.closest('.cell');
      if (!b || b.classList.contains('void') || mode === 'none') return;
      tok++;
      const i = +b.dataset.i,
        o = cells[i];
      if (mode === 'count') {
        if (o.label) {
          const L = o.label;
          o.label = null;
          cells.forEach((x) => {
            if (x.label > L) x.label--;
          });
        } else {
          o.label = cells.filter((x) => x.label).length + 1;
          o.lcls = '';
        }
      } else if (mode === 'fill') {
        if (o.orig !== 'E') return;
        o.kind = o.kind === 'E' ? o.fill : 'E';
      } else o.crossed = !o.crossed;
      M.sfx.tap();
      render(i);
    };
    build();
    render();
    return {
      async showMe() {
        const t = ++tok;
        build();
        render();
        const step = async (o, i, lab, cls = '') => {
          await M.sleep(260);
          if (t !== tok || !el.isConnected) throw 0;
          o.label = lab;
          o.lcls = cls;
          M.sfx.tap();
          render(i);
        };
        try {
          if (mode === 'count' || mode === 'none') {
            let n = 0;
            for (let i = 0; i < cells.length; i++) await step(cells[i], i, ++n);
          } else if (mode === 'fill') {
            let n = 0;
            for (let i = 0; i < cells.length; i++)
              if (cells[i].orig === 'E') {
                cells[i].kind = cells[i].fill;
                await step(cells[i], i, ++n);
              }
          } else {
            let n = 0;
            for (let i = cells.length - 1; i >= cells.length - opts.b; i--) {
              cells[i].crossed = true;
              await step(cells[i], i, ++n, 'r');
            }
            if (opts.unknown !== 'b') {
              let m = 0;
              for (let i = 0; i < cells.length - opts.b; i++) await step(cells[i], i, ++m, 'g');
            }
          }
        } catch (e) {}
      },
    };
  };

  /* ------------------------------------------------------------------
     Blocs base 10 (statique)
     ------------------------------------------------------------------ */
  V.base10Html = function (value, color = 'A', opts = {}) {
    const c = Math.floor(value / 100),
      d = Math.floor((value % 100) / 10),
      u = value % 10;
    const flat = '<span class="flat">' + '<i></i>'.repeat(100) + '</span>';
    const rod = '<span class="rod">' + '<i></i>'.repeat(10) + '</span>';
    return `<div class="b10 c${color} ${opts.small ? 'small' : ''}">
      ${c ? `<div class="b10-h">${flat.repeat(c)}</div>` : ''}
      ${d ? `<div class="b10-t">${rod.repeat(d)}</div>` : ''}
      ${u ? `<div class="b10-u">${'<span class="cube"></span>'.repeat(u)}</div>` : ''}
    </div>`;
  };

  /* ------------------------------------------------------------------
     Blocs base 10 interactifs pour + et −
     opts: { a, b, op:'add'|'sub', unknown:'r'|'a'|'b' }
     ------------------------------------------------------------------ */
  V.blocks = function (el, opts) {
    const r = opts.op === 'add' ? opts.a + opts.b : opts.a - opts.b;
    const vals = { a: opts.a, b: opts.b, r };
    const mk = (v, color) => {
      const it = [];
      for (let i = 0; i < Math.floor(v / 10); i++) it.push({ t: 10, color, crossed: false, hl: false });
      for (let i = 0; i < v % 10; i++) it.push({ t: 1, color, crossed: false, hl: false });
      return it;
    };
    let B;
    function build() {
      const G = (k, color) => ({ key: k, color, items: mk(vals[k], color), hidden: opts.unknown === k });
      if (opts.op === 'sub' && opts.unknown === 'r') {
        B = { mode: 'sub', groups: [G('a', 'A')], hint: `Barre ${opts.b}. Pas assez de cubes ? Casse une dizaine en 10 cubes !` };
      } else {
        const op = opts.op === 'add' ? '+' : '−';
        B = {
          mode: 'show',
          groups: [G('a', 'A'), { op }, G('b', 'B'), { op: '=' }, G('r', 'C')],
          hint: 'Touche les barres et les cubes pour les compter. Une barre = 10, un cube = 1.',
        };
      }
    }
    const desc = (g) => {
      const live = g.items.filter((o) => !o.crossed),
        d = live.filter((o) => o.t === 10).length,
        u = live.filter((o) => o.t === 1).length;
      return `${d} dizaine${d > 1 ? 's' : ''} et ${u} unité${u > 1 ? 's' : ''} = <b>${d * 10 + u}</b>`;
    };
    function render(reveal) {
      let h = `<div class="viz-hint">${B.hint}</div><div class="bgroups">`;
      B.groups.forEach((g, gi) => {
        if (g.op) {
          h += `<div class="bop">${g.op}</div>`;
          return;
        }
        if (g.hidden) {
          h += '<div class="bgroup hidden"><div class="qbig">?</div></div>';
          return;
        }
        const idx = g.items.map((it, ii) => ({ it, ii }));
        const tens = idx
          .filter((o) => o.it.t === 10)
          .map(
            (o) =>
              `<button class="rod ${o.it.crossed ? 'x' : ''} ${o.it.hl ? 'hl' : ''}" data-g="${gi}" data-i="${o.ii}">${'<i></i>'.repeat(10)}</button>`,
          )
          .join('');
        const ones = idx
          .filter((o) => o.it.t === 1)
          .map(
            (o) =>
              `<button class="cube ${o.it.crossed ? 'x' : ''} ${o.it.hl ? 'hl' : ''} ${o.it.broken ? 'broken' : ''}" data-g="${gi}" data-i="${o.ii}"></button>`,
          )
          .join('');
        h += `<div class="bgroup c${g.color} ${reveal === g.key ? 'reveal' : ''}"><div class="bitems"><div class="tens">${tens}</div><div class="ones">${ones}</div></div><div class="blabel">${desc(g)}</div></div>`;
      });
      h += '</div>';
      if (B.mode === 'sub') h += '<div class="row"><button class="btn break-ten">🔨 Casser une dizaine</button></div>';
      let st = '';
      if (B.mode === 'sub') {
        const items = B.groups[0].items,
          x = items.filter((o) => o.crossed).reduce((s, o) => s + o.t, 0),
          tot = items.reduce((s, o) => s + o.t, 0);
        st = `Barrés : ${x} · Il reste : ${tot - x}`;
      } else {
        const n = B.groups
          .filter((g) => g.items && !g.hidden)
          .flatMap((g) => g.items)
          .filter((o) => o.hl)
          .reduce((s, o) => s + o.t, 0);
        st = n ? `Tu as compté : ${n}` : '';
      }
      h += `<div class="viz-status">${st}</div>`;
      el.innerHTML = h;
    }
    function breakTen() {
      const items = B.groups[0].items;
      let k = -1;
      items.forEach((o, i) => {
        if (o.t === 10 && !o.crossed) k = i;
      });
      if (k < 0) return;
      const color = items[k].color;
      items.splice(k, 1);
      for (let i = 0; i < 10; i++) items.push({ t: 1, color, crossed: false, hl: false, broken: true });
      M.sfx.tone([200, 160], 0.08, 'square', 0.08);
      render();
    }
    let tok = 0;
    el.onclick = (e) => {
      if (e.target.closest('.break-ten')) {
        tok++;
        return breakTen();
      }
      const b = e.target.closest('.rod,.cube');
      if (!b) return;
      tok++;
      const it = B.groups[+b.dataset.g].items[+b.dataset.i];
      if (B.mode === 'sub') it.crossed = !it.crossed;
      else it.hl = !it.hl;
      M.sfx.tap();
      render();
    };
    build();
    render();
    return {
      async showMe() {
        const t = ++tok;
        if (B.mode === 'show') {
          const g = B.groups.find((g) => g.hidden);
          B.groups.forEach((g) => g.items && g.items.forEach((o) => (o.hl = false)));
          if (g) {
            g.hidden = false;
            M.sfx.hop();
            render(g.key);
          }
          return;
        }
        build();
        render();
        const items = () => B.groups[0].items,
          ok = () => t === tok && el.isConnected;
        await M.sleep(400);
        if (!ok()) return;
        const needOnes = opts.b % 10;
        if (items().filter((o) => o.t === 1 && !o.crossed).length < needOnes) {
          breakTen();
          await M.sleep(700);
          if (!ok()) return;
        }
        let n = needOnes;
        for (let i = items().length - 1; i >= 0 && n > 0; i--) {
          const o = items()[i];
          if (o.t === 1 && !o.crossed) {
            o.crossed = true;
            n--;
            M.sfx.tap();
            render();
            await M.sleep(280);
            if (!ok()) return;
          }
        }
        n = Math.floor(opts.b / 10);
        for (let i = items().length - 1; i >= 0 && n > 0; i--) {
          const o = items()[i];
          if (o.t === 10 && !o.crossed) {
            o.crossed = true;
            n--;
            M.sfx.tap();
            render();
            await M.sleep(380);
            if (!ok()) return;
          }
        }
      },
    };
  };

  /* ------------------------------------------------------------------
     Droite numérique
     opts: {
       lo, hi,            // bornes
       start?,            // position de départ de la grenouille (null = pas de grenouille)
       end?,              // arrivée utilisée par showMe()
       step?: 1,          // pas des bonds de showMe (ex. 10) ; auto si absent
       labelEvery?,       // étiquettes tous les n (auto)
       hideLabels?: [v],  // valeurs dont l'étiquette est cachée
       arrowAt?: v,       // flèche « ? » au-dessus d'une valeur
       marks?: {v: 'html'},
       interactive?: true,
       buttons?: [-1, 1], // boutons de bonds
       hint?: 'texte'
     }
     ------------------------------------------------------------------ */
  V.numberLine = function (el, opts) {
    const o = Object.assign({ interactive: true }, opts);
    const X0 = 40,
      X1 = 960,
      Y = 170;
    const span = o.hi - o.lo;
    const uw = (X1 - X0) / span;
    const x = (v) => X0 + ((v - o.lo) * (X1 - X0)) / span;
    const labelEvery = o.labelEvery || (span <= 20 ? 1 : span <= 50 ? 5 : span <= 200 ? 10 : 100);
    const tickEvery = o.tickEvery || (span <= 100 ? 1 : span <= 200 ? 2 : 10);
    const hitEvery = span <= 200 ? 1 : 10;
    const hasFrog = o.start != null;
    let L = { pos: o.start, hops: [] };
    let queue = Promise.resolve();
    let tok = 0;
    const geom = (h) => {
      const x1 = x(h.from),
        x2 = x(h.to),
        dx = Math.abs(x2 - x1);
      return { x1, x2, mx: (x1 + x2) / 2, p: Math.min(120, 26 + dx * 0.32) };
    };
    const arc = (h, isNew) => {
      const { x1, x2, mx, p } = geom(h),
        d = h.to - h.from,
        cls = d > 0 ? 'f' : 'b';
      const lab =
        Math.abs(x2 - x1) >= 26 ? `<text class="alabel ${cls}" x="${mx}" y="${Y - p - 8}">${d > 0 ? '+' : '−'}${Math.abs(d)}</text>` : '';
      return `<path class="arc ${cls} ${isNew ? 'new' : ''}" pathLength="1" d="M${x1} ${Y} Q${mx} ${Y - 2 * p} ${x2} ${Y}"/>${lab}`;
    };
    const statusTxt = () => {
      if (!hasFrog) return '';
      const d = L.pos - o.start;
      let s = `🐸 est sur <b>${L.pos}</b>`;
      if (L.hops.length)
        s += ` · ${L.hops.length} bond${L.hops.length > 1 ? 's' : ''} · en tout : <b>${d >= 0 ? '+' : '−'}${Math.abs(d)}</b>`;
      return s;
    };
    function render() {
      let s = (o.hint ? `<div class="viz-hint">${o.hint}</div>` : '') + '<svg class="nline" viewBox="0 0 1000 225">';
      s += `<line class="axis" x1="${X0 - 18}" y1="${Y}" x2="${X1 + 18}" y2="${Y}"/>`;
      if (hasFrog) s += `<circle class="start" cx="${x(o.start)}" cy="${Y}" r="9"/>`;
      for (let v = o.lo; v <= o.hi; v++) {
        if ((v - o.lo) % tickEvery !== 0 && v % labelEvery !== 0) continue;
        const xx = x(v),
          major = v % labelEvery === 0,
          mid = v % 5 === 0;
        const len = major ? 14 : mid ? 10 : 6;
        s += `<line class="tick" x1="${xx}" y1="${Y - len}" x2="${xx}" y2="${Y + len}"/>`;
        const hidden = o.hideLabels && o.hideLabels.includes(v);
        if (major && !hidden) s += `<text class="tl" x="${xx}" y="${Y + 40}">${v}</text>`;
        else if (hasFrog && v === o.start && !hidden) s += `<text class="tl small" x="${xx}" y="${Y + 38}">${v}</text>`;
      }
      if (o.marks)
        Object.entries(o.marks).forEach(([v, html]) => {
          s += `<text class="tl mark" x="${x(+v)}" y="${Y + 40}">${html}</text>`;
        });
      if (o.arrowAt != null)
        s += `<g class="qarrow"><text x="${x(o.arrowAt)}" y="${Y - 50}" text-anchor="middle" class="qmark">?</text><path d="M${x(o.arrowAt)} ${Y - 40} L${x(o.arrowAt)} ${Y - 14}" class="qline"/><path d="M${x(o.arrowAt) - 8} ${Y - 24} L${x(o.arrowAt)} ${Y - 12} L${x(o.arrowAt) + 8} ${Y - 24}" class="qline"/></g>`;
      s += `<g class="arcs">${L.hops.map((h) => arc(h)).join('')}</g>`;
      if (hasFrog) s += `<text class="frog" x="${x(L.pos)}" y="${Y - 6}" text-anchor="middle" font-size="40">🐸</text>`;
      if (o.interactive && hasFrog)
        for (let v = o.lo; v <= o.hi; v += hitEvery)
          s += `<rect class="hit" data-v="${v}" x="${x(v) - (uw * hitEvery) / 2}" y="20" width="${uw * hitEvery}" height="205"/>`;
      s += '</svg>';
      if (o.interactive && hasFrog) {
        const jumps = o.buttons || (span <= 20 ? [-1, 1] : [-10, -1, 1, 10]);
        s += `<div class="row">${jumps.map((j) => `<button class="btn" data-j="${j}">${j > 0 ? '+' : '−'}${Math.abs(j)} 🐸</button>`).join('')}</div>`;
      }
      s += `<div class="viz-status">${statusTxt()}</div>`;
      el.innerHTML = s;
    }
    function hop(to) {
      if (!el.isConnected || to === L.pos || to < o.lo || to > o.hi) return Promise.resolve();
      const h = { from: L.pos, to };
      L.hops.push(h);
      L.pos = to;
      M.$('.arcs', el).insertAdjacentHTML('beforeend', arc(h, true));
      const { x1, x2, mx, p } = geom(h),
        frog = M.$('.frog', el),
        cy = Y - 2 * p;
      const dur = Math.min(720, 340 + Math.abs(x2 - x1) * 0.6);
      M.sfx.hop();
      return new Promise((res) => {
        const t0 = performance.now();
        const step = (now) => {
          const raw = Math.min(1, (now - t0) / dur);
          const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2,
            m = 1 - t; // ease-in-out
          if (!frog.isConnected) return res();
          frog.setAttribute('x', m * m * x1 + 2 * m * t * mx + t * t * x2);
          frog.setAttribute('y', m * m * Y + 2 * m * t * cy + t * t * Y - 6);
          if (raw < 1) requestAnimationFrame(step);
          else {
            const st = M.$('.viz-status', el);
            if (st) st.innerHTML = statusTxt();
            const svg = frog.ownerSVGElement;
            if (svg) {
              svg.insertAdjacentHTML('beforeend', `<ellipse class="nl-ripple" cx="${x2}" cy="${Y}" rx="22" ry="7"/>`);
              const rp = svg.lastElementChild;
              setTimeout(() => rp.remove(), 650);
            }
            res();
          }
        };
        requestAnimationFrame(step);
      });
    }
    const queueHop = (to) => (queue = queue.then(() => hop(to)));
    el.onclick = (e) => {
      const r = e.target.closest('.hit');
      if (r) {
        tok++;
        queueHop(+r.dataset.v);
        return;
      }
      const j = e.target.closest('[data-j]');
      if (j) {
        tok++;
        queue = queue.then(() => hop(L.pos + +j.dataset.j));
      }
    };
    render();
    return {
      hop: queueHop,
      reset() {
        L = { pos: o.start, hops: [] };
        queue = Promise.resolve();
        render();
      },
      async showMe(end = o.end, stepSize = o.step) {
        if (!hasFrog || end == null) return;
        const t = ++tok;
        L = { pos: o.start, hops: [] };
        queue = Promise.resolve();
        render();
        const d = end - o.start,
          sg = Math.sign(d),
          steps = [];
        const big = stepSize || (span <= 20 ? 1 : 10);
        for (let i = 0; i < Math.floor(Math.abs(d) / big); i++) steps.push(big * sg);
        for (let i = 0; i < Math.abs(d) % big; i++) steps.push(sg);
        await M.sleep(300);
        for (const st of steps) {
          if (t !== tok || !el.isConnected) return;
          await hop(L.pos + st);
          await M.sleep(110);
        }
      },
    };
  };

  /** Bornes « jolies » pour une droite contenant les valeurs données. */
  V.lineRange = function (values, small = 20) {
    const mn = Math.min(...values),
      mx = Math.max(...values);
    if (mx <= small) return { lo: 0, hi: mx > 10 ? 20 : 10 };
    let lo = Math.floor(mn / 10) * 10,
      hi = Math.ceil(mx / 10) * 10;
    if (hi === lo) hi += 10;
    if (hi - lo < 20) {
      hi = lo + 20;
    }
    return { lo, hi };
  };

  /** Petit utilitaire SVG : V.svg(w, h, inner, cls) */
  V.svg = (w, h, inner, cls = '') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
})();
