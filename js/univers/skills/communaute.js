/* =====================================================================
   Univers social — Ma famille et ma communauté (us-communaute)
   us-familles · us-lieux-metiers · us-animaux
   R7 : toutes les familles sont valides; on compte, on nomme, on observe.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const D = 'us-communaute';
  /** « à l'épicerie », « au parc », « à la clinique » */
  const aLe = (nom) => nom.replace(/^le /, 'au ').replace(/^(la |l')/, 'à $1');

  /** Arbre de famille fictif (SVG). */
  U.treeSvg = function (opts = {}) {
    const A = U.d('familles').arbre;
    const by = (id) => A.gens.find((g) => g.id === id);
    const mid = (ids) => { const gs = ids.map(by); return { x: gs.reduce((a, g) => a + g.x, 0) / gs.length, y: gs[0].y }; };
    let s = `<svg class="us-tree" viewBox="0 0 520 340" role="img" aria-label="Arbre de la famille de Léo">`;
    A.couples.forEach(([a, b]) => { s += `<line x1="${by(a).x}" y1="${by(a).y}" x2="${by(b).x}" y2="${by(b).y}" stroke="#e9b949" stroke-width="5"/>`; });
    A.enfants.forEach(([par, kids]) => {
      const p = mid(par), yb = p.y + 64;
      s += `<line x1="${p.x}" y1="${p.y + (par.length > 1 ? 0 : 34)}" x2="${p.x}" y2="${yb}" stroke="#7a7f99" stroke-width="3"/>`;
      const xs = kids.map((k) => by(k).x);
      s += `<line x1="${Math.min(p.x, ...xs)}" y1="${yb}" x2="${Math.max(p.x, ...xs)}" y2="${yb}" stroke="#7a7f99" stroke-width="3"/>`;
      kids.forEach((k) => { s += `<line x1="${by(k).x}" y1="${yb}" x2="${by(k).x}" y2="${by(k).y - 34}" stroke="#7a7f99" stroke-width="3"/>`; });
    });
    A.gens.forEach((g) => {
      const me = g.id === 'leo';
      s += `<g data-hot="${g.id}"><circle cx="${g.x}" cy="${g.y}" r="32" fill="${me ? '#fff6d6' : '#fff'}" stroke="${me ? '#e9b949' : '#2b2d42'}" stroke-width="3"/><text x="${g.x}" y="${g.y + 12}" text-anchor="middle" font-size="34">${g.emoji}</text><text x="${g.x}" y="${g.y + 54}" text-anchor="middle" font-size="20">${g.nom}${me && !opts.plain ? ' ⭐' : ''}</text></g>`;
    });
    return s + '</svg>';
  };

  /* ---------------------------------------------------------------- us-familles */
  M.registerSkill({
    id: 'us-familles', domain: D, title: 'Les familles', icon: '👨‍👩‍👧', learn: 'us-communaute', starter: true,
    desc: 'Il y a beaucoup de sortes de familles; les mots de la parenté.',
    pda: 'CCQ 1re–2e — Diversité des familles québécoises; relations intergénérationnelles · GHEC A.2.1 a–c',
    parentNote: 'Familles montrées en rotation : deux parents, un parent, deux mamans, deux papas, grands-parents, recomposée, d\'accueil, adoptive. Aucune question « laquelle est une vraie famille ».',
    lint(q) { if (/vraie famille|normale|famille normale/i.test(q.prompt)) return 'R7 : jamais de « vraie » famille'; },
    gen({ lvl }) {
      const F = U.d('familles');
      const fam = M.pick(F.familles);
      const scene = fam.membres.map((m) => ({ emoji: m.emoji, label: m.role }));
      const list = fam.membres.map((m) => `${m.emoji} ${m.role}`).join(', ');
      if (lvl === 0) {
        if (Math.random() < 0.4) {
          const mots = M.shuffle(F.mots).slice(0, 4);
          return {
            prompt: 'Associe chaque image au bon mot.', format: 'match',
            pairs: mots.map((m) => ({ left: `<span style="font-size:2.2rem">${m.emoji}</span>`, right: m.mot, sayRight: m.mot })),
            hint: 'Regarde l\'âge de chaque personne : cheveux blancs, tout petit…', explain: mots.map((m) => `${m.emoji} ${m.mot}`).join(' · '),
          };
        }
        return {
          scene, prompt: `Voici la famille de ${fam.nom}. Combien de personnes y a-t-il dans cette famille ? {?}`, format: 'number', answer: fam.membres.length,
          hint: 'Touche chaque personne avec ton doigt en comptant.',
          explain: `Dans la famille de ${fam.nom}, il y a ${list} : <b>${fam.membres.length} personnes</b>. Chaque famille est différente, et toutes sont de vraies familles.`,
          viz: (el) => { el.innerHTML = `<div class="viz-hint">Famille de ${fam.nom} (${fam.sorte})</div><div class="us-mytl">${fam.membres.map((m) => `<span class="chip">${m.emoji} ${m.role}</span>`).join('')}</div>`; },
        };
      }
      if (lvl === 1) {
        if (Math.random() < 0.5) {
          const l = M.pick(F.liens);
          const s = U.simple(l.ok, l.d);
          return {
            prompt: `${l.q}`, format: 'choice', ...s, cols: 3,
            hint: 'Fais un petit dessin : la personne, puis sa mère ou son père, puis…',
            explain: `${l.q.replace('…', '')} <b>${l.ok}</b>.`,
          };
        }
        const adults = fam.membres.filter((m) => m.adulte).length, kids = fam.membres.length - adults;
        const askAd = Math.random() < 0.5;
        return {
          scene, prompt: `Dans la famille de ${fam.nom}, combien y a-t-il ${askAd ? 'd\'adultes' : 'd\'enfants'} ? {?}`, format: 'number', answer: askAd ? adults : kids,
          hint: askAd ? 'Les adultes sont les grandes personnes. Compte seulement les adultes.' : 'Compte seulement les enfants : les bébés, les filles et les garçons.',
          explain: `Famille de ${fam.nom} : ${list}. Il y a <b>${adults} adulte${adults > 1 ? 's' : ''}</b> et <b>${kids} enfant${kids > 1 ? 's' : ''}</b>.`,
          viz: (el) => { el.innerHTML = `<div class="us-mytl">${fam.membres.map((m) => `<span class="chip">${m.emoji} ${m.role}</span>`).join('')}</div>`; },
        };
      }
      if (Math.random() < 0.5) {
        const c = M.pick(F.composes);
        const s = U.simple(c.ok, c.d);
        return {
          passage: { html: c.t }, prompt: c.q, format: 'choice', ...s, cols: 3,
          hint: 'Beau-père, belle-mère : le conjoint du parent. Demi-frère, demi-sœur : un seul parent en commun.',
          explain: `${c.t} Donc, <b>${c.ok}</b>. Les familles recomposées ont des mots spéciaux.`,
        };
      }
      const A = U.d('familles').arbre;
      const it = M.pick(A.q);
      const names = A.gens.filter((g) => g.id !== 'leo').map((g) => g.nom);
      const s = U.simple(it.ok, M.shuffle(names.filter((n) => n !== it.ok)).slice(0, 2));
      return {
        prompt: `Regarde l'arbre de la famille de Léo ⭐. Qui est <b>${it.lien}</b> de Léo ?`, format: 'choice', ...s, cols: 3,
        viz: (el) => { el.innerHTML = U.treeSvg(); },
        hint: 'Suis les lignes : du couple vers leurs enfants. Lina est la maman de Léo.',
        explain: `${it.why} : c'est <b>${it.ok}</b>, ${it.lien} de Léo.`,
      };
    },
  });

  /* ---------------------------------------------------------------- us-lieux-metiers */
  M.registerSkill({
    id: 'us-lieux-metiers', domain: D, title: 'Les lieux et les métiers du quartier', icon: '🏪', learn: 'us-communaute',
    desc: 'Quel lieu répond à quel besoin; qui y travaille.',
    pda: 'GHEC 2.3 a–c (éléments économiques, besoins satisfaits, transports), 2.4 a (hôtel de ville), A.4 a–b',
    gen({ lvl }) {
      const L = U.d('lieux');
      const lieux = L.lieux.filter((l) => l.id !== 'hotel');
      if (lvl === 0) {
        const ls = M.shuffle(lieux).slice(0, 4);
        return {
          prompt: 'Associe chaque lieu au besoin qu\'il aide à combler.', format: 'match',
          pairs: ls.map((l) => ({ left: `${l.emoji} ${U.cap(l.court)}`, right: U.cap(l.besoin), sayLeft: l.nom, sayRight: l.besoin })),
          hint: 'Que fait-on dans ce lieu ?', explain: ls.map((l) => `${l.emoji} ${U.cap(aLe(l.nom))}, on peut ${l.pour}.`).join(' '),
        };
      }
      if (lvl === 1) {
        if (Math.random() < 0.5) {
          const ls = M.shuffle(lieux).slice(0, 4);
          const byTool = Math.random() < 0.5;
          return {
            prompt: byTool ? 'Associe chaque métier à un objet qu\'il utilise.' : 'Associe chaque métier à son lieu de travail.', format: 'match',
            pairs: ls.map((l) => ({ left: U.cap(l.metier), right: byTool ? `<span style="font-size:2rem">${l.outil}</span>` : `${l.emoji} ${U.cap(l.court)}`, sayLeft: l.metier, ...(byTool ? {} : { sayRight: l.nom }) })),
            hint: 'Imagine la personne au travail.', explain: ls.map((l) => `${U.cap(l.metier)} travaille ${aLe(l.nom)} ${l.emoji}${byTool ? ` et utilise ${l.outil}` : ''}.`).join(' '),
          };
        }
        const l = M.pick(lieux);
        const s = U.simple(`${l.emoji} ${U.cap(l.nom)}`, M.shuffle(lieux.filter((x) => x !== l && x.emoji !== l.emoji)).slice(0, 2).map((x) => `${x.emoji} ${U.cap(x.nom)}`));
        return {
          prompt: `Où va-t-on pour <b>${l.pour}</b> ?`, format: 'choice', ...s, cols: 3,
          hint: 'Pense à ce qu\'on trouve dans chaque lieu.', explain: `Pour ${l.pour}, on va ${aLe(l.nom)} ${l.emoji}. ${U.cap(l.metier)} y travaille.`,
        };
      }
      if (Math.random() < 0.5) {
        const items = [...M.shuffle(L.biens).slice(0, 3).map((b) => ({ label: b, bin: 'bien' })), ...M.shuffle(L.services).slice(0, 3).map((b) => ({ label: b, bin: 'service' }))];
        return {
          prompt: 'Classe : est-ce un <b>bien</b> (une chose qu\'on achète) ou un <b>service</b> (un travail fait pour nous) ?', format: 'sort',
          bins: [{ id: 'bien', label: '📦 Bien' }, { id: 'service', label: '🤝 Service' }], items: items.map((i) => ({ ...i, say: i.label })),
          hint: 'Peux-tu le tenir dans tes mains et l\'apporter à la maison ? Alors c\'est un bien.',
          explain: 'Un <b>bien</b>, c\'est une chose qu\'on achète (du pain, des bottes). Un <b>service</b>, c\'est un travail qu\'une personne fait pour nous (couper les cheveux, réparer l\'auto).',
        };
      }
      const m = M.pick(L.municipal);
      const s = U.simple(m.ok, m.d);
      return {
        scene: [{ emoji: '🏛️', label: 'l\'hôtel de ville' }], prompt: m.q, format: 'choice', ...s, cols: 1,
        hint: 'La ville a un conseil municipal qui prend des décisions pour tout le monde.',
        explain: `<b>${m.ok}</b>. À l'hôtel de ville, le conseil municipal (avec la mairesse ou le maire) décide pour la ville : les parcs, les rues, les bibliothèques…`,
      };
    },
  });

  /* ---------------------------------------------------------------- us-animaux */
  const ROLES = [
    ['🦮 Le chien-guide', 'Il aide une personne aveugle.'], ['🐈 Le chat', 'Il tient compagnie.'],
    ['🐝 L\'abeille', 'Elle fait le miel et aide les fleurs à faire des fruits.'], ['🐄 La vache', 'Elle donne du lait.'],
    ['🐔 La poule', 'Elle pond des œufs.'], ['🐑 Le mouton', 'Il donne de la laine.'],
    ['🐕 Le chien de sauvetage', 'Il aide à retrouver des personnes perdues.'],
  ];
  const ANIMAUX = [
    { a: 'un chat 🐈', ok: ['de l\'eau fraîche 💧', 'de la nourriture pour chat 🥣', 'un endroit chaud pour dormir 🛏️', 'des jeux et de l\'attention 🧶'] },
    { a: 'un chien 🐕', ok: ['de l\'eau fraîche 💧', 'de la nourriture pour chien 🥣', 'des promenades 🦮', 'des soins du vétérinaire 🩺'] },
    { a: 'un lapin 🐇', ok: ['de l\'eau fraîche 💧', 'du foin et des légumes 🥕', 'une cage propre et grande 🏠', 'de l\'attention et des caresses douces 🤲'] },
  ];
  const PAS = ['du chocolat 🍫', 'des bonbons 🍬', 'un téléphone 📱', 'des souliers 👟'];
  const BIEN = [
    { t: 'Il fait très chaud. Le chien de Kevin halète au soleil.', ok: 'Lui donner de l\'eau fraîche et le mettre à l\'ombre.', harm: 'Le laisser dans l\'auto fermée.', off: 'Lui mettre un manteau.' },
    { t: 'Le chat de Mei dort en boule sur le divan.', ok: 'Le laisser dormir tranquille.', harm: 'Lui tirer la queue pour le réveiller.', off: 'Lui donner un crayon.' },
    { t: 'Awa voit un oiseau blessé dans la cour.', ok: 'Ne pas le toucher et avertir un adulte.', harm: 'Le lancer en l\'air pour l\'aider à voler.', off: 'Chanter une chanson.' },
    { t: 'Noah veut flatter un chien qu\'il ne connaît pas, au parc.', ok: 'Demander d\'abord la permission au propriétaire.', harm: 'Courir vers le chien en criant.', off: 'Compter les arbres.' },
    { t: 'Le poisson rouge de Samuel nage dans un aquarium.', ok: 'Lui donner un peu de nourriture et garder l\'eau propre.', harm: 'Vider toute la boîte de nourriture dans l\'eau.', off: 'Lui lire une histoire.' },
    { t: 'Le lapin d\'Inès a fini son eau.', ok: 'Remplir son bol d\'eau fraîche.', harm: 'Lui donner du jus sucré.', off: 'Mettre ses bottes.' },
  ];
  M.registerSkill({
    id: 'us-animaux', domain: D, title: 'Les animaux dans nos vies', icon: '🐕', learn: 'us-communaute',
    desc: 'Compagnie, aide, travail; prendre soin d\'un animal.',
    pda: 'CCQ 2e — Rôles des autres êtres vivants; responsabilités, soin des animaux, bien-être animal',
    gen({ lvl }) {
      if (lvl === 0) {
        const a = M.pick(ANIMAUX), pas = M.shuffle(PAS).slice(0, 2);
        const ch = M.shuffle([...a.ok, ...pas]).map((l, i) => ({ label: l, value: 'v' + i }));
        return {
          prompt: `De quoi ${a.a} a-t-il besoin ? Touche toutes les bonnes réponses.`, format: 'multi', choices: ch, cols: 2,
          answer: ch.filter((c) => a.ok.includes(c.label)).map((c) => c.value),
          hint: 'Comme nous, un animal a besoin de boire, de manger, d\'un abri et d\'attention.',
          explain: `${U.cap(a.a)} a besoin de : ${a.ok.join(', ')}. ${pas.map((p) => U.cap(p)).join(' et ')} ne répondent pas à ses besoins${pas.some((p) => /chocolat/.test(p)) ? ' (le chocolat est même dangereux pour les chiens et les chats)' : ''}.`,
        };
      }
      if (lvl === 1) {
        const ps = M.shuffle(ROLES).slice(0, 4);
        return {
          prompt: 'Associe chaque animal à son <b>rôle</b> dans la vie des humains.', format: 'match',
          pairs: ps.map(([a, r]) => ({ left: a, right: r, sayLeft: a, sayRight: r })),
          hint: 'Certains animaux nous tiennent compagnie, d\'autres nous aident ou nous donnent de la nourriture.',
          explain: 'Les animaux ont plusieurs <b>rôles</b> : la compagnie (chat), l\'aide (chien-guide), le travail ou la nourriture (vache, poule, abeille). En retour, on doit bien prendre soin d\'eux.',
        };
      }
      const b = M.pick(BIEN);
      const t = U.tagged([{ label: b.ok, tag: 'ok' }, { label: b.harm, tag: 'harm' }, { label: b.off, tag: 'off' }]);
      return {
        passage: { html: b.t }, prompt: 'Quel geste respecte le <b>bien-être</b> de l\'animal ?', format: 'choice', ...t, cols: 1,
        hint: 'Mets-toi à la place de l\'animal : qu\'est-ce qui lui fait du bien ?',
        explain: `${b.ok} C'est un geste de <b>bien-être animal</b> : l'animal est en sécurité et en santé.`,
      };
    },
  });
})();
