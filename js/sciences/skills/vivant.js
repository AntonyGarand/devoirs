/* =====================================================================
   sciences/skills/vivant.js — domaine sc-vivant (habiletés 1 à 9, HLD § 3.2)
   Aides de questions partagées : M.SC.Q (aussi utilisées par matiere.js, terre.js, demarche.js).
   Règle 1 : une seule vérité par question (faits multivalués → multi ou drapeaux *Q).
   Chaque question porte _sc (métadonnées) que les hooks check() revérifient contre les données.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  const cap = SC.cap;

  /* ------------------------------------------------------------ aides */
  const Q = (SC.Q = {});
  Q.pickN = (arr, n) => M.shuffle(arr.slice()).slice(0, n);
  Q.choicesFrom = (right, wrongs, labelFn = (x) => x, valFn = (x) => x, whyFn = null) => M.shuffle([right, ...wrongs]).map((x) => {
    const c = { label: labelFn(x), value: valFn(x) };
    const w = whyFn && x !== right ? whyFn(x) : null;
    if (w) c.why = w;
    return c;
  });
  /** check : chaque élément de sort est dans la bonne boîte selon binOf(item.key). */
  Q.checkSort = (q, binOf) => {
    if (q.format !== 'sort') return;
    const bad = q.items.find((it) => binOf(it.key) !== it.bin);
    if (bad) return `élément ${bad.key} : boîte ${bad.bin}, attendu ${binOf(bad.key)}`;
    const empty = q.bins.find((b) => !q.items.some((it) => it.bin === b.id));
    if (empty) return `boîte vide : ${empty.id}`;
  };
  /** check : exactement un choix vrai selon ok(value), et c'est answer. */
  Q.checkOne = (q, ok) => {
    const hits = q.choices.filter((c) => ok(c.value));
    if (hits.length !== 1) return `${hits.length} choix vrais selon les données`;
    if (String(hits[0].value) !== String(q.answer)) return 'answer ≠ le seul choix vrai';
  };
  /** check : multi — answer = exactement les choix vrais selon ok(value). */
  Q.checkMulti = (q, ok) => {
    const want = q.choices.filter((c) => ok(c.value)).map((c) => String(c.value)).sort().join('|');
    if (want !== q.answer.map(String).sort().join('|')) return 'answer ≠ choix vrais selon les données';
    if (q.choices.some((c) => ok(c.value) === null)) return 'choix ambigu (null) proposé';
  };
  let dataErr = null;
  Q.dataOnce = () => {
    if (dataErr === null) dataErr = [SC.checkAnimals && SC.checkAnimals(), SC.checkObjets && SC.checkObjets()].filter(Boolean).join(' · ');
    return dataErr || undefined;
  };
  /** Image d'un stade de cycle (dessin si l'emoji n'existe pas ou n'est pas affiché). */
  SC.stagePic = (st, size = 44) => {
    if (st.art && (!st.recent || !SC.emojiOk(st.emoji)) && M.art.has(st.art)) return M.art.html(st.art, { size, alt: st.label });
    return `<span style="font-size:${Math.round(size * 0.8)}px;line-height:1">${st.emoji}</span>`;
  };
  /** Monte un M.ui.cycle et y insère les dessins des stades (el : conteneur). */
  SC.mountCycle = (el, stages, { hide = [] } = {}) => {
    const useArt = (st) => st.art && (!st.recent || !SC.emojiOk(st.emoji)) && M.art.has(st.art);
    el.classList.add('sc-cycbox');
    el.innerHTML = M.ui.cycle({ stages: stages.map((st) => ({ emoji: useArt(st) ? '' : st.emoji, label: st.label })), hide });
    stages.forEach((st, i) => {
      if (hide.includes(i) || !useArt(st)) return;
      const g = M.$(`[data-hot="c${i}"]`, el), c = g && M.$('circle', g);
      if (!c) return;
      const x = +c.getAttribute('cx'), y = +c.getAttribute('cy');
      const raw = M.art.html(st.art).replace(/^<span[^>]*>/, '').replace(/<\/span>$/, '').replace('<svg ', `<svg x="${x - 26}" y="${y - 26}" width="52" height="52" `);
      g.insertAdjacentHTML('beforeend', raw);
    });
  };

  const A = () => SC.ANIMAUX;
  const lbl = (a) => SC.lbl(a);

  /* ================================================================ 1 */
  M.registerSkill({
    id: 'sc-naturel-fabrique', domain: 'sc-vivant', title: 'Naturel ou fabriqué ?', icon: '🏭', starter: true,
    desc: 'Naturel ou fabriqué par l\'humain; vivant ou non; ce que le vivant nous donne; à quoi sert un objet.',
    pda: 'Univers vivant D.2.a — utilisation du vivant (aliments, vêtements, bois); D.4.a — techniques de production d\'aliments (beurre, pain); Univers matériel D.1.b — besoin à l\'origine d\'un objet; attente de fin de cycle : distinguer le monde naturel des objets fabriqués',
    gen({ lvl }) {
      const t = lvl === 0 ? 'sort' : lvl === 1 ? M.pick(['match', 'match', 'order', 'sort']) : M.pick(['vivant', 'vivant', 'pasvivant', 'besoin', 'order']);
      if (t === 'sort') {
        const n = lvl === 0 ? 2 : 3;
        const items = [...Q.pickN(SC.NATUREL, n).map((l) => ({ label: l, bin: 'nat', key: l })), ...Q.pickN(SC.FABRIQUE, n).map((l) => ({ label: l, bin: 'fab', key: l }))];
        return {
          prompt: 'Est-ce <b>naturel</b> ou <b>fabriqué</b> par l\'humain ? Classe-les.', format: 'sort',
          bins: [{ id: 'nat', label: '🌳 Naturel' }, { id: 'fab', label: '🏭 Fabriqué par l\'humain' }], items,
          hint: 'Est-ce qu\'une personne l\'a fabriqué dans un atelier ou une usine ? Ou est-ce que ça existe dans la nature ?',
          explain: 'Ce qui est <b>naturel</b> existe dans la nature sans l\'aide des humains (un caillou, un arbre). Ce qui est <b>fabriqué</b> a été construit par des humains (un crayon, une chaise).',
          _sc: 'natfab',
        };
      }
      if (t === 'match') {
        const n = lvl === 1 ? M.pick([3, 4]) : 4;
        const pool = M.shuffle(SC.PRODUITS.slice()), pick = [];
        pool.forEach((p) => { if (pick.length < n && !pick.some((x) => x.origine === p.origine)) pick.push(p); });
        return {
          prompt: 'D\'où vient ce produit ? Associe chaque produit au <b>vivant</b> qui nous le donne.', format: 'match',
          pairs: pick.map((p) => ({ left: p.produit, right: p.oLabel })),
          hint: 'Pense à ce qu\'on utilise pour le fabriquer : du lait ? du bois ? de la farine ?',
          explain: 'Plein de choses viennent du vivant : ' + pick.map((p) => `${SC.plain(p.produit).toLowerCase()} ← ${SC.plain(p.oLabel).toLowerCase()}`).join(' · ') + '.',
          _sc: { kind: 'produits', ids: pick.map((p) => p.id) },
        };
      }
      if (t === 'order') {
        const r = M.pick(lvl === 1 ? SC.RECETTES.filter((x) => x.etapes.length <= 3) : SC.RECETTES);
        return {
          prompt: `Comment fait-on <b>${r.titre}</b> ? Touche les étapes dans l'ordre.`, format: 'order',
          choices: r.etapes.map((e, i) => ({ label: e, value: 'e' + i })), answer: r.etapes.map((e, i) => 'e' + i),
          hint: 'Qu\'est-ce qu\'on fait en tout premier ? Et qu\'est-ce qu\'on obtient à la fin ?',
          explain: `Pour ${r.titre} : ${r.etapes.map((e) => SC.plain(e)).join(' → ')}`,
        };
      }
      if (t === 'besoin') {
        const [o, ...others] = Q.pickN(SC.OBJETS_BESOIN, 3);
        return {
          prompt: `À quoi sert <b>${o.o}</b> ?`, format: 'choice', answer: o.b,
          choices: Q.choicesFrom(o.b, others.map((x) => x.b)),
          hint: 'Imagine que tu t\'en sers. Qu\'est-ce que ça t\'aide à faire ?',
          explain: `Les humains ont inventé ${o.o.replace(/^\S+ /, '')} pour répondre à un besoin : <b>${o.b.toLowerCase()}</b>.`,
          _sc: { kind: 'besoin', o: o.o },
        };
      }
      const neg = t === 'pasvivant';
      const good = neg ? M.pick(SC.NON_VIVANT) : M.pick(SC.VIVANT);
      const bad = Q.pickN(neg ? SC.VIVANT : SC.NON_VIVANT, 2);
      return {
        prompt: neg ? 'Lequel <b>n\'est pas vivant</b> ?' : 'Lequel est <b>vivant</b> ?', format: 'choice', answer: good.l,
        choices: Q.choicesFrom(good, bad, (x) => x.l, (x) => x.l, (x) => (neg ? null : x.l.includes('feu') ? 'Le feu bouge et grandit, mais il ne naît pas d\'un parent et ne se nourrit pas : il n\'est pas vivant.' : x.l.includes('nuage') ? 'Le nuage bouge et change, mais il n\'est pas vivant : c\'est de l\'eau.' : x.l.includes('robot') ? 'Le robot bouge, mais c\'est un objet fabriqué : il ne grandit pas et n\'a pas de bébés.' : null)),
        hint: 'Un être vivant naît, se nourrit, grandit, se reproduit et meurt.',
        explain: (good.l.includes('graine') ? 'Une graine est <b>vivante</b> : si on lui donne de l\'eau, elle germe et devient une plante ! ' : '')
          + 'Un être <b>vivant</b> naît, se nourrit, grandit, peut avoir des petits et meurt. Un caillou, un nuage ou le feu ne font pas tout ça.',
        _sc: { kind: neg ? 'nonvivant' : 'vivant' },
      };
    },
    check(q) {
      const d = Q.dataOnce(); if (d) return d;
      if (q._sc === 'natfab') return Q.checkSort(q, (k) => (SC.NATUREL.includes(k) ? 'nat' : SC.FABRIQUE.includes(k) ? 'fab' : '?'));
      if (q._sc && q._sc.kind === 'vivant') return Q.checkOne(q, (v) => SC.VIVANT.some((x) => x.l === v));
      if (q._sc && q._sc.kind === 'nonvivant') return Q.checkOne(q, (v) => SC.NON_VIVANT.some((x) => x.l === v));
      if (q._sc && q._sc.kind === 'besoin') return Q.checkOne(q, (v) => SC.OBJETS_BESOIN.find((x) => x.o === q._sc.o).b === v);
      if (q._sc && q._sc.kind === 'produits') { const o = q._sc.ids.map((id) => SC.PRODUITS.find((p) => p.id === id).origine); if (new Set(o).size !== o.length) return 'deux produits avec la même origine'; }
    },
  });

  /* ================================================================ 2 */
  const potLabel = (p) => `${SC.svg.pot({ eau: p.eau, lum: p.lum })}<span class="sc-cap">${p.texte}</span>`;
  M.registerSkill({
    id: 'sc-besoins', domain: 'sc-vivant', title: 'Ce dont les vivants ont besoin', icon: '💧', starter: true, learn: 'sc-l-plante',
    desc: 'Les besoins d\'une plante (eau, air, lumière, minéraux) et d\'un animal (air, eau, nourriture).',
    pda: 'Univers vivant A.3.a — décrire les besoins essentiels d\'une plante (eau, air, lumière, sels minéraux) (1er cycle); enrichissement : A.1.a — besoins essentiels des animaux (2e cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? M.pick(['multiPlante', 'multiPlante', 'multiAnimal']) : lvl === 1 ? M.pick(['pots', 'pots', 'multiAnimal', 'multiPlante']) : M.pick(['tf', 'tf', 'pots']);
      if (t === 'multiPlante' || t === 'multiAnimal') {
        const B = t === 'multiPlante' ? SC.BESOINS_PLANTE : SC.BESOINS_ANIMAL;
        const oui = B.oui.filter((b) => !b.lvl || b.lvl <= lvl);
        const non = Q.pickN(B.non, lvl === 0 ? 2 : 3);
        return {
          prompt: t === 'multiPlante' ? 'Touche <b>tout</b> ce dont une plante a besoin pour vivre et pousser.' : 'Touche <b>tout</b> ce dont un animal a besoin pour vivre.',
          format: 'multi', choices: M.shuffle([...oui, ...non]).map((b) => ({ label: b.label, value: b.id })), answer: oui.map((b) => b.id),
          hint: t === 'multiPlante' ? 'Une plante dans la nature : qu\'est-ce qu\'elle reçoit du ciel et du sol ?' : 'Pense à ce qu\'un animal sauvage doit trouver chaque jour pour rester en vie.',
          explain: t === 'multiPlante' ? 'Une plante a besoin d\'<b>eau</b>, de <b>lumière</b> et d\'<b>air</b>' + (oui.length > 3 ? ', et des <b>minéraux</b> qu\'elle trouve dans le sol' : '') + '. Avec la lumière, elle fabrique elle-même sa nourriture dans ses feuilles !'
            : 'Un animal a besoin d\'<b>air</b> pour respirer, d\'<b>eau</b> pour boire et de <b>nourriture</b> pour manger. Un abri l\'aide aussi à se protéger.',
          _sc: { kind: t, oui: oui.map((b) => b.id) },
        };
      }
      if (t === 'pots') {
        const best = SC.POTS[0];
        const others = Q.pickN(SC.POTS.slice(1), 2);
        return {
          prompt: 'Trois plantes pareilles. Après 3 semaines, laquelle aura le <b>mieux poussé</b> ?', format: 'choice', answer: best.id, cols: 3,
          choices: Q.choicesFrom(best, others, potLabel, (p) => p.id, (p) => p.why),
          hint: 'Une plante a besoin d\'eau (juste assez !) et de lumière.',
          explain: 'La plante qui a de l\'eau <b>juste assez</b> et de la <b>lumière</b> pousse le mieux. ' + others.map((p) => p.why).join(' '),
          _sc: { kind: 'pots' },
        };
      }
      const s = M.pick(SC.PLANTE_VF);
      return { prompt: `Vrai ou faux ? « ${s.t} »`, format: 'tf', answer: s.v, explain: s.e, hint: 'Une plante a besoin d\'eau, de lumière et d\'air. Un animal a besoin d\'air, d\'eau et de nourriture.' };
    },
    check(q) {
      const d = Q.dataOnce(); if (d) return d;
      if (q._sc && (q._sc.kind === 'multiPlante' || q._sc.kind === 'multiAnimal')) return Q.checkMulti(q, (v) => q._sc.oui.includes(v));
      if (q._sc && q._sc.kind === 'pots') return Q.checkOne(q, (v) => SC.POTS.find((p) => p.id === v).best === true);
    },
  });

  /* ================================================================ 3 (enrichissement) */
  const P4 = () => SC.PARTIES_PLANTE.filter((p) => !p.extra);
  const MANGE_PART = { racines: 'la racine', tige: 'la tige', feuille: 'les feuilles', fleur: 'les fleurs', fruit: 'le fruit', graine: 'les graines' };
  M.registerSkill({
    id: 'sc-plante-parties', domain: 'sc-vivant', title: 'Les parties d\'une plante', icon: '🌻', enrichment: true, learn: 'sc-l-plante',
    desc: 'Racines, tige, feuilles, fleur (et fruit, graines) : où elles sont et à quoi elles servent.',
    pda: 'Enrichissement — PDA Univers vivant A.2.e–f : parties d\'une plante et leurs fonctions (2e cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? M.pick(['hot', 'hot', 'mange']) : lvl === 1 ? M.pick(['label', 'mange', 'mange', 'vf']) : M.pick(['roles', 'roles', 'trier', 'mange']);
      const PART = (id) => SC.PARTIES_PLANTE.find((p) => p.id === id);
      if (t === 'mange') {
        const v = M.pick(SC.LEGUMES_PARTIE.filter((x) => lvl > 0 || x.facile));
        const ids = lvl === 2 ? SC.PARTIES_PLANTE.map((p) => p.id) : ['racines', 'tige', 'feuille', 'fleur', 'fruit'];
        const others = Q.pickN(ids.filter((id) => id !== v.p), 2);
        return {
          prompt: `Quand on mange <b>${v.nom}</b>, quelle partie de la plante mange-t-on ?`, format: 'choice', answer: v.p, cols: 3,
          choices: M.shuffle([v.p, ...others]).map((id) => ({ label: PART(id).label, value: id })),
          hint: 'Est-ce que ça pousse sous la terre ? Est-ce vert et plat ? Y a-t-il des graines dedans ?',
          explain: `${SC.plain(v.label)} : on mange <b>${MANGE_PART[v.p]}</b> de la plante. ${cap(PART(v.p).nom)} : ${PART(v.p).role.toLowerCase()}.`,
          _sc: { kind: 'mange', id: v.id },
        };
      }
      if (t === 'vf') {
        const s = M.pick(SC.PLANTE_PARTIES_VF);
        return { prompt: `Vrai ou faux ? « ${s.t} »`, format: 'tf', answer: s.v, explain: s.e, hint: 'Pense à la plante de bas en haut : racines, tige, feuilles, fleur.' };
      }
      if (t === 'trier') {
        const bins = Q.pickN(['racines', 'tige', 'feuille', 'fleur', 'fruit', 'graine'], 3);
        const items = [];
        bins.forEach((b) => Q.pickN(SC.LEGUMES_PARTIE.filter((x) => x.p === b), M.pick([1, 2])).forEach((x) => items.push({ label: x.label, bin: b, key: x.id })));
        return {
          prompt: 'Quelle partie de la plante mange-t-on ? Classe les aliments.', format: 'sort', items,
          bins: bins.map((b) => ({ id: b, label: PART(b).label })),
          hint: 'Racine : sous la terre. Feuille : verte et plate. Fruit : il y a des graines dedans.',
          explain: items.map((it) => `${SC.plain(it.label)} : ${PART(it.bin).nom}.`).join(' '),
          _sc: 'trier',
        };
      }
      if (t === 'hot') {
        const p = M.pick(P4());
        return {
          prompt: `Touche ${p.pl ? 'les' : 'la'} <b>${p.nom.replace(/^(les|la|le) /, '')}</b> de la plante.`, format: 'hotspot', answer: p.id,
          html: SC.svg.plante(), answerText: p.nom,
          hint: { racines: 'Les racines sont cachées sous la terre.', tige: 'La tige est la partie droite qui tient la plante debout.', feuille: 'Les feuilles sont vertes et plates, de chaque côté de la tige.', fleur: 'La fleur est en haut, avec ses pétales colorés.' }[p.id],
          explain: `${cap(p.nom)} : ${p.role.toLowerCase()}.`,
        };
      }
      if (t === 'label') {
        return {
          prompt: 'Place les étiquettes sur les parties de la plante.', format: 'label', html: SC.svg.plante(),
          labels: P4().map((p) => ({ id: p.id, text: p.nom })), distractors: [M.pick(['la patte', 'l\'aile', 'le bec'])],
          hint: 'Commence par ce qui est sous la terre.',
          explain: 'De bas en haut : les <b>racines</b> (sous la terre), la <b>tige</b>, les <b>feuilles</b> et la <b>fleur</b>.',
        };
      }
      const parts = M.pick([true, false]) ? [...Q.pickN(P4(), 2), ...SC.PARTIES_PLANTE.filter((p) => p.extra)] : Q.pickN(P4(), 4);
      return {
        prompt: 'À quoi sert chaque partie ? Associe la partie à son rôle.', format: 'match',
        pairs: M.shuffle(parts).map((p) => ({ left: `<b>${cap(p.nom)}</b>`, right: p.role })),
        hint: 'Les racines sont dans le sol, les feuilles reçoivent la lumière, la fleur devient un fruit.',
        explain: parts.map((p) => `<b>${cap(p.nom)}</b> : ${p.role.toLowerCase()}.`).join(' '),
      };
    },
    check(q) {
      const d = Q.dataOnce(); if (d) return d;
      if (q._sc && q._sc.kind === 'mange') return Q.checkOne(q, (v) => SC.LEGUMES_PARTIE.find((x) => x.id === q._sc.id).p === v);
      if (q._sc === 'trier') return Q.checkSort(q, (k) => SC.LEGUMES_PARTIE.find((x) => x.id === k).p);
    },
  });

  /* ================================================================ 4 (enrichissement) */
  const cyc = (k) => SC.CYCLES[k];
  const stageChoice = (st) => `<span class="sc-lbl">${SC.stagePic(st, 44)}<span>${st.label}</span></span>`;
  const stageTile = (st) => `<span class="sc-lblv">${SC.stagePic(st, 38)}<span>${st.label}</span></span>`;
  M.registerSkill({
    id: 'sc-cycles-vie', domain: 'sc-vivant', title: 'Les cycles de vie', icon: '🔄', enrichment: true, learn: 'sc-l-cycles',
    desc: 'Poule, grenouille, haricot, monarque : remettre les étapes de la vie dans l\'ordre.',
    pda: 'Enrichissement — PDA Univers vivant A.3.b–c : stades de croissance d\'une plante à fleurs et d\'animaux (2e cycle); A.3.d métamorphose (3e cycle) — séquence seulement',
    gen({ lvl }) {
      if (lvl === 2 && Math.random() < 0.55) {
        const k = M.pick(Object.keys(SC.CYCLES));
        const C = cyc(k), h = M.rnd(1, C.stades.length - 1), st = C.stades[h];
        const others = [];
        M.shuffle(Object.keys(SC.CYCLES).filter((x) => x !== k)).forEach((x) => {
          const cand = cyc(x).stades.filter((s) => s.label !== st.label && !others.some((o) => o.label === s.label));
          if (others.length < 2 && cand.length) others.push({ ...M.pick(cand), k: x });
        });
        return {
          prompt: `Voici le cycle de vie : <b>${C.titre.toLowerCase()}</b>. Quelle étape manque à la place du <b>?</b>`, format: 'choice', answer: k + ':' + st.id, cols: 3,
          choices: Q.choicesFrom({ ...st, k }, others, stageChoice, (x) => x.k + ':' + x.id),
          viz(el) { SC.mountCycle(el, C.stades, { hide: [h] }); },
          hint: `Regarde l'étape avant le « ? » et l'étape après. Qu'est-ce qui se passe entre les deux ?`,
          explain: `${C.stades.map((x, i) => (i === h ? `<b>${x.label}</b>` : x.label)).join(' → ')} → et ça recommence ! ${st.texte}`,
          _sc: { kind: 'missing', k, id: st.id },
        };
      }
      const t = lvl === 0 ? M.pick(['ordre', 'bebe', 'bebe', 'vf']) : lvl === 1 ? M.pick(['ordre', 'ordre', 'match', 'vf']) : M.pick(['ordre', 'ordre', 'match']);
      if (t === 'bebe') {
        const x = M.pick(SC.BEBES), bad = Q.pickN(SC.BEBES.filter((y) => y !== x), 2);
        return {
          scene: [{ emoji: x.e, label: x.a }],
          prompt: `Qui est le <b>bébé</b> ${SC.de(x.a)} ?`, format: 'choice', answer: x.b, cols: 3,
          choices: Q.choicesFrom(x, bad, (y) => cap(y.b), (y) => y.b, (y) => `${cap(y.b)}, c'est le bébé ${SC.de(y.a)}.`),
          hint: 'Pense à l\'animal quand il vient de naître.',
          explain: `Le bébé ${SC.de(x.a)}, c'est <b>${x.b}</b>. Les bébés grandissent et deviennent des adultes.`,
          _sc: { kind: 'bebe', b: x.b },
        };
      }
      if (t === 'match') {
        const pick = Q.pickN(SC.BEBES, 4);
        return {
          prompt: 'Associe chaque animal à son <b>bébé</b>.', format: 'match',
          pairs: pick.map((x) => ({ left: `${x.e} ${cap(x.a)}`, right: cap(x.b) })),
          hint: 'Le têtard vit dans l\'eau; la chenille mange des feuilles; le poussin sort d\'un œuf.',
          explain: pick.map((x) => `${cap(x.b)} → ${x.a}`).join(' · ') + '.',
        };
      }
      if (t === 'vf') {
        const s = M.pick(SC.CYCLES_VF);
        return { prompt: `Vrai ou faux ? « ${s.t} »`, format: 'tf', answer: s.v, explain: s.e, hint: 'Pense aux étapes : l\'œuf, le bébé, puis l\'adulte.' };
      }
      const k = lvl === 0 ? M.pick(['poule', 'grenouille', 'haricot']) : lvl === 1 ? M.pick(['grenouille', 'haricot', 'poule', 'monarque']) : M.pick(['monarque', 'grenouille', 'haricot', 'poule']);
      const C = cyc(k);
      // Niveau 0 : trois étapes faciles seulement
      const SIMPLE = { poule: ['oeuf', 'poussin', 'poule'], grenouille: ['oeufs', 'tetard', 'grenouille'], haricot: ['graine', 'germe', 'plant'] };
      const stades = lvl === 0 ? C.stades.filter((s) => SIMPLE[k].includes(s.id)) : C.stades;
      return {
        prompt: `Le cycle de vie : <b>${C.titre.toLowerCase()}</b>. La première étape est placée. Touche les autres dans l'ordre.`, format: 'order', fixed: [0],
        choices: M.shuffle(stades.map((s) => ({ label: stageTile(s), value: s.id }))), answer: stades.map((s) => s.id),
        hint: k === 'monarque' ? 'Avant de devenir papillon, la chenille se transforme dans une chrysalide.' : k === 'grenouille' ? 'Le têtard a d\'abord une queue; ses pattes poussent ensuite.' : 'Qu\'est-ce qui est tout petit au début ? Qu\'est-ce qui est adulte à la fin ?',
        explain: stades.map((s) => `<b>${s.label}</b> : ${s.texte}`).join('<br>') + '<br>Puis le cycle recommence !',
      };
    },
    check(q) {
      if (q._sc && q._sc.kind === 'missing') {
        const labels = q.choices.map((c) => SC.plain(c.label));
        if (new Set(labels).size !== labels.length) return 'deux choix avec le même nom';
        return Q.checkOne(q, (v) => v === q._sc.k + ':' + q._sc.id);
      }
      if (q._sc && q._sc.kind === 'bebe') return Q.checkOne(q, (v) => v === q._sc.b);
      if (q.format === 'order' && (!q.fixed || q.fixed[0] !== 0)) return 'un cycle : la première étape doit être donnée (fixed)';
    },
  });

  /* ================================================================ 5 */
  const mangeTxt = { plantes: 'seulement des plantes', animaux: 'd\'autres animaux', deux: 'des plantes et des animaux' };
  M.registerSkill({
    id: 'sc-animaux-alimentation', domain: 'sc-vivant', title: 'Que mange cet animal ?', icon: '🍽️', starter: true, learn: 'sc-l-animaux',
    desc: 'Animaux domestiques nourris par l\'humain, animaux sauvages qui trouvent leur nourriture; plantes, animaux ou les deux.',
    pda: 'Univers vivant B.1.a — comparer l\'alimentation d\'animaux domestiques et d\'animaux sauvages (1er cycle); enrichissement en lvl 2 : B.1.c — régime alimentaire herbivore, carnivore, omnivore (2e cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'domsauv' : lvl === 1 ? M.pick(['mange', 'mange', 'nourri', 'domsauv']) : M.pick(['mot', 'mot', 'quel', 'mange']);
      if (t === 'domsauv') {
        const n = lvl === 0 ? 2 : 3;
        const items = [...Q.pickN(SC.DOMESTIQUES, n).map((a) => ({ label: lbl(a), bin: 'dom', key: a.id })), ...Q.pickN(A(), n).map((a) => ({ label: lbl(a), bin: 'sau', key: a.id }))];
        return {
          prompt: 'Qui le <b>nourrit</b> ? Classe les animaux.', format: 'sort', items,
          bins: [{ id: 'dom', label: '🏠 Domestique : l\'humain le nourrit' }, { id: 'sau', label: '🌲 Sauvage : il trouve sa nourriture seul' }],
          hint: 'Est-ce que cet animal vit avec les humains, à la maison ou à la ferme ?',
          explain: 'Les animaux <b>domestiques</b> vivent avec nous : on leur donne à manger (croquettes, foin, grains). Les animaux <b>sauvages</b> trouvent eux-mêmes leur nourriture dans la nature.',
          _sc: 'domsauv',
        };
      }
      if (t === 'nourri') {
        const pool = M.shuffle(SC.DOMESTIQUES.slice()), pick = [];
        pool.forEach((a) => { if (pick.length < 3 && !pick.some((x) => x.cat === a.cat)) pick.push(a); });
        return {
          prompt: 'Que donne-t-on à manger à ces animaux domestiques ?', format: 'match',
          pairs: pick.map((a) => ({ left: lbl(a), right: SC.NOURRITURE[a.cat] })),
          hint: 'Les animaux de la ferme qui broutent mangent du foin. Les poules picorent des grains.',
          explain: pick.map((a) => `On donne ${SC.a(a.nom)} ${a.nourri}.`).join(' '),
          _sc: { kind: 'nourri', ids: pick.map((a) => a.id) },
        };
      }
      const pool = A().filter((a) => a.foodQ);
      if (t === 'mange') {
        const per = lvl === 2 ? 2 : M.pick([1, 2]);
        const items = [];
        ['plantes', 'animaux', 'deux'].forEach((m) => Q.pickN(pool.filter((a) => a.mange === m), per).forEach((a) => items.push({ label: lbl(a), bin: m, key: a.id })));
        return {
          prompt: 'Que mange chaque animal ? Classe-les.', format: 'sort', items,
          bins: Object.entries(SC.MANGE).map(([id, m]) => ({ id, label: `${m.icon} ${m.label}` })),
          hint: 'Pense à ce que tu as vu l\'animal manger, ou à ses dents : des dents pointues pour la viande, des dents plates pour les plantes.',
          explain: items.map((it) => { const a = SC.animal(it.key); return `${cap(a.nom)} mange ${mangeTxt[a.mange]}.`; }).join(' '),
          _sc: 'mange',
        };
      }
      if (t === 'mot') {
        const a = M.pick(pool);
        return {
          prompt: `${cap(a.nom)} mange <b>${mangeTxt[a.mange]}</b>. C'est un animal…`, format: 'choice', answer: a.mange,
          choices: M.shuffle(Object.entries(SC.MANGE)).map(([id, m]) => ({ label: `${m.icon} ${m.mot}`, value: id })),
          hint: '<b>Herbi</b>vore : l\'herbe, les plantes. <b>Carni</b>vore : la viande (carne). <b>Omni</b>vore : de tout (omni = tout).',
          explain: `${cap(a.nom)} mange ${mangeTxt[a.mange]} : c'est un <b>${SC.MANGE[a.mange].mot}</b>. Herbivore = plantes · carnivore = animaux · omnivore = les deux.`,
          _sc: { kind: 'mot', id: a.id },
        };
      }
      const m = M.pick(Object.keys(SC.MANGE));
      const good = M.pick(pool.filter((a) => a.mange === m));
      const bad = Object.keys(SC.MANGE).filter((x) => x !== m).map((x) => M.pick(pool.filter((a) => a.mange === x)));
      return {
        prompt: `Lequel de ces animaux est un <b>${SC.MANGE[m].mot}</b> ? <small>(il mange ${mangeTxt[m]})</small>`, format: 'choice', answer: good.id,
        choices: Q.choicesFrom(good, bad, lbl, (a) => a.id, (a) => `${cap(a.nom)} mange ${mangeTxt[a.mange]} : c'est un ${SC.MANGE[a.mange].mot}.`),
        hint: `Un ${SC.MANGE[m].mot} mange ${mangeTxt[m]}.`,
        explain: `${cap(good.nom)} mange ${mangeTxt[m]} : c'est un <b>${SC.MANGE[m].mot}</b>.`,
        _sc: { kind: 'quel', m },
      };
    },
    check(q) {
      const d = Q.dataOnce(); if (d) return d;
      if (q._sc === 'domsauv') return Q.checkSort(q, (k) => { const a = SC.animal(k); return a.domestique ? 'dom' : 'sau'; });
      if (q._sc === 'mange') return Q.checkSort(q, (k) => { const a = SC.animal(k); return a.foodQ ? a.mange : 'exclu'; });
      if (q._sc && q._sc.kind === 'mot') { const a = SC.animal(q._sc.id); if (!a.foodQ || a.mange !== q.answer) return 'régime incohérent'; }
      if (q._sc && q._sc.kind === 'quel') return Q.checkOne(q, (v) => { const a = SC.animal(v); return a.foodQ && a.mange === q._sc.m; });
      if (q._sc && q._sc.kind === 'nourri') { const c = q._sc.ids.map((id) => SC.animal(id).cat); if (new Set(c).size !== c.length) return 'deux nourritures pareilles'; }
    },
  });

  /* ================================================================ 6 */
  const ADAPT = [
    { q: 'Pourquoi le pelage du <b>lièvre d\'Amérique</b> devient-il blanc l\'hiver ?', a: 'Pour se cacher dans la neige', d: [['Parce qu\'il devient vieux', 'Même les jeunes lièvres deviennent blancs : c\'est pour se cacher.'], ['Pour avoir moins froid aux oreilles', 'La couleur blanche ne réchauffe pas : elle sert à se cacher dans la neige.']], e: 'L\'hiver, le pelage du lièvre devient <b>blanc</b> comme la neige : ses ennemis, comme le lynx et le renard, le voient moins bien.' },
    { q: 'Pourquoi le <b>lynx</b> a-t-il de grosses pattes très poilues ?', a: 'Pour marcher sur la neige sans s\'enfoncer', d: [['Pour nager plus vite', 'Le lynx nage peu : ses grosses pattes l\'aident surtout dans la neige.'], ['Pour creuser des terriers', 'Le lynx ne creuse pas de terrier.']], e: 'Les grosses pattes du lynx sont comme des <b>raquettes</b> : il ne s\'enfonce pas dans la neige et peut attraper le lièvre.' },
    { q: 'Pourquoi la <b>bernache du Canada</b> part-elle vers le sud à l\'automne ?', a: 'Pour trouver de la nourriture et de l\'eau qui ne gèle pas', d: [['Pour voir d\'autres pays', 'Les oiseaux ne voyagent pas pour visiter : ils cherchent de quoi manger.'], ['Parce que ses plumes tombent', 'Ses plumes ne tombent pas toutes à l\'automne.']], e: 'L\'hiver, les lacs gèlent et l\'herbe est sous la neige. La bernache <b>migre</b> vers le sud, où elle trouve à manger. Elle revient au printemps.' },
    { q: 'Pourquoi le <b>canard</b> a-t-il de la peau entre les doigts de ses pattes ?', a: 'Pour mieux nager', d: [['Pour grimper aux arbres', 'Le canard ne grimpe pas aux arbres.'], ['Pour creuser le sol', 'Ses pattes palmées ne servent pas à creuser.']], e: 'Ses pattes <b>palmées</b> sont comme des palmes de plongée : elles poussent l\'eau pour nager.' },
    { q: 'Comment l\'<b>ours noir</b> passe-t-il l\'hiver ?', a: 'Il dort dans sa tanière, sans manger', d: [['Il part vers le sud', 'L\'ours ne migre pas : il reste dans sa tanière.'], ['Son pelage devient blanc', 'C\'est le lièvre qui devient blanc, pas l\'ours noir.']], e: 'L\'ours noir mange beaucoup à l\'automne, puis il <b>dort</b> une grande partie de l\'hiver dans sa tanière, sans manger. Il peut se réveiller s\'il est dérangé.' },
    { q: 'Pourquoi la <b>marmotte</b> mange-t-elle beaucoup à la fin de l\'été ?', a: 'Pour faire des réserves de gras avant d\'hiberner', d: [['Pour pouvoir voler', 'La marmotte ne vole pas !'], ['Pour devenir plus rapide', 'Plus de gras, ça ne rend pas plus rapide : ça sert de réserve.']], e: 'La marmotte <b>hiberne</b> : elle dort tout l\'hiver sans manger. Son gras est sa réserve d\'énergie.' },
    { q: 'Comment le <b>phoque</b> garde-t-il sa chaleur dans l\'eau glacée ?', a: 'Grâce à une épaisse couche de gras sous sa peau', d: [['Il ne va jamais dans l\'eau froide', 'Le phoque nage dans l\'eau froide du fleuve et de la mer.'], ['Il fait un feu sur les rochers', 'Les animaux ne font pas de feu !']], e: 'Sous sa peau, le phoque a une épaisse couche de <b>gras</b> qui le garde au chaud, comme un manteau.' },
    { q: 'Pourquoi le <b>harfang des neiges</b> est-il blanc ?', a: 'Pour se cacher dans la neige', d: [['Parce qu\'il a peur du noir', 'La couleur des plumes ne vient pas de la peur.'], ['Pour que tout le monde le voie', 'Au contraire : le blanc le cache dans la neige.']], e: 'Ses plumes <b>blanches</b> le cachent dans la neige : ses proies le voient moins bien arriver.' },
  ];
  M.registerSkill({
    id: 'sc-animaux-adaptation', domain: 'sc-vivant', title: 'Comment l\'animal s\'adapte', icon: '🧥', learn: 'sc-l-animaux',
    desc: 'Poils, plumes, écailles; ce que font les animaux l\'hiver; pourquoi leur corps les aide.',
    pda: 'Univers vivant D.1.a–b — décrire des caractéristiques physiques et des comportements qui montrent l\'adaptation d\'un animal à son milieu (1er cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'couv' : lvl === 1 ? M.pick(['hiver', 'hiver', 'couv4']) : M.pick(['adapt', 'adapt', 'hiver']);
      if (t === 'couv' || t === 'couv4') {
        const kinds = t === 'couv' ? ['poils', 'plumes', 'ecailles'] : ['poils', 'plumes', 'ecailles', 'peau'];
        const items = [];
        kinds.forEach((c) => Q.pickN(A().filter((a) => a.coverQ && a.couv === c), t === 'couv' ? 2 : M.pick([1, 2])).forEach((a) => items.push({ label: lbl(a), bin: c, key: a.id })));
        return {
          prompt: 'Comment le corps de ces animaux est-il couvert ? Classe-les.', format: 'sort', items,
          bins: kinds.map((c) => ({ id: c, label: `${SC.COUV[c].icon} ${SC.COUV[c].label}` })),
          hint: 'Imagine que tu flattes l\'animal : doux comme un chat, léger comme un oreiller, glissant comme un poisson ?',
          explain: 'Les oiseaux sont les seuls animaux qui ont des <b>plumes</b>. Les poissons et les serpents ont des <b>écailles</b>.'
            + (kinds.includes('peau') ? ' La grenouille et le béluga ont une <b>peau nue</b>, sans poils ni écailles.' : ' Beaucoup d\'animaux de nos forêts ont des <b>poils</b> (une fourrure).')
            + (items.some((i) => i.key === 'chauve-souris') ? ' Attention : la chauve-souris vole, mais elle a des poils !' : ''),
          _sc: 'couv',
        };
      }
      if (t === 'hiver') {
        const cats = Q.pickN(['actif', 'hiberne', 'dort', 'migre', 'pelage', 'fond'], lvl === 1 ? 3 : 4);
        const pick = cats.map((c) => M.pick(A().filter((a) => a.hiverQ && a.hiver === c)));
        return {
          prompt: 'Que fait chaque animal <b>l\'hiver</b> ? Associe-les.', format: 'match',
          pairs: pick.map((a) => ({ left: lbl(a), right: `${SC.HIVER[a.hiver].icon} ${SC.HIVER[a.hiver].label}` })),
          hint: 'Les oiseaux qui ne trouvent plus à manger partent. Le lièvre change de couleur. La marmotte dort tout l\'hiver.',
          explain: pick.map((a) => `${cap(a.nom)} : ${SC.HIVER[a.hiver].label.toLowerCase()}.`).join(' '),
          _sc: { kind: 'hiver', ids: pick.map((a) => a.id) },
        };
      }
      const x = M.pick(ADAPT);
      return {
        prompt: x.q, format: 'choice', answer: x.a,
        choices: M.shuffle([{ label: x.a, value: x.a }, ...x.d.map(([l, w]) => ({ label: l, value: l, why: w }))]),
        hint: 'Comment cette partie du corps ou ce comportement aide-t-il l\'animal à survivre dans son milieu ?', explain: x.e,
      };
    },
    check(q) {
      const d = Q.dataOnce(); if (d) return d;
      if (q._sc === 'couv') return Q.checkSort(q, (k) => { const a = SC.animal(k); return a.coverQ ? a.couv : 'exclu'; });
      if (q._sc && q._sc.kind === 'hiver') { const h = q._sc.ids.map((id) => SC.animal(id)); if (h.some((a) => !a.hiverQ)) return 'animal exclu (hiverQ)'; if (new Set(h.map((a) => a.hiver)).size !== h.length) return 'deux comportements pareils'; }
    },
  });

  /* ================================================================ 7 (enrichissement) */
  const ZONE = { foret: 'foret', lac: 'eau', etang: 'eau', champ: 'champ', ville: 'ville' };
  const zonesOf = (a) => (a.hab.every((h) => ZONE[h]) ? [...new Set(a.hab.map((h) => ZONE[h]))] : []);
  const ZLABEL = { foret: 'la forêt', eau: 'le lac', champ: 'le champ', ville: 'la ville' };
  M.registerSkill({
    id: 'sc-animaux-habitats', domain: 'sc-vivant', title: 'Où vit-il ? Comment bouge-t-il ?', icon: '🏞️', enrichment: true, learn: 'sc-l-animaux',
    desc: 'Les milieux de vie du Québec (forêt, lac, champ, Grand Nord…) et les façons de se déplacer.',
    pda: 'Enrichissement — PDA Univers vivant D.1.c : habitats; C.1.a : modes de déplacement (2e cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? 'bouge' : lvl === 1 ? M.pick(['habitat', 'habitat', 'bouge']) : M.pick(['scene', 'scene', 'bouge', 'habitat']);
      if (t === 'bouge') {
        const verbs = lvl === 0 ? ['vole', 'rampe', 'nage'] : Object.keys(SC.MOVE_Q);
        const v = M.pick(verbs), m = SC.MOVE_Q[v];
        const oui = Q.pickN(m.oui, M.pick(lvl === 0 ? [1, 2] : [2, 3])), non = Q.pickN(m.non, lvl === 0 ? 2 : 3);
        const ch = M.shuffle([...oui, ...non]).map((id) => ({ label: lbl(SC.animal(id)), value: id }));
        return {
          prompt: `Touche <b>tous</b> les animaux qui <b>${m.verbe}</b>.`, format: 'multi', choices: ch, answer: oui, cols: ch.length <= 4 ? 2 : 3,
          hint: v === 'vole' ? 'Cherche des ailes ! Attention : des ailes, ce n\'est pas toujours des plumes.' : v === 'rampe' ? 'Ramper, c\'est avancer sans pattes, en glissant sur le ventre.' : v === 'nage' ? 'Lesquels vivent dans l\'eau ou plongent pour manger ?' : 'Pense à leurs pattes et à leur corps.',
          explain: `Ces animaux ${m.verbe} : ${oui.map((id) => SC.animal(id).nom).join(', ')}.` + (oui.includes('chauve-souris') ? ' La chauve-souris vole, même si elle a des poils !' : ''),
          _sc: { kind: 'bouge', v },
        };
      }
      if (t === 'habitat') {
        for (let k = 0; k < 40; k++) {
          const bins = Q.pickN(['foret', 'lac', 'etang', 'champ', 'fleuve', 'nord', 'ville'], 3);
          const fit = (a) => a.habitatQ && a.hab.filter((h) => bins.includes(h)).length === 1;
          const items = [];
          bins.forEach((b) => Q.pickN(A().filter((a) => fit(a) && a.hab.includes(b)), 2).forEach((a) => items.push({ label: lbl(a), bin: b, key: a.id })));
          if (items.length < 5 || bins.some((b) => !items.some((i) => i.bin === b))) continue;
          return {
            prompt: 'Où vit chaque animal ? Classe-les.', format: 'sort', items,
            bins: bins.map((b) => ({ id: b, label: `${SC.HABITATS[b].icon} ${SC.cap(SC.HABITATS[b].label)}` })),
            hint: 'Où trouve-t-il sa nourriture et un abri ?',
            explain: items.map((it) => { const a = SC.animal(it.key); return `${cap(a.nom)} : ${SC.HABITATS[it.bin].label}.`; }).join(' '),
            _sc: { kind: 'habitat', bins },
          };
        }
      }
      const a = M.pick(A().filter((x) => x.habitatQ && zonesOf(x).length === 1));
      const z = zonesOf(a)[0];
      return {
        prompt: `Où vit <b>${a.nom}</b> ? Touche son milieu de vie.`, format: 'hotspot', answer: z, html: SC.svg.paysage(), answerText: ZLABEL[z],
        scene: [{ emoji: a.emoji || '', art: a.emoji ? null : a.art, label: a.nom }],
        hint: 'Que mange-t-il ? Où trouve-t-il sa nourriture ?',
        explain: `${cap(a.nom)} vit dans ${SC.HABITATS[a.hab[0]].label === 'l\'étang et le marais' ? 'l\'eau d\'un étang ou d\'un lac' : ZLABEL[z]}. ${a.fait}`,
        _sc: { kind: 'scene', id: a.id },
      };
    },
    check(q) {
      const d = Q.dataOnce(); if (d) return d;
      if (q._sc && q._sc.kind === 'bouge') { const m = SC.MOVE_Q[q._sc.v]; if (q.choices.some((c) => !m.oui.includes(c.value) && !m.non.includes(c.value))) return 'animal sans réponse sûre'; return Q.checkMulti(q, (v) => m.oui.includes(v)); }
      if (q._sc && q._sc.kind === 'habitat') return Q.checkSort(q, (k) => { const a = SC.animal(k); const h = a.hab.filter((x) => q._sc.bins.includes(x)); return a.habitatQ && h.length === 1 ? h[0] : 'ambigu'; });
      if (q._sc && q._sc.kind === 'scene') { const z = zonesOf(SC.animal(q._sc.id)); if (z.length !== 1 || z[0] !== q.answer) return 'zone ambiguë'; }
    },
  });

  /* ================================================================ 8 */
  M.registerSkill({
    id: 'sc-corps', domain: 'sc-vivant', title: 'Mon corps et mes habitudes', icon: '🧍', learn: 'sc-l-corps',
    desc: 'Les parties du corps, à quoi servent le cœur, l\'estomac, les poumons…, et les saines habitudes.',
    pda: 'Univers vivant A.2.a — décrire les fonctions de parties de son anatomie (membres, tête, cœur, estomac) (1er cycle); Éducation physique et à la santé — adopter un mode de vie sain et actif (intégration)',
    parentNote: 'Silhouette neutre, vue de face. Aucune question sur la santé de l\'enfant; jamais de gauche / droite (effet miroir).',
    gen({ lvl }) {
      const t = lvl === 0 ? M.pick(['hot', 'hot', 'sert']) : lvl === 1 ? M.pick(['fonction', 'habitudes', 'hot']) : M.pick(['label', 'label', 'sommeil', 'fonction']);
      if (t === 'sert') {
        const [f, ...others] = Q.pickN(SC.FONCTIONS, 3);
        const nom = f.left.replace(/^\S+ /, '');
        return {
          prompt: `À quoi ${/^les /i.test(nom) ? 'servent' : 'sert'} <b>${nom.toLowerCase()}</b> ?`, format: 'choice', answer: f.id, cols: 1,
          choices: Q.choicesFrom(f, others, (x) => x.right, (x) => x.id),
          hint: 'Montre cette partie sur ton propre corps. Que fait-elle ?',
          explain: `${f.left} : ${f.right.toLowerCase()}.`,
          _sc: { kind: 'sert', id: f.id },
        };
      }
      if (t === 'hot') {
        const p = M.pick(SC.CORPS);
        return {
          prompt: `Touche <b>${p.nom}</b>.`, format: 'hotspot', answer: p.id, html: SC.svg.corps(), answerText: p.nom,
          hint: { coude: 'Le coude est au milieu du bras : c\'est là qu\'il plie.', genou: 'Le genou est au milieu de la jambe : c\'est là qu\'elle plie.', epaule: 'L\'épaule est en haut du bras, à côté du cou.', cou: 'Le cou est entre la tête et les épaules.' }[p.id] || 'Montre-le d\'abord sur ton propre corps !',
          explain: `Voilà ${p.nom} !` + (p.id === 'coude' || p.id === 'genou' ? ` ${cap(p.nom)} est une articulation : c'est là que ${p.id === 'coude' ? 'le bras' : 'la jambe'} plie.` : ''),
        };
      }
      if (t === 'fonction') {
        const pick = Q.pickN(SC.FONCTIONS, lvl === 1 ? 3 : 4);
        return {
          prompt: 'À quoi sert chaque partie du corps ? Associe-les.', format: 'match', pairs: pick.map((f) => ({ left: f.left, right: f.right })),
          hint: 'On respire avec les poumons; le cœur bat; l\'estomac reçoit ce qu\'on mange.',
          explain: pick.map((f) => `${f.left.replace(/^\S+ /, '')} : ${f.right.toLowerCase()}.`).join(' '),
        };
      }
      if (t === 'habitudes') {
        const n = M.pick([2, 3]);
        const items = [...Q.pickN(SC.HABITUDES.saine, n).map((l) => ({ label: l, bin: 'oui', key: l })), ...Q.pickN(SC.HABITUDES.pas, n).map((l) => ({ label: l, bin: 'non', key: l }))];
        return {
          prompt: 'Est-ce une <b>saine habitude</b> ? Classe-les.', format: 'sort', items,
          bins: [{ id: 'oui', label: '💪 Bon pour mon corps' }, { id: 'non', label: '⚠️ Pas bon pour mon corps' }],
          hint: 'Est-ce que ça aide ton corps à grandir, à bouger et à rester propre ?',
          explain: 'Dormir assez, bouger, bien manger et se laver les mains, ce sont de <b>saines habitudes</b> : elles aident le corps à grandir et à rester en forme.',
          _sc: 'habitudes',
        };
      }
      if (t === 'sommeil') {
        return {
          prompt: 'Environ combien d\'heures un enfant de 7 ans devrait-il dormir chaque nuit ?', format: 'choice', answer: '10',
          choices: [['4 heures', '4', 'C\'est beaucoup trop peu : le corps et le cerveau n\'ont pas le temps de se reposer.'], ['6 heures', '6', 'Ce n\'est pas assez pour un enfant qui grandit.'], ['Environ 10 heures', '10'], ['16 heures', '16', 'C\'est trop : ça ne laisserait presque pas de temps pour jouer et apprendre !']].map(([label, value, why]) => (why ? { label, value, why } : { label, value })),
          hint: 'Si tu te couches à 8 heures le soir et te lèves à 7 heures le matin, combien d\'heures as-tu dormi ?',
          explain: 'Un enfant de 7 ans a besoin d\'environ <b>10 heures</b> de sommeil (entre 9 et 11 heures). Pendant le sommeil, le corps grandit et le cerveau range ce qu\'on a appris.',
        };
      }
      const parts = Q.pickN(SC.CORPS, 5);
      return {
        prompt: 'Place les étiquettes sur le corps.', format: 'label', html: SC.svg.corps(),
        labels: parts.map((p) => ({ id: p.id, text: p.nom })), distractors: ['l\'aile'],
        hint: 'Touche une étiquette, puis montre la partie sur ton propre corps avant de la placer.',
        explain: 'Bravo ! ' + parts.map((p) => p.nom).join(', ') + ' : tu connais bien ton corps.',
      };
    },
    check(q) {
      if (q._sc && q._sc.kind === 'sert') return Q.checkOne(q, (v) => v === q._sc.id);
      if (q._sc === 'habitudes') return Q.checkSort(q, (k) => (SC.HABITUDES.saine.includes(k) ? 'oui' : SC.HABITUDES.pas.includes(k) ? 'non' : '?'));
      return M.lint.noPrivate(q.prompt);
    },
  });

  /* ================================================================ 9 (enrichissement) */
  const SENS = (id) => SC.SENS.find((s) => s.id === id);
  M.registerSkill({
    id: 'sc-sens', domain: 'sc-vivant', title: 'Mes cinq sens', icon: '👀', enrichment: true, learn: 'sc-l-corps',
    desc: 'La vue, l\'ouïe, l\'odorat, le goût et le toucher : quel organe, quel sens ?',
    pda: 'Enrichissement — PDA Univers vivant A.2.h : fonction sensorielle (2e cycle); « explorer à l\'aide des sens » : stratégie dès le 1er cycle',
    gen({ lvl }) {
      if (lvl === 0 && Math.random() < 0.6) {
        const s = M.pick(SC.SENS), others = Q.pickN(SC.SENS.filter((x) => x !== s), 2);
        return {
          prompt: SC.SENS_VERBE[s.id], format: 'choice', answer: s.id, cols: 3,
          choices: Q.choicesFrom(s, others, (x) => `${x.icon} ${cap(x.organe)}`, (x) => x.id),
          hint: 'Quelle partie de ton corps travaille ? Montre-la !',
          explain: `On utilise <b>${s.organe}</b> : c'est le sens ${SC.de(s.sens)}.`,
          _sc: { kind: 'un', a: s.id },
        };
      }
      if (lvl === 0) {
        const pick = Q.pickN(SC.SENS, M.pick([4, 5]));
        return {
          prompt: 'Quel organe pour quel sens ? Associe-les.', format: 'match',
          pairs: pick.map((s) => ({ left: `${s.icon} ${cap(s.organe)}`, right: `<b>${cap(s.sens)}</b>` })),
          hint: 'On voit avec les yeux, on entend avec les oreilles…',
          explain: SC.SENS.map((s) => `${cap(s.organe)} → ${s.sens}`).join(' · ') + '.',
        };
      }
      if (lvl === 1) {
        const s = M.pick(SC.SENS_Q);
        const others = Q.pickN(SC.SENS.filter((x) => x.id !== s.a), 2);
        const q = {
          prompt: `${s.t}<br>Quel <b>sens</b> utilises-tu ?`, format: 'choice', answer: s.a, cols: 3,
          choices: M.shuffle([SENS(s.a), ...others]).map((x) => ({ label: x.label, value: x.id })),
          hint: 'Quelle partie de ton corps travaille : les yeux, les oreilles, le nez, la langue ou la peau ?',
          explain: `On utilise <b>${SENS(s.a).sens}</b>, avec ${SENS(s.a).organe}.` + (s.a === 'toucher' ? ' Le toucher passe par <b>toute la peau</b>, pas seulement par les mains.' : ''),
          _sc: { kind: 'un', a: s.a },
        };
        if (s.audio) q.audio = { text: s.audio, autoplay: false };
        return q;
      }
      const s = M.pick(SC.SENS_MULTI);
      const non = s.choix.filter((id) => !s.a.includes(id));
      if (non.length === 1 && Math.random() < 0.4) {
        return {
          prompt: `${s.t.replace(/\s*Quels sens [^?]*\?$/, '')}<br>Quel sens <b>n'utilises-tu pas</b> ?`, format: 'choice', answer: non[0], cols: 3,
          choices: s.choix.map((id) => ({ label: SENS(id).label, value: id })),
          hint: 'Imagine la scène : qu\'est-ce que tu vois, entends, sens, goûtes ou touches ?',
          explain: `On n'utilise pas <b>${SENS(non[0]).sens}</b>. ${s.e}`,
          _sc: { kind: 'un', a: non[0] },
        };
      }
      return {
        prompt: s.t, format: 'multi', choices: s.choix.map((id) => ({ label: SENS(id).label, value: id })), answer: s.a,
        hint: 'Imagine la scène : qu\'est-ce que tu vois, entends, sens, goûtes ou touches ?', explain: s.e,
      };
    },
    check(q) { if (q._sc && q._sc.kind === 'un') return Q.checkOne(q, (v) => v === q._sc.a); },
  });
})();
