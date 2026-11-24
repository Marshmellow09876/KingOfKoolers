// King of Koolers V2 — Modular Accessories Catalog & Kit Builder
import { ACCESSORIES_DATA } from './accessories-data.js';
import { closeTopLayer, showToast } from './v2-core.js';

const STORAGE_KEY = 'kok_v2_kit';

const CATEGORY_LABELS = {
  all: 'All',
  mobility: 'Mobility',
  lid: 'Lids',
  culinary: 'Culinary',
  power: 'Power',
  angler: 'Angler',
  picnic: 'Picnic'
};

// Wide multi-panel CAD/spec composite sheets that render cleanly uncropped via object-fit: contain
const CONTAIN_IMAGE_IDS = new Set([
  'kok-acc-11',
  'kok-acc-12',
  'kok-acc-15',
  'kok-acc-31'
]);

const ITEM_BY_ID = new Map(ACCESSORIES_DATA.map((item) => [item.id, item]));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = {
  category: 'all',
  search: '',
  sort: 'num-asc',
  activeDetailId: null,
  kit: loadKit()
};

// DOM references
const gridEl = document.getElementById('catalog-grid');
const emptyEl = document.getElementById('catalog-empty');
const emptyMsgEl = document.getElementById('catalog-empty-msg');
const countEl = document.getElementById('catalog-count');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

const tabListEl = document.getElementById('cat-tabs');
const tabIndicatorEl = document.getElementById('cat-tabs-indicator');
const tabButtons = tabListEl ? [...tabListEl.querySelectorAll('.cat-tab')] : [];

const searchInput = document.getElementById('acc-search');
const searchClearBtn = document.getElementById('acc-search-clear');
const sortSelect = document.getElementById('acc-sort');

const detailDialog = document.getElementById('accessory-detail-dialog');
const detailMetaEl = document.getElementById('detail-dialog-meta');
const detailTitleEl = document.getElementById('detail-dialog-title');
const detailMediaEl = document.getElementById('detail-media');
const detailImgWebpEl = document.getElementById('detail-img-webp');
const detailImgJpgEl = document.getElementById('detail-img-jpg');
const detailPriceEl = document.getElementById('detail-price');
const detailCompatEl = document.getElementById('detail-compat');
const detailHookEl = document.getElementById('detail-hook');
const detailFeaturesEl = document.getElementById('detail-features');
const detailSpecBodyEl = detailDialog?.querySelector('#detail-spec-table tbody');
const detailAddBtn = document.getElementById('detail-add-btn');
const detailOpenKitBtn = document.getElementById('detail-open-kit-btn');

const kitDrawer = document.getElementById('kit-drawer');
const kitSubtitleEl = document.getElementById('kit-drawer-subtitle');
const kitItemsEl = document.getElementById('kit-drawer-items');
const kitBundleBannerEl = document.getElementById('kit-bundle-banner');
const kitTotalQtyEl = document.getElementById('kit-total-qty');
const kitSubtotalEl = document.getElementById('kit-subtotal');
const kitSavingsRowEl = document.getElementById('kit-savings-row');
const kitSavingsLabelEl = document.getElementById('kit-savings-label');
const kitSavingsEl = document.getElementById('kit-savings');
const kitTotalEl = document.getElementById('kit-total');
const copyManifestBtn = document.getElementById('copy-manifest-btn');
const clearKitBtn = document.getElementById('clear-kit-btn');

// ============================================================================
// Utilities & Persistence
// ============================================================================

function toWebpPath(imagePath) {
  return String(imagePath || '').replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

function formatUsd(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function isMakerPrintable(item) {
  return Number.parseInt(item.num, 10) >= 16 || item.compat.includes('3D-Printable');
}

function loadKit() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const merged = new Map();
    for (const entry of parsed) {
      const id = entry && typeof entry === 'object' ? entry.id : null;
      const canonical = id ? ITEM_BY_ID.get(id) : null;
      if (!canonical) continue;
      const qty = Math.max(1, Math.min(99, Number.parseInt(entry.qty, 10) || 1));
      merged.set(id, { id, qty: (merged.get(id)?.qty || 0) + qty });
    }
    return [...merged.values()];
  } catch {
    return [];
  }
}

function saveKit() {
  try {
    const payload = state.kit
      .map((entry) => {
        const item = ITEM_BY_ID.get(entry.id);
        if (!item) return null;
        return {
          id: item.id,
          num: item.num,
          name: item.name,
          category: item.category,
          price: item.price,
          image: item.image,
          qty: entry.qty
        };
      })
      .filter(Boolean);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors in private browsing modes
  }
}

function getKitQty(id) {
  return state.kit.find((entry) => entry.id === id)?.qty || 0;
}

function calculateKitTotals() {
  let totalQty = 0;
  let subtotal = 0;

  for (const entry of state.kit) {
    const item = ITEM_BY_ID.get(entry.id);
    if (!item) continue;
    totalQty += entry.qty;
    subtotal += item.price * entry.qty;
  }

  let discountRate = 0;
  let bannerText = 'Add 2 modules for 10% off \u00B7 3 for 15% \u00B7 4+ for 20%';

  if (totalQty === 1) {
    bannerText = 'Add 1 more module to unlock 10% kit savings.';
  } else if (totalQty === 2) {
    discountRate = 0.10;
    bannerText = '10% bundle savings applied (2 modules). Add 1 more for 15%.';
  } else if (totalQty === 3) {
    discountRate = 0.15;
    bannerText = '15% bundle savings applied (3 modules). Add 1 more for 20%.';
  } else if (totalQty >= 4) {
    discountRate = 0.20;
    bannerText = `20% expedition bundle savings applied (${totalQty} modules).`;
  }

  const savings = subtotal * discountRate;
  const total = subtotal - savings;

  return { totalQty, subtotal, discountRate, savings, total, bannerText };
}

// ============================================================================
// Category Tab Sliding Indicator (Transform FLIP, Zero Layout Thrash)
// ============================================================================

let lastIndicatorRect = null;

function updateTabIndicator({ instant = false } = {}) {
  if (!tabListEl || !tabIndicatorEl) return;
  const activeTab = tabButtons.find((btn) => btn.getAttribute('aria-pressed') === 'true');
  if (!activeTab) return;

  const nextRect = {
    x: activeTab.offsetLeft,
    w: activeTab.offsetWidth
  };

  if (!nextRect.w) return;

  const shouldJump = instant || reducedMotion() || !lastIndicatorRect;
  if (shouldJump) {
    tabIndicatorEl.classList.add('is-jump');
    tabIndicatorEl.style.setProperty('--ind-w', `${nextRect.w}px`);
    tabIndicatorEl.style.setProperty('--ind-x', `${nextRect.x}px`);
    tabIndicatorEl.style.setProperty('--ind-sx', '1');
    tabIndicatorEl.getBoundingClientRect();
    tabIndicatorEl.classList.remove('is-jump');
  } else {
    const startScaleX = lastIndicatorRect.w / nextRect.w;
    tabIndicatorEl.classList.add('is-jump');
    tabIndicatorEl.style.setProperty('--ind-w', `${nextRect.w}px`);
    tabIndicatorEl.style.setProperty('--ind-x', `${lastIndicatorRect.x}px`);
    tabIndicatorEl.style.setProperty('--ind-sx', String(startScaleX));
    tabIndicatorEl.getBoundingClientRect();
    tabIndicatorEl.classList.remove('is-jump');
    tabIndicatorEl.style.setProperty('--ind-x', `${nextRect.x}px`);
    tabIndicatorEl.style.setProperty('--ind-sx', '1');
  }

  lastIndicatorRect = nextRect;
}

function setActiveCategory(category, { scrollTab = false, focusTab = false } = {}) {
  const normalized = CATEGORY_LABELS[category] ? category : 'all';
  state.category = normalized;

  let activeBtn = null;
  for (const btn of tabButtons) {
    const isMatch = btn.dataset.category === normalized;
    btn.setAttribute('aria-pressed', String(isMatch));
    if (isMatch) activeBtn = btn;
  }

  if (activeBtn) {
    if (scrollTab) {
      activeBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    if (focusTab) {
      activeBtn.focus();
    }
  }

  updateTabIndicator();
  renderCatalog();
}

// ============================================================================
// Filtering, Sorting & Grid Rendering
// ============================================================================

function getFilteredAccessories() {
  const query = state.search.trim().toLowerCase();

  const filtered = ACCESSORIES_DATA.filter((item) => {
    if (state.category !== 'all' && item.category !== state.category) {
      return false;
    }
    if (!query) return true;

    const categoryName = (CATEGORY_LABELS[item.category] || item.category).toLowerCase();
    const haystack = [
      item.num,
      `#${item.num}`,
      item.name,
      item.hook,
      item.compat,
      categoryName,
      ...(item.features || [])
    ].join(' ').toLowerCase();

    return haystack.includes(query);
  });

  filtered.sort((a, b) => {
    const numDiff = Number.parseInt(a.num, 10) - Number.parseInt(b.num, 10);
    if (state.sort === 'price-asc') return a.price - b.price || numDiff;
    if (state.sort === 'price-desc') return b.price - a.price || numDiff;
    return numDiff;
  });

  return filtered;
}

function createPictureElement(item, imgClassName) {
  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.srcset = toWebpPath(item.image);
  source.type = 'image/webp';

  const img = document.createElement('img');
  img.src = item.image;
  img.alt = `${item.name} — 24-inch King of Koolers modular accessory`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className = imgClassName;

  picture.append(source, img);
  return picture;
}

function createCardElement(item) {
  const card = document.createElement('article');
  card.className = 'acc-card';
  card.id = item.id;
  card.dataset.category = item.category;

  const isContain = CONTAIN_IMAGE_IDS.has(item.id);

  // Image button opens the Spec Inspector dialog
  const mediaBtn = document.createElement('button');
  mediaBtn.type = 'button';
  mediaBtn.className = isContain ? 'acc-card__media-btn acc-card__media-btn--contain' : 'acc-card__media-btn';
  mediaBtn.dataset.inspect = item.id;
  mediaBtn.setAttribute('aria-label', `Inspect specs for #${item.num} ${item.name}`);

  const mediaFrame = document.createElement('div');
  mediaFrame.className = 'acc-card__media';
  const imgClasses = isContain ? 'acc-card__img acc-card__img--contain' : 'acc-card__img';
  mediaFrame.appendChild(createPictureElement(item, imgClasses));
  mediaBtn.appendChild(mediaFrame);

  // Card body
  const body = document.createElement('div');
  body.className = 'acc-card__body';

  const meta = document.createElement('div');
  meta.className = 'acc-card__meta';

  const tags = document.createElement('div');
  tags.className = 'acc-card__tags';

  const numBadge = document.createElement('span');
  numBadge.className = 'acc-num';
  numBadge.textContent = `#${item.num}`;
  tags.appendChild(numBadge);

  const catTag = document.createElement('span');
  catTag.className = 'acc-cat';
  catTag.textContent = CATEGORY_LABELS[item.category] || item.category;
  tags.appendChild(catTag);

  if (isMakerPrintable(item)) {
    const makerTag = document.createElement('span');
    makerTag.className = 'acc-maker-tag';
    makerTag.textContent = '3D-Print';
    tags.appendChild(makerTag);
  }

  const price = document.createElement('span');
  price.className = 'acc-card__price';
  price.textContent = formatUsd(item.price);

  meta.append(tags, price);

  const title = document.createElement('h3');
  title.className = 'acc-card__title';
  title.textContent = item.name;

  const hook = document.createElement('p');
  hook.className = 'acc-card__hook';
  hook.textContent = item.hook;

  const compat = document.createElement('p');
  compat.className = 'acc-card__compat';
  compat.textContent = item.compat;

  const actions = document.createElement('div');
  actions.className = 'acc-card__actions';

  const inspectBtn = document.createElement('button');
  inspectBtn.type = 'button';
  inspectBtn.className = 'btn btn--secondary btn--sm v2-pressable acc-btn-inspect';
  inspectBtn.dataset.inspect = item.id;
  inspectBtn.textContent = 'Inspect specs';

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn--primary btn--sm v2-pressable acc-btn-add';
  addBtn.dataset.add = item.id;
  applyAddButtonState(addBtn, getKitQty(item.id));

  actions.append(inspectBtn, addBtn);
  body.append(meta, title, hook, compat, actions);
  card.append(mediaBtn, body);

  return card;
}

function applyAddButtonState(button, qty) {
  if (!button) return;
  if (qty > 0) {
    button.classList.add('is-in-kit');
    button.textContent = `In kit (${qty}) \u00B7 +1`;
  } else {
    button.classList.remove('is-in-kit');
    button.textContent = 'Add to kit';
  }
}

function syncAllAddButtons() {
  if (gridEl) {
    gridEl.querySelectorAll('.acc-btn-add[data-add]').forEach((btn) => {
      applyAddButtonState(btn, getKitQty(btn.dataset.add));
    });
  }
  if (state.activeDetailId && detailAddBtn) {
    const qty = getKitQty(state.activeDetailId);
    applyAddButtonState(detailAddBtn, qty);
  }
}

function renderCatalog() {
  if (!gridEl) return;
  const items = getFilteredAccessories();
  const frag = document.createDocumentFragment();

  for (const item of items) {
    frag.appendChild(createCardElement(item));
  }

  gridEl.replaceChildren(frag);

  if (countEl) {
    countEl.textContent = `Showing ${items.length} of ${ACCESSORIES_DATA.length} accessories`;
  }

  if (emptyEl && emptyMsgEl) {
    const isEmpty = items.length === 0;
    emptyEl.hidden = !isEmpty;
    gridEl.hidden = isEmpty;
    if (isEmpty) {
      const catLabel = CATEGORY_LABELS[state.category] || state.category;
      const trimmed = state.search.trim();
      emptyMsgEl.textContent = trimmed
        ? `No ${state.category === 'all' ? '' : `${catLabel} `}accessories matched "${trimmed}".`
        : `No accessories found in ${catLabel}.`;
    }
  }
}

// ============================================================================
// Kit Builder State & Drawer UI
// ============================================================================

function addToKit(id) {
  const item = ITEM_BY_ID.get(id);
  if (!item) return;

  const existing = state.kit.find((entry) => entry.id === id);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + 1);
  } else {
    state.kit.push({ id, qty: 1 });
  }

  saveKit();
  renderKitUI();
  syncAllAddButtons();

  const qty = getKitQty(id);
  showToast(`Added #${item.num} ${item.name} (${qty} in kit)`);
}

function setKitItemQty(id, delta) {
  const idx = state.kit.findIndex((entry) => entry.id === id);
  if (idx === -1) return;

  const nextQty = state.kit[idx].qty + delta;
  if (nextQty <= 0) {
    removeKitItem(id);
    return;
  }

  state.kit[idx].qty = Math.min(99, nextQty);
  saveKit();
  renderKitUI();
  syncAllAddButtons();
}

function removeKitItem(id) {
  const item = ITEM_BY_ID.get(id);
  state.kit = state.kit.filter((entry) => entry.id !== id);
  saveKit();
  renderKitUI();
  syncAllAddButtons();
  if (item) {
    showToast(`Removed #${item.num} ${item.name} from kit`);
  }
}

function clearKit() {
  if (state.kit.length === 0) return;
  state.kit = [];
  saveKit();
  renderKitUI();
  syncAllAddButtons();
  showToast('Outfitting kit cleared');
}

function renderKitUI() {
  const totals = calculateKitTotals();

  document.querySelectorAll('[data-kit-count]').forEach((el) => {
    el.textContent = String(totals.totalQty);
  });

  if (kitSubtitleEl) {
    kitSubtitleEl.textContent = totals.totalQty === 1
      ? '1 accessory selected'
      : `${totals.totalQty} accessories selected`;
  }

  if (kitItemsEl) {
    if (state.kit.length === 0) {
      const emptyBox = document.createElement('div');
      emptyBox.className = 'kit-empty';

      const emptyTitle = document.createElement('h3');
      emptyTitle.textContent = 'Your outfitting kit is empty';

      const emptyCopy = document.createElement('p');
      emptyCopy.textContent = 'Add modular lids, thermal discs, wagon dollies, or 3D-printable picnic kits to calculate bundle pricing.';

      const browseBtn = document.createElement('button');
      browseBtn.type = 'button';
      browseBtn.className = 'btn btn--secondary btn--sm v2-pressable';
      browseBtn.textContent = 'Browse all 31 accessories';
      browseBtn.addEventListener('click', () => closeTopLayer(kitDrawer));

      emptyBox.append(emptyTitle, emptyCopy, browseBtn);
      kitItemsEl.replaceChildren(emptyBox);
    } else {
      const frag = document.createDocumentFragment();
      for (const entry of state.kit) {
        const item = ITEM_BY_ID.get(entry.id);
        if (!item) continue;

        const row = document.createElement('article');
        row.className = 'kit-item';
        row.dataset.id = item.id;

        const media = document.createElement('div');
        media.className = CONTAIN_IMAGE_IDS.has(item.id)
          ? 'kit-item__media kit-item__media--contain'
          : 'kit-item__media';
        media.appendChild(createPictureElement(item, ''));

        const info = document.createElement('div');
        info.className = 'kit-item__info';

        const top = document.createElement('div');
        top.className = 'kit-item__top';

        const name = document.createElement('h3');
        name.className = 'kit-item__name';
        const numSpan = document.createElement('span');
        numSpan.className = 'kit-item__num';
        numSpan.textContent = `#${item.num}`;
        name.append(numSpan, document.createTextNode(item.name));

        const linePrice = document.createElement('span');
        linePrice.className = 'kit-item__price';
        linePrice.textContent = formatUsd(item.price * entry.qty);

        top.append(name, linePrice);

        const controls = document.createElement('div');
        controls.className = 'kit-item__controls';

        const stepper = document.createElement('div');
        stepper.className = 'kit-stepper';

        const decBtn = document.createElement('button');
        decBtn.type = 'button';
        decBtn.className = 'kit-stepper__btn v2-pressable';
        decBtn.dataset.kitDec = item.id;
        decBtn.setAttribute('aria-label', `Decrease quantity of ${item.name}`);
        decBtn.textContent = '\u2212';

        const qtySpan = document.createElement('span');
        qtySpan.className = 'kit-stepper__qty';
        qtySpan.textContent = String(entry.qty);
        qtySpan.setAttribute('aria-label', `Quantity ${entry.qty}`);

        const incBtn = document.createElement('button');
        incBtn.type = 'button';
        incBtn.className = 'kit-stepper__btn v2-pressable';
        incBtn.dataset.kitInc = item.id;
        incBtn.setAttribute('aria-label', `Increase quantity of ${item.name}`);
        incBtn.textContent = '+';

        stepper.append(decBtn, qtySpan, incBtn);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'kit-remove-btn';
        removeBtn.dataset.kitRemove = item.id;
        removeBtn.setAttribute('aria-label', `Remove ${item.name}`);
        removeBtn.textContent = 'Remove';

        controls.append(stepper, removeBtn);
        info.append(top, controls);
        row.append(media, info);
        frag.appendChild(row);
      }
      kitItemsEl.replaceChildren(frag);
    }
  }

  if (kitBundleBannerEl) kitBundleBannerEl.textContent = totals.bannerText;
  if (kitTotalQtyEl) kitTotalQtyEl.textContent = String(totals.totalQty);
  if (kitSubtotalEl) kitSubtotalEl.textContent = formatUsd(totals.subtotal);
  if (kitTotalEl) kitTotalEl.textContent = formatUsd(totals.total);

  if (kitSavingsRowEl && kitSavingsLabelEl && kitSavingsEl) {
    if (totals.savings > 0) {
      kitSavingsRowEl.hidden = false;
      kitSavingsLabelEl.textContent = `Bundle savings (${Math.round(totals.discountRate * 100)}%)`;
      kitSavingsEl.textContent = `-${formatUsd(totals.savings)}`;
    } else {
      kitSavingsRowEl.hidden = true;
    }
  }

  if (clearKitBtn) {
    clearKitBtn.hidden = state.kit.length === 0;
  }
}

async function copyKitManifest() {
  if (state.kit.length === 0) {
    showToast('Add at least one accessory to copy a kit manifest');
    return;
  }

  const totals = calculateKitTotals();
  const lines = [
    'KING OF KOOLERS — MODULAR OUTFITTING MANIFEST',
    '=================================================='
  ];

  for (const entry of state.kit) {
    const item = ITEM_BY_ID.get(entry.id);
    if (!item) continue;
    lines.push(`${entry.qty}x  #${item.num}  ${item.name} — ${formatUsd(item.price * entry.qty)}`);
  }

  lines.push('--------------------------------------------------');
  lines.push(`Total modules: ${totals.totalQty}`);
  lines.push(`Subtotal:      ${formatUsd(totals.subtotal)}`);
  if (totals.savings > 0) {
    lines.push(`Bundle (${Math.round(totals.discountRate * 100)}%): -${formatUsd(totals.savings)}`);
  }
  lines.push(`Kit total:     ${formatUsd(totals.total)}`);
  lines.push('Fitment:       24.0" OD 20-Helix Twist-Lock System');

  const text = lines.join('\n');

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error('Clipboard API unavailable');
    }
    showToast('Kit manifest copied to clipboard');
  } catch {
    const host = kitDrawer?.open ? kitDrawer : document.body;
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;';
    host.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    showToast(ok ? 'Kit manifest copied to clipboard' : 'Could not access clipboard');
  }
}

// ============================================================================
// Spec Inspector Modal (#accessory-detail-dialog)
// ============================================================================

function openDetailDialog(id) {
  const item = ITEM_BY_ID.get(id);
  if (!item || !detailDialog) return;

  state.activeDetailId = item.id;
  const catLabel = CATEGORY_LABELS[item.category] || item.category;

  if (detailMetaEl) {
    detailMetaEl.textContent = `#${item.num} \u00B7 ${catLabel}${isMakerPrintable(item) ? ' \u00B7 3D-Printable Pack Included' : ''}`;
  }
  if (detailTitleEl) detailTitleEl.textContent = item.name;
  if (detailImgWebpEl) detailImgWebpEl.srcset = toWebpPath(item.image);
  if (detailImgJpgEl) {
    detailImgJpgEl.src = item.image;
    detailImgJpgEl.alt = `${item.name} technical overview`;
  }
  if (detailMediaEl) {
    detailMediaEl.dataset.fit = CONTAIN_IMAGE_IDS.has(item.id) ? 'contain' : 'studio';
  }
  if (detailPriceEl) detailPriceEl.textContent = formatUsd(item.price);
  if (detailCompatEl) detailCompatEl.textContent = `Fitment: ${item.compat}`;
  if (detailHookEl) detailHookEl.textContent = item.hook;

  if (detailFeaturesEl) {
    const frag = document.createDocumentFragment();
    for (const feature of item.features || []) {
      const li = document.createElement('li');
      li.textContent = feature;
      frag.appendChild(li);
    }
    detailFeaturesEl.replaceChildren(frag);
  }

  if (detailSpecBodyEl) {
    const frag = document.createDocumentFragment();
    for (const [key, val] of Object.entries(item.specs || {})) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = key;
      const td = document.createElement('td');
      td.textContent = String(val);
      tr.append(th, td);
      frag.appendChild(tr);
    }
    detailSpecBodyEl.replaceChildren(frag);
  }

  applyAddButtonState(detailAddBtn, getKitQty(item.id));

  if (!detailDialog.open) {
    detailDialog.showModal();
  }
}

function closeOpenMobileNav() {
  const nav = document.querySelector('.nav.is-open');
  if (!nav) return;
  nav.classList.remove('is-open');
  document.body.classList.remove('nav-locked');
  const toggle = nav.querySelector('.nav__toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

// ============================================================================
// Event Wiring & Initialization
// ============================================================================

function initEvents() {
  // Category tabs click & keyboard navigation
  if (tabListEl) {
    tabListEl.addEventListener('click', (event) => {
      const tab = event.target.closest('.cat-tab');
      if (!tab) return;
      setActiveCategory(tab.dataset.category, { scrollTab: true });
    });

    tabListEl.addEventListener('keydown', (event) => {
      const current = event.target.closest('.cat-tab');
      if (!current) return;
      const idx = tabButtons.indexOf(current);
      if (idx === -1) return;

      let nextIdx = null;
      if (event.key === 'ArrowRight') nextIdx = (idx + 1) % tabButtons.length;
      else if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + tabButtons.length) % tabButtons.length;
      else if (event.key === 'Home') nextIdx = 0;
      else if (event.key === 'End') nextIdx = tabButtons.length - 1;

      if (nextIdx === null) return;
      event.preventDefault();
      setActiveCategory(tabButtons[nextIdx].dataset.category, { scrollTab: true, focusTab: true });
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(() => updateTabIndicator({ instant: true })).observe(tabListEl);
    }
    document.fonts?.ready.then(() => updateTabIndicator({ instant: true }));
  }

  // Search input & clear button
  searchInput?.addEventListener('input', () => {
    state.search = searchInput.value;
    if (searchClearBtn) searchClearBtn.hidden = state.search.length === 0;
    renderCatalog();
  });

  searchClearBtn?.addEventListener('click', () => {
    if (!searchInput) return;
    searchInput.value = '';
    state.search = '';
    searchClearBtn.hidden = true;
    renderCatalog();
    searchInput.focus();
  });

  // Sort select
  sortSelect?.addEventListener('change', () => {
    state.sort = sortSelect.value;
    renderCatalog();
  });

  // Empty-state reset button
  resetFiltersBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.hidden = true;
    if (sortSelect) sortSelect.value = 'num-asc';
    state.search = '';
    state.sort = 'num-asc';
    setActiveCategory('all');
  });

  // Catalog grid click delegation
  gridEl?.addEventListener('click', (event) => {
    const addBtn = event.target.closest('[data-add]');
    if (addBtn) {
      addToKit(addBtn.dataset.add);
      return;
    }

    const inspectTrigger = event.target.closest('[data-inspect]');
    if (inspectTrigger) {
      openDetailDialog(inspectTrigger.dataset.inspect);
    }
  });

  // Detail modal actions
  detailAddBtn?.addEventListener('click', () => {
    if (state.activeDetailId) addToKit(state.activeDetailId);
  });

  detailOpenKitBtn?.addEventListener('click', async () => {
    await closeTopLayer(detailDialog);
    if (kitDrawer && !kitDrawer.open) {
      kitDrawer.showModal();
    }
  });

  detailDialog?.addEventListener('close', () => {
    state.activeDetailId = null;
  });

  // Kit drawer item controls
  kitItemsEl?.addEventListener('click', (event) => {
    const incBtn = event.target.closest('[data-kit-inc]');
    if (incBtn) {
      setKitItemQty(incBtn.dataset.kitInc, 1);
      return;
    }

    const decBtn = event.target.closest('[data-kit-dec]');
    if (decBtn) {
      setKitItemQty(decBtn.dataset.kitDec, -1);
      return;
    }

    const removeBtn = event.target.closest('[data-kit-remove]');
    if (removeBtn) {
      removeKitItem(removeBtn.dataset.kitRemove);
    }
  });

  copyManifestBtn?.addEventListener('click', copyKitManifest);
  clearKitBtn?.addEventListener('click', clearKit);

  // Close mobile nav drawer when Kit trigger is tapped inside it
  document.querySelectorAll('[commandfor="kit-drawer"]').forEach((btn) => {
    btn.addEventListener('click', () => closeOpenMobileNav());
  });

  // Footer category filter shortcuts
  document.querySelectorAll('footer [data-filter]').forEach((link) => {
    link.addEventListener('click', () => {
      const cat = link.dataset.filter;
      if (cat) setActiveCategory(cat, { scrollTab: true });
    });
  });

  // Sync storage across browser tabs
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    state.kit = loadKit();
    renderKitUI();
    syncAllAddButtons();
  });
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if (cat && CATEGORY_LABELS[cat]) {
    state.category = cat;
    tabButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.category === cat)));
  }
  const inspectId = params.get('inspect');
  if (inspectId && ITEM_BY_ID.has(inspectId)) {
    requestAnimationFrame(() => openDetailDialog(inspectId));
  }
}

function boot() {
  applyUrlParams();
  renderCatalog();
  renderKitUI();
  initEvents();
  requestAnimationFrame(() => updateTabIndicator({ instant: true }));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
