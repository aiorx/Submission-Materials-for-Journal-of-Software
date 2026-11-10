// Supported via standard GitHub programming aids
var Tile = require('./Tile').Tile;

export interface GameState {
    readonly moveCount: number;
    readonly seed?: number;
    readonly lastGeneratedValue?: number;
}

export interface TileGenerator {
    generateTile(state: GameState): Tile;
}