/* =====================================================================
   Univers social — Le Québec et ses fêtes (us-quebec)
   us-fetes · us-emblemes (enrichissement)
   R8 : faits culturels, « certaines familles… »; jamais de « bonne » fête. Le mois est travaillé en maths.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const D = 'us-quebec';
  const big = (e) => `<span style="font-size:2.2rem">${e}</span>`;

  M.registerSkill({
    id: 'us-fetes', domain: D, title: 'Fêtes et traditions', icon: '🎉', learn: 'us-quebec', starter: true,
    desc: 'Ce qu\'on fait pendant une fête et pourquoi.',
    pda: 'CCQ 2e — Célébrations : traditions (fêtes, repas traditionnels), cérémonies religieuses et séculières',
    lint(q) {
      if (/en quel mois|quel mois/i.test(q.prompt)) return 'le mois d\'une fête est travaillé en maths (calendrier)';
      if (/meilleure fête|bonne fête à fêter|vraie fête/i.test(q.prompt)) return 'R8';
    },
    gen({ lvl }) {
      const F = U.d('fetes');
      if (lvl === 0) {
        const fs = M.shuffle(F.filter((f) => f.lvl === 0)).slice(0, 4);
        return {
          prompt: 'Associe chaque fête à son symbole.', format: 'match',
          pairs: fs.map((f) => ({ left: U.cap(f.nom), right: big(f.emoji), sayLeft: f.nom })),
          hint: 'Pense à ce qu\'on voit pendant cette fête.',
          explain: fs.map((f) => `${f.emoji} ${U.cap(f.nom)} : ${f.symbole}.`).join(' '),
        };
      }
      if (lvl === 1) {
        const f = M.pick(F.filter((x) => x.lvl <= 1));
        const others = M.shuffle(F.filter((x) => x !== f && x.lvl <= 1)).slice(0, 2);
        if (Math.random() < 0.6) {
          const s = U.simple(f.geste, others.map((o) => o.geste));
          return {
            scene: [{ emoji: f.emoji, label: f.nom }],
            prompt: f.id === 'temps-des-sucres' ? 'Que fait-on souvent à la cabane à sucre, au temps des sucres ?' : `Pendant ${f.nom}, que font souvent les gens ?`,
            format: 'choice', ...s, cols: 1,
            hint: `Pense au symbole de cette fête : ${f.emoji} ${f.symbole}.`,
            explain: `${U.cap(f.nom)} ${f.emoji} : ${f.geste.charAt(0).toLowerCase() + f.geste.slice(1)} ${f.pourquoi}`,
          };
        }
        const s = U.simple(f.pourquoi, others.map((o) => o.pourquoi));
        return {
          scene: [{ emoji: f.emoji, label: f.nom }], prompt: `Pourquoi fête-t-on <b>${f.nom}</b> ?`, format: 'choice', ...s, cols: 1,
          hint: `Pense à ce qu'on fait : ${f.geste.charAt(0).toLowerCase() + f.geste.slice(1)}`,
          explain: `${U.cap(f.nom)} ${f.emoji} : ${f.pourquoi}`,
        };
      }
      const pool = F.filter((f) => f.lvl === 2 || ['noel', 'paques', 'fete-nationale'].includes(f.id));
      const fs = M.shuffle(pool).slice(0, 4);
      return {
        prompt: 'Au Québec, des familles de plusieurs traditions font la fête. Associe chaque fête à un de ses <b>symboles</b>.', format: 'match',
        pairs: fs.map((f) => ({ left: U.cap(f.court), right: `${f.emoji} ${f.symbole}`, sayLeft: f.nom, sayRight: f.symbole })),
        hint: 'Plusieurs de ces fêtes utilisent des lumières : compte les branches, regarde la couleur.',
        explain: fs.map((f) => `<b>${U.cap(f.nom)}</b> : ${f.geste.charAt(0).toLowerCase() + f.geste.slice(1)}`).join(' ') + ' Chaque famille peut fêter à sa façon.',
      };
    },
  });

  M.registerSkill({
    id: 'us-emblemes', domain: D, title: 'Les symboles du Québec', icon: '⚜️', learn: 'us-quebec', enrichment: true,
    desc: 'Défi bonus : le drapeau, l\'oiseau, la fleur, l\'arbre et la devise du Québec.',
    pda: 'Enrichissement — Loi sur le drapeau et les emblèmes du Québec (quebec.ca)',
    parentNote: 'Défi bonus 🌟 : les emblèmes ne sont pas au programme du 1er cycle. Faits vérifiés sur quebec.ca (drapeau 1948, harfang des neiges 1987, bouleau jaune 1993, iris versicolore 1999).',
    gen({ lvl }) {
      const E = U.d('emblemes');
      if (lvl === 0) {
        const fl = E.flags;
        const ch = M.shuffle([{ label: fl.quebec(), value: 'quebec' }, { label: fl.canada(), value: 'canada' }, { label: M.pick([fl.invente, fl.invente2])(), value: 'autre' }]);
        return {
          prompt: 'Lequel est le <b>drapeau du Québec</b> ?', format: 'choice', choices: ch, answer: 'quebec', cols: 3,
          hint: 'Il est bleu et blanc, avec quatre fleurs de lis.',
          explain: 'Le drapeau du Québec s\'appelle le <b>fleurdelisé</b> : une croix blanche et quatre fleurs de lis blanches sur fond bleu. Le drapeau rouge et blanc avec la feuille d\'érable est celui du Canada.',
        };
      }
      if (lvl === 1) {
        const list = E.list.filter((e) => ['harfang', 'iris', 'bouleau', 'drapeau'].includes(e.id));
        return {
          prompt: 'Associe chaque emblème du Québec à son image.', format: 'match',
          pairs: list.map((e) => ({ left: `${U.cap(e.nom)} (${e.type})`, right: e.art ? M.art.html(e.art, { size: 64, alt: e.nom }) : e.html().replace('class="us-flag"', 'class="us-flag" style="max-width:80px"'), sayLeft: e.nom })),
          hint: 'Un oiseau blanc, une fleur bleu violet, un arbre à l\'écorce dorée, un drapeau bleu et blanc.',
          explain: list.map((e) => e.fait).join(' '),
        };
      }
      const r = Math.random();
      if (r < 0.35) {
        return {
          prompt: 'Complète la devise du Québec.', format: 'cloze', text: '« Je me {0} »',
          blanks: [{ choices: M.shuffle(['souviens', 'promène', 'repose']), answer: 'souviens' }],
          hint: 'On la lit sur les plaques des autos du Québec.', explain: 'La devise du Québec est <b>« Je me souviens »</b>.',
        };
      }
      if (r < 0.7) {
        const f = M.pick(E.faits);
        return {
          prompt: `Vrai ou faux ? ${f.t}`, format: 'tf', answer: f.v,
          hint: 'Pense au fleurdelisé, au harfang, à l\'iris et au bouleau jaune.',
          explain: `C'est <b>${f.v ? 'vrai' : 'faux'}</b>. Le fleurdelisé est bleu avec une croix blanche et quatre fleurs de lis; l'oiseau emblème est le harfang des neiges, la fleur est l'iris versicolore et l'arbre est le bouleau jaune.`,
        };
      }
      const e = M.pick(E.list.filter((x) => ['harfang', 'iris', 'bouleau'].includes(x.id)));
      const DIS = { harfang: ['Le geai bleu', 'Le merle d\'Amérique'], iris: ['La rose', 'La tulipe'], bouleau: ['L\'érable à sucre', 'Le sapin baumier'] };
      const s = U.simple(U.cap(e.nom), DIS[e.id]);
      return {
        scene: [{ art: e.art, label: e.nom }],
        prompt: e.type === 'fleur' ? 'Quelle est la fleur emblème du Québec ?' : `Quel est ${e.type === 'oiseau' ? 'l\'oiseau' : 'l\'arbre'} emblème du Québec ?`, format: 'choice', ...s, cols: 1,
        hint: e.type === 'oiseau' ? 'C\'est un grand hibou blanc.' : e.type === 'fleur' ? 'C\'est une fleur bleu violet.' : 'Son écorce est dorée.',
        explain: e.fait,
      };
    },
  });
})();
