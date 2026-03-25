"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { POSTS_ZH, POSTS_EN } from "@/lib/blog-data";

const VISIBLE_COUNT = 6;

export default function BlogPage() {
  const { locale } = useLocale();
  const posts = locale === "zh" ? POSTS_ZH : POSTS_EN;
  const [expanded, setExpanded] = useState(false);
  const visiblePosts = expanded ? posts : posts.slice(0, VISIBLE_COUNT);
  const hasMore = posts.length > VISIBLE_COUNT;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(180,74,255,0.05) 0%, transparent 70%)" }} />
        <div className="relative max-w-6xl mx-auto">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.p variants={fadeInUp} className="font-mono text-sm tracking-[0.2em] uppercase text-neon-purple/60 mb-4">// blog</motion.p>
            <motion.h1 variants={fadeInUp} className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-6">
              {locale === "zh" ? "技术博客" : "Engineering Blog"}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              {locale === "zh"
                ? "分享我们在 AI 驱动开发、前端工程化、系统架构方面的实战经验与深度思考。"
                : "Sharing our hands-on experience and deep insights in AI-driven development, frontend engineering, and system architecture."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence initial={false}>
              {visiblePosts.map((post) => (
                <motion.div
                  key={post.slug}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                  layout
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group relative rounded-xl border border-border-subtle bg-bg-secondary/20 hover:border-neon-cyan/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden block h-full"
                  >
                    {/* Color bar */}
                    <div className="h-1 w-full" style={{ backgroundColor: post.tagColor + "30" }} />

                    <div className="p-6 flex flex-col gap-4 h-full">
                      {/* Meta */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border" style={{ color: post.tagColor, borderColor: post.tagColor + "40", backgroundColor: post.tagColor + "10" }}>
                          {post.tag}
                        </span>
                        <span className="text-xs text-text-muted font-mono">{post.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-neon-cyan transition-colors duration-200 leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-text-secondary leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50">
                        <span className="text-xs text-text-muted font-mono">{post.readTime}</span>
                        <span className="text-xs text-text-muted group-hover:text-neon-cyan transition-colors duration-200 flex items-center gap-1">
                          {locale === "zh" ? "阅读全文" : "Read more"}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Expand / Collapse */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="group inline-flex items-center gap-2 px-8 py-3 text-sm font-display font-medium tracking-wide rounded-lg border border-border-subtle text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-300"
              >
                {expanded
                  ? (locale === "zh" ? "收起" : "Show Less")
                  : (locale === "zh" ? `查看全部 (${posts.length})` : `View All (${posts.length})`)}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
