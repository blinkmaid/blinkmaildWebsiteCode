import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',  // Remove this line
  images: {
    unoptimized: true,  // Keep if needed for Tailwind images
  },
};

export default nextConfig;