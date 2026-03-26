import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Page title skeleton */}
      <Skeleton className="h-8 w-48 bg-gray-200" />

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <Skeleton className="mb-2 h-4 w-24 bg-gray-200" />
            <Skeleton className="h-8 w-16 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <Skeleton className="mb-4 h-6 w-32 bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
