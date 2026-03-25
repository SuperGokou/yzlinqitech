"use client";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-display text-[var(--text-primary)]">Something went wrong</h2>
        <p className="text-[var(--text-secondary)]">{error.message}</p>
        <button onClick={reset} className="px-6 py-2 bg-[var(--neon-cyan)] text-black rounded-lg font-medium">Try again</button>
      </div>
    </div>
  );
}
