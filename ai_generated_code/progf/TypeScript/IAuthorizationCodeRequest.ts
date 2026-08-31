// Supported via standard GitHub programming aids
export interface IAuthorizationCodeRequest {
    grant_type: 'authorization_code';
    code: string;
    client_id: string;
    redirect_uri: string;
}
