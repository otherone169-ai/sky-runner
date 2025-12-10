/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' https://pagead2.googlesyndication.com; connect-src 'self' https://pagead2.googlesyndication.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
