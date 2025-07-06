"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { toast } from "sonner";
import { Loader, Sparkles, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploadArea } from "@/components/shared/image-upload-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { imageToPromptAction } from "@/app/tools/image-to-prompt/actions";
import { FormMessage } from "@/components/form-message";

const initialState = {
  message: "",
  errors: null,
  result: null,
};

export function ImageToPromptClient() {
  const [formState, formAction] = useFormState(imageToPromptAction, initialState);

  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    if (formState.message) {
      if (formState.errors || formState.message.startsWith("操作失败")) {
        toast.error(formState.message);
      } else {
        toast.success(formState.message);
      }
    }
  }, [formState]);

  const handleImageDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCopyToClipboard = () => {
    if (!formState.result?.prompt) return;
    navigator.clipboard.writeText(formState.result.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview) {
      toast.error("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set("imageUrl", preview);
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-5xl space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Upload Image</h3>
          {preview ? (
            <div className="relative">
              <Image src={preview} alt="Uploaded image" width={512} height={512} className="h-auto w-full rounded-lg object-contain" />
              <Button variant="destructive" size="sm" onClick={() => setPreview(null)} className="absolute right-2 top-2">Remove</Button>
            </div>
          ) : (
            <ImageUploadArea onImageDrop={handleImageDrop} />
          )}
          <FormMessage messages={formState.errors?.imageUrl} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prompt Settings</h3>
          <div>
            <Label htmlFor="language">Language</Label>
            <Select name="language" defaultValue="English">
              <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage messages={formState.errors?.language} />
          </div>
          <div>
            <Label htmlFor="promptTarget">Platform</Label>
            <Select name="promptTarget" defaultValue="Midjourney">
              <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Midjourney">Midjourney</SelectItem>
                <SelectItem value="Stable Diffusion">Stable Diffusion</SelectItem>
                <SelectItem value="DALL-E 3">DALL-E 3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage messages={formState.errors?.promptTarget} />
          </div>
          <div>
            <Label htmlFor="sceneStyle">Style</Label>
            <Select name="sceneStyle" defaultValue="photorealistic">
              <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="fantasy art">Fantasy Art</SelectItem>
                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage messages={formState.errors?.sceneStyle} />
          </div>
          <div>
            <Label htmlFor="wordCount">Approx. Word Count</Label>
            <Input id="wordCount" name="wordCount" type="number" defaultValue="50" />
            <FormMessage messages={formState.errors?.wordCount} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Generated Prompt</h3>
        <div className="relative h-full">
          <Textarea
            readOnly
            value={isLoading ? "Generating prompt..." : (formState.result?.prompt || "")}
            className="h-full min-h-[200px] resize-none"
            placeholder="Your generated prompt will appear here."
          />
          {formState.result?.prompt && (
            <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} className="absolute right-2 top-2" aria-label="Copy prompt">
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isLoading} className="w-full text-lg" size="lg">
          {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
          Generate Prompt
        </Button>
        <FormMessage messages={[formState.message].filter(m => m && !formState.errors)} />
      </div>
    </form>
  );
} 