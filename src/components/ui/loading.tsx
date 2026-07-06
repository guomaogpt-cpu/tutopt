import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export type LoadingProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
};

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

function Loading({ label = "Загрузка...", size = "md", className, fullScreen = false }: LoadingProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex flex-col items-center justify-center gap-3", className)}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} aria-hidden="true" />
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">{content}</div>
    );
  }

  return content;
}

export { Loading };
