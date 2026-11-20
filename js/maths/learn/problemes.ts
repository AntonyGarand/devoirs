/* =====================================================================
   learn/problemes.js — pages « Apprendre » du domaine Comprendre et résoudre
   pb-demarche · pb-types · pb-mots · pb-sens  (docs/hld/maths-problemes.md § 5)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const D = 'problemes';
  const MINUS = '−';
  const T = (s) => M.pb.typo(s);
  const css = (str) => {
    try {
      M.css(str);
    } catch (e) {
      /* hors navigateur */
    }
  };

  css(`
  .pb-l-box { background: #fbfaf6; border: 3px solid var(--line); border-radius: 18px; padding: 12px; margin: 10px 0 }
  .pb-l-text { font-size: 1.3rem; line-height: 1.9 }
  .pb-l-text .ptok { cursor: default }
  .pb-l-say { font-size: 1.15rem; font-weight: 700; min-height: 1.6em; margin: 8px 0; display: flex; gap: 8px; align-items: center; flex-wrap: wrap }
  .pb-l-stage { min-height: 40px }
  .pb-l-stage .eq { font-size: 2rem; font-weight: 900; text-align: center; margin: 6px 0 }
  .pb-l-reply { font-size: 1.3rem; font-weight: 800; background: var(--Cc); border-radius: 14px; padding: 8px 12px; display: inline-block }
  .pb-l-ctrl { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 8px }
  .pb-l-steppers { display: flex; gap: 10px; flex-wrap: wrap; margin: 8px 0 }
  .pb-l-story { font-size: 1.25rem; font-weight: 700; line-height: 1.6; margin: 6px 0 }
  .pb-l-jet { display: flex; flex-direction: column; gap: 4px; font-size: 1.5rem; line-height: 1.2; margin: 8px 0 }
  .pb-l-jet b { font-size: 1rem; min-width: 4.5em; display: inline-block }
  .pb-l-two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px }
  @media (max-width: 700px) { .pb-l-two { grid-template-columns: 1fr } }
  .pb-l-two > div { background: #fff; border: 3px solid var(--line); border-radius: 18px; padding: 10px }
  .pb-l-two .eq { font-size: 1.8rem; font-weight: 900; text-align: center }
  .pb-l-flip { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; font-size: 1.8rem; font-weight: 900 }
  .pb-l-flip span { background: #fff; border: 3px solid var(--line); border-radius: 14px; padding: 4px 12px }
  .pb-l-chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 }
  .pb-l-chips .chip { cursor: pointer }
  .pb-l-chips .chip.on { background: var(--ink); color: #fff; border-color: var(--ink) }
  `);

  const sec = (el, icon, title, body, intro) => el.insertAdjacentHTML('beforeend', M.ui.section({ icon, title, intro, body }));
  const castor = (html) => M.ui.callout(html);
  const bar = (spec) => `<div class="bm-wrap pb-stepbar">${M.viz.barModelHtml(spec)}</div>`;
  const quizQ = (mk) => () => mk(M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: 0 }));
  const withPassage = (pb, st) => M.pb.attach({ ...st, passage: M.pb.passage(pb), explain: `${pb.explain} ${M.esc(pb.reply)}` }, pb);

  /* ==================================================================
     🧭 Ma démarche — un problème parcouru pas à pas
     ================================================================== */
  M.registerLearn({
    id: 'pb-demarche',
    domain: D,
    title: 'Ma démarche',
    icon: '🧭',
    short: 'Lire, comprendre, planifier, calculer, vérifier, répondre',
    intro:
      'Pour résoudre un problème, on ne se lance pas tout de suite dans le calcul ! On suit toujours les mêmes étapes, comme une recette. Touche « Étape suivante » pour voir comment on fait.',
    render(el) {
      sec(
        el,
        '🧭',
        'Les 6 étapes',
        `<div class="pb-l-dem"></div>
        <div class="pb-l-box"><div class="q-passage-head"><b class="pb-l-title"></b><span class="pb-l-read"></span></div><div class="pb-l-text"></div></div>
        <div class="pb-l-say"></div><div class="pb-l-stage"></div>
        <div class="pb-l-ctrl"><button class="btn primary big pb-l-next">Étape suivante ➜</button><button class="btn pb-l-again">↺ Recommencer</button><button class="btn pb-l-new">🔄 Un autre problème</button></div>`,
      );
      const $ = (s) => M.$(s, el);
      let pb, k;
      // étapes : [indice de la démarche, texte, action]
      const STAGES = [
        [0, () => "Je lis le problème <b>deux fois</b>. Je peux l'écouter avec 🔊.", () => ''],
        [
          1,
          () => 'Je trouve la <b>question</b> : la phrase qui finit par « ? ». Je la colorie en bleu.',
          () => {
            mark('q');
            return '';
          },
        ],
        [
          1,
          () => `J'encercle les <b>données</b> : les nombres utiles (${pb.knownVals.join(' et ')}).`,
          () => {
            mark('d');
            return '';
          },
        ],
        [
          2,
          () =>
            `Je fais un <b>dessin</b> : un modèle en barres. ${{ sum: 'On cherche le tout.', part: 'On cherche une partie.' }[pb.fam] || ''}`,
          () => bar(pb.barSpec(false)),
        ],
        [
          3,
          () => `Je <b>calcule</b> : ${M.pb.expr(pb.solve)}.`,
          () => bar(pb.barSpec(true)) + `<div class="eq">${M.pb.expr(pb.solve)} = ${pb.answer}</div>`,
        ],
        [
          4,
          () =>
            T(
              `Je <b>vérifie</b> : est-ce que ça a du sens ? ${pb.solve.op === '+' ? `${pb.answer} ${MINUS} ${pb.solve.b} = ${pb.solve.a}` : `${pb.answer} + ${pb.solve.b} = ${pb.solve.a}`} : on retrouve le nombre du départ !`,
            ),
          () =>
            `<div class="eq">${pb.solve.op === '+' ? `${pb.answer} ${MINUS} ${pb.solve.b}` : `${pb.answer} + ${pb.solve.b}`} = ${pb.solve.a} ✔️</div>`,
        ],
        [5, () => 'Je <b>réponds</b> avec une phrase complète.', () => `<div class="pb-l-reply">💬 ${M.esc(pb.reply)}</div>`],
      ];
      const mark = (m) =>
        M.$$('.ptok', $('.pb-l-text')).forEach((t, i) => {
          const d = pb.tokens[i];
          if ((m === 'q' && d.q) || (m === 'd' && d.data)) t.classList.add('mk-' + m);
        });
      const draw = () => {
        const [di, say, act] = STAGES[k];
        $('.pb-l-dem').innerHTML = M.ui.demarche(M.ui.DEMARCHE, di);
        const txt = say();
        $('.pb-l-say').innerHTML = `${M.ui.DEMARCHE[di].icon} <span>${txt}</span> ${M.ui.speak(M.text(txt))}`;
        const html = act();
        if (html) $('.pb-l-stage').innerHTML = html;
        $('.pb-l-next').disabled = k === STAGES.length - 1;
      };
      const start = (fresh) => {
        if (fresh || !pb) pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: 0 });
        k = 0;
        $('.pb-l-title').textContent = `${pb.emoji} Le problème`;
        $('.pb-l-read').innerHTML = M.ui.speak(pb.text);
        $('.pb-l-text').innerHTML = pb.tokens.map((t, i) => `<span class="ptok" data-i="${i}">${M.esc(t.w)}</span>`).join(' ');
        $('.pb-l-stage').innerHTML = '';
        draw();
      };
      $('.pb-l-next').onclick = () => {
        if (k < STAGES.length - 1) {
          k++;
          M.sfx.tap();
          draw();
        }
      };
      $('.pb-l-again').onclick = () => start(false);
      $('.pb-l-new').onclick = () => start(true);
      start(true);

      sec(
        el,
        '👀',
        'Lire un problème trois fois',
        `<ol class="pb-l-story">
          <li>📖 Je lis l'<b>histoire</b> : qui ? que se passe-t-il ?</li>
          <li>🔢 Je relis pour les <b>nombres</b> : que compte chaque nombre ?</li>
          <li>❓ Je relis la <b>question</b> : qu'est-ce qu'on cherche ?</li></ol>
        ${M.ui.callout("<b>Pour les parents :</b> faites raconter l'histoire <i>sans les nombres</i>, puis demandez « Que compte ce nombre ? » et « Qu'est-ce qu'on cherche ? ». Faites dire la phrase-réponse à voix haute.", { tone: 'info', who: '👪' })}`,
      );
      el.insertAdjacentHTML('beforeend', '<section class="l-sec"><div class="pb-l-quiz"></div></section>');
      M.ui.miniQuiz(M.$('.pb-l-quiz', el), [
        quizQ((pb) => withPassage(pb, M.pb.step.question(pb))),
        quizQ((pb) => withPassage(pb, M.pb.step.donnees(pb))),
      ]);
    },
  });

  /* ==================================================================
     🧱 Les types de problèmes (schémas)
     ================================================================== */
  const jetRows = (rows) =>
    `<div class="pb-l-jet">${rows.map(([nm, html]) => `<div>${nm ? `<b>${M.esc(nm)}</b>` : ''}${html}</div>`).join('')}</div>`;
  const rep = (e, n) => e.repeat(Math.max(0, n));
  function typeTab(panel, cfg) {
    // cfg: { steppers:[{label,value,min,max}], fix?(vals) → vals, modes?:[{id,label}], render(vals, mode, reveal) → {story, spec, jet, castor, answer} }
    let vals = cfg.steppers.map((s) => s.value),
      mode = cfg.modes ? cfg.modes[0].id : null,
      reveal = false;
    panel.innerHTML = `${cfg.modes ? `<div class="pb-l-chips">${cfg.modes.map((m, i) => `<button class="chip ${i ? '' : 'on'}" data-m="${m.id}">${m.label}</button>`).join('')}</div>` : ''}
      <div class="pb-l-story"></div><div class="pb-l-steppers"></div><div class="pb-l-bars"></div><div class="pb-l-jets"></div>
      <div class="pb-l-ctrl"><button class="btn yellow pb-l-show">👀 Montre la réponse</button></div><div class="pb-l-castor"></div>`;
    const steppers = cfg.steppers.map((s, i) => {
      const host = document.createElement('span');
      M.$('.pb-l-steppers', panel).appendChild(host);
      return M.ui.stepper(host, {
        label: s.label,
        value: s.value,
        min: s.min,
        max: s.max,
        onChange: (v) => {
          vals[i] = v;
          reveal = false;
          draw();
        },
      });
    });
    const draw = () => {
      if (cfg.fix) {
        const f = cfg.fix(vals.slice(), mode);
        f.forEach((v, i) => {
          if (v !== vals[i]) {
            vals[i] = v;
            steppers[i].set(v, true);
          }
        });
      }
      const r = cfg.render(vals, mode, reveal);
      M.$('.pb-l-story', panel).innerHTML = `${r.story} ${M.ui.speak(M.text(r.story))}`;
      M.$('.pb-l-bars', panel).innerHTML = bar(r.spec);
      M.$('.pb-l-jets', panel).innerHTML = r.jet;
      M.$('.pb-l-castor', panel).innerHTML = castor(r.castor);
    };
    M.$('.pb-l-show', panel).onclick = () => {
      reveal = true;
      M.sfx.pop();
      draw();
    };
    if (cfg.modes)
      M.$('.pb-l-chips', panel).onclick = (e) => {
        const b = e.target.closest('.chip');
        if (!b) return;
        mode = b.dataset.m;
        reveal = false;
        M.$$('.chip', panel).forEach((c) => c.classList.toggle('on', c === b));
        draw();
      };
    draw();
  }
  M.registerLearn({
    id: 'pb-types',
    domain: D,
    title: 'Les types de problèmes',
    icon: '🧱',
    short: 'Ajouter, enlever, réunir, comparer, groupes égaux',
    intro:
      "Presque tous les problèmes racontent une de ces histoires. Quand on reconnaît l'histoire, on sait quel dessin faire. Change les nombres et regarde le modèle en barres s'ajuster !",
    render(el) {
      el.insertAdjacentHTML('beforeend', '<section class="l-sec"><div class="pb-l-tabs"></div></section>');
      const P = M.people.pick(),
        Q = M.people.pick({ not: [P.n] });
      M.ui.tabs(M.$('.pb-l-tabs', el), [
        {
          id: 'chg',
          label: '➕➖ Ajouter / enlever',
          render: (p) =>
            typeTab(p, {
              modes: [
                { id: 'ajout', label: '➕ On en ajoute' },
                { id: 'retrait', label: '➖ On en enlève' },
              ],
              steppers: [
                { label: 'Au début', value: 6, min: 2, max: 12 },
                { label: 'Changement', value: 3, min: 1, max: 8 },
              ],
              fix: (v, mode) => (mode === 'retrait' && v[1] >= v[0] ? [v[0], v[0] - 1] : v),
              render([a, b], mode, rv) {
                if (mode === 'ajout')
                  return {
                    story: T(`${P.n} a ${a} billes. ${P.Il} en gagne ${b}. Combien de billes a-t-${P.il} maintenant ?`),
                    spec: M.pb.bars.tout({ x: a, y: b, t: a + b, unk: 't' }, rv),
                    jet: jetRows([
                      ['Début', rep('🔴', a)],
                      ['Gagnées', rep('🔵', b)],
                    ]),
                    castor: `On en <b>ajoute</b> : la fin est le tout. ${a} + ${b} = ${rv ? a + b : '?'}`,
                  };
                return {
                  story: T(`${P.n} a ${a} billes. ${P.Il} en perd ${b}. Combien de billes lui reste-t-il ?`),
                  spec: M.pb.bars.tout({ x: a - b, y: b, t: a, toneY: 'X', unk: 'x' }, rv),
                  jet: jetRows([['Début', rep('🔴', a - b) + rep('❌', b)]]),
                  castor: `On en <b>enlève</b> : le début est le tout, on barre ce qui part. ${a} ${MINUS} ${b} = ${rv ? a - b : '?'}`,
                };
              },
            }),
        },
        {
          id: 'reu',
          label: '🤝 Réunir',
          render: (p) =>
            typeTab(p, {
              modes: [
                { id: 'tout', label: 'On cherche le tout' },
                { id: 'partie', label: 'On cherche une partie' },
              ],
              steppers: [
                { label: 'Rouges', value: 5, min: 1, max: 10 },
                { label: 'Bleues', value: 4, min: 1, max: 10 },
              ],
              render([a, b], mode, rv) {
                if (mode === 'tout')
                  return {
                    story: T(`Il y a ${a} mitaines rouges et ${b} mitaines bleues. Combien de mitaines y a-t-il en tout ?`),
                    spec: M.pb.bars.tout({ x: a, y: b, t: a + b, unk: 't' }, rv),
                    jet: jetRows([
                      ['Rouges', rep('🟥', a)],
                      ['Bleues', rep('🟦', b)],
                    ]),
                    castor: `Quand on cherche le <b>tout</b>, on additionne les parties : ${a} + ${b} = ${rv ? a + b : '?'}`,
                  };
                return {
                  story: T(`Il y a ${a + b} mitaines. ${a} sont rouges. Les autres sont bleues. Combien de mitaines sont bleues ?`),
                  spec: M.pb.bars.tout({ x: a, y: b, t: a + b, unk: 'y' }, rv),
                  jet: jetRows([['Toutes', rep('🟥', a) + rep('⬜', b)]]),
                  castor: `Quand on cherche une <b>partie</b>, on enlève l'autre partie du tout : ${a + b} ${MINUS} ${a} = ${rv ? b : '?'}`,
                };
              },
            }),
        },
        {
          id: 'cmp',
          label: '⚖️ Comparer',
          render: (p) =>
            typeTab(p, {
              steppers: [
                { label: P.n, value: 9, min: 2, max: 14 },
                { label: Q.n, value: 5, min: 1, max: 13 },
              ],
              fix: (v) => (v[1] >= v[0] ? [v[0], v[0] - 1] : v),
              render([a, b], mode, rv) {
                return {
                  story: T(`${P.n} a ${a} cartes. ${Q.n} a ${b} cartes. Combien de cartes ${P.n} a-t-${P.il} de plus que ${Q.n} ?`),
                  spec: M.pb.bars.cmp({ G: P.n, S: Q.n, g: a, p: b, e: a - b, unk: 'ecart' }, rv),
                  jet: jetRows([
                    [P.n, rep('🃏', a)],
                    [Q.n, rep('🃏', b) + rep('⬜', a - b)],
                  ]),
                  castor: `On place les cartes <b>face à face</b>. Celles qui n'ont pas de partenaire, c'est l'écart : ${a} ${MINUS} ${b} = ${rv ? a - b : '?'}. On peut aussi penser ${b} + ? = ${a}.`,
                };
              },
            }),
        },
        {
          id: 'grp',
          label: '🧺 Groupes égaux',
          render: (p) =>
            typeTab(p, {
              modes: [
                { id: 'groupes', label: 'Groupes égaux' },
                { id: 'partage', label: 'Partage' },
              ],
              steppers: [
                { label: 'Assiettes', value: 3, min: 2, max: 5 },
                { label: 'Par assiette', value: 4, min: 2, max: 6 },
              ],
              render([n, k], mode, rv) {
                const t = n * k,
                  terms = Array(n).fill(k).join(' + ');
                if (mode === 'groupes')
                  return {
                    story: T(`Il y a ${n} assiettes. Sur chaque assiette, il y a ${k} biscuits. Combien de biscuits y a-t-il en tout ?`),
                    spec: M.pb.bars.grp({ nb: n, k, t, unk: 'total' }, rv),
                    jet: `<div class="pb-plates">${Array(n)
                      .fill(`<span class="pb-plate">${rep('🍪', k)}</span>`)
                      .join('')}</div>`,
                    castor: `Des <b>groupes égaux</b> : on additionne le même nombre plusieurs fois. ${terms} = ${rv ? t : '?'}`,
                  };
                return {
                  story: T(`${P.n} partage ${t} biscuits également entre ${n} amis. Combien de biscuits chaque ami reçoit-il ?`),
                  spec: M.pb.bars.grp({ nb: n, k, t, unk: 'parPart' }, rv),
                  jet: `<div class="pb-plates">${Array(n)
                    .fill(`<span class="pb-plate">${rv ? rep('🍪', k) : '❓'}</span>`)
                    .join('')}</div>`,
                  castor: `On <b>partage</b> : on distribue un à la fois jusqu'à ce qu'il n'en reste plus. Chacun en reçoit ${rv ? k : '?'}.`,
                };
              },
            }),
        },
      ]);
      el.insertAdjacentHTML(
        'beforeend',
        `<section class="l-sec">${castor('Reconnais l\'<b>histoire</b>, fais le <b>dessin</b>, et le dessin te dit quoi calculer. Pour les trucs de calcul, va voir <a href="#/apprendre/sens-operations">Le sens des opérations</a>.')}</section>`,
      );
    },
  });

  /* ==================================================================
     🗝️ Les mots-clés… et leurs pièges
     ================================================================== */
  M.registerLearn({
    id: 'pb-mots',
    domain: D,
    title: 'Les mots-clés… et leurs pièges',
    icon: '🗝️',
    short: 'En tout, il reste, de plus, de moins, autant que, chacun',
    intro:
      "Certains mots reviennent souvent dans les problèmes. Il faut comprendre ce qu'ils veulent dire… mais attention : un mot ne choisit pas l'opération à ta place !",
    render(el) {
      sec(
        el,
        '🗝️',
        'Les mots des problèmes',
        M.ui.vocab([
          {
            emoji: '🔴🔵',
            word: 'en tout',
            note: 'tout ensemble',
            say: 'En tout : on met tout ensemble. 3 billes rouges et 2 bleues, ça fait 5 billes en tout.',
          },
          {
            emoji: '🍪❌',
            word: 'il reste',
            note: 'ce qui est encore là',
            say: "Il reste : ce qui est encore là après. J'avais 5 biscuits, j'en mange 2, il en reste 3.",
          },
          {
            emoji: '⬆️',
            word: 'de plus que',
            note: 'Léa en a 2 de plus que Tom',
            say: 'De plus que : Léa a 2 billes de plus que Tom. Elle a toutes les billes de Tom, et encore 2.',
          },
          {
            emoji: '⬇️',
            word: 'de moins que',
            note: 'Tom en a 2 de moins que Léa',
            say: 'De moins que : Tom a 2 billes de moins que Léa. Il lui en manque 2 pour en avoir autant.',
          },
          { emoji: '🟰', word: 'autant que', note: 'le même nombre', say: 'Autant que : le même nombre. Chaque bille a une partenaire.' },
          { emoji: '🍽️', word: 'chacun', note: 'chaque ami reçoit pareil', say: 'Chacun : chaque ami reçoit le même nombre.' },
          { emoji: '🤝', word: 'ensemble', note: 'on réunit', say: 'Ensemble : on réunit les deux groupes.' },
        ]) + '<p class="muted">Touche un mot pour entendre une phrase.</p>',
      );
      const A = M.people.pick(),
        B = M.people.pick({ not: [A.n] });
      const g = 8,
        e = 3;
      sec(
        el,
        '⚠️',
        'Attention, piège !',
        `<p>Les deux histoires disent « <b>de plus</b> »… mais on ne fait pas le même calcul !</p>
        <div class="pb-l-two">
          <div><p class="pb-l-story">${T(`${A.n} a ${g} billes. ${B.n} en a ${e} <b>de plus que</b> ${A.n}. Combien de billes ${B.n} a-t-${B.il} ?`)}</p>${bar(M.pb.bars.cmp({ G: B.n, S: A.n, g: g + e, p: g, e, unk: 'grand' }, true))}<div class="eq">${g} + ${e} = ${g + e}</div><p>${B.n} en a <b>plus</b> : on ajoute.</p></div>
          <div><p class="pb-l-story">${T(`${A.n} a ${g} billes. ${A.Il} en a ${e} <b>de plus que</b> ${B.n}. Combien de billes ${B.n} a-t-${B.il} ?`)}</p>${bar(M.pb.bars.cmp({ G: A.n, S: B.n, g, p: g - e, e, unk: 'petit' }, true))}<div class="eq">${g} ${MINUS} ${e} = ${g - e}</div><p>${B.n} en a <b>moins</b> : on enlève.</p></div>
        </div>
        ${castor("Un mot ne choisit pas l'opération. <b>Le dessin</b> la choisit ! Demande-toi toujours : qui en a le plus ?")}`,
      );
      el.insertAdjacentHTML('beforeend', '<section class="l-sec"><div class="pb-l-quiz"></div></section>');
      const tf = (mk) => () => {
        const P = M.people.pick(),
          Q = M.people.pick({ not: [P.n] });
        return mk(P, Q);
      };
      M.ui.miniQuiz(M.$('.pb-l-quiz', el), [
        tf((P) => {
          const a = M.rnd(3, 6),
            b = M.rnd(2, 4);
          return {
            prompt: T(`${P.n} a ${a} billes rouges et ${b} billes bleues. « En tout », ${P.il} a ${a + b} billes.`),
            format: 'tf',
            answer: true,
            explain: `En tout : ${a} + ${b} = ${a + b}.`,
          };
        }),
        tf((P, Q) => {
          const a = M.rnd(9, 14),
            b = M.rnd(2, 5);
          return {
            prompt: T(`${P.n} a ${a} cartes. ${P.Il} a ${b} cartes de plus que ${Q.n}. Donc ${Q.n} a ${a + b} cartes.`),
            format: 'tf',
            answer: false,
            explain: `${Q.n} en a <b>moins</b> que ${P.n} : ${a} ${MINUS} ${b} = ${a - b}.`,
          };
        }),
        tf((P, Q) => {
          const a = M.rnd(3, 7);
          return {
            prompt: T(`${P.n} a ${a} billes. ${Q.n} en a autant que ${P.n}. Donc ${Q.n} a ${a} billes.`),
            format: 'tf',
            answer: true,
            explain: "« Autant que », c'est le même nombre.",
          };
        }),
      ]);
    },
  });

  /* ==================================================================
     ✅ Est-ce que ma réponse a du sens ?
     ================================================================== */
  M.registerLearn({
    id: 'pb-sens',
    domain: D,
    title: 'Est-ce que ma réponse a du sens ?',
    icon: '✅',
    short: "Plus ou moins qu'au début ? Possible ? À l'envers !",
    intro: "Quand tu as une réponse, ne t'arrête pas tout de suite ! Pose-toi trois petites questions pour vérifier.",
    render(el) {
      const P = M.people.pick();
      sec(
        el,
        '1️⃣',
        "Plus ou moins qu'au début ?",
        `<p class="pb-l-story">${T(`${P.n} a 7 billes. ${P.Il} en gagne 5. À la fin, ${P.il} en a <b>plus</b> que 7 !`)}</p><div class="pb-l-nl"></div><div class="pb-l-ctrl"><button class="btn yellow pb-l-hop">👀 Montre-moi</button></div>
        ${castor("Si on en ajoute, la réponse est <b>plus grande</b> qu'au début. Si on en enlève, elle est <b>plus petite</b>.")}`,
      );
      const nl = M.viz.numberLine(M.$('.pb-l-nl', el), { lo: 0, hi: 20, start: 7, end: 12, interactive: false });
      M.$('.pb-l-hop', el).onclick = () => nl.showMe(12, 1);
      sec(
        el,
        '2️⃣',
        'Est-ce possible ?',
        `<p class="pb-l-story">${T("Félix attrape 4 poissons, puis 3 autres. Il dit qu'il en a 25.")}</p>
        ${castor("25 ? C'est beaucoup trop ! Avec 4 et 3, on ne peut pas dépasser 10. Une réponse doit être <b>raisonnable</b>.")}`,
      );
      sec(
        el,
        '3️⃣',
        "Je refais à l'envers",
        `<div class="pb-l-flip"><span>7 + 5 = 12</span>🔁<span>12 ${MINUS} 5 = 7</span></div>
        ${castor("L'addition et la soustraction sont des amies : l'une défait ce que l'autre fait. Si on retrouve le nombre du départ, la réponse est bonne !")}`,
      );
      el.insertAdjacentHTML(
        'beforeend',
        `<section class="l-sec"><h2>🤖 Le robot calculateur se trompe-t-il ?</h2><p>Le robot a répondu à des problèmes. Dis s'il a raison.</p><div class="pb-l-quiz"></div></section>`,
      );
      const robot = () => {
        const pb = M.pb.make({ kinds: ['ajout', 'retrait', 'reunion'], lvl: M.pick([0, 1]), noHundreds: true });
        const ok = Math.random() < 0.5;
        const s = pb.solve;
        const w = ok ? pb.answer : s.op === '+' ? Math.abs(s.a - s.b) : s.a + s.b;
        const good = ok || w === pb.answer;
        return M.pb.attach(
          {
            prompt: T(`🤖 Le robot dit : « La réponse est <b>${w}</b>. » A-t-il raison ?`),
            passage: M.pb.passage(pb),
            format: 'tf',
            answer: good,
            hint: "Plus ou moins qu'au début ?",
            explain: `${M.pb.expr(s)} = ${pb.answer}. ${good ? 'Le robot a raison !' : `Le robot a fait ${s.op === '+' ? 'une soustraction' : 'une addition'} : ça n'a pas de sens.`}`,
          },
          pb,
        );
      };
      M.ui.miniQuiz(M.$('.pb-l-quiz', el), [robot, robot, robot, robot], { title: 'Le robot a-t-il raison ?' });
    },
  });
})();
