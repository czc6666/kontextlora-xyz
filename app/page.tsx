"use client";

import { GenerateForm } from "@/components/features/generate-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, Bot, Code, PaintBucket } from "lucide-react";
import { ImageGenerationStudio } from "@/components/features/image-generation-studio";

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Page() {

  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <motion.main
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.2 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="py-12 md:py-24 lg:py-32 border-b"
        variants={FADE_IN_ANIMATION_SETTINGS}
      >
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <motion.div className="space-y-4" variants={FADE_IN_ANIMATION_SETTINGS}>
                <motion.div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm" variants={FADE_IN_ANIMATION_SETTINGS}>
                  ✨ Powered by FLUX.1 Kontext
                </motion.div>
                <motion.h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none" variants={FADE_IN_ANIMATION_SETTINGS}>
                  Kontext Lora: 新一代AI图像创作
                </motion.h1>
                <motion.p className="max-w-[600px] text-muted-foreground md:text-xl" variants={FADE_IN_ANIMATION_SETTINGS}>
                  释放您的创造力。借助先进的 FLUX.1 Kontext 模型，在几秒钟内将您的想法转化为令人惊叹的高保真视觉效果。
                </motion.p>
                <motion.ul className="grid gap-2 py-4" variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
                }}>
                  <motion.li className="flex items-center" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    先进的 FLUX.1 模型
                  </motion.li>
                  <motion.li className="flex items-center" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    高保真图像输出
                  </motion.li>
                  <motion.li className="flex items-center" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    闪电般的生成速度
                  </motion.li>
                  <motion.li className="flex items-center" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    简洁直观的界面
                  </motion.li>
                   <motion.li className="flex items-center" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    灵活的订阅与积分计划
                  </motion.li>
                   <motion.li className="flex items-center" variants={FADE_IN_ANIMATION_SETTINGS}>
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    安全的用户账户与历史记录
                  </motion.li>
                </motion.ul>
              </motion.div>
              <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={FADE_IN_ANIMATION_SETTINGS}>
                <Button asChild size="lg">
                  <Link href="/sign-up">Get Started Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#generate">View Demo &rarr;</Link>
                </Button>
              </motion.div>
            </div>
            <motion.div variants={FADE_IN_ANIMATION_SETTINGS}>
              <Image
                src="https://image.cdn2.seaart.me/20250111/a91a62f5-70dd-4493-a84c-1bb3848ead6f_high.webp"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Generator Section */}
      <motion.section 
        id="generate" 
        className="py-8 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              立即体验 Kontext Lora
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              将您的想法变为现实。只需输入提示，让我们的 AI 发挥魔力。
            </p>
          </div>
          
          <ImageGenerationStudio />

        </div>
      </motion.section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">三步轻松上手</h2>
              <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                  从灵感到杰作，过程从未如此简单。
              </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <div className="grid gap-1 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">1</div>
                  <h3 className="text-xl font-bold">描述您的画面</h3>
                  <p className="text-muted-foreground">
                      用文字详细描绘您想要生成的图像内容。
                  </p>
              </div>
              <div className="grid gap-1 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">2</div>
                  <h3 className="text-xl font-bold">调整专业参数</h3>
                  <p className="text-muted-foreground">
                      通过高级设置，精确控制图像尺寸、细节和风格。
                  </p>
              </div>
              <div className="grid gap-1 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">3</div>
                  <h3 className="text-xl font-bold">一键生成</h3>
                  <p className="text-muted-foreground">
                      点击生成按钮，即刻获得四张独特的AI艺术作品。
                  </p>
              </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">核心功能</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                    探索我们强大的功能，释放您的无限创意。
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                        <PaintBucket className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold">顶尖模型</h3>
                            <p className="text-muted-foreground">
                                集成黑森林实验室的 FLUX.1 Schnell 模型，提供闪电般的生成速度和卓越的图像质量。
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <BarChart className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold">高级控制</h3>
                            <p className="text-muted-foreground">
                                自由调整图像尺寸、生成步数、引导强度(CFG)等参数，实现对创作过程的精细控制。
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Bot className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold">批量生成</h3>
                            <p className="text-muted-foreground">
                                单次提示即可生成四张不同的图像变体，让您有更多选择，激发更多灵感。
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Code className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold">开发者友好</h3>
                            <p className="text-muted-foreground">
                                基于 Next.js 和 shadcn/ui 构建，代码结构清晰，易于扩展和二次开发。
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative h-[400px] w-full">
                    <Image
                        alt="Featured Image"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                        height="400"
                        src="/placeholder.svg"
                        width="550"
                    />
                </div>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">常见问题</h2>
              <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                  有任何疑问？在这里找到答案。
              </p>
          </div>
          <div className="mx-auto max-w-3xl mt-12">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>我需要付费才能使用吗？</AccordionTrigger>
                <AccordionContent>
                  目前，本项目作为技术演示和模板，所有功能均可免费使用。您只需要一个GitHub账户进行登录即可开始创作。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>生成一张图片需要多长时间？</AccordionTrigger>
                <AccordionContent>
                  得益于 FLUX.1 Schnell 模型，图像生成速度非常快，通常在几秒钟内就能完成。具体时间取决于服务器负载。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>我可以将生成的图片用于商业用途吗？</AccordionTrigger>
                <AccordionContent>
                  这取决于您所使用的基础模型的许可协议。本项目不保留您生成图像的任何权利，但请您自行确认上游模型的许可条款。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>我可以自己部署这个项目吗？</AccordionTrigger>
                <AccordionContent>
                  当然可以！这是一个开源模板，您可以自由地克隆、修改和部署。您需要准备自己的 Supabase 和硅基流动 API 密钥。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

    </motion.main>
  );
}