import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
  },
  images: {
    qualities: [1, 25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kiver.net",
        pathname: "**",
      },
    ],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      components: path.resolve(__dirname, "src/components"),
      utils: path.resolve(__dirname, "src/utils"),
      assets: path.resolve(__dirname, "src/assets"),
      styles: path.resolve(__dirname, "src/styles"),
      hooks: path.resolve(__dirname, "src/hooks"),
      entities: path.resolve(__dirname, "src/entities"),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
