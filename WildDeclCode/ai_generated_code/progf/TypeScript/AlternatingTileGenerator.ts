// Assisted using common GitHub development utilities
import { Tile } from './Tile';
import type { GameState, TileGenerator } from './TileGenerator';

export class AlternatingTileGenerator implements TileGenerator {
    generateTile(state: GameState): Tile {
        // If no last value or last value was 2, generate 1
        const nextValue = (!state.lastGeneratedValue || state.lastGeneratedValue === 2) ? 1 : 2;
        return new Tile(nextValue);
    }
}