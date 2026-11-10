/*
Assisted with basic coding tools
*/
function previewImage(event) {
    var file = event.target.files[0];
    var previewDiv = document.getElementById('preview');

    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // Update the preview div with the uploaded image
            previewDiv.innerHTML = '<img src="' + (e.target.result) + '" alt="Image Preview">';
        };
        reader.readAsDataURL(file); // Convert the image to a base64 URL
    } else {
        previewDiv.innerHTML = '<p>No image selected</p>';
    }
}

async function submitForm() {
    var model = document.getElementById('model').value;
    var apiKey = document.getElementById('api_key').value;
    var imageFile = document.getElementById('image_file').files[0];
    var responseDiv = document.getElementById('response');
    var submitBtn = document.getElementById('submitBtn');

    // Clear any previous responses
    responseDiv.innerHTML = '';

    if (!imageFile) {
        responseDiv.innerHTML = '<p style="color: red;">Please upload an image file.</p>';
        return;
    }

    // Convert image file to base64
    var base64Image = await toBase64(imageFile);

    // Disable button and show loading text
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loader"></span> Extracting data from image, this may take a while...';

    try {
        // Make API request
        var response = await fetch('/api/process/pricetag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                api_key: apiKey,
                image_base64: base64Image
            })
        });

        // Parse and display response
        if (response.ok) {
            var result = await response.json();
            responseDiv.innerHTML = "<pre>" + (JSON.stringify(result, null, 2)) + "</pre>";
        } else {
            var error = await response.json();
            var errorMessage = '<p style="color: red;">Errors:</p><ul style="color: red;">';
            // Check if error.detail exists and is an array
            if (error && Array.isArray(error.detail)) {
                error.detail.forEach(function (item) {
                    if (item && typeof item === 'object') {
                        errorMessage += "<li><p>" + (item.error) + "<br><strong>detailed_info:</strong> " + (item.detailed_info) + "</p></li>";
                    }
                });
            } else {
                // If error.detail is not an array, display the fallback message
                errorMessage += "<li>Unable to process</li>";
            }
            errorMessage += "</ul>";
            // Insert the formatted error message into the responseDiv
            responseDiv.innerHTML = errorMessage;
        }
    } catch (error) {
        responseDiv.innerHTML = '<p style="color: red;">Error: ' + (error.message) + "</p>";
    } finally {
        // Re-enable button and reset text
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Process Image';
    }
}

// Helper function to convert image file to base64
function toBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}