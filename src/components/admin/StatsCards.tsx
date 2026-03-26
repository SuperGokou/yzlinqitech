"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  FileQuestion,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardData {
  readonly title: string;
  readonly value: string | number;
  readonly change: string;
  readonly trend: "up" | "down";
  readonly icon: React.ElementType;
  readonly iconBg: string;
  readonly iconColor: string;
}

interface StatsCardsProps {
  stats?: {
    totalOrders: number;
    pendingQuotes: number;
    activeProjects: number;
    revenue: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const data = stats ?? {
    totalOrders: 156,
    pendingQuotes: 12,
    activeProjects: 8,
    revenue: 284500,
  };

  const cards: readonly StatCardData[] = [
    {
      title: "Total Orders",
      value: data.totalOrders,
      change: "+12%",
      trend: "up",
      icon: ShoppingCart,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending Quotes",
      value: data.pendingQuotes,
      change: "-3%",
      trend: "down",
      icon: FileQuestion,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Active Projects",
      value: data.activeProjects,
      change: "+5%",
      trend: "up",
      icon: Briefcase,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Revenue",
      value: `$${data.revenue.toLocaleString()}`,
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown;
        return (
          <Card
            key={card.title}
            className="border-gray-200 bg-white shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {card.title}
              </CardTitle>
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  card.iconBg
                )}
              >
                <Icon className={cn("size-4", card.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <TrendIcon
                  className={cn(
                    "size-3",
                    card.trend === "up" ? "text-green-500" : "text-red-500"
                  )}
                />
                <span
                  className={cn(
                    card.trend === "up" ? "text-green-600" : "text-red-600"
                  )}
                >
                  {card.change}
                </span>
                <span className="text-gray-400">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
