'use client';

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, RotateCw } from 'lucide-react';

export function ImageResizerClient() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const aspectRatio = useRef<number>(1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImage(file);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        aspectRatio.current = img.width / img.height;
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (lockAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio.current));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (lockAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio.current));
    }
  };
  
  const handleResize = () => {
    if (!originalImage) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        setResizedImage(canvas.toDataURL(originalImage.type));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(originalImage);
  };
  
  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = `resized-${originalImage?.name}`;
    link.click();
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload" className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            {originalImage ? (
              <img src={URL.createObjectURL(originalImage)} alt="Uploaded preview" className="h-full w-full object-contain" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="mx-auto h-10 w-10" />
                <p className="mt-2">Click or drag file to this area to upload</p>
              </div>
            )}
          </Label>
          <Input id="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
        </div>
        
        {originalImage && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input id="width" type="number" value={width} onChange={handleWidthChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input id="height" type="number" value={height} onChange={handleHeightChange} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="aspect-ratio" checked={lockAspectRatio} onCheckedChange={(checked) => setLockAspectRatio(Boolean(checked))} />
              <Label htmlFor="aspect-ratio">Lock aspect ratio</Label>
            </div>
            <Button onClick={handleResize} className="w-full">Resize Image</Button>
          </>
        )}
        
        {resizedImage && (
          <div className="space-y-4">
             <div className="space-y-2">
                <Label>Resized Image</Label>
                <img src={resizedImage} alt="Resized image" className="border rounded-lg max-w-full h-auto" />
             </div>
             <Button onClick={handleDownload} className="w-full">Download Resized Image</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImageResizerClient; 