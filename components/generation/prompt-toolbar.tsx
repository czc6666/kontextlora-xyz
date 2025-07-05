"use client";

import { Undo, Redo, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function PromptToolbar({
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}: PromptToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo"
        className="h-auto w-auto p-1 text-muted-foreground hover:text-foreground"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo"
        className="h-auto w-auto p-1 text-muted-foreground hover:text-foreground"
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onClear}
        aria-label="Clear prompt"
        className="h-auto w-auto p-1 text-muted-foreground hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
} 