import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ListingCardSkeletonProps = {
  compact?: boolean;
  className?: string;
};

export function ListingCardSkeleton({ compact = false, className }: ListingCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className={cn("space-y-2", compact ? "p-2.5" : "p-3")}>
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}
