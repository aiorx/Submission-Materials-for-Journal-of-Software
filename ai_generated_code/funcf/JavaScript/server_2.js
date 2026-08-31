```js
switch (true) {
    case req.url.includes("/getDate?name=") : {
        this.#getDateAndName(req, res)
        break
    }
    case req.url.includes("/readFile?fileName=") : {
        this.#readFromFile(req, res)
        break
    }
    case req.url.includes("/writeFile?text=") : {
        this.#writeToFile(req, res)
        break
    }
    default : {
        this.#wrongEndpoint(req, res)
    }
}
```