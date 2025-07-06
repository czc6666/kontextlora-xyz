"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploadArea } from '@/components/shared/image-upload-area';

export default function IcoGeneratorClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }
        setError(null);
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const loadImage = (file: File): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    const createCanvasForSize = (image: HTMLImageElement, size: number): HTMLCanvasElement => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        const scale = Math.min(size / image.width, size / image.height);
        const x = (size - image.width * scale) / 2;
        const y = (size - image.height * scale) / 2;

        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
        return canvas;
    };

    const createIcoBlob = async (canvases: HTMLCanvasElement[]): Promise<Blob> => {
        const header = new ArrayBuffer(6);
        const headerView = new DataView(header);
        headerView.setUint16(0, 0, true); // Reserved
        headerView.setUint16(2, 1, true); // ICO type
        headerView.setUint16(4, canvases.length, true); // Number of images

        let imageOffset = header.byteLength + (canvases.length * 16);
        const imageBlobs: ArrayBuffer[] = [];
        const dirEntries: ArrayBuffer[] = [];

        for (const canvas of canvases) {
            const width = canvas.width;
            const height = canvas.height;
            const ctx = canvas.getContext('2d')!;
            const imageData = ctx.getImageData(0, 0, width, height);
            const pixelData = imageData.data;
            const bmpPixelData = new Uint8Array(pixelData.length);

            // BGRA and bottom-up
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const C_OFFSET = (y * width + x) * 4;
                    const I_OFFSET = ((height - 1 - y) * width + x) * 4;
                    bmpPixelData[I_OFFSET] = pixelData[C_OFFSET + 2];     // B
                    bmpPixelData[I_OFFSET + 1] = pixelData[C_OFFSET + 1]; // G
                    bmpPixelData[I_OFFSET + 2] = pixelData[C_OFFSET];     // R
                    bmpPixelData[I_OFFSET + 3] = pixelData[C_OFFSET + 3]; // A
                }
            }

            const dibHeader = new ArrayBuffer(40);
            const dibView = new DataView(dibHeader);
            dibView.setUint32(0, 40, true);
            dibView.setInt32(4, width, true);
            dibView.setInt32(8, height * 2, true);
            dibView.setUint16(12, 1, true);
            dibView.setUint16(14, 32, true);
            dibView.setUint32(16, 0, true);
            dibView.setUint32(20, bmpPixelData.length, true);
            dibView.setInt32(24, 0, true);
            dibView.setInt32(28, 0, true);
            dibView.setUint32(32, 0, true);
            dibView.setUint32(36, 0, true);
            
            const imageSize = dibHeader.byteLength + bmpPixelData.length;

            const dirEntry = new ArrayBuffer(16);
            const dirView = new DataView(dirEntry);
            dirView.setUint8(0, width === 256 ? 0 : width);
            dirView.setUint8(1, height === 256 ? 0 : height);
            dirView.setUint8(2, 0);
            dirView.setUint8(3, 0);
            dirView.setUint16(4, 1, true);
            dirView.setUint16(6, 32, true);
            dirView.setUint32(8, imageSize, true);
            dirView.setUint32(12, imageOffset, true);
            
            dirEntries.push(dirEntry);
            imageBlobs.push(dibHeader, bmpPixelData.buffer);
            imageOffset += imageSize;
        }

        return new Blob([header, ...dirEntries, ...imageBlobs], { type: 'image/x-icon' });
    };

    const handleGenerate = async () => {
        if (!selectedFile) {
            setError('Please select an image first.');
            return;
        }

        try {
            const image = await loadImage(selectedFile);
            const sizes = [16, 32, 48, 256];
            const canvases = sizes.map(size => createCanvasForSize(image, size));
            const icoBlob = await createIcoBlob(canvases);
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(icoBlob);
            const filename = selectedFile.name.split('.').slice(0, -1).join('.') || 'icon';
            link.download = `${filename}.ico`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (err) {
            console.error('Error generating ICO:', err);
            setError('Could not generate ICO. Please try a different image.');
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {!selectedFile ? (
                <ImageUploadArea onFileSelect={handleFileSelect} />
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    {previewUrl && (
                        <div className="flex flex-col items-center gap-2">
                            <img src={previewUrl} alt="Preview" className="w-40 h-40 object-contain rounded-lg border p-2" />
                            <p className="text-sm text-gray-500">{selectedFile.name}</p>
                        </div>
                    )}
                    <div className="flex w-full max-w-sm items-center space-x-2">
                       <Button onClick={handleGenerate} className="w-full">Generate & Download ICO</Button>
                       <Button onClick={handleReset} variant="outline">Reset</Button>
                    </div>
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
} 