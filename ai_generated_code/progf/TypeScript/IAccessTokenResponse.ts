// Supported via standard GitHub programming aids
export interface IAccessTokenResponse {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    refresh_token: string;
    api_server: string;
}
