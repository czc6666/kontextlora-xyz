"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateSchema } from "@/lib/schemas";
import { useHistoryState } from "@/hooks/use-history-state";
import { useGenerationForm } from "@/hooks/use-generation-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { HistoryItem } from "./history-item-type";
import { Wand2, Dices, Image as ImageIcon, Crown } from "lucide-react";
import PromptToolbar from "./prompt-toolbar";
import type { User } from "@supabase/supabase-js";

const models = [
  { id: "Kwai-Kolors/Kolors", name: "FLUX.1-schnell", access: ["free"] },
  { id: "flux-1-kontext", name: "flux.1 kontext", access: ["pro", "credits"], creditCost: 20 },
  { id: "dall-e-3", name: "DALL-E 3", access: ["pro", "credits"], creditCost: 10 },
  { id: "flux-schnell", name: "FLUX.1-schnell", access: ["pro", "credits"], creditCost: 5 },
  { id: "flux-1-dev", name: "FLUX.1 [dev] Flexible", access: ["pro", "credits"], creditCost: 1 },
  { id: "stable-diffusion-3", name: "Stable Diffusion 3", access: ["pro", "credits"], creditCost: 2 },
];

const aspectRatios = [
  { label: "Square", width: 1024, height: 1024 },
  { label: "Portrait", width: 1024, height: 1280 },
  { label: "Landscape", width: 1280, height: 1024 },
];

const randomPrompts = [
  "A majestic lion wearing a crown, sitting on a throne in a magical forest, photorealistic.",
  "A futuristic cityscape at night, with flying cars and neon lights, anime style.",
  "An enchanted library with floating books and glowing shelves, fantasy art.",
  "A portrait of a beautiful cyborg woman with intricate mechanical details, cyberpunk.",
  "A serene Japanese garden with a koi pond and cherry blossoms in full bloom, watercolor painting.",
  "A steampunk dragon with gears and cogs for scales, detailed illustration.",
];

interface ControlPanelProps {
  user: User | null;
  isPending: boolean;
  onSubmit: (data: z.infer<typeof generateSchema>) => Promise<void>;
  isPro: boolean;
  credits: number;
}

export function ControlPanel({
  user,
  isPending,
  onSubmit,
  isPro,
  credits,
}: ControlPanelProps) {
  const form = useGenerationForm();
  const { register, control, setValue, getValues, formState, watch } = form;
  const { errors } = formState;

  const handleSubmit = form.handleSubmit(onSubmit);
  
  const {
    state: prompt,
    setState: setPrompt,
    undo: undoPrompt,
    redo: redoPrompt,
    clearHistory: clearPrompt,
    canUndo: canUndoPrompt,
    canRedo: canRedoPrompt,
  } = useHistoryState("");

  useEffect(() => {
    setValue("prompt", prompt, { shouldDirty: true });
  }, [prompt, setValue]);

  const numImages = watch("num_images", 1);
  const steps = watch("steps", 20);
  const cfg = watch("cfg", 4.5);
  const width = watch("width", 1024);
  const height = watch("height", 1024);
  
  const handleRandomPrompt = () => {
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setValue("prompt", randomPrompt, { shouldDirty: true });
    setPrompt(randomPrompt);
  };

  const selectedModelId = watch("model", models[0].id);
  const selectedModel = models.find((m) => m.id === selectedModelId);

  let buttonMainText = "Generate";
  let buttonSubText = "";

  if (selectedModel && !selectedModel.access.includes("free")) {
    if (isPro) {
      buttonSubText = "Pro user, no credits cost";
    } else {
      const cost = selectedModel.creditCost ?? 0;
      const totalCost = cost * numImages;
      buttonMainText = `Generate (${totalCost} credits)`;
    }
  }

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
        <div>
          <Label htmlFor="model">Model</Label>
          <Select name="model" defaultValue={models[0].id} onValueChange={(value) => setValue('model', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => {
                const hasAccess = 
                  model.access.includes('free') || 
                  (model.access.includes('pro') && isPro) ||
                  (model.access.includes('credits') && credits >= (model.creditCost ?? 0));
                
                const isDisabled = !hasAccess;

                let badge: { text: string; style: string } | null = null;
                const isFreeModel = model.access.includes('free');

                if (isFreeModel) {
                  badge = { text: 'Free', style: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
                } else {
                  badge = { text: 'Pro / Credits', style: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
                }

                return (
                  <SelectItem key={model.id} value={model.id} disabled={isDisabled}>
                    <div className="flex items-center justify-between w-full">
                      <span>{model.name}</span>
                      {badge && (
                        <span className={`ml-4 px-2 py-0.5 rounded-full text-xs font-semibold ${badge.style}`}>
                          {badge.text}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <div className="relative">
            <Textarea
              id="prompt"
              {...register("prompt")}
              placeholder="A photo of a cute corgi"
              className="pr-20"
              rows={3}
            />
            <div className="absolute top-2 right-2">
              <PromptToolbar 
                onUndo={undoPrompt}
                onRedo={redoPrompt}
                onClear={() => {
                  setPrompt("");
                  setValue("prompt", "");
                  clearPrompt("");
                }}
                canUndo={canUndoPrompt}
                canRedo={canRedoPrompt}
              />
            </div>
          </div>
          {errors?.prompt && <p className="text-sm text-red-500 mt-1">{errors.prompt.message}</p>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button type="button" variant="outline" size="sm" onClick={handleRandomPrompt}>
            <Dices className="mr-2 h-4 w-4" />
            Random prompt
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            <ImageIcon className="mr-2 h-4 w-4" />
            Describe image
          </Button>
          <Button type="button" variant="outline" size="sm" disabled>
            <Wand2 className="mr-2 h-4 w-4" />
            AI Improve
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Advanced Settings</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label>Aspect Ratio</Label>
                  <ToggleGroup
                    type="single"
                    defaultValue={`${width}x${height}`}
                    onValueChange={(value) => {
                      if (value) {
                        const [w, h] = value.split("x").map(Number);
                        setValue("width", w, { shouldDirty: true });
                        setValue("height", h, { shouldDirty: true });
                      }
                    }}
                    className="grid grid-cols-3 gap-2"
                  >
                    {aspectRatios.map(r => (
                      <ToggleGroupItem key={r.label} value={`${r.width}x${r.height}`}>
                        {r.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="steps">Steps: {steps}</Label>
                  <Slider
                    id="steps"
                    min={10}
                    max={50}
                    step={1}
                    value={[steps]}
                    onValueChange={([val]) => setValue("steps", val, { shouldDirty: true })}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="cfg">CFG Scale: {cfg}</Label>
                   <Slider
                    id="cfg"
                    min={1}
                    max={10}
                    step={0.5}
                    value={[cfg]}
                    onValueChange={([val]) => setValue("cfg", val, { shouldDirty: true })}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="num_images">Number of images: {numImages}</Label>
                  <Slider
                    id="num_images"
                    min={1}
                    max={4}
                    step={1}
                    value={[numImages]}
                    onValueChange={([val]) => setValue("num_images", val, { shouldDirty: true })}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Generating...' : buttonMainText}
          {buttonSubText && <span className="text-xs ml-2 opacity-80">({buttonSubText})</span>}
        </Button>
      </form>
    </div>
  );
}

