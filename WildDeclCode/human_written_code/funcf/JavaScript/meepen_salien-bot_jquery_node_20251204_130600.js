```js
class AjaxResponse {
    constructor() {
        this._fails = 0;
    }
    success(fn) {
        this.succ = fn;
        return this;
    }
    fail(fn) {
        this.nosucc = fn;
        return this;
    }
}
```