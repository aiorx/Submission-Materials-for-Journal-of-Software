// 📖 Dynamic Dictionary Tooltips Demo
// This script highlights words defined in a dictionary and shows their definitions in a tooltip when hovered or pressed.
// Composed with basic coding tools under the command of Prototypen
// https://prototypen.no

// Constants for class names and keys
var CONTAINER_CLASS_NAME = 'dictionary';
var WORD_CLASS_NAME = 'dictionary__word';
var TOOLTIP_CLASS_NAME = 'dictionary__word__definition'; 
var WORD_KEY = 'word';
var DEFINITION_KEY = 'description';
var API_SOURCE = 'https://axelferdinand.github.io/Dynamic-Dictionary-Tooltips/dictionary.json';

/**
 * Entry point of the script. This function locates text elements in the document,
 * checks them for dictionary words, and highlights them.
 * @param {Array} dictionaryEntries - List of dictionary words and their definitions.
 */
function main(dictionaryEntries) {
    var textElements = document.querySelectorAll("." + (CONTAINER_CLASS_NAME) + "");
    var regexPattern = createRegexPattern(dictionaryEntries);
    
    // Process each text-containing element to highlight matching words
    for (var element of textElements) {
        processNestedNodes(element, dictionaryEntries, regexPattern);
        
        // Dynamically highlight matching words in content added after initial processing
        element.addEventListener("mouseover", debounce(function (e) {
            if (e.target.nodeType === 3) {
                makeTargetable(e.target.parentNode, regexPattern, dictionaryEntries);
            }
        }, 250), true);
    }
}

/**
 * Recursively checks nodes for dictionary words and highlights them.
 * @param {Node} node - The current DOM node being inspected.
 * @param {Array} dictionaryEntries - List of dictionary words and their definitions.
 * @param {RegExp} regexPattern - The regex pattern for dictionary words.
 */
function processNestedNodes(node, dictionaryEntries, regexPattern) {
    if (node.nodeType === 3) {
        makeTargetable(node.parentNode, regexPattern, dictionaryEntries);
    } else if (node.childNodes && node.childNodes.length) {
        for (var child of node.childNodes) {
            processNestedNodes(child, dictionaryEntries, regexPattern);
        }
    }
}

/**
 * Creates a regex pattern for matching dictionary entries.
 * The function constructs a pattern that:
 * 1. Ensures that each dictionary word is captured as a whole word (i.e., not part of another word).
 * 2. Takes care of potential punctuation marks or quotes around the word.
 * 3. Combines all dictionary words into a single regex pattern using the "|" (or) operator.
 *
 * @param {Array} dictionaryEntries - List of dictionary words and their definitions.
 * @return {RegExp} - The compiled regex pattern which matches any of the dictionary words as whole words, 
 *                    while ignoring words when they are part of another word or surrounded by certain punctuation.
 */
function createRegexPattern(dictionaryEntries) {
    var words = dictionaryEntries.map(function entry {
        return `(?<![a-zA-Z-'“‘”’«'"])\\b${entry[WORD_KEY]}\\b(?![-a-zA-Z'“‘”’»"'])`;
    }).join("|");
    return new RegExp(words, 'ig');
}

/**
 * Processes a node's content, highlighting words that match the dictionary.
 * Also sets up tooltips for these words.
 * @param {Node} currentNode - The DOM node containing text to be processed.
 * @param {RegExp} regexPattern - The regex pattern for dictionary words.
 * @param {Array} dictionaryEntries - List of dictionary words and their definitions.
 */
function makeTargetable(currentNode, regexPattern, dictionaryEntries) {
    if (currentNode.nodeName === 'P' && !isDescendantOfAnchor(currentNode)) {
        // Extract all direct text nodes from the current node
        var textNodes = Array.from(currentNode.childNodes).filter(function node { return node.nodeType === 3; });

        // Process each text node to highlight matching words and set up tooltips
        textNodes.forEach(function textNode {
            var text = textNode.nodeValue;
            var matches = [...text.matchAll(regexPattern)];
            var fragment = document.createDocumentFragment();
            var lastIndex = 0;

            matches.forEach(match => {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));

				// Extract the matched word and find its dictionary definition
                var word = match[0];
                var dictionaryEntry = dictionaryEntries.find(entry => entry[WORD_KEY].toLowerCase() === word.toLowerCase());

				// Create the highlighted element and set up the tooltip
                var highlighted = document.createElement('span');
                highlighted.className = WORD_CLASS_NAME;
                highlighted.textContent = word;
                highlighted.dataset.title = dictionaryEntry[WORD_KEY];
                highlighted.dataset.description = encodeURIComponent(dictionaryEntry[DEFINITION_KEY]);
                highlighted.setAttribute('aria-haspopup', 'true');
                highlighted.setAttribute('aria-expanded', 'false');

                var tooltipSpan = document.createElement('span');
                tooltipSpan.className = TOOLTIP_CLASS_NAME;
                tooltipSpan.style.display = 'none';
                tooltipSpan.setAttribute('role', 'tooltip');
                tooltipSpan.setAttribute('aria-hidden', 'true');

                // Create an inner span for the tooltip content
                var innerContentSpan = document.createElement('span');
                innerContentSpan.textContent = decodeURIComponent(dictionaryEntry[DEFINITION_KEY]);
                tooltipSpan.appendChild(innerContentSpan);

                highlighted.appendChild(tooltipSpan);
                highlighted.addEventListener("mouseover", () => {
                    tooltipSpan.style.display = 'block';
                    highlighted.setAttribute('aria-expanded', 'true');
                    tooltipSpan.setAttribute('aria-hidden', 'false');
                });
                highlighted.addEventListener("mouseout", () => {
                    tooltipSpan.style.display = 'none';
                    highlighted.setAttribute('aria-expanded', 'false');
                    tooltipSpan.setAttribute('aria-hidden', 'true');
                });

                fragment.appendChild(highlighted);
                lastIndex = match.index + word.length;
            });

            // Append any remaining non-matching text
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            currentNode.replaceChild(fragment, textNode);
        });
    }
}

/**
 * Checks if a node is a descendant of an anchor tag.
 * @param {Node} node - The DOM node to be checked.
 * @return {boolean} - True if the node is a descendant of an anchor, otherwise false.
 */
function isDescendantOfAnchor(node) {
    while (node !== null) {
        if (node.nodeName === 'A') {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * Utility function to debounce function calls.
 * This ensures the function doesn't execute too frequently.
 * @param {function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @return {function} - The debounced function.
 */
function debounce(func, delay) {
    var timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(function () { return func.apply(this, args); }, delay);
    };
}

// Fetch dictionary entries from the API and process them on document load
(function () {
    fetch(API_SOURCE)
        .then(function response {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function data {
            main(data);
        })
        .catch(function error {
            console.error('There has been a problem with your fetch operation: ', error);
        });
})();