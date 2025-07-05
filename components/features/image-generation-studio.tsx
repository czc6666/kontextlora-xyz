"use client";

import { useTransition, useState, useMemo } from "react";
import { generateImageAction } from "@/app/actions";
import { GenerationSidebar } from "./generation-sidebar";
import { GenerationResults } from "./generation-results";
import type { HistoryItem } from "./history-item-type";

export function ImageGenerationStudio() {
  const [isPending, startTransition] = useTransition();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const formAction = (formData: FormData) => {
    const inputs = Object.fromEntries(formData.entries());
    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      status: 'loading',
      message: "",
      errors: null,
      imageUrls: null,
      inputs: inputs,
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);

    startTransition(async () => {
      const result = await generateImageAction(null, formData);
      
      setHistory(prev => 
        prev.map(item => 
          item.id === newHistoryItem.id 
            ? { ...item, ...result, status: result.errors || result.message ? 'error' : 'success' } 
            : item
        )
      );
    });
  };

  const lastSuccessfulInputs = useMemo(() => {
    return history.find(item => item.status === 'success')?.inputs || null;
  }, [history]);

  const latestErrors = useMemo(() => {
    const latestResult = history[0];
    if (latestResult && latestResult.status === 'error' && latestResult.errors) {
        return latestResult.errors;
    }
    return null;
  }, [history]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-4 p-4 rounded-lg bg-muted/40 sticky top-24">
        <form action={formAction}>
          <GenerationSidebar
            lastInputs={lastSuccessfulInputs}
            isPending={isPending}
            errors={latestErrors}
          />
        </form>
      </div>

      <div className="lg:col-span-8">
        <GenerationResults history={history} />
      </div>
    </div>
  );
} 