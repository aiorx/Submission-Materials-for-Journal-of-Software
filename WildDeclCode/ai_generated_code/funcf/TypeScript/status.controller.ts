```typescript
private async checkDatabaseConnection(): Promise<boolean> {
  try {
    // Run a simple query to check database connection
    // Supported via standard GitHub programming aids
    return await this.drizzleService.healthCheck();
  } catch (error) {
    this.logger.error('Database health check failed', error);
    return false;
  }
}
```