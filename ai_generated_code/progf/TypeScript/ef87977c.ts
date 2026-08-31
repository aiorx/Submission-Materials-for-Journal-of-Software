// Violates: Use optional chaining and nullish coalescing where appropriate
const config: ServerConfig = { server: { host: 'localhost' } }
console.log(config.server.port) // Accesses `port` without checking if it exists

// Written with routine coding tools-4-0125-preview
