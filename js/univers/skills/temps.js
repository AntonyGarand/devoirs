/* =====================================================================
   Univers social — Avant et maintenant (us-temps)
   us-avant-maintenant · us-ligne-temps
   « Autrefois » = il y a environ 100 ans (arrière-grands-parents), sans dates précises.
   Lignes du temps : personnages fictifs seulement (R5).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const D = 'us-temps';
  U.pic = (o, size = 44) => (o.art ? M.art.html(o.art, { size, alt: o.nom }) : `<span style="font-size:${Math.round(size * 0.8)}px">${o.emoji}</span>`);

  M.registerSkill({
    id: 'us-avant-maintenant', domain: D, title: 'Avant et maintenant', icon: '📻', learn: 'us-temps', starter: true,
    desc: 'Objets, transports et activités d\'il y a environ 100 ans.',
    pda: 'GHEC — Changement A a–c (objets d\'usage courant, activités, transports); Diversité A.1 a–b',
    gen({ lvl }) {
      const A = U.d('autrefois');
      if (lvl === 0) {
        const ps = M.shuffle(A.paires).slice(0, 6);
        const items = [...ps.slice(0, 3).map((p) => ({ o: p.avant, bin: 'avant' })), ...ps.slice(3).map((p) => ({ o: p.maintenant, bin: 'maintenant' }))];
        return {
          prompt: 'Classe : est-ce un objet d\'<b>autrefois</b> (il y a environ 100 ans) ou d\'<b>aujourd\'hui</b> ?', format: 'sort',
          bins: [{ id: 'avant', label: '🕰️ Autrefois' }, { id: 'maintenant', label: '📱 Aujourd\'hui' }],
          items: items.map((i) => ({ label: `<span class="us-art-lbl">${U.pic(i.o)}<span>${i.o.nom}</span></span>`, bin: i.bin, say: i.o.nom })),
          hint: 'Est-ce que ça fonctionne avec l\'électricité ou un écran ? Alors c\'est probablement d\'aujourd\'hui.',
          explain: `Il y a environ 100 ans, quand les arrière-grands-parents étaient enfants, on utilisait ${ps.slice(0, 3).map((p) => p.avant.nom).join(', ')}. Aujourd'hui, on utilise ${ps.slice(3).map((p) => p.maintenant.nom).join(', ')}.`,
        };
      }
      if (lvl === 1) {
        const ps = M.shuffle(A.paires).slice(0, 4);
        return {
          prompt: 'Associe chaque objet d\'<b>autrefois</b> à l\'objet d\'<b>aujourd\'hui</b> qui sert à la même chose.', format: 'match',
          pairs: ps.map((p) => ({ left: `<span class="us-art-lbl">${U.pic(p.avant, 40)}<span>${p.avant.nom}</span></span>`, right: `<span class="us-art-lbl">${U.pic(p.maintenant, 40)}<span>${p.maintenant.nom}</span></span>`, sayLeft: p.avant.nom, sayRight: p.maintenant.nom })),
          hint: 'À quoi sert l\'objet ? Éclairer, laver, garder au froid, se déplacer…',
          explain: ps.map((p) => `${p.avant.nom} → ${p.maintenant.nom}`).join(' · ') + '. Les objets changent, mais nos besoins restent les mêmes.',
        };
      }
      if (Math.random() < 0.4) {
        const byRank = [0, 1, 2, 3].map((r) => A.transports.filter((t) => t.rang === r));
        const ranks = M.shuffle([0, 1, 2, 3]).slice(0, 3).sort((a, b) => a - b);
        const seq = ranks.map((r) => M.pick(byRank[r]));
        return {
          prompt: 'Place ces moyens de transport du <b>plus ancien</b> au <b>plus récent</b>.', format: 'order',
          choices: M.shuffle(seq).map((t) => ({ label: `${t.emoji} ${t.nom}`, value: t.nom })), answer: seq.map((t) => t.nom),
          hint: 'Lequel n\'a pas besoin de moteur ? Lequel est allé dans l\'espace ?',
          explain: `Du plus ancien au plus récent : ${seq.map((t) => `${t.emoji} ${t.nom}`).join(' → ')}. Les humains ont inventé des transports de plus en plus rapides.`,
        };
      }
      const q = M.pick(A.questions);
      const s = U.simple(q.ok, q.d);
      return {
        prompt: q.q, format: 'choice', ...s, cols: 1,
        hint: 'Il y a 100 ans, il n\'y avait pas d\'écrans ni d\'Internet.',
        explain: `<b>${q.ok}</b>. Il y a environ 100 ans, quand les arrière-grands-parents étaient enfants, la vie était différente.`,
        viz: (el) => { const p = M.pick(A.paires); el.innerHTML = M.ui.compare({ left: { title: '🕰️ Autrefois', items: [{ emoji: U.pic(p.avant, 36), label: p.avant.nom }] }, right: { title: '📱 Aujourd\'hui', items: [{ emoji: U.pic(p.maintenant, 36), label: p.maintenant.nom }] } }); },
      };
    },
  });

  /** Html de ligne du temps d'un personnage (défilement horizontal sur téléphone) + légende. */
  U.timelineHtml = (pers, { hide = [], legend = true } = {}) => {
    const evs = pers.evenements.map((e) => ({ at: e.annee, label: e.label, emoji: e.emoji, id: e.id }));
    // Titre hors du SVG : il reste visible quand la ligne défile sur téléphone.
    const tl = M.viz.timeline({ from: pers.naissance, to: pers.naissance + 8, title: '', events: evs, hide }).replace('aria-label="Ligne du temps"', `aria-label="La vie de ${pers.nom}"`);
    const leg = legend ? `<div class="us-leg">${pers.evenements.filter((e) => !hide.includes(e.id)).map((e) => `<span class="chip">${e.emoji} ${e.label}</span>`).join('')}</div>` : '';
    return `<div class="plan-title" style="text-align:center">La vie de ${pers.nom}</div><div class="us-swipe">👉 Glisse la ligne du temps pour tout voir 👈</div><div class="us-tl">${tl}</div>${leg}`;
  };

  M.registerSkill({
    id: 'us-ligne-temps', domain: D, title: 'La ligne du temps de la vie', icon: '📏', learn: 'us-temps',
    desc: 'Ordonner des événements; les âges de la vie.',
    pda: 'GHEC A.1 d–f, Techniques 3 (interpréter une ligne du temps) · CCQ 2e — Étapes de la vie depuis la naissance',
    parentNote: 'Les lignes du temps notées sont celles de personnages fictifs. La ligne du temps de l\'enfant se fait seulement sur la page Apprendre, avec un adulte, et rien n\'est enregistré.',
    gen({ lvl }) {
      const T = U.d('lignes-temps');
      if (lvl === 0) {
        if (Math.random() < 0.5) {
          const drop = M.rnd(0, T.ages.length - 1);
          const four = T.ages.filter((_, i) => i !== drop);
          return {
            prompt: 'Place les âges de la vie dans l\'ordre, du plus jeune au plus âgé.', format: 'order',
            choices: M.shuffle(four).map((a) => ({ label: `${a.emoji} ${a.court}`, value: a.id, say: a.nom })), answer: four.map((a) => a.id),
            hint: 'On commence par le tout-petit qui vient de naître.',
            explain: 'Les âges de la vie : ' + T.ages.map((a) => `${a.emoji} ${a.nom}`).join(' → ') + '.',
          };
        }
        const as = M.shuffle(T.ages).slice(0, 4);
        return {
          prompt: 'Associe chaque âge de la vie à une activité.', format: 'match',
          pairs: as.map((a) => ({ left: `${a.emoji} ${U.cap(a.nom)}`, right: U.cap(a.activite), sayLeft: a.nom, sayRight: a.activite })),
          hint: 'Que fait-on souvent à cet âge-là ?', explain: as.map((a) => `${a.emoji} ${U.cap(a.nom)} : ${a.activite}.`).join(' '),
        };
      }
      const pers = M.pick(T.personnages);
      const evs = pers.evenements;
      if (lvl === 1) {
        const r = Math.random();
        if (r < 0.45) {
          const e = M.pick(evs.filter((x) => x.id !== 'nais'));
          const byYear = Math.random() < 0.5 && evs.filter((x) => x.annee === e.annee).length === 1;
          return {
            prompt: byYear ? `Sur la ligne du temps, que s'est-il passé en <b>${e.annee}</b> ? Touche l'événement.` : `Touche le moment où ${pers.nom} a vécu cet événement : <b>${e.emoji} ${e.label}</b>.`,
            format: 'hotspot', html: U.timelineHtml(pers), answer: e.id, answerText: `${e.emoji} ${e.label} (${e.annee})`,
            hint: byYear ? `Trouve ${e.annee} sous la ligne, puis monte jusqu'à l'image.` : 'Cherche l\'image dans la légende, puis sur la ligne.',
            explain: `En <b>${e.annee}</b> : ${e.emoji} ${e.label}. La ligne du temps se lit de gauche (le plus ancien) à droite (le plus récent).`,
          };
        }
        if (r < 0.75) {
          const e = M.pick(evs.filter((x) => x.id !== 'nais'));
          const s = U.simple(`${e.emoji} ${e.label}`, M.shuffle(evs.filter((x) => x !== e)).slice(0, 2).map((x) => `${x.emoji} ${x.label}`));
          return {
            prompt: `Quel événement de la vie de ${pers.nom} se cache sous le <b>?</b> ?`, format: 'choice', ...s, cols: 1,
            viz: (el) => { el.innerHTML = U.timelineHtml(pers, { hide: [e.id] }); },
            hint: 'Regarde l\'année sous le ? et les événements qui restent.',
            explain: `En ${e.annee}, ${pers.nom} a vécu : ${e.emoji} <b>${e.label}</b>.`,
          };
        }
        const a0 = M.pick(evs.filter((x) => x.id !== 'nais'));
        const b0 = M.pick(evs.filter((x) => x.id !== 'nais' && x.annee !== a0.annee));
        const [a, b] = [a0, b0].sort((x, y) => x.annee - y.annee);
        const s = U.simple(`${a.emoji} ${a.label}`, [`${b.emoji} ${b.label}`]);
        return {
          prompt: `Dans la vie de ${pers.nom}, qu'est-ce qui est arrivé <b>en premier</b> ?`, format: 'choice', ...s, cols: 1,
          viz: (el) => { el.innerHTML = U.timelineHtml(pers); },
          hint: 'Sur la ligne du temps, ce qui est arrivé en premier est plus à gauche.',
          explain: `${a.emoji} ${U.cap(a.label)} (${a.annee}) est arrivé avant ${b.emoji} ${b.label} (${b.annee}) : c'est plus à gauche sur la ligne.`,
        };
      }
      const ordered = evs.slice().sort((x, y) => x.annee - y.annee);
      const i = M.rnd(0, ordered.length - 2);
      let j = M.rnd(i + 1, ordered.length - 1);
      if (ordered[j].annee === ordered[i].annee) j = ordered.length - 1;
      const a = ordered[i], b = ordered[j];
      return {
        prompt: `${a.id === 'nais' ? `${pers.nom} est ${pers.f ? 'née' : 'né'} en ${a.annee}` : `${U.cap(a.label)} : en ${a.annee}`}. ${U.cap(b.label)} : en ${b.annee}. Combien d'années plus tard ? {?}`,
        format: 'number', answer: b.annee - a.annee, unit: 'ans',
        viz: (el) => { el.innerHTML = U.timelineHtml(pers); },
        hint: `Compte les bonds sur la ligne du temps, de ${a.annee} à ${b.annee}.`,
        explain: `De ${a.annee} à ${b.annee}, on compte ${b.annee - a.annee} bonds d'une année : <b>${b.annee - a.annee} ${M.plural(b.annee - a.annee, 'an')}</b> plus tard (${b.annee} − ${a.annee} = ${b.annee - a.annee}).`,
      };
    },
  });
})();
