"use client";

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ResultPanelProps {
  images: string[];
  error: string | null;
  isPending: boolean;
}

const ResultPanel = ({ images, error, isPending }: ResultPanelProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-6 min-h-[500px] border border-dashed flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4 text-center">Image Generator Result</h2>
      
      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-full h-64" />
        </div>
      )}

      {error && !isPending && (
        <Alert variant="destructive" className="w-full">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {!isPending && !error && images.length === 0 && (
        <div className="text-center text-muted-foreground">
            <Info className="mx-auto h-12 w-12" />
            <p className="mt-4">Your generated images will appear here.</p>
        </div>
      )}

      {images.length > 0 && !isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {images.map((src, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <img
                src={src}
                alt={`Generated image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPanel; 