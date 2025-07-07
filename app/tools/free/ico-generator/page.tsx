import IcoGeneratorClient from './client';
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
import { Crop, Package, Shield } from 'lucide-react';

export const metadata = {
    title: 'Multi-Size ICO Icon Generator',
    description: 'Convert your images into a professional Windows ICO file with multiple sizes built-in (16x16, 32x32, 48x48, 256x256).',
};

const howItWorksSteps = [
    {
        title: "Upload Image",
        description: "Select any image file (JPG, PNG, etc.) to use as a source for your icon."
    },
    {
        title: "Generate ICO",
        description: "The tool automatically processes your image and prepares a multi-size ICO file."
    },
    {
        title: "Download",
        description: "Click the download button to save the professional .ico file to your computer."
    }
];

const keyFeatures = [
    {
        Icon: Package,
        title: "Multi-Size Package",
        description: "Generates a single .ico file with standard sizes (16x16, 32x32, 48x48, 256x256) for perfect display everywhere."
    },
    {
        Icon: Shield,
        title: "Client-Side Conversion",
        description: "All processing happens in your browser. Your images are never uploaded, ensuring your privacy."
    },
    {
        Icon: Crop,
        title: "Auto-Fit",
        description: "Non-square images are automatically centered and resized to fit the square icon format."
    }
];

const faqs = [
    {
        question: "What sizes are included in the generated ICO file?",
        answer: "For best compatibility, each generated .ico file includes four standard sizes: 16x16, 32x32, 48x48, and 256x256. This ensures your icon displays clearly on desktops, taskbars, and in different views."
    },
    {
        question: "Do I need to upload a square image?",
        answer: "No. The tool automatically resizes and centers your image to a 1:1 aspect ratio to meet ICO format requirements. For best results, using a nearly square image is recommended."
    },
    {
        question: "Is this service really private and secure?",
        answer: "Absolutely. The core principle of this tool is privacy. All file processing happens entirely within your web browser. Your images are never sent over the internet or stored on a server. What happens on your computer stays on your computer."
    }
];

const Page = () => {
    return (
        <Shell>
            <PageHeader className="items-center text-center">
                <PageHeaderHeading>Multi-Size ICO Icon Generator</PageHeaderHeading>
                <PageHeaderDescription>
                    Convert your images into a professional Windows ICO file with multiple sizes built-in.
                </PageHeaderDescription>
            </PageHeader>
            <div className="w-full max-w-xl mx-auto">
                <IcoGeneratorClient />
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