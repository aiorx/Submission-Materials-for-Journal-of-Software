// Supported via standard GitHub programming aids
var describe = require('vitest').describe;
var it = require('vitest').it;
var expect = require('vitest').expect;
var Grid = require('../models/Grid').Grid;
var defaultGridConfig = require('../config/gridConfig').defaultGridConfig;
var ConstantTileGenerator = require('../models/ConstantTileGenerator').ConstantTileGenerator;
var AlternatingTileGenerator = require('../models/AlternatingTileGenerator').AlternatingTileGenerator;

describe('Grid', function () {
    it('should initialize with given dimensions', () => {
        var grid = new Grid(4, 5);
        var [width, height] = grid.dimensions;
        expect(width).toBe(4);
        expect(height).toBe(5);
    });

    it('should initialize with empty tiles', () => {
        var grid = new Grid(3, 3);
        expect(grid.tiles.length).toBe(3);
        expect(grid.tiles[0].length).toBe(3);
        expect(grid.tiles.every(row => row.every(tile => tile === null))).toBe(true);
    });

    it('should validate minimum dimensions', () => {
        expect(() => new Grid(defaultGridConfig.minWidth - 1, 4)).toThrow();
        expect(() => new Grid(4, defaultGridConfig.minHeight - 1)).toThrow();
    });

    it('should validate maximum dimensions', () => {
        expect(() => new Grid(defaultGridConfig.maxWidth + 1, 4)).toThrow();
        expect(() => new Grid(4, defaultGridConfig.maxHeight + 1)).toThrow();
    });

    it('should validate integer dimensions', () => {
        expect(() => new Grid(3.5, 4)).toThrow();
        expect(() => new Grid(4, 3.5)).toThrow();
    });

    it('should create an independent copy when cloned', () => {
        var original = new Grid(3, 3);
        var clone = original.clone();
        expect(clone.dimensions).toEqual(original.dimensions);
        expect(clone).not.toBe(original);
        expect(clone.tiles).not.toBe(original.tiles);
    });

    describe('populateGrid', () => {
        it('should fill all cells with tiles', () => {
            var grid = new Grid(3, 3);
            var generator = new ConstantTileGenerator(1);
            var state: GameState = { moveCount: 0 };

            grid.populateGrid(generator, state);

            expect(grid.tiles.every(row => row.every(tile => tile !== null))).toBe(true);
        });

        it('should use generator to create tiles', () => {
            var grid = new Grid(2, 2);
            var generator = new ConstantTileGenerator(5);
            var state: GameState = { moveCount: 0 };

            grid.populateGrid(generator, state);

            expect(grid.tiles.every(row => 
                row.every(tile => tile?.value === 5)
            )).toBe(true);
        });

        it('should maintain generator state between tiles', () => {
            var grid = new Grid(2, 2);
            var generator = new AlternatingTileGenerator();
            var state: GameState = { moveCount: 0 };

            grid.populateGrid(generator, state);

            // Should alternate 1,2,1,2 in row-major order
            expect(grid.tiles[0][0]?.value).toBe(1);
            expect(grid.tiles[0][1]?.value).toBe(2);
            expect(grid.tiles[1][0]?.value).toBe(1);
            expect(grid.tiles[1][1]?.value).toBe(2);
        });
    });
});