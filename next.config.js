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
  eslint: {
    // ✅ Matikan error ESLint saat build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Matikan error TypeScript saat build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
