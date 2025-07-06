"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { toast } from "sonner";

import { BeforeAfterSlider, BeforeAfterImage } from "@/components/ui/before-after-slider";
import { Button } from "@/components/ui/button";
import { ImageUploadArea } from "@/components/shared/image-upload-area";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { ArrowRight, Loader, Sparkles } from "lucide-react";
import { restorePhotoAction } from "@/app/tools/photo-restore/actions";

// Helper function to find the closest aspect ratio
const supportedRatios = {
  "21:9": 21 / 9,
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "1:1": 1,
  "2:3": 2 / 3,
  "3:4": 3 / 4,
  "9:16": 9 / 16,
  "9:21": 9 / 21,
};
type SupportedRatio = keyof typeof supportedRatios;

function getClosestAspectRatio(width: number, height: number): SupportedRatio {
  const originalRatio = width / height;
  let closestRatio: SupportedRatio = "1:1";
  let minDifference = Infinity;

  for (const ratioKey in supportedRatios) {
    const key = ratioKey as SupportedRatio;
    const difference = Math.abs(originalRatio - supportedRatios[key]);
    if (difference < minDifference) {
      minDifference = difference;
      closestRatio = key;
    }
  }
  return closestRatio;
}

interface PhotoRestoreClientProps {
  // We'll add translations here later
}

const initialState = {
  message: "",
  errors: null,
  result: null,
};

export function PhotoRestoreClient({}: PhotoRestoreClientProps) {
  const [formState, formAction] = useFormState(restorePhotoAction, initialState);

  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addWatermark, setAddWatermark] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<SupportedRatio | null>(null);

  useEffect(() => {
    setIsLoading(false);
    if (formState.message) {
      if (formState.errors || formState.message.startsWith("操作失败")) {
        toast.error(formState.message, {
            description: formState.errors 
                ? Object.values(formState.errors).flat().join('\n') 
                : undefined
        });
      } else {
        toast.success(formState.message);
      }
    }
    
    if (formState.result?.images?.[0]?.url) {
      setRestoredImage(formState.result.images[0].url);
    }
  }, [formState]);

  const handleImageDrop = (file: File) => {
    setOriginalImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);

      // Calculate aspect ratio
      const img = document.createElement("img");
      img.onload = () => {
        const calculatedRatio = getClosestAspectRatio(img.width, img.height);
        setAspectRatio(calculatedRatio);
        console.log(`>>> [RATIO_CALC] Original: ${img.width}x${img.height}, Closest API ratio: ${calculatedRatio}`);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    setRestoredImage(null); // Reset restored image on new upload
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview) return;
    setIsLoading(true);
    setRestoredImage(null);
    const formData = new FormData(event.currentTarget);
    formData.set("imageUrl", preview); // Add the image data to the form
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left Panel: Controls */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-1">
        <h2 className="text-xl font-semibold">Origin Image</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Want to restore, upscale & colorize images with best quality? 
          <a href="#" className="text-primary hover:underline"> Try Flux Kontext Photo Restore</a>
        </p>
        
        <div className="mt-6">
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Original image preview"
                width={512}
                height={512}
                className="h-auto w-full rounded-lg object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setPreview(null);
                  setOriginalImage(null);
                  setRestoredImage(null);
                  setAspectRatio(null);
                }}
                className="absolute right-2 top-2"
              >
                Remove
              </Button>
            </div>
          ) : (
            <ImageUploadArea onImageDrop={handleImageDrop} />
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <label htmlFor="watermark" className="font-medium">
              Watermark
            </label>
            <Toggle
              id="watermark"
              pressed={addWatermark}
              onPressedChange={setAddWatermark}
              aria-label="Toggle watermark"
            >
              {addWatermark ? "On" : "Off"}
            </Toggle>
          </div>
          <Button
            type="submit"
            disabled={!preview || isLoading}
            className="w-full text-lg"
            size="lg"
          >
            {isLoading ? (
              <Loader className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Right Panel: Result */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-2">
        <h2 className="text-xl font-semibold">AI Photo Restore Image Result</h2>
        <div
          className={cn(
            "mt-4 flex items-center justify-center rounded-lg border-2 border-dashed bg-background",
            !restoredImage && "h-[500px] border-border"
          )}
        >
          {restoredImage ? (
            <BeforeAfterSlider
              className="max-w-full max-h-[80vh]"
              itemOne={<BeforeAfterImage src={preview!} alt="Original Image" />}
              itemTwo={
                <BeforeAfterImage src={restoredImage} alt="Restored Image" />
              }
            />
          ) : (
            <p className="text-muted-foreground">
              {isLoading
                ? "Restoring your image, please wait..."
                : "The restored image results will appear here."}
            </p>
          )}
        </div>
        {restoredImage && (
          <Button asChild size="lg" className="mt-4 w-full">
            <a href={restoredImage} download={`restored-image-${Date.now()}.png`}>
              Download
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        )}
      </div>
    </form>
  );
} 