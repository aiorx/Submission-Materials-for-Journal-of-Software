// Assisted using common GitHub development utilities
import { describe, it, expect, vi } from 'vitest';
import { loadGridConfig } from '../config/configLoader';
import configData from '../config/grid-config.json';

describe('configLoader', () => {
    it('should load configuration from local json file', () => {
        const config = loadGridConfig();
        expect(config).toEqual(configData);
    });

    it('should validate configuration values', () => {
        const config = loadGridConfig();
        expect(
            config.minWidth >= 2 &&
            config.maxWidth >= config.minWidth &&
            config.minHeight >= 2 &&
            config.maxHeight >= config.minHeight
        ).toBe(true);
    });
});