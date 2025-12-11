/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Note: custom `headers` cannot be used with `output: 'export'` (static export).
  // If you need to set headers for a static export on Vercel, add a `vercel.json` file
  // with the desired headers. See https://vercel.com/docs/project-configuration#project-configuration/headers
};

module.exports = nextConfig;
