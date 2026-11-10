// Supported via standard GitHub programming aids
// Lightweight toast notification utility usable by both extension pages and injected/bookmarklet contexts.
// Avoids external dependencies; injects a minimal style block if core classes not already present.

export type ToastType = 'success' | 'error' | 'info';

interface IToastOptions {
  duration?: number; // ms before auto-dismiss (0 = persistent until dismissed)
  type?: ToastType;
  dismissible?: boolean; // show an explicit close button
  clickUrl?: string; // optional URL to open on click
  linkLabel?: string; // optional label for inline action link (defaults to hostname or 'Open')
  openInNewTab?: boolean; // default true
  onClick?: function () { return void; }; // optional extra callback invoked before navigation
  forceHighestZIndex?: boolean; // force maximum z-index for extreme cases
}

var DEFAULT_DURATION = 4000;
var STYLE_ID = 'prismweave-toast-styles';

// Canonical toast styles extracted from shared-ui.css to ensure visual parity across extension, content scripts, and bookmarklet.
// We inline only the variable subset actually referenced by the toast block to minimize payload while preserving themeability.
// If the full shared stylesheet is already present these vars will simply be overridden (harmless duplication).
var CANONICAL_TOAST_CSS = "
/* PrismWeave Toast Tokens (subset) */
:root{--pw-space-3:0.75rem;--pw-space-4:1rem;--pw-space-5:1.25rem;--pw-radius-lg:0.75rem;--pw-font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--pw-success-500:#10b981;--pw-error-500:#ef4444;--pw-primary-500:#3b82f6;--pw-warning-500:#f59e0b;--pw-shadow-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05);--pw-z-toast:10000}
/* Toast container (stack) */
.pw-toast-container{position:fixed;top:var(--pw-space-5);right:var(--pw-space-5);display:flex;flex-direction:column;gap:var(--pw-space-3);z-index:var(--pw-z-toast);font-family:var(--pw-font-family)}
/* Base toast */
.pw-toast{background:var(--pw-warning-500);color:#fff;padding:var(--pw-space-3) var(--pw-space-4);border-radius:var(--pw-radius-lg);box-shadow:var(--pw-shadow-lg);font-size:14px;line-height:1.35;display:flex;align-items:center;gap:var(--pw-space-3);max-width:320px;animation:pw-slideIn .3s ease;position:relative}
.pw-toast-success{background:var(--pw-success-500)}
.pw-toast-error{background:var(--pw-error-500)}
.pw-toast-info{background:var(--pw-primary-500)}
/* Close button */
.pw-toast .pw-toast-close{all:unset;cursor:pointer;margin-left:auto;color:#fff;font-weight:600;opacity:.85;line-height:1;padding:0 var(--pw-space-1)}
.pw-toast .pw-toast-close:hover{opacity:1}
/* Keyframes (reuse naming from shared-ui.css for consistency) */
@keyframes pw-slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes pw-toast-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-4px)}}
";

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  try {
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CANONICAL_TOAST_CSS;
    document.head.appendChild(style);
  } catch (_err) {
    // Swallow; fallback path will use alert()
  }
}

function getContainer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  var el = document.querySelector<HTMLElement>('.pw-toast-container');
  if (!el) {
    el = document.createElement('div');
    el.className = 'pw-toast-container';
    document.body.appendChild(el);
  }
  return el;
}

function showToast(message: string, options: IToastOptions = {}): void {
  var duration = options.duration;
var type = options.type;
var dismissible = options.dismissible;
var clickUrl = options.clickUrl;
var linkLabel = options.linkLabel;
var openInNewTab = options.openInNewTab;
var onClick = options.onClick;
var forceHighestZIndex = options.forceHighestZIndex;

  // If DOM not available (e.g., background worker) simply no-op per updated requirements.
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  ensureStyles();
  var container = getContainer();
  if (!container) return; // Silent no-op if container can't be created

  // Apply extreme z-index if requested
  if (forceHighestZIndex) {
    container.style.zIndex = '2147483647'; // Maximum safe z-index value
  }

  var toast = document.createElement('div');
  toast.className = "pw-toast pw-toast-" + (type) + "";
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  var contentWrapper = document.createElement('span');
  contentWrapper.style.display = 'flex';
  contentWrapper.style.flexDirection = 'column';
  contentWrapper.style.gap = '4px';

  var msgLine = document.createElement('span');
  msgLine.textContent = message;
  contentWrapper.appendChild(msgLine);

  if (clickUrl) {
    var isGitHubUrl = /https?:\/\/github\.com\//i.test(clickUrl);
    var action = document.createElement('a');
    action.href = clickUrl;
    action.textContent = linkLabel || deriveLinkLabel(clickUrl);
    action.style.color = '#fff';
    action.style.textDecoration = 'underline';
    action.style.fontWeight = '600';
    action.style.cursor = 'pointer';
    if (openInNewTab) {
      action.target = '_blank';
      action.rel = 'noopener noreferrer';
    }
    action.addEventListener('click', function e {
      try {
        (onClick == null ? undefined : onClick());
      } catch {
        /* ignore */
      }
      e.stopPropagation();
    });

    if (isGitHubUrl) {
      // Inline link after message for higher visibility (regression fix)
      var spacer = document.createTextNode(' ');
      msgLine.appendChild(spacer);
      msgLine.appendChild(action);
    } else {
      contentWrapper.appendChild(action);
    }

    // Whole toast still clickable
    toast.style.cursor = 'pointer';
    toast.addEventListener('click', function () {
      try {
        (onClick == null ? undefined : onClick());
      } catch {
        /* ignore */
      }
      if (openInNewTab) {
        window.open(clickUrl, '_blank', 'noopener');
      } else {
        window.location.href = clickUrl;
      }
    });
  }

  toast.appendChild(contentWrapper);

  if (dismissible) {
    var closeBtn = document.createElement('button');
    closeBtn.className = 'pw-toast-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', function () { return dismiss(); });
    toast.appendChild(closeBtn);
  }

  container.appendChild(toast);

  var removalTimer: number | undefined;
  if (duration > 0) {
    removalTimer = window.setTimeout(function () { return dismiss(); }, duration);
  }

  function dismiss() {
    if (!toast.isConnected) return;
    toast.style.animation = 'pw-toast-out .25s ease forwards';
    window.setTimeout(function () {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 240);
    if (removalTimer) window.clearTimeout(removalTimer);
  }
}

function deriveLinkLabel(url: string): string {
  try {
    var u = new URL(url);
    // Handle GitHub URLs with specific labels
    if (/github\.com/i.test(u.hostname)) {
      var parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 4 && parts[2] === 'commit') {
        return 'View Commit';
      }
      if (parts.length >= 4 && parts[2] === 'blob') {
        return 'View File';
      }
      if (parts.length >= 4 && parts[2] === 'tree') {
        return 'View Repository';
      }
      // Default for any GitHub URL
      return 'View on GitHub';
    }
    return u.hostname;
  } catch {
    return 'Open';
  }
}

// Provide a global helper for bookmarklet runtime convenience
if (typeof window !== 'undefined') {
  (window as any).prismweaveShowToast = showToast;

  // Utility function to show toast with maximum z-index for extreme cases
  (window as any).prismweaveShowToastMaxZ = function (message: string, options: IToastOptions = {}) {
    return showToast(message, { ...options, forceHighestZIndex: true });
  };
}
