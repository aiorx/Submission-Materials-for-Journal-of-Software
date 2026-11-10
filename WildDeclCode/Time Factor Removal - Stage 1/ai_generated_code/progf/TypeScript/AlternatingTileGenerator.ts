// Assisted using common GitHub development utilities
var Tile = require('./Tile').Tile;

class AlternatingTileGenerator implements TileGenerator {
    generateTile(state: GameState): Tile {
        // If no last value or last value was 2, generate 1
        var nextValue = (!state.lastGeneratedValue || state.lastGeneratedValue === 2) ? 1 : 2;
        return new Tile(nextValue);
    }
}