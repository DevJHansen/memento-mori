/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'storage.googleapis.com'],
  },
  experimental: {
    appDir: true,
  },
  output: 'standalone',
};

export default nextConfig;
