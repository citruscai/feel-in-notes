/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, 

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('http2', 'tls', 'net');
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      http2: false,
      tls: false,
      net: false,
    };

    return config;
  },
};

module.exports = nextConfig;
