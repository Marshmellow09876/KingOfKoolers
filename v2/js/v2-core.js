// King of Koolers V2 — Shared Top-Layer Dialog Lifecycle, Light-Dismiss Fallback & Toast System

let supportsDisplayTransitionCache;

/**
 * Runtime probe to verify whether CSS discrete display transition truly keeps
 * an element visible during exit (handles Firefox bug 1882408).
 */
export function canTransitionDisplay() {
  if (supportsDisplayTransitionCache !== undefined) return supportsDisplayTransitionCache;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransitionCache = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransitionCache;
}

export function supportsTopLayerExit() {
  return Boolean(window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay());
}

/**
 * Closes a native <dialog> smoothly using overlay + allow-discrete when supported,
 * or falls back to data-closing + getAnimations() for Firefox/Safari.
 */
export async function closeTopLayer(dialog) {
  if (!dialog || !dialog.open) return;
  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((resolve) => setTimeout(resolve, 600))
      ]);
    }
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }
  dialog.close();
}

/**
 * Enhances a native <dialog> with:
 * - pointerdown/pointerup bounding-box light-dismiss fallback when `closedBy` isn't supported
 * - smooth exit animation interception on `cancel` and `[data-dialog-close]` buttons
 * - `dialog.returnValue = ''` reset on `close`
 */
export function enhanceDialog(dialog) {
  if (!dialog || dialog.dataset.v2DialogInit) return;
  dialog.dataset.v2DialogInit = '1';

  // Intercept native cancel (Esc / closedby request) so exit animations play cleanly
  dialog.addEventListener('cancel', (event) => {
    if (!supportsTopLayerExit()) {
      event.preventDefault();
      closeTopLayer(dialog);
    }
  });

  // Reset returnValue so stale choices never leak on subsequent Esc/dismissals
  dialog.addEventListener('close', () => {
    dialog.removeAttribute('data-closing');
    dialog.returnValue = '';
  });

  // Wire explicit close controls inside the dialog
  dialog.querySelectorAll('[data-dialog-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeTopLayer(dialog));
  });

  // Fallback light-dismiss when closedby="any" is set on browsers lacking closedBy IDL
  if (!('closedBy' in HTMLDialogElement.prototype) && dialog.getAttribute('closedby') === 'any') {
    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = isOutside(e);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && isOutside(e)) {
        closeTopLayer(dialog);
      }
      pressedOutside = false;
    });
  }
}

export function initAllDialogs() {
  document.querySelectorAll('dialog').forEach(enhanceDialog);

  // Polyfill declarative command="show-modal" / commandfor when browser lacks Invoker Commands
  if (!('commandForElement' in HTMLButtonElement.prototype)) {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('button[command][commandfor]');
      if (!trigger) return;
      const target = document.getElementById(trigger.getAttribute('commandfor'));
      if (!(target instanceof HTMLDialogElement)) return;
      const cmd = trigger.getAttribute('command');
      if (cmd === 'show-modal' && !target.open) {
        target.showModal();
      } else if (cmd === 'close' || cmd === 'request-close') {
        closeTopLayer(target);
      }
    });
  }
}

// ==========================================================================
// Interruptible Sonner-style Toast Helper
// ==========================================================================

let toastRegion = null;

function ensureToastRegion() {
  if (toastRegion && document.body.contains(toastRegion)) return toastRegion;
  toastRegion = document.createElement('div');
  toastRegion.className = 'v2-toast-region';
  toastRegion.setAttribute('aria-live', 'polite');
  toastRegion.setAttribute('aria-atomic', 'false');
  document.body.appendChild(toastRegion);
  return toastRegion;
}

export function showToast(message, durationMs = 3200) {
  const region = ensureToastRegion();
  // Limit visible stack to 3 crisp toasts
  while (region.children.length >= 3) {
    region.firstElementChild?.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'v2-toast';
  const dot = document.createElement('span');
  dot.className = 'v2-toast__dot';
  dot.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(dot, text);
  region.appendChild(toast);

  let remaining = durationMs;
  let startTs = performance.now();
  let timerId = null;

  const dismiss = () => {
    if (toast.hasAttribute('data-leaving')) return;
    toast.setAttribute('data-leaving', '');
    setTimeout(() => toast.remove(), 300);
  };

  const startTimer = () => {
    if (remaining <= 0) {
      dismiss();
      return;
    }
    startTs = performance.now();
    timerId = setTimeout(dismiss, remaining);
  };

  const pauseTimer = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
      remaining -= performance.now() - startTs;
    }
  };

  toast.addEventListener('mouseenter', pauseTimer);
  toast.addEventListener('mouseleave', startTimer);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseTimer();
    else if (toast.isConnected && !toast.hasAttribute('data-leaving')) startTimer();
  });

  startTimer();
}

// Auto-initialize dialogs on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllDialogs, { once: true });
} else {
  initAllDialogs();
}
