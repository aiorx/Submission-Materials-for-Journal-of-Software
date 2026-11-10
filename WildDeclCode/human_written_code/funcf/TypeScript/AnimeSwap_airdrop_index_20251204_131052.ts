```typescript
async function getTxByVersion(version: string): Promise<EventMeta> {
  if (version2EventMeta[version]) return version2EventMeta[version]
  const tx = await sdk.resources.fetchTransactionByVersion<AptosTransaction>(BigInt(version))
  version2EventMeta[version] = {
    sender: tx.sender,
    timestamp: Number(tx.timestamp.substring(0, tx.timestamp.length - 6)),
  }
  return version2EventMeta[version]
}
```