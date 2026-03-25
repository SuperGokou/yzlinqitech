"use client";

import { StatsCards } from "@/components/admin/StatsCards";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back. Here is an overview of your platform.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart />
        <RecentOrders />
      </div>
    </div>
  );
}
