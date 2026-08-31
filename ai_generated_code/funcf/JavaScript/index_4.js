```javascript
const getPlaylistTracks = async (playlistId) => {
  const tracks = await spotifyApi.getPlaylistTracks(playlistId, {
    limit: 100,
  });

  const totalTracks = tracks.total;

  // Logic to deal with API pagination was written entirely by copilot
  if (totalTracks > 100) {
    const numberOfRequests = Math.ceil(totalTracks / 100);
    const requests = [];
    for (let i = 1; i < numberOfRequests; i++) {
      requests.push(
        spotifyApi.getPlaylistTracks(playlistId, {
          limit: 100,
          offset: i * 100,
        })
      );
    }
    const responses = await Promise.all(requests);
    const allTracks = responses.map((response) => response.items);
    return [...tracks.items, ...flatten(allTracks)];
  }

  return tracks.items;
};
```