/* =====================================================================
   Univers social — Moi et les autres (us-moi-autres)
   us-emotions · us-besoins · us-civilite · us-regles · us-conflits
   R2 indices observables (« probablement »), R3 valences opposées, R4 distracteurs étiquetés.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const D = 'us-moi-autres';
  const EMO = () => U.d('emotions');
  const emo = (id) => EMO().find((e) => e.id === id);
  const adj = (e, who) => e.adj[who && who.f ? 1 : 0];
  const PROB =
    'On devine une émotion avec des <b>indices</b> : le visage, les gestes, les paroles. Chaque personne peut ressentir les choses à sa façon.';
  const pickLvl = (list, lvl) => {
    const exact = list.filter((s) => s.lvl === lvl);
    return M.pick(exact.length && Math.random() < 0.75 ? exact : list.filter((s) => s.lvl <= lvl));
  };

  /* ---------------------------------------------------------------- us-emotions */
  function feelQ(s) {
    const w = s.who,
      e = emo(s.answer);
    const bare = e.nom.replace(/^(la |le |l')/, '');
    const items = [
      { label: `${e.emoji} ${adj(e, w)}`, tag: 'ok', emo: e.id },
      ...s.distract.map((id) => ({ label: `${emo(id).emoji} ${adj(emo(id), w)}`, tag: 'opp', emo: id })),
    ];
    const sh = M.shuffle(items).map((c, i) => ({ ...c, value: c.emo }));
    return {
      scene: s.scene,
      passage: { html: s.text },
      prompt: `Comment ${w.n} se sent-${w.f ? 'elle' : 'il'} <b>probablement</b> ?`,
      format: 'choice',
      choices: sh,
      answer: e.id,
      cols: 3,
      hint: 'Cherche les indices : le visage, les gestes, les paroles.',
      explain: `${U.cap(s.cue)} : ce sont des indices ${M.fr.de(bare).replace(bare, `<b>${bare}</b>`)} ${e.emoji}. ${PROB}`,
    };
  }
  function triggerQ(s) {
    const w = s.who,
      e = emo(s.feel);
    const t = U.tagged(s.choices);
    return {
      scene: s.scene,
      passage: { html: s.text },
      prompt: "Qu'est-ce qui s'est <b>probablement</b> passé ?",
      format: 'choice',
      ...t,
      cols: 1,
      hint: `${w.n} semble ${adj(e, w)} ${e.emoji}. Quelle situation peut rendre ${adj(e, w)} ?`,
      explain: `${U.cap(s.cue)}. ${PROB}`,
    };
  }
  M.registerSkill({
    id: 'us-emotions',
    domain: D,
    title: 'Les émotions',
    icon: '😊',
    learn: 'us-vivre-ensemble',
    starter: true,
    desc: "Reconnaître une émotion avec des indices et ce qui l'a déclenchée.",
    pda: 'CCQ — Compétence, Considérer des émotions : reconnaître des émotions, associer des réactions, identifier des déclencheurs',
    parentNote:
      "Les personnages sont fictifs; la consigne dit « probablement » et l'explication rappelle que chacun peut ressentir autre chose.",
    lint(q) {
      // R3 : aucun distracteur de même valence que la réponse
      if (q.format === 'choice' && q.choices.some((c) => c.emo)) {
        const ok = emo(q.answer);
        const bad = q.choices.find((c) => c.emo && c.emo !== q.answer && emo(c.emo).valence === ok.valence);
        if (bad) return `R3 : distracteur voisin (${bad.emo}) pour ${ok.id}`;
      }
      if (q.format === 'choice' && !/probablement/.test(q.prompt)) return 'R2 : la consigne doit dire « probablement »';
    },
    gen({ lvl }) {
      const S = U.d('scenarios').emotion;
      if (lvl === 0 && Math.random() < 0.4) {
        const base = M.shuffle(EMO().filter((e) => e.base)).slice(0, 4);
        return {
          prompt: 'Associe chaque visage au nom de son émotion.',
          format: 'match',
          pairs: base.map((e) => ({ left: `<span style="font-size:2.2rem">${e.emoji}</span>`, right: e.nom, sayRight: e.nom })),
          hint: 'Regarde la bouche et les yeux de chaque visage.',
          explain: base.map((e) => `${e.emoji} ${e.nom}`).join(' · ') + '. On regarde le visage pour trouver des indices.',
        };
      }
      if (lvl === 2 && Math.random() < 0.35) {
        const bins = M.shuffle(EMO().filter((e) => ['joie', 'tristesse', 'colere', 'peur'].includes(e.id))).slice(0, 3);
        const items = bins.flatMap((e) =>
          M.shuffle(e.reactions)
            .slice(0, 2)
            .map((r) => ({ label: U.cap(r), bin: e.id, say: r })),
        );
        return {
          prompt: "Classe chaque réaction avec l'émotion qu'elle montre <b>probablement</b>.",
          format: 'sort',
          bins: bins.map((e) => ({ id: e.id, label: `${e.emoji} ${e.nom}` })),
          items,
          hint: 'Imagine une personne qui fait ce geste. Quel visage a-t-elle ?',
          explain:
            bins.map((e) => `${e.emoji} ${U.cap(e.nom)} : ${e.reactions.slice(0, 2).join(', ')}.`).join(' ') +
            ' Ce sont des indices, pas des certitudes.',
        };
      }
      const s = pickLvl(S, lvl);
      return s.ask === 'trigger' ? triggerQ(s) : feelQ(s);
    },
  });

  /* ---------------------------------------------------------------- us-besoins */
  M.registerSkill({
    id: 'us-besoins',
    domain: D,
    title: 'Mes besoins',
    icon: '🍎',
    learn: 'us-vivre-ensemble',
    starter: true,
    desc: 'Ce dont une personne a besoin pour bien grandir; besoin ou envie ?',
    pda: 'CCQ 1re (révisé) — Besoins individuels : types de besoins, réponses aux besoins · GHEC — besoins des groupes',
    lint(q) {
      if (q.format === 'sort' && q.items.some((it) => /jouer/i.test(it.label) && it.bin === 'envie'))
        return 'jouer est un besoin (droit au jeu)';
    },
    gen({ lvl }) {
      const B = U.d('besoins');
      const bes = B.items.filter((i) => i.kind === 'besoin'),
        env = B.items.filter((i) => i.kind === 'envie');
      if (lvl === 0) {
        if (Math.random() < 0.5) {
          const r = M.pick(B.reponses);
          const t = U.tagged([{ label: r.ok, tag: 'ok' }, ...r.off.map((l) => ({ label: l, tag: 'off' }))]);
          return {
            scene: [{ emoji: r.em, label: r.sit }],
            prompt: `${r.sit} Qu'est-ce qui répond à son besoin ?`,
            format: 'choice',
            ...t,
            cols: 1,
            hint: 'De quoi son corps ou son cœur a-t-il besoin maintenant ?',
            explain: `${r.sit} <b>${r.ok}</b> répond à ce besoin.`,
          };
        }
        const isB = Math.random() < 0.55,
          it = M.pick(isB ? bes : env);
        return {
          scene: [{ emoji: it.emoji, label: it.label }],
          prompt: `Vrai ou faux ? « ${U.cap(it.label)} » est un <b>besoin</b>.`,
          format: 'tf',
          answer: isB,
          hint: "Un besoin, c'est ce qu'il faut pour vivre et bien grandir. Une envie, c'est agréable, mais on peut vivre sans.",
          explain: isB
            ? `${U.cap(it.label)}, c'est un <b>besoin</b> : on en a besoin pour bien grandir.`
            : `${U.cap(it.label)}, c'est une <b>envie</b> : c'est agréable, mais on peut vivre sans.`,
        };
      }
      if (lvl === 1) {
        const items = [...M.shuffle(bes).slice(0, 3), ...M.shuffle(env).slice(0, 3)];
        return {
          prompt: 'Classe : est-ce un <b>besoin</b> ou une <b>envie</b> ?',
          format: 'sort',
          bins: [
            { id: 'besoin', label: '✅ Besoin' },
            { id: 'envie', label: '🎁 Envie' },
          ],
          items: items.map((i) => ({ label: `${i.emoji} ${i.label}`, bin: i.kind, say: i.label })),
          hint: "Peut-on bien grandir sans cela ? Si oui, c'est une envie.",
          explain:
            'Un <b>besoin</b> est nécessaire pour vivre et bien grandir (manger, dormir, être aimé, jouer, apprendre). Une <b>envie</b> fait plaisir, mais on peut vivre sans.',
        };
      }
      const typed = bes.filter((i) => i.type);
      const items = B.types.flatMap((t) => M.shuffle(typed.filter((i) => i.type === t.id)).slice(0, 2));
      return {
        prompt: 'Classe chaque besoin : est-ce un besoin du <b>corps</b>, du <b>cœur</b> ou pour <b>apprendre</b> ?',
        format: 'sort',
        bins: B.types.map((t) => ({ id: t.id, label: t.label })),
        items: items.map((i) => ({ label: `${i.emoji} ${i.label}`, bin: i.type, say: i.label })),
        hint: "Le corps a besoin de nourriture et de repos. Le cœur a besoin d'amour et d'amis. Pour apprendre, il faut l'école et les livres.",
        explain:
          "Nos besoins sont de trois sortes : le <b>corps</b> 🍎 (manger, dormir), le <b>cœur</b> 💛 (être aimé, avoir des amis) et <b>apprendre</b> 📚 (aller à l'école, lire).",
      };
    },
  });

  /* ---------------------------------------------------------------- us-civilite */
  const civQ = (s) => {
    const t = U.tagged(s.choices);
    return {
      scene: s.scene,
      passage: { html: s.text },
      prompt: s.ask,
      format: 'choice',
      ...t,
      cols: 1,
      hint: "Un geste de civilité, c'est un geste poli qui aide à bien vivre ensemble.",
      explain: s.explain,
    };
  };
  const CLOZE = [
    { t: 'Peux-tu me prêter ta gomme, {0} ?', c: ["s'il te plaît", 'tout de suite', 'dépêche'], a: "s'il te plaît" },
    { t: '{0}, est-ce que je peux passer ?', c: ['Excuse-moi', 'Bouge', 'Hé toi'], a: 'Excuse-moi' },
    { t: "Tu m'as aidé à ranger. {0} beaucoup !", c: ['Merci', 'Pousse-toi', 'Dépêche'], a: 'Merci' },
    { t: '{0}, madame Diane ! Bonne journée !', c: ['Bonjour', "Va-t'en", 'Laisse-moi'], a: 'Bonjour' },
    { t: "Je t'ai fait tomber sans faire exprès. {0}, est-ce que ça va ?", c: ['Pardon', 'Tant pis', 'Bravo'], a: 'Pardon' },
  ];
  const EFFETS = [
    ['Dire merci 🙏', "L'autre se sent apprécié."],
    ['Ramasser ses déchets 🗑️', 'Le parc reste propre.'],
    ['Attendre son tour ⏳', 'Chacun a sa chance.'],
    ['Dire bonjour 👋', 'La journée commence bien.'],
    ["S'excuser 🙇", 'La chicane se calme.'],
    ['Chuchoter à la bibliothèque 🤫', 'Les autres lisent tranquilles.'],
    ['Tenir la porte 🚪', 'La personne passe plus facilement.'],
  ];
  M.registerSkill({
    id: 'us-civilite',
    domain: D,
    title: 'Les gestes de civilité',
    icon: '🙏',
    learn: 'us-vivre-ensemble',
    starter: true,
    desc: 'Bonjour, merci, attendre son tour, prendre soin des lieux.',
    pda: "CCQ 2e — Civilité : gestes envers les personnes et l'environnement; effets sur les relations",
    gen({ lvl }) {
      const S = U.d('scenarios').civilite;
      if (lvl === 1 && Math.random() < 0.5) {
        if (Math.random() < 0.5) {
          const c = M.pick(CLOZE);
          return {
            prompt: 'Complète avec la formule de politesse.',
            format: 'cloze',
            text: c.t,
            blanks: [{ choices: M.shuffle(c.c), answer: c.a }],
            hint: 'Quel mot magique rend la phrase polie ?',
            explain: `On dit : « ${c.t.replace('{0}', c.a)} » C'est une formule de <b>politesse</b>.`,
          };
        }
        const pool = M.shuffle(S);
        const aide = pool.slice(0, 3).map((s) => s.choices.find((c) => c.tag === 'ok').label);
        const bl = pool.slice(3, 6).map((s) => s.choices.find((c) => c.tag === 'harm').label);
        return {
          prompt: "Classe chaque geste : est-ce qu'il <b>aide</b> ou est-ce qu'il <b>blesse</b> ?",
          format: 'sort',
          bins: [
            { id: 'aide', label: '💚 Geste qui aide' },
            { id: 'blesse', label: '💔 Geste qui blesse' },
          ],
          items: [...aide.map((l) => ({ label: l, bin: 'aide', say: l })), ...bl.map((l) => ({ label: l, bin: 'blesse', say: l }))],
          hint: 'Imagine la personne qui reçoit le geste : est-elle bien ou blessée ?',
          explain:
            'Un geste qui <b>aide</b> rend la vie ensemble agréable. Un geste qui <b>blesse</b> fait de la peine ou fait mal aux autres ou aux lieux.',
        };
      }
      if (lvl === 2 && Math.random() < 0.5) {
        const pairs = M.shuffle(EFFETS).slice(0, 4);
        return {
          prompt: 'Associe chaque geste de civilité à son <b>effet</b>.',
          format: 'match',
          pairs: pairs.map(([g, e]) => ({ left: g, right: e, sayLeft: g, sayRight: e })),
          hint: 'Que se passe-t-il après ce geste ?',
          explain:
            'Chaque geste de civilité a un <b>effet</b> : sur les personnes (on se sent respecté) ou sur les lieux (ils restent propres).',
        };
      }
      return civQ(pickLvl(S, lvl));
    },
  });

  /* ---------------------------------------------------------------- us-regles */
  M.registerSkill({
    id: 'us-regles',
    domain: D,
    title: 'Règles et responsabilités',
    icon: '📋',
    learn: 'us-vivre-ensemble',
    desc: "À quoi servent les règles; qui fait quoi à l'école.",
    pda: 'CCQ 2e — Rôles et responsabilités; règles de la classe et de la cour · GHEC 2.4 b, A.4 b',
    gen({ lvl }) {
      const S = U.d('scenarios');
      const LIEUX = [
        { id: 'classe', label: '🏫 En classe' },
        { id: 'cour', label: '🛝 Dans la cour' },
        { id: 'autobus', label: "🚌 Dans l'autobus" },
      ];
      if (lvl === 0) {
        const items = LIEUX.flatMap((l) => M.shuffle(S.regles.filter((r) => r.lieu === l.id)).slice(0, 2));
        return {
          prompt: 'Où suit-on chaque règle ? Classe-les.',
          format: 'sort',
          bins: LIEUX,
          items: items.map((r) => ({ label: `${r.em} ${r.r}`, bin: r.lieu, say: r.r })),
          hint: "Imagine l'endroit : y a-t-il des pupitres, une clôture ou des sièges qui roulent ?",
          explain: "Chaque lieu a ses <b>règles</b> : en classe, dans la cour, dans l'autobus. Elles nous aident à vivre ensemble.",
        };
      }
      if (lvl === 1 && Math.random() < 0.4) {
        const rs = M.shuffle(S.roles).slice(0, 4);
        return {
          prompt: "Qui fait quoi à l'école ? Associe chaque personne à son <b>rôle</b>.",
          format: 'match',
          pairs: rs.map((r) => ({ left: r.p, right: r.role, sayLeft: r.p, sayRight: r.role })),
          hint: "Pense à ce que tu vois chaque personne faire à l'école.",
          explain: "À l'école, chaque adulte a un <b>rôle</b> et des responsabilités. Ensemble, ils prennent soin des élèves.",
        };
      }
      if (lvl === 2 && Math.random() < 0.5) {
        const p = M.pick(S.problemes);
        const others = M.shuffle(S.problemes.filter((x) => x !== p)).slice(0, 2);
        const t = U.tagged([{ label: p.ok, tag: 'ok' }, ...others.map((o) => ({ label: o.ok, tag: 'off' }))]);
        return {
          passage: { html: p.p },
          prompt: 'Quelle règle faudrait-il pour régler ce problème ?',
          format: 'choice',
          ...t,
          cols: 1,
          hint: 'Quelle règle parle exactement de ce problème ?',
          explain: `Le problème : ${p.p.charAt(0).toLowerCase() + p.p.slice(1)} La règle « <b>${p.ok}</b> » règle ce problème. Une règle a toujours une <b>raison</b>.`,
        };
      }
      const pool = [...S.regles, ...S.reglesRaison2];
      const n = lvl === 1 ? 3 : 4;
      const chosen =
        lvl === 2
          ? [S.reglesRaison2.find((r) => /casque/.test(r.r)), ...M.shuffle(pool.filter((r) => !/casque/.test(r.r))).slice(0, n - 1)]
          : M.shuffle(pool).slice(0, n);
      return {
        prompt: 'Associe chaque règle à sa <b>raison</b>.',
        format: 'match',
        pairs: chosen.map((r) => ({ left: `${r.r} ${r.em}`, right: r.raison, sayLeft: r.r, sayRight: r.raison })),
        hint: "Demande-toi : qu'arriverait-il si personne ne suivait cette règle ?",
        explain:
          "Une règle a toujours une <b>raison</b> : la sécurité, le respect ou l'organisation. Quand on comprend la raison, c'est plus facile de suivre la règle.",
      };
    },
  });

  /* ---------------------------------------------------------------- us-conflits */
  const ETAPES = [
    { id: 'stop', label: "🛑 Je m'arrête" },
    { id: 'dis', label: '💬 Je dis comment je me sens' },
    { id: 'ecoute', label: "👂 J'écoute l'autre" },
    { id: 'sol', label: '🤝 On trouve une solution' },
    { id: 'aide', label: "🙋 Je demande de l'aide" },
  ];
  const REFLECT = [
    "As-tu déjà vécu une chicane comme celle-là ? Qu'est-ce qui t'a aidé ? Tu peux en parler avec un adulte.",
    "Quand tu es fâché ou fâchée, qu'est-ce qui t'aide à te calmer ? Parles-en avec un adulte, si tu veux.",
  ];
  const AIDE_HARM = ["Cacher l'objet dans son sac.", 'Se venger plus tard.', 'Bouder pour toujours.'];
  M.registerSkill({
    id: 'us-conflits',
    domain: D,
    title: 'Régler un conflit',
    icon: '🤝',
    learn: 'us-vivre-ensemble',
    desc: "Je m'arrête, je dis comment je me sens, j'écoute, on cherche une solution, je demande de l'aide.",
    pda: "CCQ — Appliquer les conditions favorables à l'interaction; Civilité (pacification)",
    parentNote:
      "Certaines séries se terminent par une carte « 💬 Parles-en » : elle n'est pas notée, rien n'est écrit ni enregistré, et l'enfant peut toujours choisir « Je préfère passer ».",
    gen({ lvl }) {
      const S = U.d('scenarios');
      const k = M.pick(S.conflit);
      if (lvl === 0) {
        const w = k.a;
        const t = U.tagged([
          { label: M.pick(S.calme), tag: 'ok' },
          ...M.shuffle(S.blesse)
            .slice(0, 2)
            .map((l) => ({ label: l, tag: 'harm' })),
        ]);
        return {
          passage: { html: k.text },
          scene: [
            { emoji: '😠', label: 'fâché' },
            { emoji: '🌬️', label: 'respirer' },
          ],
          prompt: `${w.n} est très ${w.f ? 'fâchée' : 'fâché'}. Quel geste l'aide à se calmer <b>sans blesser personne</b> ?`,
          format: 'choice',
          ...t,
          cols: 1,
          hint: 'Un geste qui calme ne fait de mal à personne, ni aux choses.',
          explain:
            "Pour se calmer, on peut respirer lentement, compter, boire de l'eau ou s'éloigner un moment. Frapper, lancer ou crier des noms blesse les autres.",
        };
      }
      if (lvl === 2 && Math.random() < 0.5) {
        if (Math.random() < 0.5) {
          return {
            prompt: "Remets dans l'ordre les étapes pour régler un conflit.",
            format: 'order',
            choices: M.shuffle(ETAPES.slice(0, 4)).map((e) => ({ label: e.label, value: e.id })),
            answer: ETAPES.slice(0, 4).map((e) => e.id),
            hint: 'On commence par se calmer. On finit en trouvant une solution ensemble.',
            explain:
              "Pour régler un conflit : 🛑 je m'arrête, 💬 je dis comment je me sens, 👂 j'écoute l'autre, 🤝 on trouve une solution. Si ça ne marche pas, 🙋 je demande l'aide d'un adulte.",
          };
        }
        const m = M.pick(S.messages);
        const t = U.tagged([
          { label: m.ok, tag: 'ok' },
          { label: m.harm, tag: 'harm' },
          { label: m.off, tag: 'off' },
        ]);
        return {
          passage: { html: m.sit },
          prompt: `Que pourrait dire ${m.who.n} pour régler le conflit <b>sans blesser</b> ?`,
          format: 'choice',
          ...t,
          cols: 1,
          hint: 'Un message clair commence par « Je… » et dit comment on se sent.',
          explain: `« ${m.ok.replace(/[«»]/g, '').trim()} » : c'est un <b>message clair</b>. On parle au « je », on dit ce qu'on ressent sans insulter l'autre.`,
        };
      }
      // Niveau 1 (et 2) : scénario complet en étapes
      const pl = k.both ? (k.a.f && k.b.f ? 'elles' : 'ils') : null;
      const feelAdj = k.both ? (pl === 'elles' ? 'fâchées' : 'fâchés') : k.a.f ? 'fâchée' : 'fâché';
      const happy = k.both ? (pl === 'elles' ? 'très contentes' : 'très contents') : k.a.f ? 'très contente' : 'très content';
      const sleepy = k.both ? (pl === 'elles' ? 'endormies' : 'endormis') : k.a.f ? 'endormie' : 'endormi';
      const sol = U.tagged([{ label: k.sol[0], tag: 'ok' }, ...k.sol.slice(1).map((l) => ({ label: l, tag: 'harm' }))]);
      const steps = [
        {
          label: '🔍 Le problème',
          prompt: 'Quel est le problème ?',
          format: 'choice',
          ...U.tagged([
            { label: k.prob[0], tag: 'ok' },
            { label: k.prob[1], tag: 'off' },
          ]),
          cols: 1,
        },
        {
          label: '💛 Les émotions',
          prompt: k.both
            ? `Comment se sentent-${pl} <b>probablement</b> ?`
            : `Comment ${k.a.n} se sent-${k.a.f ? 'elle' : 'il'} <b>probablement</b> ?`,
          format: 'choice',
          ...U.tagged([
            { label: `😠 ${feelAdj}`, tag: 'ok' },
            { label: `😄 ${happy}`, tag: 'opp' },
            { label: `😴 ${sleepy}`, tag: 'off' },
          ]),
          cols: 3,
        },
        {
          label: '🤝 La solution',
          prompt: 'Quelle solution aide <b>sans blesser personne</b> ?',
          format: 'choice',
          ...sol,
          cols: 1,
          after: k.after,
        },
        {
          label: '🙋 Si ça ne marche pas',
          prompt: `Si ça ne marche pas, que peuvent-${k.a.f && k.b.f ? 'elles' : 'ils'} faire ?`,
          format: 'choice',
          ...U.tagged([
            { label: "Demander l'aide d'un adulte.", tag: 'ok' },
            { label: M.pick(AIDE_HARM), tag: 'harm' },
          ]),
          cols: 1,
        },
      ];
      const q = {
        passage: { html: k.text },
        prompt: 'Aide-les à régler leur conflit, une étape à la fois.',
        format: 'steps',
        steps,
        hint: 'Cherche la solution juste pour les deux.',
        explain:
          "Pour régler un conflit : on s'arrête, on dit comment on se sent, on écoute l'autre et on cherche une solution juste pour les deux. Si on n'y arrive pas, on demande l'aide d'un adulte.",
      };
      if (Math.random() < 0.3) {
        q.steps.push({ label: '💬 Parles-en (pas noté)', prompt: M.pick(REFLECT), format: 'reflect' });
        q.scoreSteps = [0, 1, 2, 3];
      }
      return q;
    },
  });
  /* ---------------------------------------------------------------- us-dialogue */
  /* CCQ 1er cycle — Pratique du dialogue : exprimer son point de vue (« Je pense que… parce que… »), poser une question
     pour comprendre, écouter et attendre son tour, être en désaccord sans blesser. Personnages fictifs seulement. */
  const DIA = {
    // Donner son idée poliment, avec une raison
    avis: [
      {
        sit: 'La classe choisit un jeu pour la récré. Léa aimerait jouer au soccer.',
        who: 'Léa',
        f: true,
        ok: "« Je pense qu'on pourrait jouer au soccer, parce qu'on peut tous jouer ensemble. »",
        harm: "« Le soccer, c'est le meilleur. Vos idées sont nulles ! »",
        off: 'Elle ne dit rien et boude dans son coin.',
      },
      {
        sit: 'Le groupe choisit un livre à lire. Noah aime le livre sur les dinosaures.',
        who: 'Noah',
        ok: "« Je pense qu'on devrait lire le livre des dinosaures, parce qu'on va apprendre plein de choses. »",
        harm: '« Si on ne lit pas mon livre, je ne joue plus avec vous ! »',
        off: 'Il cache les autres livres sous son pupitre.',
      },
      {
        sit: "L'équipe doit choisir un nom. Mei a une idée : « les Harfangs ».",
        who: 'Mei',
        f: true,
        ok: "« Je propose les Harfangs, parce que c'est l'oiseau du Québec. »",
        harm: "« On prend mon nom, un point c'est tout ! »",
        off: 'Elle part dessiner toute seule.',
      },
      {
        sit: 'La classe décide où faire le pique-nique. Kevin préfère le parc.',
        who: 'Kevin',
        ok: "« Moi, je pense qu'on devrait aller au parc, parce qu'il y a de l'ombre. »",
        harm: "« Le parc, c'est évident ! Vous êtes vraiment bébés. »",
        off: "Il crie « Parc ! Parc ! Parc ! » sans s'arrêter.",
      },
      {
        sit: 'Le groupe choisit une chanson pour le spectacle. Awa aime une chanson douce.',
        who: 'Awa',
        f: true,
        ok: "« Je pense que la chanson douce serait belle, parce qu'on peut bien entendre les paroles. »",
        harm: '« Vos chansons sont laides. On chante la mienne. »',
        off: 'Elle se bouche les oreilles pendant que les autres parlent.',
      },
      {
        sit: 'Pour la sortie, la classe hésite entre le musée et la ferme. Samuel préfère la ferme.',
        who: 'Samuel',
        ok: "« J'aimerais mieux la ferme, parce que je voudrais voir les animaux. »",
        harm: "« Le musée, c'est pour les nuls ! »",
        off: 'Il fait semblant de dormir.',
      },
    ],
    // Poser une question pour comprendre l'idée de l'autre
    questions: [
      {
        dit: "Zoé dit : « Je n'aime pas jouer à la tag. »",
        ok: "« Pourquoi est-ce que tu n'aimes pas ce jeu ? »",
        harm: '« Pourquoi tu dis toujours des niaiseries ? »',
        off: '« Quelle heure est-il ? »',
      },
      {
        dit: 'Amir dit : « Je pense que les chats sont de meilleurs amis que les chiens. »',
        ok: "« Qu'est-ce qui te fait penser ça ? »",
        harm: '« Ton idée est ridicule, non ? »',
        off: '« As-tu vu mon efface ? »',
      },
      {
        dit: "Inès dit : « Je préfère l'hiver à l'été. »",
        ok: "« Qu'est-ce que tu aimes de l'hiver ? »",
        harm: '« Es-tu bizarre ou quoi ? »',
        off: '« On mange quoi ce midi ? »',
      },
      {
        dit: 'Félix dit : « Je ne veux pas être le premier à présenter. »',
        ok: "« Est-ce que tu peux m'expliquer pourquoi ? »",
        harm: '« As-tu peur, bébé lala ? »',
        off: '« Tu as un beau chandail. »',
      },
      {
        dit: 'Maya dit : « Je trouve que la récré est trop courte. »',
        ok: '« Combien de temps aimerais-tu avoir, et pourquoi ? »',
        harm: '« Pourquoi tu te plains tout le temps ? »',
        off: "« Il fait beau aujourd'hui. »",
      },
      {
        dit: "Gabriel dit : « Je pense qu'on devrait avoir des plantes dans la classe. »",
        ok: "« Qu'est-ce que les plantes apporteraient à la classe ? »",
        harm: "« Qui t'a demandé ton avis ? »",
        off: "« J'ai un chat. »",
      },
    ],
    // Bien écouter et attendre son tour
    ecoute: {
      oui: [
        'Je regarde la personne qui parle.',
        "J'attends que l'autre ait fini de parler.",
        'Je lève la main pour avoir la parole.',
        'Je pose une question sur son idée.',
        'Je redis son idée avec mes mots.',
        'Je fais signe que je comprends.',
      ],
      non: [
        'Je coupe la parole.',
        "Je parle en même temps que l'autre.",
        'Je ris de son idée.',
        "Je joue avec mes crayons pendant que l'autre parle.",
        'Je change de sujet.',
        'Je parle plus fort pour couvrir sa voix.',
      ],
    },
    // Être en désaccord : avec respect ou en blessant
    desaccord: {
      respect: [
        "« Je ne suis pas d'accord, parce que… »",
        '« Je comprends ton idée, mais moi, je pense que… »',
        "« C'est une bonne idée. On pourrait aussi… »",
        "« Peux-tu m'expliquer ? Je ne comprends pas encore. »",
        "« On n'a pas la même idée, et ce n'est pas grave. »",
      ],
      blesse: [
        "« T'es nul ! »",
        '« Ton idée est stupide. »',
        '« Tais-toi ! »',
        'Rouler les yeux et soupirer fort.',
        "Rire de l'autre avec ses amis.",
      ],
    },
    // Désaccord en situation : que peut dire la personne ?
    situations: [
      {
        sit: "Léa dit : « Les vers de terre sont dégoûtants. » Kevin n'est pas d'accord.",
        who: 'Kevin',
        ok: "« Moi, je ne suis pas d'accord, parce qu'ils aident les plantes à pousser. »",
        harm: "« C'est toi qui es dégoûtante ! »",
        off: "« J'ai faim. »",
      },
      {
        sit: "Noah dit : « Le meilleur sport, c'est le hockey. » Zoé pense autrement.",
        who: 'Zoé',
        ok: '« Je comprends que tu aimes le hockey, mais moi, je préfère la natation. »',
        harm: "« Le hockey, c'est pour les perdants ! »",
        off: '« Il pleut dehors. »',
      },
      {
        sit: "Amir dit : « On devrait faire nos devoirs le matin. » Mei n'est pas d'accord.",
        who: 'Mei',
        ok: "« Je ne suis pas d'accord, parce que le matin, je suis encore fatiguée. »",
        harm: "« Arrête de dire n'importe quoi ! »",
        off: '« Mon chandail est bleu. »',
      },
      {
        sit: 'Awa propose de peinturer la murale en vert. Samuel aimerait une autre couleur.',
        who: 'Samuel',
        ok: "« C'est une bonne idée. On pourrait aussi ajouter du jaune pour le soleil. »",
        harm: "« Le vert, c'est laid. Ton idée ne vaut rien. »",
        off: '« Où est mon sac ? »',
      },
      {
        sit: 'Gabriel dit : « Les chiens ne devraient pas aller au parc. » Inès pense autrement.',
        who: 'Inès',
        ok: "« Moi, je pense qu'ils peuvent y aller s'ils sont en laisse. »",
        harm: '« Tu ne comprends jamais rien ! »',
        off: "« J'aime les biscuits. »",
      },
    ],
    // Phrase qui donne une raison (« parce que »)
    raisons: [
      { ok: "J'aime l'hiver parce que je peux glisser.", d: ["J'aime l'hiver.", "L'hiver, il neige."] },
      { ok: 'Je préfère lire, parce que les histoires me font rêver.', d: ['Je préfère lire.', "Lire, c'est une activité."] },
      { ok: "Je pense qu'il faut ranger, parce que la classe sera plus belle.", d: ['Il faut ranger.', 'La classe a des tables.'] },
      { ok: "Je voudrais un chat, parce qu'il est doux et calme.", d: ['Je voudrais un chat.', 'Les chats ont des moustaches.'] },
      { ok: "Je pense qu'on devrait jouer dehors, parce qu'il fait beau.", d: ['On devrait jouer dehors.', 'Dehors, il y a des arbres.'] },
    ],
    // Phrases à compléter : « Je pense que… parce que… »
    cloze: [
      "Je pense {0} on devrait planter des fleurs, {1} c'est joli.",
      'Je pense {0} le chien est fatigué, {1} il a beaucoup couru.',
      'Je pense {0} il faut partager les crayons, {1} tout le monde veut colorier.',
      'Je pense {0} on devrait parler doucement, {1} des amis lisent.',
      'Je pense {0} Kevin est content, {1} il sourit.',
    ],
    faits: [
      { t: "Quand je ne suis pas d'accord, je peux le dire poliment.", v: true },
      { t: 'Pour bien écouter, je coupe la parole.', v: false },
      { t: "On peut être amis même si on n'a pas la même idée.", v: true },
      { t: "Si une personne a une idée différente, on peut rire d'elle.", v: false },
      { t: 'Dans une discussion, chacun parle à son tour.', v: true },
      { t: "Poser une question aide à comprendre l'idée de l'autre.", v: true },
      { t: 'Pour donner mon idée, je dois crier plus fort que les autres.', v: false },
      { t: '« Parce que… » sert à donner une raison.', v: true },
      { t: 'Une seule personne a le droit de donner son idée.', v: false },
    ],
  };
  M.registerSkill({
    id: 'us-dialogue',
    domain: D,
    title: 'Le dialogue',
    icon: '💬',
    learn: 'us-vivre-ensemble',
    desc: "Donner son idée poliment, poser une question pour comprendre, écouter, ne pas être d'accord sans blesser.",
    pda: 'CCQ 1er cycle — Pratique du dialogue : conditions favorables au dialogue (écouter, attendre son tour, respect), exprimer un point de vue avec une raison, poser des questions pour comprendre',
    parentNote:
      "Le dialogue en Culture et citoyenneté québécoise : on apprend à dire « Je pense que… parce que… », à poser une question pour comprendre et à ne pas être d'accord sans blesser. Les situations sont fictives; aucune réponse ne porte sur les opinions de l'enfant.",
    gen({ lvl }) {
      const r = Math.random();
      const tf = () => {
        const f = M.pick(DIA.faits);
        return {
          prompt: `Vrai ou faux ? ${f.t}`,
          format: 'tf',
          answer: f.v,
          hint: 'Dans un bon dialogue, chacun peut parler, écouter et donner son idée sans blesser.',
          explain: `C'est <b>${f.v ? 'vrai' : 'faux'}</b>. Pour bien discuter : on écoute, on parle chacun son tour, on donne son idée avec une raison et on respecte les idées des autres.`,
        };
      };
      const sortQ = (kind, n) => {
        const S = kind === 'ecoute' ? DIA.ecoute : DIA.desaccord;
        const [ka, kb] = kind === 'ecoute' ? ['oui', 'non'] : ['respect', 'blesse'];
        const items = [
          ...M.shuffle(S[ka])
            .slice(0, n)
            .map((l) => ({ label: l, bin: ka, say: l })),
          ...M.shuffle(S[kb])
            .slice(0, n)
            .map((l) => ({ label: l, bin: kb, say: l })),
        ];
        return kind === 'ecoute'
          ? {
              prompt: 'Est-ce une façon de <b>bien écouter</b> ? Classe chaque geste.',
              format: 'sort',
              bins: [
                { id: 'oui', label: "👂 J'écoute bien" },
                { id: 'non', label: "🙉 Je n'écoute pas" },
              ],
              items,
              hint: "Imagine que c'est toi qui parles : qu'est-ce qui te montre que l'autre t'écoute ?",
              explain:
                "Pour <b>bien écouter</b>, on regarde la personne, on attend qu'elle ait fini et on lève la main pour parler. Couper la parole ou rire de l'autre empêche le dialogue.",
            }
          : {
              prompt: "Ne pas être d'accord : est-ce <b>respectueux</b> ou <b>blessant</b> ?",
              format: 'sort',
              bins: [
                { id: 'respect', label: '💚 Respectueux' },
                { id: 'blesse', label: '💔 Blessant' },
              ],
              items,
              hint: 'On peut critiquer une idée sans attaquer la personne.',
              explain:
                "On a le droit de ne pas être d'accord ! On le dit avec <b>respect</b> : « Je ne suis pas d'accord, parce que… ». Les insultes et les moqueries <b>blessent</b> la personne.",
            };
      };
      const avisQ = () => {
        const a = M.pick(DIA.avis);
        const t = U.tagged([
          { label: a.ok, tag: 'ok' },
          { label: a.harm, tag: 'harm' },
          { label: a.off, tag: 'off' },
        ]);
        return {
          passage: { html: a.sit },
          prompt: `Comment ${a.who} peut-${a.f ? 'elle' : 'il'} donner son idée <b>poliment</b> ?`,
          format: 'choice',
          ...t,
          cols: 1,
          hint: 'Une bonne façon de donner son idée : « Je pense que… parce que… ».',
          explain: `${a.ok} C'est poli : on dit son idée <b>et sa raison</b>, sans rabaisser les idées des autres.`,
        };
      };
      const questionQ = () => {
        const q = M.pick(DIA.questions);
        const t = U.tagged([
          { label: q.ok, tag: 'ok' },
          { label: q.harm, tag: 'harm' },
          { label: q.off, tag: 'off' },
        ]);
        return {
          passage: { html: q.dit },
          prompt: 'Quelle question aide à <b>comprendre</b> son idée ?',
          format: 'choice',
          ...t,
          cols: 1,
          hint: 'Une bonne question demande « pourquoi » ou « comment », sans se moquer.',
          explain: `${q.ok} Cette question montre qu'on veut <b>comprendre</b> l'autre. Une question moqueuse blesse, et une question sur autre chose change de sujet.`,
        };
      };
      if (lvl === 0) {
        if (r < 0.4) return tf();
        if (r < 0.75) return sortQ('ecoute', 2);
        return avisQ();
      }
      if (lvl === 1) {
        if (r < 0.25) return avisQ();
        if (r < 0.5) return questionQ();
        if (r < 0.7) {
          const c = M.pick(DIA.cloze);
          return {
            prompt: 'Complète la phrase pour donner ton idée <b>et ta raison</b>.',
            format: 'cloze',
            text: c,
            blanks: [
              { choices: M.shuffle(['que', 'parce que', 'mais']), answer: 'que' },
              { choices: M.shuffle(['parce que', 'que', 'ou']), answer: 'parce que' },
            ],
            hint: "« Je pense que… » donne l'idée. « parce que… » donne la raison.",
            explain: `On dit : « ${c.replace('{0}', 'que').replace('{1}', 'parce que')} » <b>Je pense que</b> annonce l'idée, <b>parce que</b> annonce la raison.`,
          };
        }
        if (r < 0.85) return sortQ('ecoute', 3);
        return sortQ('desaccord', 2);
      }
      if (r < 0.35) {
        const s = M.pick(DIA.situations);
        const t = U.tagged([
          { label: s.ok, tag: 'ok' },
          { label: s.harm, tag: 'harm' },
          { label: s.off, tag: 'off' },
        ]);
        return {
          passage: { html: s.sit },
          prompt: `Que peut dire ${s.who} pour ne pas être d'accord <b>sans blesser</b> ?`,
          format: 'choice',
          ...t,
          cols: 1,
          hint: "On parle de l'idée, pas de la personne. On peut donner une raison.",
          explain: `${s.ok} On a le droit d'avoir une autre idée. On la dit avec <b>respect</b>, sans insulter.`,
        };
      }
      if (r < 0.55) {
        const x = M.pick(DIA.raisons);
        const t = U.tagged([{ label: x.ok, tag: 'ok' }, ...x.d.map((l) => ({ label: l, tag: 'off' }))]);
        return {
          prompt: 'Quelle phrase donne une idée <b>avec une raison</b> ?',
          format: 'choice',
          ...t,
          cols: 1,
          hint: 'Cherche le mot qui annonce une raison : « parce que ».',
          explain: `« ${x.ok} » La raison vient après <b>parce que</b>. Donner une raison aide les autres à comprendre notre idée.`,
        };
      }
      if (r < 0.75) return sortQ('desaccord', 3);
      if (r < 0.9) return questionQ();
      return tf();
    },
  });
})();
