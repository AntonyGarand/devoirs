/* =====================================================================
   skills/nombres.js — Les nombres (PFEQ Arithmétique : sens et écriture
   des nombres naturels < 1000, et fractions)
   Expose aussi M.nb : petits visuels réutilisés par learn/nombres.js
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const NB = (M.nb = M.nb || {});
  const R = M.rnd,
    P = M.pick;
  const pl = M.plural;

  /* ------------------------------------------------------------------
     CSS propre au domaine (préfixe nb-)
     ------------------------------------------------------------------ */
  try {
    M.css(`
.nb-dc{color:var(--A)} .nb-dd{color:var(--B)} .nb-du{color:var(--C)}
.nb-big{font-size:2.2rem;font-weight:900}
.nb-words{font-size:1.7rem;font-weight:900;color:var(--B);margin:8px 0;text-align:center}
.nb-tab{border-collapse:separate;border-spacing:5px;margin:6px auto;font-weight:900}
.nb-tab th{font-size:.8rem;padding:4px 8px;border-radius:10px;color:#fff;font-weight:800}
.nb-tab th.c{background:var(--A)} .nb-tab th.d{background:var(--B)} .nb-tab th.u{background:var(--C)}
.nb-tab th.lab{background:none}
.nb-tab td{font-size:1.9rem;min-width:58px;text-align:center;background:#fff;border:3px solid var(--line);border-radius:12px;padding:0 8px;transition:background .25s,border-color .25s}
.nb-tab td.c{color:var(--A)} .nb-tab td.d{color:var(--B)} .nb-tab td.u{color:var(--C)}
.nb-tab td.q{color:#c7c2b4}
.nb-tab td.lab{font-size:1.05rem;color:var(--ink);border:none;background:none;min-width:0;text-align:right;white-space:nowrap}
.nb-tab td.hl{background:#fff3c4;border-color:#e9b949}
.nb-tab td.ok{background:var(--Cc);border-color:var(--C)}
.nb-tab td.no{background:#ffe5e5;border-color:var(--red)}
.nb-tab td.same{background:#f1efe8}
.q-prompt .eq.nb-seq{font-size:2.3rem;gap:4px 10px}
.q-prompt .eq.nb-seq .op{margin-left:-8px}
@media (max-width:860px){.q-prompt .eq.nb-seq{font-size:1.7rem}}
.nb-qbox{display:inline-block;min-width:1.4em;text-align:center;border:4px dashed #c7c2b4;border-radius:14px;color:#c7c2b4}
.nb-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;max-width:560px;margin:0 auto}
.nb-cell{aspect-ratio:1/1;min-width:0;padding:0;border:2px solid var(--line);border-radius:8px;background:#fff;font-weight:800;font-size:clamp(10px,2.3vw,17px);display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s}
.nb-cell.k1{background:var(--yel);border-color:#e9b949}
.nb-cell.k2{background:var(--Bb);border-color:var(--B)}
.nb-cell.k3{background:var(--Aa);border-color:var(--A)}
.nb-cell.k4{background:var(--Cc);border-color:var(--C)}
.nb-cell.k5{background:#efe4fb;border-color:var(--pur)}
.nb-cell.ring{box-shadow:0 0 0 3px var(--ink) inset}
.nb-cell.hop{animation:pop .4s}
.nb-coll{display:flex;flex-direction:column;gap:12px}
.nb-crow{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end}
.nb-it{position:relative;border:3px solid transparent;background:none;padding:4px;border-radius:12px;line-height:1}
.nb-it.on{border-color:#e9b949;background:#fff3c4}
.nb-it.new{animation:pop .5s}
.nb-lbl{position:absolute;top:-11px;left:-8px;background:var(--ink);color:#fff;font-size:12px;font-weight:800;border-radius:10px;padding:2px 6px;z-index:1;line-height:1.1}
.nb-pack{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;font-size:14px;background:#fff;border:3px dashed #c9a46a;border-radius:12px;padding:4px}
.nb-pack i{font-style:normal}
.nb-one{font-size:26px;display:block}
.nb-blk{display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.b10.nb-blk{flex-direction:column;align-items:flex-start}
.nb-brow{display:flex;flex-wrap:wrap;gap:5px;align-items:flex-end}
.nb-sb{border:3px solid transparent;border-radius:8px;background:none;padding:2px;line-height:0;position:relative}
.nb-sb.hl{border-color:#e9b949;background:#fff3c4}
.nb-sb.new{animation:pop .5s}
.nb-wrap .b10-t,.nb-wrap .b10-h{flex-wrap:wrap}
.nb-ptab{border-collapse:separate;border-spacing:6px;margin:0 auto}
.nb-ptab th{font-size:.85rem;padding:4px 8px;border-radius:10px;color:#fff}
.nb-ptab th.c{background:var(--A)} .nb-ptab th.d{background:var(--B)} .nb-ptab th.u{background:var(--C)}
.nb-ptab td{vertical-align:bottom;text-align:center;background:#fff;border:3px solid var(--line);border-radius:12px;padding:6px;min-width:80px;cursor:pointer}
.nb-ptab td.dig{font-size:2rem;font-weight:900;vertical-align:middle}
.nb-ptab td.hl{background:#fff3c4;border-color:#e9b949}
.nb-ptab .b10{justify-content:center}
.nb-cmp{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px}
.nb-cmp>div{flex:1;min-width:130px;background:#fff;border:3px solid var(--line);border-radius:16px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:6px}
.nb-cmp b{font-size:1.4rem}
.nb-croc{font-size:1.1rem;font-weight:800;text-align:center;margin-top:6px}
.nb-chs{display:flex;flex-direction:column;align-items:center;line-height:1.1}
.nb-chs b{font-size:2.2rem}
.nb-chs small{font-size:.8rem;color:var(--muted)}
.nb-dots{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:470px;margin:6px auto}
.nb-dot{width:40px;height:40px;border-radius:50%;border:4px solid transparent;background:var(--A);padding:0;color:#fff;font-weight:900;font-size:14px;box-shadow:inset -4px -4px 0 rgba(0,0,0,.15);transition:transform .15s}
.nb-dot.sel{border-color:var(--ink);transform:scale(1.15)}
.nb-dot.alone{animation:pop .5s;outline:4px dashed var(--red);outline-offset:2px}
.nb-tens{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;margin-bottom:8px}
.nb-est svg{width:100%;height:auto;max-height:340px;display:block;background:#fff;border-radius:14px}
.nb-est text{transition:transform .8s ease-in-out}
.nb-ref{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-weight:800;margin-top:8px}
.nb-ref span{font-size:20px}
.nb-shape{display:block;width:100%;height:auto;max-width:260px;margin:0 auto}
.nb-mini{width:110px;max-width:100%;height:auto}
.nb-part{stroke:var(--ink);stroke-width:3;stroke-linejoin:round;transition:fill .2s}
.nb-shape.pz .nb-part{fill:#ffe3a3} .nb-shape.pz .nb-part.on{fill:var(--A)}
.nb-shape.ch .nb-part{fill:#f3e1cf} .nb-shape.ch .nb-part.on{fill:#7b3f1d}
.nb-shape.sq .nb-part{fill:#fff} .nb-shape.sq .nb-part.on{fill:var(--B)}
.nb-shape.tap .nb-part{cursor:pointer}
.nb-share .nb-pile{display:flex;flex-wrap:wrap;gap:4px;min-height:52px;justify-content:center;padding:8px;border:3px dashed var(--line);border-radius:14px;background:#fff}
.nb-plates{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px}
.nb-plate{width:132px;min-height:100px;background:#fff;border:4px solid #d6cfbd;border-radius:26px;padding:8px;display:flex;flex-wrap:wrap;gap:2px;align-content:flex-start;justify-content:center;position:relative}
.nb-plate small{position:absolute;bottom:-12px;left:50%;transform:translateX(-50%);background:#d6cfbd;border-radius:999px;padding:0 8px;font-weight:800;font-size:.8rem}
.nb-fi{font-size:28px;background:none;border:none;padding:2px;line-height:1}
.nb-frag{border-collapse:separate;border-spacing:4px;margin:8px auto}
.nb-frag td{width:62px;height:52px;text-align:center;font-size:1.4rem;font-weight:900;border:3px solid var(--line);border-radius:10px;background:#fff}
.nb-frag td.e{background:#f4f1e8;border-style:dashed}
.nb-frag td.q{color:var(--red);border-color:var(--red)}
.nb-frag td.k{background:var(--yel);border-color:#e9b949}
.nb-frag td.hl{background:var(--Cc);border-color:var(--C)}
.nb-frag td small{display:block;font-size:.75rem;color:var(--muted)}
.nb-b{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:stretch}
.nb-bcol{flex:1;min-width:96px;max-width:260px;background:#fff;border:3px solid var(--line);border-radius:16px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:6px}
.nb-bcol.c{border-color:var(--A)} .nb-bcol.d{border-color:var(--B)} .nb-bcol.u{border-color:var(--C)}
.nb-bcol h4{margin:0;font-size:.95rem}
.nb-bcol.c h4{color:var(--A)} .nb-bcol.d h4{color:var(--B)} .nb-bcol.u h4{color:var(--C)}
.nb-bblk{min-height:96px;display:flex;align-items:flex-end;justify-content:center;flex-wrap:wrap;gap:4px}
.nb-bblk.glow{animation:pop .6s;background:#fff3c4;border-radius:10px}
.nb-bctl{display:flex;gap:6px}
.nb-bctl .btn{padding:4px 14px;font-size:1.3rem}
.nb-bnum{font-size:2rem;font-weight:900}
.nb-bout{text-align:center;margin-top:10px}
.nb-bout .nb-big{font-size:3rem}
.nb-bmsg{min-height:1.5em;font-weight:800;color:var(--org);text-align:center}
.nb-ruleg{display:grid;grid-template-columns:repeat(3,64px);gap:4px;justify-content:center;margin:6px auto}
.nb-ruleg div{height:50px;border-radius:10px;background:#fff;border:3px solid var(--line);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1rem}
.nb-ruleg div.c{background:var(--yel);border-color:#e9b949;font-size:1.2rem}
.nb-ruleg div.hl{background:var(--Cc);border-color:var(--C);animation:pop .5s}
.nb-card{background:#fff;border:3px solid var(--line);border-radius:16px;padding:10px 14px;font-weight:700}
`);
  } catch (e) {
    /* environnement sans DOM (outil de vérification) */
  }

  /* ------------------------------------------------------------------
     Outils de texte
     ------------------------------------------------------------------ */
  const cdu = (n) => ({ c: Math.floor(n / 100), d: Math.floor((n % 100) / 10), u: n % 10 });
  const qty = (n, w) => `${n} ${pl(n, w)}`;
  const joinFr = (a) => (a.length <= 1 ? a[0] || '' : a.slice(0, -1).join(', ') + ' et ' + a[a.length - 1]);
  const NAMES = { c: 'centaines', d: 'dizaines', u: 'unités' };
  const NAME1 = { c: 'centaine', d: 'dizaine', u: 'unité' };
  const VAL = { c: 100, d: 10, u: 1 };
  NB.cdu = cdu;
  NB.qty = qty;
  NB.joinFr = joinFr;
  /** « 3 centaines, 4 dizaines et 7 unités » */
  NB.decompWords = (n) => {
    const { c, d, u } = cdu(n),
      p = [];
    if (n >= 100) p.push(qty(c, 'centaine'));
    if (n >= 10) p.push(qty(d, 'dizaine'));
    p.push(qty(u, 'unité'));
    return joinFr(p);
  };
  /** « 300 + 40 + 7 » (sans les zéros) */
  NB.expanded = (n) => {
    const { c, d, u } = cdu(n),
      p = [];
    if (c) p.push(c * 100);
    if (d) p.push(d * 10);
    if (u || !p.length) p.push(u);
    return p.join(' + ');
  };
  /** Chiffres colorés selon la position (centaines rose, dizaines bleu, unités vert). */
  NB.colored = (n) => {
    const s = String(n),
      k = ['u', 'd', 'c'];
    return (
      '<span class="nb-num">' +
      s
        .split('')
        .map((ch, i) => `<span class="nb-d${k[s.length - 1 - i] || 'c'}">${ch}</span>`)
        .join('') +
      '</span>'
    );
  };
  /** Tableau de numération. rows: [{n, label?, hide?:'c'|'d'|'u', cls?:{c:'hl'}}] */
  NB.tab = (rows, o = {}) => {
    const cols = o.cols || (rows.some((r) => r.n >= 100) ? 3 : 2);
    const keys = ['c', 'd', 'u'].slice(3 - cols);
    const hasLab = rows.some((r) => r.label != null);
    let h = `<table class="nb-tab"><tr>${hasLab ? '<th class="lab"></th>' : ''}${keys.map((k) => `<th class="${k}">${NAMES[k]}</th>`).join('')}</tr>`;
    rows.forEach((r, i) => {
      const v = cdu(r.n);
      h += `<tr data-r="${i}">${hasLab ? `<td class="lab">${r.label}</td>` : ''}${keys
        .map((k) => {
          const lead = (k === 'c' && r.n < 100) || (k === 'd' && r.n < 10);
          const txt = r.hide === k ? '?' : lead ? '' : v[k];
          return `<td class="${k} ${r.hide === k ? 'q' : ''} ${(r.cls && r.cls[k]) || ''}" data-k="${k}">${txt}</td>`;
        })
        .join('')}</tr>`;
    });
    return h + '</table>';
  };
  /* Blocs base 10 statiques, une couleur par position */
  const FLAT = '<span class="flat">' + '<i></i>'.repeat(100) + '</span>';
  const ROD = '<span class="rod">' + '<i></i>'.repeat(10) + '</span>';
  NB.flats = (k, small = true) =>
    k ? `<span class="b10 cA ${small ? 'small' : ''} nb-wrap"><span class="b10-h">${FLAT.repeat(k)}</span></span>` : '';
  NB.rods = (k, small = false) =>
    k ? `<span class="b10 cB ${small ? 'small' : ''} nb-wrap"><span class="b10-t">${ROD.repeat(k)}</span></span>` : '';
  NB.cubes = (k, small = false) =>
    k ? `<span class="b10 cC ${small ? 'small' : ''}"><span class="b10-u">${'<span class="cube"></span>'.repeat(k)}</span></span>` : '';
  NB.blocks = (n, small) => {
    const { c, d, u } = cdu(n);
    return `<div class="nb-brow">${NB.flats(c, true)}${NB.rods(d, small)}${NB.cubes(u, small)}</div>`;
  };

  /** Choix distincts : la bonne réponse + des distracteurs uniques. */
  function mkChoices(answer, cands, n, label = (v) => String(v)) {
    const out = [answer];
    for (const c of M.shuffle(cands)) {
      if (out.length >= n) break;
      if (!out.some((x) => String(x) === String(c))) out.push(c);
    }
    return M.shuffle(out).map((v) => ({ label: label(v), value: v }));
  }
  /** Monte un visuel dans un enfant neuf de el : quand la session remplace le contenu
      de el (question suivante, ↺ Effacer), les animations en cours voient
      isConnected === false et s'arrêtent au lieu d'écrire dans le nouveau visuel. */
  NB.mount = (el) => {
    el.onclick = null;
    el.innerHTML = '';
    const d = document.createElement('div');
    el.appendChild(d);
    return d;
  };
  const register = (def) => {
    const gen = def.gen;
    def.gen = (ctx) => {
      const q = gen(ctx);
      if (q.viz) {
        const v = q.viz;
        q.viz = (el) => v(NB.mount(el));
      }
      if (q.showMe) {
        const sm = q.showMe;
        q.showMe = (el) => sm(NB.mount(el));
      }
      return q;
    };
    M.registerSkill(def);
  };
  const alignPick = (lo, hi, m) => m * R(Math.ceil(lo / m), Math.floor(hi / m));
  const EMO = ['🍎', '⭐', '🎈', '🍓', '🐟', '🌼', '🍪', '⚽', '🐞', '🦋', '🍒', '🧸'];
  const FEM = { '🍎': 1, '⭐': 1, '🍓': 1, '🌼': 1, '🐞': 1, '🍒': 1 };
  const seul = (em) => (FEM[em] ? 'seules' : 'seuls');
  /** « de pommes » / « d'étoiles » */
  const de = (w) => (/^[aeiouyéèêh]/i.test(w) ? "d'" : 'de ') + w;
  NB.de = de;
  const EMO_NAME = {
    '🍎': 'pommes',
    '⭐': 'étoiles',
    '🎈': 'ballons',
    '🍓': 'fraises',
    '🐟': 'poissons',
    '🌼': 'fleurs',
    '🍪': 'biscuits',
    '⚽': 'ballons',
    '🐞': 'coccinelles',
    '🦋': 'papillons',
    '🍒': 'cerises',
    '🧸': 'oursons',
  };

  /* ------------------------------------------------------------------
     Visuel : grille de nombres (rangées de 10)
     o: { from, to, hl:{v:'k1'}, hint, tap:true, tapCls:'k2', onTap(v, api) }
     ------------------------------------------------------------------ */
  NB.grid = function (el, o) {
    const col = Object.assign({}, o.hl || {});
    const ring = {};
    let msg = o.msg || '',
      tok = 0;
    function render(pop) {
      let h = o.hint ? `<div class="viz-hint">${o.hint}</div>` : '';
      h += '<div class="nb-grid">';
      for (let v = o.from; v <= o.to; v++)
        h += `<button class="nb-cell ${col[v] || ''} ${ring[v] ? 'ring' : ''} ${v === pop ? 'hop' : ''}" data-v="${v}">${v}</button>`;
      h += `</div><div class="viz-status">${msg}</div>`;
      el.innerHTML = h;
    }
    const api = {
      col,
      ring,
      render,
      set(v, c) {
        col[v] = c;
      },
      clear() {
        Object.keys(col).forEach((k) => delete col[k]);
        Object.keys(ring).forEach((k) => delete ring[k]);
      },
      status(s) {
        msg = s;
        const st = M.$('.viz-status', el);
        if (st) st.innerHTML = s;
      },
      stop() {
        tok++;
      },
      async play(seq, cls, labelFn, delay = 520) {
        const t = ++tok;
        for (let i = 0; i < seq.length; i++) {
          await M.sleep(delay);
          if (t !== tok || !el.isConnected) return false;
          col[seq[i]] = typeof cls === 'function' ? cls(seq[i], i) : cls;
          msg = labelFn ? labelFn(seq[i], i) : msg;
          M.sfx.hop();
          render(seq[i]);
        }
        return true;
      },
    };
    el.onclick = (e) => {
      const b = e.target.closest('.nb-cell');
      if (!b || o.tap === false) return;
      tok++;
      const v = +b.dataset.v;
      if (o.onTap) o.onTap(v, api);
      else {
        const tc = o.tapCls || 'k2';
        col[v] = col[v] === tc ? (o.hl && o.hl[v]) || '' : tc;
      }
      M.sfx.tap();
      render(v);
    };
    render();
    return api;
  };
  NB.gridBounds = (vals) => {
    const mn = Math.min(...vals),
      mx = Math.max(...vals);
    return { from: Math.floor((mn - 1) / 10) * 10 + 1, to: Math.ceil(mx / 10) * 10 };
  };

  /* ------------------------------------------------------------------
     Visuel : collection groupée (sacs de 10 / blocs base 10) à dénombrer
     o: { c, d, u, emoji? }
     ------------------------------------------------------------------ */
  NB.collect = function (el, o) {
    let items,
      order,
      flash = -1,
      tok = 0,
      msg = '';
    const em = o.emoji;
    function build() {
      items = [];
      for (let i = 0; i < (o.c || 0); i++) items.push({ t: 100 });
      for (let i = 0; i < (o.d || 0); i++) items.push({ t: 10 });
      for (let i = 0; i < (o.u || 0); i++) items.push({ t: 1 });
      order = [];
      flash = -1;
      msg = '';
    }
    const inner = (t) => {
      if (t === 100) return NB.flats(1);
      if (t === 10) return em ? `<span class="nb-pack">${`<i>${em}</i>`.repeat(10)}</span>` : NB.rods(1);
      return em ? `<span class="nb-one">${em}</span>` : NB.cubes(1);
    };
    const count = (t) => items.filter((x) => x.t === t).length;
    function render() {
      const cum = {};
      let s = 0;
      order.forEach((i) => {
        s += items[i].t;
        cum[i] = s;
      });
      let h = `<div class="viz-hint">${em ? `Un sac contient 10 ${em}. Touche les sacs, puis les ${em} seuls, pour compter.` : 'Touche les blocs pour les compter : une plaque = 100, une barre = 10, un cube = 1.'}</div><div class="nb-coll">`;
      [100, 10, 1].forEach((t) => {
        const idx = items.map((x, i) => i).filter((i) => items[i].t === t);
        if (!idx.length) return;
        h += `<div class="nb-crow">${idx.map((i) => `<button class="nb-it ${cum[i] ? 'on' : ''} ${i === flash ? 'new' : ''}" data-i="${i}">${cum[i] ? `<span class="nb-lbl">${cum[i]}</span>` : ''}${inner(t)}</button>`).join('')}</div>`;
      });
      h += '</div><div class="row">';
      if (count(1) >= 10)
        h += `<button class="btn nb-mk" data-t="10">📦 ${em ? 'Faire un sac de 10' : 'Échanger 10 cubes contre 1 barre'}</button>`;
      if (count(10) >= 10) h += '<button class="btn nb-mk" data-t="100">📦 Échanger 10 barres contre 1 plaque</button>';
      h += `</div><div class="viz-status">${msg || (order.length ? `Tu as compté : <b>${s}</b>` : '')}</div>`;
      el.innerHTML = h;
    }
    function regroup(t) {
      const small = t / 10;
      let k = 0;
      for (let i = items.length - 1; i >= 0 && k < 10; i--)
        if (items[i].t === small) {
          items.splice(i, 1);
          k++;
        }
      // insérer le nouveau groupe après les autres du même type
      let pos = 0;
      items.forEach((x, i) => {
        if (x.t >= t) pos = i + 1;
      });
      items.splice(pos, 0, { t });
      order = [];
      flash = pos;
      msg = t === 10 ? (em ? `10 ${em} seuls = 1 sac de 10 !` : '10 cubes = 1 barre de 10 !') : '10 barres = 1 plaque de 100 !';
      M.sfx.pop();
      render();
    }
    el.onclick = (e) => {
      const mk = e.target.closest('.nb-mk');
      if (mk) {
        tok++;
        regroup(+mk.dataset.t);
        return;
      }
      const b = e.target.closest('.nb-it');
      if (!b) return;
      tok++;
      const i = +b.dataset.i,
        p = order.indexOf(i);
      if (p >= 0) order.splice(p, 1);
      else order.push(i);
      flash = -1;
      msg = '';
      M.sfx.tap();
      render();
    };
    build();
    render();
    return {
      async showMe() {
        const t = ++tok;
        build();
        render();
        const ok = () => t === tok && el.isConnected;
        await M.sleep(400);
        if (!ok()) return;
        while (count(1) >= 10) {
          regroup(10);
          await M.sleep(900);
          if (!ok()) return;
        }
        while (count(10) >= 10) {
          regroup(100);
          await M.sleep(900);
          if (!ok()) return;
        }
        flash = -1;
        msg = '';
        const idx = items.map((x, i) => i).sort((a, b) => items[b].t - items[a].t);
        for (const i of idx) {
          order.push(i);
          M.sfx.tap();
          render();
          await M.sleep(items[i].t === 1 ? 300 : 480);
          if (!ok()) return;
        }
      },
    };
  };

  /* ------------------------------------------------------------------
     Visuel : blocs base 10 à colorier (partie connue / partie cachée)
     o: { breakable }
     ------------------------------------------------------------------ */
  NB.split = function (el, n, o = {}) {
    let items,
      tok = 0,
      flash = -1,
      msg = '';
    function build() {
      const { c, d, u } = cdu(n);
      items = [];
      for (let i = 0; i < c; i++) items.push({ t: 100, hl: false });
      for (let i = 0; i < d; i++) items.push({ t: 10, hl: false });
      for (let i = 0; i < u; i++) items.push({ t: 1, hl: false });
      msg = '';
    }
    const sum = (f) => items.filter(f).reduce((s, x) => s + x.t, 0);
    const inner = (t) =>
      t === 100
        ? `<span class="cA">${FLAT}</span>`
        : t === 10
          ? `<span class="cB">${ROD}</span>`
          : '<span class="cC"><span class="cube"></span></span>';
    function render() {
      let h = `<div class="viz-hint">${o.hint || 'Touche des blocs pour les colorier. Une plaque = 100, une barre = 10, un cube = 1.'}</div><div class="b10 small nb-blk">`;
      [100, 10, 1].forEach((t) => {
        const idx = items.map((x, i) => i).filter((i) => items[i].t === t);
        if (idx.length)
          h += `<div class="nb-brow">${idx.map((i) => `<button class="nb-sb ${items[i].hl ? 'hl' : ''} ${i === flash ? 'new' : ''}" data-i="${i}">${inner(t)}</button>`).join('')}</div>`;
      });
      h += '</div>';
      if (o.breakable) {
        h += '<div class="row">';
        if (items.some((x) => x.t === 100)) h += '<button class="btn nb-brk" data-t="100">🔨 Casser une centaine</button>';
        if (items.some((x) => x.t === 10)) h += '<button class="btn nb-brk" data-t="10">🔨 Casser une dizaine</button>';
        h += '</div>';
      }
      const a = sum((x) => x.hl);
      h += `<div class="viz-status">${msg || (a ? `🟨 Colorié : <b>${a}</b> · Pas colorié : <b>${n - a}</b>` : '')}</div>`;
      el.innerHTML = h;
    }
    function brk(t) {
      let k = -1;
      items.forEach((x, i) => {
        if (x.t === t && !x.hl) k = i;
      });
      if (k < 0)
        items.forEach((x, i) => {
          if (x.t === t) k = i;
        });
      if (k < 0) return false;
      const hl = items[k].hl;
      items.splice(k, 1);
      let pos = 0;
      items.forEach((x, i) => {
        if (x.t >= t / 10) pos = i + 1;
      });
      for (let i = 0; i < 10; i++) items.splice(pos, 0, { t: t / 10, hl });
      flash = -1;
      msg = t === 100 ? '1 centaine = 10 dizaines' : '1 dizaine = 10 unités';
      M.sfx.tone([200, 160], 0.08, 'square', 0.08);
      render();
      return true;
    }
    el.onclick = (e) => {
      const bk = e.target.closest('.nb-brk');
      if (bk) {
        tok++;
        brk(+bk.dataset.t);
        return;
      }
      const b = e.target.closest('.nb-sb');
      if (!b) return;
      tok++;
      const it = items[+b.dataset.i];
      it.hl = !it.hl;
      flash = -1;
      msg = '';
      M.sfx.tap();
      render();
    };
    build();
    render();
    return {
      count: (t) => items.filter((x) => x.t === t).length,
      /** Colorie des quantités, une partie à la fois. */
      async showMe(parts, opts = {}) {
        const t = ++tok;
        build();
        render();
        const ok = () => t === tok && el.isConnected;
        await M.sleep(400);
        if (!ok()) return;
        if (opts.breakFirst) {
          brk(opts.breakFirst);
          await M.sleep(900);
          if (!ok()) return;
        }
        for (const part of parts || []) {
          let left = part;
          for (const sz of [100, 10, 1]) {
            for (let i = 0; i < items.length && left >= sz; i++) {
              const it = items[i];
              if (it.t === sz && !it.hl) {
                it.hl = true;
                left -= sz;
                msg = '';
                M.sfx.tap();
                render();
                await M.sleep(sz === 1 ? 220 : 380);
                if (!ok()) return;
              }
            }
          }
          await M.sleep(400);
          if (!ok()) return;
        }
        if (opts.end) {
          msg = opts.end;
          render();
        }
      },
    };
  };

  /* ------------------------------------------------------------------
     Visuel : constructeur de nombre (+/− par position, échanges automatiques)
     o: { start, words:true, tab:false, max:999, small:true, onChange(v) }
     ------------------------------------------------------------------ */
  NB.builder = function (el, o = {}) {
    const st = cdu(o.start || 0);
    let busy = false,
      tok = 0,
      glow = '',
      msg = '';
    const value = () => st.c * 100 + st.d * 10 + st.u;
    const blk = (k) => (k === 'c' ? NB.flats(st.c) : k === 'd' ? NB.rods(st.d, o.small !== false) : NB.cubes(st.u, o.small !== false));
    function render() {
      const v = value();
      let h = o.hint ? `<div class="viz-hint">${o.hint}</div>` : '';
      h +=
        '<div class="nb-b">' +
        ['c', 'd', 'u']
          .map(
            (k) => `<div class="nb-bcol ${k}"><h4>${NAMES[k]}</h4>
          <div class="nb-bblk ${glow === k ? 'glow' : ''}">${blk(k)}</div>
          <div class="nb-bnum nb-d${k}">${st[k]}</div>
          <div class="nb-bctl"><button class="btn" data-a="-${k}" aria-label="moins">−</button><button class="btn" data-a="+${k}" aria-label="plus">+</button></div></div>`,
          )
          .join('') +
        '</div>';
      const shown = v < 1000 ? v : 999;
      h += `<div class="nb-bout"><div class="nb-big">${NB.colored(shown)}</div>`;
      if (o.tab) h += NB.tab([{ n: shown }], { cols: 3 });
      if (o.words !== false)
        h += `<div class="row" style="justify-content:center"><span class="nb-words" style="font-size:1.4rem">${M.frNum(shown)}</span><button class="btn icon nb-say" title="Écouter">🔊</button></div>`;
      if (o.expanded) h += `<div class="muted" style="font-weight:800">${shown} = ${NB.expanded(shown)}</div>`;
      h += `<div class="nb-bmsg">${msg}</div></div>`;
      el.innerHTML = h;
      if (o.onChange) o.onChange(shown);
    }
    const wait = async (t, ms) => {
      await M.sleep(ms);
      return t === tok && el.isConnected;
    };
    async function act(a) {
      const sign = a[0],
        k = a[1];
      const t = ++tok;
      msg = '';
      glow = '';
      if (sign === '+') {
        if (value() + VAL[k] > (o.max || 999)) {
          msg = `Oups ! On ne peut pas dépasser ${o.max || 999} ici.`;
          M.sfx.bad();
          render();
          return;
        }
        st[k]++;
        M.sfx.tap();
        // échanges en chaîne : 10 unités → 1 dizaine, 10 dizaines → 1 centaine
        const chain = [
          ['u', 'd'],
          ['d', 'c'],
        ];
        for (const [lo, hi] of chain) {
          if (st[lo] === 10) {
            glow = lo;
            msg = `10 ${NAMES[lo]}… on fait un échange ! 🔄`;
            render();
            busy = true;
            if (!(await wait(t, 900))) {
              busy = false;
              return;
            }
            st[lo] = 0;
            st[hi]++;
            glow = hi;
            msg = `10 ${NAMES[lo]} = 1 ${NAME1[hi]} ! 🎉`;
            M.sfx.pop();
            busy = false;
          }
        }
        render();
      } else {
        if (st[k] > 0) {
          st[k]--;
          M.sfx.tap();
          render();
          return;
        }
        // casser une position plus grande (ex. 1 dizaine → 10 unités)
        const chain = k === 'u' ? (st.d > 0 ? ['d'] : st.c > 0 ? ['c', 'd'] : null) : k === 'd' ? (st.c > 0 ? ['c'] : null) : null;
        if (!chain) {
          msg = "Il n'y a plus rien à enlever ici.";
          render();
          return;
        }
        busy = true;
        for (const big of chain) {
          const small = big === 'c' ? 'd' : 'u';
          st[big]--;
          st[small] += 10;
          glow = small;
          msg = `🔨 On casse 1 ${NAME1[big]} en 10 ${NAMES[small]}.`;
          M.sfx.tone([200, 160], 0.08, 'square', 0.08);
          render();
          if (!(await wait(t, 900))) {
            busy = false;
            return;
          }
        }
        busy = false;
        st[k]--;
        glow = '';
        M.sfx.tap();
        render();
      }
    }
    el.onclick = (e) => {
      if (e.target.closest('.nb-say')) {
        M.say(M.frNum(value()));
        return;
      }
      const b = e.target.closest('[data-a]');
      if (!b || busy) return;
      act(b.dataset.a);
    };
    render();
    return {
      value,
      set(v) {
        tok++;
        busy = false;
        Object.assign(st, cdu(v));
        msg = '';
        glow = '';
        render();
      },
      async showMe(target) {
        const t = ++tok;
        busy = false;
        Object.assign(st, cdu(0));
        msg = '';
        glow = '';
        render();
        const g = cdu(target);
        for (const k of ['c', 'd', 'u']) {
          for (let i = 0; i < g[k]; i++) {
            if (!(await wait(t, k === 'u' ? 260 : 380))) return;
            st[k]++;
            glow = k;
            M.sfx.tap();
            render();
          }
        }
        glow = '';
        msg = `${target}, c'est ${NB.decompWords(target)}.`;
        render();
      },
    };
  };

  /* ------------------------------------------------------------------
     Visuel : tableau de position avec blocs (chiffres cachés à toucher)
     ------------------------------------------------------------------ */
  NB.place = function (el, n, o = {}) {
    const g = cdu(n);
    let shown = {},
      rodsC = false,
      tok = 0,
      msg = '';
    const keys = n >= 100 ? ['c', 'd', 'u'] : ['d', 'u'];
    function render() {
      let h = `<div class="viz-hint">${o.hint || 'Touche une colonne pour voir son chiffre.'}</div><table class="nb-ptab"><tr>${keys.map((k) => `<th class="${k}">${NAMES[k]}</th>`).join('')}</tr><tr>`;
      keys.forEach((k) => {
        let b;
        if (k === 'c') b = rodsC ? '' : NB.flats(g.c);
        else if (k === 'd') b = (rodsC ? NB.rods(g.c * 10, true) : '') + NB.rods(g.d, true);
        else b = NB.cubes(g.u, true);
        h += `<td class="${shown[k] === 'hl' ? 'hl' : ''}" data-k="${k}"><div class="nb-brow" style="justify-content:center">${b || '<span class="muted">—</span>'}</div></td>`;
      });
      const dig = (k) => (rodsC && k === 'c' ? 0 : rodsC && k === 'd' ? g.c * 10 + g.d : g[k]);
      h += `</tr><tr>${keys.map((k) => `<td class="dig nb-d${k} ${shown[k] === 'hl' ? 'hl' : ''}" data-k="${k}">${shown[k] ? dig(k) : '?'}</td>`).join('')}</tr></table>`;
      if (o.breakC && g.c)
        h += `<div class="row"><button class="btn nb-brkc">🔨 ${rodsC ? 'Remettre les centaines' : 'Changer les centaines en dizaines'}</button></div>`;
      h += `<div class="viz-status">${msg}</div>`;
      el.innerHTML = h;
    }
    el.onclick = (e) => {
      if (e.target.closest('.nb-brkc')) {
        tok++;
        rodsC = !rodsC;
        msg = rodsC ? `${qty(g.c, 'centaine')} = ${g.c * 10} dizaines. Compte toutes les barres !` : '';
        M.sfx.pop();
        render();
        return;
      }
      const td = e.target.closest('td[data-k]');
      if (!td) return;
      tok++;
      shown[td.dataset.k] = shown[td.dataset.k] ? false : true;
      M.sfx.tap();
      render();
    };
    render();
    return {
      async showMe(focus, breakIt) {
        const t = ++tok;
        shown = {};
        rodsC = false;
        msg = '';
        render();
        for (const k of keys) {
          await M.sleep(450);
          if (t !== tok || !el.isConnected) return;
          shown[k] = k === focus ? 'hl' : true;
          M.sfx.tap();
          render();
        }
        if (breakIt && g.c) {
          await M.sleep(700);
          if (t !== tok || !el.isConnected) return;
          rodsC = true;
          shown.d = 'hl';
          msg = `${qty(g.c, 'centaine')} = ${g.c * 10} dizaines, plus ${qty(g.d, 'dizaine')} : <b>${g.c * 10 + g.d} dizaines</b> en tout.`;
          M.sfx.pop();
          render();
        }
      },
    };
  };

  /* ------------------------------------------------------------------
     Visuel : comparer deux nombres (tableau + blocs + crocodile)
     ------------------------------------------------------------------ */
  NB.sym = (a, b) => (a < b ? '<' : a > b ? '>' : '=');
  NB.symHtml = (s) => ({ '<': '&lt;', '>': '&gt;', '=': '=' })[s];
  NB.compare = function (el, a, b, o = {}) {
    let tok = 0;
    const la = o.la || String(a),
      lb = o.lb || String(b);
    function render(cls, done) {
      const rows = [
        { n: a, label: la, cls: cls && cls[0] },
        { n: b, label: lb, cls: cls && cls[1] },
      ];
      let h = `<div class="viz-hint">🐊 Le crocodile a faim : sa bouche s'ouvre vers le plus grand nombre. Compare d'abord les ${Math.max(a, b) >= 100 ? 'centaines, puis les dizaines' : 'dizaines'}, puis les unités.</div>`;
      h += NB.tab(rows, { cols: Math.max(a, b) >= 100 ? 3 : 2 });
      if (!o.noBlocks)
        h += `<div class="nb-cmp"><div><b>${la}</b>${NB.blocks(a, true)}</div><div><b>${lb}</b>${NB.blocks(b, true)}</div></div>`;
      h += `<div class="nb-croc">${done || ''}</div>`;
      el.innerHTML = h;
    }
    render();
    return {
      async showMe() {
        const t = ++tok;
        render();
        const keys = Math.max(a, b) >= 100 ? ['c', 'd', 'u'] : ['d', 'u'];
        const A = cdu(a),
          B = cdu(b),
          c0 = {},
          c1 = {};
        for (const k of keys) {
          await M.sleep(650);
          if (t !== tok || !el.isConnected) return;
          if (A[k] === B[k]) {
            c0[k] = c1[k] = 'same';
            M.sfx.tap();
            render([c0, c1], `Les ${NAMES[k]} sont pareilles (${A[k]} et ${B[k]}). On regarde plus loin…`);
            continue;
          }
          const aBig = A[k] > B[k];
          c0[k] = aBig ? 'ok' : 'no';
          c1[k] = aBig ? 'no' : 'ok';
          M.sfx.hop();
          render(
            [c0, c1],
            `Aux ${NAMES[k]} : ${Math.max(A[k], B[k])} est plus grand que ${Math.min(A[k], B[k])}.<br><span class="nb-big">${la} ${NB.symHtml(NB.sym(a, b))} ${lb}</span> 🐊`,
          );
          return;
        }
        render([c0, c1], `<span class="nb-big">${la} = ${lb}</span>`);
      },
    };
  };

  /* ------------------------------------------------------------------
     Visuel : faire des paires (pair / impair)
     ------------------------------------------------------------------ */
  const PAIRCOL = ['#118ab2', '#06a77d', '#f78c40', '#9b5de5', '#f4b400', '#2b2d42', '#ef476f', '#3a86ff', '#8ac926', '#ff595e'];
  NB.pairs = function (el, n) {
    const tens = n > 20 ? Math.floor(n / 10) : 0;
    const k = n - tens * 10;
    let pairOf,
      sel,
      tok = 0,
      done = false;
    const reset = () => {
      pairOf = Array(k).fill(-1);
      sel = -1;
      done = k === 0;
    };
    const npairs = () => pairOf.filter((p) => p >= 0).length / 2;
    function render() {
      let h = `<div class="viz-hint">Touche deux points pour en faire une paire 🤝. Reste-t-il un point tout seul ?</div>`;
      if (tens)
        h += `<div class="nb-tens">${NB.rods(tens, true)}<span class="nb-card">${qty(tens, 'dizaine')} : chaque dizaine se partage en 5 paires ✔️</span></div>`;
      h += `<div class="nb-dots">${pairOf
        .map((p, i) => {
          const pid = p >= 0 ? Math.min(i, p) : -1;
          const pn = pid >= 0 ? pairOf.slice(0, pid + 1).filter((q, j) => q >= 0 && j < q).length : 0;
          const style = pid >= 0 ? `background:${PAIRCOL[(pn - 1) % PAIRCOL.length]}` : '';
          const alone = done && p < 0;
          return `<button class="nb-dot ${sel === i ? 'sel' : ''} ${alone ? 'alone' : ''}" style="${style}" data-i="${i}">${pid >= 0 ? pn : ''}</button>`;
        })
        .join('')}</div>`;
      const free = pairOf.filter((p) => p < 0).length;
      let s = `Paires : <b>${npairs()}</b> · Points seuls : <b>${free}</b>`;
      if (done) s += free ? ' → un point reste tout seul !' : " → personne n'est tout seul !";
      h += `<div class="viz-status">${s}</div>`;
      el.innerHTML = h;
    }
    el.onclick = (e) => {
      const b = e.target.closest('.nb-dot');
      if (!b) return;
      tok++;
      const i = +b.dataset.i;
      if (pairOf[i] >= 0) {
        const j = pairOf[i];
        pairOf[i] = pairOf[j] = -1;
      } else if (sel === i) sel = -1;
      else if (sel < 0) sel = i;
      else {
        pairOf[i] = sel;
        pairOf[sel] = i;
        sel = -1;
      }
      done = pairOf.filter((p) => p < 0).length <= 1;
      M.sfx.tap();
      render();
    };
    reset();
    render();
    return {
      async showMe() {
        const t = ++tok;
        reset();
        render();
        for (let i = 0; i + 1 < k; i += 2) {
          await M.sleep(420);
          if (t !== tok || !el.isConnected) return;
          pairOf[i] = i + 1;
          pairOf[i + 1] = i;
          M.sfx.hop();
          render();
        }
        await M.sleep(300);
        if (t !== tok || !el.isConnected) return;
        done = true;
        render();
      },
    };
  };

  /* ------------------------------------------------------------------
     Visuel : collection éparpillée à estimer (+ grouper par 10)
     ------------------------------------------------------------------ */
  NB.scatter = function (el, n, emoji) {
    const Wd = 600,
      Ht = 330;
    const d = n > 120 ? 17 : n > 50 ? 24 : 34;
    // positions éparpillées : grille avec un peu de hasard
    const cols = Math.floor((Wd - d) / d),
      rows = Math.floor((Ht - d) / d);
    const cells = M.shuffle(M.range(0, cols * rows - 1)).slice(0, n);
    const scat = cells.map((c) => ({
      x: d / 2 + (c % cols) * d + R(0, Math.floor(d * 0.3)),
      y: d / 2 + Math.floor(c / cols) * d + R(0, Math.floor(d * 0.3)) + d * 0.5,
    }));
    // positions groupées : blocs de 2 × 5
    const bw = 5 * d * 0.92 + d * 0.6,
      bh = 2 * d * 0.92 + d * 0.6,
      perRow = Math.max(1, Math.floor(Wd / bw));
    const grp = M.range(0, n - 1).map((i) => {
      const g = Math.floor(i / 10),
        j = i % 10,
        gx = (g % perRow) * bw,
        gy = Math.floor(g / perRow) * bh;
      return { x: gx + d * 0.6 + (j % 5) * d * 0.92, y: gy + d + Math.floor(j / 5) * d * 0.92 };
    });
    let grouped = false;
    function render() {
      let h = '<div class="viz-hint">Ne compte pas un par un : regarde et fais une estimation ! 👀</div><div class="nb-est">';
      h += `<svg viewBox="0 0 ${Wd} ${Ht}" xmlns="http://www.w3.org/2000/svg">`;
      for (let i = 0; i < n; i++)
        h += `<text x="0" y="0" font-size="${Math.round(d * 0.8)}" text-anchor="middle" style="transform:translate(${scat[i].x}px,${scat[i].y}px)">${emoji}</text>`;
      h += '</svg></div>';
      h += `<div class="nb-ref">Voici 10 ${emoji} pour t'aider : <span>${emoji.repeat(10)}</span></div>`;
      h += `<div class="row"><button class="btn nb-grp">🔟 ${grouped ? 'Éparpiller' : 'Grouper par 10'}</button></div><div class="viz-status"></div>`;
      el.innerHTML = h;
    }
    function move() {
      const ts = M.$$('.nb-est text', el),
        pos = grouped ? grp : scat;
      ts.forEach((t, i) => {
        t.style.transform = `translate(${pos[i].x}px,${pos[i].y}px)`;
      });
      const b = M.$('.nb-grp', el);
      if (b) b.textContent = '🔟 ' + (grouped ? 'Éparpiller' : 'Grouper par 10');
      const st = M.$('.viz-status', el);
      if (st) st.innerHTML = grouped ? 'Chaque petit paquet a 10 objets. Compte les paquets de 10 !' : '';
    }
    el.onclick = (e) => {
      if (e.target.closest('.nb-grp')) {
        grouped = !grouped;
        M.sfx.hop();
        move();
      }
    };
    render();
    return {
      showMe() {
        grouped = true;
        M.sfx.hop();
        move();
      },
    };
  };

  /* ------------------------------------------------------------------
     Fractions : formes partagées en parts (égales ou non)
     ------------------------------------------------------------------ */
  const NUMW = ['zéro', 'un', 'deux', 'trois', 'quatre'];
  const FN = { 2: ['demi', 'demis'], 3: ['tiers', 'tiers'], 4: ['quart', 'quarts'] };
  NB.fracName = (k, n) => `${NUMW[k]} ${k > 1 ? FN[n][1] : FN[n][0]}`;
  const UNEQ = { 2: [1, 2], 3: [1, 1, 2], 4: [1, 2, 2, 3] };
  NB.weights = (n, equal) => (equal ? Array(n).fill(1) : M.shuffle(UNEQ[n]));
  const KCLS = { pizza: 'pz', tab: 'ch', carre: 'sq' };
  /** Forme SVG. kind: 'pizza'|'tab'|'carre'; on: tableau d'index coloriés; variant pour le carré. */
  NB.shapeSvg = function (kind, weights, on = [], o = {}) {
    const n = weights.length,
      tot = weights.reduce((a, b) => a + b, 0),
      equal = weights.every((w) => w === weights[0]);
    const cls = `nb-shape ${KCLS[kind]} ${o.tap ? 'tap' : ''} ${o.mini ? 'nb-mini' : ''}`;
    const part = (i, d) => `<path class="nb-part ${on.includes(i) ? 'on' : ''}" data-p="${i}" d="${d}"/>`;
    let inner = '',
      vb = '0 0 200 200';
    if (kind === 'pizza') {
      const cx = 100,
        cy = 100,
        r = 86;
      inner += `<circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="#d08b3e"/>`;
      let a = -Math.PI / 2;
      weights.forEach((w, i) => {
        const b = a + (2 * Math.PI * w) / tot;
        const x0 = cx + r * Math.cos(a),
          y0 = cy + r * Math.sin(a),
          x1 = cx + r * Math.cos(b),
          y1 = cy + r * Math.sin(b);
        inner += part(
          i,
          `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${b - a > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`,
        );
        a = b;
      });
    } else if (kind === 'tab') {
      vb = '0 0 300 170';
      const X = 15,
        Y = 20,
        W = 270,
        H = 130;
      let x = X;
      weights.forEach((w, i) => {
        const ww = (W * w) / tot;
        inner += part(i, `M${x.toFixed(1)} ${Y} h${ww.toFixed(1)} v${H} h${(-ww).toFixed(1)} Z`);
        x += ww;
      });
    } else {
      const X = 20,
        S = 160,
        v = o.variant || 0;
      if (equal && n === 2 && v === 1) {
        inner += part(0, `M${X} ${X} h${S} L${X} ${X + S} Z`) + part(1, `M${X + S} ${X} v${S} h${-S} Z`);
      } else if (equal && n === 4 && v === 1) {
        const h = S / 2;
        [
          [0, 0],
          [h, 0],
          [0, h],
          [h, h],
        ].forEach(([dx, dy], i) => {
          inner += part(i, `M${X + dx} ${X + dy} h${h} v${h} h${-h} Z`);
        });
      } else if (equal && n === 4 && v === 2) {
        const c = X + S / 2;
        inner +=
          part(0, `M${X} ${X} H${X + S} L${c} ${c} Z`) +
          part(1, `M${X + S} ${X} V${X + S} L${c} ${c} Z`) +
          part(2, `M${X + S} ${X + S} H${X} L${c} ${c} Z`) +
          part(3, `M${X} ${X + S} V${X} L${c} ${c} Z`);
      } else {
        let y = X;
        weights.forEach((w, i) => {
          const hh = (S * w) / tot;
          inner += part(i, `M${X} ${y.toFixed(1)} h${S} v${hh.toFixed(1)} h${-S} Z`);
          y += hh;
        });
      }
    }
    return `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  };
  /** Forme interactive : toucher les parts pour les colorier. */
  NB.fracTool = function (el, o) {
    const on = (o.on || []).slice();
    function render() {
      const h =
        (o.hint ? `<div class="viz-hint">${o.hint}</div>` : '') +
        `<div class="nb-frac">${NB.shapeSvg(o.kind, o.weights, on, { tap: true, variant: o.variant })}</div><div class="viz-status">${o.status ? o.status(on.length) : `Parts coloriées : <b>${on.length}</b> sur <b>${o.weights.length}</b>`}</div>`;
      el.innerHTML = h;
    }
    el.onclick = (e) => {
      const p = e.target.closest('.nb-part');
      if (!p) return;
      const i = +p.getAttribute('data-p'),
        j = on.indexOf(i);
      if (j >= 0) on.splice(j, 1);
      else on.push(i);
      M.sfx.tap();
      render();
      if (o.onChange) o.onChange(on.slice());
    };
    render();
    return { on, render };
  };

  /* ------------------------------------------------------------------
     Visuel : partager une collection en parts égales (assiettes)
     ------------------------------------------------------------------ */
  NB.share = function (el, total, n, emoji, o = {}) {
    let loc,
      tok = 0;
    const reset = () => {
      loc = Array(total).fill(-1);
    };
    const inPlate = (p) => loc.filter((x) => x === p).length;
    function render() {
      let h = `<div class="viz-hint">${o.hint || `Touche un ${emoji} pour le donner à l'assiette qui en a le moins. Partage jusqu'au bout !`}</div><div class="nb-share">`;
      h += `<div class="nb-pile">${loc.map((x, i) => (x < 0 ? `<button class="nb-fi" data-i="${i}">${emoji}</button>` : '')).join('') || '<span class="muted">Tout est partagé !</span>'}</div>`;
      h += `<div class="nb-plates">${M.range(0, n - 1)
        .map(
          (p) =>
            `<div class="nb-plate">${loc.map((x, i) => (x === p ? `<button class="nb-fi" data-i="${i}">${emoji}</button>` : '')).join('')}<small>${inPlate(p)}</small></div>`,
        )
        .join('')}</div></div>`;
      const left = loc.filter((x) => x < 0).length;
      const counts = M.range(0, n - 1).map(inPlate);
      let s = '';
      if (!left)
        s = counts.every((c) => c === counts[0])
          ? `Chaque part a <b>${counts[0]}</b> ${emoji}. Les parts sont égales ! ✔️`
          : 'Les parts ne sont pas égales…';
      else if (left < total) s = `Il reste <b>${left}</b> ${emoji} à partager.`;
      h += `<div class="viz-status">${s}</div>`;
      el.innerHTML = h;
      if (o.onChange) o.onChange(left, counts);
    }
    function give(i) {
      if (loc[i] >= 0) {
        loc[i] = -1;
        return;
      }
      let best = 0;
      for (let p = 1; p < n; p++) if (inPlate(p) < inPlate(best)) best = p;
      loc[i] = best;
    }
    el.onclick = (e) => {
      const b = e.target.closest('.nb-fi');
      if (!b) return;
      tok++;
      give(+b.dataset.i);
      M.sfx.tap();
      render();
    };
    reset();
    render();
    return {
      async showMe() {
        const t = ++tok;
        reset();
        render();
        for (let i = 0; i < total; i++) {
          await M.sleep(260);
          if (t !== tok || !el.isConnected) return;
          give(i);
          M.sfx.tap();
          render();
        }
      },
    };
  };

  /* =====================================================================
     1. Compter par bonds
     ===================================================================== */
  register({
    id: 'compter-bonds',
    domain: 'nombres',
    title: 'Compter par bonds',
    icon: '🐸',
    desc: 'Compte par bonds de 2, de 5, de 10 ou de 100, en avançant ou en reculant.',
    pda: 'Nombres naturels A.1 a–c — compter, par bonds, à rebours',
    learn: 'grille-100',
    starter: true,
    gen({ lvl }) {
      let step,
        dir = 1;
      if (lvl === 0) step = P([1, 2, 2, 5, 5, 10, 10]);
      else if (lvl === 1) {
        step = P([2, 5, 10]);
        dir = Math.random() < 0.4 ? -1 : 1;
      } else {
        step = P([2, 5, 10, 100, 100]);
        dir = Math.random() < 0.5 ? -1 : 1;
      }
      const len = 5,
        span = step * (len - 1);
      let low;
      if (step === 100) low = 100 * R(0, 5) + P([0, 50]) || 50;
      else if (step === 1) low = 10 * R(1, 8) + R(6, 7);
      else {
        const lo = lvl === 2 ? 100 : 1,
          hi = (lvl === 0 ? 100 : lvl === 1 ? 200 : 999) - span;
        if (step === 5) low = alignPick(Math.max(5, lo), hi, 5);
        else if (step === 2 && lvl === 0) low = alignPick(2, hi, 2);
        else if (step === 10 && lvl === 0 && Math.random() < 0.5) low = alignPick(10, hi, 10);
        else low = R(lo, hi);
      }
      let terms = M.range(0, len - 1).map((i) => low + i * step);
      if (dir < 0) terms = terms.reverse();
      const miss = lvl === 0 ? R(2, 4) : lvl === 1 ? R(1, 4) : R(0, 4);
      const ans = terms[miss];
      let pi = 0;
      while (pi === miss || pi + 1 === miss) pi++;
      const intro = lvl === 0 ? `On compte par bonds de ${step}. Quel nombre manque ?` : 'Trouve la régularité. Quel nombre manque ?';
      const prompt = `${intro}<div class="eq nb-seq">${terms.map((t, i) => (i === miss ? '{?}' : `<span>${t}</span>`)).join('<span class="op">,</span>')}</div>`;
      const move = dir > 0 ? 'avance' : 'recule';
      const hint =
        lvl === 0
          ? `Chaque nombre a ${step} de ${dir > 0 ? 'plus' : 'moins'} que celui d'avant.`
          : `Compare deux voisins : ${terms[pi]} et ${terms[pi + 1]}. De combien on ${move} à chaque bond ?`;
      let tip = '';
      if (step === 10) tip = 'Avec des bonds de 10, le chiffre des unités ne change jamais !';
      else if (step === 100) tip = 'Avec des bonds de 100, seul le chiffre des centaines change !';
      else if (step === 5) tip = 'Avec des bonds de 5, les nombres finissent toujours par 0 ou par 5.';
      else if (step === 2)
        tip =
          low % 2
            ? "Avec des bonds de 2 à partir d'un nombre impair, on reste sur les nombres impairs."
            : "Avec des bonds de 2 à partir d'un nombre pair, on reste sur les nombres pairs.";
      const explain = `On ${move} de ${step} à chaque bond${dir < 0 ? ' (à rebours)' : ''} : ${terms.map((t, i) => (i === miss ? `<b>${t}</b>` : t)).join(', ')}. ${tip}`;
      let viz, showMe;
      if (step === 100) {
        const marks = {};
        terms.forEach((t, i) => {
          marks[t] = i === miss ? '?' : String(t);
        });
        const base = {
          lo: 0,
          hi: 1000,
          labelEvery: 100,
          tickEvery: 10,
          hideLabels: terms.slice(),
          marks,
          start: terms[0],
          end: terms[len - 1],
          step: 100,
          buttons: [-100, 100],
          hint: 'Fais sauter la grenouille par bonds de 100 avec les boutons.',
        };
        viz = (el) => M.viz.numberLine(el, base);
        showMe = (el) => M.viz.numberLine(el, Object.assign({}, base, { interactive: false })).showMe();
      } else {
        const b = NB.gridBounds(terms),
          hl = {};
        terms.forEach((t, i) => {
          if (i !== miss) hl[t] = 'k1';
        });
        viz = (el) =>
          NB.grid(el, { from: b.from, to: b.to, hl, hint: 'Les nombres de la suite sont en jaune. Touche une case pour la colorier.' });
        showMe = (el) => {
          const g = NB.grid(el, { from: b.from, to: b.to, hl: {}, tap: false });
          return g.play(
            terms,
            (v, i) => (i === miss ? 'k4' : 'k1'),
            (v, i) => (i === 0 ? `On part de <b>${v}</b>` : `${terms[i - 1]} ${dir > 0 ? '+' : '−'} ${step} = <b>${v}</b>`),
            650,
          );
        };
      }
      return {
        prompt,
        say: `${intro} ${terms.map((t, i) => (i === miss ? 'combien' : t)).join(', ')}`,
        input: 'number',
        answer: ans,
        viz,
        showMe,
        hint,
        explain,
      };
    },
  });

  /* =====================================================================
     2. Dénombrer une collection groupée
     ===================================================================== */
  register({
    id: 'denombrer',
    domain: 'nombres',
    title: 'Compter une collection',
    icon: '📦',
    desc: 'Compte vite en utilisant les paquets de 10 et de 100.',
    pda: 'Nombres naturels A.2 c–d, A.4 a–b — dénombrer des collections groupées',
    learn: 'nombres-1000',
    starter: true,
    gen({ lvl }) {
      let c = 0,
        d,
        u,
        em = null;
      if (lvl === 0) {
        em = P(EMO);
        d = R(1, 9);
        u = R(0, 9);
        if (d * 10 + u < 12) u = R(2, 9);
      } else if (lvl === 1) {
        if (Math.random() < 0.5) {
          em = P(EMO);
          d = R(1, 7);
          u = R(10, 16);
        } else {
          c = R(0, 3);
          d = R(0, 9);
          u = R(0, 9);
          if (!c && d < 2) d = R(2, 9);
        }
      } else {
        c = R(1, 8);
        d = R(0, 9);
        u = R(0, 9);
        const t = R(0, 2);
        if (t === 1 && c <= 7) d = R(10, 13);
        else if (t === 2) u = R(10, 14);
      }
      const total = c * 100 + d * 10 + u;
      const name = em ? EMO_NAME[em] : '';
      const prompt = em
        ? `Combien y a-t-il ${de(name)} en tout ?<br><small class="muted">Chaque sac contient 10 ${em}.</small>`
        : 'Quel nombre ces blocs représentent-ils ?<br><small class="muted">Plaque = 100 · barre = 10 · cube = 1</small>';
      let explain, hint;
      if (em) {
        hint = `Compte les sacs par bonds de 10 : 10, 20, 30… Puis ajoute les ${name} ${seul(em)} un par un.`;
        explain =
          u >= 10
            ? `Les ${u} ${name} ${seul(em)} font 1 sac de 10 et ${u - 10} de plus. Ça fait ${qty(d + 1, 'sac')} de 10 (${(d + 1) * 10}) et ${u - 10} : <b>${total}</b>.`
            : `${qty(d, 'sac')} de 10, c'est ${d * 10}. ${d * 10} + ${u} = <b>${total}</b>.`;
      } else {
        hint = 'Compte les plaques par bonds de 100, les barres par bonds de 10, puis les cubes un par un.';
        const parts = [];
        if (c) parts.push(`${qty(c, 'centaine')} = ${c * 100}`);
        if (d) parts.push(`${qty(d, 'dizaine')} = ${d * 10}`);
        if (u) parts.push(`${qty(u, 'unité')} = ${u}`);
        let extra = '';
        if (d >= 10) extra = ` (10 dizaines, c'est 1 centaine de plus !)`;
        if (u >= 10) extra = ` (10 unités, c'est 1 dizaine de plus !)`;
        explain = `${parts.join(', ')}. ${[c * 100, d * 10, u].filter((x) => x).join(' + ')} = <b>${total}</b>${extra}.`;
      }
      const opts = { c, d, u, emoji: em };
      return {
        prompt,
        say: M.text(prompt),
        input: 'number',
        answer: total,
        viz: (el) => NB.collect(el, opts),
        showMe: (el) => NB.collect(el, opts).showMe(),
        hint,
        explain,
      };
    },
  });

  /* =====================================================================
     3. Lire et écrire les nombres
     ===================================================================== */
  function niceNumber(lvl) {
    if (lvl === 0) return Math.random() < 0.35 ? R(70, 99) : R(11, 99);
    if (lvl === 1) {
      const n = R(100, 999);
      return Math.random() < 0.3 ? n - (n % 10) : n;
    }
    const t = R(0, 3);
    if (t === 0) return 100 * R(1, 9) + R(70, 99);
    if (t === 1) return 100 * R(1, 9) + R(1, 9);
    if (t === 2) return 100 * R(1, 9) + 80;
    return R(100, 999);
  }
  function wordDistractors(n) {
    const { c, d, u } = cdu(n),
      s = [n + 10, n - 10, n + 1, n - 1];
    if (n >= 100) {
      s.push(c * 100 + u * 10 + d, d * 100 + c * 10 + u, n + 100, n - 100, c * 100 + d);
      if (d === 0) s.push(c * 100 + u * 10);
    } else if (u) s.push(u * 10 + d);
    if (d === 7 || d === 9) s.push(n - 10);
    if (d === 8 && u === 0) s.push(n + 4, n - 60);
    return s.filter((x) => x > 0 && x < 1000 && x !== n);
  }
  register({
    id: 'lire-ecrire',
    domain: 'nombres',
    title: 'Lire et écrire les nombres',
    icon: '✏️',
    desc: 'Passe des mots aux chiffres et des chiffres aux mots.',
    pda: 'Nombres naturels A.3 — lire et écrire les nombres naturels',
    learn: 'nombres-1000',
    gen({ lvl }) {
      const n = niceNumber(lvl),
        w = M.frNum(n);
      const centPart = n % 100 ? w.slice(0, w.length - M.frNum(n % 100).length).trim() : w;
      const explain = `${NB.colored(n)} s'écrit « ${w} ». C'est ${NB.decompWords(n)}${n >= 100 ? ` : on lit d'abord les centaines (« ${centPart} »), puis le reste${n % 100 ? ` (« ${M.frNum(n % 100)} »)` : ''}` : ''}.`;
      if (Math.random() < 0.5) {
        return {
          prompt: `Écris ce nombre en chiffres :<div class="nb-words">${w}</div>`,
          say: `Écris ce nombre en chiffres : ${w}`,
          input: 'number',
          answer: n,
          viz: (el) => NB.builder(el, { hint: 'Construis le nombre avec les boutons + et −. Les mots changent en même temps !', start: 0 }),
          showMe: (el) => NB.builder(el, { start: 0 }).showMe(n),
          hint: n >= 100 ? `Cherche d'abord les centaines : « ${centPart} ».` : 'Le premier mot te dit les dizaines.',
          explain,
        };
      }
      return {
        prompt: `Comment écrit-on <span class="nb-big">${n}</span> en lettres ?`,
        say: `Comment écrit-on ${n} en lettres ?`,
        input: 'choice',
        answer: n,
        cols: 1,
        choices: mkChoices(n, wordDistractors(n), 4, (v) => M.frNum(v)),
        viz: (el) => {
          el.onclick = null;
          el.innerHTML = `<div class="viz-hint">Regarde chaque position du nombre.</div>${NB.tab([{ n }])}<div style="display:flex;justify-content:center;margin-top:8px">${NB.blocks(n, true)}</div><div class="viz-status" style="text-align:center">${n} = ${NB.expanded(n)}</div>`;
        },
        hint:
          n >= 100
            ? `Lis d'abord les centaines : ${Math.floor(n / 100) * 100}, puis le reste : ${n % 100}.`
            : `Pense aux dizaines : ${Math.floor(n / 10) * 10}, puis aux unités.`,
        explain,
      };
    },
  });

  /* =====================================================================
     4. Valeur de position
     ===================================================================== */
  function distinctDigits(lo, hi, noZero = true) {
    for (let g = 0; g < 200; g++) {
      const n = R(lo, hi),
        s = String(n);
      if (new Set(s).size === s.length && (!noZero || !s.includes('0'))) return n;
    }
    return lo === 10 ? 47 : 347;
  }
  register({
    id: 'valeur-position',
    domain: 'nombres',
    title: 'Unités, dizaines, centaines',
    icon: '🏠',
    desc: 'Trouve la place et la valeur de chaque chiffre.',
    pda: 'Nombres naturels A.4 b–c — valeur de position (unités, dizaines, centaines)',
    learn: 'nombres-1000',
    starter: true,
    gen({ lvl }) {
      const type = lvl === 0 ? P(['pos', 'pos', 'build']) : lvl === 1 ? P(['pos', 'val', 'build']) : P(['pos', 'val', 'tot', 'tot']);
      if (type === 'build') {
        const three = lvl > 0;
        const n = three ? distinctDigits(100, 999) : distinctDigits(10, 99);
        const g = cdu(n);
        let parts = three ? [qty(g.c, 'centaine'), qty(g.d, 'dizaine'), qty(g.u, 'unité')] : [qty(g.d, 'dizaine'), qty(g.u, 'unité')];
        const mixed = lvl === 1 && Math.random() < 0.5;
        if (mixed) parts = M.shuffle(parts);
        return {
          prompt: `Quel nombre a ${joinFr(parts)} ?`,
          input: 'number',
          answer: n,
          viz: (el) => NB.builder(el, { hint: 'Construis le nombre avec les boutons + et −.', words: false }),
          showMe: (el) => NB.builder(el, { words: false }).showMe(n),
          hint: mixed
            ? "Attention à l'ordre des mots ! Place chaque partie dans la bonne colonne : centaines, dizaines, unités."
            : "Les dizaines s'écrivent à gauche des unités.",
          explain: `${joinFr(parts)} : ${three ? `${g.c * 100} + ` : ''}${g.d * 10} + ${g.u} = <b>${n}</b>.`,
        };
      }
      const n =
        lvl === 0
          ? distinctDigits(10, 99)
          : lvl === 1
            ? distinctDigits(100, 999)
            : Math.random() < 0.4
              ? 100 * R(1, 9) + R(1, 9) * (Math.random() < 0.5 ? 1 : 10)
              : R(100, 999);
      const g = cdu(n);
      const keys = n >= 100 ? ['c', 'd', 'u'] : ['d', 'u'];
      const pv = (el) => NB.place(el, n, { breakC: type === 'tot' });
      if (type === 'pos') {
        const k = P(keys);
        return {
          prompt: `Dans <span class="nb-big">${n}</span>, quel chiffre est à la position des <b>${NAMES[k]}</b> ?`,
          input: 'number',
          answer: g[k],
          viz: pv,
          showMe: (el) => NB.place(el, n).showMe(k),
          hint:
            n >= 100
              ? 'De droite à gauche : unités, dizaines, centaines.'
              : 'Le chiffre de droite, ce sont les unités. Celui de gauche, les dizaines.',
          explain: `${NB.colored(n)}, c'est ${NB.decompWords(n)}. Le chiffre des ${NAMES[k]} est <b>${g[k]}</b>.`,
        };
      }
      if (type === 'val') {
        const ks = keys.filter((k) => g[k] !== 0 && keys.filter((j) => g[j] === g[k]).length === 1);
        const k = P(ks.length ? ks : ['c']);
        const dg = g[k],
          ans = dg * VAL[k];
        const ch = [dg, dg * 10, dg * 100].map((v) => ({ label: String(v), value: v }));
        return {
          prompt: `Dans <span class="nb-big">${n}</span>, que vaut le chiffre <b>${dg}</b> ?`,
          input: 'choice',
          answer: ans,
          choices: ch,
          cols: 3,
          viz: pv,
          showMe: (el) => NB.place(el, n).showMe(k),
          hint: `Dans quelle colonne est le ${dg} ? Unités, dizaines ou centaines ?`,
          explain: `Le ${dg} est à la position des ${NAMES[k]} : il vaut ${qty(dg, NAME1[k])}, donc <b>${ans}</b>. ${n} = ${NB.expanded(n)}.`,
        };
      }
      // tot : combien de dizaines en tout
      const ans = Math.floor(n / 10);
      return {
        prompt: `Combien de dizaines y a-t-il <b>en tout</b> dans <span class="nb-big">${n}</span> ?<br><small class="muted">N'oublie pas : 1 centaine = 10 dizaines.</small>`,
        input: 'number',
        answer: ans,
        viz: pv,
        showMe: (el) => NB.place(el, n, { breakC: true }).showMe('d', true),
        hint: `Change les ${qty(g.c, 'centaine')} en dizaines : ${g.c} × 10 dizaines. Puis ajoute les ${g.d} autres.`,
        explain: `${qty(g.c, 'centaine')} = ${g.c * 10} dizaines. ${g.c * 10} + ${g.d} = <b>${ans}</b> dizaines en tout. Truc : c'est le nombre formé par les chiffres des centaines et des dizaines (<b>${ans}</b>).`,
      };
    },
  });

  /* =====================================================================
     5. Composer et décomposer
     ===================================================================== */
  register({
    id: 'decomposer',
    domain: 'nombres',
    title: 'Composer et décomposer',
    icon: '🧩',
    desc: 'Sépare un nombre en morceaux et recolle-les.',
    pda: 'Nombres naturels A.5, A.6 — composer, décomposer, expressions équivalentes',
    learn: 'nombres-1000',
    gen({ lvl }) {
      let n,
        prompt,
        ans,
        parts,
        hint,
        explain,
        splitOpts = {},
        smOpts = {};
      if (lvl === 0) {
        const d = R(1, 9),
          u = R(1, 9);
        n = d * 10 + u;
        const t = R(0, 3);
        if (t === 0) {
          prompt = `${d * 10} + ${u} = {?}`;
          ans = n;
          parts = [d * 10, u];
        } else if (t === 1) {
          prompt = `${u} + ${d * 10} = {?}`;
          ans = n;
          parts = [u, d * 10];
        } else if (t === 2) {
          prompt = `${n} = ${d * 10} + {?}`;
          ans = u;
          parts = [d * 10];
        } else {
          prompt = `${n} = {?} + ${u}`;
          ans = d * 10;
          parts = [u];
        }
        hint = `${n}, c'est ${NB.decompWords(n)}.`;
        explain = `${n}, c'est ${NB.decompWords(n)} : ${n} = ${d * 10} + ${u}.`;
      } else if (lvl === 1) {
        const c = R(1, 9),
          d = R(0, 9),
          u = R(0, 9);
        n = c * 100 + d * 10 + u;
        const t = R(0, 3);
        const terms = [c * 100, d * 10, u].filter((x) => x);
        if (t === 0 || terms.length < 3) {
          const tt = t === 0 && Math.random() < 0.4 ? M.shuffle(terms) : terms;
          prompt = `${tt.join(' + ')} = {?}`;
          ans = n;
          parts = tt;
        } else if (t === 1) {
          prompt = `${n} = ${c * 100} + {?} + ${u}`;
          ans = d * 10;
          parts = [c * 100, u];
        } else if (t === 2) {
          prompt = `${n} = {?} + ${d * 10} + ${u}`;
          ans = c * 100;
          parts = [d * 10, u];
        } else {
          prompt = `${n} = ${c * 100} + ${d * 10} + {?}`;
          ans = u;
          parts = [c * 100, d * 10];
        }
        hint = `${n}, c'est ${NB.decompWords(n)}.`;
        explain = `${NB.colored(n)}, c'est ${NB.decompWords(n)} : ${n} = ${NB.expanded(n)}.`;
      } else {
        const t = R(0, 2);
        if (t === 0) {
          const d = R(2, 9),
            u = R(0, 9);
          n = d * 10 + u;
          const k = R(1, Math.min(3, d - 1));
          prompt = `${n} = ${(d - k) * 10} + {?}`;
          ans = k * 10 + u;
          parts = [(d - k) * 10];
          hint = `Colorie ${(d - k) * 10} dans les blocs. Combien reste-t-il ?`;
          explain = `${n} = ${d * 10} + ${u}. Si on prend seulement ${(d - k) * 10}, il reste ${qty(k, 'dizaine')} et ${qty(u, 'unité')} : ${k * 10} + ${u} = <b>${ans}</b>. Donc ${n} = ${(d - k) * 10} + ${ans}.`;
        } else if (t === 1) {
          const c = R(2, 9),
            d = R(0, 9),
            u = R(1, 9);
          n = c * 100 + d * 10 + u;
          prompt = `${n} = ${(c - 1) * 100} + {?} + ${u}`;
          ans = 100 + d * 10;
          parts = [(c - 1) * 100, u];
          hint = `Il manque 1 centaine et ${qty(d, 'dizaine')}.`;
          explain = `${n} = ${NB.expanded(n)}. Avec seulement ${(c - 1) * 100}, il manque 100 + ${d * 10} = <b>${ans}</b>. Donc ${n} = ${(c - 1) * 100} + ${ans} + ${u}.`;
        } else {
          const c = R(1, 9),
            d = R(0, 9),
            u = R(0, 9);
          n = c * 100 + d * 10 + u;
          prompt = `<span style="font-size:.6em">${n} = ${qty(c - 1, 'centaine')} + {?} dizaines + ${qty(u, 'unité')}</span>`;
          ans = 10 + d;
          parts = [];
          splitOpts = { breakable: true };
          smOpts = { breakFirst: 100, end: `Il y a maintenant <b>${ans}</b> barres de dizaines.` };
          hint = 'Casse 1 centaine en 10 dizaines. Combien de barres de dizaines as-tu maintenant ?';
          explain = `On casse 1 centaine en 10 dizaines : ${qty(c - 1, 'centaine')}, ${d} + 10 = <b>${ans}</b> dizaines et ${qty(u, 'unité')}. Ça fait toujours ${n} !`;
        }
      }
      if (!splitOpts.breakable && lvl === 2) splitOpts.breakable = true;
      const known = parts.reduce((a, b) => a + b, 0);
      if (!smOpts.end)
        smOpts.end = known === n ? `Tout est colorié : <b>${n}</b>` : `Colorié : ${known} · Pas colorié : <b>${n - known}</b>`;
      return {
        prompt: `<div class="eq">${prompt}</div>`,
        say: M.text(prompt.replace('{?}', '▢')),
        input: 'number',
        answer: ans,
        viz: (el) => NB.split(el, n, splitOpts),
        showMe: (el) => NB.split(el, n, splitOpts).showMe(parts, smOpts),
        hint,
        explain,
      };
    },
  });

  /* =====================================================================
     6. Comparer
     ===================================================================== */
  const SYM_CHOICES = [
    { label: '<span class="nb-chs"><b>&lt;</b><small>plus petit que</small></span>', value: '<' },
    { label: '<span class="nb-chs"><b>&gt;</b><small>plus grand que</small></span>', value: '>' },
    { label: '<span class="nb-chs"><b>=</b><small>égal à</small></span>', value: '=' },
  ];
  register({
    id: 'comparer',
    domain: 'nombres',
    title: 'Comparer des nombres',
    icon: '🐊',
    desc: 'Choisis le bon signe : <, > ou =.',
    pda: 'Nombres naturels A.7 — comparer des nombres (<, >, =)',
    learn: 'nombres-1000',
    gen({ lvl }) {
      let a, b, la, lb;
      const eq = Math.random() < (lvl === 2 ? 0.25 : 0.1);
      if (lvl === 0) {
        a = R(10, 99);
        b = eq ? a : Math.random() < 0.5 ? Math.floor(a / 10) * 10 + R(0, 9) : R(10, 99);
        if (!eq && b === a) b = a === 99 ? 98 : a + 1;
      } else if (lvl === 1) {
        a = R(100, 999);
        const t = R(0, 2);
        if (eq) b = a;
        else if (t === 0) b = Math.floor(a / 100) * 100 + R(0, 99);
        else if (t === 1) {
          const g = cdu(a);
          b = g.c * 100 + g.u * 10 + g.d;
        } else b = R(100, 999);
        if (!eq && b === a) b = a === 999 ? 989 : a + 10 > 999 ? a - 10 : a + 10;
      } else {
        a = R(100, 999);
        if (eq) b = a;
        else {
          b = Math.random() < 0.5 ? cdu(a).c * 100 + cdu(a).u * 10 + cdu(a).d : Math.floor(a / 100) * 100 + R(0, 99);
          if (b === a) b = a + 1 > 999 ? a - 1 : a + 1;
        }
        // un côté écrit en morceaux (parfois dans le désordre)
        const parts = NB.expanded(b).split(' + ');
        lb = (Math.random() < 0.5 ? M.shuffle(parts) : parts).join(' + ');
        if (Math.random() < 0.5) {
          [a, b] = [b, a];
          la = lb;
          lb = undefined;
        }
      }
      la = la || String(a);
      lb = lb || String(b);
      const s = NB.sym(a, b);
      const A = cdu(a),
        B = cdu(b);
      let why = '';
      for (const k of ['c', 'd', 'u']) {
        if (A[k] !== B[k]) {
          why = `Aux ${NAMES[k]}, ${Math.max(A[k], B[k])} est plus grand que ${Math.min(A[k], B[k])}.`;
          break;
        }
      }
      if (!why) why = 'Les deux nombres ont les mêmes centaines, dizaines et unités.';
      const note = lvl === 2 ? `${la !== String(a) ? `${la} = ${a}. ` : ''}${lb !== String(b) ? `${lb} = ${b}. ` : ''}` : '';
      return {
        prompt: `Quel signe va dans la case ?<div class="eq">${la} <span class="nb-qbox">?</span> ${lb}</div>`,
        say: `Quel signe va entre ${M.text(la)} et ${M.text(lb)} ?`,
        input: 'choice',
        answer: s,
        choices: SYM_CHOICES.slice(),
        cols: 3,
        viz: (el) => NB.compare(el, a, b, { la, lb }),
        showMe: (el) => NB.compare(el, a, b, { la, lb }).showMe(),
        hint: `🐊 La bouche du crocodile s'ouvre vers le plus grand nombre. Compare d'abord les ${Math.max(a, b) >= 100 ? 'centaines' : 'dizaines'}.`,
        explain: `${note}${why} Donc ${la} ${NB.symHtml(s)} ${lb}.${s !== '=' ? " 🐊 La bouche s'ouvre vers le plus grand." : ''}`,
      };
    },
  });

  /* =====================================================================
     7. Ordonner
     ===================================================================== */
  register({
    id: 'ordonner',
    domain: 'nombres',
    title: 'Mettre en ordre',
    icon: '📶',
    desc: "Place des nombres du plus petit au plus grand, ou l'inverse.",
    pda: 'Nombres naturels A.8 — ordre croissant et décroissant',
    learn: 'nombres-1000',
    gen({ lvl }) {
      const cnt = lvl === 0 ? 3 : 4;
      const set = new Set();
      let guard = 0;
      if (lvl === 2 && Math.random() < 0.6) {
        const ds = M.shuffle(M.range(1, 9)).slice(0, 3);
        const perms = [
          [0, 1, 2],
          [0, 2, 1],
          [1, 0, 2],
          [1, 2, 0],
          [2, 0, 1],
          [2, 1, 0],
        ];
        M.shuffle(perms)
          .slice(0, cnt)
          .forEach((p) => set.add(ds[p[0]] * 100 + ds[p[1]] * 10 + ds[p[2]]));
      } else if (lvl === 2) {
        const c = R(1, 9);
        while (set.size < cnt && guard++ < 100) set.add(c * 100 + R(0, 99));
      }
      while (set.size < cnt && guard++ < 200)
        set.add(lvl === 0 ? R(10, 99) : lvl === 1 ? (Math.random() < 0.5 ? R(10, 999) : R(100, 999)) : R(100, 999));
      const nums = M.shuffle([...set]);
      const up = lvl === 0 ? Math.random() < 0.75 : Math.random() < 0.5;
      const sorted = nums.slice().sort((x, y) => (up ? x - y : y - x));
      const word = up ? 'croissant' : 'décroissant';
      const desc = up ? 'du plus petit au plus grand' : 'du plus grand au plus petit';
      const big = nums.some((x) => x >= 100);
      return {
        prompt: `Place les nombres dans l'ordre <b>${word}</b> (${desc}).`,
        input: 'order',
        answer: sorted,
        choices: nums.map((v) => ({ label: String(v), value: v })),
        viz: (el) => {
          el.onclick = null;
          el.innerHTML = `<div class="viz-hint">Compare ${big ? 'les centaines, puis ' : ''}les dizaines, puis les unités.</div>${NB.tab(nums.map((n) => ({ n })))}`;
        },
        showMe: async (el) => {
          el.onclick = null;
          for (let i = 1; i <= sorted.length; i++) {
            if (!el.isConnected) return;
            el.innerHTML = `<div class="viz-hint">Dans l'ordre ${word} ${up ? '⬆️' : '⬇️'}</div>${NB.tab(sorted.slice(0, i).map((n, j) => ({ n, label: `${j + 1}<sup>${j ? 'e' : 'er'}</sup>` })))}`;
            M.sfx.hop();
            await M.sleep(600);
          }
        },
        hint: `Trouve d'abord le plus ${up ? 'petit' : 'grand'} nombre. Regarde les ${big ? 'centaines' : 'dizaines'} en premier.`,
        explain: `Dans l'ordre ${word} : ${sorted.join(up ? ' &lt; ' : ' &gt; ')}. On compare ${big ? 'les centaines, puis ' : ''}les dizaines, puis les unités.`,
      };
    },
  });

  /* =====================================================================
     8. Pair ou impair
     ===================================================================== */
  const PAIR_CH = [
    { label: 'Pair 👫', value: 'pair' },
    { label: 'Impair 🧍', value: 'impair' },
  ];
  const ruleCard =
    '<div class="nb-card">👫 <b>Pair</b> : finit par 0, 2, 4, 6 ou 8.<br>🧍 <b>Impair</b> : finit par 1, 3, 5, 7 ou 9.</div>';
  register({
    id: 'pair-impair',
    domain: 'nombres',
    title: 'Pair ou impair ?',
    icon: '👫',
    desc: "Fais des paires : reste-t-il quelqu'un tout seul ?",
    pda: 'Nombres naturels A.9, A.11 a — nombres pairs et impairs',
    learn: 'grille-100',
    gen({ lvl }) {
      if (lvl === 2 && Math.random() < 0.5) {
        const want = P(['pair', 'impair']),
          par = want === 'pair' ? 0 : 1;
        const set = new Set();
        let good;
        do {
          good = R(10, 999);
        } while (good % 2 !== par);
        set.add(good);
        while (set.size < 4) {
          const x = R(10, 999);
          if (x % 2 !== par) set.add(x);
        }
        const nums = M.shuffle([...set]);
        return {
          prompt: `Lequel de ces nombres est <b>${want}</b> ?`,
          input: 'choice',
          answer: good,
          choices: nums.map((v) => ({ label: String(v), value: v })),
          viz: (el) => {
            el.onclick = null;
            el.innerHTML = `<div class="viz-hint">Pour savoir si un nombre est pair, regarde seulement son chiffre des unités !</div>${ruleCard}`;
          },
          hint: 'Regarde le dernier chiffre de chaque nombre.',
          explain: `${good} finit par ${good % 10}, donc il est ${want}. Les autres finissent par un chiffre ${want === 'pair' ? 'impair' : 'pair'}.`,
        };
      }
      const n = lvl === 0 ? R(2, 20) : lvl === 1 ? R(21, 99) : R(100, 999);
      const ans = n % 2 ? 'impair' : 'pair';
      let explain;
      if (n <= 20)
        explain = `${n} points, ça fait ${qty(Math.floor(n / 2), 'paire')}${n % 2 ? ' et 1 point tout seul' : " et personne n'est seul"}. Donc ${n} est <b>${ans}</b>.`;
      else
        explain = `Les dizaines se partagent toujours en paires. Seul le chiffre des unités compte : ${n} finit par ${n % 10}, qui est ${ans}. Donc ${n} est <b>${ans}</b>.`;
      const u = n % 10;
      // ≥ 100 : on se concentre sur le chiffre des unités
      const bigViz = (el, demo) => {
        el.onclick = null;
        el.innerHTML = `<div class="viz-hint">Seul le chiffre des unités compte ! ${n} finit par ${u}.</div>${ruleCard}${u ? `<div class="viz-hint" style="margin-top:10px">Fais des paires avec ${u} ${pl(u, 'point')} :</div><div class="nb-pv"></div>` : ''}`;
        const pv = M.$('.nb-pv', el);
        if (pv) {
          const h = NB.pairs(pv, u);
          if (demo) h.showMe();
        }
      };
      return {
        prompt: `Le nombre <span class="nb-big">${n}</span> est-il pair ou impair ?`,
        input: 'choice',
        answer: ans,
        choices: PAIR_CH.slice(),
        viz: n < 100 ? (el) => NB.pairs(el, n) : (el) => bigViz(el, false),
        showMe: n < 100 ? (el) => NB.pairs(el, n).showMe() : (el) => bigViz(el, true),
        hint: n <= 20 ? 'Fais des paires avec les points. Reste-t-il un point tout seul ?' : 'Regarde seulement le chiffre des unités.',
        explain,
      };
    },
  });

  /* =====================================================================
     9. Situer sur une droite numérique / dans une grille
     ===================================================================== */
  register({
    id: 'situer-droite',
    domain: 'nombres',
    title: 'Droite et grille de nombres',
    icon: '📍',
    desc: 'Trouve le nombre caché sur la droite numérique ou dans la grille.',
    pda: 'Nombres naturels A.10 — droite numérique, grille de nombres',
    learn: 'grille-100',
    gen({ lvl }) {
      if (Math.random() < 0.4) {
        // fragment de grille de nombres
        const n = lvl === 2 ? 100 * R(1, 8) + 10 * R(1, 8) + R(2, 9) : 10 * R(1, 8) + R(2, 9);
        const offs = lvl === 0 ? [-10, 10, -1, 1] : [-10, 10, -1, 1, -11, -9, 9, 11];
        const off = P(offs);
        const others = M.shuffle([-10, 10, -1, 1].filter((x) => x !== off)).slice(0, lvl === 0 ? 2 : 1);
        const pos = { '-11': [0, 0], '-10': [0, 1], '-9': [0, 2], '-1': [1, 0], 0: [1, 1], 1: [1, 2], 9: [2, 0], 10: [2, 1], 11: [2, 2] };
        const cell = {};
        cell[pos[0]] = `<td class="k">${n}</td>`;
        cell[pos[off]] = '<td class="q">?</td>';
        others.forEach((x) => {
          cell[pos[x]] = `<td>${n + x}</td>`;
        });
        let tbl = '<table class="nb-frag">';
        for (let r = 0; r < 3; r++) {
          tbl += '<tr>';
          for (let c = 0; c < 3; c++) tbl += cell[[r, c]] || '<td class="e"></td>';
          tbl += '</tr>';
        }
        tbl += '</table>';
        const ans = n + off;
        const dirs = {
          '-10': 'au-dessus (−10)',
          10: 'en dessous (+10)',
          '-1': 'à gauche (−1)',
          1: 'à droite (+1)',
          '-11': 'en haut à gauche (−10 puis −1)',
          '-9': 'en haut à droite (−10 puis +1)',
          9: 'en bas à gauche (+10 puis −1)',
          11: 'en bas à droite (+10 puis +1)',
        };
        const rules = (hl) =>
          `<div class="nb-ruleg">${[-11, -10, -9, -1, 0, 1, 9, 10, 11].map((x) => (x === 0 ? `<div class="c">${n}</div>` : `<div class="${x === hl ? 'hl' : ''}">${lvl === 0 && Math.abs(x) % 10 && Math.abs(x) > 1 ? '' : (x > 0 ? '+' : '−') + Math.abs(x)}</div>`)).join('')}</div>`;
        return {
          prompt: `Voici un morceau de la grille de nombres. Quel nombre va dans la case <b style="color:var(--red)">?</b>${tbl}`,
          say: "Voici un morceau de la grille de nombres. Quel nombre va dans la case point d'interrogation ?",
          input: 'number',
          answer: ans,
          viz: (el) => {
            el.onclick = null;
            el.innerHTML = `<div class="viz-hint">Dans la grille : vers la droite +1, vers la gauche −1, vers le bas +10, vers le haut −10.</div>${rules(null)}`;
          },
          showMe: (el) => {
            el.innerHTML = `<div class="viz-hint">La case ? est ${dirs[off]} de ${n}.</div>${rules(off)}<div class="viz-status" style="text-align:center">${n} ${off > 0 ? '+' : '−'} ${Math.abs(off)} = <b>${ans}</b></div>`;
            M.sfx.hop();
          },
          hint: `La case ? est ${dirs[off]} de ${n}.`,
          explain: `Dans la grille, on ajoute 1 vers la droite et 10 vers le bas. La case ? est ${dirs[off]} de ${n} : ${n} ${off > 0 ? '+' : '−'} ${Math.abs(off)} = <b>${ans}</b>.`,
        };
      }
      // droite numérique
      let lo, hi, labelEvery, tickEvery, v, unit;
      if (lvl === 0) {
        lo = 10 * R(0, 5);
        hi = lo + 20;
        labelEvery = 5;
        tickEvery = 1;
        unit = 1;
      } else if (lvl === 1) {
        lo = 10 * R(0, 15);
        hi = lo + 50;
        labelEvery = 10;
        tickEvery = 1;
        unit = 1;
      } else if (Math.random() < 0.5) {
        lo = 0;
        hi = 1000;
        labelEvery = 100;
        tickEvery = 50;
        unit = 50;
      } else {
        lo = 100 * R(1, 8);
        hi = lo + 100;
        labelEvery = 10;
        tickEvery = 5;
        unit = 5;
      }
      const hideLabel = Math.random() < 0.3;
      if (hideLabel) v = labelEvery * R(lo / labelEvery + 1, hi / labelEvery - 1);
      else {
        do {
          v = lo + unit * R(1, (hi - lo) / unit - 1);
        } while (v % labelEvery === 0);
      }
      const base = v % labelEvery === 0 ? v - labelEvery : Math.floor(v / labelEvery) * labelEvery;
      const k = (v - base) / unit;
      const opts = { lo, hi, labelEvery, tickEvery, arrowAt: v, hideLabels: [v], interactive: false };
      return {
        prompt: 'Regarde la droite numérique. Quel nombre est sous la flèche <b style="color:var(--red)">?</b>',
        input: 'number',
        answer: v,
        viz: (el) =>
          M.viz.numberLine(
            el,
            Object.assign({ hint: unit === 1 ? 'Chaque petit trait vaut 1 de plus.' : `Chaque petit trait vaut ${unit} de plus.` }, opts),
          ),
        showMe: (el) => M.viz.numberLine(el, Object.assign({}, opts, { start: base, end: v, step: unit })).showMe(),
        hint: `Pars de ${base} et avance de ${unit} à chaque petit trait.`,
        explain: `La flèche est ${k} ${pl(k, 'petit trait', 'petits traits')} après ${base}. Chaque trait vaut ${unit}, donc ${base} + ${k * unit} = <b>${v}</b>.`,
      };
    },
  });

  /* =====================================================================
     10. Estimer
     ===================================================================== */
  register({
    id: 'estimer',
    domain: 'nombres',
    title: 'Estimer une quantité',
    icon: '👀',
    desc: 'Environ combien ? Devine intelligemment sans tout compter.',
    pda: "Nombres naturels A.13 — approximer la taille d'une collection",
    learn: 'nombres-1000',
    gen({ lvl }) {
      const options = lvl === 0 ? [10, 30, 100] : lvl === 1 ? [20, 50, 100, 200] : [25, 50, 100, 200];
      const target = lvl === 0 ? P(options) : P(options.slice(0, 3));
      const n = Math.max(3, Math.round(target * (1 + (Math.random() * 0.2 - 0.1))));
      const em = P(EMO);
      const name = EMO_NAME[em];
      return {
        prompt: `<b>Environ</b> combien ${de(name)} y a-t-il ?<br><small class="muted">Ne compte pas un par un : fais une estimation !</small>`,
        input: 'choice',
        answer: target,
        choices: options.map((v) => ({ label: `environ ${v}`, value: v })),
        cols: options.length === 3 ? 3 : 2,
        viz: (el) => NB.scatter(el, n, em),
        showMe: (el) => NB.scatter(el, n, em).showMe(),
        hint: 'Regarde les 10 objets du modèle. Combien de fois 10 vois-tu à peu près ?',
        explain: `Il y en a exactement ${n}. La réponse la plus proche est <b>environ ${target}</b>. Truc : imagine des paquets de 10 et compte les paquets !`,
      };
    },
  });

  /* =====================================================================
     11. Fractions
     ===================================================================== */
  const KINDS = {
    pizza: { de: 'de la pizza', n: 'la pizza', N: 'La pizza', e: '🍕', f: true },
    tab: { de: 'de la tablette de chocolat', n: 'la tablette de chocolat', N: 'La tablette de chocolat', e: '🍫', f: true },
    carre: { de: 'du carré', n: 'le carré', N: 'Le carré', e: '⬜', f: false },
  };
  const allFracs = () => {
    const a = [];
    [2, 3, 4].forEach((n) => {
      for (let k = 1; k < n; k++) a.push(`${k}/${n}`);
    });
    return a;
  };
  // valeur d'une fraction : 2/4 = 1/2 → jamais deux fractions équivalentes dans les mêmes choix
  const fv = (s) => {
    const [k, n] = s.split('/').map(Number);
    return Math.round((k / n) * 1000);
  };
  const fracLabel = (s) => {
    const [k, n] = s.split('/').map(Number);
    return NB.fracName(k, n);
  };
  const nameRef =
    '<div class="nb-card">Pour parler de fraction, il faut des <b>parts égales</b> !<br>2 parts égales → des <b>demis</b><br>3 parts égales → des <b>tiers</b><br>4 parts égales → des <b>quarts</b></div>';
  register({
    id: 'fractions',
    domain: 'nombres',
    title: 'Les fractions',
    icon: '🍕',
    desc: 'Demi, tiers, quart : partage en parts égales.',
    pda: 'Fractions B.1–3 — partager un tout ou une collection en parts égales; demi, tiers, quart',
    learn: 'fractions',
    gen({ lvl }) {
      const type = lvl === 0 ? P(['nom', 'nom', 'egal']) : lvl === 1 ? P(['nom', 'pick', 'egal']) : P(['coll', 'coll', 'nom', 'pick']);
      const kind = P(['pizza', 'tab', 'carre']),
        K = KINDS[kind];
      if (type === 'egal') {
        const n = P([2, 3, 4]),
          equal = Math.random() < 0.5,
          w = NB.weights(n, equal);
        const variant = kind === 'carre' && equal ? R(0, n === 4 ? 2 : n === 2 ? 1 : 0) : 0;
        return {
          prompt: `${K.e} ${K.N} est-${K.f ? 'elle' : 'il'} partagé${K.f ? 'e' : ''} en <b>parts égales</b> ?`,
          say: `${K.N} est-${K.f ? 'elle' : 'il'} partagé${K.f ? 'e' : ''} en parts égales ?`,
          input: 'choice',
          answer: equal ? 'oui' : 'non',
          choices: [
            { label: '✔️ Oui, parts égales', value: 'oui' },
            { label: '✖️ Non, pas égales', value: 'non' },
          ],
          viz: (el) =>
            NB.fracTool(el, {
              kind,
              weights: w,
              variant,
              hint: 'Touche les parts pour les colorier et compare leurs grandeurs.',
              status: (k) => `Parts coloriées : <b>${k}</b>`,
            }),
          hint: 'Des parts égales ont toutes exactement la même grandeur.',
          explain: equal
            ? `Oui ! Les ${n} parts ont toutes la même grandeur : ce sont des ${FN[n][1]}.`
            : `Non ! Certaines parts sont plus grandes que d'autres. On ne peut pas parler de ${FN[n][1]} : il faut des parts égales.`,
        };
      }
      if (type === 'coll') {
        const n = P([2, 2, 3, 4]),
          m = R(2, n === 2 ? 6 : 4),
          total = n * m,
          em = P(['🍎', '🍓', '🍪', '🍒', '🐟', '🌼']);
        const nm = EMO_NAME[em];
        const what = n === 2 ? 'la moitié' : n === 3 ? 'le tiers' : 'le quart';
        return {
          prompt: `Combien ${de(nm)} y a-t-il dans <b>${what}</b> de ${total} ${nm} ?<div style="font-size:1.6rem;letter-spacing:2px;margin-top:6px">${em.repeat(total)}</div>`,
          say: `Combien ${de(nm)} y a-t-il dans ${what} de ${total} ${nm} ?`,
          input: 'number',
          answer: m,
          viz: (el) => NB.share(el, total, n, em),
          showMe: (el) => NB.share(el, total, n, em).showMe(),
          hint: `${what.charAt(0).toUpperCase() + what.slice(1)}, c'est une part quand on partage en ${n} parts égales. Utilise ${n} assiettes !`,
          explain: `On partage ${total} ${nm} en ${n} parts égales : chaque part a ${m} ${nm}. ${what.charAt(0).toUpperCase() + what.slice(1)} de ${total}, c'est <b>${m}</b>.`,
        };
      }
      if (type === 'pick') {
        const n = P([2, 3, 4]),
          k = lvl === 2 ? R(1, n - 1) : 1;
        const name = NB.fracName(k, n);
        const variantFor = (nn) => (kind === 'carre' ? (nn === 4 ? R(0, 2) : nn === 2 ? R(0, 1) : 0) : 0);
        const good = NB.shapeSvg(kind, NB.weights(n, true), M.shuffle(M.range(0, n - 1)).slice(0, k), {
          mini: true,
          variant: variantFor(n),
        });
        const otherN = P([2, 3, 4].filter((x) => x !== n && x >= k));
        const wrongN = NB.shapeSvg(kind, NB.weights(otherN, true), M.range(0, k - 1), { mini: true, variant: variantFor(otherN) });
        const uw = NB.weights(n, false);
        const wrongEq = NB.shapeSvg(kind, uw, M.range(0, k - 1), { mini: true });
        return {
          prompt: `Quelle image montre <b>${name}</b> colorié${k > 1 ? 's' : ''} ?`,
          input: 'choice',
          answer: 'a',
          cols: 3,
          choices: M.shuffle([
            { label: good, value: 'a' },
            { label: wrongN, value: 'b' },
            { label: wrongEq, value: 'c' },
          ]),
          viz: (el) => {
            el.onclick = null;
            el.innerHTML = `<div class="viz-hint">Rappel 🦫</div>${nameRef}`;
          },
          hint: `${name.charAt(0).toUpperCase() + name.slice(1)} : il faut ${n} parts <b>égales</b>, et ${k} colorié${k > 1 ? 'es' : 'e'}.`,
          explain: `${name.charAt(0).toUpperCase() + name.slice(1)}, c'est ${qty(k, 'part')} sur ${n} parts égales. Attention aux images où les parts ne sont pas égales !`,
        };
      }
      // nom : quelle fraction est coloriée ?
      const n = lvl === 0 ? P([2, 3, 4]) : P([2, 3, 3, 4, 4]);
      const k = lvl === 0 ? 1 : R(1, n - 1);
      const ans = `${k}/${n}`;
      const variant = kind === 'carre' ? (n === 4 ? R(0, 2) : n === 2 ? R(0, 1) : 0) : 0;
      const on = M.shuffle(M.range(0, n - 1)).slice(0, k);
      const w = NB.weights(n, true);
      const choices =
        lvl === 0
          ? ['1/2', '1/3', '1/4'].map((s) => ({ label: fracLabel(s), value: s }))
          : mkChoices(
              ans,
              M.shuffle(allFracs())
                .filter((s, i, a) => fv(s) !== fv(ans) && a.findIndex((t) => fv(t) === fv(s)) === i)
                .sort((x, y) => {
                  const sc = (s) => (s.split('/')[1] === String(n) || s.split('/')[0] === String(k) ? 0 : 1);
                  return sc(x) - sc(y);
                })
                .slice(0, 4),
              4,
              fracLabel,
            );
      return {
        prompt: `Quelle fraction ${K.de} est coloriée ?`,
        say: `Quelle fraction ${K.de} est coloriée ?`,
        input: 'choice',
        answer: ans,
        choices,
        cols: lvl === 0 ? 3 : 2,
        viz: (el) =>
          NB.fracTool(el, {
            kind,
            weights: w,
            on,
            variant,
            hint: 'Touche les parts pour colorier. Compte les parts coloriées et toutes les parts.',
          }),
        hint: `Compte toutes les parts égales : il y en a ${n}. Combien sont coloriées ?`,
        explain: `Il y a ${n} parts égales (des ${FN[n][1]}) et ${k} ${k > 1 ? 'sont coloriées' : 'est coloriée'} : c'est <b>${NB.fracName(k, n)}</b>.${n === 2 && k === 1 ? " Un demi, c'est la moitié !" : ''}`,
      };
    },
  });
})();
