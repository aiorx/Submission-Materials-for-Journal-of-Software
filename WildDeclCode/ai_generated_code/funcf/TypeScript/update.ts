{
  compare: (previousValue, newValue) =>
    newValue.every(newNode => previousValue?.some(node => node._id === newNode._id)) &&
    previousValue?.every(node => newValue.some(newNode => newNode._id === node._id)),
  merge: (previousValue, newValue, { previousParent, parent, recurse }) => {
    if (!newValue.length) return previousValue
    if (!previousValue) return newValue

    const results = [
      ...previousValue?.filter(node => newValue.some(newNode => newNode._id !== node._id)) ?? [],
      ...newValue ?? []
    ].filter(Boolean) as Media[]

    const groupByUri =
      groupBy(
        results,
        result => result.uri
      )

    return [...groupByUri.values()].map(nodes => nodes[0])
  }
}