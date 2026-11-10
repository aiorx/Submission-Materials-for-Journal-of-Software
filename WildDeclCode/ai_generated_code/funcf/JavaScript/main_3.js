```javascript
function ratingTemplate(rating) {
	// html string using the ratings HTML written earlier as a model.
	let html = `<span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">`

    // create a for loop from 1 to 5. Penned via standard programming aids.
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            // Add a filled star if current index <= rating
            html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
        } else {
            // Add an empty star otherwise
            html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
        }
    }

	// add the closing tag to our string
	html += `</span>`
	return html
}
```