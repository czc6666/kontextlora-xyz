import { RemoveBackgroundClient } from "@/components/tools/remove-background/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

const faqData = [
  {
    question: "What makes this background remover tool stand out?",
    answer: "Our background remover tool provides top-quality background removal for free, and is easy to use. Whether you're looking to remove backgrounds from photos for social media or professional use, our tool guarantees a seamless experience across both desktop and mobile devices."
  },
  {
    question: "Is this background removal tool free to use?",
    answer: "Yes, this background remover is 100% free. You can use our background removal service for unlimited photos with no cost."
  },
  {
    question: "Can I remove backgrounds on my mobile device?",
    answer: "Absolutely! Our mobile-friendly background remover allows you to easily remove backgrounds from photos on your smartphone or tablet. Upload, edit, and download in seconds!"
  },
  {
    question: "How do I remove a background and make it transparent?",
    answer: "When you remove the background, your image will be saved as a PNG file with a transparent background, allowing you to use it on any other background easily."
  },
  {
    question: "Can I change the background after removing it?",
    answer: "Yes! After background removal, you can place your image on any new background. Our background editor makes it easy to create a new look by replacing the original background with your desired image."
  },
  {
    question: "What file formats are supported by the background remover?",
    answer: "Our background remover supports popular image formats like JPG, PNG, and GIF. After removing the background, your image will be saved in PNG format with transparency."
  },
  {
    question: "Is the background removal accurate for complex images?",
    answer: "Yes, our tool is highly effective at removing backgrounds, even from complex images with intricate edges like hair or detailed patterns."
  },
  {
    question: "Do I need design skills to use the background remover?",
    answer: "No design experience is necessary! Our background remover is simple enough for anyone to use. You can remove backgrounds from images with just a few clicks, no technical skills required."
  },
  {
    question: "Is there a limit to how many photos I can process for free?",
    answer: "You can remove backgrounds from as many photos as you like without any limitations or fees."
  },
  {
    question: "Can I use the background remover tool for commercial purposes?",
    answer: "Yes, the images you create using our background remover can be used for both personal and commercial projects without any licensing restrictions."
  }
];

export default async function RemoveBackgroundPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Remove Background from Images
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Use Background Remover Free Online
        </p>
      </section>

      {/* Client Component */}
      <RemoveBackgroundClient />

      {/* Example Section */}
      <section className="mt-16">
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Remove Background Example
            </h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
                <div className="font-medium text-center">Before</div>
                <Image src="/images/rb-example-1-before.jpg" alt="Example 1 Before" width={512} height={768} className="rounded-lg mx-auto" />
            </div>
            <div className="flex flex-col gap-4">
                <div className="font-medium text-center">After</div>
                <Image src="/images/rb-example-1-after.png" alt="Example 1 After" width={512} height={768} className="rounded-lg mx-auto" />
            </div>
            <div className="flex flex-col gap-4">
                <div className="font-medium text-center">Before</div>
                <Image src="/images/rb-example-2-before.jpg" alt="Example 2 Before" width={512} height={512} className="rounded-lg mx-auto" />
            </div>
            <div className="flex flex-col gap-4">
                <div className="font-medium text-center">After</div>
                <Image src="/images/rb-example-2-after.png" alt="Example 2 After" width={512} height={512} className="rounded-lg mx-auto" />
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Flux AI Frequently asked questions
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