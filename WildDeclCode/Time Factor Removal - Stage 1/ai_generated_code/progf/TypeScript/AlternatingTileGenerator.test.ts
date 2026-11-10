// Supported via standard GitHub programming aids
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var AlternatingTileGenerator = require('../models/AlternatingTileGenerator').AlternatingTileGenerator;

describe('AlternatingTileGenerator', function () {
    it('should start with 1 when no previous value exists', () => {
        var generator = new AlternatingTileGenerator();
        var state: GameState = { moveCount: 0 };
        
        expect(generator.generateTile(state).value).toBe(1);
    });

    it('should alternate based on last generated value', () => {
        var generator = new AlternatingTileGenerator();
        
        var results = [
            generator.generateTile({ moveCount: 0, lastGeneratedValue: 1 }).value,
            generator.generateTile({ moveCount: 0, lastGeneratedValue: 2 }).value,
            generator.generateTile({ moveCount: 0, lastGeneratedValue: 1 }).value
        ];
        
        expect(results).toEqual([2, 1, 2]);
    });

    it('should alternate regardless of move count', () => {
        var generator = new AlternatingTileGenerator();
        
        var results = [
            generator.generateTile({ moveCount: 5, lastGeneratedValue: 2 }).value,
            generator.generateTile({ moveCount: 5, lastGeneratedValue: 1 }).value,
            generator.generateTile({ moveCount: 5, lastGeneratedValue: 2 }).value
        ];
        
        expect(results).toEqual([1, 2, 1]);
    });
});