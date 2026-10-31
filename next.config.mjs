/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "supabase.co",
      "images.pexels.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tracking',
        destination: '/track',
        permanent: true,
      },
      {
        source: '/bus-tracking',
        destination: '/track',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
