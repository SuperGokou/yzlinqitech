"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { getPostBySlug } from "@/lib/blog-data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

function ArticleContent({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const post = getPostBySlug(slug, locale);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <article className="relative py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              {/* Back link */}
              <motion.div variants={fadeInUp} className="mb-10">
                <a href="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-cyan transition-colors duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  {locale === "zh" ? "返回博客" : "Back to Blog"}
                </a>
              </motion.div>

              {/* Header */}
              <motion.div variants={fadeInUp} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[11px] font-mono px-2.5 py-1 rounded-full border"
                    style={{ color: post.tagColor, borderColor: post.tagColor + "40", backgroundColor: post.tagColor + "10" }}
                  >
                    {post.tag}
                  </span>
                  <span className="text-xs text-text-muted font-mono">{post.date}</span>
                  <span className="text-xs text-text-muted font-mono">{post.readTime}</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                  {post.title}
                </h1>
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeInUp} className="h-px bg-border-subtle mb-10" />

              {/* Content */}
              <motion.div variants={fadeInUp} className="space-y-5">
                {post.content.map((block, i) => {
                  // Heading
                  if (block.startsWith("## ")) {
                    return (
                      <h2 key={i} className="font-display text-xl md:text-2xl font-bold text-text-primary mt-10 mb-4">
                        {block.replace("## ", "")}
                      </h2>
                    );
                  }

                  // Code block
                  if (block.startsWith("```")) {
                    const lines = block.split("\n");
                    const code = lines.slice(1, -1).join("\n");
                    return (
                      <div key={i} className="rounded-xl overflow-hidden border border-border-subtle bg-bg-deep">
                        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border-subtle">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                          <span className="ml-2 text-[10px] font-mono text-text-muted">{lines[0].replace("```", "")}</span>
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm font-mono text-text-secondary leading-relaxed">
                          <code>{code}</code>
                        </pre>
                      </div>
                    );
                  }

                  // Table
                  if (block.includes("| ") && block.includes(" | ")) {
                    const rows = block.split("\n").filter((r) => r.trim() && !r.match(/^\|[\s-|]+\|$/));
                    const headers = rows[0]?.split("|").filter(Boolean).map((h) => h.trim()) ?? [];
                    const body = rows.slice(1).map((r) => r.split("|").filter(Boolean).map((c) => c.trim()));

                    return (
                      <div key={i} className="overflow-x-auto rounded-xl border border-border-subtle">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border-subtle bg-bg-secondary/30">
                              {headers.map((h, j) => (
                                <th key={j} className="px-4 py-2.5 text-left font-mono text-xs font-medium text-text-muted uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {body.map((row, ri) => (
                              <tr key={ri} className="border-b border-border-subtle/50 last:border-0">
                                {row.map((cell, ci) => (
                                  <td key={ci} className="px-4 py-2.5 text-text-secondary">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  // Bold text paragraph
                  if (block.startsWith("**")) {
                    const parts = block.split("\n");
                    return (
                      <div key={i} className="text-sm text-text-secondary leading-relaxed">
                        {parts.map((line, li) => {
                          const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)$/);
                          if (boldMatch) {
                            return (
                              <p key={li} className={li > 0 ? "mt-1" : ""}>
                                <strong className="text-text-primary font-semibold">{boldMatch[1]}</strong>
                                {boldMatch[2]}
                              </p>
                            );
                          }
                          return <p key={li} className={li > 0 ? "mt-1" : ""}>{line}</p>;
                        })}
                      </div>
                    );
                  }

                  // List items
                  if (block.startsWith("- ")) {
                    const items = block.split("\n").filter((l) => l.startsWith("- "));
                    return (
                      <ul key={i} className="space-y-2">
                        {items.map((item, li) => (
                          <li key={li} className="flex items-start gap-2.5 text-sm text-text-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40 mt-1.5 shrink-0" />
                            <span>{item.replace("- ", "")}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // Regular paragraph
                  return (
                    <p key={i} className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {block}
                    </p>
                  );
                })}
              </motion.div>

              {/* Footer */}
              <motion.div variants={fadeInUp} className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between">
                <a href="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-cyan transition-colors duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  {locale === "zh" ? "返回博客" : "Back to Blog"}
                </a>
                <a href="#chat-demo" className="inline-flex items-center gap-2 text-sm text-neon-cyan/70 hover:text-neon-cyan transition-colors duration-200">
                  {locale === "zh" ? "有问题？问 AI" : "Questions? Ask AI"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </article>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <LocaleProvider>
      <ArticleContent slug={slug} />
    </LocaleProvider>
  );
}
