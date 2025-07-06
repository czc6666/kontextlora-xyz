'use client';

import { useRef, useState, DragEvent, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const ImageConverterClient = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [targetFormat, setTargetFormat] = useState('image/webp');
    const [quality, setQuality] = useState(90);
    const [showQualitySlider, setShowQualitySlider] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setShowQualitySlider(targetFormat === 'image/jpeg' || targetFormat === 'image/webp');
    }, [targetFormat]);

    const handleFile = (inputFile: File) => {
        if (!inputFile.type.startsWith('image/')) {
            setErrorMessage('Please upload a valid image file.');
            return;
        }
        setErrorMessage('');
        setFile(inputFile);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setPreview(e.target.result as string);
                setShowControls(true);
            }
        };
        reader.readAsDataURL(inputFile);
    };

    const convertAndDownload = () => {
        if (!file || !preview) return;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            const qualityValue = showQualitySlider ? quality / 100 : undefined;
            const dataUrl = canvas.toDataURL(targetFormat, qualityValue);
            
            const link = document.createElement('a');
            link.href = dataUrl;
            const originalFilename = file.name.split('.').slice(0, -1).join('.');
            const extension = targetFormat.split('/')[1];
            link.download = `${originalFilename}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        img.src = preview;
    };

    const resetUI = () => {
        setFile(null);
        setPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setShowControls(false);
        setErrorMessage('');
        setTargetFormat('image/webp');
        setQuality(90);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };
    
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-card p-6 md:p-8 rounded-xl shadow-lg">
            {!showControls ? (
                <div 
                    id="drop-zone" 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-600' : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input type="file" ref={fileInputRef} id="file-input" className="hidden" accept="image/*" onChange={handleFileSelect} />
                    <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        <p className="text-gray-700 dark:text-gray-200 font-semibold">Drag & drop your image here</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">or <span className="text-blue-600 font-medium">click to browse</span></p>
                    </div>
                </div>
            ) : (
                <div id="controls" className="mt-6">
                    <div className="flex items-center justify-center space-x-4">
                        {preview && <img src={preview} className="w-20 h-20 object-cover rounded-lg border" alt="Image preview" />}
                        <div className="flex-grow">
                            {file && <p className="text-sm font-medium text-foreground truncate">{file.name}</p>}
                            {file && <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <Label htmlFor="format-select" className="mb-2 block text-sm font-medium">Convert to:</Label>
                        <Select value={targetFormat} onValueChange={setTargetFormat}>
                            <SelectTrigger id="format-select">
                                <SelectValue placeholder="Select a format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image/webp">WEBP</SelectItem>
                                <SelectItem value="image/png">PNG</SelectItem>
                                <SelectItem value="image/jpeg">JPEG</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {showQualitySlider && (
                         <div className="mt-4">
                            <Label htmlFor="quality-slider" className="mb-2 block text-sm font-medium">
                                Quality: <span className="font-semibold">{quality}%</span>
                            </Label>
                            <Slider id="quality-slider" min={1} max={100} value={[quality]} onValueChange={(value) => setQuality(value[0])} />
                            <p className="text-xs text-muted-foreground mt-1">Lower quality results in a smaller file size.</p>
                        </div>
                    )}
                    
                    <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <Button onClick={convertAndDownload} className="w-full">Convert & Download</Button>
                        <Button onClick={resetUI} variant="secondary" className="w-full sm:w-auto">Reset</Button>
                    </div>
                </div>
            )}
            {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
        </div>
    );
};

export default ImageConverterClient; 