/* =====================================================================
   learn/nombres.js — pages « Apprendre » du domaine Les nombres
   Utilise les visuels de M.nb (définis dans js/skills/nombres.js)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const NB = M.nb;
  const pl = M.plural;

  try {
    M.css(`
.nb-ctl{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0}
.nb-ctl .btn{padding:6px 12px}
.nb-ctl .lab{font-weight:800;color:var(--muted);margin-right:4px}
.nb-cmpgrid{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:start}
@media (max-width:640px){.nb-cmpgrid{grid-template-columns:1fr}.nb-cmpsym{order:0}}
.nb-side{background:#fbfaf6;border:3px solid var(--line);border-radius:18px;padding:10px;display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0}
.nb-side .nb-big{font-size:2.6rem}
.nb-steps{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
.nb-steps .btn{padding:4px 8px;font-size:.95rem}
.nb-cmpsym{font-size:4rem;font-weight:900;text-align:center;align-self:center;line-height:1}
.nb-cmpsym small{display:block;font-size:2rem}
.nb-obs{min-height:3em}
.nb-seqout{font-size:1.4rem;font-weight:900;color:var(--C);min-height:1.6em;text-align:center;word-spacing:4px}
.nb-fname{font-size:1.3rem;font-weight:800;text-align:center;min-height:2.6em;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
.nb-fname b{color:var(--A);font-size:1.6rem}
.nb-tile-svg{max-width:150px;margin:0 auto}
.nb-pres .btn{padding:5px 12px}
.nb-blkbig .b10 .flat{grid-template-columns:repeat(10,8px)} .nb-blkbig .b10 .flat i{width:8px;height:8px}
`);
  } catch (e) {}

  const tip = (html: string, cls = '') => `<div class="callout ${cls}">🦫 <b>Castor te dit :</b> ${html}</div>`;
  const on = (btns: HTMLElement[], val: string | number, attr: string) =>
    btns.forEach((b) => b.classList.toggle('on', b.dataset[attr] === String(val)));

  /* =====================================================================
     Les nombres jusqu'à 1000
     ===================================================================== */
  M.registerLearn({
    id: 'nombres-1000',
    domain: 'nombres',
    title: "Les nombres jusqu'à 1000",
    icon: '🧱',
    short: 'Centaines, dizaines, unités, échanges, comparer',
    intro:
      "Un nombre, c'est comme une maison à trois pièces : les centaines, les dizaines et les unités. Construis des nombres et regarde ce qui arrive quand tu as 10 de quelque chose !",
    render(el) {
      el.innerHTML = `
        <section class="l-sec"><h2>🧱 Construis un nombre</h2>
          <p>Touche <b>+</b> et <b>−</b> pour ajouter ou enlever des blocs. Essaie de dépasser 9 unités… que se passe-t-il ?</p>
          <div class="nb-exp viz-box"></div>
          <div class="nb-ctl nb-pres"><span class="lab">Essaie :</span>${[0, 9, 47, 99, 100, 307, 347, 999].map((v) => `<button class="btn" data-go="${v}">${v}</button>`).join('')}<button class="btn yellow" data-go="rnd">🎲 Au hasard</button></div>
          ${tip("Quand tu as <b>10 unités</b>, tu les échanges contre <b>1 dizaine</b>. Quand tu as <b>10 dizaines</b>, tu les échanges contre <b>1 centaine</b>. C'est pour ça qu'on n'écrit jamais plus que 9 dans une colonne !")}
        </section>

        <section class="l-sec"><h2>🏠 Le tableau de numération</h2>
          <p>Chaque chiffre a sa place. Sa place dit ce qu'il vaut.</p>
          <div class="l-grid">
            <div class="l-tile"><div class="nb-brow" style="justify-content:center">${NB.flats(1, false)}</div><h3 class="nb-dc">1 centaine = 100</h3><p>une plaque de 100 petits cubes</p></div>
            <div class="l-tile"><div class="nb-brow" style="justify-content:center">${NB.rods(1)}</div><h3 class="nb-dd">1 dizaine = 10</h3><p>une barre de 10 petits cubes</p></div>
            <div class="l-tile"><div class="nb-brow" style="justify-content:center">${NB.cubes(1)}</div><h3 class="nb-du">1 unité = 1</h3><p>un seul petit cube</p></div>
          </div>
          <div class="l-tile" style="margin-top:12px">
            <div class="nb-big" style="font-size:3rem">${NB.colored(347)}</div>
            ${NB.tab([{ n: 347 }])}
            <p><b>3 centaines, 4 dizaines et 7 unités</b><br>347 = 300 + 40 + 7<br><i>trois cent quarante-sept</i> <button class="btn icon" data-say="trois cent quarante-sept">🔊</button></p>
          </div>
          ${tip("Le <b>zéro garde la place</b> ! Dans <b>307</b>, il n'y a pas de dizaines, mais on écrit quand même 0. Sans lui, on lirait 37.")}
          <div class="l-grid">
            ${[307, 370, 37].map((n) => `<div class="l-tile"><div class="nb-big">${NB.colored(n)}</div>${NB.tab([{ n }], { cols: 3 })}<p>${NB.decompWords(n)}</p></div>`).join('')}
          </div>
        </section>

        <section class="l-sec"><h2>🔁 Un nombre, plusieurs façons</h2>
          <p>Casse une dizaine en 10 unités : le nombre ne change pas ! Touche des blocs pour les colorier et compte.</p>
          <div class="nb-many viz-box"></div>
          <div class="l-grid" style="margin-top:12px">
            <div class="l-tile"><h3>47</h3><p>4 dizaines et 7 unités<br>3 dizaines et 17 unités<br>2 dizaines et 27 unités<br>47 unités</p></div>
            <div class="l-tile"><h3>347</h3><p>3 centaines, 4 dizaines et 7 unités<br>2 centaines, 14 dizaines et 7 unités<br>34 dizaines et 7 unités</p></div>
          </div>
        </section>

        <section class="l-sec"><h2>🐊 Comparer deux nombres</h2>
          <p>Change les nombres avec les boutons. Le crocodile a toujours faim : sa bouche s'ouvre vers le <b>plus grand</b> nombre.</p>
          <div class="nb-cmpt"></div>
          ${tip("Pour comparer, regarde d'abord les <b>centaines</b>. Si elles sont pareilles, regarde les <b>dizaines</b>. Puis les <b>unités</b>.", 'blue')}
        </section>

        <section class="l-sec"><h2>👀 Environ combien ?</h2>
          <p>Parfois, on n'a pas besoin du nombre exact. On fait une <b>estimation</b> : environ 10 ? environ 50 ? environ 100 ?</p>
          <div class="nb-estl viz-box"></div>
          <div class="nb-ctl"><button class="btn yellow nb-estnew">🎲 Une autre collection</button><button class="btn nb-estrev">🔍 Voir le nombre exact</button></div>
          <div class="nb-estans viz-status"></div>
          ${tip('Pour estimer, imagine des <b>paquets de 10</b>. Combien de paquets de 10 vois-tu à peu près ?', 'green')}
        </section>`;

      // --- Explorateur
      const exp = NB.builder(M.$('.nb-exp', el)!, { start: 124, tab: true, expanded: true });
      M.$('.nb-pres', el)!.onclick = (e) => {
        const b = M.closest(e, '[data-go]');
        if (!b) return;
        exp.set(b.dataset.go === 'rnd' ? M.rnd(1, 999) : Number(b.dataset.go));
        M.sfx.pop();
      };
      M.$$('[data-say]', el).forEach((b) => {
        b.onclick = () => M.say(b.dataset.say);
      });

      // --- Plusieurs façons
      NB.split(M.$('.nb-many', el)!, 47, { breakable: true, hint: 'Casse une dizaine : il y a toujours 47 cubes en tout !' });

      // --- Comparer
      const cmp: { a: number; b: number } = { a: 347, b: 374 };
      const cbox = M.$('.nb-cmpt', el)!;
      const side = (k: 'a' | 'b') => `<div class="nb-side"><div class="nb-big">${NB.colored(cmp[k])}</div>
          <div class="nb-steps">${[-100, -10, -1, 1, 10, 100].map((d) => `<button class="btn" data-k="${k}" data-d="${d}">${d > 0 ? '+' : '−'}${Math.abs(d)}</button>`).join('')}</div>
          ${NB.blocks(cmp[k], true)}</div>`;
      function drawCmp() {
        const { a, b } = cmp,
          s = NB.sym(a, b),
          A = NB.cdu(a),
          B = NB.cdu(b);
        const ca: Record<string, string> = {},
          cb: Record<string, string> = {};
        let why = `Les deux nombres sont pareils : <b>${a} = ${b}</b>.`;
        for (const k of ['c', 'd', 'u'] as const) {
          if (A[k] === B[k]) {
            ca[k] = cb[k] = 'same';
            continue;
          }
          ca[k] = A[k] > B[k] ? 'ok' : 'no';
          cb[k] = A[k] > B[k] ? 'no' : 'ok';
          const nm = { c: 'centaines', d: 'dizaines', u: 'unités' }[k];
          why = `${k !== 'c' ? `Les chiffres avant sont pareils. ` : ''}Aux <b>${nm}</b> : ${Math.max(A[k], B[k])} est plus grand que ${Math.min(A[k], B[k])}. Donc <b>${a} ${NB.symHtml(s)} ${b}</b> : ${s === '<' ? `${a} est plus petit que ${b}` : `${a} est plus grand que ${b}`}.`;
          break;
        }
        cbox.innerHTML = `<div class="nb-cmpgrid">${side('a')}<div class="nb-cmpsym">${NB.symHtml(s)}<small>🐊</small></div>${side('b')}</div>
          ${NB.tab(
            [
              { n: a, label: 'A', cls: ca },
              { n: b, label: 'B', cls: cb },
            ],
            { cols: 3 },
          )}
          <div class="callout green">${why}</div>
          <div class="nb-ctl" style="justify-content:center"><button class="btn yellow" data-rnd="1">🎲 Deux nombres au hasard</button><button class="btn" data-rnd="2">🎲 Deux nombres presque pareils</button></div>`;
      }
      cbox.onclick = (e) => {
        const r = M.closest(e, '[data-rnd]');
        if (r) {
          if (r.dataset.rnd === '2') {
            cmp.a = M.rnd(101, 989);
            const g = NB.cdu(cmp.a);
            cmp.b = M.pick([g.c * 100 + g.u * 10 + g.d, cmp.a + M.pick([-10, -1, 1, 10])]);
          } else {
            cmp.a = M.rnd(1, 999);
            cmp.b = M.rnd(1, 999);
          }
          M.sfx.pop();
          drawCmp();
          return;
        }
        const b = M.closest(e, '[data-k]');
        if (!b) return;
        const k = b.dataset.k === 'b' ? 'b' : 'a';
        cmp[k] = Math.min(999, Math.max(0, cmp[k] + Number(b.dataset.d)));
        M.sfx.tap();
        drawCmp();
      };
      drawCmp();

      // --- Estimer
      let estN = 0;
      const newEst = () => {
        estN = M.pick([M.rnd(8, 12), M.rnd(25, 35), M.rnd(45, 55), M.rnd(90, 110)]);
        NB.scatter(M.$('.nb-estl', el)!, estN, M.pick(['🐞', '🌼', '⭐', '🍓', '🐟']));
        M.$('.nb-estans', el)!.innerHTML = 'Environ combien ? Fais ton estimation dans ta tête…';
      };
      M.$('.nb-estnew', el)!.onclick = newEst;
      M.$('.nb-estrev', el)!.onclick = () => {
        const near = [10, 30, 50, 100].reduce((p, c) => (Math.abs(c - estN) < Math.abs(p - estN) ? c : p));
        M.$('.nb-estans', el)!.innerHTML = `Il y en a exactement <b>${estN}</b>. C'est <b>environ ${near}</b> !`;
        M.sfx.good();
      };
      newEst();
    },
  });

  /* =====================================================================
     La grille de 100
     ===================================================================== */
  const OBS: Record<string, string> = {
    color: 'Touche des cases pour les colorier. Peux-tu inventer une régularité ? (Touche encore « Colorier » pour changer de couleur.)',
    voisins: 'Touche une case pour voir ses voisins. Vers la droite : <b>+1</b>. Vers le bas : <b>+10</b>.',
    b2: 'Les bonds de <b>2</b> à partir de 0 tombent sur les nombres <b>pairs</b> : ils finissent tous par 0, 2, 4, 6 ou 8. Ça fait des colonnes !',
    b5: 'Les bonds de <b>5</b> font deux colonnes : les nombres qui finissent par <b>5</b> et ceux qui finissent par <b>0</b>.',
    b10: 'Les bonds de <b>10</b> font une seule colonne, tout à droite. Ils finissent tous par <b>0</b> : seul le chiffre des dizaines change !',
    pair: 'Les nombres <b>pairs</b> finissent par 0, 2, 4, 6 ou 8. On peut toujours les partager en deux parts égales, sans reste.',
    impair: 'Les nombres <b>impairs</b> finissent par 1, 3, 5, 7 ou 9. Quand on fait des paires, il en reste toujours un tout seul.',
  };
  M.registerLearn({
    id: 'grille-100',
    domain: 'nombres',
    title: 'La grille de 100',
    icon: '💯',
    short: 'Bonds de 2, 5, 10, pairs et impairs, régularités',
    intro: 'La grille de nombres cache plein de secrets ! Colorie, fais des bonds et découvre les régularités.',
    render(el) {
      el.innerHTML = `
        <section class="l-sec"><h2>💯 La grille de nombres</h2>
          <div class="nb-ctl"><button class="btn nb-prev" aria-label="Avant">◀</button><b class="nb-rlab"></b><button class="btn nb-next" aria-label="Après">▶</button></div>
          <div class="nb-ctl nb-modes">
            <button class="btn" data-m="color">🖍️ Colorier</button>
            <button class="btn" data-m="voisins">🔍 Voisins</button>
            <button class="btn" data-m="b2">Bonds de 2</button>
            <button class="btn" data-m="b5">Bonds de 5</button>
            <button class="btn" data-m="b10">Bonds de 10</button>
            <button class="btn" data-m="pair">👫 Pairs</button>
            <button class="btn" data-m="impair">🧍 Impairs</button>
            <button class="btn" data-m="clear">🧽 Effacer</button>
          </div>
          <div class="nb-g100 viz-box"></div>
          <div class="callout nb-obs"></div>
        </section>

        <section class="l-sec"><h2>🐸 Compter par bonds</h2>
          <p>Choisis un bond et regarde la grenouille sauter sur la droite numérique.</p>
          <div class="nb-ctl nb-bonds"><span class="lab">Bonds de</span>${[2, 5, 10, 100].map((s) => `<button class="btn" data-s="${s}">${s}</button>`).join('')}</div>
          <div class="nb-ctl nb-dirs"><button class="btn" data-dir="1">➡️ En avançant</button><button class="btn" data-dir="-1">⬅️ À rebours</button><button class="btn primary nb-go">▶ C'est parti !</button></div>
          <div class="nb-fline viz-box"></div>
          <div class="nb-seqout"></div>
        </section>

        <section class="l-sec"><h2>🔎 Les secrets de la grille</h2>
          <div class="l-grid">
            <div class="l-tile"><h3>➡️ +1</h3><p>Un pas vers la droite, c'est 1 de plus.</p></div>
            <div class="l-tile"><h3>⬇️ +10</h3><p>Un pas vers le bas, c'est 10 de plus. Le chiffre des unités ne change pas !</p></div>
            <div class="l-tile"><h3>⬅️ −1 · ⬆️ −10</h3><p>Vers la gauche, 1 de moins. Vers le haut, 10 de moins.</p></div>
          </div>
          ${tip("Après 100, la grille continue : 101, 102, 103… Utilise ◀ ▶ en haut pour voir les nombres jusqu'à 1000. Les régularités sont les mêmes !")}
        </section>`;

      // --- Grille
      let base = 0,
        mode = 'color',
        grid: ReturnType<typeof NB.grid> | null = null,
        ci = 0;
      const modeBtns = M.$$('.nb-modes [data-m]', el);
      const obs = M.$('.nb-obs', el)!;
      const COLS = ['k1', 'k2', 'k3', 'k4', 'k5'];
      function onTap(v: number, api: NbGridCtl) {
        if (mode === 'voisins') {
          api.clear();
          api.ring[v] = true;
          const row = (x: number) => Math.floor((x - 1) / 10);
          const parts: string[] = [];
          const nb: [number, string, string][] = [
            [1, 'À droite', 'k2'],
            [-1, 'À gauche', 'k2'],
            [10, 'En dessous', 'k3'],
            [-10, 'Au-dessus', 'k3'],
          ];
          nb.forEach(([d, name, c]) => {
            const w = v + d;
            if (w < base + 1 || w > base + 100) return;
            if (Math.abs(d) === 1 && row(w) !== row(v)) return;
            api.set(w, c);
            parts.push(`${name} : <b>${w}</b> (${d > 0 ? '+' : '−'}${Math.abs(d)})`);
          });
          api.set(v, 'k1');
          api.status(`<b>${v}</b> → ${parts.join(' · ')}`);
          return;
        }
        if (mode !== 'color') {
          mode = 'color';
          on(modeBtns, 'color', 'm');
          obs.innerHTML = '🦫 ' + OBS.color;
        }
        const cur = api.col[v];
        const i = COLS.indexOf(cur);
        if (cur && i === ci) api.col[v] = '';
        else api.col[v] = COLS[ci];
        api.status('');
      }
      function makeGrid() {
        if (grid) grid.stop();
        M.$('.nb-rlab', el)!.textContent = `${base + 1} à ${base + 100}`;
        M.$<HTMLButtonElement>('.nb-prev', el)!.disabled = base === 0;
        M.$<HTMLButtonElement>('.nb-next', el)!.disabled = base === 900;
        grid = NB.grid(M.$('.nb-g100', el)!, { from: base + 1, to: base + 100, onTap, hint: '' });
      }
      async function setMode(m: string) {
        const g = grid;
        if (!g) return;
        if (m === 'clear') {
          g.stop();
          g.clear();
          g.status('');
          g.render();
          mode = 'color';
          on(modeBtns, 'color', 'm');
          obs.innerHTML = '🦫 ' + OBS.color;
          return;
        }
        mode = m;
        on(modeBtns, m, 'm');
        obs.innerHTML = '🦫 ' + OBS[m];
        g.stop();
        g.clear();
        g.status('');
        g.render();
        if (m === 'color') {
          ci = (ci + 1) % COLS.length;
          return;
        }
        if (m === 'voisins') return;
        const all = M.range(base + 1, base + 100);
        if (m === 'pair' || m === 'impair') {
          all.forEach((v) => {
            if ((v % 2 === 0) === (m === 'pair')) g.set(v, m === 'pair' ? 'k2' : 'k3');
          });
          g.render();
          return;
        }
        const step = +m.slice(1);
        const seq = all.filter((v) => v % step === 0);
        await g.play(
          seq,
          step === 2 ? 'k2' : step === 5 ? 'k4' : 'k1',
          (v) => `Bonds de ${step} : <b>${v}</b>`,
          step === 2 ? 110 : step === 5 ? 200 : 380,
        );
      }
      M.$('.nb-modes', el)!.onclick = (e) => {
        const b = M.closest(e, '[data-m]');
        if (b) {
          M.sfx.tap();
          setMode(b.dataset.m ?? '');
        }
      };
      const moveRange = (d: number) => {
        const nb = base + d;
        if (nb < 0 || nb > 900) return;
        base = nb;
        M.sfx.hop();
        makeGrid();
        if (mode !== 'color' && mode !== 'voisins') setMode(mode);
      };
      M.$('.nb-prev', el)!.onclick = () => moveRange(-100);
      M.$('.nb-next', el)!.onclick = () => moveRange(100);
      makeGrid();
      on(modeBtns, 'color', 'm');
      obs.innerHTML = '🦫 ' + OBS.color;

      // --- Bonds sur la droite
      let bond = 10,
        dir = 1,
        tok = 0;
      const bondBtns = M.$$('.nb-bonds [data-s]', el),
        dirBtns = M.$$('.nb-dirs [data-dir]', el);
      const lineFor = (s: number): NumberLineOpts =>
        s === 2
          ? { lo: 0, hi: 20 }
          : s === 5
            ? { lo: 0, hi: 50 }
            : s === 10
              ? { lo: 0, hi: 100 }
              : { lo: 0, hi: 1000, labelEvery: 100, tickEvery: 50 };
      let line: ReturnType<typeof M.viz.numberLine> | null = null;
      function makeLine() {
        tok++;
        const L = lineFor(bond);
        line = M.viz.numberLine(NB.mount(M.$('.nb-fline', el)!), Object.assign({ start: dir > 0 ? L.lo : L.hi, interactive: false }, L));
        M.$('.nb-seqout', el)!.textContent = String(dir > 0 ? L.lo : L.hi);
      }
      async function play() {
        makeLine();
        const t = tok,
          L = lineFor(bond),
          out = M.$('.nb-seqout', el)!;
        const seq: number[] = [];
        let v = dir > 0 ? L.lo : L.hi;
        seq.push(v);
        for (;;) {
          v += dir * bond;
          if (v < L.lo || v > L.hi) break;
          await M.sleep(350);
          if (t !== tok || !el.isConnected) return;
          await line?.hop(v);
          if (t !== tok || !el.isConnected) return;
          seq.push(v);
          out.textContent = seq.join(', ');
          M.say(String(v));
        }
      }
      M.$('.nb-bonds', el)!.onclick = (e) => {
        const b = M.closest(e, '[data-s]');
        if (!b) return;
        bond = Number(b.dataset.s);
        on(bondBtns, bond, 's');
        makeLine();
      };
      M.$('.nb-dirs', el)!.onclick = (e) => {
        if (M.closest(e, '.nb-go')) {
          play();
          return;
        }
        const b = M.closest(e, '[data-dir]');
        if (!b) return;
        dir = Number(b.dataset.dir);
        on(dirBtns, dir, 'dir');
        makeLine();
      };
      on(bondBtns, bond, 's');
      on(dirBtns, dir, 'dir');
      makeLine();
      M.onCleanup(() => {
        tok++;
        if (grid) grid.stop();
      });
    },
  });

  /* =====================================================================
     Les fractions
     ===================================================================== */
  const SHAPES: [NbShapeKind, string][] = [
    ['pizza', '🍕 Pizza'],
    ['tab', '🍫 Tablette'],
    ['carre', '⬜ Carré'],
  ];
  const WHAT: Record<number, string> = { 2: 'La moitié', 3: 'Le tiers', 4: 'Le quart' };
  M.registerLearn({
    id: 'fractions',
    domain: 'nombres',
    title: 'Les fractions',
    icon: '🍕',
    short: 'Demi, tiers, quart, parts égales',
    intro:
      "Une fraction, c'est une partie d'un tout partagé en parts égales. Partage des pizzas, des tablettes de chocolat et des collections !",
    render(el) {
      const svgTile = (kind: NbShapeKind, n: number, k: number, name: string, extra = '', variant = 0) =>
        `<div class="l-tile"><div class="nb-tile-svg">${NB.shapeSvg(kind, NB.weights(n, true), M.range(0, k - 1), { variant })}</div><h3>${name}</h3><p>${extra}</p></div>`;
      el.innerHTML = `
        <section class="l-sec"><h2>✂️ Partage et colorie</h2>
          <p>Choisis une forme et le nombre de parts. Touche les parts pour les colorier.</p>
          <div class="nb-ctl nb-fshape"><span class="lab">Forme :</span>${SHAPES.map(([k, l]) => `<button class="btn" data-shape="${k}">${l}</button>`).join('')}</div>
          <div class="nb-ctl nb-fparts"><span class="lab">Parts :</span>${[2, 3, 4].map((n) => `<button class="btn" data-n="${n}">${n}</button>`).join('')}</div>
          <div class="nb-ctl nb-feq"><button class="btn" data-eq="1">⚖️ Parts égales</button><button class="btn" data-eq="0">🙃 Parts pas égales</button><button class="btn nb-fvar">🔄 Autre découpage</button></div>
          <div class="nb-ftool viz-box"></div>
          <div class="nb-fname"></div>
        </section>

        <section class="l-sec"><h2>📖 Les mots des fractions</h2>
          <div class="l-grid">
            ${svgTile('pizza', 2, 1, 'un demi', "2 parts égales, 1 coloriée.<br>Un demi, c'est <b>la moitié</b> !")}
            ${svgTile('tab', 3, 1, 'un tiers', '3 parts égales, 1 coloriée.')}
            ${svgTile('carre', 4, 1, 'un quart', '4 parts égales, 1 coloriée.', 1)}
          </div>
          <div class="l-grid" style="margin-top:12px">
            ${svgTile('pizza', 3, 2, 'deux tiers', '3 parts égales, 2 coloriées.')}
            ${svgTile('tab', 4, 3, 'trois quarts', '4 parts égales, 3 coloriées.')}
            ${svgTile('carre', 2, 2, 'deux demis', "Tout est colorié : c'est le tout !")}
          </div>
          ${tip("Plus il y a de parts, plus chaque part est <b>petite</b>. Un quart de pizza est plus petit qu'un demi !")}
        </section>

        <section class="l-sec"><h2>⚖️ Parts égales ou pas ?</h2>
          <div class="l-grid">
            <div class="l-tile"><div class="nb-tile-svg">${NB.shapeSvg('pizza', [1, 1, 1, 1], [0])}</div><h3>✔️ Parts égales</h3><p>Chaque part a la même grandeur : c'est <b>un quart</b>.</p></div>
            <div class="l-tile"><div class="nb-tile-svg">${NB.shapeSvg('pizza', [1, 2, 2, 3], [0])}</div><h3>✖️ Pas égales</h3><p>Les parts n'ont pas la même grandeur : ce n'est <b>pas</b> un quart !</p></div>
            <div class="l-tile"><div class="nb-tile-svg">${NB.shapeSvg('carre', [1, 1], [0], { variant: 1 })}</div><h3>✔️ Parts égales</h3><p>Deux triangles pareils : chacun est <b>un demi</b> du carré.</p></div>
          </div>
          ${tip('Pour parler de demi, de tiers ou de quart, il faut que toutes les parts soient <b>égales</b>, comme quand on partage un gâteau de façon juste.')}
        </section>

        <section class="l-sec"><h2>🍓 Partager une collection</h2>
          <p>On peut aussi prendre une fraction d'une collection d'objets. Touche les fraises pour les partager dans les assiettes.</p>
          <div class="nb-ctl nb-ctot"><span class="lab">Fraises :</span>${[6, 8, 12].map((t) => `<button class="btn" data-t="${t}">${t}</button>`).join('')}</div>
          <div class="nb-ctl nb-cn"><span class="lab">Parts :</span>${[2, 3, 4].map((n) => `<button class="btn" data-n="${n}">${n}</button>`).join('')}<button class="btn yellow nb-cshow">👀 Montre-moi</button></div>
          <div class="nb-coll2 viz-box"></div>
          <div class="nb-fname nb-cres"></div>
          ${tip("<b>La moitié</b> de 8, c'est 4, car 8 partagé en 2 parts égales donne 4 dans chaque part.", 'green')}
        </section>`;

      // --- Outil de partage d'une forme
      const S: { kind: NbShapeKind; n: number; eq: boolean; variant: number } = { kind: 'pizza', n: 4, eq: true, variant: 0 };
      const nameBox = M.$('.nb-fname', el)!;
      function showName(onArr: readonly unknown[]) {
        const k = onArr.length,
          n = S.n;
        let h: string;
        if (!S.eq)
          h =
            '🙃 Les parts ne sont <b style="font-size:1.1em">pas égales</b> : on ne peut pas dire « un ' +
            ({ 2: 'demi', 3: 'tiers', 4: 'quart' } as Record<number, string>)[n] +
            ' ». Pour une fraction, il faut des parts égales !';
        else if (!k) h = 'Touche une part pour la colorier !';
        else {
          const nm = NB.fracName(k, n);
          h = `${k} ${pl(k, 'part')} ${pl(k, 'coloriée')} sur ${n} parts égales : <b>${nm}</b>`;
          if (k === n) h += " — c'est le tout ! 🎉";
          else if (2 * k === n) h += " — c'est la moitié !";
          h += ` <button class="btn icon nb-fsay" data-say="${nm}">🔊</button>`;
        }
        nameBox.innerHTML = h;
      }
      nameBox.onclick = (e) => {
        const b = M.closest(e, '.nb-fsay');
        if (b) M.say(b.dataset.say);
      };
      function drawShape() {
        on(M.$$('.nb-fshape [data-shape]', el), S.kind, 'shape');
        on(M.$$('.nb-fparts [data-n]', el), S.n, 'n');
        on(M.$$('.nb-feq [data-eq]', el), S.eq ? 1 : 0, 'eq');
        const varBtn = M.$('.nb-fvar', el)!;
        varBtn.hidden = !(S.kind === 'carre' && S.eq && S.n !== 3);
        NB.fracTool(M.$('.nb-ftool', el)!, {
          kind: S.kind,
          weights: NB.weights(S.n, S.eq),
          variant: S.variant,
          status: (k: number) => `Parts coloriées : <b>${k}</b> sur <b>${S.n}</b>`,
          onChange: showName,
        });
        showName([]);
      }
      M.$('.nb-fshape', el)!.onclick = (e) => {
        const b = M.closest(e, '[data-shape]');
        if (b) {
          S.kind = SHAPES.find(([k]) => k === b.dataset.shape)?.[0] ?? S.kind;
          S.variant = 0;
          M.sfx.tap();
          drawShape();
        }
      };
      M.$('.nb-fparts', el)!.onclick = (e) => {
        const b = M.closest(e, '[data-n]');
        if (b) {
          S.n = Number(b.dataset.n);
          S.variant = 0;
          M.sfx.tap();
          drawShape();
        }
      };
      M.$('.nb-feq', el)!.onclick = (e) => {
        if (M.closest(e, '.nb-fvar')) {
          S.variant = (S.variant + 1) % (S.n === 4 ? 3 : 2);
          M.sfx.tap();
          drawShape();
          return;
        }
        const b = M.closest(e, '[data-eq]');
        if (b) {
          S.eq = b.dataset.eq === '1';
          M.sfx.tap();
          drawShape();
        }
      };
      drawShape();

      // --- Fraction d'une collection
      const C = { t: 8, n: 2 };
      const res = M.$('.nb-cres', el)!;
      let share: ReturnType<typeof NB.share> | null = null;
      function drawColl() {
        on(M.$$('.nb-ctot [data-t]', el), C.t, 't');
        M.$$<HTMLButtonElement>('.nb-cn [data-n]', el).forEach((b) => {
          b.disabled = C.t % Number(b.dataset.n) !== 0;
          b.classList.toggle('on', Number(b.dataset.n) === C.n);
        });
        share = NB.share(NB.mount(M.$('.nb-coll2', el)!), C.t, C.n, '🍓', {
          hint: `Touche une 🍓 : elle va dans l'assiette qui en a le moins. Partage les ${C.t} fraises en ${C.n} parts égales.`,
          onChange: (left: number, counts: number[]) => {
            if (left) {
              res.innerHTML = `Il reste ${left} ${pl(left, 'fraise')} à partager…`;
              return;
            }
            const m = counts[0];
            res.innerHTML = `${WHAT[C.n]} de ${C.t}, c'est <b>${m}</b> ! <button class="btn icon nb-fsay" data-say="${WHAT[C.n]} de ${C.t}, c'est ${m}">🔊</button>`;
          },
        });
      }
      res.onclick = (e) => {
        const b = M.closest(e, '.nb-fsay');
        if (b) M.say(b.dataset.say);
      };
      M.$('.nb-ctot', el)!.onclick = (e) => {
        const b = M.closest(e, '[data-t]');
        if (!b) return;
        C.t = Number(b.dataset.t);
        if (C.t % C.n) C.n = 2;
        M.sfx.tap();
        drawColl();
      };
      M.$('.nb-cn', el)!.onclick = (e) => {
        if (M.closest(e, '.nb-cshow')) {
          if (share) share.showMe();
          return;
        }
        const b = M.closest<HTMLButtonElement>(e, '[data-n]');
        if (!b || b.disabled) return;
        C.n = Number(b.dataset.n);
        M.sfx.tap();
        drawColl();
      };
      drawColl();
    },
  });
})();
