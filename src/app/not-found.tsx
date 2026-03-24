import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-8xl md:text-9xl font-bold gradient-neon-text mb-6 select-none">
        404
      </h1>
      <p className="text-text-secondary text-lg md:text-xl mb-10">
        页面未找到
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-xl font-medium text-bg-deep bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-glow-cyan-md transition-all duration-300"
      >
        返回首页
      </Link>
    </div>
  );
}
