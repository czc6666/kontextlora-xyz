"use client";

import { UploadCloud } from "lucide-react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { cn } from "@/lib/utils";

interface ImageUploadAreaProps {
  onImageDrop: (file: File) => void;
  className?: string;
  dropzoneOptions?: DropzoneOptions;
}

export function ImageUploadArea({ onImageDrop, className, dropzoneOptions }: ImageUploadAreaProps) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onImageDrop(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
    },
    maxFiles: 1,
    ...dropzoneOptions,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex h-80 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card transition-colors",
        isDragActive && "border-primary/60 bg-primary/10",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 text-center text-muted-foreground">
        <UploadCloud className="h-16 w-16" />
        <div className="text-lg font-semibold">
          Drag 'n' drop your image here, or click to select one
        </div>
        <p className="text-sm">
          An image of a person that needs to be restored
        </p>
      </div>
    </div>
  );
} 