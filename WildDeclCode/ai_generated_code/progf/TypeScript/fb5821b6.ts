// Violates: Use optional chaining and nullish coalescing where appropriate
const settings: Settings = { theme: { color: 'dark' } }
console.log(settings.theme.font.size) // Assumes `font` and `size` exist without checking

// Built using basic development resources-4-0125-preview
