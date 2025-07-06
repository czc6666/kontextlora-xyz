'use client';

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Download, RotateCw, RefreshCcw } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const initialFilters = {
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    brightness: 100,
    contrast: 100,
    blur: 0,
};

type FilterKeys = keyof typeof initialFilters;

const ImageFiltererClient = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(new Image());

    useEffect(() => {
        if (preview) {
            const image = imageRef.current;
            image.onload = () => applyFilters();
            image.src = preview;
        }
    }, [preview, filters]);

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
                setFilters(initialFilters);
            }
        };
        reader.readAsDataURL(inputFile);
    };

    const applyFilters = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image.src) return;
        
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const filterString = `
            grayscale(${filters.grayscale}%) 
            sepia(${filters.sepia}%) 
            saturate(${filters.saturate}%) 
            brightness(${filters.brightness}%) 
            contrast(${filters.contrast}%) 
            blur(${filters.blur}px)
        `.trim();

        ctx.filter = filterString;
        ctx.drawImage(image, 0, 0);
    };
    
    const handleSliderChange = (name: FilterKeys, value: number) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const resetAllFilters = () => {
        setFilters(initialFilters);
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas || !file) return;

        const link = document.createElement('a');
        link.href = canvas.toDataURL(file.type);
        const originalFilename = file.name.split('.').slice(0, -1).join('.') || 'image';
        const extension = file.name.split('.').pop() || 'png';
        link.download = `${originalFilename}-filtered.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetUI = () => {
        setFile(null);
        setPreview(null);
        setErrorMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
    
    const filterControls = [
        { name: 'grayscale' as FilterKeys, label: 'Grayscale', min: 0, max: 100, unit: '%' },
        { name: 'sepia' as FilterKeys, label: 'Sepia', min: 0, max: 100, unit: '%' },
        { name: 'saturate' as FilterKeys, label: 'Saturate', min: 0, max: 200, unit: '%' },
        { name: 'brightness' as FilterKeys, label: 'Brightness', min: 0, max: 200, unit: '%' },
        { name: 'contrast' as FilterKeys, label: 'Contrast', min: 0, max: 200, unit: '%' },
        { name: 'blur' as FilterKeys, label: 'Blur', min: 0, max: 10, unit: 'px', step: 0.1 },
    ];

    return (
        <Card className="w-full max-w-5xl mx-auto">
            <CardContent className="p-6">
                {!file ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'}`}
                    >
                        <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*" />
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">Drag & drop your image here</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
                        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                         <div className="md:col-span-2 flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 min-h-[300px] max-h-[500px]">
                             <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-center">Adjust Filters</h3>
                             <div className="space-y-4">
                                 {filterControls.map(fc => (
                                     <div key={fc.name}>
                                         <Label htmlFor={fc.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{fc.label}: <span className="font-normal">{filters[fc.name]}{fc.unit}</span></Label>
                                         <Slider
                                             id={fc.name}
                                             min={fc.min}
                                             max={fc.max}
                                             step={fc.step || 1}
                                             value={[filters[fc.name]]}
                                             onValueChange={(value) => handleSliderChange(fc.name, value[0])}
                                             className="w-full"
                                         />
                                     </div>
                                 ))}
                            </div>
                            <div className="border-t pt-4 flex flex-col space-y-3">
                                <Button onClick={downloadImage}><Download className="mr-2 h-4 w-4" />Download Image</Button>
                                <Button onClick={resetAllFilters} variant="secondary"><RefreshCcw className="mr-2 h-4 w-4" />Reset Filters</Button>
                                <Button onClick={resetUI} variant="outline"><RotateCw className="mr-2 h-4 w-4" />Choose New Image</Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ImageFiltererClient; 