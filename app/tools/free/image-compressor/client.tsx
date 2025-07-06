'use client';

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Image as ImageIcon, RotateCw, Download } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const ImageCompressorClient = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width: number, height: number, size: number } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [quality, setQuality] = useState(90);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(true);
  const [estimatedSize, setEstimatedSize] = useState<string>('Calculating...');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImage = useRef<HTMLImageElement | null>(null);
  const aspectRatio = useRef(1);
  const debouncedUpdateRef = useRef<number | undefined>();

  useEffect(() => {
    originalImage.current = new Image();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const updateEstimatedSize = (newWidth: number, newHeight: number, newQuality: number) => {
    if (!originalImage.current?.src || !file) return;

    if (typeof debouncedUpdateRef.current === 'number') {
        clearTimeout(debouncedUpdateRef.current);
    }
    setEstimatedSize('Calculating...');

    debouncedUpdateRef.current = window.setTimeout(() => {
        if (!originalImage.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(originalImage.current, 0, 0, newWidth, newHeight);

        let mimeType = file.type === 'image/png' ? 'image/jpeg' : file.type;

        canvas.toBlob(blob => {
            if (blob) {
                setEstimatedSize(formatBytes(blob.size));
            } else {
                setEstimatedSize("Could not calculate");
            }
        }, mimeType, newQuality / 100);

    }, 500);
  };
  
  const handleFile = (inputFile: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(inputFile.type)) {
      setErrorMessage('Please upload a JPG, PNG, or WEBP file.');
      return;
    }
    setErrorMessage('');
    setFile(inputFile);

    const reader = new FileReader();
    reader.onload = e => {
      const imageUrl = e.target?.result as string;
      setPreview(imageUrl);
      if (originalImage.current) {
        originalImage.current.onload = () => {
          if(!originalImage.current) return;
          aspectRatio.current = originalImage.current.width / originalImage.current.height;
          setOriginalSize({ width: originalImage.current.width, height: originalImage.current.height, size: inputFile.size });
          setDimensions({ width: originalImage.current.width, height: originalImage.current.height });
          setQuality(90);
          updateEstimatedSize(originalImage.current.width, originalImage.current.height, 90);
        };
        originalImage.current.src = imageUrl;
      }
    };
    reader.readAsDataURL(inputFile);
  };
  
  const handleDimensionChange = (e: ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height') => {
      const value = parseInt(e.target.value, 10);
      if (isNaN(value)) return;

      let newWidth = dimension === 'width' ? value : dimensions.width;
      let newHeight = dimension === 'height' ? value : dimensions.height;

      if (isAspectRatioLocked) {
          if (dimension === 'width') {
              newHeight = value > 0 ? Math.round(value / aspectRatio.current) : 0;
          } else {
              newWidth = value > 0 ? Math.round(value * aspectRatio.current) : 0;
          }
      }
      setDimensions({ width: newWidth, height: newHeight });
      if (newWidth > 0 && newHeight > 0) {
          updateEstimatedSize(newWidth, newHeight, quality);
      }
  };

  const compressAndDownload = () => {
      if (!file || !originalImage.current?.src) return;

      const { width, height } = dimensions;
      if (width <= 0 || height <= 0) {
          setErrorMessage('Please enter valid dimensions.');
          return;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      ctx.drawImage(originalImage.current, 0, 0, width, height);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);

      const link = document.createElement('a');
      link.href = dataUrl;
      const originalFilename = file.name.split('.').slice(0, -1).join('.');
      const extension = mimeType.split('/')[1];
      link.download = `${originalFilename}-compressed.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const resetUI = () => {
    setFile(null);
    setPreview(null);
    setOriginalSize(null);
    setDimensions({ width: 0, height: 0 });
    setQuality(90);
    setIsAspectRatioLocked(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFile(e.target.files[0]);
  };
  
  return (
    <main className="max-w-4xl mx-auto">
         <Card className="w-full">
            <CardContent className="p-6">
                {!file ? (
                     <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'}`}
                    >
                        <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/jpeg, image/png, image/webp" />
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">Drag & drop your image here</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Supports JPG, PNG, WEBP</p>
                        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    </div>
                ) : (
                     <div className="grid md:grid-cols-2 gap-8">
                        {/* Controls Column */}
                        <div className="space-y-6 flex flex-col justify-center">
                            <div className="flex items-center space-x-4">
                                {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />}
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                                    {originalSize && <p className="text-sm text-gray-500 dark:text-gray-400">{`${originalSize.width} x ${originalSize.height} (${formatBytes(originalSize.size)})`}</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="quality-slider">Quality: <span className="font-normal text-gray-700 dark:text-gray-300">{quality}%</span></label>
                                    <Slider id="quality-slider" min={1} max={100} step={1} value={[quality]} onValueChange={(value) => {
                                        const newQuality = value[0];
                                        setQuality(newQuality);
                                        if (originalImage.current) {
                                            updateEstimatedSize(dimensions.width, dimensions.height, newQuality);
                                        }
                                    }} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1">
                                        <label htmlFor="width-input">Width:</label>
                                        <Input id="width-input" type="number" value={dimensions.width} onChange={(e) => handleDimensionChange(e, 'width')} placeholder="e.g. 1920" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="height-input">Height:</label>
                                        <Input id="height-input" type="number" value={dimensions.height} onChange={(e) => handleDimensionChange(e, 'height')} placeholder="e.g. 1080" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox id="aspect-ratio-lock" checked={isAspectRatioLocked} onCheckedChange={(checked: boolean) => setIsAspectRatioLocked(checked)} />
                                    <label htmlFor="aspect-ratio-lock">Lock aspect ratio</label>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-4">
                                <p className="text-center text-gray-600 dark:text-gray-400">Estimated compressed size: <strong className="text-gray-800 dark:text-gray-200">{estimatedSize}</strong></p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button onClick={compressAndDownload} className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Compress & Download
                                    </Button>
                                    <Button onClick={resetUI} variant="outline" className="w-full sm:w-auto">
                                        <RotateCw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* Preview Column */}
                        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 min-h-[300px]">
                            {preview && <img src={preview} alt="Full preview" className="max-w-full max-h-[400px] object-contain rounded" />}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </main>
  );
};

export default ImageCompressorClient; 