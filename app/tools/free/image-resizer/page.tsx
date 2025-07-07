import { ImageResizerClient } from "./client";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shell } from "@/components/shared/shell";
import { HowItWorks } from '@/components/shared/how-it-works';
import { KeyFeatures } from '@/components/shared/key-features';
import { Lock, Maximize, Shield } from 'lucide-react';

export const metadata = {
  title: "Image Resizer",
  description: "Resize your images online to the exact dimensions you need.",
};

const howItWorksSteps = [
    {
        title: "Upload Image",
        description: "Select the image you want to resize from your device."
    },
    {
        title: "Set Dimensions",
        description: "Enter your desired width or height. Lock the aspect ratio to maintain proportions automatically."
    },
    {
        title: "Download",
        description: "Click \"Resize\" and then \"Download\" to save your newly resized image."
    }
];

const keyFeatures = [
    {
        Icon: Lock,
        title: "Aspect Ratio Lock",
        description: "Maintain your image's original proportions with one click to avoid distortion."
    },
    {
        Icon: Maximize,
        title: "Pixel Perfect",
        description: "Resize images to exact pixel dimensions for any use case, from social media to printing."
    },
    {
        Icon: Shield,
        title: "Safe and Secure",
        description: "All resizing is done in your browser, not on a server, ensuring your images remain private."
    }
];

const faqs = [
  {
    question: "Is the Image Resizer tool free to use?",
    answer:
      "Yes, our Image Resizer is completely free. There are no hidden charges or subscriptions.",
  },
  {
    question: "Do I need to create an account to use the tool?",
    answer:
      "No, you can use the Image Resizer without creating an account. Just upload your image and start resizing.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "Our tool supports a wide range of image formats, including JPEG, PNG, and WEBP.",
  },
  {
    question: "Will resizing my image affect its quality?",
    answer:
      "Resizing an image can affect its quality. Downsizing is generally safe, but enlarging an image beyond its original dimensions may result in a loss of sharpness or clarity. Our tool uses high-quality algorithms to minimize this effect.",
  },
  {
    question: "Are my uploaded images stored on your servers?",
    answer:
      "No, your privacy is our priority. All image processing is done in your browser. Your images are never uploaded or stored on our servers.",
  },
  {
    question: "What happens if I only enter a width or height?",
    answer:
      "If the 'Lock aspect ratio' option is checked, the other dimension will be calculated automatically to maintain the image's original proportions. If it's unchecked, you can set the width and height independently.",
  },
];

export default function ImageResizerPage() {
  return (
    <Shell>
      <PageHeader className="items-center text-center">
        <PageHeaderHeading>Image Resizer</PageHeaderHeading>
        <PageHeaderDescription>
          Easily resize your JPG, PNG, or WEBP images to the exact dimensions
          you need.
        </PageHeaderDescription>
      </PageHeader>
      <div className="w-full max-w-xl mx-auto">
        <ImageResizerClient />
      </div>
      <HowItWorks steps={howItWorksSteps} />
      <KeyFeatures features={keyFeatures} />
      <div className="mt-8 w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Shell>
  );
} 