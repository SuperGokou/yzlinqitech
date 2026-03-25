"use client";

import { useCallback, useEffect, useState, use } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Check,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

interface OrderDetail {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: OrderStatus;
  readonly budget_range: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

interface QuoteDetail {
  readonly id: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: string;
  readonly valid_until: string | null;
  readonly notes: string | null;
  readonly breakdown: Record<string, unknown> | null;
}

interface MessageItem {
  readonly id: string;
  readonly content: string;
  readonly sender_id: string | null;
  readonly created_at: string;
}

const STATUS_STEPS: readonly OrderStatus[] = [
  "pending",
  "quoted",
  "confirmed",
  "in_progress",
  "delivered",
  "completed",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  quoted: "Quoted",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [messages, setMessages] = useState<readonly MessageItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProject = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [orderRes, quoteRes, messagesRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, title, description, status, budget_range, created_at, updated_at")
          .eq("id", id)
          .eq("client_id", user.id)
          .single(),
        supabase
          .from("quotes")
          .select("id, amount, currency, status, valid_until, notes, breakdown")
          .eq("order_id", id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("messages")
          .select("id, content, sender_id, created_at")
          .eq("order_id", id)
          .order("created_at", { ascending: true }),
      ]);

      setOrder(orderRes.data);
      setQuote(quoteRes.data);
      setMessages(messagesRes.data ?? []);
    } catch {
      // Graceful degradation
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !userId) return;
    setSending(true);

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("messages")
        .insert({
          order_id: id,
          sender_id: userId,
          content: newMessage.trim(),
        })
        .select("id, content, sender_id, created_at")
        .single();

      if (data) {
        setMessages((prev) => [...prev, data]);
        setNewMessage("");
      }
    } catch {
      // Handle silently
    } finally {
      setSending(false);
    }
  }, [newMessage, userId, id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-gray-200" />
        <Skeleton className="h-48 w-full rounded-xl bg-gray-200" />
        <Skeleton className="h-32 w-full rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Project not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-gray-900">
                {order.title}
              </CardTitle>
              <CardDescription className="mt-1 text-gray-500">
                Created {new Date(order.created_at).toLocaleDateString()}
                {order.budget_range && ` | Budget: ${order.budget_range}`}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                order.status === "cancelled"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-blue-100 text-blue-800"
              )}
            >
              {STATUS_LABELS[order.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {order.description}
          </p>
        </CardContent>
      </Card>

      {/* Status Stepper */}
      {order.status !== "cancelled" && (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                          isCompleted
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="size-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={cn(
                          "whitespace-nowrap text-xs",
                          isCurrent
                            ? "font-medium text-blue-700"
                            : isCompleted
                              ? "text-gray-700"
                              : "text-gray-400"
                        )}
                      >
                        {STATUS_LABELS[step]}
                      </span>
                    </div>
                    {index < STATUS_STEPS.length - 1 && (
                      <div
                        className={cn(
                          "mb-5 h-0.5 w-6 flex-shrink-0 sm:w-10",
                          index < currentStepIndex
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote Details */}
      {quote && (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Quote</CardTitle>
            <CardDescription className="text-gray-500">
              {quote.status === "sent"
                ? "Review the quote and accept or reject."
                : `Quote status: ${quote.status}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-xl font-bold text-gray-900">
                {quote.currency} {quote.amount.toLocaleString()}
              </span>
            </div>
            {quote.valid_until && (
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500">Valid Until</span>
                <span className="text-sm text-gray-700">
                  {new Date(quote.valid_until).toLocaleDateString()}
                </span>
              </div>
            )}
            {quote.notes && (
              <>
                <Separator className="bg-gray-200" />
                <p className="text-sm text-gray-600">{quote.notes}</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              No messages yet. Start the conversation below.
            </p>
          ) : (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {messages.map((msg) => {
                const isOwn = msg.sender_id === userId;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2",
                      isOwn
                        ? "ml-auto bg-blue-50 text-gray-900"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <Separator className="bg-gray-200" />

          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-10 resize-none border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              disabled={sending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="self-end bg-blue-600 text-white hover:bg-blue-700"
              size="icon"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
