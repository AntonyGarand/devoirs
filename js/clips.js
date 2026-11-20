/* =====================================================================
   clips.js — voix préenregistrée (M.clips)
   M.say essaie d'abord un enregistrement, sinon la voix du navigateur.
     · audio/index.js définit M.CLIP_INDEX = "id id id…" (fichiers audio/<id>.mp3)
     · clé  = langue + texte nettoyé (minuscules, sans emoji, espaces simplifiés)
     · id   = hachage cyrb53 de la clé, en base 36
   Phrase absente ? On essaie de la recoller : nombres (« 57 ») + morceaux de
   texte entre les nombres (« plus », « égale combien »). Il faut que TOUS les
   morceaux existent, sinon toute la phrase passe à la voix du navigateur
   (jamais deux voix dans la même phrase).
   Les outils tools/tts-collect.js et tools/tts-bake.js chargent ce fichier :
   même nettoyage, même hachage.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;

  const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
  const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}️‍⃣]/gu;
  const NUM = /(\d+(?:[   ]\d{3})*(?:,\d+)?)/;
  const lang2 = (l) => (String(l || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr');

  const C = {
    base: 'audio/',
    /** Texte tel qu'envoyé à la synthèse (casse gardée). */
    clean: (t) => String(t ?? '').normalize('NFC').replace(EMOJI, ' ').replace(/[  ]/g, ' ').replace(/\s+/g, ' ').replace(/\s+([,.])/g, '$1').trim().replace(/^[?!.,;:\s]+/, ''),
    key: (t, lang) => lang2(lang) + '|' + C.clean(t).toLowerCase(),
    id: (key) => cyrb53(key).toString(36),
    /** Un morceau de phrase recollée : sans ponctuation au bord (sauf ? et !). */
    piece: (t) => C.clean(t).replace(/^[\s,.;:«»"'()-]+|[\s,.;:«»"'()-]+$/g, '').trim(),
    /** Découpe une phrase en nombres et morceaux de texte. */
    split(t) {
      return C.clean(t).split(NUM).map((p, i) => (i % 2 ? { num: true, text: p.replace(/ /g, ' ') } : { text: C.piece(p) })).filter((p) => p.text && /[\p{L}\p{N}]/u.test(p.text));
    },
    _set: null,
    has(id) {
      if (!C._set) C._set = new Set(String(M.CLIP_INDEX || '').split(/\s+/).filter(Boolean));
      return C._set.has(id);
    },
    count: () => (C.has(''), C._set.size),
    /** Liste d'ids à jouer pour ce texte, ou null. */
    plan(text, lang) {
      if (!C.count()) return null;
      const id = C.id(C.key(text, lang));
      if (C.has(id)) return [id];
      const parts = C.split(text);
      if (parts.length < 2 || !parts.some((p) => p.num)) return null;
      const ids = parts.map((p) => C.id(C.key(p.text, lang)));
      return ids.every((x) => C.has(x)) ? ids : null;
    },
    enabled: () => !(M.settings && M.settings.get('voice') === 'browser') && C.count() > 0,
  };

  /* ---- Lecture : deux éléments <audio> en alternance (le suivant se charge pendant le premier) ---- */
  let cur = null, playTok = 0, pending = null;
  const mk = () => { const a = new Audio(); a.preload = 'auto'; return a; };
  const els = typeof Audio === 'function' ? [mk(), mk()] : [];
  const url = (id) => C.base + id + '.mp3';
  C.stop = () => { playTok++; if (cur) { try { cur.pause(); } catch (e) {} } cur = null; const p = pending; pending = null; if (p) p(false); };
  /** Joue les ids à la suite. Résout true (fini), false (arrêté) ou 'fail' (fichier introuvable). */
  C.play = (ids, rate = 1) => new Promise((resolve) => {
    if (!els.length) return resolve('fail');
    if (pending) { const p = pending; pending = null; p(false); } // lecture précédente interrompue
    const tok = ++playTok;
    let settled = false;
    const res = (v) => { if (settled) return; settled = true; if (pending === res) pending = null; resolve(v); };
    pending = res;
    let i = 0;
    const next = () => {
      if (tok !== playTok) return res(false);
      if (i >= ids.length) { cur = null; return res(true); }
      const a = els[i % 2];
      if (!a.src.endsWith(url(ids[i]))) a.src = url(ids[i]);
      const after = ids[i + 1];
      if (after) { const b = els[(i + 1) % 2]; b.src = url(after); b.load(); }
      a.playbackRate = Math.max(0.5, Math.min(2, rate));
      a.preservesPitch = true;
      a.onended = () => { i++; setTimeout(next, ids.length > 1 ? 40 : 0); };
      a.onerror = () => { if (tok === playTok) res(i === 0 ? 'fail' : false); };
      cur = a;
      try { a.currentTime = 0; } catch (e) {}
      const p = a.play();
      if (p && p.catch) p.catch((e) => { if (tok === playTok) res(e && e.name === 'NotAllowedError' ? false : 'fail'); });
    };
    next();
  });

  M.clips = C;
})();
