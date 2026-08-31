// Supported via standard GitHub programming aids
import { Tile } from './Tile';

export interface GameState {
    readonly moveCount: number;
    readonly seed?: number;
    readonly lastGeneratedValue?: number;
}

export interface TileGenerator {
    generateTile(state: GameState): Tile;
}