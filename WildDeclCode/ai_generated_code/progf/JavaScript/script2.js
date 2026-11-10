document.addEventListener('DOMContentLoaded', function() {
    var fixedElement = document.getElementById('fixedElement');
    var toggleButton = document.getElementById('toggleButton');

    toggleButton.addEventListener('click', function() {
        fixedElement.classList.toggle('visible');
    });
});
/*this is Penned via standard programming aids*/