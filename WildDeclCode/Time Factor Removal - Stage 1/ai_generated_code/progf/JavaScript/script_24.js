/**
 * Welcome to the script of KODAM ONLINE Terpercaya
 * 
 * Made by Charisma Pramudya Rusdiyanto
 * Designed by Charisam Pramudya Rusdiyanto
 * mainly coded using chat GPT
 * 
 * "I am glad that I can put this website into an action.
 * My rationalle behind making this website is I want to
 * learn web developing by putting a thing into an acton.
 * As I am a newbie, I started using plain HTML, CSS, JS
 * without any aid of a web platform, e.g ANGULAR, REACT,
 * or FLUTTER. Determing the idea was the hardest part.
 * In my country, Indonesia, A really famous trend 
 * so-called KODAM was on hit. I combine the idea of this
 * trend and my learning by making KODAM Specifier prank website.
 * The main code is mainly Composed with basic coding tools, by the mean
 * time, i learn how the code and the logic are constructed as well.
 * I hope that my viewers are entertained with y content.
 * This content is not intentionally made to offence any
 * kind of religion, race or any group in particular."
 * 
 * -C
 */


/**
 * SubmitName 
 * 
 * The main script of the website
 * @returns 
 */
function submitName() {
    var nameInput = document.getElementById('nameInput').value;
    var progress = document.getElementById('progress');


    if (nameInput.trim() === '') {
        alert('Please enter your name.');
        return;
    }


    progress.style.display = 'block'; // Show the waiting message
    result.textContent = '';
    description.textContent = '';
    document.querySelector('button').disabled = true;

    setTimeout(function () {
        progress.style.display = 'none';
        document.querySelector('button').disabled = false;
        fetchData(nameInput);
        setTimeout(() => {
            loadContainer();
            setTimeout( () => {
                window.location.href = 'https://www.youtube.com/watch?v=Q3bWmyvyA-I&ab_channel=CINEMA21';
            }, 5000);
        }, 8000); // 10 seconds delay before redirect

    }, 3000); // 3 seconds delay to display result
}

/**
 * fetchData : this function is used to determine the kodam based on the input wiht encryption process
 * 
 * @param {String} name : The inputted name
 */
function fetchData (name) {
    fetch('kodam.json')
        .then(function response { return response.json(); })
        .then(function data {
            nameHasher(name).then(hashers => {
                hashers %= data.kodam.length;
                var result = document.getElementById('result');
                var description = document.getElementById('description');

                result.textContent = data.kodam[hashers].hewan;
                description.textContent = data.kodam[hashers].deskripsi;
            
            });
        })
        .catch (function error { return alert('fetch gagal'); });
}

/**
 * loadContainer : this function is used to switch the main content to another content (as part of the prank)
 * 
 * 
 */
function loadContainer() {
    fetch('pelengkap1.html')
        .then(function response { return response.text(); })
        .then(function data {
            var mainContainer = document.getElementById('mainContainer');
            mainContainer.innerHTML = data;
        })
        .catch(function error { return alert('hayolo error'); })
}

/**
 * nameHasher : this function is used to hsh namein to an integer.
 *              The hashing is done by encrypt the input using SHA-256.
 *              As the result returns array of int, we add all the value.
 * 
 * @param {*string} name 
 * @returns the outcome of the hashing
 */
async function nameHasher( name ) {
    name = name.toLowerCase();
    var encoder = new TextEncoder();
    var data = encoder.encode(name);
    var hashBuffer = await crypto.subtle.digest('SHA-256', data);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    var hashHex = hashArray.map(function b { return b.toString(16).padStart(2, '0'); }).join('');
    var count = 0;
    for (var k = 0 ; k < hashArray.length; k++) {
        count += hashArray[k];
    }
    return count;
}
