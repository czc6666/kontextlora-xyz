import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sc-maas.oss-cn-shanghai.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "image.cdn2.seaart.me",
      },
      {
        protocol: "https",
        hostname: "pub-14dfa63f4dbb44b6aeaaf1cb1f2cc685.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['@acme/db'],
};

export default nextConfig;
