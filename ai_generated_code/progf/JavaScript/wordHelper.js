// Supported via standard GitHub programming aids

/**
 * @description Loads the words.txt file and returns its content as an array
 * @returns {Promise<string[]>} Array of words from the dictionary
 */
async function loadDictionary() {
    try {
        console.log('Attempting to load dictionary from dic/words.txt');
        const response = await fetch('./dic/words.txt');
        const text = await response.text();
        // Split by newline and clean each word by trimming whitespace and \r
        const words = text.split('\n')
            .map(word => word.trim().replace(/\r$/, ''))
            .filter(word => word.length > 0);
        console.log('Dictionary contents after cleaning:', words); // Debug log
        return words;
    } catch (error) {
        console.error('Error loading dictionary:', error);
        return [];
    }
}

/**
 * @description Checks if a word can be formed using the given letters
 * @param {string} word - The word to check
 * @param {string} letters - The available letters (can include * as wildcard)
 * @returns {boolean} True if the word can be formed using the letters
 */
function canFormWord(word, letters) {
    const wordLower = word.toLowerCase().trim();
    const lettersLower = letters.toLowerCase();
    console.log(`Checking if '${wordLower}' can be formed from '${lettersLower}'`);

    const letterCount = {};
    let wildcardCount = 0;

    // Count available letters and wildcards
    for (const letter of lettersLower) {
        if (letter === '*') {
            wildcardCount++;
        } else {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
    }
    console.log('Letter counts:', letterCount, 'Wildcards:', wildcardCount);

    // Check if word can be formed
    for (const letter of wordLower) {
        if (!letterCount[letter]) {
            // If no letter available, try using a wildcard
            if (wildcardCount > 0) {
                wildcardCount--;
                console.log(`Using wildcard for letter '${letter}'`);
            } else {
                console.log(`Failed at letter '${letter}' - not enough count`);
                return false;
            }
        } else {
            letterCount[letter]--;
        }
    }

    console.log('Word can be formed!');
    return true;
}

/**
 * @description Finds all possible words that can be formed with given letters and pattern
 * @param {string[]} dictionary - Array of available words
 * @param {string} letters - The available letters
 * @param {string} pattern - Optional regex pattern to filter results
 * @returns {string[]} Array of matching words
 */
function findPossibleWords(dictionary, letters, pattern = '') {
    console.log(`Searching dictionary with letters: ${letters}, pattern: ${pattern}`);

    let results = dictionary.filter(word => canFormWord(word, letters));

    // Apply regex pattern if provided
    if (pattern) {
        try {
            const regex = new RegExp(pattern);
            results = results.filter(word => regex.test(word));
            console.log(`Filtered ${results.length} words matching pattern`);
        } catch (error) {
            console.error('Invalid regex pattern:', error);
            throw new Error('Invalid regex pattern');
        }
    }

    return results;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('letters');
    const patternInput = document.getElementById('pattern');
    const button = document.getElementById('findWords');
    const wordList = document.getElementById('wordList');
    const loadingStatus = document.getElementById('loadingStatus');
    let dictionary = [];

    // Update loading indicator
    const setLoading = (isLoading, message = 'Loading dictionary...') => {
        button.disabled = isLoading;
        button.textContent = isLoading ? 'Loading...' : 'Find Words';
        loadingStatus.textContent = message;
        loadingStatus.classList.toggle('active', isLoading);
    };

    // Load dictionary when page loads
    console.log('Loading dictionary...');
    setLoading(true);

    loadDictionary()
        .then(words => {
            dictionary = words;
            console.log(`Dictionary loaded with ${words.length} words`);
            setLoading(false);
        })
        .catch(error => {
            console.error('Failed to load dictionary:', error);
            wordList.innerHTML = '<div class="error">Failed to load dictionary</div>';
            setLoading(false, 'Failed to load dictionary');
        });

    /**
     * @description Performs the word search with current input values
     * @returns {void}
     */
    const performSearch = () => {
        try {
            // Set loading state before any operations
            setLoading(true, 'Searching words...');
            const letters = input.value.trim();
            const pattern = patternInput.value.trim();

            // Input validation checks with immediate loading state clear
            if (!letters) {
                setLoading(false);
                console.warn('No letters provided');
                alert('Please enter some letters');
                return;
            }

            const wildcardCount = (letters.match(/\*/g) || []).length;
            if (wildcardCount > 3) {
                setLoading(false);
                console.warn('Too many wildcards');
                alert('Maximum 3 wildcards (*) allowed');
                return;
            }

            if (dictionary.length === 0) {
                setLoading(false);
                console.error('Dictionary not loaded');
                alert('Dictionary not loaded yet, please try again');
                return;
            }

            // Validate regex pattern if provided
            if (pattern) {
                try {
                    new RegExp(pattern);
                } catch (error) {
                    setLoading(false);
                    console.error('Invalid regex pattern:', error);
                    alert('Invalid regex pattern');
                    return;
                }
            }

            // Perform the search
            console.log(`Finding words using letters: ${letters}, pattern: ${pattern}`);
            const possibleWords = findPossibleWords(dictionary, letters, pattern);
            console.log(`Found ${possibleWords.length} possible words`);

            // Update UI with results
            if (possibleWords.length === 0) {
                wordList.innerHTML = '<div class="no-results">No words found</div>';
            } else {
                wordList.innerHTML = possibleWords
                    .map(word => `<div class="word">${word}</div>`)
                    .join('');
            }

            // Clear loading state after everything is done
            setLoading(false);

        } catch (error) {
            // Handle errors and clear loading state
            console.error('Error processing request:', error);
            wordList.innerHTML = `<div class="error">
                ${error.message || 'An error occurred'}
            </div>`;
            setLoading(false, 'Search failed');
        }
    };

    // Add Enter key handlers
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch();
        }
    });

    patternInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch();
        }
    });

    // Update button click handler to use shared function
    button.addEventListener('click', performSearch);

    // Cleanup
    return () => {
        button.removeEventListener('click', performSearch);
        input.removeEventListener('keypress');
        patternInput.removeEventListener('keypress');
    };
});
