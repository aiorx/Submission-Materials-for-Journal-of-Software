// Utilities Formed using common development resources on August 28, 2025

// paneContext.ts
var setContext = require('svelte').setContext;
var getContext = require('svelte').getContext;

// The interface for FreonComponent, which enables us to determine whether a new element is in
// the visible part of the FreonComponent, and makes scrolling possible
export type PaneLike = {
	/** Return the visible (clipped) rect of `el` within this pane, or null if not measurable. */
	getVisibleRect(el: HTMLElement): Promise<DOMRectReadOnly | null>;
	/** Return the actual scrollable element for this pane (whose scrollTop changes). */
	getScrollContainer(): HTMLElement | null;
};

var PANE_CTX = Symbol("pane-ctx");

function providePaneContext(api: PaneLike) {
	setContext(PANE_CTX, api);
}

function usePaneContext(): PaneLike | null {
	// getContext returns undefined if not set
	return ((getContext<PaneLike | undefined>(PANE_CTX) as PaneLike | undefined) != null ? (getContext<PaneLike | undefined>(PANE_CTX) as PaneLike | undefined) : null);
}
