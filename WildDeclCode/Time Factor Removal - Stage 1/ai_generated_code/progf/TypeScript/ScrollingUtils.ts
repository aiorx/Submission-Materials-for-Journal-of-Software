// Utilities Crafted with standard coding tools on August 28, 2025

var type = require('./PaneLike.js').type;
var PaneLike = require('./PaneLike.js').PaneLike;
var FreLogger = require('@freon4dsl/core').FreLogger;
var isNullOrUndefined = require('@freon4dsl/core').isNullOrUndefined;
var notNullOrUndefined = require('@freon4dsl/core').notNullOrUndefined;

// Treat these as scrollable values (Safari still uses 'overlay' in places)
var SCROLLABLE_VALUES = new Set(["auto", "scroll", "overlay"]);
var LOGGER = new FreLogger('ScrollingUtils');

function isScrollable(el: HTMLElement): boolean {
	var cs: CSSStyleDeclaration = getComputedStyle(el);
	var canScrollY: boolean = SCROLLABLE_VALUES.has(cs.overflowY);
	var canScrollX: boolean = SCROLLABLE_VALUES.has(cs.overflowX);
	var hasY: boolean = el.scrollHeight > el.clientHeight;
	var hasX: boolean = el.scrollWidth > el.clientWidth;
	return (canScrollY && hasY) || (canScrollX && hasX);
}

/** Walk up from `start` to find the nearest scrollable ancestor. Handles Shadow DOM. */
function getNearestScrollContainer(start: HTMLElement | undefined): HTMLElement | null {
	// LOGGER.log('getNearestScrollContainer', start?.id);
	var node: Node | undefined = start;
	while (notNullOrUndefined(node)) {
		if (node instanceof HTMLElement) {
			// LOGGER.log('getNearestScrollContainer', node? 'id:'+node.id : '<no-id>', 'testing scrollability', isScrollable(node));
			if (isScrollable(node)) return node;
			// Stop if we reach the viewport scroller
			if (node === document.body || node === document.documentElement) {
				return ((document.scrollingElement as HTMLElement) != null ? (document.scrollingElement as HTMLElement) : document.documentElement);
			}
		}
		// climb regular DOM
		var parentEl: HTMLElement | null = (node as HTMLElement).parentElement;
		if (parentEl) {
			node = parentEl;
			continue;
		}
		// climb out of Shadow DOM, if any
		var root: Node = ((node as HTMLElement).getRootNode == null ? undefined : (node as HTMLElement).getRootNode());
		if (root && (root as ShadowRoot).host) {
			node = (root as ShadowRoot).host;
			continue;
		}
		node = undefined;
	}
	// Fallback: viewport scroller
	return ((document.scrollingElement as HTMLElement) != null ? (document.scrollingElement as HTMLElement) : document.documentElement);
}

var EPS = 0.5; // deal with fractional pixels

export async function focusAndScrollIntoView(
	element: HTMLElement | null | undefined,
	pane?: PaneLike | null | undefined
) {
	if (isNullOrUndefined(element) || isNullOrUndefined(pane)) return;

	// Focus without browser auto-scrolling
	element.focus({ preventScroll: true });

	// Get the pane’s parent that is a scroll container, if there is one
	var sc: HTMLElement | null = pane.getScrollContainer();
	if (isNullOrUndefined(sc)) return;

	// If container can't scroll, bail early (no-op)
	var canScroll: boolean = sc.scrollHeight > sc.clientHeight || sc.scrollWidth > sc.clientWidth;
	if (!canScroll) return;

	// Get the data from the element that needs to be focused, and from the scroll container.
	var elRect: DOMRect = element.getBoundingClientRect();
	var scRect: DOMRect = sc.getBoundingClientRect();
	var paneHeight: number = sc.clientHeight;

	// LOGGER.log('focusAndScrollIntoView, sc', sc.id, sc.scrollTop, sc.clientHeight);
	// LOGGER.log('focusAndScrollIntoView, elRect', elRect.top, elRect.bottom, elRect.height);
	// LOGGER.log('focusAndScrollIntoView, scRect', scRect.top, scRect.bottom, scRect.height);

	// See if the element fits within the scroll container
	var fits: boolean = elRect.height <= paneHeight + EPS;
	// See if the element is already fully visible within the scroll container
	var fullyVisible: boolean = elRect.bottom <= scRect.top + paneHeight;

    LOGGER.log("focusAndScrollIntoView fits: " + (fits) + " fullyVisible: " + (fullyVisible) + " calc: " + (elRect.bottom) + " <= " + (scRect.top + paneHeight) + "")
	if (fits && fullyVisible) return;

	// Compute minimal scroll in the container's coordinate system
	var offsetTop: number = elRect.top - scRect.top + sc.scrollTop;
	var offsetBottom: number = elRect.bottom + sc.scrollTop;

    LOGGER.log("A: " + (scRect.top) + ", B: " + (sc.clientHeight) + ", C: " + (sc.scrollTop) + ", D: " + (elRect.top) + ", E: " + (elRect.bottom) + ", elRect.y: " + (elRect.y) + "")
	if (fits) {
		// LOGGER.log('focusAndScrollIntoView, fits, scrolling...', offsetBottom);
		// Bring entire element into view by aligning its bottom if needed
		sc.scrollTo({ top: Math.max(0, offsetBottom - paneHeight), behavior: "smooth" });
		// sc.scrollTo({ top: offsetBottom, behavior: "smooth" });
		return;
	}

	// Taller than visible area → align top if it’s outside the viewport of the pane
	var topInView: boolean = elRect.top >= scRect.top - EPS && elRect.top <= scRect.bottom + EPS;
	if (!topInView) {
        LOGGER.log('focusAndScrollIntoView, scrolling...');
		sc.scrollTo({ top: Math.max(0, offsetTop), behavior: "smooth" });
	} else {
        LOGGER.log("focusAndScrollIntoView, topInView " + (topInView) + "");
	}
}
