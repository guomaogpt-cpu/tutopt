import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListingsLoading() {
  return (
    <main className="min-w-0 overflow-x-clip bg-[#F8FAFC] pb-8 pt-4 dark:bg-slate-950 sm:py-8">
      <Container size="lg">
        <Skeleton className="mb-4 h-8 w-48 max-w-[70%]" />
        <Skeleton className="mb-3 h-11 w-full rounded-xl" />
        <div className="mb-4 flex gap-2 overflow-hidden">
          <Skeleton className="h-9 w-20 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-16 shrink-0 rounded-full" />
        </div>
        <div
          className="grid w-full min-w-0 grid-cols-2 gap-3.5 max-[339px]:grid-cols-1 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5"
          aria-busy="true"
          aria-label="Загрузка объявлений"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <ListingCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </main>
  );
}
