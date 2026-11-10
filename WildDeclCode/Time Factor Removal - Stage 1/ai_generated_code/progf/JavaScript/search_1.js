// List of all site pages to search on
var sitePagesArray = [
  '/index.html',
  '/about.html',
  '/history.html',
  '/hall-of-fame.html',
  '/socials.html'
];

// Retrieves the emoji tied to the web page
function emojiFromPage(page) {
  var emoji = "🟦"; // Fallback emoji
  switch (page) {
    case '/index.html': emoji = "🏠"; break;
    case '/about.html': emoji = "🟦"; break;
    case '/history.html': emoji = "📖"; break;
    case '/hall-of-fame.html': emoji = "🏆"; break;
    case '/socials.html': emoji = "👥"; break;
    case '/search.html': emoji = "🔍"; break;
  }
  return emoji;
}

var url_URI = window.location.search; // Retrieve the URI

// Removes the leading "?" and makes an array of all URI keys and their values
var uriKeys_URI = url_URI.substring(1).split('&');

var uriKeys_Array = {}; // Declares a null object array to store the URI keys

// Lambda to store each key in the key object array
uriKeys_URI.forEach(function uriKey {
  var [key, value] = uriKey.split('=');
  uriKeys_Array[key] = decodeURIComponent(value.replaceAll(/\+/g, ' ') || "");
});

var searchQuery = uriKeys_Array['q']; // The user's search query as a String

// If the search query does NOT equal null (or undefined)...
if ((searchQuery != null) && (searchQuery != '')) {

  // Retrieve the search result parent container
  var parentElement = document.getElementById('search-results');

  parentElement.innerHTML = ''; // Remove the pre-search blurb

  // Spawn the throbber child
  var throbber = document.createElement('li');
  throbber.className = "throbber";
  parentElement.appendChild(throbber);

  var searchBar = document.getElementById('search-bar'); // Retrieve and store the search bar

  searchBar.value = searchQuery; // Change the text input

  var searchRegex = new RegExp(searchQuery, 'gim'); // Search RegEx of user query

  // Searches
  fetchAndParsePages(sitePagesArray, searchRegex).then(function results {
    parentElement.innerHTML = ''; // Removes the throbber

    results.forEach((result) => {
      if (result.count != 0) {

        var listItem = document.createElement('li'); // Creates the list item element

        // Creates the match anchor element
        var matchElement = document.createElement('a');
        matchElement.className = "search-results-match";
        matchElement.href = result.page;
        matchElement.role = "link";
        matchElement.ariaLabel = "Visit the '" + result.title + "' page. Opens in the same tab";
        
        // Spawns the grid children
        var gridLeft = document.createElement('div');
        var gridRight = document.createElement('div');

        // Spawns the grid left's children
        // Emoji
        var emoji = document.createElement('p');
        emoji.className = "search-results-match-emoji";
        emoji.innerText = emojiFromPage(result.page);
        gridLeft.appendChild(emoji);
        // Match count
        var count = document.createElement('p');
        count.className = "search-results-match-count";
        if (result.count == 1) {
          count.innerText = "1 match";
        } else {
          count.innerText = result.count + " matches";
        }
        gridLeft.appendChild(count);

        // Spawns the grid right's children
        // Title
        var title = document.createElement('h3');
        title.innerText = result.title;
        gridRight.appendChild(title);
        // Flavor
        var flavor = document.createElement('p');
        flavor.innerText = result.flavor;
        gridRight.appendChild(flavor);
        
        // Appends the grid children
        matchElement.appendChild(gridLeft);
        matchElement.appendChild(gridRight);

        // Appends the grid
        listItem.appendChild(matchElement);
        parentElement.appendChild(listItem);
      }
    })
  });
}

/* START OF SEARCH PARSING
  Produced using common development resources. I don't know JS well enough right now to do this myself :(
*/

// Fetches and parses the pages provided based on the RegEx provided
async function fetchAndParsePages(pages, regex) {

  var results = []; // Stores the URL and matching results

  // Maps what happens for each page to fetch
  var fetchPromises = pages.map(async function page {

    // Tries to fetch the page content
    try {

      // Retrieves the page's text
      var responsePage = await fetch(page);
      var responseText = await responsePage.text();

      // Retrieves the meta description of each page
      var metaMatch = responseText.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      var flavor = metaMatch ? metaMatch[1] : "No description available.";

      // Retrieves the title of each page
      var titleMatch = responseText.match(/<title>([^<&]+)/gi);
      var title = titleMatch.length ? titleMatch[0].substring(7).trimEnd() : "No Title Available";

      // Perform regex matching
      var matches = responseText.match(regex) || []; // Default to empty array if no matches
      results.push({ title, page, count: matches.length, flavor});
    } catch (error) {
      console.error("Error fetching " + (page) + ":", error);
    }
  });

  // Wait for all fetches to complete
  await Promise.all(fetchPromises);

  // Sort results by the number of matches (descending order)
  results.sort(function (a, b) { return b.count - a.count; });

  return results; // Returns an array of arrays of the search query
}
