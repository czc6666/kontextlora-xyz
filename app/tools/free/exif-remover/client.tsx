'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Download, RotateCw } from 'lucide-react';
import ExifReader from 'exifreader';

interface ExifData {
    [key: string]: {
        description: string;
        value: any;
    } | undefined;
}

const ExifRemoverClient = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [exifData, setExifData] = useState<ExifData | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (inputFile: File) => {
        if (!inputFile.type.startsWith('image/jpeg')) {
            setErrorMessage('Please upload a JPEG or JPG file.');
            setFile(null);
            setPreview(null);
            setExifData(null);
            return;
        }

        setErrorMessage('');
        setFile(inputFile);

        try {
            const tags = await ExifReader.load(inputFile);
            // We only want to display a subset of the data
            const relevantTags: ExifData = {
                Make: tags['Make'],
                Model: tags['Model'],
                DateTimeOriginal: tags['DateTimeOriginal'],
                GPSLatitude: tags['GPSLatitude'],
                GPSLongitude: tags['GPSLongitude'],
                Software: tags['Software'],
                ExposureTime: tags['ExposureTime'],
                FNumber: tags['FNumber'],
            };
            setExifData(relevantTags);
        } catch (error) {
            console.error(error);
            setExifData({ error: { description: 'Could not read EXIF data.', value: '' } });
        }
        
        const reader = new FileReader();
        reader.onload = e => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(inputFile);
    };

    const removeExifAndDownload = () => {
        if (!preview || !file) return;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const link = document.createElement('a');
            const originalFilename = file.name.split('.').slice(0, -1).join('.');
            link.href = dataUrl;
            link.download = `${originalFilename}-safe.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        img.src = preview;
    };

    const resetUI = () => {
        setFile(null);
        setPreview(null);
        setExifData(null);
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
                        <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/jpeg, image/jpg" />
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 font-semibold text-gray-700 dark:text-gray-300">Drag & drop your JPG/JPEG image here</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">or click to browse</p>
                        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Preview & Actions */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-xl font-bold text-center">Image Preview</h3>
                            {preview && <img src={preview} alt="Image Preview" className="w-full h-auto rounded-lg bg-gray-100 dark:bg-gray-800/50 object-contain" style={{maxHeight: '400px'}} />}
                            <div className="flex flex-col space-y-3 pt-4">
                                <Button onClick={removeExifAndDownload}><Download className="mr-2 h-4 w-4" />Download Clean Image</Button>
                                <Button onClick={resetUI} variant="outline"><RotateCw className="mr-2 h-4 w-4" />Choose New Image</Button>
                            </div>
                        </div>
                        {/* Right Column: EXIF Data */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Found EXIF Data</h3>
                            <div className="text-sm overflow-auto max-h-96 space-y-2">
                                {exifData && Object.keys(exifData).length > 0 ? (
                                    Object.entries(exifData).map(([key, tag]) => tag && (
                                        <div key={key} className="grid grid-cols-2 gap-2 p-2 rounded bg-gray-100 dark:bg-gray-900/50">
                                            <strong className="truncate text-gray-800 dark:text-gray-200">{key}:</strong>
                                            <span className="truncate text-gray-600 dark:text-gray-400">{tag.description}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No significant EXIF data found or file is not a supported JPEG.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ExifRemoverClient; 