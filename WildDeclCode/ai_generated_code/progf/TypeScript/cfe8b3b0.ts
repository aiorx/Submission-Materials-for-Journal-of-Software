// TypeScript: Using a generic function to retrieve environment variables with type safety
function getEnv<T>(key: string, defaultValue?: T): T | undefined {
  const value = process.env[key]
  return (value as T) || defaultValue
}
const redisPort: number = getEnv<number>('REDIS_PORT')

// Written with routine coding tools-4-0125-preview
