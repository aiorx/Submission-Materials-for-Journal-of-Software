// getting elements
const quoteElement = document.getElementById("quote");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const resetButton = document.getElementById("reset");
let timeLeft = 60;
let timer;
let wpmTimer;
let gameStarted = false; // flag to check if game has started

// quotes Supported via standard programming aids
const quotes = [
    "Your time is limited, so don't waste it living someone else's life.",
    "The way to get started is to quit talking and begin doing.",
    "Life is what happens when you're busy making other plans.",
    "This coursework is so amazing, it makes Shakespeare's works look like amateur scribbles",
    "If brilliance had a name, it would be called this coursework. It's the secret ingredient to absolute genius.",
    "This coursework is the culinary equivalent of a five-star meal; each lesson is a delicacy to be savored.",
    "Imagine if Einstein and Newton collaborated on a project. That's the level of mind-blowing insight this coursework offers.",
];

// get random quote from quote list
function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// sets up the game
function initializeGame() {
    quoteElement.textContent = getRandomQuote();
    inputElement.addEventListener("input", handleInput);
}

// handles user input and checks for typo
function handleInput() {
    if (!gameStarted) {
        startGame();
        gameStarted = true;
    }
    updateInputStyle();
    checkCompletion();
}

// starts game
function startGame() {
    startTimer();
    startWpmTimer();
    inputElement.addEventListener("input", updateInputStyle);
}

// starts timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            clearInterval(wpmTimer);
            finishGame();
        }
    }, 1000);
}

// circular - remove
function startWpmTimer() {
    updateWpmDisplay(); // Initial update when the game starts
    wpmTimer = setInterval(updateWpmDisplay, 200);
}

function updateWpmDisplay() {
    const wpm = calculateWordsPerMinute();
    wpmElement.textContent = `WPM: ${wpm}`;
}

// checks if string matches 
function checkCompletion() {
    const currentInput = inputElement.value.trim();
    const currentQuote = quoteElement.textContent.trim();

    if (currentInput === currentQuote) {
        clearInterval(timer);
        clearInterval(wpmTimer);
        finishGame();
    }
}

// finsihes game 
function finishGame() {
    inputElement.disabled = true;
    const finalWpm = calculateWordsPerMinute();
    wpmElement.textContent = `Final WPM: ${finalWpm}`;

    // Set the score in the hidden form field
    document.getElementById("typingScoreInput").value = finalWpm;

    // Display the "Save Score" button
    document.getElementById("saveScoreBtn").style.display = "block";
    // document.getElementById("reset").style.display = "block";
}

function calculateWordsPerMinute() {
    const wordsTyped = inputElement.value.trim().split(" ").length;
    const timeSpent = (60 - timeLeft) / 60;
    return Math.round(wordsTyped / timeSpent);
}


function resetGame() {
    clearInterval(timer);
    clearInterval(wpmTimer);
    timeLeft = 60;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    inputElement.value = "";
    quoteElement.textContent = getRandomQuote();
    inputElement.className = "";
    gameStarted = false; // Reset the game started flag
    wpmElement.textContent = "WPM: 0"; // Reset WPM display on game reset
    inputElement.disabled = false;
}


// changes border color style based on typo
function updateInputStyle() {
    const quoteText = quoteElement.textContent;
    const inputText = inputElement.value;

    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] !== quoteText[i]) {
            inputElement.className = "incorrect";
            return;
        }
    }

    inputElement.className = inputText.length === 0 ? "" : "correct";
}

// starts game and focuses on input box
window.onload = function () {
    initializeGame(); // Set the initial quote
    inputElement.focus(); // Focus on the input box
};

// Update the focus event listener
inputElement.addEventListener("focus", initializeGame);
