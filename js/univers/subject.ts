/* =====================================================================
   Univers social et Culture et citoyenneté québécoise (CCQ) — matière et domaines
   Voir docs/hld/univers-social.md. Préfixe des ids : us-
   Helpers partagés : M.us (données, accords, choix étiquetés, vérifications R1–R8)
   ===================================================================== */

/** Étiquette d'un choix (R4) : ok = bonne réponse, harm = geste qui blesse, off = hors sujet, opp = émotion opposée. */
type UsTag = 'ok' | 'harm' | 'off' | 'opp';
/** Choix à étiqueter (M.us.tagged). */
interface UsTagItem {
  label: string;
  tag: UsTag;
  why?: string;
}
/** Choix étiqueté produit par M.us.tagged (l'étiquette reste sur le choix pour M.us.lintTags). */
interface UsTaggedChoice extends Choice<string> {
  tag: UsTag;
}
/** Choix d'un format choice et sa réponse (à étaler dans la question). */
interface UsChoiceSet<C extends Choice<string> = Choice<string>> {
  choices: C[];
  answer: string;
}
/** Données de la matière par id court : M.us.d('fetes') = M.data['us-fetes']. */
type UsData = { [K in keyof DataRegistry as K extends `us-${infer R}` ? R : never]: DataRegistry[K] };
/** Helpers partagés de l'univers social (M.us); les habiletés en ajoutent (planHtml, pic, timelineHtml, treeSvg). */
interface UsApi {
  d<K extends keyof UsData>(id: K): UsData[K];
  /** Accord selon la personne : g(who, 'fâché', 'fâchée'). */
  g(who: { f?: boolean }, m: string, f: string): string;
  cap(s: string): string;
  tagged(items: readonly UsTagItem[]): UsChoiceSet<UsTaggedChoice>;
  lintTags(q: Question): CheckResult;
  say(t: string): string;
  simple(answer: string, distract: readonly string[]): UsChoiceSet;
  /** x, ou une erreur claire si la donnée cherchée manque (what). */
  must<T>(x: T | null | undefined, what: string): T;
}
interface MApi {
  us: UsApi;
}

(function () {
  'use strict';
  const M = window.M;
  const US_NOTE =
    "Au 1<sup>er</sup> cycle, la géographie, l'histoire et l'éducation à la citoyenneté ne sont pas une matière distincte au bulletin : " +
    'ces apprentissages sont intégrés aux autres matières (PFEQ, ch. 7). La Culture et citoyenneté québécoise (CCQ) est enseignée, avec peu de temps en classe. ' +
    "Ici, c'est du contenu d'intégration et d'enrichissement : pour découvrir et en parler, sans pression.";

  M.registerSubject({
    id: 'univers',
    title: 'Univers social',
    icon: '🗺️',
    color: '#06a77d',
    soft: '#dcf7ee',
    desc: 'Mon monde, ma communauté, mon Québec : émotions, règles, familles, quartier, plans, fêtes, avant et maintenant.',
    /** Note aux parents (répétée sur le domaine us-moi-autres : la page Parents affiche les notes des domaines). */
    parentNote: US_NOTE,
    /** Règles de la matière (R5, R4) : rien sur la vie privée dans le noté; une seule réponse « ok » si les choix sont étiquetés. */
    lint(q, skill) {
      if ((q.format || q.input) === 'reflect') return;
      const graded = [
        q.prompt,
        q.say,
        q.passage && ((typeof q.passage === 'object' && q.passage.html) || ''),
        ...(('steps' in q && q.steps) || []).filter((s) => s.format !== 'reflect').map((s) => s.prompt),
      ]
        .filter((t) => typeof t === 'string')
        .join(' ');
      const p = M.lint.noPrivate(graded);
      if (p) return p;
      if (/\b(ta|ton|tes) (famille|maman|papa|parents|religion|croyance|maison)\b/i.test(graded))
        return "vie privée : question sur la famille de l'enfant";
      const t = M.us.lintTags(q);
      if (t) return t;
      for (const s of ('steps' in q && q.steps) || []) {
        const e = M.us.lintTags(s);
        if (e) return 'étape : ' + e;
      }
      if (skill && skill.ungraded) return 'habileté non notée qui produit une question notée';
    },
  });

  [
    {
      id: 'us-moi-autres',
      title: 'Moi et les autres',
      icon: '💛',
      color: '#06a77d',
      soft: '#dcf7ee',
      pda: 'CCQ — Connaissance de soi (émotions, besoins); Relations entre les individus : rôles et responsabilités, civilité',
      parentNote:
        '<b>Univers social au 1<sup>er</sup> cycle</b> : ' +
        US_NOTE +
        "<br>Les questions d'émotions sont notées seulement à partir d'<b>indices visibles</b> (visage, gestes, paroles) chez des personnages fictifs. On ne demande jamais à l'enfant ce qu'il ressent : les cartes « 💬 Parles-en » ne sont pas notées et rien n'est enregistré.",
    },
    {
      id: 'us-communaute',
      title: 'Ma famille et ma communauté',
      icon: '🏘️',
      color: '#058a68',
      soft: '#d6f2e8',
      pda: 'CCQ — Relations (diversité des familles, relations intergénérationnelles); Rapports aux autres êtres vivants · GHEC — Groupes et éléments humains (2.3, 2.4, A.2, A.4)',
      parentNote:
        "Toutes sortes de familles sont montrées (un parent, deux mamans, deux papas, recomposée, d'accueil, adoptive, grands-parents…), toujours comme également valables. Aucune question ne porte sur la famille de l'enfant.",
    },
    {
      id: 'us-reperer',
      title: 'Se repérer',
      icon: '🧭',
      color: '#0a8f86',
      soft: '#d8f1ef',
      pda: 'GHEC — Localisation (A.1 a–b), éléments naturels (A.3), techniques : lire un plan, une légende, les points cardinaux',
    },
    {
      id: 'us-quebec',
      title: 'Le Québec et ses fêtes',
      icon: '⚜️',
      color: '#2a7f62',
      soft: '#e0f0e8',
      pda: 'CCQ — Célébrations (traditions, repas, cérémonies religieuses et séculières) · Enrichissement : emblèmes du Québec',
      parentNote:
        'Les fêtes de plusieurs traditions sont présentées comme des faits culturels (« certaines familles… »), au même niveau de détail. Le quand (mois, saison) est travaillé en mathématique (Le calendrier).',
    },
    {
      id: 'us-temps',
      title: 'Avant et maintenant',
      icon: '⏳',
      color: '#3d8b5a',
      soft: '#e3f1e5',
      pda: "GHEC — Hier et aujourd'hui (changements, ~100 ans); A.1 d–f : ligne du temps, âges de la vie · CCQ — Étapes de la vie depuis la naissance",
    },
  ].forEach((d) => M.registerDomain({ subject: 'univers', ...d }));

  /* ================= Helpers partagés ================= */
  const us = (M.us = M.us || ({} as UsApi));
  /** Données de la matière (enregistrées avec M.registerData('us-…')). */
  // as : TS ne relie pas DataRegistry[`us-${K}`] à UsData[K] (même type, clé remappée).
  us.d = <K extends keyof UsData>(id: K): UsData[K] => M.data[`us-${id}`] as UsData[K];
  /** Accord : 'fâché'/'fâchée' selon la personne. */
  us.g = (who, m, f) => (who.f ? f : m);
  us.cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  /** Choix étiquetés (R4) → format choice. items = [{label, tag:'ok'|'harm'|'off'|'opp', why?}] */
  us.tagged = (items) => {
    const sh: UsTaggedChoice[] = M.shuffle(items).map((c, i) => ({
      label: c.label,
      value: 'c' + i,
      tag: c.tag,
      ...(c.why ? { why: c.why } : {}),
    }));
    const ok = sh.find((c) => c.tag === 'ok');
    if (!ok) throw new Error('M.us.tagged : aucun choix « ok »');
    return { choices: sh, answer: ok.value };
  };
  /** R4 : une seule réponse ok, distracteurs étiquetés, et la réponse = le choix ok. */
  us.lintTags = (q) => {
    if (!('choices' in q)) return;
    const ch: (Choice & { tag?: string })[] = q.choices;
    if (!Array.isArray(ch) || !ch.some((c) => c.tag)) return;
    const ok = ch.filter((c) => c.tag === 'ok');
    if (ok.length !== 1) return `R4 : ${ok.length} réponse(s) « ok »`;
    if (ch.some((c) => !['ok', 'harm', 'off', 'opp'].includes(c.tag || ''))) return 'R4 : distracteur sans étiquette harm/off/opp';
    if (String(ok[0].value) !== String(q.answer)) return "R4 : la réponse n'est pas le choix « ok »";
  };
  us.must = (x, what) => {
    if (x == null) throw new Error('univers social : donnée introuvable (' + what + ')');
    return x;
  };
  /** Bouton 🔊 compact */
  us.say = (t) => M.ui.speak(M.text(t));
  /** Chaîne de choix simples à partir de libellés (bonne réponse + distracteurs). */
  us.simple = (answer, distract) => {
    const ch = M.shuffle([answer, ...distract]).map((l, i) => ({ label: l, value: 'v' + i }));
    const ok = ch.find((c) => c.label === answer);
    if (!ok) throw new Error('M.us.simple : réponse absente');
    return { choices: ch, answer: ok.value };
  };

  M.css(`
    .us-tl { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px }
    .us-tl .timeline { min-width: 560px }
    .us-swipe { display: none; text-align: center; font-weight: 800; color: var(--muted); font-size: .95rem }
    @media (max-width: 600px) { .us-tl .timeline { min-width: 760px } .us-swipe { display: block } }
    @media (max-width: 520px) {
      .us-cmp .compare { grid-template-columns: 1fr }
      .us-cmp .cmp-vs { transform: rotate(90deg); justify-self: center }
    }
    .us-leg { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 6px }
    .us-leg .chip { font-size: 1rem }
    .us-tree { width: 100%; max-width: 520px; height: auto; display: block; margin: 0 auto }
    .us-tree text { font-weight: 800; fill: var(--ink) }
    .us-flags { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px }
    .us-flag { width: 100%; max-width: 130px; height: auto; border: 2px solid var(--line); border-radius: 4px; display: block; margin: 0 auto }
    .us-art-lbl { display: flex; flex-direction: column; align-items: center; gap: 2px }
    .us-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px }
    .us-tile { background: #fbfaf6; border: 3px solid var(--line); border-radius: 18px; padding: 10px; text-align: center; cursor: pointer }
    .us-tile .em { font-size: 2.4rem; display: block }
    .us-tile b { display: block; margin: 4px 0 }
    .us-tile small { display: block; font-weight: 700; color: var(--muted) }
    .us-steps-pl { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px }
    .us-plan-info { min-height: 3.2em; text-align: center; font-weight: 800; font-size: 1.15rem; margin-top: 8px }
    .us-mytl { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center }
    @media (max-width: 480px) { .us-flags { gap: 4px } }
  `);
})();
