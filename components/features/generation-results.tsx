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
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center animate-pulse">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
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
        return (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center animate-pulse">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
        )
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
    
    if (item.status === 'success' && item.imageUrls && item.imageUrls.length > 0) {
        const imageUrl = item.imageUrls[0]; // We now expect only one image
        const handleClose = () => setSelectedImage(null);

        return (
             <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && handleClose()}>
                <div onClick={() => setSelectedImage(imageUrl)} className="group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer">
                    <Image
                        src={imageUrl}
                        alt={`Generated image 1`}
                        width={1024}
                        height={1024}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 hover:text-white" onClick={(e) => { e.stopPropagation(); handleDownload(imageUrl, item, 0)}}>
                        <Download className="h-6 w-6" />
                      </Button>
                    </div>
                </div>
                 <DialogContent className="max-w-4xl h-[90vh] p-0 border-0 bg-transparent shadow-none">
                    {selectedImage && (
                        <div className="relative w-full h-full">
                            <Image src={selectedImage} alt="Enlarged view" layout="fill" objectFit="contain" />
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
          // Change: Be more specific about hiding validation errors.
          // Only hide if it's an error AND there are specific field errors.
          // This prevents successful results from being hidden if `errors` is an empty object.
          if (item.status === 'error' && item.errors && Object.keys(item.errors).length > 0) {
            return null;
          }
          return <ResultItem key={item.id} item={item} />
        })}
    </div>
  );
} 