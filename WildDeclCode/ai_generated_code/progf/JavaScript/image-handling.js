function getDeploymentContextPath(url) {
    if (url == null)
        url = new URL(window.location.href);
    const deployPath = url.pathname.split('/')[1];
    if (deployPath === 'test' || deployPath === 'prod')
        return '/' + deployPath;
    else
        return '';
}

/**
 * Reads the URL and creates a list of key-value pairs of query parameters where the first
 *  parameter will have a POST request made to its link to handle saving the image to the database
 *
 * @returns {URLSearchParams} The query parameters
 */
function setParamsFromUrl() {
    let params = new URLSearchParams();
    const url = new URL(window.location.href);
    const deployPath = getDeploymentContextPath(url);
    const pathname = url.pathname.replace(deployPath, '');

    let gardenID = null;

    switch (pathname) {
        case '/view-garden':
            gardenID = url.searchParams.get('gardenID');
            params.append('view-garden', 'true');
            params.append('gardenID', gardenID);
            break;
        case '/edit-plant':
            const plantID = url.searchParams.get('plantID');
            params.append('edit-plant-picture', 'true');
            params.append('plantID', plantID);
            break;
        case '/create-plant':
            params.append('create-plant-picture', 'true');
            gardenID = url.searchParams.get('gardenID');
            params.append('gardenID', gardenID);
            break;
        case '/view-user-profile':
            params.append('view-user-profile', 'true');
            break;
        case '/edit-user-profile':
            params.append('edit-user-profile-image', 'true');
            break;
        //Add more cases as needed
        default:
            console.log('No match!');
    }
    return params;
}

let defaultImageBorder = null;
let errorImage = null;

//Mostly all Aided via basic GitHub coding utilities
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.querySelector('.file-input');
    const images = document.querySelectorAll('img');
    const imagePickers = document.querySelectorAll('.image-picker, .image-picker-small');
    const form = document.querySelector('form.hasImage');

    let image = null;
    let file = null;
    let id = null;

    imagePickers.forEach(button => {
        button.addEventListener('click', function(event) {
            const buttonID = button.getAttribute('image-button-id');
            if (buttonID != null) {
                id = buttonID;
                images.forEach(tmpImage => { //Should only be one image
                    if (tmpImage.getAttribute('data-plant-id') === buttonID) {
                        image = tmpImage;
                        console.log("Image for plant id: " + buttonID)
                    } else if (tmpImage.getAttribute('data-user-id') === buttonID) {
                        image = tmpImage;
                        console.log("Image for user id: " + buttonID)
                    }
                });
                fileInput.click();
            }
        });
    });

    // Add an event listener to the file input
    fileInput.addEventListener('change', function(event) {
        file = filePicked(event, image, id, form);
    });

    form != null && form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitAction(file, id, form, image, true);
    });

});

function filePicked(event, image, id, form) {
    // console.log("User or Plant ID: " + plantID)
    const file = event.target.files[0];
    const url = new URL(window.location.href);
    const deployPath = getDeploymentContextPath(url);
    const pathname = url.pathname.replace(deployPath, '');
    // const isTemporary = pathname !== '/view-garden' && pathname !== '/view-user-profile';
    const isTemporary = pathname === '/create-plant';

    if (!validateFile(file, image)) {
        return;
    }

    let tempImageId = null;
    let fileRequestBody = new FormData();
    fileRequestBody.append('_csrf', getCsrfToken());
    fileRequestBody.append('file', file);

    if (isTemporary) {
        fileRequestBody.append('isTemporary', true);

        fetch(deployPath + '/upload-image', {
            method: 'POST',
            body: fileRequestBody
        })
            .then(response => response.text())
            .then(body => {
                tempImageId = Number.parseInt(body, 10);
                console.log("body: " + body);
                image.src = `${deployPath}/get-image?temporary=true&imageID=${tempImageId}`;
                console.log("Image source: " + image.src)
                image.style.display = "block";
            })
            .catch(error => console.error(error));
    } else {
        submitAction(file, id, form, image, false);
    }

    return file;
}

function submitAction(file, id, form, image, submitClicked) {
    const url = new URL(window.location.href);
    const deployPath = getDeploymentContextPath(url);
    const pathname = url.pathname.replace(deployPath, '');

    if (pathname === '/upload-image' && file == null) {
        alert('Please select a file')
        return;
    }

    if (submitClicked && pathname !== '/create-plant') {
        form.submit();
        return;
    }

    let formData = new FormData();
    const params = window.setParamsFromUrl();
    let fetchURL = null
    let isFirstKey = true;
    for (const [key, value] of params.entries()) {
        if (isFirstKey) {
            fetchURL = '/' + key
            isFirstKey = false;
            continue;
        }
        formData.append(key, value);
    }

    if (fetchURL != null)
        console.log('Fetch URL: ' + fetchURL)
    else {
        console.log('No fetch URL found')
        return;
    }

    formData.append('file', file);
    formData.append('_csrf', getCsrfToken());
    if (fetchURL === '/edit-user-profile-image' || fetchURL === '/view-user-profile') {
        formData.append('userID', id);
    } else if (fetchURL === '/view-garden') {
        formData.append('plantID', id);
    }

    // params.delete(fetchURL.substring(1));
    fetch(deployPath + fetchURL, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (submitClicked && form != null)
                form.submit();
            else {
                image.src += '&t=' + new Date().getTime();
            }
        })
        .catch(error => console.error(error));
}

//Aided via basic GitHub coding utilities
function validateFile(file, image) {
    if (file == null)
        return false;


    const allowedImageTypes = ['jpeg', 'png', 'svg+xml'];
    const contentType = file.type.split('/').pop();
    const maxSize = 10 * 1024 * 1024; // 10MB
    let imageError = document.getElementById('imageError');

    if (errorImage) {
        errorImage.style.border = defaultImageBorder;
        errorImage = null;
    }

    if (!allowedImageTypes.includes(contentType)) {
        // alert('Image must be of type png, jpg or svg');
        if (imageError != null) {
            errorImage = image;
            defaultImageBorder = errorImage.style.border;
            imageError.textContent = 'Image must be of type jpeg, png, or svg';
            errorImage.style.border = "2px solid #DE2929";
        }
        return false;
    } else if (file.size > maxSize) {
        // alert('Image must be less than 10MB');
        if (imageError != null) {
            errorImage = image;
            defaultImageBorder = errorImage.style.border;
            imageError.textContent = 'Image must be less than 10MB';
            errorImage.style.border = "2px solid #DE2929";
        }
        return false;
    }
    if (imageError != null) {
        imageError.textContent = '';
    }

    return true;
}

//Aided via basic GitHub coding utilities
function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, 'XSRF-TOKEN'.length + 1) === ('XSRF-TOKEN' + '=')) {
                cookieValue = decodeURIComponent(cookie.substring('XSRF-TOKEN'.length + 1));
                break;
            }
        }
    }
    console.log('XSRF-TOKEN: ' + cookieValue)
    return cookieValue;
}