// JavaScript file for doppelganger website
// Produced with advanced coding toolso, copy and pasted by genderdoog (I have no idea what I am doing here)
// https://github.com/genderdoog/doppelganger

// CONSTANTS
// Sets language to chinese when page is first loaded
let languageIsEnglish = false;

// METHODS/FUNCTIONS
// Changes language from english to chinese (and vice versa)
function changeLanguage() {
	if (languageIsEnglish) { // To change language to english (languageIsEnglish = true)
		// Disables header1 chinese text and poster
		document.querySelectorAll(".chinese-flex-style").forEach((element) => {
			element.style.display = "none";
		});
		
		// Enables header1 english text
		document.querySelectorAll(".english-flex-style").forEach((element) => {
			element.style.display = "flex";
		});		
		
		// Disables header2 chinese text 
		document.querySelectorAll(".chinese-block-style").forEach((element) => {
			element.style.display = "none";
		});	

		// Enables header2 english text
		document.querySelectorAll(".english-block-style").forEach((element) => {
			element.style.display = "block";
		});		
		
		languageIsEnglish = !languageIsEnglish; // Switches languageIsEnglish from true to false
	
	} else { // To change to chinese (languageIsEnglish = false)
		// Enables header1 chinese text and poster
		document.querySelectorAll(".chinese-flex-style").forEach((element) => {
			element.style.display = "flex";
		});
		
		// Disables header1 english text
		document.querySelectorAll(".english-flex-style").forEach((element) => {
			element.style.display = "none";
		});	
		
		// Enables header2 chinese text 
		document.querySelectorAll(".chinese-block-style").forEach((element) => {
			element.style.display = "block";
		});	

		// Disables header2 english text
		document.querySelectorAll(".english-block-style").forEach((element) => {
			element.style.display = "none";
		});
		
		languageIsEnglish = !languageIsEnglish; // Switches languageIsEnglish from false to true	
	}
}

// Copying selected text functionality (context menu)
function copySelectedText() {
	// Get the current selection (highlighted text)
	const selection = window.getSelection();

	// Check if there is any text selected
	if (selection.rangeCount > 0) {
		// Get the selected text
		const selectedText = selection.toString();

		// Copy the selected text to the clipboard
		navigator.clipboard.writeText(selectedText);
	}
}

// Saves the webpage, including context menu (save and save as)
function saveFile() {
	// Get the entire page's source, including DOCTYPE
	const doctype = new XMLSerializer().serializeToString(document.doctype);
	const html = document.documentElement.outerHTML;
	const fullSource = `${doctype}\n${html}`;

	// Create a blob and link to download it
	const blob = new Blob([fullSource], { type: 'text/html' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = '_.html';
	document.body.appendChild(a);
	a.click();

	// Cleanup
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// Function to show the custom context menu
function showCustomMenu(event) {
	event.preventDefault(); // Prevent default context menu

    // Select the context menu
    const container = document.getElementById("customMenu");

    // Store the original display style
    const originalDisplay = container.style.display;

    // Temporarily show the menu to measure its size
    container.style.display = "block";
    const menuRect = container.getBoundingClientRect();

    // Determine offset based on if device is mobile or not
    let vwOffset, vhOffset;
    if (shouldShowCustomCursor(menuRect)) { // If display size is large enough for desktop view
        vwOffset = menuRect.width * -0.2;
        vhOffset = menuRect.height * -0.47;
    } else { // If display size meets requirements for mobile view
        vwOffset = menuRect.width * -0.3; 
        vhOffset = menuRect.height * -1.3;
    }

    // Restore the original display style (hides menu)
    container.style.display = originalDisplay;

    // Set initial position of context menu (before checking overflow)
    let posX = event.pageX + vwOffset;
    let posY = event.pageY + vhOffset;

    // Get viewport dimensions
    const viewportRect = document.documentElement.getBoundingClientRect();

    // Adjust position if menu overflows the right edge
    if (posX + menuRect.width > viewportRect.width) {
        posX = viewportRect.width - menuRect.width;
    }

    // Adjust position if menu overflows the bottom edge
    if (posY + menuRect.height > viewportRect.height) {
        posY = viewportRect.height - menuRect.height;
    }

    // Adjust position if menu overflows the left edge
    if (posX < 0) {
        posX = 0;
    }

    // Adjust position if menu overflows the top edge
    if (posY < 0) {
        posY = 0;
    }

    // Display menu in the correct position
    container.style.display = "block";
    container.style.top = `${posY}px`;
    container.style.left = `${posX}px`;
}

// To hide the custom context menu
function hideCustomMenu() {
	blockFor(160); // Wait for 160ms before showing menu. In the source material (Youtube 25fps), the menu stays on for 4 frames after the mouse has been clicked. 
	customMenu.style.display = 'none';
}

// Used to simulate lag on custom cursor and scrolling
function blockFor(ms) {
	const start = Date.now();
	while (Date.now() - start < ms) {} // Busy-wait loop
}

// Function to determine if the custom cursor should be shown
function shouldShowCustomCursor() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // List of common mobile indicators in user agents
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);

    return !isMobile; // Show custom cursor only if not a mobile device
}

// Functionality related to showing dropdown menu for header1-search-box
function toggleDropdown(button) {
    const wrapper = button.closest('.search-wrapper');
    const dropdown = wrapper.querySelector('.search-dropdown');
    const wasVisible = dropdown.style.display === "block";

    // Toggle visibility
    dropdown.style.display = wasVisible ? "none" : "block";

    // Swap image
    const img = button.querySelector('img');
    if (img) {
        img.src = wasVisible ?
			"assets/dropdown-arrow/arrow.png" : 
			"assets/dropdown-arrow/arrow-pressed.png";
    }

    // If opening dropdown and triggered by keyboard, focus first item
    if (!wasVisible && lastInteraction === "keyboard") {
        const firstItem = dropdown.querySelector('li');
        if (firstItem) firstItem.focus();

        // Add mousemove listener to blur on movement
        const blurOnMouseMove = function () {
            if (document.activeElement && document.activeElement !== document.body) {
                document.activeElement.blur();
            }
            document.removeEventListener("mousemove", blurOnMouseMove);
        };

        document.addEventListener("mousemove", blurOnMouseMove);
    }
}

// Functionality related to selecting an option from the dropdown menu
function selectOption(item) {
    const wrapper = item.closest('.search-wrapper');
    if (!wrapper) return;

    const input = wrapper.querySelector('.header1-search-box');
    const dropdown = wrapper.querySelector('.search-dropdown');
    const arrowImg = wrapper.querySelector('.dropdown-icon img');

    if (input) {
        input.value = item.textContent;
        input.focus(); // Optional

        // Fire input event to trigger syncing
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (dropdown) {
        dropdown.style.display = "none";
    }

    if (arrowImg) {
        arrowImg.src = "assets/dropdown-arrow/arrow.png";
    }
}

// Functionality related to submitting information from dropdown menu
function handleSubmit(form) {
    const wrapper = form.closest('.search-wrapper');
    const dropdown = wrapper.querySelector('.search-dropdown');
    dropdown.style.display = "none";
    return true; // Allow form to submit
}

// Keyboard accessiblity for ONLY opening dropdown menu for header1-search-box
function handleDropdownKey(event, element) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDropdown(element);

        const wrapper = element.closest('.search-wrapper');
        const dropdown = wrapper.querySelector('.search-dropdown');
        const firstItem = dropdown.querySelector('li');

        if (firstItem && dropdown.style.display === "block") {
            firstItem.focus();

            // Add mousemove listener to blur on movement
            const blurOnMouseMove = function () {
                if (document.activeElement && document.activeElement !== document.body) {
                    document.activeElement.blur();
                }
                document.removeEventListener("mousemove", blurOnMouseMove);
            };

            document.addEventListener("mousemove", blurOnMouseMove);
        }
    }
}

// Keyboard accessiblity for interacting with dropdown menu, such as moving up and down the options
function handleOptionKey(event, element) {
    const li = element;
    const ul = li.parentElement;
    const items = Array.from(ul.querySelectorAll('li'));
    const index = items.indexOf(li);

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            items[(index + 1) % items.length].focus();
            break;

        case 'ArrowUp':
            event.preventDefault();
            items[(index - 1 + items.length) % items.length].focus();
            break;

        case 'Enter':
            event.preventDefault();
            selectOption(li);
            break;

        case 'Escape':
            ul.style.display = 'none';

            // Restore dropdown arrow image when pressing Escape
            const wrapper = ul.closest('.search-wrapper');
            const arrowImg = wrapper && wrapper.querySelector('.dropdown-icon img');
            if (arrowImg) {
                arrowImg.src = "assets/dropdown-arrow/arrow.png";
            }

            // Move focus back to the dropdown button
            const toggleBtn = wrapper && wrapper.querySelector('.dropdown-icon');
            if (toggleBtn) {
                toggleBtn.focus();
            }
            break;
    }
}

// Custom cursor
function showCustomCursor() {
	// Remove any existing custom cursor to prevent duplicates
	const oldCursor = document.querySelector(".custom-cursor");
	if (oldCursor) {
		oldCursor.remove();
	}

	// Create a new cursor
	const customCursor = document.createElement("div");
	customCursor.classList.add("custom-cursor");
	document.body.appendChild(customCursor);

	// Resizes cursor image
	const updateCursorSize = () => {
		const cursorSize = Math.min(window.innerWidth, window.innerHeight) * 0.05; // 5% of the smaller dimension
		customCursor.style.setProperty("--current-size", `${cursorSize}px`);
		customCursor.style.width = `var(--current-size)`;
		customCursor.style.height = `var(--current-size)`;
	};

	// Update cursor size on window resize
	window.addEventListener("resize", updateCursorSize);
	updateCursorSize(); // Set initial size when page is first loaded
	
	// Track mouse movement
	const onMouseMove = (e) => {
		blockFor(80); // Wait for 80ms (used to simulate cursor lag)
		customCursor.style.left = `${e.clientX}px`;
		customCursor.style.top = `${e.clientY}px`;
	};

	document.addEventListener("mousemove", onMouseMove);

	// Shrink cursor on mousedown and restore on mouseup
	const shrinkCursor = () => {
		const currentSize = parseFloat(getComputedStyle(customCursor).getPropertyValue("--current-size"));
		const newSize = currentSize * 0.9; // Shrink by 10%
		customCursor.style.setProperty("--current-size", `${newSize}px`);
		customCursor.style.width = `var(--current-size)`;
		customCursor.style.height = `var(--current-size)`;
	};

	const restoreCursor = () => {
		updateCursorSize(); // Reset to original size
	};

	document.addEventListener("mousedown", shrinkCursor);
	document.addEventListener("mouseup", restoreCursor);

	// Hides cursor when mouse leaves viewport
	document.addEventListener("mouseleave", () => {
		customCursor.style.display = "none";
	});

	// Enables cursor again when it enters viewport again
	document.addEventListener("mouseenter", () => {
		customCursor.style.display = "block";
	});
}

// Function to sync whatever is inputted into the search box across translation
function syncAllInputs(sourceInput) {
    allInputs.forEach(input => {
        if (input !== sourceInput) {
            input.value = sourceInput.value;
        }
    });
}

// MAIN
// Physical mouse scroll wheel effect for touchscreen and touchpad devices
document.addEventListener("DOMContentLoaded", () => {
	let lastScrollTime = 0;
	let lastTouchY = null;
	const stepSize = 100;

	function scrollPage(scrollAmount) {
	  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
	  const newScroll = window.scrollY + (scrollAmount > 0 ? stepSize : -stepSize);

	  // Clamp scroll position
	  const clamped = Math.max(0, Math.min(newScroll, maxScroll));
	  window.scrollTo(0, clamped);

	  lastScrollTime = Date.now();
	}

	document.addEventListener("wheel", (event) => {
		if (event.ctrlKey) return; // Allow zooming
		event.preventDefault();

		let now = Date.now();
		if (now - lastScrollTime > 100) {
			scrollPage(event.deltaY);
		}
	}, { passive: false });

	document.addEventListener("touchstart", (event) => {
		// Only track if it's a single-finger touch
		if (event.touches.length === 1) {
			lastTouchY = event.touches[0].clientY;
		} else {
		lastTouchY = null; // Disable custom scroll for multi-touch
		}
	});

	document.addEventListener("touchmove", (event) => {
		// Allow pinch-zoom (multi-touch) to work
		if (event.touches.length > 1) return;

		event.preventDefault();

		if (lastTouchY === null) return;

		let now = Date.now();
		let touchY = event.touches[0].clientY;
		let scrollAmount = lastTouchY - touchY;

		if (Math.abs(scrollAmount) > 10 && now - lastScrollTime > 100) {
			scrollPage(scrollAmount);
			lastTouchY = touchY;
		}
	}, { passive: false });

	document.addEventListener("touchend", () => {
		lastTouchY = null;
	});
});


// Sets language on page startup
changeLanguage();

// Initialising custom menu styles
const customMenu = document.getElementById('customMenu');

// Add event listener for right-click
document.addEventListener('contextmenu', showCustomMenu);

// Add event listener to hide the menu on click elsewhere
document.addEventListener('click', function (event) {
    const isInsideMenu = customMenu.contains(event.target);
    const isButton = event.target.tagName === 'BUTTON';

    if (!isInsideMenu || isButton) {
        hideCustomMenu();
    }
});

// If the device is not mobile, show the custom cursor
if (shouldShowCustomCursor()) {
    showCustomCursor();
}

// Dropdown menu for header1-search-box
document.addEventListener("click", function(event) {
    document.querySelectorAll('.search-wrapper').forEach(wrapper => {
        const isInside = wrapper.contains(event.target);
        const dropdown = wrapper.querySelector('.search-dropdown');
        const arrow = wrapper.querySelector('.dropdown-icon img');
        
        if (!isInside && dropdown.style.display === "block") {
            dropdown.style.display = "none";
            if (arrow) arrow.src = "assets/dropdown-arrow/arrow.png";
        }
    });
});

// This is used to determine what selected the dropdown arrow (either the mouse or keyboard), and then to change behaviour accordingly in toggleDropdown(button)
let lastInteraction = "keyboard";

document.addEventListener("mousedown", () => {
    lastInteraction = "mouse";
});

document.addEventListener("keydown", () => {
    lastInteraction = "keyboard";
});

// Below are things to ensure that whatever is inputted into the search box is synced when webpage is translated
// This is required for syncing, as we have four different <inputs> corresponding to each translation and desktop/mobile view

// Get all four inputs
const chineseDesktop = document.getElementById('chinese-desktop-search-box');
const englishDesktop = document.getElementById('english-desktop-search-box');
const chineseMobile = document.getElementById('chinese-mobile-search-box');
const englishMobile = document.getElementById('english-mobile-search-box');

// Stores all four inputs in a array
const allInputs = [chineseDesktop, englishDesktop, chineseMobile, englishMobile];

// Attach input event listeners to each input
allInputs.forEach(input => {
    input.addEventListener('input', () => syncAllInputs(input));
});