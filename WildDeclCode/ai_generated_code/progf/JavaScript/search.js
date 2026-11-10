// Help Aided using common development resources

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", filterElements);

function filterElements() {
    const searchValue = searchInput.value.toLowerCase();
    const elements = document.querySelectorAll(".element");
    elements.forEach(function(element) {
        if (element.getAttribute("data-name").toLowerCase().includes(searchValue)) {
            element.classList.remove("hidden");
        } else {
            element.classList.add("hidden");
        }
    });
}

