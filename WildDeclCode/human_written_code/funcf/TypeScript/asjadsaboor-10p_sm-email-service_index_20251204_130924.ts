```typescript
export interface IConfig {
  env: string;
  server: {
    port: number;
  };
  api: {
    baseURL: string;
  };
  email: {
    fromEmail: string;
    sendgridAPIKey: string;
    mailgunAPIKey: string;
    mailgunDOMAIN: string;
  };
}
```