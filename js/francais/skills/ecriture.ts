/* =====================================================================
   skills/ecriture.js — J'écris des phrases (fr-ecriture) et J'apprécie une histoire (fr-lecture)
     fr-ecrire-phrases : construire une phrase (majuscule, point), repérer la phrase bien écrite,
                         puis écrire sa propre phrase sur une feuille avec une liste de vérification (non noté)
     fr-apprecier      : courte histoire originale (lue à voix haute), compréhension, puis « As-tu aimé ? Pourquoi ? » (non noté)
   Formats existants seulement : build, choice, steps, reflect.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;

  /* ---------------- ✍️ J'écris une phrase ---------------- */
  // Image → phrase. Le premier mot porte la majuscule; les prénoms aussi.
  const SCENES = [
    ['🐱💤', 'Le chat dort'],
    ['🐶🦴', 'Le chien mange un os'],
    ['👧🚲', 'Léa fait du vélo'],
    ['🐦🎶', "L'oiseau chante"],
    ['⛄❄️', 'Je fais un bonhomme'],
    ['👦⚽', 'Félix joue au ballon'],
    ['🐸💧', "La grenouille saute dans l'eau"],
    ['🐟🌊', 'Le poisson nage'],
    ['🌧️☂️', 'Il pleut dehors'],
    ['👧📚', 'Zoé lit un livre'],
    ['🐰🥕', 'Le lapin mange une carotte'],
    ['🎂🕯️', 'Je souffle les bougies'],
    ['🌻☀️', 'La fleur pousse au soleil'],
    ['🦆💧', 'Le canard nage sur le lac'],
    ['🧒🛷', 'Thomas glisse sur la neige'],
    ['🐄🌾', "La vache mange de l'herbe"],
    ['🥛🍪', 'Je bois du lait'],
    ['👫🏀', 'Je joue avec Malik'],
    ['🐈🧶', 'Le chat de Jade joue'],
    ['🍁🍂', 'Les feuilles tombent'],
  ].map(([em, s]) => ({ em, s, w: s.split(' ') }));
  const NOMS_PROPRES = M.people.NAMES.map((x) => x[0]);
  type Scene = (typeof SCENES)[number];
  const isName = (w: string) => NOMS_PROPRES.includes(w);
  const sentence = (sc: Scene) => sc.s + '.';
  const lowFirst = (w: string) => w.charAt(0).toLocaleLowerCase('fr-CA') + w.slice(1);
  /** Phrases mal écrites (une seule erreur chacune). */
  const errors = (sc: Scene) => {
    const w = sc.w,
      out: { kind: string; s: string; why: string }[] = [];
    out.push({ kind: 'maj', s: [lowFirst(w[0]), ...w.slice(1)].join(' ') + '.', why: 'il manque la <b>majuscule</b> au début' });
    out.push({ kind: 'point', s: sc.s, why: 'il manque le <b>point</b> à la fin' });
    if (w.length >= 3)
      out.push({ kind: 'espace', s: [w[0] + w[1], ...w.slice(2)].join(' ') + '.', why: 'il manque une <b>espace</b> entre deux mots' });
    const k = w.findIndex((x, i) => i > 0 && isName(x));
    if (k > 0)
      out.push({
        kind: 'nom',
        s: w.map((x, i) => (i === k ? lowFirst(x) : x)).join(' ') + '.',
        why: `<b>${w[k]}</b> est un prénom : il prend une majuscule`,
      });
    return out;
  };
  const buildStep = (sc: Scene, extra: Partial<BuildFields> = {}): BuildFields & { format: 'build'; hint: string } => {
    const first = sc.w[0];
    const tiles = [...sc.w, '.', lowFirst(first)];
    return {
      format: 'build',
      join: ' ',
      tiles,
      answer: [...sc.w, '.'],
      hint: 'Une phrase commence par une <b>majuscule</b> et finit par un <b>point</b>.',
      ...extra,
    };
  };
  const CHECKLIST =
    '<div style="text-align:left;display:inline-block;font-size:1.1rem;line-height:1.7">☐ Une <b>majuscule</b> au début ?<br>☐ Un <b>point</b> à la fin ?<br>☐ Une <b>espace</b> entre les mots ?</div>';
  M.registerSkill({
    id: 'fr-ecrire-phrases',
    domain: 'fr-ecriture',
    title: "J'écris une phrase",
    icon: '✍️',
    learn: 'fr-la-phrase',
    desc: "Regarde l'image et écris une phrase bien écrite.",
    pda: "Écrire des textes variés (compétence 2) : phrase qui a du sens (Syntaxe A.1), majuscule et point (Syntaxe B.1 a.i, b, ★ 2e), majuscule des prénoms (Orthographe d'usage C.4 a.i); se relire avec une liste de vérification",
    parentNote:
      "L'enfant construit une phrase à partir d'une image, repère la phrase bien écrite, puis <b>écrit sa propre phrase sur une feuille</b> et la vérifie (majuscule, point, espaces). Cette dernière étape n'est pas notée : lisez la phrase avec lui.",
    gen({ lvl }) {
      const sc = M.pick(SCENES);
      const good = sentence(sc);
      const scene = [{ emoji: sc.em, label: sc.s }];
      if (lvl === 0) {
        return {
          prompt: 'Écoute et regarde. Construis la phrase.',
          scene,
          audio: { text: good, autoplay: 'once' },
          ...buildStep(sc),
          explain: `On écrit : <b>${M.esc(good)}</b> Une majuscule au début, un point à la fin.`,
        };
      }
      const errs = M.shuffle(errors(sc)).slice(0, lvl === 1 ? 2 : 3);
      const pickStep: StepItem = {
        label: '🔎 La phrase bien écrite',
        prompt: 'Quelle phrase est <b>bien écrite</b> ?',
        format: 'choice',
        cols: 1,
        answer: good,
        choices: M.shuffle([
          { label: M.esc(good), value: good },
          ...errs.map((e) => ({ label: M.esc(e.s), value: e.s, why: `Non : ${e.why}.` })),
        ]),
        hint: 'Regarde le début, la fin et les espaces.',
      };
      const own: StepItem = {
        label: '💬 À toi ! (pas noté)',
        format: 'reflect',
        prompt: `${lvl === 2 ? 'Écris <b>deux phrases</b>' : 'Écris <b>ta phrase</b>'} sur l'image, sur une feuille. Puis vérifie :<br>${CHECKLIST}`,
        actions: ["✅ J'ai vérifié ma phrase", '🙈 Je préfère passer'],
      };
      const steps: StepItem[] =
        lvl === 1
          ? [{ label: '🧱 Je construis', prompt: "Construis la phrase de l'image.", ...buildStep(sc) }, pickStep, own]
          : [pickStep, { label: '🧱 Je construis', prompt: "Construis la phrase de l'image.", ...buildStep(sc) }, own];
      return {
        prompt: lvl === 1 ? "Regarde l'image. Écris une phrase, étape par étape." : "Regarde l'image. Trouve, puis construis la phrase.",
        scene,
        audio: { text: good, autoplay: 'once' },
        format: 'steps',
        steps,
        scoreSteps: [0, 1],
        explain: `<b>${M.esc(good)}</b> Majuscule au début${sc.w.some((x, i) => i > 0 && isName(x)) ? ' et au prénom' : ''}, point à la fin, une espace entre les mots.`,
      };
    },
    check(q) {
      const builds = q.format === 'build' ? [q] : q.format === 'steps' ? q.steps.filter((s) => s.format === 'build') : [];
      for (const b of builds) {
        if (!/^[A-ZÀ-Ý]/.test(String(b.answer[0]))) return 'la phrase ne commence pas par une majuscule';
        if (b.answer[b.answer.length - 1] !== '.') return 'pas de point final';
      }
      const ch = q.format === 'steps' ? q.steps.find((s) => s.format === 'choice') : undefined;
      if (ch && new Set(ch.choices.map((c) => c.value)).size !== ch.choices.length) return 'choix en double';
    },
  });

  /* ---------------- 📖 J'apprécie une histoire ---------------- */
  // Histoires originales (≈ 60 mots), contextes québécois. q : [question, bonne réponse, distracteurs…]
  const HIST = [
    {
      titre: 'Le ouaouaron qui chantait faux',
      em: '🐸',
      texte:
        "Tous les soirs, un petit ouaouaron chante au bord du lac. Mais il chante faux ! Les canards se bouchent les oreilles. Un soir, une luciole lui dit : « Chante plus doucement. » Le ouaouaron essaie. Sa chanson devient toute belle. Maintenant, le lac entier l'écoute.",
      q: [
        ['Qui chante au bord du lac ?', 'un ouaouaron', 'un canard', 'une luciole'],
        ['Qui aide le ouaouaron ?', 'une luciole', 'un canard', 'un poisson'],
        ['Comment se sent le ouaouaron à la fin ?', 'fier et content', 'fâché', 'triste'],
      ],
    },
    {
      titre: 'La tuque rouge',
      em: '🧣',
      texte:
        "Rosalie perd sa tuque rouge dans la neige. Elle cherche partout : sous le banc, près du sapin. Rien ! Le lendemain, elle voit un écureuil. Il dort dans un nid tout rouge. C'est sa tuque ! Rosalie sourit : « Garde-la, petit écureuil. »",
      q: [
        ["Qu'est-ce que Rosalie perd ?", 'sa tuque', 'sa mitaine', 'son foulard'],
        ['Où est la tuque ?', "dans le nid d'un écureuil", 'sous le banc', 'près du sapin'],
        [
          'Pourquoi Rosalie laisse-t-elle sa tuque ?',
          "pour que l'écureuil ait chaud",
          "parce qu'elle est trop petite",
          "parce qu'elle n'aime pas le rouge",
        ],
      ],
    },
    {
      titre: 'Le dragon qui avait peur du noir',
      em: '🐉',
      texte:
        "Gaspard est un grand dragon. Il crache du feu, mais il a peur du noir ! Chaque soir, il allume une bougie. Un soir, le vent éteint la bougie. Gaspard regarde dehors : le ciel est plein d'étoiles. « Le noir, c'est beau ! » dit-il.",
      q: [
        ['De quoi Gaspard a-t-il peur ?', 'du noir', 'du feu', 'des étoiles'],
        ["Qu'est-ce qui éteint la bougie ?", 'le vent', 'la pluie', 'un chat'],
        ['Que pense Gaspard du noir à la fin ?', 'Il le trouve beau.', 'Il a encore peur.', 'Il se fâche.'],
      ],
    },
    {
      titre: 'Bruno le castor',
      em: '🦫',
      texte:
        "Bruno le castor veut bâtir une maison. Il coupe des branches avec ses dents. Il les empile dans la rivière. Mais un orage casse tout ! Bruno ne pleure pas. Ses amis viennent l'aider. Ensemble, ils bâtissent une maison encore plus solide.",
      q: [
        ['Que veut faire Bruno ?', 'bâtir une maison', 'nager très vite', 'manger des poissons'],
        ["Qu'est-ce qui casse la maison ?", 'un orage', 'un ours', 'la neige'],
        ["Que nous apprend l'histoire ?", 'Ensemble, on est plus forts.', 'Il ne faut jamais bâtir.', "Les castors ont peur de l'eau."],
      ],
    },
    {
      titre: 'Le bonhomme de Samuel',
      em: '⛄',
      texte:
        "Ce matin, le bonhomme de neige de Samuel a disparu ! Il reste seulement sa carotte et son foulard, dans une grande flaque d'eau. Le soleil brille très fort. Samuel comprend : son bonhomme a fondu ! Il rit et dit : « L'hiver prochain, je t'en fais un autre. »",
      q: [
        ["Qu'est-ce qui reste du bonhomme ?", 'sa carotte et son foulard', 'son chapeau', 'ses bras'],
        ['Pourquoi le bonhomme a-t-il disparu ?', 'Il a fondu au soleil.', "Un chien l'a mangé.", "Le vent l'a emporté."],
        ['Comment réagit Samuel ?', 'Il rit.', 'Il pleure.', 'Il se fâche.'],
      ],
    },
    {
      titre: 'La souris et la citrouille',
      em: '🎃',
      texte:
        "Une petite souris trouve une énorme citrouille. Elle croque un trou, puis un autre, puis encore un autre. Le soir de l'Halloween, Inès voit la citrouille. Elle a deux yeux et une grande bouche ! « Merci, la souris, dit Inès. Tu as fait ma lanterne ! »",
      q: [
        ["Qu'est-ce que la souris trouve ?", 'une citrouille', 'une pomme', 'un fromage'],
        ['Quel soir Inès voit-elle la citrouille ?', "le soir de l'Halloween", 'le soir de Noël', 'le soir de sa fête'],
        ['Pourquoi Inès dit-elle merci ?', 'La souris a fait sa lanterne.', 'La souris a mangé sa soupe.', 'La souris a chanté.'],
      ],
    },
    {
      titre: "Le cerf-volant d'Olivier",
      em: '🪁',
      texte:
        "Olivier a un cerf-volant jaune. Il court dans le champ, mais le cerf-volant reste par terre. Il n'y a pas de vent ! Olivier s'assoit et attend. Tout à coup, le vent se lève. Le cerf-volant monte, monte, jusqu'aux nuages !",
      q: [
        ['De quelle couleur est le cerf-volant ?', 'jaune', 'rouge', 'vert'],
        ['Pourquoi le cerf-volant reste-t-il par terre ?', "Il n'y a pas de vent.", 'Il est brisé.', 'Il pleut.'],
        ["Qu'est-ce qui aide Olivier à réussir ?", 'Il attend le vent.', 'Il pleure.', 'Il rentre chez lui.'],
      ],
    },
    {
      titre: 'La lettre de grand-maman',
      em: '💌',
      texte:
        "Charlotte reçoit une lettre de sa grand-maman. Dans l'enveloppe, il y a un dessin et une graine. Grand-maman écrit : « Plante-la, tu auras une surprise. » Charlotte plante la graine dans un pot. Elle l'arrose chaque jour. Un mois plus tard, un grand tournesol lui sourit.",
      q: [
        ['Qui écrit à Charlotte ?', 'sa grand-maman', 'son ami', 'son enseignante'],
        ["Qu'est-ce qu'il y a dans l'enveloppe ?", 'un dessin et une graine', 'des bonbons', 'une photo'],
        ['Quelle est la surprise ?', 'un tournesol', 'un chat', 'un gâteau'],
      ],
    },
  ];
  const AVIS = ["😄 Oui ! C'était drôle.", '😮 Oui ! Il y a une surprise.', "🥰 Oui ! J'aime le personnage.", '🙂 Un peu.', '😕 Pas trop.'];
  M.registerSkill<QuestionOf<'steps'>>({
    id: 'fr-apprecier',
    domain: 'fr-lecture',
    title: "J'apprécie une histoire",
    icon: '📕',
    learn: 'fr-lire-detective',
    desc: 'Écoute ou lis une histoire. As-tu aimé ? Pourquoi ?',
    pda: "Apprécier des œuvres littéraires (compétence 3) : écouter ou lire une histoire, réagir et dire pourquoi on l'aime; Lire A.3 c.i (personnages), C.2.3 g (inférence simple); Communication orale (exprimer ses goûts)",
    parentNote:
      "Histoires courtes originales, lues à voix haute (🔊). Les questions de compréhension sont notées; la dernière carte « As-tu aimé ? Pourquoi ? » ne l'est jamais : demandez à l'enfant d'expliquer son choix.",
    gen({ lvl }) {
      const h = M.pick(HIST);
      // q[0], q[1] : repérage; q[2] : inférence / sentiment (niveau 2). Les questions restent dans l'ordre de l'histoire.
      const [q1, q2, q3] = h.q;
      const drop = M.rnd(0, 2);
      const qs = lvl === 0 ? [M.pick([q1, q2])] : lvl === 1 ? h.q.filter((_, i) => i !== drop) : [M.pick([q1, q2]), q3];
      const steps = qs.map(([question, ok, ...bad]): StepItem => ({
        label: '❓ Je comprends',
        prompt: question,
        format: 'choice',
        cols: 1,
        answer: ok,
        choices: M.shuffle([ok, ...bad]).map((c) => ({ label: M.esc(c), value: c })),
      }));
      steps.push({
        label: '💬 Mon avis (pas noté)',
        format: 'reflect',
        prompt: `As-tu aimé <b>${M.esc(h.titre)}</b> ? Pourquoi ? Choisis, puis dis-le à un adulte.`,
        actions: AVIS,
      });
      return {
        passage: { title: `${h.em} ${h.titre}`, tokens: M.tokenize(h.texte), listenOnly: lvl === 0 },
        prompt: lvl === 0 ? "Écoute l'histoire avec 🔊. Puis réponds." : "Lis l'histoire ou écoute-la avec 🔊.",
        format: 'steps',
        steps,
        scoreSteps: steps.slice(0, -1).map((_, i) => i),
        hint: "Écoute encore l'histoire avec 🔊.",
        explain: `${qs.map(([qq, ok]) => `${M.esc(qq)} → <b>${M.esc(ok)}</b>`).join('<br>')}<br>Chacun peut avoir son avis sur une histoire !`,
      };
    },
    check(q) {
      const title = typeof q.passage === 'object' ? q.passage.title : undefined;
      const t = title && HIST.find((h) => title.endsWith(h.titre));
      if (!t) return 'histoire introuvable';
      for (const s of q.steps) if (s.format === 'choice' && !FR.uniqueNorm(s.choices.map((c) => c.value))) return 'choix en double';
      if (q.steps[q.steps.length - 1].format !== 'reflect') return "la carte d'avis manque";
    },
  });
})();
