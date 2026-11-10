```js
// Genre mapping code Assisted with basic coding tools:
// Function to find the broad genre based on keywords
function categorizeGenres(genres) {
  let genreCount = {}; // This will keep track of how many times each broad genre is found.

  // Loop through each genre given by Spotify
  for (let genre of genres) {
    // Loop through each broad genre category in genreMapping
    for (let broadGenre in genreMapping) {
      // Get the keywords for the current broad genre
      let keywords = genreMapping[broadGenre];

      // Check if any keyword matches the current genre
      for (let keyword of keywords) {
        if (genre.toLowerCase().includes(keyword)) {
          // If it matches, increase the count for this broad genre
          if (genreCount[broadGenre]) {
            genreCount[broadGenre] += 1;
          } else {
            genreCount[broadGenre] = 1;
          }
        }
      }
    }
  }

  // Find the broad genre with the most matches
  let maxCount = 0;
  let selectedGenre = 'Unknown';

  // Loop through genreCount to find the genre with the highest count
  for (let broadGenre in genreCount) {
    if (genreCount[broadGenre] > maxCount) {
      maxCount = genreCount[broadGenre];
      selectedGenre = broadGenre;
    }
  }

  return selectedGenre;
}
```