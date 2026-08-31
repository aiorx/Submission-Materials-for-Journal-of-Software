// Assisted using common GitHub development utilities
import { describe, it, expect } from 'vitest';
import { Tile } from '../models/Tile';

describe('Tile', () => {
    it('should store and return its value', () => {
        const tile = new Tile(5);
        expect(tile.value).toBe(5);
    });

    it('should create an independent copy when cloned', () => {
        const original = new Tile(3);
        const clone = original.clone();
        
        expect(clone.value).toBe(original.value);
        expect(clone).not.toBe(original);
    });
});