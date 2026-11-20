/* =====================================================================
   sciences/data/animaux.js — animaux du Québec (HLD § 5.2–5.4)
   M.SC.ANIMAUX (34 sauvages) · M.SC.DOMESTIQUES (8) · énumérations · M.SC.MOVE_Q
   Faits reformulés à partir de fiches publiques (gouv. du Québec — faune, Parcs Canada, Biodôme).
   Drapeaux *Q : un générateur n'utilise une fiche QUE si le drapeau de la notion est vrai
   (cas ambigus exclus : tamia omnivore, porc-épic « piquants », insectes, etc.).
   emoji : fid 'ok' fidèle · 'approx' approximatif (le nom est toujours écrit) · 'none' → dessin art.
   recent : emoji Unicode 13–15 (repli si non affiché).
   ===================================================================== */

/** Fidélité de l'emoji : 'ok' fidèle · 'approx' approximatif · 'none' → dessin art. */
type ScFid = 'ok' | 'approx' | 'none';
/** Animal sauvage du Québec (M.SC.ANIMAUX). */
interface ScAnimal extends ScPic {
  id: string;
  nom: string;
  emoji: string;
  fid: ScFid;
  /** Clés de M.SC.HABITATS. */
  hab: string[];
  /** Clé de M.SC.MANGE. */
  mange: string;
  /** Clé de M.SC.COUV. */
  couv: string;
  /** Clés de M.SC.BOUGE. */
  bouge: string[];
  /** Clé de M.SC.HIVER. */
  hiver: string;
  faits: string[];
  fait: string;
  /** Drapeaux : la fiche n'est tirée pour une notion que si son drapeau est vrai. */
  foodQ: boolean;
  coverQ: boolean;
  moveQ: boolean;
  habitatQ: boolean;
  hiverQ: boolean;
  art?: string;
  domestique?: undefined;
}
/** Animal domestique (M.SC.DOMESTIQUES). */
interface ScDomestique extends ScPic {
  id: string;
  nom: string;
  emoji: string;
  fid: ScFid;
  /** Ce qu'on lui donne (texte). */
  nourri: string;
  /** Clé de M.SC.NOURRITURE. */
  cat: string;
  domestique: true;
}
/** Animal sauvage ou domestique (M.SC.animal) : les champs propres à l'autre sorte sont absents. */
type ScBete =
  | (ScAnimal & { [K in Exclude<keyof ScDomestique, keyof ScAnimal>]?: undefined })
  | (ScDomestique & { [K in Exclude<keyof ScAnimal, keyof ScDomestique>]?: undefined });
interface ScLabelIcon {
  label: string;
  icon: string;
}
/** Déplacement : réponses sûres seulement. */
interface ScMoveQ {
  verbe: string;
  oui: string[];
  non: string[];
}
interface ScApi {
  HABITATS: Record<string, ScLabelIcon>;
  MANGE: Record<string, ScLabelIcon & { mot: string }>;
  COUV: Record<string, ScLabelIcon>;
  BOUGE: Record<string, string>;
  HIVER: Record<string, ScLabelIcon>;
  ANIMAUX: ScAnimal[];
  DOMESTIQUES: ScDomestique[];
  NOURRITURE: Record<string, string>;
  MOVE_Q: Record<string, ScMoveQ>;
  /** Animal sauvage ou domestique par id. */
  animal(id: string): ScBete | undefined;
  /** Erreurs du schéma des animaux ('' si aucune). */
  checkAnimals(): string;
}
interface DataRegistry {
  'sc.animaux': ScAnimal[];
  'sc.domestiques': ScDomestique[];
}

(function () {
  'use strict';
  const M = window.M;
  const SC = (M.SC = M.SC || ({} as ScApi));

  SC.HABITATS = {
    foret: { label: 'la forêt', icon: '🌲' },
    lac: { label: 'le lac et la rivière', icon: '🏞️' },
    etang: { label: "l'étang et le marais", icon: '🪷' },
    champ: { label: 'le champ', icon: '🌾' },
    ville: { label: 'la ville et les jardins', icon: '🏘️' },
    fleuve: { label: 'le fleuve et la mer', icon: '🌊' },
    nord: { label: 'le Grand Nord', icon: '🧊' },
  };
  SC.MANGE = {
    plantes: { label: 'Des plantes', icon: '🌿', mot: 'herbivore' },
    animaux: { label: "D'autres animaux", icon: '🍖', mot: 'carnivore' },
    deux: { label: 'Les deux', icon: '🌿🍖', mot: 'omnivore' },
  };
  SC.COUV = {
    poils: { label: 'Des poils', icon: '🧶' },
    plumes: { label: 'Des plumes', icon: '🪶' },
    ecailles: { label: 'Des écailles', icon: '🐟' },
    peau: { label: 'Une peau nue', icon: '💧' },
    carapace: { label: 'Une carapace', icon: '🐢' },
    coquille: { label: 'Une coquille', icon: '🐌' },
    insecte: { label: 'Un insecte', icon: '🐞' },
  };
  SC.BOUGE = {
    marche: '🚶 marche',
    court: '🏃 court',
    saute: '🦘 saute',
    vole: '🕊️ vole',
    nage: '🏊 nage',
    rampe: '🐍 rampe',
    grimpe: '🧗 grimpe',
  };
  SC.HIVER = {
    actif: { label: 'Reste actif et trouve sa nourriture dans la neige', icon: '❄️' },
    hiberne: { label: "Hiberne : dort tout l'hiver, sans manger", icon: '💤' },
    dort: { label: 'Dort beaucoup dans son abri et se réveille parfois', icon: '😴' },
    migre: { label: "Part vers le sud avant l'hiver", icon: '✈️' },
    pelage: { label: 'Son pelage devient blanc', icon: '🤍' },
    fond: { label: "Reste au fond de l'étang, sous la glace", icon: '🧊' },
    autre: { label: 'Autre', icon: '❔' },
  };

  // a(id, nom, emoji, fid, habitats, mange, couverture, bouge, hiver, faits, drapeaux {food, cover, move, habitat, hiver}, extra)
  const A = (
    id: string,
    nom: string,
    emoji: string,
    fid: ScFid,
    hab: string[],
    mange: string,
    couv: string,
    bouge: string[],
    hiver: string,
    faits: string[],
    Q: { food?: boolean; cover?: boolean; move?: boolean; habitat?: boolean; hiver?: boolean } = {},
    extra: { recent?: boolean; art?: string } = {},
  ): ScAnimal => ({
    id,
    nom,
    emoji,
    fid,
    hab,
    mange,
    couv,
    bouge,
    hiver,
    faits,
    fait: faits[0],
    foodQ: Q.food !== false,
    coverQ: Q.cover !== false,
    moveQ: Q.move !== false,
    habitatQ: Q.habitat !== false,
    hiverQ: Q.hiver !== false,
    ...extra,
  });
  SC.ANIMAUX = [
    A(
      'castor',
      'le castor',
      '🦫',
      'ok',
      ['lac', 'foret'],
      'plantes',
      'poils',
      ['nage', 'marche'],
      'actif',
      [
        'Il coupe des arbres avec ses dents et construit un barrage.',
        "Sa queue plate l'aide à se diriger quand il nage.",
        "L'hiver, il mange les branches qu'il a gardées sous l'eau, près de sa hutte.",
      ],
      { hiver: false },
      { recent: true, art: 'sc-castor' },
    ),
    A(
      'orignal',
      "l'orignal",
      '🫎',
      'ok',
      ['foret', 'etang'],
      'plantes',
      'poils',
      ['marche', 'court', 'nage'],
      'actif',
      [
        "C'est le plus grand animal de nos forêts.",
        'Le mâle porte de grands bois qui tombent chaque hiver et repoussent.',
        "L'été, il mange des plantes d'eau dans les marais.",
      ],
      {},
      { recent: true, art: 'sc-orignal' },
    ),
    A('cerf', 'le cerf de Virginie (chevreuil)', '🦌', 'ok', ['foret', 'champ'], 'plantes', 'poils', ['court', 'saute'], 'actif', [
      "On l'appelle aussi le chevreuil.",
      'Quand il a peur, il lève sa queue blanche.',
      "Il mange des feuilles, des bourgeons et de l'herbe.",
    ]),
    A(
      'caribou',
      'le caribou',
      '🦌',
      'approx',
      ['nord', 'foret'],
      'plantes',
      'poils',
      ['marche', 'nage'],
      'migre',
      [
        'Il vit dans le Nord, en grands troupeaux.',
        "Il mange du lichen, qu'il trouve même sous la neige.",
        'Chez le caribou, le mâle et la femelle portent des bois.',
      ],
      { hiver: false },
    ),
    A('ours-noir', "l'ours noir", '🐻', 'approx', ['foret'], 'deux', 'poils', ['marche', 'grimpe'], 'dort', [
      'Il mange surtout des petits fruits, des plantes et des insectes.',
      "L'hiver, il dort dans sa tanière, sans manger.",
      'Il grimpe très bien aux arbres.',
    ]),
    A(
      'ours-blanc',
      "l'ours blanc",
      '🐻‍❄️',
      'ok',
      ['nord'],
      'animaux',
      'poils',
      ['marche', 'nage'],
      'actif',
      [
        'Il vit dans le Grand Nord, près de la mer gelée (la banquise).',
        "Il nage très bien dans l'eau glacée.",
        'Il chasse surtout les phoques.',
      ],
      { hiver: false },
    ),
    A('renard', 'le renard roux', '🦊', 'ok', ['foret', 'champ', 'ville'], 'deux', 'poils', ['court', 'saute'], 'actif', [
      'Il entend les souris qui bougent sous la neige, puis il saute dessus !',
      'Il a une grande queue touffue.',
      'Il mange des petits animaux, mais aussi des petits fruits.',
    ]),
    A('loup', 'le loup gris', '🐺', 'ok', ['foret'], 'animaux', 'poils', ['court', 'marche'], 'actif', [
      'Il vit et chasse en meute, avec sa famille.',
      'Il hurle pour parler aux autres loups.',
      'Il chasse de gros animaux, comme le cerf.',
    ]),
    A(
      'lynx',
      'le lynx du Canada',
      '',
      'none',
      ['foret'],
      'animaux',
      'poils',
      ['marche', 'saute'],
      'actif',
      [
        'Il a des touffes de poils noirs au bout des oreilles.',
        "Ses grosses pattes poilues l'aident à marcher sur la neige, comme des raquettes.",
        'Il chasse surtout le lièvre.',
      ],
      {},
      { art: 'sc-lynx' },
    ),
    A('raton', 'le raton laveur', '🦝', 'ok', ['foret', 'ville'], 'deux', 'poils', ['marche', 'grimpe'], 'dort', [
      'Il a un masque noir autour des yeux.',
      'Il touche sa nourriture avec ses pattes avant, très habiles.',
      'Il mange presque de tout : fruits, insectes, œufs, poissons…',
    ]),
    A('mouffette', 'la mouffette rayée', '🦨', 'ok', ['champ', 'ville'], 'deux', 'poils', ['marche'], 'dort', [
      'Elle a des rayures blanches sur le dos.',
      'Quand elle a peur, elle lance un liquide qui sent très mauvais.',
      'Elle cherche des insectes et des vers dans le sol.',
    ]),
    A(
      'porc-epic',
      'le porc-épic',
      '',
      'none',
      ['foret'],
      'plantes',
      'poils',
      ['marche', 'grimpe'],
      'actif',
      [
        'Son dos est couvert de milliers de piquants.',
        'Ses piquants sont des poils très durs. Il ne peut pas les lancer !',
        "Il grimpe aux arbres pour manger l'écorce et les bourgeons.",
      ],
      { cover: false },
      { art: 'sc-porcepic' },
    ),
    A(
      'tamia',
      'le tamia rayé (suisse)',
      '🐿️',
      'ok',
      ['foret', 'ville'],
      'deux',
      'poils',
      ['court', 'grimpe'],
      'dort',
      [
        "Au Québec, on l'appelle aussi le suisse.",
        'Il transporte des graines dans ses joues.',
        "L'hiver, il dort dans son terrier et se réveille parfois pour manger ses réserves.",
      ],
      { food: false },
    ),
    A(
      'ecureuil',
      "l'écureuil roux",
      '🐿️',
      'approx',
      ['foret'],
      'deux',
      'poils',
      ['grimpe', 'saute'],
      'actif',
      [
        'Il grimpe et saute de branche en branche.',
        "Il cache des cocottes de sapin et d'épinette pour l'hiver.",
        'Il mange surtout des graines et des noix.',
      ],
      { food: false },
    ),
    A('lievre', "le lièvre d'Amérique", '🐇', 'approx', ['foret'], 'plantes', 'poils', ['saute', 'court'], 'pelage', [
      "Son pelage devient blanc l'hiver pour se cacher dans la neige.",
      "Ses grandes pattes arrière l'aident à courir sur la neige.",
      "Le lièvre n'est pas un lapin : ses bébés naissent avec du poil et les yeux ouverts.",
    ]),
    A(
      'marmotte',
      'la marmotte (siffleux)',
      '',
      'none',
      ['champ'],
      'plantes',
      'poils',
      ['marche'],
      'hiberne',
      [
        "On l'appelle aussi le siffleux, parce qu'elle siffle quand elle a peur.",
        'Elle creuse un terrier dans le sol.',
        "Elle hiberne : elle dort tout l'hiver, sans manger.",
      ],
      {},
      { art: 'sc-marmotte' },
    ),
    A(
      'chauve-souris',
      'la chauve-souris',
      '🦇',
      'ok',
      ['foret', 'ville'],
      'animaux',
      'poils',
      ['vole'],
      'hiberne',
      [
        'Elle vole la nuit et mange des insectes.',
        'Elle vole, mais elle a des poils, pas des plumes !',
        "L'hiver, elle hiberne dans une grotte ou un vieux bâtiment.",
      ],
      { habitat: false },
    ),
    A(
      'beluga',
      'le béluga',
      '🐋',
      'approx',
      ['fleuve'],
      'animaux',
      'peau',
      ['nage'],
      'actif',
      [
        "C'est une baleine blanche qui vit dans le fleuve Saint-Laurent.",
        "Il nage, mais il n'a pas d'écailles : sa peau est lisse.",
        "Il fait plein de sons : on l'appelle le canari des mers.",
      ],
      { hiver: false },
    ),
    A(
      'phoque',
      'le phoque commun',
      '🦭',
      'ok',
      ['fleuve'],
      'animaux',
      'poils',
      ['nage'],
      'actif',
      ['Il nage très bien, mais se repose sur les rochers.', 'Une épaisse couche de gras le garde au chaud.', 'Il mange des poissons.'],
      { hiver: false },
      { recent: true },
    ),
    A(
      'huard',
      'le huard',
      '',
      'none',
      ['lac'],
      'animaux',
      'plumes',
      ['nage', 'vole'],
      'migre',
      [
        "Il plonge sous l'eau pour attraper des poissons.",
        "Son cri ressemble à un long chant triste qu'on entend sur les lacs.",
        'On le voit sur la pièce de 1 dollar.',
      ],
      {},
      { art: 'sc-huard' },
    ),
    A(
      'bernache',
      'la bernache du Canada',
      '🪿',
      'approx',
      ['lac', 'champ', 'etang'],
      'plantes',
      'plumes',
      ['vole', 'nage', 'marche'],
      'migre',
      ['Elle vole en groupe, en forme de V.', "L'automne, elle part vers le sud.", "Elle mange de l'herbe et des grains dans les champs."],
      {},
      { recent: true },
    ),
    A(
      'canard',
      'le canard colvert',
      '🦆',
      'ok',
      ['etang', 'lac'],
      'deux',
      'plumes',
      ['vole', 'nage', 'marche'],
      'migre',
      ['Le mâle a la tête verte.', "Il mange des plantes et des petites bêtes dans l'eau.", 'Il marche, il nage et il vole !'],
      { hiver: false },
    ),
    A(
      'harfang',
      'le harfang des neiges',
      '🦉',
      'approx',
      ['nord', 'champ'],
      'animaux',
      'plumes',
      ['vole'],
      'actif',
      [
        "C'est l'oiseau emblème du Québec.",
        'Son plumage blanc le cache dans la neige.',
        'Il chasse des petits animaux, comme les lemmings et les souris.',
      ],
      { habitat: false },
    ),
    A('mesange', 'la mésange à tête noire', '🐦', 'approx', ['foret', 'ville'], 'deux', 'plumes', ['vole'], 'actif', [
      'Son chant fait « tchic-a-di-di-di ».',
      "Elle reste ici tout l'hiver.",
      'Elle mange des insectes et des graines.',
    ]),
    A('grenouille', 'la grenouille léopard', '🐸', 'approx', ['etang'], 'animaux', 'peau', ['saute', 'nage'], 'fond', [
      'Elle attrape les insectes avec sa langue collante.',
      'Elle a des taches sur le dos, comme un léopard.',
      "L'hiver, elle reste au fond de l'étang, sous la glace.",
    ]),
    A(
      'tortue',
      'la tortue peinte',
      '🐢',
      'ok',
      ['etang', 'lac'],
      'deux',
      'carapace',
      ['nage', 'marche'],
      'fond',
      [
        'Elle a des lignes rouges et jaunes sur la tête et le cou.',
        'Elle se chauffe au soleil sur un tronc.',
        "L'hiver, elle reste au fond de l'étang, sous la glace.",
      ],
      { cover: false },
    ),
    A(
      'couleuvre',
      'la couleuvre rayée',
      '🐍',
      'ok',
      ['champ', 'ville'],
      'animaux',
      'ecailles',
      ['rampe'],
      'hiberne',
      [
        "Elle n'est pas dangereuse pour les humains.",
        "Elle n'a pas de pattes : elle rampe.",
        'Elle mange des vers de terre et des petites grenouilles.',
      ],
      { hiver: false },
    ),
    A(
      'omble',
      "l'omble de fontaine (truite mouchetée)",
      '🐟',
      'approx',
      ['lac'],
      'animaux',
      'ecailles',
      ['nage'],
      'actif',
      [
        "On l'appelle aussi la truite mouchetée.",
        "Elle vit dans l'eau froide et claire des ruisseaux et des lacs.",
        "Elle respire dans l'eau avec ses branchies.",
      ],
      { hiver: false },
    ),
    A(
      'saumon',
      'le saumon atlantique',
      '🐟',
      'approx',
      ['lac', 'fleuve'],
      'animaux',
      'ecailles',
      ['nage', 'saute'],
      'actif',
      [
        'Il naît dans une rivière, puis part vivre dans la mer.',
        'Il revient dans sa rivière pour pondre ses œufs.',
        'Il peut sauter par-dessus de petites chutes.',
      ],
      { hiver: false },
    ),
    A(
      'monarque',
      'le monarque',
      '🦋',
      'approx',
      ['champ'],
      'plantes',
      'insecte',
      ['vole'],
      'migre',
      [
        "Il vole jusqu'au Mexique pour passer l'hiver.",
        "Sa chenille mange seulement des feuilles d'asclépiade.",
        'Ses ailes orange avertissent les oiseaux : « Je goûte mauvais ! »',
      ],
      { cover: false },
    ),
    A(
      'abeille',
      "l'abeille",
      '🐝',
      'ok',
      ['champ', 'ville'],
      'plantes',
      'insecte',
      ['vole'],
      'autre',
      [
        'Elle butine les fleurs pour boire le nectar et ramasser le pollen.',
        'Avec le nectar, les abeilles fabriquent du miel.',
        "L'hiver, les abeilles restent serrées ensemble dans la ruche.",
      ],
      { cover: false, hiver: false },
    ),
    A(
      'coccinelle',
      'la coccinelle',
      '🐞',
      'ok',
      ['ville', 'champ'],
      'animaux',
      'insecte',
      ['vole', 'marche'],
      'dort',
      [
        'Elle mange des pucerons, des petits insectes qui abîment les plantes.',
        'Ses couleurs avertissent les oiseaux : « Je goûte mauvais ! »',
        "L'hiver, elle dort, cachée sous les feuilles ou dans une maison.",
      ],
      { cover: false, hiver: false },
    ),
    A(
      'ver',
      'le ver de terre',
      '🪱',
      'ok',
      ['champ', 'foret', 'ville'],
      'plantes',
      'peau',
      ['rampe'],
      'autre',
      [
        "Il n'a pas de pattes : il rampe dans la terre.",
        'Il mange des feuilles mortes et rend la terre meilleure pour les plantes.',
        'Il respire par sa peau, qui doit rester humide.',
      ],
      { food: false, habitat: false, hiver: false },
      { recent: true },
    ),
    A(
      'escargot',
      "l'escargot",
      '🐌',
      'ok',
      ['foret', 'ville'],
      'plantes',
      'coquille',
      ['rampe'],
      'dort',
      ['Il porte sa maison sur son dos : sa coquille.', 'Il fabrique de la bave pour glisser.', 'Il mange des feuilles et des plantes.'],
      { cover: false, hiver: false },
    ),
  ];
  SC.animal = (id) => SC.ANIMAUX.find((a) => a.id === id) || SC.DOMESTIQUES.find((a) => a.id === id);

  /** Déplacements : seulement des réponses SÛRES (oui / non). Les autres animaux ne sont pas tirés pour ce mot. */
  const ids = (f: (a: ScAnimal) => boolean): string[] => SC.ANIMAUX.filter(f).map((a) => a.id);
  SC.MOVE_Q = {
    vole: { verbe: 'volent', oui: ids((a) => a.bouge.includes('vole')), non: ids((a) => !a.bouge.includes('vole')) },
    rampe: {
      verbe: 'rampent',
      oui: ['couleuvre', 'ver', 'escargot'],
      non: ids((a) => !['couleuvre', 'ver', 'escargot', 'phoque'].includes(a.id)),
    },
    nage: {
      verbe: 'nagent',
      oui: [
        'castor',
        'orignal',
        'ours-blanc',
        'beluga',
        'phoque',
        'huard',
        'bernache',
        'canard',
        'grenouille',
        'tortue',
        'omble',
        'saumon',
      ],
      non: ['abeille', 'coccinelle', 'monarque', 'mesange', 'escargot', 'ver'],
    },
    grimpe: {
      verbe: 'grimpent aux arbres',
      oui: ['ours-noir', 'raton', 'porc-epic', 'ecureuil', 'tamia'],
      non: ['orignal', 'caribou', 'cerf', 'castor', 'beluga', 'phoque', 'omble', 'saumon', 'huard', 'bernache'],
    },
    saute: { verbe: 'sautent', oui: ['lievre', 'grenouille', 'cerf'], non: ['escargot', 'ver', 'couleuvre', 'tortue'] },
  };

  /** Animaux domestiques (UV B.1.a) — nourris par l'humain. */
  const D = (id: string, nom: string, emoji: string, nourri: string, cat: string, fid: ScFid = 'ok'): ScDomestique => ({
    id,
    nom,
    emoji,
    fid,
    nourri,
    cat,
    domestique: true,
  });
  SC.DOMESTIQUES = [
    D('chat', 'le chat', '🐱', 'des croquettes pour chat', 'croquettes'),
    D('chien', 'le chien', '🐶', 'des croquettes pour chien', 'croquettes'),
    D('vache', 'la vache', '🐄', "du foin et de l'herbe", 'foin'),
    D('poule', 'la poule', '🐔', 'des grains (de la moulée)', 'grains'),
    D('cheval', 'le cheval', '🐴', "du foin et de l'avoine", 'foin'),
    D('mouton', 'le mouton', '🐑', "de l'herbe et du foin", 'foin'),
    D('cochon', 'le cochon', '🐷', 'de la moulée (des grains moulus)', 'grains'),
    D('poisson-rouge', 'le poisson rouge', '🐠', 'des flocons pour poissons', 'flocons', 'approx'),
  ];
  SC.NOURRITURE = { croquettes: '🥣 Des croquettes', foin: '🌾 Du foin', grains: '🌽 Des grains', flocons: '🐟 Des flocons' };

  /** Vérification du schéma (appelée par skill.check, une seule fois). */
  SC.checkAnimals = function () {
    const err: string[] = [];
    const seen = new Set();
    SC.ANIMAUX.forEach((a) => {
      if (seen.has(a.id)) err.push('id en double ' + a.id);
      seen.add(a.id);
      if (!a.nom || !Array.isArray(a.faits) || a.faits.length !== 3) err.push(a.id + ' : nom/faits');
      if (!a.hab.length || a.hab.some((h) => !SC.HABITATS[h])) err.push(a.id + ' : habitat');
      if (!SC.MANGE[a.mange]) err.push(a.id + ' : mange');
      if (!SC.COUV[a.couv]) err.push(a.id + ' : couverture');
      if (!a.bouge.length || a.bouge.some((b) => !SC.BOUGE[b])) err.push(a.id + ' : bouge');
      if (!SC.HIVER[a.hiver]) err.push(a.id + ' : hiver');
      if (!a.emoji && !a.art) err.push(a.id + ' : ni emoji ni dessin');
      if (a.fid === 'none' && !a.art) err.push(a.id + ' : dessin requis');
    });
    Object.entries(SC.MOVE_Q).forEach(([k, m]) => {
      m.oui.concat(m.non).forEach((id) => {
        if (!SC.animal(id)) err.push('MOVE_Q ' + k + ' : ' + id);
      });
      if (m.oui.some((id) => m.non.includes(id))) err.push('MOVE_Q ' + k + ' : oui et non');
    });
    return err.join(', ');
  };

  M.registerData('sc.animaux', SC.ANIMAUX);
  M.registerData('sc.domestiques', SC.DOMESTIQUES);
})();
