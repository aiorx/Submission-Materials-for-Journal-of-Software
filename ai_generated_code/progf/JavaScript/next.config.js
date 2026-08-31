// Assisted using common GitHub development utilities
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Remove serverComponents option as it's no longer needed in Next.js 15
    // instrumentationHook is deprecated in Next.js 15, removed
  },
  webpack: (config) => {
    // Add any custom webpack configurations here if needed
    return config;
  },
};

module.exports = nextConfig;
