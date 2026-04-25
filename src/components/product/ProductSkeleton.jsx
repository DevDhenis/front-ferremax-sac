import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function ProductSkeleton() {
  return (
    <Card className="shadow-2 border-round-xl overflow-hidden">
      <div className="flex flex-column gap-3">
        <Skeleton width="100%" height="200px" />
        <Skeleton width="80%" height="1.5rem" />
        <Skeleton width="60%" height="1rem" />
        <div className="flex justify-content-between align-items-center">
          <Skeleton width="30%" height="2rem" />
          <Skeleton width="60%" height="2.5rem" />
        </div>
      </div>
    </Card>
  );
}