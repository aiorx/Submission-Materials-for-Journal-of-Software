// Aided with basic GitHub coding tools
import { describe, it, expect } from 'vitest';
import { ModuloTileGenerator } from '../models/ModuloTileGenerator';
import type { GameState } from '../models/TileGenerator';

describe('ModuloTileGenerator', () => {
    it('should generate predictable sequence based on move count', () => {
        const generator = new ModuloTileGenerator();
        const states: GameState[] = [
            { moveCount: 0 },
            { moveCount: 1 },
            { moveCount: 2 },
            { moveCount: 3 } // Should wrap back to first value
        ];

        const values = states.map(state => generator.generateTile(state).value);
        expect(values).toEqual([1, 2, 3, 1]);
    });

    it('should be deterministic for same move count', () => {
        const generator = new ModuloTileGenerator();
        const state: GameState = { moveCount: 1 };
        
        const tile1 = generator.generateTile(state);
        const tile2 = generator.generateTile(state);
        
        expect(tile1.value).toBe(tile2.value);
    });

    it('should respect custom base value', () => {
        const generator = new ModuloTileGenerator(2);
        const states: GameState[] = [
            { moveCount: 0 },
            { moveCount: 1 },
            { moveCount: 2 }
        ];

        const values = states.map(state => generator.generateTile(state).value);
        expect(values).toEqual([2, 3, 4]);
    });
});