import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { Shell } from "@/components/shared/shell";
import { siteConfig } from "@/config/site";
import { type Metadata } from "next";
import { WatermarkerClient } from "./client";
import { HowItWorks } from '@/components/shared/how-it-works';
import { KeyFeatures } from '@/components/shared/key-features';
import { Eye, Shield, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: `Image Watermarker - ${siteConfig.name}`,
  description: "Add customizable text watermarks to your images. Securely process files in your browser with an instant preview.",
};

const howItWorksSteps = [
    {
        title: "Select Image",
        description: "Click or drag and drop your image file to upload it."
    },
    {
        title: "Customize Watermark",
        description: "Use the controls to change the text, color, size, and font. Drag the watermark on the image to position it."
    },
    {
        title: "Download",
        description: "Click the download button. Your new watermarked image will be saved to your device instantly."
    }
];

const keyFeatures = [
    {
        Icon: Shield,
        title: "Privacy First",
        description: "Your images are never uploaded. All watermarking is done in your browser, ensuring your data remains 100% private."
    },
    {
        Icon: Eye,
        title: "Live Preview",
        description: "See your changes in real-time. Adjust the watermark and see exactly how it will look before downloading."
    },
    {
        Icon: SlidersHorizontal,
        title: "Full Control",
        description: "Drag your watermark, change its font, size, color, and opacity to get the perfect look."
    }
];

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
       <HowItWorks steps={howItWorksSteps} />
       <KeyFeatures features={keyFeatures} />
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