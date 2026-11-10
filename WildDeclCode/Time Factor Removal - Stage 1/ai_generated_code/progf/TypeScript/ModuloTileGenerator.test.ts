// Aided with basic GitHub coding tools
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var ModuloTileGenerator = require('../models/ModuloTileGenerator').ModuloTileGenerator;

describe('ModuloTileGenerator', function () {
    it('should generate predictable sequence based on move count', () => {
        var generator = new ModuloTileGenerator();
        var states: GameState[] = [
            { moveCount: 0 },
            { moveCount: 1 },
            { moveCount: 2 },
            { moveCount: 3 } // Should wrap back to first value
        ];

        var values = states.map(state => generator.generateTile(state).value);
        expect(values).toEqual([1, 2, 3, 1]);
    });

    it('should be deterministic for same move count', () => {
        var generator = new ModuloTileGenerator();
        var state: GameState = { moveCount: 1 };
        
        var tile1 = generator.generateTile(state);
        var tile2 = generator.generateTile(state);
        
        expect(tile1.value).toBe(tile2.value);
    });

    it('should respect custom base value', () => {
        var generator = new ModuloTileGenerator(2);
        var states: GameState[] = [
            { moveCount: 0 },
            { moveCount: 1 },
            { moveCount: 2 }
        ];

        var values = states.map(state => generator.generateTile(state).value);
        expect(values).toEqual([2, 3, 4]);
    });
});