/* =====================================================================
   pb.js — générateur de problèmes écrits (M.pb), domaine « Comprendre et résoudre »
   Voir docs/hld/maths-problemes.md § 3. Ne touche jamais au DOM (sauf les viz d'étape).

   M.pb.make({ kinds, unknowns?, lvl, max?, distract?, near?, trap?, ctx? }) → Pb
   M.pb.passage(pb, sentences?)  → passage { title, tokens, say }
   M.pb.step.<nom>(pb, lvl)       → une étape (objet de format) réutilisable seule
   M.pb.toSteps(pb, recipe, { lvl, scoreSteps? }) → question au format steps
   M.pb.check(pb) / M.pb.checkQ(q) → message | undefined (tools/check-skills.js)

   Pb = { kind, unknown, sub, v, known:[rôles], answer, ctx, P, Q, emoji, u, uX,
          sentences:[{text, role}], tokens:[{w, s, data?, q?, x?}], text, qIndex, dataTok, xTok,
          situation:[a, op, b, '=', c] (null = inconnue), solve:{a, op, b, r} | {terms, r},
          fam, barSpec(reveal), reply, seekChoices, explain, hint, noNum? }
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const NB = ' ', MINUS = '−';
  const rnd = M.rnd, pick = M.pick, shuffle = M.shuffle;
  const PB = (M.pb = {});
  const D = () => M.data['pb-contextes'];

  /* ------------------------------------------------------------------ texte */
  /** Espace insécable avant ? ! : ; et élision devant un prénom (« de Olivier » → « d'Olivier », « que Inès » → « qu'Inès »). */
  const typo = (s) => String(s).replace(/ +([?!:;])/g, NB + '$1')
    .replace(/(^|[\s>(])([Dd])e (?=[AEIOUYÀÂÉÈÊÎÏÔÛ])/g, "$1$2'").replace(/(^|[\s>(])([Qq])ue (?=[AEIOUYÀÂÉÈÊÎÏÔÛ])/g, "$1$2u'");
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const fill = (tpl, vars) => typo(cap(M.fr.fill(tpl, vars)));
  const de = (w) => M.fr.de(w);
  const pv = (P) => ({ P: P.n, il: P.il, Il: P.Il, e: P.e });
  const opS = (op) => (op === '-' ? MINUS : op);
  const expr = (s) => (s.terms ? s.terms.join(' + ') : `${s.a} ${opS(s.op)} ${s.b}`);
  const eqStr = (sit) => sit.map((x) => (x === null ? '?' : opS(String(x)))).join(' ');
  const eqHtml = (txt) => `<div class="eq">${txt}</div>`;
  PB.typo = typo;
  PB.expr = expr;
  PB.eqStr = eqStr;

  /** Jetons (mots) d'une liste de phrases : on coupe aux espaces ordinaires seulement (« tout ? » reste un jeton). */
  function tokensOf(sentences, roleOf, xVals) {
    const toks = [];
    sentences.forEach((s, si) => s.text.split(' ').filter(Boolean).forEach((w) => {
      const t = { w, s: si };
      const m = /^(\d+)/.exec(w);
      if (m) {
        const v = +m[1];
        if (roleOf && roleOf[v]) t.data = roleOf[v];
        else if (xVals && xVals.includes(v)) t.x = true;
      }
      if (s.role === 'question') t.q = true;
      toks.push(t);
    }));
    return toks;
  }
  PB.tokensOf = tokensOf;

  /* ------------------------------------------------------------------ nombres */
  /** s1 + s2 = big, valeurs distinctes ≥ 2. opts.max : plafond simple (sans dizaines rondes). */
  function drawTriple(lvl, opts = {}) {
    for (let g = 0; g < 200; g++) {
      let s1, s2;
      if (opts.max) { s1 = rnd(2, opts.max - 2); s2 = rnd(2, Math.max(2, opts.max - s1)); }
      else if (lvl === 0) { s1 = rnd(2, 7); s2 = rnd(2, 10 - s1); }
      else if (lvl === 1) {
        if (Math.random() < 0.25) { s1 = 10 * rnd(1, 8); s2 = 10 * rnd(1, 9 - s1 / 10); }
        else { s1 = rnd(2, 15); s2 = rnd(2, 20 - s1); }
      } else if (!opts.noHundreds && Math.random() < 0.12) { s1 = 100 * rnd(1, 7); s2 = 100 * rnd(1, 9 - s1 / 100); }
      else { s1 = rnd(11, 70); s2 = rnd(5, 99 - s1); }
      const big = s1 + s2;
      if (s1 !== s2 && s1 >= 2 && s2 >= 2 && (!opts.max || big <= opts.max)) return [s1, s2, big];
    }
    return [3, 4, 7];
  }

  /** Inconnues permises par défaut selon le niveau (§ 3.2). */
  const UNK = {
    ajout: [['fin'], ['fin', 'change'], ['fin', 'change', 'debut']],
    retrait: [['fin'], ['fin', 'change'], ['fin', 'change', 'debut']],
    reunion: [['tout'], ['tout', 'partie'], ['tout', 'partie']],
    comparaison: [['ecart'], ['ecart'], ['ecart', 'petit', 'grand']],
    groupes: [['total'], ['total'], ['total']],
    partage: [['parPart'], ['parPart', 'nb'], ['parPart', 'nb']],
    deux: [['fin'], ['fin'], ['fin']],
  };
  PB.UNK = UNK;
  const KEY = { ajout: 'aj', retrait: 're', reunion: 'un', comparaison: 'cmp' };

  /* ------------------------------------------------------------------ modèles en barres */
  const seg = (v, tone, hide, reveal) => (hide ? { v, text: '?', tone: 'Q' } : { v, tone: reveal ? 'C' : tone });
  /** Partie-partie-tout : o = { x, y, t, unk: 'x'|'y'|'t', toneY?, lx?, ly?, lt? } (lx… = textes à la place des nombres) */
  function toutSpec(o, reveal) {
    const h = (k) => o.unk === k && !reveal;
    const sx = seg(o.x, 'A', h('x'), reveal && o.unk === 'x'), sy = seg(o.y, o.toneY || 'B', h('y'), reveal && o.unk === 'y');
    if (o.lx && !h('x')) sx.text = o.lx;
    if (o.ly && !h('y')) sy.text = o.ly;
    const total = h('t') ? { unknown: true } : { v: o.t, text: o.lt };
    if (!total.text) delete total.text;
    const name = (k, v) => (o.unk === k && !reveal ? 'inconnu' : String(v));
    return { type: 'tout', scale: o.scale, rows: [{ segs: [sx, sy] }], total, aria: `Deux parties : ${name('x', o.x)} et ${name('y', o.y)}. Le tout : ${name('t', o.t)}.` };
  }
  /** Comparaison : o = { G, S (prénoms), g, p, e, unk: 'grand'|'petit'|'ecart', swap? } */
  function cmpSpec(o, reveal) {
    const h = (k) => o.unk === k && !reveal;
    const a = seg(o.swap ? o.p : o.g, 'A', h('grand'), reveal && o.unk === 'grand');
    const b = seg(o.swap ? o.g : o.p, 'B', h('petit'), reveal && o.unk === 'petit');
    if (o.swap) { a.text = h('grand') ? '?' : String(o.g); b.text = h('petit') ? '?' : String(o.p); }
    return {
      type: 'comparaison', scale: o.scale,
      rows: [{ label: o.G || '', segs: [a] }, { label: o.S || '', segs: [b] }],
      diff: h('ecart') ? { unknown: true } : { v: o.e },
      aria: `Comparaison : ${o.G || 'la première barre'} et ${o.S || 'la deuxième barre'}. L'écart : ${h('ecart') ? 'inconnu' : o.e}.`,
    };
  }
  /** Groupes égaux / partage : o = { nb, k, t, unk: 'total'|'parPart'|'nb' } */
  function grpSpec(o, reveal) {
    const h = (k) => o.unk === k && !reveal;
    const segs = [];
    for (let i = 0; i < o.nb; i++) segs.push(seg(o.k, i % 2 ? 'B' : 'A', h('parPart'), reveal && o.unk === 'parPart'));
    const row = { segs };
    if (o.unk === 'nb') row.label = h('nb') ? '? paquets' : `${o.nb} paquets`;
    return { type: 'groupes', rows: [row], total: h('total') ? { unknown: true } : { v: o.t }, aria: `${o.nb} groupes de ${h('parPart') ? '?' : o.k}. Le total : ${h('total') ? 'inconnu' : o.t}.` };
  }
  PB.bars = { tout: toutSpec, cmp: cmpSpec, grp: grpSpec };
  const bar = (spec, scale) => M.viz.barModelHtml(spec, { scale: scale || 1 });

  /* ------------------------------------------------------------------ réalisation */
  function finish(pb) {
    const roleOf = {};
    pb.known.forEach((r) => (roleOf[pb.v[r]] = r));
    pb.tokens = tokensOf(pb.sentences, roleOf, pb.xVals || []);
    pb.text = pb.sentences.map((s) => s.text).join(' ');
    pb.qIndex = pb.sentences.findIndex((s) => s.role === 'question');
    pb.dataTok = pb.tokens.map((t, i) => (t.data ? i : -1)).filter((i) => i >= 0);
    pb.xTok = pb.tokens.map((t, i) => (t.x ? i : -1)).filter((i) => i >= 0);
    pb.knownVals = pb.known.map((r) => pb.v[r]);
    pb.id = [pb.kind, pb.unknown, pb.sub || '', pb.ctx.id, pb.knownVals.join('-')].join(':');
    return pb;
  }
  /** Ajoute des données inutiles (nombre sans rapport) : near = même unité, autre personne. */
  function addDistractors(pb, n, near) {
    const DD = D().DISTRACT;
    const used = new Set([...Object.values(pb.v), pb.answer]);
    pb.xVals = [];
    const personal = pb.sentences.some((s) => s.text.includes(pb.P.n));
    for (let k = 0; k < n; k++) {
      let text = null, x = 0;
      for (let g = 0; g < 50 && !text; g++) {
        const useNear = near && k === 0 && pb.ctx.cmp && pb.kind !== 'comparaison';
        if (useNear) {
          const hi = Math.max(...pb.knownVals);
          x = rnd(Math.max(2, Math.round(hi / 2)), hi + 5);
          text = fill(`{Q} ${pb.ctx.cmp.v} {x} ${pb.ctx.cmp.U}.`, { Q: pb.Q.n, x });
        } else {
          const tpl = pick(DD[personal ? 'person' : 'none']);
          x = /heures/.test(tpl) ? rnd(2, 11) : rnd(3, 9);
          text = fill(tpl, { ...pv(pb.P), x });
        }
        if (used.has(x) || pb.sentences.some((s) => s.text === text)) text = null;
      }
      if (!text) return false;
      used.add(x);
      pb.xVals.push(x);
      const pos = pb.sentences.length - 1; // juste avant la question : ne coupe jamais un pronom de son antécédent
      pb.sentences.splice(pos, 0, { text, role: 'distractor' });
    }
    return true;
  }

  /** Problèmes additifs à une étape : ajout, retrait, réunion, comparaison. */
  function makeAdd(kind, unknown, lvl, opts) {
    const [s1, s2, big] = drawTriple(lvl, opts);
    const key = KEY[kind];
    const pool = D().ADD.filter((c) => c[key] && c.max >= big && (!opts.ctx || opts.ctx(c)) && !(opts.avoid || []).includes(c.id));
    if (!pool.length) return null;
    const ctx = pick(pool);
    const P = M.people.pick(), Q = M.people.pick({ not: [P.n] });
    const pb = { kind, unknown, ctx, P, Q, emoji: ctx.emoji, u: ctx.u, uX: ctx.uX, lvl };
    const S = (text, role) => ({ text, role: role || (/\d/.test(text) ? 'data' : 'story') });
    if (kind === 'ajout' || kind === 'retrait') {
      const T = ctx[key];
      pb.v = kind === 'ajout' ? { debut: s1, change: s2, fin: big } : { debut: big, change: s1, fin: s2 };
      const vars = { ...pv(P), d: pb.v.debut, c: pb.v.change, f: pb.v.fin };
      const plan = { fin: ['d', 'c', 'qf'], change: ['d', 'c0', 'f', 'qc'], debut: ['d0', 'c', 'f', 'qd'] }[unknown];
      pb.sentences = plan.map((k) => S(fill(T[k], vars), k[0] === 'q' ? 'question' : null));
      pb.answer = pb.v[unknown];
      pb.known = ['debut', 'change', 'fin'].filter((r) => r !== unknown);
      const rk = { fin: 'rf', change: 'rc', debut: 'rd' };
      pb.reply = fill(T[rk[unknown]], { ...vars, n: pb.answer });
      pb.seekChoices = Object.keys(rk).map((u) => ({ label: fill(T[rk[u]], { ...vars, n: '❓' }), value: u }));
      pb.noNum = [S(fill(T.d0, vars)), S(fill(T.c0, vars))];
      pb.noNumQ = S(fill(T.qf, vars), 'question');
      const { debut: d, change: c, fin: f } = pb.v;
      if (kind === 'ajout') {
        pb.situation = { fin: [d, '+', c, '=', null], change: [d, '+', null, '=', f], debut: [null, '+', c, '=', f] }[unknown];
        pb.solve = { fin: { a: d, op: '+', b: c, r: f }, change: { a: f, op: '-', b: d, r: c }, debut: { a: f, op: '-', b: c, r: d } }[unknown];
        pb.barO = { x: d, y: c, t: f, unk: { fin: 't', change: 'y', debut: 'x' }[unknown] };
        pb.fam = unknown === 'fin' ? 'sum' : 'part';
        pb.explain = {
          fin: `On ajoute : il y en a <b>plus</b> à la fin. ${d} + ${c} = <b>${f}</b>.`,
          change: `On connaît le début (${d}) et la fin (${f}). Combien pour aller de ${d} à ${f} ? ${d} + ? = ${f}, donc ${f} ${MINUS} ${d} = <b>${c}</b>.`,
          debut: `On connaît la fin (${f}) et ce qui s'est ajouté (${c}). On l'enlève pour retrouver le début : ${f} ${MINUS} ${c} = <b>${d}</b>.`,
        }[unknown];
        pb.hint = { fin: 'Il en arrive d\'autres : à la fin, il y en a <b>plus</b>.', change: `Tu connais le début (${d}) et la fin (${f}). Qu'est-ce qui manque ?`, debut: `À la fin, il y en a ${f}. Au début, il y en avait <b>moins</b>.` }[unknown];
      } else {
        pb.situation = { fin: [d, '-', c, '=', null], change: [d, '-', null, '=', f], debut: [null, '-', c, '=', f] }[unknown];
        pb.solve = { fin: { a: d, op: '-', b: c, r: f }, change: { a: d, op: '-', b: f, r: c }, debut: { a: f, op: '+', b: c, r: d } }[unknown];
        pb.barO = { x: f, y: c, t: d, toneY: 'X', unk: { fin: 'x', change: 'y', debut: 't' }[unknown] };
        pb.fam = unknown === 'debut' ? 'sum' : 'part';
        pb.explain = {
          fin: `On enlève : il y en a <b>moins</b> à la fin. ${d} ${MINUS} ${c} = <b>${f}</b>.`,
          change: `On en avait ${d}, il en reste ${f}. ${d} ${MINUS} ? = ${f}, donc ${d} ${MINUS} ${f} = <b>${c}</b>.`,
          debut: `Il en reste ${f} et on en a enlevé ${c}. On remet ce qu'on a enlevé : ${f} + ${c} = <b>${d}</b>.`,
        }[unknown];
        pb.hint = { fin: 'On en enlève : à la fin, il y en a <b>moins</b>.', change: `Compare le début (${d}) et la fin (${f}).`, debut: `Au début, il y en avait <b>plus</b> qu'à la fin (${f}).` }[unknown];
      }
    } else if (kind === 'reunion') {
      const T = ctx.un;
      pb.v = { p1: s1, p2: s2, tout: big };
      const vars = { ...pv(P), a: s1, b: s2, t: big };
      const plan = unknown === 'tout' ? ['a', 'b', 'qt'] : ['t', 'a2', 'b0', 'qb'];
      pb.sentences = plan.map((k) => S(fill(T[k], vars), k[0] === 'q' ? 'question' : null));
      const ur = unknown === 'tout' ? 'tout' : 'p2';
      pb.answer = pb.v[ur];
      pb.known = ['p1', 'p2', 'tout'].filter((r) => r !== ur);
      pb.reply = fill(unknown === 'tout' ? T.rt : T.rb, { ...vars, n: pb.answer });
      pb.seekChoices = [{ label: fill(T.rt, { ...vars, n: '❓' }), value: 'tout' }, { label: fill(T.rb, { ...vars, n: '❓' }), value: 'partie' }];
      pb.situation = unknown === 'tout' ? [s1, '+', s2, '=', null] : [s1, '+', null, '=', big];
      pb.solve = unknown === 'tout' ? { a: s1, op: '+', b: s2, r: big } : { a: big, op: '-', b: s1, r: s2 };
      pb.barO = { x: s1, y: s2, t: big, unk: unknown === 'tout' ? 't' : 'y' };
      pb.fam = unknown === 'tout' ? 'sum' : 'part';
      pb.explain = unknown === 'tout' ? `On réunit les deux parties : ${s1} + ${s2} = <b>${big}</b>.` : `On connaît le tout (${big}) et une partie (${s1}). L'autre partie : ${big} ${MINUS} ${s1} = <b>${s2}</b>.`;
      pb.hint = unknown === 'tout' ? 'On met les deux groupes <b>ensemble</b> : on cherche le tout.' : `Le tout, c'est ${big}. Enlève la partie que tu connais.`;
    } else {
      const C = ctx.cmp;
      const swap = Math.random() < 0.5;
      const G = swap ? Q : P, Sm = swap ? P : Q;
      pb.G = G; pb.S = Sm;
      pb.v = { grand: big, petit: s1, ecart: s2 };
      const g = big, p = s1, e = s2;
      const inv = C.v + (/[aeiouy]$/.test(C.v) ? '-t' : '');
      const has = (X, n) => typo(`${X.n} ${C.v} ${n} ${C.U}.`);
      const more = (X, n, Y, pro) => typo(`${pro ? X.Il : X.n} ${C.v} ${n} ${C.u} de plus que ${Y.n}.`);
      const less = (X, n, Y, pro) => typo(`${pro ? X.Il : X.n} ${C.v} ${n} ${C.u} de moins que ${Y.n}.`);
      const ask = (X, tail) => typo(`Combien ${de(C.u)} ${X.n} ${inv}-${X.il}${tail || ''} ?`);
      const r = (X, n) => typo(`${X.n} ${C.v} ${n} ${C.u}.`);
      const trap = opts.trap != null ? opts.trap : Math.random() < 0.5;
      pb.trap = false;
      if (unknown === 'ecart') {
        const plus = Math.random() < 0.5;
        const first = Math.random() < 0.5 ? [S(has(G, g)), S(has(Sm, p))] : [S(has(Sm, p)), S(has(G, g))];
        pb.sentences = [...first, S(plus ? ask(G, ` de plus que ${Sm.n}`) : ask(Sm, ` de moins que ${G.n}`), 'question')];
        pb.reply = plus ? more(G, e, Sm) : less(Sm, e, G);
        pb.situation = [p, '+', null, '=', g];
        pb.solve = { a: g, op: '-', b: p, r: e };
        pb.explain = `On compare : ${G.n} en a ${g}, ${Sm.n} en a ${p}. L'écart : ${g} ${MINUS} ${p} = <b>${e}</b> (ou ${p} + ? = ${g}).`;
        pb.hint = `Imagine les ${C.u} de ${G.n} et de ${Sm.n} face à face. Combien de plus ?`;
        pb.seekChoices = [{ label: plus ? more(G, '❓', Sm) : less(Sm, '❓', G), value: 'ecart' }, { label: r(Sm, '❓'), value: 'petit' }, { label: r(G, '❓'), value: 'grand' }];
      } else if (unknown === 'petit') {
        pb.trap = trap;
        pb.sentences = [S(has(G, g)), S(trap ? more(G, e, Sm, true) : less(Sm, e, G)), S(ask(Sm), 'question')];
        pb.reply = r(Sm, p);
        pb.situation = [null, '+', e, '=', g];
        pb.solve = { a: g, op: '-', b: e, r: p };
        pb.explain = trap ? `${G.n} en a ${e} <b>de plus</b> que ${Sm.n}, donc ${Sm.n} en a ${e} <b>de moins</b> : ${g} ${MINUS} ${e} = <b>${p}</b>. Attention : « de plus » ne veut pas toujours dire + !` : `${Sm.n} en a ${e} de moins que ${G.n} : ${g} ${MINUS} ${e} = <b>${p}</b>.`;
        pb.hint = `${Sm.n} en a <b>moins</b> que ${G.n}. Ta réponse doit être plus petite que ${g}.`;
        pb.seekChoices = [{ label: r(Sm, '❓'), value: 'petit' }, { label: r(G, '❓'), value: 'grand' }, { label: more(G, '❓', Sm), value: 'ecart' }];
      } else {
        pb.trap = trap;
        pb.sentences = [S(has(Sm, p)), S(trap ? less(Sm, e, G, true) : more(G, e, Sm)), S(ask(G), 'question')];
        pb.reply = r(G, g);
        pb.situation = [p, '+', e, '=', null];
        pb.solve = { a: p, op: '+', b: e, r: g };
        pb.explain = trap ? `${Sm.n} en a ${e} <b>de moins</b> que ${G.n}, donc ${G.n} en a ${e} <b>de plus</b> : ${p} + ${e} = <b>${g}</b>. Attention : « de moins » ne veut pas toujours dire ${MINUS} !` : `${G.n} en a ${e} de plus que ${Sm.n} : ${p} + ${e} = <b>${g}</b>.`;
        pb.hint = `${G.n} en a <b>plus</b> que ${Sm.n}. Ta réponse doit être plus grande que ${p}.`;
        pb.seekChoices = [{ label: r(G, '❓'), value: 'grand' }, { label: r(Sm, '❓'), value: 'petit' }, { label: less(Sm, '❓', G), value: 'ecart' }];
      }
      pb.answer = pb.v[unknown];
      pb.known = ['grand', 'petit', 'ecart'].filter((k) => k !== unknown);
      pb.barO = { G: G.n, S: Sm.n, g, p, e, unk: unknown };
      pb.fam = 'cmp';
      pb.u = C.u;
      pb.cmpEnsemble = () => typo(`Combien ${de(C.u)} ${G.n} et ${Sm.n} ${C.vp}-${G.f && Sm.f ? 'elles' : 'ils'} ensemble ?`);
      pb.cmpHas = has;
    }
    return pb;
  }

  /** Groupes égaux, partage, contenance. */
  function makeGroups(kind, unknown, lvl, opts) {
    const c = pick(D().GROUPS);
    const P = M.people.pick();
    let nb, k;
    for (let g = 0; g < 100; g++) {
      if (lvl === 0) { nb = rnd(2, 3); k = rnd(2, 5); }
      else if (lvl === 1) { nb = rnd(2, 5); k = rnd(2, 6); }
      else { nb = rnd(2, 5); k = rnd(3, 10); }
      if (nb !== k && nb * k <= (lvl === 2 ? 40 : 30)) break;
    }
    if (nb === k) return null;
    const t = nb * k;
    const pb = { kind, unknown, ctx: { id: 'grp-' + c.u, max: 40, ...c }, P, Q: M.people.pick({ not: [P.n] }), emoji: c.emoji, u: c.u, uX: c.boxes, lvl };
    const S = (text, role) => ({ text: typo(text), role: role || (/\d/.test(text) ? 'data' : 'story') });
    pb.v = { nb, k, total: t };
    pb.barO = { nb, k, t, unk: unknown === 'total' ? 'total' : unknown };
    const terms = Array(nb).fill(k);
    if (kind === 'groupes') {
      pb.sentences = [S(`${P.n} a ${nb} ${c.boxes}.`), S(`${c.prep} chaque ${c.box}, il y a ${k} ${c.u}.`), S(`Combien ${de(c.u)} ${P.n} a-t-${P.il} en tout ?`, 'question')];
      pb.reply = typo(`${P.n} a ${t} ${c.u} en tout.`);
      pb.answer = t; pb.known = ['nb', 'k'];
      pb.solve = { terms, r: t };
      pb.fam = 'grp';
      pb.explain = `${nb} groupes de ${k} : ${terms.join(' + ')} = <b>${t}</b>.`;
      pb.hint = `Compte par bonds de ${k}.`;
      pb.seekChoices = [{ label: typo(`${P.n} a ❓ ${c.u} en tout.`), value: 'total' }, { label: typo(`${P.n} a ❓ ${c.boxes}.`), value: 'nb' }];
    } else if (unknown === 'parPart') {
      pb.sentences = [S(`${P.n} a ${t} ${c.u}.`), S(`${P.Il} les partage également entre ${nb} amis.`), S(`Combien ${de(c.u)} chaque ami reçoit-il ?`, 'question')];
      pb.reply = typo(`Chaque ami reçoit ${k} ${c.u}.`);
      pb.answer = k; pb.known = ['total', 'nb'];
      pb.solve = { terms, r: t, share: true };
      pb.fam = 'shr';
      pb.explain = `On distribue un à la fois entre ${nb} amis. Chacun reçoit <b>${k}</b>, car ${terms.join(' + ')} = ${t}.`;
      pb.hint = 'Distribue un à la fois, comme quand on donne des cartes.';
      pb.seekChoices = [{ label: typo(`Chaque ami reçoit ❓ ${c.u}.`), value: 'parPart' }, { label: typo(`${P.n} a ❓ amis.`), value: 'nb' }];
    } else {
      pb.sentences = [S(`${P.n} a ${t} ${c.u}.`), S(`${P.Il} en met ${k} ${c.prep.toLowerCase()} chaque ${c.box}.`), S(`Combien ${de(c.boxes)} ${P.n} remplit-${P.il} ?`, 'question')];
      pb.reply = typo(`${P.n} remplit ${nb} ${c.boxes}.`);
      pb.answer = nb; pb.known = ['total', 'k'];
      pb.solve = { terms, r: t, count: true };
      pb.fam = 'cnt';
      pb.uX = c.u;
      pb.explain = `On fait des paquets de ${k} : ${terms.join(' + ')} = ${t}. Il y a <b>${nb}</b> paquets.`;
      pb.hint = `Fais des paquets de ${k} jusqu'à ${t}.`;
      pb.seekChoices = [{ label: typo(`${P.n} remplit ❓ ${c.boxes}.`), value: 'nb' }, { label: typo(`${P.n} met ❓ ${c.u} ${c.prep.toLowerCase()} chaque ${c.box}.`), value: 'k' }];
    }
    return pb;
  }

  /** Deux étapes (composition de transformations). sub : positive | negative | mixte */
  function makeDeux(lvl, opts) {
    const sub = opts.sub || (lvl === 0 ? 'positive' : lvl === 1 ? pick(['negative', 'mixte', 'mixte']) : 'mixte');
    const ops = sub === 'positive' ? ['+', '+'] : sub === 'negative' ? ['-', '-'] : pick([['+', '-'], ['-', '+']]);
    const max = opts.max || (lvl === 2 ? 100 : 20);
    let a, b, c, mid, fin, ok = false;
    for (let g = 0; g < 200 && !ok; g++) {
      if (max <= 20) { a = rnd(2, 15); b = rnd(2, 8); c = rnd(2, 8); }
      else { a = rnd(15, 70); b = rnd(5, 30); c = rnd(5, 30); }
      mid = ops[0] === '+' ? a + b : a - b;
      fin = ops[1] === '+' ? mid + c : mid - c;
      const all = [a, b, c, mid, fin];
      ok = mid > 0 && fin > 0 && Math.max(...all) <= max && new Set(all).size === 5;
    }
    if (!ok) return null;
    const pool = D().DEUX.filter((x) => x.max >= Math.max(a, mid, fin) && (!opts.ctx || opts.ctx(x)));
    if (!pool.length) return null;
    const ctx = pick(pool);
    const P = M.people.pick();
    const vars = pv(P);
    const ev = (op, n) => fill((op === '+' ? ctx.up : ctx.down), { ...vars, n });
    const pb = { kind: 'deux', unknown: 'fin', sub, ctx, P, Q: M.people.pick({ not: [P.n] }), emoji: ctx.emoji, u: ctx.u, uX: ctx.uX, lvl };
    pb.v = { a, b, c, mid, fin };
    pb.ops = ops;
    pb.sentences = [
      { text: fill(ctx.start, { ...vars, a }), role: 'data' },
      { text: typo(ctx.c1 + ev(ops[0], b).replace(/^./, (x) => (/\d/.test(x) ? x : x.toLowerCase()))), role: 'data' },
      { text: typo(ctx.c2 + ev(ops[1], c).replace(/^./, (x) => (/\d/.test(x) ? x : x.toLowerCase()))), role: 'data' },
      { text: fill(ctx.q, vars), role: 'question' },
    ];
    pb.q1 = fill(ctx.q1, vars);
    pb.answer = fin;
    pb.known = ['a', 'b', 'c'];
    pb.reply = fill(ctx.r, { ...vars, n: fin });
    pb.solve = { a: mid, op: ops[1], b: c, r: fin };
    pb.solve1 = { a, op: ops[0], b, r: mid };
    pb.fam = 'deux';
    pb.barO = ops[0] === '+' ? { x: a, y: b, t: mid, unk: 't' } : { x: mid, y: b, t: a, toneY: 'X', unk: 'x' };
    pb.barO2 = ops[1] === '+' ? { x: mid, y: c, t: fin, unk: 't' } : { x: fin, y: c, t: mid, toneY: 'X', unk: 'x' };
    pb.explain = `D'abord : ${expr(pb.solve1)} = ${mid}. Ensuite : ${expr(pb.solve)} = <b>${fin}</b>.`;
    pb.hint = `Une étape à la fois : d'abord ${expr(pb.solve1)}.`;
    return pb;
  }

  /** Fabrique un problème cohérent (≤ 40 essais). */
  PB.make = function (opts = {}) {
    const lvl = opts.lvl || 0;
    const kinds = opts.kinds || ['ajout', 'retrait'];
    for (let tries = 0; tries < 40; tries++) {
      const kind = pick(kinds);
      const allowed = (opts.unknowns && opts.unknowns[kind]) || UNK[kind][Math.min(2, lvl)];
      const unknown = pick(allowed);
      let pb = null;
      try {
        if (kind === 'deux') pb = makeDeux(lvl, opts);
        else if (kind === 'groupes' || kind === 'partage') pb = makeGroups(kind, unknown, lvl, opts);
        else pb = makeAdd(kind, unknown, lvl, opts);
      } catch (e) { if (tries === 39) throw e; pb = null; }
      if (!pb) continue;
      if (pb.knownVals === undefined) pb.knownVals = pb.known.map((r) => pb.v[r]);
      if (opts.distract && !addDistractors(pb, opts.distract, opts.near)) continue;
      finish(pb);
      pb.barSpec = (reveal) => (pb.fam === 'cmp' ? cmpSpec(pb.barO, reveal) : ['grp', 'shr', 'cnt'].includes(pb.fam) ? grpSpec(pb.barO, reveal) : toutSpec(pb.barO, reveal));
      if (!PB.check(pb)) return pb;
    }
    throw new Error('M.pb.make : aucun problème cohérent');
  };

  /* ------------------------------------------------------------------ passage */
  PB.passage = function (pb, sentences) {
    const sents = sentences || pb.sentences;
    const tokens = sentences ? tokensOf(sents) : pb.tokens;
    return { title: `${pb.emoji} Le problème`, tokens, say: sents.map((s) => s.text).join(' ') };
  };
  PB.storyHtml = (pb) => `<div class="pb-story"><span class="pb-em">${pb.emoji}</span>${M.esc(pb.text)}</div>`;

  /* ------------------------------------------------------------------ étapes */
  const ST = (PB.step = {});
  const wordList = (vals) => (vals.length === 2 ? `${vals[0]} et ${vals[1]}` : vals.slice(0, -1).join(', ') + ' et ' + vals[vals.length - 1]);
  const dataVals = (pb) => pb.dataTok.map((i) => +/^\d+/.exec(pb.tokens[i].w)[0]);

  ST.question = (pb) => ({
    demarche: 1, prompt: 'Touche la <b>question</b> dans le texte.', format: 'tapwords', target: 'passage', unit: 'sentence', mark: 'q',
    answer: [pb.qIndex], hint: 'La question se termine par un point d\'interrogation (?).', after: 'C\'est la question : elle finit par « ? ». On la colorie en bleu.',
  });
  ST.donnees = (pb) => ({
    demarche: 1, prompt: pb.xTok.length ? `Touche les <b>${pb.dataTok.length} nombres utiles</b>. Attention : un nombre ne sert pas !` : `Touche les <b>${pb.dataTok.length} nombres</b> utiles.`,
    format: 'tapwords', target: 'passage', mark: 'd', select: 'many', answer: pb.dataTok.slice(),
    hint: pb.xTok.length ? 'Garde seulement les nombres qui parlent de ce que la question demande.' : 'Cherche les nombres dans l\'histoire.',
    after: `Les données : ${wordList(dataVals(pb))}.`,
  });
  ST.inutiles = (pb) => ({
    demarche: 1, prompt: pb.xTok.length > 1 ? `Touche les <b>${pb.xTok.length} nombres</b> qui ne servent <b>pas</b> pour répondre.` : 'Touche le nombre qui ne sert <b>pas</b> pour répondre.',
    format: 'tapwords', target: 'passage', mark: 'x', select: pb.xTok.length > 1 ? 'many' : 'one', answer: pb.xTok.slice(),
    hint: 'Relis la question. Quel nombre ne parle pas de ce qu\'on cherche ?',
    after: 'On le barre : il ne sert pas pour le calcul.',
  });

  /** Choix de schémas : le bon (pb.barSpec) + des familles voisines construites avec les mêmes nombres. */
  ST.schemaChoices = function (pb, lvl) {
    const kv = pb.knownVals.length >= 2 ? pb.knownVals.slice(0, 2) : [pb.v.nb, pb.v.k];
    let hi = Math.max(...kv), lo = Math.min(...kv);
    if (['grp', 'shr', 'cnt'].includes(pb.fam)) { const o = pb.barO; hi = o.unk === 'total' ? Math.max(o.nb, o.k) : o.t; lo = o.unk === 'total' ? Math.min(o.nb, o.k) : o.unk === 'nb' ? o.k : o.nb; }
    const fams = {
      sum: { spec: toutSpec({ x: hi, y: lo, t: hi + lo, unk: 't' }), why: 'Ce schéma cherche le <b>tout</b> : les deux parties ensemble.' },
      part: { spec: toutSpec({ x: lo, y: hi - lo, t: hi, unk: 'y' }), why: 'Ce schéma connaît le tout et cherche une <b>partie</b>.' },
      cmp: { spec: cmpSpec({ g: hi, p: lo, e: hi - lo, unk: 'ecart' }), why: 'Ce schéma <b>compare</b> deux quantités.' },
      cmpR: { spec: pb.fam === 'cmp' ? cmpSpec({ ...pb.barO, swap: true }) : null, why: 'Regarde qui en a le plus : sa barre doit être la plus longue.' },
    };
    const others = { sum: ['part', 'cmp'], part: ['sum', 'cmp'], cmp: ['cmpR', 'sum'], grp: ['sum', 'cmp'], shr: ['part', 'sum'], cnt: ['part', 'sum'] }[pb.fam] || ['sum', 'part'];
    const list = [{ label: bar(pb.barSpec(false)), value: 'ok' }];
    others.slice(0, lvl === 0 ? 1 : 2).forEach((f) => { if (fams[f].spec) list.push({ label: bar(fams[f].spec), value: f, why: fams[f].why }); });
    return shuffle(list);
  };
  const SCHEMA_AFTER = {
    sum: 'Deux parties connues : on cherche le <b>tout</b>.',
    part: 'Le tout et une partie sont connus : on cherche l\'<b>autre partie</b>.',
    cmp: 'Deux barres face à face : on <b>compare</b>.',
    grp: 'Des groupes égaux : on cherche le <b>total</b>.',
    shr: 'Le total est partagé en parts égales.',
    cnt: 'On fait des paquets égaux dans le total.',
    deux: 'On fait une étape à la fois.',
  };
  ST.schema = (pb, lvl) => ({
    demarche: 2, prompt: 'Quel <b>schéma</b> va avec l\'histoire ?', format: 'choice', cols: 1, answer: 'ok',
    choices: ST.schemaChoices(pb, lvl), hint: pb.hint, after: SCHEMA_AFTER[pb.fam],
  });

  /** Choix de calcul : le bon, l'autre opération, la soustraction à l'envers (petit − grand). */
  ST.opChoices = function (pb, lvl) {
    const s = pb.solve;
    if (s.terms) {
      const nb = s.terms.length, k = s.terms[0];
      return shuffle([{ label: s.terms.join(' + '), value: 'ok' }, { label: `${nb} + ${k}`, value: 'other', why: `${nb} + ${k}, c'est seulement ${nb + k}.` }, ...(lvl ? [{ label: `${Math.max(nb, k)} ${MINUS} ${Math.min(nb, k)}`, value: 'rev', why: 'On ne cherche pas un écart : on réunit des groupes égaux.' }] : [])]);
    }
    const hi = Math.max(s.a, s.b), lo = Math.min(s.a, s.b);
    const other = s.op === '+' ? { a: hi, op: '-', b: lo } : { a: s.a, op: '+', b: s.b };
    const otherR = other.op === '+' ? other.a + other.b : other.a - other.b;
    const list = [{ label: expr(s), value: 'ok' }, { label: expr(other), value: 'other', why: `Ce calcul donne ${otherR}. ${otherR > Math.max(...pb.knownVals) ? 'C\'est plus que tous les nombres de l\'histoire.' : 'Relis l\'histoire : est-ce que ça a du sens ?'}` }];
    if (lvl) list.push({ label: `${lo} ${MINUS} ${hi}`, value: 'rev', why: `On ne peut pas enlever ${hi} de ${lo} : c'est trop !` });
    return shuffle(list);
  };
  ST.operation = (pb, lvl) => ({
    demarche: 2, prompt: 'Quel <b>calcul</b> répond à la question ?', format: 'choice', answer: 'ok', cols: lvl ? 3 : 2,
    choices: ST.opChoices(pb, lvl).map((c) => ({ ...c, label: `<span class="pb-op">${c.label}</span>` })), hint: pb.hint, after: pb.trap ? 'Les mots « de plus » ou « de moins » ne choisissent pas l\'opération. Le dessin la choisit !' : SCHEMA_AFTER[pb.fam],
  });

  /** Équation qui raconte l'histoire (le « ? » est à la place de l'inconnue). */
  const solveEq = (e) => {
    const [A, op, B, , C] = e;
    let r;
    if (C === null) r = op === '+' ? A + B : A - B;
    else if (A === null) r = op === '+' ? C - B : C + B;
    else r = op === '+' ? C - A : A - C;
    return r;
  };
  PB.solveEq = solveEq;
  ST.equation = (pb) => {
    const right = eqStr(pb.situation);
    const [x, y] = pb.knownVals;
    const cands = shuffle([[x, '+', y, '=', null], [x, '-', y, '=', null], [y, '-', x, '=', null], [x, '+', null, '=', y], [y, '+', null, '=', x], [null, '+', x, '=', y], [x, '-', null, '=', y], [null, '-', x, '=', y], [y, '-', null, '=', x], [null, '-', y, '=', x]]);
    const wrong = [];
    for (const c of cands) {
      const r = solveEq(c), s = eqStr(c);
      if (r > 0 && r !== pb.answer && s !== right && !wrong.includes(s)) wrong.push(s);
      if (wrong.length === 2) break;
    }
    return {
      demarche: 2, prompt: 'Quelle <b>équation</b> raconte l\'histoire ? (Le ? est le nombre caché.)', format: 'choice', cols: 1, answer: 'ok',
      choices: shuffle([{ label: `<span class="pb-eqc">${right}</span>`, value: 'ok' }, ...wrong.map((w, i) => ({ label: `<span class="pb-eqc">${w}</span>`, value: 'w' + i }))]),
      hint: pb.hint, after: `${right} : le ? est ce qu'on cherche.`,
    };
  };

  function calcHint(s) {
    if (s.terms) return `Compte par bonds de ${s.terms[0]}.`;
    if (s.op === '+') return s.a + s.b <= 20 ? `Pars de ${Math.max(s.a, s.b)} et avance de ${Math.min(s.a, s.b)}.` : 'Additionne les dizaines, puis les unités.';
    return s.a <= 20 ? `Pars de ${s.a} et recule de ${s.b}. Ou pense : ${s.b} + ? = ${s.a}.` : `Pense à l'addition à trou : ${s.b} + ? = ${s.a}.`;
  }
  /** Calcul : number avec le modèle en barres en visuel d'étape. */
  ST.calcul = (pb, lvl, which) => {
    const s = which === 1 ? pb.solve1 : pb.solve;
    const barO = which === 1 ? pb.barO : which === 2 ? pb.barO2 : null;
    const spec = barO ? toutSpec(barO) : pb.barSpec(false);
    const viz = (el) => { el.innerHTML = `<div class="bm-wrap pb-stepbar">${bar(spec)}</div>`; };
    if (s.share) return { demarche: 3, prompt: `On partage ${s.r} en ${s.terms.length} parts égales. Dans chaque part : {?}`, format: 'number', answer: s.terms[0], hint: pb.hint, viz: (el) => { if (M.opViz && M.opViz.share) M.opViz.share(el, { total: s.r, n: s.terms.length, emoji: pb.emoji, mode: 'share' }); else viz(el); } };
    if (s.count) return { demarche: 3, prompt: `On fait des paquets de ${s.terms[0]} avec ${s.r}. Nombre de paquets : {?}`, format: 'number', answer: s.terms.length, hint: pb.hint, viz: (el) => { if (M.opViz && M.opViz.share) M.opViz.share(el, { total: s.r, k: s.terms[0], emoji: pb.emoji, mode: 'boxes' }); else viz(el); } };
    return { demarche: 3, prompt: eqHtml(`${expr(s)} = {?}`), format: 'number', answer: s.r, hint: calcHint(s), viz, after: `${expr(s)} = ${s.r}.` };
  };
  /** Vérification à l'envers (opération inverse). */
  ST.verifier = (pb) => {
    const s = pb.solve;
    if (s.terms) return ST.sens(pb);
    const inv = s.op === '+' ? { a: s.r, op: '-', b: s.b, r: s.a } : { a: s.r, op: '+', b: s.b, r: s.a };
    return {
      demarche: 4, prompt: `Vérifie à l'envers : ${eqHtml(`${expr(inv)} = {?}`)}`, format: 'number', answer: inv.r,
      hint: s.op === '+' ? `Enlève ${s.b} à ta réponse : tu dois retrouver ${s.a}.` : `Ajoute ${s.b} à ta réponse : tu dois retrouver ${s.a}.`,
      after: `On retrouve ${s.a} : ça a du sens !`,
    };
  };
  /** Plus ou moins que la plus grande donnée ? (deux étapes : que le début) */
  PB.senseRef = (pb) => (pb.kind === 'deux' ? pb.v.a : Math.max(...pb.knownVals));
  ST.sens = (pb) => {
    const ref = PB.senseRef(pb);
    const plus = pb.answer > ref;
    return {
      demarche: 4, prompt: pb.kind === 'deux' ? `À la fin, y en a-t-il plus ou moins qu'au début (${ref}) ?` : `Sans calculer : la réponse est-elle plus grande ou plus petite que <b>${ref}</b> ?`,
      format: 'choice', answer: plus ? 'plus' : 'moins',
      choices: [{ label: pb.kind === 'deux' ? '⬆️ plus' : `⬆️ plus grande que ${ref}`, value: 'plus' }, { label: pb.kind === 'deux' ? '⬇️ moins' : `⬇️ plus petite que ${ref}`, value: 'moins' }],
      hint: pb.hint, after: plus ? `Oui : ${pb.answer} est plus grand que ${ref}.` : `Oui : ${pb.answer} est plus petit que ${ref}.`,
    };
  };

  /** Phrase-réponse : cloze (1 ou 2 trous) ou choix parmi 4 phrases (lvl 2). */
  ST.phrase = (pb, lvl) => {
    const n = String(pb.answer);
    const words = pb.reply.split(' ');
    const iN = words.indexOf(n);
    if (lvl >= 2) {
      const set = new Map();
      set.set(pb.reply, 'ok');
      const swapNum = words.map((w, i) => (i === iN ? String(pb.knownVals[0]) : w)).join(' ');
      set.set(swapNum, 'num');
      const unitW = (words[iN + 1] || '').replace(/[.,!?]+$/, '');
      if (unitW && pb.uX && unitW !== pb.uX) set.set(words.map((w, i) => (i === iN + 1 ? w.replace(unitW, pb.uX) : w)).join(' '), 'unit');
      const names = [pb.P, pb.Q, pb.G, pb.S].filter(Boolean).map((p) => p.n);
      const who = names.find((nm) => pb.reply.includes(nm));
      const other = who && names.find((nm) => nm !== who);
      if (other) { const t = pb.reply.split(who).join(other); if (!set.has(t)) set.set(t, 'who'); }
      const qtxt = pb.sentences[pb.qIndex].text;
      if (set.size < 4 && !set.has(qtxt)) set.set(qtxt, 'q');
      const choices = [...set.entries()].slice(0, 4).map(([label, value]) => ({ label: M.esc(label), value, say: label, why: { num: 'Vérifie le <b>nombre</b> : c\'est le résultat du calcul ?', unit: 'Vérifie le <b>mot</b> après le nombre.', who: 'Vérifie <b>qui</b> : relis la question.', q: 'Une réponse n\'est pas une question !' }[value] }));
      return { demarche: 5, prompt: 'Choisis la bonne <b>phrase-réponse</b>.', format: 'choice', cols: 1, answer: 'ok', choices: shuffle(choices), hint: 'Qui ? Combien ? De quoi ? La phrase répond à la question.' };
    }
    const nums = [n, ...pb.knownVals.map(String)].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
    const blanks = [{ choices: shuffle(nums), answer: n }];
    const w2 = words.slice();
    w2[iN] = '{0}';
    if (lvl === 1 && words[iN + 1]) {
      const m = /^(.+?)([.,!?]*)$/.exec(words[iN + 1]);
      const unitW = m[1];
      if (pb.uX && unitW !== pb.uX) { w2[iN + 1] = '{1}' + m[2]; blanks.push({ choices: shuffle([unitW, pb.uX]), answer: unitW }); }
    }
    return { demarche: 5, prompt: 'Complète la <b>phrase-réponse</b>.', format: 'cloze', text: w2.join(' '), blanks, hint: 'Mets le résultat de ton calcul, puis relis la phrase.' };
  };

  /** Premier calcul d'un problème à deux étapes. */
  ST.plan = (pb) => {
    const { a, b, c } = pb.v;
    const flip = (op) => (op === '+' ? '-' : '+');
    const list = [{ label: expr(pb.solve1), value: 'ok' }, { label: expr({ a, op: flip(pb.ops[0]), b }), value: 'w1', why: 'Relis la 2e phrase : est-ce qu\'on en ajoute ou qu\'on en enlève ?' }, { label: expr({ a, op: flip(pb.ops[1]), b: c }), value: 'w2', why: 'Que se passe-t-il <b>d\'abord</b> ?' }];
    return { demarche: 2, prompt: 'Quel calcul fais-tu <b>d\'abord</b> ?', format: 'choice', cols: 3, answer: 'ok', choices: shuffle(list).map((c) => ({ ...c, label: `<span class="pb-op">${c.label}</span>` })), hint: 'Suis l\'ordre de l\'histoire : que se passe-t-il d\'abord ?', after: `D'abord ${expr(pb.solve1)}, ensuite on continue avec le résultat.` };
  };

  /** Typographie française sur les textes de chaque étape (espace insécable avant ? ! : ;). */
  const fx = (st) => {
    ['prompt', 'hint', 'after'].forEach((k) => { if (typeof st[k] === 'string') st[k] = typo(st[k]); });
    (st.choices || []).forEach((c) => { if (c.why) c.why = typo(c.why); });
    return st;
  };
  Object.keys(ST).filter((k) => !/Choices$/.test(k)).forEach((k) => { const f = ST[k]; ST[k] = (...a) => fx(f(...a)); });

  /** Recette → question steps. Les étapes calcul2 reportent la réponse de calcul1 ({sK}). */
  PB.toSteps = function (pb, recipe, { lvl = 0, scoreSteps, prompt } = {}) {
    const steps = [];
    let c1 = -1;
    recipe.forEach((name) => {
      let s;
      if (name === 'calcul1') { s = ST.calcul(pb, lvl, 1); c1 = steps.length; }
      else if (name === 'calcul2') {
        s = ST.calcul(pb, lvl, 2);
        if (c1 >= 0) s.prompt = eqHtml(`{s${c1 + 1}} ${opS(pb.solve.op)} ${pb.solve.b} = {?}`);
      } else s = ST[name](pb, lvl);
      steps.push(s);
    });
    const q = { prompt: prompt || 'Résous le problème, une étape à la fois.', passage: PB.passage(pb), format: 'steps', steps, explain: pb.explain + ' ' + M.esc(pb.reply) };
    if (scoreSteps) q.scoreSteps = scoreSteps.map((n) => recipe.indexOf(n)).filter((i) => i >= 0);
    return PB.attach(q, pb);
  };
  /** Lie le problème à la question (non énumérable : pas de JSON). */
  PB.attach = (q, pb) => { Object.defineProperty(q, '_pb', { value: pb, enumerable: false }); return q; };

  /* ------------------------------------------------------------------ contrôles (G13) */
  const BADTYPO = / [?!:;]/;
  const strip = (h) => String(h).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  PB.check = function (pb) {
    const v = pb.v;
    const vals = Object.values(v);
    if (!vals.every((x) => Number.isInteger(x) && x > 0)) return 'valeurs non entières ou ≤ 0';
    if (pb.ctx.max && Math.max(...vals) > pb.ctx.max) return `valeur > max du contexte (${pb.ctx.id})`;
    // recalcul
    let r;
    if (pb.kind === 'ajout') r = { fin: v.debut + v.change, change: v.fin - v.debut, debut: v.fin - v.change }[pb.unknown];
    else if (pb.kind === 'retrait') r = { fin: v.debut - v.change, change: v.debut - v.fin, debut: v.fin + v.change }[pb.unknown];
    else if (pb.kind === 'reunion') r = pb.unknown === 'tout' ? v.p1 + v.p2 : v.tout - v.p1;
    else if (pb.kind === 'comparaison') r = { ecart: v.grand - v.petit, petit: v.grand - v.ecart, grand: v.petit + v.ecart }[pb.unknown];
    else if (pb.kind === 'groupes') r = v.nb * v.k;
    else if (pb.kind === 'partage') { if (v.total % v.nb !== 0) return 'partage inexact'; r = pb.unknown === 'nb' ? v.total / v.k : v.total / v.nb; }
    else if (pb.kind === 'deux') { const m = pb.ops[0] === '+' ? v.a + v.b : v.a - v.b; r = pb.ops[1] === '+' ? m + v.c : m - v.c; if (m !== v.mid) return 'étape 1 fausse'; }
    if (r !== pb.answer) return `réponse ${pb.answer} ≠ recalcul ${r}`;
    if (pb.solve.r !== (pb.solve.terms ? pb.solve.terms.reduce((a, b) => a + b, 0) : pb.solve.op === '+' ? pb.solve.a + pb.solve.b : pb.solve.a - pb.solve.b)) return 'calcul-solution faux';
    if (!pb.solve.terms && pb.solve.r !== pb.answer) return 'solve.r ≠ answer';
    if (pb.situation && solveEq(pb.situation) !== pb.answer) return `équation-situation ${eqStr(pb.situation)} ne donne pas ${pb.answer}`;
    if (pb.kind === 'comparaison' && (v.grand === v.petit || pb.P.n === pb.Q.n)) return 'comparaison dégénérée';
    // valeurs connues distinctes, réponse jamais égale à une donnée
    const kv = pb.known.map((k) => v[k]);
    if (new Set(kv).size !== kv.length) return 'données en double';
    if (kv.includes(pb.answer)) return 'la réponse est égale à une donnée';
    if ((pb.xVals || []).some((x) => vals.includes(x))) return 'donnée inutile égale à une valeur';
    // question unique, « ? » unique, typographie
    const qs = pb.sentences.filter((s) => s.role === 'question');
    if (qs.length !== 1) return `${qs.length} phrases-questions`;
    if ((qs[0].text.match(/\?/g) || []).length !== 1 || !qs[0].text.endsWith(NB + '?')) return 'question mal ponctuée';
    for (const s of pb.sentences) {
      if (BADTYPO.test(s.text)) return 'espace ordinaire avant ? ! : ;';
      if (/[{}]/.test(s.text)) return 'gabarit non rempli : ' + s.text;
      if (s.role !== 'question' && /\?/.test(s.text)) return '« ? » hors de la question';
    }
    if (BADTYPO.test(pb.reply) || /[{}❓]/.test(pb.reply)) return 'phrase-réponse invalide';
    if (pb.reply.split(' ').indexOf(String(pb.answer)) < 0) return 'phrase-réponse sans la réponse';
    // jetons : chaque donnée exactement une fois, l'inconnue jamais
    const nums = pb.tokens.filter((t) => /^\d/.test(t.w)).map((t) => +/^\d+/.exec(t.w)[0]);
    for (const k of pb.known) if (nums.filter((x) => x === v[k]).length !== 1) return `donnée ${k}=${v[k]} absente ou répétée`;
    if (nums.includes(pb.answer)) return 'la réponse apparaît dans le texte';
    if (nums.some((x) => !kv.includes(x) && !(pb.xVals || []).includes(x))) return 'nombre inattendu dans le texte';
    if (pb.dataTok.length !== kv.length) return 'jetons de données incohérents';
    if (pb.xTok.length !== (pb.xVals || []).length) return 'jetons inutiles incohérents';
    // deux personnes de même genre : la question nomme toujours
    if (pb.kind === 'comparaison' && pb.G.f === pb.S.f && !/[A-ZÉ][a-zéëèï]+/.test(qs[0].text.replace(/^Combien/, ''))) return 'question ambiguë';
    return undefined;
  };

  /** Contrôle d'une question générée : invariants du problème + calculs des étapes + choix distincts. */
  PB.checkQ = function (q) {
    const pb = q._pb;
    if (pb) { const e = PB.check(pb); if (e) return e; }
    const subs = q.format === 'steps' ? q.steps : [q];
    const answers = {};
    for (let i = 0; i < subs.length; i++) {
      const s = subs[i];
      let prompt = String(s.prompt || '').replace(/\{s(\d+)\}/g, (m, k) => (answers[k] !== undefined ? answers[k] : m));
      if (/\{s\d+\}/.test(prompt)) return `étape ${i} : report {sK} invalide`;
      const txt = strip(prompt.replace('{?}', '§'));
      if (BADTYPO.test(txt.replace(/ \(\?\)/g, ''))) return `étape ${i} : typographie (${txt.slice(0, 40)})`;
      if (s.format === 'number') {
        const m = /(\d+(?: [+−-] \d+)+) = §/.exec(txt);
        if (m) {
          const parts = m[1].split(' ');
          let r = +parts[0];
          for (let k = 1; k < parts.length; k += 2) r = parts[k] === '+' ? r + +parts[k + 1] : r - +parts[k + 1];
          if (r !== s.answer) return `étape ${i} : ${m[1]} = ${r} ≠ ${s.answer}`;
        }
        answers[i + 1] = String(s.answer);
      } else answers[i + 1] = 'x';
      if (s.format === 'choice' && !s.choices.some((c) => /<svg/.test(c.label))) {
        const labels = s.choices.map((c) => strip(c.label));
        if (new Set(labels).size !== labels.length) return `étape ${i} : libellés de choix en double`;
      }
      if (pb && s.format === 'tapwords' && s.target === 'passage') {
        const want = s.mark === 'q' ? [pb.qIndex] : s.mark === 'x' ? pb.xTok : pb.dataTok;
        if (s.answer.join() !== want.join()) return `étape ${i} : marques incohérentes`;
      }
      if (pb && s.format === 'cloze' && /^\d+$/.test(String(s.blanks[0].answer)) && +s.blanks[0].answer !== pb.answer) return `étape ${i} : phrase-réponse ≠ réponse`;
    }
    if (q.passage && q.passage.tokens && q.passage.tokens.some((t) => BADTYPO.test(' ' + t.w))) return 'passage : ponctuation détachée';
    return undefined;
  };
})();
