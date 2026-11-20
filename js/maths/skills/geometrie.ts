/* =====================================================================
   skills/geometrie.js — La géométrie (PFEQ, 1er cycle)
   M.geo : petite bibliothèque de dessins SVG (solides, figures planes,
           lignes, symétrie, frises, plan quadrillé), réutilisée par
           js/learn/geometrie.js
   Les générateurs gen() ne touchent jamais au DOM (seuls viz/showMe).
   ===================================================================== */

/* ------------------------------------------------------------------ types (globaux : fusion avec MApi) */
interface MApi {
  geo: GeoApi;
}
/** Point 2D [x, y]. */
type GeoPt = [number, number];
type GeoVec3 = [number, number, number];
/** Solide dessinable (prisme-tri = prisme triangulaire). */
type GeoSolidKind = 'boule' | 'cone' | 'cube' | 'cylindre' | 'prisme' | 'prisme-tri' | 'pyramide';
/** Catégorie de solide (le prisme triangulaire est un prisme). */
type GeoSolidCat = Exclude<GeoSolidKind, 'prisme-tri'>;
type GeoFigKind = 'carre' | 'rectangle' | 'triangle' | 'losange' | 'cercle' | 'pentagone' | 'hexagone';
/** Les 5 figures du programme (G.FIG5). */
type GeoFig5 = Exclude<GeoFigKind, 'pentagone' | 'hexagone'>;
/** Forme de la base d'un solide. */
type GeoBaseKind = 'cercle' | 'carre' | 'rectangle' | 'triangle';
type GeoTriKind = 'equi' | 'iso' | 'rect' | 'quel';
type GeoLineKind = 'courbe-ouverte' | 'courbe-fermee' | 'brisee-ouverte' | 'brisee-fermee';
/** Axe de symétrie : vertical, horizontal, diagonales \ et /. */
type GeoAxis = 'v' | 'h' | 'd1' | 'd2';
/** Axe dessiné par G.symSvg : voff / hoff = axe décalé (pas un axe de symétrie). */
type GeoAxisArg = GeoAxis | 'voff' | 'hoff' | null;
type GeoSymName =
  | 'papillon'
  | 'coeur'
  | 'maison'
  | 'sapin'
  | 'etoile'
  | 'triangle'
  | 'poisson'
  | 'rectangle'
  | 'losange'
  | 'carre'
  | 'cercle'
  | 'drapeau'
  | 'botte'
  | 'quelconque'
  | 'eclair';
type GeoMotifName = 'drapeau' | 'botte' | 'lettreF' | 'pied';
/** Orientation d'un motif : normal, miroir gauche-droite, à l'envers, demi-tour. */
type GeoOrient = 'n' | 'h' | 'v' | 'r';
interface GeoSolInfo {
  nom: string;
  un: string;
  le: string;
  planes: number;
  courbes: number;
  roule: boolean;
  glisse: boolean;
  empile: boolean;
  faces: number | null;
  base: GeoBaseKind | null;
  color: string;
  long?: string;
}
interface GeoSvgOpts {
  cls?: string;
  width?: number;
  title?: string;
}
interface GeoSolidOpts {
  color?: string;
  size?: number;
  /** Cylindre couché. */
  lie?: boolean;
  /** Prisme triangulaire debout sur sa base. */
  stand?: boolean;
  /** Prisme rectangulaire : [largeur, hauteur, profondeur]. */
  dims?: GeoVec3;
  /** Hauteur de la pyramide. */
  h?: number;
}
/** Face d'un solide dessiné : visible, centre (coordonnées SVG), nom. */
interface GeoFace {
  vis: boolean;
  c: number[];
  name: string;
}
interface GeoSolidData {
  svg: string;
  /** null pour les solides courbes. */
  faces: GeoFace[] | null;
}
/** Objet de tous les jours qui ressemble à un solide (k : dessin précis, ex. prisme-tri). */
interface GeoObj {
  e: string;
  n: string;
  s: GeoSolidCat;
  k?: GeoSolidKind;
}
interface GeoFigInfo {
  nom: string;
  un: string;
  le: string;
  cotes: number;
}
interface GeoFigOpts {
  W?: number;
  H?: number;
  pad?: number;
  /** Rotation (degrés). */
  rot?: number;
  /** Remplissage de la boîte (0–1). */
  fill?: number;
  /** px par unité (remplace fill). */
  unit?: number;
  ratio?: number;
  tri?: GeoTriKind;
  color?: string;
  /** Épaisseur du contour. */
  sw?: number;
  size?: number;
}
interface GeoCountFigOpts extends GeoFigOpts {
  hint?: string;
  onDone?: (sides: number, vertices: number) => void;
}
interface GeoCountCtl {
  /** Compte les côtés (s), les sommets (v) ou les deux. */
  showMe(what?: 'both' | 's' | 'v'): Promise<void> | void;
}
interface GeoSymDef {
  nom: string;
  axes: GeoAxis[];
  draw(c: string): string;
}
interface GeoSymOpts {
  color?: string;
  rot?: number;
  size?: number;
  /** Montre l'image miroir. */
  ghost?: boolean;
  /** Décalage de l'axe voff / hoff. */
  off?: number;
  cls?: string;
}
/** Animal, objet ou élément de plan : emoji, nom avec déterminant (f : nom féminin à élision). */
interface GeoThing {
  e: string;
  n: string;
  f?: boolean;
}
interface GeoApi {
  light(h: string, a: number): string;
  dark(h: string, a: number): string;
  COLORS: string[];
  /** Enveloppe SVG avec une largeur en px. */
  svg(w: number, h: number, inner: string, o?: GeoSvgOpts): string;
  /** Élément SVG (animations dans viz/showMe). */
  svgEl(tag: string, attrs?: Record<string, string | number>, text?: string | number | null): SVGElement;
  SOL: Record<GeoSolidKind, GeoSolInfo>;
  CATS: GeoSolidCat[];
  cat(k: GeoSolidKind): GeoSolidCat;
  solidData(kind: GeoSolidKind, o?: GeoSolidOpts): GeoSolidData;
  solid(kind: GeoSolidKind, o?: GeoSolidOpts): string;
  /** Variante aléatoire d'une catégorie de solide. */
  randSolid(cat: GeoSolidCat, o?: { color?: string; size?: number }): { kind: GeoSolidKind; svg: string };
  OBJ: GeoObj[];
  FIG: Record<GeoFigKind, GeoFigInfo>;
  FIG5: GeoFig5[];
  figPts(kind: GeoFigKind, o?: GeoFigOpts): GeoPt[];
  figure(kind: GeoFigKind, o?: GeoFigOpts): string;
  randFigOpts(kind: GeoFigKind, lvl?: number): GeoFigOpts;
  /** Figure à compter (côtés et sommets touchables). */
  countFig(el: HTMLElement, kind: GeoFigKind, o?: GeoCountFigOpts): GeoCountCtl;
  LIGNES: Record<GeoLineKind, string>;
  lineSvg(kind: GeoLineKind, o?: { color?: string; size?: number }): string;
  SYM: Record<GeoSymName, GeoSymDef>;
  symSvg(name: GeoSymName, axis: GeoAxisArg, o?: GeoSymOpts): string;
  MOTIFS: Record<GeoMotifName, (c: string) => string>;
  motif(name: GeoMotifName, c: string, orient?: GeoOrient, size?: number): string;
  /** Lettres des colonnes du plan quadrillé. */
  COLS: string[];
  /** Nom d'une case : colonne (0 = A), rangée (1 en bas). */
  cell(c: number, r: number): string;
  parseCell(k: string): [number, number];
  /** Plan quadrillé : items = case → html. */
  planHtml(items: Record<string, string>, o?: { n?: number; cls?: string }): string;
  ANIMAUX: GeoThing[];
  /** « du chat », « de la vache » */
  de(x: GeoThing): string;
  PLAN_ITEMS: GeoThing[];
  /** Polyomino (cellules [x, y]). */
  polySvg(cells: number[][], o?: { unit?: number; color?: string }): string;
}

(function () {
  'use strict';
  const M = window.M;
  const G = (M.geo = {} as GeoApi);
  const DOM = 'geometrie';

  /* ------------------------------------------------------------------
     Outils
     ------------------------------------------------------------------ */
  let UID = 0;
  const uid = (p: string): string => 'geo' + p + ++UID;
  const f1 = (n: number): number => Math.round(n * 10) / 10;
  const pt = (p: readonly number[]): string => f1(p[0]) + ',' + f1(p[1]);
  const pick = M.pick,
    rnd = M.rnd,
    shuffle = M.shuffle;
  const alive = (el: Element | null | undefined): boolean => !!(el && el.isConnected);
  /** Clés d'un objet, avec leur type littéral. */
  const keysOf = <K extends string>(o: Record<K, unknown>): K[] => Object.keys(o) as K[];

  function hex2rgb(h: string): number[] {
    h = h.replace('#', '');
    if (h.length === 3)
      h = h
        .split('')
        .map((c) => c + c)
        .join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(h: string, t: string, a: number): string {
    const c = hex2rgb(h),
      d = hex2rgb(t);
    return (
      '#' +
      c
        .map((v, i) =>
          Math.round(v + (d[i] - v) * a)
            .toString(16)
            .padStart(2, '0'),
        )
        .join('')
    );
  }
  G.light = (h, a) => mix(h, '#ffffff', a);
  G.dark = (h, a) => mix(h, '#000000', a);
  G.COLORS = ['#ef476f', '#f78c40', '#f4b400', '#06a77d', '#118ab2', '#9b5de5', '#e76f51', '#2a9d8f'];

  /** Enveloppe SVG avec une largeur en px (réduite par max-width:100% si besoin). */
  G.svg = (w, h, inner, o = {}) =>
    `<svg class="geo-svg ${o.cls || ''}" viewBox="0 0 ${w} ${h}" width="${o.width || w}" xmlns="http://www.w3.org/2000/svg" role="img"${o.title ? ` aria-label="${M.esc(o.title)}"` : ''}>${inner}</svg>`;

  /** Crée un élément SVG (pour les animations dans viz/showMe). */
  G.svgEl = function (tag, attrs, text) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    const a = attrs || {};
    Object.keys(a).forEach((k) => e.setAttribute(k, String(a[k])));
    if (text != null) e.textContent = String(text);
    return e;
  };

  /* vecteurs 3D */
  const sub = (a: readonly number[], b: readonly number[]): GeoVec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a: readonly number[], b: readonly number[]): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a: readonly number[], b: readonly number[]): GeoVec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const norm = (a: readonly number[]): GeoVec3 => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  };
  const avg = (pts: readonly (readonly number[])[]): number[] => {
    const n = pts.length,
      s = pts[0].map(() => 0);
    pts.forEach((p) => p.forEach((v, i) => (s[i] += v / n)));
    return s;
  };

  /* ------------------------------------------------------------------
     SOLIDES — perspective cavalière (X droite, Y haut, Z vers nous)
     ------------------------------------------------------------------ */
  const KX = 0.5,
    KY = 0.36;
  const VIEW: GeoVec3 = [KX, KY, 1];
  const LIGHT = norm([-0.35, 0.85, 0.5]);
  const proj = (p: readonly number[]): GeoPt => [p[0] - p[2] * KX, -p[1] + p[2] * KY];

  /** Polyèdre : sommets 3D, faces (indices des sommets), noms des faces. */
  interface PolyDef {
    V: GeoVec3[];
    F: number[][];
    names: string[];
  }
  interface PolyFace {
    f: number[];
    n: number[];
    vis: boolean;
    c: number[];
    name: string;
  }
  function box(w: number, h: number, d: number): PolyDef {
    return {
      V: [
        [0, 0, 0],
        [w, 0, 0],
        [w, h, 0],
        [0, h, 0],
        [0, 0, -d],
        [w, 0, -d],
        [w, h, -d],
        [0, h, -d],
      ],
      F: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [3, 2, 6, 7],
        [0, 1, 5, 4],
        [0, 3, 7, 4],
        [1, 2, 6, 5],
      ],
      names: ['devant', 'derrière', 'dessus', 'dessous', 'gauche', 'droite'],
    };
  }
  /** Polygone dans le plan XY (face avant), allongé vers l'arrière. */
  function prismZ(poly: GeoPt[], d: number, names: string[]): PolyDef {
    const n = poly.length;
    const V = poly.map(([x, y]): GeoVec3 => [x, y, 0]).concat(poly.map(([x, y]): GeoVec3 => [x, y, -d]));
    const F = [M.range(0, n - 1), M.range(n, 2 * n - 1)];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      F.push([i, j, n + j, n + i]);
    }
    return { V, F, names };
  }
  /** Polygone posé au sol (points [x, z]), monté vers le haut. */
  function prismY(poly: GeoPt[], h: number, names: string[]): PolyDef {
    const n = poly.length;
    const V = poly.map(([x, z]): GeoVec3 => [x, 0, z]).concat(poly.map(([x, z]): GeoVec3 => [x, h, z]));
    const F = [M.range(0, n - 1), M.range(n, 2 * n - 1)];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      F.push([i, j, n + j, n + i]);
    }
    return { V, F, names };
  }
  function pyramid(w: number, h: number): PolyDef {
    return {
      V: [
        [0, 0, 0],
        [w, 0, 0],
        [w, 0, -w],
        [0, 0, -w],
        [w / 2, h, -w / 2],
      ],
      F: [
        [0, 1, 2, 3],
        [0, 1, 4],
        [1, 2, 4],
        [2, 3, 4],
        [3, 0, 4],
      ],
      names: ['la base (dessous)', 'devant', 'droite', 'derrière', 'gauche'],
    };
  }

  function renderPoly(
    def: PolyDef,
    o: { W?: number; H?: number; pad?: number; color: string; hidden?: boolean },
  ): { inner: string; faces: PolyFace[] } {
    const W = o.W || 120,
      H = o.H || 120,
      pad = o.pad == null ? 8 : o.pad,
      c = o.color;
    const V = def.V,
      cen = avg(V),
      P = V.map(proj);
    let x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;
    P.forEach(([x, y]) => {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    });
    const s = Math.min((W - 2 * pad) / (x1 - x0), (H - 2 * pad) / (y1 - y0));
    const ox = (W - (x1 - x0) * s) / 2 - x0 * s,
      oy = (H - (y1 - y0) * s) / 2 - y0 * s;
    const Q = P.map((p) => [p[0] * s + ox, p[1] * s + oy]);
    const faces = def.F.map((f, fi): PolyFace => {
      let n: number[] = norm(cross(sub(V[f[1]], V[f[0]]), sub(V[f[2]], V[f[0]])));
      if (dot(n, sub(avg(f.map((i) => V[i])), cen)) < 0) n = n.map((x) => -x);
      return { f, n, vis: dot(n, VIEW) > 1e-6, c: avg(f.map((i) => Q[i])), name: def.names ? def.names[fi] : '' };
    });
    const E = new Map<string, { a: number; b: number; fs: number[] }>();
    faces.forEach((fa, fi) =>
      fa.f.forEach((v, k) => {
        const w = fa.f[(k + 1) % fa.f.length],
          a = Math.min(v, w),
          b = Math.max(v, w),
          key = a + '-' + b;
        if (!E.has(key)) E.set(key, { a, b, fs: [] });
        E.get(key)!.fs.push(fi);
      }),
    );
    const edges = [...E.values()].map((e) => ({ ...e, vis: e.fs.some((fi) => faces[fi].vis) }));
    const st = G.dark(c, 0.45);
    const line = (e: { a: number; b: number }, extra: string): string =>
      `<line x1="${f1(Q[e.a][0])}" y1="${f1(Q[e.a][1])}" x2="${f1(Q[e.b][0])}" y2="${f1(Q[e.b][1])}" stroke="${st}" ${extra}/>`;
    let out = '';
    faces.forEach((fa, fi) => {
      if (!fa.vis) return;
      const t = dot(fa.n, LIGHT) - 0.45;
      const fill = t > 0 ? G.light(c, t * 0.6) : G.dark(c, -t * 0.3);
      out += `<polygon data-f="${fi}" points="${fa.f.map((i) => pt(Q[i])).join(' ')}" fill="${fill}"/>`;
    });
    if (o.hidden !== false)
      edges.filter((e) => !e.vis).forEach((e) => (out += line(e, 'stroke-width="1.7" stroke-dasharray="5 4" opacity=".75"')));
    edges.filter((e) => e.vis).forEach((e) => (out += line(e, 'stroke-width="2.6" stroke-linecap="round"')));
    return { inner: out, faces };
  }

  function boule(c: string): string {
    const g = uid('g'),
      st = G.dark(c, 0.45);
    return `<defs><radialGradient id="${g}" cx=".36" cy=".32" r=".72"><stop offset="0" stop-color="${G.light(c, 0.75)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${G.dark(c, 0.35)}"/></radialGradient></defs>
      <circle cx="60" cy="60" r="48" fill="url(#${g})" stroke="${st}" stroke-width="2.6"/>
      <path d="M12,60 A48 14 0 0 1 108,60" fill="none" stroke="${st}" stroke-width="1.6" stroke-dasharray="5 4" opacity=".6"/>
      <path d="M12,60 A48 14 0 0 0 108,60" fill="none" stroke="${st}" stroke-width="1.6" opacity=".5"/>`;
  }
  function cylindre(c: string, lie?: boolean): string {
    const g = uid('g'),
      st = G.dark(c, 0.45);
    const inner = `<defs><linearGradient id="${g}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${G.dark(c, 0.15)}"/><stop offset=".32" stop-color="${G.light(c, 0.4)}"/><stop offset=".75" stop-color="${c}"/><stop offset="1" stop-color="${G.dark(c, 0.3)}"/></linearGradient></defs>
      <path d="M26,24 L26,96 A34 11 0 0 0 94,96 L94,24 Z" fill="url(#${g})" stroke="${st}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M26,96 A34 11 0 0 1 94,96" fill="none" stroke="${st}" stroke-width="1.7" stroke-dasharray="5 4" opacity=".75"/>
      <ellipse cx="60" cy="24" rx="34" ry="11" fill="${G.light(c, 0.45)}" stroke="${st}" stroke-width="2.6"/>`;
    return lie ? `<g transform="rotate(90 60 60)">${inner}</g>` : inner;
  }
  function cone(c: string): string {
    const g = uid('g'),
      st = G.dark(c, 0.45);
    return `<defs><linearGradient id="${g}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${G.dark(c, 0.12)}"/><stop offset=".35" stop-color="${G.light(c, 0.42)}"/><stop offset=".75" stop-color="${c}"/><stop offset="1" stop-color="${G.dark(c, 0.3)}"/></linearGradient></defs>
      <path d="M60,12 L22,96 A38 12 0 0 0 98,96 Z" fill="url(#${g})" stroke="${st}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M22,96 A38 12 0 0 1 98,96" fill="none" stroke="${st}" stroke-width="1.7" stroke-dasharray="5 4" opacity=".75"/>`;
  }

  /** Données des solides. Catégorie « prisme » = prisme rectangulaire ou triangulaire. */
  G.SOL = {
    boule: {
      nom: 'boule',
      un: 'une boule',
      le: 'la boule',
      planes: 0,
      courbes: 1,
      roule: true,
      glisse: false,
      empile: false,
      faces: null,
      base: null,
      color: '#ef476f',
    },
    cone: {
      nom: 'cône',
      un: 'un cône',
      le: 'le cône',
      planes: 1,
      courbes: 1,
      roule: true,
      glisse: true,
      empile: false,
      faces: null,
      base: 'cercle',
      color: '#f78c40',
    },
    cube: {
      nom: 'cube',
      un: 'un cube',
      le: 'le cube',
      planes: 6,
      courbes: 0,
      roule: false,
      glisse: true,
      empile: true,
      faces: 6,
      base: 'carre',
      color: '#06a77d',
    },
    cylindre: {
      nom: 'cylindre',
      un: 'un cylindre',
      le: 'le cylindre',
      planes: 2,
      courbes: 1,
      roule: true,
      glisse: true,
      empile: true,
      faces: null,
      base: 'cercle',
      color: '#118ab2',
    },
    prisme: {
      nom: 'prisme',
      un: 'un prisme',
      le: 'le prisme',
      planes: 6,
      courbes: 0,
      roule: false,
      glisse: true,
      empile: true,
      faces: 6,
      base: 'rectangle',
      color: '#9b5de5',
      long: 'prisme rectangulaire',
    },
    'prisme-tri': {
      nom: 'prisme',
      un: 'un prisme',
      le: 'le prisme',
      planes: 5,
      courbes: 0,
      roule: false,
      glisse: true,
      empile: true,
      faces: 5,
      base: 'triangle',
      color: '#2a9d8f',
      long: 'prisme triangulaire',
    },
    pyramide: {
      nom: 'pyramide',
      un: 'une pyramide',
      le: 'la pyramide',
      planes: 5,
      courbes: 0,
      roule: false,
      glisse: true,
      empile: false,
      faces: 5,
      base: 'carre',
      color: '#f4b400',
      long: 'pyramide à base carrée',
    },
  };
  G.CATS = ['boule', 'cone', 'cube', 'cylindre', 'prisme', 'pyramide'];
  G.cat = (k) => (k === 'prisme-tri' ? 'prisme' : k);

  /**
   * Dessine un solide. kind : boule | cone | cube | cylindre | prisme | prisme-tri | pyramide
   * o : { color, size, lie (cylindre couché), stand (prisme triangulaire debout sur sa base), dims:[w,h,d] }
   * Retourne { svg, faces } (faces = null pour les solides courbes).
   */
  G.solidData = function (kind, o = {}) {
    const c = o.color || G.SOL[kind].color;
    let inner: string,
      faces: GeoFace[] | null = null;
    if (kind === 'boule') inner = boule(c);
    else if (kind === 'cone') inner = cone(c);
    else if (kind === 'cylindre') inner = cylindre(c, o.lie);
    else {
      let def: PolyDef;
      if (kind === 'cube') def = box(1, 1, 1);
      else if (kind === 'prisme') {
        const d = o.dims || [1.8, 0.85, 0.9];
        def = box(d[0], d[1], d[2]);
      } else if (kind === 'prisme-tri') {
        def = o.stand
          ? prismY(
              [
                [0.2, 0],
                [1.4, -0.4],
                [0, -1.3],
              ],
              0.8,
              ['la base (dessous)', 'dessus', 'devant', 'derrière', 'côté gauche'],
            )
          : prismZ(
              [
                [0, 0],
                [1.2, 0],
                [0.6, 0.9],
              ],
              1.0,
              ['triangle devant', 'triangle derrière', 'dessous', 'côté droit', 'côté gauche'],
            );
      } else def = pyramid(1, o.h || 1.05);
      const r = renderPoly(def, { color: c });
      inner = r.inner;
      faces = r.faces.map((f) => ({ vis: f.vis, c: f.c, name: f.name }));
    }
    return { svg: G.svg(120, 120, inner, { width: o.size || 120, title: G.SOL[kind].nom }), faces };
  };
  G.solid = (kind, o) => G.solidData(kind, o).svg;
  /** Variante aléatoire (dimensions, couleur) d'une catégorie de solide. */
  G.randSolid = function (cat, o = {}) {
    const kind: GeoSolidKind = cat === 'prisme' ? pick<GeoSolidKind>(['prisme', 'prisme', 'prisme-tri']) : cat;
    const opt: GeoSolidOpts = { color: o.color || (Math.random() < 0.5 ? G.SOL[kind].color : pick(G.COLORS)), size: o.size };
    if (kind === 'prisme')
      opt.dims = pick<GeoVec3>([
        [1.8, 0.85, 0.9],
        [0.9, 1.7, 0.8],
        [1.6, 0.6, 1.3],
        [2, 1, 0.7],
      ]);
    if (kind === 'cylindre') opt.lie = Math.random() < 0.3;
    if (kind === 'prisme-tri') opt.stand = Math.random() < 0.4;
    if (kind === 'pyramide') opt.h = pick([0.9, 1.05, 1.3]);
    return { kind, svg: G.solid(kind, opt) };
  };

  /** Objets de tous les jours (emoji) → solide auquel ils ressemblent. */
  G.OBJ = [
    { e: '⚽', n: 'un ballon de soccer', s: 'boule' },
    { e: '🏀', n: 'un ballon de basketball', s: 'boule' },
    { e: '🍊', n: 'une orange', s: 'boule' },
    { e: '🎱', n: 'une boule de billard', s: 'boule' },
    { e: '🍦', n: 'un cornet de crème glacée', s: 'cone' },
    { e: '🥕', n: 'une carotte', s: 'cone' },
    { e: '🎲', n: 'un dé', s: 'cube' },
    { e: '🧊', n: 'un glaçon', s: 'cube' },
    { e: '🥫', n: 'une boîte de conserve', s: 'cylindre' },
    { e: '🔋', n: 'une pile', s: 'cylindre' },
    { e: '🧻', n: 'un rouleau de papier', s: 'cylindre' },
    { e: '🥁', n: 'un tambour', s: 'cylindre' },
    { e: '📦', n: 'une boîte de carton', s: 'prisme' },
    { e: '🧱', n: 'une brique', s: 'prisme' },
    { e: '🧈', n: 'un bloc de beurre', s: 'prisme' },
    { e: '⛺', n: 'une tente', s: 'prisme', k: 'prisme-tri' },
  ];

  /* ------------------------------------------------------------------
     FIGURES PLANES
     ------------------------------------------------------------------ */
  G.FIG = {
    carre: { nom: 'carré', un: 'un carré', le: 'le carré', cotes: 4 },
    rectangle: { nom: 'rectangle', un: 'un rectangle', le: 'le rectangle', cotes: 4 },
    triangle: { nom: 'triangle', un: 'un triangle', le: 'le triangle', cotes: 3 },
    losange: { nom: 'losange', un: 'un losange', le: 'le losange', cotes: 4 },
    cercle: { nom: 'cercle', un: 'un cercle', le: 'le cercle', cotes: 0 },
    pentagone: { nom: 'pentagone', un: 'un pentagone', le: 'le pentagone', cotes: 5 },
    hexagone: { nom: 'hexagone', un: 'un hexagone', le: "l'hexagone", cotes: 6 },
  };
  G.FIG5 = ['carre', 'rectangle', 'triangle', 'losange', 'cercle'];
  const TRI: Record<GeoTriKind, GeoPt[]> = {
    equi: [
      [0, -0.577],
      [0.5, 0.289],
      [-0.5, 0.289],
    ],
    iso: [
      [0, -0.75],
      [0.4, 0.45],
      [-0.4, 0.45],
    ],
    rect: [
      [-0.5, -0.45],
      [-0.5, 0.45],
      [0.6, 0.45],
    ],
    quel: [
      [-0.7, 0.35],
      [0.7, 0.35],
      [-0.25, -0.35],
    ],
  };
  function basePts(kind: GeoFigKind, o: GeoFigOpts): GeoPt[] {
    if (kind === 'carre')
      return [
        [-0.5, -0.5],
        [0.5, -0.5],
        [0.5, 0.5],
        [-0.5, 0.5],
      ];
    if (kind === 'rectangle') {
      const a = o.ratio || 1.8;
      return [
        [-a / 2, -0.5],
        [a / 2, -0.5],
        [a / 2, 0.5],
        [-a / 2, 0.5],
      ];
    }
    if (kind === 'losange') {
      const p = o.ratio || 1.75;
      return [
        [0, -0.5],
        [p / 2, 0],
        [0, 0.5],
        [-p / 2, 0],
      ];
    }
    if (kind === 'triangle') return TRI[o.tri || 'equi'];
    const n = kind === 'pentagone' ? 5 : 6;
    return M.range(0, n - 1).map((i): GeoPt => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [0.5 * Math.cos(a), 0.5 * Math.sin(a)];
    });
  }
  /** Points (coordonnées SVG) d'une figure : o = { W, H, pad, rot, fill (0–1), unit (px/unité), ratio, tri } */
  G.figPts = function (kind, o = {}) {
    const W = o.W || 120,
      H = o.H || 120,
      pad = o.pad == null ? 8 : o.pad;
    const a = ((o.rot || 0) * Math.PI) / 180,
      cs = Math.cos(a),
      sn = Math.sin(a);
    const p = basePts(kind, o).map(([x, y]): GeoPt => [x * cs - y * sn, x * sn + y * cs]);
    let x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;
    p.forEach(([x, y]) => {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    });
    const s = o.unit || Math.min((W - 2 * pad) / (x1 - x0), (H - 2 * pad) / (y1 - y0)) * (o.fill || 1);
    const cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2;
    return p.map(([x, y]): GeoPt => [W / 2 + (x - cx) * s, H / 2 + (y - cy) * s]);
  };
  /** SVG d'une figure plane. */
  G.figure = function (kind, o = {}) {
    const W = o.W || 120,
      H = o.H || 120,
      c = o.color || '#118ab2',
      pad = o.pad == null ? 8 : o.pad;
    const sty = `fill="${G.light(c, 0.25)}" stroke="${G.dark(c, 0.25)}" stroke-width="${o.sw || 3.5}" stroke-linejoin="round"`;
    let inner: string;
    if (kind === 'cercle') inner = `<circle cx="${W / 2}" cy="${H / 2}" r="${f1((Math.min(W, H) / 2 - pad) * (o.fill || 1))}" ${sty}/>`;
    else inner = `<polygon points="${G.figPts(kind, o).map(pt).join(' ')}" ${sty}/>`;
    return G.svg(W, H, inner, { width: o.size || W, title: G.FIG[kind].nom });
  };
  /** Options aléatoires (orientation, proportions, grandeur) pour une figure. */
  G.randFigOpts = function (kind, lvl = 1) {
    const o: GeoFigOpts = { color: pick(G.COLORS), fill: 0.62 + Math.random() * 0.38 };
    if (kind === 'carre') o.rot = lvl === 0 ? pick([0, 0, 15]) : pick([0, 15, 30, 45, -20]);
    if (kind === 'rectangle') {
      o.ratio = 1.5 + Math.random() * 0.8;
      o.rot = lvl === 0 ? pick([0, 90]) : pick([0, 90, 25, -30, 60]);
    }
    if (kind === 'losange') {
      o.ratio = 1.6 + Math.random() * 0.6;
      o.rot = lvl === 0 ? pick([0, 90]) : pick([0, 90, 12, -12]);
    }
    if (kind === 'triangle') {
      o.tri = lvl === 0 ? pick(['equi', 'iso']) : pick(['equi', 'iso', 'rect', 'quel']);
      o.rot = lvl === 0 ? pick([0, 180]) : rnd(0, 359);
    }
    if (kind === 'pentagone' || kind === 'hexagone') o.rot = pick([0, 15, 30]);
    return o;
  };

  /**
   * Figure à compter : l'enfant touche chaque côté et chaque sommet.
   * o : options de G.figPts + { color, hint, onDone(sides, vertices) }. Retourne { showMe }.
   */
  G.countFig = function (el, kind, o = {}) {
    const W = 240,
      H = 190,
      c = o.color || '#118ab2',
      stc = G.dark(c, 0.3);
    if (kind === 'cercle') {
      el.innerHTML = `<div class="viz-hint">${o.hint || 'Le cercle'}</div>${G.svg(W, H, `<circle cx="120" cy="95" r="72" fill="${G.light(c, 0.25)}" stroke="${stc}" stroke-width="5"/>`, { cls: 'geo-count', width: 240 })}
        <div class="viz-status">Le cercle est une ligne courbe fermée : <b>0 côté</b> droit et <b>0 sommet</b>.</div>`;
      return { showMe() {} };
    }
    const P = G.figPts(kind, { ...o, W, H, pad: 30, fill: 1 });
    const n = P.length,
      ctr = avg(P);
    let h = `<polygon points="${P.map(pt).join(' ')}" fill="${G.light(c, 0.25)}"/>`;
    P.forEach((a, i) => {
      const b = P[(i + 1) % n];
      h += `<g class="geo-side" data-k="${i}"><line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="transparent" stroke-width="26"/><line class="geo-side-ln" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${stc}" stroke-width="6" stroke-linecap="round"/></g>`;
    });
    P.forEach((a, i) => {
      h += `<g class="geo-vtx" data-k="${i}"><circle cx="${f1(a[0])}" cy="${f1(a[1])}" r="15" fill="transparent"/><circle class="geo-vtx-dot" cx="${f1(a[0])}" cy="${f1(a[1])}" r="7" fill="#fff" stroke="${stc}" stroke-width="3"/></g>`;
    });
    h += '<g class="geo-lbls"></g>';
    el.innerHTML = `<div class="viz-hint">${o.hint || 'Touche chaque <b>côté</b>, puis chaque <b>sommet</b> (coin) pour les compter.'}</div>${G.svg(W, H, h, { cls: 'geo-count', width: 240 })}<div class="viz-status"></div>`;
    // éléments qu'on vient de rendre
    const svg = M.$('svg', el)!,
      lbls = M.$('.geo-lbls', el)!,
      status = M.$('.viz-status', el)!;
    const sOn = new Set<number>(),
      vOn = new Set<number>();
    const out = (p: readonly number[], d: number): GeoPt => {
      const v = [p[0] - ctr[0], p[1] - ctr[1]],
        l = Math.hypot(v[0], v[1]) || 1;
      return [p[0] + (v[0] / l) * d, p[1] + (v[1] / l) * d];
    };
    function redraw() {
      lbls.innerHTML = '';
      let k = 0;
      [...sOn].forEach((i) => {
        const a = P[i],
          b = P[(i + 1) % n],
          m = out([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], 17);
        lbls.appendChild(G.svgEl('text', { x: f1(m[0]), y: f1(m[1]) + 6, class: 'geo-lbl s' }, ++k));
      });
      k = 0;
      [...vOn].forEach((i) => {
        const m = out(P[i], 22);
        lbls.appendChild(G.svgEl('text', { x: f1(m[0]), y: f1(m[1]) + 6, class: 'geo-lbl v' }, String.fromCharCode(65 + k++)));
      });
      M.$$<SVGGElement>('.geo-side', svg).forEach((g) => g.classList.toggle('on', sOn.has(Number(g.dataset.k))));
      M.$$<SVGGElement>('.geo-vtx', svg).forEach((g) => g.classList.toggle('on', vOn.has(Number(g.dataset.k))));
      status.innerHTML = `Côtés : <b>${sOn.size}</b> · Sommets : <b>${vOn.size}</b>` + (sOn.size === n && vOn.size === n ? ' 🎉' : '');
      if (sOn.size === n && vOn.size === n && o.onDone) o.onDone(n, n);
    }
    svg.addEventListener('click', (e) => {
      const v = M.closest<SVGGElement>(e, '.geo-vtx'),
        s = M.closest<SVGGElement>(e, '.geo-side');
      if (v) {
        const k = Number(v.dataset.k);
        if (vOn.has(k)) vOn.delete(k);
        else vOn.add(k);
        M.sfx.pop();
      } else if (s) {
        const k = Number(s.dataset.k);
        if (sOn.has(k)) sOn.delete(k);
        else sOn.add(k);
        M.sfx.tap();
      } else return;
      redraw();
    });
    redraw();
    let tok = 0;
    return {
      async showMe(what: 'both' | 's' | 'v' = 'both') {
        const my = ++tok;
        sOn.clear();
        vOn.clear();
        redraw();
        if (what !== 'v')
          for (let i = 0; i < n; i++) {
            await M.sleep(550);
            if (!alive(svg) || my !== tok) return;
            sOn.add(i);
            M.sfx.tap();
            redraw();
          }
        if (what !== 's')
          for (let i = 0; i < n; i++) {
            await M.sleep(550);
            if (!alive(svg) || my !== tok) return;
            vOn.add(i);
            M.sfx.pop();
            redraw();
          }
      },
    };
  };

  /* ------------------------------------------------------------------
     LIGNES : courbe / brisée, ouverte / fermée
     ------------------------------------------------------------------ */
  G.LIGNES = {
    'courbe-ouverte': 'ligne courbe ouverte',
    'courbe-fermee': 'ligne courbe fermée',
    'brisee-ouverte': 'ligne brisée ouverte',
    'brisee-fermee': 'ligne brisée fermée',
  };
  function smoothPath(P: readonly GeoPt[], closed: boolean): string {
    const n = P.length,
      get = (i: number): GeoPt => (closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]);
    let d = 'M' + pt(P[0]);
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = get(i - 1),
        p1 = get(i),
        p2 = get(i + 1),
        p3 = get(i + 2);
      d += ` C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
    }
    return d + (closed ? 'Z' : '');
  }
  function ringPts(n: number, cx: number, cy: number, rx: number, ry: number, jit: number): GeoPt[] {
    const a0 = Math.random() * Math.PI * 2;
    return M.range(0, n - 1).map((i): GeoPt => {
      const a = a0 + (i * 2 * Math.PI) / n + (Math.random() - 0.5) * 0.5,
        r = 1 - Math.random() * jit;
      return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
    });
  }
  /** SVG d'une ligne (aléatoire) du type demandé. o = { color, size } */
  G.lineSvg = function (kind, o = {}) {
    const c = o.color || '#2b2d42',
      W = 140,
      H = 100;
    let d: string,
      ends: GeoPt[] | null = null;
    if (kind === 'courbe-fermee') d = smoothPath(ringPts(rnd(5, 7), 70, 50, 52, 36, 0.35), true);
    else if (kind === 'brisee-fermee') {
      const P = ringPts(rnd(4, 7), 70, 50, 54, 38, 0.4);
      d = 'M' + P.map(pt).join(' L') + 'Z';
    } else {
      let P: GeoPt[];
      if (Math.random() < 0.6) {
        const n = kind === 'courbe-ouverte' ? rnd(4, 5) : rnd(4, 6),
          up = Math.random() < 0.5;
        P = M.range(0, n - 1).map((i): GeoPt => [14 + (i * 112) / (n - 1), (i % 2 === 0) === up ? rnd(14, 36) : rnd(64, 86)]);
      } else {
        // forme en « C » ou en « U » : les deux bouts restent bien séparés
        const a0 = pick([0.25, 0.75, 1.25]) * Math.PI,
          n = kind === 'courbe-ouverte' ? 6 : rnd(4, 5);
        P = M.range(0, n - 1).map((i): GeoPt => {
          const a = a0 + (i / (n - 1)) * 1.45 * Math.PI;
          return [70 + Math.cos(a) * 52, 50 + Math.sin(a) * 38];
        });
      }
      d = kind === 'courbe-ouverte' ? smoothPath(P, false) : 'M' + P.map(pt).join(' L');
      ends = [P[0], P[P.length - 1]];
    }
    let inner = `<path d="${d}" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (ends) inner += ends.map((p) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="5.5" fill="${c}"/>`).join('');
    return G.svg(W, H, inner, { width: o.size || 130, title: G.LIGNES[kind] });
  };

  /* ------------------------------------------------------------------
     SYMÉTRIE : figures dans une boîte 120×120, centrées en (60, 60)
     axes : v (vertical), h (horizontal), d1 (\), d2 (/)
     ------------------------------------------------------------------ */
  const half = (inner: string): string => inner + `<g transform="translate(120,0) scale(-1,1)">${inner}</g>`;
  const S = (c: string, w = 2.5): string => `fill="${c}" stroke="${G.dark(c, 0.35)}" stroke-width="${w}" stroke-linejoin="round"`;
  function starPts(cx: number, cy: number, R: number, r: number): GeoPt[] {
    return M.range(0, 9).map((i): GeoPt => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        q = i % 2 ? r : R;
      return [cx + Math.cos(a) * q, cy + Math.sin(a) * q];
    });
  }
  G.SYM = {
    papillon: {
      nom: 'le papillon',
      axes: ['v'],
      draw: (c) =>
        half(
          `<path d="M58,56 C44,22 12,12 13,38 C14,55 36,60 58,62 Z" ${S(c)}/><path d="M58,64 C40,64 22,76 29,93 C36,104 52,90 58,72 Z" ${S(G.light(c, 0.35))}/><circle cx="33" cy="38" r="6" fill="#fff" opacity=".85"/><path d="M59,32 C55,20 49,14 43,12" fill="none" stroke="#5a4636" stroke-width="2.5" stroke-linecap="round"/>`,
        ) + `<ellipse cx="60" cy="62" rx="4.5" ry="30" fill="#5a4636"/>`,
    },
    coeur: {
      nom: 'le cœur',
      axes: ['v'],
      draw: (c) => `<path d="M60,102 C20,72 8,46 28,30 C44,18 58,28 60,42 C62,28 76,18 92,30 C112,46 100,72 60,102 Z" ${S(c, 3)}/>`,
    },
    maison: {
      nom: 'la maison',
      axes: ['v'],
      draw: (c) =>
        `<rect x="30" y="56" width="60" height="46" ${S('#ffd166')}/><polygon points="20,60 60,20 100,60" ${S(c)}/><rect x="52" y="76" width="16" height="26" ${S('#8d5b3a')}/><rect x="35" y="64" width="12" height="12" ${S('#8fd0e6', 2)}/><rect x="73" y="64" width="12" height="12" ${S('#8fd0e6', 2)}/>`,
    },
    sapin: {
      nom: 'le sapin',
      axes: ['v'],
      draw: (c) =>
        `<rect x="53" y="86" width="14" height="22" ${S('#8d5b3a')}/><polygon points="60,32 98,88 22,88" ${S(c)}/><polygon points="60,10 88,56 32,56" ${S(G.light(c, 0.2))}/>`,
    },
    etoile: { nom: "l'étoile", axes: ['v'], draw: (c) => `<polygon points="${starPts(60, 63, 50, 21).map(pt).join(' ')}" ${S(c, 3)}/>` },
    triangle: { nom: 'le triangle', axes: ['v'], draw: (c) => `<polygon points="60,16 98,100 22,100" ${S(c, 3)}/>` },
    poisson: {
      nom: 'le poisson',
      axes: ['h'],
      draw: (c) =>
        `<polygon points="16,60 4,40 4,80" ${S(G.dark(c, 0.1))}/><ellipse cx="62" cy="60" rx="46" ry="26" ${S(c, 3)}/><circle cx="90" cy="60" r="5" fill="#2b2d42"/><path d="M48,44 Q56,60 48,76" fill="none" stroke="${G.dark(c, 0.35)}" stroke-width="2.5"/>`,
    },
    rectangle: { nom: 'le rectangle', axes: ['v', 'h'], draw: (c) => `<rect x="16" y="36" width="88" height="48" ${S(c, 3)}/>` },
    losange: { nom: 'le losange', axes: ['v', 'h'], draw: (c) => `<polygon points="60,10 90,60 60,110 30,60" ${S(c, 3)}/>` },
    carre: { nom: 'le carré', axes: ['v', 'h', 'd1', 'd2'], draw: (c) => `<rect x="25" y="25" width="70" height="70" ${S(c, 3)}/>` },
    cercle: { nom: 'le cercle', axes: ['v', 'h', 'd1', 'd2'], draw: (c) => `<circle cx="60" cy="60" r="42" ${S(c, 3)}/>` },
    drapeau: {
      nom: 'le drapeau',
      axes: [],
      draw: (c) => `<rect x="30" y="12" width="7" height="96" rx="2" fill="#5a4636"/><polygon points="37,14 100,32 37,54" ${S(c, 3)}/>`,
    },
    botte: { nom: 'la botte', axes: [], draw: (c) => `<polygon points="34,12 62,12 62,72 100,72 100,104 34,104" ${S(c, 3)}/>` },
    quelconque: { nom: 'le triangle', axes: [], draw: (c) => `<polygon points="14,98 106,98 36,20" ${S(c, 3)}/>` },
    eclair: { nom: "l'éclair", axes: [], draw: (c) => `<polygon points="54,6 26,64 54,64 40,114 96,46 66,46 84,6" ${S(c, 3)}/>` },
  };
  const AXIS_LINE: Record<GeoAxis, number[]> = { v: [60, 2, 60, 118], h: [2, 60, 118, 60], d1: [6, 6, 114, 114], d2: [114, 6, 6, 114] };
  const REFLECT: Record<GeoAxis, string> = {
    v: 'translate(120,0) scale(-1,1)',
    h: 'translate(0,120) scale(1,-1)',
    d1: 'matrix(0,1,1,0,0,0)',
    d2: 'matrix(0,-1,-1,0,120,120)',
  };
  /**
   * Figure + axe pointillé. axis : v | h | d1 | d2 | voff (vertical décalé) | hoff | null.
   * o = { color, rot (0 ou 90), size, ghost (montre l'image miroir) }
   */
  G.symSvg = function (name, axis, o = {}) {
    const f = G.SYM[name],
      c = o.color || '#118ab2';
    const fig = f.draw(c);
    let ax = '',
      ghost = '';
    if (axis) {
      const off = o.off || 24;
      const L: number[] = axis === 'voff' ? [60 + off, 2, 60 + off, 118] : axis === 'hoff' ? [2, 60 + off, 118, 60 + off] : AXIS_LINE[axis];
      ax = `<line x1="${L[0]}" y1="${L[1]}" x2="${L[2]}" y2="${L[3]}" stroke="#d62828" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round"/>`;
      if (o.ghost) {
        const tr =
          axis === 'voff'
            ? `translate(${120 + 2 * off},0) scale(-1,1)`
            : axis === 'hoff'
              ? `translate(0,${120 + 2 * off}) scale(1,-1)`
              : REFLECT[axis];
        ghost = `<g class="geo-ghost"><g transform="${tr}" opacity=".55">${fig}</g></g>`;
      }
    }
    const inner = `<g transform="rotate(${o.rot || 0} 60 60)">${fig}${ghost}${ax}</g>`;
    return G.svg(120, 120, inner, { width: o.size || 120, cls: o.cls, title: f.nom });
  };

  /* ------------------------------------------------------------------
     FRISES : motifs sans symétrie dans une boîte 40×40
     orientations : n (normal), h (miroir gauche-droite), v (à l'envers), r (demi-tour)
     ------------------------------------------------------------------ */
  G.MOTIFS = {
    drapeau: (c) =>
      `<rect x="8" y="4" width="4" height="33" rx="1.5" fill="#5a4636"/><polygon points="12,5 34,12 12,20" fill="${c}" stroke="${G.dark(c, 0.3)}" stroke-width="1.5" stroke-linejoin="round"/>`,
    botte: (c) =>
      `<polygon points="9,4 20,4 20,25 35,25 35,36 9,36" fill="${c}" stroke="${G.dark(c, 0.3)}" stroke-width="1.5" stroke-linejoin="round"/>`,
    lettreF: (c) =>
      `<polygon points="10,4 32,4 32,11 18,11 18,17 28,17 28,24 18,24 18,36 10,36" fill="${c}" stroke="${G.dark(c, 0.3)}" stroke-width="1.5" stroke-linejoin="round"/>`,
    pied: (c) =>
      `<ellipse cx="17" cy="25" rx="8" ry="12" fill="${c}" transform="rotate(-12 17 25)"/><circle cx="14" cy="8" r="3.4" fill="${c}"/><circle cx="21" cy="8.6" r="2.8" fill="${c}"/><circle cx="26.5" cy="11" r="2.4" fill="${c}"/><circle cx="30" cy="15" r="2" fill="${c}"/>`,
  };
  const ORIENT: Record<GeoOrient, string> = {
    n: '',
    h: 'translate(40,0) scale(-1,1)',
    v: 'translate(0,40) scale(1,-1)',
    r: 'rotate(180 20 20)',
  };
  G.motif = (name, c, orient = 'n', size = 46) =>
    G.svg(40, 40, `<g transform="${ORIENT[orient]}">${G.MOTIFS[name](c)}</g>`, { width: size });

  /* ------------------------------------------------------------------
     PLAN QUADRILLÉ : colonnes A–E, rangées 1–5 (1 en bas)
     ------------------------------------------------------------------ */
  G.COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
  G.cell = (c, r) => G.COLS[c] + r;
  G.parseCell = (k) => [G.COLS.indexOf(k[0]), Number(k.slice(1))];
  G.planHtml = function (items, o = {}) {
    const n = o.n || 5;
    let h = `<div class="geo-plan${o.cls ? ' ' + o.cls : ''}" style="--n:${n}">`;
    for (let r = n; r >= 1; r--) {
      h += `<div class="geo-plab">${r}</div>`;
      for (let c = 0; c < n; c++) {
        const k = G.cell(c, r);
        h += `<div class="geo-cell" data-cell="${k}">${items[k] || ''}</div>`;
      }
    }
    h +=
      '<div></div>' +
      G.COLS.slice(0, n)
        .map((l) => `<div class="geo-plab">${l}</div>`)
        .join('') +
      '</div>';
    return h;
  };

  /* ------------------------------------------------------------------
     Styles du domaine
     ------------------------------------------------------------------ */
  try {
    M.css(`
.geo-svg { display: block; margin: 0 auto; max-width: 100%; height: auto; overflow: visible }
.geo-center { display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap }
.geo-note { font-size: 1rem; color: var(--muted); font-weight: 700; margin-top: 4px }
.geo-obj { font-size: 4.5rem; line-height: 1.1; text-align: center }
.geo-row { display: flex; gap: 8px; justify-content: center }
.geo-slot { width: clamp(46px, 13vw, 72px); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: clamp(1.8rem, 7vw, 2.7rem); background: #fff; border: 3px solid var(--line); border-radius: 16px; transition: background .2s, border-color .2s }
.geo-slot.ref { border-color: var(--B); background: var(--Bb) }
.geo-slot.ans { border-color: var(--C); background: var(--Cc); animation: pop .5s }
.geo-lr { display: flex; justify-content: space-between; gap: 10px; font-weight: 800; color: var(--muted); margin: 10px auto 0; font-size: 1rem; max-width: 420px }
.geo-shelves { max-width: 340px; margin: 0 auto; background: #fbf1e1; border: 6px solid #a0703c; border-radius: 12px; padding: 4px 8px 0 }
.geo-shelf { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; border-bottom: 9px solid #a0703c; padding-top: 6px }
.geo-shelf:last-child { border-bottom: none }
.geo-shelf .geo-slot { width: auto; background: transparent; border-color: transparent; border-radius: 12px }
.geo-shelf .geo-slot.ref { background: var(--Bb); border-color: var(--B) }
.geo-shelf .geo-slot.ans { background: var(--Cc); border-color: var(--C) }
.geo-scene { position: relative; width: 300px; max-width: 100%; height: 210px; margin: 0 auto; background: linear-gradient(#dff3fb 0 60%, #c9ecb0 60%); border-radius: 18px; overflow: hidden }
.geo-scene span { position: absolute; line-height: 1; transition: filter .3s }
.geo-scene span.hl { filter: drop-shadow(0 0 5px #06a77d) drop-shadow(0 0 5px #06a77d) }
.geo-plan { display: grid; grid-template-columns: 26px repeat(var(--n), var(--geo-c, clamp(38px, 10vw, 56px))); gap: 3px; justify-content: center; user-select: none }
.geo-plab { display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--B); font-size: 1.1rem }
.geo-cell { aspect-ratio: 1; background: #fff; border: 2px solid #cfe6ef; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: clamp(1.3rem, 5vw, 1.9rem); transition: background .25s, border-color .25s }
.geo-cell.hc, .geo-cell.hr { background: #fff6d6; border-color: #f4d06f }
.geo-cell.hx { background: var(--Cc); border-color: var(--C); animation: pop .5s }
.geo-cell.path { background: #ffe9d6; border-color: var(--org) }
.geo-cell.start { outline: 3px dashed var(--org); outline-offset: -5px }
.geo-case { font-size: 1.5rem; letter-spacing: 1px }
.geo-frise { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center }
.geo-frise > span { width: 56px; height: 56px; background: #fff; border: 2px solid var(--line); border-radius: 10px; display: flex; align-items: center; justify-content: center }
.geo-frise > span.geo-q { border: 3px dashed #c7c2b4; font-size: 1.8rem; font-weight: 900; color: #c7c2b4 }
.geo-frise > span.geo-q.ok { border-style: solid; border-color: var(--C); background: var(--Cc); animation: pop .5s }
.geo-frise .ax { width: 0; height: 56px; border-left: 3px dashed #d62828; margin: 0 -3px; opacity: .6 }
.geo-count .geo-side, .geo-count .geo-vtx { cursor: pointer }
.geo-count .geo-side.on .geo-side-ln { stroke: #ef476f }
.geo-count .geo-vtx.on .geo-vtx-dot { fill: #ffd166; stroke: #b07d00 }
.geo-lbl { font-size: 17px; font-weight: 900; text-anchor: middle; pointer-events: none }
.geo-lbl.s { fill: #ef476f } .geo-lbl.v { fill: #b07d00 }
.geo-fnum { font-size: 15px; font-weight: 900; text-anchor: middle; fill: #fff; stroke: #2b2d42; stroke-width: 3px; paint-order: stroke; pointer-events: none }
.geo-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px }
.geo-chips .chip { font-size: .95rem; animation: pop .4s }
.geo-ghost { animation: geo-fade 1s forwards }
@keyframes geo-fade { from { opacity: 0 } to { opacity: 1 } }
.geo-mgrid { border-collapse: separate }
`);
  } catch {
    /* hors navigateur (tools/check-skills.js) */
  }

  /* ------------------------------------------------------------------
     Aides communes aux habiletés
     ------------------------------------------------------------------ */
  const ANIMAUX: GeoThing[] = [
    { e: '🐱', n: 'le chat' },
    { e: '🐶', n: 'le chien' },
    { e: '🐸', n: 'la grenouille' },
    { e: '🐷', n: 'le cochon' },
    { e: '🐰', n: 'le lapin' },
    { e: '🦊', n: 'le renard' },
    { e: '🐻', n: "l'ours" },
    { e: '🐼', n: 'le panda' },
    { e: '🐵', n: 'le singe' },
    { e: '🐨', n: 'le koala' },
    { e: '🦁', n: 'le lion' },
    { e: '🐮', n: 'la vache' },
    { e: '🐯', n: 'le tigre' },
    { e: '🐔', n: 'la poule' },
  ];
  const OBJETS: GeoThing[] = [
    { e: '🧸', n: "l'ourson" },
    { e: '⚽', n: 'le ballon' },
    { e: '📕', n: 'le livre' },
    { e: '🎲', n: 'le dé' },
    { e: '🚗', n: "l'auto", f: true },
    { e: '🪀', n: 'le yoyo' },
    { e: '🎨', n: 'la palette' },
    { e: '🧩', n: 'le casse-tête' },
    { e: '🥁', n: 'le tambour' },
    { e: '🎺', n: 'la trompette' },
    { e: '🍎', n: 'la pomme' },
    { e: '🪁', n: 'le cerf-volant' },
    { e: '⏰', n: 'le réveil' },
    { e: '🏆', n: 'le trophée' },
    { e: '🎁', n: 'le cadeau' },
    { e: '🖍️', n: 'le crayon' },
  ];
  const de = (x: GeoThing): string => (x.n.startsWith('le ') ? 'du ' + x.n.slice(3) : 'de ' + x.n);
  /** « au chat », « à la vache », « à l'ours » */
  const au = (x: GeoThing): string => (x.n.startsWith('le ') ? 'au ' + x.n.slice(3) : 'à ' + x.n);
  /** Genre du nom : « la … » ou f: true (« l'auto ») → accords il/elle, collé/collée, le/la. */
  const fem = (x: GeoThing): boolean => x.f || x.n.startsWith('la ');
  const il = (x: GeoThing): string => (fem(x) ? 'elle' : 'il'),
    Il = (x: GeoThing): string => (fem(x) ? 'Elle' : 'Il'),
    E = (x: GeoThing): string => (fem(x) ? 'e' : ''),
    le = (x: GeoThing): string => (fem(x) ? 'la' : 'le');
  const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
  G.ANIMAUX = ANIMAUX;
  G.de = de;
  const emoChoice = (x: GeoThing): Choice<string> => ({ label: `<span style="font-size:2.3rem;line-height:1">${x.e}</span>`, value: x.e });
  const LR_NOTE = '<div class="geo-note">👈 ta gauche · ta droite 👉 (quand tu regardes l\'écran)</div>';
  const OUI_NON: Choice<string>[] = [
    { label: '👍 Oui', value: 'oui' },
    { label: '👎 Non', value: 'non' },
  ];

  /* ===================================================================
     1. Se repérer dans l'espace
     =================================================================== */
  function rowViz(el: HTMLElement, row: GeoThing[]): void {
    el.innerHTML = `<div class="geo-row">${row.map((a, i) => `<div class="geo-slot" data-i="${i}">${a.e}</div>`).join('')}</div>
      <div class="geo-lr"><span>👈 ta gauche</span><span>ta droite 👉</span></div>`;
  }
  function shelvesViz(el: HTMLElement, grid: GeoThing[][]): void {
    el.innerHTML = `<div class="geo-shelves">${grid.map((r, ri) => `<div class="geo-shelf">${r.map((x, ci) => `<div class="geo-slot" data-i="${ri * 4 + ci}">${x.e}</div>`).join('')}</div>`).join('')}</div>`;
  }
  async function markSlots(el: HTMLElement, ref: number | number[], ans: number | number[]): Promise<void> {
    const slots = M.$$('.geo-slot', el);
    slots.forEach((s) => s.classList.remove('ref', 'ans'));
    (Array.isArray(ref) ? ref : [ref]).forEach((i) => slots[i] && slots[i].classList.add('ref'));
    await M.sleep(700);
    if (!alive(el)) return;
    (Array.isArray(ans) ? ans : [ans]).forEach((i) => slots[i] && slots[i].classList.add('ans'));
  }
  interface GeoScene {
    place: GeoThing;
    front: GeoThing;
    behind: GeoThing;
    side: GeoThing;
    left: boolean;
  }
  type GeoSceneSpot = 'place' | 'b' | 'f' | 's';
  /** Scène devant / derrière / à côté, dessinée en SVG (s'adapte à la largeur). */
  function sceneLayout(sc: GeoScene): Record<GeoSceneSpot, { x: number; y: number; fs: number; e: string }> {
    const Lx = sc.left ? 210 : 90;
    return {
      place: { x: Lx, y: 160, fs: 120, e: sc.place.e },
      b: { x: Lx + 40, y: 80, fs: 52, e: sc.behind.e },
      f: { x: Lx - 18, y: 202, fs: 70, e: sc.front.e },
      s: { x: sc.left ? 55 : 248, y: 196, fs: 60, e: sc.side.e },
    };
  }
  function sceneViz(el: HTMLElement, sc: GeoScene, ring?: GeoSceneSpot): void {
    const P = sceneLayout(sc);
    const tx = (p: { x: number; y: number; fs: number; e: string }): string =>
      `<text x="${p.x}" y="${p.y}" font-size="${p.fs}" text-anchor="middle">${p.e}</text>`;
    let rg = '';
    if (ring) {
      const p = P[ring];
      rg = `<ellipse cx="${p.x}" cy="${p.y - p.fs * 0.38}" rx="${p.fs * 0.66}" ry="${p.fs * 0.6}" fill="none" stroke="#06a77d" stroke-width="5" class="geo-ghost"/>`;
    }
    el.innerHTML = G.svg(
      300,
      215,
      `<rect width="300" height="130" rx="16" fill="#dff3fb"/><rect y="124" width="300" height="91" rx="16" fill="#c9ecb0"/>${tx(P.b)}${tx(P.place)}${tx(P.f)}${tx(P.s)}${rg}`,
      { width: 300 },
    );
  }

  M.registerSkill({
    id: 'reperage',
    domain: DOM,
    title: "Se repérer dans l'espace",
    icon: '🧭',
    starter: true,
    learn: 'reperage',
    desc: 'Gauche, droite, au-dessus, en dessous, devant, derrière, entre, à côté.',
    pda: "Géométrie — Espace A.1 : se repérer et repérer des objets dans l'espace (relations spatiales)",
    gen({ lvl }) {
      const types =
        lvl === 0
          ? ['g', 'd', 'haut', 'bas', 'g', 'd']
          : lvl === 1
            ? ['g', 'd', 'entre', 'cote', 'haut', 'bas', 'devant', 'derriere']
            : ['entre', 'cote', 'devant', 'derriere', 'compte', 'gd2', 'haut', 'bas', 'g', 'd'];
      const t = pick(types);

      if (t === 'haut' || t === 'bas') {
        const objs = shuffle(OBJETS).slice(0, 12),
          grid = [objs.slice(0, 4), objs.slice(4, 8), objs.slice(8, 12)];
        const up = t === 'haut',
          r = up ? rnd(1, 2) : rnd(0, 1),
          c = rnd(0, 3);
        const x = grid[r][c],
          a = grid[up ? r - 1 : r + 1][c];
        const opp = grid[up ? r + 1 : r - 1] && grid[up ? r + 1 : r - 1][c];
        const nb = grid[r][c > 0 ? c - 1 : c + 1];
        const pool = [opp, nb, grid[up ? r - 1 : r + 1][(c + 2) % 4]].filter(Boolean);
        const ch = shuffle([a, ...shuffle(pool).slice(0, 2)]);
        const word = up ? 'juste au-dessus' : 'juste en dessous';
        return {
          prompt: `Quel objet est <b>${word}</b> ${de(x)} ${x.e} ?`,
          say: `Quel objet est ${word} ${de(x)} ?`,
          input: 'choice',
          choices: ch.map(emoChoice),
          answer: a.e,
          viz: (el) => shelvesViz(el, grid),
          showMe: (el) => markSlots(el, r * 4 + c, (up ? r - 1 : r + 1) * 4 + c),
          hint: up
            ? "Au-dessus, c'est sur la tablette <b>plus haute</b>, dans la même colonne."
            : "En dessous, c'est sur la tablette <b>plus basse</b>, dans la même colonne.",
          explain: `${cap(a.n)} ${a.e} est ${up ? 'sur la tablette juste au-dessus' : 'sur la tablette juste en dessous'}, bien aligné avec ${x.n} ${x.e}.`,
        };
      }

      if (t === 'devant' || t === 'derriere') {
        const an = shuffle(ANIMAUX);
        const sc = {
          place: pick([
            { e: '🌳', n: "l'arbre" },
            { e: '🏠', n: 'la maison' },
          ]),
          front: an[0],
          behind: an[1],
          side: an[2],
          left: Math.random() < 0.5,
        };
        const a = t === 'devant' ? sc.front : sc.behind;
        const word = t === 'devant' ? 'devant' : 'derrière';
        return {
          prompt: `Quel animal est <b>${word}</b> ${sc.place.n} ${sc.place.e} ?`,
          say: `Quel animal est ${word} ${sc.place.n} ?`,
          input: 'choice',
          choices: shuffle([sc.front, sc.behind, sc.side]).map(emoChoice),
          answer: a.e,
          viz: (el) => sceneViz(el, sc),
          showMe: (el) => sceneViz(el, sc, t === 'devant' ? 'f' : 'b'),
          hint: 'Ce qui est <b>devant</b> cache un peu ce qui est <b>derrière</b>.',
          explain: `${cap(sc.front.n)} ${sc.front.e} est devant : ${il(sc.front)} cache un bout ${de(sc.place)}. ${cap(sc.behind.n)} ${sc.behind.e} est derrière : on ${le(sc.behind)} voit à moitié, caché${E(sc.behind)}. ${cap(sc.side.n)} ${sc.side.e} est à côté.`,
        };
      }

      const row = shuffle(ANIMAUX).slice(0, 5);
      const viz = (el: HTMLElement): void => rowViz(el, row);
      if (t === 'g' || t === 'd') {
        const left = t === 'g',
          i = left ? rnd(1, 4) : rnd(0, 3),
          j = left ? i - 1 : i + 1;
        const x = row[i],
          a = row[j],
          opp = row[left ? i + 1 : i - 1];
        const rest = shuffle(row.filter((_, k) => k !== i && k !== j && row[k] !== opp));
        const ch = shuffle([a, ...(opp ? [opp] : []), ...rest].slice(0, 3));
        const word = left ? 'juste à gauche' : 'juste à droite';
        return {
          prompt: `Quel animal est <b>${word}</b> ${de(x)} ${x.e} ?${LR_NOTE}`,
          say: `Quel animal est ${word} ${de(x)} ?`,
          input: 'choice',
          choices: shuffle(ch).map(emoChoice),
          answer: a.e,
          viz,
          showMe: (el) => markSlots(el, i, j),
          hint: left
            ? "Ta gauche, c'est du côté 👈. Truc : avec ta main gauche, le pouce et l'index font un vrai <b>L</b>."
            : "Ta droite, c'est du côté 👉. Truc : avec ta main gauche, le pouce et l'index font un vrai <b>L</b>; la droite, c'est l'autre main.",
          explain: `On regarde l'écran : ${a.n} ${a.e} est collé${E(a)} ${au(x)} ${x.e}, du côté ${left ? 'gauche 👈' : 'droit 👉'}.`,
        };
      }
      if (t === 'entre') {
        const i = rnd(1, 3),
          a = row[i],
          x = row[i - 1],
          y = row[i + 1];
        const ch = shuffle([a, ...row.filter((_, k) => Math.abs(k - i) > 1)]);
        return {
          prompt: `Quel animal est <b>entre</b> ${x.n} ${x.e} et ${y.n} ${y.e} ?`,
          say: `Quel animal est entre ${x.n} et ${y.n} ?`,
          input: 'choice',
          choices: ch.map(emoChoice),
          answer: a.e,
          viz,
          showMe: (el) => markSlots(el, [i - 1, i + 1], i),
          hint: "Entre, c'est <b>au milieu</b> des deux.",
          explain: `${cap(a.n)} ${a.e} est au milieu : ${x.e} d'un côté, ${y.e} de l'autre.`,
        };
      }
      if (t === 'cote') {
        const i = lvl === 1 ? pick([0, 4]) : rnd(0, 4);
        const nbs = [i - 1, i + 1].filter((k) => k >= 0 && k < 5),
          j = pick(nbs);
        const far = shuffle(row.filter((_, k) => Math.abs(k - i) >= 2)).slice(0, 2);
        const x = row[i],
          a = row[j];
        return {
          prompt: `Quel animal est <b>à côté</b> ${de(x)} ${x.e} ?`,
          say: `Quel animal est à côté ${de(x)} ?`,
          input: 'choice',
          choices: shuffle([a, ...far]).map(emoChoice),
          answer: a.e,
          viz,
          showMe: (el) => markSlots(el, i, j),
          hint: 'À côté veut dire <b>tout près</b>, collé, sans personne entre les deux.',
          explain: `${cap(a.n)} ${a.e} est collé${E(a)} ${au(x)} ${x.e} : ${il(a)} est à côté. Les autres sont plus loin.`,
        };
      }
      if (t === 'compte') {
        const right = Math.random() < 0.5,
          i = right ? rnd(0, 3) : rnd(1, 4),
          x = row[i],
          n = right ? 4 - i : i;
        const word = right ? 'à droite' : 'à gauche';
        const idx = right ? M.range(i + 1, 4) : M.range(0, i - 1);
        return {
          prompt: `Combien d'animaux sont <b>${word}</b> ${de(x)} ${x.e} ?${LR_NOTE}`,
          say: `Combien d'animaux sont ${word} ${de(x)} ?`,
          input: 'number',
          answer: n,
          viz,
          showMe: (el) => markSlots(el, i, idx),
          hint: `Pars ${de(x)} ${x.e} et compte tous les animaux du côté ${right ? 'droit 👉' : 'gauche 👈'}.`,
          explain: `Du côté ${right ? 'droit' : 'gauche'} ${de(x)} ${x.e}, il y a ${n} ${M.plural(n, 'animal', 'animaux')} : ${idx.map((k) => row[k].e).join(' ')}.`,
        };
      }
      // gd2 : X est-il à gauche ou à droite de Y ?
      let i = rnd(0, 4),
        j = rnd(0, 4);
      while (j === i) j = rnd(0, 4);
      const x = row[i],
        y = row[j],
        ans = i < j ? 'gauche' : 'droite';
      return {
        prompt: `Où est ${x.n} ${x.e} : à gauche ou à droite ${de(y)} ${y.e} ?${LR_NOTE}`,
        say: `Où est ${x.n} : à gauche ou à droite ${de(y)} ?`,
        input: 'choice',
        choices: [
          { label: '👈 à gauche', value: 'gauche' },
          { label: 'à droite 👉', value: 'droite' },
        ],
        answer: ans,
        viz,
        showMe: (el) => markSlots(el, j, i),
        hint: "Regarde d'abord " + y.n + ' ' + y.e + ', puis cherche de quel côté se trouve ' + x.n + ' ' + x.e + '.',
        explain: `${cap(x.n)} ${x.e} est du côté ${ans === 'gauche' ? 'gauche 👈' : 'droit 👉'} ${de(y)} ${y.e}. ${Il(x)} n'est pas obligé${E(x)} d'être collé${E(x)}.`,
      };
    },
  });

  /* ===================================================================
     2. Se repérer dans un plan quadrillé
     =================================================================== */
  const PLAN_ITEMS = [
    { e: '🍎', n: 'la pomme' },
    { e: '🌲', n: 'le sapin' },
    { e: '🏠', n: 'la maison' },
    { e: '🐟', n: 'le poisson' },
    { e: '⭐', n: "l'étoile" },
    { e: '🍄', n: 'le champignon' },
    { e: '🌻', n: 'le tournesol' },
    { e: '🎈', n: 'le ballon' },
  ];
  G.PLAN_ITEMS = PLAN_ITEMS;
  const inGrid = (c: number, r: number): boolean => c >= 0 && c < 5 && r >= 1 && r <= 5;
  function planViz(items: Record<string, string>, extra?: (el: HTMLElement) => void): (el: HTMLElement) => void {
    return (el) => {
      el.innerHTML = `<div class="viz-hint">La lettre dit la <b>colonne</b> ↕, le chiffre dit la <b>rangée</b> ↔.</div>${G.planHtml(items)}`;
      if (extra) extra(el);
    };
  }
  async function showCell(el: HTMLElement, k: string): Promise<void> {
    const [c, r] = G.parseCell(k);
    const cells = M.$$('.geo-cell', el);
    cells.forEach((x) => x.classList.remove('hc', 'hr', 'hx'));
    cells.filter((x) => x.dataset.cell?.[0] === G.COLS[c]).forEach((x) => x.classList.add('hc'));
    await M.sleep(800);
    if (!alive(el)) return;
    cells.filter((x) => Number(x.dataset.cell?.slice(1)) === r).forEach((x) => x.classList.add('hr'));
    await M.sleep(800);
    if (!alive(el)) return;
    const t = M.$(`[data-cell="${k}"]`, el);
    if (t) t.classList.add('hx');
  }
  function cellChoices(ans: string, extras: number[][]): Choice<string>[] {
    const [c, r] = G.parseCell(ans);
    const cand = [...extras, [r - 1, c + 1], [c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1], [c + 1, r + 1], [c - 1, r - 1]];
    const set = [ans];
    cand.forEach(([cc, rr]) => {
      if (set.length < 4 && inGrid(cc, rr)) {
        const k = G.cell(cc, rr);
        if (!set.includes(k)) set.push(k);
      }
    });
    return shuffle(set).map((k) => ({ label: `<b class="geo-case">${k}</b>`, value: k }));
  }

  M.registerSkill({
    id: 'plan-grille',
    domain: DOM,
    title: 'Le plan quadrillé',
    icon: '🗺️',
    learn: 'reperage',
    desc: 'Trouver une case avec une lettre et un chiffre (comme C3) et suivre un chemin.',
    pda: 'Géométrie — Espace A.2 : repérer des objets et se repérer dans un plan (quadrillage, lettre et chiffre)',
    gen({ lvl }) {
      const t = lvl === 0 ? pick(['ou', 'quoi']) : lvl === 1 ? pick(['ou', 'quoi', 'ou']) : pick(['bouge', 'bouge', 'ou', 'quoi']);
      const all = [];
      for (let c = 0; c < 5; c++) for (let r = 1; r <= 5; r++) all.push(G.cell(c, r));

      if (t === 'bouge') {
        let sc, sr, dx, dy;
        do {
          sc = rnd(0, 4);
          sr = rnd(1, 5);
          dx = rnd(-3, 3);
          dy = rnd(-3, 3);
        } while (!dx || !dy || !inGrid(sc + dx, sr + dy) || Math.abs(dx) === Math.abs(dy));
        const start = G.cell(sc, sr),
          end = G.cell(sc + dx, sr + dy);
        const h = Math.abs(dx),
          v = Math.abs(dy);
        const hw = dx > 0 ? 'vers la droite 👉' : 'vers la gauche 👈',
          vw = dy > 0 ? 'vers le haut 👆' : 'vers le bas 👇';
        const items = { [start]: '🦫' };
        const extras = [
          [sc + Math.sign(dx) * v, sr + Math.sign(dy) * h],
          [sc + dx, sr],
          [sc, sr + dy],
          [sc - dx, sr + dy],
          [sc + dx, sr - dy],
        ];
        return {
          prompt: `Le castor 🦫 part de la case <b>${start}</b>. Il avance de <b>${h}</b> ${M.plural(h, 'case')} ${hw}, puis de <b>${v}</b> ${M.plural(v, 'case')} ${vw}. Dans quelle case arrive-t-il ?`,
          say: `Le castor part de la case ${start[0]} ${start.slice(1)}. Il avance de ${h} ${M.plural(h, 'case')} ${dx > 0 ? 'vers la droite' : 'vers la gauche'}, puis de ${v} ${M.plural(v, 'case')} ${dy > 0 ? 'vers le haut' : 'vers le bas'}. Dans quelle case arrive-t-il ?`,
          input: 'choice',
          choices: cellChoices(end, extras),
          answer: end,
          viz: planViz(items, (el) => {
            const s = M.$(`[data-cell="${start}"]`, el);
            if (s) s.classList.add('start');
          }),
          async showMe(el: HTMLElement) {
            let c = sc,
              r = sr;
            const step = async (nc: number, nr: number): Promise<boolean> => {
              await M.sleep(520);
              if (!alive(el)) return false;
              const a = M.$(`[data-cell="${G.cell(c, r)}"]`, el),
                b = M.$(`[data-cell="${G.cell(nc, nr)}"]`, el);
              if (a) {
                a.textContent = '';
                a.classList.add('path');
              }
              if (b) b.textContent = '🦫';
              c = nc;
              r = nr;
              M.sfx.hop();
              return true;
            };
            for (let i = 0; i < h; i++) if (!(await step(c + Math.sign(dx), r))) return;
            for (let i = 0; i < v; i++) if (!(await step(c, r + Math.sign(dy)))) return;
            const b = M.$(`[data-cell="${end}"]`, el);
            if (b) b.classList.add('hx');
          },
          hint: "Mets ton doigt sur le castor et avance case par case. D'abord de côté, ensuite en haut ou en bas.",
          explain: `De ${start}, ${h} ${M.plural(h, 'case')} ${dx > 0 ? 'à droite' : 'à gauche'} : colonne ${G.COLS[sc + dx]}. Puis ${v} ${M.plural(v, 'case')} ${dy > 0 ? 'en haut' : 'en bas'} : rangée ${sr + dy}. On arrive en <b>${end}</b>.`,
        };
      }

      const nItems = lvl === 0 ? 3 : 5;
      const cells = shuffle(all).slice(0, nItems);
      const objs = [{ e: '🦫', n: 'le castor' }, ...shuffle(PLAN_ITEMS)].slice(0, nItems);
      const emo = objs.map((o) => o.e);
      const items: Record<string, string> = {};
      cells.forEach((k, i) => (items[k] = emo[i]));

      if (t === 'ou') {
        const i = lvl === 0 && Math.random() < 0.6 ? 0 : rnd(0, nItems - 1),
          k = cells[i],
          x = emo[i];
        const [c, r] = G.parseCell(k);
        return {
          prompt: `Dans quelle case est ${objs[i].n} ${x} ?`,
          say: `Dans quelle case est ${objs[i].n} ?`,
          input: 'choice',
          choices: cellChoices(k, []),
          answer: k,
          viz: planViz(items),
          showMe: (el) => showCell(el, k),
          hint: "Descends tout droit jusqu'à la <b>lettre</b> en bas, puis va de côté jusqu'au <b>chiffre</b>. La lettre s'écrit en premier.",
          explain: `Sous ${x}, on lit la lettre <b>${G.COLS[c]}</b>. Sur le côté, on lit le chiffre <b>${r}</b>. C'est la case <b>${k}</b>.`,
        };
      }
      // quoi : qu'y a-t-il dans la case k ?
      const i = rnd(0, nItems - 1),
        k = cells[i];
      const [c, r] = G.parseCell(k);
      // un objet sur la case « inversée » piège l'enfant qui confond lettre et chiffre
      const tr = G.cell(r - 1, c + 1);
      if (tr !== k && !items[tr]) {
        const j = (i + 1) % nItems;
        delete items[cells[j]];
        cells[j] = tr;
        items[tr] = emo[j];
      }
      const ch = shuffle(cells.map((kk) => items[kk])).slice(0, 4);
      if (!ch.includes(items[k])) ch[0] = items[k];
      return {
        prompt: `Qu'est-ce qu'il y a dans la case <b>${k}</b> ?`,
        say: `Qu'est-ce qu'il y a dans la case ${k[0]} ${k.slice(1)} ?`,
        input: 'choice',
        choices: shuffle(ch).map((e) => ({ label: `<span style="font-size:2.3rem;line-height:1">${e}</span>`, value: e })),
        answer: items[k],
        viz: planViz(items),
        showMe: (el) => showCell(el, k),
        hint: `Trouve d'abord la colonne <b>${G.COLS[c]}</b> (en bas), puis monte jusqu'à la rangée <b>${r}</b>.`,
        explain: `Colonne ${G.COLS[c]}, rangée ${r} : c'est ${items[k]}.`,
      };
    },
  });

  /* ===================================================================
     3. Les solides
     =================================================================== */
  const SOL_EXCL: Partial<Record<GeoSolidCat, GeoSolidCat[]>> = { cube: ['prisme'], prisme: ['cube'] };
  function solidCats(target: GeoSolidCat, n: number): GeoSolidCat[] {
    const others = shuffle(G.CATS.filter((k) => k !== target && !(SOL_EXCL[target] || []).includes(k)));
    return shuffle([target, ...others.slice(0, n - 1)]);
  }
  const solidName = (cat: GeoSolidKind): string => G.SOL[cat].nom;

  M.registerSkill({
    id: 'solides',
    domain: DOM,
    title: 'Les solides',
    icon: '🧊',
    starter: true,
    learn: 'solides',
    desc: 'Reconnaître la boule, le cône, le cube, le cylindre, le prisme et la pyramide.',
    pda: 'Géométrie — Solides B.1–B.3 : comparer et construire des solides; reconnaître et nommer boule, cône, cube, cylindre, prisme, pyramide',
    gen({ lvl }) {
      const t =
        lvl === 0
          ? pick(['nom', 'touche', 'nom'])
          : lvl === 1
            ? pick(['nom', 'touche', 'objet'])
            : pick(['touche', 'objet', 'objet2', 'nom']);
      if (t === 'objet' || t === 'objet2') {
        const o = pick(G.OBJ);
        if (t === 'objet2') {
          // « Quel objet ressemble à un cylindre ? » — un seul objet de la bonne catégorie
          const others = shuffle(G.OBJ.filter((x) => x.s !== o.s));
          const used = new Set([o.s]),
            ch = [o];
          others.forEach((x) => {
            if (ch.length < 4 && !used.has(x.s)) {
              used.add(x.s);
              ch.push(x);
            }
          });
          return {
            prompt: `Quel objet ressemble à <b>${G.SOL[o.s].un}</b> ?`,
            input: 'choice',
            choices: shuffle(ch).map((x) => ({
              label: `<span style="font-size:2.6rem;line-height:1">${x.e}</span><small>${x.n}</small>`,
              value: x.e,
            })),
            answer: o.e,
            viz: (el) => {
              el.innerHTML = `<div class="viz-hint">Voici ${G.SOL[o.s].un} :</div>${G.solid(o.k || o.s, { size: 170 })}`;
            },
            hint: 'Compare la forme de chaque objet avec le dessin.',
            explain: `${cap(o.n)} ${o.e} a la forme ${o.s === 'boule' || o.s === 'pyramide' ? "d'une" : "d'un"} ${solidName(o.s)}.`,
          };
        }
        const cats = solidCats(o.s, 4);
        return {
          prompt: `${cap(o.n)} ${o.e} ressemble à quel solide ?`,
          input: 'choice',
          choices: cats.map((k) => ({ label: G.randSolid(k, { size: 104 }).svg + `<small>${solidName(k)}</small>`, value: k })),
          answer: o.s,
          viz: (el) => {
            el.innerHTML = `<div class="geo-obj">${o.e}</div><div class="viz-status" style="text-align:center">${cap(o.n)}</div>`;
          },
          hint:
            o.s === 'boule'
              ? 'Cherche le solide rond partout.'
              : o.s === 'cylindre'
                ? 'Cherche le solide avec deux ronds plats, un en haut et un en bas.'
                : o.s === 'cone'
                  ? 'Cherche le solide avec une pointe et un rond.'
                  : o.s === 'cube'
                    ? 'Cherche le solide dont toutes les faces sont des carrés pareils.'
                    : 'Cherche le solide aux faces plates.',
          explain: `${cap(o.n)} ${o.e} a la forme ${G.SOL[o.s].un.startsWith('une') ? "d'une" : "d'un"} <b>${solidName(o.s)}</b>.`,
        };
      }
      const target = pick(G.CATS);
      if (t === 'touche') {
        const cats = solidCats(target, lvl === 0 ? 3 : 4);
        return {
          prompt: `Touche ${G.SOL[target].le}.`,
          say: `Touche ${G.SOL[target].le}.`,
          input: 'choice',
          cols: cats.length === 3 ? 3 : 2,
          choices: cats.map((k) => ({ label: G.randSolid(k, { size: 108 }).svg, value: k })),
          answer: target,
          hint: {
            boule: "La boule est ronde partout, elle n'a pas de partie plate.",
            cone: 'Le cône a une pointe et une base ronde.',
            cube: 'Le cube a 6 faces carrées, toutes pareilles.',
            cylindre: 'Le cylindre ressemble à une boîte de conserve.',
            prisme: 'Le prisme a deux bases pareilles reliées par des rectangles.',
            pyramide: 'La pyramide a une pointe et des faces en triangle.',
          }[target],
          explain: `Voici ${G.SOL[target].le} : ${{ boule: 'toute ronde, comme un ballon', cone: 'une pointe et une base ronde, comme un cornet', cube: '6 faces carrées pareilles, comme un dé', cylindre: 'deux bases rondes et une surface courbe, comme une boîte de conserve', prisme: 'deux bases pareilles reliées par des rectangles, comme une boîte', pyramide: 'une base et des faces en triangles qui se rejoignent en pointe' }[target]}.`,
        };
      }
      const s = G.randSolid(target, { size: 200 });
      const cats = solidCats(target, 4);
      return {
        prompt: "Comment s'appelle ce solide ?",
        input: 'choice',
        choices: cats.map((k) => ({ label: solidName(k), value: k })),
        answer: target,
        viz: (el) => {
          el.innerHTML = s.svg;
        },
        hint:
          target === 'boule' || target === 'cone' || target === 'cylindre'
            ? "Regarde : est-ce qu'il a une surface courbe (ronde) ? une pointe ?"
            : 'Regarde la forme de ses faces : carrés ? rectangles ? triangles ?',
        explain: `C'est ${G.SOL[target].un}${s.kind === 'prisme-tri' ? ' (un prisme triangulaire : ses deux bases sont des triangles)' : s.kind === 'prisme' ? ' (un prisme rectangulaire)' : ''}. Les traits pointillés montrent les arêtes cachées, derrière.`,
      };
    },
  });

  /* ===================================================================
     4. Propriétés des solides
     =================================================================== */
  async function numberFaces(el: HTMLElement, data: GeoSolidData): Promise<void> {
    const svg = M.$('svg', el);
    if (!svg || !data.faces) return;
    M.$$('.geo-fnum', svg).forEach((x) => x.remove());
    let chips = M.$('.geo-chips', el);
    if (!chips) {
      chips = document.createElement('div');
      chips.className = 'geo-chips';
      el.appendChild(chips);
    }
    chips.innerHTML = '';
    let k = 0;
    const order = data.faces.filter((f) => f.vis).concat(data.faces.filter((f) => !f.vis));
    for (const f of order) {
      await M.sleep(650);
      if (!alive(svg)) return;
      k++;
      M.sfx.pop();
      if (f.vis) svg.appendChild(G.svgEl('text', { x: f1(f.c[0]), y: f1(f.c[1]) + 5, class: 'geo-fnum' }, k));
      chips.insertAdjacentHTML('beforeend', `<span class="chip">${k} · ${f.name}${f.vis ? '' : ' (cachée)'}</span>`);
    }
  }
  const SURF: Record<'planes' | 'courbes' | 'deux', string> = {
    planes: 'Seulement des surfaces planes',
    courbes: 'Seulement des surfaces courbes',
    deux: 'Les deux',
  };
  const surfOf = (k: GeoSolidKind): string => (G.SOL[k].planes && G.SOL[k].courbes ? 'deux' : G.SOL[k].courbes ? 'courbes' : 'planes');
  const mouvOf = (k: GeoSolidKind): string => (G.SOL[k].roule && G.SOL[k].glisse ? 'deux' : G.SOL[k].roule ? 'roule' : 'glisse');

  M.registerSkill({
    id: 'solides-proprietes',
    domain: DOM,
    title: 'Faces et surfaces des solides',
    icon: '🎲',
    learn: 'solides',
    desc: 'Surface plane ou courbe, roule ou glisse, compter les faces, la forme de la base.',
    pda: 'Géométrie — Solides B.2, B.4 : surfaces planes et courbes; faces, base (initiation); solides qui roulent ou glissent',
    gen({ lvl }) {
      const t =
        lvl === 0
          ? pick(['mouv', 'surf', 'objet'])
          : lvl === 1
            ? pick(['mouv', 'surf', 'faces', 'base', 'objet'])
            : pick(['faces', 'base', 'lequel', 'nbsurf', 'surf']);

      if (t === 'objet') {
        // objet de tous les jours : roule, glisse ou les deux ?
        const o = pick(G.OBJ),
          k = o.k || o.s,
          a = mouvOf(k),
          f = o.n.startsWith('une');
        return {
          prompt: `${o.e} ${cap(o.n)} peut-${f ? 'elle' : 'il'} <b>rouler</b>, <b>glisser</b>, ou <b>les deux</b> ?`,
          say: `${cap(o.n)} peut-${f ? 'elle' : 'il'} rouler, glisser, ou les deux ?`,
          input: 'choice',
          choices: [
            { label: '🛞 Rouler', value: 'roule' },
            { label: '🛷 Glisser', value: 'glisse' },
            { label: '🔁 Les deux', value: 'deux' },
          ],
          answer: a,
          cols: 1,
          viz: (el) => {
            el.innerHTML = `<div class="geo-obj">${o.e}</div><div class="viz-hint">Sa forme : ${G.SOL[k].un}.</div>${G.solid(k, { size: 150 })}`;
          },
          hint: 'Une surface <b>courbe</b> fait rouler. Une surface <b>plane</b> permet de glisser.',
          explain: `${cap(o.n)} a la forme ${G.SOL[k].un.startsWith('une') ? "d'une" : "d'un"} <b>${solidName(o.s)}</b> : ${a === 'roule' ? 'seulement des surfaces courbes, ça roule.' : a === 'glisse' ? 'seulement des surfaces planes, ça glisse.' : `une surface courbe et ${G.SOL[k].planes === 1 ? 'une surface plane' : 'des surfaces planes'}, ça roule et ça glisse.`}`,
        };
      }
      if (t === 'mouv' || t === 'surf') {
        const kind = pick<GeoSolidKind>(['boule', 'cone', 'cylindre', 'cube', 'prisme', 'prisme-tri', 'pyramide']);
        const s = G.randSolid(G.cat(kind), { size: 190 });
        const k = s.kind;
        if (t === 'mouv') {
          const a = mouvOf(k);
          return {
            prompt: `Ce solide peut-il <b>rouler</b>, <b>glisser</b>, ou <b>les deux</b> ?`,
            input: 'choice',
            choices: [
              { label: '🛞 Il roule', value: 'roule' },
              { label: '🛷 Il glisse', value: 'glisse' },
              { label: '🔁 Les deux', value: 'deux' },
            ],
            answer: a,
            cols: 1,
            viz: (el) => {
              el.innerHTML = s.svg;
            },
            hint: "Un solide <b>roule</b> s'il a une surface courbe. Il <b>glisse</b> s'il a une surface plane pour se poser.",
            explain:
              a === 'roule'
                ? "La boule n'a que des surfaces courbes : elle roule, mais elle ne peut pas glisser à plat."
                : a === 'deux'
                  ? `${cap(G.SOL[k].le)} a une surface courbe (il roule) et ${G.SOL[k].planes === 1 ? 'une surface plane' : 'des surfaces planes'} (il glisse) : les deux !`
                  : `${cap(G.SOL[k].le)} n'a que des surfaces planes : ${k === 'pyramide' ? 'elle glisse' : 'il glisse'}, mais ne roule pas.`,
          };
        }
        const a = surfOf(k);
        return {
          prompt: 'Ce solide a…',
          input: 'choice',
          choices: keysOf(SURF).map((v) => ({ label: SURF[v], value: v })),
          answer: a,
          cols: 1,
          viz: (el) => {
            el.innerHTML = s.svg;
          },
          hint: 'Une surface <b>plane</b> est toute plate, comme une table. Une surface <b>courbe</b> est arrondie, comme un ballon.',
          explain:
            a === 'courbes'
              ? 'La boule est ronde partout : seulement une surface courbe.'
              : a === 'deux'
                ? `${cap(G.SOL[k].le)} a ${G.SOL[k].planes === 1 ? 'une surface plane (sa base)' : '2 surfaces planes (en haut et en bas)'} et une surface courbe.`
                : `Toutes les faces ${k === 'pyramide' ? 'de la pyramide' : k === 'cube' ? 'du cube' : 'du prisme'} sont plates : seulement des surfaces planes.`,
        };
      }

      if (t === 'faces') {
        const k = pick<GeoSolidKind>(lvl === 1 ? ['cube', 'prisme', 'pyramide'] : ['cube', 'prisme', 'pyramide', 'prisme-tri']);
        const opt: GeoSolidOpts = { size: 210 };
        if (k === 'prisme')
          opt.dims = pick<GeoVec3>([
            [1.8, 0.85, 0.9],
            [0.9, 1.6, 0.8],
          ]);
        const data = G.solidData(k, opt);
        const nm = G.SOL[k].long || G.SOL[k].nom;
        return {
          prompt: `Combien de <b>faces</b> a ce ${k === 'pyramide' ? 'solide (une pyramide à base carrée)' : nm} ?`,
          say: `Combien de faces a ce ${k === 'pyramide' ? 'solide' : nm} ?`,
          input: 'number',
          answer: G.SOL[k].faces!, // cube, prismes, pyramide : nombre de faces connu
          viz: (el) => {
            el.innerHTML =
              data.svg +
              '<div class="viz-hint" style="text-align:center;margin-top:6px">Les pointillés montrent ce qui est caché derrière.</div>';
          },
          showMe: (el) => numberFaces(el, data),
          hint: 'Compte les faces que tu vois, puis pense à celles qui sont cachées : derrière, dessous…',
          explain:
            k === 'pyramide'
              ? 'La pyramide à base carrée a 5 faces : 1 base carrée et 4 triangles.'
              : k === 'prisme-tri'
                ? 'Le prisme triangulaire a 5 faces : 2 triangles et 3 rectangles.'
                : `${k === 'cube' ? 'Le cube' : 'Le prisme rectangulaire'} a 6 faces : devant, derrière, dessus, dessous, gauche et droite.`,
        };
      }

      if (t === 'base') {
        const k = pick<GeoSolidKind>(['cylindre', 'cone', 'cube', 'prisme', 'prisme-tri', 'pyramide']);
        const opt: GeoSolidOpts = { size: 190, stand: true };
        if (k === 'prisme') opt.dims = [1.8, 0.8, 1];
        const data = G.solidData(k, opt);
        const a = G.SOL[k].base!; // ces solides ont tous une base
        const FB: Record<GeoBaseKind, string> = { cercle: '#118ab2', carre: '#06a77d', triangle: '#ef476f', rectangle: '#9b5de5' };
        return {
          prompt: 'Ce solide est posé sur sa <b>base</b>. Quelle forme a sa base (la face du dessous) ?',
          input: 'choice',
          choices: (['cercle', 'carre', 'triangle', 'rectangle'] as const).map((f) => ({
            label: G.figure(f, { size: 54, color: FB[f], ratio: 1.8, sw: 4 }) + `<small>${G.FIG[f].nom}</small>`,
            value: f,
          })),
          answer: a,
          viz: (el) => {
            el.innerHTML = data.svg;
          },
          hint: 'Imagine que tu poses le solide dans la peinture puis sur une feuille. Quelle trace laisse-t-il ?',
          explain: `La base ${k === 'pyramide' ? 'de la pyramide' : k === 'cube' ? 'du cube' : k === 'cone' ? 'du cône' : k === 'cylindre' ? 'du cylindre' : 'du prisme'} est ${G.FIG[a].un}.${k === 'prisme' ? ' (Ses faces sont des rectangles.)' : ''}`,
        };
      }

      if (t === 'nbsurf') {
        const k = pick<GeoSolidKind>(['cylindre', 'cone']),
          plane = Math.random() < 0.6;
        const n = plane ? G.SOL[k].planes : G.SOL[k].courbes;
        return {
          prompt: `Combien de surfaces <b>${plane ? 'planes' : 'courbes'}</b> a ${G.SOL[k].le} ?`,
          input: 'number',
          answer: n,
          viz: (el) => {
            el.innerHTML = G.solid(k, { size: 190 });
          },
          hint: plane
            ? 'Les surfaces planes sont plates : cherche les ronds plats.'
            : 'La surface courbe est celle qui est arrondie, tout autour.',
          explain:
            k === 'cylindre'
              ? 'Le cylindre a 2 surfaces planes (les ronds du haut et du bas) et 1 surface courbe (tout autour).'
              : "Le cône a 1 surface plane (sa base ronde) et 1 surface courbe (qui monte jusqu'à la pointe).",
        };
      }

      // lequel
      const Q: { a: GeoSolidCat; q: string; ex: string }[] = [
        { a: 'boule', q: "Quel solide n'a <b>aucune</b> surface plane ?", ex: 'La boule est ronde partout : aucune surface plane.' },
        {
          a: 'cone',
          q: 'Quel solide a <b>une seule</b> surface plane et une pointe ?',
          ex: 'Le cône a une seule surface plane : sa base ronde.',
        },
        {
          a: 'cylindre',
          q: 'Quel solide a <b>2</b> surfaces planes rondes et <b>1</b> surface courbe ?',
          ex: 'Le cylindre : un rond en haut, un rond en bas, et une surface courbe autour.',
        },
        {
          a: 'boule',
          q: 'Quel solide peut <b>rouler</b> mais ne peut <b>pas glisser</b> ?',
          ex: "La boule roule toujours : elle n'a pas de surface plane pour glisser.",
        },
        {
          a: 'cube',
          q: 'Quel solide a <b>6 faces carrées</b> toutes pareilles ?',
          ex: 'Le cube a 6 faces carrées pareilles, comme un dé.',
        },
        {
          a: 'pyramide',
          q: 'Quel solide a une base carrée et des faces en <b>triangle</b> qui se rejoignent en pointe ?',
          ex: 'La pyramide : sa base est un carré et ses 4 autres faces sont des triangles.',
        },
      ];
      const qq = pick(Q);
      const pool: GeoSolidCat[] =
        qq.a === 'boule' || qq.a === 'cone' || qq.a === 'cylindre' ? ['cube', 'prisme', 'pyramide', 'cylindre', 'cone', 'boule'] : G.CATS;
      let others = shuffle(pool.filter((k) => k !== qq.a && !(SOL_EXCL[qq.a] || []).includes(k)));
      if (qq.q.includes('rouler')) others = others.filter((k) => !G.SOL[k].roule || G.SOL[k].glisse);
      const cats = shuffle([qq.a, ...others.slice(0, 3)]);
      return {
        prompt: qq.q,
        input: 'choice',
        choices: cats.map((k) => ({ label: G.randSolid(k, { size: 100 }).svg + `<small>${solidName(k)}</small>`, value: k })),
        answer: qq.a,
        hint: 'Regarde chaque solide : est-il plat ? arrondi ? les deux ?',
        explain: qq.ex,
      };
    },
  });

  /* ===================================================================
     5. Les figures planes
     =================================================================== */
  const FIG_EXCL: Partial<Record<GeoFigKind, GeoFigKind[]>> = { carre: ['rectangle', 'losange'] };
  const figSet = (target: GeoFig5, n: number, pool = G.FIG5): GeoFig5[] => {
    // un carré est aussi un rectangle et un losange : on évite les choix ambigus
    const bad = (k: GeoFigKind): boolean =>
      (FIG_EXCL[target] || []).includes(k) || ((target === 'rectangle' || target === 'losange') && k === 'carre');
    return shuffle([target, ...shuffle(pool.filter((k) => k !== target && !bad(k))).slice(0, n - 1)]);
  };
  const figHint: Record<GeoFig5, string> = {
    carre: 'Le carré a 4 côtés <b>pareils</b> et 4 coins droits.',
    rectangle: 'Le rectangle a 4 côtés et 4 coins droits; 2 côtés longs et 2 côtés courts.',
    triangle: 'Le triangle a 3 côtés et 3 sommets.',
    losange: 'Le losange a 4 côtés pareils, mais il est penché : ses coins ne sont pas droits.',
    cercle: "Le cercle est tout rond : il n'a ni côté ni sommet.",
  };

  M.registerSkill({
    id: 'figures',
    domain: DOM,
    title: 'Les figures planes',
    icon: '🔺',
    learn: 'figures',
    desc: 'Carré, rectangle, triangle, losange, cercle : les nommer et compter leurs côtés.',
    pda: 'Géométrie — Figures planes C.2–C.3 : identifier carré, rectangle, triangle, losange, cercle; décrire (côtés, sommets)',
    gen({ lvl }) {
      const t =
        lvl === 0
          ? pick(['nom', 'touche', 'touche'])
          : lvl === 1
            ? pick(['nom', 'touche', 'cotes', 'prop'])
            : pick(['nom', 'touche', 'cotes', 'sommets', 'prop', 'prop2']);

      if (t === 'cotes' || t === 'sommets') {
        const k = pick<GeoFigKind>(
          lvl === 2
            ? ['triangle', 'carre', 'rectangle', 'losange', 'pentagone', 'hexagone']
            : ['triangle', 'carre', 'rectangle', 'losange', 'triangle'],
        );
        const o = G.randFigOpts(k, lvl);
        const n = G.FIG[k].cotes,
          sides = t === 'cotes';
        let w: GeoCountCtl | undefined;
        return {
          prompt: sides ? 'Combien de <b>côtés</b> a cette figure ?' : 'Combien de <b>sommets</b> (coins) a cette figure ?',
          input: 'number',
          answer: n,
          viz: (el) => {
            w = G.countFig(el, k, {
              ...o,
              hint: sides ? 'Touche chaque <b>côté</b> pour le compter.' : 'Touche chaque <b>sommet</b> (coin) pour le compter.',
            });
          },
          showMe: () => w && w.showMe(sides ? 's' : 'v'),
          hint: sides
            ? "Un côté, c'est un trait droit du contour. Touche-les un à un."
            : "Un sommet, c'est un coin, là où deux côtés se rencontrent.",
          explain: `${cap(G.FIG[k].un)} : ${n} côtés et ${n} sommets. Une figure a toujours autant de côtés que de sommets.`,
        };
      }

      if (t === 'prop' || t === 'prop2') {
        const Q =
          t === 'prop'
            ? ([
                { a: 'triangle', q: 'Quelle figure a <b>3 côtés</b> ?' },
                { a: 'cercle', q: "Quelle figure n'a <b>aucun</b> sommet (coin) ?" },
                { a: 'triangle', q: 'Quelle figure a <b>3 sommets</b> ?' },
              ] as { a: GeoFig5; q: string }[])
            : ([
                { a: 'carre', q: 'Quelle figure a 4 côtés <b>pareils</b> et 4 coins <b>droits</b> ?' },
                { a: 'losange', q: 'Quelle figure a 4 côtés <b>pareils</b>, mais <b>pas</b> de coins droits ?' },
                { a: 'rectangle', q: 'Quelle figure a 4 coins droits, 2 côtés <b>longs</b> et 2 côtés <b>courts</b> ?' },
              ] as { a: GeoFig5; q: string }[]);
        const qq = pick(Q);
        let ks: GeoFig5[];
        if (qq.a === 'carre') ks = shuffle(['carre', 'rectangle', 'losange', pick(['triangle', 'cercle'])]);
        else if (qq.a === 'triangle')
          ks = shuffle(['triangle', ...shuffle<GeoFig5>(['carre', 'rectangle', 'losange', 'cercle']).slice(0, 3)]);
        else if (qq.a === 'cercle')
          ks = shuffle(['cercle', ...shuffle<GeoFig5>(['carre', 'rectangle', 'losange', 'triangle']).slice(0, 3)]);
        else ks = shuffle([qq.a, qq.a === 'losange' ? 'rectangle' : 'losange', 'triangle', 'cercle']);
        return {
          prompt: qq.q,
          input: 'choice',
          choices: ks.map((k) => ({ label: G.figure(k, { ...G.randFigOpts(k, Math.min(lvl, 1)), size: 104 }), value: k })),
          answer: qq.a,
          hint: figHint[qq.a],
          explain: `C'est ${G.FIG[qq.a].le}. ${figHint[qq.a]}`,
        };
      }

      const target = pick(G.FIG5);
      if (t === 'touche') {
        const ks = figSet(target, lvl === 0 ? 3 : 4);
        return {
          prompt: `Touche ${G.FIG[target].le}.`,
          input: 'choice',
          cols: ks.length === 3 ? 3 : 2,
          choices: ks.map((k) => ({ label: G.figure(k, { ...G.randFigOpts(k, lvl), size: 108 }), value: k })),
          answer: target,
          hint: figHint[target],
          explain: `${figHint[target]}${target === 'carre' ? ' Même tourné, un carré reste un carré !' : ''}`,
        };
      }
      const o = G.randFigOpts(target, lvl);
      const ks = figSet(target, 4);
      return {
        prompt: "Comment s'appelle cette figure ?",
        input: 'choice',
        choices: ks.map((k) => ({ label: G.FIG[k].nom, value: k })),
        answer: target,
        viz: (el) => {
          el.innerHTML = G.figure(target, { ...o, size: 200 });
        },
        hint:
          target === 'cercle' ? "Est-ce qu'elle a des coins ?" : 'Compte ses côtés. Sont-ils tous pareils ? Les coins sont-ils droits ?',
        explain: `C'est ${G.FIG[target].un}. ${figHint[target]}${o.rot && target !== 'cercle' ? ' Même tournée, une figure garde son nom.' : ''}`,
      };
    },
  });

  /* ===================================================================
     6. Les lignes
     =================================================================== */
  const LK = keysOf(G.LIGNES);
  M.registerSkill({
    id: 'lignes',
    domain: DOM,
    title: 'Les lignes',
    icon: '〰️',
    learn: 'figures',
    desc: 'Ligne courbe ou brisée, ouverte ou fermée.',
    pda: 'Géométrie — Figures planes C.1 : lignes courbes, lignes brisées, lignes ouvertes et fermées',
    gen({ lvl }) {
      const t =
        lvl === 0 ? pick(['of', 'cb', 'trouve']) : lvl === 1 ? pick(['of', 'cb', 'laquelle', 'trouve']) : pick(['laquelle', 'nom', 'nom']);
      const k = pick(LK);
      if (t === 'trouve') {
        // une seule propriété à la fois : « Laquelle est fermée ? » parmi 3 dessins
        const prop = pick(['fermee', 'ouverte', 'courbe', 'brisee'] as const);
        const has = (x: string): boolean => x.includes(prop);
        const good = pick(LK.filter(has)),
          bad = shuffle(LK.filter((x) => !has(x))).slice(0, 2);
        const word = { fermee: 'fermée', ouverte: 'ouverte', courbe: 'courbe', brisee: 'brisée' }[prop];
        return {
          prompt: `Laquelle est une ligne <b>${word}</b> ?`,
          input: 'choice',
          cols: 3,
          choices: shuffle([good, ...bad]).map((x) => ({ label: G.lineSvg(x, { size: 110 }), value: x })),
          answer: good,
          hint: {
            fermee: "Une ligne fermée n'a pas de bout : une fourmi peut en faire le tour.",
            ouverte: 'Une ligne ouverte a deux bouts.',
            courbe: 'Une ligne courbe est arrondie, sans coin.',
            brisee: 'Une ligne brisée est faite de traits droits avec des coins.',
          }[prop],
          explain: `La ligne ${word} : ${{ fermee: "elle n'a pas de bout.", ouverte: 'elle a deux bouts.', courbe: 'elle est arrondie, sans coin.', brisee: 'elle a des traits droits et des coins.' }[prop]}`,
        };
      }
      const closed = k.endsWith('fermee'),
        curved = k.startsWith('courbe');
      const svg = G.lineSvg(k, { size: 240 });
      const viz = (el: HTMLElement): void => {
        el.innerHTML = svg;
      };
      const why = `${curved ? 'Elle est <b>courbe</b> : elle est arrondie, sans coin.' : 'Elle est <b>brisée</b> : elle est faite de traits droits, avec des coins.'} ${closed ? 'Elle est <b>fermée</b> : pas de bout, on peut en faire le tour.' : 'Elle est <b>ouverte</b> : elle a deux bouts (les points).'}`;
      if (t === 'of') {
        return {
          prompt: 'Cette ligne est-elle <b>ouverte</b> ou <b>fermée</b> ?',
          input: 'choice',
          choices: [
            { label: 'Ouverte', value: 'ouverte' },
            { label: 'Fermée', value: 'fermee' },
          ],
          answer: closed ? 'fermee' : 'ouverte',
          viz,
          hint: "Une ligne ouverte a des bouts. Une ligne fermée n'a pas de bout : une fourmi peut en faire le tour.",
          explain: why,
        };
      }
      if (t === 'cb') {
        return {
          prompt: 'Cette ligne est-elle <b>courbe</b> ou <b>brisée</b> ?',
          input: 'choice',
          choices: [
            { label: 'Courbe', value: 'courbe' },
            { label: 'Brisée', value: 'brisee' },
          ],
          answer: curved ? 'courbe' : 'brisee',
          viz,
          hint: 'Une ligne brisée est faite de traits droits qui font des coins. Une ligne courbe est arrondie.',
          explain: why,
        };
      }
      if (t === 'laquelle') {
        return {
          prompt: `Laquelle est une <b>${G.LIGNES[k]}</b> ?`,
          input: 'choice',
          choices: shuffle(LK).map((x) => ({ label: G.lineSvg(x, { size: 120 }), value: x })),
          answer: k,
          hint: `Cherche d'abord les lignes ${curved ? 'courbes (arrondies)' : 'brisées (avec des coins)'}, puis celle qui est ${closed ? 'fermée (sans bout)' : 'ouverte (avec deux bouts)'}.`,
          explain: `Une ${G.LIGNES[k]} : ${why}`,
        };
      }
      return {
        prompt: 'Comment est cette ligne ?',
        input: 'choice',
        choices: LK.map((x) => ({ label: cap(G.LIGNES[x].replace('ligne ', '')), value: x })),
        answer: k,
        cols: 2,
        viz,
        hint: 'Deux questions : courbe ou brisée ? ouverte ou fermée ?',
        explain: `C'est une ${G.LIGNES[k]}. ${why}`,
      };
    },
  });

  /* ===================================================================
     7. Symétrie (axe de réflexion) et figures isométriques
     =================================================================== */
  const SYM_V: GeoSymName[] = ['papillon', 'coeur', 'maison', 'sapin', 'etoile', 'triangle'];
  const ASYM: GeoSymName[] = ['drapeau', 'botte', 'quelconque', 'eclair'];
  function axisQuestion(lvl: number): QuestionOf<'choice'> {
    let name: GeoSymName,
      axis: GeoAxisArg,
      rot = 0;
    const yes = Math.random() < 0.5;
    if (lvl === 0) {
      if (yes) {
        name = pick([...SYM_V, 'rectangle', 'carre', 'cercle', 'losange']);
        axis = 'v';
      } else if (Math.random() < 0.5) {
        name = pick(ASYM);
        axis = 'v';
      } else {
        name = pick(SYM_V);
        axis = 'voff';
      }
    } else {
      if (yes) {
        name = pick([...SYM_V, 'poisson', 'rectangle', 'losange', 'carre', 'cercle', 'carre']);
        axis = pick(G.SYM[name].axes);
      } else {
        const r = Math.random();
        if (r < 0.3) {
          name = pick(ASYM);
          axis = pick(['v', 'h']);
        } else if (r < 0.6) {
          name = pick([...SYM_V, 'poisson']);
          axis = G.SYM[name].axes[0] === 'v' ? 'h' : 'v';
        } else if (r < 0.8 && lvl === 2) {
          name = 'rectangle';
          axis = pick(['d1', 'd2']);
        } else {
          name = pick([...SYM_V, 'rectangle']);
          axis = 'voff';
        }
      }
      if (Math.random() < 0.3 && name !== 'cercle') rot = 90;
    }
    const ok = (G.SYM[name].axes as GeoAxisArg[]).includes(axis);
    const color = pick(G.COLORS);
    const nm = G.SYM[name].nom;
    return {
      prompt: 'La ligne pointillée rouge est-elle un <b>axe de symétrie</b> ?',
      say: 'La ligne pointillée rouge est-elle un axe de symétrie ?',
      input: 'choice',
      choices: OUI_NON,
      answer: ok ? 'oui' : 'non',
      viz: (el: HTMLElement) => {
        el.innerHTML = G.symSvg(name, axis, { color, rot, size: 220 });
      },
      showMe: (el: HTMLElement) => {
        el.innerHTML =
          G.symSvg(name, axis, { color, rot, size: 220, ghost: true }) +
          `<div class="viz-status" style="text-align:center">Voici l'image miroir (pâle). ${ok ? 'Elle se pose exactement sur la figure ✔️' : 'Elle ne se pose pas sur la figure ✖️'}</div>`;
      },
      hint: 'Imagine que tu plies la feuille sur la ligne pointillée. Les deux moitiés se touchent-elles parfaitement ?',
      explain: ok
        ? `Oui ! Si on plie ${nm} sur la ligne, les deux moitiés se superposent exactement.`
        : name === 'rectangle' && (axis === 'd1' || axis === 'd2')
          ? "Non ! Attention : la diagonale d'un rectangle n'est pas un axe de symétrie. Si on plie, les coins ne se touchent pas."
          : `Non. Si on plie ${nm} sur cette ligne, les deux moitiés ne sont pas pareilles.`,
    };
  }

  /* --- polyominos pour les figures isométriques --- */
  const POLY: number[][][] = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ],
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [2, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
  ];
  const TF: ((x: number, y: number) => number[])[] = [
    (x, y) => [x, y],
    (x, y) => [-x, y],
    (x, y) => [x, -y],
    (x, y) => [-x, -y],
    (x, y) => [y, x],
    (x, y) => [-y, x],
    (x, y) => [y, -x],
    (x, y) => [-y, -x],
  ];
  const normCells = (cs: readonly number[][]): number[][] => {
    const mx = Math.min(...cs.map((c) => c[0])),
      my = Math.min(...cs.map((c) => c[1]));
    return cs.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  };
  const key = (cs: readonly number[][]): string =>
    normCells(cs)
      .map((c) => c.join(','))
      .join(';');
  const canon = (cs: readonly number[][]): string => TF.map((f) => key(cs.map(([x, y]) => f(x, y)))).sort()[0];
  const connected = (cs: readonly number[][]): boolean => {
    const s = new Set(cs.map((c) => c.join(','))),
      seen = new Set([cs[0].join(',')]),
      st = [cs[0]];
    while (st.length) {
      const [x, y] = st.pop()!;
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].forEach(([a, b]) => {
        const k = x + a + ',' + (y + b);
        if (s.has(k) && !seen.has(k)) {
          seen.add(k);
          st.push([x + a, y + b]);
        }
      });
    }
    return seen.size === cs.length;
  };
  G.polySvg = function (cells, o = {}) {
    const u = o.unit || 15,
      c = o.color || '#9b5de5',
      cs = normCells(cells);
    const w = Math.max(...cs.map((p) => p[0])) + 1,
      h = Math.max(...cs.map((p) => p[1])) + 1;
    const inner = cs
      .map(
        ([x, y]) =>
          `<rect x="${2 + x * u}" y="${2 + y * u}" width="${u}" height="${u}" fill="${c}" stroke="${G.dark(c, 0.35)}" stroke-width="1.5"/>`,
      )
      .join('');
    return G.svg(w * u + 4, h * u + 4, inner, { width: w * u + 4 });
  };
  function isoQuestion(): QuestionOf<'choice'> {
    const model = pick(POLY);
    const mk = canon(model);
    let ok: number[][] = model;
    for (let g = 0; g < 20; g++) {
      ok = normCells(model.map(([x, y]) => pick(TF.slice(1))(x, y)));
      if (key(ok) !== key(model)) break;
    }
    const big: number[][] = [];
    normCells(model).forEach(([x, y]) => {
      big.push([2 * x, 2 * y], [2 * x + 1, 2 * y], [2 * x, 2 * y + 1], [2 * x + 1, 2 * y + 1]);
    });
    const other = pick(POLY.filter((p) => p.length === model.length && canon(p) !== mk)) || POLY.find((p) => canon(p) !== mk);
    let moved: number[][] | null = null;
    for (let g = 0; g < 80 && !moved; g++) {
      const cs = normCells(model).map((c) => c.slice());
      cs.splice(rnd(0, cs.length - 1), 1);
      const [x, y] = pick(cs),
        [a, b] = pick([
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]);
      if (cs.some((c) => c[0] === x + a && c[1] === y + b)) continue;
      cs.push([x + a, y + b]);
      if (connected(cs) && canon(cs) !== mk && canon(cs) !== canon(other)) moved = cs;
    }
    const color = pick(['#9b5de5', '#118ab2', '#ef476f', '#06a77d']);
    const opts: { v: string; c: number[][] }[] = [
      { v: 'ok', c: ok },
      { v: 'grand', c: big },
      { v: 'autre', c: other },
    ];
    if (moved) opts.push({ v: 'change', c: moved });
    return {
      prompt: 'Quelle figure est <b>pareille</b> au modèle : même forme <b>et</b> même grandeur ?',
      input: 'choice',
      choices: shuffle(opts).map((x) => ({ label: G.polySvg(x.c, { color }), value: x.v })),
      answer: 'ok',
      viz: (el: HTMLElement) => {
        el.innerHTML = `<div class="viz-hint" style="text-align:center">Le modèle :</div>${G.polySvg(model, { color })}`;
      },
      hint: 'Compte les carrés. Tu peux tourner ou retourner la figure dans ta tête.',
      explain:
        'La bonne figure a le même nombre de carrés, placés de la même façon : elle est juste tournée ou retournée. On dit que les deux figures sont <b>isométriques</b>.',
    };
  }
  /* --- compléter par réflexion sur un quadrillage --- */
  function mirrorQuestion(): QuestionOf<'choice'> {
    const R = 4,
      C = 3;
    const s = (g: number[][]): string => g.map((r) => r.join('')).join('/');
    let L: number[][] = [],
      cand: { v: string; g: number[][] }[] = [];
    for (let g = 0; g < 200; g++) {
      L = M.range(0, R - 1).map(() => M.range(0, C - 1).map(() => 0));
      const n = rnd(4, 6);
      shuffle(M.range(0, R * C - 1))
        .slice(0, n)
        .forEach((i) => (L[Math.floor(i / C)][i % C] = 1));
      const mir = L.map((r) => r.slice().reverse());
      const tra = L.map((r) => r.slice());
      const ups = mir.slice().reverse();
      const off = mir.map((r) => r.slice());
      const i = rnd(0, R - 1),
        j = rnd(0, C - 1);
      off[i][j] = 1 - off[i][j];
      cand = [
        { v: 'miroir', g: mir },
        { v: 'glisse', g: tra },
        { v: 'envers', g: ups },
        { v: 'erreur', g: off },
      ];
      if (new Set(cand.map((x) => s(x.g))).size === 4) break;
    }
    const color = pick(['#ef476f', '#118ab2', '#9b5de5', '#06a77d', '#f78c40']);
    const U = 22;
    const cellsSvg = (g: number[][], x0: number, fill: boolean): string =>
      g
        .map((r, ri) =>
          r
            .map(
              (v, ci) =>
                `<rect x="${x0 + ci * U}" y="${2 + ri * U}" width="${U}" height="${U}" fill="${v && fill ? color : '#fff'}" stroke="#c9d6dc" stroke-width="1.5"/>`,
            )
            .join(''),
        )
        .join('');
    const axisL = (x: number): string =>
      `<line x1="${x}" y1="0" x2="${x}" y2="${R * U + 4}" stroke="#d62828" stroke-width="3" stroke-dasharray="7 5"/>`;
    const halfSvg = (g: number[][]): string => G.svg(C * U + 8, R * U + 4, cellsSvg(g, 6, true) + axisL(3), { width: C * U + 8 });
    const empty = L.map((r) => r.map(() => 0));
    const full = (right: number[][]): string =>
      G.svg(2 * C * U + 4, R * U + 4, cellsSvg(L, 2, true) + cellsSvg(right, 2 + C * U, true) + axisL(2 + C * U), {
        width: 2 * (2 * C * U + 4),
        cls: 'geo-mgrid',
      });
    const mir = cand[0].g;
    return {
      prompt: 'Quelle image complète la figure par <b>réflexion</b> (comme dans un miroir) ?',
      input: 'choice',
      choices: shuffle(cand).map((x) => ({ label: halfSvg(x.g), value: x.v })),
      answer: 'miroir',
      viz: (el: HTMLElement) => {
        el.innerHTML = `<div class="viz-hint">La ligne rouge est l'axe de réflexion. Quelle moitié va à droite ?</div>${full(empty)}`;
      },
      async showMe(el: HTMLElement) {
        const g = empty.map((r) => r.slice());
        for (let r = 0; r < R; r++)
          for (let c = 0; c < C; c++) {
            if (!mir[r][c]) continue;
            await M.sleep(350);
            if (!alive(el)) return;
            g[r][c] = 1;
            M.sfx.pop();
            el.innerHTML = `<div class="viz-hint">Chaque carré se retrouve à la même distance de l'axe, de l'autre côté.</div>${full(g)}`;
          }
      },
      hint: "Un carré collé à l'axe reste collé à l'axe de l'autre côté. Un carré loin de l'axe reste loin.",
      explain:
        "Par réflexion, chaque carré est à la <b>même distance</b> de l'axe, de l'autre côté. La figure est comme retournée, pas seulement glissée.",
    };
  }

  M.registerSkill({
    id: 'symetrie',
    domain: DOM,
    title: 'La symétrie',
    icon: '🦋',
    learn: 'symetrie',
    desc: 'Trouver un axe de symétrie, compléter une figure par réflexion, figures pareilles.',
    pda: 'Géométrie — Frises et dallages D.1, D.3a : observer et produire des figures symétriques (axe de réflexion); figures isométriques',
    gen({ lvl }) {
      if (lvl === 0) return axisQuestion(0);
      if (lvl === 1) return pick([axisQuestion, axisQuestion, isoQuestion])(1);
      return pick([axisQuestion, mirrorQuestion, mirrorQuestion, isoQuestion])(2);
    },
  });

  /* ===================================================================
     8. Les frises
     =================================================================== */
  const FRISE_KINDS: GeoFig5[] = ['cercle', 'carre', 'triangle', 'losange', 'rectangle'];
  const FRISE_COLORS = ['#ef476f', '#118ab2', '#f4b400', '#06a77d', '#9b5de5'];
  /** Élément d'une frise : figure et couleur. */
  interface FriseItem {
    k: GeoFigKind;
    c: string;
  }
  const itemSvg = (it: FriseItem, size = 44): string => G.figure(it.k, { color: it.c, size, ratio: 1.7, sw: 4, pad: 6 });
  const PATTERNS: Record<number, string[]> = {
    0: ['AB', 'ABC', 'AB'],
    1: ['AAB', 'ABB', 'ABC', 'AABB'],
    2: ['AABB', 'ABBC', 'ABAC', 'AAB'],
  };

  function friseViz(cells: string[], opts: { hint?: string; axes?: boolean } = {}): (el: HTMLElement) => void {
    return (el) => {
      el.innerHTML = `<div class="viz-hint">${opts.hint || 'Observe la régularité.'}</div><div class="geo-frise">${cells.map((h, i) => (opts.axes && i > 0 && i < cells.length ? '<i class="ax"></i>' : '') + `<span>${h}</span>`).join('')}${opts.axes ? '<i class="ax"></i>' : ''}<span class="geo-q">?</span></div>`;
    };
  }
  function revealQ(el: HTMLElement, html: string): void {
    const q = M.$('.geo-q', el);
    if (q) {
      q.innerHTML = html;
      q.classList.add('ok');
      M.sfx.pop();
    }
  }

  M.registerSkill({
    id: 'frises',
    domain: DOM,
    title: 'Les frises',
    icon: '🎏',
    learn: 'symetrie',
    desc: 'Trouver ce qui vient ensuite dans une frise de figures ou une frise par réflexion.',
    pda: 'Géométrie — Frises et dallages D.2, D.3a : observer et produire des régularités avec des figures; frises par réflexion',
    gen({ lvl }) {
      if (lvl === 2 && Math.random() < 0.55) {
        const name = pick(keysOf(G.MOTIFS)),
          c = pick(FRISE_COLORS);
        const refl = Math.random() < 0.65;
        const n = rnd(4, 6);
        const seq = M.range(0, n - 1).map((i): GeoOrient => (refl && i % 2 ? 'h' : 'n'));
        const a: GeoOrient = refl && n % 2 ? 'h' : 'n';
        const mot = (o: GeoOrient): string => G.motif(name, c, o, 46);
        return {
          prompt: refl
            ? 'Cette frise est faite par <b>réflexion</b> (comme dans un miroir). Quel motif vient ensuite ?'
            : 'Dans cette frise, on fait <b>glisser</b> le motif. Quel motif vient ensuite ?',
          input: 'choice',
          choices: shuffle<GeoOrient>(['n', 'h', 'v', 'r']).map((o) => ({ label: G.motif(name, c, o, 64), value: o })),
          answer: a,
          viz: friseViz(seq.map(mot), {
            axes: refl,
            hint: refl ? 'Les lignes rouges sont des axes de réflexion.' : 'Le motif glisse, toujours dans le même sens.',
          }),
          showMe: (el) => revealQ(el, mot(a)),
          hint: refl ? "Chaque motif est l'image miroir de celui d'avant." : 'Le motif ne se retourne pas : il glisse.',
          explain: refl
            ? `Par réflexion, le motif se retourne à chaque fois : un à l'endroit, un comme dans un miroir. Après ${a === 'n' ? "un motif retourné, il revient à l'endroit" : "un motif à l'endroit, il se retourne"}.`
            : 'Le motif glisse sans tourner ni se retourner : il reste toujours pareil.',
        };
      }
      const pat = pick(PATTERNS[lvl]);
      const letters = [...new Set(pat.split(''))];
      const kinds = shuffle(FRISE_KINDS),
        cols = shuffle(FRISE_COLORS);
      const sameShape = lvl > 0 && Math.random() < 0.35; // même figure, couleurs différentes
      const it: Record<string, FriseItem> = {};
      letters.forEach(
        (L, i) => (it[L] = { k: sameShape ? kinds[0] : kinds[i], c: sameShape ? cols[i] : Math.random() < 0.5 ? cols[i] : cols[0] }),
      );
      const p = pat.length,
        n = 2 * p + rnd(0, p - 1);
      const seq = M.range(0, n - 1).map((i) => pat[i % p]);
      const ans = pat[n % p];
      const opts = letters.map((L) => ({ v: L, it: it[L] }));
      // intrus : une figure qui n'est pas dans la frise
      const used = new Set(letters.map((L) => it[L].k + it[L].c));
      let intr: FriseItem | undefined;
      for (let g = 0; g < 50; g++) {
        const x: FriseItem = { k: pick(FRISE_KINDS), c: pick(FRISE_COLORS) };
        if (!used.has(x.k + x.c)) {
          intr = x;
          break;
        }
      }
      if (intr && opts.length < 4) opts.push({ v: 'X', it: intr });
      const nameIt = (x: FriseItem): string => `${G.FIG[x.k].un}`;
      return {
        prompt: 'Quelle figure vient <b>ensuite</b> dans la frise ?',
        input: 'choice',
        choices: shuffle(opts).map((o) => ({ label: itemSvg(o.it, 60), value: o.v })),
        answer: ans,
        viz: friseViz(seq.map((L) => itemSvg(it[L]))),
        showMe: (el) => revealQ(el, itemSvg(it[ans])),
        hint: `Trouve le petit bout qui se répète : il a ${p} figures.`,
        explain: `Le motif qui se répète est : ${pat
          .split('')
          .map((L) => nameIt(it[L]))
          .join(', ')}. Ensuite vient ${nameIt(it[ans])}${sameShape ? ' (regarde bien la couleur)' : ''}.`,
      };
    },
  });
})();
