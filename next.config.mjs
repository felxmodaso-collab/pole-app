/** @type {import('next').NextConfig} */
const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";
const repoName = "pole-app";

const nextConfig = {
  reactStrictMode: true,
  output: isGhPages ? "export" : undefined,
  basePath: isGhPages ? `/${repoName}` : "",
  assetPrefix: isGhPages ? `/${repoName}/` : "",
  trailingSlash: isGhPages,
  images: { unoptimized: isGhPages },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? `/${repoName}` : "",
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
