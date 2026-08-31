// Supported via standard GitHub programming aids
export class Tile {
    constructor(
        private readonly _value: number
    ) {}

    get value(): number {
        return this._value;
    }

    public clone(): Tile {
        return new Tile(this._value);
    }
}