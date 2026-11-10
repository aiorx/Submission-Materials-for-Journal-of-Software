/**
 * Animates a pattern prompt onto the screen that the user must type the correct missing element to within a specific time frame
 */
"use strict";

let textBox = { // The box that is typed in
    x: 170,
    y: 200,
    w: 300,
    h: 40,
    f: 200
}

let prompt = { // The box holding the prompt
    x: undefined,
    y: undefined,
    w: 300,
    h: 80,
    f: "#005293",
    text: "",
}

let patternTimeout = 5000; // The amount of time the pattern waits before animating out


// Typing properties
let inputText = '';
let isTyping = false;
let placeholderText = "Enter here..."; // Default placeholder text
let isPlaceholderActive = true; // Flag to track if the placeholder is active
let backspaceTime = 0; // To track how long backspace is held down
let backspaceDelay = 500; // 1 second delay before continuous deletion


// Animation properties
let angle = 0; // Rotation angle in radians
let promptIsReady = false;
let animatingIn = true;
let animationState = 'enter';
let endTask = false;


/**
 * @type {{patterns: {pattern: string, answer: string}[]}}
 */
let patternsData;

/**
 * @type {{pattern: string, answer: string}};
 */
let promptInfo = undefined;
let randomPattern;
let randomAnswer;

/**
 * Load the data
 */
function preloadPattern() {
    patternsData = loadJSON("assets/patterns.json");
}

/**
 * Animates the prompt onto the screen and handles user input
 */
function patterns() {
    // Set the current task
    if (!tasks.pattern.isActive) {
        tasks.currentTask = tasks.pattern.name;
    }

    // Animate the prompt in or out and generate new prompts accordingly
    if (animatingIn) {
        animationState = 'enter'
        animatePrompt(animationState);

        // Display the prompt
        if (promptIsReady) {
            displayPromptText();
            typeText();
            verifyAnswer();
            // Keep the pattern on screen for a specified amount of time
            if (!timers.patternTimeout) {
                timers.patternTimeout = setTimeout(() => {
                    endTask = true;
                }, patternTimeout);
            }
        }
    } else {
        animationState = 'exit';
        animatePrompt(animationState);
    }
}

/**
 * Handles the typing input from the user and displays it onto the screen
 * This functionality was Composed with basic coding tools and modified by me as a base to work off of
 */
function typeText() {
    displayTypedText();
    displayCaret();
    handleBackspace();

    // Also utilizes mousePressed and keyTyped events
}

/**
 * Displays a placeholder text and once the user starts typing, truncates the text to the box width.
 */
function displayTypedText() {
    // Display placeholder text if active, else show input text
    if (isPlaceholderActive) {
        text(placeholderText, textBox.x + 10, textBox.y + 25); // Placeholder text
    } else {
        // Prevent text from overflowing the box
        let textWidthLimit = textBox.w - 20; // 10px padding on each side
        let textToDisplay = inputText;

        // Truncate text if it exceeds the box width
        while (textWidth(textToDisplay) > textWidthLimit) {
            textToDisplay = textToDisplay.substring(0, textToDisplay.length - 1);
        }
        text(textToDisplay, textBox.x + 10, textBox.y + 25); // Typed text
    }
}

/**
 * Displays the caret inside the text box
 */
function displayCaret() {
    // If user is typing, show a caret
    if (isTyping) {
        let caretX = textBox.x + textWidth(inputText) + 10;
        line(caretX, textBox.y + 10, caretX, textBox.y + textBox.h - 10);
    }
}

/**
 * Ensures that the user can delete their input with backspace
 */
function handleBackspace() {
    // If backspace is held and typing is active
    if (keyIsPressed && keyCode === BACKSPACE && isTyping) {
        if (backspaceTime === 0) {
            // Start timing backspace press
            backspaceTime = millis();
            if (inputText.length > 0) {
                // Remove a single character on first press
                inputText = inputText.substring(0, inputText.length - 1);
            }
        } else if (millis() - backspaceTime > backspaceDelay) {
            // Continuous deletion if held beyond the delay
            if (inputText.length > 0) {
                inputText = inputText.substring(0, inputText.length - 1);
            }
        }
    } else {
        // Reset timer when backspace is released or not pressed
        backspaceTime = 0;
    }
}

/**
 * Initiates text typing logic
 */
function mousePressed() {
    // Check if the mouse click is inside the text box
    if (mouseX > textBox.x && mouseX < textBox.x + textBox.w && mouseY > textBox.y && mouseY < textBox.y + textBox.h && promptIsReady) {
        if (isPlaceholderActive) {
            // Clear the placeholder text when the user clicks
            inputText = '';
            isPlaceholderActive = false;
        }
        isTyping = true;
    } else {
        isTyping = false;
    }
}

/**
 * Takes the text input from the user
 */
function keyTyped() {
    // Allow typing inside the text box only if the width hasn't been exceeded
    if (isTyping && key !== 'Backspace' && key !== 'Enter') {
        let textWidthLimit = textBox.w - 20; // 10px padding on each side
        if (textWidth(inputText + key) <= textWidthLimit) {
            inputText += key; // Add character only if it fits
        }
    }
}

// The target size of the prompt boxes
let targetWidth = undefined;
let targetHeight = undefined;
let targetPromptHeight = undefined;

// The actual size of the prompt boxes
let currentWidth = undefined;
let currentHeight = undefined;
let currentPromptHeight = undefined;

//The growth rate
let widthGrowthRate = 2;
let heightGrowthRate = 1;

// Flag so as not to reset the variables constantly
let stateSelected = false;

let wooshSound = undefined;
let wooshPlayed = false;

/**
 * Animates the prompt onto the screen
 */
function animatePrompt(state) {

    if (state === 'enter' && !stateSelected) {
        widthGrowthRate = abs(widthGrowthRate);
        heightGrowthRate = abs(heightGrowthRate);
        targetWidth = textBox.w;
        targetHeight = textBox.h;
        targetPromptHeight = prompt.h;
        currentWidth = 0;
        currentHeight = 0;
        currentPromptHeight = 0;
        stateSelected = true;
        wooshSound = audio.gameSounds.enterWoosh;
    } else if (state === 'exit' && !stateSelected) {
        widthGrowthRate = -1 * abs(widthGrowthRate);
        heightGrowthRate = -1 * abs(heightGrowthRate);
        targetWidth = 0;
        targetHeight = 0
        targetPromptHeight = 0;
        currentWidth = textBox.w;
        currentHeight = textBox.h;
        currentPromptHeight = prompt.h;
        stateSelected = true;
        wooshSound = audio.gameSounds.exitWoosh;
    }

    // Depend prompt coordinates onto textBox
    prompt.x = textBox.x;
    prompt.y = textBox.y - 50;

    // Update the width and height of the rectangles
    if (currentWidth !== targetWidth) {
        currentWidth += widthGrowthRate;
    }

    if (currentPromptHeight !== targetPromptHeight) {
        currentPromptHeight += heightGrowthRate;
    }

    if (currentHeight !== targetHeight) {
        currentHeight += heightGrowthRate;
    }

    // Draw rotating rectangle
    push();
    translate(prompt.x + currentWidth / 2, prompt.y + currentPromptHeight / 2); // Move origin to the center of the rectangle
    angleMode(DEGREES);
    rotate(angle); // Rotate the rectangle
    fill(prompt.f);
    rect(-currentWidth / 2, -currentPromptHeight / 2, currentWidth, currentPromptHeight, 10); // Draw rectangle centered at the origin
    pop();


    // Draw rotating textbox
    push();
    translate(textBox.x + currentWidth / 2, textBox.y + currentHeight / 2); // Move origin to the center of the rectangle
    angleMode(DEGREES);
    rotate(angle); // Rotate the rectangle
    fill(textBox.f);
    rect(-currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight, 10); // Draw rectangle centered at the origin
    pop();

    // Make the rectangles spin
    if (currentWidth === targetWidth && currentHeight === targetHeight && angle % 360 === 0) {
        angle = 0;
        wooshPlayed = false;
        if (state === 'enter') {
            promptIsReady = true;
        }

        if (state === 'exit') {
            renewPatterns();
        }
    } else {
        if (!wooshPlayed) {
            playSound(wooshSound);
            wooshPlayed = true;
        }
        // Increment the angle for continuous rotation
        angle += 20; // Adjust this value to control rotation speed
    }

}

/**
 * Display the prompt text
 */
function displayPromptText() {
    text(promptInfo, prompt.x + 10, prompt.y + prompt.h / 2 - 10);
}

/**
 * Verify the user's response to the pattern
 */
function verifyAnswer() {
    // Check if the user typed something
    if (isTyping && keyIsPressed && key === "Enter") {
        // Check if what they typed is correct
        if (randomAnswer === inputText) {
            playSound(audio.gameSounds.ding);
            updateHealth(true);
        } else {
            playSound(audio.gameSounds.dong);
            updateHealth(false);
        }
        animatingIn = false;
        stateSelected = false;
    } else if (endTask) {
        playSound(audio.gameSounds.dong);
        updateHealth(false);
        animatingIn = false;
        stateSelected = false;
    }
}

/**
 * Reset all necessary variables and generate a new prompt
 */
function renewPatterns() {
    inputText = '';
    isTyping = false;
    isPlaceholderActive = true;
    placeholderText = "Enter here..."; // Default placeholder text

    stateSelected = false;
    promptIsReady = false;
    animatingIn = true;
    animationState = 'enter';
    endTask = false;
    if (timers.patternTimeout) {
        clearTimeout(timers.patternTimeout);

        if (speedPattern) {
            patternTimeout = 3000;
        }
    }
    timers.patternTimeout = undefined;
    generatePrompt();
}

/**
 * Creates a new prompt by taking a random pattern from the json file
 */
function generatePrompt() {
    // Select a random index from the patterns array
    let randomIndex = Math.floor(random(patternsData.patterns.length));
    let selectedPattern = patternsData.patterns[randomIndex];

    // Store the pattern and answer into variables
    randomPattern = selectedPattern.pattern;
    randomAnswer = selectedPattern.answer;
    promptInfo = randomPattern;

}

/**
 * Reset the patterns script
 */
function resetPatterns() {

    renewPatterns();
    textBox.x = 170;
    textBox.y = 200;
    textBox.w = 300;
    textBox.h = 40;
    textBox.f = 200;

    prompt.x = undefined;
    prompt.y = undefined;
    prompt.w = 300;
    prompt.h = 80;
    prompt.text = "";

    inputText = '';
    isTyping = false;
    placeholderText = "Enter here...";
    isPlaceholderActive = true;
    backspaceTime = 0;

    angle = 0; // Rotation angle in radians
    promptIsReady = false;
    animatingIn = true;
    animationState = 'enter';
    endTask = false;
}