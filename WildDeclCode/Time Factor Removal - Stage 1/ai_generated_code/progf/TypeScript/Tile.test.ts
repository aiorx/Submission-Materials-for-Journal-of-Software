// Assisted using common GitHub development utilities
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var Tile = require('../models/Tile').Tile;

describe('Tile', function () {
    it('should store and return its value', () => {
        var tile = new Tile(5);
        expect(tile.value).toBe(5);
    });

    it('should create an independent copy when cloned', () => {
        var original = new Tile(3);
        var clone = original.clone();
        
        expect(clone.value).toBe(original.value);
        expect(clone).not.toBe(original);
    });
});