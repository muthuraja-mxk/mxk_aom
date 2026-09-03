/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://backend:8000'}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
