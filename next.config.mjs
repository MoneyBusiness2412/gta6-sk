/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sk',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;