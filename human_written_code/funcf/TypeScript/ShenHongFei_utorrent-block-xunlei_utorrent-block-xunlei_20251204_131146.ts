```ts
async function exit () {
    await utorrent.stop_blocking()
    process.exit()
}
```