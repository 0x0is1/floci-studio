import type { NextConfig } from "next";

const isExport = process.env.BUILD_MODE === 'export';

const nextConfig: NextConfig = {
  output: isExport ? 'export' : undefined,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

