/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /auth/signup no longer exists — redirect permanently to the unified login page
      { source: '/auth/signup', destination: '/auth/login', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
