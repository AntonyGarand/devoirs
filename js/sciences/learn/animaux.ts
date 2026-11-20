/* =====================================================================
   sciences/learn/animaux.js — page Apprendre « Les animaux du Québec » (habiletés 5 à 7)
   Galerie filtrable (habitat, nourriture, couverture, déplacement), fiche de 3 faits,
   bascule été / hiver, animaux domestiques.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC) return;

  try {
    M.css(`
    .sc-frow { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 4px 0 }
    .sc-frow > b { min-width: 110px; font-size: .95rem }
    .sc-frow .btn { min-height: 48px; padding: 4px 12px; font-size: .95rem }
    .sc-card { cursor: pointer; font-size: .92rem; text-align: center; line-height: 1.2 }
    .sc-card .art { display: inline-flex }
    .sc-detail h3 { margin: 0 0 4px }
    .sc-detail .sc-dtxt { flex: 1; min-width: 200px }
    .sc-dtags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px }
    .sc-legend { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px }
    @media (max-width: 520px) { .sc-frow > b { min-width: 100%; } }
    `);
  } catch (e) {
    /* hors navigateur */
  }

  /** Filtres de la galerie : valeurs [clé, libellé] et test d'un animal. */
  const DIMS: { id: string; label: string; values: () => [string, string][]; test: (a: ScAnimal, v: string) => boolean }[] = [
    {
      id: 'hab',
      label: '🏞️ Habitat',
      values: () => Object.entries(SC.HABITATS).map(([k, h]) => [k, `${h.icon} ${SC.cap(h.label)}`]),
      test: (a, v) => a.hab.includes(v),
    },
    {
      id: 'mange',
      label: '🍽️ Mange',
      values: () => Object.entries(SC.MANGE).map(([k, m]) => [k, `${m.icon} ${m.label}`]),
      test: (a, v) => a.mange === v,
    },
    {
      id: 'couv',
      label: '🧥 Couverture',
      values: () => Object.entries(SC.COUV).map(([k, c]) => [k, `${c.icon} ${c.label}`]),
      test: (a, v) => a.couv === v,
    },
    {
      id: 'bouge',
      label: '🏃 Se déplace',
      values: () => Object.entries(SC.BOUGE).map(([k, b]) => [k, b]),
      test: (a, v) => a.bouge.includes(v),
    },
  ];
  const MANGE_TXT: Record<string, string> = { plantes: 'des plantes', animaux: "d'autres animaux", deux: 'des plantes et des animaux' };

  M.registerLearn({
    id: 'sc-l-animaux',
    domain: 'sc-vivant',
    title: 'Les animaux du Québec',
    icon: '🦫',
    short: "Où ils vivent, ce qu'ils mangent, comment ils passent l'hiver",
    intro:
      'Au Québec, il y a des animaux dans la forêt, les lacs, les champs, le fleuve et même en ville ! Choisis un filtre, puis touche un animal pour découvrir ses secrets.',
    render(el) {
      const st: { dim: string | null; val: string | null; hiver: boolean; sel: string | null } = {
        dim: null,
        val: null,
        hiver: false,
        sel: null,
      };
      el.innerHTML = `
        ${M.ui.section({
          icon: '🔍',
          title: '1. La galerie des animaux',
          intro: 'Touche un filtre pour ne garder que certains animaux. Touche une carte pour lire sa fiche.',
          body: `<div class="sc-filters"></div>
            <div class="row"><button class="btn sc-saison">❄️ Voir l'hiver</button><span class="muted sc-count"></span></div>
            <div class="sc-legend" hidden></div><div class="sc-an-detail"></div><div class="sc-gal"></div>`,
        })}
        ${M.ui.section({ icon: '😴', title: "2. Et l'hiver ?", body: SC.castor("L'<b>ours noir</b> ne mange pas de l'hiver : il <b>dort</b> dans sa tanière, mais il peut se réveiller s'il est dérangé. La <b>marmotte</b> et la <b>chauve-souris</b>, elles, <b>hibernent</b> : leur corps ralentit beaucoup et elles dorment tout l'hiver.") })}
        ${M.ui.section({ icon: '🐇', title: '3. Lièvre ou lapin ?', body: SC.castor("Dans nos forêts vit le <b>lièvre d'Amérique</b>, pas le lapin ! Le lièvre a de très longues pattes arrière, et ses bébés naissent avec du poil et les yeux ouverts. Son pelage devient blanc l'hiver. L'image 🐇 est un lapin : elle ressemble au lièvre, mais ce n'est pas tout à fait lui.", 'info') })}
        ${M.ui.section({
          icon: '🏠',
          title: '4. Domestique ou sauvage ?',
          intro:
            "Les animaux <b>domestiques</b> vivent avec nous : c'est nous qui les nourrissons. Les animaux <b>sauvages</b> trouvent leur nourriture tout seuls dans la nature. Touche un animal pour entendre son nom.",
          body: M.ui.vocab(SC.DOMESTIQUES.map((a) => ({ emoji: a.emoji, word: SC.cap(a.nom), note: 'Mange ' + a.nourri }))),
        })}
        ${M.ui.section({ icon: '✅', title: '5. Vérifie ta compréhension', body: '<div class="sc-an-quiz"></div>' })}`;
      const $ = <E extends Element = HTMLElement>(s: string): E => M.$<E>(s, el)!; // élément qu'on vient de rendre

      const drawFilters = () => {
        $('.sc-filters').innerHTML =
          `<div class="sc-frow"><button class="btn ${st.dim ? '' : 'on'}" data-dim="">🐾 Tous</button></div>` +
          DIMS.map(
            (d) =>
              `<div class="sc-frow"><b>${d.label}</b>${d
                .values()
                .map(
                  ([v, l]) =>
                    `<button class="btn ${st.dim === d.id && st.val === v ? 'on' : ''}" data-dim="${d.id}" data-val="${v}">${l}</button>`,
                )
                .join('')}</div>`,
          ).join('');
      };
      const visible = (): ScAnimal[] =>
        SC.ANIMAUX.filter(
          (a) =>
            !st.dim ||
            SC.must(
              DIMS.find((d) => d.id === st.dim),
              'filtre ' + st.dim,
            ).test(a, st.val ?? ''),
        );
      const drawGal = () => {
        const vis = visible();
        $('.sc-gal').innerHTML =
          vis
            .map(
              (a) => `<button class="sc-card ${st.sel === a.id ? 'on' : ''}" data-id="${a.id}">
            ${st.hiver ? `<span class="sc-badge" title="${M.esc(SC.HIVER[a.hiver].label)}">${SC.HIVER[a.hiver].icon}</span>` : ''}
            <span class="sc-big">${SC.pic(a, 52)}</span><span>${SC.cap(a.nom)}</span></button>`,
            )
            .join('') || '<p class="muted">Aucun animal avec ce filtre.</p>';
        $('.sc-count').textContent = `${vis.length} animaux`;
        $('.sc-saison').textContent = st.hiver ? "☀️ Voir l'été" : "❄️ Voir l'hiver";
        const lg = $('.sc-legend');
        lg.hidden = !st.hiver;
        lg.innerHTML = Object.values(SC.HIVER)
          .filter((h) => h.icon !== '❔')
          .map((h) => `<span class="chip">${h.icon} ${h.label}</span>`)
          .join('');
      };
      const drawDetail = () => {
        const a = SC.ANIMAUX.find((x) => x.id === st.sel);
        const box = $('.sc-an-detail');
        if (!a) {
          box.innerHTML = '';
          return;
        }
        const H = SC.HIVER[a.hiver];
        box.innerHTML = `<div class="sc-detail"><span class="sc-big">${SC.pic(a, 80)}</span><div class="sc-dtxt">
          <h3>${SC.cap(a.nom)} ${M.ui.speak(a.nom + '. ' + a.faits.join(' '))}</h3>
          <ul>${a.faits.map((f) => `<li>${f}</li>`).join('')}</ul>
          <div class="sc-dtags">${a.hab.map((h) => M.ui.tag(`${SC.HABITATS[h].icon} ${SC.HABITATS[h].label}`, '#06a77d', '#dcf7ee')).join('')}
            ${M.ui.tag(`${SC.MANGE[a.mange].icon} Mange ${MANGE_TXT[a.mange]}`, '#f78c40', '#ffe9d6')}
            ${M.ui.tag(`${SC.COUV[a.couv].icon} ${SC.COUV[a.couv].label}`, '#118ab2', '#dff3fb')}
            ${a.hiver !== 'autre' ? M.ui.tag(`${H.icon} L'hiver : ${H.label.toLowerCase()}`, '#9b5de5', '#f1e8fd') : ''}</div>
          ${a.fid === 'approx' ? "<p class=\"muted\">L'image ressemble à l'animal, mais elle n'est pas tout à fait exacte.</p>" : ''}</div></div>`;
      };
      drawFilters();
      drawGal();

      $('.sc-filters').onclick = (e) => {
        const b = M.closest(e, '[data-dim]');
        if (!b) return;
        M.sfx.tap();
        st.dim = b.dataset.dim || null;
        st.val = b.dataset.val || null;
        if (st.sel && !visible().some((a) => a.id === st.sel)) {
          st.sel = null;
          drawDetail();
        }
        drawFilters();
        drawGal();
      };
      $('.sc-saison').onclick = () => {
        st.hiver = !st.hiver;
        M.sfx.tap();
        drawGal();
      };
      $('.sc-gal').onclick = (e) => {
        const c = M.closest(e, '.sc-card');
        if (!c) return;
        st.sel = c.dataset.id ?? null;
        const a = SC.must(
          SC.ANIMAUX.find((x) => x.id === st.sel),
          'animal ' + st.sel,
        );
        M.sfx.tap();
        drawGal();
        drawDetail();
        M.say(a.nom + '. ' + a.fait);
        const d = $('.sc-an-detail');
        if (d.scrollIntoView) d.scrollIntoView({ block: 'nearest', behavior: SC.reduced() ? 'auto' : 'smooth' });
      };

      const gen = (id: string, lvl: number) => (): Question =>
        M.skillById[id] ? M.skillById[id].gen({ lvl }) : { prompt: 'Le castor est-il un animal sauvage ?', format: 'tf', answer: true };
      M.ui.miniQuiz($('.sc-an-quiz'), [gen('sc-animaux-alimentation', 0), gen('sc-animaux-adaptation', 0), gen('sc-animaux-habitats', 0)]);
    },
  });
})();
