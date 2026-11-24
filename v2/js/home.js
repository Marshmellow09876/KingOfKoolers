// King of Koolers V2 — Homepage Interactive Logic
import { closeTopLayer, showToast } from './v2-core.js';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   1. Thermal Advantage Calculator, Clip-Path Wipe & FLIR Animation Freeze
   ========================================================================== */

function initHeroVideo() {
  const video = document.getElementById('hero-reel-video');
  const muteBtn = document.getElementById('hero-mute-btn');
  const playBtn = document.getElementById('hero-play-btn');
  if (!video) return;

  if (reducedMotion()) {
    video.pause();
    if (playBtn) {
      playBtn.setAttribute('aria-pressed', 'true');
      playBtn.textContent = 'Play';
    }
  } else {
    video.play().catch(() => {});
  }

  muteBtn?.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.setAttribute('aria-pressed', String(video.muted));
    muteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute hero demo video' : 'Mute hero demo video');
  });

  playBtn?.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
      playBtn.setAttribute('aria-pressed', 'false');
      playBtn.textContent = 'Pause';
      playBtn.setAttribute('aria-label', 'Pause hero demo video');
    } else {
      video.pause();
      playBtn.setAttribute('aria-pressed', 'true');
      playBtn.textContent = 'Play';
      playBtn.setAttribute('aria-label', 'Play hero demo video');
    }
  });
}

function initThermalSection() {
  const stage = document.getElementById('thermal-stage');
  const divider = document.getElementById('thermal-divider');
  const flirVideo = document.getElementById('thermal-flir-video');
  const pauseBtn = document.getElementById('thermal-pause-btn');
  const hoursInput = document.getElementById('thermal-hours');
  const hoursOut = document.getElementById('thermal-hours-out');
  const ambientBtns = [...document.querySelectorAll('[data-ambient]')];

  const cylTempEl = document.getElementById('cyl-temp');
  const cylIceEl = document.getElementById('cyl-ice');
  const rectTempEl = document.getElementById('rect-temp');
  const rectIceEl = document.getElementById('rect-ice');
  const svgElapsedEl = document.getElementById('svg-elapsed-readout');
  const svgCylEl = document.getElementById('svg-cyl-readout');
  const svgRectEl = document.getElementById('svg-rect-readout');

  if (!stage || !hoursInput) return;

  let ambientF = 95;
  let hours = Number(hoursInput.value) || 48;
  let wipePct = 54;
  let userPaused = false;

  function renderPhysics() {
    const load = (ambientF - 32) / 63; // 1.0 at 95F
    const tFrac = hours / 72;

    const cylIce = Math.max(0, Math.round(100 - tFrac * 19 * load));
    const rectIce = Math.max(0, Math.round(100 - tFrac * 58 * load));

    const cylTemp = 33.5 + tFrac * 1.1 * load + (100 - cylIce) * 0.04;
    const rectTemp = 33.5 + tFrac * 8.2 * load + (100 - rectIce) * 0.16;

    const cylWatts = (8.4 * load).toFixed(1);
    const rectWatts = (28.2 * load).toFixed(1);

    if (hoursOut) hoursOut.textContent = `${hours} hr`;
    if (cylTempEl) cylTempEl.textContent = `${cylTemp.toFixed(1)}°F`;
    if (cylIceEl) cylIceEl.textContent = `${cylIce}% ice · ${cylWatts} W`;
    if (rectTempEl) rectTempEl.textContent = `${rectTemp.toFixed(1)}°F`;
    if (rectIceEl) rectIceEl.textContent = `${rectIce}% ice · ${rectWatts} W`;

    if (svgElapsedEl) svgElapsedEl.textContent = `${ambientF}°F ambient · ${hours} hr`;
    if (svgCylEl) svgCylEl.textContent = `Cyl: ${cylTemp.toFixed(1)}°F (${cylIce}%)`;
    if (svgRectEl) svgRectEl.textContent = `Rect: ${rectTemp.toFixed(1)}°F (${rectIce}%)`;
  }

  ambientBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      ambientF = Number(btn.dataset.ambient) || 95;
      ambientBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      renderPhysics();
    });
  });

  hoursInput.addEventListener('input', () => {
    hours = Number(hoursInput.value) || 0;
    renderPhysics();
  });

  function setWipe(pct) {
    wipePct = Math.min(94, Math.max(6, Math.round(pct)));
    stage.style.setProperty('--wipe', `${wipePct}%`);
    if (divider) divider.setAttribute('aria-valuenow', String(wipePct));
  }

  function clientXToPct(clientX) {
    const rect = stage.getBoundingClientRect();
    if (!rect.width) return wipePct;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  let dragging = false;
  stage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.loop-pause')) return;
    dragging = true;
    stage.setPointerCapture?.(event.pointerId);
    setWipe(clientXToPct(event.clientX));
  });

  stage.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    setWipe(clientXToPct(event.clientX));
  });

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    stage.releasePointerCapture?.(event.pointerId);
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  divider?.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 10 : 3;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setWipe(wipePct - step);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setWipe(wipePct + step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setWipe(6);
    } else if (event.key === 'End') {
      event.preventDefault();
      setWipe(94);
    }
  });

  function syncPauseState() {
    const shouldPause = userPaused || reducedMotion();
    if (flirVideo) {
      if (shouldPause) flirVideo.pause();
      else flirVideo.play().catch(() => {});
    }
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', String(shouldPause));
      pauseBtn.setAttribute(
        'aria-label',
        shouldPause ? 'Play FLIR thermal comparison' : 'Pause FLIR thermal comparison'
      );
      const iconPause = pauseBtn.querySelector('[data-icon-pause]');
      const iconPlay = pauseBtn.querySelector('[data-icon-play]');
      if (iconPause) iconPause.hidden = shouldPause;
      if (iconPlay) iconPlay.hidden = !shouldPause;
    }
  }

  syncPauseState();

  pauseBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    userPaused = !userPaused;
    syncPauseState();
  });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', syncPauseState);

  renderPhysics();
  setWipe(wipePct);
}

/* ==========================================================================
   2. Six-Colorway Interactive Selector (#colorways)
   ========================================================================== */

const COLORWAYS = {
  blue: {
    name: 'Patriot Blue',
    hex: '#1E4BD7',
    note: 'Standard 20 in & 28 in bunker base finish',
    src: 'assets/images/single_stack_blue.webp',
    alt: 'King of Koolers 24-inch single module in Patriot Blue matte LLDPE'
  },
  white: {
    name: 'Alpine White',
    hex: '#F0F4FA',
    note: 'Solar-reflective mid provision tier finish',
    src: 'assets/images/single_stack_white.webp',
    alt: 'King of Koolers 24-inch single module in Alpine White matte LLDPE'
  },
  red: {
    name: 'Patriot Red',
    hex: '#E1232D',
    note: 'Signature 12 in hot vault & collar ring finish',
    src: 'assets/images/single_stack_red.webp',
    alt: 'King of Koolers 24-inch single module in Patriot Red matte LLDPE'
  },
  black: {
    name: 'Stealth Charcoal',
    hex: '#1E222B',
    note: 'Tactical matte foundation & rack finish',
    src: 'assets/images/single_stack_black.webp',
    alt: 'King of Koolers 24-inch single module in Stealth Charcoal matte LLDPE'
  },
  green: {
    name: 'Tactical Olive',
    hex: '#3A4B3A',
    note: 'Overland trail & expedition shell finish',
    src: 'assets/images/single_stack_green.webp',
    alt: 'King of Koolers 24-inch single module in Tactical Olive matte LLDPE'
  },
  orange: {
    name: 'Blaze Orange',
    hex: '#F45B24',
    note: 'High-visibility marine & safety finish',
    src: 'assets/images/single_stack_orange.webp',
    alt: 'King of Koolers 24-inch single module in Blaze Orange matte LLDPE'
  }
};

function initColorways() {
  const stage = document.getElementById('colorway-stage');
  const img = document.getElementById('colorway-img');
  const nameEl = document.getElementById('colorway-name');
  const codeEl = document.getElementById('colorway-code');
  const noteEl = document.getElementById('colorway-note');
  const buttons = [...document.querySelectorAll('[data-colorway]')];

  if (!stage || !img || !buttons.length) return;

  let switchTimer = 0;

  // Preload lightweight colorway stills after initial paint
  const preload = () => {
    Object.values(COLORWAYS).forEach((item) => {
      const pre = new Image();
      pre.src = item.src;
    });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(preload);
  else setTimeout(preload, 800);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.colorway;
      const spec = COLORWAYS[key];
      if (!spec) return;

      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      if (nameEl) nameEl.textContent = spec.name;
      if (codeEl) codeEl.textContent = spec.hex;
      if (noteEl) noteEl.textContent = spec.note;

      clearTimeout(switchTimer);
      if (reducedMotion()) {
        img.src = spec.src;
        img.alt = spec.alt;
        return;
      }

      stage.classList.add('is-switching');
      switchTimer = setTimeout(() => {
        img.src = spec.src;
        img.alt = spec.alt;
        requestAnimationFrame(() => stage.classList.remove('is-switching'));
      }, 110);
    });
  });
}

/* ==========================================================================
   3. Reservation Dialog, Inline Allocation Form & Accessible Input Validation
   ========================================================================== */

/**
 * Attach accessible :user-invalid, polite screen-reader announcement, and
 * reservation submission handling to a form inside a section or dialog.
 */
function bindAccessibleForm(form, statusEl, onConfirmed) {
  if (!form) return;

  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'v2-visually-hidden';
  form.append(announcer);

  let announceTimer = 0;
  let announcedField = null;
  const flagged = new WeakSet();
  const announced = new WeakSet();

  const linkError = (el, shown) => {
    const errId = el.dataset.error;
    if (!errId) return;
    const errNode = document.getElementById(errId);
    if (errNode) errNode.hidden = !shown;
    const ids = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errId);
    if (shown) ids.push(errId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const syncAria = (el, shouldAnnounce = false) => {
    if (!el.matches?.('input, select, textarea')) return;
    const invalid = el.matches(':user-invalid') || !el.checkValidity();
    const touched = el.matches(':user-invalid') || flagged.has(el);

    if (invalid && touched) {
      if (shouldAnnounce && !announced.has(el)) {
        const err = document.getElementById(el.dataset.error || '');
        const labelText = el.labels?.[0]?.textContent?.trim() || '';
        if (err) {
          clearTimeout(announceTimer);
          announcer.textContent = '';
          announcedField = el;
          announceTimer = setTimeout(() => {
            announcer.textContent = `${labelText ? `${labelText}: ` : ''}${err.textContent.trim()}`;
          }, 500);
        }
        announced.add(el);
      }
      el.setAttribute('aria-invalid', 'true');
      linkError(el, true);
      flagged.add(el);
    } else if (!invalid || flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
      el.setAttribute('aria-invalid', 'false');
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
      if (announcedField === el) {
        clearTimeout(announceTimer);
        announcer.textContent = '';
      }
    }
  };

  const fields = [...form.querySelectorAll('input, select, textarea')];
  fields.forEach((el) => {
    el.setAttribute('aria-invalid', 'false');
    el.addEventListener('blur', () => {
      if (el.value.trim() !== '' || el.matches(':user-invalid')) {
        flagged.add(el);
        syncAria(el, true);
      }
    });
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') syncAria(el, false);
    });
    el.addEventListener('change', () => {
      if (el.getAttribute('aria-invalid') === 'true' || el.matches('select')) {
        flagged.add(el);
        syncAria(el, true);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    const invalidFields = [];
    fields.forEach((el) => {
      flagged.add(el);
      if (!el.checkValidity()) {
        announced.add(el);
        el.setAttribute('aria-invalid', 'true');
        linkError(el, true);
        invalidFields.push(el);
      } else {
        el.setAttribute('aria-invalid', 'false');
        linkError(el, false);
      }
    });

    if (invalidFields.length > 0) {
      event.preventDefault();
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent =
          invalidFields.length === 1
            ? 'Please correct 1 highlighted field.'
            : `Please correct ${invalidFields.length} highlighted fields.`;
      }
      invalidFields[0].focus();
      return;
    }

    const data = new FormData(form);
    const tier = String(data.get('tier') || 'Patriot RWB 58" ($389)');
    const colorway = String(data.get('colorway') || 'Patriot Blue');
    const name = String(data.get('name') || '').trim();
    const refId = `KOK-${String(Date.now()).slice(-5)}`;

    try {
      sessionStorage.setItem(
        'kok_v2_reservation',
        JSON.stringify({ refId, tier, colorway, name, ts: new Date().toISOString() })
      );
    } catch {
      // Ignore storage failures in private browsing
    }

    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = `Opening your email client to send batch-one request ${refId} (${tier}).`;
    }

    showToast(`Preparing email request ${refId} for ${tier}`);
    onConfirmed?.();
  });
}

const EDITION_PREVIEWS = {
  'Maker CAD Pack ($29)': {
    src: 'assets/images/prototype_red_blue_cobblestone.webp',
    alt: 'Maker CAD Pack 24-inch matte red and blue test collar assembly'
  },
  'Solo Scout 30" ($239)': {
    src: 'assets/images/hero_keyframes/hero_keyframe_01a_studio_base.webp',
    alt: 'Solo Scout 20-inch Patriot Blue cylindrical base cooler with bottom spigot'
  },
  'Patriot RWB 58" ($389)': {
    src: 'assets/images/render_red_white_blue_stacked-800w.webp',
    alt: 'Patriot RWB stacked cylindrical cooler modules with 10-watt solar lid'
  },
  'Titan Max 72" ($549)': {
    src: 'assets/images/hero_keyframes/hero_keyframe_06_expedition_fleet_finale.webp',
    alt: 'Full modular Titan cooler fleet beside an alpine mountain lake'
  }
};

function initReservationAndVideoDialogs() {
  const reserveDialog = document.getElementById('reserve-dialog');
  const reserveForm = document.getElementById('reserve-form');
  const tierForm = document.getElementById('tier-reserve-form');
  const previewImg = document.getElementById('edition-preview-img');
  const editionRows = [...document.querySelectorAll('.edition-row[data-edition-tier]')];
  const tierSelects = [
    document.getElementById('res-tier'),
    document.getElementById('tier-res-tier')
  ].filter(Boolean);

  const reelDialog = document.getElementById('reel-dialog');
  const reelVideo = document.getElementById('reel-video');

  let editionTimer = 0;

  function setEditionPreview(chosen) {
    const spec = EDITION_PREVIEWS[chosen];
    if (chosen) {
      tierSelects.forEach((sel) => {
        const match = [...sel.options].find((o) => o.value === chosen);
        if (match) sel.value = match.value;
      });
      editionRows.forEach((row) => {
        row.classList.toggle('is-active', row.dataset.editionTier === chosen);
      });
    }
    if (!previewImg || !spec || previewImg.getAttribute('src') === spec.src) return;
    clearTimeout(editionTimer);
    if (reducedMotion()) {
      previewImg.src = spec.src;
      previewImg.alt = spec.alt;
      return;
    }
    previewImg.style.opacity = '0.4';
    editionTimer = setTimeout(() => {
      previewImg.src = spec.src;
      previewImg.alt = spec.alt;
      requestAnimationFrame(() => {
        previewImg.style.opacity = '1';
      });
    }, 90);
  }

  editionRows.forEach((row) => {
    const tier = row.dataset.editionTier;
    row.addEventListener('pointerenter', () => setEditionPreview(tier));
    row.addEventListener('focusin', () => setEditionPreview(tier));
  });

  // Wire tier edition buttons to update showcase, pre-select tier, and open reservation dialog
  document.querySelectorAll('[data-reserve-tier]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chosen = btn.dataset.reserveTier;
      setEditionPreview(chosen);
      if (reserveDialog && !reserveDialog.open) {
        reserveDialog.showModal();
      }
    });
  });

  // Pause video whenever reel dialog closes
  reelDialog?.addEventListener('close', () => {
    if (reelVideo && !reelVideo.paused) {
      reelVideo.pause();
    }
  });

  bindAccessibleForm(reserveForm, document.getElementById('res-status'), () => {
    setTimeout(() => {
      if (reserveDialog?.open) closeTopLayer(reserveDialog);
    }, 1400);
  });

  bindAccessibleForm(tierForm, document.getElementById('tier-res-status'));
}

/* ==========================================================================
   Init
   ========================================================================== */

function initHome() {
  initHeroVideo();
  initThermalSection();
  initColorways();
  initReservationAndVideoDialogs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome, { once: true });
} else {
  initHome();
}
