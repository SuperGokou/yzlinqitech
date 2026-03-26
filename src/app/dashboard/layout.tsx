import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardLocaleProvider } from "@/components/dashboard/DashboardLocaleProvider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLocaleProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </DashboardLocaleProvider>
  );
}
