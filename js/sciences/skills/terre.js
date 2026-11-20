/* =====================================================================
   sciences/skills/terre.js — domaine sc-terre (habiletés 14 et 15)
   Règles : la Lune ne fait pas de lumière; c'est la Terre qui tourne (jour / nuit);
   on décrit les saisons, on n'explique JAMAIS leur cause (3e cycle).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  const Q = SC.Q;

  /* ================================================================ 14 */
  const arbreCh = (moment, side, cap) => `${SC.svg.arbre({ moment, shadowSide: side })}${cap ? `<span class="sc-cap">${cap}</span>` : ''}`;
  M.registerSkill({
    id: 'sc-soleil-terre-lune', domain: 'sc-terre', title: 'Soleil, Terre, Lune et ombres', icon: '☀️', learn: 'sc-l-terre',
    desc: 'Le Soleil est une étoile, la Terre une planète, la Lune un satellite; l\'ombre change pendant la journée; le jour et la nuit.',
    pda: 'Terre et espace D.1.a — position apparente du Soleil et longueur de l\'ombre; D.2.a — Soleil (étoile), Terre (planète), Lune (satellite naturel) (1er cycle); enrichissement en lvl 2 : C.1.a — jour et nuit, rotation de la Terre (2e cycle)',
    gen({ lvl }) {
      const t = lvl === 0 ? M.pick(['astres', 'midi', 'jn', 'jn', 'quel', 'vf']) : lvl === 1 ? M.pick(['midi', 'cote', 'astres', 'vf', 'jn', 'quel']) : M.pick(['nuit', 'nuit', 'vf', 'cote', 'q2', 'q2']);
      if (t === 'jn') {
        const n = lvl === 0 ? 2 : 3;
        const items = [...Q.pickN(SC.JOUR_NUIT.jour, n).map((l) => ({ label: l, bin: 'jour', key: l })), ...Q.pickN(SC.JOUR_NUIT.nuit, n).map((l) => ({ label: l, bin: 'nuit', key: l }))];
        return {
          prompt: 'Est-ce que ça se passe le <b>jour</b> ou la <b>nuit</b> ? Classe-les.', format: 'sort', items,
          bins: [{ id: 'jour', label: '☀️ Le jour' }, { id: 'nuit', label: '🌙 La nuit' }],
          hint: 'Le jour, le Soleil nous éclaire. La nuit, le ciel est noir.',
          explain: 'Le <b>jour</b>, notre côté de la Terre est éclairé par le Soleil. La <b>nuit</b>, il est dans l\'ombre : le ciel est noir et on voit les étoiles.',
          _sc: 'jn',
        };
      }
      if (t === 'quel') {
        const x = M.pick(SC.ASTRE_Q);
        return {
          prompt: x.t, format: 'choice', answer: x.a, cols: 3,
          choices: M.shuffle(SC.ASTRES.slice()).map((a) => ({ label: `${M.art.html('ciel-' + a.id, { size: 40, alt: a.label.replace(/^\S+ /, '') })} ${a.label.replace(/^\S+ /, '')}`, value: a.id })),
          hint: 'Une étoile fait sa propre lumière. On vit sur une planète. Un satellite tourne autour d\'une planète.',
          explain: x.e,
        };
      }
      if (t === 'q2') {
        const x = M.pick(SC.CIEL_Q2);
        return {
          prompt: x.t, format: 'choice', answer: x.a, cols: 1,
          choices: M.shuffle([{ label: x.a, value: x.a }, ...x.d.map(([l, w]) => ({ label: l, value: l, why: w }))]),
          hint: 'Rappelle-toi : c\'est la Terre qui tourne, et l\'ombre est toujours du côté opposé au Soleil.',
          explain: x.e,
        };
      }
      if (t === 'astres') {
        return {
          prompt: 'Le Soleil, la Terre et la Lune : associe chacun à ce qu\'il est.', format: 'match',
          pairs: SC.ASTRES.map((a) => ({ left: `${M.art.html('ciel-' + a.id, { size: 40, alt: a.label.replace(/^\S+ /, '') })} ${a.label.replace(/^\S+ /, '')}`, right: `<span><b>${a.type}</b><br><small>${a.def}</small></span>` })),
          hint: 'Une étoile fait sa propre lumière. On vit sur une planète. Un satellite tourne autour d\'une planète.',
          explain: 'Le <b>Soleil</b> est une étoile : il fait sa propre lumière. La <b>Terre</b> est une planète. La <b>Lune</b> est un satellite naturel : elle tourne autour de la Terre et elle est éclairée par le Soleil.',
        };
      }
      if (t === 'midi') {
        const order = M.shuffle(['matin', 'midi', 'soir']);
        return {
          prompt: 'Regarde le Soleil et l\'ombre de l\'arbre. Quel dessin montre l\'arbre à <b>midi</b> ?', format: 'choice', answer: 'midi', cols: 3,
          choices: order.map((m) => ({ label: arbreCh(m), value: m, why: m === 'midi' ? undefined : 'Ici, le Soleil est bas dans le ciel : l\'ombre est longue. C\'est le matin ou le soir.' })).map((c) => (c.why ? c : { label: c.label, value: c.value })),
          hint: 'À midi, le Soleil est très haut dans le ciel. L\'ombre est-elle longue ou courte ?',
          explain: 'À <b>midi</b>, le Soleil est haut dans le ciel : l\'ombre est <b>courte</b>. Le matin et le soir, le Soleil est bas : l\'ombre est <b>longue</b>.',
          _sc: { kind: 'midi' },
        };
      }
      if (t === 'cote') {
        const moment = M.pick(['matin', 'soir']);
        const right = moment === 'matin' ? 1 : -1;
        const opts = M.shuffle([right, -right, 0]);
        return {
          prompt: 'Le Soleil est bas dans le ciel. Quel dessin montre la <b>bonne ombre</b> ?', format: 'choice', answer: String(right), cols: 3,
          choices: opts.map((s) => {
            const c = { label: arbreCh(moment, s), value: String(s) };
            if (s === -right) c.why = 'Ici, l\'ombre est du même côté que le Soleil : c\'est impossible !';
            if (s === 0) c.why = 'Quand le Soleil brille, l\'arbre a toujours une ombre.';
            return c;
          }),
          hint: 'L\'ombre est toujours du côté <b>opposé</b> au Soleil : l\'arbre bloque la lumière.',
          explain: 'L\'arbre bloque la lumière du Soleil : l\'ombre se forme <b>de l\'autre côté</b> de l\'arbre. Et comme le Soleil est bas, l\'ombre est longue.',
          _sc: { kind: 'cote', right },
        };
      }
      if (t === 'nuit') {
        const sunLeft = M.pick([true, false]);
        const want = M.pick(['nuit', 'jour']);
        return {
          prompt: `La Terre vue d'en haut, avec le Soleil. Touche une maison où il fait <b>${want}</b>.`, format: 'hotspot', answer: want,
          html: SC.svg.terre({ sunLeft }), answerText: want === 'nuit' ? 'une maison du côté sombre' : 'une maison du côté éclairé',
          hint: 'Le côté de la Terre qui fait face au Soleil est éclairé. L\'autre côté est dans l\'ombre.',
          explain: 'Le côté de la Terre tourné vers le Soleil est éclairé : il fait <b>jour</b>. L\'autre côté est dans l\'ombre : il fait <b>nuit</b>. La Terre tourne sur elle-même en un jour : chaque maison passe du jour à la nuit !',
        };
      }
      const s = M.pick(SC.CIEL_VF.filter((x) => lvl > 0 || x.facile));
      return { prompt: `Vrai ou faux ? « ${s.t} »`, format: 'tf', answer: s.v, explain: s.e, hint: 'Qui fait sa propre lumière ? Qui tourne ?' };
    },
    check(q) {
      if (q._sc === 'jn') return Q.checkSort(q, (k) => (SC.JOUR_NUIT.jour.includes(k) ? 'jour' : SC.JOUR_NUIT.nuit.includes(k) ? 'nuit' : '?'));
      if (q._sc && q._sc.kind === 'midi') return Q.checkOne(q, (v) => v === 'midi');
      if (q._sc && q._sc.kind === 'cote') return Q.checkOne(q, (v) => v === String(q._sc.right));
    },
  });

  /* ================================================================ 15 */
  const S = (id) => SC.saison(id);
  M.registerSkill({
    id: 'sc-saisons-meteo', domain: 'sc-terre', title: 'Saisons et météo', icon: '🍂', starter: true, learn: 'sc-l-terre',
    desc: 'Les 4 saisons au Québec : température, longueur du jour, précipitations, vêtements et activités.',
    pda: 'Terre et espace D.4.a–b — changements au fil des saisons (température, luminosité, précipitations), sensations de chaud et de froid; A.3.a — précipitations (pluie, neige, grêle, pluie verglaçante) (1er cycle)',
    parentNote: 'On décrit les saisons sans expliquer leur cause (révolution et inclinaison de la Terre : 3e cycle).',
    gen({ lvl }) {
      const t = lvl === 0 ? 'sort2' : lvl === 1 ? M.pick(['sort4', 'ordre', 'precip']) : M.pick(['q', 'q', 'precip', 'sort4']);
      if (t === 'sort2' || t === 'sort4') {
        const ids = t === 'sort2' ? ['hiver', 'ete'] : ['hiver', 'printemps', 'ete', 'automne'];
        const items = [];
        ids.forEach((id) => Q.pickN(S(id).activites, t === 'sort2' ? 2 : M.pick([1, 2])).forEach((l) => items.push({ label: l, bin: id, key: l })));
        return {
          prompt: 'En quelle saison fait-on ça, au Québec ? Classe-les.', format: 'sort', items,
          bins: ids.map((id) => ({ id, label: `${S(id).icon} ${S(id).label}` })),
          hint: 'Fait-il froid ou chaud ? Y a-t-il de la neige, des feuilles qui tombent, des bourgeons ?',
          explain: ids.map((id) => `<b>${S(id).label}</b> : ${S(id).temp.toLowerCase()}, ${S(id).precip.toLowerCase()}.`).join(' '),
          _sc: 'saison',
        };
      }
      if (t === 'ordre') {
        const L = SC.SAISONS;
        return {
          prompt: 'Les saisons reviennent chaque année. Après l\'<b>hiver</b>, quelles saisons viennent ? Touche-les dans l\'ordre.', format: 'order', fixed: [0],
          choices: M.shuffle(L.map((s) => ({ label: `${s.icon} ${s.label}`, value: s.id }))), answer: L.map((s) => s.id),
          hint: 'Après l\'hiver, la neige fond et les bourgeons sortent…',
          explain: 'Hiver → printemps → été → automne… puis l\'hiver revient. C\'est un <b>cycle</b> qui recommence chaque année.',
        };
      }
      if (t === 'precip') {
        const pick = Q.pickN(SC.PRECIP, lvl === 1 ? 3 : 4);
        return {
          prompt: 'Qu\'est-ce qui tombe du ciel ? Associe chaque précipitation à sa description.', format: 'match',
          pairs: pick.map((p) => ({ left: p.label, right: p.def })),
          hint: 'La neige est légère, la grêle est dure comme des billes.',
          explain: SC.PRECIP.map((p) => `<b>${SC.plain(p.label)}</b> : ${p.def.toLowerCase()}.`).join(' '),
        };
      }
      const x = M.pick(SC.SAISON_Q);
      return {
        prompt: x.t, format: 'choice', answer: x.a, choices: M.shuffle([x.a, ...x.d]).map((c) => ({ label: c, value: c })),
        hint: 'Pense à ce que tu vois dehors pendant cette saison.', explain: x.e,
      };
    },
    check(q) {
      if (q._sc === 'saison') return Q.checkSort(q, (k) => { const s = SC.SAISONS.filter((x) => x.activites.includes(k)); return s.length === 1 ? s[0].id : 'ambigu'; });
      if (q.format === 'order' && (!q.fixed || q.fixed[0] !== 0)) return 'cycle : 1er élément requis';
    },
  });
})();
