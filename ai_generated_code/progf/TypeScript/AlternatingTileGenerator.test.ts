// Supported via standard GitHub programming aids
import { describe, it, expect } from 'vitest';
import { AlternatingTileGenerator } from '../models/AlternatingTileGenerator';
import type { GameState } from '../models/TileGenerator';

describe('AlternatingTileGenerator', () => {
    it('should start with 1 when no previous value exists', () => {
        const generator = new AlternatingTileGenerator();
        const state: GameState = { moveCount: 0 };
        
        expect(generator.generateTile(state).value).toBe(1);
    });

    it('should alternate based on last generated value', () => {
        const generator = new AlternatingTileGenerator();
        
        const results = [
            generator.generateTile({ moveCount: 0, lastGeneratedValue: 1 }).value,
            generator.generateTile({ moveCount: 0, lastGeneratedValue: 2 }).value,
            generator.generateTile({ moveCount: 0, lastGeneratedValue: 1 }).value
        ];
        
        expect(results).toEqual([2, 1, 2]);
    });

    it('should alternate regardless of move count', () => {
        const generator = new AlternatingTileGenerator();
        
        const results = [
            generator.generateTile({ moveCount: 5, lastGeneratedValue: 2 }).value,
            generator.generateTile({ moveCount: 5, lastGeneratedValue: 1 }).value,
            generator.generateTile({ moveCount: 5, lastGeneratedValue: 2 }).value
        ];
        
        expect(results).toEqual([1, 2, 1]);
    });
});