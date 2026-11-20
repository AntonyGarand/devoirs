/* =====================================================================
   skills/problemes.js — domaine « Comprendre et résoudre » (C1, C2)
   Toutes les histoires viennent du générateur M.pb (js/maths/pb.js).
   Voir docs/hld/maths-problemes.md § 2.
   ===================================================================== */
(function () {
  'use strict';
  /** Problème produit par le générateur (M.pb.make). */
  /** Habileté du domaine (domain, check et polish ajoutés par reg). */
  type PbSkillDef = Omit<SkillDef, 'domain'>;
  /** Champs ajoutés par single() à la question simple. */
  interface SingleExtra {
    /** Phrases du texte montré (défaut : tout le problème). */
    sentences?: PbSentence[];
    explain?: string;
    prompt?: string;
  }
  const M = window.M;
  const D = 'problemes';
  const pick = M.pick,
    shuffle = M.shuffle,
    rnd = M.rnd;
  const MINUS = '−';
  const T = (s: string): string => M.pb.typo(s);
  const css = (str: string) => {
    try {
      M.css(str);
    } catch {
      /* hors navigateur (tools/check-skills.js) */
    }
  };

  css(`
  .pb-story { font-size: 1.3rem; line-height: 1.7 }
  .pb-story .pb-em { font-size: 1.9rem; vertical-align: middle; margin-right: 6px }
  .pb-op { white-space: nowrap; font-size: 1.3rem; font-weight: 900 }
  .pb-eqc { font-size: 1.5rem; font-weight: 900; letter-spacing: .02em }
  .pb-bar { display: block; width: 100% }
  .pb-bar svg { width: 100%; max-width: 460px; height: auto; display: block; margin: 0 auto }
  .pb-stepbar svg { max-width: 520px; margin: 0 auto }
  .pb-pop svg { animation: pop .4s }
  .pb-num { font-size: 1.6rem; font-weight: 900; color: var(--A) }
  .pb-pic { display: inline-flex; flex-direction: column; gap: 4px; align-items: flex-start; text-align: left }
  .pb-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 1.35rem; line-height: 1.2 }
  .pb-row b { min-width: 4.6em; font-size: 1rem; text-align: right }
  .pb-plates { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center }
  .pb-plate { border: 3px solid var(--line); border-radius: 999px; padding: 4px 10px; background: #fff; font-size: 1.25rem; min-width: 46px; min-height: 40px; display: inline-flex; align-items: center; justify-content: center }
  .pb-seek { font-size: 1.15rem; font-weight: 700 }
  `);

  const chk = (q: Question) => M.pb.checkQ(q);
  // élision et typographie sur tout le texte produit (« de Amira » → « d'Amira »), y compris les étapes ajoutées après coup
  const reg = (def: PbSkillDef) =>
    M.registerSkill({
      domain: D,
      check: chk,
      ...def,
      gen(o) {
        const q = def.gen.call(this, o);
        M.pb.polish(q);
        return q;
      },
    });
  const attach = (q: Question, pb: Pb) => M.pb.attach(q, pb);
  /** Histoire sans nombres et sa question (fournies par le générateur pour l'ajout et le retrait). */
  function noNumOf(pb: Pb): { noNum: PbSentence[]; noNumQ: PbSentence } {
    if (!pb.noNum || !pb.noNumQ) throw new Error(`histoire sans nombres absente (${pb.kind})`);
    return { noNum: pb.noNum, noNumQ: pb.noNumQ };
  }
  const explainOf = (pb: Pb) => `${pb.explain} ${M.esc(pb.reply)}`;
  /** Question simple (un format) bâtie à partir d'une étape du générateur, avec le texte du problème. */
  function single(pb: Pb, step: StepItem, extra: SingleExtra = {}) {
    const q = { ...step, passage: M.pb.passage(pb, extra.sentences), explain: explainOf(pb), ...extra };
    delete q.demarche;
    delete q.after;
    delete q.sentences;
    return attach(q, pb);
  }
  const barHtml = (spec: BarModelSpec) => `<span class="pb-bar">${M.viz.barModelHtml(spec, { scale: 1 })}</span>`;

  /* ---------- Visuels : onglets barres ↔ jetons ---------- */
  function barMount(el: HTMLElement, pb: Pb): ShowMeCtl {
    el.innerHTML = `<div class="bm-wrap pb-stepbar">${M.viz.barModelHtml(pb.barSpec(false))}</div>`;
    return {
      async showMe() {
        await M.sleep(200);
        if (!el.isConnected) return;
        el.innerHTML = `<div class="bm-wrap pb-stepbar pb-pop">${M.viz.barModelHtml(pb.barSpec(true))}</div>`;
        M.sfx.pop();
      },
    };
  }
  /** Inconnue du problème → case cachée des jetons. */
  const COUNTER_UNKNOWN: Partial<Record<string, 'r' | 'a' | 'b'>> = { fin: 'r', change: 'b', debut: 'a', tout: 'r', partie: 'b' };
  function jetonsMount(el: HTMLElement, pb: Pb): ShowMeCtl {
    const v = pb.v,
      em = pb.emoji,
      U = COUNTER_UNKNOWN[pb.unknown];
    if (pb.kind === 'ajout') return M.viz.counters(el, { a: v.debut, b: v.change, op: 'add', unknown: U, emoji: em });
    if (pb.kind === 'retrait') return M.viz.counters(el, { a: v.debut, b: v.change, op: 'sub', unknown: U, emoji: em });
    if (pb.kind === 'reunion') return M.viz.counters(el, { a: v.p1, b: v.p2, op: 'add', unknown: U, emoji: em });
    if (pb.kind === 'comparaison' && M.opViz) return M.opViz.compare(el, { a: v.grand, b: v.petit, na: pb.G.n, nb: pb.S.n, emoji: em });
    if (pb.kind === 'deux' && M.opViz && M.opViz.bag) {
      const [o1, o2] = pb.ops,
        { a, b, c } = v;
      const parts: OpBagPart[] = [{ n: a, k: 'A' }];
      if (o1 === '+') parts.push({ n: b, k: 'B' });
      if (o2 === '+') parts.push({ n: c, k: 'B' });
      const total = parts.reduce((s, p) => s + p.n, 0);
      const cross: number[] = [];
      let rm = (o1 === '-' ? b : 0) + (o2 === '-' ? c : 0);
      for (let i = (o1 === '+' ? a + b : a) - 1; rm > 0 && i >= 0; i--, rm--) cross.push(i);
      return M.opViz.bag(el, {
        parts,
        emoji: em,
        cross: cross.filter((i) => i < total),
        hint: "Les objets rouges : au début. Les bleus : ceux qui arrivent. Touche un objet pour le barrer quand il s'en va.",
      });
    }
    return barMount(el, pb);
  }
  function withTabs(q: Question, pb: Pb, jetons: boolean) {
    let api: ShowMeCtl | null = null;
    const models: { label: string; mount: (p: HTMLElement) => ShowMeCtl }[] = [{ label: '🧱 Barres', mount: (p) => barMount(p, pb) }];
    if (jetons) models.push({ label: '🔴 Jetons', mount: (p) => jetonsMount(p, pb) });
    q.viz = (el) => {
      api = null;
      M.ui.tabs(
        el,
        models.map((m, i) => ({
          id: 't' + i,
          label: m.label,
          render: (p) => {
            api = m.mount(p) || null;
          },
        })),
      );
    };
    q.showMe = () => (api && api.showMe ? api.showMe() : undefined);
    return q;
  }

  /* ==================================================================
     0. Petits problèmes (déplacée depuis « Les opérations », même id)
     ================================================================== */
  reg({
    id: 'problemes',
    title: 'Petits problèmes',
    icon: '📖',
    starter: true,
    learn: 'pb-types',
    desc: 'Des histoires à résoudre : ajouter, enlever, réunir, comparer.',
    pda: "Sens des opérations A.1, A.2 a–b — situations d'ajout, de retrait, de réunion, de comparaison, composition de transformations",
    gen({ lvl }) {
      const kinds: PbKind[] =
        lvl === 0
          ? ['ajout', 'retrait', 'reunion']
          : lvl === 1
            ? ['ajout', 'retrait', 'reunion', 'comparaison', 'comparaison']
            : ['comparaison', 'ajout', 'retrait', 'deux', 'deux'];
      const unknowns: PbMakeOpts['unknowns'] =
        lvl === 0
          ? undefined
          : lvl === 1
            ? { ajout: ['fin', 'change'], retrait: ['fin', 'change'], reunion: ['tout', 'partie'], comparaison: ['ecart'] }
            : { ajout: ['change', 'debut'], retrait: ['change', 'debut'], comparaison: ['ecart', 'petit', 'grand'] };
      const pb = M.pb.make({ kinds, unknowns, lvl: lvl ? 1 : 0, max: lvl ? 20 : 10 });
      const q: QuestionOf<'number'> = {
        prompt: M.pb.storyHtml(pb),
        say: pb.text,
        format: 'number',
        answer: pb.answer,
        hint: pb.hint,
        explain: explainOf(pb),
      };
      return attach(withTabs(q, pb, true), pb);
    },
  });

  /* ==================================================================
     1. Je comprends l'histoire (sans nombres)
     ================================================================== */
  reg({
    id: 'pb-histoire',
    title: "Je comprends l'histoire",
    icon: '🎬',
    learn: 'pb-demarche',
    desc: 'Une histoire sans nombres : que se passe-t-il ?',
    pda: 'C1 — Décoder les éléments de la situation; Sens des opérations A.1 (ajout, retrait)',
    gen({ lvl }) {
      const pb = M.pb.make({ kinds: ['ajout', 'retrait'], unknowns: { ajout: ['fin'], retrait: ['fin'] }, lvl: 0 });
      const plus = pb.kind === 'ajout';
      const { noNum, noNumQ } = noNumOf(pb);
      if (lvl === 0) {
        return single(
          pb,
          {
            prompt: T("À la fin, y en a-t-il <b>plus</b> ou <b>moins</b> qu'au début ?"),
            format: 'choice',
            answer: plus ? 'plus' : 'moins',
            choices: [
              { label: "⬆️ plus qu'au début", value: 'plus' },
              { label: "⬇️ moins qu'au début", value: 'moins' },
            ],
            hint: plus ? 'Relis la 2e phrase : on en ajoute ou on en enlève ?' : 'Relis la 2e phrase : on en ajoute ou on en enlève ?',
          },
          {
            sentences: [...noNum, noNumQ],
            explain: plus
              ? "On en <b>ajoute</b> : à la fin, il y en a plus qu'au début."
              : "On en <b>enlève</b> : à la fin, il y en a moins qu'au début.",
          },
        );
      }
      if (lvl === 1) {
        const sum = M.pb.bars.tout({ x: 1, y: 1, t: 2, unk: 't', lx: 'au début', ly: 'en plus', scale: 'schema' });
        const part = M.pb.bars.tout({ x: 1, y: 1, t: 2, unk: 'x', ly: 'enlevés', lt: 'au début', toneY: 'X', scale: 'schema' });
        return single(
          pb,
          {
            prompt: T("Quel <b>schéma</b> raconte l'histoire ?"),
            format: 'choice',
            cols: 1,
            answer: plus ? 'sum' : 'part',
            choices: shuffle([
              { label: barHtml(sum), value: 'sum' },
              { label: barHtml(part), value: 'part' },
            ]),
            hint: "Est-ce qu'on en ajoute ou est-ce qu'on en enlève ?",
          },
          {
            sentences: [...noNum, noNumQ],
            explain: plus
              ? 'On en ajoute : deux parties, et on cherche le tout.'
              : 'On en enlève : le début est le tout, on barre ce qui part.',
          },
        );
      }
      const other = M.pb.make({
        kinds: [pb.kind === 'ajout' ? 'retrait' : 'ajout'],
        unknowns: { ajout: ['fin'], retrait: ['fin'] },
        lvl: 0,
        ctx: (c) => c.id !== pb.ctx.id,
      });
      const wrongQ = noNumOf(other).noNumQ.text,
        right = noNumQ.text;
      const silly = pb.text.includes(pb.P.n) ? T(`Quel âge a ${pb.P.n} ?`) : T('Quel temps fait-il ?');
      return single(
        pb,
        {
          prompt: T("Quelle <b>question</b> va avec l'histoire ?"),
          format: 'choice',
          cols: 1,
          answer: 'ok',
          choices: shuffle([
            { label: M.esc(right), value: 'ok', say: right },
            { label: M.esc(wrongQ), value: 'autre', say: wrongQ, why: "Cette question parle d'une autre histoire." },
            { label: M.esc(silly), value: 'silly', say: silly, why: "L'histoire ne le dit pas." },
          ]),
          hint: "La question doit parler des mêmes choses que l'histoire.",
        },
        { sentences: noNum, explain: `La question parle de la même chose que l'histoire : ${M.esc(right)}` },
      );
    },
  });

  /* ==================================================================
     2. Trouve la question
     ================================================================== */
  function seekStep(pb: Pb): StepItem {
    const seek = pb.seekChoices;
    if (!seek) throw new Error(`phrases-réponses absentes (${pb.kind})`);
    return {
      demarche: 1,
      prompt: T('Que cherche-t-on ? Choisis la phrase-réponse à compléter.'),
      format: 'choice',
      cols: 1,
      answer: pb.unknown,
      choices: shuffle(
        seek.map((c) => ({
          label: `<span class="pb-seek">${M.esc(c.label)}</span>`,
          value: c.value,
          say: c.label.replace('❓', 'combien'),
        })),
      ),
      hint: 'Relis la question en bleu.',
      after: "C'est ce que la question demande.",
    };
  }
  reg({
    id: 'pb-question',
    title: 'Trouve la question',
    icon: '🖍️',
    learn: 'pb-demarche',
    desc: 'Touche la phrase qui pose la question.',
    pda: 'C1 — Décoder : déterminer la tâche (la question)',
    gen({ lvl }) {
      if (lvl === 0) {
        const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: 0 });
        return single(pb, M.pb.step.question(pb), { prompt: 'Touche la <b>question</b> dans le texte.' });
      }
      const pb = M.pb.make({
        kinds: ['ajout', 'retrait', 'reunion', 'comparaison'],
        unknowns:
          lvl === 1 ? { ajout: ['change', 'debut'], retrait: ['change', 'debut'], reunion: ['partie'], comparaison: ['ecart'] } : undefined,
        lvl: 1,
        distract: lvl === 2 ? 1 : 0,
      });
      const q = M.pb.toSteps(pb, ['question'], { lvl, prompt: 'Lis bien : où est la question ?' });
      q.steps.push(seekStep(pb));
      return q;
    },
  });

  /* ==================================================================
     3. Les données
     ================================================================== */
  reg({
    id: 'pb-donnees',
    title: 'Les données',
    icon: '⭕',
    learn: 'pb-demarche',
    desc: "Encercle les nombres utiles et dis ce qu'ils comptent.",
    pda: 'C1 — Décoder : dégager les données utiles',
    gen({ lvl }) {
      if (lvl === 1) {
        const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion', 'comparaison', 'deux'], lvl: 1 });
        const pairs = pb.dataTok.map((ti) => {
          const t = pb.tokens[ti],
            m = /^\d+/.exec(t.w);
          if (!m) throw new Error(`donnée sans nombre : ${t.w}`);
          const n = m[0];
          const sent = pb.tokens
            .filter((x) => x.s === t.s)
            .map((x) => (x === t ? x.w.replace(n, '…') : x.w))
            .join(' ');
          return { left: `<span class="pb-num">${n}</span>`, right: M.esc(sent), sayRight: sent.replace('…', 'combien') };
        });
        return attach(
          {
            prompt: T("Associe chaque nombre à sa place dans l'histoire."),
            passage: M.pb.passage(pb),
            format: 'match',
            pairs,
            hint: 'Relis chaque phrase : quel nombre manque ?',
            explain: `Chaque nombre dit combien de quelque chose. ${explainOf(pb)}`,
          },
          pb,
        );
      }
      const pb = M.pb.make({
        kinds: lvl === 0 ? ['ajout', 'retrait', 'reunion'] : ['ajout', 'retrait', 'reunion', 'comparaison'],
        lvl: lvl === 0 ? 0 : 1,
        distract: lvl === 2 ? 1 : 0,
      });
      return single(pb, M.pb.step.donnees(pb));
    },
  });

  /* ==================================================================
     4. Les mots des maths (sens, jamais une liste mot → opération)
     ================================================================== */
  /** « que</b> Léa » / « qu'</b>Amira » : élision quand « que » est en gras. */
  const queB = (nm: string) => (/^[AEIOUYÀÂÉÈÊÎÏÔÛ]/i.test(nm) ? `qu'</b>${nm}` : `que</b> ${nm}`);
  const dots = (n: number, e = '🔵') => e.repeat(n);
  const pic = (rows: [string, number, string?][]) =>
    `<span class="pb-pic">${rows.map(([nm, n, e]) => `<span class="pb-row"><b>${M.esc(nm)}</b>${dots(n, e)}</span>`).join('')}</span>`;
  const plates = (groups: number[], e: string) =>
    `<span class="pb-plates">${groups.map((n) => `<span class="pb-plate">${dots(n, e)}</span>`).join('')}</span>`;
  const WORDS = {
    entout(P) {
      const a = rnd(2, 5),
        b = rnd(2, 5);
      return {
        prompt: T('Complète la phrase avec les bons mots.'),
        scene: [
          { emoji: dots(a, '🔴'), label: `${a} billes rouges` },
          { emoji: dots(b, '🔵'), label: `${b} billes bleues` },
        ],
        format: 'cloze',
        text: T(`${P.n} a ${a} billes rouges et ${b} billes bleues. ${P.Il} a ${a + b} billes {0}.`),
        blanks: [{ choices: shuffle(['en tout', 'de plus', 'de moins']), answer: 'en tout' }],
        hint: 'On met les rouges et les bleues ensemble.',
        explain: `« En tout », c'est quand on met tout ensemble : ${a} + ${b} = ${a + b}.`,
      };
    },
    reste(P) {
      const a = rnd(5, 9),
        b = rnd(2, a - 2);
      return {
        prompt: T('Complète la phrase avec le bon mot.'),
        scene: [{ emoji: dots(a - b, '🍪') + dots(b, '✖️'), label: `${a} biscuits, ${b} mangés` }],
        format: 'cloze',
        text: T(`${P.n} a ${a} biscuits. ${P.Il} en mange ${b}. Il lui en {0} ${a - b}.`),
        blanks: [{ choices: shuffle(['reste', 'manque', 'ajoute']), answer: 'reste' }],
        hint: 'Après avoir mangé, combien de biscuits sont encore là ?',
        explain: `« Il reste », c'est ce qui est encore là après : ${a} ${MINUS} ${b} = ${a - b}.`,
      };
    },
    deplus(P, Q) {
      const q = rnd(2, 4),
        d = rnd(1, 3);
      return {
        prompt: T(`<b>${P.n}</b> a ${d} ${d > 1 ? 'billes' : 'bille'} <b>de plus ${queB(Q.n)}. Quelle image va avec la phrase ?`),
        format: 'choice',
        cols: 1,
        answer: 'ok',
        choices: shuffle([
          {
            label: pic([
              [P.n, q + d],
              [Q.n, q],
            ]),
            value: 'ok',
          },
          {
            label: pic([
              [P.n, q],
              [Q.n, q + d],
            ]),
            value: 'inv',
            why: `Ici, c'est ${Q.n} qui en a plus.`,
          },
          {
            label: pic([
              [P.n, q],
              [Q.n, q],
            ]),
            value: 'eq',
            why: `Ici, ${P.f && Q.f ? 'elles' : 'ils'} en ont autant.`,
          },
        ]),
        hint: `${P.n} en a plus. Sa rangée est plus longue.`,
        explain: `${P.n} a toutes les billes de ${Q.n}, et encore ${d} de plus.`,
      };
    },
    demoins(P, Q) {
      const q = rnd(2, 4),
        d = rnd(1, 3);
      return {
        prompt: T(`<b>${P.n}</b> a ${d} ${d > 1 ? 'billes' : 'bille'} <b>de moins ${queB(Q.n)}. Quelle image va avec la phrase ?`),
        format: 'choice',
        cols: 1,
        answer: 'ok',
        choices: shuffle([
          {
            label: pic([
              [P.n, q],
              [Q.n, q + d],
            ]),
            value: 'ok',
          },
          {
            label: pic([
              [P.n, q + d],
              [Q.n, q],
            ]),
            value: 'inv',
            why: `Ici, c'est ${P.n} qui en a plus.`,
          },
          {
            label: pic([
              [P.n, q + d],
              [Q.n, q + d],
            ]),
            value: 'eq',
            why: `Ici, ${P.f && Q.f ? 'elles' : 'ils'} en ont autant.`,
          },
        ]),
        hint: `${P.n} en a moins. Sa rangée est plus courte.`,
        explain: `Il manque ${d} ${d > 1 ? 'billes' : 'bille'} à ${P.n} pour en avoir autant que ${Q.n}.`,
      };
    },
    autant(P, Q) {
      const q = rnd(2, 5);
      return {
        prompt: T(`<b>${P.n}</b> a <b>autant</b> de billes <b>${queB(Q.n)}. Quelle image va avec la phrase ?`),
        format: 'choice',
        cols: 1,
        answer: 'ok',
        choices: shuffle([
          {
            label: pic([
              [P.n, q],
              [Q.n, q],
            ]),
            value: 'ok',
          },
          {
            label: pic([
              [P.n, q + 1],
              [Q.n, q],
            ]),
            value: 'p',
            why: `Ici, ${P.n} en a plus.`,
          },
          {
            label: pic([
              [P.n, q],
              [Q.n, q + 2],
            ]),
            value: 'q',
            why: `Ici, ${Q.n} en a plus.`,
          },
        ]),
        hint: "« Autant », c'est le même nombre.",
        explain: "« Autant que », c'est pareil : chaque bille a une partenaire.",
      };
    },
    motComparer(P, Q) {
      const b = rnd(2, 6),
        d = rnd(2, 4),
        a = b + d;
      const more = Math.random() < 0.5;
      const text = more
        ? `${P.n} a ${a} billes. ${Q.n} a ${b} billes. ${P.n} a ${d} billes {0} que ${Q.n}.`
        : `${P.n} a ${a} billes. ${Q.n} a ${b} billes. ${Q.n} a ${d} billes {0} que ${P.n}.`;
      return {
        prompt: T('Complète la phrase avec les bons mots.'),
        format: 'cloze',
        text: T(text),
        blanks: [{ choices: shuffle(['de plus', 'de moins', 'autant']), answer: more ? 'de plus' : 'de moins' }],
        hint: `Qui en a le plus : ${P.n} (${a}) ou ${Q.n} (${b}) ?`,
        explain: `${P.n} en a ${a}, ${Q.n} en a ${b}. ${P.n} en a ${d} de plus; ${Q.n} en a ${d} de moins.`,
      };
    },
    chacun(P): Question {
      const n = rnd(2, 3),
        k = rnd(3, 5);
      if (n === k) return WORDS.chacun(P);
      return {
        prompt: T(`${P.n} donne ${k} biscuits <b>à chacun</b> de ses ${n} amis. Quelle image va avec la phrase ?`),
        format: 'choice',
        cols: 1,
        answer: 'ok',
        choices: shuffle([
          { label: plates(Array(n).fill(k), '🍪'), value: 'ok' },
          { label: plates([k], '🍪'), value: 'un', why: 'Ici, un seul ami reçoit des biscuits.' },
          { label: plates(Array(n).fill(k - 1), '🍪'), value: 'nn', why: `Compte les biscuits dans chaque assiette : il en faut ${k}.` },
        ]),
        hint: '« À chacun » : chaque ami reçoit le même nombre.',
        explain: `« Chacun » : chaque ami reçoit ${k} biscuits. ${Array(n).fill(k).join(' + ')} = ${n * k}.`,
      };
    },
    plusQue(P, Q): Question {
      const a = rnd(5, 9),
        d = rnd(2, 4);
      if (a - d === d) return WORDS.plusQue(P, Q);
      return {
        prompt: T(`${P.n} a ${a} billes. ${Q.n} en a ${d} de plus que ${P.n}. Combien de billes ${Q.n} a-t-${Q.il} ?`),
        say: `${P.n} a ${a} billes. ${Q.n} en a ${d} de plus que ${P.n}. Combien de billes ${Q.n} a-t-${Q.il} ?`,
        format: 'choice',
        answer: a + d,
        choices: shuffle([a + d, d, a - d]).map((v) => ({
          label: String(v),
          value: v,
          why: v === d ? `${d}, c'est seulement ce que ${Q.n} a <b>de plus</b>.` : 'Relis : qui en a le plus ?',
        })),
        hint: `« ${d} de plus que ${P.n} » : toutes les billes de ${P.n}, et encore ${d}.`,
        explain: `${Q.n} a les ${a} billes de ${P.n}, et ${d} de plus : ${a} + ${d} = ${a + d}.`,
      };
    },
    piege(P, Q) {
      const g = rnd(9, 15),
        e = rnd(2, 5);
      const ok = Math.random() < 0.4;
      return {
        prompt: T(
          `${P.n} a ${g} billes. ${P.Il} a ${e} billes <b>de plus ${queB(Q.n)}. Pour trouver les billes de ${Q.n}, on fait <b>${g} ${ok ? MINUS : '+'} ${e}</b>.`,
        ),
        format: 'tf',
        answer: ok,
        hint: `Qui en a le moins : ${P.n} ou ${Q.n} ?`,
        explain: `${Q.n} en a <b>moins</b> que ${P.n} : on fait ${g} ${MINUS} ${e} = ${g - e}. Les mots « de plus » ne veulent pas toujours dire + !`,
      };
    },
  } satisfies Record<string, (P: Person, Q: Person) => Question>;
  reg({
    id: 'pb-mots',
    title: 'Les mots des maths',
    icon: '🗝️',
    learn: 'pb-mots',
    desc: 'De plus, de moins, en tout, il reste, chacun, autant que.',
    pda: 'Vocabulaire du 1er cycle (plus, moins, de plus, de moins, somme, différence); C3 — communiquer',
    gen({ lvl }) {
      const P = M.people.pick(),
        Q = M.people.pick({ not: [P.n] });
      const keys: (keyof typeof WORDS)[] =
        lvl === 0
          ? ['entout', 'reste', 'entout', 'autant']
          : lvl === 1
            ? ['deplus', 'demoins', 'autant', 'motComparer', 'reste']
            : ['chacun', 'plusQue', 'piege', 'motComparer', 'demoins'];
      return WORDS[pick(keys)](P, Q);
    },
  });

  /* ==================================================================
     5. Quel schéma ?
     ================================================================== */
  const SCHEMA_KINDS: PbMakeOpts[] = [
    { kinds: ['ajout', 'retrait'], unknowns: { ajout: ['fin'], retrait: ['fin'] } },
    {
      kinds: ['ajout', 'retrait', 'reunion', 'comparaison'],
      unknowns: { ajout: ['fin', 'change'], retrait: ['fin', 'change'], reunion: ['tout', 'partie'], comparaison: ['ecart'] },
    },
    { kinds: ['ajout', 'retrait', 'reunion', 'comparaison', 'groupes', 'partage'], unknowns: undefined },
  ];
  reg({
    id: 'pb-schema',
    title: 'Quel schéma ?',
    icon: '🧱',
    learn: 'pb-types',
    desc: "Choisis le modèle en barres qui va avec l'histoire.",
    pda: 'C1 — Modéliser la situation; Sens des opérations A.2a, A.3a (représenter par un schéma)',
    gen({ lvl }) {
      const pb = M.pb.make({ ...SCHEMA_KINDS[lvl], lvl });
      return single(pb, M.pb.step.schema(pb, lvl));
    },
  });

  /* ==================================================================
     6. Quelle opération ?
     ================================================================== */
  function whyStep(pb: Pb): StepItem {
    const ref = M.pb.senseRef(pb),
      plus = pb.answer > ref;
    const kw = pb.trap
      ? pb.unknown === 'petit'
        ? "J'ai vu les mots « de plus »."
        : "J'ai vu les mots « de moins »."
      : 'On additionne toujours les deux nombres.';
    return {
      demarche: 2,
      prompt: T('<b>Pourquoi</b> ce calcul ?'),
      format: 'choice',
      cols: 1,
      answer: plus ? 'plus' : 'moins',
      choices: shuffle([
        { label: T(`La réponse doit être plus grande que ${ref}.`), value: 'plus' },
        { label: T(`La réponse doit être plus petite que ${ref}.`), value: 'moins' },
        { label: T(kw), value: 'kw', why: "Un mot ne choisit pas l'opération : c'est l'histoire qui la choisit." },
      ]),
      hint: pb.hint,
      after: "Le dessin de l'histoire choisit l'opération.",
    };
  }
  reg({
    id: 'pb-operation',
    title: 'Quelle opération ?',
    icon: '🔀',
    learn: 'pb-mots',
    desc: 'Choisis le calcul qui répond à la question.',
    pda: "Sens des opérations A.1 (choisir l'opération); C2 — choix des concepts et processus",
    gen({ lvl }) {
      if (lvl < 2) {
        const pb = M.pb.make({ ...SCHEMA_KINDS[lvl], lvl });
        return single(pb, M.pb.step.operation(pb, lvl));
      }
      const pb = M.pb.make({
        kinds: ['comparaison', 'comparaison', 'retrait', 'ajout'],
        unknowns: { comparaison: ['petit', 'grand'], retrait: ['debut'], ajout: ['change', 'debut'] },
        lvl: 1,
        trap: Math.random() < 0.7,
      });
      const q = M.pb.toSteps(pb, ['operation'], { lvl, prompt: "Lis bien l'histoire avant de choisir." });
      q.steps.push(whyStep(pb));
      return q;
    },
  });

  /* ==================================================================
     7. Le début caché (inconnue au début ou au changement)
     ================================================================== */
  reg({
    id: 'pb-inconnue',
    title: 'Le début caché',
    icon: '🕵️',
    learn: 'pb-types',
    desc: 'Quand on ne connaît pas le début ou le changement.',
    pda: 'Sens des opérations A.2a (transformations, terme manquant); Opérations A.5 (équation à trou)',
    gen({ lvl }) {
      const opts: PbMakeOpts =
        lvl === 0
          ? { kinds: ['ajout', 'retrait'], unknowns: { ajout: ['change'], retrait: ['change'] }, lvl: 0 }
          : lvl === 1
            ? { kinds: ['ajout', 'retrait'], unknowns: { ajout: ['debut', 'change'], retrait: ['debut'] }, lvl: 1 }
            : { kinds: ['comparaison'], unknowns: { comparaison: ['petit', 'grand'] }, lvl: 2, noHundreds: true };
      const pb = M.pb.make(opts);
      return M.pb.toSteps(pb, ['schema', 'equation', 'calcul', 'phrase'], { lvl });
    },
  });

  /* ==================================================================
     8. Ma démarche complète
     ================================================================== */
  reg({
    id: 'pb-resoudre',
    title: 'Ma démarche complète',
    icon: '🧭',
    learn: 'pb-demarche',
    desc: 'Lis, comprends, planifie, calcule, vérifie, réponds.',
    pda: 'C1 — toutes les composantes (décoder, modéliser, appliquer, valider, communiquer)',
    gen({ lvl }) {
      if (lvl === 0) {
        const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: 0 });
        return M.pb.toSteps(pb, ['question', 'donnees', 'schema', 'calcul', 'phrase'], { lvl, scoreSteps: ['schema', 'calcul', 'phrase'] });
      }
      if (lvl === 1) {
        const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion', 'comparaison'], lvl: 1 });
        return M.pb.toSteps(pb, ['question', 'schema', 'operation', 'calcul', 'phrase'], {
          lvl,
          scoreSteps: ['schema', 'operation', 'calcul', 'phrase'],
        });
      }
      const pb = M.pb.make({
        kinds: ['ajout', 'retrait', 'reunion', 'comparaison', 'groupes', 'partage'],
        lvl: 2,
        noHundreds: Math.random() < 0.7,
        distract: Math.random() < 0.3 ? 1 : 0,
      });
      const grp = ['grp', 'shr', 'cnt'].includes(pb.fam);
      const recipe: PbRecipeStep[] = grp
        ? ['donnees', 'schema', 'calcul', 'sens', 'phrase']
        : ['donnees', 'schema', 'operation', 'calcul', 'verifier', 'phrase'];
      return M.pb.toSteps(pb, recipe, { lvl, scoreSteps: ['schema', 'operation', 'calcul', 'phrase'] });
    },
  });

  /* ==================================================================
     9. Problèmes à deux étapes
     ================================================================== */
  reg({
    id: 'pb-deux-etapes',
    title: 'Problèmes à deux étapes',
    icon: '🪜',
    learn: 'pb-demarche',
    desc: "D'abord…, ensuite…",
    pda: 'Sens des opérations A.2 b (composition de transformations positive ou négative), c (mixte)',
    gen({ lvl }) {
      const pb = M.pb.make({ kinds: ['deux'], lvl });
      const recipe: PbRecipeStep[] =
        lvl === 0 ? ['donnees', 'plan', 'calcul1', 'calcul2', 'phrase'] : ['donnees', 'plan', 'calcul1', 'calcul2', 'sens', 'phrase'];
      return M.pb.toSteps(pb, recipe, { lvl: Math.min(1, lvl), scoreSteps: ['plan', 'calcul1', 'calcul2', 'phrase'] });
    },
  });

  /* ==================================================================
     10. Ma réponse a-t-elle du sens ?
     ================================================================== */
  function friendStep(pb: Pb): StepItem {
    const F = M.people.pick({ not: [pb.P.n, pb.Q.n] });
    const s = pb.solve;
    const ok = Math.random() < 0.45;
    let w = pb.answer;
    if (!ok) {
      const opp = s.terms ? NaN : s.op === '+' ? Math.abs(s.a - s.b) : s.a + s.b;
      const cands = [opp, pb.answer + 10, pb.answer - 1, pb.answer + 2].filter(
        (x) => x > 0 && x !== pb.answer && !pb.knownVals.includes(x),
      );
      w = cands[0];
    }
    const ref = M.pb.senseRef(pb);
    return {
      demarche: 4,
      prompt: T(`${F.n} dit que la réponse est <b>${w}</b>. Est-ce la bonne réponse ?`),
      format: 'tf',
      answer: w === pb.answer,
      labels: [{ label: '👍 Oui' }, { label: '👎 Non' }],
      hint: `Vérifie à l'envers, ou demande-toi : plus ou moins que ${ref} ?`,
      after: w === pb.answer ? T(`Oui ! ${M.pb.expr(s)} = ${pb.answer}.`) : T(`Non : ${M.pb.expr(s)} = ${pb.answer}, pas ${w}.`),
    };
  }
  reg({
    id: 'pb-sens',
    title: 'Ma réponse a-t-elle du sens ?',
    icon: '✅',
    learn: 'pb-sens',
    desc: 'Estimer, puis vérifier sa réponse.',
    pda: 'Opérations A.1a (approximation du résultat); C1 — valider la solution (formatif)',
    gen({ lvl }) {
      if (lvl === 0) {
        const pb = M.pb.make({ kinds: ['ajout', 'retrait'], lvl: 0 });
        return single(pb, M.pb.step.sens(pb));
      }
      if (lvl === 1) {
        const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion', 'comparaison'], lvl: 1 });
        const q = M.pb.toSteps(pb, ['sens'], { lvl, prompt: 'Réfléchis avant de calculer.' });
        q.steps.push(friendStep(pb));
        return q;
      }
      const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: 2, noHundreds: true });
      const q = M.pb.toSteps(pb, ['calcul', 'verifier'], { lvl, prompt: 'Estime, calcule, puis vérifie.' });
      q.steps.unshift({
        demarche: 2,
        prompt: T('<b>Environ</b> combien ? Touche la droite à peu près où sera la réponse.'),
        format: 'estimate',
        lo: 0,
        hi: 100,
        answer: pb.answer,
        tolerance: 10,
        labelEvery: 10,
        hint: 'Arrondis les nombres à la dizaine la plus proche.',
        after: `La réponse exacte est ${pb.answer}.`,
      });
      return q;
    },
  });

  /* ==================================================================
     11. La phrase-réponse
     ================================================================== */
  reg({
    id: 'pb-phrase',
    title: 'La phrase-réponse',
    icon: '💬',
    learn: 'pb-demarche',
    desc: 'Réponds par une phrase complète.',
    pda: "C1 — Partager l'information relative à la solution; C3 — communiquer",
    gen({ lvl }) {
      const pb = M.pb.make({
        kinds: lvl === 2 ? ['ajout', 'retrait', 'reunion', 'comparaison', 'deux'] : ['ajout', 'retrait', 'reunion', 'comparaison'],
        lvl: Math.min(1, lvl),
      });
      const st = M.pb.step.phrase(pb, lvl);
      st.prompt = T(`Le calcul : <b>${M.pb.expr(pb.solve)} = ${pb.answer}</b>. `) + st.prompt;
      return single(pb, st);
    },
  });

  /* ==================================================================
     12. Invente la question
     ================================================================== */
  reg({
    id: 'pb-inventer',
    title: 'Invente la question',
    icon: '❓',
    learn: 'pb-demarche',
    desc: 'Quelle question peut-on poser avec cette histoire ?',
    pda: 'Sens des opérations A.2 (traduire une équation par une situation, et vice versa); C1 — décoder',
    gen({ lvl }) {
      if (lvl === 1) {
        const pb = M.pb.make({ kinds: ['comparaison'], unknowns: { comparaison: ['ecart'] }, lvl: 1 });
        if (pb.kind !== 'comparaison') throw new Error('comparaison attendue');
        const { grand: g, petit: p } = pb.v;
        const ens = pb.cmpEnsemble(),
          diff = pb.sentences[pb.qIndex].text;
        return attach(
          {
            prompt: T("Associe chaque calcul à la question qu'il résout."),
            format: 'match',
            passage: M.pb.passage(
              pb,
              pb.sentences.filter((s) => s.role !== 'question'),
            ),
            pairs: [
              { left: `<span class="pb-eqc">${g} ${MINUS} ${p}</span>`, right: M.esc(diff), sayRight: diff },
              { left: `<span class="pb-eqc">${g} + ${p}</span>`, right: M.esc(ens), sayRight: ens },
            ],
            hint: '« Ensemble », on réunit. « De plus » ou « de moins », on compare.',
            explain: `Pour réunir, on additionne : ${g} + ${p} = ${g + p}. Pour comparer, on cherche l'écart : ${g} ${MINUS} ${p} = ${g - p}.`,
          },
          pb,
        );
      }
      const pb = lvl === 0 ? M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: 0 }) : M.pb.make({ kinds: ['deux'], lvl: 1 });
      const story = pb.sentences.filter((s) => s.role !== 'question');
      const right = pb.sentences[pb.qIndex].text;
      const silly = pick([T('Combien de chats y a-t-il ?'), T(`De quelle couleur est la tuque de ${pb.P.n} ?`), T('Quel temps fait-il ?')]);
      const choices: Choice[] = [
        { label: M.esc(right), value: 'ok', say: right },
        { label: M.esc(silly), value: 'silly', say: silly, why: "L'histoire ne donne pas cette information." },
      ];
      if (lvl === 2 && pb.kind === 'deux')
        choices.push({ label: M.esc(pb.q1), value: 'q1', say: pb.q1, why: 'Celle-là se résout avec un seul calcul.' });
      return single(
        pb,
        {
          prompt: lvl === 2 ? T('Quelle question demande <b>deux</b> calculs ?') : T('Quelle question peut-on poser avec cette histoire ?'),
          format: 'choice',
          cols: 1,
          answer: 'ok',
          choices: shuffle(choices),
          hint: "On doit pouvoir répondre avec les nombres de l'histoire.",
        },
        { sentences: story, explain: `On peut répondre avec les nombres de l'histoire : ${M.esc(right)} ${explainOf(pb)}` },
      );
    },
  });

  /* ==================================================================
     13. Les données inutiles (défi : 2e cycle)
     ================================================================== */
  reg({
    id: 'pb-inutiles',
    title: 'Les données inutiles',
    icon: '✖️',
    learn: 'pb-demarche',
    enrichment: true,
    desc: 'Barre le nombre qui ne sert pas.',
    pda: 'C1 — données superflues (2e cycle) : enrichissement',
    parentNote: "Les problèmes avec des données inutiles sont attendus au 2e cycle. Ici, c'est un défi.",
    gen({ lvl }) {
      const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: lvl === 0 ? 0 : 1, distract: lvl === 2 ? 2 : 1, near: lvl >= 1 });
      return single(pb, M.pb.step.inutiles(pb));
    },
  });
})();
