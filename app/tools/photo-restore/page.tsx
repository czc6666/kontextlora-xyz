import { PhotoRestoreClient } from "@/components/tools/photo-restore/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BeforeAfterSlider, BeforeAfterImage } from "@/components/ui/before-after-slider";

const faqData = [
    {
      question: "What is AI Photo Restore and how does it work?",
      answer: "AI Photo Restore is a completely free AI-powered tool that helps you restore and enhance old, damaged, or low-quality photos. Using advanced machine learning technology, it can repair scratches, fix colors, improve clarity, and bring new life to your cherished memories - all at no cost to you."
    },
    {
      question: "Is AI Photo Restore really 100% free?",
      answer: "Yes! AI Photo Restore is absolutely free with no hidden costs. You can use all features including uploading photos, AI restoration, and downloading results without paying anything. We believe everyone should have access to photo restoration technology."
    },
    {
      question: "What types of photo restoration can it perform?",
      answer: "Our free AI Photo Restore tool can handle multiple types of photo damage including: color fading, scratches, tears, stains, blur, low resolution, and old photo artifacts. It works great on both black & white and color photographs."
    },
    {
        question: "Are there any usage limits since it's free?",
        answer: "While AI Photo Restore is completely free, we recommend reasonable usage to ensure everyone can benefit from the service. You can restore multiple photos per day without any cost, but please be mindful of other users."
    },
    {
        question: "What are the benefits of using AI Photo Restore?",
        answer: "AI Photo Restore offers several key benefits: Professional-quality photo restoration completely free of charge, preservation of precious memories and historical photos, enhancement of image quality and clarity, easy-to-use interface with no technical skills required, and unlimited access to advanced AI restoration technology."
    },
    {
        question: "How to get the best results with AI Photo Restore?",
        answer: "For optimal results with our free tool, we recommend: Scanning your photos at high resolution (300 DPI or higher), ensuring your photo is well-lit when scanning, uploading clear images of the damaged photo, and being patient while our AI processes your image for the best possible restoration."
    }
  ];

export default async function PhotoRestorePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <PhotoRestoreClient />

      <section className="mt-16">
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Flux AI Photo Restore
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
                Restore photo using Flux AI
            </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">AI Photo Restore Example 1</h3>
                <div className="mt-4 h-96 w-full max-w-md">
                    <BeforeAfterSlider
                        itemOne={<BeforeAfterImage src="/images/restore-before-1.jpg" alt="Before" />}
                        itemTwo={<BeforeAfterImage src="/images/restore-after-1.jpg" alt="After" />}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">AI Photo Restore Example 2</h3>
                <div className="mt-4 h-96 w-full max-w-md">
                    <BeforeAfterSlider
                        itemOne={<BeforeAfterImage src="/images/restore-before-2.jpg" alt="Before" />}
                        itemTwo={<BeforeAfterImage src="/images/restore-after-2.jpg" alt="After" />}
                    />
                </div>
            </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            AI Photo Restore FAQ
          </h2>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

    </div>
  );
} 