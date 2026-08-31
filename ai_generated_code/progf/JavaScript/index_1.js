// This function Aided using common development resources with minor edits
function startAudioTimer() {
    const audioPlayer = document.getElementById('audioPlayer');
    const proton_decay = document.getElementById('.proton-decay')
    const timestamps = document.querySelectorAll('.timestamp');
    const protonstamps = document.querySelectorAll('.protonstamp');
    const textElements = document.querySelectorAll('.text-between');

    let startTime = 0;
    let cursorPosition = 0;  // Cursor will keep track of the position in each text element
    let currentTextElementIndex = 0; // Which text element to show

    // Function to display the next "character" or "word"
    function showNextCharacter(element, cursorIndex) {
        const textContent = element.textContent;
        const displayedText = textContent.substring(0, cursorIndex);
        const cursorText = textContent.substring(cursorIndex, cursorIndex + 1);

        element.innerHTML = `${displayedText}<span class="cursor">${cursorText}</span>`;

        if (cursorIndex < textContent.length) {
            cursorPosition = cursorIndex + 1;  // Move the cursor forward
        } else {
            cursorPosition = textContent.length; // Finished showing the text
        }
    }

    // Calculate when each text element should appear based on the total duration
    function calculateTextAppearTime() {
        const totalDuration = audioPlayer.duration; // Get the total audio duration
        const interval = totalDuration / textElements.length; // Divide by number of text elements

        // Apply timing based on the order of the text elements
        const textTimes = [];
        textElements.forEach((element, index) => {
            textTimes.push(index * interval); // Time for each text element to appear
        });

        return textTimes;
    }

    // Listen for when the audio starts playing
    audioPlayer.addEventListener('play', () => {
        // Reset the start time whenever the audio is played again
        startTime = audioPlayer.currentTime;
        
        // Calculate when text should appear based on the audio duration
        const textAppearTimes = calculateTextAppearTime();
        console.log(textAppearTimes)
        console.log(textElements)
        // Start the timer
        const timer = setInterval(() => {

            if (proton_decay) {
                protonstamps.forEach((header) => {
                    const timestampTime = parseFloat(header.getAttribute('data-time'));
    
                    if (audioPlayer.currentTime >= timestampTime) {
                        header.style.display = 'block';
                    }
                });
            }
            // Loop through all timestamps and display them at the correct time
            timestamps.forEach((header) => {
                const timestampTime = parseFloat(header.getAttribute('data-time'));

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
document.addEventListener('DOMContentLoaded', () => {
    startAudioTimer();
});

window.addEventListener('scroll', function() {
    const scrollY = window.scrollY; // Get the scroll position
    const height = document.body.scrollHeight - window.innerHeight; // Total scrollable height
    const opacity = Math.min(scrollY / height, 1); // Fade effect based on scroll position

    // Adjust the opacity of the background
    document.body.style.setProperty('--bg-opacity', opacity); // Black fading to transparent
  });
