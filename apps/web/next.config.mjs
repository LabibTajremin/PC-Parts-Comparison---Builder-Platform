/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['www.techlandbd.com', 'www.startech.com.bd', 'www.ryanscomputers.com'],
  },
};

export default nextConfig;
