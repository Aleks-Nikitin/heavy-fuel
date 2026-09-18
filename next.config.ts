import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://picsum.photos/seed/**"),
      new URL("https://res.cloudinary.com/**"),
    ],
  },
};

export default nextConfig;
