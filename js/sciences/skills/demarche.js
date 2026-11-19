/* =====================================================================
   sciences/skills/demarche.js — domaine sc-demarche (habileté 16)
   Étapes : ❓ Je me questionne → 🤔 Je prédis → 👀 J'observe → 📝 Je note → 💬 Je conclus.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  const Q = SC.Q;

  SC.STEPS = [
    { icon: '❓', label: 'Je me questionne', detail: 'Je pose une question sur ce que je vois.' },
    { icon: '🤔', label: 'Je prédis', detail: 'Je dis ce que je pense qui va arriver.' },
    { icon: '👀', label: 'J\'observe', detail: 'Je fais l\'expérience et je regarde bien.' },
    { icon: '📝', label: 'Je note', detail: 'J\'écris ou je dessine ce que j\'ai vu.' },
    { icon: '💬', label: 'Je conclus', detail: 'Je dis ce que j\'ai appris.' },
  ];

  /** Mini-expériences : question, prédiction, observation, conclusion (+ distracteurs de chaque étape). */
  const EXP = [
    { id: 'plantes', titre: 'Deux plantes pareilles : une près de la fenêtre, une dans un placard noir, avec la même eau.', who: 'Léo', svg: () => `<div class="sc-tiles" style="max-width:320px;margin:0 auto">${SC.svg.pot({ eau: 2, lum: 2 })}${SC.svg.pot({ eau: 2, lum: 0 })}</div>`,
      question: 'Est-ce que la lumière aide la plante à pousser ?', qd: ['Les plantes sont vertes.', 'J\'aime les plantes.'],
      pred: 'Je pense que la plante près de la fenêtre va mieux pousser.', pd: ['La plante du placard est pâle et petite.', 'Les deux pots sont pareils.'],
      obs: 'Après 2 semaines, la plante du placard est pâle et petite.', od: ['Je pense que les deux plantes vont pousser pareil.', 'Est-ce que les plantes aiment la musique ?'],
      concl: 'La lumière aide la plante à bien pousser.', cd: ['Les plantes n\'ont pas besoin de lumière.', 'Les placards sont noirs.'],
      pareil: { a: 'La quantité d\'eau et le pot', d: [['L\'endroit où sont les plantes', 'C\'est justement ce qu\'on change : une à la lumière, une dans le noir.'], ['Rien du tout', 'Si on change plusieurs choses, on ne saura pas laquelle a fait la différence.']], q: 'Pour savoir si la <b>lumière</b> aide la plante, que dois-tu garder <b>pareil</b> pour les deux plantes ?' } },
    { id: 'glacons', titre: 'Deux glaçons pareils : un au soleil, un à l\'ombre.', who: 'Zoé', svg: () => '<div style="font-size:2.6rem;text-align:center">☀️🧊 &nbsp; ⛱️🧊</div>',
      question: 'Est-ce que le soleil fait fondre le glaçon plus vite ?', qd: ['Les glaçons sont froids.', 'Le glaçon au soleil a fondu le premier.'],
      pred: 'Je pense que le glaçon au soleil va fondre le premier.', pd: ['Le glaçon au soleil a fondu le premier.', 'Les glaçons sont dans des assiettes.'],
      obs: 'Après 10 minutes, le glaçon au soleil est presque fondu; l\'autre est encore gros.', od: ['Je pense que les deux glaçons vont fondre pareil.', 'Pourquoi la glace est-elle froide ?'],
      concl: 'La chaleur du soleil fait fondre la glace plus vite.', cd: ['L\'ombre fait fondre la glace.', 'Les glaçons ne fondent jamais.'],
      pareil: { a: 'La grosseur des glaçons et les assiettes', d: [['L\'endroit : soleil ou ombre', 'C\'est justement ce qu\'on veut tester : on le change exprès.'], ['Rien du tout', 'Si tout change, on ne saura pas pourquoi un glaçon fond plus vite.']], q: 'Pour savoir si le <b>soleil</b> fait fondre plus vite, que dois-tu garder <b>pareil</b> ?' } },
    { id: 'aimant', titre: 'Un aimant, un trombone et une canette d\'aluminium.', who: 'Amira', svg: () => '<div style="font-size:2.6rem;text-align:center">🧲 📎 🥤</div>',
      question: 'Est-ce que l\'aimant attire tous les objets en métal ?', qd: ['L\'aimant est rouge.', 'Le trombone colle à l\'aimant.'],
      pred: 'Je pense que l\'aimant va attirer le trombone et la canette.', pd: ['L\'aimant attire le trombone, mais pas la canette.', 'L\'aimant est dans ma main.'],
      obs: 'L\'aimant attire le trombone, mais pas la canette.', od: ['Je pense que l\'aimant va tout attirer.', 'Est-ce que l\'aimant est lourd ?'],
      concl: 'L\'aimant n\'attire pas tous les métaux.', cd: ['L\'aimant attire tous les métaux.', 'Les canettes sont vides.'],
      pareil: null },
  ];

  M.registerSkill({
    id: 'sc-demarche', domain: 'sc-demarche', title: 'Comme une scientifique', icon: '🔎', learn: 'sc-l-demarche',
    desc: 'Se questionner, prédire, observer, noter, conclure; reconnaître une prédiction ou une observation; faire un essai juste.',
    pda: 'Stratégies d\'exploration (PDA p. 14) : anticiper ses résultats, explorer, comparer, consigner; compétence du 1er cycle « Explorer le monde de la science et de la technologie »',
    gen({ lvl }) {
      const t = lvl === 0 ? M.pick(['ordre', 'ordre', 'type']) : lvl === 1 ? M.pick(['steps', 'steps', 'type']) : M.pick(['pareil', 'pareil', 'trier', 'steps']);
      if (t === 'ordre') {
        return {
          prompt: 'Comment travaille une scientifique ? Touche les étapes dans l\'ordre.', format: 'order',
          choices: M.shuffle(SC.STEPS.map((s, i) => ({ label: `${s.icon} ${s.label}`, value: 's' + i }))), answer: SC.STEPS.map((s, i) => 's' + i),
          hint: 'Avant de faire l\'expérience, on se pose une question et on prédit.',
          explain: SC.STEPS.map((s) => `${s.icon} <b>${s.label}</b> : ${s.detail.toLowerCase()}`).join('<br>'),
        };
      }
      const x = M.pick(EXP);
      if (t === 'type') {
        const kind = M.pick(['pred', 'obs', 'question']);
        const good = x[kind];
        const others = [x.pred, x.obs, x.question].filter((s) => s !== good);
        const nom = { pred: 'une <b>prédiction</b>', obs: 'une <b>observation</b>', question: 'une <b>question</b>' }[kind];
        return {
          prompt: `${x.titre}<br>Laquelle de ces phrases est ${nom} ?`, format: 'choice', answer: good,
          choices: M.shuffle([good, ...others]).map((s) => ({ label: s, value: s })),
          hint: 'Une prédiction commence souvent par « Je pense que… ». Une observation dit ce qu\'on a vu. Une question finit par « ? ».',
          explain: 'Une <b>prédiction</b> dit ce qu\'on pense qui va arriver (avant l\'expérience). Une <b>observation</b> dit ce qu\'on a vu (après). Une <b>question</b>, c\'est ce qu\'on veut savoir.',
          _sc: { kind: 'type', good },
        };
      }
      if (t === 'trier') {
        const pool = M.shuffle(EXP.slice()).slice(0, 2);
        const items = [];
        pool.forEach((e) => { items.push({ label: e.pred, bin: 'p', key: e.pred }); items.push({ label: e.obs, bin: 'o', key: e.obs }); });
        return {
          prompt: 'Prédiction ou observation ? Classe les phrases.', format: 'sort', items,
          bins: [{ id: 'p', label: '🤔 Prédiction (avant)' }, { id: 'o', label: '👀 Observation (après)' }],
          hint: '« Je pense que… » : c\'est avant l\'expérience. « Après 10 minutes… » : c\'est ce qu\'on a vu.',
          explain: 'On <b>prédit</b> avant l\'expérience (« Je pense que… »), puis on <b>observe</b> ce qui arrive vraiment. Les deux peuvent être différents : c\'est comme ça qu\'on apprend !',
          _sc: 'trier',
        };
      }
      if (t === 'pareil') {
        const e = M.pick(EXP.filter((y) => y.pareil));
        return {
          prompt: `${e.titre}<br>${e.pareil.q}`, format: 'choice', answer: e.pareil.a,
          choices: M.shuffle([{ label: e.pareil.a, value: e.pareil.a }, ...e.pareil.d.map(([l, w]) => ({ label: l, value: l, why: w }))]),
          viz(el) { el.innerHTML = e.svg(); },
          hint: 'Dans un essai juste, on change <b>une seule chose</b> : celle qu\'on veut tester.',
          explain: 'Un <b>essai juste</b> : on change une seule chose (celle qu\'on teste) et on garde tout le reste <b>pareil</b>. Comme ça, on sait ce qui a fait la différence.',
        };
      }
      const ch = (good, bad) => M.shuffle([good, ...bad]).map((s) => ({ label: s, value: s }));
      return {
        prompt: `<b>L'expérience de ${x.who}</b> : ${x.titre}`, format: 'steps',
        steps: [
          { label: '❓ Je me questionne', prompt: 'Quelle est la <b>question</b> de l\'expérience ?', format: 'choice', answer: x.question, choices: ch(x.question, x.qd), viz(el) { el.innerHTML = x.svg(); } },
          { label: '🤔 Je prédis', prompt: `Quelle phrase est la <b>prédiction</b> de ${x.who} ?`, format: 'choice', answer: x.pred, choices: ch(x.pred, x.pd), hint: 'Une prédiction se dit avant l\'expérience : « Je pense que… »' },
          { label: '👀 J\'observe', prompt: 'Quelle phrase est une <b>observation</b> ?', format: 'choice', answer: x.obs, choices: ch(x.obs, x.od), hint: 'Une observation dit ce qu\'on a vraiment vu.' },
          { label: '💬 Je conclus', prompt: 'Quelle est la bonne <b>conclusion</b> ?', format: 'choice', answer: x.concl, choices: ch(x.concl, x.cd), hint: 'La conclusion répond à la question du début.' },
        ],
        explain: `Question : « ${x.question} » → Prédiction : « ${x.pred} » → Observation : « ${x.obs} » → Conclusion : <b>${x.concl}</b>`,
      };
    },
    check(q) {
      if (q._sc && q._sc.kind === 'type') return Q.checkOne(q, (v) => v === q._sc.good);
      if (q._sc === 'trier') return Q.checkSort(q, (k) => (EXP.some((e) => e.pred === k) ? 'p' : EXP.some((e) => e.obs === k) ? 'o' : '?'));
    },
  });
})();
