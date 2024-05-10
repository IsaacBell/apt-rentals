/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 's3.amazonaws.com'],
  },
};

module.exports = nextConfig;
