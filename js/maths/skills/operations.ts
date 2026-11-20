/* =====================================================================
   skills/operations.js — Les opérations (PFEQ, Arithmétique)
   Sens des opérations + Opérations sur les nombres, 1er cycle
   ===================================================================== */

/** Stratégie de calcul suggérée (M.opStrat.add / sub). */
interface OpStrategy {
  key: string;
  name: string;
  txt: string;
}
interface OpStratApi {
  add(a: number, b: number): OpStrategy;
  sub(a: number, b: number): OpStrategy;
}
/** Terme d'un côté de la balance : valeur, retranchée (neg) ou inconnue (unk). */
interface OpBalanceTerm {
  v: number;
  neg?: boolean;
  unk?: boolean;
}
interface OpBalanceOpts {
  L: OpBalanceTerm[];
  R: OpBalanceTerm[];
  /** Valeur de l'inconnue (showMe). */
  ans?: number;
}
interface OpGroupsOpts {
  /** Nombre de groupes (ou de rangées). */
  g: number;
  /** Objets par groupe. */
  k: number;
  emoji: string;
  layout: 'groups' | 'array';
  box?: boolean;
}
/** Partage entre n enfants, ou boîtes de k (contenance). */
type OpShareOpts = { total: number; n: number; emoji: string; mode: 'share' } | { total: number; k: number; emoji: string; mode: 'boxes' };
interface OpCompareOpts {
  a: number;
  b: number;
  /** Noms des deux rangées. */
  na: string;
  nb: string;
  emoji: string;
}
interface OpBagPart {
  n: number;
  k: 'A' | 'B';
}
interface OpBagOpts {
  parts: OpBagPart[];
  emoji: string;
  /** Indices des objets barrés par showMe. */
  cross: number[];
  hint: string;
}
interface OpVizApi {
  balance(el: HTMLElement, o: OpBalanceOpts): ShowMeCtl;
  groups(el: HTMLElement, o: OpGroupsOpts): ShowMeCtl;
  share(el: HTMLElement, o: OpShareOpts): ShowMeCtl;
  compare(el: HTMLElement, o: OpCompareOpts): ShowMeCtl;
  bag(el: HTMLElement, o: OpBagOpts): ShowMeCtl;
}
interface MApi {
  opStrat: OpStratApi;
  opViz: OpVizApi;
}

(function () {
  'use strict';
  const M = window.M;
  const rnd = M.rnd,
    pick = M.pick,
    shuffle = M.shuffle;
  const D = 'operations';

  /* ------------------------------------------------------------------
     Styles propres au domaine (préfixe op-)
     ------------------------------------------------------------------ */
  const css = (str: string) => {
    try {
      M.css(str);
    } catch {
      /* hors navigateur (tools/check-skills.js) */
    }
  };
  css(`
  .op-instr { font-size: 1.15rem; font-weight: 800; color: var(--muted); text-align: center; margin-bottom: 2px }
  .op-story { font-size: 1.25rem; line-height: 1.5 }
  .op-story .op-em { font-size: 1.8rem; vertical-align: middle; margin-right: 6px }
  .op-tip { font-size: 1.05rem; font-weight: 700; color: var(--muted); text-align: center }
  .op-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px }
  .op-tab { border: 3px solid var(--line); background: #fff; border-radius: 999px; padding: 5px 12px; font-weight: 800; font-size: .95rem }
  .op-tab.on { background: var(--ink); color: #fff; border-color: var(--ink) }
  /* balance */
  .op-bal svg { width: 100%; max-width: 520px; height: auto; display: block; margin: 0 auto }
  .op-bal .op-beam, .op-bal .op-pan { transition: transform .7s cubic-bezier(.3,1.4,.5,1) }
  .op-bal .op-beam { transform-origin: 240px 60px }
  .op-bal .op-blabel { font-size: 24px; font-weight: 900; text-anchor: middle; fill: var(--ink) }
  .op-bal .op-unk { fill: var(--C) }
  .op-try { display: flex; gap: 8px; align-items: center; justify-content: center; flex-wrap: wrap; margin-top: 6px }
  .op-try b { font-size: 1.6rem; min-width: 2ch; text-align: center; color: var(--C) }
  /* groupes égaux / disposition rectangulaire */
  .op-groups { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center }
  .op-group { background: #fff; border: 3px solid var(--line); border-radius: 50%; min-width: 96px; min-height: 96px; padding: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px }
  .op-group.box { border-radius: 14px }
  .op-gitems { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; max-width: 130px }
  .op-gsum { font-weight: 900; color: var(--C); min-height: 1.3em; font-size: 1.1rem }
  .op-array { display: inline-grid; gap: 4px; padding: 10px; background: #fff; border: 3px solid var(--line); border-radius: 14px; align-items: center }
  .op-arr-wrap { display: flex; justify-content: center; overflow-x: auto }
  .op-rowsum { font-weight: 900; color: var(--C); padding-left: 8px; min-width: 2.2em }
  .op-it { position: relative; border: 2px solid transparent; background: transparent; border-radius: 10px; font-size: 26px; line-height: 1; padding: 3px; min-width: 38px; min-height: 38px }
  .op-it.hl { background: #fff6d6; border-color: var(--yel) }
  .op-it .op-n { position: absolute; top: -8px; left: -8px; background: var(--ink); color: #fff; font-size: 12px; font-weight: 800; min-width: 20px; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 0 3px }
  .op-it .op-n.g { background: var(--C) }
  .op-it.flash { animation: pop .35s }
  .op-it.x { opacity: .35 }
  .op-it.x::after { content: "✕"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--red); font-size: 30px; font-weight: 900 }
  .op-it.kA { background: var(--Aa) } .op-it.kB { background: var(--Bb) }
  /* partage */
  .op-pile { display: flex; flex-wrap: wrap; gap: 2px; justify-content: center; min-height: 54px; width: 100%; background: #fff; border: 3px dashed #c7c2b4; border-radius: 16px; padding: 8px; font-size: 24px; line-height: 1.1 }
  .op-pile:disabled { opacity: .6 }
  .op-plates { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 12px }
  .op-plate { background: #fff; border: 3px solid var(--line); border-radius: 50%; width: 112px; min-height: 112px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px }
  .op-plate.box { border-radius: 12px; border-color: #c9a46b; background: #fff7ea }
  .op-plate.flash { animation: pop .3s }
  .op-plate .op-pi { display: flex; flex-wrap: wrap; gap: 1px; justify-content: center; font-size: 20px; line-height: 1.1 }
  .op-plate .op-who { font-weight: 800; font-size: .95rem; color: var(--muted) }
  /* comparaison */
  .op-cmp { display: inline-grid; gap: 4px 2px; align-items: center; padding: 8px; background: #fff; border: 3px solid var(--line); border-radius: 14px }
  .op-cmp .op-nm { font-weight: 800; padding-right: 8px; white-space: nowrap }
  .op-cmp .op-it { min-width: 32px; min-height: 34px; font-size: 22px; padding: 2px }
  .op-cmp .op-it.pair { background: var(--Cc) }
  /* suites */
  .op-seq { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: center; margin: 8px 0 }
  .op-term { min-width: 52px; padding: 6px 10px; border: 3px solid var(--line); background: #fff; border-radius: 14px; font-size: 1.6rem; font-weight: 900; text-align: center }
  .op-term.e { font-size: 1.8rem; min-width: 0; padding: 4px 6px }
  .op-term.q { border-style: dashed; color: #c7c2b4 }
  .op-term.band0 { background: var(--Aa) } .op-term.band1 { background: var(--Bb) }
  .op-term.hl { border-color: var(--yel); background: #fff6d6 }
  .op-step { border: 3px solid var(--line); background: #fff; border-radius: 999px; font-weight: 900; font-size: .95rem; padding: 2px 8px; color: var(--muted) }
  .op-step.on { color: var(--C); border-color: var(--C) }
  .q-prompt .op-seq .op-term { font-size: 1.8rem }
  /* centaines */
  .op-b1000 { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; justify-content: center }
  .op-b1000 .op-bx { background: #fff; border: 3px solid var(--line); border-radius: 14px; padding: 8px; display: flex; flex-direction: column; gap: 6px; align-items: center }
  .op-b1000 .op-bl { font-weight: 800; color: var(--muted); font-size: .9rem; text-align: center }
  .op-b1000 .op-bop { font-size: 2.2rem; font-weight: 900; color: var(--muted); align-self: center }
  .op-b1000 .op-bx.q { min-width: 90px; min-height: 90px; justify-content: center; border-style: dashed }
  `);

  /* ------------------------------------------------------------------
     Petits utilitaires
     ------------------------------------------------------------------ */
  // Prénoms : M.people (services.js)
  const MINUS = '−';
  const op = (s: string) => `<span class="op">${s}</span>`;
  const sym = (s: string) => (s === '-' ? MINUS : s);
  /** eq('7','+','5','=','{?}') → ligne d'équation */
  const eq = (...parts: (string | number)[]) =>
    `<div class="eq">${parts.map((p) => (typeof p === 'string' && ['+', '-', '=', '×', MINUS].includes(p) ? op(sym(p)) : `<span>${p}</span>`)).join('')}</div>`;
  const instr = (t: string) => `<div class="op-instr">${t}</div>`;
  /** « de » ou « d' » devant une voyelle : de('œufs') → « d'œufs » */
  const de = (w: string) => (/^[aeiouyéèêàâîôûœh]/i.test(w) ? "d'" : 'de ') + w;
  const range = (a: number, b: number) => {
    const r: number[] = [];
    if (a <= b) for (let i = a; i <= b; i++) r.push(i);
    else for (let i = a; i >= b; i--) r.push(i);
    return r;
  };

  /* ------------------------------------------------------------------
     Stratégies de calcul (partagées avec la page Apprendre)
     ------------------------------------------------------------------ */
  function addStrat(a: number, b: number): OpStrategy {
    const s = a + b,
      big = Math.max(a, b),
      small = Math.min(a, b);
    const countOn = () => range(big + 1, s).join(', ');
    if (small === 0) return { key: 'zero', name: 'Ajouter zéro', txt: `Ajouter 0 ne change rien : ${a} + ${b} = ${s}.` };
    if (a === b) return { key: 'double', name: 'Un double', txt: `C'est un double ! ${a} + ${a} = ${s}.` };
    if (big === 10)
      return {
        key: 'dix',
        name: 'Dix et des unités',
        txt: `10 + ${small}, c'est 1 dizaine et ${small} ${M.plural(small, 'unité')} : ${s}.`,
      };
    if (s === 10)
      return { key: 'amis10', name: 'Les amis de 10', txt: `${a} et ${b} sont des amis de 10 (des compléments à 10) : ${a} + ${b} = 10.` };
    if (small <= 2)
      return {
        key: 'compter',
        name: 'Compter à partir du plus grand',
        txt: `Pars du plus grand, ${big}, et avance de ${small} : ${countOn()}. Ça fait ${s}.`,
      };
    if (s > 10 && big >= 8 && big < 10) {
      const need = 10 - big,
        rest = small - need;
      return { key: 'faire10', name: 'Faire 10', txt: `Fais 10 d'abord : ${big} + ${need} = 10, puis 10 + ${rest} = ${s}.` };
    }
    if (big - small === 1)
      return { key: 'presque', name: 'Presque un double', txt: `Presque un double : ${small} + ${small} = ${2 * small}, puis + 1 = ${s}.` };
    if (big - small === 2 && big < 10)
      return {
        key: 'milieu',
        name: 'Presque un double',
        txt: `Prends le nombre du milieu : ${small} + ${big} = ${small + 1} + ${small + 1} = ${s}.`,
      };
    if (s > 10 && big < 10) {
      const need = 10 - big,
        rest = small - need;
      return { key: 'faire10', name: 'Faire 10', txt: `Fais 10 d'abord : ${big} + ${need} = 10, puis 10 + ${rest} = ${s}.` };
    }
    if (big > 10) {
      const u = big - 10 + small;
      return {
        key: 'unites',
        name: 'Les unités ensemble',
        txt: `${big}, c'est 10 + ${big - 10}. Les unités : ${big - 10} + ${small} = ${u}. Puis 10 + ${u} = ${s}.`,
      };
    }
    return {
      key: 'compter',
      name: 'Compter à partir du plus grand',
      txt: `Pars du plus grand, ${big}, et compte ${small} de plus : ${countOn()}. Ça fait ${s}.`,
    };
  }
  function subStrat(a: number, b: number): OpStrategy {
    const r = a - b;
    if (b === 0) return { key: 'zero', name: 'Enlever zéro', txt: `Enlever 0 ne change rien : ${a} − 0 = ${a}.` };
    if (r === 0) return { key: 'tout', name: 'Tout enlever', txt: `Si on enlève tout, il ne reste rien : ${a} − ${b} = 0.` };
    if (a === 2 * b) return { key: 'double', name: 'Un double', txt: `Pense au double : ${b} + ${b} = ${a}, donc ${a} − ${b} = ${b}.` };
    if (a === 10)
      return { key: 'amis10', name: 'Les amis de 10', txt: `${b} et ${r} sont des amis de 10 : ${b} + ${r} = 10, donc 10 − ${b} = ${r}.` };
    if (b <= 2)
      return {
        key: 'rebours',
        name: 'Compter à rebours',
        txt: `Recule de ${b} à partir de ${a} : ${range(a - 1, r).join(', ')}. Il reste ${r}.`,
      };
    if (a > 10 && b === a - 10)
      return { key: 'unites', name: 'Enlever les unités', txt: `${a}, c'est 10 + ${b}. Si on enlève les ${b} unités, il reste 10.` };
    if (a > 10 && b === 10)
      return { key: 'dizaine', name: 'Enlever la dizaine', txt: `${a}, c'est 10 + ${r}. Si on enlève la dizaine, il reste ${r}.` };
    if (a > 10 && b < a - 10)
      return {
        key: 'unites',
        name: 'Enlever les unités',
        txt: `Ne touche pas à la dizaine : ${a - 10} − ${b} = ${a - 10 - b}, donc ${a} − ${b} = ${r}.`,
      };
    if (a > 10 && r <= 4)
      return {
        key: 'trou',
        name: "L'addition à trou",
        txt: `Pense à l'addition : ${b} + ? = ${a}. De ${b}, avance jusqu'à ${a} : il faut ${r}. Donc ${a} − ${b} = ${r}.`,
      };
    if (a > 10) {
      const u = a - 10,
        rest = b - u;
      return {
        key: 'passer10',
        name: 'Passer par 10',
        txt: `Descends à 10 d'abord : ${a} − ${u} = 10, puis 10 − ${rest} = ${r}. (Vérifie : ${b} + ${r} = ${a}.)`,
      };
    }
    return {
      key: 'trou',
      name: "L'addition à trou",
      txt: `Pense à l'addition : ${b} + ? = ${a}. Comme ${b} + ${r} = ${a}, alors ${a} − ${b} = ${r}.`,
    };
  }
  M.opStrat = { add: addStrat, sub: subStrat };

  /* séquences de bonds pour la grenouille */
  function seqAdd(a: number, b: number): number[] {
    const s = a + b;
    if (!b) return [];
    if (a < 10 && s > 10) return [10, s];
    if (b <= 3) return range(a + 1, s);
    return [s];
  }
  function seqSub(a: number, b: number): number[] {
    const r = a - b;
    if (!b) return [];
    if (a > 10 && r < 10) return [10, r];
    if (b <= 3) return range(a - 1, r);
    return [r];
  }
  /** Bonds de 10 puis unités (en passant par la dizaine si on la traverse). */
  function seqTens(a: number, b: number, sign: number) {
    const out: number[] = [];
    let pos = a;
    const tens = Math.floor(b / 10),
      u = b % 10;
    for (let i = 0; i < tens; i++) {
      pos += 10 * sign;
      out.push(pos);
    }
    if (u) {
      const end = pos + u * sign;
      if (Math.floor(pos / 10) !== Math.floor(end / 10) && end % 10 !== 0 && pos % 10 !== 0)
        out.push(sign > 0 ? Math.ceil(pos / 10) * 10 : Math.floor(pos / 10) * 10);
      out.push(end);
    }
    return out;
  }

  /* ------------------------------------------------------------------
     Visuels
     ------------------------------------------------------------------ */
  /** Attache viz + showMe à une question. mount(el) → api {showMe?} */
  /** Contrôle d'un visuel monté : démonstration facultative. */
  interface VizCtl {
    showMe?(): unknown;
  }
  /** Un modèle visuel d'un onglet. */
  interface VizModel {
    label: string;
    mount(sub: HTMLElement): VizCtl | null | undefined;
  }
  function withViz<Q extends Question>(q: Q, mount: (el: HTMLElement) => VizCtl | null | undefined): Q {
    let api: VizCtl | null = null;
    q.viz = (el) => {
      el.onclick = null;
      api = mount(el) || null;
    };
    q.showMe = () => (api && api.showMe ? api.showMe() : undefined);
    return q;
  }
  /** Onglets entre plusieurs modèles visuels. models: [{label, mount(sub)}] */
  function tabs(el: HTMLElement, models: VizModel[]): VizCtl {
    let api: VizCtl | null = null;
    el.innerHTML =
      (models.length > 1
        ? `<div class="op-tabs">${models.map((m, i) => `<button class="op-tab${i ? '' : ' on'}" data-t="${i}">${m.label}</button>`).join('')}</div>`
        : '') + '<div class="op-pane"></div>';
    const pane = M.$('.op-pane', el)!;
    function mount(i: number) {
      el.querySelectorAll('.op-tab').forEach((b, j) => b.classList.toggle('on', j === i));
      pane.innerHTML = '';
      const sub = document.createElement('div');
      pane.appendChild(sub);
      api = models[i].mount(sub) || null;
    }
    el.onclick = (e) => {
      const b = M.closest(e, '.op-tab');
      if (!b || !el.contains(b)) return;
      M.sfx.tap();
      mount(Number(b.dataset.t));
    };
    mount(0);
    return { showMe: () => (api && api.showMe ? api.showMe() : undefined) };
  }
  /** n jetons de la même couleur. */
  const cellsOf = (n: number, kind: CounterKind): CounterCellSpec[] => Array.from({ length: n }, () => ({ kind }));
  const countersModel = (o: CountersOpts): VizModel => ({ label: '🔴 Cadres de dix', mount: (sub) => M.viz.counters(sub, o) });
  interface LineModelOpts {
    label?: string;
    lo: number;
    hi: number;
    start: number;
    /** Arrêts successifs de la grenouille (showMe). */
    seq: number[];
    hint?: string;
    labelEvery?: number;
    buttons?: number[];
  }
  /** Droite numérique avec une suite de bonds pour la démonstration. */
  function lineModel(o: LineModelOpts): VizModel {
    return {
      label: o.label || '🐸 Droite numérique',
      mount(sub) {
        const nl = M.viz.numberLine(sub, {
          lo: o.lo,
          hi: o.hi,
          start: o.start,
          hint: o.hint,
          labelEvery: o.labelEvery,
          buttons: o.buttons,
        });
        let tok = 0;
        return {
          async showMe() {
            const t = ++tok;
            nl.reset();
            await M.sleep(300);
            for (const v of o.seq) {
              if (t !== tok || !sub.isConnected) return;
              await nl.hop(v);
              await M.sleep(160);
            }
          },
        };
      },
    };
  }

  /* ---------- Balance ⚖️ ---------- */
  function balanceViz(el: HTMLElement, o: OpBalanceOpts): ShowMeCtl {
    // o: { L:[{v, neg?, unk?}], R:[...], ans? }
    const terms = o.L.concat(o.R);
    const hasUnk = terms.some((t) => t.unk);
    let trial = 0,
      angle = 0,
      weighed = false,
      tok = 0;
    const val = (side: OpBalanceTerm[]) => side.reduce((s, t) => s + (t.neg ? -1 : 1) * (t.unk ? trial : t.v), 0);
    const label = (side: OpBalanceTerm[]) =>
      side.map((t, i) => (i ? (t.neg ? ` ${MINUS} ` : ' + ') : '') + (t.unk ? `<tspan class="op-unk">${trial}</tspan>` : t.v)).join('');
    const COLORS = ['var(--A)', 'var(--B)', 'var(--org)'];
    function dots(side: OpBalanceTerm[], cx: number) {
      const list: { col: string; x: boolean }[] = [];
      let ci = 0;
      side.forEach((t) => {
        if (t.neg) {
          let n = t.v;
          for (let i = list.length - 1; i >= 0 && n > 0; i--)
            if (!list[i].x) {
              list[i].x = true;
              n--;
            }
        } else {
          const n = Math.min(25, t.unk ? trial : t.v);
          const col = t.unk ? 'var(--C)' : COLORS[ci++ % COLORS.length];
          for (let i = 0; i < n; i++) list.push({ col, x: false });
        }
      });
      return list
        .map((d, i) => {
          const row = Math.floor(i / 10),
            colI = i % 10;
          const x = cx - 63 + colI * 14,
            y = 140 - row * 14;
          return (
            `<circle cx="${x}" cy="${y}" r="6" fill="${d.col}" opacity="${d.x ? 0.25 : 1}"/>` +
            (d.x
              ? `<path d="M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x + 5} ${y - 5}L${x - 5} ${y + 5}" stroke="var(--red)" stroke-width="2.5"/>`
              : '')
          );
        })
        .join('');
    }
    const panDy = (side: 'L' | 'R') => (side === 'L' ? -1 : 1) * 160 * Math.sin((angle * Math.PI) / 180);
    function pan(side: 'L' | 'R', cx: number) {
      return `<g class="op-pan op-pan${side}" style="transform:translateY(${panDy(side).toFixed(1)}px)">
        <path d="M${cx} 60 L${cx - 68} 150 M${cx} 60 L${cx + 68} 150" stroke="#b9b2a0" stroke-width="2"/>
        ${dots(side === 'L' ? o.L : o.R, cx)}
        <path d="M${cx - 76} 150 Q${cx} 172 ${cx + 76} 150 Z" fill="#c9a46b" stroke="#8a6a35" stroke-width="3"/>
        <text class="op-blabel" x="${cx}" y="196">${label(side === 'L' ? o.L : o.R)}</text>
      </g>`;
    }
    function status() {
      if (!weighed) return hasUnk ? 'Choisis un nombre, puis pèse.' : 'Compte chaque côté, puis pèse.';
      const l = val(o.L),
        r = val(o.R);
      if (l === r) return `⚖️ Équilibre ! Les deux côtés valent <b>${l}</b>.`;
      return `Pas en équilibre : <b>${l}</b> d'un côté, <b>${r}</b> de l'autre. Le côté le plus lourd descend.`;
    }
    function render() {
      el.innerHTML = `<div class="viz-hint">Une balance est en équilibre quand les deux côtés ont la même valeur.</div>
        <div class="op-bal"><svg viewBox="0 0 480 250" xmlns="http://www.w3.org/2000/svg">
          <path d="M240 60 L240 232" stroke="#8a6a35" stroke-width="8" stroke-linecap="round"/>
          <path d="M196 244 L284 244 L262 228 L218 228 Z" fill="#8a6a35"/>
          <g class="op-beam" style="transform:rotate(${angle}deg)">
            <path d="M80 60 L400 60" stroke="var(--ink)" stroke-width="8" stroke-linecap="round"/>
          </g>
          ${pan('L', 80)}${pan('R', 400)}
          <circle cx="240" cy="60" r="10" fill="var(--yel)" stroke="var(--ink)" stroke-width="3"/>
        </svg></div>
        ${hasUnk ? `<div class="op-try"><span>Essaie :</span><button class="btn op-minus">−</button><b>${trial}</b><button class="btn op-plus">+</button></div>` : ''}
        <div class="row" style="justify-content:center"><button class="btn blue op-weigh">⚖️ Peser</button></div>
        <div class="viz-status">${status()}</div>`;
    }
    function setAngle(a: number) {
      angle = a;
      const beam = M.$<SVGGElement>('.op-beam', el),
        pl = M.$<SVGGElement>('.op-panL', el),
        pr = M.$<SVGGElement>('.op-panR', el);
      if (!beam || !pl || !pr) return;
      beam.style.transform = `rotate(${a}deg)`;
      pl.style.transform = `translateY(${panDy('L').toFixed(1)}px)`;
      pr.style.transform = `translateY(${panDy('R').toFixed(1)}px)`;
    }
    function weigh() {
      const d = val(o.R) - val(o.L);
      weighed = true;
      const st = el.querySelector('.viz-status');
      if (st) st.innerHTML = status();
      requestAnimationFrame(() => {
        if (el.isConnected) setAngle(d === 0 ? 0 : Math.sign(d) * Math.min(11, 4 + Math.abs(d) * 1.2));
      });
      if (d === 0) M.sfx.good();
      else M.sfx.tone([330, 260], 0.1, 'triangle', 0.08);
    }
    function setTrial(v: number) {
      trial = Math.max(0, Math.min(25, v));
      const wasAngle = angle;
      weighed = false;
      angle = wasAngle;
      render();
      requestAnimationFrame(() => {
        if (el.isConnected) setAngle(0);
      });
    }
    el.onclick = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      if (t.closest('.op-weigh')) {
        tok++;
        weigh();
        return;
      }
      if (t.closest('.op-plus')) {
        tok++;
        M.sfx.tap();
        setTrial(trial + 1);
        return;
      }
      if (t.closest('.op-minus')) {
        tok++;
        M.sfx.tap();
        setTrial(trial - 1);
      }
    };
    render();
    return {
      async showMe() {
        const t = ++tok;
        if (hasUnk && o.ans != null) {
          while (trial !== o.ans) {
            await M.sleep(trial === 0 && o.ans > 0 ? 200 : 140);
            if (t !== tok || !el.isConnected) return;
            M.sfx.tap();
            setTrial(trial + Math.sign(o.ans - trial));
          }
        }
        await M.sleep(500);
        if (t !== tok || !el.isConnected) return;
        weigh();
      },
    };
  }

  /* ---------- Groupes égaux / rangées ---------- */
  function groupsViz(el: HTMLElement, o: OpGroupsOpts): ShowMeCtl {
    // o: { g, k, emoji, layout:'groups'|'array', box? }
    const N = o.g * o.k;
    let labels: number[] = [],
      sums: (number | null)[] = [],
      tok = 0;
    const reset = () => {
      labels = Array(N).fill(0);
      sums = Array(o.g).fill(null);
    };
    const counted = () => labels.filter((x) => x).length;
    function item(i: number, flash?: number) {
      return `<button class="op-it ${labels[i] ? 'hl' : ''} ${i === flash ? 'flash' : ''}" data-i="${i}">${o.emoji}${labels[i] ? `<span class="op-n">${labels[i]}</span>` : ''}</button>`;
    }
    function render(flash?: number) {
      let h = `<div class="viz-hint">${o.layout === 'array' ? 'Touche chaque objet pour le compter. Tu peux compter rangée par rangée !' : 'Touche chaque objet pour le compter. Tu peux compter groupe par groupe !'}</div>`;
      if (o.layout === 'array') {
        h += `<div class="op-arr-wrap"><div class="op-array" style="grid-template-columns:repeat(${o.k}, auto) auto">`;
        for (let r = 0; r < o.g; r++) {
          for (let c = 0; c < o.k; c++) h += item(r * o.k + c, flash);
          h += `<span class="op-rowsum">${sums[r] != null ? '→ ' + sums[r] : ''}</span>`;
        }
        h += '</div></div>';
      } else {
        h += '<div class="op-groups">';
        for (let g = 0; g < o.g; g++) {
          h += `<div class="op-group ${o.box ? 'box' : ''}"><div class="op-gitems">`;
          for (let c = 0; c < o.k; c++) h += item(g * o.k + c, flash);
          h += `</div><div class="op-gsum">${sums[g] != null ? sums[g] : ''}</div></div>`;
        }
        h += '</div>';
      }
      const n = counted();
      h += `<div class="viz-status">${n ? `Tu as compté : ${n}` : ''}</div>`;
      el.innerHTML = h;
    }
    el.onclick = (e) => {
      const b = M.closest(e, '.op-it');
      if (!b) return;
      tok++;
      const i = Number(b.dataset.i);
      if (labels[i]) {
        const L = labels[i];
        labels[i] = 0;
        labels = labels.map((x) => (x > L ? x - 1 : x));
      } else labels[i] = counted() + 1;
      M.sfx.tap();
      render(i);
    };
    reset();
    render();
    return {
      async showMe() {
        const t = ++tok;
        reset();
        render();
        let n = 0;
        for (let g = 0; g < o.g; g++) {
          for (let c = 0; c < o.k; c++) {
            await M.sleep(170);
            if (t !== tok || !el.isConnected) return;
            labels[g * o.k + c] = ++n;
            M.sfx.tap();
            render(g * o.k + c);
          }
          sums[g] = n;
          M.sfx.pop();
          render();
          await M.sleep(250);
        }
      },
    };
  }

  /* ---------- Partage / contenance ---------- */
  const KIDS = ['🧒', '👧', '👦', '🧒🏽', '👧🏻', '👦🏾'];
  function shareViz(el: HTMLElement, o: OpShareOpts): ShowMeCtl {
    // o: { total, n (enfants) | k (par boîte), emoji, mode:'share'|'boxes' }
    let pile = 0,
      plates: number[] = [],
      next = 0,
      tok = 0;
    const reset = () => {
      pile = o.total;
      plates = o.mode === 'share' ? Array(o.n).fill(0) : [];
      next = 0;
    };
    function stuck() {
      if (pile <= 0) return true;
      if (o.mode === 'share') return next === 0 && pile < o.n;
      const last = plates[plates.length - 1];
      return (last == null || last === o.k) && pile < o.k;
    }
    let flashI = -1;
    function dealOne() {
      if (stuck()) return false;
      if (o.mode === 'share') {
        plates[next]++;
        flashI = next;
        next = (next + 1) % o.n;
      } else {
        if (!plates.length || plates[plates.length - 1] === o.k) plates.push(0);
        plates[plates.length - 1]++;
        flashI = plates.length - 1;
      }
      pile--;
      return true;
    }
    function status() {
      if (o.mode === 'share') {
        const eqAll = plates.every((p) => p === plates[0]);
        if (pile === 0 && eqAll) return `Tout est partagé ! Chaque enfant a <b>${plates[0]}</b>.`;
        if (stuck() && eqAll)
          return `Chaque enfant a <b>${plates[0]}</b>. Il en reste <b>${pile}</b> : pas assez pour faire un autre tour.`;
        return `Dans la pile : ${pile}`;
      }
      const full = plates.filter((p) => p === o.k).length;
      if (pile === 0 && full === plates.length) return `Toutes les boîtes sont pleines : <b>${full}</b> ${M.plural(full, 'boîte')}.`;
      if (stuck())
        return `${full} ${M.plural(full, 'boîte pleine', 'boîtes pleines')}. Il en reste <b>${pile}</b> : pas assez pour une autre boîte.`;
      return `Boîtes pleines : ${full} · Dans la pile : ${pile}`;
    }
    function render() {
      const hint =
        o.mode === 'share'
          ? 'Touche la pile : tu donnes un objet à chaque enfant, chacun son tour.'
          : `Touche la pile pour mettre les objets dans les boîtes. Une boîte contient ${o.k} objets.`;
      let h = `<div class="viz-hint">${hint}</div><button class="op-pile" ${stuck() ? 'disabled' : ''} aria-label="pile">${pile ? o.emoji.repeat(pile) : '<span class="muted" style="font-size:1rem">La pile est vide</span>'}</button><div class="op-plates">`;
      if (o.mode === 'share')
        h += plates
          .map(
            (p, i) =>
              `<div class="op-plate ${i === flashI ? 'flash' : ''}"><div class="op-pi">${o.emoji.repeat(p)}</div><div class="op-who">${KIDS[i % KIDS.length]} ${p}</div></div>`,
          )
          .join('');
      else
        h += plates
          .map(
            (p, i) =>
              `<div class="op-plate box ${i === flashI ? 'flash' : ''}"><div class="op-pi">${o.emoji.repeat(p)}</div><div class="op-who">📦 ${i + 1}</div></div>`,
          )
          .join('');
      h += `</div><div class="row" style="justify-content:center"><button class="btn op-round">${o.mode === 'share' ? '🔁 Un tour complet' : '📦 Remplir une boîte'}</button></div><div class="viz-status">${status()}</div>`;
      el.innerHTML = h;
      flashI = -1;
    }
    el.onclick = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      if (t.closest('.op-pile')) {
        tok++;
        if (dealOne()) {
          M.sfx.tap();
          render();
        }
        return;
      }
      if (t.closest('.op-round')) {
        tok++;
        const n = o.mode === 'share' ? o.n : o.k;
        let any = false;
        for (let i = 0; i < n; i++) {
          if (o.mode === 'boxes' && i > 0 && plates[plates.length - 1] === o.k) break;
          if (dealOne()) any = true;
          else break;
        }
        if (any) {
          M.sfx.pop();
          render();
        }
      }
    };
    reset();
    render();
    return {
      async showMe() {
        const t = ++tok;
        reset();
        render();
        while (!stuck()) {
          await M.sleep(230);
          if (t !== tok || !el.isConnected) return;
          dealOne();
          M.sfx.tap();
          render();
        }
      },
    };
  }

  /* ---------- Comparaison (deux rangées alignées) ---------- */
  function compareViz(el: HTMLElement, o: OpCompareOpts): ShowMeCtl {
    // o: { a, b, na, nb, emoji }  (a > b)
    const W = Math.max(o.a, o.b);
    let pairs = 0,
      labels: Record<number, number> = {},
      tok = 0;
    function row(n: number, name: string, isLong: boolean) {
      let h = `<span class="op-nm">${name}</span>`;
      for (let i = 0; i < W; i++) {
        if (i >= n) {
          h += '<span></span>';
          continue;
        }
        const extra = isLong && i >= Math.min(o.a, o.b);
        const lab = extra && labels[i] ? `<span class="op-n g">${labels[i]}</span>` : '';
        h += `<button class="op-it ${i < pairs ? 'pair' : ''} ${extra && labels[i] ? 'hl' : ''}" data-i="${i}" data-x="${extra ? 1 : 0}">${o.emoji}${lab}</button>`;
      }
      return h;
    }
    function render() {
      const n = Object.keys(labels).length;
      el.innerHTML = `<div class="viz-hint">Place les objets face à face. Ceux qui n'ont pas de partenaire, ce sont ceux « de plus ». Touche-les pour les compter.</div>
        <div class="op-arr-wrap"><div class="op-cmp" style="grid-template-columns:auto repeat(${W}, auto)">${row(o.a, o.na, o.a >= o.b)}${row(o.b, o.nb, o.b > o.a)}</div></div>
        <div class="viz-status">${n ? `De plus : ${n}` : ''}</div>`;
    }
    el.onclick = (e) => {
      const b = M.closest(e, '.op-it');
      if (!b || b.dataset.x !== '1') return;
      tok++;
      const i = Number(b.dataset.i);
      if (labels[i]) {
        const L = labels[i];
        delete labels[i];
        Object.keys(labels).forEach((k) => {
          if (labels[Number(k)] > L) labels[Number(k)]--;
        });
      } else labels[i] = Object.keys(labels).length + 1;
      M.sfx.tap();
      render();
    };
    render();
    return {
      async showMe() {
        const t = ++tok;
        pairs = 0;
        labels = {};
        render();
        const m = Math.min(o.a, o.b);
        for (let i = 0; i < m; i++) {
          await M.sleep(150);
          if (t !== tok || !el.isConnected) return;
          pairs = i + 1;
          M.sfx.tap();
          render();
        }
        let n = 0;
        for (let i = m; i < W; i++) {
          await M.sleep(300);
          if (t !== tok || !el.isConnected) return;
          labels[i] = ++n;
          M.sfx.pop();
          render();
        }
      },
    };
  }

  /* ---------- Sac d'objets (problèmes à deux étapes) ---------- */
  function bagViz(el: HTMLElement, o: OpBagOpts): ShowMeCtl {
    // o: { parts:[{n, k:'A'|'B'}], emoji, cross:[indices], hint }
    let items: { k: OpBagPart['k']; x: boolean; lab: number }[] = [],
      tok = 0;
    const reset = () => {
      items = [];
      o.parts.forEach((p) => {
        for (let i = 0; i < p.n; i++) items.push({ k: p.k, x: false, lab: 0 });
      });
    };
    function render(flash?: number) {
      const x = items.filter((i) => i.x).length;
      el.innerHTML = `<div class="viz-hint">${o.hint}</div><div class="op-groups" style="gap:4px">${items.map((it, i) => `<button class="op-it k${it.k} ${it.x ? 'x' : ''} ${i === flash ? 'flash' : ''}" data-i="${i}">${o.emoji}${it.lab ? `<span class="op-n g">${it.lab}</span>` : ''}</button>`).join('')}</div>
        <div class="viz-status">En tout : ${items.length} · Barrés : ${x} · Il reste : ${items.length - x}</div>`;
    }
    el.onclick = (e) => {
      const b = M.closest(e, '.op-it');
      if (!b) return;
      tok++;
      const it = items[Number(b.dataset.i)];
      it.x = !it.x;
      it.lab = 0;
      M.sfx.tap();
      render(Number(b.dataset.i));
    };
    reset();
    render();
    return {
      async showMe() {
        const t = ++tok;
        reset();
        render();
        for (const i of o.cross) {
          await M.sleep(240);
          if (t !== tok || !el.isConnected) return;
          items[i].x = true;
          M.sfx.tap();
          render(i);
        }
        let n = 0;
        for (let i = 0; i < items.length; i++)
          if (!items[i].x) {
            await M.sleep(130);
            if (t !== tok || !el.isConnected) return;
            items[i].lab = ++n;
            render(i);
          }
      },
    };
  }

  /* ---------- Suites ---------- */
  /** terms : null = case inconnue; step : la règle; ans : la valeur cachée. */
  function seqNumViz(el: HTMLElement, o: { terms: (number | null)[]; step: number; ans: number }): ShowMeCtl {
    let shown: boolean[] = [],
      filled = false,
      tok = 0;
    const reset = () => {
      shown = o.terms.slice(1).map(() => false);
      filled = false;
    };
    function render() {
      let h = '<div class="viz-hint">Touche les flèches pour voir de combien on avance ou recule à chaque fois.</div><div class="op-seq">';
      o.terms.forEach((t, i) => {
        if (i) {
          const cur = o.terms[i],
            prev = o.terms[i - 1];
          const known = cur != null && prev != null;
          const d = known ? cur - prev : 0;
          const lab = shown[i - 1]
            ? known
              ? d >= 0
                ? '+' + d
                : MINUS + Math.abs(d)
              : o.step >= 0
                ? '+' + o.step
                : MINUS + Math.abs(o.step)
            : '?';
          h += `<button class="op-step ${shown[i - 1] ? 'on' : ''}" data-s="${i - 1}">${lab} ➜</button>`;
        }
        h += t == null ? `<span class="op-term q">${filled ? o.ans : '?'}</span>` : `<span class="op-term">${t}</span>`;
      });
      h += '</div>';
      el.innerHTML = h + '<div class="viz-status"></div>';
    }
    el.onclick = (e) => {
      const b = M.closest(e, '.op-step');
      if (!b) return;
      tok++;
      shown[Number(b.dataset.s)] = true;
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
        for (let i = 0; i < shown.length; i++) {
          await M.sleep(380);
          if (t !== tok || !el.isConnected) return;
          shown[i] = true;
          M.sfx.tap();
          render();
        }
        await M.sleep(450);
        if (t !== tok || !el.isConnected) return;
        filled = true;
        M.sfx.pop();
        render();
      },
    };
  }
  /** items : emoji, ou null pour la case cachée; unitLen : longueur du motif. */
  function seqMotifViz(el: HTMLElement, o: { items: (string | null)[]; unitLen: number; ans: string }): ShowMeCtl {
    let banded = false,
      filled = false,
      hl: Record<number, boolean> = {},
      tok = 0;
    function render() {
      el.innerHTML = `<div class="viz-hint">Trouve le motif qui se répète. Touche les éléments pour les marquer.</div><div class="op-seq">${o.items
        .map((it, i) => {
          const band = banded ? ' band' + (Math.floor(i / o.unitLen) % 2) : '';
          if (it == null) return `<span class="op-term e q${band}">${filled ? o.ans : '?'}</span>`;
          return `<button class="op-term e${band}${hl[i] ? ' hl' : ''}" data-i="${i}">${it}</button>`;
        })
        .join(
          '',
        )}</div><div class="viz-status">${banded ? `Le motif a ${o.unitLen} éléments : ${o.items.slice(0, o.unitLen).join(' ')}` : ''}</div>`;
    }
    el.onclick = (e) => {
      const b = M.closest(e, '.op-term[data-i]');
      if (!b) return;
      tok++;
      const i = Number(b.dataset.i);
      hl[i] = !hl[i];
      M.sfx.tap();
      render();
    };
    render();
    return {
      async showMe() {
        const t = ++tok;
        banded = false;
        filled = false;
        hl = {};
        render();
        await M.sleep(400);
        if (t !== tok || !el.isConnected) return;
        banded = true;
        M.sfx.pop();
        render();
        await M.sleep(900);
        if (t !== tok || !el.isConnected) return;
        filled = true;
        M.sfx.good();
        render();
      },
    };
  }

  /* ---------- Blocs avec centaines (statique + révélation) ---------- */
  function hundredsLabel(n: number) {
    const c = Math.floor(n / 100),
      d = Math.floor((n % 100) / 10),
      u = n % 10;
    const parts: string[] = [];
    if (c) parts.push(`${c} ${M.plural(c, 'centaine')}`);
    if (d) parts.push(`${d} ${M.plural(d, 'dizaine')}`);
    if (u) parts.push(`${u} ${M.plural(u, 'unité')}`);
    return parts.join(', ') || '0';
  }
  function blocks1000Viz(el: HTMLElement, o: { a: number; b: number; opSign: string; r: number }) {
    let reveal = false;
    function render() {
      el.innerHTML = `<div class="viz-hint">Un carré = 100, une barre = 10, un petit cube = 1.</div><div class="op-b1000">
        <div class="op-bx">${M.viz.base10Html(o.a, 'A', { small: true })}<div class="op-bl">${o.a}<br>${hundredsLabel(o.a)}</div></div>
        <div class="op-bop">${o.opSign}</div>
        <div class="op-bx">${M.viz.base10Html(o.b, 'B', { small: true })}<div class="op-bl">${o.b}<br>${hundredsLabel(o.b)}</div></div>
        <div class="op-bop">=</div>
        ${reveal ? `<div class="op-bx pop">${M.viz.base10Html(o.r, 'C', { small: true })}<div class="op-bl">${o.r}<br>${hundredsLabel(o.r)}</div></div>` : '<div class="op-bx q"><div class="qbig">?</div></div>'}
      </div><div class="viz-status"></div>`;
    }
    render();
    return {
      showMe() {
        if (!el.isConnected) return;
        reveal = true;
        M.sfx.hop();
        render();
      },
    };
  }

  /** Visuels réutilisés par la page Apprendre (js/learn/operations.js). */
  M.opViz = { balance: balanceViz, groups: groupsViz, share: shareViz, compare: compareViz, bag: bagViz };

  /* ------------------------------------------------------------------
     Modèles + / − jusqu'à 20 (cadres de dix + droite numérique)
     ------------------------------------------------------------------ */
  function addModels(a: number, b: number, hi?: number) {
    hi = hi || (a + b > 10 ? 20 : 10);
    return [
      countersModel({ a, b, op: 'add', unknown: 'r' }),
      lineModel({ lo: 0, hi, start: a, seq: seqAdd(a, b), hint: `Pars de ${a} et avance de ${b}.` }),
    ];
  }
  function subModels(a: number, b: number) {
    return [
      countersModel({ a, b, op: 'sub', unknown: 'r' }),
      lineModel({ lo: 0, hi: a > 10 ? 20 : 10, start: a, seq: seqSub(a, b), hint: `Pars de ${a} et recule de ${b}.` }),
    ];
  }

  /* ==================================================================
     1. Additions jusqu'à 10
     ================================================================== */
  M.registerSkill({
    id: 'add-10',
    domain: D,
    title: "Additions jusqu'à 10",
    icon: '➕',
    starter: true,
    learn: 'strategies',
    desc: "Les faits d'addition de base : doubles, amis de 10, compter à partir du plus grand.",
    pda: "Opérations A.2 a–c — répertoire mémorisé de l'addition (0 + 0 à 10)",
    gen({ lvl }) {
      let a,
        b,
        c = 0;
      if (lvl === 0) {
        a = rnd(1, 5);
        b = rnd(0, Math.min(5, 10 - a));
        if (b === 0 && Math.random() < 0.7) b = 1;
      } else if (lvl === 1) {
        const s = rnd(5, 10);
        a = rnd(1, s - 1);
        b = s - a;
      } else if (Math.random() < 0.5) {
        a = rnd(1, 5);
        b = rnd(1, 7 - a);
        c = rnd(1, 10 - a - b);
      } else {
        a = rnd(1, 9);
        b = 10 - a;
      }
      if (c) {
        const s = a + b + c;
        let tip;
        if (a + c === 10 || b + c === 10 || a + b === 10) tip = "Cherche d'abord deux nombres qui font 10.";
        else if (a === b || b === c || a === c) tip = "Cherche d'abord un double.";
        else tip = 'Additionne deux nombres, puis ajoute le troisième.';
        return withViz(
          {
            prompt: eq(a, '+', b, '+', c, '=', '{?}'),
            input: 'number',
            answer: s,
            hint: tip,
            explain: `${tip} Par exemple : ${a} + ${b} = ${a + b}, puis ${a + b} + ${c} = ${s}.`,
          },
          (el) =>
            tabs(el, [
              countersModel({
                cells: [...cellsOf(a, 'A'), ...cellsOf(b, 'B'), ...cellsOf(c, 'A')],
                mode: 'count',
              }),
              lineModel({ lo: 0, hi: 10, start: a, seq: [a + b, s], hint: `Pars de ${a}, avance de ${b}, puis de ${c}.` }),
            ]),
        );
      }
      const st = addStrat(a, b);
      return withViz(
        {
          prompt: eq(a, '+', b, '=', '{?}'),
          input: 'number',
          answer: a + b,
          hint: `Essaie : <b>${st.name}</b>.`,
          explain: `<b>${st.name}</b> — ${st.txt}`,
        },
        (el) => tabs(el, addModels(a, b, 10)),
      );
    },
  });

  /* ==================================================================
     2. Additions jusqu'à 20
     ================================================================== */
  M.registerSkill({
    id: 'add-20',
    domain: D,
    title: "Additions jusqu'à 20",
    icon: '🧮',
    learn: 'strategies',
    desc: 'Faire 10, presque-doubles, passer par 10.',
    pda: "Opérations A.2 b–c — répertoire mémorisé de l'addition (jusqu'à 10 + 10), stratégies",
    gen({ lvl }) {
      let a, b;
      if (lvl === 0) {
        const k = rnd(0, 3);
        if (k === 0) {
          a = rnd(5, 9);
          b = a;
        } else if (k === 1) {
          a = 10;
          b = rnd(1, 9);
        } else if (k === 2) {
          a = rnd(9, 15);
          b = rnd(1, 2);
        } else {
          a = rnd(5, 7);
          b = a + 1;
        }
      } else if (lvl === 1) {
        a = rnd(5, 9);
        b = rnd(11 - a, 9);
      } else if (Math.random() < 0.6) {
        a = rnd(6, 9);
        b = rnd(Math.max(4, 11 - a), 9);
      } else {
        a = rnd(11, 16);
        b = rnd(2, 20 - a);
      }
      if (Math.random() < 0.5) [a, b] = [b, a];
      const st = addStrat(a, b),
        s = a + b;
      return withViz(
        {
          prompt: eq(a, '+', b, '=', '{?}'),
          input: 'number',
          answer: s,
          hint: `Essaie : <b>${st.name}</b>.${a < b && b - a > 2 ? ' Commence par le plus grand nombre.' : ''}`,
          explain: `<b>${st.name}</b> — ${st.txt}`,
        },
        (el) => tabs(el, addModels(a, b, 20)),
      );
    },
  });

  /* ==================================================================
     3. Soustractions jusqu'à 20
     ================================================================== */
  M.registerSkill({
    id: 'sub-20',
    domain: D,
    title: "Soustractions jusqu'à 20",
    icon: '➖',
    starter: true,
    learn: 'strategies',
    desc: 'Enlever, reculer, ou chercher combien il faut pour aller à…',
    pda: 'Opérations A.2 a–c — répertoire mémorisé de la soustraction (soustractions correspondantes)',
    gen({ lvl }) {
      let a,
        b,
        gap = false;
      if (lvl === 0) {
        a = rnd(3, 10);
        b = rnd(1, a - 1);
      } else if (lvl === 1) {
        if (Math.random() < 0.5) {
          a = rnd(11, 19);
          b = rnd(1, a - 10);
        } else {
          a = rnd(11, 16);
          b = rnd(a - 9, 9);
        }
      } else {
        a = rnd(11, 18);
        b = rnd(Math.max(a - 9, 3), 9);
        gap = Math.random() < 0.4;
      }
      const r = a - b,
        st = subStrat(a, b);
      if (gap) {
        const seq = b < 10 && a > 10 ? [10, a] : [a];
        return withViz(
          {
            prompt: eq(a, '-', b, '=', '{?}') + `<div class="op-tip">Truc : combien faut-il pour aller de ${b} à ${a} ?</div>`,
            input: 'number',
            answer: r,
            hint: `Pars de ${b} et avance jusqu'à ${a}. Passe par 10 !`,
            explain: `<b>L'addition à trou</b> — ${b} + ? = ${a}. De ${b} à 10, il y a ${10 - b}. De 10 à ${a}, il y a ${a - 10}. ${10 - b} + ${a - 10} = ${r}, donc ${a} − ${b} = ${r}.`,
          },
          (el) =>
            tabs(el, [
              lineModel({
                lo: 0,
                hi: 20,
                start: b,
                seq,
                hint: `La grenouille part de ${b}. Fais-la sauter jusqu'à ${a}. De combien a-t-elle avancé ?`,
              }),
              countersModel({
                a: b,
                b: r,
                op: 'add',
                unknown: 'b',
                hint: `Il y a ${b} jetons. Remplis les cases vides jusqu'à ${a}. Combien en ajoutes-tu ?`,
              }),
            ]),
        );
      }
      return withViz(
        {
          prompt: eq(a, '-', b, '=', '{?}'),
          input: 'number',
          answer: r,
          hint: `Essaie : <b>${st.name}</b>.`,
          explain: `<b>${st.name}</b> — ${st.txt}`,
        },
        (el) => tabs(el, subModels(a, b)),
      );
    },
  });

  /* ==================================================================
     4. Terme manquant
     ================================================================== */
  M.registerSkill({
    id: 'terme-manquant',
    domain: D,
    title: 'Le nombre caché',
    icon: '🔍',
    learn: 'strategies',
    desc: 'Trouver le nombre qui manque : 5 + ▢ = 12, ▢ − 3 = 6…',
    pda: 'Opérations A.5 — déterminer un terme manquant (addition et soustraction)',
    gen({ lvl }) {
      const forms = lvl === 0 ? ['a+?', 'a+?', '?+b'] : ['a+?', '?+b', 'a-?', '?-b'];
      const f = pick(forms);
      const max = lvl === 0 ? 10 : lvl === 1 ? 15 : 20;
      let a, b, c, ans, prompt, explain, hint, models;
      if (f === 'a+?' || f === '?+b') {
        c = rnd(Math.min(5, max), max);
        a = rnd(1, c - 1);
        b = c - a;
        if (f === 'a+?') {
          ans = b;
          const rev = lvl === 2 && Math.random() < 0.35;
          prompt = rev ? eq(c, '=', a, '+', '{?}') : eq(a, '+', '{?}', '=', c);
          hint = `Pars de ${a} et compte jusqu'à ${c}.`;
          explain = `${a} + <b>${b}</b> = ${c}. Pour trouver, pense à ${c} − ${a} = ${b}, ou avance de ${a} jusqu'à ${c}.`;
          models = [
            countersModel({ a, b, op: 'add', unknown: 'b' }),
            lineModel({
              lo: 0,
              hi: c > 10 ? 20 : 10,
              start: a,
              seq: seqAdd(a, b),
              hint: `Pars de ${a}. Combien de bonds pour arriver à ${c} ?`,
            }),
          ];
        } else {
          ans = a;
          prompt = eq('{?}', '+', b, '=', c);
          hint = `On peut changer l'ordre : ${b} + ▢ = ${c}.`;
          explain = `<b>${a}</b> + ${b} = ${c}. On peut changer l'ordre : ${b} + ? = ${c}. De ${b} à ${c}, il y a ${a}.`;
          models = [
            countersModel({ a, b, op: 'add', unknown: 'a' }),
            lineModel({
              lo: 0,
              hi: c > 10 ? 20 : 10,
              start: b,
              seq: seqAdd(b, a),
              hint: `Pars de ${b}. Combien de bonds pour arriver à ${c} ?`,
            }),
          ];
        }
      } else {
        a = rnd(Math.min(6, max), max);
        b = rnd(1, a - 1);
        c = a - b;
        if (f === 'a-?') {
          ans = b;
          prompt = eq(a, '-', '{?}', '=', c);
          hint = `Combien faut-il enlever à ${a} pour qu'il reste ${c} ?`;
          explain = `${a} − <b>${b}</b> = ${c}. De ${c} à ${a}, il y a ${b} : c'est ce qu'on a enlevé.`;
          models = [
            countersModel({ a, b, op: 'sub', unknown: 'b' }),
            lineModel({
              lo: 0,
              hi: a > 10 ? 20 : 10,
              start: a,
              seq: seqSub(a, b),
              hint: `Pars de ${a} et recule jusqu'à ${c}. De combien as-tu reculé ?`,
            }),
          ];
        } else {
          ans = a;
          prompt = eq('{?}', '-', b, '=', c);
          hint = `Il en reste ${c} après en avoir enlevé ${b}. Remets-les : ${c} + ${b}.`;
          explain = `<b>${a}</b> − ${b} = ${c}. Pour retrouver le départ, on remet ce qu'on a enlevé : ${c} + ${b} = ${a}.`;
          models = [
            countersModel({
              a,
              b,
              op: 'sub',
              unknown: 'a',
              hint: `Il reste ${c} jetons et ${b} sont barrés. Combien y en avait-il au début ?`,
            }),
            lineModel({
              lo: 0,
              hi: a > 10 ? 20 : 10,
              start: c,
              seq: seqAdd(c, b),
              hint: `Pars de ${c} et avance de ${b} pour retrouver le départ.`,
            }),
          ];
        }
      }
      return withViz({ prompt, input: 'number', answer: ans, hint, explain }, (el) => tabs(el, models));
    },
  });

  /* ==================================================================
     5. Relation d'égalité
     ================================================================== */
  type Side = OpBalanceTerm[];
  const T = (v: number, neg?: boolean): OpBalanceTerm => ({ v, neg: !!neg });
  const U = (): OpBalanceTerm => ({ v: 0, unk: true });
  const sideTxt = (side: Side) => side.map((t, i) => (i ? (t.neg ? ` ${MINUS} ` : ' + ') : '') + (t.unk ? '?' : t.v)).join('');
  const sideVal = (side: Side, x = 0) => side.reduce((s, t) => s + (t.neg ? -1 : 1) * (t.unk ? x : t.v), 0);
  const ex = (side: Side) => (side.length === 1 ? String(side[0].v) : `${sideTxt(side)} = ${sideVal(side)}`);
  const sideParts = (side: Side) => side.flatMap((t, i) => (i ? [t.neg ? '-' : '+'] : []).concat([t.unk ? '{?}' : String(t.v)]));
  M.registerSkill({
    id: 'egalite',
    domain: D,
    title: 'La balance (égalité)',
    icon: '⚖️',
    learn: 'sens-operations',
    desc: 'Le signe = veut dire « a la même valeur que ». Vrai ou faux ?',
    pda: "Sens des opérations A.4, A.5a — relation d'égalité, commutativité",
    gen({ lvl }) {
      const kinds = lvl === 0 ? ['commut', 'vf0', 'vf0'] : lvl === 1 ? ['commut', 'vf1', 'vf1', 'unk1'] : ['vf2', 'unk1', 'unk2', 'unk2'];
      const k = pick(kinds);
      let L: Side,
        R: Side,
        ans: number | undefined,
        isVF = false,
        commut = false;
      if (k === 'commut') {
        const a = rnd(1, 9);
        let b = rnd(1, 9);
        if (b === a) b = a === 9 ? 8 : a + 1;
        commut = true;
        if (Math.random() < 0.5) {
          L = [T(a), T(b)];
          R = [T(b), U()];
          ans = a;
        } else {
          L = [T(a), T(b)];
          R = [U(), T(a)];
          ans = b;
        }
      } else if (k === 'vf0') {
        const a = rnd(1, 9),
          b = rnd(1, 9),
          s = a + b,
          ok = Math.random() < 0.5;
        const n = ok ? s : s + pick([-2, -1, 1, 2]);
        isVF = true;
        if (Math.random() < 0.5) {
          L = [T(a), T(b)];
          R = [T(n)];
        } else {
          L = [T(n)];
          R = [T(a), T(b)];
        }
      } else if (k === 'vf1') {
        isVF = true;
        const a = rnd(1, 9),
          b = rnd(1, 9),
          s = a + b,
          ok = Math.random() < 0.5;
        L = [T(a), T(b)];
        const v = Math.random();
        if (v < 0.25 && !ok) {
          R = [T(s), T(rnd(1, 4))];
        } else if (v < 0.6) {
          const target = ok ? s : s + pick([-2, -1, 1, 2]);
          const c = rnd(Math.min(target, 1), target);
          R = [T(c), T(target - c)];
          if (ok && c === a) R = [T(target - c), T(c)];
        } else {
          const target = ok ? s : s + pick([-1, 1, 2]);
          const d = rnd(1, 5);
          R = [T(target + d), T(d, true)];
        }
      } else if (k === 'vf2') {
        isVF = true;
        const ok = Math.random() < 0.5;
        const a = rnd(8, 18),
          b = rnd(1, a - 2),
          v = a - b;
        L = [T(a), T(b, true)];
        const target = ok ? v : v + pick([-1, 1, 2]);
        if (Math.random() < 0.5) {
          const d = rnd(1, 6);
          R = [T(target + d), T(d, true)];
        } else {
          const c = rnd(0, target);
          R = [T(c), T(target - c)];
        }
      } else if (k === 'unk1') {
        const a = rnd(2, 9),
          b = rnd(2, 9),
          s = a + b;
        let c = rnd(1, s - 1),
          g = 0;
        while ((c === a || c === b) && g++ < 20) c = rnd(1, s - 1);
        L = [T(a), T(b)];
        R = [T(c), U()];
        ans = s - c;
      } else {
        if (Math.random() < 0.5) {
          const c = rnd(2, 9),
            d = rnd(2, 9),
            s = c + d,
            a = rnd(1, s - 1);
          L = [T(a), U()];
          R = [T(c), T(d)];
          ans = s - a;
        } else {
          const a = rnd(9, 18),
            b = rnd(1, a - 4),
            v = a - b,
            d = rnd(1, v - 1);
          L = [T(a), T(b, true)];
          R = [U(), T(d)];
          ans = v - d;
        }
      }
      const Lv = sideVal(L),
        Rv = sideVal(R);
      const prompt =
        (isVF ? instr('Vrai ou faux ?') : instr('Quel nombre rend les deux côtés égaux ?')) + eq(...sideParts(L), '=', ...sideParts(R));
      const viz = (el: HTMLElement) => balanceViz(el, { L, R, ans });
      const say =
        (isVF ? 'Vrai ou faux ? ' : 'Quel nombre rend les deux côtés égaux ? ') + `${sideTxt(L)} = ${sideTxt(R)}`.replace('?', '▢');
      if (isVF) {
        const ok = Lv === Rv;
        return withViz(
          {
            prompt,
            say,
            input: 'choice',
            answer: ok ? 'vrai' : 'faux',
            choices: [
              { label: '✅ Vrai', value: 'vrai' },
              { label: '❌ Faux', value: 'faux' },
            ],
            hint: 'Calcule chaque côté du signe =, puis compare.',
            explain:
              `À gauche : ${ex(L)}. À droite : ${ex(R)}. ` +
              (ok
                ? `Les deux côtés valent ${Lv} : c'est <b>vrai</b> ! Le signe = veut dire « a la même valeur que ».`
                : `${Lv} et ${Rv}, ce n'est pas pareil : c'est <b>faux</b>.`),
          },
          viz,
        );
      }
      const unkLeft = L.some((t) => t.unk),
        known = unkLeft ? R : L,
        other = unkLeft ? L : R,
        V = unkLeft ? Rv : Lv;
      return withViz(
        {
          prompt,
          say,
          input: 'number',
          answer: ans ?? 0,
          hint: commut
            ? "Regarde bien les nombres des deux côtés. On peut changer l'ordre dans une addition !"
            : `Calcule d'abord le côté complet : ${sideTxt(known)} = ?`,
          explain: commut
            ? `Dans une addition, on peut changer l'ordre des nombres : ${L[0].v} + ${L[1].v} = ${L[1].v} + ${L[0].v}. Les deux côtés font ${Lv}.`
            : `${sideTxt(known)} = ${V}. Il faut que ${sideTxt(other)} = ${V} aussi, donc ? = <b>${ans}</b>.`,
        },
        viz,
      );
    },
  });

  /* ==================================================================
     6. Calculs < 100
     ================================================================== */
  function explainTens(a: number, b: number, sign: number) {
    const tens = Math.floor(b / 10) * 10,
      u = b % 10;
    const S = sign > 0 ? '+' : MINUS;
    const mid = a + sign * tens,
      end = mid + sign * u;
    const parts: string[] = [];
    if (tens) parts.push(`${a} ${S} ${tens} = ${mid}`);
    if (u) {
      const ten = sign > 0 ? Math.ceil(mid / 10) * 10 : Math.floor(mid / 10) * 10;
      const cross = mid % 10 !== 0 && Math.floor(mid / 10) !== Math.floor(end / 10) && end % 10 !== 0;
      if (cross) parts.push(`${mid} ${S} ${Math.abs(ten - mid)} = ${ten}`, `${ten} ${S} ${u - Math.abs(ten - mid)} = ${end}`);
      else parts.push(`${mid} ${S} ${u} = ${end}`);
    }
    return parts.join(', puis ');
  }
  M.registerSkill({
    id: 'calcul-100',
    domain: D,
    title: "Calculer jusqu'à 100",
    icon: '💯',
    learn: 'droite-numerique',
    desc: 'Additions et soustractions de nombres plus petits que 100, à ta façon.',
    pda: "Opérations A.3a, A.4a — processus personnels d'addition et de soustraction (< 100)",
    gen({ lvl }) {
      const add = Math.random() < 0.5;
      let a,
        b,
        g = 0;
      const ok = (x: number, y: number) => {
        const regroup = add ? (x % 10) + (y % 10) >= 10 : y % 10 > x % 10;
        const r = add ? x + y : x - y;
        if (r < 0 || r > 99 || y < 1) return false;
        if (lvl === 0) return !regroup;
        if (lvl === 1) return y < 10 ? true : !regroup;
        return y >= 11 && regroup;
      };
      do {
        if (lvl === 0) {
          a = rnd(11, 89);
          b = pick([rnd(1, 9), rnd(1, 6) * 10, rnd(11, 45)]);
        } else if (lvl === 1) {
          a = rnd(12, 89);
          b = Math.random() < 0.6 ? rnd(3, 9) : rnd(11, 40);
        } else {
          a = add ? rnd(14, 69) : rnd(31, 95);
          b = add ? rnd(15, 49) : rnd(12, a - 5);
        }
      } while (!ok(a, b) && g++ < 200);
      if (!ok(a, b)) {
        a = 34;
        b = add ? 25 : 12;
      }
      const r = add ? a + b : a - b,
        sign = add ? 1 : -1;
      const { lo, hi } = M.viz.lineRange([a, r]);
      const seq = seqTens(a, b, sign);
      const exp = explainTens(a, b, sign);
      const regroup = add ? (a % 10) + (b % 10) >= 10 : b % 10 > a % 10;
      let extra = '';
      if (add && b >= 10)
        extra = ` Autre façon : les dizaines ensemble (${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10}), les unités ensemble (${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}), puis on réunit : ${r}.`;
      return withViz(
        {
          prompt: eq(a, add ? '+' : '-', b, '=', '{?}'),
          input: 'number',
          answer: r,
          hint:
            b >= 10
              ? `Fais d'abord les dizaines : ${a} ${add ? '+' : MINUS} ${Math.floor(b / 10) * 10}, puis les unités.`
              : regroup && a % 10
                ? `Passe par la dizaine ${add ? Math.ceil(a / 10) * 10 : Math.floor(a / 10) * 10}.`
                : regroup
                  ? `Recule de ${b} à partir de ${a}.`
                  : 'Regarde seulement les unités.',
          explain:
            (a % 10 === 0 && b % 10 === 0
              ? `${a / 10} ${M.plural(a / 10, 'dizaine')} ${add ? '+' : MINUS} ${b / 10} ${M.plural(b / 10, 'dizaine')} = ${r / 10} ${M.plural(r / 10, 'dizaine')}, donc ${r}.`
              : `Par bonds : ${exp}.`) + extra,
        },
        (el) =>
          tabs(el, [
            { label: '🟥 Blocs base 10', mount: (sub) => M.viz.blocks(sub, { a, b, op: add ? 'add' : 'sub', unknown: 'r' }) },
            lineModel({
              lo,
              hi,
              start: a,
              seq,
              buttons: [-10, -1, 1, 10],
              hint: `Pars de ${a}. Fais des bonds de 10, puis des bonds de 1.`,
            }),
          ]),
      );
    },
  });

  /* ==================================================================
     7. Calculs < 1000 (centaines et dizaines)
     ================================================================== */
  function seq1000(a: number, b: number, sign: number) {
    const out: number[] = [];
    let pos = a;
    const c = Math.floor(b / 100),
      d = Math.floor((b % 100) / 10),
      u = b % 10;
    for (let i = 0; i < c; i++) {
      pos += 100 * sign;
      out.push(pos);
    }
    if (d) {
      if (d <= 3)
        for (let i = 0; i < d; i++) {
          pos += 10 * sign;
          out.push(pos);
        }
      else {
        pos += d * 10 * sign;
        out.push(pos);
      }
    }
    if (u) {
      pos += u * sign;
      out.push(pos);
    }
    return out;
  }
  function explain1000(a: number, b: number, sign: number) {
    const S = sign > 0 ? '+' : MINUS,
      r = a + sign * b;
    if (a % 100 === 0 && b % 100 === 0) {
      const x = a / 100,
        y = b / 100,
        z = x + sign * y;
      return `${x} ${M.plural(x, 'centaine')} ${S} ${y} ${M.plural(y, 'centaine')} = ${z} ${M.plural(z, 'centaine')}, donc ${a} ${S} ${b} = ${r}.`;
    }
    if (b % 100 === 0) {
      const x = Math.floor(a / 100),
        y = b / 100,
        z = x + sign * y;
      return `${a}, c'est ${hundredsLabel(a)}. On ${sign > 0 ? 'ajoute' : 'enlève'} ${y} ${M.plural(y, 'centaine')} : ${x} ${S} ${y} = ${z} ${M.plural(z, 'centaine')}. Les dizaines et les unités ne changent pas : ${r}.`;
    }
    if (b < 100 && b % 10 === 0 && a % 10 === 0 && Math.floor(a / 100) !== Math.floor(r / 100)) {
      const x = a / 10,
        y = b / 10,
        z = r / 10;
      return (
        `${a}, c'est ${x} dizaines. ${x} ${S} ${y} = ${z} dizaines, donc ${a} ${S} ${b} = ${r}.` +
        (a % 100 && r % 100 ? ` (On passe par ${sign > 0 ? Math.ceil(a / 100) * 100 : Math.floor(a / 100) * 100}.)` : '')
      );
    }
    const seq = seq1000(a, b, sign);
    let prev = a;
    const steps = seq.map((v) => {
      const t = `${prev} ${S} ${Math.abs(v - prev)} = ${v}`;
      prev = v;
      return t;
    });
    return (
      (steps.length > 1 ? `On décompose ${b} (${hundredsLabel(b)}) et on avance par bonds : ` : 'Un seul bond : ') +
      steps.join(', puis ') +
      '.'
    );
  }
  M.registerSkill({
    id: 'calcul-1000',
    domain: D,
    title: 'Calculer avec des centaines',
    icon: '🏗️',
    learn: 'droite-numerique',
    desc: 'Ajouter ou enlever des centaines et des dizaines : 340 + 200, 500 − 30…',
    pda: 'Opérations A.4a — processus personnels avec des nombres < 1000 (centaines, dizaines)',
    gen({ lvl }) {
      const add = Math.random() < 0.5;
      let a,
        b,
        g = 0;
      const valid = (x: number, y: number) => y > 0 && (add ? x + y < 1000 : x - y >= 0) && x !== y;
      do {
        if (lvl === 0) {
          if (Math.random() < 0.5) {
            a = rnd(1, 8) * 100;
            b = rnd(1, 8) * 100;
          } else {
            a = rnd(1, 7) * 100 + rnd(1, 9) * 10;
            b = rnd(1, 4) * 100;
          }
        } else if (lvl === 1) {
          const k = rnd(0, 2);
          if (k === 0) {
            a = rnd(1, 8) * 100 + rnd(1, 9) * 10;
            b = rnd(1, 5) * 100;
          } else if (k === 1) {
            a = rnd(1, 9) * 100 + rnd(0, 6) * 10;
            b = rnd(1, 9 - (a % 100) / 10) * 10;
            if (!add) {
              a = rnd(1, 9) * 100 + rnd(3, 9) * 10;
              b = rnd(1, (a % 100) / 10) * 10;
            }
          } else {
            a = add ? rnd(1, 8) * 100 + rnd(5, 9) * 10 : rnd(2, 9) * 100;
            b = add ? (10 - (a % 100) / 10) * 10 : rnd(1, 9) * 10;
          }
        } else {
          a = rnd(1, 6) * 100 + rnd(0, 9) * 10 + pick([0, 0, 5]);
          b = rnd(1, 3) * 100 + rnd(1, 9) * 10 + pick([0, 0, 5]);
          if (!add && b > a) [a, b] = [b, a];
        }
      } while (!valid(a, b) && g++ < 200);
      if (!valid(a, b)) {
        a = 340;
        b = 200;
      }
      const sign = add ? 1 : -1,
        r = a + sign * b;
      const mn = Math.min(a, r),
        mx = Math.max(a, r);
      let lo = Math.floor(mn / 100) * 100,
        hi = Math.ceil(mx / 100) * 100;
      if (hi === lo) hi += 100;
      if (hi - lo < 200) {
        if (hi + 100 <= 1000) hi += 100;
        else lo -= 100;
      }
      const S = add ? '+' : MINUS;
      return withViz(
        {
          prompt: eq(a, add ? '+' : '-', b, '=', '{?}'),
          input: 'number',
          answer: r,
          hint:
            b % 100 === 0
              ? `Compte par centaines : ${a} ${S} 100, ${S} 100…`
              : `Fais d'abord les centaines, puis les dizaines${b % 10 ? ', puis les unités' : ''}.`,
          explain: explain1000(a, b, sign),
        },
        (el) =>
          tabs(el, [
            { label: '🟧 Blocs', mount: (sub) => blocks1000Viz(sub, { a, b, opSign: S, r }) },
            lineModel({
              lo,
              hi,
              start: a,
              seq: seq1000(a, b, sign),
              labelEvery: hi - lo <= 400 ? 50 : 100,
              buttons: [-100, -10, 10, 100],
              hint: `Pars de ${a}. Fais des bonds de 100, puis des bonds de 10.`,
            }),
          ]),
      );
    },
  });

  /* 8. Situations-problèmes : l'habileté « problemes » (même id) est maintenant dans le domaine
     « Comprendre et résoudre » (js/maths/skills/problemes.js), écrite sur le générateur M.pb. */

  /* ==================================================================
     9. Groupes égaux (sens de la multiplication)
     ================================================================== */
  // [emoji, objets, contenants, contenant, préposition]
  const THINGS = [
    ['🍪', 'biscuits', 'assiettes', 'assiette', 'Sur'],
    ['🍎', 'pommes', 'sacs', 'sac', 'Dans'],
    ['⭐', 'étoiles', 'pages', 'page', 'Sur'],
    ['🐟', 'poissons', 'seaux', 'seau', 'Dans'],
    ['🧤', 'mitaines', 'paniers', 'panier', 'Dans'],
    ['🌷', 'fleurs', 'pots', 'pot', 'Dans'],
    ['🥚', 'œufs', 'nids', 'nid', 'Dans'],
    ['🍓', 'fraises', 'bols', 'bol', 'Dans'],
  ];
  const ROWS = [
    ['🪑', 'chaises'],
    ['🚗', 'autos'],
    ['🌻', 'tournesols'],
    ['🧁', 'petits gâteaux'],
    ['🪟', 'fenêtres'],
  ];
  const repeated = (g: number, k: number) => Array(g).fill(k).join(' + ');
  M.registerSkill({
    id: 'groupes-egaux',
    domain: D,
    title: 'Groupes égaux',
    icon: '🧺',
    learn: 'multiplication-partage',
    desc: "3 groupes de 4, des rangées de chaises : l'addition répétée.",
    pda: 'Sens des opérations A.3a — sens de la multiplication (addition répétée, disposition rectangulaire); lvl 2 : notation × marquée 🌟 Défi (enrichissement : au 1er cycle, sens seulement)',
    gen({ lvl }) {
      const kinds =
        lvl === 0
          ? ['groups', 'groups', 'rep']
          : lvl === 1
            ? ['groups', 'array', 'array', 'match', 'rep']
            : ['times', 'groups', 'array', 'match'];
      const kind = pick(kinds);
      let g, k;
      if (lvl === 0) {
        g = rnd(2, 4);
        k = rnd(2, 5);
      } else {
        do {
          g = rnd(2, 6);
          k = rnd(2, 6);
        } while (g * k > 30);
      }
      const N = g * k;
      const th = pick(THINGS),
        rw = pick(ROWS);
      const isArray = kind === 'array' || (kind === 'times' && Math.random() < 0.4);
      const emoji = isArray ? rw[0] : th[0];
      const viz = (el: HTMLElement) =>
        groupsViz(el, { g, k, emoji, layout: isArray ? 'array' : 'groups', box: th[4] === 'Dans' && th[3] !== 'nid' });
      const sumTxt = `${repeated(g, k)} = ${N}`;
      if (kind === 'groups') {
        const txt = `Il y a ${g} ${th[2]}. ${th[4]} chaque ${th[3]}, il y a ${k} ${th[1]}. Combien ${de(th[1])} y a-t-il en tout ?`;
        return withViz(
          {
            prompt: `<div class="op-story">${txt}</div>`,
            say: txt,
            input: 'number',
            answer: N,
            hint: `Compte par bonds de ${k} : ${range(1, Math.min(g, 2))
              .map((i) => i * k)
              .join(', ')}…`,
            explain: `${g} groupes de ${k}, c'est ${sumTxt}. On compte par bonds de ${k} : ${range(1, g)
              .map((i) => i * k)
              .join(', ')}.`,
          },
          viz,
        );
      }
      if (kind === 'rep') {
        return withViz(
          {
            prompt: instr(`${g} groupes de ${k}`) + eq(...repeated(g, k).split(' '), '=', '{?}'),
            say: `${g} groupes de ${k}. ${repeated(g, k)} = ▢`,
            input: 'number',
            answer: N,
            hint: `Compte par bonds de ${k}.`,
            explain: `${sumTxt}. Quand on additionne le même nombre plusieurs fois, ce sont des groupes égaux.`,
          },
          viz,
        );
      }
      if (kind === 'array') {
        const txt = `Il y a ${g} rangées de ${k} ${rw[1]}. Combien ${de(rw[1])} y a-t-il en tout ?`;
        return withViz(
          {
            prompt: `<div class="op-story">${txt}</div>`,
            say: txt,
            input: 'number',
            answer: N,
            hint: `Chaque rangée a ${k} ${rw[1]}. Compte rangée par rangée.`,
            explain: `${g} rangées de ${k} : ${sumTxt}.`,
          },
          (el) => groupsViz(el, { g, k, emoji: rw[0], layout: 'array' }),
        );
      }
      if (kind === 'match') {
        const right = repeated(g, k);
        const opts = new Set([right]);
        [
          `${g} + ${k}`,
          repeated(Math.max(2, g - 1), k),
          repeated(g + 1, k),
          isArray ? repeated(g, k + 1) : repeated(k, g),
          repeated(g, Math.max(2, k - 1)),
        ].forEach((s) => {
          if (opts.size < 4) opts.add(s);
        });
        return withViz(
          {
            say: "Quelle addition va avec l'image ?",
            prompt:
              instr("Quelle addition va avec l'image ?") + `<div class="op-tip">${g} ${isArray ? 'rangées' : 'groupes'} de ${k}</div>`,
            input: 'choice',
            answer: right,
            choices: shuffle([...opts]).map((s) => ({ label: s, value: s })),
            hint: `Combien y a-t-il de ${isArray ? 'rangées' : 'groupes'} ? Combien d'objets dans chacun ?`,
            explain: `Il y a ${g} ${isArray ? 'rangées' : 'groupes'} de ${k}, donc on additionne ${k} ${g} fois : ${sumTxt}.`,
          },
          viz,
        );
      }
      // times (lvl 2) : notation × = défi 🌟 (au 1er cycle, le PDA vise le sens seulement)
      return withViz(
        {
          prompt:
            '<span class="tag enrich" title="Défi : au-delà du programme de 2e année">🌟 Défi</span> ' +
            instr(`${g} × ${k} veut dire « ${g} ${isArray ? 'rangées' : 'groupes'} de ${k} »`) +
            eq(g, '×', k, '=', '{?}'),
          say: `${g} fois ${k} égale combien ? ${g} groupes de ${k}.`,
          input: 'number',
          answer: N,
          hint: `Fais ${repeated(g, k)}.`,
          explain: `${g} × ${k}, c'est ${g} ${isArray ? 'rangées' : 'groupes'} de ${k} : ${sumTxt}. Le signe × se lit « fois ».`,
        },
        viz,
      );
    },
  });

  /* ==================================================================
     10. Partage (sens de la division)
     ================================================================== */
  const SHARE = [
    ['🍪', 'biscuits', 'un biscuit'],
    ['🍓', 'fraises', 'une fraise'],
    ['🃏', 'cartes', 'une carte'],
    ['🍬', 'bonbons', 'un bonbon'],
    ['🖍️', 'crayons', 'un crayon'],
    ['🍎', 'pommes', 'une pomme'],
  ];
  // [emoji, objets, contenants, contenant féminin ?]
  const BOXES: [string, string, string, boolean][] = [
    ['🥚', 'œufs', 'boîtes', true],
    ['🧁', 'petits gâteaux', 'boîtes', true],
    ['🎾', 'balles', 'tubes', false],
    ['🍎', 'pommes', 'sacs', false],
    ['🖍️', 'crayons', 'étuis', false],
  ];
  M.registerSkill({
    id: 'partage',
    domain: D,
    title: 'Partager également',
    icon: '🍪',
    learn: 'multiplication-partage',
    desc: 'Partager entre amis, ou faire des paquets égaux.',
    pda: 'Sens des opérations A.3a — sens de la division (partage, groupement / contenance)',
    gen({ lvl }) {
      const mode = Math.random() < 0.55 ? 'share' : 'boxes';
      const maxT = lvl === 0 ? 12 : lvl === 1 ? 20 : 30;
      let n,
        k,
        g = 0;
      do {
        n = rnd(2, lvl === 0 ? 3 : 5);
        k = rnd(2, lvl === 0 ? 4 : 6);
      } while (n * k > maxT && g++ < 50);
      if (n * k > maxT) {
        n = 2;
        k = 3;
      }
      const rest = lvl === 2 && Math.random() < 0.4 ? rnd(1, (mode === 'share' ? n : k) - 1) : 0;
      if (mode === 'share') {
        const total = n * k + rest;
        const [e, word, one] = pick(SHARE);
        const askRest = rest && Math.random() < 0.5;
        const txt =
          `On partage ${total} ${word} en parts égales entre ${n} enfants. ` +
          (askRest ? `Combien ${de(word)} reste-t-il ?` : `Combien en reçoit chaque enfant ?`);
        return withViz(
          {
            prompt: `<div class="op-story"><span class="op-em">${e}</span>${txt}</div>`,
            say: txt,
            input: 'number',
            answer: askRest ? rest : k,
            hint: `Donne ${one} à chaque enfant, chacun son tour.`,
            explain:
              `${n} enfants qui reçoivent chacun ${k}, ça fait ${repeated(n, k)} = ${n * k}.` +
              (rest ? ` Il en reste ${rest} : pas assez pour en donner encore ${n === 2 ? 'aux deux' : 'à tous'}.` : '') +
              (askRest ? ` Réponse : <b>${rest}</b>.` : ` Chaque enfant reçoit <b>${k}</b>.`),
          },
          (el) => shareViz(el, { total, n, emoji: e, mode: 'share' }),
        );
      }
      const total = n * k + rest;
      const [e, word, cont, fem] = pick(BOXES);
      const pleins = fem ? 'pleines' : 'pleins';
      const askRest = rest && Math.random() < 0.5;
      const txt =
        `On a ${total} ${word}. On les place dans des ${cont} de ${k}. ` +
        (askRest ? `Combien ${de(word)} reste-t-il à la fin ?` : `Combien ${de(cont)} ${pleins} peut-on remplir ?`);
      return withViz(
        {
          prompt: `<div class="op-story"><span class="op-em">${e}</span>${txt}</div>`,
          say: txt,
          input: 'number',
          answer: askRest ? rest : n,
          hint: `Fais des paquets de ${k}. Combien de paquets ?`,
          explain:
            `Des paquets de ${k} : ${range(1, n)
              .map((i) => i * k)
              .join(', ')}. Ça fait ${n} paquets.` +
            (rest ? ` Il en reste ${rest}.` : '') +
            ` Réponse : <b>${askRest ? rest : n}</b>.`,
        },
        (el) => shareViz(el, { total, k, emoji: e, mode: 'boxes' }),
      );
    },
  });

  /* ==================================================================
     11. Suites et régularités
     ================================================================== */
  const SYMS = ['🔴', '🔵', '🟡', '🟢', '🟣', '⭐', '🍁', '❄️', '🐟', '🍎', '🔺', '🟦', '🌙', '🦆'];
  const UNITS: Record<number, string[]> = { 0: ['AB', 'ABC', 'AB'], 1: ['AAB', 'ABB', 'ABC'], 2: ['AABB', 'ABBC', 'AABC', 'ABCD'] };
  const sign = (d: number) => (d >= 0 ? '+' + d : MINUS + Math.abs(d));
  M.registerSkill({
    id: 'suites',
    domain: D,
    title: 'Suites et motifs',
    icon: '🔁',
    learn: 'regularites',
    desc: 'Trouver ce qui vient après dans un motif ou une suite de nombres.',
    pda: 'Opérations A.13, A.14 — régularités non numériques et numériques',
    gen({ lvl }) {
      if (Math.random() < 0.45) {
        const unit = pick(UNITS[lvl]);
        const letters = [...new Set(unit.split(''))];
        const syms = shuffle(SYMS).slice(0, letters.length + 1);
        const map: Record<string, string> = {};
        letters.forEach((l, i) => (map[l] = syms[i]));
        const extra = syms[letters.length];
        const len = unit.length * (lvl === 0 ? 3 : 2) + rnd(0, unit.length - 1);
        const items = range(0, len).map((i) => map[unit[i % unit.length]]);
        let qi = len;
        if (lvl === 2 && Math.random() < 0.5) qi = rnd(unit.length, len - 1);
        const ans = items[qi];
        const shown = items.map((x, i) => (i === qi ? null : x)).slice(0, qi === len ? len : len + 1);
        if (qi === len) shown.push(null);
        const choices = shuffle(letters.map((l) => map[l]).concat([extra])).map((s) => ({
          label: `<span style="font-size:2rem">${s}</span>`,
          value: s,
        }));
        return withViz(
          {
            prompt:
              instr(qi === len ? "Qu'est-ce qui vient ensuite ?" : "Qu'est-ce qui manque ?") +
              `<div class="op-seq">${shown.map((x) => (x == null ? '<span class="op-term e q">?</span>' : `<span class="op-term e">${x}</span>`)).join('')}</div>`,
            say: qi === len ? "Qu'est-ce qui vient ensuite ?" : "Qu'est-ce qui manque ?",
            input: 'choice',
            answer: ans,
            choices,
            hint: 'Cherche le petit bout qui se répète, et dis-le à voix haute.',
            explain: `Le motif qui se répète est : ${unit
              .split('')
              .map((l) => map[l])
              .join(' ')}. Il faut donc ${ans}.`,
          },
          (el) => seqMotifViz(el, { items: shown, unitLen: unit.length, ans }),
        );
      }
      const steps = lvl === 0 ? [1, 2, 10] : lvl === 1 ? [2, 5, 10, -1, -2] : [3, 5, -10, -2, 100, 10, -5];
      const d = pick(steps);
      const n = 4;
      let start;
      if (d === 100) start = rnd(0, 5) * 100 + rnd(0, 9) * 10;
      else if (d === 10 || d === -10) start = d > 0 ? rnd(0, 50) : rnd(6, 9) * 10 + rnd(0, 9);
      else if (d === 5 || d === -5) start = d > 0 ? rnd(0, 6) * 5 : rnd(6, 12) * 5;
      else if (d < 0) start = rnd(Math.abs(d) * n + 2, 30);
      else start = rnd(0, lvl === 0 ? 12 : 30);
      const all = range(0, n).map((i) => start + i * d);
      let qi = n;
      if (lvl === 2 && Math.random() < 0.35) qi = rnd(1, n - 1);
      const ans = all[qi];
      const terms = all.map((v, i) => (i === qi ? null : v));
      return withViz(
        {
          prompt:
            instr(qi === n ? 'Quel nombre vient ensuite ?' : 'Quel nombre manque ?') +
            `<div class="op-seq">${terms.map((v) => (v == null ? '<span class="op-term">{?}</span>' : `<span class="op-term">${v}</span>`)).join('<span class="op">,</span>')}</div>`,
          say: `${terms.map((v) => (v == null ? 'combien' : v)).join(', ')}.`,
          input: 'number',
          answer: ans,
          hint: "De combien change-t-on d'un nombre au suivant ?",
          explain: `La règle : on fait <b>${sign(d)}</b> à chaque fois. ${qi === n ? `${all[n - 1]} ${d >= 0 ? '+' : MINUS} ${Math.abs(d)} = ${ans}` : `${all[qi - 1]} ${d >= 0 ? '+' : MINUS} ${Math.abs(d)} = ${ans}`}.`,
        },
        (el) => seqNumViz(el, { terms, step: d, ans }),
      );
    },
  });
})();
