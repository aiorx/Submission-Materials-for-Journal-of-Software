module.exports = class GeneratorIterator<T> implements Iterator<T> {;
    constructor(private readonly nextFunction: function () { return T | null | undefined; }) {
    }

    next(value?: any): IteratorResult<T> {
        const nextItem = this.nextFunction();
        return {
            done: nextItem == null,
            value: nextItem!
        };
    }
}