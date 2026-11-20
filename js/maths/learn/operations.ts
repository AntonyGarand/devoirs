/* =====================================================================
   learn/operations.js — pages « Apprendre » du domaine Les opérations
   Réutilise M.opStrat et M.opViz (définis dans js/skills/operations.js)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const D = 'operations';
  type OpStoryKind = 'ajout' | 'retrait' | 'reunion' | 'comparaison';
  /** Histoire animée d'une section du sens des opérations. */
  interface OpStory {
    e: string;
    a: number;
    b: number;
    p: OpPerson;
    q: OpPerson;
    txt: string;
    ans: number;
    eqTxt: string;
    done: boolean;
  }
  /** Droite de la page « La droite numérique ». */
  interface OpRange {
    lo: number;
    hi: number;
    buttons: number[];
    labelEvery?: number;
    label: string;
  }
  const MINUS = '−';
  const css = (str: string) => {
    try {
      M.css(str);
    } catch (e) {
      /* hors navigateur */
    }
  };

  css(`
  .op-l-frames { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; justify-content: center; margin: 10px 0 }
  .op-l-frames .frame .cell { cursor: default }
  .op-l-frames .cell.op-l-x { outline: 4px solid var(--yel); outline-offset: 1px }
  .op-l-frames .cell.op-l-new { animation: pop .4s }
  .op-l-mirror { font-size: 2rem }
  .op-l-eq { font-size: 2rem; font-weight: 900; text-align: center; margin: 10px 0; min-height: 1.4em }
  .op-l-eq .op-l-q { color: #c7c2b4 }
  .op-l-eq .op-l-g { color: var(--C) }
  .op-l-stp { display: inline-flex; align-items: center; gap: 6px; background: #fbfaf6; border: 3px solid var(--line); border-radius: 999px; padding: 4px 8px; font-weight: 800 }
  .op-l-stp b { min-width: 2.2ch; text-align: center; font-size: 1.4rem }
  .op-l-stp .btn { padding: 2px 12px; font-size: 1.2rem }
  .op-l-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0 }
  .op-l-chips .chip { cursor: pointer }
  .op-l-chips .chip.on { background: var(--ink); color: #fff; border-color: var(--ink) }
  .op-l-box { background: #fbfaf6; border: 3px solid var(--line); border-radius: 18px; padding: 12px; margin-top: 8px; overflow-x: auto }
  .op-l-story { font-size: 1.15rem; font-weight: 700; margin: 6px 0 }
  .op-l-stage { min-height: 110px; background: #fbfaf6; border: 3px solid var(--line); border-radius: 18px; padding: 12px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center }
  .op-l-grp { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; max-width: 280px; padding: 8px; border-radius: 14px; border: 3px dashed transparent }
  .op-l-grp.boxed { border-color: #c7c2b4; background: #fff }
  .op-l-it { display: inline-flex; align-items: center; justify-content: center; font-size: 28px; width: 40px; height: 40px; border-radius: 10px; position: relative }
  .op-l-it.kA { background: var(--Aa) } .op-l-it.kB { background: var(--Bb) }
  .op-l-it.in { animation: opLIn .5s ease-out }
  .op-l-it.out { animation: opLOut .6s ease-in forwards }
  .op-l-it.gone { opacity: .25 }
  .op-l-it.gone::after { content: "✕"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--red); font-size: 30px; font-weight: 900 }
  .op-l-it.pair { background: var(--Cc) }
  .op-l-it.extra { background: #fff6d6; outline: 3px solid var(--yel); animation: pop .4s }
  @keyframes opLIn { from { transform: translateX(90px) scale(.4); opacity: 0 } }
  @keyframes opLOut { to { transform: translateY(-70px) rotate(25deg); opacity: 0 } }
  .op-l-cmp { display: inline-grid; gap: 4px 3px; align-items: center; max-width: 100%; overflow-x: auto }
  .op-l-cmp .nm { font-weight: 800; padding-right: 8px; white-space: nowrap }
  .op-l-ans { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 10px }
  .op-l-ans .btn { min-width: 64px; font-size: 1.3rem }
  .op-l-ans .btn.right { background: var(--Cc); border-color: var(--C) }
  .op-l-ans .btn.wrong { background: #ffe5e5; border-color: var(--red); animation: shake .4s }
  .op-l-tag { display: inline-block; background: #fff6d6; border-radius: 999px; padding: 2px 10px; font-weight: 800; font-size: .95rem; margin-left: 6px }
  .op-l-status { font-weight: 800; font-size: 1.15rem; min-height: 1.4em; margin-top: 8px }
  .op-l-status.good { color: var(--C) }
  .op-l-arr { display: inline-grid; gap: 4px; align-items: center; padding: 10px; background: #fff; border: 3px solid var(--line); border-radius: 14px }
  .op-l-arr .op-l-it { width: 36px; height: 36px; font-size: 24px; cursor: pointer }
  .op-l-arr .op-l-it.hl { background: #fff6d6; outline: 3px solid var(--yel) }
  .op-l-arr .rs { font-weight: 900; color: var(--C); padding-left: 8px; min-width: 2.4em }
  .op-l-pal { display: flex; flex-wrap: wrap; gap: 6px }
  .op-l-pal .btn { font-size: 1.6rem; padding: 4px 10px }
  .op-l-slots { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; min-height: 56px }
  .op-l-slot { width: 52px; height: 52px; border: 3px dashed #c7c2b4; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; background: #fff }
  .op-l-strip { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px }
  .op-l-strip .op-term { animation: pop .35s }
  .op-l-strip .op-l-arrow { font-weight: 900; color: var(--C); font-size: .95rem }
  .op-l-strip .op-term.band0 { background: var(--Aa) } .op-l-strip .op-term.band1 { background: var(--Bb) }
  .op-l-cards { display: flex; gap: 10px; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 900 }
  .op-l-card { background: #fff; border: 4px solid var(--line); border-radius: 16px; padding: 4px 16px; transition: transform .4s }
  .op-l-card.big { border-color: var(--C) }
  `);

  /* ------------------------------------------------------------------
     Outils
     ------------------------------------------------------------------ */
  const rnd = M.rnd,
    pick = M.pick;
  interface OpPerson {
    n: string;
    il: string;
    Il: string;
  }
  const NAMES: [string, 'f' | 'm'][] = [
    ['Léa', 'f'],
    ['Félix', 'm'],
    ['Florence', 'f'],
    ['Thomas', 'm'],
    ['Zoé', 'f'],
    ['William', 'm'],
    ['Rosalie', 'f'],
    ['Samuel', 'm'],
    ['Emma', 'f'],
    ['Olivier', 'm'],
    ['Alice', 'f'],
    ['Jacob', 'm'],
  ];
  function person(not?: OpPerson): OpPerson {
    let p: [string, 'f' | 'm'],
      g = 0;
    do {
      p = pick(NAMES);
    } while (p[0] === not?.n && g++ < 50);
    const f = p[1] === 'f';
    return { n: p[0], il: f ? 'elle' : 'il', Il: f ? 'Elle' : 'Il' };
  }
  const OBJ: [string, string][] = [
    ['🍎', 'pommes'],
    ['🧤', 'mitaines'],
    ['🐟', 'poissons'],
    ['🍪', 'biscuits'],
    ['⭐', 'autocollants'],
    ['🃏', 'cartes de hockey'],
    ['🍁', "feuilles d'érable"],
  ];
  const castor = (t: string, cls = '') => `<div class="callout ${cls}">🦫 ${t}</div>`;
  const alive = (el: Element, tok: number, get: () => number) => el.isConnected && tok === get();
  const fireClick = (fn: (e: MouseEvent) => void) => (e: MouseEvent) => {
    try {
      fn(e);
    } catch (err) {
      console.error(err);
    }
  };

  /** Ajoute une section et appelle init(sec). */
  function section(root: HTMLElement, title: string, html: string, init?: (sec: HTMLElement) => void) {
    const sec = document.createElement('section');
    sec.className = 'l-sec';
    sec.innerHTML = `<h2>${title}</h2>${html}`;
    root.appendChild(sec);
    try {
      if (init) init(sec);
    } catch (e) {
      console.error('op learn', title, e);
    }
    return sec;
  }
  /** Sélecteur −/+ : html ; on lit/écrit la valeur via data-v. */
  const stepper = (key: string, label: string, v: number) =>
    `<span class="op-l-stp" data-k="${key}">${label} <button class="btn" data-d="-1">−</button><b>${v}</b><button class="btn" data-d="1">+</button></span>`;
  /** Branche les sélecteurs d'une section. state[key] borné par lim[key] = [min,max]. */
  function wireSteppers<K extends string>(
    sec: HTMLElement,
    state: Record<K, number>,
    lim: Record<K, [number, number]>,
    onChange: (k: K) => void,
  ) {
    sec.addEventListener(
      'click',
      fireClick((e) => {
        const b = M.closest(e, '.op-l-stp [data-d]');
        if (!b || !sec.contains(b)) return;
        const box = b.closest<HTMLElement>('.op-l-stp')!,
          key = box.dataset.k ?? '';
        if (!(key in state)) return;
        const k = key as K;
        const [mn, mx] = lim[k];
        const v = Math.max(mn, Math.min(mx, state[k] + Number(b.dataset.d)));
        if (v === state[k]) return;
        state[k] = v;
        M.$('b', box)!.textContent = String(v);
        M.sfx.tap();
        onChange(k);
      }),
    );
  }
  /** Cadre de dix statique. cells : 10 codes 'A' | 'B' | '' (+ suffixes x = surligné, n = nouveau) */
  function frame(cells: readonly string[]) {
    let h = '<div class="frame">';
    for (let i = 0; i < 10; i++) {
      const c = cells[i] || '';
      const k = c.charAt(0);
      const cls = (k ? ' k' + k : '') + (c.includes('x') ? ' op-l-x' : '') + (c.includes('n') ? ' op-l-new' : '');
      h += `<div class="cell${cls}">${k ? '<span class="dot"></span>' : ''}</div>`;
    }
    return h + '</div>';
  }
  /** Remplit un cadre avec n jetons ; mirror = remplit de droite à gauche. */
  function fillFrame(n: number, kind: string, mirror?: boolean) {
    const cells: string[] = Array(10).fill('');
    for (let i = 0; i < Math.min(10, n); i++) {
      const row = Math.floor(i / 5),
        col = i % 5;
      cells[row * 5 + (mirror ? 4 - col : col)] = kind;
    }
    return cells;
  }
  const strat = (): {
    add(a: number, b: number): { name: string; txt: string };
    sub(a: number, b: number): { name: string; txt: string };
  } =>
    M.opStrat || {
      add: (a: number, b: number) => ({ name: '', txt: `${a} + ${b} = ${a + b}` }),
      sub: (a: number, b: number) => ({ name: '', txt: `${a} − ${b} = ${a - b}` }),
    };

  /* ==================================================================
     Page 1 — Les stratégies de calcul
     ================================================================== */
  M.registerLearn({
    id: 'strategies',
    domain: D,
    title: 'Les stratégies de calcul',
    icon: '🧠',
    short: 'Doubles, faire 10, passer par 10, addition à trou…',
    intro:
      'Pour calculer vite, on ne fait pas que réciter ! On utilise des trucs : les doubles, les amis de 10, passer par 10… Choisis le bon truc selon les nombres.',
    render(el) {
      /* --- Doubles --- */
      section(
        el,
        '🪞 Les doubles',
        `<p>Un double, c'est un nombre plus lui-même. Comme dans un miroir !</p>
        <div class="row">${stepper('n', 'Nombre :', 4)}</div>
        <div class="op-l-frames"></div><div class="op-l-eq"></div>
        <div class="op-l-chips"></div>
        ${castor("Les doubles sont des amis précieux : quand tu les connais par cœur, tu peux trouver plein d'autres calculs !")}`,
        (sec) => {
          const st = { n: 4 };
          const draw = () => {
            const n = st.n;
            const fr = M.$('.op-l-frames', sec)!;
            fr.innerHTML = frame(fillFrame(n, 'A')) + '<span class="op-l-mirror">🪞</span>' + frame(fillFrame(n, 'B', true));
            M.$('.op-l-eq', sec)!.innerHTML = `${n} + ${n} = <span class="op-l-g">${2 * n}</span>`;
            M.$('.op-l-chips', sec)!.innerHTML = M.range(1, 10)
              .map((i) => `<span class="chip ${i === n ? 'on' : ''}" data-n="${i}">${i} + ${i}</span>`)
              .join('');
          };
          wireSteppers(sec, st, { n: [1, 10] }, draw);
          M.$('.op-l-chips', sec)!.addEventListener('click', (e) => {
            const c = M.closest(e, '.chip');
            if (!c) return;
            st.n = Number(c.dataset.n);
            M.$('.op-l-stp b', sec)!.textContent = String(st.n);
            M.sfx.tap();
            draw();
          });
          draw();
        },
      );

      /* --- Presque-doubles --- */
      section(
        el,
        '👯 Les presque-doubles',
        `<p>Quand deux nombres se suivent, comme 6 et 7, pense au double du plus petit… puis ajoute 1 !</p>
        <div class="row">${stepper('n', 'Petit nombre :', 6)}</div>
        <div class="op-l-frames"></div><div class="op-l-eq"></div>
        ${castor("Le jeton surligné en jaune, c'est le « + 1 » de plus que le double.")}`,
        (sec) => {
          const st = { n: 6 };
          const draw = () => {
            const n = st.n;
            const right = fillFrame(n + 1, 'B', true);
            // le jeton de trop est le dernier placé
            const row = Math.floor(n / 5),
              col = n % 5;
            right[row * 5 + (4 - col)] = 'Bx';
            M.$('.op-l-frames', sec)!.innerHTML = frame(fillFrame(n, 'A')) + '<span class="op-l-mirror">+</span>' + frame(right);
            M.$('.op-l-eq', sec)!.innerHTML = `${n} + ${n + 1} = ${n} + ${n} + 1 = <span class="op-l-g">${2 * n + 1}</span>`;
          };
          wireSteppers(sec, st, { n: [1, 9] }, draw);
          draw();
        },
      );

      /* --- Faire 10 --- */
      section(
        el,
        '🔟 Faire 10',
        `<p>Avec 8 + 5, on déplace des jetons pour <b>remplir le premier cadre</b>. Un cadre plein, c'est 10 !</p>
        <div class="op-l-eq op-l-top"></div><div class="op-l-frames"></div><div class="op-l-eq op-l-res"></div>
        <div class="row"><button class="btn blue op-l-go">▶ Faire 10</button><button class="btn op-l-new">🎲 Autres nombres</button></div>
        ${castor("Les amis de 10 : 1 et 9, 2 et 8, 3 et 7, 4 et 6, 5 et 5. Ils t'aident à savoir combien il manque pour faire 10.")}`,
        (sec) => {
          let a = 8,
            b = 5,
            f1: string[] = [],
            f2: string[] = [],
            tok = 0;
          const reset = () => {
            f1 = fillFrame(a, 'A');
            f2 = fillFrame(b, 'B');
            M.$('.op-l-top', sec)!.innerHTML = `${a} + ${b} = <span class="op-l-q">?</span>`;
            M.$('.op-l-res', sec)!.innerHTML = '';
            draw();
          };
          const draw = () => {
            M.$('.op-l-frames', sec)!.innerHTML = frame(f1) + frame(f2);
          };
          async function go() {
            const t = ++tok;
            reset();
            const need = 10 - a;
            for (let k = 0; k < need; k++) {
              await M.sleep(550);
              if (!alive(sec, t, () => tok)) return;
              let last = -1;
              f2.forEach((c, i) => {
                if (c) last = i;
              });
              if (last < 0) break;
              f2[last] = '';
              const empty = f1.indexOf('');
              f1 = f1.map((c) => c.replace('n', ''));
              f1[empty] = 'Bn';
              M.sfx.tap();
              draw();
            }
            await M.sleep(400);
            if (!alive(sec, t, () => tok)) return;
            const rest = b - need;
            M.$('.op-l-res', sec)!.innerHTML = `${a} + ${need} = 10, puis 10 + ${rest} = <span class="op-l-g">${a + b}</span>`;
            M.sfx.good();
          }
          M.$('.op-l-go', sec)!.onclick = () => go();
          M.$('.op-l-new', sec)!.onclick = () => {
            tok++;
            a = rnd(6, 9);
            b = rnd(11 - a, 9);
            M.sfx.tap();
            reset();
          };
          reset();
        },
      );

      /* --- Passer par 10 sur la droite --- */
      section(
        el,
        '🐸 Passer par 10',
        `<p>Sur la droite numérique, la grenouille fait <b>un bond jusqu'à 10</b>, puis un autre bond pour le reste.</p>
        <div class="op-l-eq op-l-top"></div><div class="op-l-box"><div class="op-l-nl"></div></div><div class="op-l-eq op-l-res"></div>
        <div class="row"><button class="btn blue op-l-go">▶ Montre-moi</button><button class="btn op-l-new">🎲 Autres nombres</button></div>
        ${castor("Ça marche aussi pour reculer : 13 − 5, c'est 13 − 3 = 10, puis 10 − 2 = 8.")}`,
        (sec) => {
          let a = 7,
            b = 6,
            api: NumberLineCtl | null = null,
            tok = 0;
          const mount = () => {
            M.$('.op-l-top', sec)!.innerHTML = `${a} + ${b} = <span class="op-l-q">?</span>`;
            M.$('.op-l-res', sec)!.innerHTML = '';
            api = M.viz.numberLine(M.$('.op-l-nl', sec)!, { lo: 0, hi: 20, start: a, interactive: false });
          };
          async function go() {
            const t = ++tok;
            mount();
            await M.sleep(300);
            if (!alive(sec, t, () => tok)) return;
            await api?.hop(10);
            await M.sleep(250);
            if (!alive(sec, t, () => tok)) return;
            await api?.hop(a + b);
            if (!alive(sec, t, () => tok)) return;
            M.$('.op-l-res', sec)!.innerHTML = `${a} + ${10 - a} = 10, puis 10 + ${b - (10 - a)} = <span class="op-l-g">${a + b}</span>`;
            M.sfx.good();
          }
          M.$('.op-l-go', sec)!.onclick = () => go();
          M.$('.op-l-new', sec)!.onclick = () => {
            tok++;
            a = rnd(5, 9);
            b = rnd(11 - a, 9);
            M.sfx.tap();
            mount();
          };
          mount();
        },
      );

      /* --- Compter à partir du plus grand --- */
      section(
        el,
        '🏁 Compter à partir du plus grand',
        `<p>Pour 2 + 9, ne compte pas 9 bonds ! <b>Échange</b> les nombres et pars du plus grand : 9… 10, 11.</p>
        <div class="op-l-cards"></div><div class="op-l-box"><div class="op-l-nl"></div></div><div class="op-l-eq op-l-res"></div>
        <div class="row"><button class="btn op-l-swap">🔄 Échanger</button><button class="btn blue op-l-go">▶ Compter</button><button class="btn op-l-new">🎲 Autres nombres</button></div>
        ${castor("Dans une addition, l'ordre ne change pas la réponse : 2 + 9 = 9 + 2. Alors, commence toujours par le plus grand !")}`,
        (sec) => {
          let x = 2,
            y = 9,
            api: NumberLineCtl | null = null,
            tok = 0;
          const mount = () => {
            const big = Math.max(x, y);
            M.$('.op-l-cards', sec)!.innerHTML =
              `<span class="op-l-card ${x >= y ? 'big' : ''}">${x}</span>+<span class="op-l-card ${y > x ? 'big' : ''}">${y}</span>`;
            M.$('.op-l-res', sec)!.innerHTML = '';
            api = M.viz.numberLine(M.$('.op-l-nl', sec)!, {
              lo: 0,
              hi: 20,
              start: x >= y ? x : y,
              interactive: false,
              hint: `On part de ${big}, le plus grand.`,
            });
          };
          async function go() {
            const t = ++tok;
            mount();
            const big = Math.max(x, y),
              small = Math.min(x, y);
            const said: number[] = [];
            for (let i = 1; i <= small; i++) {
              await M.sleep(250);
              if (!alive(sec, t, () => tok)) return;
              await api?.hop(big + i);
              said.push(big + i);
              M.$('.op-l-res', sec)!.innerHTML = `${big}… ${said.join(', ')}`;
            }
            if (!alive(sec, t, () => tok)) return;
            M.$('.op-l-res', sec)!.innerHTML = `${big}… ${said.join(', ')} → ${x} + ${y} = <span class="op-l-g">${x + y}</span>`;
            M.sfx.good();
          }
          M.$('.op-l-swap', sec)!.onclick = () => {
            tok++;
            [x, y] = [y, x];
            M.sfx.tap();
            mount();
          };
          M.$('.op-l-go', sec)!.onclick = () => go();
          M.$('.op-l-new', sec)!.onclick = () => {
            tok++;
            const s = rnd(1, 3),
              g = rnd(6, 15);
            [x, y] = Math.random() < 0.5 ? [s, g] : [g, s];
            M.sfx.tap();
            mount();
          };
          mount();
        },
      );

      /* --- Soustraction = addition à trou --- */
      section(
        el,
        "🕳️ La soustraction, c'est une addition à trou",
        `<p>Pour 13 − 8, demande-toi : <b>8 + combien = 13 ?</b> La grenouille part de 8 et avance jusqu'à 13.</p>
        <div class="op-l-eq op-l-top"></div><div class="op-l-box"><div class="op-l-nl"></div></div><div class="op-l-eq op-l-res"></div>
        <div class="row"><button class="btn blue op-l-go">▶ Montre-moi</button><button class="btn op-l-new">🎲 Autres nombres</button></div>
        ${castor("Quand les deux nombres sont proches, comme 13 − 8 ou 15 − 9, l'addition à trou est le truc le plus rapide !")}`,
        (sec) => {
          let a = 13,
            b = 8,
            api: NumberLineCtl | null = null,
            tok = 0;
          const mount = () => {
            M.$('.op-l-top', sec)!.innerHTML =
              `${a} − ${b} = <span class="op-l-q">?</span> &nbsp;➜&nbsp; ${b} + <span class="op-l-q">?</span> = ${a}`;
            M.$('.op-l-res', sec)!.innerHTML = '';
            api = M.viz.numberLine(M.$('.op-l-nl', sec)!, { lo: 0, hi: 20, start: b, interactive: false });
          };
          async function go() {
            const t = ++tok;
            mount();
            await M.sleep(300);
            if (!alive(sec, t, () => tok)) return;
            if (b < 10 && a > 10) {
              await api?.hop(10);
              await M.sleep(250);
              if (!alive(sec, t, () => tok)) return;
            }
            await api?.hop(a);
            if (!alive(sec, t, () => tok)) return;
            const parts = b < 10 && a > 10 ? `${10 - b} + ${a - 10} = ${a - b}` : `${a - b}`;
            M.$('.op-l-res', sec)!.innerHTML = `On a avancé de ${parts}. Donc ${a} − ${b} = <span class="op-l-g">${a - b}</span>`;
            M.sfx.good();
          }
          M.$('.op-l-go', sec)!.onclick = () => go();
          M.$('.op-l-new', sec)!.onclick = () => {
            tok++;
            a = rnd(11, 18);
            b = rnd(Math.max(a - 9, 5), 9);
            M.sfx.tap();
            mount();
          };
          mount();
        },
      );

      /* --- Terrain de jeu --- */
      section(
        el,
        '🎮 Choisis deux nombres',
        `<p>Choisis deux nombres. Castor te dit quel truc utiliser !</p>
        <div class="row">${stepper('a', '', 8)}<span class="op-l-chips op-l-ops"><span class="chip on" data-op="+">+</span><span class="chip" data-op="-">${MINUS}</span></span>${stepper('b', '', 7)}</div>
        <div class="op-l-eq"></div><div class="op-l-frames"></div><div class="op-l-out"></div>`,
        (sec) => {
          const st = { a: 8, b: 7 };
          let opr = '+';
          const draw = () => {
            let { a, b } = st;
            let note = '';
            if (opr === '-' && b > a) {
              [a, b] = [b, a];
              note = ' (on enlève le plus petit du plus grand)';
            }
            const s = opr === '+' ? strat().add(a, b) : strat().sub(a, b);
            const res = opr === '+' ? a + b : a - b;
            M.$('.op-l-eq', sec)!.innerHTML = `${a} ${opr === '+' ? '+' : MINUS} ${b} = <span class="op-l-g">${res}</span>`;
            if (opr === '+') {
              const cells: string[] = [];
              for (let i = 0; i < a; i++) cells.push('A');
              for (let i = 0; i < b; i++) cells.push('B');
              M.$('.op-l-frames', sec)!.innerHTML = frame(cells.slice(0, 10)) + frame(cells.slice(10, 20));
            } else {
              const cells: string[] = [];
              for (let i = 0; i < a; i++) cells.push(i >= a - b ? 'Ax' : 'A');
              M.$('.op-l-frames', sec)!.innerHTML = frame(cells.slice(0, 10)) + (a > 10 ? frame(cells.slice(10, 20)) : '');
            }
            M.$('.op-l-out', sec)!.innerHTML = castor(`<b>${s.name || 'Calcul'}</b>${note} — ${s.txt}`, 'green');
          };
          wireSteppers(sec, st, { a: [0, 10], b: [0, 10] }, draw);
          M.$('.op-l-ops', sec)!.addEventListener('click', (e) => {
            const c = M.closest(e, '.chip');
            if (!c) return;
            opr = c.dataset.op ?? '+';
            sec.querySelectorAll('.op-l-ops .chip').forEach((x) => x.classList.toggle('on', x === c));
            M.sfx.tap();
            draw();
          });
          draw();
        },
      );
    },
  });

  /* ==================================================================
     Page 2 — Le sens des opérations
     ================================================================== */
  /** Section d'histoire animée : kind = ajout | retrait | reunion | comparaison */
  function storySection(root: HTMLElement, kind: OpStoryKind) {
    const META: Record<OpStoryKind, [string, string]> = {
      ajout: ['➕ Ajouter', 'On <b>ajoute</b> : la quantité augmente.'],
      retrait: ['➖ Enlever', 'On <b>enlève</b> : la quantité diminue.'],
      reunion: ['🤝 Réunir', 'On <b>réunit</b> deux groupes pour savoir combien il y en a en tout.'],
      comparaison: ['⚖️ Comparer', 'On <b>compare</b> deux quantités : combien de plus ? combien de moins ?'],
    };
    section(
      root,
      META[kind][0],
      `<p>${META[kind][1]}</p>
      <div class="op-l-story"></div><div class="op-l-stage"></div><div class="op-l-eq"></div>
      <div class="op-l-ans"></div><div class="op-l-status"></div>
      <div class="row"><button class="btn blue op-l-play">▶ Regarder l'histoire</button><button class="btn primary op-l-new">🎲 À toi : une autre histoire</button></div>`,
      (sec) => {
        let story: OpStory | undefined,
          tok = 0;
        const $ = (s: string) => M.$(s, sec)!;
        function make(first: boolean): OpStory {
          const [e, noun] = pick(OBJ);
          const p = person(),
            q = person(p);
          let a: number, b: number, txt: string, ans: number, eqTxt: string;
          if (kind === 'ajout') {
            a = first ? 5 : rnd(2, 9);
            b = first ? 3 : rnd(2, 9);
            txt = `${p.n} a ${a} ${noun}. ${p.Il} en reçoit ${b} de plus. Combien en a-t-${p.il} maintenant ?`;
            ans = a + b;
            eqTxt = `${a} + ${b} = `;
          } else if (kind === 'retrait') {
            a = first ? 8 : rnd(5, 14);
            b = first ? 3 : rnd(2, a - 1);
            txt = `${p.n} a ${a} ${noun}. ${p.Il} en donne ${b} à ${q.n}. Combien lui en reste-t-il ?`;
            ans = a - b;
            eqTxt = `${a} − ${b} = `;
          } else if (kind === 'reunion') {
            a = first ? 4 : rnd(2, 9);
            b = first ? 5 : rnd(2, 9);
            txt = `Dans un panier, il y a ${a} ${noun}. Dans l'autre panier, il y en a ${b}. On met tout ensemble. Combien y en a-t-il en tout ?`;
            ans = a + b;
            eqTxt = `${a} + ${b} = `;
          } else {
            a = first ? 9 : rnd(5, 12);
            b = first ? 6 : rnd(2, a - 1);
            txt = `${p.n} a ${a} ${noun}. ${q.n} en a ${b}. Combien ${p.n} en a-t-${p.il} de plus que ${q.n} ?`;
            ans = a - b;
            eqTxt = `${a} − ${b} = `;
          }
          return { e, a, b, p, q, txt, ans, eqTxt, done: false };
        }
        const cur = (): OpStory => (story ??= make(true));
        const item = (k: string, cls = '') => `<span class="op-l-it k${k} ${cls}">${cur().e}</span>`;
        function stage(phase: number) {
          // phase 0 = avant, 1 = après (sans animation)
          const { a, b } = cur();
          if (kind === 'ajout') return `<div class="op-l-grp boxed">${item('A').repeat(a)}${phase ? item('B').repeat(b) : ''}</div>`;
          if (kind === 'retrait')
            return `<div class="op-l-grp boxed">${item('A').repeat(a - b)}${item('A', phase ? 'gone' : '').repeat(b)}</div>`;
          if (kind === 'reunion')
            return phase
              ? `<div class="op-l-grp boxed">${item('A').repeat(a)}${item('B').repeat(b)}</div>`
              : `<div class="op-l-grp boxed">${item('A').repeat(a)}</div><div class="op-l-grp boxed">${item('B').repeat(b)}</div>`;
          return cmpHtml(phase ? a : 0, !!phase);
        }
        function cmpHtml(pairs: number, extra: boolean) {
          const { a, b, p, q } = cur();
          let h = `<div class="op-l-cmp" style="grid-template-columns:auto repeat(${a}, auto)"><span class="nm">${p.n}</span>`;
          for (let i = 0; i < a; i++) h += item('A', i < Math.min(pairs, b) ? 'pair' : extra && i >= b ? 'extra' : '');
          h += `<span class="nm">${q.n}</span>`;
          for (let i = 0; i < a; i++) h += i < b ? item('B', i < pairs ? 'pair' : '') : '<span></span>';
          return h + '</div>';
        }
        function show() {
          const S = cur();
          $('.op-l-story').innerHTML = `${S.e} ${S.txt}`;
          $('.op-l-stage').innerHTML = stage(0);
          $('.op-l-eq').innerHTML = `${S.eqTxt}<span class="op-l-q">?</span>`;
          $('.op-l-status').textContent = '';
          $('.op-l-status').className = 'op-l-status';
          $('.op-l-ans').innerHTML =
            '<span>Ta réponse :</span>' +
            M.numChoices(S.ans, 3, 3, 0)
              .map((c) => `<button class="btn" data-v="${c.value}">${c.label}</button>`)
              .join('');
        }
        async function play() {
          const t = ++tok;
          const ok = () => alive(sec, t, () => tok);
          const st = $('.op-l-stage');
          st.innerHTML = stage(0);
          await M.sleep(500);
          if (!ok()) return;
          const { a, b } = cur();
          if (kind === 'ajout') {
            const g = M.$('.op-l-grp', st)!;
            for (let i = 0; i < b; i++) {
              await M.sleep(380);
              if (!ok()) return;
              g.insertAdjacentHTML('beforeend', item('B', 'in'));
              M.sfx.pop();
            }
          } else if (kind === 'retrait') {
            const its = M.$$('.op-l-it', st);
            for (let i = a - 1; i >= a - b; i--) {
              await M.sleep(380);
              if (!ok()) return;
              its[i].classList.add('out');
              M.sfx.tap();
              const node = its[i];
              setTimeout(() => {
                if (node.isConnected) {
                  node.classList.remove('out');
                  node.classList.add('gone');
                }
              }, 620);
            }
            await M.sleep(650);
          } else if (kind === 'reunion') {
            await M.sleep(500);
            if (!ok()) return;
            st.innerHTML = `<div class="op-l-grp boxed">${item('A').repeat(a)}</div>`;
            const g = M.$('.op-l-grp', st)!;
            for (let i = 0; i < b; i++) {
              await M.sleep(160);
              if (!ok()) return;
              g.insertAdjacentHTML('beforeend', item('B', 'in'));
              M.sfx.pop();
            }
          } else {
            for (let i = 1; i <= b; i++) {
              await M.sleep(260);
              if (!ok()) return;
              st.innerHTML = cmpHtml(i, false);
              M.sfx.tap();
            }
            await M.sleep(400);
            if (!ok()) return;
            st.innerHTML = cmpHtml(b, true);
            M.sfx.pop();
          }
          if (!ok()) return;
          reveal();
        }
        function reveal() {
          const S = cur();
          S.done = true;
          $('.op-l-eq').innerHTML = `${S.eqTxt}<span class="op-l-g">${S.ans}</span>`;
          let msg = '';
          if (kind === 'comparaison') msg = `${S.p.n} en a ${S.ans} de plus. On peut aussi penser : ${S.b} + ${S.ans} = ${S.a}.`;
          else if (kind === 'retrait') msg = `Il en reste ${S.ans}.`;
          else if (kind === 'ajout') msg = `Maintenant, ${S.p.il} en a ${S.ans}.`;
          else msg = `Il y en a ${S.ans} en tout.`;
          const stEl = $('.op-l-status');
          stEl.textContent = msg;
          stEl.className = 'op-l-status good';
        }
        sec.addEventListener(
          'click',
          fireClick((e) => {
            const b = M.closest<HTMLButtonElement>(e, '.op-l-ans [data-v]');
            if (!b || !sec.contains(b) || b.disabled) return;
            if (Number(b.dataset.v) === cur().ans) {
              b.classList.add('right');
              M.sfx.good();
              M.$$<HTMLButtonElement>('.op-l-ans [data-v]', sec).forEach((x) => (x.disabled = true));
              play();
            } else {
              b.classList.add('wrong');
              b.disabled = true;
              M.sfx.bad();
              $('.op-l-status').textContent = "Regarde l'histoire pour vérifier 👀";
            }
          }),
        );
        $('.op-l-play').onclick = () => play();
        $('.op-l-new').onclick = () => {
          tok++;
          story = make(false);
          M.sfx.tap();
          show();
        };
        story = make(true);
        show();
      },
    );
  }

  M.registerLearn({
    id: 'sens-operations',
    domain: D,
    title: 'Le sens des opérations',
    icon: '🎭',
    short: 'Ajouter, enlever, réunir, comparer, et le signe =',
    intro:
      "Une addition ou une soustraction, c'est une petite histoire ! On peut ajouter, enlever, réunir ou comparer. Regarde chaque histoire, puis essaie de répondre.",
    render(el) {
      (['ajout', 'retrait', 'reunion', 'comparaison'] as const).forEach((k) => storySection(el, k));
      el.insertAdjacentHTML(
        'beforeend',
        `<section class="l-sec">${castor('Ajouter et réunir, ce sont des <b>additions</b> (+). Enlever et comparer, ce sont des <b>soustractions</b> (−). Pour comparer, on peut aussi faire une addition à trou : 6 + ? = 9.')}</section>`,
      );

      /* --- Le signe = (balance) --- */
      section(
        el,
        '⚖️ Le signe = veut dire « a la même valeur que »',
        `<p>Le signe = ne veut pas dire « la réponse arrive ». Il dit que <b>les deux côtés ont la même valeur</b>, comme une balance en équilibre.</p>
        <div class="row">À gauche : ${stepper('a', '', 4)} + ${stepper('b', '', 5)}</div>
        <div class="row">À droite : ${stepper('c', '', 3)} + ${stepper('d', '', 6)}</div>
        <div class="op-l-box"><div class="op-l-bal"></div></div>
        ${castor("Essaie de trouver d'autres façons d'équilibrer : 4 + 5 = 3 + 6 = 2 + 7 = 1 + 8… On peut aussi changer l'ordre : 4 + 5 = 5 + 4.")}`,
        (sec) => {
          const st = { a: 4, b: 5, c: 3, d: 6 };
          const mount = () => {
            const host = M.$('.op-l-bal', sec)!;
            if (!M.opViz) {
              host.textContent = `${st.a} + ${st.b} = ${st.a + st.b} ; ${st.c} + ${st.d} = ${st.c + st.d}`;
              return;
            }
            host.onclick = null;
            M.opViz.balance(host, { L: [{ v: st.a }, { v: st.b }], R: [{ v: st.c }, { v: st.d }] });
          };
          wireSteppers(sec, st, { a: [0, 10], b: [0, 10], c: [0, 10], d: [0, 10] }, mount);
          mount();
        },
      );
    },
  });

  /* ==================================================================
     Page 3 — La droite numérique
     ================================================================== */
  const RANGES: Record<number, OpRange> = {
    20: { lo: 0, hi: 20, buttons: [-5, -1, 1, 5], label: '0 à 20' },
    100: { lo: 0, hi: 100, buttons: [-10, -1, 1, 10], label: '0 à 100' },
    1000: { lo: 0, hi: 1000, buttons: [-100, -10, 10, 100], labelEvery: 100, label: '0 à 1000' },
  };
  function challenge(r: number): { start: number; d: number } {
    if (r === 20) {
      const k = rnd(0, 2);
      if (k === 0) {
        const a = rnd(5, 9),
          b = rnd(11 - a, 9);
        return { start: a, d: b };
      }
      if (k === 1) {
        const a = rnd(11, 18),
          b = rnd(a - 9, 9);
        return { start: a, d: -b };
      }
      const a = rnd(1, 9);
      return { start: a, d: 10 };
    }
    if (r === 100) {
      const k = rnd(0, 3);
      if (k === 0) {
        const a = rnd(11, 79);
        return { start: a, d: 10 };
      }
      if (k === 1) {
        const a = rnd(31, 99);
        return { start: a, d: -pick([10, 20]) };
      }
      if (k === 2) {
        const a = rnd(10, 60);
        return { start: a, d: pick([20, 30, 25, 12, 15]) };
      }
      const a = rnd(40, 95);
      return { start: a, d: -pick([5, 11, 21, 15]) };
    }
    const k = rnd(0, 2);
    if (k === 0) {
      const a = rnd(1, 6) * 100 + rnd(0, 9) * 10;
      return { start: a, d: pick([100, 200, 300]) };
    }
    if (k === 1) {
      const a = rnd(3, 9) * 100 + rnd(0, 9) * 10;
      return { start: a, d: -pick([100, 200, 30, 50]) };
    }
    const a = rnd(1, 7) * 100 + rnd(0, 9) * 10;
    return { start: a, d: pick([30, 50, 120, 250]) };
  }
  /** Bonds pour aller de a à a+d avec les boutons disponibles. */
  function plan(a: number, d: number, buttons: readonly number[]) {
    const out: number[] = [];
    let pos = a,
      rest = Math.abs(d);
    const sg = Math.sign(d);
    const sizes = buttons
      .map(Math.abs)
      .filter((v, i, arr) => v > 0 && arr.indexOf(v) === i)
      .sort((x, y) => y - x);
    for (const s of sizes)
      while (rest >= s) {
        pos += s * sg;
        rest -= s;
        out.push(pos);
      }
    return out;
  }
  M.registerLearn({
    id: 'droite-numerique',
    domain: D,
    title: 'La droite numérique',
    icon: '🐸',
    short: 'Faire des bonds de 1, de 10, de 100',
    intro:
      'La grenouille saute sur la droite numérique. Vers la droite, on ajoute. Vers la gauche, on enlève. Les grands bonds de 10 ou de 100 vont très vite !',
    render(el) {
      /* --- Jeu libre --- */
      section(
        el,
        '🐸 Joue avec la grenouille',
        `<p>Choisis ta droite, puis touche un nombre ou les boutons pour faire sauter la grenouille.</p>
        <div class="op-l-chips op-l-rng">${Object.keys(RANGES)
          .map((k) => `<span class="chip ${k === '20' ? 'on' : ''}" data-r="${k}">${RANGES[Number(k)].label}</span>`)
          .join('')}</div>
        <div class="op-l-box"><div class="op-l-nl"></div></div>
        <div class="row"><button class="btn op-l-reset">↺ Recommencer</button></div>
        ${castor('Avec un bond de +10, regarde le chiffre des unités : il ne change pas ! 7, 17, 27, 37…')}`,
        (sec) => {
          let r = 20,
            api: NumberLineCtl | null = null;
          const mount = () => {
            const R = RANGES[r];
            const host = M.$('.op-l-nl', sec)!;
            host.onclick = null;
            api = M.viz.numberLine(host, {
              lo: R.lo,
              hi: R.hi,
              start: 0,
              buttons: R.buttons,
              labelEvery: R.labelEvery,
              hint: 'Touche un nombre sur la droite ou un bouton.',
            });
          };
          M.$('.op-l-rng', sec)!.addEventListener('click', (e) => {
            const c = M.closest(e, '.chip');
            if (!c) return;
            r = Number(c.dataset.r);
            sec.querySelectorAll('.op-l-rng .chip').forEach((x) => x.classList.toggle('on', x === c));
            M.sfx.tap();
            mount();
          });
          M.$('.op-l-reset', sec)!.onclick = () => {
            if (api) api.reset();
          };
          mount();
        },
      );

      /* --- Défis --- */
      section(
        el,
        '🎯 Défis de la grenouille',
        `<div class="op-l-chips op-l-rng">${Object.keys(RANGES)
          .map((k) => `<span class="chip ${k === '100' ? 'on' : ''}" data-r="${k}">${RANGES[Number(k)].label}</span>`)
          .join('')}</div>
        <div class="op-l-eq op-l-top"></div>
        <div class="op-l-box"><div class="op-l-nl"></div></div>
        <div class="row op-l-jumps"></div>
        <div class="op-l-status"></div>
        <div class="row"><button class="btn primary op-l-new">🎲 Nouveau défi</button><button class="btn yellow op-l-show">👀 Montre-moi</button><button class="btn op-l-again">↺ Recommencer</button></div>`,
        (sec) => {
          let r = 100,
            C = challenge(r),
            pos = 0,
            api: NumberLineCtl | null = null,
            tok = 0,
            won = false;
          const $ = (s: string) => M.$(s, sec)!;
          const target = () => C.start + C.d;
          const mount = () => {
            const R = RANGES[r];
            pos = C.start;
            won = false;
            const host = $('.op-l-nl');
            host.onclick = null;
            api = M.viz.numberLine(host, { lo: R.lo, hi: R.hi, start: C.start, labelEvery: R.labelEvery, interactive: false });
            $('.op-l-top').innerHTML =
              `Pars de ${C.start}. Fais ${C.d > 0 ? '+' : MINUS} ${Math.abs(C.d)}. <span class="op-l-q">Où arrives-tu ?</span>`;
            $('.op-l-jumps').innerHTML = R.buttons
              .map((j) => `<button class="btn" data-jump="${j}">${j > 0 ? '+' : MINUS}${Math.abs(j)} 🐸</button>`)
              .join('');
            $('.op-l-status').textContent = '';
            $('.op-l-status').className = 'op-l-status';
          };
          const check = () => {
            const st = $('.op-l-status');
            if (pos === target() && !won) {
              won = true;
              st.innerHTML = `Bravo ! ${C.start} ${C.d > 0 ? '+' : MINUS} ${Math.abs(C.d)} = <b>${target()}</b> 🎉`;
              st.className = 'op-l-status good';
              $('.op-l-top').innerHTML = `${C.start} ${C.d > 0 ? '+' : MINUS} ${Math.abs(C.d)} = <span class="op-l-g">${target()}</span>`;
              M.sfx.good();
            } else if (!won) {
              const moved = pos - C.start;
              st.innerHTML =
                `🐸 est sur <b>${pos}</b>. Tu as fait ${moved >= 0 ? '+' : MINUS}${Math.abs(moved)}.` +
                ((C.d > 0 && moved > C.d) || (C.d < 0 && moved < C.d) ? ' Oups, trop loin !' : '');
            }
          };
          const newC = () => {
            tok++;
            C = challenge(r);
            mount();
          };
          sec.addEventListener(
            'click',
            fireClick((e) => {
              const j = M.closest(e, '[data-jump]');
              if (j && sec.contains(j)) {
                const R = RANGES[r],
                  to = pos + Number(j.dataset.jump);
                if (to < R.lo || to > R.hi) {
                  M.sfx.bad();
                  return;
                }
                tok++;
                pos = to;
                api?.hop(to).then(() => {
                  if (sec.isConnected) check();
                });
                return;
              }
              const c = M.closest(e, '.op-l-rng .chip');
              if (c && sec.contains(c)) {
                r = Number(c.dataset.r);
                sec.querySelectorAll('.op-l-rng .chip').forEach((x) => x.classList.toggle('on', x === c));
                M.sfx.tap();
                newC();
              }
            }),
          );
          $('.op-l-new').onclick = () => {
            M.sfx.tap();
            newC();
          };
          $('.op-l-again').onclick = () => {
            tok++;
            mount();
          };
          $('.op-l-show').onclick = async () => {
            const t = ++tok;
            mount();
            for (const v of plan(C.start, C.d, RANGES[r].buttons)) {
              await M.sleep(200);
              if (!alive(sec, t, () => tok)) return;
              pos = v;
              await api?.hop(v);
            }
            if (alive(sec, t, () => tok)) check();
          };
          mount();
        },
      );

      el.insertAdjacentHTML(
        'beforeend',
        `<section class="l-sec"><h2>💡 Des trucs de grenouille</h2>
        <div class="l-grid">
          <div class="l-tile"><h3>+10</h3><p>Les unités restent pareilles, la dizaine augmente : 23 → 33.</p></div>
          <div class="l-tile"><h3>+9</h3><p>Fais +10, puis recule de 1 : 23 + 9 = 33 − 1 = 32.</p></div>
          <div class="l-tile"><h3>+100</h3><p>La centaine augmente, le reste ne bouge pas : 340 → 440.</p></div>
          <div class="l-tile"><h3>Passer par la dizaine</h3><p>47 + 5 : 47 + 3 = 50, puis 50 + 2 = 52.</p></div>
        </div></section>`,
      );
    },
  });

  /* ==================================================================
     Page 4 — Multiplier et partager
     ================================================================== */
  const ARR_EMO = ['🪑', '🍪', '⭐', '🌻', '🚗'];
  M.registerLearn({
    id: 'multiplication-partage',
    domain: D,
    title: 'Groupes égaux et partage',
    icon: '🧺',
    short: 'Rangées, addition répétée, partager également',
    intro:
      "Quand tous les groupes ont le même nombre d'objets, on peut compter par bonds. Et quand on partage, chacun doit en avoir autant !",
    render(el) {
      /* --- Constructeur de rangées --- */
      section(
        el,
        '🪑 Des rangées de chaises',
        `<p>Choisis le nombre de rangées et le nombre d'objets dans chaque rangée. Touche une rangée pour la compter.</p>
        <div class="row">${stepper('r', 'Rangées :', 3)}${stepper('c', 'Dans chaque rangée :', 4)}<button class="btn op-l-emo">🔁 Objet</button><button class="btn op-l-turn">↪️ Tourner</button></div>
        <div class="op-l-box" style="text-align:center"><div class="op-l-arr"></div></div>
        <div class="op-l-eq op-l-sum"></div>
        <div class="op-l-status"></div>
        ${castor("« 3 rangées de 4 », c'est 4 + 4 + 4. Les grands écrivent aussi 3 × 4 (on dit « 3 fois 4 »). Si on tourne le dessin, on a 4 rangées de 3 : le total ne change pas !")}`,
        (sec) => {
          const st = { r: 3, c: 4 };
          let emo = 0,
            hl: Record<number, boolean> = {};
          const draw = () => {
            const { r, c } = st;
            const arr = M.$('.op-l-arr', sec)!;
            arr.style.gridTemplateColumns = `repeat(${c}, auto) auto`;
            let h = '';
            for (let i = 0; i < r; i++) {
              for (let j = 0; j < c; j++) h += `<span class="op-l-it ${hl[i] ? 'hl' : ''}" data-row="${i}">${ARR_EMO[emo]}</span>`;
              h += `<span class="rs">${hl[i] ? '→ ' + c : ''}</span>`;
            }
            arr.innerHTML = h;
            const n = Object.keys(hl).filter((k) => hl[Number(k)] && Number(k) < r).length;
            M.$('.op-l-sum', sec)!.innerHTML =
              `${r} ${M.plural(r, 'rangée')} de ${c} : ${Array(r).fill(c).join(' + ')} = <span class="op-l-g">${r * c}</span>`;
            M.$('.op-l-status', sec)!.innerHTML = n
              ? `Rangées comptées : ${n} → ${Array(n).fill(c).join(' + ')} = <b>${n * c}</b>`
              : `<span class="muted">On peut aussi écrire : ${r} × ${c} = ${r * c}</span>`;
          };
          wireSteppers(sec, st, { r: [1, 6], c: [1, 8] }, () => {
            hl = {};
            draw();
          });
          M.$('.op-l-arr', sec)!.addEventListener('click', (e) => {
            const it = M.closest(e, '[data-row]');
            if (!it) return;
            const i = Number(it.dataset.row);
            hl[i] = !hl[i];
            M.sfx.tap();
            draw();
          });
          M.$('.op-l-emo', sec)!.onclick = () => {
            emo = (emo + 1) % ARR_EMO.length;
            M.sfx.tap();
            draw();
          };
          M.$('.op-l-turn', sec)!.onclick = () => {
            if (st.r > 6 || st.c > 6) {
              [st.r, st.c] = [Math.min(6, st.c), st.r];
            } else [st.r, st.c] = [st.c, st.r];
            const bs = M.$$('.op-l-stp b', sec);
            bs[0].textContent = String(st.r);
            bs[1].textContent = String(st.c);
            hl = {};
            M.sfx.hop();
            draw();
          };
          draw();
        },
      );

      /* --- Groupes égaux --- */
      section(
        el,
        '🍪 Des groupes égaux',
        `<p>Des assiettes avec le même nombre de biscuits. Compte par bonds !</p>
        <div class="row">${stepper('g', 'Assiettes :', 3)}${stepper('k', 'Biscuits par assiette :', 4)}<button class="btn blue op-l-go">▶ Compter par bonds</button></div>
        <div class="op-l-box"><div class="op-l-grps"></div></div>
        <div class="op-l-eq op-l-sum"></div>`,
        (sec) => {
          const st = { g: 3, k: 4 };
          let api: ShowMeCtl | null = null;
          const draw = () => {
            const host = M.$('.op-l-grps', sec)!;
            host.onclick = null;
            api = M.opViz ? M.opViz.groups(host, { g: st.g, k: st.k, emoji: '🍪', layout: 'groups' }) : null;
            M.$('.op-l-sum', sec)!.innerHTML =
              `${st.g} ${M.plural(st.g, 'groupe')} de ${st.k} : ${Array(st.g).fill(st.k).join(' + ')} = <span class="op-l-g">${st.g * st.k}</span>`;
          };
          wireSteppers(sec, st, { g: [1, 6], k: [1, 6] }, draw);
          M.$('.op-l-go', sec)!.onclick = () => {
            if (api) api.showMe();
          };
          draw();
        },
      );

      /* --- Machine à partager --- */
      section(
        el,
        '🤲 La machine à partager',
        `<p>Choisis combien d'objets et combien d'amis. Touche la pile pour distribuer un objet à la fois, chacun son tour.</p>
        <div class="op-l-chips op-l-mode"><span class="chip on" data-m="share">🧒 Partager entre amis</span><span class="chip" data-m="boxes">📦 Faire des paquets</span></div>
        <div class="row">${stepper('t', 'Objets :', 12)}<span class="op-l-k1">${stepper('n', 'Amis :', 3)}</span><span class="op-l-k2" hidden>${stepper('k', 'Par paquet :', 4)}</span><button class="btn blue op-l-go">▶ Tout distribuer</button></div>
        <div class="op-l-box"><div class="op-l-share"></div></div>
        ${castor("Partager 12 biscuits entre 3 amis : chacun en reçoit 4, parce que 4 + 4 + 4 = 12. S'il en reste quelques-uns et qu'il n'y en a pas assez pour tout le monde, on dit : « il en reste ».")}`,
        (sec) => {
          const st = { t: 12, n: 3, k: 4 };
          let mode: 'share' | 'boxes' = 'share',
            api: ShowMeCtl | null = null;
          const mount = () => {
            const host = M.$('.op-l-share', sec)!;
            host.onclick = null;
            if (!M.opViz) {
              host.textContent = `${st.t} ÷ ${st.n}`;
              return;
            }
            api = M.opViz.share(
              host,
              mode === 'share'
                ? { total: st.t, n: st.n, emoji: '🍪', mode: 'share' }
                : { total: st.t, k: st.k, emoji: '🍪', mode: 'boxes' },
            );
          };
          wireSteppers(sec, st, { t: [1, 30], n: [1, 6], k: [2, 6] }, mount);
          M.$('.op-l-mode', sec)!.addEventListener('click', (e) => {
            const c = M.closest(e, '.chip');
            if (!c) return;
            mode = c.dataset.m === 'boxes' ? 'boxes' : 'share';
            sec.querySelectorAll('.op-l-mode .chip').forEach((x) => x.classList.toggle('on', x === c));
            M.$('.op-l-k1', sec)!.hidden = mode !== 'share';
            M.$('.op-l-k2', sec)!.hidden = mode === 'share';
            M.sfx.tap();
            mount();
          });
          M.$('.op-l-go', sec)!.onclick = () => {
            if (api) api.showMe();
          };
          mount();
        },
      );
    },
  });

  /* ==================================================================
     Page 5 — Les régularités
     ================================================================== */
  const PAL = ['🔴', '🔵', '🟡', '🟢', '⭐', '🍁', '❄️', '🐟'];
  const sgn = (d: number) => (d >= 0 ? '+' + d : MINUS + Math.abs(d));
  M.registerLearn({
    id: 'regularites',
    domain: D,
    title: 'Les régularités',
    icon: '🔁',
    short: 'Motifs qui se répètent, suites de nombres',
    intro: "Une régularité, c'est quelque chose qui se répète toujours de la même façon. Trouve la règle, et tu peux deviner la suite !",
    render(el) {
      /* --- Constructeur de motif --- */
      section(
        el,
        '🎨 Invente ton motif',
        `<p>Touche des dessins pour créer ton motif (jusqu'à 4). Ensuite, l'application le répète !</p>
        <div class="op-l-pal">${PAL.map((p) => `<button class="btn" data-p="${p}">${p}</button>`).join('')}</div>
        <div class="row"><b>Mon motif :</b><div class="op-l-slots"></div><button class="btn op-l-clear">✕ Effacer</button><button class="btn blue op-l-go">▶ Répéter</button></div>
        <div class="op-l-strip"></div><div class="op-l-status"></div>
        ${castor('Les couleurs de fond montrent chaque répétition du motif. Lis-le à voix haute : « rouge, bleu, bleu, rouge, bleu, bleu… »')}`,
        (sec) => {
          let motif = ['🔴', '🔵', '🔵'],
            tok = 0;
          const drawSlots = () => {
            M.$('.op-l-slots', sec)!.innerHTML = [0, 1, 2, 3].map((i) => `<span class="op-l-slot">${motif[i] || ''}</span>`).join('');
          };
          async function repeat() {
            const t = ++tok;
            const strip = M.$('.op-l-strip', sec)!,
              st = M.$('.op-l-status', sec)!;
            strip.innerHTML = '';
            st.textContent = '';
            if (!motif.length) {
              st.textContent = 'Choisis au moins un dessin !';
              return;
            }
            const reps = motif.length <= 2 ? 5 : 4;
            for (let r = 0; r < reps; r++) {
              for (const m of motif) {
                await M.sleep(170);
                if (!alive(sec, t, () => tok)) return;
                strip.insertAdjacentHTML('beforeend', `<span class="op-term e band${r % 2}">${m}</span>`);
                M.sfx.tap();
              }
            }
            st.textContent = `Le motif de ${motif.length} ${M.plural(motif.length, 'élément')} se répète ${reps} fois.`;
          }
          M.$('.op-l-pal', sec)!.addEventListener('click', (e) => {
            const b = M.closest(e, '[data-p]');
            if (!b) return;
            if (motif.length >= 4) motif = [];
            motif.push(b.dataset.p ?? '');
            M.sfx.tap();
            drawSlots();
          });
          M.$('.op-l-clear', sec)!.onclick = () => {
            tok++;
            motif = [];
            drawSlots();
            M.$('.op-l-strip', sec)!.innerHTML = '';
          };
          M.$('.op-l-go', sec)!.onclick = () => repeat();
          drawSlots();
        },
      );

      /* --- Devine la suite --- */
      section(
        el,
        "🔮 Qu'est-ce qui vient après ?",
        `<div class="op-seq op-l-quiz"></div><div class="op-l-ans"></div><div class="op-l-status"></div>
        <div class="row"><button class="btn primary op-l-new">🎲 Un autre</button></div>`,
        (sec) => {
          let ans = '';
          const make = () => {
            const unit = pick(['AB', 'ABC', 'AAB', 'ABB', 'AABB']);
            const letters = [...new Set(unit.split(''))];
            const syms = M.shuffle(PAL).slice(0, letters.length + 1);
            const map: Record<string, string> = {};
            letters.forEach((l, i) => (map[l] = syms[i]));
            const len = unit.length * 2 + rnd(1, unit.length);
            const seq = M.range(0, len - 1).map((i) => map[unit[i % unit.length]]);
            ans = map[unit[len % unit.length]];
            M.$('.op-l-quiz', sec)!.innerHTML =
              seq.map((x) => `<span class="op-term e">${x}</span>`).join('') + '<span class="op-term e q">?</span>';
            M.$('.op-l-ans', sec)!.innerHTML = M.shuffle(syms)
              .map((s) => `<button class="btn" data-v="${s}">${s}</button>`)
              .join('');
            const st = M.$('.op-l-status', sec)!;
            st.textContent = '';
            st.className = 'op-l-status';
          };
          M.$('.op-l-ans', sec)!.addEventListener('click', (e) => {
            const b = M.closest<HTMLButtonElement>(e, '[data-v]');
            if (!b || b.disabled) return;
            const st = M.$('.op-l-status', sec)!;
            if (b.dataset.v === ans) {
              b.classList.add('right');
              M.sfx.good();
              M.$$<HTMLButtonElement>('.op-l-ans [data-v]', sec).forEach((x) => (x.disabled = true));
              const q = M.$('.op-l-quiz .q', sec);
              if (q) {
                q.textContent = ans;
                q.classList.remove('q');
              }
              st.textContent = 'Bravo ! Tu as trouvé le motif.';
              st.className = 'op-l-status good';
            } else {
              b.classList.add('wrong');
              b.disabled = true;
              M.sfx.bad();
              st.textContent = 'Cherche le petit bout qui se répète…';
            }
          });
          M.$('.op-l-new', sec)!.onclick = () => {
            M.sfx.tap();
            make();
          };
          make();
        },
      );

      /* --- Explorateur de suites de nombres --- */
      section(
        el,
        '🔢 Les suites de nombres',
        `<p>Choisis un nombre de départ et une règle. Regarde la suite se construire !</p>
        <div class="row">${stepper('s', 'Départ :', 3)}<span class="op-l-chips op-l-steps">${[1, 2, 5, 10, 100, -1, -2, -10].map((d) => `<span class="chip ${d === 2 ? 'on' : ''}" data-d="${d}">${sgn(d)}</span>`).join('')}</span></div>
        <div class="op-l-strip"></div><div class="op-l-out"></div>`,
        (sec) => {
          const st = { s: 3 };
          let d = 2,
            tok = 0;
          const tip = () => {
            if (d === 10) return 'Avec +10, le chiffre des unités ne change jamais ! Seule la dizaine augmente.';
            if (d === -10) return 'Avec −10, les unités restent pareilles et la dizaine diminue.';
            if (d === 100) return 'Avec +100, seule la centaine change. Les dizaines et les unités restent pareilles.';
            if (d === 5) return 'Avec +5, les unités font toujours le même petit va-et-vient : regarde le dernier chiffre !';
            if (d === 2)
              return st.s % 2 === 0
                ? "Partir d'un nombre pair et faire +2 : on obtient tous les nombres pairs."
                : "Partir d'un nombre impair et faire +2 : on obtient tous les nombres impairs.";
            if (d < 0) return 'Quand la règle est un moins, la suite descend. Attention : on ne peut pas aller sous 0 !';
            return "Avec +1, c'est la comptine des nombres !";
          };
          async function build() {
            const t = ++tok;
            const strip = M.$('.op-l-strip', sec)!;
            strip.innerHTML = '';
            M.$('.op-l-out', sec)!.innerHTML = '';
            let v = st.s,
              stopped = false;
            for (let i = 0; i < 8; i++) {
              if (v < 0 || v > 1000) {
                stopped = true;
                break;
              }
              await M.sleep(i ? 260 : 50);
              if (!alive(sec, t, () => tok)) return;
              strip.insertAdjacentHTML(
                'beforeend',
                (i ? `<span class="op-l-arrow">${sgn(d)} ➜</span>` : '') + `<span class="op-term">${v}</span>`,
              );
              M.sfx.tap();
              v += d;
            }
            if (!alive(sec, t, () => tok)) return;
            M.$('.op-l-out', sec)!.innerHTML = castor((stopped ? "<b>On s'arrête : on ne peut pas aller plus loin !</b> " : '') + tip());
          }
          wireSteppers(sec, st, { s: [0, 100] }, build);
          M.$('.op-l-steps', sec)!.addEventListener('click', (e) => {
            const c = M.closest(e, '.chip');
            if (!c) return;
            d = Number(c.dataset.d);
            sec.querySelectorAll('.op-l-steps .chip').forEach((x) => x.classList.toggle('on', x === c));
            M.sfx.tap();
            build();
          });
          build();
        },
      );

      /* --- Règle mystère --- */
      section(
        el,
        '🕵️ La règle mystère',
        `<p>Quelle règle fait cette suite ?</p><div class="op-seq op-l-quiz"></div><div class="op-l-ans"></div><div class="op-l-status"></div>
        <div class="row"><button class="btn primary op-l-new">🎲 Une autre</button></div>`,
        (sec) => {
          let d = 0;
          const RULES = [1, 2, 5, 10, -1, -2, -10, 3];
          const make = () => {
            d = pick(RULES);
            const start = d < 0 ? rnd(Math.abs(d) * 4 + 1, Math.abs(d) * 4 + 40) : rnd(0, 40);
            M.$('.op-l-quiz', sec)!.innerHTML = M.range(0, 4)
              .map((i) => `<span class="op-term">${start + i * d}</span>`)
              .join('');
            const opts = new Set([d]);
            M.shuffle(RULES).forEach((r) => {
              if (opts.size < 4) opts.add(r);
            });
            M.$('.op-l-ans', sec)!.innerHTML = M.shuffle([...opts])
              .map((r) => `<button class="btn" data-v="${r}">${sgn(r)}</button>`)
              .join('');
            const st = M.$('.op-l-status', sec)!;
            st.textContent = '';
            st.className = 'op-l-status';
          };
          M.$('.op-l-ans', sec)!.addEventListener('click', (e) => {
            const b = M.closest<HTMLButtonElement>(e, '[data-v]');
            if (!b || b.disabled) return;
            const st = M.$('.op-l-status', sec)!;
            if (Number(b.dataset.v) === d) {
              b.classList.add('right');
              M.sfx.good();
              M.$$<HTMLButtonElement>('.op-l-ans [data-v]', sec).forEach((x) => (x.disabled = true));
              st.textContent = `Oui ! La règle est ${sgn(d)}.`;
              st.className = 'op-l-status good';
            } else {
              b.classList.add('wrong');
              b.disabled = true;
              M.sfx.bad();
              st.textContent = 'Regarde de combien on change entre deux nombres voisins.';
            }
          });
          M.$('.op-l-new', sec)!.onclick = () => {
            M.sfx.tap();
            make();
          };
          make();
        },
      );
    },
  });
})();
