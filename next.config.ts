import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "my-tasks-seven-iota.vercel.app" }],
        destination: "https://cochecoche.jeoste.com/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
