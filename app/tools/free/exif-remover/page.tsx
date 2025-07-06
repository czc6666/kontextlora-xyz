import ExifRemoverClient from './client';
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
    title: 'EXIF Data Remover - Protect Your Privacy',
    description: 'View and remove hidden metadata (EXIF) from your photos to protect your privacy. Works with JPEG files, 100% free and client-side.',
};

const faqs = [
    {
        question: "What is EXIF data?",
        answer: "EXIF (Exchangeable Image File Format) is metadata stored within an image file. It can include the date, time, and GPS location of where the photo was taken, as well as camera settings like shutter speed, aperture, and ISO. While useful for photographers, it can be a privacy risk if shared unintentionally."
    },
    {
        question: "Does removing EXIF data reduce image quality?",
        answer: "No. Our tool removes EXIF data by re-drawing the image onto a new canvas and saving it. This process copies the visual pixels exactly but doesn't include the metadata. The visible quality of your photo will not be affected."
    },
    {
        question: "Why does this only work for JPG/JPEG files?",
        answer: "The EXIF metadata standard is most commonly and consistently used in JPEG files from digital cameras and smartphones. Other formats like PNG or WEBP do not typically contain this type of standardized, extensive metadata, so this tool focuses on where it's most relevant."
    },
    {
        question: "Is my original file modified?",
        answer: "No, your original file remains untouched on your device. All processing happens in your browser, and we never see or store your images. You download a new, clean version of the photo."
    },
    {
        question: "What specific data is removed?",
        answer: "This tool creates a fresh copy of your image's visual data, effectively stripping all embedded metadata, including but not limited to GPS coordinates, camera make and model, date and time, and camera settings."
    },
    {
        question: "Is this tool free to use?",
        answer: "Yes, this EXIF Remover is 100% free with no limits. We believe in providing free and accessible tools to help users protect their online privacy."
    }
];

const Page = () => {
    return (
        <Shell>
            <PageHeader className="items-center text-center">
                <PageHeaderHeading>EXIF Data Remover</PageHeaderHeading>
                <PageHeaderDescription>
                    View and remove hidden metadata (EXIF) from your photos to protect your privacy.
                </PageHeaderDescription>
            </PageHeader>
            <div className="w-full max-w-xl mx-auto">
                <ExifRemoverClient />
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