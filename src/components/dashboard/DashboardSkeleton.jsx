import { Skeleton } from "@/components/ui/skeleton";

function PanelSkeleton({ className = "", height = "h-[260px]" }) {
  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm p-5 ${className}`}>
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-4 w-40 mb-5" />
      <Skeleton className={`w-full ${height}`} />
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-[260px] w-full rounded-2xl" />
      <div className="grid grid-cols-12 gap-5">
        <PanelSkeleton className="col-span-12 lg:col-span-7" />
        <PanelSkeleton className="col-span-12 lg:col-span-5" height="h-[180px]" />
        <PanelSkeleton className="col-span-12 lg:col-span-4" height="h-[200px]" />
        <PanelSkeleton className="col-span-12 lg:col-span-4" height="h-[200px]" />
        <PanelSkeleton className="col-span-12 lg:col-span-4" height="h-[200px]" />
        <PanelSkeleton className="col-span-12 lg:col-span-8" height="h-[220px]" />
        <PanelSkeleton className="col-span-12 lg:col-span-4" height="h-[220px]" />
      </div>
    </div>
  );
}
