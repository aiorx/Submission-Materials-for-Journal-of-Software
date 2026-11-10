// Aided with basic GitHub coding tools
var defaultGridConfig = require('../config/gridConfig').defaultGridConfig;
var type = require('../config/gridConfig').type;
var GridConfig = require('../config/gridConfig').GridConfig;
var Tile = require('./Tile').Tile;

class Grid {
    private readonly _tiles: (Tile | null)[][];

    constructor(
        private readonly width: number,
        private readonly height: number,
        private readonly config: GridConfig = defaultGridConfig
    ) {
        this.validateDimensions(width, height);
        this._tiles = Array(height).fill(null).map(function () { return Array(width).fill(null); });
    }

    private validateDimensions(width: number, height: number): void {
        if (!Number.isInteger(width) || !Number.isInteger(height)) {
            throw new Error('Grid dimensions must be integers');
        }
        if (width < this.config.minWidth || width > this.config.maxWidth) {
            throw new Error("Width must be between " + (this.config.minWidth) + " and " + (this.config.maxWidth) + "");
        }
        if (height < this.config.minHeight || height > this.config.maxHeight) {
            throw new Error("Height must be between " + (this.config.minHeight) + " and " + (this.config.maxHeight) + "");
        }
    }

    get tiles(): ReadonlyArray<ReadonlyArray<Tile | null>> {
        return this._tiles;
    }

    get dimensions(): readonly [number, number] {
        return [this.width, this.height];
    }

    clone(): Grid {
        var newGrid = new Grid(this.width, this.height, this.config);
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var tile = this._tiles[y][x];
                newGrid._tiles[y][x] = tile ? tile.clone() : null;
            }
        }
        return newGrid;
    }

    populateGrid(generator: TileGenerator, initialState: GameState): void {
        var state: GameState = { ...initialState };
        
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var tile = generator.generateTile(state);
                this._tiles[y][x] = tile;
                // Update state with last generated value for next iteration
                state = { ...state, lastGeneratedValue: tile.value };
            }
        }
    }
}