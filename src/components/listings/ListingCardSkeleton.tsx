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
        "flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-1.5 px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3 sm:pt-2.5">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-2.5 w-3/5" />
        <Skeleton className="h-2.5 w-2/5" />
      </div>
    </div>
  );
}
