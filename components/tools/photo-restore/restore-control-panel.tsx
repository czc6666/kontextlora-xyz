"use client";

import { useFormState } from "react-dom";
import { restoreImageAction } from "@/app/photo-restore/actions";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import { FormSubmitButton } from "@/components/form-submit-button";

const initialState = {
  message: "",
  errors: null,
  imageUrl: null,
};

type RestoreControlPanelProps = {
  setResultImageUrl: (url: string | null) => void;
  setErrorMessage: (message: string | null) => void;
};

export default function RestoreControlPanel({ setResultImageUrl, setErrorMessage }: RestoreControlPanelProps) {
  const [formState, formAction] = useFormState(restoreImageAction, initialState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formState.message === "Success" && formState.imageUrl) {
      setResultImageUrl(formState.imageUrl);
      setErrorMessage(null);
    } else if (formState.message.startsWith("Action Error") || formState.message.startsWith("API Error") || formState.message.startsWith("Validation Error")) {
      setErrorMessage(formState.message);
      setResultImageUrl(null);
    }
  }, [formState, setResultImageUrl, setErrorMessage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form action={formAction}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Origin Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Images (Needed)</Label>
            <input
              type="file"
              id="image-upload"
              name="image"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
            />
            <div 
              className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handleDivClick}
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Selected preview" width={200} height={200} className="object-contain rounded-md" />
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag 'n' drop your image here, or click to select one
                  </p>
                </>
              )}
            </div>
            {formState.errors?.image && <p className="text-sm text-destructive mt-1">{formState.errors.image[0]}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="watermark" className="flex flex-col space-y-1">
              <span>Watermark</span>
              <span className="font-normal text-xs text-muted-foreground">
                Free users cannot disable watermark.
              </span>
            </Label>
            <Switch id="watermark" defaultChecked disabled />
          </div>

          <FormSubmitButton className="w-full" size="lg">
            Run
          </FormSubmitButton>
        </CardContent>
      </Card>
    </form>
  );
} 