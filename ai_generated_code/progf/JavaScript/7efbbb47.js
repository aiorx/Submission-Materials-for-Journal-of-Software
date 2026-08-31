// Utilizing a function to fetch environment variables, enhancing code readability
function getConfig(key) {
  return process.env[key]
}
const jwtSecret = getConfig('JWT_SECRET')

// Built using basic development resources-4-0125-preview
