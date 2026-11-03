/** @type {import('next').Next.jsConfig} */
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

module.exports = nextConfig;