"use client";

import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, PaintBucket, Download, ChevronLeft, ChevronRight, ImageIcon, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { HistoryItem } from "./history-item-type";

const handleDownload = (url: string, item: HistoryItem, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    const promptStart = (typeof item.inputs?.prompt === 'string' ? item.inputs.prompt : 'generated')
      .substring(0, 20)
      .replace(/\s/g, '_');
    link.download = `kontext_lora_${promptStart}_${item.id}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function ResultItem({ item, isHighlighted, onRender }: { item: HistoryItem, isHighlighted: boolean, onRender: (el: HTMLDivElement) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const numImages = Number(item.inputs?.numImages) || 1;

    useEffect(() => {
        if (ref.current) {
            onRender(ref.current);
        }
    }, [onRender]);

    useEffect(() => {
        if (isHighlighted && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isHighlighted]);

    if (item.status === 'error' && item.imageUrls.length === 0) {
        if (item.errors) return null; 
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>生成出错了</AlertTitle>
                <AlertDescription>
                    {item.message?.replace("Action Error: ", "") || "An unknown error occurred."}
                </AlertDescription>
            </Alert>
        );
    }
    
    if (item.status === 'loading' && item.imageUrls.length === 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: numImages }).map((_, index) => (
                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center animate-pulse">
                        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                    </div>
                ))}
            </div>
        );
    }

    const handleClose = () => setSelectedImage(null);
    const selectedIndex = selectedImage && item.imageUrls ? item.imageUrls.indexOf(selectedImage) : -1;
    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.imageUrls && selectedIndex > -1 && selectedIndex < item.imageUrls.length - 1) {
            setSelectedImage(item.imageUrls[selectedIndex + 1]);
        }
    };
    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex > 0) {
            setSelectedImage(item.imageUrls?.[selectedIndex - 1] ?? null);
        }
    };

    const imageElements = item.imageUrls.map((url, index) => (
        <div key={url} className="group relative aspect-square bg-muted rounded-lg overflow-hidden">
             <Image
                src={url}
                alt={`Generated image ${index + 1}`}
                width={512}
                height={512}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(url)}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 hover:text-white" onClick={(e) => { e.stopPropagation(); handleDownload(url, item, index)}}>
                    <Download className="h-6 w-6" />
                </Button>
            </div>
        </div>
    ));

    const loadingPlaceholders = item.status === 'loading' 
        ? Array.from({ length: Math.max(0, numImages - item.imageUrls.length) }).map((_, index) => (
            <div key={`placeholder-${index}`} className="aspect-square bg-muted rounded-lg flex items-center justify-center animate-pulse">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
          ))
        : [];

    return (
        <div ref={ref} className={`transition-all duration-500 ${isHighlighted ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''}`}>
             <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && handleClose()}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {imageElements}
                    {loadingPlaceholders}
                </div>

                {item.imageUrls.length > 0 && item.status !== 'loading' && (
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(item.imageUrls[0], item, 0)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Enhance
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Heart className="mr-2 h-4 w-4" />
                            Add to favorites
                        </Button>
                    </div>
                )}

                <DialogContent className="max-w-4xl h-[90vh] p-0 border-0 bg-transparent shadow-none">
                    <DialogTitle className="sr-only">Enlarged Image</DialogTitle>
                    <DialogDescription className="sr-only">An enlarged view of the generated image.</DialogDescription>
                    {selectedImage && (
                        <div className="relative w-full h-full">
                            <Image src={selectedImage} alt="Enlarged view" layout="fill" objectFit="contain" />
                            
                            {selectedIndex > 0 && (
                                <Button
                                    variant="ghost" size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full text-white bg-black/30 hover:bg-black/50"
                                    onClick={handlePrev}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                            )}
                            
                            {selectedIndex < (item.imageUrls?.length ?? 0) - 1 && (
                                <Button
                                    variant="ghost" size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-white bg-black/30 hover:bg-black/50"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function GenerationResults({ history, highlightedHistoryId }: { history: HistoryItem[], highlightedHistoryId: number | null }) {
    const elementRefs = useRef(new Map<number, HTMLDivElement>());

    const handleRender = (id: number, el: HTMLDivElement) => {
        if (el) {
            elementRefs.current.set(id, el);
        } else {
            elementRefs.current.delete(id);
        }
    };

  return (
    <div className="w-full bg-muted/40 rounded-lg p-4 min-h-[512px]">
        {history.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center min-h-[450px]">
                <div className="mb-4 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto" strokeWidth={1} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your generations will appear here</h3>
                <p className="text-muted-foreground">Get started by entering a prompt and clicking Generate.</p>
            </div>
        ) : (
            <div className="space-y-8">
                {history.map(item => {
                  return <ResultItem 
                            key={item.id} 
                            item={item} 
                            isHighlighted={item.id === highlightedHistoryId}
                            onRender={(el) => handleRender(item.id, el)}
                         />
                })}
            </div>
        )}
    </div>
  );
} 