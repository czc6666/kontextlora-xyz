import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { Shell } from "@/components/shared/shell";
import { siteConfig } from "@/config/site";
import { type Metadata } from "next";
import { WatermarkerClient } from "./client";

export const metadata: Metadata = {
  title: `Image Watermarker - ${siteConfig.name}`,
  description: "Add customizable text watermarks to your images. Securely process files in your browser with an instant preview.",
};
const faqs = [
  {
    question: "Can I use my logo as a watermark?",
    answer: "Currently, this tool only supports text-based watermarks. We are working on adding support for image watermarks (like logos) in a future update.",
  },
  {
    question: "Can I move the watermark anywhere on the image?",
    answer: "Yes! You can click and drag the watermark text directly on the image preview to place it exactly where you want it.",
  },
  {
    question: "Is my privacy protected?",
    answer: "Absolutely. All processing happens in your browser. Your images are never uploaded to any server, ensuring your data remains 100% private.",
  },
  {
    question: "What happens to my original image file?",
    answer: "Your original file is never modified. When you are done, you download a new, watermarked image.",
  }
];
export default function Page() {
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading>Image Watermarker</PageHeaderHeading>
        <PageHeaderDescription>
          Add custom text watermarks to your images securely and privately.
        </PageHeaderDescription>
      </PageHeader>
      <div className="mx-auto w-full max-w-4xl">
        <WatermarkerClient />
      </div>
      <section className="mx-auto grid w-full max-w-4xl items-center space-y-4 py-10">
        <h2 className="text-center text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="rounded-lg border bg-card p-4 text-card-foreground">
              <summary className="cursor-pointer font-semibold">{faq.question}</summary>
              <p className="pt-2 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </Shell>
  );
} 