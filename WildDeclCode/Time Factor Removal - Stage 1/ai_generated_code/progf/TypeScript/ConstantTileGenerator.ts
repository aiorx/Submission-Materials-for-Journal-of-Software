// Aided with basic GitHub coding tools
var Tile = require('./Tile').Tile;

class ConstantTileGenerator implements TileGenerator {
    constructor(private readonly constantValue: number = 1) {}

    generateTile(_state: GameState): Tile {
        return new Tile(this.constantValue);
    }
}