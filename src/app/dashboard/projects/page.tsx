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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Filter } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { useLocale } from "@/contexts/LocaleContext";

interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: OrderStatus;
  readonly updated_at: string;
  readonly service: { title_zh: string } | null;
}

type FilterValue = "all" | "active" | "completed";

const STATUS_LABELS_EN: Record<OrderStatus, string> = {
  pending: "Pending",
  quoted: "Quoted",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_LABELS_ZH: Record<OrderStatus, string> = {
  pending: "待处理",
  quoted: "已报价",
  confirmed: "已确认",
  in_progress: "进行中",
  delivered: "已交付",
  completed: "已完成",
  cancelled: "已取消",
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

const ACTIVE_STATUSES: readonly OrderStatus[] = [
  "pending",
  "quoted",
  "confirmed",
  "in_progress",
  "delivered",
];

const FILTER_LABELS_ZH: Record<FilterValue, string> = {
  all: "全部",
  active: "进行中",
  completed: "已完成",
};

const FILTER_LABELS_EN: Record<FilterValue, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export default function ProjectsPage() {
  const { locale } = useLocale();
  const [projects, setProjects] = useState<readonly Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");

  const statusLabels = locale === "zh" ? STATUS_LABELS_ZH : STATUS_LABELS_EN;
  const filterLabels = locale === "zh" ? FILTER_LABELS_ZH : FILTER_LABELS_EN;

  const loadProjects = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select("id, title, description, status, updated_at, service:services(title_zh)")
        .eq("client_id", user.id)
        .order("updated_at", { ascending: false });

      setProjects(
        (data ?? []).map((d) => ({
          ...d,
          service: Array.isArray(d.service) ? d.service[0] ?? null : d.service,
        }))
      );
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filtered = projects.filter((p) => {
    if (filter === "active") return ACTIVE_STATUSES.includes(p.status);
    if (filter === "completed")
      return p.status === "completed" || p.status === "cancelled";
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{locale === "zh" ? "我的项目" : "My Projects"}</h1>
          <p className="text-sm text-gray-500">
            {locale === "zh" ? "跟踪项目进度" : "Track and manage your project orders."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-gray-400" />
          {(["all", "active", "completed"] as const).map((val) => (
            <Button
              key={val}
              variant={filter === val ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(val)}
              className={
                filter === val
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }
            >
              {filterLabels[val]}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FolderKanban className="size-12 text-gray-300" />
            <p className="text-sm text-gray-500">
              {filter === "all"
                ? (locale === "zh" ? "暂无项目。提交需求开始！" : "No projects yet. Submit a request to get started!")
                : (locale === "zh" ? `暂无${filterLabels[filter]}项目。` : `No ${filter} projects found.`)}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="h-full border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-gray-900">
                      {project.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={STATUS_COLORS[project.status]}
                    >
                      {statusLabels[project.status]}
                    </Badge>
                  </div>
                  {project.service && (
                    <CardDescription className="text-gray-500">
                      {project.service.title_zh}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {project.description}
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    {locale === "zh" ? "最后更新 " : "Last updated "}
                    {new Date(project.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
