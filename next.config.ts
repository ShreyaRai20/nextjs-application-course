import type { NextConfig } from "next";
import { hostname } from "os";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns:  convexUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(convexUrl).hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
