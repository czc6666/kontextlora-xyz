'use client';

import { useRef, useState, DragEvent, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ImageMirrorerClient = () => {
    const [showControls, setShowControls] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const originalImage = useRef<HTMLImageElement | null>(null);
    const fileRef = useRef<File | null>(null);

    const scale = useRef({ x: 1, y: 1 });
    
    useEffect(() => {
        // Initialize the Image object only on the client side
        originalImage.current = new Image();
    }, []);

    const resetTransformations = () => {
        scale.current = { x: 1, y: 1 };
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please upload an image file.');
            return;
        }
        setErrorMessage('');
        fileRef.current = file;

        const reader = new FileReader();
        reader.onload = e => {
            if (e.target?.result && originalImage.current) {
                originalImage.current.onload = () => {
                    resetTransformations();
                    setShowControls(true);
                    drawImage();
                };
                originalImage.current.src = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    };

    const drawImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = originalImage.current;
        if (!canvas || !ctx || !img?.src) return;

        const w = img.width;
        const h = img.height;
        
        canvas.width = w;
        canvas.height = h;
        
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(scale.current.x, scale.current.y);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();
    };
    
    const handleFlipHorizontal = () => {
        scale.current.x *= -1;
        drawImage();
    };

    const handleFlipVertical = () => {
        scale.current.y *= -1;
        drawImage();
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        const file = fileRef.current;
        if (!canvas || !file) return;

        const link = document.createElement('a');
        link.href = canvas.toDataURL(file.type);
        const originalFilename = file.name.split('.').slice(0, -1).join('.');
        const extension = file.name.split('.').pop();
        link.download = `${originalFilename}-mirrored.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetUI = () => {
        fileRef.current = null;
        // Don't create a new Image, just clear its src
        if (originalImage.current) {
            originalImage.current.src = '';
        }
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setShowControls(false);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if(canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setErrorMessage('');
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

    return (
        <div className="w-full max-w-4xl mx-auto bg-card p-6 md:p-8 rounded-xl shadow-lg">
             {!showControls && (
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
                        <p className="text-foreground font-semibold">Drag & drop your image here</p>
                        <p className="text-muted-foreground text-sm mt-1">or <span className="text-blue-600 font-medium">click to browse</span></p>
                    </div>
                </div>
            )}
            {errorMessage && <div className="text-red-600 text-center mt-4">{errorMessage}</div>}

            {showControls && (
                <div id="controls" className="mt-6">
                    <div className="flex flex-col items-center">
                        <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 mb-6 min-h-[300px]">
                             <canvas ref={canvasRef} id="preview-canvas" className="max-w-full max-h-full object-contain"></canvas>
                        </div>

                        <div className="flex items-center space-x-4 mb-6">
                            <Button onClick={handleFlipHorizontal} variant="outline" size="lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-4 10V5m-4 4l-4 4 4 4m8-8l4 4-4 4" /></svg>
                                Mirror Horizontally
                            </Button>
                             <Button onClick={handleFlipVertical} variant="outline" size="lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8v8M7 8v8m-4-4h18" /></svg>
                                Mirror Vertically
                             </Button>
                        </div>
                         <div className="w-full max-w-sm flex flex-col space-y-3">
                            <Button onClick={downloadImage} size="lg">Download Image</Button>
                            <Button onClick={resetUI} variant="secondary" size="lg">Choose New Image</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageMirrorerClient;
