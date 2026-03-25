"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Plus,
  Clock,
} from "lucide-react";
import type { OrderStatus } from "@/lib/types";

interface DashboardStats {
  readonly activeProjects: number;
  readonly pendingQuotes: number;
  readonly unreadMessages: number;
}

interface RecentOrder {
  readonly id: string;
  readonly title: string;
  readonly status: OrderStatus;
  readonly updated_at: string;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  quoted: "Quoted",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  quoted: "bg-blue-100 text-blue-800",
  confirmed: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<readonly RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.name ?? user.user_metadata?.name ?? "User");

      // Load stats in parallel
      const [ordersResult, quotesResult, messagesResult, recentResult] =
        await Promise.all([
          supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("client_id", user.id)
            .in("status", ["confirmed", "in_progress", "delivered"]),
          supabase
            .from("quotes")
            .select("id, order_id", { count: "exact", head: true })
            .eq("status", "sent")
            .in(
              "order_id",
              // Sub-query workaround: first get user's order IDs
              (
                await supabase
                  .from("orders")
                  .select("id")
                  .eq("client_id", user.id)
              ).data?.map((o) => o.id) ?? []
            ),
          supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .is("read_at", null)
            .neq("sender_id", user.id)
            .in(
              "order_id",
              (
                await supabase
                  .from("orders")
                  .select("id")
                  .eq("client_id", user.id)
              ).data?.map((o) => o.id) ?? []
            ),
          supabase
            .from("orders")
            .select("id, title, status, updated_at")
            .eq("client_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(5),
        ]);

      setStats({
        activeProjects: ordersResult.count ?? 0,
        pendingQuotes: quotesResult.count ?? 0,
        unreadMessages: messagesResult.count ?? 0,
      });

      setRecentOrders(recentResult.data ?? []);
    } catch {
      // Graceful degradation
      setStats({ activeProjects: 0, pendingQuotes: 0, unreadMessages: 0 });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-xl bg-gray-200" />
          <Skeleton className="h-24 rounded-xl bg-gray-200" />
          <Skeleton className="h-24 rounded-xl bg-gray-200" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {userName ?? "User"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Here is an overview of your projects and activity.
            </p>
          </div>
          <Link href="/dashboard/projects">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="mr-1.5 size-4" />
              Submit New Request
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
              <FolderKanban className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeProjects ?? 0}
              </p>
              <p className="text-sm text-gray-500">Active Projects</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50">
              <FileText className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.pendingQuotes ?? 0}
              </p>
              <p className="text-sm text-gray-500">Pending Quotes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-50">
              <MessageSquare className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.unreadMessages ?? 0}
              </p>
              <p className="text-sm text-gray-500">Unread Messages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Activity</CardTitle>
          <CardDescription className="text-gray-500">
            Your latest project updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Clock className="size-10 text-gray-300" />
              <p className="text-sm text-gray-500">
                No projects yet. Submit a request to get started!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/projects/${order.id}`}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {order.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      Updated{" "}
                      {new Date(order.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={STATUS_COLORS[order.status]}
                  >
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
