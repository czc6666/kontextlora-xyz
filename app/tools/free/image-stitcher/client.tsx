"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUploadArea } from '@/components/shared/image-upload-area';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Sortable from 'sortablejs';
import { XCircle } from 'lucide-react';

interface ImageFile {
    file: File;
    src: string;
    width: number;
    height: number;
}

export default function ImageStitcherClient() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
    const [error, setError] = useState<string | null>(null);
    const [stitchedImage, setStitchedImage] = useState<string | null>(null);
    const imageListRef = useRef<HTMLDivElement>(null);
    const sortableInstance = useRef<Sortable | null>(null);

    const handleFiles = (files: FileList) => {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (validFiles.length === 0) {
            setError('Please upload at least one valid image file.');
            return;
        }
        setError(null);

        const newImagePromises = validFiles.map(file => {
            return new Promise<ImageFile>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                    const img = new Image();
                    img.onload = () => {
                        resolve({ file, src: e.target?.result as string, width: img.width, height: img.height });
                    };
                    img.onerror = reject;
                    img.src = e.target?.result as string;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImagePromises).then(newImages => {
            setImages(prev => [...prev, ...newImages]);
        });
    };
    
    useEffect(() => {
        if (imageListRef.current && !sortableInstance.current) {
            sortableInstance.current = new Sortable(imageListRef.current, {
                animation: 150,
                ghostClass: 'opacity-50',
                onEnd: (evt) => {
                    if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                        setImages(prev => {
                            const newArr = [...prev];
                            const [movedItem] = newArr.splice(evt.oldIndex!, 1);
                            newArr.splice(evt.newIndex!, 0, movedItem);
                            return newArr;
                        });
                    }
                }
            });
        }
    }, [images.length]);

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleStitch = async () => {
        if (images.length < 2) {
            setError('You need at least two images to stitch.');
            return;
        }
        setError(null);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setError('Could not get canvas context.');
            return;
        }

        let totalWidth = 0;
        let totalHeight = 0;

        if (direction === 'horizontal') {
            images.forEach(img => {
                totalWidth += img.width;
                totalHeight = Math.max(totalHeight, img.height);
            });
        } else {
            images.forEach(img => {
                totalWidth = Math.max(totalWidth, img.width);
                totalHeight += img.height;
            });
        }

        canvas.width = totalWidth;
        canvas.height = totalHeight;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        let currentX = 0;
        let currentY = 0;

        for (const imgData of images) {
            const img = new Image();
            img.src = imgData.src;
            await new Promise(resolve => img.onload = resolve);
            
            if (direction === 'horizontal') {
                const y = (totalHeight - imgData.height) / 2;
                ctx.drawImage(img, currentX, y, imgData.width, imgData.height);
                currentX += imgData.width;
            } else {
                const x = (totalWidth - imgData.width) / 2;
                ctx.drawImage(img, x, currentY, imgData.width, imgData.height);
                currentY += imgData.height;
            }
        }
        
        setStitchedImage(canvas.toDataURL('image/png'));
    };
    
    const handleDownload = () => {
        if (!stitchedImage) return;
        const link = document.createElement('a');
        link.href = stitchedImage;
        link.download = 'stitched-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setImages([]);
        setStitchedImage(null);
        setError(null);
        if (sortableInstance.current) {
            sortableInstance.current.destroy();
            sortableInstance.current = null;
        }
    };
    
    return (
        <div className="flex flex-col items-center gap-6">
            {images.length === 0 ? (
                <ImageUploadArea onFileSelect={(file) => handleFiles(file as any)} multiple />
            ) : (
                <div className="w-full">
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Your Images</h2>
                            <label className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                + Add More Images
                                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                            </label>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Drag to reorder images. The order here will be the same in the final image.</p>
                        <div ref={imageListRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                            {images.map((image, index) => (
                                <div key={image.src} className="relative cursor-grab active:cursor-grabbing">
                                    <img src={image.src} alt={`upload-${index}`} className="w-full h-32 object-cover rounded-md border" />
                                    <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                         <div className="mb-6">
                            <p className="text-lg font-medium text-gray-800 mb-3">Stitch Direction</p>
                            <RadioGroup defaultValue="horizontal" onValueChange={(v) => setDirection(v as any)} className="flex space-x-4">
                               <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="horizontal" id="r1" />
                                    <Label htmlFor="r1">Horizontal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="vertical" id="r2" />
                                    <Label htmlFor="r2">Vertical</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <Button onClick={handleStitch} disabled={images.length < 2}>Stitch Images</Button>
                            <Button onClick={handleReset} variant="outline">Start Over</Button>
                        </div>
                    </div>
                    {stitchedImage && (
                         <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stitched Result</h2>
                            <div className="bg-gray-100 rounded-lg overflow-hidden p-4">
                                <img src={stitchedImage} alt="Stitched result" className="max-w-full mx-auto" />
                            </div>
                            <Button onClick={handleDownload} className="w-full mt-4">Download Stitched Image</Button>
                        </div>
                    )}
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
} 