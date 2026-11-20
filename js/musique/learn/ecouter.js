/* =====================================================================
   musique/learn/ecouter.js — « Écouter une musique » (mu-forme, mu-caractere)
   1. Les parties A et B : les blocs s'allument pendant l'écoute (forme A-B, puis A-B-A).
   2. Question et réponse (procédé de composition, PDA F.a).
   3. Ce que la musique exprime, et pourquoi (compétence 3 « Apprécier »).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  if (!MU) return;
  const COL = { A: '#3a86ff', B: '#f78c40' };

  M.registerLearn({
    id: 'mu-l-ecouter', domain: 'mu-ecoute', title: 'Écouter une musique', icon: '🎧',
    short: 'Les parties A et B, question-réponse, ce que la musique exprime',
    intro: 'Quand on écoute une musique, on peut remarquer ce qui <b>revient</b> et ce qui <b>change</b>, et dire ce qu\'on <b>ressent</b>… en expliquant pourquoi !',
    render(el) {
      el.innerHTML = M.ui.section({ icon: '🧩', title: '1. Les parties d\'une musique', intro: 'Une musique a des <b>parties</b>. Quand une partie revient, on lui garde la même lettre. Touche ▶ et regarde les blocs.',
        body: `<div class="mu-forms"></div>${M.ui.callout('A-B : deux parties différentes. A-B-A : la partie A revient à la fin, comme le pain d\'un sandwich 🥪.', { tone: 'tip' })}` })
        + M.ui.section({ icon: '❓', title: '2. Question et réponse', intro: 'Une phrase de musique peut poser une <b>question</b>… et une autre phrase lui <b>répond</b>. La question finit « en l\'air »; la réponse finit « à la maison ».',
          body: '<div class="mu-row mu-qr"></div>' })
        + M.ui.section({ icon: '😊', title: '3. Ce que la musique exprime', intro: 'Touche une musique. Comment te fait-elle sentir ? Pour expliquer, on parle du <b>tempo</b> (rapide, lent), de l\'<b>intensité</b> (fort, doux) et de la <b>hauteur</b> (aigu, grave).',
          body: `<div class="mu-gal mu-moods"></div><div class="callout mu-mood-txt" style="margin-top:10px">Touche une musique ☝️</div><div class="mu-feel" style="margin-top:10px"></div>` })
        + M.ui.section({ icon: '✅', title: '4. Vérifie ta compréhension', body: '<div class="mu-quiz"></div>' });
      const $ = (s) => M.$(s, el);

      /* 1. formes */
      const A = MU.phrase({ inst: 'xylo', root: 67, notes: [0, 2, 4, 2, 0, 4, 7, 0] });
      const B = MU.phrase({ inst: 'flute', root: 62, rhythm: 'saute', notes: [7, 9, 7, 4, 2, 4, 2, 0] });
      const len = (p) => p[p.length - 1].t + p[p.length - 1].dur + 0.45;
      const FORMS = ['AB', 'ABA'];
      $('.mu-forms').innerHTML = FORMS.map((f, i) => `<div class="mu-form-row" data-i="${i}"><button class="btn primary mu-form-play" data-i="${i}">▶ Forme ${f.split('').join('-')}</button><div class="mu-blocks">${f.split('').map((l) => `<span style="background:${COL[l]}22;border-color:${COL[l]}">${l}</span>`).join('')}</div></div>`).join('');
      $('.mu-forms').onclick = async (e) => {
        const b = e.target.closest('.mu-form-play'); if (!b) return;
        const f = FORMS[+b.dataset.i].split('');
        const blocks = M.$$('.mu-blocks span', b.parentNode);
        let t = 0;
        const evs = [], starts = [];
        f.forEach((l) => { starts.push(t); (l === 'A' ? A : B).forEach((e2) => evs.push({ ...e2, t: e2.t + t })); t += len(l === 'A' ? A : B); });
        const timers = starts.map((s, i) => setTimeout(() => blocks.forEach((x, j) => x.classList.toggle('on', j === i)), (s + 0.08) * 1000));
        M.$$('.mu-blocks span', el).forEach((x) => x.classList.remove('on'));
        const done = await MU.play(evs);
        if (!done) timers.forEach(clearTimeout);
        blocks.forEach((x) => x.classList.remove('on'));
      };

      /* 2. question / réponse */
      const Q = [0, 2, 4, 5, 7, 7, 9, 11].map((n, i) => ({ t: i * 0.3, inst: 'piano', midi: 60 + n, vel: 0.7, dur: i === 7 ? 0.9 : 0.3 }));
      const R = [9, 7, 5, 4, 2, 2, 0, 0].map((n, i) => ({ t: i * 0.3, inst: 'piano', midi: 60 + n, vel: 0.7, dur: i === 7 ? 0.9 : 0.3 }));
      const QR = [{ t: '❓ La question', ev: Q }, { t: '💬 La réponse', ev: R }, { t: '❓💬 Les deux', ev: Q.concat(R.map((e) => ({ ...e, t: e.t + 3 }))) }];
      $('.mu-qr').innerHTML = QR.map((x, i) => `<button class="mu-card" data-i="${i}"><span class="mu-big">${x.t.split(' ')[0]}</span><span>${x.t.replace(/^\S+ /, '')}</span></button>`).join('');
      $('.mu-qr').onclick = (e) => { const b = e.target.closest('.mu-card'); if (!b) return; M.$$('.mu-card', $('.mu-qr')).forEach((c) => c.classList.toggle('on', c === b)); MU.play(QR[+b.dataset.i].ev); };

      /* 3. caractère */
      const D = MU.MOODS;
      $('.mu-moods').innerHTML = Object.keys(D).map((k) => `<button class="mu-card" data-k="${k}"><span class="mu-big">${D[k].icon}</span><span>Musique ${D[k].label}</span></button>`).join('');
      $('.mu-moods').onclick = (e) => {
        const b = e.target.closest('.mu-card'); if (!b) return;
        const k = b.dataset.k;
        M.$$('.mu-card', $('.mu-moods')).forEach((c) => c.classList.toggle('on', c === b));
        MU.play(MU.piece(k));
        $('.mu-mood-txt').innerHTML = `Elle semble <b>${D[k].label}</b> ${D[k].icon} parce qu'${D[k].why}.`;
      };
      if (M.ui.feelings) M.ui.feelings($('.mu-feel'));

      M.ui.miniQuiz($('.mu-quiz'), [
        () => M.skillById['mu-forme'].gen({ lvl: 0 }),
        () => M.skillById['mu-forme'].gen({ lvl: 1 }),
        () => M.skillById['mu-caractere'].gen({ lvl: 0 }),
      ]);
    },
  });

  try { M.css('.mu-form-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: center; margin: 6px 0 }'); } catch (e) {}
})();
