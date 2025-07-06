"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { generateSchema } from "@/lib/schemas";
import { ControlPanel } from "@/components/tools/image-generator/control-panel";
import ResultPanel from "@/components/tools/image-generator/result-panel";
import type { HistoryItem } from "@/components/tools/image-generator/history-item-type";

interface ImageGeneratorClientProps {
  user: User | null;
  generateImageAction: (prevState: any, formData: FormData) => Promise<{
      errors: Record<string, string[] | undefined> | null;
      imageUrl: string | null;
      message?: string;
  }>;
  initialIsPro: boolean;
  initialCredits: number;
}

export function ImageGeneratorClient({ 
  user, 
  generateImageAction,
  initialIsPro,
  initialCredits,
}: ImageGeneratorClientProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [highlightedHistoryId, setHighlightedHistoryId] = useState<number | null>(null);

  const onSubmit = async (values: z.infer<typeof generateSchema>) => {
    setIsPending(true);

    const newHistoryId = Date.now();
    const newHistoryItem: HistoryItem = {
      id: newHistoryId,
      status: 'loading',
      message: "",
      errors: null,
      imageUrls: [],
      inputs: values,
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      const result = await generateImageAction(null, formData);
      
      if (result.errors || !result.imageUrl) {
        setHistory(prev => prev.map(item => 
          item.id === newHistoryId 
          ? { ...item, status: 'error', errors: result.errors, message: result.message || "Generation failed" } 
          : item
        ));
        return;
      }
      
      setHistory(prev => prev.map(item => 
        item.id === newHistoryId 
        ? { ...item, status: 'success', imageUrls: [result.imageUrl as string] } 
        : item
      ));

    } catch (error) {
      console.error("Image generation process failed:", error);
       setHistory(prev => prev.map(item => 
        item.id === newHistoryId 
        ? { ...item, status: 'error', message: "An unexpected error occurred." } 
        : item
      ));
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setHighlightedHistoryId(item.id);
    setTimeout(() => setHighlightedHistoryId(null), 1000);
  };

  const activeGeneration = history.find(h => h.status === 'loading' || h.status === 'success');

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ControlPanel
            user={user}
            isPending={isPending}
            onSubmit={onSubmit}
            isPro={initialIsPro}
            credits={initialCredits}
          />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <ResultPanel
            history={history}
            highlightedHistoryId={highlightedHistoryId}
          />
        </div>
      </div>
    </div>
  );
} 