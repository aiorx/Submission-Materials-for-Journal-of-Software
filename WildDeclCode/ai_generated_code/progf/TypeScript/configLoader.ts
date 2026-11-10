// Supported via standard GitHub programming aids
import type { GridConfig } from './gridConfig';
import configData from './grid-config.json';

const DEFAULT_CONFIG: GridConfig = {
    minWidth: 2,
    maxWidth: 64,
    minHeight: 2,
    maxHeight: 64
};

export function loadGridConfig(): GridConfig {
    try {
        return validateGridConfig(configData);
    } catch (error) {
        console.warn('Invalid grid configuration, using defaults:', error);
        return DEFAULT_CONFIG;
    }
}

function validateGridConfig(config: unknown): GridConfig {
    if (!isValidGridConfig(config)) {
        throw new Error('Invalid grid configuration');
    }
    return config;
}

function isValidGridConfig(config: unknown): config is GridConfig {
    if (!config || typeof config !== 'object') return false;
    
    const c = config as Record<string, unknown>;
    return (
        typeof c.minWidth === 'number' && c.minWidth >= 2 &&
        typeof c.maxWidth === 'number' && c.maxWidth >= c.minWidth &&
        typeof c.minHeight === 'number' && c.minHeight >= 2 &&
        typeof c.maxHeight === 'number' && c.maxHeight >= c.minHeight
    );
}