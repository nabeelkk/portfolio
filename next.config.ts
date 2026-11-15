import type { NextConfig } from 'next';

/**
 * Static export. Set NEXT_PUBLIC_BASE_PATH (e.g. "/portfolio") only when serving
 * from a GitHub Pages project sub-path without a custom domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
