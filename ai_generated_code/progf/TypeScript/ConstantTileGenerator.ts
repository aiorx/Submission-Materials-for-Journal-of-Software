// Aided with basic GitHub coding tools
import { Tile } from './Tile';
import type { GameState, TileGenerator } from './TileGenerator';

export class ConstantTileGenerator implements TileGenerator {
    constructor(private readonly constantValue: number = 1) {}

    generateTile(_state: GameState): Tile {
        return new Tile(this.constantValue);
    }
}