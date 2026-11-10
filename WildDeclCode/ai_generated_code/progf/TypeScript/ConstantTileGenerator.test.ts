// Supported via standard GitHub programming aids
import { describe, it, expect } from 'vitest';
import { ConstantTileGenerator } from '../models/ConstantTileGenerator';
import type { GameState } from '../models/TileGenerator';

describe('ConstantTileGenerator', () => {
    it('should always generate tiles with value 1 by default', () => {
        const generator = new ConstantTileGenerator();
        const states: GameState[] = [
            { moveCount: 0 },
            { moveCount: 1 },
            { moveCount: 2 }
        ];

        const values = states.map(state => generator.generateTile(state).value);
        expect(values).toEqual([1, 1, 1]);
    });

    it('should respect custom constant value', () => {
        const generator = new ConstantTileGenerator(5);
        const state: GameState = { moveCount: 0 };
        
        expect(generator.generateTile(state).value).toBe(5);
    });
});