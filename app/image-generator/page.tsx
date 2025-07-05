"use client";

import { useState, useEffect } from "react";
import { GenerateForm } from "@/components/features/generate-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, Bot, Code, PaintBucket } from "lucide-react";
import { ImageGenerationStudio } from "@/components/features/image-generation-studio";
import ControlPanel from "@/components/generation/control-panel";
import ResultPanel from "@/components/generation/result-panel";
import type { HistoryItem } from "@/components/features/history-item-type";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserStatus } from "@/app/image-generator/actions";

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface UserStatus {
  isPro: boolean;
  credits: number;
}

export default function ImageGeneratorPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [highlightedHistoryId, setHighlightedHistoryId] = useState<number | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>({ isPro: false, credits: 0 });
  const [isStatusLoading, setIsStatusLoading] = useState(true);

  useEffect(() => {
    async function fetchUserStatus() {
      setIsStatusLoading(true);
      const status = await getUserStatus();
      setUserStatus(status);
      setIsStatusLoading(false);
    }
    fetchUserStatus();
  }, []);

  const latestResult = history[0];
  const errors = latestResult?.status === 'error' ? latestResult.errors : null;
  const lastSuccessfulInputs = history.find(item => item.status === 'success')?.inputs || null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left side: Control Panel */}
      <div className="w-1/4 min-w-[300px] max-w-[400px] border-r border-border p-6 overflow-y-auto">
        <ControlPanel
          isPending={isPending}
          setHistory={setHistory}
          setIsPending={setIsPending}
          lastSuccessfulInputs={lastSuccessfulInputs}
          errors={errors}
          history={history}
          setHighlightedHistoryId={setHighlightedHistoryId}
          isPro={userStatus.isPro}
          credits={userStatus.credits}
          isStatusLoading={isStatusLoading}
        />
      </div>

      {/* Right side: Result Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        <ResultPanel history={history} highlightedHistoryId={highlightedHistoryId} />
      </div>
    </div>
  );
}
