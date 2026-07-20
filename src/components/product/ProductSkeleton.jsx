import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <Skeleton className="w-full h-52 rounded-none" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Skeleton className="w-2/5 h-3" />
        <Skeleton className="w-4/5 h-5" />
        <Skeleton className="w-1/3 h-3" />
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-full h-11" />
        </div>
      </div>
    </div>
  );
}
