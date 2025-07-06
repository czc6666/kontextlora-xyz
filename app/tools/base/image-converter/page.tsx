import ImageConverterClient from './client';
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
  title: 'Image Format Converter - Convert to WEBP, PNG, JPEG',
  description: 'Free online tool to convert your images to modern formats like WEBP, PNG, or JPEG. Works entirely in your browser, ensuring privacy and speed.',
};

const faqs = [
    {
        question: "Is this image converter free to use?",
        answer: "Yes, this tool is completely free. You can convert as many images as you like without any cost."
    },
    {
        question: "Is my data safe? Are my images uploaded anywhere?",
        answer: "Your privacy is our top priority. All image processing happens directly in your browser. Your files are never uploaded to any server, ensuring your data remains private and secure."
    },
    {
        question: "What formats can I convert my images to?",
        answer: "You can convert your images to three popular formats: WEBP, PNG, and JPEG. WEBP is great for web use, PNG is ideal for images needing transparency, and JPEG is a widely supported format for photos."
    },
    {
        question: "What does the 'Quality' slider do?",
        answer: "The quality slider is available for WEBP and JPEG formats. It allows you to control the level of compression. A lower quality setting will result in a smaller file size, which is great for websites, but may slightly reduce image clarity. A higher quality setting preserves more detail at the cost of a larger file."
    },
    {
        question: "Why can't I adjust the quality for PNG format?",
        answer: "PNG is a lossless compression format, which means it reduces file size without losing any image quality. Because of this, it doesn't have a 'quality' setting like lossy formats (JPEG, WEBP). It always preserves 100% of the original image data."
    },
    {
        question: "Which browser should I use for this tool?",
        answer: "This tool works best on modern browsers like Chrome, Firefox, Safari, and Edge. For the best performance and compatibility, we recommend using the latest version of your preferred browser."
    }
];

const Page = () => {
    return (
        <Shell>
            <PageHeader className="items-center text-center">
                <PageHeaderHeading>Image Format Converter</PageHeaderHeading>
                <PageHeaderDescription>
                    Convert images to WEBP, PNG, or JPEG in your browser.
                </PageHeaderDescription>
            </PageHeader>
            <div className="w-full max-w-xl mx-auto">
                <ImageConverterClient />
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