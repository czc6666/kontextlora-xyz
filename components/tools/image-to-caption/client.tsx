"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { toast } from "sonner";
import { Loader, Sparkles, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploadArea } from "@/components/shared/image-upload-area";
import { Textarea } from "@/components/ui/textarea";
import { imageToCaptionAction } from "@/app/tools/image-to-caption/actions";

const initialState = {
  message: "",
  errors: null,
  result: null,
};

export function ImageToCaptionClient() {
  const [formState, formAction] = useFormState(imageToCaptionAction, initialState);

  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string>("");
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
    
    if (formState.result?.caption) {
      setGeneratedCaption(formState.result.caption);
    }
  }, [formState]);

  const handleImageDrop = (file: File) => {
    setOriginalImage(file);
    setGeneratedCaption(""); // Reset caption on new upload

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCopyToClipboard = () => {
    if (!generatedCaption) return;
    navigator.clipboard.writeText(generatedCaption);
    toast.success("Caption copied to clipboard!");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!originalImage) return;

    setIsLoading(true);
    setGeneratedCaption("");

    const reader = new FileReader();
    reader.readAsDataURL(originalImage);
    reader.onload = () => {
      const base64Image = reader.result as string;
      const formData = new FormData();
      formData.set("imageUrl", base64Image);
      formAction(formData);
    };
    reader.onerror = () => {
      toast.error("Failed to read the file.");
      setIsLoading(false);
    };
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Upload Image</h3>
          <p className="text-sm text-muted-foreground">Select an image to generate captions</p>
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Uploaded image preview"
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
                  setGeneratedCaption("");
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
          <h3 className="text-lg font-semibold">Generated Captions</h3>
          <div className="relative h-full">
            <Textarea
              readOnly
              value={isLoading ? "Generating caption..." : generatedCaption}
              className="h-full min-h-[250px] resize-none"
              placeholder="Your generated captions will appear here."
            />
            {generatedCaption && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyToClipboard}
                className="absolute right-2 top-2"
                aria-label="Copy caption"
              >
                <Copy className="h-4 w-4" />
              </Button>
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
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          Generate Captions
        </Button>
      </div>
    </form>
  );
} 