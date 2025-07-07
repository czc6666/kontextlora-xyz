import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Features from "@/components/home/features";
import Stats from "@/components/home/stats";
import Pricing from "@/components/home/pricing";
import FAQ from "@/components/home/faq";
import Contact from "@/components/home/contact";
import ScrollingGallery from "@/components/home/scrolling-gallery";

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <section className="py-20 md:py-32 lg:py-40 text-center">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="#" 
              className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium transition-colors hover:bg-muted/80 mb-4"
            >
              Watch: AI Visuals So Real, You'll Forget They're Fake <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
              The ultimate AI platform for images, videos & more
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Use text prompts to create and edit images, generate videos, or build your own AI models. Work smarter, not harder.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link href="/tools/image-generator">
                  Start creating for free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Powered by Section */}
        <section className="text-center pb-20 md:pb-32">
          <p className="text-muted-foreground mb-6">Powered by</p>
          <div className="flex justify-center items-center gap-x-8 md:gap-x-12 lg:gap-x-16 text-muted-foreground font-semibold text-lg">
            <span>FLUX</span>
            <span>ByteDance</span>
            <span>Google DeepMind</span>
            <span>KLING</span>
            <span>runway</span>
          </div>
        </section>

        {/* Scrolling Image Gallery Section */}
        <section className="pb-20 md:pb-32">
          <ScrollingGallery />
        </section>
      </div>
      
      <Features />
      <Stats />
      <Pricing />
      <FAQ />
      <Contact />
    </main>
  );
}