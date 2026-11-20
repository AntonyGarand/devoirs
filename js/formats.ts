/* =====================================================================
   formats.js — bibliothèque des FORMATS de questions (voir docs/framework.md § 4)

   M.registerFormat(name, {
     doc, layout?: 'wide', ungraded?: true,
     validate(q) → message | undefined          (tools/check-skills.js)
     render(host, q, ctx) → { reveal?(), lock?() }
     maxTries?(q), answerLabel?(q), instruction?(q), retryMessage?(q, val)
   })
   ctx : attempt(ok, val) → 'correct'|'retry'|'failed' · complete(first, ok) · feedback(cls, html)
         setInline(html) · hasInline · onKey(fn) · done · tries · passage (jetons du texte, si présent)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  M.formats = {};
  M.registerFormat = (name, def) => {
    // FormatSpec<QuestionOf<K>> → FormatDef<Question> : chaque format ne reçoit que ses questions (aiguillage par nom).
    M.formats[name] = Object.assign(def, { name }) as FormatDef;
  };

  /** Champ exigé : sinon une erreur (la carte affiche « Oups »), comme un accès à undefined. */
  const need = <T>(v: T | null | undefined, what: string): T => {
    if (v == null) throw new Error(what + ' manquant');
    return v;
  };
  const same = (a: unknown, b: unknown) => String(a) === String(b);
  const sameSet = (a: readonly unknown[], b: readonly unknown[]) => a.length === b.length && a.every((x) => b.some((y) => same(x, y)));
  const labelOf = (q: { choices?: Choice[] }, v: unknown) => {
    const c = (q.choices || []).find((x) => same(x.value, v));
    return c ? c.label : String(v);
  };
  const hintHtml = (q: { hint?: string }) => (q.hint ? `<div class="hint-text">💡 ${q.hint}</div>` : '');
  const checkChoices = (q: { choices: Choice[]; audioOnly?: boolean }): string | undefined => {
    if (!Array.isArray(q.choices) || q.choices.length < 2) return 'choices : au moins 2';
    const vals = q.choices.map((c) => String(c.value));
    if (new Set(vals).size !== vals.length) return 'choices en double';
    if (q.audioOnly && q.choices.some((c) => !c.say)) return 'audioOnly : chaque choix doit avoir say';
  };
  const sayChoice = (q: { lang?: string }, c: Choice) => M.say(c.say, { lang: c.lang || q.lang || 'fr-CA', raw: true });
  /** Contenu d'un bouton de choix : libellé (ou numéro si audioOnly) + 🔊 facultatif. */
  const choiceInner = (q: { audioOnly?: boolean }, c: Choice, i: number) => (q.audioOnly ? `<span class="ao">🔊 ${i + 1}</span>` : c.label);
  /** Bouton de choix; si le choix se lit (say), un vrai bouton 🔊 frère (pas imbriqué) qui ne répond pas à la question. */
  const choiceBtn = (q: { audioOnly?: boolean }, c: Choice, i: number, attrs = '') => {
    const b = `<button class="choice-btn" data-i="${i}" ${attrs}>${choiceInner(q, c, i)}</button>`;
    if (!c.say || q.audioOnly) return b;
    return `<div class="choice-wrap">${b}<button type="button" class="say-btn" aria-label="Écouter : ${M.esc(M.text ? M.text(String(c.label)) : c.label)}" data-say-i="${i}">🔊</button></div>`;
  };

  /** Découpe un texte en jetons {w, s} (mot avec ponctuation attachée, numéro de phrase). '¶' = paragraphe. */
  M.tokenize = function (text) {
    const out: Token[] = [];
    let s = 0;
    String(text)
      .split(/\n\s*\n/)
      .forEach((para, pi) => {
        if (pi > 0) out.push({ w: '¶', s });
        para
          .split(/\s+/)
          .filter(Boolean)
          .forEach((w) => {
            out.push({ w, s });
            if (/[.!?…]["»)]?$/.test(w)) s++;
          });
      });
    return out;
  };

  /* ------------------------------------------------------------------ number */
  M.registerFormat('number', {
    doc: "Pavé numérique; la réponse peut s'afficher dans la consigne avec {?}.",
    validate(q) {
      if (!Number.isInteger(q.answer) || q.answer < 0) return 'answer : entier ≥ 0';
    },
    instruction: () => 'Écris ta réponse 👇',
    answerLabel: (q) => q.answer + (q.unit ? ' ' + q.unit : ''),
    render(host, q, ctx) {
      let input = '',
        revealed = false;
      host.innerHTML = `<div class="solo-box"></div>
        <div class="pad">${['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((k) => `<button class="key" data-k="${k}">${k}</button>`).join('')}
        <button class="key del" data-k="del" aria-label="Effacer un chiffre">⌫</button><button class="key" data-k="0">0</button><button class="key del" data-k="clr" aria-label="Tout effacer">✕</button>
        <button class="key ok" data-k="ok">✓ Vérifier</button></div>`;
      const draw = () => {
        const v = revealed ? String(q.answer) : input;
        const box = `<span class="ans-box${v ? ' filled' : ''}${revealed || ctx.done ? ' good' : ''}">${v || '?'}</span>`;
        if (ctx.hasInline) ctx.setInline(box);
        M.$('.solo-box', host)!.innerHTML = (ctx.hasInline ? '' : box) + (q.unit ? `<span class="unit">${q.unit}</span>` : '');
      };
      const press = (k: string) => {
        if (ctx.done) return;
        if (k === 'ok') {
          if (input === '') return ctx.feedback('bad', "Écris un nombre d'abord 🙂");
          const v = +input;
          const r = ctx.attempt(v === +q.answer, v);
          if (r === 'retry') {
            input = '';
            setTimeout(() => {
              if (!ctx.done) draw();
            }, 400);
          }
          draw();
          return;
        }
        if (k === 'del') input = input.slice(0, -1);
        else if (k === 'clr') input = '';
        else if (input.length < 4) input = (input === '0' ? '' : input) + k;
        M.sfx.tap();
        draw();
      };
      host.onclick = (e) => {
        const b = M.closest(e, '.key');
        if (b) press(String(b.dataset.k));
      };
      ctx.onKey((e) => {
        if (/^[0-9]$/.test(e.key)) press(e.key);
        else if (e.key === 'Backspace') press('del');
        else if (e.key === 'Enter') {
          e.preventDefault();
          press('ok');
        }
      });
      draw();
      return {
        reveal() {
          revealed = true;
          draw();
        },
      };
    },
  });

  /** Ce que renderChoice lit de la question (choice, et tf transformé en choix). */
  interface ChoiceLike {
    choices?: Choice[];
    answer: Value;
    cols?: number;
    audioOnly?: boolean;
    lang?: string;
  }
  /* ------------------------------------------------------------------ choice
     choices [{label, value, say?, lang?, why?}], answer, cols?, audioOnly? */
  function renderChoice(host: HTMLElement, q: ChoiceLike, ctx: FormatCtx<unknown>, choices: Choice[]): FormatInstance {
    const cols = q.cols || (choices.length <= 2 ? 2 : choices.length === 3 ? 3 : 2);
    let heard = false;
    host.innerHTML = `<div class="choices-grid ${q.audioOnly ? 'audio-only' : ''}" style="grid-template-columns:repeat(${cols},1fr)">${choices.map((c, i) => choiceBtn(q, c, i)).join('')}</div>`;
    const pick = (b: HTMLButtonElement | null | undefined) => {
      if (!b || ctx.done || b.disabled) return;
      const c = choices[Number(b.dataset.i)];
      if (q.audioOnly && !heard) {
        heard = true;
        sayChoice(q, c);
        b.classList.add('heard');
        ctx.feedback('hint', 'Écoute chaque choix, puis touche de nouveau pour choisir.');
        return;
      }
      const ok = same(c.value, q.answer);
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) b.disabled = true;
      ctx.attempt(ok, c.value);
    };
    host.onclick = (e) => {
      const s = M.closest(e, '.say-btn');
      if (s) {
        e.stopPropagation();
        sayChoice(q, choices[Number(s.dataset.sayI)]);
        return;
      }
      const b = M.closest<HTMLButtonElement>(e, '.choice-btn');
      if (b && q.audioOnly && !b.classList.contains('heard')) {
        heard = true;
        b.classList.add('heard');
        sayChoice(q, choices[Number(b.dataset.i)]);
        return;
      }
      pick(b);
    };
    ctx.onKey((e) => {
      if (!/^[1-9]$/.test(e.key)) return;
      const b = M.$$<HTMLButtonElement>('.choice-btn', host)[+e.key - 1];
      if (!b) return;
      if (e.shiftKey && choices[Number(b.dataset.i)].say) sayChoice(q, choices[Number(b.dataset.i)]);
      else pick(b);
    });
    return {
      reveal() {
        M.$$('.choice-btn', host).forEach((b) => {
          if (same(choices[Number(b.dataset.i)].value, q.answer)) {
            b.classList.add('right');
            if (q.audioOnly) b.innerHTML = choices[Number(b.dataset.i)].label;
          }
        });
      },
      lock() {
        M.$$<HTMLButtonElement>('.choice-btn', host).forEach((b) => (b.disabled = true));
      },
    };
  }
  const whyMsg = (q: { choices?: Choice[]; hint?: string }, val: unknown) => {
    const c = (q.choices || []).find((x) => same(x.value, val));
    return (c && c.why ? `<div>${c.why}</div>` : '') + 'Essaie encore 💪' + hintHtml(q);
  };
  M.registerFormat('choice', {
    doc: "Choix de réponses (texte, emoji ou SVG). 🔊 par choix (say), audioOnly, why = rétroaction par distracteur. 1 essai s'il y a 2 choix, sinon 2.",
    validate(q) {
      const e = checkChoices(q);
      if (e) return e;
      const hits = q.choices.filter((c) => same(c.value, q.answer)).length;
      if (hits !== 1) return `la bonne réponse apparaît ${hits} fois`;
    },
    maxTries: (q) => (q.choices.length <= 2 ? 1 : 2),
    instruction: (q) => (q.audioOnly ? 'Écoute les choix, puis choisis 👇' : 'Choisis ta réponse 👇'),
    answerLabel: (q) => labelOf(q, q.answer),
    retryMessage: whyMsg,
    render: (host, q, ctx) => renderChoice(host, q, ctx, q.choices),
  });

  /* ------------------------------------------------------------------ tf
     answer: true/false, labels? [{label, say?}, {label, say?}] (vrai, faux) */
  M.registerFormat('tf', {
    doc: 'Vrai ou faux (1 essai). labels pour personnaliser (ex. 👍 Yes / 👎 No).',
    validate(q) {
      if (typeof q.answer !== 'boolean') return 'answer : true ou false';
    },
    maxTries: () => 1,
    instruction: () => 'Choisis 👇',
    answerLabel: (q) => (q.labels ? q.labels[q.answer ? 0 : 1].label : q.answer ? '✔️ Vrai' : '✖️ Faux'),
    render(host, q, ctx) {
      const L = q.labels || [{ label: '✔️ Vrai' }, { label: '✖️ Faux' }];
      const ch = [
        { ...L[0], value: 'true' },
        { ...L[1], value: 'false' },
      ];
      return renderChoice(host, { ...q, answer: String(q.answer), choices: ch }, ctx, ch);
    },
  });

  /* ------------------------------------------------------------------ multi */
  M.registerFormat('multi', {
    doc: 'Coche toutes les bonnes réponses, puis Vérifier.',
    validate(q) {
      const e = checkChoices(q);
      if (e) return e;
      if (!Array.isArray(q.answer) || !q.answer.length) return 'answer : tableau non vide';
      if (!q.answer.every((a) => q.choices.some((c) => same(c.value, a)))) return 'answer hors des choices';
    },
    instruction: (q) => `Touche toutes les bonnes réponses (${q.answer.length}), puis Vérifier 👇`,
    answerLabel: (q) => q.answer.map((v) => labelOf(q, v)).join(', '),
    retryMessage(q, val) {
      const sel = val as Value[]; // valeurs passées à ctx.attempt par ce format
      const missing = q.answer.filter((a) => !sel.some((s) => same(s, a))).length;
      const extra = sel.filter((s) => !q.answer.some((a) => same(s, a))).length;
      return (extra ? 'Il y en a qui ne vont pas. ' : '') + (missing ? 'Il en manque. ' : '') + 'Essaie encore 💪' + hintHtml(q);
    },
    render(host, q, ctx) {
      const sel = new Set<number>();
      const cols = q.cols || (q.choices.length <= 4 ? 2 : 3);
      host.innerHTML = `<div class="choices-grid multi" style="grid-template-columns:repeat(${cols},1fr)">${q.choices.map((c, i) => choiceBtn(q, c, i, 'aria-pressed="false"')).join('')}</div>
        <button class="btn primary big fmt-check">✓ Vérifier</button>`;
      host.onclick = (e) => {
        if (ctx.done) return;
        const s = M.closest(e, '.say-btn');
        if (s) {
          e.stopPropagation();
          sayChoice(q, q.choices[Number(s.dataset.sayI)]);
          return;
        }
        const b = M.closest(e, '.choice-btn');
        if (b) {
          const i = Number(b.dataset.i);
          if (sel.has(i)) sel.delete(i);
          else sel.add(i);
          b.classList.toggle('sel', sel.has(i));
          b.setAttribute('aria-pressed', String(sel.has(i)));
          M.sfx.tap();
          if (q.audioOnly) sayChoice(q, q.choices[i]);
          return;
        }
        if (M.closest(e, '.fmt-check')) {
          if (!sel.size) return ctx.feedback('bad', 'Touche au moins une réponse 🙂');
          const vals = [...sel].map((i) => q.choices[i].value);
          ctx.attempt(sameSet(vals, q.answer), vals);
        }
      };
      return {
        reveal() {
          M.$$('.choice-btn', host).forEach((b) => {
            const v = q.choices[Number(b.dataset.i)].value;
            b.classList.toggle(
              'right',
              q.answer.some((a) => same(a, v)),
            );
          });
        },
      };
    },
  });

  /* ------------------------------------------------------------------ order
     choices, answer [values dans l'ordre], fixed? [positions déjà placées] */
  M.registerFormat('order', {
    doc: 'Touche les éléments dans le bon ordre. fixed = positions déjà placées (utile pour les cycles).',
    validate(q) {
      if (!Array.isArray(q.answer) || !Array.isArray(q.choices) || q.answer.length !== q.choices.length)
        return 'answer/choices incohérents';
      if (q.fixed && q.fixed.some((k) => !Number.isInteger(k) || k < 0 || k >= q.answer.length)) return 'fixed : positions invalides';
    },
    instruction: () => 'Touche dans le bon ordre 👇',
    answerLabel: (q) => q.answer.map((v) => labelOf(q, v)).join(' → '),
    render(host, q, ctx) {
      const n = q.choices.length;
      const idxOf = (v: Value) => q.choices.findIndex((c) => same(c.value, v));
      const fixed = new Set(q.fixed || []);
      let slots: (number | null)[] = []; // fixé par reset()
      const reset = () => {
        slots = Array(n).fill(null);
        fixed.forEach((k) => (slots[k] = idxOf(q.answer[k])));
      };
      reset();
      const draw = (reveal?: boolean) => {
        const seq = reveal ? q.answer.map(idxOf) : slots;
        host.innerHTML = `<div class="order-slots">${seq.map((ci, k) => `<span class="slot ${reveal ? 'good' : ''} ${fixed.has(k) ? 'fixed' : ''}">${ci != null ? q.choices[ci].label : ''}</span>`).join('')}</div>
          <div class="choices-grid order" style="grid-template-columns:repeat(${q.cols || Math.min(4, n)},minmax(0,1fr))">${q.choices.map((c, i) => choiceBtn(q, c, i, slots.includes(i) || reveal ? 'disabled' : '')).join('')}</div>
          ${reveal ? '' : '<button class="btn small-undo">↺ Recommencer</button>'}`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        const s = M.closest(e, '.say-btn');
        if (s) {
          e.stopPropagation();
          sayChoice(q, q.choices[Number(s.dataset.sayI)]);
          return;
        }
        if (M.closest(e, '.small-undo')) {
          reset();
          draw();
          return;
        }
        const b = M.closest<HTMLButtonElement>(e, '.choice-btn');
        if (!b || b.disabled) return;
        const k = slots.indexOf(null);
        if (k < 0) return;
        slots[k] = Number(b.dataset.i);
        M.sfx.tap();
        draw();
        if (!slots.includes(null)) {
          const got = (slots as number[]).map((i) => String(q.choices[i].value)); // plus aucune case vide
          const r = ctx.attempt(got.join('|') === q.answer.map(String).join('|'));
          if (r === 'retry')
            setTimeout(() => {
              reset();
              if (!ctx.done) draw();
            }, 900);
        }
      };
      return {
        reveal() {
          draw(true);
        },
      };
    },
  });

  /* ------------------------------------------------------------------ text
     answer (str | [str]), caseSensitive? (true | 'first'), accents? (défaut exigés),
     keyboard? 'accents'|'full'|'none', prefix?, suffix?, diagnose? (défaut true), placeholder?, lang? */
  const baseNorm = (s: unknown) => String(s).replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
  const stripAcc = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const normFor = (s: string, q: { caseSensitive?: boolean | 'first'; accents?: boolean }) => {
    let t = baseNorm(s);
    if (q.caseSensitive !== true && q.caseSensitive !== 'first') t = t.toLocaleLowerCase('fr-CA');
    if (q.accents === false) t = stripAcc(t);
    return t;
  };
  const answers = (q: { answer: string | string[] }) => (Array.isArray(q.answer) ? q.answer : [q.answer]);
  const textOk = (q: QuestionOf<'text'>, v: string) =>
    answers(q).some((a) => {
      if (q.caseSensitive === 'first') {
        const A = baseNorm(a),
          V = baseNorm(v);
        return (
          A.charAt(0) === V.charAt(0) &&
          normFor(A.slice(1), { ...q, caseSensitive: false }) === normFor(V.slice(1), { ...q, caseSensitive: false })
        );
      }
      return normFor(a, q) === normFor(v, q);
    });
  /** Distance d'édition + alignement. */
  function align(g: string, t: string) {
    const a = [...g],
      b = [...t],
      n = a.length,
      m = b.length;
    const D = Array.from({ length: n + 1 }, (_r, i) => Array.from({ length: m + 1 }, (_c, j) => (i === 0 ? j : j === 0 ? i : 0)));
    for (let i = 1; i <= n; i++)
      for (let j = 1; j <= m; j++)
        D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1));
    // remonter : pour chaque lettre de la cible, ok / manquante / remplacée
    const marks: ('ok' | 'no' | 'miss')[] = [];
    let i = n,
      j = m;
    while (j > 0) {
      if (i > 0 && D[i][j] === D[i - 1][j - 1] + (a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1)) {
        marks.unshift(a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 'ok' : 'no');
        i--;
        j--;
      } else if (D[i][j] === D[i][j - 1] + 1) {
        marks.unshift('miss');
        j--;
      } else {
        i--;
      }
    }
    return { dist: D[n][m], marks };
  }
  /** Lettres de la cible : vertes si bien écrites, « _ » sinon (aligné, tolère les lettres oubliées). */
  M.letterDiff = function (guess, target) {
    const { marks } = align(guess, target);
    return [...target]
      .map((ch, k) => `<span class="ld ${marks[k] === 'ok' ? 'ok' : 'no'}">${marks[k] === 'ok' ? M.esc(ch) : '_'}</span>`)
      .join('');
  };
  M.registerFormat('text', {
    doc: "Écrire un mot (dictée, orthographe). Clavier d'accents; diagnostic précis (accents, majuscule, une lettre).",
    validate(q) {
      const a = answers(q);
      if (!a.length || a.some((x) => typeof x !== 'string' || !x.trim())) return 'answer : texte non vide';
    },
    instruction: () => 'Écris ta réponse, puis Vérifier 👇',
    answerLabel: (q) => M.esc((q.prefix ? q.prefix + ' ' : '') + answers(q)[0] + (q.suffix ? ' ' + q.suffix : '')),
    retryMessage(q, val) {
      const t = answers(q)[0],
        v = baseNorm(val || '');
      let msg = 'Presque !';
      if (q.diagnose !== false) {
        if (stripAcc(v).toLowerCase() === stripAcc(t).toLowerCase() && v.toLowerCase() !== t.toLowerCase())
          msg = 'Vérifie les <b>accents</b> ✏️';
        else if (v.toLowerCase() === t.toLowerCase())
          msg = /^[A-ZÀ-Ý]/.test(t) ? 'Il faut une <b>majuscule</b> au début.' : 'Pas de majuscule ici.';
        else if (v.replace(/['-]/g, '').toLowerCase() === t.replace(/['-]/g, '').toLowerCase())
          msg = "Vérifie l'<b>apostrophe</b> ou le <b>trait d'union</b>.";
        else if (align(v, t).dist === 1) msg = 'Presque ! Une seule lettre à corriger.';
      }
      return `${msg}<div class="ld-row">${M.letterDiff(v, t)}</div>` + hintHtml(q);
    },
    render(host, q, ctx) {
      const kb = q.keyboard || 'accents';
      const ACC = ['é', 'è', 'ê', 'à', 'â', 'ç', 'ù', 'û', 'ô', 'î', 'ï', 'ë', 'œ', "'", '-'];
      const AZ = ['azertyuiop', 'qsdfghjklm', 'wxcvbn'];
      host.innerHTML = `<div class="text-ans">${q.prefix ? `<span class="text-fix">${M.esc(q.prefix)}</span>` : ''}<input class="text-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="${q.lang || 'fr-CA'}" placeholder="${M.esc(q.placeholder || 'Écris ici…')}" aria-label="Ta réponse">${q.suffix ? `<span class="text-fix">${M.esc(q.suffix)}</span>` : ''}</div>
        ${
          kb === 'none'
            ? ''
            : `<div class="kb">${kb === 'full' ? AZ.map((r) => `<div class="kb-row">${[...r].map((c) => `<button class="kb-key" data-c="${c}">${c}</button>`).join('')}</div>`).join('') : ''}
          <div class="kb-row accents">${ACC.map((c) => `<button class="kb-key" data-c="${c}">${c}</button>`).join('')}</div>
          <div class="kb-row">${kb === 'full' ? '<button class="kb-key wide" data-c=" ">espace</button><button class="kb-key" data-c="⇧" aria-label="Majuscule">⇧</button>' : ''}<button class="kb-key" data-c="⌫" aria-label="Effacer">⌫</button></div></div>`
        }
        <button class="btn primary big fmt-check">✓ Vérifier</button>`;
      const inp = M.$<HTMLInputElement>('.text-input', host)!; // vient d'être rendu
      let shift = false;
      setTimeout(() => {
        if (inp.isConnected && window.matchMedia && window.matchMedia('(pointer:fine)').matches) inp.focus();
      }, 50);
      const insert = (c: string) => {
        if (c === '⇧') {
          shift = !shift;
          M.$$('.kb-key[data-c="⇧"]', host).forEach((b) => b.classList.toggle('on', shift));
          return;
        }
        const s = inp.selectionStart ?? inp.value.length,
          e = inp.selectionEnd ?? inp.value.length;
        if (c === '⌫') {
          const from = s === e ? Math.max(0, s - 1) : s;
          inp.value = inp.value.slice(0, from) + inp.value.slice(e);
          inp.setSelectionRange(from, from);
        } else {
          if (shift) {
            c = c.toLocaleUpperCase('fr-CA');
            shift = false;
            M.$$('.kb-key[data-c="⇧"]', host).forEach((b) => b.classList.remove('on'));
          }
          inp.value = inp.value.slice(0, s) + c + inp.value.slice(e);
          inp.setSelectionRange(s + c.length, s + c.length);
        }
        M.sfx.tap();
      };
      const check = () => {
        if (ctx.done) return;
        const v = inp.value;
        if (!v.trim()) return ctx.feedback('bad', "Écris ta réponse d'abord 🙂");
        const ok = textOk(q, v);
        const r = ctx.attempt(ok, v.trim());
        inp.classList.toggle('good', ok);
        if (r === 'retry') inp.select();
      };
      host.onclick = (e) => {
        const k = M.closest(e, '.kb-key');
        if (k && !ctx.done) {
          insert(String(k.dataset.c));
          return;
        }
        if (M.closest(e, '.fmt-check')) check();
      };
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !ctx.done) {
          e.preventDefault();
          e.stopPropagation();
          check();
        }
      });
      return {
        reveal() {
          inp.value = answers(q)[0];
          inp.classList.add('good');
        },
        lock() {
          inp.readOnly = true;
          M.$$('button', host).forEach((b) => (b.disabled = true));
        },
      };
    },
  });

  /* ------------------------------------------------------------------ build
     Construire un mot ou une phrase avec des tuiles (intruses permises).
     tiles [str | {label, value, say?}], answer [values], accept? [[values]], join? '' | ' ', fixedEnd?, capitalizeFirst? */
  const tileOf = (t: string | Tile): Tile => (typeof t === 'string' ? { label: t, value: t } : t);
  const seqLabel = (q: QuestionOf<'build'>, seq: Value[]) => {
    const s = seq
      .map((v) => {
        const t = q.tiles.map(tileOf).find((x) => same(x.value, v));
        return t ? M.text(t.label) : v;
      })
      .join(q.join ?? ' ');
    return (q.capitalizeFirst ? s.charAt(0).toUpperCase() + s.slice(1) : s) + (q.fixedEnd || '');
  };
  M.registerFormat('build', {
    doc: 'Construire un mot ou une phrase avec des tuiles (syllabes, lettres, mots). Les tuiles en trop sont permises.',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.tiles) || q.tiles.length < 2) return 'tiles : au moins 2';
      if (!Array.isArray(q.answer) || !q.answer.length) return 'answer : séquence non vide';
      const pool = q.tiles.map((t) => String(tileOf(t).value));
      for (const seq of [q.answer, ...(q.accept || [])]) {
        const p = pool.slice();
        for (const v of seq) {
          const k = p.indexOf(String(v));
          if (k < 0) return `valeur « ${v} » absente des tuiles`;
          p.splice(k, 1);
        }
      }
    },
    instruction: () => 'Touche les tuiles dans le bon ordre, puis Vérifier 👇',
    answerLabel: (q) => M.esc(seqLabel(q, q.answer)),
    render(host, q, ctx) {
      const tiles = q.tiles.map(tileOf);
      const order = M.shuffle(M.range(0, tiles.length - 1));
      let slots: (number | null)[] = Array<null>(q.answer.length).fill(null);
      const good = new Set<number>();
      const draw = (reveal?: boolean) => {
        const sq = reveal
          ? q.answer.map((v) => {
              const used = new Set();
              return tiles.findIndex((t, i) => same(t.value, v) && !used.has(i));
            })
          : slots;
        host.innerHTML = `<div class="build-slots ${q.join === '' ? 'tight' : ''}">${sq.map((ti, k) => `<button class="build-slot ${ti != null ? 'filled' : ''} ${reveal || good.has(k) ? 'good' : ''}" data-k="${k}">${ti != null ? (k === 0 && q.capitalizeFirst ? M.fr.cap(tiles[ti].label) : tiles[ti].label) : ''}</button>`).join('')}${q.fixedEnd ? `<span class="build-end">${M.esc(q.fixedEnd)}</span>` : ''}</div>
          ${
            reveal
              ? ''
              : `<div class="build-bank">${order.map((i) => `${tiles[i].say ? '<span class="build-wrap">' : ''}<button class="build-tile" data-i="${i}" ${slots.includes(i) ? 'disabled' : ''}>${tiles[i].label}</button>${tiles[i].say ? `<button type="button" class="say-btn" aria-label="Écouter : ${M.esc(M.text ? M.text(String(tiles[i].label)) : tiles[i].label)}" data-say-t="${i}">🔊</button></span>` : ''}`).join('')}</div>
          <div class="row-center"><button class="btn small-undo">↺ Recommencer</button><button class="btn primary big fmt-check">✓ Vérifier</button></div>`
          }`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        const s = M.closest(e, '.say-btn');
        if (s) {
          e.stopPropagation();
          const t = tiles[Number(s.dataset.sayT)];
          M.say(t.say, { lang: t.lang || q.lang, raw: true });
          return;
        }
        if (M.closest(e, '.small-undo')) {
          slots = slots.map((v, k) => (good.has(k) ? v : null));
          draw();
          return;
        }
        const slot = M.closest(e, '.build-slot');
        if (slot) {
          const k = Number(slot.dataset.k);
          if (!good.has(k)) {
            slots[k] = null;
            M.sfx.tap();
            draw();
          }
          return;
        }
        const t = M.closest<HTMLButtonElement>(e, '.build-tile');
        if (t && !t.disabled) {
          const k = slots.indexOf(null);
          if (k < 0) return;
          slots[k] = Number(t.dataset.i);
          M.sfx.tap();
          if (tiles[Number(t.dataset.i)].say)
            M.say(tiles[Number(t.dataset.i)].say, { lang: tiles[Number(t.dataset.i)].lang || q.lang, raw: true });
          draw();
          return;
        }
        if (M.closest(e, '.fmt-check')) {
          if (slots.includes(null)) return ctx.feedback('bad', "Remplis toutes les cases d'abord 🙂");
          const got = (slots as number[]).map((i) => String(tiles[i].value)); // plus aucune case vide
          const ok = [q.answer, ...(q.accept || [])].some((seq) => seq.map(String).join('|') === got.join('|'));
          const r = ctx.attempt(ok);
          if (r === 'retry') {
            good.clear();
            got.forEach((v, k) => {
              if (same(v, q.answer[k])) good.add(k);
            });
            slots = slots.map((v, k) => (good.has(k) ? v : null));
            draw();
          }
        }
      };
      return {
        reveal() {
          draw(true);
        },
      };
    },
  });

  /* ------------------------------------------------------------------ match */
  M.registerFormat('match', {
    doc: 'Associer : touche un élément à gauche, puis son ami à droite. sayLeft/sayRight lisent au toucher.',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.pairs) || q.pairs.length < 2) return 'pairs : au moins 2';
      const r = q.pairs.map((p) => String(p.right)),
        l = q.pairs.map((p) => String(p.left));
      if (new Set(r).size !== r.length || new Set(l).size !== l.length) return 'pairs : éléments en double';
    },
    instruction: () => 'Touche un élément à gauche, puis celui qui va avec à droite 👇',
    answerLabel: () => 'voir les paires en couleur',
    render(host, q, ctx) {
      const n = q.pairs.length;
      const right = M.shuffle(M.range(0, n - 1));
      const left = q.shuffleLeft ? M.shuffle(M.range(0, n - 1)) : M.range(0, n - 1);
      const done = new Set<number>();
      let selL: number | null = null,
        mistakes = 0;
      const colors = ['#ef476f', '#118ab2', '#06a77d', '#f78c40', '#9b5de5', '#f4b400', '#2b2d42', '#e76f51'];
      host.innerHTML = `<div class="match"><div class="match-col">${left.map((i) => `<button class="match-item" data-side="L" data-i="${i}">${q.pairs[i].left}</button>`).join('')}</div>
        <div class="match-col">${right.map((i) => `<button class="match-item" data-side="R" data-i="${i}">${q.pairs[i].right}</button>`).join('')}</div></div>`;
      const btn = (side: string, i: number) => M.$<HTMLButtonElement>(`.match-item[data-side="${side}"][data-i="${i}"]`, host)!; // rendus ci-dessus
      const lockPair = (i: number, color: string) => {
        [btn('L', i), btn('R', i)].forEach((b) => {
          b.classList.add('paired');
          b.disabled = true;
          b.style.setProperty('--pair', color);
        });
      };
      const sayIt = (side: string | undefined, i: number) => {
        const p = q.pairs[i],
          t = side === 'L' ? p.sayLeft : p.sayRight;
        if (t) M.say(t, { lang: (side === 'L' ? p.langLeft : p.langRight) || q.lang, raw: true });
      };
      host.onclick = (e) => {
        if (ctx.done) return;
        const b = M.closest<HTMLButtonElement>(e, '.match-item');
        if (!b || b.disabled) return;
        const i = Number(b.dataset.i);
        sayIt(b.dataset.side, i);
        if (b.dataset.side === 'L') {
          M.$$('.match-item[data-side="L"]', host).forEach((x) => x.classList.remove('sel'));
          selL = i;
          b.classList.add('sel');
          M.sfx.tap();
          return;
        }
        if (selL == null) {
          ctx.feedback('hint', 'Commence par un élément de gauche 👈');
          return;
        }
        if (i === selL) {
          done.add(i);
          lockPair(i, colors[done.size % colors.length]);
          selL = null;
          M.sfx.pop();
          if (done.size === n) ctx.complete(mistakes === 0, true);
        } else {
          mistakes++;
          M.sfx.bad();
          b.classList.remove('wrong');
          void b.offsetWidth;
          b.classList.add('wrong');
          ctx.feedback('bad', 'Ces deux-là ne vont pas ensemble. Essaie encore 💪' + hintHtml(q));
        }
      };
      return { lock() {} };
    },
  });

  /* ------------------------------------------------------------------ sort */
  M.registerFormat('sort', {
    doc: "Classer : touche un élément, puis la bonne boîte. items[].say lit l'élément au toucher.",
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.bins) || q.bins.length < 2) return 'bins : au moins 2';
      if (!Array.isArray(q.items) || q.items.length < 2) return 'items : au moins 2';
      if (!q.items.every((it) => q.bins.some((b) => same(b.id, it.bin)))) return 'item avec une boîte inconnue';
    },
    instruction: () => 'Touche un élément, puis la boîte où il va 👇',
    answerLabel: () => 'voir les boîtes',
    render(host, q, ctx) {
      const order = M.shuffle(M.range(0, q.items.length - 1));
      const placed: Record<number, Value> = {};
      let sel: number | null = null,
        mistakes = 0;
      const draw = () => {
        host.innerHTML = `<div class="sort-pool">${
          order
            .filter((i) => placed[i] == null)
            .map((i) => `<button class="sort-item ${sel === i ? 'sel' : ''}" data-i="${i}">${q.items[i].label}</button>`)
            .join('') || '<span class="muted">Tout est classé ! 🎉</span>'
        }</div>
          <div class="sort-bins" style="grid-template-columns:repeat(${Math.min(q.bins.length, 4)},1fr)">${q.bins
            .map(
              (b) =>
                `<button class="sort-bin" data-bin="${M.esc(b.id)}"><b>${b.label}</b><span class="sort-in">${order
                  .filter((i) => same(placed[i], b.id))
                  .map((i) => `<span class="sort-item in">${q.items[i].label}</span>`)
                  .join('')}</span></button>`,
            )
            .join('')}</div>`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        const it = M.closest(e, '.sort-item:not(.in)');
        if (it) {
          sel = Number(it.dataset.i);
          M.sfx.tap();
          const s = q.items[sel].say;
          if (s) M.say(s, { lang: q.items[sel].lang || q.lang, raw: true });
          draw();
          return;
        }
        const bin = M.closest(e, '.sort-bin');
        if (!bin) return;
        const bdef = q.bins.find((b) => same(b.id, bin.dataset.bin));
        if (bdef && bdef.say) M.say(bdef.say, { lang: bdef.lang || q.lang, raw: true });
        if (sel == null) {
          ctx.feedback('hint', "Touche d'abord un élément ☝️");
          return;
        }
        if (same(q.items[sel].bin, bin.dataset.bin)) {
          placed[sel] = q.items[sel].bin;
          sel = null;
          M.sfx.pop();
          draw();
          if (Object.keys(placed).length === q.items.length) ctx.complete(mistakes === 0, true);
          else ctx.feedback('', 'Bien ! Continue 👇');
        } else {
          mistakes++;
          M.sfx.bad();
          bin.classList.remove('wrong');
          void bin.offsetWidth;
          bin.classList.add('wrong');
          ctx.feedback('bad', 'Pas dans cette boîte. Essaie encore 💪' + hintHtml(q));
        }
      };
      return { lock() {} };
    },
  });

  /* ------------------------------------------------------------------ cloze */
  M.registerFormat('cloze', {
    doc: 'Phrase à trous : touche un trou, puis le bon mot.',
    layout: 'wide',
    validate(q) {
      if (typeof q.text !== 'string' || !Array.isArray(q.blanks) || !q.blanks.length) return 'text/blanks manquants';
      for (let i = 0; i < q.blanks.length; i++) {
        const b = q.blanks[i];
        if (!q.text.includes(`{${i}}`)) return `trou {${i}} absent du texte`;
        if (!Array.isArray(b.choices) || b.choices.filter((c) => same(c, b.answer)).length !== 1)
          return `trou ${i} : réponse absente ou en double`;
        if (new Set(b.choices.map(String)).size !== b.choices.length) return `trou ${i} : choix en double`;
      }
    },
    instruction: () => 'Touche un trou, puis choisis le bon mot 👇',
    answerLabel: (q) => q.blanks.map((b) => M.esc(b.answer)).join(' · '),
    render(host, q, ctx) {
      const fill: (string | null | undefined)[] = q.blanks.map(() => null);
      const bad = new Set<number>();
      let cur = 0;
      const draw = (reveal?: boolean) => {
        const html = q.text.replace(/\{(\d+)\}/g, (m: string, k: string) => {
          const i = +k;
          const v = reveal ? q.blanks[i].answer : fill[i];
          return `<button class="cloze-gap ${cur === i && !reveal ? 'sel' : ''} ${v ? 'filled' : ''} ${bad.has(i) ? 'wrong' : ''} ${reveal ? 'good' : ''}" data-i="${i}">${v ? M.esc(v) : '&nbsp;?&nbsp;'}</button>`;
        });
        host.innerHTML = `<div class="cloze-text">${html}</div>
          ${
            reveal
              ? ''
              : `<div class="cloze-bank">${M.shuffle(q.blanks[cur].choices)
                  .map((c) => `<button class="chip-btn" data-c="${M.esc(c)}">${M.esc(c)}</button>`)
                  .join('')}</div>
          <button class="btn primary big fmt-check">✓ Vérifier</button>`
          }`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        const g = M.closest(e, '.cloze-gap');
        if (g) {
          cur = Number(g.dataset.i);
          M.sfx.tap();
          draw();
          return;
        }
        const c = M.closest(e, '.chip-btn');
        if (c) {
          fill[cur] = c.dataset.c;
          bad.delete(cur);
          M.sfx.tap();
          const nextEmpty = fill.findIndex((v) => v == null);
          if (nextEmpty >= 0) cur = nextEmpty;
          draw();
          return;
        }
        if (M.closest(e, '.fmt-check')) {
          if (fill.some((v) => v == null)) return ctx.feedback('bad', "Remplis tous les trous d'abord 🙂");
          bad.clear();
          fill.forEach((v, i) => {
            if (!same(v, q.blanks[i].answer)) bad.add(i);
          });
          const r = ctx.attempt(bad.size === 0);
          if (r === 'retry') {
            cur = [...bad][0] ?? cur; // au moins un trou fautif (sinon ce n'est pas « retry »)
            draw();
          }
        }
      };
      return {
        reveal() {
          draw(true);
        },
      };
    },
  });

  /* ------------------------------------------------------------------ tapwords
     words [str] (¶ = paragraphe) ou target:'passage' (jetons du texte de la question),
     answer [indices] (jetons, ou phrases si unit:'sentence'), select? 'one'|'many',
     mode? 'letters', mark? 'q'|'d'|'x' (marque persistante sur le passage), hintSpan? [i, j] */
  M.registerFormat('tapwords', {
    doc: 'Touche le ou les bons mots dans une phrase, ou directement dans le texte du problème (target: passage).',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.answer) || !q.answer.length || q.answer.some((i) => !Number.isInteger(i) || i < 0)) return 'answer : indices';
      if (q.target === 'passage') {
        if (q.unit === 'sentence') return;
        const toks = q._passageTokens || (typeof q.passage === 'object' && q.passage.tokens);
        if (toks && q.answer.some((i) => i >= toks.length || toks[i].w === '¶')) return 'answer : indice hors du passage';
        return;
      }
      const words = q.words;
      if (!Array.isArray(words) || words.length < 2) return 'words : au moins 2';
      if (q.answer.some((i) => i >= words.length || words[i] === '¶')) return 'answer : indice invalide';
    },
    instruction: (q) =>
      q.select === 'one' || q.answer.length === 1 ? 'Touche le bon mot 👇' : `Touche les bons mots (${q.answer.length}), puis Vérifier 👇`,
    answerLabel: (q) => (q.target === 'passage' ? 'voir le texte' : q.answer.map((i) => M.esc(need(q.words, 'words')[i])).join(', ')),
    render(host, q, ctx) {
      const one = q.select === 'one' || (q.select !== 'many' && q.answer.length === 1);
      const sel = new Set<number>();
      const P = q.target === 'passage' ? ctx.passage : null;
      const sentence = q.unit === 'sentence';
      const markCls = 'mk-' + (q.mark || 'q');
      let els: (HTMLElement | undefined)[];
      if (P) {
        host.innerHTML = one ? '' : '<button class="btn primary big fmt-check">✓ Vérifier</button>';
        P.setMarking(true);
        els = P.tokens;
      } else {
        host.innerHTML = `<div class="tapwords ${q.mode === 'letters' ? 'letters' : ''}">${need(q.words, 'words')
          .map((w, i) => (w === '¶' ? '<span class="tw-br"></span>' : `<button class="tw" data-i="${i}">${M.esc(w)}</button>`))
          .join(q.mode === 'letters' ? '' : ' ')}</div>${one ? '' : '<button class="btn primary big fmt-check">✓ Vérifier</button>'}`;
        els = M.$$('.tw', host).reduce<HTMLElement[]>((a, b) => {
          a[Number(b.dataset.i)] = b;
          return a;
        }, []);
      }
      /** Jetons du passage (unit:'sentence' exige target:'passage'). */
      const tokenData = () => need(P, 'passage').tokenData;
      const unitOf = (i: number) => (sentence ? tokenData()[i].s : i);
      const elsOfUnit = (u: number): HTMLElement[] =>
        sentence ? els.filter((e, i): e is HTMLElement => !!e && tokenData()[i].s === u) : [els[u]].filter((e): e is HTMLElement => !!e);
      const paint = (u: number, cls: string, on: boolean) => elsOfUnit(u).forEach((e) => e.classList.toggle(cls, on));
      const hintSpan = () => {
        if (q.hintSpan)
          for (let i = q.hintSpan[0]; i <= q.hintSpan[1]; i++) {
            const t = els[i];
            if (t) t.classList.add('hintspan');
          }
      };
      const tap = (i: number) => {
        if (ctx.done) return;
        const u = unitOf(i);
        if (one) {
          const ok = q.answer.includes(u);
          paint(u, ok ? (P ? markCls : 'right') : 'wrong', true);
          const r = ctx.attempt(ok);
          if (r === 'retry') {
            hintSpan();
            setTimeout(() => paint(u, 'wrong', false), 700);
          }
          return;
        }
        if (sel.has(u)) sel.delete(u);
        else sel.add(u);
        paint(u, 'sel', sel.has(u));
        M.sfx.tap();
      };
      const onClick = (e: MouseEvent) => {
        const c = M.closest(e, '.fmt-check');
        if (c && !ctx.done) {
          if (!sel.size) return ctx.feedback('bad', 'Touche au moins un mot 🙂');
          const ok = sameSet([...sel], q.answer);
          const r = ctx.attempt(ok, [...sel]);
          if (ok && P)
            sel.forEach((u) => {
              paint(u, 'sel', false);
              paint(u, markCls, true);
            });
          if (r === 'retry') {
            hintSpan();
            sel.forEach((u) => {
              if (!q.answer.includes(u)) {
                paint(u, 'sel', false);
                sel.delete(u);
              }
            });
          }
          return;
        }
        if (!P) {
          const b = M.closest(e, '.tw');
          if (b) tap(Number(b.dataset.i));
        }
      };
      host.onclick = onClick;
      if (P) P.onTap((i) => tap(i));
      const finish = () => {
        if (P) {
          P.setMarking(false);
          P.onTap(null);
        }
      };
      return {
        reveal() {
          q.answer.forEach((u) => paint(u, P ? markCls : 'right', true));
          finish();
        },
        lock() {
          finish();
          M.$$('button', host).forEach((b) => (b.disabled = true));
          if (P) els.forEach((e) => e && e.classList.remove('sel'));
        },
      };
    },
  });

  /* ------------------------------------------------------------------ hotspot
     html (SVG avec [data-hot]), answer: id | [ids] (plusieurs → Vérifier), answerText?, answerSay? */
  M.registerFormat('hotspot', {
    doc: "Touche la bonne zone d'une image (éléments data-hot). answer peut être une liste (toutes les zones).",
    layout: 'wide',
    validate(q) {
      if (typeof q.html !== 'string') return 'html manquant';
      const ids = Array.isArray(q.answer) ? q.answer : [q.answer];
      const miss = ids.find((id) => !q.html.includes(`data-hot="${id}"`));
      if (miss !== undefined) return `zone data-hot="${miss}" absente`;
    },
    instruction: (q) =>
      Array.isArray(q.answer)
        ? `Touche toutes les bonnes zones (${q.answer.length}), puis Vérifier 👇`
        : "Touche la bonne réponse sur l'image 👇",
    answerLabel: (q) => q.answerText || "voir l'image",
    render(host, q, ctx) {
      const all = Array.isArray(q.answer) ? q.answer : null; // plusieurs zones → Vérifier
      const many = !!all;
      const sel = new Set<string>();
      host.innerHTML = `<div class="hotspot">${q.html}</div>${many ? '<button class="btn primary big fmt-check">✓ Vérifier</button>' : ''}`;
      const zones = (id: string) => M.$$<SVGElement>(`[data-hot="${id}"]`, host);
      host.onclick = (e) => {
        if (ctx.done) return;
        if (all && M.closest(e, '.fmt-check')) {
          if (!sel.size) return ctx.feedback('bad', 'Touche au moins une zone 🙂');
          const r = ctx.attempt(sameSet([...sel], all), [...sel]);
          if (r === 'retry')
            sel.forEach((id) => {
              if (!all.some((a) => same(a, id))) {
                sel.delete(id);
                zones(id).forEach((z) => z.classList.remove('hot-sel'));
              }
            });
          return;
        }
        const h = M.closest<SVGElement>(e, '[data-hot]');
        if (!h) return;
        const id = String(h.dataset.hot); // [data-hot] : l'attribut existe
        if (many) {
          if (sel.has(id)) sel.delete(id);
          else sel.add(id);
          zones(id).forEach((z) => z.classList.toggle('hot-sel', sel.has(id)));
          M.sfx.tap();
          return;
        }
        const ok = same(id, q.answer);
        h.classList.add(ok ? 'hot-right' : 'hot-wrong');
        const r = ctx.attempt(ok);
        if (r === 'retry') setTimeout(() => h.classList.remove('hot-wrong'), 700);
      };
      return {
        reveal() {
          (Array.isArray(q.answer) ? q.answer : [q.answer]).forEach((id) => zones(id).forEach((x) => x.classList.add('hot-right')));
          if (q.answerSay) M.say(q.answerSay, { lang: q.lang, raw: true });
        },
      };
    },
  });

  /* ------------------------------------------------------------------ label
     Étiqueter un diagramme : html (SVG, zones data-hot, data-anchor="x,y" facultatif),
     labels [{id, text, say?}], distractors? [text], explore? (page Apprendre : toucher = lire) */
  M.registerFormat('label', {
    doc: 'Étiqueter un diagramme : touche une étiquette, puis la bonne partie du dessin.',
    layout: 'wide',
    validate(q) {
      if (typeof q.html !== 'string' || !Array.isArray(q.labels) || q.labels.length < 2) return 'html/labels manquants';
      const ids = q.labels.map((l) => String(l.id));
      if (new Set(ids).size !== ids.length) return 'labels : id en double';
      const miss = ids.find((id) => !q.html.includes(`data-hot="${id}"`));
      if (miss) return `zone data-hot="${miss}" absente`;
    },
    instruction: () => 'Touche une étiquette, puis la bonne partie du dessin 👇',
    answerLabel: () => 'voir les étiquettes',
    render(host, q, ctx) {
      interface Chip {
        id: string | null;
        text: string;
        say?: string;
        k: number | string;
      }
      const all = M.shuffle<Chip>([
        ...q.labels.map((l, i) => ({ ...l, k: i })),
        ...(q.distractors || []).map((t, i) => ({ id: null, text: t, k: 'd' + i })),
      ]);
      const placed = new Set<number | string>();
      let sel: string | null | undefined = null,
        mistakes = 0;
      host.innerHTML = `<div class="label-bank"></div><div class="hotspot label-fig">${q.html}</div>`;
      const svg = M.$('svg', host);
      const drawBank = () => {
        M.$('.label-bank', host)!.innerHTML =
          all
            .filter((l) => !placed.has(l.k))
            .map((l) => `<button class="chip-btn ${sel === l.k ? 'sel' : ''}" data-k="${l.k}">${M.esc(l.text)}</button>`)
            .join('') || '<span class="muted">Tout est étiqueté ! 🎉</span>';
      };
      const place = (l: { id: string | null; text: string }) => {
        const z = M.$<SVGGraphicsElement>(`[data-hot="${l.id}"]`, host);
        if (!z || !svg) return;
        z.classList.add('hot-right');
        let x: number, y: number;
        if (z.dataset.anchor) [x, y] = z.dataset.anchor.split(',').map(Number);
        else {
          try {
            const b = z.getBBox();
            x = b.x + b.width / 2;
            y = b.y + b.height / 2;
          } catch (e) {
            x = 10;
            y = 10;
          }
        }
        const w = l.text.length * 9 + 16;
        svg.insertAdjacentHTML(
          'beforeend',
          `<g class="lbl-placed"><rect x="${x - w / 2}" y="${y - 13}" width="${w}" height="26" rx="8"/><text x="${x}" y="${y + 5}" text-anchor="middle">${M.esc(l.text)}</text></g>`,
        );
      };
      drawBank();
      host.onclick = (e) => {
        if (ctx.done) return;
        const c = M.closest(e, '.chip-btn');
        if (c) {
          sel = c.dataset.k;
          const l = all.find((x) => String(x.k) === sel);
          if (l && l.say) M.say(l.say, { lang: q.lang, raw: true });
          M.sfx.tap();
          drawBank();
          return;
        }
        const h = M.closest<SVGElement>(e, '[data-hot]');
        if (!h) return;
        if (q.explore) {
          const l = q.labels.find((x) => same(x.id, h.dataset.hot));
          if (l) {
            M.say(l.say || l.text, { lang: q.lang, raw: true });
            ctx.feedback('hint', M.esc(l.text));
          }
          return;
        }
        if (sel == null) {
          ctx.feedback('hint', "Touche d'abord une étiquette ☝️");
          return;
        }
        const l = all.find((x) => String(x.k) === sel);
        if (l && l.id != null && same(l.id, h.dataset.hot) && !placed.has(l.k)) {
          placed.add(l.k);
          place(l);
          sel = null;
          M.sfx.pop();
          drawBank();
          if (q.labels.every((x, i) => placed.has(i))) ctx.complete(mistakes === 0, true);
          else ctx.feedback('', 'Bien ! Continue 👇');
        } else {
          mistakes++;
          M.sfx.bad();
          ctx.feedback(
            'bad',
            (l && l.id == null ? 'Cette étiquette ne va nulle part sur ce dessin.' : 'Pas à cet endroit.') +
              ' Essaie encore 💪' +
              hintHtml(q),
          );
        }
      };
      return {
        reveal() {
          q.labels.forEach((l, i) => {
            if (!placed.has(i)) place(l);
          });
        },
        lock() {},
      };
    },
  });

  /* ------------------------------------------------------------------ estimate
     Placer une valeur sur une droite. lo, hi, answer, tolerance (écart accepté), labelEvery?, unit? */
  M.registerFormat('estimate', {
    doc: "Estimer : touche l'endroit sur la droite numérique; accepté si assez proche (tolerance).",
    layout: 'wide',
    validate(q) {
      if (![q.lo, q.hi, q.answer, q.tolerance].every(Number.isFinite)) return 'lo, hi, answer, tolerance : nombres';
      if (q.answer < q.lo || q.answer > q.hi || q.hi <= q.lo) return 'answer hors de [lo, hi]';
    },
    instruction: () => "Touche la droite à l'endroit choisi, puis Vérifier 👇",
    answerLabel: (q) => `environ ${q.answer}${q.unit ? ' ' + q.unit : ''}`,
    retryMessage: (q, v) =>
      (Number(v) > q.answer ? 'Un peu trop loin vers la droite.' : 'Un peu trop loin vers la gauche.') + ' Essaie encore 💪' + hintHtml(q),
    render(host, q, ctx) {
      const X0 = 40,
        X1 = 960,
        Y = 90,
        span = q.hi - q.lo;
      const x = (v: number) => X0 + ((v - q.lo) * (X1 - X0)) / span;
      const every = q.labelEvery || (span <= 20 ? 1 : span <= 100 ? 10 : 100);
      let val: number | null = null,
        revealed = false;
      const draw = () => {
        let s = `<svg class="nline est" viewBox="0 0 1000 150"><line class="axis" x1="${X0 - 10}" y1="${Y}" x2="${X1 + 10}" y2="${Y}"/>`;
        for (let v = q.lo; v <= q.hi; v += every)
          s += `<line class="tick" x1="${x(v)}" y1="${Y - 12}" x2="${x(v)}" y2="${Y + 12}"/><text class="tl" x="${x(v)}" y="${Y + 40}">${v}</text>`;
        if (revealed)
          s += `<rect class="est-zone" x="${x(Math.max(q.lo, q.answer - q.tolerance))}" y="${Y - 22}" width="${x(Math.min(q.hi, q.answer + q.tolerance)) - x(Math.max(q.lo, q.answer - q.tolerance))}" height="44" rx="8"/><text class="tl est-ans" x="${x(q.answer)}" y="${Y - 30}">${q.answer}</text>`;
        if (val != null) s += `<text x="${x(val)}" y="${Y - 8}" text-anchor="middle" font-size="34">📍</text>`;
        s += `<rect class="est-hit" x="${X0 - 20}" y="0" width="${X1 - X0 + 40}" height="150" fill="transparent"/></svg>`;
        host.innerHTML =
          `<div class="nline-scroll">${s}</div>` +
          `<div class="viz-status">${val != null ? 'Tu as choisi environ <b>' + val + '</b>' : ''}</div><button class="btn primary big fmt-check">✓ Vérifier</button>`;
      };
      draw();
      host.onclick = (e) => {
        if (ctx.done) return;
        if (M.closest(e, '.fmt-check')) {
          if (val == null) return ctx.feedback('bad', "Touche la droite d'abord 🙂");
          ctx.attempt(Math.abs(val - q.answer) <= q.tolerance, val);
          return;
        }
        const svg = M.closest<SVGSVGElement>(e, 'svg');
        if (!svg) return;
        const r = svg.getBoundingClientRect();
        const vx = ((e.clientX - r.left) / r.width) * 1000;
        const step = span <= 20 ? 1 : span <= 200 ? 1 : 5;
        val = Math.max(q.lo, Math.min(q.hi, Math.round((q.lo + ((vx - X0) / (X1 - X0)) * span) / step) * step));
        M.sfx.tap();
        draw();
      };
      return {
        reveal() {
          revealed = true;
          draw();
        },
      };
    },
  });

  /* ------------------------------------------------------------------ info (non noté)
     Contenu à lire dans une étape (« Je lis le problème deux fois »). html?, button? */
  M.registerFormat('info', {
    doc: "Étape non notée : contenu à lire puis « J'ai lu ✔ ».",
    ungraded: true,
    validate() {},
    instruction: () => '',
    answerLabel: () => '',
    render(host, q, ctx) {
      host.innerHTML = `${q.html || ''}<button class="btn blue big fmt-check">${q.button || "J'ai lu ✔"}</button>`;
      host.onclick = (e) => {
        if (M.closest(e, '.fmt-check') && !ctx.done) ctx.complete(true, true);
      };
    },
  });

  /* ------------------------------------------------------------------ reflect (non noté)
     Carte de discussion : aucune étoile, aucun texte enregistré. actions? [libellés] */
  M.registerFormat('reflect', {
    doc: 'Carte de réflexion à discuter avec un adulte. Jamais notée; aucune réponse enregistrée.',
    ungraded: true,
    validate(q) {
      if (q.answer !== undefined) return 'reflect : pas de champ answer';
    },
    instruction: () => 'Parles-en avec un adulte 💬',
    answerLabel: () => '',
    render(host, q, ctx) {
      const acts = q.actions || ['💬 On en a parlé ✔', '🙈 Je préfère passer'];
      host.innerHTML = `<div class="choices-grid" style="grid-template-columns:1fr">${acts.map((a, i) => `<button class="choice-btn" data-i="${i}">${a}</button>`).join('')}</div>`;
      host.onclick = (e) => {
        const b = M.closest(e, '.choice-btn');
        if (b && !ctx.done) ctx.complete(true, true);
      };
    },
  });

  /* ------------------------------------------------------------------ sous-question (steps, predict) */
  /**
   * Monte une sous-question dans li (éléments .step-prompt/.step-body/.step-fb) et appelle onDone(first, ok).
   */
  function runSub(
    li: HTMLElement,
    s: SubQuestion & StepExtras,
    ctx: FormatCtx<unknown>,
    onDone: (first: boolean, ok: boolean) => void,
    vars: Record<string, string> = {},
  ) {
    const f = need(M.formats[M.formatOf(s)], 'format'); // vérifié par validate (steps, predict)
    // Éléments rendus par subLi()
    const pr = M.$('.step-prompt', li)!,
      body = M.$('.step-body', li)!,
      fb = M.$('.step-fb', li)!,
      vz = M.$('.step-viz', li);
    const prompt = String(s.prompt || '').replace(/\{s(\d+)\}/g, (m: string, k: string) =>
      vars['s' + k] !== undefined ? vars['s' + k] : m,
    );
    const has = prompt.includes('{?}');
    const setInline = (html: string) => (pr.innerHTML = has ? prompt.replace('{?}', html) : prompt);
    setInline('<span class="ans-box">?</span>');
    if (vz) {
      vz.innerHTML = '';
      if (s.viz) {
        try {
          s.viz(vz);
        } catch (e) {
          console.error(e);
        }
      }
    }
    let tries = 0,
      done = false,
      inst: FormatInstance | null = null;
    const max = s.tries || (f.maxTries ? f.maxTries(s) : 2);
    const finish = (first: boolean, ok: boolean) => {
      if (done) return;
      done = true;
      if (inst && inst.lock) inst.lock();
      else M.$$<HTMLButtonElement | HTMLInputElement>('button,input', body).forEach((b) => (b.disabled = true));
      if (!ok && inst && inst.reveal) inst.reveal();
      fb.className = 'step-fb ' + (ok ? 'good' : 'bad');
      fb.innerHTML = f.ungraded
        ? ''
        : ok
          ? s.after
            ? '✔️ ' + s.after
            : '✔️'
          : `La bonne réponse : <b>${f.answerLabel ? f.answerLabel(s) : 'answer' in s ? s.answer : undefined}</b>${s.after ? '<div>' + s.after + '</div>' : ''}`;
      if (ok && !f.ungraded) M.sfx.pop();
      onDone(first, ok);
    };
    const sub: FormatCtx<typeof s> = {
      q: s,
      host: body,
      hasInline: has,
      setInline,
      passage: ctx.passage,
      get done() {
        return done || ctx.done;
      },
      get tries() {
        return tries;
      },
      feedback: (cls, html) => {
        fb.className = 'step-fb ' + cls;
        fb.innerHTML = html;
      },
      complete: finish,
      attempt(ok, val) {
        if (done) return 'failed';
        if (ok) {
          finish(tries === 0, true);
          return 'correct';
        }
        tries++;
        M.sfx.bad();
        if (tries >= max) {
          finish(false, false);
          return 'failed';
        }
        sub.feedback('bad', (f.retryMessage && f.retryMessage(s, val)) || 'Pas tout à fait… Essaie encore 💪' + hintHtml(s));
        return 'retry';
      },
      onKey: (fn) => ctx.onKey(fn),
    };
    inst = f.render(body, s, sub) || {};
    return sub;
  }
  const subLi = (k: number, label: string) =>
    `<li class="step todo" data-k="${k}"><div class="step-head"><span class="step-num">${k + 1}</span><b>${label}</b></div><div class="step-prompt"></div><div class="step-viz"></div><div class="step-body"></div><div class="step-fb"></div></li>`;
  const answerText = (s: SubQuestion) => {
    const f = M.formats[M.formatOf(s)];
    return f && f.answerLabel ? M.text(f.answerLabel(s)) : String('answer' in s ? s.answer : undefined);
  };

  /* ------------------------------------------------------------------ steps
     steps [{label?, demarche?: 0..5, prompt ({sK} = réponse de l'étape K), format, …, viz?, after?}],
     scoreSteps? [indices comptés pour l'étoile] */
  M.registerFormat('steps', {
    doc: 'Plusieurs étapes guidées (démarche : Je comprends → Je planifie → Je calcule → Je réponds). Le texte reste visible.',
    layout: 'wide',
    validate(q) {
      if (!Array.isArray(q.steps) || q.steps.length < 2) return 'steps : au moins 2';
      for (let i = 0; i < q.steps.length; i++) {
        const s = q.steps[i],
          f = M.formats[M.formatOf(s)];
        if (!f || ['steps', 'predict'].includes(f.name)) return `étape ${i} : format invalide`;
        if (!s.prompt && f.name !== 'info') return `étape ${i} : prompt manquant`;
        if ('target' in s && s.target === 'passage' && typeof q.passage === 'object' && q.passage.tokens)
          s._passageTokens = q.passage.tokens;
        const e = f.validate && f.validate(s);
        if (e) return `étape ${i} : ${e}`;
      }
    },
    instruction: () => 'Une étape à la fois 👇',
    answerLabel: () => 'voir les étapes',
    render(host, q, ctx) {
      const D = (M.ui && M.ui.DEMARCHE) || [];
      const label = (s: StepItem, k: number) =>
        s.label || (s.demarche != null && D[s.demarche] ? `${D[s.demarche].icon} ${D[s.demarche].label}` : 'Étape ' + (k + 1));
      const useDem = q.steps.some((s) => s.demarche != null) && M.ui;
      host.innerHTML = `${useDem ? '<div class="steps-dem"></div>' : ''}<ol class="steps">${q.steps.map((s, k) => subLi(k, label(s, k))).join('')}</ol>`;
      const vars: Record<string, string> = {};
      const scored = q.scoreSteps || q.steps.map((_, k) => k);
      let i = 0,
        allFirst = true;
      const run = () => {
        const s = q.steps[i],
          li = M.$(`.step[data-k="${i}"]`, host)!; // rendu ci-dessus
        li.classList.remove('todo');
        li.classList.add('now');
        if (useDem) M.$('.steps-dem', host)!.innerHTML = M.ui.demarche(D, s.demarche ?? -1);
        runSub(
          li,
          s,
          ctx,
          (first, ok) => {
            if (!first && scored.includes(i)) allFirst = false;
            li.classList.remove('now');
            li.classList.add(ok ? 'ok' : 'miss');
            vars['s' + (i + 1)] = answerText(s);
            i++;
            if (i < q.steps.length) {
              const go = () => {
                if (host.isConnected && !ctx.done) run();
              };
              const fb = M.$('.step-fb', li)!;
              if (ok) setTimeout(go, 450);
              else {
                fb.insertAdjacentHTML('beforeend', '<div><button class="btn yellow step-next">Continuer ➜</button></div>');
                M.$('.step-next', fb)!.onclick = go;
              }
            } else setTimeout(() => ctx.complete(allFirst, true), 350);
          },
          vars,
        );
        if (li.scrollIntoView && i > 0) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      };
      run();
      return { lock() {} };
    },
  });

  /* ------------------------------------------------------------------ predict
     Prédire → observer → expliquer. La prédiction n'est jamais notée.
     predict {prompt?, choices}, outcome (value), simulate(el, prediction) → Promise, result? html,
     check? {prompt, format, …} (corrigée normalement; sans check : carte non comptée) */
  M.registerFormat('predict', {
    doc: "Prédire (non noté) → voir l'expérience → répondre à une question (notée).",
    layout: 'wide',
    validate(q) {
      if (!q.predict || !Array.isArray(q.predict.choices) || q.predict.choices.length < 2) return 'predict.choices : au moins 2';
      if (!q.predict.choices.some((c) => same(c.value, q.outcome))) return 'outcome absent de predict.choices';
      if (typeof q.simulate !== 'function') return 'simulate manquant';
      if (q.check) {
        const f = M.formats[String(q.check.format)];
        if (!f || ['steps', 'predict'].includes(f.name)) return 'check : format invalide';
        const e = f.validate && f.validate(q.check);
        if (e) return 'check : ' + e;
      }
    },
    instruction: () => "Qu'est-ce qui va arriver, selon toi ? 👇",
    answerLabel: (q) => {
      if (!q.check) return '';
      const chk = q.check;
      const f = need(M.formats[String(chk.format)], 'format');
      return f.answerLabel ? f.answerLabel(chk) : String('answer' in chk ? chk.answer : undefined);
    },
    render(host, q, ctx) {
      const ch = q.predict.choices;
      host.innerHTML = `<div class="predict">
        <div class="pr-ask"><b>🤔 ${q.predict.prompt || 'Je prédis…'}</b><div class="choices-grid" style="grid-template-columns:repeat(${ch.length <= 3 ? ch.length : 2},1fr)">${ch.map((c, i) => `<button class="choice-btn" data-i="${i}">${c.label}</button>`).join('')}</div></div>
        <div class="pr-sim" hidden></div><div class="pr-result" hidden></div>
        ${q.check ? `<ol class="steps pr-check" hidden>${subLi(0, "🔍 J'explique")}</ol>` : ''}</div>`;
      let pred: Choice | null = null;
      host.onclick = async (e) => {
        if (ctx.done) return;
        const b = M.closest(e, '.pr-ask .choice-btn');
        if (b && pred == null) {
          pred = ch[Number(b.dataset.i)];
          M.$$<HTMLButtonElement>('.pr-ask .choice-btn', host).forEach((x) => {
            x.disabled = true;
            x.classList.toggle('sel', x === b);
          });
          M.sfx.tap();
          const sim = M.$('.pr-sim', host)!;
          sim.hidden = false;
          sim.innerHTML = '<button class="btn blue big pr-run">▶ Voir l\'expérience</button><div class="pr-stage"></div>';
          return;
        }
        const run = M.closest(e, '.pr-run');
        if (run) {
          run.remove();
          const p = pred!; // « Voir l'expérience » n'apparaît qu'après la prédiction
          try {
            await q.simulate(M.$('.pr-stage', host)!, p.value);
          } catch (err) {
            console.error(err);
          }
          if (!host.isConnected) return;
          const res = M.$('.pr-result', host)!;
          const outLabel = need(
            ch.find((c) => same(c.value, q.outcome)),
            'outcome',
          ).label;
          res.hidden = false;
          res.innerHTML = `<div class="callout blue">🔬 Tu avais prédit : <b>${p.label}</b> — Résultat : <b>${outLabel}</b>. ${same(p.value, q.outcome) ? 'Bien vu ! 👀' : "Surprise ! C'est comme ça qu'on apprend. 🌱"}${q.result ? '<div>' + q.result + '</div>' : ''}</div>`;
          if (q.check) {
            const ol = M.$('.pr-check', host)!;
            ol.hidden = false;
            ctx.feedback('', 'Explique ce que tu as observé 👇');
            const li = M.$('.step', ol)!;
            li.classList.remove('todo');
            li.classList.add('now');
            runSub(li, q.check, ctx, (first, ok) => {
              li.classList.remove('now');
              li.classList.add(ok ? 'ok' : 'miss');
              setTimeout(() => ctx.complete(first, ok), 300);
            });
          } else ctx.complete(true, true);
        }
      };
      return { lock() {} };
    },
  });
  /** Une carte predict sans check n'est pas comptée. */
  M.isUngraded = (q) => {
    const f = M.formats[M.formatOf(q)];
    return !!(f && f.ungraded) || (!!f && f.name === 'predict' && !('check' in q && q.check));
  };

  M.formatOf = (q) => q.format || q.input;
})();
