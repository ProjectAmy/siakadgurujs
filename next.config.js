/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'developers.google.com',
        pathname: '/identity/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
