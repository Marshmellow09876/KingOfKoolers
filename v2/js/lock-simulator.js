// King of Koolers V2 — Interactive 20-Helix & Vertical Deadbolt Simulator + 6-Angle CAD Lightbox
import { showToast } from './v2-core.js';

const ANGLE_DATA = [
  {
    id: 'lock_01_20_helix_overview',
    pill: 'Angle 01 · 3/4 Elevated Helix Overview',
    title: '20-Start Spiral Helix Collar Overview',
    webp: 'assets/images/lock_01_20_helix_overview.webp',
    jpg: 'assets/images/lock_01_20_helix_overview.jpg',
    alt: '3/4 elevated view of the Patriot Blue 24-inch cooler rim with 20 parallel spiral starting threads and flush Patriot Red lid above.',
    desc: 'Around the entire 24.0-inch circular collar sit 20 evenly spaced spiral starting threads (one every 18°). Just like a multi-start bottle closure, the lid drops straight down at any orientation and locks all 20 threads simultaneously in a 1/20th turn.',
    specs: ['20 Parallel Starts', '18° Engagement Arc', 'Self-Indexing Drop-In'],
    callouts: [
      '20 helical starts distributed every 18.0° around the 24.0" OD perimeter.',
      'Maximum 9° blind rotational indexing—never hunt for a single start thread.',
      'Locks completely with 3.64" (92.5 mm) of linear wrist travel at the rim.'
    ]
  },
  {
    id: 'lock_02_macro_helix_engagement',
    pill: 'Angle 02 · Extreme Macro Thread Mesh',
    title: 'Macro Multi-Helix Thread Intermeshing',
    webp: 'assets/images/lock_02_macro_helix_engagement.webp',
    jpg: 'assets/images/lock_02_macro_helix_engagement.jpg',
    alt: 'Macro cutaway showing red lid bayonet ramps meshing with blue body helical threads and compressing the black EPDM lip gasket.',
    desc: 'Close-up inspection of the modified 30° stub-buttress helical ramps. A shallow 4.94° ramp angle converts a light 18° wrist nudge into an 11.5:1 axial clamping gain, drawing the lid down 8.0 mm to crush the dual EPDM and silicone seal evenly.',
    specs: ['4.94° Helix Pitch', '11.5:1 Clamping Force', '360° Dual Seal Crush'],
    callouts: [
      'Shallow 4.94° ramp slope creates 11.5:1 axial clamping multiplication.',
      '8.0 mm controlled axial drawdown prevents gasket pinching or shear.',
      'Dual-barrier hermetic seal: black EPDM lip + food-grade red silicone O-ring.'
    ]
  },
  {
    id: 'lock_03_vertical_slider_unlocked',
    pill: 'Angle 03 · Vertical Slider UP (Unlocked)',
    title: 'External Vertical Deadbolt — UP (Unlocked)',
    webp: 'assets/images/lock_03_vertical_slider_unlocked.webp',
    jpg: 'assets/images/lock_03_vertical_slider_unlocked.jpg',
    alt: 'Close-up profile of the external vertical slider in the raised UP position above the Patriot Blue receiver slot.',
    desc: 'Flush-recessed into the outer wall of the Patriot Red lid collar is the external vertical anti-rotation deadbolt. In the UP position, its hardened locking tongue clears the lower Patriot Blue receiver notch by 12 mm for free 18° removal.',
    specs: ['Slider Position: UP', 'Keyway Cleared', 'Free 18° Lid Twist'],
    callouts: [
      'Flush pocket protects slider from impacts and snagging against truck beds.',
      'Positive upper detent holds the pin clear during 18° open/close cycles.',
      'Zero exterior rubber T-latches or protruding draw buckles required.'
    ]
  },
  {
    id: 'lock_04_vertical_slider_locked',
    pill: 'Angle 04 · Vertical Slider DOWN (Anchored)',
    title: 'External Vertical Deadbolt — DOWN (Anchored)',
    webp: 'assets/images/lock_04_vertical_slider_locked.webp',
    jpg: 'assets/images/lock_04_vertical_slider_locked.jpg',
    alt: 'Close-up profile of the external vertical deadbolt pushed 12 mm DOWN across the seam into the Patriot Blue receiver keyway.',
    desc: 'Once the lid reaches its 18° closed stop, pushing the external slider 12 mm straight down drives its hardened tongue across the collar seam into one of 20 aligned vertical keyways in the base cooler. The lid is mechanically keyed.',
    specs: ['Slider Position: DOWN', '12 mm Axial Throw', '420+ ft-lb Shear Lock'],
    callouts: [
      '20 vertical receiver notches around the rim guarantee alignment at every lock stop.',
      'Hardened stainless-reinforced deadbolt rated above 420 ft-lbs (570 N·m) shear.',
      'Withstands heavy upper-tier unscrewing torque without backing out.'
    ]
  },
  {
    id: 'lock_05_stacked_selective_unthread',
    pill: 'Angle 05 · Selective Stack Unthreading',
    title: 'Selective Upper-Cooler Unstacking in Action',
    webp: 'assets/images/lock_05_stacked_selective_unthread.webp',
    jpg: 'assets/images/lock_05_stacked_selective_unthread.jpg',
    alt: 'Alpine White upper cooler twisting 18 degrees off an anchored Patriot Red lid locked onto the Patriot Blue base cooler.',
    desc: 'When an upper Alpine White tier is twisted 18° counterclockwise to unstack, all unscrewing torque transfers through its indexing feet into the Patriot Red lid below. Because the vertical deadbolt pins that lid to the blue base, only the top tier comes off.',
    specs: ['Zero Lid Back-Out', 'Independent Tier Access', 'One-Hand 18° Release'],
    callouts: [
      'Upper tier concentric foot keys into the top collar of the anchored middle lid.',
      'Counter-clockwise 18° twist releases upper module cleanly without disturbing ice below.',
      'Preserves cold air and hermetic pressure inside lower provision & bunker tiers.'
    ]
  },
  {
    id: 'lock_06_cad_cross_section_blueprint',
    pill: 'Angle 06 · CAD Cross-Section & Blueprint',
    title: 'Internal CAD Cross-Section & Force Vector Blueprint',
    webp: 'assets/images/lock_06_cad_cross_section_blueprint.webp',
    jpg: 'assets/images/lock_06_cad_cross_section_blueprint.jpg',
    alt: 'Technical CAD cutaway showing 5 mm UV-8 LLDPE walls, 3.5-inch R-8 foam core, 20-start threads, EPDM O-ring, and vertical deadbolt pin.',
    desc: 'Engineering cutaway illustrating three separated structural load paths: internal 20-start spiral threads carrying 500 lb vertical tension, dual EPDM and silicone seals absorbing thermal deflection, and the external vertical deadbolt isolating rotational shear.',
    specs: ['3.5" R-8 Foam Core', '5 mm UV-8 LLDPE Wall', 'Concentric Load Path'],
    callouts: [
      '5 mm rotomolded UV-8 LLDPE inner/outer skins encapsulate 3.5" R-8 polyurethane foam.',
      'Vertical compressive load (500 lb seat rating) passes through flat collar shoulders.',
      'Rotational shear and axial gasket compression remain mechanically decoupled.'
    ]
  }
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function describeArcWedge(cx, cy, rInner, rOuter, startDeg, endDeg) {
  if (endDeg - startDeg <= 0.05) return '';
  const p1 = polarToCartesian(cx, cy, rOuter, startDeg);
  const p2 = polarToCartesian(cx, cy, rOuter, endDeg);
  const p3 = polarToCartesian(cx, cy, rInner, endDeg);
  const p4 = polarToCartesian(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z'
  ].join(' ');
}

function buildTwentyStartTeeth() {
  const ns = 'http://www.w3.org/2000/svg';
  const baseTeethGroup = document.getElementById('sim-dial-base-teeth');
  const lidTeethGroup = document.getElementById('sim-dial-lid-teeth');
  const notchGroup = document.getElementById('sim-dial-notches');
  if (!baseTeethGroup || !lidTeethGroup || !notchGroup) return;

  const cx = 215;
  const cy = 225;

  for (let i = 0; i < 20; i++) {
    const startDeg = i * 18;

    // 20 Patriot Blue base collar helix ramps (every 18 deg, 8 deg tooth span)
    const baseTooth = document.createElementNS(ns, 'path');
    baseTooth.setAttribute('d', describeArcWedge(cx, cy, 129, 143, startDeg + 1, startDeg + 9.5));
    baseTooth.setAttribute('fill', '#1E4BD7');
    baseTooth.setAttribute('stroke', '#133294');
    baseTooth.setAttribute('stroke-width', '0.9');
    baseTeethGroup.appendChild(baseTooth);

    // 20 Patriot Red lid bayonet mating lugs (offset by -18 deg so rotating +18 deg meshes fully)
    const lidTooth = document.createElementNS(ns, 'path');
    lidTooth.setAttribute('d', describeArcWedge(cx, cy, 118, 130, startDeg - 8.5, startDeg));
    lidTooth.setAttribute('fill', '#E1232D');
    lidTooth.setAttribute('stroke', '#9e131b');
    lidTooth.setAttribute('stroke-width', '0.8');
    lidTeethGroup.appendChild(lidTooth);

    // 20 vertical deadbolt receiver notches around outer collar perimeter
    const notchPos = polarToCartesian(cx, cy, 151, startDeg + 90); // 3 o'clock aligned at i=0
    const notch = document.createElementNS(ns, 'circle');
    notch.setAttribute('cx', notchPos.x.toFixed(2));
    notch.setAttribute('cy', notchPos.y.toFixed(2));
    notch.setAttribute('r', i === 0 ? '4.5' : '2.4');
    notch.setAttribute('fill', i === 0 ? '#0a0a0a' : '#94a3b8');
    if (i === 0) {
      notch.setAttribute('stroke', '#ffffff');
      notch.setAttribute('stroke-width', '1.4');
    }
    notchGroup.appendChild(notch);
  }
}

function initSimulator() {
  const slider = document.getElementById('helix-angle-slider');
  const btnDropLid = document.getElementById('btn-drop-lid');
  const btnTwistLock = document.getElementById('btn-twist-lock');
  const btnDeadbolt = document.getElementById('btn-deadbolt-toggle');
  const btnTestUnthread = document.getElementById('btn-test-unthread');
  const btnResetStack = document.getElementById('btn-reset-stack');

  const dialInteractive = document.getElementById('sim-dial-interactive');
  const dialLid = document.getElementById('sim-dial-lid');
  const dialGasket = document.getElementById('sim-dial-gasket');
  const dialPinBadge = document.getElementById('sim-dial-pin-indicator');
  const dialArcWedge = document.getElementById('sim-dial-arc-wedge');

  const elevLid = document.getElementById('sim-elev-lid');
  const elevDeadbolt = document.getElementById('sim-elev-deadbolt');
  const elevDeadboltHit = document.getElementById('sim-elev-deadbolt-hit');
  const elevUpper = document.getElementById('sim-elev-upper');
  const elevGasketRed = document.getElementById('sim-elev-gasket-red');
  const elevGasketEpdm = document.getElementById('sim-elev-gasket-epdm');

  const stageBadge = document.getElementById('sim-stage-badge');
  const statusBanner = document.getElementById('sim-status-banner');
  const readoutAngle = document.getElementById('readout-angle');
  const readoutSeal = document.getElementById('readout-seal');
  const readoutBolt = document.getElementById('readout-bolt');

  const telAngle = document.getElementById('tel-angle');
  const telTravel = document.getElementById('tel-travel');
  const telDraw = document.getElementById('tel-draw');
  const telSeal = document.getElementById('tel-seal');

  if (!slider || !dialLid || !elevLid || !elevDeadbolt || !elevUpper) return;

  buildTwentyStartTeeth();

  const state = {
    angle: 18,            // 0 to 18 degrees
    deadboltLocked: true, // true = DOWN (12 mm into base receiver)
    upperRemoved: false,  // true = -18 deg CCW twist-off test active
    dragging: false
  };

  function triggerBlockedFeedback() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialLid.classList.remove('is-blocked');
      void dialLid.getBoundingClientRect();
      dialLid.classList.add('is-blocked');
    }
    showToast('Deadbolt pinned: raise the vertical slider to rotate the middle lid.');
    if (statusBanner) {
      statusBanner.dataset.state = 'anchored';
      statusBanner.innerHTML = '<strong>Deadbolt Lock Active (420+ ft-lb):</strong> The vertical stainless pin is keyed into the lower base notch, blocking counter-clockwise rotation. Flick the deadbolt <strong>UP</strong> first to unthread the middle lid.';
    }
  }

  function syncSliderVars() {
    slider.value = String(state.angle);
    slider.style.setProperty('--attr-min', slider.min || '0');
    slider.style.setProperty('--attr-max', slider.max || '18');
    slider.style.setProperty('--control-value', String(state.angle));
    const pct = Math.round((state.angle / 18) * 100);
    slider.setAttribute('aria-valuetext', `${state.angle.toFixed(1)} degrees, ${pct}% seal engagement`);
  }

  function render() {
    const ratio = state.angle / 18;
    const sealPct = Math.round(ratio * 100);
    const travelIn = (ratio * 3.64).toFixed(2);
    const drawMm = (ratio * 8.0).toFixed(1);

    syncSliderVars();

    // 1. Top-down 20-helix dial rotation (0..18 deg, or -18 deg if unthreaded with unlocked bolt)
    const effectiveDialAngle = state.upperRemoved && !state.deadboltLocked ? 0 : state.angle;
    dialLid.style.transform = `rotate(${effectiveDialAngle.toFixed(2)}deg)`;

    if (dialInteractive) {
      dialInteractive.dataset.locked = String(state.deadboltLocked && !state.upperRemoved);
    }

    if (dialArcWedge) {
      dialArcWedge.setAttribute('d', describeArcWedge(215, 225, 156, 165, 90, 90 + effectiveDialAngle));
    }

    // Dual gasket radial compression scale and opacity (kept strictly non-zero)
    if (dialGasket) {
      const gScale = 0.97 + ratio * 0.03;
      dialGasket.style.transform = `scale(${gScale.toFixed(3)})`;
      dialGasket.style.opacity = String((0.35 + ratio * 0.65).toFixed(2));
    }

    // Dial 3 o'clock deadbolt indicator dot
    if (dialPinBadge) {
      const boltActive = state.deadboltLocked && state.angle >= 17.5;
      dialPinBadge.style.transform = boltActive ? 'translateX(0px)' : 'translateX(10px)';
      dialPinBadge.style.opacity = boltActive ? '1' : '0.45';
    }

    // 2. Elevation view: middle lid axial drawdown (0..8px down) + twist-off if unpinned
    const axialPx = ratio * 8;
    if (state.upperRemoved && !state.deadboltLocked) {
      // Unpinned middle lid gets dragged -18 deg CCW & lifted up with upper cooler
      elevLid.style.transform = 'translate3d(-24px, -44px, 0)';
      elevUpper.style.transform = 'translate3d(-24px, -50px, 0)';
      elevUpper.style.opacity = '0.9';
    } else if (state.upperRemoved && state.deadboltLocked) {
      // Anchored middle lid stays seated tight; upper cooler twists -18 deg CCW & lifts cleanly
      elevLid.style.transform = `translate3d(0px, ${axialPx.toFixed(2)}px, 0)`;
      elevUpper.style.transform = 'translate3d(-24px, -54px, 0)';
      elevUpper.style.opacity = '0.9';
    } else {
      elevLid.style.transform = `translate3d(0px, ${axialPx.toFixed(2)}px, 0)`;
      elevUpper.style.transform = `translate3d(0px, ${(axialPx - 8).toFixed(2)}px, 0)`;
      elevUpper.style.opacity = '1';
    }

    // Dual EPDM & red silicone gasket visual compression
    const gasketScaleY = 1 - ratio * 0.42;
    if (elevGasketRed && elevGasketEpdm) {
      const gasketVisible = state.upperRemoved && !state.deadboltLocked ? 0.2 : 0.45 + ratio * 0.55;
      elevGasketRed.style.transform = `scaleY(${gasketScaleY.toFixed(3)})`;
      elevGasketEpdm.style.transform = `scaleY(${gasketScaleY.toFixed(3)})`;
      elevGasketRed.style.opacity = String(gasketVisible.toFixed(2));
      elevGasketEpdm.style.opacity = String(gasketVisible.toFixed(2));
    }

    // Vertical anti-rotation deadbolt slider pin (0px = UP unlocked, 18px = DOWN 12 mm anchored)
    elevDeadbolt.style.transform = state.deadboltLocked
      ? 'translate3d(0px, 18px, 0)'
      : 'translate3d(0px, 0px, 0)';

    // 3. Readouts & Telemetry
    const displayAngle = state.upperRemoved && !state.deadboltLocked ? 0 : state.angle;
    const displayPct = state.upperRemoved && !state.deadboltLocked ? 0 : sealPct;
    const displayTravel = state.upperRemoved && !state.deadboltLocked ? '0.00' : travelIn;
    const displayDraw = state.upperRemoved && !state.deadboltLocked ? '0.0' : drawMm;

    if (readoutAngle) readoutAngle.textContent = `${displayAngle.toFixed(1)}° / 18.0°`;
    if (readoutSeal) readoutSeal.textContent = displayPct === 100 ? '100% Hermetic Seal' : displayPct === 0 ? '0% Open' : `${displayPct}% Engaged`;
    if (readoutBolt) readoutBolt.textContent = state.deadboltLocked ? 'DOWN · 12 mm Keyed' : 'UP · Cleared';

    if (telAngle) telAngle.textContent = `${displayAngle.toFixed(1)}°`;
    if (telTravel) telTravel.textContent = `${displayTravel}"`;
    if (telDraw) telDraw.textContent = `${displayDraw} mm`;
    if (telSeal) telSeal.textContent = `${displayPct}%`;

    // Stage badge
    if (stageBadge) {
      if (state.upperRemoved && state.deadboltLocked) {
        stageBadge.dataset.tone = 'sealed';
        stageBadge.textContent = 'Lower Tier Sealed · Upper Tier Removed';
      } else if (state.upperRemoved && !state.deadboltLocked) {
        stageBadge.dataset.tone = 'open';
        stageBadge.textContent = 'Lid Back-Out · Seal Broken';
      } else if (state.deadboltLocked && state.angle >= 17.5) {
        stageBadge.dataset.tone = 'sealed';
        stageBadge.textContent = '18° Sealed + Deadbolt Anchored';
      } else if (state.angle >= 17.5) {
        stageBadge.dataset.tone = 'partial';
        stageBadge.textContent = '18° Sealed · Deadbolt Unlocked';
      } else if (state.angle > 0.5) {
        stageBadge.dataset.tone = 'partial';
        stageBadge.textContent = `Helix Meshing (${displayPct}%)`;
      } else {
        stageBadge.dataset.tone = 'open';
        stageBadge.textContent = '0° Drop-In Ready';
      }
    }

    // Button states
    if (btnDropLid) btnDropLid.setAttribute('aria-pressed', String(!state.deadboltLocked && state.angle === 0));
    if (btnTwistLock) btnTwistLock.setAttribute('aria-pressed', String(state.angle === 18));

    if (btnDeadbolt) {
      btnDeadbolt.setAttribute('aria-pressed', String(state.deadboltLocked));
      btnDeadbolt.classList.toggle('is-bolt-locked', state.deadboltLocked);
      btnDeadbolt.classList.toggle('is-bolt-unlocked', !state.deadboltLocked);
      const labelSpan = btnDeadbolt.querySelector('[data-bolt-label]');
      const metaSpan = btnDeadbolt.querySelector('[data-bolt-meta]');
      if (labelSpan) {
        labelSpan.textContent = state.deadboltLocked
          ? 'Deadbolt Engaged (DOWN · 12 mm)'
          : 'Deadbolt Unlocked (UP · Cleared)';
      }
      if (metaSpan) {
        metaSpan.textContent = state.deadboltLocked ? 'Click to Raise' : 'Click to Anchor';
      }
    }

    if (btnTestUnthread) {
      btnTestUnthread.setAttribute('aria-pressed', String(state.upperRemoved));
      const labelSpan = btnTestUnthread.querySelector('[data-unthread-label]');
      if (labelSpan) {
        labelSpan.textContent = state.upperRemoved
          ? 'Restack Upper Tier (+18° CW)'
          : 'Test Upper Tier Twist-Off (-18° CCW)';
      }
    }

    // Status banner narrative
    if (statusBanner) {
      if (state.upperRemoved && state.deadboltLocked) {
        statusBanner.dataset.state = 'anchored';
        statusBanner.innerHTML = '<strong>Selective Tier Access Verified:</strong> Upper Alpine White tier rotated -18° CCW and lifted cleanly away. Because the deadbolt is keyed into the lower base slot, the Patriot Red middle lid stayed <strong>100% locked and sealed</strong>.';
      } else if (state.upperRemoved && !state.deadboltLocked) {
        statusBanner.dataset.state = 'warning';
        statusBanner.innerHTML = '<strong>Lid Back-Out Occurred:</strong> With the vertical deadbolt raised (UP), counter-clockwise torque from unscrewing the upper tier dragged the Patriot Red middle lid open with it—exposing the lower tier.';
      } else if (state.deadboltLocked) {
        statusBanner.dataset.state = 'anchored';
        statusBanner.innerHTML = '<strong>Lid Anchored to Lower Tier:</strong> All 20 helix threads are engaged at 18° (100% EPDM compression) and the 12 mm vertical deadbolt keys the lid into the base collar. Ready to test upper-tier twist-off.';
      } else if (state.angle >= 17.5) {
        statusBanner.dataset.state = 'warning';
        statusBanner.innerHTML = '<strong>Sealed at 18° — Deadbolt Raised (UP):</strong> The middle lid is hermetically sealed, but not yet anchored against upper-tier torque. Engage the vertical deadbolt DOWN before twisting off a stacked cooler above.';
      } else {
        statusBanner.dataset.state = 'open';
        statusBanner.innerHTML = `<strong>20-Helix Indexing (${displayAngle.toFixed(1)}° / ${displayPct}%):</strong> Drop the lid at any angle and twist clockwise to 18.0° (3.64" rim stroke) to compress the dual EPDM + silicone gasket across 360°.`;
      }
    }
  }

  // Control 1: Range slider scrubbing
  slider.addEventListener('input', () => {
    const requested = parseFloat(slider.value);
    if (state.deadboltLocked && requested < 18) {
      state.angle = 18;
      render();
      triggerBlockedFeedback();
      return;
    }
    state.upperRemoved = false;
    state.angle = Math.max(0, Math.min(18, requested));
    render();
  });

  // Control 1 snap buttons
  if (btnDropLid) {
    btnDropLid.addEventListener('click', () => {
      state.deadboltLocked = false;
      state.upperRemoved = false;
      state.angle = 0;
      render();
    });
  }

  if (btnTwistLock) {
    btnTwistLock.addEventListener('click', () => {
      state.upperRemoved = false;
      state.angle = 18;
      render();
    });
  }

  // Direct pointer drag on the top-down 20-helix dial
  if (dialInteractive) {
    let startPointerAngle = 0;
    let startDialAngle = 0;

    const getPointerDeg = (event) => {
      const svg = dialInteractive.ownerSVGElement;
      if (!svg) return 0;
      const rect = svg.getBoundingClientRect();
      // Center of dial in viewBox (880x460) is (215, 225)
      const cx = rect.left + (215 / 880) * rect.width;
      const cy = rect.top + (225 / 460) * rect.height;
      return (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI;
    };

    const stopDrag = () => {
      if (!state.dragging) return;
      state.dragging = false;
      dialLid.classList.remove('is-scrubbing');
      elevLid.classList.remove('is-scrubbing');
    };

    dialInteractive.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      if (state.deadboltLocked) {
        triggerBlockedFeedback();
        return;
      }
      state.dragging = true;
      state.upperRemoved = false;
      startPointerAngle = getPointerDeg(event);
      startDialAngle = state.angle;
      dialLid.classList.add('is-scrubbing');
      elevLid.classList.add('is-scrubbing');
      dialInteractive.setPointerCapture(event.pointerId);
    });

    dialInteractive.addEventListener('pointermove', (event) => {
      if (!state.dragging) return;
      let delta = getPointerDeg(event) - startPointerAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      // 0.65x angular gearing gives precise fingertip control across the 18-degree arc
      const nextAngle = Math.round(Math.max(0, Math.min(18, startDialAngle + delta * 0.65)) * 2) / 2;
      if (nextAngle !== state.angle) {
        state.angle = nextAngle;
        render();
      }
    });

    dialInteractive.addEventListener('pointerup', stopDrag);
    dialInteractive.addEventListener('pointercancel', stopDrag);
  }

  // Control 2: Vertical Deadbolt toggle
  const toggleDeadbolt = () => {
    state.upperRemoved = false;
    state.deadboltLocked = !state.deadboltLocked;
    if (state.deadboltLocked && state.angle < 18) {
      state.angle = 18;
      showToast('Middle lid indexed to 18° and deadbolt locked into base notch.');
    }
    render();
  };

  if (btnDeadbolt) btnDeadbolt.addEventListener('click', toggleDeadbolt);
  if (elevDeadboltHit) elevDeadboltHit.addEventListener('click', toggleDeadbolt);

  // Control 3: Test Upper Tier Twist-Off (-18 deg CCW)
  if (btnTestUnthread) {
    btnTestUnthread.addEventListener('click', () => {
      if (state.angle < 18 && !state.upperRemoved) {
        state.angle = 18;
      }
      state.upperRemoved = !state.upperRemoved;
      render();
    });
  }

  if (btnResetStack) {
    btnResetStack.addEventListener('click', () => {
      state.angle = 18;
      state.deadboltLocked = true;
      state.upperRemoved = false;
      render();
    });
  }

  render();
}

function initLightbox() {
  const dialog = document.getElementById('lock-lightbox');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const titleEl = document.getElementById('lock-lightbox-title');
  const pillEl = document.getElementById('lock-lightbox-pill');
  const webpSource = document.getElementById('lock-lightbox-webp');
  const imgEl = document.getElementById('lock-lightbox-img');
  const descEl = document.getElementById('lock-lightbox-desc');
  const calloutsEl = document.getElementById('lock-lightbox-callouts');
  const tagsEl = document.getElementById('lock-lightbox-tags');
  const counterEl = document.getElementById('lock-lightbox-counter');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentIndex = 0;

  function renderAngle(index) {
    currentIndex = (index + ANGLE_DATA.length) % ANGLE_DATA.length;
    const item = ANGLE_DATA[currentIndex];
    if (!item) return;

    if (pillEl) pillEl.textContent = item.pill;
    if (titleEl) titleEl.textContent = item.title;
    if (webpSource) webpSource.srcset = item.webp;
    if (imgEl) {
      imgEl.src = item.jpg;
      imgEl.alt = item.alt;
    }
    if (descEl) descEl.textContent = item.desc;
    if (counterEl) counterEl.textContent = `Angle ${currentIndex + 1} of ${ANGLE_DATA.length}`;

    if (calloutsEl) {
      calloutsEl.replaceChildren(
        ...item.callouts.map((line) => {
          const li = document.createElement('li');
          li.textContent = line;
          return li;
        })
      );
    }

    if (tagsEl) {
      tagsEl.replaceChildren(
        ...item.specs.map((spec) => {
          const span = document.createElement('span');
          span.className = 'lock-spec-chip';
          span.textContent = spec;
          return span;
        })
      );
    }
  }

  document.querySelectorAll('[data-lock-angle]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const idx = parseInt(trigger.getAttribute('data-lock-angle') || '0', 10);
      renderAngle(Number.isNaN(idx) ? 0 : idx);
      if (!dialog.open) dialog.showModal();
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => renderAngle(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderAngle(currentIndex + 1));

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      renderAngle(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      renderAngle(currentIndex + 1);
    }
  });
}

function init() {
  initSimulator();
  initLightbox();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
