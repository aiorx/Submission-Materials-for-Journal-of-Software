/**
 * Create an access token
 */
var OAuth2Request = require('../../ui/dto').OAuth2Request;

class CreateAccessTokenCommand {
    constructor(
        public readonly clientId: string,
        public readonly scope: string,
        public readonly exp: number,
        public readonly iat: number,
        public readonly request: OAuth2Request,
        public readonly userId?: string,
    ) {}
}
