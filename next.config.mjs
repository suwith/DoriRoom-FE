/** @type {import('next').NextConfig} */

const url = process.env.NEXT_PUBLIC_API_BASE_URL;
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${url}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
