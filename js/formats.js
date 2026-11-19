/* =====================================================================
   formats.js — bibliothèque des FORMATS de questions

   Un format = une façon de répondre. Toutes les matières partagent les
   mêmes formats pour que l'enfant retrouve toujours les mêmes gestes.

   M.registerFormat(name, {
     doc:          'description courte (guide de style)',
     layout?:      'wide'  → zone de réponse pleine largeur
     validate(q):  → message d'erreur | undefined   (utilisé par tools/check-skills.js)
     render(host, q, ctx) → { reveal?(), lock?() }
     maxTries?(q): nombre d'essais (défaut 2)
     answerLabel?(q): html de la bonne réponse
     instruction?(q): texte d'invite sous la zone de réponse
     retryMessage?(q, val): html
   })

   ctx (fourni par session.js) :
     ctx.attempt(ok, val) → 'correct' | 'retry' | 'failed'   (gère les essais)
     ctx.complete(first, ok)   (formats à correction progressive : match, sort, steps)
     ctx.feedback(cls, html), ctx.setInline(html), ctx.hasInline, ctx.onKey(fn), ctx.done
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  M.formats = {};
  M.registerFormat = (name, def) => { def.name = name; M.formats[name] = def; };

  const same = (a, b) => String(a) === String(b);
  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.some((y) => same(x, y)));
  const labelOf = (q, v) => { const c = (q.choices || []).find((c) => same(c.value, v)); return c ? c.label : String(v); };
  const checkChoices = (q) => {
    if (!Array.isArray(q.choices) || q.choices.length < 2) return 'choices : au moins 2';
    const vals = q.choices.map((c) => String(c.value));
    if (new Set(vals).size !== vals.length) return 'choices en double';
  };

  /* ------------------------------------------------------------------ number
     Pavé numérique. Champs : answer (entier ≥ 0), unit?, {?} dans prompt. */
  M.registerFormat('number', {
    doc: 'Pavé numérique; la réponse peut s\'afficher dans la consigne avec {?}.',
    validate(q) { if (!Number.isInteger(q.answer) || q.answer < 0) return 'answer : entier ≥ 0'; },
    instruction: () => 'Écris ta réponse 👇',
    answerLabel: (q) => q.answer + (q.unit ? ' ' + q.unit : ''),
    render(host, q, ctx) {
      let input = '', revealed = false;
      host.innerHTML = `<div class="solo-box"></div>
        <div class="pad">${['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((k) => `<button class="key" data-k="${k}">${k}</button>`).join('')}
        <button class="key del" data-k="del" aria-label="Effacer un chiffre">⌫</button><button class="key" data-k="0">0</button><button class="key del" data-k="clr" aria-label="Tout effacer">✕</button>
        <button class="key ok" data-k="ok">✓ Vérifier</button></div>`;
      const draw = () => {
        const v = revealed ? String(q.answer) : input;
        const box = `<span class="ans-box${v ? ' filled' : ''}${revealed || ctx.done ? ' good' : ''}">${v || '?'}</span>`;
        if (ctx.hasInline) ctx.setInline(box);
        M.$('.solo-box', host).innerHTML = (ctx.hasInline ? '' : box) + (q.unit ? `<span class="unit">${q.unit}</span>` : '');
      };
      const press = (k) => {
        if (ctx.done) return;
        if (k === 'ok') {
          if (input === '') return ctx.feedback('bad', 'Écris un nombre d\'abord 🙂');
          const v = +input;
          const r = ctx.attempt(v === +q.answer, v);
          if (r === 'retry') { input = ''; setTimeout(() => { if (!ctx.done) draw(); }, 400); }
          draw();
          return;
        }
        if (k === 'del') input = input.slice(0, -1);
        else if (k === 'clr') input = '';
        else if (input.length < 4) input = (input === '0' ? '' : input) + k;
        M.sfx.tap();
        draw();
      };
      host.onclick = (e) => { const b = e.target.closest('.key'); if (b) press(b.dataset.k); };
      ctx.onKey((e) => {
        if (/^[0-9]$/.test(e.key)) press(e.key);
        else if (e.key === 'Backspace') press('del');
        else if (e.key === 'Enter') { e.preventDefault(); press('ok'); }
      });
      draw();
      return { reveal() { revealed = true; draw(); } };
    },
  });

  /* ------------------------------------------------------------------ choice
     Boutons. Champs : choices [{label (html), value}], answer, cols? */
  function renderChoice(host, q, ctx, choices) {
    const cols = q.cols || (choices.length <= 2 ? 2 : choices.length === 3 ? 3 : 2);
    host.innerHTML = `<div class="choices-grid" style="grid-template-columns:repeat(${cols},1fr)">${choices.map((c, i) => `<button class="choice-btn" data-i="${i}">${c.label}</button>`).join('')}</div>`;
    const pick = (b) => {
      if (!b || ctx.done || b.disabled) return;
      const c = choices[+b.dataset.i];
      const ok = same(c.value, q.answer);
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) b.disabled = true;
      ctx.attempt(ok, c.value);
    };
    host.onclick = (e) => pick(e.target.closest('.choice-btn'));
    ctx.onKey((e) => { if (/^[1-9]$/.test(e.key)) pick(M.$$('.choice-btn', host)[+e.key - 1]); });
    return {
      reveal() { M.$$('.choice-btn', host).forEach((b) => { if (same(choices[+b.dataset.i].value, q.answer)) b.classList.add('right'); }); },
      lock() { M.$$('.choice-btn', host).forEach((b) => (b.disabled = true)); },
    };
  }
  M.registerFormat('choice', {
    doc: 'Choix de réponses (texte, emoji ou SVG). 1 essai s\'il y a 2 choix, sinon 2.',
    validate(q) {
      const e = checkChoices(q); if (e) return e;
      const hits = q.choices.filter((c) => same(c.value, q.answer)).length;
      if (hits !== 1) return `la bonne réponse apparaît ${hits} fois`;
    },
    maxTries: (q) => (q.choices.length <= 2 ? 1 : 2),
    instruction: () => 'Choisis ta réponse 👇',
    answerLabel: (q) => labelOf(q, q.answer),
    render: (host, q, ctx) => renderChoice(host, q, ctx, q.choices),
  });

  /* ------------------------------------------------------------------ tf
     Vrai ou faux. Champ : answer (true | false). */
  const TF = [{ label: '✔️ Vrai', value: 'true' }, { label: '✖️ Faux', value: 'false' }];
  M.registerFormat('tf', {
    doc: 'Vrai ou faux (1 essai).',
    validate(q) { if (typeof q.answer !== 'boolean') return 'answer : true ou false'; },
    maxTries: () => 1,
    instruction: () => 'Vrai ou faux ? 👇',
    answerLabel: (q) => (q.answer ? '✔️ Vrai' : '✖️ Faux'),
    render: (host, q, ctx) => renderChoice(host, { ...q, answer: String(q.answer) }, ctx, TF),
  });

  /* ------------------------------------------------------------------ multi
     Plusieurs bonnes réponses. Champs : choices, answer [values] */
  M.registerFormat('multi', {
    doc: 'Coche toutes les bonnes réponses, puis Vérifier.',
    validate(q) {
      const e = checkChoices(q); if (e) return e;
      if (!Array.isArray(q.answer) || !q.answer.length) return 'answer : tableau non vide';
      if (!q.answer.every((a) => q.choices.some((c) => same(c.value, a)))) return 'answer hors des choices';
    },
    instruction: (q) => `Touche toutes les bonnes réponses (${q.answer.length}), puis Vérifier 👇`,
    answerLabel: (q) => q.answer.map((v) => labelOf(q, v)).join(', '),
    retryMessage(q, sel) {
      const missing = q.answer.filter((a) => !sel.some((s) => same(s, a))).length;
      const extra = sel.filter((s) => !q.answer.some((a) => same(s, a))).length;
      return (extra ? 'Il y en a qui ne vont pas. ' : '') + (missing ? 'Il en manque. ' : '') + 'Essaie encore 💪' + (q.hint ? `<div class="hint-text">💡 ${q.hint}</div>` : '');
    },
    render(host, q, ctx) {
      const sel = new Set();
      const cols = q.cols || (q.choices.length <= 4 ? 2 : 3);
      host.innerHTML = `<div class="choices-grid multi" style="grid-template-columns:repeat(${cols},1fr)">${q.choices.map((c, i) => `<button class="choice-btn" data-i="${i}" aria-pressed="false">${c.label}</button>`).join('')}</div>
        <button class="btn primary big fmt-check">✓ Vérifier</button>`;
      host.onclick = (e) => {
        if (ctx.done) return;
        const b = e.target.closest('.choice-btn');
        if (b) { const i = +b.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); b.classList.toggle('sel', sel.has(i)); b.setAttribute('aria-pressed', sel.has(i)); M.sfx.tap(); return; }
        if (e.target.closest('.fmt-check')) {
          if (!sel.size) return ctx.feedback('bad', 'Touche au moins une réponse 🙂');
          const vals = [...sel].map((i) => q.choices[i].value);
          ctx.attempt(sameSet(vals, q.answer), vals);
        }
      };
      return {
        reveal() { M.$$('.choice-btn', host).forEach((b) => { const v = q.choices[+b.dataset.i].value; b.classList.toggle('right', q.answer.some((a) => same(a, v))); }); },
      };
    },
  });

  /* ------------------------------------------------------------------ order
     Mettre en ordre. Champs : choices, answer [values dans l'ordre] */
  M.registerFormat('order', {
    doc: 'Touche les éléments dans le bon ordre.',
    validate(q) { if (!Array.isArray(q.answer) || !Array.isArray(q.choices) || q.answer.length !== q.choices.length) return 'answer/choices incohérents'; },
    instruction: () => 'Touche dans le bon ordre 👇',
    answerLabel: (q) => q.answer.map((v) => labelOf(q, v)).join(' → '),
    render(host, q, ctx) {
      let order = [];
      const draw = (reveal) => {
        const seq = reveal ? q.answer.map((v) => q.choices.findIndex((c) => same(c.value, v))) : order;
        host.innerHTML = `<div class="order-slots">${q.choices.map((_, i) => `<span class="slot ${reveal ? 'good' : ''}">${seq[i] != null ? q.choices[seq[i]].label : ''}</span>`).join('')}</div>
          <div class="choices-grid order" style="grid-template-columns:repeat(${Math.min(4, q.choices.length)},1fr)">${q.choices.map((c, i) => `<button class="choice-btn" data-i="${i}" ${order.includes(i) || reveal ? 'disabled' : ''}>${c.label}</button>`).join('')}</div>
          ${reveal ? '' : '<button class="btn small-undo">↺ Recommencer</button>'}`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        if (e.target.closest('.small-undo')) { order = []; draw(); return; }
        const b = e.target.closest('.choice-btn');
        if (!b || b.disabled) return;
        order.push(+b.dataset.i);
        M.sfx.tap();
        draw();
        if (order.length === q.choices.length) {
          const got = order.map((i) => String(q.choices[i].value));
          const r = ctx.attempt(got.join('|') === q.answer.map(String).join('|'));
          if (r === 'retry') setTimeout(() => { order = []; if (!ctx.done) draw(); }, 900);
        }
      };
      return { reveal() { draw(true); } };
    },
  });

  /* ------------------------------------------------------------------ text
     Écrire un mot ou une courte réponse (dictée, orthographe, anglais).
     Champs : answer (string | [strings acceptées]), caseSensitive?, accents? (true = exiger les accents, défaut true),
              keyboard? 'accents' (défaut) | 'full' | 'none', placeholder?, lang? */
  const norm = (s, q) => {
    let t = String(s).replace(/[’`]/g, '\'').replace(/\s+/g, ' ').trim();
    if (!q.caseSensitive) t = t.toLocaleLowerCase('fr-CA');
    if (q.accents === false) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return t;
  };
  const answers = (q) => (Array.isArray(q.answer) ? q.answer : [q.answer]);
  /** Compare lettre par lettre et retourne du html coloré (vert = bonne lettre à la bonne place). */
  M.letterDiff = function (guess, target) {
    const g = [...guess], t = [...target];
    return t.map((ch, i) => `<span class="ld ${g[i] && g[i].toLowerCase() === ch.toLowerCase() ? 'ok' : 'no'}">${g[i] && g[i].toLowerCase() === ch.toLowerCase() ? M.esc(ch) : '_'}</span>`).join('');
  };
  const ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'ù', 'û', 'ô', 'î', 'ï', 'ë', 'œ', '\'', '-'];
  const AZERTY = ['azertyuiop', 'qsdfghjklm', 'wxcvbn'];
  M.registerFormat('text', {
    doc: 'Écrire un mot (dictée, orthographe, anglais). Clavier d\'accents intégré.',
    validate(q) { const a = answers(q); if (!a.length || a.some((x) => typeof x !== 'string' || !x.trim())) return 'answer : texte non vide'; },
    instruction: () => 'Écris ta réponse, puis Vérifier 👇',
    answerLabel: (q) => M.esc(answers(q)[0]),
    retryMessage(q, val) {
      const t = answers(q)[0];
      return `Presque ! Les lettres vertes sont bien placées :<div class="ld-row">${M.letterDiff(val || '', t)}</div>` + (q.hint ? `<div class="hint-text">💡 ${q.hint}</div>` : '');
    },
    render(host, q, ctx) {
      const kb = q.keyboard || 'accents';
      host.innerHTML = `<div class="text-ans"><input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="${q.lang || 'fr-CA'}" placeholder="${M.esc(q.placeholder || 'Écris ici…')}" aria-label="Ta réponse"></div>
        ${kb === 'none' ? '' : `<div class="kb">${kb === 'full' ? AZERTY.map((r) => `<div class="kb-row">${[...r].map((c) => `<button class="kb-key" data-c="${c}">${c}</button>`).join('')}</div>`).join('') : ''}
          <div class="kb-row accents">${ACCENTS.map((c) => `<button class="kb-key" data-c="${c}">${c}</button>`).join('')}</div>
          <div class="kb-row">${kb === 'full' ? '<button class="kb-key wide" data-c=" ">espace</button>' : ''}<button class="kb-key" data-c="⌫" aria-label="Effacer">⌫</button></div></div>`}
        <button class="btn primary big fmt-check">✓ Vérifier</button>`;
      const inp = M.$('.text-input', host);
      setTimeout(() => { if (inp.isConnected && window.matchMedia && window.matchMedia('(pointer:fine)').matches) inp.focus(); }, 50);
      const insert = (c) => {
        const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? inp.value.length;
        if (c === '⌫') { if (s === e && s > 0) { inp.value = inp.value.slice(0, s - 1) + inp.value.slice(e); inp.setSelectionRange(s - 1, s - 1); } else { inp.value = inp.value.slice(0, s) + inp.value.slice(e); inp.setSelectionRange(s, s); } }
        else { inp.value = inp.value.slice(0, s) + c + inp.value.slice(e); inp.setSelectionRange(s + c.length, s + c.length); }
        M.sfx.tap();
      };
      const check = () => {
        if (ctx.done) return;
        const v = inp.value;
        if (!v.trim()) return ctx.feedback('bad', 'Écris ta réponse d\'abord 🙂');
        const ok = answers(q).some((a) => norm(a, q) === norm(v, q));
        const r = ctx.attempt(ok, v.trim());
        inp.classList.toggle('good', ok);
        if (r === 'retry') inp.select();
      };
      host.onclick = (e) => {
        const k = e.target.closest('.kb-key');
        if (k && !ctx.done) { insert(k.dataset.c); return; }
        if (e.target.closest('.fmt-check')) check();
      };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !ctx.done) { e.preventDefault(); e.stopPropagation(); check(); } });
      return {
        reveal() { inp.value = answers(q)[0]; inp.classList.add('good'); },
        lock() { inp.readOnly = true; M.$$('button', host).forEach((b) => (b.disabled = true)); },
      };
    },
  });

  /* ------------------------------------------------------------------ match
     Associer deux colonnes. Champs : pairs [{left, right}] (html). Correction immédiate. */
  M.registerFormat('match', {
    doc: 'Associer : touche un élément à gauche, puis son ami à droite.',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.pairs) || q.pairs.length < 2) return 'pairs : au moins 2';
      const r = q.pairs.map((p) => String(p.right)), l = q.pairs.map((p) => String(p.left));
      if (new Set(r).size !== r.length || new Set(l).size !== l.length) return 'pairs : éléments en double';
      if (q.answer === undefined) q.answer = 'pairs';
    },
    instruction: () => 'Touche un élément à gauche, puis celui qui va avec à droite 👇',
    answerLabel: () => 'voir les paires en vert',
    render(host, q, ctx) {
      const n = q.pairs.length;
      const right = M.shuffle(M.range(0, n - 1));
      const left = q.shuffleLeft ? M.shuffle(M.range(0, n - 1)) : M.range(0, n - 1);
      const done = new Set();
      let selL = null, mistakes = 0;
      const colors = ['#ef476f', '#118ab2', '#06a77d', '#f78c40', '#9b5de5', '#f4b400', '#2b2d42', '#e76f51'];
      host.innerHTML = `<div class="match"><div class="match-col">${left.map((i) => `<button class="match-item" data-side="L" data-i="${i}">${q.pairs[i].left}</button>`).join('')}</div>
        <div class="match-col">${right.map((i) => `<button class="match-item" data-side="R" data-i="${i}">${q.pairs[i].right}</button>`).join('')}</div></div>`;
      const btn = (side, i) => M.$(`.match-item[data-side="${side}"][data-i="${i}"]`, host);
      const lockPair = (i, color) => { [btn('L', i), btn('R', i)].forEach((b) => { b.classList.add('paired'); b.disabled = true; b.style.setProperty('--pair', color); }); };
      host.onclick = (e) => {
        if (ctx.done) return;
        const b = e.target.closest('.match-item');
        if (!b || b.disabled) return;
        const i = +b.dataset.i;
        if (b.dataset.side === 'L') { M.$$('.match-item[data-side="L"]', host).forEach((x) => x.classList.remove('sel')); selL = i; b.classList.add('sel'); M.sfx.tap(); return; }
        if (selL == null) { ctx.feedback('hint', 'Commence par un élément de gauche 👈'); return; }
        if (i === selL) {
          done.add(i); lockPair(i, colors[done.size % colors.length]); selL = null; M.sfx.pop();
          if (done.size === n) ctx.complete(mistakes === 0, true);
        } else {
          mistakes++; M.sfx.bad();
          b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
          ctx.feedback('bad', 'Ces deux-là ne vont pas ensemble. Essaie encore 💪' + (q.hint ? `<div class="hint-text">💡 ${q.hint}</div>` : ''));
        }
      };
      return { lock() {} };
    },
  });

  /* ------------------------------------------------------------------ sort
     Classer dans des boîtes. Champs : bins [{id, label}], items [{label, bin}]. Correction immédiate. */
  M.registerFormat('sort', {
    doc: 'Classer : touche un élément, puis la bonne boîte.',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.bins) || q.bins.length < 2) return 'bins : au moins 2';
      if (!Array.isArray(q.items) || q.items.length < 2) return 'items : au moins 2';
      if (!q.items.every((it) => q.bins.some((b) => same(b.id, it.bin)))) return 'item avec une boîte inconnue';
      if (q.answer === undefined) q.answer = 'bins';
    },
    instruction: () => 'Touche un élément, puis la boîte où il va 👇',
    answerLabel: () => 'voir les boîtes',
    render(host, q, ctx) {
      const order = M.shuffle(M.range(0, q.items.length - 1));
      const placed = {};
      let sel = null, mistakes = 0;
      const draw = () => {
        host.innerHTML = `<div class="sort-pool">${order.filter((i) => placed[i] == null).map((i) => `<button class="sort-item ${sel === i ? 'sel' : ''}" data-i="${i}">${q.items[i].label}</button>`).join('') || '<span class="muted">Tout est classé ! 🎉</span>'}</div>
          <div class="sort-bins" style="grid-template-columns:repeat(${Math.min(q.bins.length, 4)},1fr)">${q.bins.map((b) => `<button class="sort-bin" data-bin="${M.esc(b.id)}"><b>${b.label}</b><span class="sort-in">${order.filter((i) => same(placed[i], b.id)).map((i) => `<span class="sort-item in">${q.items[i].label}</span>`).join('')}</span></button>`).join('')}</div>`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        const it = e.target.closest('.sort-item:not(.in)');
        if (it) { sel = +it.dataset.i; M.sfx.tap(); draw(); return; }
        const bin = e.target.closest('.sort-bin');
        if (!bin) return;
        if (sel == null) { ctx.feedback('hint', 'Touche d\'abord un élément ☝️'); return; }
        if (same(q.items[sel].bin, bin.dataset.bin)) {
          placed[sel] = q.items[sel].bin; sel = null; M.sfx.pop(); draw();
          if (Object.keys(placed).length === q.items.length) ctx.complete(mistakes === 0, true);
          else ctx.feedback('', 'Bien ! Continue 👇');
        } else {
          mistakes++; M.sfx.bad();
          bin.classList.remove('wrong'); void bin.offsetWidth; bin.classList.add('wrong');
          ctx.feedback('bad', 'Pas dans cette boîte. Essaie encore 💪' + (q.hint ? `<div class="hint-text">💡 ${q.hint}</div>` : ''));
        }
      };
      return { lock() {} };
    },
  });

  /* ------------------------------------------------------------------ cloze
     Phrase à trous. Champs : text avec {0}, {1}…, blanks [{choices:[str], answer:str}] */
  M.registerFormat('cloze', {
    doc: 'Phrase à trous : touche un trou, puis le bon mot.',
    layout: 'wide',
    validate(q) {
      if (typeof q.text !== 'string' || !Array.isArray(q.blanks) || !q.blanks.length) return 'text/blanks manquants';
      for (let i = 0; i < q.blanks.length; i++) {
        const b = q.blanks[i];
        if (!q.text.includes(`{${i}}`)) return `trou {${i}} absent du texte`;
        if (!Array.isArray(b.choices) || b.choices.filter((c) => same(c, b.answer)).length !== 1) return `trou ${i} : réponse absente ou en double`;
        if (new Set(b.choices.map(String)).size !== b.choices.length) return `trou ${i} : choix en double`;
      }
      if (q.answer === undefined) q.answer = q.blanks.map((b) => b.answer);
    },
    instruction: () => 'Touche un trou, puis choisis le bon mot 👇',
    answerLabel: (q) => q.blanks.map((b) => M.esc(b.answer)).join(' · '),
    render(host, q, ctx) {
      const fill = q.blanks.map(() => null);
      const bad = new Set();
      let cur = 0;
      const draw = (reveal) => {
        const html = q.text.replace(/\{(\d+)\}/g, (m, i) => {
          i = +i;
          const v = reveal ? q.blanks[i].answer : fill[i];
          return `<button class="cloze-gap ${cur === i && !reveal ? 'sel' : ''} ${v ? 'filled' : ''} ${bad.has(i) ? 'wrong' : ''} ${reveal ? 'good' : ''}" data-i="${i}">${v ? M.esc(v) : '&nbsp;?&nbsp;'}</button>`;
        });
        host.innerHTML = `<div class="cloze-text">${html}</div>
          ${reveal ? '' : `<div class="cloze-bank">${q.blanks[cur].choices.map((c) => `<button class="chip-btn" data-c="${M.esc(c)}">${M.esc(c)}</button>`).join('')}</div>
          <button class="btn primary big fmt-check">✓ Vérifier</button>`}`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        const g = e.target.closest('.cloze-gap');
        if (g) { cur = +g.dataset.i; M.sfx.tap(); draw(); return; }
        const c = e.target.closest('.chip-btn');
        if (c) {
          fill[cur] = c.dataset.c; bad.delete(cur); M.sfx.tap();
          const nextEmpty = fill.findIndex((v) => v == null);
          if (nextEmpty >= 0) cur = nextEmpty;
          draw(); return;
        }
        if (e.target.closest('.fmt-check')) {
          if (fill.some((v) => v == null)) return ctx.feedback('bad', 'Remplis tous les trous d\'abord 🙂');
          bad.clear();
          fill.forEach((v, i) => { if (!same(v, q.blanks[i].answer)) bad.add(i); });
          const r = ctx.attempt(bad.size === 0);
          if (r === 'retry') { cur = [...bad][0]; draw(); }
        }
      };
      return { reveal() { draw(true); } };
    },
  });

  /* ------------------------------------------------------------------ tapwords
     Touche le(s) bon(s) mot(s) dans une phrase (grammaire, compréhension).
     Champs : words [str] (ponctuation attachée permise), answer [indices], select? 'one'|'many' */
  M.registerFormat('tapwords', {
    doc: 'Touche le ou les bons mots dans la phrase.',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.words) || q.words.length < 2) return 'words : au moins 2';
      if (!Array.isArray(q.answer) || !q.answer.length || q.answer.some((i) => !Number.isInteger(i) || i < 0 || i >= q.words.length)) return 'answer : indices valides';
    },
    instruction: (q) => (q.answer.length > 1 || q.select === 'many' ? `Touche les bons mots (${q.answer.length}), puis Vérifier 👇` : 'Touche le bon mot 👇'),
    answerLabel: (q) => q.answer.map((i) => M.esc(q.words[i])).join(', '),
    render(host, q, ctx) {
      const many = q.select === 'many' || q.answer.length > 1;
      const sel = new Set();
      host.innerHTML = `<div class="tapwords">${q.words.map((w, i) => `<button class="tw" data-i="${i}">${M.esc(w)}</button>`).join(' ')}</div>${many ? '<button class="btn primary big fmt-check">✓ Vérifier</button>' : ''}`;
      host.onclick = (e) => {
        if (ctx.done) return;
        const b = e.target.closest('.tw');
        if (b) {
          const i = +b.dataset.i;
          if (!many) { const ok = q.answer.includes(i); b.classList.add(ok ? 'right' : 'wrong'); ctx.attempt(ok); return; }
          sel.has(i) ? sel.delete(i) : sel.add(i); b.classList.toggle('sel', sel.has(i)); M.sfx.tap(); return;
        }
        if (e.target.closest('.fmt-check')) {
          if (!sel.size) return ctx.feedback('bad', 'Touche au moins un mot 🙂');
          ctx.attempt(sameSet([...sel], q.answer), [...sel]);
        }
      };
      return { reveal() { M.$$('.tw', host).forEach((b) => b.classList.toggle('right', q.answer.includes(+b.dataset.i))); } };
    },
  });

  /* ------------------------------------------------------------------ hotspot
     Touche la bonne partie d'une image. Champs : html (SVG/HTML avec des éléments [data-hot="id"]), answer id */
  M.registerFormat('hotspot', {
    doc: 'Touche la bonne zone d\'une image (éléments marqués data-hot).',
    layout: 'wide',
    validate(q) { if (typeof q.html !== 'string' || !q.html.includes(`data-hot="${q.answer}"`)) return 'html sans data-hot correspondant à answer'; },
    instruction: () => 'Touche la bonne réponse sur l\'image 👇',
    answerLabel: (q) => q.answerText || 'voir l\'image',
    render(host, q, ctx) {
      host.innerHTML = `<div class="hotspot">${q.html}</div>`;
      host.onclick = (e) => {
        if (ctx.done) return;
        const h = e.target.closest('[data-hot]');
        if (!h) return;
        const ok = same(h.dataset.hot, q.answer);
        h.classList.add(ok ? 'hot-right' : 'hot-wrong');
        ctx.attempt(ok);
      };
      return { reveal() { M.$$(`[data-hot="${q.answer}"]`, host).forEach((x) => x.classList.add('hot-right')); } };
    },
  });

  /* ------------------------------------------------------------------ steps
     Question en plusieurs étapes (résolution de problèmes, compréhension).
     Champs : steps [{label?, prompt, format, ...champs du format}]
     Étoile seulement si toutes les étapes sont réussies du premier coup. */
  M.registerFormat('steps', {
    doc: 'Plusieurs étapes guidées (ex. : Je comprends → Je choisis → Je calcule → Je réponds).',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.steps) || q.steps.length < 2) return 'steps : au moins 2';
      for (let i = 0; i < q.steps.length; i++) {
        const s = q.steps[i], f = M.formats[s.format || s.input];
        if (!f || f.name === 'steps') return `étape ${i} : format invalide`;
        if (!s.prompt) return `étape ${i} : prompt manquant`;
        const e = f.validate && f.validate(s);
        if (e) return `étape ${i} : ${e}`;
      }
      if (q.answer === undefined) q.answer = 'steps';
    },
    instruction: () => 'Une étape à la fois 👇',
    answerLabel: () => 'voir les étapes',
    render(host, q, ctx) {
      let i = 0, allFirst = true;
      host.innerHTML = `<ol class="steps">${q.steps.map((s, k) => `<li class="step ${k ? 'todo' : 'now'}" data-k="${k}"><div class="step-head"><span class="step-num">${k + 1}</span><b>${s.label || 'Étape ' + (k + 1)}</b></div><div class="step-prompt"></div><div class="step-body"></div><div class="step-fb"></div></li>`).join('')}</ol>`;
      const run = () => {
        const s = q.steps[i], li = M.$(`.step[data-k="${i}"]`, host);
        li.classList.remove('todo'); li.classList.add('now');
        const f = M.formats[s.format || s.input];
        const pr = M.$('.step-prompt', li), body = M.$('.step-body', li), fb = M.$('.step-fb', li);
        const has = s.prompt.includes('{?}');
        const setInline = (html) => (pr.innerHTML = has ? s.prompt.replace('{?}', html) : s.prompt);
        setInline('<span class="ans-box">?</span>');
        let tries = 0, done = false, inst = null;
        const max = s.tries || (f.maxTries ? f.maxTries(s) : 2);
        const finish = (first, ok) => {
          if (done) return;
          done = true;
          if (inst && inst.lock) inst.lock(); else M.$$('button,input', body).forEach((b) => (b.disabled = true));
          if (!first) allFirst = false;
          li.classList.remove('now'); li.classList.add(ok ? 'ok' : 'miss');
          if (!ok && inst && inst.reveal) inst.reveal();
          fb.className = 'step-fb ' + (ok ? 'good' : 'bad');
          fb.innerHTML = ok ? (s.after ? '✔️ ' + s.after : '✔️') : `La bonne réponse : <b>${f.answerLabel ? f.answerLabel(s) : s.answer}</b>${s.after ? '<div>' + s.after + '</div>' : ''}`;
          if (ok) M.sfx.pop();
          i++;
          if (i < q.steps.length) {
            const go = () => { if (host.isConnected && !ctx.done) run(); };
            if (ok) setTimeout(go, 500);
            else { fb.insertAdjacentHTML('beforeend', '<div><button class="btn yellow step-next">Continuer ➜</button></div>'); M.$('.step-next', fb).onclick = go; }
          } else setTimeout(() => ctx.complete(allFirst, true), 400);
        };
        const sub = {
          q: s, host: body, hasInline: has, setInline,
          get done() { return done || ctx.done; },
          get tries() { return tries; },
          feedback: (cls, html) => { fb.className = 'step-fb ' + cls; fb.innerHTML = html; },
          complete: finish,
          attempt(ok, val) {
            if (done) return 'failed';
            if (ok) { finish(tries === 0, true); return 'correct'; }
            tries++; M.sfx.bad();
            if (tries >= max) { finish(false, false); return 'failed'; }
            sub.feedback('bad', (f.retryMessage && f.retryMessage(s, val)) || 'Pas tout à fait… Essaie encore 💪' + (s.hint ? `<div class="hint-text">💡 ${s.hint}</div>` : ''));
            return 'retry';
          },
          onKey: (fn) => ctx.onKey(fn),
        };
        inst = f.render(body, s, sub) || {};
        li.scrollIntoView && li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      };
      run();
      return { lock() {} };
    },
  });

  /** Alias historique : `input` = `format`. */
  M.formatOf = (q) => q.format || q.input;
})();
