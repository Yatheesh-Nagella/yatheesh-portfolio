/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Admin subdomain
      {
        source: '/:path*',
        destination: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.yatheeshnagella.com',
          },
        ],
      },
      // Finance subdomain
      {
        source: '/:path*',
        destination: '/finance/:path*',
        has: [
          {
            type: 'host',
            value: 'finance.yatheeshnagella.com',
          },
        ],
      },
    ];
  },
};

export default nextConfig;