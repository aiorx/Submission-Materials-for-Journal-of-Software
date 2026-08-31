const $menuBtn = $("#menuBtn");
const $dropdown = $("#dropdown");
const $messageContainer = $("#messageContainer");
const $textArea = $("#textArea");
const $sendBtn = $("#sendBtn");
const $messageSound = $("#messageSound");

// Supported via standard programming aids
const computerWelcome = [
  "Welcome to this chat demo! Please note that this is a demonstration and does not have AI capabilities.",
  "You may use the text area below to send messages into the chat.",
];

// Supported via standard programming aids
const computerReplies = [
  "Oh, Hello there! Did you know that an octopus has three hearts? Imagine the heartbreak!",
  "How are you doing? Speaking of feelings, did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
  "What plans do you have today? Here's an idea: A day on Venus is longer than a year on Venus. Think about that next time you complain about long days!",
  "It's a beautiful day, isn't it? Kind of like how it's always a beautiful day somewhere on Earth. That's because it takes 8 minutes and 20 seconds for light to travel from the Sun to Earth!",
  "Chatbots can be fun, you know. We might not be great at parties, but at least we don't spill our drinks!",
  "I hope you're having a fantastic day! Here's something to make it even better: What do you call fake spaghetti? An impasta!",
  "Did you ever hear about the claustrophobic astronaut? He just needed a little space.",
  "How's your day going? Here's a random fact for you: Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
  "Got any weekend plans? How about learning to juggle? After all, juggling can improve your hand-eye coordination. Who knew?",
  "If you're ever feeling down, just remember that sea otters hold hands when they sleep to keep from drifting apart. Isn't that adorable?",
  "Ever wonder why flamingos are pink? It's because of their diet! They eat algae and crustaceans that contain pigments, which turn their feathers pink. So, you are what you eat!",
  "Here's a thought: If you could fold a piece of paper 42 times, it would reach the moon. Too bad most paper can only be folded about 7 or 8 times!",
];

// Initialization
$(document).ready(() => {
  displayWelcomeMessage();
});

/**
 * Display welcome messages with a delay between each message.
 * Each message appears with an interval of 1 second between them.
 */
function displayWelcomeMessage() {
  computerWelcome.forEach((str, index) => {
    setTimeout(() => {
      appendMessageElement(str, "computer", false);
    }, index * 1000);
  });
}

/**
 * Select a random reply for the computer from the predefined list.
 * @returns {string} A randomly selected reply.
 */
function getRandomComputerReply() {
  const randomIndex = Math.floor(Math.random() * computerReplies.length);
  return computerReplies[randomIndex];
}

/**
 * Retrieve the current time in a formatted string.
 * @returns {string} Current date and time in the format "M/DD/YYY HH:MM AM".
 */
function getCurrentTime() {
  const now = new Date().toLocaleString();
  return now.slice(0, 9) + " " + now.slice(10, 16) + now.slice(20);
}

/**
 * Play the message sound effect.
 * Ensure user interactions are handled before using this due to browser restrictions on autoplay.
 */
function playMessageSound() {
  $messageSound[0].play();
}

/**
 * Appends a message to the message container.
 *
 * @param {string} message - The content of the message.
 * @param {string} type - Specifies the sender. Expected values: "user" or "computer".
 * @param {boolean} [isPlaysound=true] - Determines whether to play a sound effect with the message.
 */
function appendMessageElement(message, type, isPlaysound = true) {
  // Regex generated via https://regex-generator.olafneumann.org/?sampleText=4%3A16%3A38%20AM&flags=Pi
  const timestamp = getCurrentTime();
  const $message = $(`
    <div class="${type}-message">
      <span>
        ${message}
      </span>
      <div class="timestamp">${timestamp}</div>
    </div>
  `);

  $messageContainer.append($message);

  if (isPlaysound) {
    playMessageSound();
  }

  /* Adapted from https://stackoverflow.com/questions/4210798/how-to-scroll-to-top-of-page-with-javascript-jquery
  and https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
  */
  $messageContainer.scrollTop($messageContainer.prop("scrollHeight"));
}

/**
 * Event listener for sending messages.
 * When the send button is clicked, it retrieves the user's message, displays it,
 * then clears the textarea and has the computer send a random reply after a 1-second delay.
 */
$sendBtn.on("click", () => {
  const userMessage = $textArea.val().trim();
  if (userMessage) {
    appendMessageElement(userMessage, "user");
    $textArea.val(""); //Resets value of textarea
    $textArea.height("fit-content");
    $textArea.focus(); //Puts cursor to focus text area again

    // Computer responds with random reply
    setTimeout(() => {
      appendMessageElement(getRandomComputerReply(), "computer");
    }, 1000);
  }
});

/**
 * Event listener to toggle the visibility of the dropdown menu.
 */
$menuBtn.on("click", () => {
  $dropdown.toggle();
});

/**
 * Event listener for the dropdown menu.
 * When the dropdown is clicked, it clears all messages from the message container,
 * hides the dropdown, and re-displays the welcome messages.
 */
$dropdown.on("click", () => {
  $messageContainer.empty();
  $dropdown.toggle();
  displayWelcomeMessage();
});

/**
 * Event listener for adjusting the height of the textarea.
 * Dynamically changes the height of the textarea to fit its content.
 */
$textArea.on("input", () => {
  $textArea.css("height", "fit-content"); // Reset height to auto in case of shrinking
  $textArea.css("height", $textArea.prop("scrollHeight") + "px");
  $textArea.scrollTop($textArea.prop("scrollHeight"));
});
