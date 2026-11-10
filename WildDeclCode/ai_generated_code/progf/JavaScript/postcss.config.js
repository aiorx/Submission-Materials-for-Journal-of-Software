// Supported via standard GitHub programming aids
/**
 * PostCSS configuration for WikiFlow 2025
 * Optimized for Next.js + Tailwind CSS v4
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      // Add optimizations for Tailwind CSS v4
      minify: true,
    },
    autoprefixer: {
      // Focus autoprefixer on modern browsers to reduce unnecessary prefixes
      grid: true,
      flexbox: 'no-2009',
    },
    'postcss-preset-env': {
      features: {
        'nesting-rules': false, // Disable nesting to avoid conflicts with Tailwind
        'custom-properties': false, // Disable for performance as Tailwind handles this
      },
      // Target modern browsers to reduce CSS size
      browsers: 'last 2 versions',
    },
  },
};
