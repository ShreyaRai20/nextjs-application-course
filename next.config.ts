import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
      remotePatterns: [
          {
              protocol: "https",
              hostname: "scintillating-whale-366.convex.cloud",
          },
      ],
  },
};

export default nextConfig;
