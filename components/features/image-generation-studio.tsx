"use client";

import { useState, useMemo } from "react";
import { generateImageAction } from "@/app/actions";
import { GenerationSidebar } from "./generation-sidebar";
import { GenerationResults } from "./generation-results";
import type { HistoryItem } from "./history-item-type";

export function ImageGenerationStudio() {
  const [isPending, setIsPending] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const inputs = Object.fromEntries(formData.entries());
    
    const newHistoryId = Date.now();
    const newHistoryItem: HistoryItem = {
      id: newHistoryId,
      status: 'loading',
      message: "",
      errors: null,
      imageUrls: [],
      inputs: inputs,
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    try {
      const generatedUrls: string[] = [];
      for (let i = 0; i < 4; i++) {
        const result = await generateImageAction(null, formData);
        
        if (result.errors || !result.imageUrl) {
          setHistory(prev => prev.map(item => 
            item.id === newHistoryId 
            ? { ...item, status: 'error', errors: result.errors, message: result.message || "生成失败" } 
            : item
          ));
          throw new Error(result.message || "一个子请求失败。");
        }
        
        generatedUrls.push(result.imageUrl);
        
        setHistory(prev => prev.map(item => 
          item.id === newHistoryId 
          ? { ...item, imageUrls: [...generatedUrls] } 
          : item
        ));
        
        // Add a delay between requests to avoid rate limiting, except for the last one.
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setHistory(prev => prev.map(item => 
        item.id === newHistoryId 
        ? { ...item, status: 'success' } 
        : item
      ));

    } catch (error) {
      console.error("图片生成流程失败:", error);
    } finally {
      setIsPending(false);
    }
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
        <form onSubmit={handleGenerate}>
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