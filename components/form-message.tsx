"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FormMessage({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  if (!message) return null;

  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  const textColor = type === "error" ? "text-destructive" : "text-emerald-500";
  const bgColor = type === "error" ? "bg-destructive/10" : "bg-emerald-500/10";

  return (
    <div className={`p-3 rounded-md flex items-center gap-x-2 text-sm ${textColor} ${bgColor}`}>
      <Icon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
