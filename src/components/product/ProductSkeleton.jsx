import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden p-4">
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-4/5 h-6" />
        <Skeleton className="w-3/5 h-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-[30%] h-8" />
          <Skeleton className="w-[60%] h-10" />
        </div>
      </div>
    </div>
  );
}
