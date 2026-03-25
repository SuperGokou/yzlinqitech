import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or register for your LingQi Tech account.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <h1 className="font-display text-2xl font-bold tracking-wider text-neon-cyan">
            LingQi Tech
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            软件加工厂
          </p>
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
