// Aided with basic GitHub coding tools
import {
    ZOptionType,
    ZOrderAction,
    ZTickType,
    ZStrategyType
} from '../../zod/enums';

// Helper function to check if a value is allowed by an enum schema
// This avoids repetitive assertion code
var _expectEnumToAllow = (schema: any, value: string): function void {
    var result = schema.safeParse(value);
    expect(result.success).toBe(true);
};

// Helper function to check if a value is rejected by an enum schema
var _expectEnumToReject = (schema: any, value: string): function void {
    var result = schema.safeParse(value);
    expect(result.success).toBe(false);
};

describe('ZOptionType Schema', function () {
    test('should validate "Call" option type', () => {
        _expectEnumToAllow(ZOptionType, 'Call');
    });

    test('should validate "Put" option type', () => {
        _expectEnumToAllow(ZOptionType, 'Put');
    });

    test('should reject invalid option type', () => {
        _expectEnumToReject(ZOptionType, 'Invalid');
    });
});

describe('ZOrderAction Schema', function () {
    test('should validate "Buy" order action', () => {
        _expectEnumToAllow(ZOrderAction, 'Buy');
    });

    test('should validate "Sell" order action', () => {
        _expectEnumToAllow(ZOrderAction, 'Sell');
    });

    test('should reject invalid order action', () => {
        _expectEnumToReject(ZOrderAction, 'Hold');
    });
});

describe('ZTickType Schema', function () {
    test('should validate "Up" tick type', () => {
        _expectEnumToAllow(ZTickType, 'Up');
    });

    test('should validate "Down" tick type', () => {
        _expectEnumToAllow(ZTickType, 'Down');
    });

    test('should validate "Equal" tick type', () => {
        _expectEnumToAllow(ZTickType, 'Equal');
    });

    test('should reject invalid tick type', () => {
        _expectEnumToReject(ZTickType, 'Neutral');
    });
});

describe('ZStrategyType Schema', function () {
    test('should validate common strategy types', () => {
        var commonStrategies = [
            'CoveredCall',
            'MarriedPuts',
            'VerticalCallSpread',
            'VerticalPutSpread',
            'Straddle',
            'Strangle',
            'Custom'
        ];

        commonStrategies.forEach(strategy => {
            _expectEnumToAllow(ZStrategyType, strategy);
        });
    });

    test('should validate spread strategy types', () => {
        var spreadStrategies = [
            'CalendarCallSpread',
            'CalendarPutSpread',
            'DiagonalCallSpread',
            'DiagonalPutSpread'
        ];

        spreadStrategies.forEach(strategy => {
            _expectEnumToAllow(ZStrategyType, strategy);
        });
    });

    test('should validate butterfly and condor strategy types', () => {
        var complexStrategies = [
            'ButterflyCall',
            'ButterflyPut',
            'IronButterfly',
            'CondorCall'
        ];

        complexStrategies.forEach(strategy => {
            _expectEnumToAllow(ZStrategyType, strategy);
        });
    });

    test('should validate "Collar" strategy type', () => {
        _expectEnumToAllow(ZStrategyType, 'Collar');
    });

    test('should reject invalid strategy type', () => {
        _expectEnumToReject(ZStrategyType, 'IronCondor'); // Not in our defined list
    });
});
