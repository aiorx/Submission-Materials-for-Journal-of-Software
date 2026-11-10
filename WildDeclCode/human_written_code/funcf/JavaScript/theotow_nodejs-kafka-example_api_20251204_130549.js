```js
function enrichPayloadMaybe(payload) {
  switch (payload.eventId) {
    case 'createJobRequest': {
      return Object.assign({}, payload, { jobRequestId: shortid.generate() });
    }
    default: {
      return payload;
    }
  }
}
```