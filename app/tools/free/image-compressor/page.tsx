import ImageCompressorClient from './client';
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


export const metadata = {
  title: 'Image Compressor - Optimize Your Images',
  description: 'Intelligently reduce the file size of your JPG, PNG, and WEBP images without sacrificing quality. Perfect for web performance.',
};

const faqs = [
    {
        question: "How does the quality slider work?",
        answer: "The quality slider controls the compression level. A lower value (e.g., 0.7) results in a smaller file but may sacrifice some image detail. A higher value (e.g., 0.95) preserves more detail but results in a larger file. This setting primarily affects JPG and WEBP formats."
    },
    {
        question: "Does compression significantly affect image quality?",
        answer: "For most web uses, moderate compression (e.g., a quality between 0.8 and 0.9) often produces no visible quality loss while significantly reducing file size. We recommend checking the preview image before downloading."
    },
    {
        question: "Will my original file be modified?",
        answer: "Your original file remains untouched. You are downloading a new, compressed image file. All processing happens within your browser, and we never see or store your images."
    }
];


export default function ImageCompressorPage() {
    return (
        <Shell>
            <PageHeader className="items-center text-center">
                <PageHeaderHeading>Image Compressor</PageHeaderHeading>
                <PageHeaderDescription>
                    Intelligently reduce the file size of your images without sacrificing too much quality.
                </PageHeaderDescription>
            </PageHeader>
            <div className="w-full max-w-xl mx-auto">
                <ImageCompressorClient />
            </div>
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