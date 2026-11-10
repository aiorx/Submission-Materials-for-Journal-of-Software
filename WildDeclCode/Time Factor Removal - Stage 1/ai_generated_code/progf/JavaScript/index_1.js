// This function Aided using common development resources with minor edits
function startAudioTimer() {
    var audioPlayer = document.getElementById('audioPlayer');
    var proton_decay = document.getElementById('.proton-decay')
    var timestamps = document.querySelectorAll('.timestamp');
    var protonstamps = document.querySelectorAll('.protonstamp');
    var textElements = document.querySelectorAll('.text-between');

    var startTime = 0;
    var cursorPosition = 0;  // Cursor will keep track of the position in each text element
    var currentTextElementIndex = 0; // Which text element to show

    // Function to display the next "character" or "word"
    function showNextCharacter(element, cursorIndex) {
        var textContent = element.textContent;
        var displayedText = textContent.substring(0, cursorIndex);
        var cursorText = textContent.substring(cursorIndex, cursorIndex + 1);

        element.innerHTML = "" + (displayedText) + '<span class="cursor">' + (cursorText) + "</span>";

        if (cursorIndex < textContent.length) {
            cursorPosition = cursorIndex + 1;  // Move the cursor forward
        } else {
            cursorPosition = textContent.length; // Finished showing the text
        }
    }

    // Calculate when each text element should appear based on the total duration
    function calculateTextAppearTime() {
        var totalDuration = audioPlayer.duration; // Get the total audio duration
        var interval = totalDuration / textElements.length; // Divide by number of text elements

        // Apply timing based on the order of the text elements
        var textTimes = [];
        textElements.forEach(function (element, index) {
            textTimes.push(index * interval); // Time for each text element to appear
        });

        return textTimes;
    }

    // Listen for when the audio starts playing
    audioPlayer.addEventListener('play', function () {
        // Reset the start time whenever the audio is played again
        startTime = audioPlayer.currentTime;
        
        // Calculate when text should appear based on the audio duration
        var textAppearTimes = calculateTextAppearTime();
        console.log(textAppearTimes)
        console.log(textElements)
        // Start the timer
        var timer = setInterval(() => {

            if (proton_decay) {
                protonstamps.forEach((header) => {
                    var timestampTime = parseFloat(header.getAttribute('data-time'));
    
                    if (audioPlayer.currentTime >= timestampTime) {
                        header.style.display = 'block';
                    }
                });
            }
            // Loop through all timestamps and display them at the correct time
            timestamps.forEach((header) => {
                var timestampTime = parseFloat(header.getAttribute('data-time'));

                if (audioPlayer.currentTime >= timestampTime) {
                    header.style.color = 'coral';
                }
                else {
                    header.style.color = 'white'
                }
            });

            // Handle text traversal
            // if (currentTextElementIndex < textElements.length) {
            //     const currentElement = textElements[currentTextElementIndex];
                
            //     // If the current time reaches or exceeds the time for this element, show it
            //     if (currentTime >= textAppearTimes[currentTextElementIndex]) {
            //         currentElement.style.color = 'coral';
            //         currentElement.style.display = 'block'
            //         showNextCharacter(currentElement, cursorPosition);

            //         // Move to the next text element when the current one is fully displayed
            //         if (cursorPosition >= currentElement.textContent.length) {
            //             currentTextElementIndex++;
            //             cursorPosition = 0;  // Reset cursor position for the next element
            //         }
            //     }
            // }

            // Stop the timer once the audio has ended
            if (audioPlayer.ended) {
                clearInterval(timer);
            }
        }, 100); // Check every 100ms
    });
}

// Initialize the function when the page is ready
document.addEventListener('DOMContentLoaded', function () {
    startAudioTimer();
});

window.addEventListener('scroll', function() {
    var scrollY = window.scrollY; // Get the scroll position
    var height = document.body.scrollHeight - window.innerHeight; // Total scrollable height
    var opacity = Math.min(scrollY / height, 1); // Fade effect based on scroll position

    // Adjust the opacity of the background
    document.body.style.setProperty('--bg-opacity', opacity); // Black fading to transparent
  });
