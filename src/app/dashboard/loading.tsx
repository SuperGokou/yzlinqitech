import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome card skeleton */}
      <Skeleton className="h-28 w-full rounded-xl bg-gray-200" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-xl bg-gray-200" />
        <Skeleton className="h-24 rounded-xl bg-gray-200" />
        <Skeleton className="h-24 rounded-xl bg-gray-200" />
      </div>

      {/* Activity skeleton */}
      <Skeleton className="h-64 w-full rounded-xl bg-gray-200" />
    </div>
  );
}
