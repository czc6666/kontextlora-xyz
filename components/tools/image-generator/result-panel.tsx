"use client";

import { GenerationResults } from "./generation-results";
import type { HistoryItem } from "./history-item-type";

interface ResultPanelProps {
  history: HistoryItem[];
  highlightedHistoryId: number | null;
}

export default function ResultPanel({ history, highlightedHistoryId }: ResultPanelProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
      <GenerationResults history={history} highlightedHistoryId={highlightedHistoryId} />
    </div>
  );
} 