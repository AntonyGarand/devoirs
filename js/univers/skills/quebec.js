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
        // Distracteurs d'une autre sorte de fête : deux fêtes du Québec/Canada ou deux fêtes religieuses
        // partagent des gestes (feux, drapeaux, fête religieuse) et rendraient deux choix vrais.
        const others = M.shuffle(F.filter((x) => x !== f && x.lvl <= 1 && x.sorte !== f.sorte)).slice(0, 2);
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
    parentNote: 'Défi bonus 🌟 : les emblèmes ne sont pas au programme du 1er cycle. Faits vérifiés sur quebec.ca (drapeau 1948, harfang des neiges 1987, bouleau jaune 1993, iris versicolore 1999, devise « Je me souviens ») et canada.ca (unifolié, castor, feuille d\'érable, « Ô Canada »).',
    lint(q) {
      // Un seul emblème par catégorie : un distracteur ne doit jamais être un emblème du Québec.
      const E = U.d('emblemes');
      if (q.format === 'choice' && /emblème du Québec \?/.test(q.prompt)) {
        const noms = E.list.map((e) => U.cap(e.nom));
        const hits = q.choices.filter((c) => noms.includes(c.label));
        if (hits.length !== 1) return `${hits.length} emblèmes du Québec parmi les choix`;
      }
    },
    gen({ lvl }) {
      const E = U.d('emblemes');
      const fl = E.flags;
      const flagSm = (f) => f().replace('class="us-flag"', 'class="us-flag" style="max-width:70px"');
      const symPic = (s) => (s.flag ? flagSm(fl[s.flag]) : s.art ? M.art.html(s.art, { size: 40, alt: s.nom }) : `<span style="font-size:2rem">${s.emoji}</span>`);
      const tfQ = (pool) => {
        const f = M.pick(pool);
        return {
          prompt: `Vrai ou faux ? ${f.t}`, format: 'tf', answer: f.v,
          hint: 'Pense au fleurdelisé, au harfang des neiges, à l\'iris versicolore et au bouleau jaune.',
          explain: `C'est <b>${f.v ? 'vrai' : 'faux'}</b>. ${f.e ? f.e + ' ' : ''}Les emblèmes du Québec : le fleurdelisé (drapeau), le harfang des neiges (oiseau), l'iris versicolore (fleur), le bouleau jaune (arbre) et la devise « Je me souviens ».`,
        };
      };
      const emblemeQ = () => {
        const e = M.pick(E.list.filter((x) => ['harfang', 'iris', 'bouleau'].includes(x.id)));
        const s = U.simple(U.cap(e.nom), M.shuffle(E.autres[e.id]).slice(0, 2).map(U.cap));
        return {
          scene: [{ art: e.art, label: e.nom }],
          prompt: e.type === 'fleur' ? 'Quelle est la fleur emblème du Québec ?' : `Quel est ${e.type === 'oiseau' ? 'l\'oiseau' : 'l\'arbre'} emblème du Québec ?`, format: 'choice', ...s, cols: 1,
          hint: e.type === 'oiseau' ? 'C\'est un grand hibou blanc.' : e.type === 'fleur' ? 'C\'est une fleur bleu violet.' : 'Son écorce est dorée.',
          explain: e.fait,
        };
      };
      if (lvl === 0) {
        const r = Math.random();
        if (r < 0.3) {
          const askCa = Math.random() < 0.4;
          const ch = M.shuffle([{ label: fl.quebec(), value: 'quebec' }, { label: fl.canada(), value: 'canada' }, { label: M.pick([fl.invente, fl.invente2])(), value: 'autre' }]);
          return {
            prompt: `Lequel est le <b>drapeau ${askCa ? 'du Canada' : 'du Québec'}</b> ?`, format: 'choice', choices: ch, answer: askCa ? 'canada' : 'quebec', cols: 3,
            hint: askCa ? 'Il est rouge et blanc, avec une feuille d\'érable.' : 'Il est bleu et blanc, avec quatre fleurs de lis.',
            explain: 'Le drapeau du Québec s\'appelle le <b>fleurdelisé</b> : une croix blanche et quatre fleurs de lis blanches sur fond bleu. Le drapeau rouge et blanc avec la feuille d\'érable est celui du <b>Canada</b>.',
          };
        }
        if (r < 0.45) {
          const askN = Math.random() < 0.5;
          const s = askN ? U.simple('4', ['2', '6']) : U.simple('Bleu et blanc', ['Rouge et blanc', 'Vert et jaune']);
          return {
            prompt: askN ? 'Combien de fleurs de lis y a-t-il sur le fleurdelisé ?' : 'De quelles couleurs est le fleurdelisé, le drapeau du Québec ?', format: 'choice', ...s, cols: 3,
            ...(askN ? { viz: (el) => { el.innerHTML = `<div style="max-width:200px;margin:0 auto">${fl.quebec()}</div>`; } } : {}),
            hint: askN ? 'Compte les fleurs blanches, une dans chaque coin.' : 'Pense à la couleur du ciel et de la neige.',
            explain: 'Le <b>fleurdelisé</b> est <b>bleu et blanc</b> : une croix blanche et <b>quatre</b> fleurs de lis blanches sur un fond bleu.',
          };
        }
        return tfQ(E.faits.filter((f) => f.lvl === 0));
      }
      if (lvl === 1) {
        const r = Math.random();
        if (r < 0.35) {
          const TYPE = { drapeau: 'Le drapeau', oiseau: 'L\'oiseau', fleur: 'La fleur', arbre: 'L\'arbre', devise: 'La devise' };
          const list = M.shuffle(E.list).slice(0, M.pick([3, 4]));
          return {
            prompt: 'Associe chaque emblème du Québec à son image.', format: 'match',
            pairs: list.map((e) => ({
              left: `${TYPE[e.type]} : ${e.nom.replace(/^(le |la |l')/, '')}`, sayLeft: `${TYPE[e.type]} : ${e.nom}`,
              right: e.art ? M.art.html(e.art, { size: 64, alt: e.nom }) : e.html ? flagSm(e.html) : `<span style="font-size:1.6rem">${e.emoji} ${e.nom}</span>`,
            })),
            hint: 'Un oiseau blanc, une fleur bleu violet, un arbre à l\'écorce dorée, un drapeau bleu et blanc.',
            explain: list.map((e) => e.fait).join(' '),
          };
        }
        if (r < 0.7) return emblemeQ();
        return tfQ(E.faits.filter((f) => f.lvl <= 1));
      }
      const r = Math.random();
      if (r < 0.35) {
        const items = [...M.shuffle(E.symboles.filter((s) => s.pays === 'quebec')).slice(0, 3), ...M.shuffle(E.symboles.filter((s) => s.pays === 'canada')).slice(0, 3)];
        return {
          prompt: 'Classe : est-ce un symbole du <b>Québec</b> ou du <b>Canada</b> ?', format: 'sort',
          bins: [{ id: 'quebec', label: '⚜️ Québec' }, { id: 'canada', label: '🍁 Canada' }],
          items: items.map((s) => ({ label: `<span class="us-art-lbl">${symPic(s)}<span>${s.nom}</span></span>`, bin: s.pays, say: s.nom })),
          hint: 'Le Québec : bleu et blanc, fleurs de lis. Le Canada : rouge et blanc, feuille d\'érable.',
          explain: 'Symboles du <b>Québec</b> : le fleurdelisé, le harfang des neiges, l\'iris versicolore, le bouleau jaune, « Je me souviens ». Symboles du <b>Canada</b> : l\'unifolié, la feuille d\'érable, le castor, « Ô Canada ». Le Québec fait partie du Canada.',
        };
      }
      if (r < 0.5) {
        const d = M.pick([['promène', 'repose'], ['réveille', 'repose'], ['promène', 'cache'], ['dépêche', 'réveille']]);
        return {
          prompt: 'Complète la devise du Québec.', format: 'cloze', text: '« Je me {0} »',
          blanks: [{ choices: M.shuffle(['souviens', ...d]), answer: 'souviens' }],
          hint: 'On la lit sur les plaques des autos du Québec.', explain: 'La devise du Québec est <b>« Je me souviens »</b>. On la lit sur les plaques des autos.',
        };
      }
      if (r < 0.65) return emblemeQ();
      return tfQ(E.faits.filter((f) => f.lvl >= 1));
    },
  });
})();
