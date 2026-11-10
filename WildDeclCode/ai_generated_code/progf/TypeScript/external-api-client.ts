// Supported via standard GitHub programming aids
import * as vscode from "vscode";

export interface IRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export class ExternalAPIClient {
  private secretStorage: vscode.SecretStorage;
  constructor(secretStorage: vscode.SecretStorage) {
    this.secretStorage = secretStorage;
  }

  async makeAuthenticatedRequest(
    url: string,
    options: IRequestOptions
  ): Promise<unknown> {
    // TODO: Attach token from secret storage if needed
    return fetch(url, options as RequestInit).then((res) => res.json());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRateLimit(_response: Response): void {
    // TODO: Check response headers for rate limit and handle accordingly
  }

  async retryOnFailure<T>(
    operation: () => Promise<T>,
    maxRetries: number
  ): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (e) {
        lastError = e;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    throw lastError;
  }
}
