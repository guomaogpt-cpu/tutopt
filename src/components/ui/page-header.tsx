import * as React from "react";
import { cn } from "@/lib/utils";

export type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  bordered?: boolean;
};

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, bordered = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between",
        bordered && "border-b",
        className,
      )}
      {...props}
    />
  ),
);
PageHeader.displayName = "PageHeader";

const PageHeaderContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex min-w-0 flex-1 flex-col gap-2", className)} {...props} />
  ),
);
PageHeaderContent.displayName = "PageHeaderContent";

const PageHeaderActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex shrink-0 flex-wrap items-center gap-2", className)}
      {...props}
    />
  ),
);
PageHeaderActions.displayName = "PageHeaderActions";

export { PageHeader, PageHeaderActions, PageHeaderContent };
