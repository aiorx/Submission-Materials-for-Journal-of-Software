/*
Initially created Adapted from standard coding samples with prompt:
Create a lookalike clone of the visual studio code editor interface using HTML and CSS.
It should have the ability to switch between fake source code tabs which actually just
display images instead of source code.
*/

// Get all tabs and contents
var tabs = document.querySelectorAll('.tab');
var contents = document.querySelectorAll('.content');

function activateTab(tab) {
    // Remove 'active' class from all tabs and contents
    tabs.forEach(function t { return t.classList.remove('active'); });
    contents.forEach(function content { return content.classList.remove('active'); });

    // Add 'active' class to clicked tab and corresponding content
    tab.classList.add('active');
    var content = document.getElementById(tab.dataset.target)
    content.classList.add('active');

    // Add to session storage
    sessionStorage.setItem('activeTab', tab.id);
}

// Add click event to each tab
tabs.forEach(function tab {
    tab.addEventListener('click', () => {
        activateTab(tab);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var savedTab = sessionStorage.getItem('activeTab');
    if (savedTab) {
        // Find the tab with the matching data-target and activate it
        var tabToActivate = document.getElementById(savedTab);
        if (tabToActivate) {
            activateTab(tabToActivate);
        }
    } else {
        // If no saved tab, activate the first one by default
        activateTab(tabs[0]);
    }
});