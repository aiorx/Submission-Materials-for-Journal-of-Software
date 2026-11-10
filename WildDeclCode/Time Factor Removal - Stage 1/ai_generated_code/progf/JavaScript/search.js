// Help Aided using common development resources

var searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", filterElements);

function filterElements() {
    var searchValue = searchInput.value.toLowerCase();
    var elements = document.querySelectorAll(".element");
    elements.forEach(function(element) {
        if (element.getAttribute("data-name").toLowerCase().includes(searchValue)) {
            element.classList.remove("hidden");
        } else {
            element.classList.add("hidden");
        }
    });
}

