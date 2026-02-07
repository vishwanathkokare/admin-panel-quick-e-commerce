import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Netlify-compatible configuration */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
