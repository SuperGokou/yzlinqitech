"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-error"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
        出了点问题
      </h1>
      <p className="text-text-secondary text-sm md:text-base mb-8 max-w-md">
        页面加载时发生错误，请稍后重试。
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 rounded-xl font-medium text-bg-deep bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-glow-cyan-md transition-all duration-300"
      >
        重试
      </button>
    </div>
  );
}
