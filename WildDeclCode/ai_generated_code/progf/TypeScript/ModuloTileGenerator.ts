// Aided with basic GitHub coding tools
import { Tile } from './Tile';
import type { GameState, TileGenerator } from './TileGenerator';

export class ModuloTileGenerator implements TileGenerator {
    constructor(private readonly baseValue: number = 1) {}

    generateTile(state: GameState): Tile {
        // Simple deterministic generation based on move count modulo 3
        // Adding baseValue (default 1) gives us values 1,2,3 instead of 0,1,2
        const value = (state.moveCount % 3) + this.baseValue;
        return new Tile(value);
    }
}