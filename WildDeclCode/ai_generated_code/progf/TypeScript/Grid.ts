// Aided with basic GitHub coding tools
import { defaultGridConfig, type GridConfig } from '../config/gridConfig';
import { Tile } from './Tile';
import type { GameState, TileGenerator } from './TileGenerator';

export class Grid {
    private readonly _tiles: (Tile | null)[][];

    constructor(
        private readonly width: number,
        private readonly height: number,
        private readonly config: GridConfig = defaultGridConfig
    ) {
        this.validateDimensions(width, height);
        this._tiles = Array(height).fill(null).map(() => 
            Array(width).fill(null)
        );
    }

    private validateDimensions(width: number, height: number): void {
        if (!Number.isInteger(width) || !Number.isInteger(height)) {
            throw new Error('Grid dimensions must be integers');
        }
        if (width < this.config.minWidth || width > this.config.maxWidth) {
            throw new Error(`Width must be between ${this.config.minWidth} and ${this.config.maxWidth}`);
        }
        if (height < this.config.minHeight || height > this.config.maxHeight) {
            throw new Error(`Height must be between ${this.config.minHeight} and ${this.config.maxHeight}`);
        }
    }

    get tiles(): ReadonlyArray<ReadonlyArray<Tile | null>> {
        return this._tiles;
    }

    get dimensions(): readonly [number, number] {
        return [this.width, this.height];
    }

    clone(): Grid {
        const newGrid = new Grid(this.width, this.height, this.config);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this._tiles[y][x];
                newGrid._tiles[y][x] = tile ? tile.clone() : null;
            }
        }
        return newGrid;
    }

    populateGrid(generator: TileGenerator, initialState: GameState): void {
        let state: GameState = { ...initialState };
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = generator.generateTile(state);
                this._tiles[y][x] = tile;
                // Update state with last generated value for next iteration
                state = { ...state, lastGeneratedValue: tile.value };
            }
        }
    }
}