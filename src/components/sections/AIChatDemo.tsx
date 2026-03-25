"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

/* --- Types --------------------------------------------------------------- */

interface Message {
  role: "user" | "assistant";
  content: string;
}

/* --- Typing indicator ---------------------------------------------------- */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[6px] h-[6px] rounded-full bg-neon-cyan/60 animate-typing-dot"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

/* --- Component ----------------------------------------------------------- */

export default function AIChatDemo() {
  const { t, locale } = useLocale();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        locale === "zh"
          ? "\u4f60\u597d\uff01\u6211\u662f\u8f6f\u4ef6\u52a0\u5de5\u5382 AI \u52a9\u624b\u3002\u544a\u8bc9\u6211\u4f60\u60f3\u505a\u4ec0\u4e48\u9879\u76ee\uff0c\u6211\u6765\u5e2e\u4f60\u5206\u6790\u548c\u62a5\u4ef7\u3002"
          : "Hello! I'm the Software Factory AI assistant. Tell me about your project, and I'll help analyze it.",
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  /* Auto-scroll chat messages to bottom (within container only) */
  useEffect(() => {
    const el = messagesEndRef.current?.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  /* Send message via SSE to /api/chat */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: Message = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setShowQuickReplies(false);
      setIsStreaming(true);

      /* Add empty assistant message for streaming */
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
        /* On error, show fallback in the streaming message */
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant" && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content:
                locale === "zh"
                  ? "\u62b1\u6b49\uff0c\u6682\u65f6\u65e0\u6cd5\u8fde\u63a5\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002"
                  : "Sorry, unable to connect right now. Please try again later.",
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, locale]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const isActive = input.trim().length > 0 && !isStreaming;

  return (
    <section id="chat-demo" className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-neon-cyan/[0.025] blur-[100px]" />

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-14"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-neon-cyan/60 mb-4"
          >
            // AI Chat
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-3xl md:text-5xl font-bold mb-5 text-text-primary"
          >
            {t.chatDemo.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            {t.chatDemo.subtitle}
          </motion.p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border-default/60 bg-bg-secondary/60 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] flex flex-col h-[420px] md:h-[520px]">
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

            {/* Header */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-b border-border-subtle/60">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-border-subtle/60">
                  <Image
                    src="/logo.avif"
                    alt="AI Assistant"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-bg-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-semibold text-text-primary leading-tight">
                  {t.chatDemo.botName}
                </span>
                <span className="text-[11px] text-success font-medium mt-0.5">
                  Online
                </span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
                    className={`flex items-start ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg overflow-hidden mr-2.5 mt-1 shrink-0 ring-1 ring-border-subtle/40">
                        <Image
                          src="/logo.avif"
                          alt="Bot"
                          width={28}
                          height={28}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-neon-cyan/[0.08] text-text-primary rounded-2xl rounded-br-md border border-neon-cyan/[0.06]"
                          : "bg-bg-elevated/70 text-text-primary rounded-2xl rounded-bl-md border border-border-subtle/40"
                      }`}
                    >
                      {msg.content || (
                        msg.role === "assistant" &&
                        i === messages.length - 1 &&
                        isStreaming && <TypingIndicator />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Standalone typing indicator when last message is empty and streaming */}
              {isStreaming &&
                messages[messages.length - 1]?.role === "assistant" &&
                messages[messages.length - 1]?.content === "" &&
                !(messages.length > 0) && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-lg overflow-hidden mr-2.5 mt-1 shrink-0 ring-1 ring-border-subtle/40">
                      <Image
                        src="/logo.avif"
                        alt="Bot"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-bg-elevated/70 rounded-2xl rounded-bl-md border border-border-subtle/40 px-4 py-3">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <AnimatePresence>
              {showQuickReplies && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-3 flex flex-wrap gap-2"
                >
                  {t.chatDemo.quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="text-xs px-4 py-2 rounded-full border border-neon-cyan/20 text-neon-cyan/80 bg-neon-cyan/[0.04] hover:bg-neon-cyan/[0.1] hover:border-neon-cyan/40 hover:text-neon-cyan transition-all duration-200 font-medium"
                    >
                      {reply}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-4 py-3.5 border-t border-border-subtle/60 bg-bg-elevated/30"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chatDemo.placeholder}
                className="flex-1 bg-bg-surface/60 rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 border border-border-subtle/60 focus:border-neon-cyan/30 focus:bg-bg-surface/80 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.06)] focus:outline-none transition-all duration-250"
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={!isActive}
                className={`relative p-2.5 rounded-xl transition-all duration-250 ${
                  isActive
                    ? "bg-neon-cyan text-bg-deep shadow-[0_0_16px_rgba(0,229,255,0.25)] hover:shadow-[0_0_24px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95"
                    : "bg-bg-surface/60 text-text-muted/40 cursor-not-allowed"
                }`}
                aria-label="Send"
              >
                <svg
                  width="18"
                  height="18"
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
          </div>

          {/* Powered by line */}
          <p className="text-center text-[11px] text-text-muted/50 mt-4 font-mono tracking-wider">
            Powered by DeepSeek
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* --- Session helper ------------------------------------------------------ */

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("lingqi_chat_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("lingqi_chat_session", id);
  }
  return id;
}
