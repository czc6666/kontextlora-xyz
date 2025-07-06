"use client";

import { Button } from "@/components/ui/button";
import { ImageUploadArea } from "@/components/shared/image-upload-area";
import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw, Download, Rotate2 } from "lucide-react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TransformerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setFile(file);
        resetTransformations();
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const drawImage = useCallback(() => {
    if (!originalImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rad = (currentRotation * Math.PI) / 180;
    const isOrthogonal = Math.abs(Math.sin(rad)) === 1;

    const w = originalImage.width;
    const h = originalImage.height;

    const canvasWidth = isOrthogonal ? h : w;
    const canvasHeight = isOrthogonal ? w : h;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    setDimensions({ width: canvasWidth, height: canvasHeight });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate(rad);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(originalImage, -w / 2, -h / 2, w, h);
    ctx.restore();
  }, [originalImage, currentRotation, scaleX, scaleY]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const handleRotateLeft = () => setCurrentRotation((prev) => (prev - 90) % 360);
  const handleRotateRight = () => setCurrentRotation((prev) => (prev + 90) % 360);
  const handleFlipHorizontal = () => setScaleX((prev) => prev * -1);
  const handleFlipVertical = () => setScaleY((prev) => prev * -1);

  const resetTransformations = () => {
    setCurrentRotation(0);
    setScaleX(1);
    setScaleY(1);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL(file.type);
    const originalFilename = file.name.split('.').slice(0, -1).join('.');
    const extension = file.name.split('.').pop();
    link.download = `${originalFilename}-transformed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
    setFile(null);
    setOriginalImage(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {!originalImage ? (
          <ImageUploadArea onFileChange={handleFileChange} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex items-center justify-center bg-muted rounded-lg p-4 min-h-[300px]">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain"
                style={{ transition: 'transform 0.3s ease-in-out' }}
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Transformations</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleRotateLeft}><RotateCcw className="mr-2 h-4 w-4" /> Rotate Left</Button>
                  <Button variant="outline" onClick={handleRotateRight}><RotateCw className="mr-2 h-4 w-4" /> Rotate Right</Button>
                  <Button variant="outline" onClick={handleFlipHorizontal}><FlipHorizontal className="mr-2 h-4 w-4" /> Flip Horizontal</Button>
                  <Button variant="outline" onClick={handleFlipVertical}><FlipVertical className="mr-2 h-4 w-4" /> Flip Vertical</Button>
                </div>
              </div>
              <div className="border-t pt-4">
                {file && <p className="text-sm font-medium text-foreground truncate">{file.name}</p>}
                {dimensions.width > 0 && <p className="text-sm text-muted-foreground">{dimensions.width} x {dimensions.height}</p>}
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