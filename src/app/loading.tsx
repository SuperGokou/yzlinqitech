export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo skeleton */}
        <div className="w-16 h-16 rounded-full skeleton" />
        {/* Text skeletons */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-48 h-4 skeleton" />
          <div className="w-32 h-3 skeleton" />
        </div>
      </div>
    </div>
  );
}
