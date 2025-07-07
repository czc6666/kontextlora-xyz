import ImageStitcherClient from './client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { Shell } from "@/components/shared/shell";
import { HowItWorks } from '@/components/shared/how-it-works';
import { KeyFeatures } from '@/components/shared/key-features';
import { Move, Shield, Rows, Columns } from 'lucide-react';

export const metadata = {
    title: 'Image Stitcher - Combine Images Online',
    description: 'Combine multiple images into one seamlessly with our Image Stitcher. Horizontal or vertical stitching. All processing is done in your browser, 100% private.',
};

const howItWorksSteps = [
    {
        title: "Upload Images",
        description: "Select two or more images you want to combine."
    },
    {
        title: "Arrange & Choose Direction",
        description: "Drag to reorder your images and select either horizontal or vertical stitching."
    },
    {
        title: "Download",
        description: "Click \"Stitch\" and then \"Download\" to get your combined image as a single file."
    }
];

const keyFeatures = [
    {
        Icon: Move,
        title: "Drag & Drop Sorting",
        description: "Easily reorder your images with a simple drag-and-drop interface to get the perfect sequence."
    },
    {
        Icon: Columns,
        title: "Flexible Alignment",
        description: "Stitch images together side-by-side (horizontally) or on top of each other (vertically)."
    },
    {
        Icon: Shield,
        title: "Private Processing",
        description: "Your images are stitched together right in your browser. No files are ever sent to a server."
    }
];

const faqs = [
    {
        question: "How many images can I stitch together?",
        answer: "You can stitch as many images as you want. However, for very large numbers of images (20+) or very high-resolution images, your browser might slow down due to memory constraints."
    },
    {
        question: "Do the images need to be the same size?",
        answer: "No, images can be different sizes. For horizontal stitching, the images will be centered vertically. For vertical stitching, they'll be centered horizontally."
    },
    {
        question: "What format will the stitched image be saved in?",
        answer: "The stitched image is saved as a PNG file, which ensures high quality and transparency support if your original images have transparent areas."
    },
    {
        question: "Can I stitch images with different formats together?",
        answer: "Yes, you can mix and match any browser-supported image formats (JPG, PNG, WEBP, GIF, etc.) when stitching."
    }
];

const Page = () => {
    return (
        <Shell>
            <PageHeader className="items-center text-center">
                <PageHeaderHeading>Image Stitcher</PageHeaderHeading>
                <PageHeaderDescription>
                    Combine multiple images into one, horizontally or vertically.
                </PageHeaderDescription>
            </PageHeader>
            <div className="w-full max-w-4xl mx-auto">
                <ImageStitcherClient />
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
};

export default Page; 