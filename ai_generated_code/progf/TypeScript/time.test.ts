// Supported via standard GitHub programming aids
import { ZGetTimeResponse } from '../../zod/time';

// Mock data for testing
const validTimeResponse = {
    time: '2023-01-15T12:14:42.730000-05:00'
};

describe('ZGetTimeResponse Schema', () => {
    test('should validate correct time response', () => {
        const result = ZGetTimeResponse.safeParse(validTimeResponse);
        expect(result.success).toBe(true);
    });

    test('should reject invalid time response', () => {
        const invalidResponse = {};
        const result = ZGetTimeResponse.safeParse(invalidResponse);
        expect(result.success).toBe(false);
    });

    test('should reject time with incorrect type', () => {
        const invalidResponse = { time: 12345 }; // number instead of string
        const result = ZGetTimeResponse.safeParse(invalidResponse);
        expect(result.success).toBe(false);
    });
});
