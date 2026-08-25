import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ListingCardSkeletonProps = {
  compact?: boolean;
  className?: string;
};

export function ListingCardSkeleton({ className }: ListingCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-1 px-2 pb-2 pt-1.5 sm:px-2.5 sm:pb-2.5">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-1 h-px w-full" />
        <Skeleton className="h-2.5 w-3/5" />
      </div>
    </div>
  );
}
