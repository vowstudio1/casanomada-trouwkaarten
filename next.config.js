/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sponsalia.app",
        pathname: "/assets/**",
      },
    ],
  },
};

module.exports = nextConfig;
