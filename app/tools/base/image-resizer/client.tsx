'use client';

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Download, RotateCw } from 'lucide-react';

const ImageResizerClient = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<{ width: number, height: number, size: number } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImage = useRef<HTMLImageElement | null>(null);
  const aspectRatio = useRef(1);

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
        };
        originalImage.current.src = imageUrl;
      }
    };
    reader.readAsDataURL(inputFile);
  };
  
  const handleDimensionChange = (e: ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height') => {
      const value = parseInt(e.target.value, 10);
      if (isNaN(value)) {
        if(dimension === 'width') {
            setDimensions({...dimensions, width: 0});
        } else {
            setDimensions({...dimensions, height: 0});
        }
        return;
      };

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
  };

  const resizeAndDownload = () => {
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

      const dataUrl = canvas.toDataURL(file.type);

      const link = document.createElement('a');
      link.href = dataUrl;
      const originalFilename = file.name.split('.').slice(0, -1).join('.');
      const extension = file.type.split('/')[1];
      link.download = `${originalFilename}-resized.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const resetUI = () => {
    setFile(null);
    setPreview(null);
    setOriginalSize(null);
    setDimensions({ width: 0, height: 0 });
    setIsAspectRatioLocked(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrorMessage('');
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
    <Card className="w-full max-w-4xl mx-auto">
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
                    {/* Preview Column */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        {preview && <img src={preview} alt="Preview" className="max-w-full max-h-96 object-contain rounded-md" />}
                    </div>

                    {/* Controls Column */}
                    <div className="space-y-6">
                        <div className="border-b pb-4">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                            {originalSize && <p className="text-sm text-gray-500 dark:text-gray-400">{`Original: ${originalSize.width} x ${originalSize.height} (${formatBytes(originalSize.size)})`}</p>}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1">
                                    <Label htmlFor="width-input">Width:</Label>
                                    <Input id="width-input" type="number" value={dimensions.width} onChange={(e) => handleDimensionChange(e, 'width')} placeholder="e.g. 1920" />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="height-input">Height:</Label>
                                    <Input id="height-input" type="number" value={dimensions.height} onChange={(e) => handleDimensionChange(e, 'height')} placeholder="e.g. 1080" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id="aspect-ratio-lock" checked={isAspectRatioLocked} onCheckedChange={(checked) => setIsAspectRatioLocked(checked as boolean)} />
                                <Label htmlFor="aspect-ratio-lock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lock aspect ratio</Label>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={resizeAndDownload} className="w-full">
                                    <Download className="mr-2 h-4 w-4" />
                                    Resize & Download
                                </Button>
                                <Button onClick={resetUI} variant="outline" className="w-full sm:w-auto">
                                    <RotateCw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}
        </CardContent>
    </Card>
  );
};

export default ImageResizerClient; 