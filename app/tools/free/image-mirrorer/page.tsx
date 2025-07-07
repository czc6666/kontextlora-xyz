import ImageMirrorerClient from './client';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { Shell } from "@/components/shared/shell";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HowItWorks } from '@/components/shared/how-it-works';
import { KeyFeatures } from '@/components/shared/key-features';
import { CheckCircle, FlipHorizontal, Shield } from 'lucide-react';


export const metadata = {
  title: 'Image Mirrorer - Flip Your Images Online',
  description: 'Create a horizontal or vertical mirror image with one click. Free, fast, and secure, right in your browser.',
};

const howItWorksSteps = [
    {
        title: "Upload Image",
        description: "Select the photo you want to mirror or flip."
    },
    {
        title: "Flip Image",
        description: "Click the \"Mirror Horizontally\" or \"Mirror Vertically\" buttons to flip the image."
    },
    {
        title: "Download",
        description: "Save your newly mirrored image instantly with a single click."
    }
];

const keyFeatures = [
    {
        Icon: FlipHorizontal,
        title: "One-Click Flip",
        description: "Instantly mirror your images either horizontally or vertically with a single click."
    },
    {
        Icon: CheckCircle,
        title: "Lossless Operation",
        description: "Mirroring an image is a lossless operation that does not affect your image's quality."
    },
    {
        Icon: Shield,
        title: "Browser-Based",
        description: "Your images are processed securely in your browser and are never uploaded to a server."
    }
];

const faqs = [
    {
        question: "Does mirroring affect image clarity?",
        answer: "No. Horizontal or vertical mirroring is a lossless operation. It simply changes the order of the pixels without recalculating or compressing them, so it has no effect on the image's clarity or quality."
    },
    {
        question: "Will my original file be modified?",
        answer: "Your original file remains untouched. You are downloading a new, mirrored image file. All processing happens within your browser, and we never see or store your images."
    },
    {
        question: "What's the difference between mirroring and flipping?",
        answer: "In the context of this tool, \"mirroring\" and \"flipping\" are used interchangeably. Both refer to creating a reflection of the image across a horizontal or vertical axis."
    },
    {
        question: "Can I mirror animated GIFs?",
        answer: "No, this tool does not support animated GIFs. If you upload an animated GIF, only the first frame will be mirrored and available for download as a static image."
    },
    {
        question: "What image formats are supported?",
        answer: "You can use most browser-supported formats like PNG, JPEG, WEBP, and BMP. The mirrored image will be saved in the same format as the original file you uploaded."
    },
    {
        question: "Is there a file size limit?",
        answer: "While there's no hard limit, performance depends on your computer's memory and browser. For very large images (e.g., over 50MB), the browser might become slow. For best results, we recommend using images under 20MB."
    }
];

export default function ImageMirrorerPage() {
    return (
        <Shell>
            <PageHeader className="items-center text-center">
                <PageHeaderHeading>Image Mirrorer</PageHeaderHeading>
                <PageHeaderDescription>
                    Create a horizontal or vertical mirror image with one click.
                </PageHeaderDescription>
            </PageHeader>
            <div className="w-full max-w-4xl mx-auto">
                <ImageMirrorerClient />
            </div>
            <HowItWorks steps={howItWorksSteps} />
            <KeyFeatures features={keyFeatures} />
            <div className="mt-8 w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
                 <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg font-medium text-left hover:no-underline">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600 dark:text-gray-400">
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </Shell>
    );
} 