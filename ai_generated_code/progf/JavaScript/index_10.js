
// version 1.2 - CREATING ACCESSIBLE dropdown

// source code referenced and modified from: w3c schools dropdown
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_dropdown_navbar_click
// To make content keyboard accessible UMGPT was used for trouble shooting

// Adding dom content loaded to prevent errors in running javascript. JS will tun only after full html has loaded
document.addEventListener("DOMContentLoaded", () => {
    // interesting note: => this symbol is a shorthand for defining functions

    // setting constants
    const dropdownButton = document.querySelector(".dropbtn");
    const dropdownContent = document.getElementById("myDropdown");

    // adding event listener for clicking
    dropdownButton.addEventListener("click", dropdown); 
    
    // adding event listener for tabbing and pressing dropdown
    dropdownButton.addEventListener("keydown", function(e){
        // checks if the key pressed is enter
        if (e.key === 'Enter'){
            e.preventDefault(); // prevents default action of enter cause we are defining a new action for it
            dropdown();
        }
    });

    // defining the dropdown function
    function dropdown(){
        const isOpen = dropdownButton.getAttribute("aria-expanded") === 'true';
        // getAttribute method gets the truth value of aria-expanded, and asssigned to a constant
        // checking it against 'true' to check if the retrieved value is true or not

        dropdownButton.setAttribute("aria-expanded", !isOpen);
        // toggling the truth value of aria-expanded, if it is expanded (true), it will collapse, if it is closed(flase), it will open

        dropdownContent.classList.toggle("show");
    }

    // closing dropdown if the person clicks outside
    window.addEventListener("click", function(e){
        if (!e.target.matches(".dropbtn") && !dropdownContent.contains(e.target)){
            closeDropdown();
            // note: !dropdownContent.contains(e.target) checks if the clicked element is not contained within the dropdown content
        }
    });

    // closing dropdown when it loses focus on it
    //interesting - blur is used when focus of an element is lost
    dropdownButton.addEventListener("blur", function(e){
        setTimeout(() => {
            if(!dropdownContent.contains(document.activeElement)){
                closeDropdown();
            }
        }, 0);
    });

    // setTimeout was suggested by UM-GPT because:
    // By using setTimeout with a delay of 0, it allows the browser to complete the focus event handling and move focus to a new element. 
    // It ensures that the check for document.activeElement happens after the focus has updated. 
    // NOTE to self - read about this   

    // tabbing out of the last link:
    dropdownContent.querySelectorAll("a").forEach(link =>{
        // forEach link=> iterates over each element to add event listener
        link.addEventListener("keydown", function(e){
            if(e.key === 'Tab' && !e.shiftKey && e.target === dropdownContent.lastElementChild){
                // checking the following: 
                // key pressed is tab, it is not pressed with shift key (i.e. to go back), and the last element of dropdown is in focus
                closeDropdown();
            }
        });
    });

    // defining closeDropdown
    function closeDropdown() {
        dropdownButton.setAttribute("aria-expanded", "false");
        dropdownContent.classList.remove("show");
    }
});



document.getElementById("year").innerHTML = new Date().getFullYear();

// ______________________________________________________________________________________________

// Code for changing logo - code to change logo source based on screen width was generated using Github Copilot
// this code changes the logo source when the screen size is greater than 560px - this not desktop specific

const viewportWidth = window.innerWidth;
console.log(`view port width = ${viewportWidth}`);
const logo = document.getElementById("logo");
const logoMobile = "images/illustrations/mumsi-logo.png";
const logoDesktop = "images/illustrations/mumsi-logo-full.png";

function changeLogo () {
    if (window.innerWidth > 560) {
        logo.src = logoDesktop;
        logo.style.width = "120px";
        logo.style.height = "auto";
    } else {
        logo.src = logoMobile;
        logo.style.width = "40px";
        logo.style.height = "auto";
    }
}

window.addEventListener("resize", changeLogo);

changeLogo();

// function changeLogoBasedOnMediaQuery(mediaQuery) {
//     const logo = document.querySelector('#logo');
//     if (mediaQuery.matches) {
//         // If the media query matches the desktop size, change to the desktop logo
//         logo.src = 'images/illustrations/mumsi-logo-full.png';
//     } else {
//         // If the media query does not match (mobile size), use the mobile logo
//         logo.src = 'images/illustrations/mumsi-logo.png';
//     }
// }

// // Define a media query for desktop
// const desktopMediaQuery = window.matchMedia('(min-width: 920px)');

// // Call the function initially to set the correct logo on page load
// changeLogoBasedOnMediaQuery(desktopMediaQuery);

// desktopMediaQuery.addEventListener('change', (event) => {
//     changeLogoBasedOnMediaQuery(event);
// });



// ___________________________________________________________________________________________
// OLD CODE version 1.1 - THE FOLLOWING CODE IS INACCESSIBLE


// source code referenced and modified from: w3c schools dropdown
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_dropdown_navbar_click

// adding event listener to dopdown button
// document.querySelector(".dropbtn").addEventListener("click", dropdown);

// making the dropdown button open and close

// function dropdown() {
//     document.getElementById("myDropdown").classList.toggle("show");
// }

// // Close the dropdown if the user clicks outside of it
// // check for click in window
// window.onclick = function(e) {
//     // check if target click was dropdown button
//     if (!e.target.matches('.dropbtn')) {
//         let myDropdown = document.getElementById("myDropdown");
//         // remove class 'show' if the drop down is open and has class 'show'
//         if (myDropdown.classList.contains('show')) {
//             myDropdown.classList.remove('show');
//         }
//     }
// }