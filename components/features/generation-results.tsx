"use client";

import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, PaintBucket, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { HistoryItem } from "./history-item-type";

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center animate-pulse">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                </div>
            ))}
        </div>
    )
}

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

function ResultItem({ item }: { item: HistoryItem }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (item.status === 'loading') {
        return <LoadingSkeleton />;
    }

    if (item.status === 'error') {
        // Don't show validation errors in the results panel, they are shown in the sidebar
        if (item.errors) return null; 

        // Show other errors (e.g. API errors)
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
    
    if (item.status === 'success' && item.imageUrls) {
        const handleClose = () => setSelectedImage(null);
        const selectedIndex = selectedImage ? item.imageUrls.indexOf(selectedImage) : -1;
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

        return (
             <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && handleClose()}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {item.imageUrls?.map((url, index) => (
                        <div key={url} onClick={() => setSelectedImage(url)} className="group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer">
                            <Image
                                src={url}
                                alt={`Generated image ${index + 1}`}
                                width={512}
                                height={512}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 hover:text-white" onClick={(e) => { e.stopPropagation(); handleDownload(url, item, index)}}>
                                <Download className="h-6 w-6" />
                              </Button>
                            </div>
                        </div>
                    ))}
                </div>
                 <DialogContent className="max-w-4xl h-[90vh] p-0 border-0 bg-transparent shadow-none">
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
        )
    }

    return null;
}

export function GenerationResults({ history }: { history: HistoryItem[] }) {
  if (history.length === 0) {
    return (
        <div className="h-full min-h-[512px] w-full bg-muted rounded-lg flex flex-col items-center justify-center text-center p-8">
            <div className="mb-4 text-muted-foreground">
                <PaintBucket className="h-16 w-16 mx-auto" strokeWidth={1} />
            </div>
            <h3 className="text-xl font-semibold mb-2">欢迎来到创作中心</h3>
            <p className="text-muted-foreground">在左侧输入你的想法，点击生成，让魔法发生。</p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
        {history.map(item => {
          if (item.status === 'loading') {
            return <ResultItem key={item.id} item={item} />
          }
          // Don't show validation errors in the results panel, they are handled in the sidebar
          if (item.errors) return null;
          return <ResultItem key={item.id} item={item} />
        })}
    </div>
  );
} 