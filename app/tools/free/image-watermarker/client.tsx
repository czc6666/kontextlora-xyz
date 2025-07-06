"use client";

import { Button } from "@/components/ui/button";
import { ImageUploadArea } from "@/components/shared/image-upload-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export function WatermarkerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [text, setText] = useState("© Your Brand");
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.7);
  const [size, setSize] = useState(50);
  const [font, setFont] = useState("Arial");
  
  const [watermarkPos, setWatermarkPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleFileChange = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setFile(selectedFile);
        // Center watermark initially
        const canvas = canvasRef.current;
        if(canvas) {
            const ctx = canvas.getContext("2d")!;
            ctx.font = `${size}px ${font}`;
            const textMetrics = ctx.measureText(text);
            setWatermarkPos({
                x: (img.width - textMetrics.width) / 2,
                y: (img.height + size) / 2
            });
        }
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.font = `${size}px ${font}`;
    
    ctx.fillText(text, watermarkPos.x, watermarkPos.y);
    ctx.globalAlpha = 1.0;
  }, [image, text, color, size, opacity, font, watermarkPos]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d')!;
    ctx.font = `${size}px ${font}`;
    const metrics = ctx.measureText(text);
    
    if (x >= watermarkPos.x && x <= watermarkPos.x + metrics.width && y >= watermarkPos.y - size && y <= watermarkPos.y) {
        setIsDragging(true);
        setDragStart({ x: x - watermarkPos.x, y: y - watermarkPos.y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setWatermarkPos({
      x: (e.clientX - rect.left) - dragStart.x,
      y: (e.clientY - rect.top) - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(file.type);
    const originalFilename = file.name.split('.').slice(0, -1).join('.');
    const extension = file.name.split('.').pop();
    link.download = `${originalFilename}-watermarked.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setImage(null);
  };

  const fonts = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana", "Georgia", "Comic Sans MS", "Impact"];

  return (
    <Card>
      <CardContent className="p-6">
        {!image ? (
          <ImageUploadArea onFileChange={handleFileChange} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="md:col-span-2 bg-muted rounded-lg flex items-center justify-center p-4"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="text-input">Watermark Text</Label>
                <Input id="text-input" value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <Label htmlFor="color-input">Color</Label>
                  <Input id="color-input" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1 h-10 w-14"/>
                </div>
                <div className="w-full">
                  <Label htmlFor="opacity-slider">Opacity</Label>
                  <Slider id="opacity-slider" min={0} max={1} step={0.1} value={[opacity]} onValueChange={([val]) => setOpacity(val)} />
                </div>
              </div>
              <div>
                <Label htmlFor="size-slider">Size</Label>
                <Slider id="size-slider" min={10} max={200} step={2} value={[size]} onValueChange={([val]) => setSize(val)} />
              </div>
              <div>
                <Label htmlFor="font-select">Font</Label>
                <Select value={font} onValueChange={setFont}>
                    <SelectTrigger id="font-select">
                        <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                        {fonts.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="border-t pt-4 flex flex-col space-y-3">
                <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download Image</Button>
                <Button variant="ghost" onClick={handleReset}>Reset</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 