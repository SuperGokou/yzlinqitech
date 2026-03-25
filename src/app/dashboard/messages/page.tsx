"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

interface OrderThread {
  readonly id: string;
  readonly title: string;
  readonly latestMessage: string | null;
  readonly latestAt: string | null;
  readonly unreadCount: number;
}

interface MessageItem {
  readonly id: string;
  readonly content: string;
  readonly sender_id: string | null;
  readonly created_at: string;
  readonly read_at: string | null;
}

export default function MessagesPage() {
  const { locale } = useLocale();
  const [threads, setThreads] = useState<readonly OrderThread[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<readonly MessageItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadThreads = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: orders } = await supabase
        .from("orders")
        .select("id, title")
        .eq("client_id", user.id)
        .order("updated_at", { ascending: false });

      if (!orders || orders.length === 0) {
        setThreads([]);
        return;
      }

      // Get latest message + unread count for each order
      const threadData: OrderThread[] = await Promise.all(
        orders.map(async (order) => {
          const [latestRes, unreadRes] = await Promise.all([
            supabase
              .from("messages")
              .select("content, created_at")
              .eq("order_id", order.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabase
              .from("messages")
              .select("id", { count: "exact", head: true })
              .eq("order_id", order.id)
              .is("read_at", null)
              .neq("sender_id", user.id),
          ]);

          return {
            id: order.id,
            title: order.title,
            latestMessage: latestRes.data?.content ?? null,
            latestAt: latestRes.data?.created_at ?? null,
            unreadCount: unreadRes.count ?? 0,
          };
        })
      );

      // Sort by latest message time, threads with messages first
      const sorted = [...threadData].sort((a, b) => {
        if (!a.latestAt && !b.latestAt) return 0;
        if (!a.latestAt) return 1;
        if (!b.latestAt) return -1;
        return new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime();
      });

      setThreads(sorted);
    } catch {
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  // Load messages for selected thread
  const loadMessages = useCallback(
    async (orderId: string) => {
      setMessagesLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("messages")
          .select("id, content, sender_id, created_at, read_at")
          .eq("order_id", orderId)
          .order("created_at", { ascending: true });

        setMessages(data ?? []);

        // Mark unread messages as read
        if (userId && data) {
          const unreadIds = data
            .filter((m) => !m.read_at && m.sender_id !== userId)
            .map((m) => m.id);

          if (unreadIds.length > 0) {
            await supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .in("id", unreadIds);

            // Update thread unread count locally
            setThreads((prev) =>
              prev.map((t) =>
                t.id === orderId ? { ...t, unreadCount: 0 } : t
              )
            );
          }
        }
      } catch {
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (selectedOrderId) {
      loadMessages(selectedOrderId);
    }
  }, [selectedOrderId, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Realtime subscription
  useEffect(() => {
    if (!selectedOrderId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${selectedOrderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `order_id=eq.${selectedOrderId}`,
        },
        (payload) => {
          const newMsg = payload.new as MessageItem;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedOrderId]);

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !userId || !selectedOrderId) return;
    setSending(true);

    try {
      const supabase = createClient();
      await supabase.from("messages").insert({
        order_id: selectedOrderId,
        sender_id: userId,
        content: newMessage.trim(),
      });

      setNewMessage("");
    } catch {
      // Handle silently
    } finally {
      setSending(false);
    }
  }, [newMessage, userId, selectedOrderId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-lg bg-gray-200" />
        <Skeleton className="h-[500px] w-full rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{locale === "zh" ? "消息" : "Messages"}</h1>
        <p className="text-sm text-gray-500">
          {locale === "zh" ? "项目沟通" : "Communicate with the team about your projects."}
        </p>
      </div>

      {threads.length === 0 ? (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <MessageSquare className="size-12 text-gray-300" />
            <p className="text-sm text-gray-500">
              {locale === "zh"
                ? "暂无对话。有活跃项目后消息将显示在这里。"
                : "No conversations yet. Messages will appear once you have active projects."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid h-[calc(100vh-220px)] min-h-[400px] grid-cols-1 gap-4 md:grid-cols-3">
          {/* Thread List */}
          <Card className="overflow-hidden border-gray-200 bg-white shadow-sm md:col-span-1">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-sm text-gray-900">
                {locale === "zh" ? "对话" : "Conversations"}
              </CardTitle>
            </CardHeader>
            <div className="overflow-y-auto">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedOrderId(thread.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-gray-50 px-4 py-3 text-left transition-colors",
                    selectedOrderId === thread.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        selectedOrderId === thread.id
                          ? "text-blue-700"
                          : "text-gray-900"
                      )}
                    >
                      {thread.title}
                    </span>
                    {thread.unreadCount > 0 && (
                      <Badge className="min-w-5 justify-center bg-blue-600 text-white">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {thread.latestMessage && (
                    <p className="truncate text-xs text-gray-400">
                      {thread.latestMessage}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Message Thread */}
          <Card className="flex flex-col overflow-hidden border-gray-200 bg-white shadow-sm md:col-span-2">
            {selectedOrderId ? (
              <>
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-sm text-gray-900">
                    {threads.find((t) => t.id === selectedOrderId)?.title ??
                      "Messages"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {messagesLoading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className={cn(
                              "h-12 w-2/3 rounded-lg bg-gray-200",
                              i % 2 === 0 ? "" : "ml-auto"
                            )}
                          />
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-400">
                        {locale === "zh" ? "暂无消息。在下方开始对话。" : "No messages yet. Start the conversation below."}
                      </p>
                    ) : (
                      <div className="space-y-3">
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
                              <p className="text-sm whitespace-pre-wrap">
                                {msg.content}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(msg.created_at).toLocaleString()}
                              </p>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Send Input */}
                  <div className="border-t border-gray-100 p-3">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder={locale === "zh" ? "输入消息...（回车发送，Shift+回车换行）" : "Type a message... (Enter to send, Shift+Enter for new line)"}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-10 resize-none border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
                        disabled={sending}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={sending || !newMessage.trim()}
                        className="self-end bg-blue-600 text-white hover:bg-blue-700"
                        size="icon"
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-gray-400">
                  {locale === "zh" ? "选择一个对话查看消息。" : "Select a conversation to view messages."}
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
