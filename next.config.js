/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Voorkom prerender fouten bij ontbrekende env vars tijdens build
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sponsalia.app",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "higumpwitazqsojluiad.supabase.co",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
