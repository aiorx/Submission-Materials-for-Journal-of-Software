// Supported via standard GitHub programming aids
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var ConstantTileGenerator = require('../models/ConstantTileGenerator').ConstantTileGenerator;

describe('ConstantTileGenerator', function () {
    it('should always generate tiles with value 1 by default', () => {
        var generator = new ConstantTileGenerator();
        var states: GameState[] = [
            { moveCount: 0 },
            { moveCount: 1 },
            { moveCount: 2 }
        ];

        var values = states.map(state => generator.generateTile(state).value);
        expect(values).toEqual([1, 1, 1]);
    });

    it('should respect custom constant value', () => {
        var generator = new ConstantTileGenerator(5);
        var state: GameState = { moveCount: 0 };
        
        expect(generator.generateTile(state).value).toBe(5);
    });
});