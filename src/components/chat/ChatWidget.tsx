"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { springs } from "@/lib/motion";

/* ─── Types ───────────────────────────────────────────────────── */

type ChatState = "idle" | "open";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/* ─── Typing indicator ────────────────────────────────────────── */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-text-muted animate-typing-dot"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

/* ─── Session helper ──────────────────────────────────────────── */

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("lingqi_widget_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("lingqi_widget_session", id);
  }
  return id;
}

/* ─── Component ───────────────────────────────────────────────── */

export default function ChatWidget() {
  const { t, locale } = useLocale();
  const [state, setState] = useState<ChatState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initialized = useRef(false);

  /* Initialize greeting on first open */
  const openChat = useCallback(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMessages([{ role: "assistant", content: t.chat.greeting }]);
    }
    setState("open");
    setHasUnread(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [t.chat.greeting]);

  const closeChat = useCallback(() => {
    setState("idle");
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  /* Send message via SSE */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: Message = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setShowQuickReplies(false);
      setIsStreaming(true);

      /* Add placeholder assistant message */
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        abortRef.current = new AbortController();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            session_id: getSessionId(),
            context: { current_path: window.location.pathname },
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const dataStr = trimmed.slice(6);
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.done) {
                return;
              }
              if (data.token) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + data.token,
                    };
                  }
                  return updated;
                });
              }
            } catch {
              /* skip malformed JSON */
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant" && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: locale === "zh"
                ? "连接错误，请稍后重试。"
                : "Connection error. Please try again.",
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence mode="wait">
        {state === "idle" ? (
          /* ─── IDLE: Floating circle ──────────────────────────── */
          <motion.button
            key="idle"
            layoutId="chat-widget"
            onClick={openChat}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={springs.chat}
            whileHover={{
              scale: 1.12,
              boxShadow: "0 0 30px rgba(0, 229, 255, 0.5)",
            }}
            className="relative w-[60px] h-[60px] rounded-full border-2 border-neon-cyan/60 overflow-hidden animate-float shadow-glow-cyan-sm cursor-pointer group"
            aria-label={t.chat.tooltip}
          >
            <Image
              src="/logo.avif"
              alt="Chat"
              width={60}
              height={60}
              className="w-full h-full object-cover"
            />

            {/* Notification badge */}
            {hasUnread && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springs.bouncy}
                className="absolute top-0 right-0 w-3 h-3 bg-error rounded-full border border-bg-deep"
              />
            )}

            {/* Tooltip on hover */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-bg-elevated text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {t.chat.tooltip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-bg-elevated" />
            </span>
          </motion.button>
        ) : (
          /* ─── OPEN: Chat panel ───────────────────────────────── */
          <motion.div
            key="open"
            layoutId="chat-widget"
            transition={springs.chat}
            className="w-[calc(100vw-48px)] sm:w-[400px] h-[600px] max-h-[calc(100vh-48px)] rounded-2xl glass-strong border border-border-default flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle shrink-0">
              <Image
                src="/logo.avif"
                alt="软件加工厂 AI"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-display text-sm font-semibold text-text-primary flex-1">
                {t.chat.botName}
              </span>
              {/* Minimize */}
              <button
                onClick={closeChat}
                className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                aria-label="Minimize"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {/* Close */}
              <button
                onClick={closeChat}
                className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-error hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <Image
                      src="/logo.avif"
                      alt="Bot"
                      width={24}
                      height={24}
                      className="rounded-md mr-2 mt-1 shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent-gold/15 text-text-primary rounded-br-sm"
                        : "bg-bg-elevated text-text-primary rounded-bl-sm"
                    }`}
                  >
                    {msg.content || (
                      isStreaming && i === messages.length - 1 ? (
                        <TypingIndicator />
                      ) : null
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {showQuickReplies && messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {t.chat.quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    className="text-xs px-2.5 py-1 rounded-full border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 transition-colors duration-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-border-subtle flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chat.placeholder}
                className="flex-1 bg-bg-surface rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted border border-border-subtle focus:border-neon-cyan/40 focus:outline-none transition-colors"
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  input.trim() && !isStreaming
                    ? "bg-accent-gold text-bg-deep hover:shadow-glow-gold-sm"
                    : "bg-bg-surface text-text-muted cursor-not-allowed"
                }`}
                aria-label="Send"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            {/* Powered by footer */}
            <div className="text-center py-1.5 shrink-0">
              <span className="text-[10px] text-text-muted">
                {t.chat.poweredBy}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
