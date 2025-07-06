import ImageFiltererClient from './client';
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
    title: 'Online Image Filters - Add Effects to Photos for Free',
    description: 'Apply various artistic filters to your photos for free, such as grayscale, sepia, brightness, contrast, and blur. Real-time preview and easy adjustments.',
};

const faqs = [
    {
        question: "Does applying filters affect image quality?",
        answer: "Applying filters will change the visual appearance of the image, but the downloaded image will maintain the same resolution as the original. We use highly efficient CSS filters for these effects."
    },
    {
        question: "Can I combine multiple filters?",
        answer: "Absolutely. You can adjust multiple sliders at the same time, for example, increasing both brightness and contrast, or applying grayscale and blur effects simultaneously. All filters are cumulative."
    },
    {
        question: "Is my original file modified?",
        answer: "No, your original file remains untouched. You are downloading a new, edited version of the image. All processing happens within your browser."
    },
    {
        question: "What image formats are supported?",
        answer: "This tool works with all common browser-supported image formats, including JPEG, PNG, WEBP, and GIF. The downloaded image will be in the same format as the original."
    },
    {
        question: "How do I reset the filters?",
        answer: "You can click the 'Reset Filters' button at any time to remove all applied effects and return the image to its original state."
    },
    {
        question: "Is this tool free to use?",
        answer: "Yes, this tool is 100% free to use. There are no watermarks, usage limits, or hidden costs."
    }
];

const Page = () => {
    return (
        <Shell>
            <PageHeader className="items-center text-center">
                <PageHeaderHeading>Online Image Filters</PageHeaderHeading>
                <PageHeaderDescription>
                    Apply artistic filters to your photos for free, such as grayscale, sepia, brightness, and blur.
                </PageHeaderDescription>
            </PageHeader>
            <div className="w-full max-w-xl mx-auto">
                <ImageFiltererClient />
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
};

export default Page; 