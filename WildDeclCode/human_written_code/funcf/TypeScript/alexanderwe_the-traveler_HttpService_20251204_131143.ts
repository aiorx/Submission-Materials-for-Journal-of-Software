```typescript
public post(url: string, data: got.GotJSONOptions): Promise<object> {
  if (this.debug) {
    Logger.debug(`POST - ${url}`);
  }

  return new Promise<object>((resolve, reject) => {
    got
      .post(url, data)
      .then(response => {
        resolve(response.body);
      })
      .catch(err => {
        reject(err);
      });
  });
}
```