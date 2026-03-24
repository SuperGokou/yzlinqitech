"use client";

import { motion } from "framer-motion";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface BlogPost {
  date: string;
  tag: string;
  tagColor: string;
  title: string;
  excerpt: string;
  readTime: string;
}

const POSTS_ZH: BlogPost[] = [
  {
    date: "2025-03-15",
    tag: "AI",
    tagColor: "#b44aff",
    title: "DeepSeek + RAG：如何构建企业级 AI 客服系统",
    excerpt: "深入解析我们为客户构建 AI 客服的完整技术方案——从知识库搭建到向量检索，再到流式响应的工程实现。",
    readTime: "8 min",
  },
  {
    date: "2025-03-01",
    tag: "前端",
    tagColor: "#00e5ff",
    title: "Next.js 16 + Tailwind CSS 4：我们的技术选型思考",
    excerpt: "为什么我们选择 Next.js 16 App Router + Tailwind CSS 4 作为前端主力框架？从性能、DX 到 SEO 全方位分析。",
    readTime: "6 min",
  },
  {
    date: "2025-02-15",
    tag: "工程化",
    tagColor: "#3b82f6",
    title: "零员工公司的 AI 工作流：5 倍效率的秘密",
    excerpt: "公开我们的 AI 辅助开发流水线——从需求分析到代码生成、测试、部署，每一步如何用 AI 提效。",
    readTime: "10 min",
  },
  {
    date: "2025-02-01",
    tag: "案例",
    tagColor: "#f59e0b",
    title: "从 0 到上线：3 周交付企业级 SaaS 平台",
    excerpt: "复盘一个真实项目——如何在 3 周内完成需求分析、UI 设计、全栈开发和部署上线。",
    readTime: "7 min",
  },
  {
    date: "2025-01-15",
    tag: "小程序",
    tagColor: "#22c55e",
    title: "Taro 跨平台小程序开发实战：一套代码三端运行",
    excerpt: "使用 Taro 框架实现微信、支付宝、抖音三端小程序同步开发的最佳实践与踩坑指南。",
    readTime: "9 min",
  },
  {
    date: "2025-01-01",
    tag: "设计",
    tagColor: "#06b6d4",
    title: "暗色主题设计系统：从 Token 到组件库的搭建",
    excerpt: "分享我们如何构建一套完整的暗色主题设计系统——CSS 变量体系、Tailwind 配置与组件规范。",
    readTime: "5 min",
  },
];

const POSTS_EN: BlogPost[] = [
  {
    date: "2025-03-15",
    tag: "AI",
    tagColor: "#b44aff",
    title: "DeepSeek + RAG: Building Enterprise AI Customer Service",
    excerpt: "A deep dive into our complete technical approach for building AI customer service — from knowledge base construction to vector retrieval and streaming responses.",
    readTime: "8 min",
  },
  {
    date: "2025-03-01",
    tag: "Frontend",
    tagColor: "#00e5ff",
    title: "Next.js 16 + Tailwind CSS 4: Our Tech Stack Decision",
    excerpt: "Why we chose Next.js 16 App Router + Tailwind CSS 4 as our primary frontend framework. A comprehensive analysis covering performance, DX, and SEO.",
    readTime: "6 min",
  },
  {
    date: "2025-02-15",
    tag: "Engineering",
    tagColor: "#3b82f6",
    title: "Zero-Employee AI Workflow: The Secret to 5x Efficiency",
    excerpt: "An open look at our AI-assisted development pipeline — from requirements analysis to code generation, testing, and deployment.",
    readTime: "10 min",
  },
  {
    date: "2025-02-01",
    tag: "Case Study",
    tagColor: "#f59e0b",
    title: "Zero to Production: Enterprise SaaS in 3 Weeks",
    excerpt: "A retrospective on a real project — how we completed requirements, UI design, full-stack development, and deployment in just 3 weeks.",
    readTime: "7 min",
  },
  {
    date: "2025-01-15",
    tag: "Mini Programs",
    tagColor: "#22c55e",
    title: "Cross-Platform Mini Program Development with Taro",
    excerpt: "Best practices and lessons learned building WeChat, Alipay, and Douyin mini programs from a single codebase using Taro.",
    readTime: "9 min",
  },
  {
    date: "2025-01-01",
    tag: "Design",
    tagColor: "#06b6d4",
    title: "Dark Theme Design System: From Tokens to Components",
    excerpt: "How we built a complete dark theme design system — CSS variable architecture, Tailwind configuration, and component standards.",
    readTime: "5 min",
  },
];

function BlogContent() {
  const { locale } = useLocale();
  const posts = locale === "zh" ? POSTS_ZH : POSTS_EN;

  return (
    <>
      <Navbar />
      <main className="pt-20">
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
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <motion.article
                key={post.title}
                variants={fadeInUp}
                className="group relative rounded-xl border border-border-subtle bg-bg-secondary/20 hover:border-neon-cyan/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
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
              </motion.article>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function BlogPage() {
  return (
    <LocaleProvider>
      <BlogContent />
    </LocaleProvider>
  );
}
