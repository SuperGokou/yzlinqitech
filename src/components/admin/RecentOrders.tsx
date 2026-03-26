"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus =
  | "pending"
  | "quoted"
  | "confirmed"
  | "in_progress"
  | "delivered"
  | "completed"
  | "cancelled";

interface RecentOrder {
  readonly id: string;
  readonly title: string;
  readonly client: string;
  readonly service: string;
  readonly status: OrderStatus;
  readonly date: string;
  readonly amount: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  quoted: {
    label: "Quoted",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const mockOrders: readonly RecentOrder[] = [
  {
    id: "ORD-001",
    title: "E-commerce Website",
    client: "Zhang Wei",
    service: "Web Development",
    status: "in_progress",
    date: "2026-03-24",
    amount: "$12,500",
  },
  {
    id: "ORD-002",
    title: "Mobile App UI",
    client: "Li Ming",
    service: "App Development",
    status: "pending",
    date: "2026-03-23",
    amount: "$8,000",
  },
  {
    id: "ORD-003",
    title: "Brand Identity",
    client: "Wang Fang",
    service: "Design",
    status: "quoted",
    date: "2026-03-22",
    amount: "$3,500",
  },
  {
    id: "ORD-004",
    title: "SaaS Platform",
    client: "Chen Jun",
    service: "Web Development",
    status: "completed",
    date: "2026-03-20",
    amount: "$45,000",
  },
  {
    id: "ORD-005",
    title: "WeChat Mini Program",
    client: "Liu Yan",
    service: "Mini Program",
    status: "confirmed",
    date: "2026-03-19",
    amount: "$6,200",
  },
];

interface RecentOrdersProps {
  orders?: readonly RecentOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const displayOrders = orders ?? mockOrders;

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Recent Orders</CardTitle>
        <CardAction>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
              View all
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {displayOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No orders yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="text-gray-500">Order</TableHead>
                <TableHead className="text-gray-500">Client</TableHead>
                <TableHead className="text-gray-500">Service</TableHead>
                <TableHead className="text-gray-500">Status</TableHead>
                <TableHead className="text-gray-500">Date</TableHead>
                <TableHead className="text-right text-gray-500">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayOrders.map((order) => {
                const config = statusConfig[order.status];
                return (
                  <TableRow
                    key={order.id}
                    className="border-gray-50 hover:bg-gray-50"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.client}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.service}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("border text-xs", config.className)}
                      >
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">{order.date}</TableCell>
                    <TableCell className="text-right font-medium text-gray-900">
                      {order.amount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
