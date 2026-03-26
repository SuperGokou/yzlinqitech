"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Send,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
type OrderStatus = OrderRow["status"];

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  quoted: { label: "Quoted", className: "bg-blue-100 text-blue-800 border-blue-200" },
  confirmed: { label: "Confirmed", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  in_progress: { label: "In Progress", className: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
};

const STATUS_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus; icon: React.ElementType }[]>> = {
  pending: [{ label: "Mark as Quoted", next: "quoted", icon: DollarSign }],
  quoted: [{ label: "Confirm Order", next: "confirmed", icon: CheckCircle }],
  confirmed: [{ label: "Start Progress", next: "in_progress", icon: Clock }],
  in_progress: [{ label: "Mark Delivered", next: "delivered", icon: Send }],
  delivered: [{ label: "Mark Completed", next: "completed", icon: CheckCircle }],
};

interface OrderData {
  order: OrderRow;
  quotes: QuoteRow[];
  messages: MessageRow[];
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Quote form state
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleStatusUpdate(newStatus: OrderStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchOrder();
      }
    } catch {
      // silently handle
    } finally {
      setUpdating(false);
    }
  }

  async function handleCancelOrder() {
    await handleStatusUpdate("cancelled");
  }

  async function handleSubmitQuote(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(quoteAmount);
    if (isNaN(amount) || amount <= 0) return;

    setSubmittingQuote(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          amount,
          notes: quoteNotes || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setQuoteAmount("");
        setQuoteNotes("");
        await fetchOrder();
      }
    } catch {
      // silently handle
    } finally {
      setSubmittingQuote(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-gray-200" />
        <Skeleton className="h-64 w-full bg-gray-100" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Card className="border-gray-200 bg-white">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Order not found</p>
            <Button
              variant="outline"
              className="mt-4 border-gray-200"
              onClick={() => router.push("/admin/orders")}
            >
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { order, quotes, messages } = data;
  const config = statusConfig[order.status];
  const actions = STATUS_ACTIONS[order.status] ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push("/admin/orders")}
          className="text-gray-500"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{order.title}</h1>
          <p className="text-sm text-gray-500">
            Order ID: {order.id}
          </p>
        </div>
        <Badge variant="outline" className={cn("border text-sm", config.className)}>
          {config.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-400">Created</p>
                  <p className="text-sm text-gray-700">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">Budget Range</p>
                  <p className="text-sm text-gray-700">
                    {order.budget_range ?? "--"}
                  </p>
                </div>
              </div>
              <Separator className="bg-gray-100" />
              <div>
                <p className="text-xs font-medium text-gray-400">Description</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {order.description}
                </p>
              </div>
              {order.attachments && order.attachments.length > 0 && (
                <>
                  <Separator className="bg-gray-100" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Attachments ({order.attachments.length})
                    </p>
                    <ul className="mt-2 space-y-1">
                      {order.attachments.map((att, i) => (
                        <li
                          key={i}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {att.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Messages</CardTitle>
              <CardDescription className="text-gray-500">
                Communication thread for this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  No messages yet
                </p>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <p className="text-sm text-gray-700">{msg.content}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status actions */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.next}
                    className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    disabled={updating}
                    onClick={() => handleStatusUpdate(action.next)}
                  >
                    <Icon className="size-4" />
                    {action.label}
                  </Button>
                );
              })}
              {order.status !== "cancelled" && order.status !== "completed" && (
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  disabled={updating}
                  onClick={handleCancelOrder}
                >
                  <XCircle className="size-4" />
                  Cancel Order
                </Button>
              )}
              {actions.length === 0 && order.status !== "cancelled" && order.status !== "completed" && (
                <p className="text-center text-sm text-gray-400">
                  No available actions
                </p>
              )}
              {(order.status === "cancelled" || order.status === "completed") && (
                <p className="text-center text-sm text-gray-400">
                  This order is {order.status}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Quotes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quotes.length > 0 && (
                <div className="space-y-2">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          {q.currency} {q.amount.toLocaleString()}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs border",
                            q.status === "accepted"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : q.status === "rejected"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : q.status === "sent"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                          )}
                        >
                          {q.status}
                        </Badge>
                      </div>
                      {q.notes && (
                        <p className="mt-1 text-xs text-gray-500">{q.notes}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(q.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="bg-gray-100" />

              {/* New quote form */}
              <form onSubmit={handleSubmitQuote} className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Create New Quote
                </p>
                <div>
                  <Label htmlFor="quote-amount" className="text-gray-600">
                    Amount (CNY)
                  </Label>
                  <Input
                    id="quote-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="mt-1 border-gray-200 bg-white text-gray-900"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quote-notes" className="text-gray-600">
                    Notes
                  </Label>
                  <Textarea
                    id="quote-notes"
                    placeholder="Optional notes..."
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="mt-1 border-gray-200 bg-white text-gray-900"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={submittingQuote}
                >
                  <DollarSign className="size-4" />
                  {submittingQuote ? "Submitting..." : "Submit Quote"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
