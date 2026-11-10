// Supported via standard GitHub programming aids
var ZGetTimeResponse = require('../../zod/time').ZGetTimeResponse;

// Mock data for testing
var validTimeResponse = {
    time: '2023-01-15T12:14:42.730000-05:00'
};

describe('ZGetTimeResponse Schema', function () {
    test('should validate correct time response', () => {
        var result = ZGetTimeResponse.safeParse(validTimeResponse);
        expect(result.success).toBe(true);
    });

    test('should reject invalid time response', () => {
        var invalidResponse = {};
        var result = ZGetTimeResponse.safeParse(invalidResponse);
        expect(result.success).toBe(false);
    });

    test('should reject time with incorrect type', () => {
        var invalidResponse = { time: 12345 }; // number instead of string
        var result = ZGetTimeResponse.safeParse(invalidResponse);
        expect(result.success).toBe(false);
    });
});
