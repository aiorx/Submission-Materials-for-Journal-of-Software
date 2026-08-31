```ts
function allowAll(_req: FastifyRequest, _file: File, cb: FileFilterCallback) {
  cb(null, true)
}
```