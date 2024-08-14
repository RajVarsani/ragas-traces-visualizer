import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { TraceDetails } from "@/types";

export const getAccuracy = (trace: TraceDetails): number => {
  if (trace.type === "chain") {
    return Math.max(
      parseFloat(trace.outputs.faithfulness?.toString() || "") || 0,
      parseFloat(trace.outputs.output?.toString() || "") || 0
    );
  } else {
    return 0
  }
}


export const countChildren = (trace: TraceDetails): number => {
  return trace.children.reduce((acc, child) => {
    return acc + 1 + countChildren(child)
  }, 0)
}