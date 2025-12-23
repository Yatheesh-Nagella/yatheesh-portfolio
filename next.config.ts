/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Admin subdomain - Production
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
      // Admin subdomain - Local development
      {
        source: '/:path*',
        destination: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.localhost',
          },
        ],
      },
      // Finance subdomain - Production
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
      // Finance subdomain - Local development
      {
        source: '/:path*',
        destination: '/finance/:path*',
        has: [
          {
            type: 'host',
            value: 'finance.localhost',
          },
        ],
      },
    ];
  },
};

export default nextConfig;