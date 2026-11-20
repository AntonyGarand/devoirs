/* =====================================================================
   skills/lecture.js — Je lis et je comprends (fr-lecture)
     fr-lire-mots, fr-lire-phrases, fr-comprendre-texte, fr-ordre-histoire
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const D = 'fr-lecture';

  /* ---------------- 👀 Je lis des mots ---------------- */
  const OUTILS = [
    'dans',
    'sans',
    'avec',
    'mais',
    'donc',
    'pour',
    'sous',
    'sur',
    'chez',
    'très',
    'trop',
    'puis',
    'aussi',
    'alors',
    'avant',
    'après',
    'encore',
    'jamais',
    'toujours',
    'souvent',
    'parfois',
    'quand',
    'comme',
    'moi',
    'toi',
    'nous',
    'vous',
    'qui',
    'que',
    'par',
    'loin',
    'vite',
    'ici',
    'oui',
    'non',
    'mon',
    'ton',
    'son',
    'les',
    'des',
    'une',
    'deux',
    'trois',
    'beaucoup',
    'pendant',
    'depuis',
    'devant',
    'vers',
    'peu',
    'plus',
    'moins',
  ];
  const sim = (a: string, b: string) => {
    let s = 0;
    if (a[0] === b[0]) s += 2;
    if (a.slice(-2) === b.slice(-2)) s += 2;
    if (Math.abs(a.length - b.length) <= 1) s += 1;
    return s;
  };
  M.registerSkill({
    id: 'fr-lire-mots',
    domain: D,
    title: 'Je lis des mots',
    icon: '👀',
    starter: true,
    learn: 'fr-lire-detective',
    desc: 'Lis le mot et touche la bonne image.',
    pda: 'Lire C.1 a.ii (mots fréquents), b.iv (décodage) — → 1re, ★ 2e',
    gen({ lvl }) {
      if (lvl === 0 && Math.random() < 0.35) {
        const w = M.pick(OUTILS);
        const others = M.shuffle(OUTILS.filter((x) => x !== w && !FR.homophonesOf(w).includes(x)))
          .sort((a, b) => sim(w, b) - sim(w, a))
          .slice(0, 2);
        return {
          prompt: 'Écoute. Touche le mot que tu entends.',
          audio: { text: w, autoplay: 'once' },
          format: 'choice',
          answer: w,
          choices: FR.choices([w, ...others]).map((c) => ({ ...c, label: `<span style="font-size:1.6rem">${c.label}</span>` })),
          hint: 'Regarde la première lettre et la dernière lettre.',
          explain: `Le mot était <b>${w}</b>. Les petits mots comme celui-là, on les reconnaît vite à force de les lire !`,
        };
      }
      const pool = FR.mots((m) => m.em && m.cls === 'nom' && !/[\s-]/.test(m.w) && (lvl === 0 ? m.w.length <= 5 : true));
      const m = M.pick(pool);
      let others = pool.filter((x) => x.w !== m.w && x.em !== m.em);
      if (lvl === 2) others = M.shuffle(others).sort((a, b) => sim(m.w, b.w) - sim(m.w, a.w));
      else others = M.shuffle(others);
      const opts = [m, ...others.slice(0, lvl === 0 ? 2 : 3)];
      return {
        prompt: `Lis le mot. Touche la bonne image. <div class="fr-big">${m.w}</div>`,
        say: 'Lis le mot, puis touche la bonne image.',
        format: 'choice',
        answer: m.w,
        cols: opts.length === 4 ? 2 : 3,
        choices: M.shuffle(opts).map((x) => ({
          label: `<span style="font-size:2.8rem">${x.em}</span>`,
          value: x.w,
          why: lvl === 2 ? `Ça, c'est <b>${x.w}</b>. Regarde bien chaque lettre.` : undefined,
        })),
        hint: 'Découpe le mot en syllabes, puis dis-le.',
        explain: m.syl ? `<b>${m.syl.join('-')}</b> → ${m.w} ${m.em}` : `<b>${m.w}</b> ${m.em}`,
      };
    },
  });

  /* ---------------- 🖼️ Je lis une phrase ---------------- */
  const S = () => FR.SCENES;
  const relPhrase = (suj: FrSceneSujet, rel: FrSceneRelation, obj: FrSceneObjet) => {
    if (rel.id === 'cote') {
      const de = obj.le.startsWith('le ') ? 'du ' + obj.le.slice(3) : 'de ' + obj.le;
      return `${suj.le} est à côté ${de}.`;
    }
    return `${suj.le} est ${rel.mot} ${obj.le}.`;
  };
  const NONSENS = [
    'La pomme mange le garçon.',
    'Le fromage mange la souris.',
    'La carotte croque le lapin.',
    'Le lait boit le bébé.',
    "L'herbe mange la vache.",
    'Le livre lit papa.',
    'Le barrage construit le castor.',
    'La maison saute dans le lit.',
    'Le soleil dort dans mon sac.',
    'La table mange une soupe.',
  ];
  const phraseText = (ph: FrPhrase) => {
    const ws = FR.phraseWords(ph).map((x) => x.w);
    ws[0] = M.fr.cap(ws[0]);
    return ws.join(' ') + '.';
  };
  M.registerSkill({
    id: 'fr-lire-phrases',
    domain: D,
    title: 'Je lis une phrase',
    icon: '🖼️',
    learn: 'fr-lire-detective',
    desc: 'Lis la phrase. Quelle image va avec ?',
    pda: 'Lire C.2.2 a (la phrase), d.i (ce dont on parle) — → 1re, ★ 2e; négation : Lire B.1 a.i',
    gen({ lvl }) {
      const sc = S();
      const objs = sc.objets,
        sujs = sc.sujets;
      const rels = lvl === 0 ? sc.relations.filter((r) => r.id === 'sur' || r.id === 'sous') : sc.relations;
      if (lvl === 1 && Math.random() < 0.4) {
        const sens = Math.random() < 0.5;
        const t = sens ? phraseText(M.pick(FR.PHRASES.filter((p) => p.lvl <= 1))) : M.pick(NONSENS);
        return {
          prompt: `Lis la phrase. Est-ce qu'elle a du <b>sens</b> ? <div class="fr-big" style="font-size:1.6rem">${t}</div>`,
          say: "Lis la phrase. Est-ce qu'elle a du sens ?",
          format: 'tf',
          answer: sens,
          labels: [{ label: '👍 Oui, ça a du sens' }, { label: "🤪 Non, c'est bizarre" }],
          hint: 'Imagine la phrase dans ta tête. Est-ce que ça peut arriver ?',
          explain: sens
            ? "Cette phrase a du sens : on peut l'imaginer."
            : "Cette phrase n'a pas de sens : les mots sont dans un ordre bizarre. Une phrase doit vouloir dire quelque chose.",
        };
      }
      const suj = M.pick(sujs),
        obj = M.pick(objs);
      const rel = M.pick(rels.filter((r) => r.id !== 'dans' || obj.dans));
      if (lvl === 2) {
        // négation : vrai ou faux selon l'image
        const shownRel = Math.random() < 0.5 ? rel : M.pick(rels.filter((r) => r.id !== rel.id && (r.id !== 'dans' || obj.dans)));
        const neg = relPhrase(suj, rel, obj).replace(' est ', /^[aeiou]/.test(rel.mot) ? " n'est pas " : " n'est pas ");
        const ans = shownRel.id !== rel.id;
        return {
          prompt: `Regarde l'image et lis la phrase. <div style="text-align:center">${FR.sceneHtml(suj, shownRel, obj)}</div><div class="fr-big" style="font-size:1.5rem">${neg}</div>`,
          say: "Regarde l'image et lis la phrase. Est-ce vrai ?",
          format: 'tf',
          answer: ans,
          labels: [{ label: "✔️ C'est vrai" }, { label: "✖️ C'est faux" }],
          hint: 'Attention aux petits mots <b>ne… pas</b> : ils disent le contraire.',
          explain: `Sur l'image, ${relPhrase(suj, shownRel, obj).replace(/^./, (c) => c.toLowerCase())} Donc la phrase « ${neg} » est ${ans ? 'vraie' : 'fausse'}.`,
        };
      }
      // la bonne scène + des scènes qui changent UN seul élément (sujet, relation ou objet)
      const okRel = (r: FrSceneRelation, o: FrSceneObjet) => r.id !== 'dans' || o.dans;
      const vS = M.shuffle(sujs.filter((x) => x.id !== suj.id)).map((x) => ({ v: 'suj', html: FR.sceneHtml(x, rel, obj) }));
      const vR = M.shuffle(rels.filter((r) => r.id !== rel.id && okRel(r, obj))).map((r) => ({
        v: 'rel',
        html: FR.sceneHtml(suj, r, obj),
      }));
      const vO = M.shuffle(objs.filter((o) => o.id !== obj.id && okRel(rel, o))).map((o) => ({
        v: 'obj',
        html: FR.sceneHtml(suj, rel, o),
      }));
      const wrong = lvl === 0 ? [vR[0], M.pick([vS[0], vO[0]])] : [vS[0], vR[0], vO[0]];
      const uniq = [{ v: 'ok', html: FR.sceneHtml(suj, rel, obj) }, ...wrong.filter(Boolean).map((o, i) => ({ ...o, v: o.v + i }))];
      const t = relPhrase(suj, rel, obj);
      return {
        prompt: `Lis la phrase. Touche la bonne image. <div class="fr-big" style="font-size:1.6rem">${t}</div>`,
        say: 'Lis la phrase, puis touche la bonne image.',
        format: 'choice',
        answer: 'ok',
        cols: uniq.length === 4 ? 2 : 3,
        choices: M.shuffle(uniq).map((o) => ({ label: o.html, value: o.v })),
        hint: 'Qui ? Où ? Regarde bien le petit mot <b>sur</b>, <b>sous</b>, <b>dans</b> ou <b>à côté</b>.',
        explain: `« ${t} » : ${suj.em} ${rel.mot} ${obj.em}.`,
      };
    },
  });

  /* ---------------- 🔍 Je comprends un texte ---------------- */
  /** Les 3 premiers mots de la phrase du texte qui contient la preuve. */
  const sentenceStart = (texte: string, preuve: string) => {
    const before = texte.slice(0, texte.indexOf(preuve));
    const cut = Math.max(before.lastIndexOf('. '), before.lastIndexOf('! '), before.lastIndexOf('? '), before.lastIndexOf('\n'));
    return texte
      .slice(cut + 1)
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join(' ');
  };
  const TYPE_ORDER: Record<FrQuestionType, number> = { qui: 0, quoi: 0, ou: 0, quand: 0, substitution: 1, inference: 1, vocabulaire: 2 };
  M.registerSkill<QuestionOf<'steps'>>({
    id: 'fr-comprendre-texte',
    domain: D,
    title: 'Je comprends un texte',
    icon: '🔍',
    starter: true,
    learn: 'fr-lire-detective',
    desc: 'Lis le petit texte, puis réponds aux questions.',
    pda: 'Lire A.3 c.i, d.i (personnages, temps, lieux); C.2.3 c (mots de substitution), g (inférence, → 2e); C.1 c.iii–iv (mot nouveau)',
    parentNote:
      'Tous les textes sont originaux. Au niveau découverte, le texte est parfois seulement <b>écouté</b> (volet oral « écouter »), puis montré après la réponse.',
    gen({ lvl }) {
      const pool = FR.TEXTES.filter((t) => t.niveau === lvl);
      const t = M.pick(pool);
      const tokens = M.tokenize(t.texte);
      const listen = lvl === 0 && Math.random() < 0.3;
      const nSteps = lvl === 0 ? 2 : 3;
      let qs;
      if (lvl === 0) qs = M.shuffle(t.questions.filter((q) => TYPE_ORDER[q.type] === 0)).slice(0, 2);
      else {
        const rep = M.shuffle(t.questions.filter((q) => TYPE_ORDER[q.type] === 0));
        const inf = M.shuffle(t.questions.filter((q) => TYPE_ORDER[q.type] === 1));
        const voc = M.shuffle(t.questions.filter((q) => q.type === 'vocabulaire'));
        qs = [rep[0], inf[0], voc[0] || rep[1] || inf[1]].filter(Boolean);
        qs.sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
      }
      qs = qs.slice(0, nSteps);
      return {
        prompt: listen ? "Écoute l'histoire avec 🔊, puis réponds aux questions." : 'Lis le texte, puis réponds aux questions.',
        passage: { title: t.titre, tokens, listenOnly: listen },
        format: 'steps',
        steps: qs.map((q) => ({
          label:
            {
              qui: '👤 Qui ?',
              quoi: '❓ Quoi ?',
              ou: '📍 Où ?',
              quand: '🕒 Quand ?',
              substitution: '🔗 De qui parle-t-on ?',
              inference: '🤔 Je devine',
              vocabulaire: '📚 Le sens du mot',
              sequence: "🔢 L'ordre",
            }[q.type] || '❓',
          prompt: q.q,
          format: 'choice',
          answer: q.choices[0],
          cols: 1,
          choices: M.shuffle(q.choices).map((c) => ({ label: M.esc(c), value: c })),
          hint: listen
            ? 'Écoute encore le texte avec 🔊.'
            : `Relis la phrase qui commence par « ${M.esc(sentenceStart(t.texte, q.preuve))}… ».`,
          after: q.explain,
        })),
      };
    },
    check(q) {
      const title = typeof q.passage === 'object' ? q.passage.title : undefined;
      const t = FR.TEXTES.find((x) => x.titre === title);
      if (!t) return 'texte introuvable';
      for (const s of q.steps) {
        const src = t.questions.find((x) => x.q === s.prompt);
        if (!src || !t.texte.includes(src.preuve)) return 'preuve absente du texte';
        if (!FR.uniqueNorm(src.choices)) return 'choix en double';
      }
    },
  });

  /* ---------------- 🔢 Début, milieu, fin ---------------- */
  const SEQ0 = [
    [
      ['🥚', 'La poule pond un œuf.'],
      ['🐣', "Le poussin sort de l'œuf."],
      ['🐔', 'Le poussin devient une poule.'],
    ],
    [
      ['🌱', 'Je plante une graine.'],
      ['💧', "J'arrose la graine."],
      ['🌻', 'Une fleur pousse.'],
    ],
    [
      ['❄️', 'La neige tombe.'],
      ['⛄', 'Je fais un bonhomme.'],
      ['☀️', 'Le soleil fait fondre le bonhomme.'],
    ],
    [
      ['🛁', 'Je prends mon bain.'],
      ['👕', 'Je mets mon pyjama.'],
      ['😴', 'Je dors dans mon lit.'],
    ],
    [
      ['🎂', 'Papa fait un gâteau.'],
      ['🕯️', 'Je souffle les bougies.'],
      ['🍰', 'Nous mangeons le gâteau.'],
    ],
    [
      ['🌸', 'Le pommier a des fleurs.'],
      ['🍏', 'Une petite pomme verte pousse.'],
      ['🍎', 'La pomme est rouge et mûre.'],
    ],
    [
      ['🐛', 'La chenille mange des feuilles.'],
      ['🛌', 'La chenille dort dans son cocon.'],
      ['🦋', 'Un papillon sort du cocon.'],
    ],
    [
      ['🧦', 'Je mets mes bas.'],
      ['🥾', 'Je mets mes bottes.'],
      ['🏃', 'Je sors jouer dehors.'],
    ],
    [
      ['🍞', 'Je prends une tranche de pain.'],
      ['🧈', 'Je mets du beurre.'],
      ['😋', 'Je mange ma tartine.'],
    ],
    [
      ['🪥', 'Je mets du dentifrice.'],
      ['😁', 'Je brosse mes dents.'],
      ['🚰', 'Je rince ma bouche.'],
    ],
    [
      ['🎈', 'Je gonfle le ballon.'],
      ['🪢', 'Je fais un nœud.'],
      ['🎉', 'Je joue avec le ballon.'],
    ],
    [
      ['☁️', 'Le ciel devient gris.'],
      ['🌧️', 'La pluie tombe.'],
      ['☂️', "J'ouvre mon parapluie."],
    ],
    [
      ['✏️', "J'écris une lettre."],
      ['📮', 'Je mets la lettre dans la boîte.'],
      ['📬', 'Grand-maman reçoit la lettre.'],
    ],
    [
      ['🍎', 'Papa coupe des pommes.'],
      ['🥧', 'Papa fait cuire la tarte.'],
      ['😋', 'Nous mangeons la tarte.'],
    ],
    [
      ['⛸️', 'Je lace mes patins.'],
      ['🏒', 'Je joue au hockey.'],
      ['🏆', 'Mon équipe gagne le match.'],
    ],
    [
      ['🐟', 'Un petit têtard nage.'],
      ['🦵', 'Le têtard a des pattes.'],
      ['🐸', 'Le têtard devient une grenouille.'],
    ],
  ];
  // Histoires en 4 temps (niveau 2) : les marqueurs d'abord, ensuite, puis, enfin sont dans le texte, pas dans les événements.
  const SEQ4 = [
    {
      titre: 'À la cabane à sucre',
      texte:
        "Samedi, Zoé va à la cabane à sucre. D'abord, elle fait une promenade en traîneau. Ensuite, elle mange des crêpes. Puis, elle roule de la tire sur la neige. Enfin, elle danse avec son grand-papa.",
      sequence: [
        { em: '🛷', t: 'Zoé fait une promenade en traîneau.' },
        { em: '🥞', t: 'Zoé mange des crêpes.' },
        { em: '🍯', t: 'Zoé roule de la tire sur la neige.' },
        { em: '💃', t: 'Zoé danse avec son grand-papa.' },
      ],
    },
    {
      titre: 'La première neige',
      texte:
        "Ce matin, Félix voit de la neige ! D'abord, il met son habit de neige. Ensuite, il sort dans la cour. Puis, il attrape des flocons avec sa langue. Enfin, il rentre boire un chocolat chaud.",
      sequence: [
        { em: '🧥', t: 'Félix met son habit de neige.' },
        { em: '🚪', t: 'Félix sort dans la cour.' },
        { em: '❄️', t: 'Félix attrape des flocons.' },
        { em: '☕', t: 'Félix boit un chocolat chaud.' },
      ],
    },
    {
      titre: 'La dent perdue',
      texte:
        "Amira a une dent qui bouge. D'abord, elle croque dans une pomme. Ensuite, sa dent tombe ! Puis, le soir, elle met la dent sous son oreiller. Enfin, le matin, elle trouve un sou brillant.",
      sequence: [
        { em: '🍎', t: 'Amira croque dans une pomme.' },
        { em: '🦷', t: "La dent d'Amira tombe." },
        { em: '🛏️', t: "Amira met sa dent sous l'oreiller." },
        { em: '🪙', t: 'Amira trouve un sou brillant.' },
      ],
    },
    {
      titre: 'À la bibliothèque',
      texte:
        "Mardi, Thomas va à la bibliothèque. D'abord, il choisit un livre sur les dinosaures. Ensuite, il montre sa carte. Puis, il lit dans un gros fauteuil. Enfin, il rapporte le livre à la maison.",
      sequence: [
        { em: '📚', t: 'Thomas choisit un livre.' },
        { em: '🪪', t: 'Thomas montre sa carte.' },
        { em: '🛋️', t: 'Thomas lit dans un gros fauteuil.' },
        { em: '🏠', t: 'Thomas rapporte le livre à la maison.' },
      ],
    },
    {
      titre: 'Le pique-nique',
      texte:
        "Dimanche, Jade fait un pique-nique au parc. D'abord, elle étend une nappe sur l'herbe. Ensuite, elle mange un sandwich. Puis, une fourmi grimpe sur la nappe ! Enfin, Jade range tout et rentre.",
      sequence: [
        { em: '🧺', t: "Jade étend une nappe sur l'herbe." },
        { em: '🥪', t: 'Jade mange un sandwich.' },
        { em: '🐜', t: 'Une fourmi grimpe sur la nappe.' },
        { em: '🏡', t: 'Jade range tout et rentre.' },
      ],
    },
    {
      titre: 'Le bain de Biscuit',
      texte:
        "Biscuit, le chien de Léa, saute dans la boue. D'abord, Léa remplit la baignoire. Ensuite, elle lave Biscuit avec du savon. Puis, Biscuit se secoue et l'arrose ! Enfin, Léa sèche son chien.",
      sequence: [
        { em: '🛁', t: 'Léa remplit la baignoire.' },
        { em: '🧼', t: 'Léa lave Biscuit avec du savon.' },
        { em: '💦', t: 'Biscuit se secoue et arrose Léa.' },
        { em: '🧺', t: 'Léa sèche son chien.' },
      ],
    },
  ];
  // Noms propres des textes (jamais mis en minuscule dans les explications : « Ensuite : Léa va au parc »)
  const PROPRES = () => {
    const out = new Set(['Biscuit']);
    // mots à majuscule qui ne commencent pas une phrase (sans « lookbehind », absent avant Safari 16.4)
    [...FR.TEXTES, ...SEQ4].forEach((t) =>
      t.texte.split(/[.!?]+\s*/).forEach((ph) =>
        ph
          .split(/[\s,;:«»"()’']+/)
          .slice(1)
          .forEach((w) => {
            if (/^[A-ZÀ-Ý][a-zà-ÿ]+$/.test(w)) out.add(w);
          }),
      ),
    );
    return [...out];
  };
  M.registerSkill({
    id: 'fr-ordre-histoire',
    domain: D,
    title: 'Début, milieu, fin',
    icon: '🔢',
    learn: 'fr-lire-detective',
    desc: "Remets l'histoire dans l'ordre.",
    pda: "Lire A.2 a (début, milieu, fin d'un récit, ★ 2e); A.4 c.ii (marqueurs d'abord, ensuite, enfin)",
    gen({ lvl }) {
      type Seq = { em: string; t: string }[];
      type AvecSeq = FrTexte & { sequence: Seq };
      let seq: Seq,
        passage: Passage | null = null;
      if (lvl === 0 || (lvl === 1 && Math.random() < 0.3)) seq = M.pick(SEQ0).map(([em, t]) => ({ em, t }));
      else {
        const t = M.pick<{ titre: string; texte: string; sequence: Seq }>(
          lvl === 1
            ? FR.TEXTES.filter((x): x is AvecSeq => !!x.sequence && x.niveau <= 1)
            : [...FR.TEXTES.filter((x): x is AvecSeq => !!x.sequence && x.niveau === 2 && x.sequence.length === 4), ...SEQ4],
        );
        seq = t.sequence;
        passage = { title: t.titre, tokens: M.tokenize(t.texte) };
      }
      const names = PROPRES();
      const low = (x: string) => M.esc(M.fr.uncap(x, names));
      if (lvl === 2 && Math.random() < 0.45) {
        // Qu'est-ce qui arrive juste après… ?
        const k = M.rnd(0, seq.length - 2);
        return {
          passage: passage ?? undefined,
          prompt: `Qu'est-ce qui arrive juste <b>après</b> ?<div class="fr-ord" style="text-align:center">${seq[k].em} ${M.esc(seq[k].t)}</div>`,
          say: `Qu'est-ce qui arrive juste après ? ${seq[k].t}`,
          format: 'choice',
          cols: 1,
          answer: 'e' + (k + 1),
          choices: M.shuffle(seq.map((x, i) => ({ label: `${x.em} ${M.esc(x.t)}`, value: 'e' + i })).filter((c) => c.value !== 'e' + k)),
          hint: "Cherche les mots <b>d'abord</b>, <b>ensuite</b>, <b>puis</b>, <b>enfin</b> dans le texte.",
          explain: `Après « ${low(seq[k].t)} », le texte dit : <b>${low(seq[k + 1].t)}</b>`,
        };
      }
      const choices = seq.map((s, i) => ({
        label: `<span class="fr-ord"><span style="font-size:1.6rem">${s.em}</span><br>${M.esc(s.t)}</span>`,
        value: 'e' + i,
      }));
      const q: QuestionOf<'order'> = {
        prompt: passage ? "Relis le texte. Remets les événements dans l'ordre." : "Remets l'histoire dans l'ordre : début, milieu, fin.",
        format: 'order',
        choices: M.shuffle(choices),
        answer: seq.map((s, i) => 'e' + i),
        hint:
          seq.length === 4
            ? "Qu'est-ce qui arrive <b>d'abord</b> ? <b>ensuite</b> ? <b>puis</b> ? <b>enfin</b> ?"
            : "Qu'est-ce qui arrive en premier ?",
        explain: (seq.length === 4 ? ["D'abord", 'Ensuite', 'Puis', 'Enfin'] : ["D'abord", 'Ensuite', 'Enfin'])
          .map((w, i) => `<b>${w}</b> : ${low(seq[i].t)}`)
          .join('<br>'),
      };
      if (passage) q.passage = passage;
      return q;
    },
  });
})();
