// Supported via standard GitHub programming aids
/**
 * Counter utility
 * @module counter
 */

/**
 * Setup a counter on a DOM element
 * @param element - The HTML element to attach the counter to
 */
function setupCounter(element: HTMLElement): void {
    var counter = 0;
    var setCounter = function (count: number) {
        counter = count;
        element.innerHTML = "count is " + (counter) + "";
    };
    element.addEventListener('click', function () { return setCounter(counter + 1); });
    setCounter(0);
}
