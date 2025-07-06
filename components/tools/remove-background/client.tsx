"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowRight, Loader, Wand2 } from "lucide-react";

import { BeforeAfterSlider, BeforeAfterImage } from "@/components/ui/before-after-slider";
import { Button } from "@/components/ui/button";
import { ImageUploadArea } from "@/components/shared/image-upload-area";
import { cn } from "@/lib/utils";
import { removeBackgroundAction } from "@/app/tools/free/remove-background/actions";

const initialState = {
  message: "",
  errors: null,
  result: null,
};

export function RemoveBackgroundClient() {
  const [formState, formAction] = useFormState(removeBackgroundAction, initialState);

  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (formState.result?.imageUrl) {
      setOutputImageUrl(formState.result.imageUrl);
    }
  }, [formState]);

  const handleImageDrop = (file: File) => {
    setOriginalImage(file);
    setOutputImageUrl(null); // Reset output image on new upload

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!originalImage) return;

    setIsLoading(true);
    setOutputImageUrl(null);

    const reader = new FileReader();
    reader.readAsDataURL(originalImage);
    reader.onload = () => {
      const base64Image = reader.result as string;
      const formData = new FormData();
      formData.set("imageUrl", base64Image);
      formAction(formData);
    };
    reader.onerror = (error) => {
      toast.error("Failed to read the file.");
      setIsLoading(false);
    };
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Input</h3>
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
                onClick={(e) => {
                  e.preventDefault();
                  setPreview(null);
                  setOriginalImage(null);
                  setOutputImageUrl(null);
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

        {/* Output */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Output</h3>
          <div
            className={cn(
              "flex h-full min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed bg-background",
              !outputImageUrl && "border-border"
            )}
          >
            {outputImageUrl ? (
                <Image
                    src={outputImageUrl}
                    alt="Output image"
                    width={512}
                    height={512}
                    className="h-auto w-full rounded-lg object-contain"
                />
            ) : (
              <p className="text-center text-muted-foreground">
                {isLoading ? "Removing background..." : "The result will appear here."}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          disabled={!originalImage || isLoading}
          className="w-full text-lg"
          size="lg"
        >
          {isLoading ? (
            <Loader className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Remove Background
        </Button>
      </div>

    </form>
  );
} 