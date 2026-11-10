// Main JavaScript file for the Bot Landing Page
// Aided with basic GitHub coding tools

document.addEventListener('DOMContentLoaded', function () {
    // Initialize page elements
    initializePage();
});

function initializePage() {
    // Add current year to footer
    updateFooterYear();

    // Add smooth scrolling for anchor links
    setupSmoothScrolling();

    // Add simple animation to sections on scroll
    setupScrollAnimations();
}

function updateFooterYear() {
    var currentYear = new Date().getFullYear();
    var footerYear = document.querySelector('footer p');
    if (footerYear) {
        footerYear.textContent = "© " + (currentYear) + " Bot Service. All rights reserved.";
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function anchor {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupScrollAnimations() {
    // Simple function to add fade-in effect to elements as they scroll into view
    var sections = document.querySelectorAll('section');

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100');
                entry.target.classList.remove('opacity-0');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(function section {
        section.classList.add('transition-opacity', 'duration-700', 'opacity-0');
        observer.observe(section);
    });
}

// Handle bot iframe interactions
var botContainer = document.querySelector('.bot-container');
if (botContainer) {
    botContainer.addEventListener('click', function () {
        // Ensure the iframe is focused when container is clicked
        var iframe = botContainer.querySelector('iframe');
        if (iframe) {
            iframe.focus();
        }
    });
}

var xhr = new XMLHttpRequest();
xhr.open('GET', "https://webchat.botframework.com/api/tokens", true);
xhr.setRequestHeader('Authorization', 'BotConnector ' + 'APHABIEVk6rP4AwBFwNbeNpZV7oBr3WgLak3bB1jHG6i0MRzfJT2JQQJ99BCACGhslBAArohAAABAZBS3b0z.5Y1FLidYNhJZdbRymLFPYlDMYGjYM4mWLSJBZIdCmGKDuD5mPobMJQQJ99BCACGhslBAArohAAABAZBS1PqI');
xhr.send();
xhr.onreadystatechange = processRequest;

function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        document.getElementById("chat").src = "https://webchat.botframework.com/embed/botc300a6?t=" + response;
    }
}