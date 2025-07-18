"use client";

import type { HistoryItem } from "./history-item-type";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  history: HistoryItem[];
  highlightedHistoryId: number | null;
  onSelectHistory: (item: HistoryItem) => void;
}

export function HistoryPanel({ history, highlightedHistoryId, onSelectHistory }: HistoryPanelProps) {
  if (history.length === 0) {
    return null; // Don't show anything if there's no history
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">History</h3>
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {history.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectHistory(item)}
            className={cn(
              "w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-4",
              item.id === highlightedHistoryId && "bg-muted"
            )}
          >
            {item.imageUrls.length > 0 ? (
              <img
                src={item.imageUrls[0]}
                alt="History preview"
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {item.status === 'loading' ? '...' : 'ERR'}
                </span>
              </div>
            )}
            <p className="text-sm truncate flex-1">
              {String(item.inputs?.prompt) || "Untitled"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
} 