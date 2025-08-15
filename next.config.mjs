/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://43.202.194.181:8080/api/:path*', // 백엔드 HTTP 그대로
      },
    ];
  },
};

export default nextConfig;
