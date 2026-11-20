/* =====================================================================
   skills/mesure.js — La mesure : longueurs et temps (2e année, 1er cycle)
   M.mesure : dessins réutilisables (crayons, règle, unités, horloge,
              calendrier, animations) — aussi utilisés par learn/mesure.js
   ===================================================================== */

/* ---------- types de M.mesure (scripts globaux : fusion avec MApi) ---------- */
interface MApi {
  mesure: MesureApi;
}
interface MesureSeason {
  id: string;
  em: string;
  /** « le printemps », « l'été »… */
  the: string;
  /** Mois (0 = janvier). */
  months: number[];
  start: string;
}
interface MesureEvent {
  name: string;
  em: string;
  /** Mois (si non ambigu). */
  m?: number;
  /** Saison. */
  s?: string;
  when: string;
}
interface MesureSign {
  t: string;
  em: string;
  s: string;
}
interface MesureColor {
  n: string;
  c: string;
}
type MesureObjKind = 'crayon' | 'ruban' | 'paille' | 'baton';
interface MesureObj {
  the: string;
  same: string;
  pr: string;
  a: string;
}
/** Unités non conventionnelles. */
type MesureUnitKind = 'cube' | 'trombone' | 'gomme' | 'carte';
interface MesureUnit {
  w: number;
  h: number;
  sing: string;
  pl: string;
  fem: boolean;
}
interface MesureSvgOpts {
  cls?: string;
  x?: number;
  y?: number;
  max?: number;
}
/** Horloge à aiguilles : ring (couronne des minutes), minutes (visible), ha / ma (angles forcés), hl (aiguille surlignée). */
interface MesureClockOpts {
  ring?: boolean;
  minutes?: boolean;
  ha?: number;
  ma?: number;
  size?: number;
  cls?: string;
  hl?: 'h' | 'm';
}
interface MesureClockWidgetOpts {
  /** Minutes depuis minuit. */
  t?: number;
  /** Horloge de 24 h. */
  day?: boolean;
  /** Boutons (± minutes). */
  buttons?: number[];
  step?: number;
  ring?: boolean;
  size?: number;
  digital?: boolean;
  onChange?: (h: number, m: number, t: number) => void;
}
interface MesureClockWidget {
  get(): number;
  set(t: number): void;
  /** Avance (ou recule) les aiguilles jusqu'à target, en animation. */
  animateTo(target: number, alive: () => boolean, dur?: number | 'auto'): Promise<void>;
  svg: SVGSVGElement;
}
interface MesureCalOpts {
  today?: number | null;
  hl?: number | null;
  title?: string;
}
/** Tuile d'une bande (jours, mois, saisons). */
interface MesureTile {
  t: string;
  sub?: string;
  em?: string;
  cls?: string;
}
interface MesureApi {
  DAYS: string[];
  DAYS_AB: string[];
  MONTHS: string[];
  SEASONS: MesureSeason[];
  EVENTS: MesureEvent[];
  SIGNS: MesureSign[];
  COLORS: MesureColor[];
  OBJ: Record<MesureObjKind, MesureObj>;
  NU: Record<MesureUnitKind, MesureUnit>;
  cap(s: string): string;
  svg(w: number, h: number, inner: string, o?: MesureSvgOpts): string;
  /** Réserve el pour une nouvelle animation : les anciennes s'arrêtent. Retourne « encore vivante ? ». */
  claim(el: Element): () => boolean;
  tween(alive: () => boolean, dur: number, step: (k: number) => void): Promise<boolean>;
  wait(alive: () => boolean, ms: number): Promise<boolean>;
  addSvg(parent: Element, html: string): SVGGElement;
  status(el: HTMLElement, html: string): void;
  objSvg(kind: MesureObjKind, x: number, y: number, len: number, color: string, h?: number): string;
  unitSvg(k: MesureUnitKind, x: number, y: number, i?: number): string;
  unitRow(k: MesureUnitKind, x: number, y: number, count: number, gap?: number, numbers?: boolean): string;
  miniUnit(k: MesureUnitKind): string;
  rulerSvg(x0: number, y: number, n: number, px: number): string;
  fmt(h: number, m: number): string;
  h12(h: number): number;
  hourWords(h: number): string;
  timeWords(h: number, m: number): string;
  phrase(h: number, m: number, period?: boolean): string;
  clockSvg(h: number, m: number, o?: MesureClockOpts): string;
  setHands(root: ParentNode, t: number): void;
  clockWidget(host: HTMLElement, o?: MesureClockWidgetOpts): MesureClockWidget;
  svgPoint(svgEl: SVGSVGElement, e: { clientX: number; clientY: number }): DOMPoint | null;
  calHtml(y: number, mo: number, o?: MesureCalOpts): string;
  calMark(root: ParentNode, col: number | null, d: number | null): void;
  dateHtml(d: number): string;
  dateSay(d: number): string;
  stripHtml(items: MesureTile[], cols?: number): string;
  badge(tile: Element | null | undefined, txt: string): void;
  scaleSvg(): string;
  rodsSvg(n: number, numbered?: number): string;
}
/**
 * Question en construction (les générateurs remplissent q champ par champ selon le format choisi).
 * Validée à l'exécution par tools/check-skills.ts.
 */
type MesureDraft = Partial<QuestionBase> & {
  input?: 'choice' | 'number' | 'order';
  choices?: Choice[];
  answer?: Value | Value[];
  unit?: string;
  cols?: number;
};

(function () {
  'use strict';
  const M = window.M;
  const D = 'mesure';
  /** Question terminée (voir MesureDraft). */
  const done = (q: MesureDraft): Question => q as Question;
  type Alive = () => boolean;

  /* try : tools/check-skills.js simule un élément dont textContent est en lecture seule */
  try {
    M.css(`
  .me-svg { display: block; width: 100%; height: auto; margin: 0 auto; user-select: none; -webkit-user-select: none; touch-action: manipulation }
  .me-svg text { font-family: inherit }
  .me-cn { font-size: 22px; font-weight: 900; fill: #2b2d42; text-anchor: middle }
  .me-ml { font-size: 13px; font-weight: 800; fill: #118ab2; text-anchor: middle }
  .me-rn { font-size: 17px; font-weight: 800; fill: #2b2d42; text-anchor: middle; pointer-events: none }
  .me-ru { font-size: 12px; font-weight: 800; fill: #8a6d12 }
  .me-t { font-size: 16px; font-weight: 800; fill: #2b2d42 }
  .me-t.mid { text-anchor: middle }
  .me-t.small { font-size: 13px; fill: #7a7f99 }
  .me-t.big { font-size: 22px; font-weight: 900 }
  .me-mk { font-size: 14px; font-weight: 900; fill: #fff; text-anchor: middle; pointer-events: none }
  .me-hit { fill: transparent; cursor: pointer }
  .me-hl { animation: me-glow .7s ease-in-out infinite alternate }
  @keyframes me-glow { from { filter: drop-shadow(0 0 0 #ffb703) } to { filter: drop-shadow(0 0 7px #ff9f1c) } }
  .me-warn { display: inline-block; background: #fff1d6; border: 3px solid #f78c40; border-radius: 14px; padding: 2px 10px; font-size: 1.05rem; margin-bottom: 6px }
  .me-sw { display: inline-block; width: 26px; height: 14px; border-radius: 6px; vertical-align: middle; margin-right: 6px; border: 2px solid rgba(0,0,0,.2) }
  .me-dig { font-weight: 900; font-variant-numeric: tabular-nums; white-space: nowrap }
  .me-digbox { display: inline-block; background: #2b2d42; color: #7ef0c4; border-radius: 12px; padding: 4px 14px; font-size: 1.8rem; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing: 1px; min-width: 5.5em; text-align: center }
  .me-small { font-size: .8rem; font-weight: 700; color: #7a7f99 }
  .me-cw { display: flex; flex-direction: column; align-items: center; gap: 8px }
  .me-cw .me-clock { cursor: grab; touch-action: none }
  .me-cw-btns { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center }
  .me-cw-btns .btn { padding: 6px 10px; font-size: .95rem }
  .me-strip { display: grid; gap: 6px; margin: 4px 0 }
  .me-tile { border: 3px solid #e7e1d3; background: #fff; border-radius: 14px; padding: 6px 4px; text-align: center; font-weight: 800; font-size: .95rem; min-height: 46px; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.15; position: relative; transition: transform .15s }
  button.me-tile { cursor: pointer; font-family: inherit; color: inherit }
  .me-tile small { font-weight: 700; color: #7a7f99; font-size: .75rem }
  .me-tile .me-em { font-size: 1.3rem }
  .me-tile.on { border-color: #06a77d; background: #dcf7ee; transform: scale(1.06) }
  .me-tile.today { border-color: #118ab2; background: #dff3fb }
  .me-tile.y { border-color: #f78c40; background: #ffe9d6 }
  .me-tile.we { background: #fbfaf6 }
  .me-tile .me-badge { position: absolute; top: -10px; right: -6px; background: #2b2d42; color: #fff; border-radius: 999px; font-size: .75rem; padding: 1px 7px }
  .me-tile.hidden-lbl { color: #c7c2b4 }
  .me-cal { border-collapse: separate; border-spacing: 4px; margin: 0 auto; width: 100%; max-width: 460px; table-layout: fixed }
  .me-cal caption { font-weight: 900; font-size: 1.15rem; margin-bottom: 4px }
  .me-cal th { font-size: .85rem; color: #7a7f99; padding: 4px 0; border-radius: 8px }
  .me-cal td { text-align: center; font-weight: 800; padding: 0; height: 40px; border-radius: 10px; background: #fff; border: 2px solid #e7e1d3; cursor: pointer; font-size: 1.05rem }
  .me-cal td.empty { background: transparent; border-color: transparent; cursor: default }
  .me-cal td.we { background: #fbfaf6 }
  .me-cal td.today { border-color: #118ab2; background: #dff3fb }
  .me-cal td.on { border-color: #06a77d; background: #06a77d; color: #fff }
  .me-cal .col { background: #dcf7ee }
  .me-cal th.col { background: #06a77d; color: #fff }
  `);
  } catch (e) {}

  /* ======================= Données ======================= */
  const DAYS: string[] = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const DAYS_AB: string[] = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const MONTHS: string[] = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];
  const SEASONS: MesureSeason[] = [
    { id: 'printemps', em: '🌷', the: 'le printemps', months: [2, 3, 4], start: 'vers le 20 mars' },
    { id: 'été', em: '☀️', the: "l'été", months: [5, 6, 7], start: 'vers le 21 juin' },
    { id: 'automne', em: '🍁', the: "l'automne", months: [8, 9, 10], start: 'vers le 22 septembre' },
    { id: 'hiver', em: '❄️', the: "l'hiver", months: [11, 0, 1], start: 'vers le 21 décembre' },
  ];
  /* Fêtes et moments de l'année au Québec. m = mois (si non ambigu), s = saison */
  const EVENTS: MesureEvent[] = [
    { name: "le Jour de l'An", em: '🥳', m: 0, s: 'hiver', when: 'le 1<sup>er</sup> janvier' },
    { name: 'la Saint-Valentin', em: '❤️', m: 1, s: 'hiver', when: 'le 14 février' },
    { name: 'la semaine de relâche', em: '⛷️', s: 'hiver', when: 'au début du mois de mars' },
    { name: 'le temps des sucres', em: '🍯', s: 'printemps', when: 'en mars et en avril' },
    { name: 'Pâques', em: '🐣', s: 'printemps', when: 'en mars ou en avril' },
    { name: 'la fête des Mères', em: '💐', m: 4, s: 'printemps', when: 'en mai' },
    { name: 'la Saint-Jean-Baptiste', em: '⚜️', m: 5, s: 'été', when: 'le 24 juin' },
    { name: 'la fête du Canada', em: '🎆', m: 6, s: 'été', when: 'le 1<sup>er</sup> juillet' },
    { name: 'la rentrée scolaire', em: '🎒', when: "à la fin du mois d'août" },
    { name: "l'Halloween", em: '🎃', m: 9, s: 'automne', when: 'le 31 octobre' },
    { name: 'Noël', em: '🎄', m: 11, s: 'hiver', when: 'le 25 décembre' },
  ];
  const SIGNS: MesureSign[] = [
    { t: 'On fait un bonhomme de neige.', em: '⛄', s: 'hiver' },
    { t: 'On patine dehors sur la glace.', em: '⛸️', s: 'hiver' },
    { t: 'Les feuilles changent de couleur et tombent.', em: '🍂', s: 'automne' },
    { t: 'On ramasse des pommes au verger.', em: '🍎', s: 'automne' },
    { t: 'La neige fond et les fleurs poussent.', em: '🌷', s: 'printemps' },
    { t: 'On se baigne au lac.', em: '🏊', s: 'été' },
    { t: "C'est les grandes vacances d'école.", em: '🏖️', s: 'été' },
  ];

  const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
  const f1 = (v: number): number => Math.round(v * 10) / 10;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = (w: number, h: number, inner: string, o: MesureSvgOpts = {}): string =>
    `<svg class="me-svg ${o.cls || ''}" viewBox="${o.x || 0} ${o.y || 0} ${w} ${h}" style="max-width:${o.max || w}px" xmlns="${NS}">${inner}</svg>`;

  /* ======================= Animation ======================= */
  /** Réserve el pour une nouvelle animation : les anciennes s'arrêtent. */
  function claim(el: Element): Alive {
    const e = el as Element & { _meTok?: number };
    e._meTok = (e._meTok || 0) + 1;
    const tok = e._meTok;
    return () => !!e.isConnected && e._meTok === tok;
  }
  const raf = (f: (t: number) => void): unknown =>
    typeof requestAnimationFrame === 'function' ? requestAnimationFrame(f) : setTimeout(() => f(Date.now()), 16);
  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  function tween(alive: Alive, dur: number, step: (k: number) => void): Promise<boolean> {
    return new Promise<boolean>((res) => {
      const t0 = now();
      const f = () => {
        if (!alive()) return res(false);
        const k = Math.min(1, (now() - t0) / dur);
        step(k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
        if (k < 1) raf(f);
        else res(true);
      };
      raf(f);
    });
  }
  const wait = (alive: Alive, ms: number): Promise<boolean> => new Promise<boolean>((r) => setTimeout(() => r(alive()), ms));
  function addSvg(parent: Element, html: string): SVGGElement {
    const g = document.createElementNS(NS, 'g');
    g.innerHTML = html;
    parent.appendChild(g);
    return g;
  }
  function status(el: HTMLElement, html: string): void {
    const s = M.$('.viz-status', el);
    if (s) s.innerHTML = html;
  }

  /* ======================= Objets à mesurer ======================= */
  const COLORS: MesureColor[] = [
    { n: 'rouge', c: '#ef476f' },
    { n: 'bleu', c: '#118ab2' },
    { n: 'vert', c: '#06a77d' },
    { n: 'jaune', c: '#f4b400' },
    { n: 'mauve', c: '#9b5de5' },
    { n: 'orange', c: '#f78c40' },
  ];
  const OBJ: Record<MesureObjKind, MesureObj> = {
    crayon: { the: 'le crayon', same: 'le même crayon', pr: 'il', a: 'un crayon' },
    ruban: { the: 'le ruban', same: 'le même ruban', pr: 'il', a: 'un ruban' },
    paille: { the: 'la paille', same: 'la même paille', pr: 'elle', a: 'une paille' },
    baton: { the: 'le bâton', same: 'le même bâton', pr: 'il', a: 'un bâton' },
  };
  /** Dessine un objet de longueur exacte len (px), coin haut-gauche (x, y). */
  function objSvg(kind: MesureObjKind, x: number, y: number, len: number, color: string, h = 24): string {
    if (kind === 'crayon') {
      const tip = Math.min(24, len * 0.3),
        body = len - tip,
        m = y + h / 2,
        er = Math.min(10, body / 3);
      return (
        `<rect x="${x}" y="${y}" width="${er + 3}" height="${h}" rx="3" fill="#f7a8b8"/>` +
        `<rect x="${x + er}" y="${y}" width="${body - er}" height="${h}" fill="${color}"/>` +
        `<rect x="${x + er}" y="${y + h * 0.36}" width="${body - er}" height="${h * 0.22}" fill="rgba(255,255,255,.28)"/>` +
        `<polygon points="${x + body},${y} ${x + len},${m} ${x + body},${y + h}" fill="#f3d29b"/>` +
        `<polygon points="${f1(x + len - tip * 0.35)},${f1(m - h * 0.175)} ${x + len},${m} ${f1(x + len - tip * 0.35)},${f1(m + h * 0.175)}" fill="#2b2d42"/>`
      );
    }
    if (kind === 'paille') {
      let s = `<rect x="${x}" y="${y + 3}" width="${len}" height="${h - 6}" rx="4" fill="#fff" stroke="${color}" stroke-width="2"/>`;
      for (let i = 6; i < len - 6; i += 16)
        s += `<rect x="${x + i}" y="${y + 4}" width="7" height="${h - 8}" fill="${color}" opacity=".75"/>`;
      return s;
    }
    if (kind === 'baton') {
      return (
        `<rect x="${x}" y="${y + 2}" width="${len}" height="${h - 4}" rx="7" fill="#b07a46" stroke="#7a4f27" stroke-width="2"/>` +
        `<line x1="${x + 8}" y1="${y + h / 2}" x2="${x + len - 8}" y2="${y + h / 2}" stroke="#8c5c30" stroke-width="2" stroke-dasharray="14 9"/>`
      );
    }
    // ruban
    return (
      `<rect x="${x}" y="${y}" width="${len}" height="${h}" rx="4" fill="${color}"/>` +
      `<rect x="${x}" y="${y + 3}" width="${len}" height="3" fill="rgba(255,255,255,.35)"/>`
    );
  }

  /* ======================= Unités non conventionnelles ======================= */
  const NU: Record<MesureUnitKind, MesureUnit> = {
    cube: { w: 30, h: 30, sing: 'cube', pl: 'cubes', fem: false },
    trombone: { w: 45, h: 20, sing: 'trombone', pl: 'trombones', fem: false },
    gomme: { w: 60, h: 24, sing: 'gomme', pl: 'gommes', fem: true },
    carte: { w: 90, h: 30, sing: 'carte', pl: 'cartes', fem: true },
  };
  const longAdj = (u: MesureUnit): string => (u.fem ? 'longues' : 'longs');
  const smallAdj = (u: MesureUnit): string => (u.fem ? 'petites' : 'petits');
  function unitSvg(k: MesureUnitKind, x: number, y: number, i = 0): string {
    const u = NU[k];
    if (k === 'cube')
      return `<rect x="${x}" y="${y}" width="30" height="30" fill="${i % 2 ? '#3fd3a7' : '#06a77d'}" stroke="#04805f" stroke-width="1.5"/>`;
    if (k === 'trombone') {
      const c = i % 2 ? '#5c7cfa' : '#8d99ae';
      return (
        `<rect x="${x + 1.5}" y="${y + 1.5}" width="${u.w - 3}" height="17" rx="8.5" fill="none" stroke="${c}" stroke-width="3"/>` +
        `<rect x="${x + 10}" y="${y + 6}" width="${u.w - 20}" height="8" rx="4" fill="none" stroke="${c}" stroke-width="2.5"/>`
      );
    }
    if (k === 'gomme') {
      return (
        `<rect x="${x + 0.5}" y="${y}" width="${u.w - 1}" height="24" rx="5" fill="${i % 2 ? '#ffc8dd' : '#ff8fab'}" stroke="#c9184a" stroke-width="1.5"/>` +
        `<rect x="${x + 32}" y="${y}" width="22" height="24" fill="#4cc9f0" opacity=".75"/>`
      );
    }
    return (
      `<rect x="${x + 0.5}" y="${y}" width="${u.w - 1}" height="30" rx="4" fill="#fff" stroke="${i % 2 ? '#ef476f' : '#118ab2'}" stroke-width="3"/>` +
      `<rect x="${x + 8}" y="${y + 6}" width="${u.w - 16}" height="18" rx="2" fill="${i % 2 ? '#ffe1e8' : '#dff3fb'}"/>`
    );
  }
  /** Rangée d'unités bout à bout. gap/overlap négatif = chevauchement. */
  function unitRow(k: MesureUnitKind, x: number, y: number, count: number, gap = 0, numbers = false): string {
    const u = NU[k];
    let s = '';
    for (let i = 0; i < count; i++) {
      const ux = x + i * (u.w + gap);
      s += unitSvg(k, ux, y + (30 - u.h) / 2, i);
      if (numbers) s += `<text x="${ux + u.w / 2}" y="${y - 4}" class="me-t mid small">${i + 1}</text>`;
    }
    return s;
  }
  const miniUnit = (k: MesureUnitKind): string => svg(NU[k].w + 4, 34, unitSvg(k, 2, 2 + (30 - NU[k].h) / 2), { max: NU[k].w + 4 });

  /* ======================= Règle ======================= */
  function rulerSvg(x0: number, y: number, n: number, px: number): string {
    let s = `<rect x="${x0 - 16}" y="${y}" width="${n * px + 32}" height="58" rx="8" fill="#ffe7a3" stroke="#d9b54a" stroke-width="2"/>`;
    for (let i = 0; i <= n; i++) {
      const x = x0 + i * px;
      s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 20}" stroke="#2b2d42" stroke-width="2.5"/><text x="${x}" y="${y + 42}" class="me-rn">${i}</text>`;
    }
    s += `<text x="${x0 + n * px - 2}" y="${y + 55}" class="me-ru" text-anchor="end">cm</text>`;
    return s;
  }

  /* ======================= Horloge ======================= */
  const pad2 = (m: number): string => String(m).padStart(2, '0');
  /** Écriture québécoise : 3 h, 3 h 30, 10 h 05 */
  const fmt = (h: number, m: number): string => (m ? `${h} h ${pad2(m)}` : `${h} h`);
  const h12 = (h: number): number => ((h % 12) + 12) % 12 || 12;
  function hourWords(h: number): string {
    h = ((h % 24) + 24) % 24;
    if (h === 12) return 'midi';
    if (h === 0) return 'minuit';
    const n = h % 12;
    return n === 1 ? 'une heure' : M.frNum(n) + ' heures';
  }
  /** Heure juste sur 24 h, lue comme elle s'écrit : 13 h → « treize heures », 12 h → « midi ». */
  const h24Words = (h: number): string => (h === 12 ? 'midi' : h === 1 ? 'une heure' : M.frNum(h) + ' heures');
  /** « trois heures et quart », « quatre heures moins le quart »… */
  function timeWords(h: number, m: number): string {
    const noon = (x: number): boolean => {
      x = ((x % 24) + 24) % 24;
      return x === 12 || x === 0;
    };
    if (m === 0) return hourWords(h);
    if (m === 15) return hourWords(h) + ' et quart';
    if (m === 30) return hourWords(h) + (noon(h) ? ' et demi' : ' et demie');
    if (m === 45) return hourWords(h + 1) + ' moins le quart';
    if (m < 30) return hourWords(h) + ' ' + M.frNum(m);
    return hourWords(h + 1) + ' moins ' + M.frNum(60 - m);
  }
  /** Phrase complète. period = ajoute « du matin / de l'après-midi / du soir » (h sur 24). */
  function phrase(h: number, m: number, period?: boolean): string {
    let s = 'Il est ' + timeWords(h, m);
    if (period) {
      const wh = (m > 30 ? h + 1 : h) % 24;
      if (wh !== 12 && wh !== 0) s += h < 12 ? ' du matin' : h < 18 ? " de l'après-midi" : ' du soir';
    }
    return s;
  }
  /**
   * Horloge à aiguilles. o: { ring (réserve la couronne des minutes), minutes (visible),
   *   ha / ma (angles forcés), size, cls, hl:'h'|'m' }
   */
  function clockSvg(h: number, m: number, o: MesureClockOpts = {}): string {
    const ha = o.ha != null ? o.ha : ((h % 12) + m / 60) * 30;
    const ma = o.ma != null ? o.ma : m * 6;
    const P = o.ring ? 34 : 4;
    const rad = (d: number): number => (d * Math.PI) / 180;
    let s = `<circle cx="100" cy="100" r="96" fill="#fff" stroke="#2b2d42" stroke-width="6"/>`;
    for (let i = 0; i < 60; i++) {
      const big = i % 5 === 0,
        a = rad(i * 6),
        r1 = big ? 81 : 87;
      s += `<line x1="${f1(100 + r1 * Math.sin(a))}" y1="${f1(100 - r1 * Math.cos(a))}" x2="${f1(100 + 92 * Math.sin(a))}" y2="${f1(100 - 92 * Math.cos(a))}" stroke="#2b2d42" stroke-width="${big ? 3 : 1.3}"/>`;
    }
    for (let n = 1; n <= 12; n++) {
      const a = rad(n * 30);
      s += `<text x="${f1(100 + 68 * Math.sin(a))}" y="${f1(100 - 68 * Math.cos(a) + 8)}" class="me-cn">${n}</text>`;
    }
    if (o.ring) {
      s += `<g class="me-mins"${o.minutes ? '' : ' style="display:none"'}>`;
      for (let i = 0; i < 12; i++) {
        const a = rad(i * 30),
          x = f1(100 + 115 * Math.sin(a)),
          y = f1(100 - 115 * Math.cos(a));
        s += `<g class="me-min" data-i="${i}"><circle cx="${x}" cy="${y}" r="13" fill="#dff3fb" stroke="#118ab2" stroke-width="1.5"/><text x="${x}" y="${f1(y + 4.5)}" class="me-ml">${i * 5}</text></g>`;
      }
      s += '</g>';
    }
    s += `<g class="me-hh${o.hl === 'h' ? ' me-hl' : ''}" transform="rotate(${f1(ha)} 100 100)"><line x1="100" y1="112" x2="100" y2="50" stroke="#ef476f" stroke-width="10" stroke-linecap="round"/></g>`;
    s += `<g class="me-mh${o.hl === 'm' ? ' me-hl' : ''}" transform="rotate(${f1(ma)} 100 100)"><line x1="100" y1="114" x2="100" y2="20" stroke="#118ab2" stroke-width="6" stroke-linecap="round"/></g>`;
    s += `<circle cx="100" cy="100" r="7" fill="#2b2d42"/>`;
    return svg(200 + 2 * P, 200 + 2 * P, s, { x: -P, y: -P, cls: 'me-clock ' + (o.cls || ''), max: o.size || 260 });
  }
  function setHands(root: ParentNode, t: number): void {
    const h = Math.floor(t / 60),
      m = t - h * 60;
    const hh = M.$('.me-hh', root),
      mh = M.$('.me-mh', root);
    if (hh) hh.setAttribute('transform', `rotate(${f1(((h % 12) + m / 60) * 30)} 100 100)`);
    if (mh) mh.setAttribute('transform', `rotate(${f1(m * 6)} 100 100)`);
  }
  function svgPoint(svgEl: SVGSVGElement, e: { clientX: number; clientY: number }): DOMPoint | null {
    try {
      const p = svgEl.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      // getScreenCTM() null (élément détaché) : l'erreur est attrapée → null
      return p.matrixTransform(svgEl.getScreenCTM()!.inverse());
    } catch (err) {
      return null;
    }
  }
  /**
   * Horloge manipulable : boutons et grande aiguille à glisser.
   * o: { t (minutes depuis minuit), day (24 h), buttons:[minutes...], step, ring, size, onChange(h, m, t) }
   */
  function clockWidget(host: HTMLElement, o: MesureClockWidgetOpts = {}): MesureClockWidget {
    const mod = o.day ? 1440 : 720,
      step = o.step || 5;
    const btns = o.buttons || [-60, 60, 15, 5];
    const lbl = (d: number): string =>
      Math.abs(d) >= 60 ? `${d > 0 ? '+' : '−'}${Math.abs(d) / 60} h` : `${d > 0 ? '+' : '−'}${Math.abs(d)} min`;
    host.innerHTML = `<div class="me-cw">${clockSvg(0, 0, { ring: o.ring, size: o.size || 260 })}
      ${o.digital === false ? '' : '<div class="me-digbox me-cw-dig"></div>'}
      <div class="me-cw-btns">${btns.map((d) => `<button class="btn" data-d="${d}">${lbl(d)}</button>`).join('')}</div></div>`;
    const svgEl = M.$('svg', host)!,
      dig = M.$('.me-cw-dig', host);
    let t = (((o.t || 0) % mod) + mod) % mod;
    function draw() {
      setHands(host, t);
      const h = Math.floor(t / 60),
        m = t % 60;
      if (dig) dig.textContent = fmt(o.day ? h : h12(h), m);
      if (o.onChange) o.onChange(o.day ? h : h12(h), m, t);
    }
    const set = (nt: number): void => {
      t = ((Math.round(nt) % mod) + mod) % mod;
      draw();
    };
    M.$('.me-cw-btns', host)!.onclick = (e) => {
      const b = M.closest(e, 'button[data-d]');
      if (!b) return;
      M.sfx.tap();
      set(t + Number(b.dataset.d));
    };
    let drag = false;
    const angleMin = (e: PointerEvent): number | null => {
      const p = svgPoint(svgEl, e);
      if (!p) return null;
      let a = (Math.atan2(p.x - 100, -(p.y - 100)) * 180) / Math.PI;
      if (a < 0) a += 360;
      return (Math.round(a / 6 / step) * step) % 60;
    };
    const move = (e: PointerEvent): void => {
      const mm = angleMin(e);
      if (mm == null) return;
      let d = mm - (t % 60);
      if (d > 30) d -= 60;
      if (d < -30) d += 60;
      if (d) set(t + d);
    };
    svgEl.addEventListener('pointerdown', (e) => {
      drag = true;
      try {
        svgEl.setPointerCapture(e.pointerId);
      } catch (err) {}
      move(e);
      e.preventDefault();
    });
    svgEl.addEventListener('pointermove', (e) => {
      if (drag) move(e);
    });
    const stop = () => {
      drag = false;
    };
    svgEl.addEventListener('pointerup', stop);
    svgEl.addEventListener('pointercancel', stop);
    draw();
    return {
      get: () => t,
      set,
      /** Avance (ou recule) les aiguilles jusqu'à target, en animation. */
      async animateTo(target: number, alive: Alive, dur: number | 'auto' = 1400) {
        target = ((target % mod) + mod) % mod;
        let d = target - t;
        if (!o.day) {
          if (d > mod / 2) d -= mod;
          if (d < -mod / 2) d += mod;
        } // 12 h : chemin le plus court
        if (dur === 'auto') dur = Math.min(2600, 500 + Math.abs(d) * 3);
        const t0 = t;
        await tween(alive, dur, (k) => {
          t = t0 + d * k;
          setHands(host, t);
        });
        set(t0 + d);
      },
      svg: svgEl,
    };
  }

  /* ======================= Calendrier ======================= */
  const dateHtml = (d: number): string => (d === 1 ? '1<sup>er</sup>' : String(d));
  const dateSay = (d: number): string => (d === 1 ? 'premier' : String(d));
  /** Grille d'un mois (semaine commençant le dimanche). o: { today, hl, title } */
  function calHtml(y: number, mo: number, o: MesureCalOpts = {}): string {
    const first = new Date(y, mo, 1).getDay(),
      nd = new Date(y, mo + 1, 0).getDate();
    let h = `<table class="me-cal"><caption>${o.title != null ? o.title : cap(MONTHS[mo]) + ' ' + y}</caption><thead><tr>${DAYS_AB.map((d, i) => `<th data-c="${i}">${d}</th>`).join('')}</tr></thead><tbody>`;
    let c = 0;
    h += '<tr>';
    for (let i = 0; i < first; i++, c++) h += `<td class="empty" data-c="${c}"></td>`;
    for (let d = 1; d <= nd; d++, c++) {
      if (c && c % 7 === 0) h += '</tr><tr>';
      const col = c % 7;
      const cls = [col === 0 || col === 6 ? 'we' : '', o.today === d ? 'today' : '', o.hl === d ? 'on' : ''].join(' ').trim();
      h += `<td data-d="${d}" data-c="${col}" class="${cls}">${d}</td>`;
    }
    while (c % 7) {
      h += `<td class="empty" data-c="${c % 7}"></td>`;
      c++;
    }
    return h + '</tr></tbody></table>';
  }
  /** Surligne une colonne (jour de la semaine) et éventuellement une date. */
  function calMark(root: ParentNode, col: number | null, d: number | null): void {
    M.$$('.me-cal .col, .me-cal .on', root).forEach((x) => x.classList.remove('col', 'on'));
    if (col != null)
      M.$$(`.me-cal [data-c="${col}"]`, root).forEach((x) => {
        if (!x.classList.contains('empty')) x.classList.add('col');
      });
    if (d != null) {
      const td = M.$(`.me-cal td[data-d="${d}"]`, root);
      if (td) {
        td.classList.remove('col');
        td.classList.add('on');
      }
    }
  }
  /** Bande de tuiles (jours, mois, saisons). items: [{t, sub?, em?, cls?}] */
  function stripHtml(items: MesureTile[], cols?: number): string {
    return `<div class="me-strip" style="grid-template-columns:repeat(${cols || items.length},minmax(0,1fr))">${items.map((it, i) => `<button class="me-tile ${it.cls || ''}" data-i="${i}">${it.em ? `<span class="me-em">${it.em}</span>` : ''}<span class="me-lbl">${it.t}</span>${it.sub ? `<small>${it.sub}</small>` : ''}</button>`).join('')}</div>`;
  }
  function badge(tile: Element | null | undefined, txt: string): void {
    if (!tile) return;
    let b = M.$('.me-badge', tile);
    if (!b) {
      b = document.createElement('span');
      b.className = 'me-badge';
      tile.appendChild(b);
    }
    b.textContent = txt;
  }

  /* ======================= Unités de longueur (échelle) ======================= */
  /** 1 cm, 1 dm et 1 m dessinés à la même échelle. */
  function scaleSvg() {
    const k = 5.4,
      x = 70;
    let s = `<text x="10" y="30" class="me-t">1 cm</text><rect x="${x}" y="18" width="${k}" height="16" fill="#ef476f"/>`;
    s += `<text x="10" y="70" class="me-t">1 dm</text>`;
    for (let i = 0; i < 10; i++) s += `<rect x="${x + i * k}" y="58" width="${k}" height="16" fill="${i % 2 ? '#ffb3c6' : '#ef476f'}"/>`;
    s += `<text x="${x + 10 * k + 8}" y="71" class="me-t small">= 10 cm</text>`;
    s += `<text x="10" y="110" class="me-t">1 m</text>`;
    for (let i = 0; i < 10; i++)
      s += `<rect x="${x + i * 10 * k}" y="98" width="${10 * k}" height="16" fill="${i % 2 ? '#8fd0e6' : '#118ab2'}" stroke="#fff" stroke-width="1"/>`;
    s += `<text x="${x + 50 * k}" y="134" class="me-t small mid">= 10 dm = 100 cm</text>`;
    return svg(x + 100 * k + 12, 142, s, { max: 640 });
  }
  /** Réglettes de 1 dm faites de 10 cubes de 1 cm. */
  function rodsSvg(n: number, numbered = 0): string {
    const cw = 22,
      ch = 15,
      gap = 10,
      x0 = 10,
      y0 = 24;
    let s = '';
    for (let r = 0; r < n; r++) {
      const x = x0 + r * (cw + gap);
      s += `<g class="me-rod" data-r="${r}">`;
      for (let i = 0; i < 10; i++)
        s += `<rect x="${x}" y="${y0 + i * ch}" width="${cw}" height="${ch}" fill="${i % 2 ? '#3fd3a7' : '#06a77d'}" stroke="#04805f" stroke-width="1"/>`;
      s += '</g>';
      if (r < numbered) s += `<text x="${x + cw / 2}" y="${y0 - 6}" class="me-t mid small">${(r + 1) * 10}</text>`;
    }
    const w = Math.max(120, x0 * 2 + n * (cw + gap));
    return svg(w, y0 + 10 * ch + 26, s + `<text x="${x0}" y="${y0 + 10 * ch + 20}" class="me-t small">1 réglette = 1 dm = 10 cm</text>`, {
      max: Math.max(260, w),
    });
  }

  M.mesure = {
    DAYS,
    DAYS_AB,
    MONTHS,
    SEASONS,
    EVENTS,
    SIGNS,
    COLORS,
    OBJ,
    NU,
    cap,
    svg,
    claim,
    tween,
    wait,
    addSvg,
    status,
    objSvg,
    unitSvg,
    unitRow,
    miniUnit,
    rulerSvg,
    fmt,
    h12,
    hourWords,
    timeWords,
    phrase,
    clockSvg,
    setHands,
    clockWidget,
    svgPoint,
    calHtml,
    calMark,
    dateHtml,
    dateSay,
    stripHtml,
    badge,
    scaleSvg,
    rodsSvg,
  };

  /* =====================================================================
     1. Comparer des longueurs
     ===================================================================== */
  const CU = 30,
    CX = 20,
    ROW = 44;
  interface CmpItem {
    n: string;
    c: string;
    len: number;
    off: number;
  }
  function cmpSvg(items: CmpItem[], kind: MesureObjKind, grid: boolean): string {
    const H = items.length * ROW + 14,
      W = CX + 17 * CU + 80;
    let s = '';
    if (grid) {
      items.forEach((_, i) => {
        for (let k = 0; k < 17; k++)
          s += `<rect x="${CX + k * CU}" y="${i * ROW + 10}" width="${CU}" height="30" fill="${k % 2 ? '#fbfaf6' : '#f1ede2'}" stroke="#e3dccb" stroke-width="1"/>`;
      });
    } else {
      s += `<line x1="${CX}" y1="4" x2="${CX}" y2="${H - 4}" stroke="#06a77d" stroke-width="3" stroke-dasharray="6 5"/>`;
    }
    items.forEach((it, i) => {
      s += `<g class="me-obj" data-i="${i}" transform="translate(${CX + it.off * CU},${i * ROW + 13})">${objSvg(kind, 0, 0, it.len * CU, it.c)}<text x="${it.len * CU + 8}" y="18" class="me-t">${it.n}</text></g>`;
    });
    return svg(W, H, s, { max: W });
  }
  function cmpGen(lvl: number): MesureDraft {
    const kind = M.pick<MesureObjKind>(['crayon', 'ruban']);
    const noun = kind,
      nouns = kind + 's';
    const types =
      lvl === 0 ? ['long', 'short', 'cmp', 'cmp'] : lvl === 1 ? ['long', 'short', 'order', 'order'] : ['long', 'short', 'order', 'cmp'];
    const type = M.pick(types);
    const n = type === 'cmp' ? 2 : lvl === 0 ? 2 : 3;
    const equal = type === 'cmp' && Math.random() < (lvl === 2 ? 0.5 : 0.35);
    const cols = M.shuffle(COLORS).slice(0, n);
    let lens: number[] = [],
      offs: number[] = [];
    for (let g = 0; g < 400; g++) {
      lens = M.shuffle(M.range(3, 13)).slice(0, n);
      if (equal) lens[1] = lens[0];
      if (lvl === 0 && !equal && Math.abs(lens[0] - lens[1]) < 2) continue;
      offs = lens.map(() => 0);
      if (lvl === 2) {
        offs = lens.map(() => M.rnd(0, 5));
        const ends = lens.map((l, i) => l + offs[i]);
        if (Math.max(...ends) > 16) continue;
        if (new Set(ends).size < n) continue;
        const byLen = lens
          .map((_, i) => i)
          .sort((a, b) => lens[a] - lens[b])
          .join();
        const byEnd = ends
          .map((_, i) => i)
          .sort((a, b) => ends[a] - ends[b])
          .join();
        if (type === 'long' && ends.indexOf(Math.max(...ends)) === lens.indexOf(Math.max(...lens))) continue;
        if (type === 'short' && ends.indexOf(Math.min(...ends)) === lens.indexOf(Math.min(...lens))) continue;
        if (type === 'order' && byLen === byEnd) continue;
        if (type === 'cmp' && !equal && ends.indexOf(Math.max(...ends)) === lens.indexOf(Math.max(...lens))) continue;
      }
      break;
    }
    const items: CmpItem[] = cols.map((c, i) => ({ n: c.n, c: c.c, len: lens[i], off: offs[i] }));
    const grid = lvl === 2;
    const sw = (it: CmpItem): string => `<span class="me-sw" style="background:${it.c}"></span>`;
    const warn = grid ? '<div class="me-warn">⚠️ Attention, ils ne commencent pas au même endroit !</div>' : '';
    const sizes = items.map((it) => `${it.n} : ${it.len} carreaux`).join(', ');
    const q: MesureDraft = {
      hint: grid
        ? 'Compte les carreaux de chaque ' + noun + ", du début jusqu'au bout."
        : 'Ils partent tous de la ligne verte. Regarde lequel dépasse le plus.',
    };
    let ansIdx: number[] = [];
    if (type === 'long' || type === 'short') {
      const target = type === 'long' ? Math.max(...lens) : Math.min(...lens);
      const ai = lens.indexOf(target);
      ansIdx = [ai];
      const w = type === 'long' ? 'long' : 'court';
      q.prompt = `${warn}<div>Quel ${noun} est le plus ${w} ?</div>`;
      q.say = (grid ? 'Attention, ils ne commencent pas au même endroit ! ' : '') + `Quel ${noun} est le plus ${w} ?`;
      q.input = 'choice';
      q.answer = items[ai].n;
      q.choices = items.map((it) => ({ label: `<span>${sw(it)}${noun} ${it.n}</span>`, value: it.n }));
      q.explain = grid
        ? `Il ne faut pas regarder seulement où finit le ${noun} : il faut compter du début jusqu'au bout. ${cap(sizes)}. Le ${noun} ${items[ai].n} est le plus ${w}.`
        : `Ils partent tous de la même ligne. Le ${noun} ${items[ai].n} ${type === 'long' ? 'dépasse le plus' : 'dépasse le moins'} : c'est le plus ${w}.`;
    } else if (type === 'order') {
      const asc = Math.random() < 0.6;
      const order = items.map((_, i) => i).sort((a, b) => (asc ? lens[a] - lens[b] : lens[b] - lens[a]));
      ansIdx = order;
      q.prompt = `${warn}<div>Place les ${nouns} du plus ${asc ? 'court' : 'long'} au plus ${asc ? 'long' : 'court'}.</div>`;
      q.say =
        (grid ? 'Attention, ils ne commencent pas au même endroit ! ' : '') +
        `Place les ${nouns} du plus ${asc ? 'court' : 'long'} au plus ${asc ? 'long' : 'court'}.`;
      q.input = 'order';
      q.choices = items.map((it) => ({ label: `<span>${sw(it)}${it.n}</span>`, value: it.n }));
      q.answer = order.map((i) => items[i].n);
      q.explain =
        (grid ? cap(sizes) + '. ' : '') +
        `Du plus ${asc ? 'court' : 'long'} au plus ${asc ? 'long' : 'court'} : ${order.map((i) => items[i].n).join(', ')}.`;
    } else {
      const [a, b] = items;
      q.prompt = `${warn}<div>Compare les deux ${nouns}.</div>`;
      q.say = (grid ? 'Attention, ils ne commencent pas au même endroit ! ' : '') + `Compare les deux ${nouns}.`;
      q.input = 'choice';
      q.cols = 1;
      q.choices = [
        { label: `<span>${sw(a)}Le ${noun} ${a.n} est plus long.</span>`, value: 'a' },
        { label: `<span>${sw(b)}Le ${noun} ${b.n} est plus long.</span>`, value: 'b' },
        { label: 'Ils ont la même longueur.', value: 'eq' },
      ];
      q.answer = a.len === b.len ? 'eq' : a.len > b.len ? 'a' : 'b';
      ansIdx = q.answer === 'eq' ? [0, 1] : [q.answer === 'a' ? 0 : 1];
      q.explain =
        a.len === b.len
          ? grid
            ? `Les deux ${nouns} mesurent ${a.len} carreaux : ils ont la même longueur, même s'ils ne finissent pas au même endroit !`
            : `Les deux bouts arrivent au même endroit : ils ont la même longueur.`
          : grid
            ? cap(sizes) + `. Le ${noun} ${(a.len > b.len ? a : b).n} est plus long.`
            : `Le ${noun} ${(a.len > b.len ? a : b).n} dépasse : il est plus long.`;
    }
    const hintTxt = grid ? 'Compte les carreaux, ou touche 👀 pour aligner.' : 'Les ' + nouns + ' partent tous de la ligne verte.';
    q.viz = (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">${hintTxt}</div>${cmpSvg(items, kind, grid)}<div class="viz-status"></div>`;
    };
    q.showMe = async (el) => {
      const alive = claim(el);
      el.innerHTML = `<div class="viz-hint">${hintTxt}</div>${cmpSvg(items, kind, grid)}<div class="viz-status"></div>`;
      const gs = M.$$('.me-obj', el);
      if (grid) {
        status(el, 'On place tous les débuts sur la même ligne…');
        if (!(await wait(alive, 600))) return;
        const ok = await tween(alive, 1000, (k) =>
          gs.forEach((g, i) => g.setAttribute('transform', `translate(${CX + items[i].off * CU * (1 - k)},${i * ROW + 13})`)),
        );
        if (!ok) return;
      }
      const svgEl = M.$('svg', el);
      if (type === 'order') {
        ansIdx.forEach((i, r) =>
          addSvg(gs[i], `<circle cx="-2" cy="12" r="11" fill="#2b2d42"/><text x="-2" y="17" class="me-mk">${r + 1}</text>`),
        );
        status(el, `Ordre : ${ansIdx.map((i) => items[i].n).join(' → ')}`);
      } else {
        ansIdx.forEach((i) => gs[i].classList.add('me-hl'));
        const ex = CX + items[ansIdx[0]].len * CU;
        if (svgEl)
          addSvg(
            svgEl,
            `<line x1="${ex}" y1="4" x2="${ex}" y2="${items.length * ROW + 10}" stroke="#f78c40" stroke-width="3" stroke-dasharray="5 4"/>`,
          );
        status(
          el,
          type === 'cmp' && q.answer === 'eq'
            ? 'Même longueur !'
            : `Le ${noun} ${items[ansIdx[0]].n} est le plus ${type === 'short' ? 'court' : 'long'} !`,
        );
      }
    };
    return q;
  }
  M.registerSkill({
    id: 'comparer-longueurs',
    domain: D,
    title: 'Comparer des longueurs',
    icon: '📐',
    starter: true,
    desc: 'Plus long, plus court, même longueur : compare et place en ordre.',
    pda: 'Mesure — Longueurs A.1 : comparer des longueurs',
    learn: 'mesurer',
    gen: ({ lvl }) => done(cmpGen(lvl)),
  });

  /* =====================================================================
     2. Mesurer avec des unités non conventionnelles
     ===================================================================== */
  const NX = 70;
  interface NcRow {
    label?: string;
    unit: MesureUnitKind;
    count: number;
    gap?: number;
    start?: number;
    numbers?: boolean;
    after?: string;
  }
  function ncSvg(kind: MesureObjKind, color: string, L: number, rows: NcRow[], extraH = 0): string {
    const H = 50 + rows.length * 48 + extraH,
      W = NX + 560;
    let s = `<line x1="${NX}" y1="4" x2="${NX}" y2="${H - 4}" stroke="#c7c2b4" stroke-width="2" stroke-dasharray="5 5"/>`;
    s += `<line x1="${NX + L}" y1="4" x2="${NX + L}" y2="${H - 4}" stroke="#c7c2b4" stroke-width="2" stroke-dasharray="5 5"/>`;
    s += `<g>${objSvg(kind, NX, 10, L, color)}</g>`;
    rows.forEach((r, i) => {
      const y = 52 + i * 48;
      if (r.label) s += `<text x="${NX - 8}" y="${y + 21}" class="me-t" text-anchor="end">${r.label}</text>`;
      s += `<g class="me-row" data-r="${i}">${unitRow(r.unit, NX + (r.start || 0), y, r.count, r.gap || 0, r.numbers)}</g>`;
      if (r.after)
        s += `<text x="${NX + (r.start || 0) + r.count * (NU[r.unit].w + (r.gap || 0)) + 10}" y="${y + 21}" class="me-t">${r.after}</text>`;
    });
    return svg(W, H, s, { max: W });
  }
  function ncGen(lvl: number): MesureDraft {
    const kind = M.pick<MesureObjKind>(['crayon', 'ruban', 'baton', 'paille']);
    const o = OBJ[kind],
      color = M.pick(COLORS).c;
    const types =
      lvl === 0 ? ['count'] : lvl === 1 ? ['count', 'place', 'place', 'who', 'who'] : ['predict', 'why', 'most', 'who', 'place'];
    const type = M.pick(types);
    const q: MesureDraft = {};
    if (type === 'count' || type === 'place') {
      const uk = M.pick<MesureUnitKind>(['cube', 'trombone', 'gomme']),
        u = NU[uk];
      const max = Math.floor(540 / u.w);
      const n = M.rnd(lvl === 0 ? 3 : 4, Math.min(max, lvl === 0 ? 8 : 12));
      const L = n * u.w;
      q.prompt = `Combien de ${u.pl} mesure ${o.the} ?`;
      q.input = 'number';
      q.answer = n;
      q.unit = u.pl;
      q.hint =
        type === 'place'
          ? `Touche « Place ${u.fem ? 'une' : 'un'} ${u.sing} » jusqu'au bout ${kind === 'paille' ? 'de la paille' : 'du ' + (kind === 'baton' ? 'bâton' : kind)}, puis compte.`
          : `Compte les ${u.pl} un par un, en les touchant du doigt.`;
      q.explain = `Les ${u.pl} sont ${u.fem ? 'placées' : 'placés'} bout à bout, sans espace, du début jusqu'à la fin : ${o.the} mesure ${n} ${M.plural(n, u.sing, u.pl)}.`;
      const full = (num: boolean): string => ncSvg(kind, color, L, [{ unit: uk, count: n, numbers: num }]);
      if (type === 'count') {
        q.viz = (el) => {
          claim(el);
          el.innerHTML = `<div class="viz-hint">Les ${u.pl} sont ${u.fem ? 'placées' : 'placés'} bout à bout.</div>${full(false)}<div class="viz-status"></div>`;
        };
      } else {
        q.viz = (el) => {
          claim(el);
          let c = 0;
          const draw = () => {
            el.innerHTML = `<div class="viz-hint">Place les ${u.pl} bout à bout, sans espace.</div>${ncSvg(kind, color, L, [{ unit: uk, count: c }])}
              <div class="row"><button class="btn primary me-add">➕ Place ${u.fem ? 'une' : 'un'} ${u.sing}</button></div><div class="viz-status"></div>`;
            const b = M.$<HTMLButtonElement>('.me-add', el)!;
            if (c >= n) {
              b.disabled = true;
              status(el, 'Tu es au bout ! Compte tes ' + u.pl + '.');
            }
            b.onclick = () => {
              if (c < n) {
                c++;
                M.sfx.pop();
                draw();
              }
            };
          };
          draw();
        };
      }
      q.showMe = async (el) => {
        const alive = claim(el);
        el.innerHTML = `<div class="viz-hint">On place les ${u.pl} bout à bout et on compte.</div>${ncSvg(kind, color, L, [{ unit: uk, count: 0 }])}<div class="viz-status"></div>`;
        const row = M.$('.me-row', el);
        for (let i = 0; i < n; i++) {
          if (!(await wait(alive, 380)) || !row) return;
          addSvg(
            row,
            unitSvg(uk, NX + i * u.w, 52 + (30 - u.h) / 2, i) +
              `<text x="${NX + i * u.w + u.w / 2}" y="48" class="me-t mid small">${i + 1}</text>`,
          );
          M.sfx.pop();
          status(el, `${i + 1}…`);
        }
        status(el, `${cap(o.the)} mesure <b>${n} ${M.plural(n, u.sing, u.pl)}</b>.`);
      };
      return q;
    }
    if (type === 'who') {
      const uk = M.pick<MesureUnitKind>(['cube', 'trombone', 'gomme']),
        u = NU[uk];
      const n = M.rnd(4, Math.floor(450 / u.w)),
        L = n * u.w;
      const [good, bad] = M.shuffle(
        M.pick([
          ['Léa', 'Théo'],
          ['Zoé', 'Félix'],
          ['Maya', 'Noah'],
          ['Rose', 'William'],
        ]),
      );
      const err = M.pick(['gap', 'start', 'overlap']);
      const rows: NcRow[] = [];
      const goodRow: NcRow = { label: good, unit: uk, count: n };
      let badRow: NcRow;
      if (err === 'gap') {
        const g = 14;
        badRow = { label: bad, unit: uk, gap: g, count: Math.floor((L + g) / (u.w + g)) };
      } else if (err === 'start') badRow = { label: bad, unit: uk, start: Math.round(u.w * 0.6), count: n };
      else {
        const g = -Math.round(u.w * 0.3);
        badRow = { label: bad, unit: uk, gap: g, count: Math.floor((L + g) / (u.w + g)) };
      }
      const goodFirst = Math.random() < 0.5;
      rows.push(goodFirst ? goodRow : badRow, goodFirst ? badRow : goodRow);
      const whys: Record<string, string> = {
        gap: `${bad} a laissé des espaces entre les ${u.pl}.`,
        start: `${bad} n'a pas commencé au début ${kind === 'paille' ? 'de la paille' : 'du ' + (kind === 'baton' ? 'bâton' : kind)}.`,
        overlap: `Les ${u.pl} de ${bad} sont ${u.fem ? 'placées les unes sur les autres' : 'placés les uns sur les autres'}.`,
      };
      const why = whys[err];
      q.prompt = `<b>${goodFirst ? good : bad}</b> et <b>${goodFirst ? bad : good}</b> mesurent ${o.the} avec des ${u.pl}. Qui a bien mesuré ?`;
      q.input = 'choice';
      q.choices = rows.map((r) => ({ label: String(r.label), value: String(r.label) }));
      q.answer = good;
      q.hint = 'Pour bien mesurer : on commence au début, et les unités se touchent, sans espace et sans se chevaucher.';
      q.explain = `${why} ${good} a bien mesuré : ses ${u.pl} commencent au début et sont bout à bout, sans espace.`;
      const draw = (el: HTMLElement): void => {
        el.innerHTML = `<div class="viz-hint">Regarde bien chaque rangée.</div>${ncSvg(kind, color, L, rows)}<div class="viz-status"></div>`;
      };
      q.viz = (el) => {
        claim(el);
        draw(el);
      };
      q.showMe = (el) => {
        claim(el);
        draw(el);
        const gs = M.$$('.me-row', el),
          bi = goodFirst ? 1 : 0;
        if (gs[1 - bi]) gs[1 - bi].classList.add('me-hl');
        status(el, `✅ ${good} — ❌ ${why}`);
      };
      return q;
    }
    // Niveau 2 : unités différentes → nombres différents
    const L = M.pick([180, 360]);
    if (type === 'most') {
      const ks = M.shuffle<MesureUnitKind>(['cube', 'trombone', 'gomme', 'carte']).slice(0, 3);
      const most = Math.random() < 0.6;
      const sorted = ks.slice().sort((a, b) => NU[a].w - NU[b].w);
      const ans = most ? sorted[0] : sorted[2];
      q.prompt = `On veut mesurer ${o.the} avec des ${NU[ks[0]].pl}, des ${NU[ks[1]].pl} ou des ${NU[ks[2]].pl}. Avec quelle unité trouve-t-on le <b>plus ${most ? 'grand' : 'petit'} nombre</b> ?`;
      q.input = 'choice';
      q.choices = ks.map((k) => ({ label: `${miniUnit(k)}<span>${NU[k].pl}</span>`, value: k }));
      q.answer = ans;
      q.hint = most ? "Plus l'unité est petite, plus il en faut !" : "Plus l'unité est longue, moins il en faut !";
      q.explain = `${cap(ks.map((k) => `${L / NU[k].w} ${NU[k].pl}`).join(', '))}. Plus l'unité est ${most ? 'petite' : 'longue'}, ${most ? 'plus' : 'moins'} il en faut : avec les ${NU[ans].pl}, on trouve le plus ${most ? 'grand' : 'petit'} nombre.`;
      q.viz = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Une unité de chaque sorte :</div>${ncSvg(
          kind,
          color,
          L,
          ks.map((k) => ({ label: '', unit: k, count: 1, after: '1 ' + NU[k].sing })),
        )}<div class="viz-status"></div>`;
      };
      q.showMe = async (el) => {
        const alive = claim(el);
        el.innerHTML = `<div class="viz-hint">On mesure avec chaque unité.</div>${ncSvg(
          kind,
          color,
          L,
          ks.map((k) => ({ unit: k, count: L / NU[k].w, after: `${L / NU[k].w} ${NU[k].pl}` })),
        )}<div class="viz-status"></div>`;
        if (!(await wait(alive, 300))) return;
        const r = M.$(`.me-row[data-r="${ks.indexOf(ans)}"]`, el);
        if (r) r.classList.add('me-hl');
        status(el, `Avec les ${NU[ans].pl} : ${L / NU[ans].w}, le plus ${most ? 'grand' : 'petit'} nombre.`);
      };
      return q;
    }
    const pair = M.shuffle<MesureUnitKind>(['cube', 'trombone', 'gomme', 'carte']).slice(0, 2);
    const [ak, bk] = pair,
      a = NU[ak],
      b = NU[bk];
    const na = L / a.w,
      nb = L / b.w;
    if (type === 'predict') {
      const bSmaller = b.w < a.w;
      q.prompt = `Léa mesure ${o.the} avec des ${a.pl} : elle trouve <b>${na} ${a.pl}</b>. Théo mesure ${o.same} avec des ${b.pl}. Les ${b.pl} sont plus ${bSmaller ? smallAdj(b) : longAdj(b)} que les ${a.pl}. Théo va trouver…`;
      q.input = 'choice';
      q.cols = 1;
      q.choices = [
        { label: `plus que ${na} ${b.pl}`, value: 'plus' },
        { label: `moins que ${na} ${b.pl}`, value: 'moins' },
        { label: `${na} ${b.pl} aussi`, value: 'pareil' },
      ];
      q.answer = bSmaller ? 'plus' : 'moins';
      q.hint = "Si l'unité est plus petite, il en faut plus. Si elle est plus longue, il en faut moins.";
      q.explain = `Théo trouve ${nb} ${b.pl}. ${bSmaller ? `Les ${b.pl} sont plus ${smallAdj(b)} : il en faut plus` : `Les ${b.pl} sont plus ${longAdj(b)} : il en faut moins`}. ${cap(o.the)} n'a pas changé : seule l'unité a changé !`;
      const rowsStart: NcRow[] = [
        { label: 'Léa', unit: ak, count: na },
        { label: 'Théo', unit: bk, count: 1, after: '…?' },
      ];
      q.viz = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Léa a fini. Théo commence avec ${b.fem ? 'une' : 'un'} ${b.sing}.</div>${ncSvg(kind, color, L, rowsStart)}<div class="viz-status"></div>`;
      };
      q.showMe = async (el) => {
        const alive = claim(el);
        el.innerHTML = `<div class="viz-hint">Théo continue…</div>${ncSvg(kind, color, L, [
          { label: 'Léa', unit: ak, count: na, after: String(na) },
          { label: 'Théo', unit: bk, count: 0 },
        ])}<div class="viz-status"></div>`;
        const row = M.$('.me-row[data-r="1"]', el);
        for (let i = 0; i < nb; i++) {
          if (!(await wait(alive, 300)) || !row) return;
          addSvg(row, unitSvg(bk, NX + i * b.w, 100 + (30 - b.h) / 2, i));
          M.sfx.pop();
          status(el, `Théo : ${i + 1}`);
        }
        status(el, `Théo trouve <b>${nb} ${b.pl}</b> : c'est ${bSmaller ? 'plus' : 'moins'} que ${na} !`);
      };
      return q;
    }
    // why
    const big = a.w > b.w ? a : b,
      small = a.w > b.w ? b : a;
    q.prompt = `Léa trouve <b>${na} ${a.pl}</b> et Théo trouve <b>${nb} ${b.pl}</b> pour ${o.same}. Pourquoi les nombres sont-ils différents ?`;
    q.input = 'choice';
    q.cols = 1;
    q.choices = M.shuffle([
      { label: `Les ${big.pl} sont plus ${longAdj(big)} que les ${small.pl}.`, value: 'ok' },
      { label: `Les ${small.pl} sont plus ${longAdj(small)} que les ${big.pl}.`, value: 'inv' },
      { label: `${cap(o.the)} a changé de longueur.`, value: 'chg' },
    ]);
    q.answer = 'ok';
    q.hint = 'Compare une unité de Léa et une unité de Théo. Laquelle est la plus longue ?';
    q.explain = `${cap(o.the)} a toujours la même longueur. Mais les ${big.pl} sont plus ${longAdj(big)} : il en faut moins. Pour comparer des mesures, il faut utiliser <b>la même unité</b> !`;
    const both = () =>
      ncSvg(kind, color, L, [
        { label: 'Léa', unit: ak, count: na, after: String(na) },
        { label: 'Théo', unit: bk, count: nb, after: String(nb) },
      ]);
    q.viz = (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Même ${kind === 'paille' ? 'paille' : kind === 'baton' ? 'bâton' : kind}, deux unités.</div>${both()}<div class="viz-status"></div>`;
    };
    q.showMe = (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Compare une unité de chaque rangée.</div>${both()}<div class="viz-status"></div>`;
      const r = M.$(`.me-row[data-r="${big === a ? 0 : 1}"]`, el);
      if (r) r.classList.add('me-hl');
      status(el, `1 ${big.sing} est plus ${big.fem ? 'longue' : 'long'} que 1 ${small.sing}.`);
    };
    return q;
  }
  M.registerSkill({
    id: 'mesurer-non-conv',
    domain: D,
    title: 'Mesurer avec des trombones',
    icon: '📎',
    desc: 'Mesure avec des trombones, des cubes ou des gommes placés bout à bout.',
    pda: "Mesure — Longueurs A.3 : mesurer à l'aide d'unités non conventionnelles",
    learn: 'mesurer',
    gen: ({ lvl }) => done(ncGen(lvl)),
  });

  /* =====================================================================
     3. Mesurer en centimètres avec une règle
     ===================================================================== */
  const RX = 26,
    PX = 40,
    RN = 15,
    RY = 66;
  function rcmSvg(kind: MesureObjKind, color: string, s0: number, L: number, guides: boolean): string {
    const W = RX * 2 + RN * PX,
      H = RY + 64;
    let s = '';
    s += rulerSvg(RX, RY, RN, PX);
    s += `<g class="me-marks"></g>`;
    if (guides)
      [s0, s0 + L].forEach((v) => {
        s += `<line x1="${RX + v * PX}" y1="22" x2="${RX + v * PX}" y2="${RY}" stroke="#f78c40" stroke-width="2.5" stroke-dasharray="5 4"/>`;
      });
    s += objSvg(kind, RX + s0 * PX, RY - 36, L * PX, color, 26);
    for (let i = 0; i < RN; i++) s += `<rect class="me-hit" data-c="${i}" x="${RX + i * PX}" y="${RY - 40}" width="${PX}" height="100"/>`;
    return svg(W, H, s, { max: W });
  }
  function rcmMark(el: HTMLElement, set: Set<number>): void {
    const g = M.$('.me-marks', el);
    if (!g) return;
    const cs = [...set].sort((a, b) => a - b);
    g.innerHTML = cs
      .map(
        (c, k) =>
          `<rect x="${RX + c * PX + 2}" y="${RY + 1}" width="${PX - 4}" height="20" rx="4" fill="#06a77d" opacity=".85"/><text x="${RX + c * PX + PX / 2}" y="${RY + 16}" class="me-mk">${k + 1}</text>`,
      )
      .join('');
  }
  function rcmGen(lvl: number): MesureDraft {
    const kind = M.pick<MesureObjKind>(['crayon', 'ruban', 'paille']),
      o = OBJ[kind],
      color = M.pick(COLORS).c;
    let s0 = 0,
      L: number;
    if (lvl === 0) L = M.rnd(2, 10);
    else if (lvl === 1) L = M.rnd(4, 15);
    else {
      s0 = M.rnd(1, 6);
      L = M.rnd(2, RN - s0);
    }
    const guides = s0 > 0;
    const q: MesureDraft = {
      prompt: s0
        ? `<div class="me-warn">⚠️ ${cap(o.the)} ne commence pas à 0 !</div><div>Combien de centimètres mesure-t-${o.pr} ?</div>`
        : `Combien de centimètres mesure ${o.the} ?`,
      say: s0
        ? `Attention, ${o.the} ne commence pas à zéro ! Combien de centimètres mesure-t-${o.pr} ?`
        : `Combien de centimètres mesure ${o.the} ?`,
      input: 'number',
      answer: L,
      unit: 'cm',
      hint: s0
        ? "Compte les centimètres (les espaces entre les traits), du début jusqu'au bout. Touche les cases de la règle pour les compter."
        : `${cap(o.the)} commence à 0. Lis le nombre sous l'autre bout.`,
      explain: s0
        ? `${cap(o.the)} va de ${s0} à ${s0 + L}. On compte les centimètres entre les deux : ${s0 + L} − ${s0} = ${L} cm.`
        : `${cap(o.the)} part de 0 et finit à ${L} : ${o.pr} mesure ${L} cm.`,
    };
    const hintTxt = 'Touche les centimètres de la règle pour les compter.';
    q.viz = (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">${hintTxt}</div>${rcmSvg(kind, color, s0, L, guides)}<div class="viz-status"></div>`;
      const set = new Set<number>();
      const svgEl = M.$('svg', el);
      if (svgEl)
        svgEl.onclick = (e) => {
          const r = M.closest<SVGElement>(e, '.me-hit');
          if (!r) return;
          const c = Number(r.dataset.c);
          if (set.has(c)) set.delete(c);
          else set.add(c);
          M.sfx.tap();
          rcmMark(el, set);
          status(el, set.size ? `Tu as compté ${set.size} ${M.plural(set.size, 'centimètre')}.` : '');
        };
    };
    q.showMe = async (el) => {
      const alive = claim(el);
      el.innerHTML = `<div class="viz-hint">On compte les centimètres sous ${o.the}.</div>${rcmSvg(kind, color, s0, L, true)}<div class="viz-status"></div>`;
      const set = new Set<number>();
      for (let i = 0; i < L; i++) {
        if (!(await wait(alive, 350))) return;
        set.add(s0 + i);
        rcmMark(el, set);
        M.sfx.pop();
        status(el, `${i + 1} cm`);
      }
      status(el, s0 ? `De ${s0} à ${s0 + L} : <b>${L} cm</b>` : `${cap(o.the)} mesure <b>${L} cm</b>.`);
    };
    return q;
  }
  M.registerSkill({
    id: 'mesurer-cm',
    domain: D,
    title: 'Mesurer avec une règle',
    icon: '📏',
    desc: 'Lis la règle pour trouver la longueur en centimètres.',
    pda: 'Mesure — Longueurs A.4a : mesurer en centimètres avec une règle',
    learn: 'mesurer',
    gen: ({ lvl }) => done(rcmGen(lvl)),
  });

  /* =====================================================================
     4. Les unités de longueur : cm, dm, m
     ===================================================================== */
  const SMALL: [string, string][] = [
    ['un crayon', '✏️'],
    ['une gomme à effacer', '🩷'],
    ['un trombone', '📎'],
    ['ton doigt', '☝️'],
    ['une cuillère', '🥄'],
    ['une banane', '🍌'],
    ['une clé', '🔑'],
    ['une fourchette', '🍴'],
  ];
  const BIG: [string, string][] = [
    ["la hauteur d'une porte", '🚪'],
    ['un autobus scolaire', '🚌'],
    ["la cour d'école", '🏫'],
    ['une piscine', '🏊'],
    ['une patinoire', '⛸️'],
    ["le corridor de l'école", '🚸'],
    ['un grand arbre', '🌳'],
    ['une baleine', '🐋'],
  ];
  /** [phrase, emoji, bonne réponse, distracteur, distracteur, niveau minimal] */
  const EST: [string, string, string, string, string, number][] = [
    ["La porte de ta chambre est haute d'environ…", '🚪', '2 m', '2 cm', '20 m', 0],
    ['Un crayon neuf mesure environ…', '✏️', '15 cm', '15 m', '150 m', 0],
    ['Ton lit mesure environ…', '🛏️', '2 m', '2 cm', '20 m', 0],
    ['Un trombone mesure environ…', '📎', '3 cm', '3 m', '30 m', 0],
    ['Un autobus scolaire mesure environ…', '🚌', '12 m', '12 cm', '2 cm', 0],
    ['Toi, tu mesures environ…', '🧒', '1 m', '1 cm', '10 m', 0],
    ['Un ver de terre mesure environ…', '🪱', '10 cm', '10 m', '100 m', 1],
    ["Une règle d'école mesure…", '📏', '30 cm', '30 m', '3 m', 1],
    ['Une patinoire de hockey mesure environ…', '🏒', '60 m', '60 cm', '6 cm', 1],
    ["Ta main est large d'environ…", '✋', '1 dm', '1 m', '10 m', 2],
    ['Une fourchette mesure environ…', '🍴', '2 dm', '2 m', '20 m', 2],
  ];
  const UNIT_LBL: Record<string, [string, string]> = { cm: ['cm', 'centimètre'], dm: ['dm', 'décimètre'], m: ['m', 'mètre'] };
  function ulGen(lvl: number): MesureDraft {
    const types = lvl === 0 ? ['unit', 'unit', 'rel', 'est'] : lvl === 1 ? ['unit', 'rel', 'rel', 'est'] : ['rel', 'cmp', 'cmp', 'est'];
    const type = M.pick(types);
    const q: MesureDraft = {};
    const scaleViz = (el: HTMLElement): void => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Les unités, à la même échelle :</div>${scaleSvg()}<div class="viz-status"></div>`;
    };
    if (type === 'unit') {
      const small = Math.random() < 0.5;
      const [item, em] = M.pick(small ? SMALL : BIG);
      const us = lvl === 0 ? ['cm', 'm'] : ['cm', 'dm', 'm'];
      q.prompt = `Pour mesurer <b>${item}</b> ${em}, quelle unité est la meilleure ?`;
      q.say = `Pour mesurer ${item}, quelle unité est la meilleure ?`;
      q.input = 'choice';
      q.choices = us.map((u) => ({ label: `<b>${UNIT_LBL[u][0]}</b><span class="me-small">${UNIT_LBL[u][1]}</span>`, value: u }));
      q.answer = small ? 'cm' : 'm';
      q.hint = 'Est-ce petit (on mesure en centimètres) ou très grand (on mesure en mètres) ?';
      q.explain = small
        ? "C'est un petit objet : on choisit le <b>centimètre (cm)</b>."
        : "C'est très grand : on choisit le <b>mètre (m)</b>. En centimètres, le nombre serait énorme !";
      q.viz = scaleViz;
      return q;
    }
    if (type === 'est') {
      const pool = EST.filter((e) => e[5] <= lvl);
      const [t, em, ok, d1, d2] = M.pick(pool);
      q.prompt = `${em} ${t}`;
      q.say = t.replace('…', '');
      q.input = 'choice';
      q.choices = M.shuffle([ok, d1, d2]).map((v) => ({ label: v, value: v }));
      q.answer = ok;
      q.hint = "Imagine la longueur : 1 cm, c'est la largeur de ton petit doigt. 1 m, c'est un grand pas d'adulte.";
      q.explain = `La bonne estimation est <b>${ok}</b>. Les autres réponses sont beaucoup trop petites ou beaucoup trop grandes.`;
      q.viz = scaleViz;
      return q;
    }
    if (type === 'rel') {
      let pr: string,
        ans: number,
        rods = 0,
        meters = 0,
        ex: string;
      const lv =
        lvl === 0 ? M.pick(['dmcm', 'mcm']) : lvl === 1 ? M.pick(['ndm', 'ndm', 'mdm', 'cmdm1']) : M.pick(['cmdm', 'cmdm', 'mcmn', 'cmm']);
      const n = M.rnd(2, 9);
      if (lv === 'dmcm') {
        pr = '1 dm = {?} cm';
        ans = 10;
        rods = 1;
        ex = "1 décimètre, c'est 10 centimètres : une réglette de 10 petits cubes.";
      } else if (lv === 'mcm') {
        pr = '1 m = {?} cm';
        ans = 100;
        rods = 10;
        ex = "1 mètre, c'est 10 réglettes de 10 cm : 10, 20, 30… 100 cm.";
      } else if (lv === 'ndm') {
        pr = `${n} dm = {?} cm`;
        ans = n * 10;
        rods = n;
        ex = `Chaque décimètre vaut 10 cm. ${n} dm, c'est ${n} dizaines de centimètres : ${n * 10} cm.`;
      } else if (lv === 'mdm') {
        pr = '1 m = {?} dm';
        ans = 10;
        rods = 10;
        ex = "1 mètre, c'est 10 décimètres (10 réglettes).";
      } else if (lv === 'cmdm1') {
        pr = '{?} cm = 1 dm';
        ans = 10;
        rods = 1;
        ex = '10 centimètres font 1 décimètre.';
      } else if (lv === 'cmdm') {
        pr = `${n * 10} cm = {?} dm`;
        ans = n;
        rods = n;
        ex = `Chaque groupe de 10 cm fait 1 dm. Dans ${n * 10} cm, il y a ${n} groupes de 10 : ${n} dm.`;
      } else if (lv === 'mcmn') {
        const k = M.rnd(2, 5);
        pr = `${k} m = {?} cm`;
        ans = k * 100;
        meters = k;
        ex = `1 m = 100 cm. Donc ${k} m = ${M.range(1, k)
          .map(() => '100')
          .join(' + ')} = ${k * 100} cm.`;
      } else {
        pr = '100 cm = {?} m';
        ans = 1;
        rods = 10;
        ex = '100 centimètres font 1 mètre.';
      }
      q.prompt = `<div class="eq">${pr}</div>`;
      q.say = pr
        .replace('{?}', 'combien')
        .replace(/\bdm\b/g, 'décimètres')
        .replace(/\bcm\b/g, 'centimètres')
        .replace(/\bm\b/g, 'mètres');
      q.input = 'number';
      q.answer = ans;
      q.hint = '1 dm = 10 cm et 1 m = 100 cm. Regarde les réglettes : chacune mesure 10 cm.';
      q.explain = ex;
      if (meters) {
        const barSvg = (shown: number): string => {
          let s = '';
          for (let i = 0; i < meters; i++) {
            const y = 10 + i * 34;
            for (let j = 0; j < 10; j++)
              s += `<rect x="${20 + j * 50}" y="${y}" width="50" height="22" fill="${j % 2 ? '#8fd0e6' : '#118ab2'}" stroke="#fff"/>`;
            s += `<text x="530" y="${y + 17}" class="me-t">${i < shown ? (i + 1) * 100 + ' cm' : '1 m'}</text>`;
          }
          return svg(620, meters * 34 + 14, s, { max: 620 });
        };
        q.viz = (el) => {
          claim(el);
          el.innerHTML = `<div class="viz-hint">Chaque barre mesure 1 m = 100 cm.</div>${barSvg(0)}<div class="viz-status"></div>`;
        };
        q.showMe = async (el) => {
          const alive = claim(el);
          for (let i = 1; i <= meters; i++) {
            el.innerHTML = `<div class="viz-hint">On compte par 100.</div>${barSvg(i)}<div class="viz-status">${i * 100} cm</div>`;
            M.sfx.pop();
            if (!(await wait(alive, 600))) return;
          }
        };
      } else {
        const lbl = rods === 10 && /m/.test(pr.replace(/cm|dm/g, '')) ? '10 réglettes = 1 m' : '';
        q.viz = (el) => {
          claim(el);
          el.innerHTML = `<div class="viz-hint">Touche les réglettes pour compter par 10.${lbl ? ' ' + lbl + '.' : ''}</div>${rodsSvg(rods)}<div class="viz-status"></div>`;
          wireRods(el);
        };
        q.showMe = async (el) => {
          const alive = claim(el);
          for (let i = 1; i <= rods; i++) {
            el.innerHTML = `<div class="viz-hint">On compte par 10.</div>${rodsSvg(rods, i)}<div class="viz-status">${i} dm = ${i * 10} cm</div>`;
            M.sfx.pop();
            if (!(await wait(alive, 450))) return;
          }
        };
      }
      return q;
    }
    // cmp : le plus long / le plus court entre 3 longueurs écrites dans des unités différentes
    let opts: { t: string; v: number }[] = [];
    for (let g = 0; g < 100; g++) {
      const mN = M.rnd(1, 2),
        dN = M.rnd(3, 9),
        cN = M.pick([40, 50, 60, 70, 80, 90, 95]);
      opts = [
        { t: `${mN} m`, v: mN * 100 },
        { t: `${dN} dm`, v: dN * 10 },
        { t: `${cN} cm`, v: cN },
      ];
      if (new Set(opts.map((o) => o.v)).size === 3) break;
    }
    const longest = Math.random() < 0.65;
    const best = opts.slice().sort((a, b) => (longest ? b.v - a.v : a.v - b.v))[0];
    q.prompt = `Qu'est-ce qui est le <b>plus ${longest ? 'long' : 'court'}</b> ?`;
    q.input = 'choice';
    q.choices = M.shuffle(opts).map((o) => ({ label: o.t, value: o.t }));
    q.answer = best.t;
    q.hint = 'Mets tout en centimètres : 1 dm = 10 cm et 1 m = 100 cm.';
    q.explain = `En centimètres : ${opts.map((o) => `${o.t} = ${o.v} cm`).join(' ; ')}. Le plus ${longest ? 'long' : 'court'} : <b>${best.t}</b>.`;
    q.viz = scaleViz;
    q.showMe = (el) => {
      claim(el);
      const k = 2.6;
      let s = '';
      opts.forEach((o, i) => {
        const y = 10 + i * 40;
        s += `<text x="10" y="${y + 18}" class="me-t">${o.t}</text><rect x="90" y="${y}" width="${o.v * k}" height="24" rx="4" fill="${o === best ? '#06a77d' : '#8fd0e6'}"${o === best ? ' class="me-hl"' : ''}/><text x="${96 + o.v * k}" y="${y + 18}" class="me-t small">${o.v} cm</text>`;
      });
      el.innerHTML = `<div class="viz-hint">Les trois longueurs, à la même échelle :</div>${svg(90 + 200 * k + 70, 130, s, { max: 700 })}<div class="viz-status">Le plus ${longest ? 'long' : 'court'} : ${best.t}</div>`;
    };
    return q;
  }
  function wireRods(el: HTMLElement): void {
    const svgEl = M.$('svg', el);
    if (!svgEl) return;
    let c = 0;
    svgEl.onclick = (e) => {
      const r = M.closest<SVGGElement>(e, '.me-rod');
      if (!r || r.dataset.done) return;
      r.dataset.done = '1';
      c++;
      M.sfx.pop();
      const rect = r.querySelector('rect');
      const x = rect ? Number(rect.getAttribute('x')) + 11 : 0;
      addSvg(svgEl, `<text x="${x}" y="18" class="me-t mid small">${c * 10}</text>`);
      M.$$('rect', r).forEach((x2) => x2.setAttribute('opacity', '.6'));
      status(el, `${c} dm = ${c * 10} cm`);
    };
  }
  M.registerSkill({
    id: 'unites-longueur',
    domain: D,
    title: 'Les unités : cm, dm et m',
    icon: '📐',
    desc: 'Choisis la bonne unité, estime et trouve les liens entre cm, dm et m.',
    pda: 'Mesure — Longueurs A.4a et A.5 : unités conventionnelles (m, dm, cm), relations et estimation',
    learn: 'mesurer',
    gen: ({ lvl }) => done(ulGen(lvl)),
  });

  /* =====================================================================
     5. Lire l'heure
     ===================================================================== */
  type HM = [number, number];
  const key = (h: number, m: number): string => `${h}:${m}`;
  function timeDistractors(h: number, m: number, lvl: number): HM[] {
    const c: HM[] = [];
    const nx = h12(h + 1),
      pv = h12(h - 1);
    if (m >= 30) c.push([nx, m]);
    else c.push([pv, m]);
    c.push([m === 0 ? 12 : m / 5, (h % 12) * 5]); // aiguilles inversées
    c.push([h, (m + 30) % 60]);
    c.push(m >= 30 ? [pv, m] : [nx, m]);
    if (m && lvl > 0 && m / 5 !== m) c.push([h, m / 5]); // « 3 h 06 » : on lit le chiffre pointé
    if (m === 15 || m === 45) c.push([h, 60 - m]);
    const seen = new Set([key(h, m)]),
      out: HM[] = [];
    c.forEach(([a, b]) => {
      const k = key(a, b);
      if (!seen.has(k)) {
        seen.add(k);
        out.push([a, b]);
      }
    });
    let g = 0;
    while (out.length < 3 && g++ < 50) {
      const a = M.rnd(1, 12),
        b = m;
      const k = key(a, b);
      if (!seen.has(k)) {
        seen.add(k);
        out.push([a, b]);
      }
    }
    return [out[0], ...M.shuffle(out.slice(1))].slice(0, 3);
  }
  function pickTime(lvl: number): HM {
    const h = M.rnd(1, 12);
    if (lvl === 0) return [h, 0];
    if (lvl === 1) return [h, Math.random() < 0.7 ? 30 : 0];
    const r = Math.random();
    return [h, r < 0.3 ? 15 : r < 0.6 ? 45 : r < 0.7 ? 30 : M.pick([5, 10, 20, 25, 35, 40, 50, 55])];
  }
  function readExplain(h: number, m: number): string {
    const hand =
      m === 0 ? `La petite aiguille est sur le ${h}` : `La petite aiguille a dépassé le ${h} (elle est entre le ${h} et le ${h12(h + 1)})`;
    const mm = m === 0 ? "la grande aiguille est sur le 12 : c'est l'heure juste" : `la grande aiguille est sur le ${m / 5} : ${m} minutes`;
    return `${hand} et ${mm}. Il est <b>${fmt(h, m)}</b>. ${phrase(h, m)} !`;
  }
  function clockReadViz(h: number, m: number): (el: HTMLElement) => void {
    return (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Petite aiguille 🔴 = les heures. Grande aiguille 🔵 = les minutes.</div>${clockSvg(h, m, { ring: true, size: 300 })}<div class="row" style="justify-content:center"><button class="btn me-tog">🔢 Les minutes autour</button></div><div class="viz-status"></div>`;
      const b = M.$('.me-tog', el),
        g = M.$<SVGGElement>('.me-mins', el);
      if (b && g)
        b.onclick = () => {
          g.style.display = g.style.display === 'none' ? '' : 'none';
          M.sfx.tap();
        };
    };
  }
  function clockReadShow(h: number, m: number): (el: HTMLElement) => Promise<void> {
    return async (el) => {
      const alive = claim(el);
      el.innerHTML = `<div class="viz-hint">Regarde bouger les aiguilles.</div>${clockSvg(h, 0, { ring: true, minutes: false, size: 300 })}<div class="viz-status"></div>`;
      const mins = M.$$<SVGGElement>('.me-min', el);
      const g = M.$<SVGGElement>('.me-mins', el);
      if (g) g.style.display = '';
      mins.forEach((x) => x.setAttribute('opacity', '.15'));
      status(el, `Il est ${fmt(h, 0)}…`);
      if (!(await wait(alive, 700))) return;
      if (m) {
        let shown = 0;
        const ok = await tween(alive, Math.max(900, m * 45), (k) => {
          const mm = m * k;
          setHands(el, h * 60 + mm);
          const s = Math.floor(mm / 5 + 1e-6);
          while (shown < s) {
            shown++;
            if (mins[shown % 12]) mins[shown % 12].setAttribute('opacity', '1');
            status(el, `${shown * 5} minutes`);
          }
        });
        if (!ok) return;
      }
      const hh = M.$('.me-hh', el);
      if (hh) hh.classList.add('me-hl');
      status(el, `<span class="me-dig">${fmt(h, m)}</span> — ${phrase(h, m)}.`);
    };
  }
  function heureGen(lvl: number): Question {
    const [h, m] = pickTime(lvl);
    const r = Math.random();
    // lvl 2 : quelques heures aux 5 minutes = défi 🌟 (au-delà de « heures, demies, quarts »)
    const type =
      lvl === 0
        ? r < 0.7
          ? 'read'
          : 'rev'
        : lvl === 1
          ? r < 0.5
            ? 'read'
            : r < 0.8
              ? 'rev'
              : 'where'
          : r < 0.4
            ? 'read'
            : r < 0.65
              ? 'rev'
              : r < 0.85
                ? 'phrase'
                : 'where';
    const q = heureGen2(lvl, h, m, type);
    if (m % 15 && type !== 'where') q.say = q.say || (q.prompt ?? '').replace(/<[^>]*>/g, '');
    if (m % 15 && type !== 'where')
      q.prompt = '<span class="tag enrich" title="Défi : au-delà du programme de 2e année">🌟 Défi</span> ' + q.prompt;
    return done(q);
  }
  function heureGen2(lvl: number, h: number, m: number, type: string): MesureDraft {
    const q: MesureDraft = {};
    if (type === 'read') {
      q.prompt = 'Quelle heure est-il ?';
      q.input = 'choice';
      q.choices = M.shuffle([[h, m], ...timeDistractors(h, m, lvl)]).map(([a, b]) => ({
        label: `<span class="me-dig">${fmt(a, b)}</span>`,
        value: key(a, b),
      }));
      q.answer = key(h, m);
      q.hint =
        m === 0
          ? "La grande aiguille est sur le 12 : c'est une heure juste. Regarde la petite aiguille."
          : "Regarde d'abord la petite aiguille (les heures), puis la grande (les minutes). Compte par 5 avec la grande aiguille.";
      q.explain = readExplain(h, m);
      q.viz = clockReadViz(h, m);
      q.showMe = clockReadShow(h, m);
      return q;
    }
    if (type === 'phrase') {
      const ts = [[h, m], ...timeDistractors(h, m, lvl)];
      const seen = new Set<string>(),
        ch: Choice[] = [];
      ts.forEach(([a, b]) => {
        const p = phrase(a, b);
        if (!seen.has(p)) {
          seen.add(p);
          ch.push({ label: p + '.', value: key(a, b) });
        }
      });
      q.prompt = "Quelle phrase dit l'heure de l'horloge ?";
      q.input = 'choice';
      q.cols = 1;
      q.choices = M.shuffle(ch);
      q.answer = key(h, m);
      q.hint = "15 minutes = « et quart ». 30 minutes = « et demie ». 45 minutes = « moins le quart » de l'heure suivante.";
      q.explain = readExplain(h, m);
      q.viz = clockReadViz(h, m);
      q.showMe = clockReadShow(h, m);
      return q;
    }
    if (type === 'where') {
      const mm = lvl === 1 ? 30 : M.pick([30, 15, 45]);
      const nx = h12(h + 1),
        pv = h12(h - 1);
      q.prompt = `À <span class="me-dig">${fmt(h, mm)}</span>, où est la <b>petite aiguille</b> ?`;
      q.say = `À ${timeWords(h, mm)}, où est la petite aiguille ?`;
      q.input = 'choice';
      q.choices = M.shuffle([
        { label: `Sur le ${h}`, value: 'on' },
        { label: `Entre le ${h} et le ${nx}`, value: 'ok' },
        { label: `Sur le ${nx}`, value: 'nx' },
        { label: `Entre le ${pv} et le ${h}`, value: 'pv' },
      ]);
      q.answer = 'ok';
      q.hint = "Pendant une heure, la petite aiguille avance doucement d'un nombre au suivant.";
      const whereEx: Record<number, string> = {
        15: `À ${fmt(h, mm)}, un quart d'heure est passé : la petite aiguille a un peu avancé, entre le ${h} et le ${nx}.`,
        30: `À ${fmt(h, mm)}, la moitié de l'heure est passée : la petite aiguille est au milieu, entre le ${h} et le ${nx}.`,
        45: `À ${fmt(h, mm)}, les trois quarts de l'heure sont passés : la petite aiguille est presque sur le ${nx}, mais encore entre le ${h} et le ${nx}.`,
      };
      q.explain = whereEx[mm];
      q.viz = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Essaie : avance les aiguilles et regarde la petite aiguille 🔴.</div><div class="me-w"></div><div class="viz-status"></div>`;
        clockWidget(M.$('.me-w', el)!, { t: h * 60, buttons: [-15, 15, 60], size: 260 });
      };
      q.showMe = async (el) => {
        const alive = claim(el);
        el.innerHTML = `<div class="viz-hint">De ${fmt(h, 0)} à ${fmt(h, mm)}…</div><div class="me-w"></div><div class="viz-status"></div>`;
        const w = clockWidget(M.$('.me-w', el)!, { t: h * 60, buttons: [], size: 260 });
        if (!(await wait(alive, 500))) return;
        await w.animateTo(h * 60 + mm, alive, 1800);
        if (!alive()) return;
        const hh = M.$('.me-hh', el);
        if (hh) hh.classList.add('me-hl');
        status(el, `La petite aiguille est entre le ${h} et le ${nx}.`);
      };
      return q;
    }
    // rev : quelle horloge montre…
    const cands: { v: string; h?: number; m?: number; ha?: number; ma?: number }[] = [{ v: 'ok', h, m }];
    const ang = (a: number, b: number): HM => [((a % 12) + b / 60) * 30, b * 6];
    const [cha, cma] = ang(h, m);
    const seen = new Set([`${f1(cha % 360)}|${cma}`]);
    const add = (v: string, ha: number, ma: number): void => {
      const k = `${f1(((ha % 360) + 360) % 360)}|${((ma % 360) + 360) % 360}`;
      if (!seen.has(k)) {
        seen.add(k);
        cands.push({ v, ha, ma });
      }
    };
    if (m >= 30 && lvl === 2) add('on', (h % 12) * 30, m * 6); // petite aiguille « pile » sur l'heure : piège
    add('sw', m * 6, cha);
    const nb = m >= 30 ? h12(h + 1) : h12(h - 1);
    add('nb', ...ang(nb, m));
    add('mm', ...ang(h, (m + 30) % 60));
    add('pv', ...ang(m >= 30 ? h12(h - 1) : h12(h + 1), m));
    add('x', ...ang(h12(h + 6), m));
    const list = [cands[0], ...cands.slice(1, 4)];
    q.prompt = `Quelle horloge montre <span class="me-dig">${fmt(h, m)}</span> ?`;
    q.say = `Quelle horloge montre ${timeWords(h, m)} ?`;
    q.input = 'choice';
    q.cols = 2;
    q.choices = M.shuffle(list).map((c) => ({
      label: c.v === 'ok' ? clockSvg(h, m, { size: 120 }) : clockSvg(0, 0, { ha: c.ha, ma: c.ma, size: 120 }),
      value: c.v,
    }));
    q.answer = 'ok';
    q.hint =
      m === 0
        ? "À l'heure juste, la grande aiguille est sur le 12."
        : `La grande aiguille doit être sur le ${m / 5}, et la petite aiguille entre le ${h} et le ${h12(h + 1)}.`;
    q.explain =
      readExplain(h, m) +
      (list.some((c) => c.v === 'on') ? " Attention : la petite aiguille n'est pas pile sur le " + h + ', elle a avancé !' : '');
    q.viz = (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Essaie de mettre l'horloge à <b>${fmt(h, m)}</b> (tu peux glisser la grande aiguille).</div><div class="me-w"></div><div class="viz-status"></div>`;
      clockWidget(M.$('.me-w', el)!, {
        t: 12 * 60,
        buttons: [-60, 60, 15, 5],
        size: 240,
        onChange: (a, b) => status(el, a === h && b === m ? "✅ Bravo, c'est la bonne heure ! Trouve l'horloge pareille." : ''),
      });
    };
    q.showMe = async (el) => {
      const alive = claim(el);
      el.innerHTML = `<div class="viz-hint">Regarde : on met l'horloge à ${fmt(h, m)}.</div><div class="me-w"></div><div class="viz-status"></div>`;
      const w = clockWidget(M.$('.me-w', el)!, { t: 12 * 60, buttons: [], size: 240 });
      if (!(await wait(alive, 400))) return;
      await w.animateTo(h * 60 + m, alive, 2000);
      if (alive()) status(el, phrase(h, m) + '.');
    };
    return q;
  }
  M.registerSkill({
    id: 'heure',
    domain: D,
    title: "Lire l'heure",
    icon: '🕒',
    starter: true,
    desc: "Lis l'heure sur une horloge à aiguilles : heures justes, demies et quarts.",
    pda: "Mesure — Temps G.1 : lire l'heure (heures, demies, quarts) sur une horloge à aiguilles; lvl 2 : quelques heures aux 5 minutes, marquées 🌟 Défi (enrichissement)",
    learn: 'heure',
    gen: ({ lvl }) => heureGen(lvl),
  });

  /* =====================================================================
     6. Le calendrier : jours, mois, saisons, cycles
     ===================================================================== */
  const mod = (a: number, n: number): number => ((a % n) + n) % n;
  function namesChoices(list: string[], ans: string, near: string[], n = 4): Choice<string>[] {
    const set = new Set([ans]);
    near.forEach((x) => {
      if (set.size < n) set.add(x);
    });
    M.shuffle(list).forEach((x) => {
      if (set.size < n) set.add(x);
    });
    return M.shuffle([...set]).map((x) => ({ label: x, value: x }));
  }
  const dayStrip = (hl: number): string =>
    stripHtml(
      DAYS.map((d, i) => ({ t: d, cls: (i === 0 || i === 6 ? 'we ' : '') + (hl === i ? 'today' : '') })),
      7,
    );
  const monthStrip = (hl: number): string =>
    stripHtml(
      MONTHS.map((d, i) => ({ t: d, cls: hl === i ? 'today' : '' })),
      6,
    );
  const seasonStrip = (): string =>
    stripHtml(
      SEASONS.map((s) => ({ t: s.id, em: s.em, sub: s.months.map((i) => MONTHS[i]).join(', ') })),
      4,
    );
  /** Démo : avance de tuile en tuile depuis `from` de `steps` pas (négatif = recule). */
  function stepDemo(htmlFn: (hl: number) => string, n: number, from: number, steps: number, endText: string) {
    return async (el: HTMLElement): Promise<void> => {
      const alive = claim(el);
      el.innerHTML = `<div class="viz-hint">On avance une case à la fois.</div>${htmlFn(from)}<div class="viz-status"></div>`;
      const tiles = M.$$('.me-tile', el);
      const dir = steps < 0 ? -1 : 1;
      for (let k = 1; k <= Math.abs(steps); k++) {
        if (!(await wait(alive, 550))) return;
        const t = tiles[mod(from + dir * k, n)];
        if (t) {
          t.classList.add('on');
          badge(t, (dir > 0 ? '+' : '−') + k);
        }
        M.sfx.hop();
      }
      status(el, endText);
    };
  }
  function tileToggleViz(htmlFn: (hl: number) => string, hl: number, hintTxt: string) {
    return (el: HTMLElement): void => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">${hintTxt}</div>${htmlFn(hl)}<div class="viz-status"></div>`;
      const strip = M.$('.me-strip', el);
      if (strip)
        strip.onclick = (e) => {
          const t = M.closest(e, '.me-tile');
          if (t) {
            t.classList.toggle('on');
            M.sfx.tap();
          }
        };
    };
  }
  function hiddenOrderViz(labels: string[], cols: number) {
    return (el: HTMLElement): void => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Besoin d'aide ? Touche une case pour la découvrir.</div>${stripHtml(
        labels.map(() => ({ t: '?', cls: 'hidden-lbl' })),
        cols,
      )}<div class="viz-status"></div>`;
      const strip = M.$('.me-strip', el);
      if (strip)
        strip.onclick = (e) => {
          const t = M.closest(e, '.me-tile');
          if (!t) return;
          const l = M.$('.me-lbl', t);
          if (l) l.textContent = labels[Number(t.dataset.i)];
          t.classList.remove('hidden-lbl');
          M.sfx.tap();
        };
    };
  }
  function revealAll(labels: string[], cols: number, text: string) {
    return async (el: HTMLElement): Promise<void> => {
      const alive = claim(el);
      el.innerHTML = `<div class="viz-hint">Dans l'ordre :</div>${stripHtml(
        labels.map(() => ({ t: '?', cls: 'hidden-lbl' })),
        cols,
      )}<div class="viz-status"></div>`;
      const tiles = M.$$('.me-tile', el);
      for (let i = 0; i < tiles.length; i++) {
        if (!(await wait(alive, 380))) return;
        const l = M.$('.me-lbl', tiles[i]);
        if (l) l.textContent = labels[i];
        tiles[i].classList.remove('hidden-lbl');
        tiles[i].classList.add('on');
        M.sfx.pop();
      }
      status(el, text || '');
    };
  }
  function calGen(lvl: number): MesureDraft {
    const T0 = ['after', 'before', 'tomorrow', 'yesterday', 'count', 'season'];
    const T1 = ['mAfter', 'mBefore', 'orderDays', 'eventMonth', 'count', 'cycle', 'season'];
    const T2 = ['grid', 'grid', 'orderMonths', 'orderSeasons', 'inDays', 'twoDays', 'cycle', 'eventMonth'];
    const type = M.pick(lvl === 0 ? T0 : lvl === 1 ? T1 : T2);
    const q: MesureDraft = {};
    if (['after', 'before', 'tomorrow', 'yesterday', 'inDays', 'twoDays'].includes(type)) {
      const d = M.rnd(0, 6);
      let steps: number, prompt: string;
      if (type === 'after') {
        steps = 1;
        prompt = `Quel jour vient <b>après ${DAYS[d]}</b> ?`;
      } else if (type === 'before') {
        steps = -1;
        prompt = `Quel jour vient <b>avant ${DAYS[d]}</b> ?`;
      } else if (type === 'tomorrow') {
        steps = 1;
        prompt = `Aujourd'hui, c'est <b>${DAYS[d]}</b>. Demain, ce sera…`;
      } else if (type === 'yesterday') {
        steps = -1;
        prompt = `Aujourd'hui, c'est <b>${DAYS[d]}</b>. Hier, c'était…`;
      } else if (type === 'twoDays') {
        const fw = Math.random() < 0.5;
        steps = fw ? 2 : -2;
        prompt = `Aujourd'hui, c'est <b>${DAYS[d]}</b>. ${fw ? 'Après-demain, ce sera…' : "Avant-hier, c'était…"}`;
      } else {
        steps = M.rnd(2, 5);
        prompt = `Aujourd'hui, c'est <b>${DAYS[d]}</b>. Quel jour sera-t-il <b>dans ${steps} jours</b> ?`;
      }
      const ans = DAYS[mod(d + steps, 7)];
      q.prompt = prompt;
      q.input = 'choice';
      q.choices = namesChoices(DAYS, ans, [DAYS[mod(d - steps, 7)], DAYS[mod(d + steps + (steps > 0 ? 1 : -1), 7)], DAYS[d]]);
      q.answer = ans;
      q.hint = "Récite les jours dans l'ordre : dimanche, lundi, mardi, mercredi, jeudi, vendredi, samedi… et on recommence !";
      const past = steps < 0;
      const dayEx: Record<string, string> = {
        after: `Après ${DAYS[d]}, c'est <b>${ans}</b>.`,
        before: `Avant ${DAYS[d]}, c'est <b>${ans}</b>.`,
        tomorrow: `Demain, ce sera <b>${ans}</b>.`,
        yesterday: `Hier, c'était <b>${ans}</b>.`,
        twoDays: past
          ? `Avant-hier, c'était <b>${ans}</b> (2 jours avant ${DAYS[d]}).`
          : `Après-demain, ce sera <b>${ans}</b> (2 jours après ${DAYS[d]}).`,
        inDays: `On avance de ${steps} jours après ${DAYS[d]} : ce sera <b>${ans}</b>.`,
      };
      q.explain = dayEx[type];
      q.viz = tileToggleViz(dayStrip, d, 'La semaine (le bleu = le jour de départ). Touche pour compter.');
      q.showMe = stepDemo(dayStrip, 7, d, steps, `C'est <b>${ans}</b> !`);
      return q;
    }
    if (type === 'mAfter' || type === 'mBefore') {
      const mo = M.rnd(0, 11),
        st = type === 'mAfter' ? 1 : -1;
      const ans = MONTHS[mod(mo + st, 12)];
      q.prompt = `Quel mois vient <b>${st > 0 ? 'après' : 'avant'} ${MONTHS[mo]}</b> ?`;
      q.input = 'choice';
      q.choices = namesChoices(MONTHS, ans, [MONTHS[mod(mo - st, 12)], MONTHS[mod(mo + 2 * st, 12)], MONTHS[mo]]);
      q.answer = ans;
      q.hint = 'Janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre.';
      q.explain = `${st > 0 ? 'Après' : 'Avant'} ${MONTHS[mo]}, c'est <b>${ans}</b>.${mo === 11 && st > 0 ? ' Après décembre, une nouvelle année commence !' : mo === 0 && st < 0 ? " Avant janvier, c'est la fin de l'année d'avant." : ''}`;
      q.viz = tileToggleViz(monthStrip, mo, "Les 12 mois de l'année.");
      q.showMe = stepDemo(monthStrip, 12, mo, st, `C'est <b>${ans}</b> !`);
      return q;
    }
    if (type === 'count') {
      const pool: [string, number, string][] =
        lvl === 0
          ? [
              ['Combien de jours y a-t-il dans une semaine ?', 7, 'week'],
              ['Combien de jours dure la fin de semaine ?', 2, 'weekend'],
              ["Combien de jours d'école y a-t-il dans une semaine (du lundi au vendredi) ?", 5, 'school'],
            ]
          : [
              ['Combien de mois y a-t-il dans une année ?', 12, 'months'],
              ['Combien de saisons y a-t-il dans une année ?', 4, 'seasons'],
              ['Combien de jours y a-t-il dans une semaine ?', 7, 'week'],
            ];
      const [p, ans, k] = M.pick(pool);
      q.prompt = p;
      q.input = 'number';
      q.answer = ans;
      q.hint = 'Compte les cases une à une.';
      const ex = (
        {
          week: 'Une semaine a 7 jours : dimanche, lundi, mardi, mercredi, jeudi, vendredi, samedi.',
          weekend: "La fin de semaine, c'est samedi et dimanche : 2 jours.",
          school: "Lundi, mardi, mercredi, jeudi, vendredi : 5 jours d'école.",
          months: 'Une année a 12 mois, de janvier à décembre.',
          seasons: "Il y a 4 saisons : le printemps, l'été, l'automne et l'hiver.",
        } as Record<string, string>
      )[k];
      q.explain = ex;
      const html = k === 'months' ? monthStrip : k === 'seasons' ? seasonStrip : dayStrip;
      const which = (i: number): boolean => (k === 'weekend' ? i === 0 || i === 6 : k === 'school' ? i >= 1 && i <= 5 : true);
      q.viz = tileToggleViz(html, -1, 'Touche les cases pour les compter.');
      q.showMe = async (el) => {
        const alive = claim(el);
        el.innerHTML = `<div class="viz-hint">On compte.</div>${html(-1)}<div class="viz-status"></div>`;
        const tiles = M.$$('.me-tile', el);
        let c = 0;
        for (let i = 0; i < tiles.length; i++) {
          if (!which(i)) continue;
          if (!(await wait(alive, 380))) return;
          c++;
          tiles[i].classList.add('on');
          badge(tiles[i], String(c));
          M.sfx.pop();
        }
        status(el, `<b>${c}</b> !`);
      };
      return q;
    }
    if (type === 'season') {
      const useEvent = lvl > 0 || Math.random() < 0.5;
      let p: string, ans: string;
      if (useEvent) {
        const ev = M.pick(
          EVENTS.filter((e) => e.s && (lvl > 0 || ['Noël', "l'Halloween", 'la fête du Canada', 'la Saint-Valentin'].includes(e.name))),
        );
        p = `${ev.em} En quelle saison est <b>${ev.name}</b> ?`;
        ans = ev.s!; // filtré : e.s
        const se = SEASONS.find((x) => x.id === ans)!;
        q.explain = `${cap(ev.name)}, c'est ${ev.when} : c'est ${se.the} ${se.em}.`;
      } else {
        const sg = M.pick(SIGNS);
        p = `${sg.em} « ${sg.t} » En quelle saison ?`;
        ans = sg.s;
        const se = SEASONS.find((s) => s.id === ans)!;
        q.explain = `${sg.t} C'est ${se.the} ${se.em}.`;
      }
      q.prompt = p;
      q.input = 'choice';
      q.choices = SEASONS.map((s) => ({ label: `<span>${s.em}</span><span>${s.id}</span>`, value: s.id }));
      q.answer = ans;
      q.hint = "Pense au temps qu'il fait : neige, fleurs, chaleur ou feuilles qui tombent ?";
      q.viz = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Les 4 saisons et leurs mois (à peu près).</div>${seasonStrip()}<div class="viz-status"></div>`;
      };
      q.showMe = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Les 4 saisons.</div>${seasonStrip()}<div class="viz-status">${SEASONS.find((s) => s.id === ans)!.em} ${ans}</div>`;
        const t = M.$$('.me-tile', el)[SEASONS.findIndex((s) => s.id === ans)];
        if (t) t.classList.add('on');
      };
      return q;
    }
    if (type === 'eventMonth') {
      const ev = M.pick(EVENTS.filter((e) => e.m != null));
      const em = ev.m!; // filtré : e.m != null
      const ans = MONTHS[em];
      q.prompt = `${ev.em} En quel mois fête-t-on <b>${ev.name}</b> ?`;
      q.input = 'choice';
      q.choices = namesChoices(MONTHS, ans, [MONTHS[mod(em + 1, 12)], MONTHS[mod(em - 1, 12)]]);
      q.answer = ans;
      q.hint = "Pense au temps qu'il fait ce jour-là, puis cherche le mois.";
      q.explain = `${cap(ev.name)}, c'est ${ev.when}.`;
      q.viz = tileToggleViz(monthStrip, -1, "Les 12 mois de l'année.");
      q.showMe = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Les 12 mois de l'année.</div>${monthStrip(-1)}<div class="viz-status">${ev.em} ${cap(ev.name)} : ${ev.when}</div>`;
        const t = M.$$('.me-tile', el)[em];
        if (t) t.classList.add('on');
      };
      return q;
    }
    if (type === 'cycle') {
      const items: [string, string][] = [
        ['Ton anniversaire revient…', 'an'],
        ['Noël revient…', 'an'],
        ["L'été revient…", 'an'],
        ['Le déjeuner revient…', 'jour'],
        ["L'heure du dodo revient…", 'jour'],
        ['Le lever du soleil revient…', 'jour'],
        ['Le samedi revient…', 'sem'],
        ['La fin de semaine revient…', 'sem'],
        ['Le lundi revient…', 'sem'],
      ];
      const [p, ans] = M.pick(items);
      const W: Record<string, string> = { jour: 'chaque jour', sem: 'chaque semaine', an: 'chaque année' };
      q.prompt = p;
      q.input = 'choice';
      q.choices = [
        ['jour', '☀️'],
        ['sem', '📅'],
        ['an', '🎂'],
      ].map(([v, e]) => ({ label: `<span>${e}</span><span>${W[v]}</span>`, value: v }));
      q.answer = ans;
      q.hint = 'Est-ce que ça arrive tous les jours, une fois par semaine ou une fois par année ?';
      q.explain = `${p.replace('…', '')} <b>${W[ans]}</b>. ${ans === 'jour' ? 'Le cycle du jour : matin, midi, soir, nuit.' : ans === 'sem' ? 'Le cycle de la semaine : 7 jours, puis on recommence.' : "Le cycle de l'année : 12 mois, 4 saisons, puis on recommence."}`;
      const cyc = () =>
        stripHtml(
          [
            { t: 'chaque jour', em: '☀️🌙', sub: 'matin, midi, soir, nuit' },
            { t: 'chaque semaine', em: '📅', sub: '7 jours' },
            { t: 'chaque année', em: '🎂', sub: '12 mois, 4 saisons' },
          ],
          3,
        );
      q.viz = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Les cycles du temps.</div>${cyc()}<div class="viz-status"></div>`;
      };
      q.showMe = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Les cycles du temps.</div>${cyc()}<div class="viz-status">${W[ans]}</div>`;
        const t = M.$$('.me-tile', el)[['jour', 'sem', 'an'].indexOf(ans)];
        if (t) t.classList.add('on');
      };
      return q;
    }
    if (type === 'orderDays' || type === 'orderMonths') {
      const list = type === 'orderDays' ? DAYS : MONTHS,
        N = list.length;
      const k = 4,
        s = M.rnd(0, N - 1);
      const seq = M.range(0, k - 1).map((i) => list[mod(s + i, N)]);
      q.prompt = `Place ces ${type === 'orderDays' ? 'jours' : 'mois'} dans l'ordre.`;
      q.input = 'order';
      q.choices = M.shuffle(seq).map((x) => ({ label: x, value: x }));
      q.answer = seq;
      q.hint =
        type === 'orderDays' ? 'Récite la comptine des jours : dimanche, lundi, mardi…' : 'Récite les mois : janvier, février, mars…';
      q.explain = `Dans l'ordre : ${seq.join(', ')}.${mod(s + k - 1, N) < s ? (type === 'orderDays' ? ' Après samedi, on recommence avec dimanche.' : ' Après décembre, on recommence avec janvier.') : ''}`;
      q.viz = hiddenOrderViz(seq, k);
      q.showMe = revealAll(seq, k, seq.join(' → '));
      return q;
    }
    if (type === 'orderSeasons') {
      const seq = SEASONS.map((s) => s.id);
      q.prompt = "Place les saisons dans l'ordre, en commençant par <b>le printemps</b> 🌷.";
      q.input = 'order';
      q.choices = M.shuffle(SEASONS).map((s) => ({ label: `${s.em} ${s.id}`, value: s.id }));
      q.answer = seq;
      q.hint = 'Après la neige fondent… les fleurs. Puis la chaleur, puis les feuilles qui tombent.';
      q.explain = "Le printemps 🌷, l'été ☀️, l'automne 🍁, l'hiver ❄️… et on recommence !";
      const labels = SEASONS.map((s) => `${s.em} ${s.id}`);
      q.viz = hiddenOrderViz(labels, 4);
      q.showMe = revealAll(labels, 4, "Et après l'hiver, le printemps revient !");
      return q;
    }
    // grid : lire un calendrier du mois
    const y = new Date().getFullYear(),
      mo = M.rnd(0, 11);
    const first = new Date(y, mo, 1).getDay(),
      nd = new Date(y, mo + 1, 0).getDate();
    const gt = M.pick(['weekday', 'weekday', 'firstX', 'countX', 'ndays']);
    let col: number | null = null,
      hl: number | null = null;
    if (gt === 'weekday') {
      const d = M.rnd(2, nd);
      const wd = (first + d - 1) % 7;
      q.prompt = `Regarde le calendrier. Quel jour de la semaine est le <b>${d} ${MONTHS[mo]}</b> ?`;
      q.say = `Regarde le calendrier. Quel jour de la semaine est le ${d} ${MONTHS[mo]} ?`;
      q.input = 'choice';
      q.choices = namesChoices(DAYS, DAYS[wd], [DAYS[mod(wd - 1, 7)], DAYS[mod(wd + 1, 7)]]);
      q.answer = DAYS[wd];
      q.hint = "Trouve la date, puis monte tout droit jusqu'au nom du jour en haut de la colonne.";
      q.explain = `Le ${d} ${MONTHS[mo]} est dans la colonne « ${DAYS_AB[wd]} » : c'est un <b>${DAYS[wd]}</b>.`;
      col = wd;
      hl = d;
    } else if (gt === 'firstX') {
      const wd = M.rnd(0, 6);
      const d = 1 + mod(wd - first, 7);
      q.prompt = `Regarde le calendrier. Quelle est la date du <b>premier ${DAYS[wd]}</b> ${M.fr.de(MONTHS[mo])} ?`;
      q.input = 'number';
      q.answer = d;
      q.hint = `Trouve la colonne des ${DAYS[wd]}s, puis descends jusqu'au premier nombre.`;
      q.explain = `Dans la colonne « ${DAYS_AB[wd]} », le premier nombre est le ${d} : le premier ${DAYS[wd]} est le ${dateHtml(d)} ${MONTHS[mo]}.`;
      col = wd;
      hl = d;
    } else if (gt === 'countX') {
      const wd = M.rnd(0, 6);
      const d1 = 1 + mod(wd - first, 7);
      const c = Math.floor((nd - d1) / 7) + 1;
      q.prompt = `Regarde le calendrier. Combien y a-t-il de <b>${DAYS[wd]}s</b> en ${MONTHS[mo]} ?`;
      q.input = 'number';
      q.answer = c;
      q.hint = `Compte les nombres dans la colonne des ${DAYS[wd]}s.`;
      q.explain = `Dans la colonne « ${DAYS_AB[wd]} », il y a ${c} dates : ${M.range(0, c - 1)
        .map((i) => d1 + 7 * i)
        .join(', ')}.`;
      col = wd;
    } else {
      q.prompt = `Regarde le calendrier. Combien de jours y a-t-il en <b>${MONTHS[mo]}</b> ?`;
      q.input = 'number';
      q.answer = nd;
      q.hint = 'Regarde la dernière date du mois.';
      q.explain = `La dernière date est le ${nd} : ${MONTHS[mo]} a ${nd} jours.`;
      hl = nd;
    }
    q.viz = (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Touche une date pour voir sa colonne.</div>${calHtml(y, mo)}<div class="viz-status"></div>`;
      const t = M.$('.me-cal', el);
      if (t)
        t.onclick = (e) => {
          const td = M.closest(e, 'td[data-d]');
          if (!td) return;
          calMark(el, Number(td.dataset.c), Number(td.dataset.d));
          M.sfx.tap();
        };
    };
    q.showMe = (el) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Regarde la colonne en vert.</div>${calHtml(y, mo)}<div class="viz-status"></div>`;
      calMark(el, col, hl);
      status(el, q.explain ?? '');
    };
    return q;
  }
  M.registerSkill({
    id: 'calendrier',
    domain: D,
    title: 'Le calendrier',
    icon: '📅',
    desc: 'Les jours, les mois, les saisons et les cycles du temps. Lis un calendrier.',
    pda: 'Mesure — Temps : jour, semaine, mois, année, saisons; cycles quotidien, hebdomadaire et annuel',
    learn: 'calendrier',
    gen: ({ lvl }) => done(calGen(lvl)),
  });

  /* =====================================================================
     7. Les durées
     ===================================================================== */
  interface TimeUnit {
    id: string;
    sing: string;
    pl: string;
    em: string;
    /** Durée en secondes. */
    sec: number;
    ex: string;
  }
  interface Activity {
    t: string;
    em: string;
    n: number;
    /** Id d'une unité de TU. */
    u: string;
  }
  const TU: TimeUnit[] = [
    { id: 's', sing: 'seconde', pl: 'secondes', em: '⚡', sec: 1, ex: 'cligner des yeux' },
    { id: 'min', sing: 'minute', pl: 'minutes', em: '⏱️', sec: 60, ex: 'se laver les mains' },
    { id: 'h', sing: 'heure', pl: 'heures', em: '🕐', sec: 3600, ex: 'un film' },
    { id: 'j', sing: 'jour', pl: 'jours', em: '☀️', sec: 86400, ex: 'du matin au matin' },
    { id: 'sem', sing: 'semaine', pl: 'semaines', em: '📅', sec: 604800, ex: '7 jours' },
    { id: 'mois', sing: 'mois', pl: 'mois', em: '🗓️', sec: 2592000, ex: 'environ 30 jours' },
  ];
  const TUi = (id: string): TimeUnit => TU.find((u) => u.id === id)!;
  const ACTS: Activity[] = [
    { t: 'Brosser tes dents', em: '🪥', n: 2, u: 'min' },
    { t: 'Une nuit de sommeil', em: '😴', n: 10, u: 'h' },
    { t: 'Un film au cinéma', em: '🎬', n: 2, u: 'h' },
    { t: "Les vacances d'été", em: '🏖️', n: 2, u: 'mois' },
    { t: 'Cligner des yeux', em: '😉', n: 1, u: 's' },
    { t: 'Manger ta collation', em: '🍎', n: 10, u: 'min' },
    { t: "Une journée d'école", em: '🏫', n: 6, u: 'h' },
    { t: 'La semaine de relâche', em: '⛷️', n: 1, u: 'sem' },
    { t: 'Mettre tes bottes', em: '🥾', n: 1, u: 'min' },
    { t: 'Faire cuire des biscuits', em: '🍪', n: 10, u: 'min' },
    { t: 'Attacher tes souliers', em: '👟', n: 20, u: 's' },
    { t: 'Faire pousser une citrouille', em: '🎃', n: 3, u: 'mois' },
    { t: "Le camp de jour d'été", em: '🏕️', n: 6, u: 'sem' },
  ];
  const durTxt = (n: number, u: string): string => `${n} ${M.plural(n, TUi(u).sing, TUi(u).pl)}`;
  const actSec = (a: Activity): number => a.n * TUi(a.u).sec;
  function ladderHtml(hl: string | null): string {
    return stripHtml(
      TU.map((u) => ({ t: u.sing, em: u.em, cls: hl === u.id ? 'on' : '' })),
      6,
    );
  }
  function durGen(lvl: number): MesureDraft {
    const types =
      lvl === 0
        ? ['est', 'est', 'most']
        : lvl === 1
          ? ['est', 'most', 'conv', 'cmpU']
          : ['est', 'most', 'conv', 'elapsed', 'elapsed', 'end'];
    const type = M.pick(types);
    const q: MesureDraft = {};
    const ladderViz = (hl: string | null) => (el: HTMLElement) => {
      claim(el);
      el.innerHTML = `<div class="viz-hint">Les unités de temps, de la plus courte à la plus longue :</div>${ladderHtml(hl)}<div class="viz-status"></div>`;
    };
    if (type === 'est') {
      const a = M.pick(ACTS);
      const ui = TU.findIndex((u) => u.id === a.u);
      const others = TU.filter((u, i) => i !== ui && Math.max(u.sec, TU[ui].sec) / Math.min(u.sec, TU[ui].sec) >= 20);
      const ds = M.shuffle(others).slice(0, 2);
      q.prompt = `${a.em} <b>${a.t}</b>, ça dure environ…`;
      q.say = `${a.t}, ça dure environ combien de temps ?`;
      q.input = 'choice';
      q.choices = M.shuffle([a.u, ...ds.map((u) => u.id)]).map((u) => ({ label: durTxt(a.n, u), value: u }));
      q.answer = a.u;
      q.hint = "Imagine-toi en train de le faire. C'est très court, quelques minutes, quelques heures ou plusieurs jours ?";
      q.explain = `${a.t}, ça dure environ <b>${durTxt(a.n, a.u)}</b>.`;
      q.viz = ladderViz(null);
      q.showMe = (el) => {
        ladderViz(a.u)(el);
        status(el, `${TUi(a.u).em} ${durTxt(a.n, a.u)}`);
      };
      return q;
    }
    if (type === 'most') {
      let pick: Activity[] = [];
      for (let g = 0; g < 100; g++) {
        pick = M.shuffle(ACTS).slice(0, 3);
        const s = pick.map(actSec).sort((x, y) => x - y);
        if (s[1] / s[0] >= 5 && s[2] / s[1] >= 5) break;
      }
      const most = Math.random() < 0.6;
      const best = pick.slice().sort((x, y) => (most ? actSec(y) - actSec(x) : actSec(x) - actSec(y)))[0];
      q.prompt = `Qu'est-ce qui dure le <b>${most ? 'plus' : 'moins'} longtemps</b> ?`;
      q.input = 'choice';
      q.cols = 1;
      q.choices = pick.map((a) => ({ label: `<span>${a.em} ${a.t}</span>`, value: a.t }));
      q.answer = best.t;
      q.hint = 'Pense au temps que dure chaque activité : des secondes, des minutes, des heures, des jours ?';
      q.explain =
        pick.map((a) => `${a.t} : environ ${durTxt(a.n, a.u)}`).join(' ; ') +
        `. Le ${most ? 'plus' : 'moins'} long : <b>${best.t.charAt(0).toLowerCase() + best.t.slice(1)}</b>.`;
      q.viz = ladderViz(null);
      q.showMe = (el) => {
        ladderViz(best.u)(el);
        status(el, `${best.em} ${best.t} : environ ${durTxt(best.n, best.u)}`);
      };
      return q;
    }
    if (type === 'cmpU') {
      const us = M.shuffle(TU.slice(0, 5)).slice(0, 3);
      const most = Math.random() < 0.6;
      const best = us.slice().sort((a, b) => (most ? b.sec - a.sec : a.sec - b.sec))[0];
      q.prompt = `Qu'est-ce qui est le <b>plus ${most ? 'long' : 'court'}</b> ?`;
      q.input = 'choice';
      q.choices = M.shuffle(us).map((u) => ({ label: `<span>${u.em}</span><span>1 ${u.sing}</span>`, value: u.id }));
      q.answer = best.id;
      q.hint = 'Seconde, minute, heure, jour, semaine : de la plus courte à la plus longue.';
      q.explain = `De la plus courte à la plus longue : ${us
        .slice()
        .sort((a, b) => a.sec - b.sec)
        .map((u) => '1 ' + u.sing)
        .join(', ')}. Le plus ${most ? 'long' : 'court'} : <b>1 ${best.sing}</b>.`;
      q.viz = ladderViz(null);
      q.showMe = (el) => {
        ladderViz(best.id)(el);
        status(el, `1 ${best.sing}`);
      };
      return q;
    }
    if (type === 'conv') {
      const pool: [string, number, string][] =
        lvl === 1
          ? [
              ['1 semaine = {?} jours', 7, 'week'],
              ['1 jour = {?} heures', 24, 'ladder'],
              ['1 heure = {?} minutes', 60, 'clock'],
            ]
          : [
              ['1 heure = {?} minutes', 60, 'clock'],
              ['Une demi-heure = {?} minutes', 30, 'half'],
              ['1 minute = {?} secondes', 60, 'ladder'],
              ["Un quart d'heure = {?} minutes", 15, 'quarter'],
            ];
      const [p, ans, k] = M.pick(pool);
      q.prompt = `<div class="eq" style="font-size:2.2rem">${p}</div>`;
      q.say = p.replace('{?}', 'combien de');
      q.input = 'number';
      q.answer = ans;
      q.hint = (
        {
          week: 'Récite les jours de la semaine en les comptant.',
          ladder: "C'est un nombre à retenir !",
          clock: 'Pendant 1 heure, la grande aiguille fait un tour complet : 5, 10, 15… 60.',
          half: "Une demi-heure, c'est la moitié d'une heure : la grande aiguille fait un demi-tour.",
          quarter: "Un quart d'heure : la grande aiguille va du 12 au 3.",
        } as Record<string, string>
      )[k];
      q.explain = (
        {
          week: 'Une semaine a 7 jours.',
          ladder: ans === 24 ? 'Un jour complet (le jour et la nuit) dure 24 heures.' : 'Une minute dure 60 secondes.',
          clock: "Une heure = 60 minutes : la grande aiguille fait un tour complet et la petite aiguille avance d'un nombre.",
          half: 'Une demi-heure = 30 minutes : la grande aiguille fait un demi-tour.',
          quarter: "Un quart d'heure = 15 minutes : la grande aiguille fait un quart de tour.",
        } as Record<string, string>
      )[k];
      if (k === 'week') {
        q.viz = tileToggleViz(dayStrip, -1, 'Touche les jours pour les compter.');
        q.showMe = async (el) => {
          const alive = claim(el);
          el.innerHTML = `<div class="viz-hint">On compte les jours.</div>${dayStrip(-1)}<div class="viz-status"></div>`;
          const tiles = M.$$('.me-tile', el);
          for (let i = 0; i < 7; i++) {
            if (!(await wait(alive, 350))) return;
            tiles[i].classList.add('on');
            badge(tiles[i], String(i + 1));
            M.sfx.pop();
          }
          status(el, '<b>7</b> jours');
        };
      } else if (k === 'ladder') {
        q.viz = ladderViz(null);
      } else {
        const mins = k === 'clock' ? 60 : k === 'half' ? 30 : 15;
        q.viz = (el) => {
          claim(el);
          el.innerHTML = `<div class="viz-hint">Touche 👀 pour voir la grande aiguille tourner.</div>${clockSvg(12, 0, { ring: true, minutes: true, size: 260 })}<div class="viz-status"></div>`;
        };
        q.showMe = async (el) => {
          const alive = claim(el);
          el.innerHTML = `<div class="viz-hint">La grande aiguille compte les minutes.</div>${clockSvg(12, 0, { ring: true, minutes: true, size: 260 })}<div class="viz-status"></div>`;
          if (!(await wait(alive, 400))) return;
          const ok = await tween(alive, mins * 50, (k2) => {
            const t = 12 * 60 + mins * k2;
            setHands(el, t);
            status(el, `${Math.floor(mins * k2 + 1e-6)} minutes`);
          });
          if (ok) status(el, `<b>${mins} minutes</b>`);
        };
      }
      return q;
    }
    // elapsed / end : durée en heures entières
    // Heures de début et durées réalistes pour chaque activité (après-midi en 13 h – 17 h)
    const ctx = M.pick<[string, string, number[], number[]]>([
      ['Le film', 'il', [13, 14, 15, 18, 19], [2]],
      ["La fête d'anniversaire", 'elle', [13, 14, 15], [2, 3]],
      ['La visite au zoo', 'elle', [9, 10, 13], [2, 3, 4]],
      ['La partie de soccer', 'elle', [9, 10, 17, 18], [1, 2]],
      ['Le cours de natation', 'il', [9, 10, 16, 17], [1]],
      ['La sortie à la cabane à sucre', 'elle', [10, 11, 13], [2, 3, 4]],
      ['Le pique-nique au parc', 'il', [11, 12], [1, 2, 3]],
      ['La journée de ski', 'elle', [9, 10], [3, 4]],
    ]);
    const [who, pr, starts, durs] = ctx;
    const d = M.pick(durs),
      s = M.pick(starts);
    const e = s + d;
    const twoClocks = (showEnd: boolean): string => `<div class="l-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
      <div class="l-tile"><b>Début</b>${clockSvg(s, 0, { size: 180 })}<div class="me-dig">${fmt(s, 0)}</div></div>
      <div class="l-tile"><b>Fin</b>${showEnd ? clockSvg(e, 0, { size: 180 }) + `<div class="me-dig">${fmt(e, 0)}</div>` : '<div style="font-size:4rem;font-weight:900;color:#c7c2b4">?</div>'}</div></div>`;
    if (type === 'elapsed') {
      q.prompt = `${who} commence à <span class="me-dig">${fmt(s, 0)}</span> et finit à <span class="me-dig">${fmt(e, 0)}</span>. Combien d'heures dure-t-${pr} ?`;
      q.say = `${who} commence à ${h24Words(s)} et finit à ${h24Words(e)}. Combien d'heures dure-t-${pr} ?`;
      q.input = 'number';
      q.answer = d;
      q.unit = 'h';
      q.hint = `Compte les heures à partir de ${fmt(s, 0)} : ${fmt(s + 1, 0)}, c'est 1 heure…`;
      q.explain = `De ${fmt(s, 0)} à ${fmt(e, 0)} : ${M.range(s + 1, e)
        .map((x, i) => `${fmt(x, 0)} (${i + 1})`)
        .join(', ')}. ${cap(pr)} dure <b>${durTxt(d, 'h')}</b>.`;
      q.viz = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Regarde les deux horloges.</div>${twoClocks(true)}<div class="viz-status"></div>`;
      };
    } else {
      q.prompt = `${who} commence à <span class="me-dig">${fmt(s, 0)}</span> et dure <b>${durTxt(d, 'h')}</b>. À quelle heure finit-${pr} ?`;
      q.say = `${who} commence à ${h24Words(s)} et dure ${d} ${M.plural(d, 'heure')}. À quelle heure finit-${pr} ?`;
      q.input = 'choice';
      const opts = new Set([e]);
      [e - 1, e + 1, s + d + 2, s].forEach((x) => {
        if (x >= 1 && x <= 23 && opts.size < 4) opts.add(x);
      });
      q.choices = M.shuffle([...opts]).map((x) => ({ label: `<span class="me-dig">${fmt(x, 0)}</span>`, value: x }));
      q.answer = e;
      q.hint = `Avance de ${d} ${M.plural(d, 'heure')} à partir de ${fmt(s, 0)}.`;
      q.explain = `${fmt(s, 0)} + ${durTxt(d, 'h')} : ${M.range(s + 1, e)
        .map((x) => fmt(x, 0))
        .join(', ')}. ${cap(pr)} finit à <b>${fmt(e, 0)}</b>.`;
      q.viz = (el) => {
        claim(el);
        el.innerHTML = `<div class="viz-hint">Le début et la fin.</div>${twoClocks(false)}<div class="viz-status"></div>`;
      };
    }
    q.showMe = async (el) => {
      const alive = claim(el);
      el.innerHTML = `<div class="viz-hint">La petite aiguille avance d'une heure à la fois.</div><div style="max-width:240px;margin:auto">${clockSvg(s, 0, { size: 240 })}</div><div class="viz-status"></div>`;
      for (let i = 1; i <= d; i++) {
        if (!(await wait(alive, 400))) return;
        const t0 = (s + i - 1) * 60;
        const ok = await tween(alive, 900, (k) => setHands(el, t0 + 60 * k));
        if (!ok) return;
        M.sfx.hop();
        status(el, `${fmt(s + i, 0)} → ${durTxt(i, 'h')}`);
      }
      status(el, `De ${fmt(s, 0)} à ${fmt(e, 0)} : <b>${durTxt(d, 'h')}</b>`);
    };
    return q;
  }
  M.registerSkill({
    id: 'duree',
    domain: D,
    title: 'Les durées',
    icon: '⏳',
    desc: 'Combien de temps ça dure ? Secondes, minutes, heures, jours…',
    pda: 'Mesure — Temps G.1–G.2 : estimer et mesurer des durées; unités de temps',
    learn: 'heure',
    gen: ({ lvl }) => done(durGen(lvl)),
  });
})();
