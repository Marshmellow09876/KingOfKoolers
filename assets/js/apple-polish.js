/* ==========================================================================
   KING OF KOOLERS — APPLE / FORTUNE 500 INTERACTION ENGINE
   Theme Toggle, Command Palette (Cmd+K), Technical Docs Drawer,
   Magnetic Cursor, Spotlight Cards & Mobile Micro-Haptics
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  function haptic(ms = 10) {
    if (navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (_) {}
    }
  }
  window.kokHaptic = haptic;

  /* ------------------------------------------------------------------------
     1. ADAPTIVE THEME ("Daylight" vs "Night Camp")
     ------------------------------------------------------------------------ */
  const THEME_KEY = 'kok-theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.getElementById('kok-theme-btn');
    if (btn) {
      btn.innerHTML = theme === 'light' ? '🌙 <span>Night</span>' : '☀️ <span>Daylight</span>';
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  /* ------------------------------------------------------------------------
     2. INJECT NAV UTILITY PILLS (Theme + Cmd+K + Docs)
     ------------------------------------------------------------------------ */
  function injectNavUtilities() {
    const target =
      document.querySelector('.nav-actions') ||
      document.querySelector('.global-nav .nav-inner') ||
      document.querySelector('.global-nav');
    if (!target || document.getElementById('kok-cmd-btn')) return;

    const cmdBtn = document.createElement('button');
    cmdBtn.type = 'button';
    cmdBtn.id = 'kok-cmd-btn';
    cmdBtn.className = 'kok-nav-pill';
    cmdBtn.title = 'Quick Jump & Search (Ctrl+K / Cmd+K)';
    cmdBtn.innerHTML = '🔍 <span>Search</span> <span class="kok-kbd">⌘K</span>';
    cmdBtn.addEventListener('click', () => { haptic(); openCmdPalette(); });

    const docsBtn = document.createElement('button');
    docsBtn.type = 'button';
    docsBtn.id = 'kok-docs-btn';
    docsBtn.className = 'kok-nav-pill';
    docsBtn.title = 'Technical CAD Drawings & Spec Sheets';
    docsBtn.innerHTML = '📐 <span>CAD &amp; Specs</span>';
    docsBtn.addEventListener('click', () => { haptic(); openDocsDrawer(); });

    const themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.id = 'kok-theme-btn';
    themeBtn.className = 'kok-nav-pill';
    themeBtn.title = 'Switch between Daylight Studio and Night Camp mode';
    themeBtn.addEventListener('click', () => {
      haptic(12);
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });

    target.prepend(themeBtn);
    target.prepend(docsBtn);
    target.prepend(cmdBtn);
    applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  }

  /* ------------------------------------------------------------------------
     3. GLOBAL COMMAND PALETTE (Cmd+K / Ctrl+K)
     ------------------------------------------------------------------------ */
  const CMD_INDEX = [
    { title: 'Overview — Hero & Modular System', cat: 'Page', url: './index.html#overview' },
    { title: 'Twist & Lock — Interactive Demo', cat: 'Section', url: './index.html#stack-and-sit' },
    { title: 'Thermodynamics — 72h FLIR Lab', cat: 'Section', url: './index.html#thermodynamics' },
    { title: 'Live Capacity & Pack-Out Visualizer', cat: 'Tool', url: './index.html#packout-visualizer' },
    { title: 'Engineering Bento Grid & Specs', cat: 'Specs', url: './index.html#specs' },
    { title: 'Pizza Vault™ 16" Heated/Chilled Tier', cat: 'Feature', url: './index.html#pizza-vault' },
    { title: 'Investor Pitch, Market Chart & Dealer Map', cat: 'Investors', url: './index.html#investors' },
    { title: 'Patented 20-Helix & Vertical Deadbolt Lock', cat: 'Page', url: './locking-mechanism.html' },
    { title: '3D Interactive Studio & Laser Engraving', cat: '3D Lab', url: './customizer.html' },
    { title: 'All 30 Modular Accessories Ecosystem', cat: 'Catalog', url: './accessories.html' },
    { title: 'Acc #01 — Bluetooth Lid Speaker', cat: 'Accessory', url: './accessories.html' },
    { title: 'Acc #02 — Bamboo Cutting Board', cat: 'Accessory', url: './accessories.html' },
    { title: 'Acc #08 — Draft Beer Tap System', cat: 'Accessory', url: './accessories.html' },
    { title: 'Acc #10 — 500-lb Swivel Camp Stool', cat: 'Accessory', url: './accessories.html' },
    { title: 'Acc #15 — Off-Road Overland Cart', cat: 'Accessory', url: './accessories.html' },
    { title: 'Acc #16 — All-Thread Deli Tree', cat: 'Accessory', url: './accessories.html' },
    { title: 'Acc #22 — Charcuterie Dome', cat: 'Accessory', url: './accessories.html' },
    { title: 'Acc #29 — Spiral Can Dispenser', cat: 'Accessory', url: './accessories.html' },
    { title: 'CAD Drawing: Full Scale Engineering v1 (PDF)', cat: 'CAD PDF', url: './assets/docs/Ful_Scale_King_Of_Koolers_Drawing_v1.pdf', external: true },
    { title: 'CAD Drawing: Half-View Cross Section (PDF)', cat: 'CAD PDF', url: './assets/docs/Ful_Scale_King_Of_Koolers_Drawing_half_view.pdf', external: true },
    { title: 'Investor Pitch Deck (PDF)', cat: 'PDF', url: './assets/docs/King_of_Koolers_Investor_Pitch.pdf', external: true },
    { title: 'Open Technical Documentation Drawer', cat: 'Action', action: () => openDocsDrawer() },
    { title: 'Toggle Daylight / Night Camp Theme', cat: 'Action', action: () => applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light') }
  ];

  let cmdBackdrop, cmdInput, cmdResults, selectedIdx = 0, currentMatches = CMD_INDEX;

  function buildCmdPalette() {
    if (document.getElementById('kok-cmd-modal')) return;
    cmdBackdrop = document.createElement('div');
    cmdBackdrop.id = 'kok-cmd-modal';
    cmdBackdrop.className = 'kok-modal-backdrop';
    cmdBackdrop.setAttribute('role', 'dialog');
    cmdBackdrop.setAttribute('aria-modal', 'true');
    cmdBackdrop.setAttribute('aria-label', 'Quick Command Search');
    cmdBackdrop.innerHTML = `
      <div class="kok-cmd-dialog">
        <div class="kok-cmd-input-wrap">
          <span>🔍</span>
          <input type="text" class="kok-cmd-input" id="kok-cmd-input" placeholder="Jump to specs, 3D studio, accessories, or CAD PDFs..." autocomplete="off">
          <button type="button" class="kok-nav-pill" id="kok-cmd-close">ESC</button>
        </div>
        <div class="kok-cmd-results" id="kok-cmd-results"></div>
      </div>
    `;
    document.body.appendChild(cmdBackdrop);
    cmdInput = document.getElementById('kok-cmd-input');
    cmdResults = document.getElementById('kok-cmd-results');

    cmdBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdBackdrop) closeCmdPalette();
    });
    document.getElementById('kok-cmd-close').addEventListener('click', closeCmdPalette);
    cmdInput.addEventListener('input', () => {
      selectedIdx = 0;
      renderCmdResults(cmdInput.value.trim().toLowerCase());
    });
    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, currentMatches.length - 1);
        highlightCmdItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        highlightCmdItem();
      } else if (e.key === 'Enter' && currentMatches[selectedIdx]) {
        e.preventDefault();
        executeCmdItem(currentMatches[selectedIdx]);
      }
    });
  }

  function renderCmdResults(q) {
    currentMatches = q
      ? CMD_INDEX.filter(i => i.title.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q))
      : CMD_INDEX.slice(0, 12);

    if (!currentMatches.length) {
      cmdResults.innerHTML = '<div style="padding:18px;text-align:center;opacity:0.65;font-size:13px;">No matching sections, accessories, or CAD docs found.</div>';
      return;
    }

    cmdResults.innerHTML = currentMatches.map((item, idx) => `
      <div class="kok-cmd-item ${idx === selectedIdx ? 'selected' : ''}" data-idx="${idx}" role="button" tabindex="0">
        <span>${item.title}</span>
        <span class="kok-cmd-cat">${item.cat}</span>
      </div>
    `).join('');

    cmdResults.querySelectorAll('.kok-cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = Number(el.dataset.idx);
        executeCmdItem(currentMatches[idx]);
      });
    });
  }

  function highlightCmdItem() {
    cmdResults.querySelectorAll('.kok-cmd-item').forEach((el, idx) => {
      el.classList.toggle('selected', idx === selectedIdx);
      if (idx === selectedIdx) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function executeCmdItem(item) {
    haptic();
    closeCmdPalette();
    if (item.action) {
      item.action();
    } else if (item.external) {
      window.open(item.url, '_blank', 'noopener');
    } else {
      window.location.href = item.url;
    }
  }

  function openCmdPalette() {
    buildCmdPalette();
    cmdBackdrop.classList.add('open');
    cmdInput.value = '';
    selectedIdx = 0;
    renderCmdResults('');
    setTimeout(() => cmdInput.focus(), 40);
  }

  function closeCmdPalette() {
    if (cmdBackdrop) cmdBackdrop.classList.remove('open');
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCmdPalette();
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      closeDocsDrawer();
    }
  });

  /* ------------------------------------------------------------------------
     4. TECHNICAL DOCUMENTATION & CAD PDF DRAWER
     ------------------------------------------------------------------------ */
  let docsBackdrop;

  function buildDocsDrawer() {
    if (document.getElementById('kok-docs-drawer')) return;
    docsBackdrop = document.createElement('div');
    docsBackdrop.id = 'kok-docs-drawer';
    docsBackdrop.className = 'kok-drawer-backdrop';
    docsBackdrop.setAttribute('role', 'dialog');
    docsBackdrop.setAttribute('aria-modal', 'true');
    docsBackdrop.setAttribute('aria-label', 'Technical Documentation and CAD PDF Center');
    docsBackdrop.innerHTML = `
      <aside class="kok-drawer">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:var(--kok-accent);text-transform:uppercase;">Technical Documentation</div>
            <h3 style="margin:4px 0 0;font-size:1.35rem;">CAD &amp; Spec Sheet Center</h3>
          </div>
          <button type="button" class="kok-nav-pill" id="kok-docs-close">✕ Close</button>
        </div>
        <p style="font-size:13px;color:var(--kok-ink-muted);line-height:1.5;margin:4px 0 12px;">
          Official Austin Marshall engineering drawings, cross-sections, investor materials, and printable 1-page specification sheet.
        </p>

        <a class="kok-doc-item" href="./assets/docs/Ful_Scale_King_Of_Koolers_Drawing_v1.pdf" target="_blank" rel="noopener">
          <div>
            <div style="font-weight:700;font-size:14px;">Full-Scale Engineering CAD (v1)</div>
            <div style="font-size:12px;color:var(--kok-ink-muted);">24" cylindrical tolerances &amp; wall thickness • PDF</div>
          </div>
          <span class="kok-nav-pill">Open ↗</span>
        </a>

        <a class="kok-doc-item" href="./assets/docs/Ful_Scale_King_Of_Koolers_Drawing_half_view.pdf" target="_blank" rel="noopener">
          <div>
            <div style="font-weight:700;font-size:14px;">Half-View Cross-Section Drawing</div>
            <div style="font-size:12px;color:var(--kok-ink-muted);">20-helix thread pitch &amp; R-8 foam core • PDF</div>
          </div>
          <span class="kok-nav-pill">Open ↗</span>
        </a>

        <a class="kok-doc-item" href="./assets/docs/King_of_Koolers_Investor_Pitch.pdf" target="_blank" rel="noopener">
          <div>
            <div style="font-weight:700;font-size:14px;">Investor Pitch Deck</div>
            <div style="font-size:12px;color:var(--kok-ink-muted);">Market sizing, unit economics &amp; IP roadmap • PDF</div>
          </div>
          <span class="kok-nav-pill">Open ↗</span>
        </a>

        <div class="kok-doc-item" id="kok-print-spec-btn" role="button" tabindex="0" style="cursor:pointer;">
          <div>
            <div style="font-weight:700;font-size:14px;">1-Page Printable Spec Sheet</div>
            <div style="font-size:12px;color:var(--kok-ink-muted);">Clean formatted hardware &amp; thermal summary</div>
          </div>
          <span class="kok-nav-pill">Print / PDF</span>
        </div>
      </aside>
    `;
    document.body.appendChild(docsBackdrop);
    docsBackdrop.addEventListener('click', (e) => {
      if (e.target === docsBackdrop) closeDocsDrawer();
    });
    document.getElementById('kok-docs-close').addEventListener('click', closeDocsDrawer);
    document.getElementById('kok-print-spec-btn').addEventListener('click', printOnePageSpecSheet);
  }

  function printOnePageSpecSheet() {
    haptic();
    const w = window.open('', '_blank', 'width=860,height=920');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>King of Koolers — 1-Page Spec Sheet</title>
      <style>
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:36px;color:#111;max-width:780px;margin:auto;}
        h1{margin:0 0 4px;font-size:28px;} .sub{color:#555;margin-bottom:24px;font-size:14px;}
        table{width:100%;border-collapse:collapse;margin-top:16px;}
        th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #ddd;font-size:13.5px;}
        th{background:#f5f5f7;width:36%;}
        .footer{margin-top:28px;font-size:12px;color:#666;}
      </style></head><body>
      <h1>King of Koolers — Technical Specification Sheet</h1>
      <div class="sub">24" Modular Cylindrical Rotomolded System • Patent-Pending 20-Helix Twist-Lock</div>
      <table>
        <tr><th>Outer Diameter</th><td>24.0 inches (Cylindrical zero-corner thermal profile)</td></tr>
        <tr><th>3-Tier Stacked Height</th><td>58.0 inches (Modular Base + Mid + Top/Pizza Vault)</td></tr>
        <tr><th>Shell Material</th><td>Virgin Food-Grade Rotomolded HDPE / LLDPE</td></tr>
        <tr><th>Insulation Core</th><td>120 PSI Closed-Cell R-8 Polyurethane Foam Matrix</td></tr>
        <tr><th>Thermal Advantage</th><td>34% surface-area-to-volume heat transfer reduction vs. rectangular chests</td></tr>
        <tr><th>Locking Mechanism</th><td>Patented 20-Start Helix (18° engagement) + Vertical Deadbolt Slider</td></tr>
        <tr><th>Load Rating</th><td>500+ lb static vertical compression (doubles as 3 camp chairs)</td></tr>
        <tr><th>Hardware Metallurgy</th><td>Marine-Grade 316 Stainless Steel pins, hinges &amp; drain valves</td></tr>
        <tr><th>Ecosystem</th><td>30+ Modular Twist-Lock Accessories &amp; 16" Pizza Vault™</td></tr>
      </table>
      <div class="footer">Inventor: Austin Marshall • King of Koolers • Printed from kingofkoolers.com</div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    w.document.close();
  }

  function openDocsDrawer() {
    buildDocsDrawer();
    docsBackdrop.classList.add('open');
  }

  function closeDocsDrawer() {
    if (docsBackdrop) docsBackdrop.classList.remove('open');
  }

  window.kokOpenDocsDrawer = openDocsDrawer;

  /* ------------------------------------------------------------------------
     5. MAGNETIC CURSOR, SPOTLIGHT GLOW & MOBILE HAPTICS
     ------------------------------------------------------------------------ */
  function initCursorAndHaptics() {
    if (finePointer && !prefersReducedMotion) {
      document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.bento-card, .engineering-pillar, .accessory-card');
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }
      });

      document.querySelectorAll('.btn-cyan, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.16;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.16;
          btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });
    }

    // Subtle haptics on sliders & interactive toggles
    document.addEventListener('input', (e) => {
      if (e.target.matches('input[type="range"]')) haptic(6);
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('.preset-chip, .packout-btn, .stack-mode-btn, .story-step-card')) haptic(10);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectNavUtilities();
    initCursorAndHaptics();
  });
})();
