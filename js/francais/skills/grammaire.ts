/* =====================================================================
   skills/grammaire.js — Les classes de mots et les accords (fr-grammaire)
     fr-classes-mots, fr-genre-nombre, fr-accords-gn
   Couleurs des classes : --cls-nom, --cls-det, --cls-adj, --cls-verbe, --cls-pron (M.ui.tagged).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const D = 'fr-grammaire';
  const TAG = { n: 'nom', d: 'det', a: 'adj', v: 'verbe', p: 'pron', x: null };
  const NOMCLS = { n: 'un <b>nom</b>', d: 'un <b>déterminant</b>', a: 'un <b>adjectif</b>', v: 'le <b>verbe</b>' };
  const TRUC = {
    n: 'Truc : on peut mettre <b>un</b> ou <b>une</b> devant un nom.',
    d: 'Truc : le déterminant est le petit mot juste avant le nom (<b>le, la, un, une, mon…</b>).',
    a: 'Truc : on peut mettre <b>très</b> devant un adjectif.',
    v: 'Truc : on peut encadrer le verbe avec <b>ne… pas</b>.',
  };
  const taggedHtml = (ws) => M.ui.tagged(ws.map((x) => ({ w: x.w, tag: TAG[x.tag] || '' })));
  // Mots sans double classe, pour les trucs (manipulations) : aucun verbe qui est aussi un nom (un écrit, la joue, un conduit,
  // une attrape) ou qui sonne comme un nom (boit/bois, rit/riz, mord/mors, oublie/oubli, sourit/souris, pleure/pleur, galope/galop).
  const VERBES = [
    'dort',
    'mange',
    'chante',
    'picore',
    'grignote',
    'jappe',
    'dessine',
    'arrose',
    'prépare',
    'trouve',
    'regarde',
    'promène',
    'parle',
    'arrive',
    'aime',
    'habite',
    'ouvre',
    'grimpe',
    'raconte',
    'cherche',
    'ramasse',
    'éternue',
  ];
  // Adjectifs qui ne sont pas aussi des noms (le froid, le noir, un petit, un grand…)
  const ADJS = [
    'joli',
    'gentil',
    'content',
    'mouillé',
    'fatigué',
    'heureux',
    'joyeux',
    'triste',
    'timide',
    'fâché',
    'doux',
    'lent',
    'facile',
    'bruyant',
  ];
  // Noms qui sont aussi un verbe (il livre, il neige, il fête, il mouche…), un adjectif (orange, chocolat, très bébé…)
  // ou qui sonnent comme un verbe (pain/peint, nid/nie, fée/fait, nez/naît, loup/loupe, cygne/signe) : jamais dans les trucs.
  const DOUBLE = [
    'livre',
    'fête',
    'neige',
    'bouche',
    'souris',
    'mouche',
    'orange',
    'chocolat',
    'café',
    'citron',
    'fraise',
    'cochon',
    'vache',
    'bébé',
    'fille',
    'garçon',
    'cygne',
    'nid',
    'pain',
    'loup',
    'fée',
    'nez',
    'carotte',
    'patate',
    'prince',
    'reine',
    'lune',
  ];
  const NOMS = () =>
    FR.mots(
      (m) =>
        m.cls === 'nom' &&
        m.em &&
        (m.g === 'm' || m.g === 'f') &&
        !['lit', 'porte', 'marche', 'bois', 'été', 'pied'].includes(m.w) &&
        /^[a-zàâçéèêîôûœ]+$/.test(m.w),
    );
  const NOMS1 = () => NOMS().filter((m) => !DOUBLE.includes(m.w));
  const DETS = ['un', 'une', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'ce', 'cette', 'notre', 'votre', 'chaque', 'deux', 'trois'];

  /* ---------------- 🏷️ Nom, déterminant, adjectif, verbe ---------------- */
  M.registerSkill({
    id: 'fr-classes-mots',
    domain: D,
    title: 'Nom, déterminant, adjectif, verbe',
    icon: '🏷️',
    learn: 'fr-sortes-de-mots',
    desc: 'Quelle sorte de mot est-ce ? Utilise tes trucs !',
    pda: 'Accords A.1 a.i, b.i (nom); A.2 a, e (déterminant); A.3 b.ii (adjectif, → 2e); A.4 b.i (verbe, → 2e)',
    gen({ lvl }) {
      const targets = lvl === 0 ? ['n', 'd'] : lvl === 1 ? ['n', 'd', 'v'] : ['n', 'd', 'v', 'a'];
      const r = Math.random();
      if (lvl === 0 && r < 0.4) {
        const ns = M.shuffle(NOMS1()).slice(0, 3),
          ds = M.shuffle(DETS).slice(0, 3);
        return {
          prompt: 'Classe les mots : <b>nom</b> ou <b>déterminant</b> ?',
          format: 'sort',
          bins: [
            { id: 'n', label: '🔵 Nom' },
            { id: 'd', label: '🟣 Déterminant' },
          ],
          items: M.shuffle([...ns.map((m) => ({ label: `${m.em} ${m.w}`, bin: 'n' })), ...ds.map((d) => ({ label: d, bin: 'd' }))]),
          hint: 'Un nom, on peut le dessiner ou mettre <b>un</b>/<b>une</b> devant. Un déterminant est un petit mot qui va devant le nom.',
          explain: `Les noms : ${ns.map((m) => m.w).join(', ')}. Les déterminants : ${ds.join(', ')}.`,
        };
      }
      if (lvl >= 1 && r < 0.3) {
        const t = M.pick(targets.filter((x) => x !== 'd'));
        const yes = Math.random() < 0.5;
        let w, test;
        // nom : seulement le BON déterminant (« un mouton », jamais « une mouton »); verbe : n' devant voyelle ou h muet
        if (t === 'n') {
          const m = yes ? M.pick(NOMS1()) : null;
          w = yes ? m.w : M.pick(VERBES);
          test = `« ${yes ? FR.un(m) : M.pick(['un', 'une'])} ${w} »`;
        } else if (t === 'v') {
          w = yes ? M.pick(VERBES) : M.pick(NOMS1()).w;
          test = `« Il ${M.fr.ne(w)} pas. »`;
        } else {
          w = yes ? M.pick(ADJS) : M.pick(NOMS1()).w;
          test = `« très ${w} »`;
        }
        return {
          prompt: `Peut-on dire ${test} ?<br>Alors, le mot <b>${w}</b> est-il ${NOMCLS[t].replace('le ', 'un ')} ?`,
          format: 'tf',
          answer: yes,
          labels: [{ label: `✔️ Oui, c'est ${NOMCLS[t].replace('le ', 'un ').replace(/<\/?b>/g, '')}` }, { label: '✖️ Non' }],
          hint: `${TRUC[t]} Dis-le à voix haute : est-ce que ça se dit ?`,
          explain:
            (yes
              ? `On peut dire ${test} : <b>${w}</b> est ${NOMCLS[t].replace('le ', 'un ')}.`
              : `${test} ne se dit pas : <b>${w}</b> n'est pas ${NOMCLS[t].replace('le ', 'un ')}.`) + ` ${TRUC[t]}`,
        };
      }
      const t = M.pick(targets);
      const pool = FR.PHRASES.filter((p) => p.lvl <= Math.max(1, lvl) && FR.phraseWords(p).some((x) => x.tag === t));
      const ph = M.pick(pool);
      const ws = FR.phraseWords(ph);
      const words = ws.map((x, i) => (i === 0 ? M.fr.cap(x.w) : x.w) + (i === ws.length - 1 ? '.' : ''));
      const answer = ws.map((x, i) => (x.tag === t ? i : -1)).filter((i) => i >= 0);
      const label = { n: 'un <b>nom</b>', d: 'un <b>déterminant</b>', a: 'un <b>adjectif</b>', v: 'le <b>verbe</b>' }[t];
      return {
        prompt: `Touche ${label}.`,
        format: 'tapwords',
        words,
        answer,
        select: 'one',
        hint: TRUC[t],
        explain: `${answer.length > 1 ? `Il y avait ${answer.length} bonnes réponses : ${answer.map((i) => `<b>${M.esc(ws[i].w)}</b>`).join(', ')}.` : ''} ${TRUC[t]}${taggedHtml(ws)}`,
      };
    },
    check(q) {
      if (q.format === 'tapwords' && q.answer.some((i) => !q.words[i])) return 'indice hors phrase';
    },
  });

  /* ---------------- 👦👧 Masculin, féminin, singulier, pluriel ---------------- */
  const UNCOUNT = [
    'eau',
    'neige',
    'pluie',
    'musique',
    'café',
    'lait',
    'soleil',
    'lune',
    'automne',
    'hiver',
    'printemps',
    'air',
    'pain',
    'chocolat',
    'été',
  ];
  const regPl = (m) => !m.pl && !/[sxz]$/.test(m.w) && !UNCOUNT.includes(m.w);
  M.registerSkill({
    id: 'fr-genre-nombre',
    domain: D,
    title: 'Masculin, féminin, singulier, pluriel',
    icon: '👦',
    learn: 'fr-accords',
    desc: '<i>Un</i> ou <i>une</i> ? <i>Un</i> ou <i>des</i> ?',
    pda: 'Accords A.1 a.iii–iv (genre et nombre du nom); D.1 a.i (+ s, ★ 2e); D.1 a.ii–b, D.5 a (x, aux, féminin + e, → 2e)',
    gen({ lvl }) {
      const N = NOMS();
      if (lvl === 0) {
        if (Math.random() < 0.5) {
          const ms = M.shuffle(N.filter((m) => m.g === 'm')).slice(0, 2),
            fs = M.shuffle(N.filter((m) => m.g === 'f')).slice(0, 2);
          return {
            prompt: 'Classe les noms : <b>un</b> ou <b>une</b> ?',
            format: 'sort',
            bins: [
              { id: 'm', label: 'un 👦' },
              { id: 'f', label: 'une 👧' },
            ],
            items: M.shuffle([...ms, ...fs]).map((m) => ({ label: `${m.em} ${m.w}`, bin: m.g, say: m.w })),
            hint: "Dis « un … » puis « une … ». Qu'est-ce qui sonne bien ?",
            explain: `On dit ${ms.map((m) => `<b>un</b> ${m.w}`).join(', ')} (masculin) et ${fs.map((m) => `<b>une</b> ${m.w}`).join(', ')} (féminin).`,
          };
        }
        const m = M.pick(N);
        return {
          prompt: `<b>Un</b> ou <b>une</b> ?<div class="fr-big"><span class="fr-hl">&nbsp;?&nbsp;</span> ${m.w}</div>`,
          say: `Un ou une ? ${m.w}.`,
          scene: [{ emoji: m.em, label: m.w }],
          format: 'choice',
          answer: FR.un(m),
          choices: [
            { label: '<span class="fr-big" style="font-size:1.6rem">un</span>', value: 'un' },
            { label: '<span class="fr-big" style="font-size:1.6rem">une</span>', value: 'une' },
          ],
          hint: 'Dis les deux à voix haute.',
          explain: `On dit <b>${FR.un(m)} ${m.w}</b> : <b>${m.w}</b> est ${m.g === 'f' ? 'féminin' : 'masculin'}.`,
        };
      }
      if (lvl === 1) {
        const m = M.pick(N.filter(regPl));
        const many = Math.random() < 0.6;
        const pl = FR.plur(m);
        return {
          prompt: 'Complète avec le bon mot.',
          scene: [{ emoji: many ? m.em.repeat(3) : m.em, label: many ? 'plusieurs' : 'un seul' }],
          format: 'cloze',
          text: many ? `Je vois des {0}.` : `Je vois ${FR.un(m)} {0}.`,
          blanks: [{ choices: M.shuffle([m.w, pl]), answer: many ? pl : m.w }],
          hint: many ? 'Il y en a plusieurs : <b>des</b> → on ajoute un <b>s</b>.' : 'Il y en a un seul : pas de <b>s</b>.',
          explain: many
            ? `<b>des</b> ${pl} : au pluriel, on ajoute un <b>s</b> (qu'on n'entend pas).`
            : `<b>${FR.un(m)}</b> ${m.w} : au singulier, pas de <b>s</b>.`,
        };
      }
      // lvl 2 : pluriels en x / aux, féminin + e
      if (Math.random() < 0.55) {
        const m = M.pick(FR.mots((x) => x.cls === 'nom' && x.pl && /(eaux|eux|aux)$/.test(x.pl) && !['ciel', 'mal', 'œil'].includes(x.w)));
        return {
          prompt: `Écris le mot au pluriel.<div class="fr-big" style="font-size:1.5rem">un ${m.w} ${m.em || ''}</div>`,
          say: `Un ${m.w}, deux… Écris le mot au pluriel.`,
          format: 'text',
          prefix: 'deux',
          answer: m.pl,
          hint: /al$/.test(m.w) ? '<b>al</b> devient <b>aux</b> au pluriel.' : 'Après <b>eau</b> ou <b>eu</b>, on ajoute un <b>x</b>.',
          explain: `Un ${m.w}, deux <b>${m.pl}</b>. ${/al$/.test(m.w) ? '<b>-al</b> → <b>-aux</b>' : 'On ajoute un <b>x</b>'}.`,
        };
      }
      // seulement des noms et des adjectifs (jamais un déterminant comme « tout »)
      const m = M.pick(FR.mots((x) => x.fem && x.fem === x.w + 'e' && (x.cls === 'nom' || x.cls === 'adj')));
      const adj = m.cls === 'adj';
      return {
        prompt: adj
          ? `Écris l'adjectif au féminin.<div class="fr-big" style="font-size:1.5rem">Il est ${m.w}.</div>`
          : `Écris le nom au féminin.<div class="fr-big" style="font-size:1.5rem">un ${m.w}</div>`,
        say: adj ? `Il est ${m.w}. Elle est… Écris l'adjectif au féminin.` : `Un ${m.w}, une… Écris le nom au féminin.`,
        format: 'text',
        prefix: adj ? 'Elle est' : 'une',
        answer: m.fem,
        hint: 'Au féminin, on ajoute souvent un <b>e</b>.',
        explain: `${adj ? 'Elle est' : 'une'} <b>${m.fem}</b> : on ajoute un <b>e</b>${m.mu ? `, et on entend maintenant le <b>${m.mu}</b>` : ''}.`,
      };
    },
  });

  /* ---------------- 🔗 Les accords dans le groupe du nom ---------------- */
  const ADJ4 = [
    { m: 'petit', pos: 'avant' },
    { m: 'grand', pos: 'avant' },
    { m: 'joli', pos: 'avant' },
    { m: 'noir', pos: 'après' },
    { m: 'vert', pos: 'après' },
    { m: 'brun', pos: 'après' },
    { m: 'bleu', pos: 'après' },
  ];
  const forms = (a) => ({ ms: a.m, fs: a.m + 'e', mp: a.m + 's', fp: a.m + 'es' });
  const gn = (det, adj, nom, a) => (a.pos === 'avant' ? `${det} ${adj} ${nom}` : `${det} ${nom} ${adj}`);
  M.registerSkill({
    id: 'fr-accords-gn',
    domain: D,
    title: 'Les accords dans le groupe du nom',
    icon: '🔗',
    learn: 'fr-accords',
    desc: 'Le nom donne son genre et son nombre au déterminant.',
    pda: "Accords E.1 — accord du déterminant (★ 2e); E.2 — accord de l'adjectif (→ 2e)",
    gen({ lvl }) {
      const N = NOMS().filter(regPl);
      const m = M.pick(N);
      if (lvl === 0) {
        const def = Math.random() < 0.5;
        const opts = def ? ['le', 'la'] : ['un', 'une'];
        if (def && FR.elide(m.w)) opts.splice(0, 2, 'un', 'une');
        const ans = opts[m.g === 'f' ? 1 : 0];
        return {
          prompt: 'Choisis le bon déterminant.',
          scene: [{ emoji: m.em, label: m.w }],
          format: 'cloze',
          text: `{0} ${m.w}`,
          blanks: [{ choices: opts, answer: ans }],
          hint: `Dis les deux : lequel sonne bien avec <b>${m.w}</b> ?`,
          explain: `<b>${m.w}</b> est ${m.g === 'f' ? 'féminin' : 'masculin'} : on dit <b>${ans} ${m.w}</b>. Le nom donne son genre au déterminant.`,
        };
      }
      if (lvl === 1) {
        const many = Math.random() < 0.6;
        const pl = FR.plur(m);
        const dets = FR.elide(m.w) ? ["l'", 'les'] : ['le', 'la', 'les'];
        const det = many ? 'les' : FR.elide(m.w) ? "l'" : m.g === 'f' ? 'la' : 'le';
        return {
          prompt: "Regarde l'image. Complète le groupe du nom.",
          scene: [{ emoji: many ? m.em.repeat(3) : m.em, label: many ? 'plusieurs' : 'un seul' }],
          format: 'cloze',
          text: 'Regarde {0} {1} !',
          blanks: [
            { choices: dets, answer: det },
            { choices: M.shuffle([m.w, pl]), answer: many ? pl : m.w },
          ],
          hint: many
            ? 'Il y en a plusieurs : le déterminant et le nom sont au <b>pluriel</b>.'
            : 'Il y en a un seul : tout est au <b>singulier</b>.',
          explain: `<b>${det === "l'" ? "l'" : det + ' '}${many ? pl : m.w}</b> : ${many ? 'pluriel → <b>les</b> et un <b>s</b> au nom' : `singulier, ${m.g === 'f' ? 'féminin' : 'masculin'}`}.`,
        };
      }
      // lvl 2 : déterminant + adjectif + nom
      const a = M.pick(ADJ4),
        F = forms(a);
      const many = Math.random() < 0.5;
      const det = many ? 'les' : m.g === 'f' ? 'la' : 'le';
      if (FR.elide(m.w) && !many && a.pos === 'après') return this.gen({ lvl });
      const good = F[(m.g === 'f' ? 'f' : 'm') + (many ? 'p' : 's')];
      const nom = many ? FR.plur(m) : m.w;
      if (Math.random() < 0.45) {
        // vrai ou faux : groupe bien accordé ?
        const wrongForm = M.pick(Object.values(F).filter((x) => x !== good));
        const ok = Math.random() < 0.5;
        const shown = gn(det, ok ? good : wrongForm, nom, a);
        return {
          prompt: `Ce groupe du nom est-il <b>bien accordé</b> ?<div class="fr-big" style="font-size:1.6rem">${shown}</div>`,
          scene: [{ emoji: many ? m.em.repeat(3) : m.em, label: nom }],
          format: 'tf',
          answer: ok,
          labels: [{ label: '✔️ Bien accordé' }, { label: '✖️ Mal accordé' }],
          hint: `Le nom <b>${nom}</b> est-il masculin ou féminin ? Singulier ou pluriel ?`,
          explain: `<b>${nom}</b> est ${m.g === 'f' ? 'féminin' : 'masculin'} ${many ? 'pluriel' : 'singulier'} : on écrit <b>${gn(det, good, nom, a)}</b>.${M.ui.tagged(
            a.pos === 'avant'
              ? [
                  { w: det, tag: 'det' },
                  { w: good, tag: 'adj' },
                  { w: nom, tag: 'nom' },
                ]
              : [
                  { w: det, tag: 'det' },
                  { w: nom, tag: 'nom' },
                  { w: good, tag: 'adj' },
                ],
            {
              arrows:
                a.pos === 'avant'
                  ? [
                      [2, 0],
                      [2, 1],
                    ]
                  : [
                      [1, 0],
                      [1, 2],
                    ],
            },
          )}`,
        };
      }
      const toks = a.pos === 'avant' ? [det, '…', nom] : [det, nom, '…'];
      const nomIdx = toks.indexOf(nom);
      return {
        prompt: "Accorde l'adjectif, étape par étape.",
        scene: [{ emoji: many ? m.em.repeat(3) : m.em, label: nom }],
        format: 'steps',
        steps: [
          {
            label: '1. Le nom',
            prompt: "Touche le <b>nom</b> : c'est lui qui donne ses marques.",
            format: 'tapwords',
            words: toks,
            answer: [nomIdx],
          },
          {
            label: '2. Son genre et son nombre',
            prompt: `<b>${nom}</b> est…`,
            format: 'choice',
            cols: 2,
            answer: (m.g === 'f' ? 'f' : 'm') + (many ? 'p' : 's'),
            choices: [
              { label: 'masculin singulier', value: 'ms' },
              { label: 'féminin singulier', value: 'fs' },
              { label: 'masculin pluriel', value: 'mp' },
              { label: 'féminin pluriel', value: 'fp' },
            ],
          },
          {
            label: "3. L'adjectif",
            prompt: 'Choisis le bon adjectif.',
            format: 'cloze',
            text: a.pos === 'avant' ? `${det} {0} ${nom}` : `${det} ${nom} {0}`,
            blanks: [{ choices: M.shuffle(Object.values(F)), answer: good }],
          },
        ],
        explain: `Le nom <b>${nom}</b> donne son genre et son nombre au déterminant et à l'adjectif : <b>${gn(det, good, nom, a)}</b>.`,
      };
    },
  });
})();
