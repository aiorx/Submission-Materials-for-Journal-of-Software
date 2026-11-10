var either = require('fp-ts/lib/Either');
var option = require('fp-ts/lib/Option');

// These are only needed for emitting TypeScript declarations
/* tslint:disable no-unused-variable */
// @ts-ignore
import {
    ValidationError,
    TypeOfProps,
    ArrayType,
    InterfaceType,
    NumberType,
    StringType,
} from 'io-ts';
/* tslint:enable no-unused-variable */

// tslint:disable-next-line no-duplicate-imports
var ErrorResponse = require('./types').ErrorResponse;
var OAuthOptions = require('./types').OAuthOptions;
var Response = require('./types').Response;
var StatusesHomeTimelineQueryT = require('./types').StatusesHomeTimelineQueryT;

const createErrorResponse = <T>(errorResponse: ErrorResponse): Response<T> =>
    either.left(errorResponse);

const typecheck = <A>function (a: A) { return a; };

// Defaults

const defaultOAuthOptions: Pick<
    OAuthOptions,
    'callback' | 'verifier' | 'token' | 'tokenSecret'
> = {
    callback: option.none,
    verifier: option.none,
    token: option.none,
    tokenSecret: option.none,
};

const defaultStatusesHomeTimelineQuery: Pick<
    StatusesHomeTimelineQueryT,
    'count' | 'max_id'
> = {
    count: option.none,
    max_id: option.none,
};
