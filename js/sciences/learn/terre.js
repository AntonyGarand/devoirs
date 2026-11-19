/* =====================================================================
   sciences/learn/terre.js — « Le jour, la nuit et les ombres » (habiletés 14 et 15)
   1. La Terre tourne (curseur « heure », vue du pôle Nord, sens antihoraire).
   2. L'ombre de l'arbre (curseur matin → midi → soir).
   3. Soleil, Terre, Lune.   4. Les saisons au Québec (décrites, jamais expliquées).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC) return;

  const heure = (h) => (h === 0 || h === 24 ? 'minuit' : h === 12 ? 'midi' : h < 12 ? `${h} h du matin` : `${h} h`);
  const moment = (h) => (h === 6 ? { t: '🌅 Le Soleil se lève', d: 'jour' } : h === 18 ? { t: '🌇 Le Soleil se couche', d: 'nuit' } : h > 6 && h < 18 ? { t: '🌞 Il fait jour', d: 'jour' } : { t: '🌙 Il fait nuit', d: 'nuit' });
  // Vu du pôle Nord, la Terre tourne dans le sens contraire des aiguilles d'une montre : à midi, la maison fait face au Soleil (à gauche).
  const angleOf = (h) => 180 - (h - 12) * 15;

  function shadowSvg(h) {
    const f = (h - 6) / 12; // 0 matin → 1 soir
    const sx = 24 + f * 252, alt = Math.max(0.12, Math.sin(Math.PI * f)), sy = 150 - alt * 120;
    const tree = 60, L = Math.min(170, tree / Math.tan(alt * 1.05));
    const dir = sx < 150 ? 1 : sx > 150 ? -1 : 0;
    return `<svg viewBox="0 0 300 200" class="sc-fig" role="img" aria-label="L'arbre et son ombre" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" rx="16" fill="${alt < 0.3 ? '#ffe2c4' : '#dff3fb'}"/><rect y="168" width="300" height="32" fill="#9ed36a"/>
      <path d="M24 150 Q150 ${150 - 2 * 122} 276 150" stroke="#f4b400" stroke-width="2" stroke-dasharray="4 6" fill="none"/>
      <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="16" fill="#ffd166" stroke="#f4b400" stroke-width="3"/>
      <polygon points="150,172 ${(150 + dir * L).toFixed(1)},172 ${(150 + dir * L).toFixed(1)},178 150,178" fill="#4b4b5a" opacity=".55"/>
      ${dir === 0 ? '<ellipse cx="150" cy="174" rx="16" ry="5" fill="#4b4b5a" opacity=".55"/>' : ''}
      <rect x="145" y="128" width="10" height="46" fill="#8a5a33"/><circle cx="150" cy="114" r="26" fill="#3fae49" stroke="#2f7a37" stroke-width="2"/>
      <text x="20" y="194" font-size="12" font-weight="800">Est</text><text x="280" y="194" font-size="12" font-weight="800" text-anchor="end">Ouest</text></svg>`;
  }

  function erable(id) {
    const crown = {
      hiver: '<path d="M100 120 L100 70 M100 90 L76 66 M100 84 L124 60 M100 72 L88 48 M100 72 L112 46 M84 70 L70 58 M120 62 L134 54" stroke="#6b4425" stroke-width="5" stroke-linecap="round" fill="none"/>',
      printemps: '<path d="M100 120 L100 70 M100 90 L76 66 M100 84 L124 60 M100 72 L88 48 M100 72 L112 46" stroke="#6b4425" stroke-width="5" stroke-linecap="round" fill="none"/>' + [[76, 66], [124, 60], [88, 48], [112, 46], [70, 58], [134, 54], [100, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#a8e06a"/>`).join(''),
      ete: '<rect x="94" y="80" width="12" height="44" fill="#6b4425"/><circle cx="100" cy="62" r="42" fill="#3fae49" stroke="#2f7a37" stroke-width="2"/>',
      automne: '<rect x="94" y="80" width="12" height="44" fill="#6b4425"/><circle cx="100" cy="62" r="40" fill="#ef6f2e" stroke="#c4441a" stroke-width="2"/><circle cx="84" cy="54" r="14" fill="#f4b400"/><circle cx="116" cy="70" r="12" fill="#d62828"/>' + [[50, 110], [150, 100], [138, 124], [60, 124]].map(([x, y]) => `<text x="${x}" y="${y}" font-size="14">🍁</text>`).join(''),
    }[id];
    const ground = id === 'hiver' ? '#fff' : id === 'automne' ? '#c9a25a' : '#9ed36a';
    const sky = id === 'hiver' ? '#dfe7f2' : '#dff3fb';
    return `<svg viewBox="0 0 200 140" class="sc-choice-fig" style="max-width:240px" role="img" aria-label="L'érable" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="140" rx="12" fill="${sky}"/><rect y="120" width="200" height="20" fill="${ground}"/>${crown}${id === 'hiver' ? M.range(0, 9).map((i) => `<circle cx="${12 + i * 21}" cy="${14 + (i % 3) * 22}" r="2.5" fill="#fff"/>`).join('') : ''}</svg>`;
  }

  M.registerLearn({
    id: 'sc-l-terre', domain: 'sc-terre', title: 'Le jour, la nuit et les ombres', icon: '🌍',
    short: 'La Terre tourne, l\'ombre change, les saisons passent',
    intro: 'Le Soleil semble bouger dans le ciel… mais en vrai, c\'est <b>la Terre qui tourne</b> sur elle-même ! Fais tourner la Terre, déplace le Soleil et découvre les saisons du Québec.',
    render(el) {
      el.innerHTML = M.ui.section({ icon: '🌍', title: '1. La Terre tourne', intro: 'On regarde la Terre d\'en haut, au-dessus du pôle Nord. La maison 🏠 entourée de rouge, c\'est chez nous, au Québec. Change l\'heure !',
        body: `<div class="sc-sim"><div class="sc-te-earth"></div><div class="sc-ctrls"><div class="sc-te-h"></div><div class="callout blue sc-te-txt"></div>
          <div class="row"><button class="btn primary sc-te-play">▶ Un jour en 6 secondes</button></div>
          ${SC.castor('Le Soleil ne tourne pas autour de nous : c\'est la <b>Terre qui tourne sur elle-même</b>, en un jour. Le côté tourné vers le Soleil a le jour; l\'autre côté a la nuit.')}</div></div>` })
        + M.ui.section({ icon: '🌳', title: '2. L\'ombre de l\'arbre', intro: 'Déplace le Soleil du matin au soir. Regarde l\'ombre de l\'arbre.',
          body: `<div class="sc-sim"><div class="sc-stage sc-te-tree"></div><div class="sc-ctrls"><div class="sc-te-sun"></div><div class="callout blue sc-te-sh"></div></div></div>` })
        + M.ui.section({ icon: '✨', title: '3. Le Soleil, la Terre et la Lune', intro: 'Touche chaque tuile.',
          body: `<div class="sc-tiles sc-te-astres">${SC.ASTRES.map((a, i) => `<button class="sc-tile" data-i="${i}"><span class="sc-big">${a.label.split(' ')[0]}</span>${a.label.replace(/^\S+ /, '')}<small>${a.type}</small></button>`).join('')}</div>
          <div class="callout sc-te-astre" style="margin-top:10px">Touche une tuile ☝️</div>
          ${M.ui.callout('La Lune ne fait pas sa propre lumière : elle est <b>éclairée par le Soleil</b>, comme un miroir. ⚠️ Ne regarde jamais le Soleil directement : ça abîme les yeux !', { tone: 'info', who: '💡' })}` })
        + M.ui.section({ icon: '🍁', title: '4. Les saisons au Québec', intro: 'Choisis une saison : regarde l\'érable, la longueur du jour et la météo.', body: '<div class="sc-te-tabs"></div>' })
        + M.ui.section({ icon: '✅', title: '5. Vérifie ta compréhension', body: '<div class="sc-te-quiz"></div>' });
      const $ = (s) => M.$(s, el);

      /* 1. rotation */
      const showH = (h) => {
        $('.sc-te-earth').innerHTML = `<div class="sc-stage">${SC.svg.terre({ sunLeft: true, hot: false, houses: false, angle: angleOf(h) })}</div>`;
        const m = moment(h);
        $('.sc-te-txt').innerHTML = `<b>${SC.cap(heure(h))}</b> : ${m.t}.`;
      };
      const hs = M.ui.slider($('.sc-te-h'), { label: '🕐 Heure', min: 0, max: 24, step: 1, value: 12, format: (h) => heure(h), onChange: showH });
      showH(12);
      let playing = false;
      $('.sc-te-play').onclick = async () => {
        if (playing) return;
        playing = true;
        try {
          if (SC.reduced()) { hs.set(24); return; }
          await SC.tween(6000, (t) => { if (!el.isConnected) throw new Error('stop'); hs.set(Math.round(t * 24)); });
        } finally { playing = false; }
      };

      /* 2. ombre */
      const STOPS = [{ value: 7, icon: '🌅', label: 'Matin' }, { value: 10, icon: '🕙', label: 'Avant-midi' }, { value: 12, icon: '🌞', label: 'Midi' }, { value: 15, icon: '🕒', label: 'Après-midi' }, { value: 17, icon: '🌇', label: 'Soir' }];
      const showSun = (h) => {
        $('.sc-te-tree').innerHTML = shadowSvg(h);
        $('.sc-te-sh').innerHTML = h === 12 ? 'À <b>midi</b>, le Soleil est au plus haut : l\'ombre est <b>courte</b>.' : `Le Soleil est ${Math.abs(h - 12) >= 4 ? '<b>bas</b>' : 'moyen'} : l'ombre est ${Math.abs(h - 12) >= 4 ? '<b>longue</b>' : 'moyenne'}, du côté <b>opposé</b> au Soleil.`;
      };
      M.ui.slider($('.sc-te-sun'), { label: '☀️ Moment de la journée', stops: STOPS, value: 7, onChange: showSun });
      showSun(7);

      /* 3. astres */
      $('.sc-te-astres').onclick = (e) => {
        const b = e.target.closest('.sc-tile');
        if (!b) return;
        const a = SC.ASTRES[+b.dataset.i];
        M.$$('.sc-tile', $('.sc-te-astres')).forEach((x) => x.classList.toggle('on', x === b));
        $('.sc-te-astre').innerHTML = `<b>${a.label}</b> : ${a.type.toLowerCase()}. ${a.def}`;
        M.say(`${SC.plain(a.label)} : ${a.type}. ${a.def}`);
      };

      /* 4. saisons */
      M.ui.tabs($('.sc-te-tabs'), SC.SAISONS.map((s) => ({
        id: s.id, label: `${s.icon} ${SC.cap(s.label.replace(/^L'|^Le /, ''))}`,
        render(p) {
          p.innerHTML = `<div class="sc-sim"><div>${erable(s.id)}<div class="sc-msg">🍁 ${s.erable}</div></div><div class="sc-ctrls">
            <div><b>🌡️ Température :</b> ${s.temp}</div><div><b>🌦️ Météo :</b> ${s.precip}</div><div><b>👕 On porte :</b> ${s.vetements}</div>
            <div><b>☀️ Le jour dure environ ${s.jour} heures</b><div class="sc-daybar" aria-label="Jour ${s.jour} heures, nuit ${24 - s.jour} heures"><span style="flex:${s.jour};background:#ffd166">☀️ ${s.jour} h</span><span style="flex:${24 - s.jour};background:#24345f;color:#fff">🌙 ${24 - s.jour} h</span></div></div>
            <div><b>On aime :</b> ${s.activites.join(' · ')}</div></div></div>`;
        },
      })));

      M.ui.miniQuiz($('.sc-te-quiz'), [
        () => M.skillById['sc-soleil-terre-lune'].gen({ lvl: 0 }),
        () => ({ ...M.skillById['sc-soleil-terre-lune'].gen({ lvl: 2 }) }),
        () => M.skillById['sc-saisons-meteo'].gen({ lvl: 1 }),
      ]);
    },
  });
})();
