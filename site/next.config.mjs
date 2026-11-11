import { createMDX } from "fumadocs-mdx/next";
const withMDX = createMDX({});
export default withMDX({
  devIndicators: false,
  turbopack: { root: import.meta.dirname },
  experimental: { viewTransition: true },
  env: {
    SITE_URL: process.env.SITE_URL ?? "",
    VERCEL_ENV: process.env.VERCEL_ENV ?? "",
    VERCEL_PROJECT_PRODUCTION_URL:
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "",
    VERCEL_URL: process.env.VERCEL_URL ?? "",
  },
  async rewrites() {
    return [
      { source: "/docs.md", destination: "/llms.md/docs/content.md" },
      {
        source: "/docs/:path*.md",
        destination: "/llms.md/docs/:path*/content.md",
      },
    ];
  },
  async headers() {
    return [
      { source: "/docs/:path*", headers: [{ key: "Vary", value: "Accept" }] },
    ];
  },
});
