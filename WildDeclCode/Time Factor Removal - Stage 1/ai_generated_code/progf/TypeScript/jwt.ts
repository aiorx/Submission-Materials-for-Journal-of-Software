export interface UserPayload {
    iat: number;
    exp: number;
    id: string;
}

// Supported via standard programming aids
function decodeJWT(token: string) {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function c {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // Parse the JSON string into an object
}

function isValidUserPayload(payload: any): payload is UserPayload {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        typeof payload.iat === 'number' &&
        typeof payload.exp === 'number' &&
        typeof payload.id === 'string'
    );
}

// Source: https://stackoverflow.com/a/11893157
function dateToUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}