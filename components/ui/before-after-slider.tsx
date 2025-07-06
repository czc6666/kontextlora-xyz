"use client";

import * as React from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  type ReactCompareSliderProps,
} from "react-compare-slider";

import { cn } from "@/lib/utils";

const BeforeAfterSlider = ({
  className,
  ...props
}: ReactCompareSliderProps & { className?: string }) => (
  <div
    className={cn(
      "group relative",
      "[&_.handle-container]:backdrop-blur-sm [&_.handle-container]:bg-background/50 [&_.handle-container]:rounded-full [&_.handle-container]:border [&_.handle-container]:border-border",
      "[&_.handle-container]:w-12 [&_.handle-container]:h-12",
      "[&_.handle-container_svg]:w-6 [&_.handle-container_svg]:h-6 [&_.handle-container_svg_path]:fill-foreground",
      className
    )}
  >
    <ReactCompareSlider
      {...props}
      className="rounded-lg [&>div]:rounded-lg [&_img]:object-contain"
    />
  </div>
);

export { BeforeAfterSlider, ReactCompareSliderImage as BeforeAfterImage }; 