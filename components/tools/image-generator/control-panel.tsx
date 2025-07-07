"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FAL_MODELS } from "@/config/models";
import Link from "next/link";

const falSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt cannot be empty." }),
  image_size: z.string(),
  model: z.string(),
});

type FalFormValues = z.infer<typeof falSchema>;

interface ControlPanelProps {
  user: User | null;
  isPro: boolean;
  isPending: boolean;
  onSubmit: (data: FalFormValues) => void;
}

const modelOptions = Object.values(FAL_MODELS);

export function ControlPanel({
  user,
  isPro,
  isPending,
  onSubmit,
}: ControlPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<FalFormValues>({
    resolver: zodResolver(falSchema),
    defaultValues: {
      prompt: "",
      model: modelOptions[0].id,
      image_size: modelOptions[0].parameters.default_image_size,
    },
  });

  const selectedModelId = watch('model');
  const selectedModel = FAL_MODELS[selectedModelId as keyof typeof FAL_MODELS];
  const imageSizes = selectedModel.parameters.image_sizes;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Lora AI Image Generator</h1>
        <p className="text-muted-foreground text-sm">
          Powered by fal.ai FLUX.1
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow">
        <div>
          <Label htmlFor="model">Model</Label>
          <Select name="model" defaultValue={selectedModel.id} onValueChange={(value) => setValue("model", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            {...register("prompt")}
            placeholder="A majestic lion wearing a crown, photorealistic."
            className="resize-none"
            rows={5}
          />
          {errors.prompt && <p className="text-sm text-red-500 mt-1">{errors.prompt.message}</p>}
        </div>

        <div>
          <Label htmlFor="image_size">Image Size</Label>
          <Select name="image_size" defaultValue={selectedModel.parameters.default_image_size} onValueChange={(value) => setValue("image_size", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select image size" />
            </SelectTrigger>
            <SelectContent>
              {imageSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow" />

        {!isPro ? (
          <Link href="/pricing" className="w-full">
            <Button type="button" className="w-full" disabled={isPending}>
              Upgrade to Pro
            </Button>
          </Link>
        ) : (
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Generating...' : 'Generate'}
          </Button>
        )}
      </form>
    </div>
  );
}