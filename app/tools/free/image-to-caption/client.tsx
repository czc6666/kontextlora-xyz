"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Upload } from "lucide-react";

export function ImageToCaptionClient() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleGenerateCaption = async () => {
    // This is a placeholder. In a real scenario, you would make an API call.
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setCaption("A placeholder caption for the uploaded image.");
    setIsLoading(false);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
  };

  return (
    <section className="mt-12">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Upload your image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              {image ? (
                <img src={image} alt="Uploaded preview" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-10 w-10" />
                  <p className="mt-2">Click or drag file to this area to upload</p>
                </div>
              )}
            </Label>
            <Input id="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
          </div>
          
          <Button onClick={handleGenerateCaption} disabled={!image || isLoading} className="w-full">
            {isLoading ? "Generating..." : "Generate Caption"}
          </Button>

          {caption && (
            <div className="space-y-2">
              <Label htmlFor="caption-output">Generated Caption</Label>
              <div className="relative">
                <p id="caption-output" className="p-4 border rounded-md bg-muted text-muted-foreground">
                  {caption}
                </p>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
} 