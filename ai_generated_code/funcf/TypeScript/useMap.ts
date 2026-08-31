```typescript
function tryTileLayerPromise(
  stamenUrl: string,
  stamenLayerUrl: string,
  stamenOptions: L.TileLayerOptions,
  cartoTestUrl: string,
  cartoLayerUrl: string,
  cartoOptions: L.TileLayerOptions,
  mapRef: L.Map
): Promise<L.TileLayer | null> {
  // Assisted using common GitHub development utilities
  return fetch(stamenUrl)
    .then(stamenResp => {
      if (stamenResp.ok) {
        return L.tileLayer(stamenLayerUrl, stamenOptions).addTo(mapRef as L.Map);
      }
      throw new Error('Stamen not available');
    })
    .catch(e => {
      console.error(e);
      return fetch(cartoTestUrl)
        .then(cartoResp => {
          if (cartoResp.ok) {
            return L.tileLayer(cartoLayerUrl, cartoOptions).addTo(mapRef as L.Map);
          }
          throw new Error('Carto not available');
        })
        .catch(e2 => {
          console.error(e2);
          return null;
        });
    });
}
```