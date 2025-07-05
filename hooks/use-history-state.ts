"use client";

import { useState, useCallback, useMemo } from 'react';

export function useHistoryState<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    const nextState = typeof newState === 'function' 
      ? (newState as (prevState: T) => T)(history[currentIndex]) 
      : newState;
      
    if (nextState === history[currentIndex]) {
      return; // Do nothing if state is the same
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(nextState);

    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(() => currentIndex < history.length - 1, [currentIndex, history.length]);
  
  const state = history[currentIndex];

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory: (newState: T) => {
      setHistory([newState]);
      setCurrentIndex(0);
    }
  };
} 