import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { Shell } from "@/components/shared/shell";
import { siteConfig } from "@/config/site";
import { type Metadata } from "next";
import { TransformerClient } from "./client";
import { HowItWorks } from '@/components/shared/how-it-works';
import { KeyFeatures } from '@/components/shared/key-features';
import { Layers, RotateCw, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: `Image Transformer - ${siteConfig.name}`,
  description: "Easily rotate and flip your images online. Rotate left, right, flip horizontally or vertically with an instant preview.",
};

const howItWorksSteps = [
    {
        title: "Upload Image",
        description: "Select the image you want to transform from your device."
    },
    {
        title: "Rotate & Flip",
        description: "Use the buttons to rotate the image left or right, or flip it horizontally or vertically."
    },
    {
        title: "Download",
        description: "Save your transformed image with its new orientation."
    }
];

const keyFeatures = [
    {
        Icon: RotateCw,
        title: "90-Degree Rotation",
        description: "Easily fix sideways photos with one-click rotation, perfect for portrait or landscape adjustments."
    },
    {
        Icon: Layers,
        title: "Combined Effects",
        description: "Apply multiple rotations and flips to get the exact orientation you need for your image."
    },
    {
        Icon: Shield,
        title: "Private & Lossless",
        description: "Transformations are lossless and happen securely in your browser, ensuring quality and privacy."
    }
];

const faqs = [
  {
    question: "Will rotating or flipping the image reduce its quality?",
    answer: "No. Rotating an image by 90, 180, or 270 degrees, as well as flipping it, are lossless operations. The quality of your image will not be affected.",
  },
  {
    question: "Can I apply multiple transformations in a row?",
    answer: "Yes. You can perform several transformations consecutively, such as rotating and then flipping. The effects are cumulative, and the final result shown in the preview is what you will download.",
  },
  {
    question: "Does this tool store my images?",
    answer: "No. Your privacy is paramount. All image processing is done directly in your browser. Your images are never uploaded or stored on our servers.",
  },
  {
    question: "What image formats are supported?",
    answer: "You can use common image formats like JPEG, PNG, WEBP, and BMP. The transformed image will be downloaded in its original format unless converted.",
  }
];
export default function Page() {
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading>Image Transformer</PageHeaderHeading>
        <PageHeaderDescription>
          Easily rotate and flip your images
        </PageHeaderDescription>
      </PageHeader>
      <div className="mx-auto w-full max-w-4xl">
        <TransformerClient />
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