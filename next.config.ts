import type { NextConfig } from "next";

// Backend base URL including /api/v1. Server-only: the browser never calls the
// backend directly, it calls /api/v1 on this origin and the rewrite below
// forwards it. That keeps the refresh-token cookie first-party, so browsers
// that block third-party cookies (Safari, Firefox) keep the session.
const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL is not set");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_URL.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
