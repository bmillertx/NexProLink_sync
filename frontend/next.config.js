/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 'images.unsplash.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  env: {
    MOCK_AUTH: 'true'
  },
  // Development server configuration
  serverRuntimeConfig: {
    port: 3004
  }
}

module.exports = nextConfig
