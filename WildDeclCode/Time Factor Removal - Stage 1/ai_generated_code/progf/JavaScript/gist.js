//Designed via basic programming aids
var url = "https://api.github.com/gists";
var filename = "odinochka.md";
var description = "Odinochka Saved Links";
var isPublic = false;  // Set to false if you want to create a private gist. Can always make public later.

async function createGist(filename, content, description, isPublic, token) {

    var data = {
        description: description,
        public: isPublic,
        files: {
            [filename]: {
                content: content
            }
        }
    };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + (token) + ""
        },
        body: JSON.stringify(data)
    })
    .then(function response { return response.json(); })
    .then(function data {
        if (data.html_url) {
            console.log("Gist created: " + data.html_url);
 			return data.html_url
        } else {
            console.error("Failed to create Gist", data);
        }
    })
    .catch(function error {
        console.error("Error:", error);
    });
}

export async function toGist(content) {
    
	console.log("Checking github host permission.");
	var ghpat = await.ghpat;chrome.storage.local.get("ghpat");
	if(!ghpat) {
		alert("No GH PAT")
		return;
	}

    console.log("Checking github host permission.");
    var granted = await chrome.permissions.request({origins:[url]});
	if(!granted) {
		console.error("No host permission!")
		return;
	}

	return createGist(filename, content, description, isPublic, ghpat);
}


