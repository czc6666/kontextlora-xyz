import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { CursorFollower } from "@/components/ui/cursor-follower";
import { GeistSans } from "geist/font/sans";
import { cookies } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kontext Rola - AI Image Generation Platform",
    template: `%s | Kontext Rola`,
  },
  description:
    "The ultimate AI platform for generating stunning images, videos, and more. Create and edit with simple text prompts, or build and train your own custom AI models.",
  keywords: [
    "AI Image Generator",
    "AI Content Creation",
    "Text to Image",
    "Kontext Rola",
    "AI Art",
    "Stable Diffusion",
    "Midjourney Alternative",
  ],
  openGraph: {
    title: "Kontext Rola - AI Image Generation Platform",
    description:
      "Generate stunning visuals from text with the most advanced AI. Join Kontext Rola and bring your ideas to life.",
    images: [`${baseUrl}/og-image.png`], // Assuming you will add an og-image.png to the /public folder
    url: baseUrl,
    siteName: "Kontext Rola",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontext Rola - AI Image Generation Platform",
    description:
      "Generate stunning visuals from text with the most advanced AI. Join Kontext Rola and bring your ideas to life.",
    images: [`${baseUrl}/og-image.png`], // Same image for Twitter
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="hidden md:block">
            <CursorFollower />
          </div>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
