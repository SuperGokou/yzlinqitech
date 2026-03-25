"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuoteStatus } from "@/lib/types";
import { useLocale } from "@/contexts/LocaleContext";

interface QuoteItem {
  readonly id: string;
  readonly order_id: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: QuoteStatus;
  readonly valid_until: string | null;
  readonly notes: string | null;
  readonly breakdown: Record<string, unknown> | null;
  readonly created_at: string;
  readonly order: { title: string } | null;
}

const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const QUOTE_STATUS_LABELS_EN: Record<QuoteStatus, string> = {
  draft: "Draft",
  sent: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

const QUOTE_STATUS_LABELS_ZH: Record<QuoteStatus, string> = {
  draft: "草稿",
  sent: "待确认",
  accepted: "已接受",
  rejected: "已拒绝",
};

export default function QuotesPage() {
  const { locale } = useLocale();
  const [quotes, setQuotes] = useState<readonly QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const statusLabels = locale === "zh" ? QUOTE_STATUS_LABELS_ZH : QUOTE_STATUS_LABELS_EN;

  const loadQuotes = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's order IDs
      const { data: orders } = await supabase
        .from("orders")
        .select("id")
        .eq("client_id", user.id);

      const orderIds = orders?.map((o) => o.id) ?? [];
      if (orderIds.length === 0) {
        setQuotes([]);
        return;
      }

      const { data } = await supabase
        .from("quotes")
        .select("id, order_id, amount, currency, status, valid_until, notes, breakdown, created_at, order:orders(title)")
        .in("order_id", orderIds)
        .order("created_at", { ascending: false });

      setQuotes(
        (data ?? []).map((d) => ({
          ...d,
          order: Array.isArray(d.order) ? d.order[0] ?? null : d.order,
        }))
      );
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleAction = useCallback(
    async (quoteId: string, action: "accepted" | "rejected") => {
      setActionLoading(quoteId);
      try {
        const supabase = createClient();
        await supabase
          .from("quotes")
          .update({ status: action })
          .eq("id", quoteId);

        // If accepted, also update the order status to confirmed
        const quote = quotes.find((q) => q.id === quoteId);
        if (action === "accepted" && quote) {
          await supabase
            .from("orders")
            .update({ status: "confirmed" })
            .eq("id", quote.order_id);
        }

        // Reload data
        await loadQuotes();
      } catch {
        // Handle silently
      } finally {
        setActionLoading(null);
      }
    },
    [quotes, loadQuotes]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg bg-gray-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{locale === "zh" ? "报价" : "Quotes"}</h1>
        <p className="text-sm text-gray-500">
          {locale === "zh" ? "查看和管理项目报价" : "Review and manage quotes for your projects."}
        </p>
      </div>

      {quotes.length === 0 ? (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FileText className="size-12 text-gray-300" />
            <p className="text-sm text-gray-500">
              {locale === "zh"
                ? "暂无报价。提交项目需求后，报价将显示在这里。"
                : "No quotes yet. Quotes will appear here once we review your project requests."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => {
            const expanded = expandedId === quote.id;
            return (
              <Card
                key={quote.id}
                className="border-gray-200 bg-white shadow-sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-gray-900">
                        {quote.order?.title ?? "Untitled Order"}
                      </CardTitle>
                      <CardDescription className="mt-1 text-gray-500">
                        {locale === "zh" ? "收到于 " : "Received "}
                        {new Date(quote.created_at).toLocaleDateString()}
                        {quote.valid_until &&
                          (locale === "zh"
                            ? ` | 有效期至 ${new Date(quote.valid_until).toLocaleDateString()}`
                            : ` | Valid until ${new Date(quote.valid_until).toLocaleDateString()}`)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={QUOTE_STATUS_COLORS[quote.status]}
                      >
                        {statusLabels[quote.status]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-500">{locale === "zh" ? "总金额" : "Total Amount"}</span>
                    <span className="text-xl font-bold text-gray-900">
                      {quote.currency} {quote.amount.toLocaleString()}
                    </span>
                  </div>

                  {quote.notes && (
                    <p className="text-sm text-gray-600">{quote.notes}</p>
                  )}

                  {/* Expandable Breakdown */}
                  {quote.breakdown &&
                    Object.keys(quote.breakdown).length > 0 && (
                      <>
                        <button
                          onClick={() =>
                            setExpandedId(expanded ? null : quote.id)
                          }
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          {expanded ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                          {locale === "zh"
                            ? (expanded ? "隐藏明细" : "显示明细")
                            : (expanded ? "Hide Breakdown" : "Show Breakdown")}
                        </button>
                        {expanded && (
                          <div className="rounded-lg bg-gray-50 p-3">
                            <div className="space-y-2">
                              {Object.entries(quote.breakdown).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-600">{key}</span>
                                    <span className="font-medium text-gray-900">
                                      {String(value)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                  {/* Actions for pending quotes */}
                  {quote.status === "sent" && (
                    <>
                      <Separator className="bg-gray-200" />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(quote.id, "accepted")}
                          disabled={actionLoading === quote.id}
                          className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === quote.id
                            ? (locale === "zh" ? "处理中..." : "Processing...")
                            : (locale === "zh" ? "接受" : "Accept")}
                        </button>
                        <button
                          onClick={() => handleAction(quote.id, "rejected")}
                          disabled={actionLoading === quote.id}
                          className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          {locale === "zh" ? "拒绝" : "Reject"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
