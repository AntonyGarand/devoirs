/* =====================================================================
   skills/_commun.js — outils partagés du français (M.FR.*)
     norm, isReal          : mots réels (banque, formes, verbes, homophones, familles)
     fautes(w, n)          : fautes PLAUSIBLES (même son écrit autrement, double consonne,
                             lettre muette oubliée, accent) — jamais un vrai mot
     settle / track        : progression par mot (M.progress.item) sans crochet de résultat :
                             le résultat d'une question est lu dans l'historique de l'habileté
                             au prochain appel de gen (voir « manques du cadre »)
     pickMot               : choix pondéré (M.pickWeighted) des mots ratés ou anciens
     dictee(…)             : question de dictée (audio mot – phrase – mot)
     sceneHtml             : petite scène emoji (sur / sous / dans / à côté de)
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = (M.FR = M.FR || {});

  try {
    M.css(`
    .fr-big { font-size: 2.4rem; font-weight: 900; letter-spacing: 1px; text-align: center; margin: 4px 0 }
    .fr-em { font-size: 3.6rem; line-height: 1.1; text-align: center }
    .fr-word { font-size: 1.6rem; font-weight: 900; color: var(--subj-francais) }
    .fr-claps { letter-spacing: 2px }
    .fr-scene { display: inline-grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; width: 100%; max-width: 7.2em; aspect-ratio: 7.2 / 6.2; font-size: clamp(1rem, 4.2vw, 1.5rem); position: relative; vertical-align: middle; min-width: 0 }
    .fr-scene .o { grid-column: 2; grid-row: 2; font-size: 1.75em; display: flex; align-items: center; justify-content: center; line-height: 1 }
    .fr-scene .s { display: flex; align-items: center; justify-content: center; font-size: 1.3em; line-height: 1; z-index: 1 }
    .fr-scene .s.sur { grid-column: 2; grid-row: 1; align-items: flex-end }
    .fr-scene .s.sous { grid-column: 2; grid-row: 3; align-items: flex-start }
    .fr-scene .s.cote { grid-column: 3; grid-row: 2 }
    .fr-scene .s.dans { grid-column: 2; grid-row: 2; font-size: .9em; transform: translateY(-4px) }
    .fr-scene .s.dans ~ .o { opacity: .75 }
    .choice-btn:has(.fr-scene) { min-width: 0; padding-left: 4px; padding-right: 4px }
    @media (max-width: 600px) { .choices-grid.order:has(.fr-ord) { grid-template-columns: 1fr !important } .order-slots:has(.fr-ord) { flex-direction: column; align-items: stretch } }
    .fr-ord { font-size: 1rem; line-height: 1.25 }
    .fr-sep { display: inline-block; width: 1.4em }
    .fr-hl { background: #fff1b8; border-radius: 6px; padding: 0 3px }
    .fr-muette { color: #b8b3a6; text-decoration: underline dotted }
    .fr-gr { color: var(--subj-francais); font-weight: 900 }
    .fr-card-son { display: inline-flex; align-items: center; gap: 10px; background: #efe4fb; border-radius: 16px; padding: 6px 14px; font-weight: 800; font-size: 1.15rem }
    .fr-card-son .e { font-size: 1.8rem }
    .fr-table { border-collapse: collapse; margin: 6px auto; font-size: 1.15rem }
    .fr-table td, .fr-table th { padding: 6px 12px; border-bottom: 2px solid #eee8da; text-align: left }
    .fr-table .p { color: var(--cls-pron); font-weight: 900 }
    .fr-table .v { color: var(--cls-verbe); font-weight: 900 }
    `);
  } catch (e) {}

  /* ---------------- Normalisation et mots réels ---------------- */
  const norm = (s) => String(s).normalize('NFC').replace(/[’`]/g, '\'').trim().toLocaleLowerCase('fr-CA');
  FR.norm = norm;
  let REAL = null;
  /** Mots courants (homophones et quasi-homophones fréquents) absents de la banque : jamais proposés comme faute. */
  const VRAIS_MOTS = ('sens sent sang cent sans penser pensé panser pansé pense panse danse dense chair cher chère chaire pré prés près prêt ' +
    'coté côté côte cote cotte été étés étai était fée fées fait faits poing point mère mer maire chaîne chêne foi fois foie ' +
    'cou coup coût dé dés des dès thé tes nez né nés allé allée allez aller aile elle hôtel autel ver vers vert verre bal balle ' +
    'pot peau pause pose mais mes mets met dessin dessein cuir cuire tour tours tous tout toux ton thon ballet balai sale salle ' +
    'pâte patte tante tente compte conte comte voie voix voit vois saut sceau seau sot vin vingt vain chant champ rose roses ' +
    'gros grosse gras grâce glace classe chasse chausse cause cases case cache caché cacher marché marcher marchez marche ' +
    'parlé parler parlez jouet jouait jouer jouez joué été boucher bouché boucle poucet pousser poussé léger légère ' +
    'pain pin peint plein plain plaine pleine mien main maint lait laid les laie mot maux haut eau au aux os ' +
    'fin faim feint teint thym tain sein saint sain seing cinq cygne signe').split(' ').filter(Boolean);
  FR.realSet = () => {
    if (REAL) return REAL;
    REAL = new Set();
    const add = (w) => w && REAL.add(norm(w));
    (FR.MOTS || []).forEach((m) => { add(m.w); add(m.fem); add(m.pl); add(m.w + 's'); if (m.fem) add(m.fem + 's'); });
    Object.values(FR.VERBES || {}).forEach((v) => { add(v.inf); v.f.forEach(add); });
    (FR.HOMOPHONES || []).forEach((g) => g.forEach(add));
    (FR.FAMILLES || []).forEach((f) => [...f.mots, ...f.piege, ...f.loin].forEach(add));
    (FR.REELS || []).forEach(add);
    // formes des verbes en -er de la banque (arriver → arrive, arrivez, arrivé, arrivée…) : jamais proposées comme faute
    (FR.MOTS || []).filter((m) => m.cls === 'v' && /er$/.test(m.w)).forEach((m) => {
      const r = m.w.slice(0, -2);
      ['e', 'es', 'ent', 'ons', 'ez', 'é', 'ée', 'és', 'ées', 'ais', 'ait', 'aient', 'a', 'as', 'ai', 'era', 'erai', 'eras', 'ions', 'iez'].forEach((t) => add(r + t));
    });
    VRAIS_MOTS.forEach(add);
    return REAL;
  };
  FR.isReal = (w) => FR.realSet().has(norm(w));
  FR.homophonesOf = (w) => { const g = (FR.HOMOPHONES || []).find((x) => x.some((y) => norm(y) === norm(w))); return g ? g.filter((y) => norm(y) !== norm(w)) : []; };
  FR.isHomophone = (w) => FR.homophonesOf(w).length > 0;

  /* ---------------- Fautes plausibles ---------------- */
  const V = 'aeiouyéèêàâîôûœ';
  // [regex, remplacements] — ordre de préférence (même son d'abord)
  // Les « lookbehind » (?<…) n'existent qu'à partir de Safari 16.4 : construits à l'exécution, ignorés si non pris en charge
  // (une regex littérale ferait échouer tout le fichier sur un vieil iPad).
  const R = (src) => { try { return new RegExp(src, 'g'); } catch (e) { return null; } };
  const RULES = [
    [/eau/g, ['au', 'o']],
    [R("(?<!e)au"), ['o', 'eau']],
    [R("(?<![aeoué])o(?![nmiuy])"), ['au']],
    [/ain(?![aeiouyn])/g, ['in', 'ein']],
    [/ein(?![aeiouyn])/g, ['ain', 'in']],
    [R("(?<![aeoué])in(?![aeiouyn])"), ['ain']],
    [/an(?![aeiouyn])/g, ['en']],
    [R("(?<![iéy])en(?![aeiouynt]|t$|s$)"), ['an']],
    [R("(?<![iéy])ent"), ['ant']],
    [/ant/g, ['ent']],
    [/am(?=[bp])/g, ['an']],
    [/om(?=[bp])/g, ['on']],
    [/ai(?![nm])/g, ['è', 'é']],
    [/ê/g, ['è', 'ai']],
    [/è/g, ['ai', 'é']],
    [/ei(?![nl])/g, ['è', 'ai']],
    [/er$/g, ['é', 'ez']],
    [/é$/g, ['er', 'ez']],
    [/ez$/g, ['é', 'er']],
    [/ss/g, ['s', 'c']],
    [/c(?=[eiy])/g, ['s', 'ss']],
    [/ç/g, ['ss', 's']],
    [/ph/g, ['f']],
    [R("(?<=[aeiouy])s(?=[aeiouy])"), ['z']],
    [/qu/g, ['k', 'c']],
    [/g(?=[ei])/g, ['j']],
    [/j(?=[ei])/g, ['g']],
    [/oi/g, ['oa']],
    [/gn/g, ['ni']],
    [/tt/g, ['t']], [R("ll(?<!ill)"), ['l']], [/mm/g, ['m']], [/nn/g, ['n']], [/pp/g, ['p']], [/rr/g, ['r']], [/ff/g, ['f']],
    [R("(?<=[aeiou])t(?=[aeiou])"), ['tt']], [R("(?<=[aeiou])r(?=[aeiou])"), ['rr']], [R("(?<=[aeiou])l(?=[aeiou])"), ['ll']],
    [/é/g, ['e']], [/è/g, ['e']], [/ê/g, ['e']], [/à/g, ['a']], [/â/g, ['a']], [/ô/g, ['o']], [/î/g, ['i']], [/ç/g, ['c']],
    [R("(?<=[^aeiouy])e$"), ['']],
  ].filter((r) => r[0]);
  /** Toutes les fautes candidates (une seule transformation chacune), par ordre de préférence. */
  FR.fautesAll = function (w, extra = []) {
    const out = [];
    const low = w;
    const push = (x) => { if (x && x !== w && !out.includes(x)) out.push(x); };
    // lettre muette finale connue (mots.js)
    const m = FR.mot ? FR.mot(w) : null;
    RULES.forEach(([re, reps]) => {
      const rx = new RegExp(re.source, re.flags.replace('g', '') + 'g');
      let mm;
      while ((mm = rx.exec(low))) {
        const i = mm.index, L = mm[0].length;
        reps.forEach((r) => push(low.slice(0, i) + r + low.slice(i + L)));
        if (!L) rx.lastIndex++;
      }
    });
    if (m && m.mu && w.endsWith(m.mu)) push(w.slice(0, -m.mu.length));
    else if (/[aeiouyn][tdsx]$/.test(w) && w.length > 3) push(w.slice(0, -1));
    extra.forEach(push);
    return out.filter((x) => x.length >= 2 && !/^\s|\s$|''|--/.test(x));
  };
  /** Finale en [é] écrite é / ée / és / er / ez (pas encore enseignée en début de 2e année). */
  const FIN_E = (x) => (/(ées|ée|és|é|er|ez)$/.exec(norm(x)) || [''])[0];
  /** n fautes plausibles, toutes différentes du mot et entre elles, jamais un vrai mot.
      noEr : aucune faute qui change une finale é / er / ez (ni qui en crée une). */
  FR.fautes = function (w, n = 2, { exclude = [], noEr = false } = {}) {
    const bad = new Set([norm(w), ...exclude.map(norm)]);
    const ok = FR.fautesAll(w).filter((x) => !bad.has(norm(x)) && !FR.isReal(x) && (!noEr || FIN_E(x) === FIN_E(w)));
    // préférer les premières (même son), avec un peu de hasard
    const top = M.shuffle(ok.slice(0, Math.max(n + 2, 4)));
    const res = [];
    for (const x of top.concat(ok)) { if (res.length >= n) break; if (!res.some((y) => norm(y) === norm(x))) res.push(x); }
    return res;
  };

  /* ---------------- Progression par mot (résultat lu au prochain gen) ---------------- */
  const PENDING = {};
  FR.settle = (skillId) => {
    const pend = PENDING[skillId];
    if (!pend) return;
    const s = M.progress.data().skills[skillId];
    if (s && s.n === pend.n + 1 && s.hist.length) M.progress.item(skillId, pend.key).record(s.hist[s.hist.length - 1] === 1);
    delete PENDING[skillId];
  };
  FR.track = (skillId, key) => {
    const s = M.progress.data().skills[skillId];
    PENDING[skillId] = { key, n: s ? s.n : 0 };
  };
  /** Choisit un mot (pondéré : ratés et jamais vus d'abord) et le note comme « en attente ». */
  FR.pickMot = (skillId, pool, keyFn = (m) => m.w) => {
    FR.settle(skillId);
    const m = M.pickWeighted(pool, keyFn, skillId);
    FR.track(skillId, keyFn(m));
    return m;
  };

  /* ---------------- Petits outils ---------------- */
  FR.mots = (pred) => (FR.MOTS || []).filter(pred);
  FR.esc = M.esc;
  FR.b = (w) => `<b>${M.esc(w)}</b>`;
  FR.q = (w) => `« ${w} »`;
  /** Choix texte (value = libellé) avec lecture facultative. */
  FR.choices = (arr, sayIt) => M.shuffle(arr).map((x) => ({ label: M.esc(x), value: x, ...(sayIt ? { say: x } : {}) }));
  FR.uniqueNorm = (arr) => new Set(arr.map(norm)).size === arr.length;
  /** Déterminant d'un nom de la banque. */
  FR.un = (m) => (m.g === 'f' ? 'une' : 'un');
  const H_MUET = ['hiver', 'histoire', 'heure', 'homme', 'herbe', 'hôpital', 'habit'];
  FR.elide = (w) => /^[aeiouyéèêàâîôûœ]/i.test(w) || H_MUET.includes(w);
  FR.le = (m) => (FR.elide(m.w) ? 'l\'' : m.g === 'f' ? 'la ' : 'le ');
  FR.plur = (m) => m.pl || (/[sxz]$/.test(m.w) ? m.w : m.w + 's');
  FR.fem = (m) => m.fem;

  /** Explication de l'orthographe d'un mot (régularités tirées de gr ou de la lettre muette). */
  FR.motTip = (m) => {
    if (!m) return '';
    const tips = [];
    if (m.gr) {
      const hard = m.gr.find((p) => p.g.length > 1 && p.s && FR.son && FR.son(p.s) && FR.son(p.s).multi);
      if (hard) tips.push(`On entend [${hard.s}] : ici, il s'écrit <b>${hard.g}</b>.`);
    }
    if (m.mu) tips.push(`Une lettre muette se cache à la fin : <b>${m.mu}</b>${m.why ? ` (on l'entend dans ${FR.q(m.why)})` : ''}.`);
    return tips.join(' ');
  };
  /** Le mot avec ses lettres muettes en gris (si connues). */
  FR.motHtml = (m) => {
    if (!m.gr) return M.esc(m.w);
    return m.gr.map((p) => (p.s === '' ? `<span class="fr-muette">${M.esc(p.g)}</span>` : M.esc(p.g))).join('');
  };

  /**
   * Question de dictée : écoute (mot – phrase – mot), écris le mot.
   * opts : { phrase, prefix, hint, explain, caseSensitive, keyboard }
   */
  FR.dictee = (w, opts = {}) => {
    const seq = opts.phrase ? [w, opts.phrase, w] : [w, w];
    const q = {
      prompt: opts.prompt || 'Écoute et écris le mot.',
      audio: { seq, pause: 900, autoplay: 'once' },
      format: 'text', answer: w, keyboard: opts.keyboard || (/\s/.test(w) ? 'full' : 'accents'),
      hint: opts.hint || 'Dis le mot lentement. Quels sons entends-tu ?',
      explain: opts.explain || `On écrit <b>${M.esc(w)}</b>. Regarde-le bien, dis-le, cache-le, écris-le, vérifie !`,
    };
    if (opts.prefix) q.prefix = opts.prefix;
    if (opts.caseSensitive) q.caseSensitive = opts.caseSensitive;
    return q;
  };

  /** Tuiles-lettres pour construire un mot (+ k lettres intruses plausibles). */
  FR.letterTiles = (w, k = 2) => {
    const letters = [...w];
    // une intruse ne doit jamais permettre d'écrire un autre vrai mot (ex. vert → vers)
    const makesReal = (c) => letters.some((_, i) => FR.isReal(letters.slice(0, i).join('') + c + letters.slice(i + 1).join('')));
    const pool = 'aeiouéèsntrlmpcdbfgv'.split('').filter((c) => !letters.includes(c) && !makesReal(c));
    const extra = M.shuffle(pool).slice(0, k);
    return { tiles: letters.concat(extra), answer: letters };
  };

  /** Scène emoji : sujet placé sur / sous / dans / à côté de l'objet. */
  FR.sceneHtml = (suj, rel, obj) => `<span class="fr-scene" aria-label="${M.esc(suj.le + ' ' + rel.mot + ' ' + obj.le)}"><span class="s ${rel.id}">${suj.em}</span><span class="o">${obj.em}</span></span>`;

  /** Mot-repère d'un son (jamais de son isolé à voix haute). */
  FR.sonRef = (id) => { const s = FR.son(id); return s ? `le son <b>${s.label}</b> comme dans <b>${s.repere}</b> ${s.em}` : id; };
  FR.sonCard = (id) => { const s = FR.son(id); return `<span class="fr-card-son"><span class="e">${s.em}</span>${s.label} comme dans <b>${s.repere}</b></span>`; };
  FR.sonSay = (id) => { const s = FR.son(id); return `le son de ${s.repere}`; };
  /** Le mot contient-il le son (ou un son proche) ? */
  FR.hasSon = (m, id) => !!(m.gr && m.gr.some((p) => p.s === id));
  FR.hasNear = (m, id) => { const s = FR.son(id); const near = [id, ...((s && s.confond) || [])]; return !!(m.gr && m.gr.some((p) => near.includes(p.s))); };
  /** Indices des lettres qui font le son id. */
  FR.letterIdx = (m, id) => { const out = []; let i = 0; m.gr.forEach((p) => { [...p.g].forEach(() => { if (p.s === id) out.push(i); i++; }); }); return out; };
  /** Mot surligné : graphèmes du son id en couleur. */
  FR.grHtml = (m, id) => m.gr.map((p) => (p.s === id ? `<span class="fr-gr">${M.esc(p.g)}</span>` : M.esc(p.g))).join('');
  /** Position du son : 'debut' | 'milieu' | 'fin' (null si ambigu ou absent plusieurs fois). */
  FR.position = (m, id) => {
    const sounding = m.gr.filter((p) => p.s !== '');
    const idx = sounding.map((p, i) => (p.s === id ? i : -1)).filter((i) => i >= 0);
    if (idx.length !== 1) return null;
    const i = idx[0];
    if (i === 0) return 'debut';
    if (i === sounding.length - 1) return 'fin';
    return 'milieu';
  };

  /** Contrôle commun : aucune valeur de choix en double après normalisation; réponse présente. */
  FR.checkChoices = (q) => {
    if (q.choices) {
      const labels = q.choices.map((c) => norm(M.text ? String(c.value) : c.value));
      if (new Set(labels).size !== labels.length) return 'choix en double après normalisation';
    }
  };
})();
