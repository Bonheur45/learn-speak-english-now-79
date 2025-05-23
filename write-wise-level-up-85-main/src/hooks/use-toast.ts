
import { useState, useEffect, useCallback } from "react";
import { ToastAction } from "@/components/ui/toast";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
}: ToastProps) {
  sonnerToast[variant === "destructive" ? "error" : "success"](
    title,
    {
      description,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
      duration,
    }
  );
}

export const useToast = () => {
  return { toast };
};
