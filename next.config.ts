import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for local images
  images: {
    // Add remote patterns if you need to load images from external sources
    remotePatterns: [
      // Example for common image CDNs - uncomment as needed:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
    ],
  },
};

export default nextConfig;
