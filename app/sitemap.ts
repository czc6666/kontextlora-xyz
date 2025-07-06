import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  // Main static pages that should be indexed
  const staticPages = [
    "", // Represents the home page
    "/sign-in",
    "/sign-up",
    "/forgot-password",
  ];

  // All the tool pages
  const toolPages = [
    "/tools/image-generator",
    "/tools/free/exif-remover",
    "/tools/free/ico-generator",
    "/tools/free/image-compressor",
    "/tools/free/image-converter",
    "/tools/free/image-cropper",
    "/tools/free/image-filterer",
    "/tools/free/image-mirrorer",
    "/tools/free/image-resizer",
    "/tools/free/image-stitcher",
    "/tools/free/image-to-caption",
    "/tools/free/image-to-prompt",
    "/tools/free/image-transformer",
    "/tools/free/image-watermarker",
    "/tools/free/photo-restore",
    "/tools/free/remove-background",
  ];

  const staticUrls = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const toolUrls = toolPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticUrls, ...toolUrls];
} 