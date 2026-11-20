/* =====================================================================
   Univers social — Se repérer (us-reperer)
   us-plan · us-paysages
   Plans : M.viz.plan (légende, lieux data-hot, rose des vents). Points cardinaux au niveau 2 seulement,
   nord toujours en haut, paires purement verticales ou horizontales.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const D = 'us-reperer';

  /** Html d'un plan déclaratif (data/plans.js). */
  U.planHtml = (p, { north = false } = {}) =>
    M.viz.plan({ title: p.titre, cols: p.cols, rows: p.rows, roads: p.roads, places: p.places, ground: p.ground, water: p.water, north });
  /** Montre-moi : surligne l'élément de légende, puis le lieu. */
  const flash = (id) => async (el) => {
    const card = el.closest ? el.closest('.q-card') : null;
    if (!card) return;
    const chip = M.$(`.plan-leg-it[data-for="${id}"]`, card);
    if (chip) {
      chip.style.borderColor = 'var(--B)';
      chip.style.background = 'var(--Bb)';
    }
    await M.sleep(700);
    M.$$('.plan-place', card).forEach((g) => g.classList.toggle('flash-on', g.dataset.hot === id));
  };
  const near = (a, b) => Math.abs(a - b) < 0.3;
  /** Direction de A par rapport à B, ou null si la paire n'est pas alignée. */
  const dir = (A, B) => {
    if (near(A.x, B.x) && near(A.w || 1, B.w || 1)) return A.y < B.y ? 'nord' : 'sud';
    if (near(A.y, B.y) && near(A.h || 1, B.h || 1)) return A.x < B.x ? 'ouest' : 'est';
    return null;
  };
  /** Voisins immédiats sur la même rangée (sans traverser de rue). */
  const neighbours = (p, places) =>
    places.filter(
      (o) => o !== p && near(o.y, p.y) && (Math.abs(o.x - (p.x + (p.w || 1))) < 0.6 || Math.abs(p.x - (o.x + (o.w || 1))) < 0.6),
    );
  const The = (s) => U.cap(s);

  M.registerSkill({
    id: 'us-plan',
    domain: D,
    title: 'Lire un plan',
    icon: '🗺️',
    learn: 'us-plans',
    starter: true,
    desc: 'Titre, légende, symboles, repères; points cardinaux au niveau 2.',
    pda: 'GHEC A.1 a–b; Techniques 1 a, b, d, e (lire le titre, décoder la légende, points cardinaux, repères)',
    parentNote:
      "Les points cardinaux n'apparaissent qu'au niveau ★★ (défi), toujours avec le nord en haut. La position gauche/droite et le quadrillage sont travaillés en mathématique.",
    gen({ lvl }) {
      const plans = U.d('plans');
      if (lvl === 2 && Math.random() < 0.7) {
        const p = M.pick(plans);
        const pairs = [];
        p.places.forEach((a) =>
          p.places.forEach((b) => {
            if (a !== b && dir(a, b)) pairs.push([a, b]);
          }),
        );
        const [A, B] = M.pick(pairs);
        const ans = dir(A, B);
        // « au nord », « au sud », « à l'est », « à l'ouest » + « du salon », « de la cuisine », « de l'école », « des casiers »
        const LOC = { nord: 'au nord', sud: 'au sud', est: "à l'est", ouest: "à l'ouest" };
        const ch = ['nord', 'sud', 'est', 'ouest'].map((d) => ({ label: LOC[d], value: d }));
        const where = { nord: 'plus haut', sud: 'plus bas', est: 'à droite', ouest: 'à gauche' }[ans];
        const est = /^les /.test(A.nom) ? 'sont' : 'est';
        return {
          prompt: `Regarde la rose des vents 🧭. ${The(A.nom)} ${A.emoji} ${est} ▢ ${M.fr.de(B.nom)} ${B.emoji}.`,
          say: `Regarde la rose des vents. Où ${est === 'sont' ? 'sont' : 'est'} ${A.nom}, par rapport ${M.fr.a(B.nom)} ?`,
          format: 'choice',
          choices: ch,
          answer: ans,
          cols: 4,
          viz: (el) => {
            el.innerHTML = U.planHtml(p, { north: true });
          },
          hint: `Le nord est en haut, le sud en bas, l'est à droite et l'ouest à gauche. Pars ${M.fr.de(B.nom)}.`,
          explain: `Pars ${M.fr.de(B.nom)} ${B.emoji} : ${A.nom} ${A.emoji} ${est} ${where}. ${The(A.nom)} ${est} donc <b>${LOC[ans]}</b> ${M.fr.de(B.nom)}.`,
        };
      }
      const p = M.pick(lvl === 0 ? plans.filter((x) => x.id !== 'classe') : plans);
      if (lvl >= 1 && Math.random() < 0.35) {
        const cands = p.places.filter((x) => neighbours(x, p.places).length === 1);
        if (cands.length) {
          const X = M.pick(cands),
            N = neighbours(X, p.places)[0];
          const others = M.shuffle(p.places.filter((o) => o !== X && o !== N && !neighbours(X, p.places).includes(o))).slice(0, 2);
          const s = U.simple(
            `${N.emoji} ${N.label}`,
            others.map((o) => `${o.emoji} ${o.label}`),
          );
          return {
            prompt: `Sur le plan, qu'y a-t-il <b>juste à côté</b> ${M.fr.de(X.nom)} ${X.emoji} ?`,
            format: 'choice',
            ...s,
            cols: 3,
            viz: (el) => {
              el.innerHTML = U.planHtml(p);
            },
            hint: `Trouve ${X.nom} ${X.emoji} sur le plan, puis regarde ce qui est tout près.`,
            explain: `Sur le plan « ${p.titre} », ${N.nom} ${N.emoji} ${/^les /.test(N.nom) ? 'sont' : 'est'} juste à côté ${M.fr.de(X.nom)} ${X.emoji}.`,
          };
        }
      }
      const X = M.pick(p.places);
      const byFn = lvl >= 1;
      return {
        prompt: byFn ? `Regarde la légende. Touche l'endroit <b>${X.fn}</b>.` : `Touche <b>${X.nom}</b> sur le plan.`,
        format: 'hotspot',
        html: U.planHtml(p),
        answer: X.id,
        answerText: `${X.emoji} ${X.label}`,
        answerSay: X.nom,
        hint: byFn
          ? 'Lis la légende sous le plan : quel symbole correspond ?'
          : `Cherche le symbole ${X.emoji} dans la légende, puis sur le plan.`,
        explain: `Dans la légende, ${X.emoji} veut dire <b>${X.label}</b>. ${byFn ? `C'est ${X.fn}. ` : ''}Le titre du plan est « ${p.titre} ».`,
        showMe: flash(X.id),
      };
    },
  });

  M.registerSkill({
    id: 'us-paysages',
    domain: D,
    title: 'Les paysages',
    icon: '🏞️',
    learn: 'us-plans',
    desc: 'Éléments naturels et éléments humains; fleuve, lac, rivière.',
    pda: 'GHEC A.3 (relief, climat, hydrographie, ressources); Explorer des paysages',
    gen({ lvl }) {
      const P = U.d('paysages');
      if (lvl === 0) {
        const items = [
          ...M.shuffle(P.elements.filter((e) => e.kind === 'naturel')).slice(0, 3),
          ...M.shuffle(P.elements.filter((e) => e.kind === 'humain')).slice(0, 3),
        ];
        return {
          prompt: 'Classe : est-ce un élément <b>naturel</b> ou construit par les <b>humains</b> ?',
          format: 'sort',
          bins: [
            { id: 'naturel', label: '🌲 Naturel' },
            { id: 'humain', label: '🏠 Construit par les humains' },
          ],
          items: items.map((e) => ({ label: `${e.emoji} ${e.nom}`, bin: e.kind, say: e.nom })),
          hint: 'Est-ce que ça existait avant que les humains construisent des choses ?',
          explain:
            'Les éléments <b>naturels</b> sont faits par la nature (montagne, arbre, rivière). Les éléments <b>humains</b> sont construits par les personnes (maison, pont, route).',
        };
      }
      if (lvl === 1) {
        const ms = M.shuffle(P.mots).slice(0, 4);
        return {
          prompt: 'Associe chaque image au bon mot.',
          format: 'match',
          pairs: ms.map((m) => ({ left: M.art.html(m.art, { size: 72, alt: m.nom }), right: m.nom, sayRight: m.nom })),
          hint: 'Un lac est fermé, une rivière serpente, un fleuve est très large.',
          explain: ms.map((m) => `<b>${U.cap(m.nom)}</b> : ${m.def}.`).join(' '),
        };
      }
      if (Math.random() < 0.5) {
        const f = M.pick(P.faits);
        return {
          prompt: `Vrai ou faux ? ${f.t}`,
          format: 'tf',
          answer: f.v,
          hint: "Pense : est-ce fait par la nature ou par les humains ? Est-ce de l'eau qui coule ?",
          explain: f.v
            ? `C'est <b>vrai</b> : ${f.t.charAt(0).toLowerCase() + f.t.slice(1)}`
            : `C'est <b>faux</b>. ${{ 'Un pont est un élément naturel.': 'Un pont est construit par les humains.', 'Les montagnes ont été construites par les humains.': 'Les montagnes sont des éléments naturels.', 'Une rivière coule toujours dans un lac fermé, sans jamais en sortir.': "Une rivière coule, souvent jusqu'à une autre rivière, un lac ou un fleuve." }[f.t] || ''}`,
        };
      }
      const a = M.pick(P.ailleurs);
      const s = U.simple(a.ok, a.d);
      return {
        prompt: a.t,
        format: 'choice',
        ...s,
        cols: 1,
        hint: 'Pense au climat de cet endroit : chaud, froid, sec ?',
        explain: `<b>${a.ok}</b>. Les gens s'adaptent au climat et au paysage de l'endroit où ils vivent.`,
      };
    },
  });
})();
