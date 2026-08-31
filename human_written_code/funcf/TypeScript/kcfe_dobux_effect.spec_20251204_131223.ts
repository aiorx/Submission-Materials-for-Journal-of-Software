```typescript
it('effect should throw error when has error', () => {
  const store = createStore({
    counter,
  })
  const { Provider, useModel } = store

  const { result } = createHook(Provider, useModel, 'counter')

  const fetchError = result.current.effects.fetchError

  return fetchError().catch((err: any) => {
    expect(err).toBe('customer error')
  })
})
```