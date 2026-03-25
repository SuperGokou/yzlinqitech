import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your projects, quotes, and messages.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
