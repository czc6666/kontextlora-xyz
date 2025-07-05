"use client";

import { useEffect } from "react";
import TextareaAutosize from 'react-textarea-autosize';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { HistoryItem } from "@/components/features/history-item-type";
import HistoryPanel from "./history-panel";
import { Wand2, Dices, Image as ImageIcon, Crown } from "lucide-react";
import PromptToolbar from "./prompt-toolbar";
import { Skeleton } from "@/components/ui/skeleton";

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
  isPending: boolean;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
  lastSuccessfulInputs: Record<string, any> | null;
  errors: Record<string, string[] | undefined> | null;
  history: HistoryItem[];
  setHighlightedHistoryId: (id: number | null) => void;
  isPro: boolean;
  credits: number;
  isStatusLoading: boolean;
}

const ControlPanelSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-12 w-full" />
  </div>
);

export default function ControlPanel({
  isPending,
  setHistory,
  setIsPending,
  lastSuccessfulInputs,
  errors,
  history,
  setHighlightedHistoryId,
  isPro,
  credits,
  isStatusLoading,
}: ControlPanelProps) {
  const { form, onSubmit } =
    useGenerationForm({ setHistory, setIsPending });

  const { register, control, setValue, getValues, formState: { dirtyFields }, watch } = form;
  
  const {
    state: prompt,
    setState: setPrompt,
    undo: undoPrompt,
    redo: redoPrompt,
    clearHistory: clearPrompt,
    canUndo: canUndoPrompt,
    canRedo: canRedoPrompt,
  } = useHistoryState(lastSuccessfulInputs?.prompt ?? "");

  useEffect(() => {
    // Sync the local prompt state (from useHistoryState) with the form state
    setValue("prompt", prompt, { shouldDirty: true });
  }, [prompt, setValue]);

  // Watch form values
  const numImages = watch("num_images", 1);
  const steps = watch("steps", 20);
  const cfg = watch("cfg", 4.5);
  const width = watch("width", 1024);
  const height = watch("height", 1024);
  const selectedAspectRatioLabel = aspectRatios.find(r => r.width === width && r.height === height)?.label || "Custom";
  
  const handleRandomPrompt = () => {
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setValue("prompt", randomPrompt, { shouldDirty: true });
    setPrompt(randomPrompt);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    const newPrompt = String(item.inputs?.prompt || "");
    setPrompt(newPrompt);
    setValue('prompt', newPrompt, { shouldDirty: true });
    setHighlightedHistoryId(item.id);
    setTimeout(() => setHighlightedHistoryId(null), 1000);
  };

  const selectedModelId = watch("model", models[0].id);
  const selectedModel = models.find((m) => m.id === selectedModelId);

  let buttonMainText = "Generate";
  let buttonSubText = "";

  if (selectedModel && !selectedModel.access.includes("free")) {
    if (isPro) {
      buttonSubText = "Pro 用户不消耗积分";
    } else {
      const cost = selectedModel.creditCost ?? 0;
      const totalCost = cost * numImages;
      buttonMainText = `Generate (${totalCost} 积分)`;
    }
  }

  const handleApplyLastSettings = () => {
    if (lastSuccessfulInputs) {
      Object.keys(lastSuccessfulInputs).forEach(key => {
        setValue(key as any, lastSuccessfulInputs[key], { shouldDirty: true });
      });
      setPrompt(lastSuccessfulInputs.prompt);
    }
  };

  if (isStatusLoading) {
    return <ControlPanelSkeleton />;
  }

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={onSubmit} className="space-y-6 flex-grow">
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
                  badge = { text: 'Pro / 积分', style: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
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
          <TextareaAutosize
            id="prompt"
            name="prompt"
            placeholder="A beautiful landscape painting..."
            className="mt-1 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            minRows={3}
            maxRows={8}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="mt-2 flex items-center justify-between">
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
            {/* We can add style selector here later */}
          </div>
          {errors?.prompt && <p className="text-sm text-red-500 mt-1">{errors.prompt[0]}</p>}
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

        <div>
          <Label>Aspect ratio</Label>
          <Select
            value={`${width}x${height}`}
            onValueChange={(value) => {
              const [w, h] = value.split("x").map(Number);
              setValue("width", w, { shouldDirty: true });
              setValue("height", h, { shouldDirty: true });
            }}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select an aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((r) => (
                <SelectItem
                  key={`${r.width}x${r.height}`}
                  value={`${r.width}x${r.height}`}
                >
                  {r.label} ({r.width}px x {r.height}px)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Number of images</Label>
          <ToggleGroup
            type="single"
            variant="outline"
            className="mt-2 grid grid-cols-5 gap-2"
            value={String(numImages)}
            onValueChange={(value) => {
              if (value) setValue("num_images", parseInt(value, 10));
            }}
          >
            <TooltipProvider>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isProOption = num > 2;
                const isDisabled = isProOption && !isPro;

                if (isDisabled) {
                  return (
                    <Tooltip key={num}>
                      <TooltipTrigger asChild>
                        <ToggleGroupItem
                          value={String(num)}
                          disabled={true}
                          className="w-full flex items-center justify-center gap-1.5"
                          aria-label={`Generate ${num} images`}
                        >
                           <Crown className="w-3 h-3 text-yellow-500" />
                          <span>{num}</span>
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pro subscription required</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <ToggleGroupItem
                    key={num}
                    value={String(num)}
                    className="w-full"
                    aria-label={`Generate ${num} images`}
                  >
                    {num}
                  </ToggleGroupItem>
                );
              })}
            </TooltipProvider>
          </ToggleGroup>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-settings">
            <AccordionTrigger>Advanced settings</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div>
                <Label htmlFor="steps">Steps: {steps}</Label>
                <Slider
                  id="steps"
                  min={10}
                  max={50}
                  step={1}
                  value={[steps]}
                  onValueChange={(value) => setValue("steps", value[0], { shouldDirty: true })}
                />
              </div>

              <div>
                <Label htmlFor="cfg">CFG Scale: {cfg}</Label>
                <Slider
                  id="cfg"
                  min={1}
                  max={10}
                  step={0.5}
                  value={[cfg]}
                  onValueChange={(value) => setValue("cfg", value[0], { shouldDirty: true })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleApplyLastSettings}
          disabled={!lastSuccessfulInputs || isPending}
        >
          Apply last settings
        </Button>

        <Button type="submit" className="w-full h-12" disabled={isPending}>
          <div className="flex flex-col items-center">
            <span>{isPending ? "Generating..." : buttonMainText}</span>
            {buttonSubText && !isPending && <span className="text-xs font-normal opacity-75">{buttonSubText}</span>}
          </div>
        </Button>
      </form>
      <div className="mt-4 border-t pt-4">
        <HistoryPanel history={history} onSelectHistory={handleSelectHistory} />
      </div>
    </div>
  );
}
