// File made with help of GitHub Copilot
// This script highlights the active section in the navigation bar based on scroll position
document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll(".nav-subitem");
  const title = document.querySelector('.title');

  // Only consider sections linked in the menu
  const sectionIds = Array.from(navLinks)
    .map(link => link.getAttribute("href").split("#")[1])
    .filter(id => !!id);
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(el => el);

  function getOffset() {
    return title ? title.offsetHeight : 0;
  }

  function onScroll() {
    const offset = getOffset();
    let currentSection = sections[0];

    // Always keep the last menu-linked section above the offset active
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top - offset <= 50) {
        currentSection = sections[i];
      }
    }
    // If scrolled above all, currentSection stays as the first

    navLinks.forEach(link => {
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