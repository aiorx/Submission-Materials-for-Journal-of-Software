// File made with help of GitHub Copilot
// This script highlights the active section in the navigation bar based on scroll position
document.addEventListener("DOMContentLoaded", function() {
  var navLinks = document.querySelectorAll(".nav-subitem");
  var title = document.querySelector('.title');

  // Only consider sections linked in the menu
  var sectionIds = Array.from(navLinks)
    .map(function link { return link.getAttribute("href").split("#")[1]; })
    .filter(function id { return !!id; });
  var sections = sectionIds
    .map(function id { return document.getElementById(id); })
    .filter(function el { return el; });

  function getOffset() {
    return title ? title.offsetHeight : 0;
  }

  function onScroll() {
    var offset = getOffset();
    var currentSection = sections[0];

    // Always keep the last menu-linked section above the offset active
    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].getBoundingClientRect();
      if (rect.top - offset <= 50) {
        currentSection = sections[i];
      }
    }
    // If scrolled above all, currentSection stays as the first

    navLinks.forEach(function link {
      link.classList.remove("active");
      if (link.getAttribute("href").split("#")[1] === currentSection.id) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onScroll);
  onScroll();
});