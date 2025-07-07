"use client";

import { useState } from 'react';
import type { User } from "@supabase/supabase-js";
import { ControlPanel } from "@/components/tools/image-generator/control-panel";
import ResultPanel from "@/components/tools/image-generator/result-panel";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { generateImageAction } from './actions';
import { z } from 'zod';

const falSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt cannot be empty." }),
  image_size: z.string(),
  model: z.string(),
});

type FalFormValues = z.infer<typeof falSchema>;

interface ImageGeneratorClientProps {
  user: User | null;
  initialIsPro: boolean;
  initialCredits: number;
}

export function ImageGeneratorClient({ 
  user, 
  initialIsPro,
  initialCredits,
}: ImageGeneratorClientProps) {
  const [isPending, setIsPending] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FalFormValues) => {
    setIsPending(true);
    setImages([]);
    setError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const result = await generateImageAction(null, formData);

    if (result.imageUrls) {
      setImages(result.imageUrls);
    } else {
      setError(result.message || "An unknown error occurred.");
    }

    setIsPending(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Lora AI Image Generator</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ControlPanel
            user={user}
            isPro={initialIsPro}
            isPending={isPending}
            onSubmit={onSubmit}
          />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <ResultPanel images={images} error={error} isPending={isPending} />
        </div>
      </div>
    </div>
  );
} 