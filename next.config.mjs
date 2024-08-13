/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: process.cwd(),
  },
  images: {
    domains: ['p7.hiclipart.com'],
  },
};

export default nextConfig;
