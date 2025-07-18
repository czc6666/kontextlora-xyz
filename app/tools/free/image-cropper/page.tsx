import { ImageCropperClient } from "./client";
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
import { Crop, Ratio, Shield } from 'lucide-react';

export const metadata = {
  title: "Image Cropper",
  description: "Crop your images online for free.",
};

const howItWorksSteps = [
    {
        title: "Upload Image",
        description: "Select the image you want to crop from your device."
    },
    {
        title: "Adjust Crop Area",
        description: "Drag and resize the selection box to frame the perfect part of your image."
    },
    {
        title: "Download",
        description: "Click the download button to save the cropped area as a new image."
    }
];

const keyFeatures = [
    {
        Icon: Crop,
        title: "Interactive Preview",
        description: "Easily adjust the crop area with a live preview of the final result."
    },
    {
        Icon: Ratio,
        title: "Aspect Ratios",
        description: "Lock the aspect ratio to common sizes like 16:9 for consistent framing."
    },
    {
        Icon: Shield,
        title: "Client-Side",
        description: "Your original image is safe. All cropping is done in your browser, not on a server."
    }
];

const faqs = [
  {
    question: "Is the Image Cropper tool free to use?",
    answer:
      "Yes, our Image Cropper is completely free. There are no hidden charges or subscriptions.",
  },
  {
    question: "Do I need to create an account to use the tool?",
    answer:
      "No, you can use the Image Cropper without creating an account. Just upload your image and start cropping.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "Our tool supports a wide range of image formats, including JPEG, PNG, WEBP, and more.",
  },
  {
    question: "Is there a limit to the file size of the image I can upload?",
    answer:
      "For optimal performance, we recommend uploading images under 10MB. However, larger files might also be processed depending on your browser's capabilities.",
  },
  {
    question: "Are my uploaded images stored on your servers?",
    answer:
      "No, your privacy is our priority. All image processing is done in your browser. Your images are never uploaded or stored on our servers.",
  },
  {
    question: "Can I use this tool on my mobile device?",
    answer:
      "Absolutely! Our Image Cropper is fully responsive and works seamlessly on desktops, tablets, and mobile phones.",
  },
];

export default function ImageCropperPage() {
  return (
    <Shell>
      <PageHeader className="items-center text-center">
        <PageHeaderHeading>Image Cropper</PageHeaderHeading>
        <PageHeaderDescription>
          Easily crop your images with our intuitive online tool.
        </PageHeaderDescription>
      </PageHeader>
      <div className="w-full max-w-xl mx-auto">
        <ImageCropperClient />
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