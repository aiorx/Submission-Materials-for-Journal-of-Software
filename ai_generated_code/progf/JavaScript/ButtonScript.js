// function Aided using common development resources
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("scrollBtn");
    const scrollContainer = document.querySelector(".content-body")

    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", scrollAppear);
    window.addEventListener("resize", scrollAppear);

    function scrollAppear() {
        if (window.innerWidth < 900) {
            button.style.display = "none";
            return;
        }

        if (scrollContainer.scrollTop > 175) {
            button.style.display = "block";   
        } else {
            button.style.display = "none";
        }
    }

    window.scrollToTop = function () {
        scrollContainer.scrollTo({top: 0,  beahviour: 'smooth'});
    }
});

