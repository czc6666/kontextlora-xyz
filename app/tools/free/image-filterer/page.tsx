import Image from "next/image";
import ImageFiltererClient from './client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HowItWorks } from '@/components/shared/how-it-works';
import { KeyFeatures } from '@/components/shared/key-features';
import { Eye, Shield, Wand } from 'lucide-react';

export const metadata = {
    title: 'Online Image Filters - Add Effects to Photos for Free',
    description: 'Apply various artistic filters to your photos for free, such as grayscale, sepia, brightness, contrast, and blur. Real-time preview and easy adjustments.',
};

const howItWorksSteps = [
    {
        title: "Upload Image",
        description: "Select the photo you want to apply filters to."
    },
    {
        title: "Apply Filters",
        description: "Use the sliders to adjust grayscale, sepia, brightness, contrast, and more to achieve your desired look."
    },
    {
        title: "Download",
        description: "Save your newly styled image with a single click."
    }
];

const keyFeatures = [
    {
        Icon: Eye,
        title: "Real-Time Preview",
        description: "See the effects of your filter adjustments instantly on your image."
    },
    {
        Icon: Wand,
        title: "Creative Control",
        description: "Combine multiple filters to create unique looks and styles for your photos."
    },
    {
        Icon: Shield,
        title: "Completely Private",
        description: "All filtering happens in your browser, so your images are never uploaded to a server."
    }
];

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
        <div className="container mx-auto px-4 py-12 md:px-6">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">Online Image Filters</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Apply artistic filters to your photos for free, such as grayscale, sepia, brightness, and blur.</p>
            </header>
            
            <div className="w-full max-w-5xl mx-auto">
                <ImageFiltererClient />
            </div>
            
            <HowItWorks steps={howItWorksSteps} />
            <KeyFeatures features={keyFeatures} />

            <section className="mt-16 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Frequently Asked Questions</h2>
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
            </section>
        </div>
    );
};

export default Page; 