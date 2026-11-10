// Supported via standard GitHub programming aids
var vscode = require('vscode');

export interface IRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

class ExternalAPIClient {
  private secretStorage: vscode.SecretStorage;
  constructor(secretStorage: vscode.SecretStorage) {
    this.secretStorage = secretStorage;
  }

  async makeAuthenticatedRequest(
    url: string,
    options: IRequestOptions
  ): Promise<unknown> {
    // TODO: Attach token from secret storage if needed
    return fetch(url, options as RequestInit).then(function (res) { return res.json(); });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRateLimit(_response: Response): void {
    // TODO: Check response headers for rate limit and handle accordingly
  }

  async retryOnFailure<T>(
    operation: function () { return Promise<T>; },
    maxRetries: number
  ): Promise<T> {
    var lastError: unknown;
    for (var i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (e) {
        lastError = e;
        await new Promise(function (r) { return setTimeout(r, 1000); });
      }
    }
    throw lastError;
  }
}
