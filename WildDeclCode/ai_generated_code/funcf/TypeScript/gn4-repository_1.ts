// Aided with basic GitHub coding tools
  getAllDrafts(): Observable<CatalogRecord[]> {
    const items = { ...window.localStorage }
    const drafts = Object.keys(items)
      .filter((key) => key.startsWith('geonetwork-ui-draft-'))
      .map((key) => window.localStorage.getItem(key))
      .filter((draft) => draft !== null)
    return from(
      Promise.all(
        drafts.map((draft) => {
          return findConverterForDocument(draft).readRecord(draft)
        })
      )
    )
  }