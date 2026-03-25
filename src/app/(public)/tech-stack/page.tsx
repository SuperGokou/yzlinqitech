"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface TechItem {
  name: string;
  icon: string;
  desc: string;
  color: string;
}

interface TechCategory {
  label: string;
  title: string;
  items: TechItem[];
}

const CATEGORIES_ZH: TechCategory[] = [
  {
    label: "frontend",
    title: "前端",
    items: [
      { name: "Next.js 16", icon: "/images/tech/nextjs.svg", desc: "React 全栈框架，App Router + SSR/SSG + API Routes", color: "#ffffff" },
      { name: "React 19", icon: "/images/tech/react.svg", desc: "组件化 UI 库，Server Components + Hooks 生态", color: "#61dafb" },
      { name: "TypeScript 5.9", icon: "/images/tech/typescript.svg", desc: "类型安全的 JavaScript 超集，提升代码可靠性", color: "#3178c6" },
      { name: "Tailwind CSS 4", icon: "/images/tech/tailwindcss.svg", desc: "原子化 CSS 框架，CSS-in-JS 级别的灵活性 + 零运行时", color: "#06b6d4" },
      { name: "Framer Motion", icon: "/images/tech/framer.svg", desc: "声明式动画库，流畅的页面过渡和交互动效", color: "#00e5ff" },
      { name: "Vue.js", icon: "/images/tech/vuejs.svg", desc: "渐进式框架，适用于小程序跨端和轻量项目", color: "#42b883" },
    ],
  },
  {
    label: "backend",
    title: "后端",
    items: [
      { name: "Node.js", icon: "/images/tech/nodejs.svg", desc: "JavaScript 服务端运行时，高并发事件驱动", color: "#339933" },
      { name: "Python", icon: "/images/tech/python.svg", desc: "AI/ML 首选语言，丰富的数据处理和 AI 框架生态", color: "#3776ab" },
      { name: "FastAPI", icon: "/images/tech/fastapi.svg", desc: "高性能 Python Web 框架，自动生成 API 文档", color: "#009688" },
      { name: "PostgreSQL", icon: "/images/tech/postgresql.svg", desc: "企业级关系数据库，JSONB + 全文搜索 + 向量扩展", color: "#336791" },
      { name: "Redis", icon: "/images/tech/redis.svg", desc: "内存缓存和消息队列，会话管理和实时数据", color: "#dc382d" },
      { name: "Docker", icon: "/images/tech/docker.svg", desc: "容器化部署，保证开发/测试/生产环境一致性", color: "#2496ed" },
    ],
  },
  {
    label: "ai",
    title: "AI / 智能化",
    items: [
      { name: "DeepSeek API", icon: "", desc: "高性价比大模型 API，OpenAI 兼容协议，支持流式响应", color: "#b44aff" },
      { name: "RAG 检索增强", icon: "", desc: "基于关键词/向量的知识库检索，让 AI 精准回答业务问题", color: "#f59e0b" },
      { name: "LangChain", icon: "", desc: "LLM 应用框架，工具调用、多轮对话、Agent 编排", color: "#22c55e" },
      { name: "ChromaDB", icon: "", desc: "轻量级向量数据库，适合中小规模 RAG 知识库", color: "#ff6f00" },
      { name: "Prompt Engineering", icon: "", desc: "系统化的提示词工程，精确控制 AI 输出质量", color: "#ec4899" },
      { name: "SSE 流式传输", icon: "", desc: "Server-Sent Events 实现逐字输出，打字机效果实时响应", color: "#00e5ff" },
    ],
  },
  {
    label: "devops",
    title: "部署 / DevOps",
    items: [
      { name: "Vercel", icon: "/images/tech/vercel.svg", desc: "Next.js 官方托管平台，全球 CDN + 边缘函数", color: "#ffffff" },
      { name: "GitHub Actions", icon: "", desc: "CI/CD 自动化，代码推送即触发构建和部署", color: "#2088ff" },
      { name: "Cloudflare", icon: "", desc: "DNS + CDN + DDoS 防护 + 边缘计算", color: "#f38020" },
      { name: "Nginx", icon: "", desc: "高性能反向代理和负载均衡服务器", color: "#009639" },
    ],
  },
  {
    label: "tools",
    title: "设计 / 工具",
    items: [
      { name: "Figma", icon: "", desc: "协作式 UI 设计工具，设计系统和原型", color: "#a259ff" },
      { name: "ECharts", icon: "", desc: "百度开源数据可视化图表库，大屏和 BI 场景", color: "#e43961" },
      { name: "Three.js", icon: "", desc: "WebGL 3D 渲染引擎，数据可视化和互动体验", color: "#049ef4" },
      { name: "Cocos Creator", icon: "", desc: "跨平台游戏引擎，H5/微信小游戏开发", color: "#00ccff" },
      { name: "Unity", icon: "/images/tech/unity.svg", desc: "3D 游戏引擎，WebGL 导出支持浏览器运行", color: "#ffffff" },
    ],
  },
];

const CATEGORIES_EN: TechCategory[] = [
  {
    label: "frontend",
    title: "Frontend",
    items: [
      { name: "Next.js 16", icon: "/images/tech/nextjs.svg", desc: "React full-stack framework with App Router, SSR/SSG, and API Routes", color: "#ffffff" },
      { name: "React 19", icon: "/images/tech/react.svg", desc: "Component-based UI library with Server Components and Hooks ecosystem", color: "#61dafb" },
      { name: "TypeScript 5.9", icon: "/images/tech/typescript.svg", desc: "Type-safe JavaScript superset for reliable, maintainable code", color: "#3178c6" },
      { name: "Tailwind CSS 4", icon: "/images/tech/tailwindcss.svg", desc: "Utility-first CSS framework with zero-runtime and CSS-in-JS flexibility", color: "#06b6d4" },
      { name: "Framer Motion", icon: "/images/tech/framer.svg", desc: "Declarative animation library for smooth transitions and interactions", color: "#00e5ff" },
      { name: "Vue.js", icon: "/images/tech/vuejs.svg", desc: "Progressive framework for mini programs and lightweight projects", color: "#42b883" },
    ],
  },
  {
    label: "backend",
    title: "Backend",
    items: [
      { name: "Node.js", icon: "/images/tech/nodejs.svg", desc: "JavaScript runtime for high-concurrency event-driven servers", color: "#339933" },
      { name: "Python", icon: "/images/tech/python.svg", desc: "Primary language for AI/ML with rich data processing ecosystems", color: "#3776ab" },
      { name: "FastAPI", icon: "/images/tech/fastapi.svg", desc: "High-performance Python web framework with auto-generated API docs", color: "#009688" },
      { name: "PostgreSQL", icon: "/images/tech/postgresql.svg", desc: "Enterprise relational database with JSONB, full-text search, and vector extensions", color: "#336791" },
      { name: "Redis", icon: "/images/tech/redis.svg", desc: "In-memory cache and message queue for sessions and real-time data", color: "#dc382d" },
      { name: "Docker", icon: "/images/tech/docker.svg", desc: "Containerized deployment ensuring dev/staging/production consistency", color: "#2496ed" },
    ],
  },
  {
    label: "ai",
    title: "AI / Intelligence",
    items: [
      { name: "DeepSeek API", icon: "", desc: "Cost-effective LLM API with OpenAI-compatible protocol and streaming", color: "#b44aff" },
      { name: "RAG Retrieval", icon: "", desc: "Keyword/vector knowledge retrieval for precise domain-specific Q&A", color: "#f59e0b" },
      { name: "LangChain", icon: "", desc: "LLM application framework for tool calling, multi-turn dialogue, and Agents", color: "#22c55e" },
      { name: "ChromaDB", icon: "", desc: "Lightweight vector database for small-to-medium RAG knowledge bases", color: "#ff6f00" },
      { name: "Prompt Engineering", icon: "", desc: "Systematic prompt design for precise control over AI output quality", color: "#ec4899" },
      { name: "SSE Streaming", icon: "", desc: "Server-Sent Events for real-time token-by-token typewriter responses", color: "#00e5ff" },
    ],
  },
  {
    label: "devops",
    title: "Deploy / DevOps",
    items: [
      { name: "Vercel", icon: "/images/tech/vercel.svg", desc: "Official Next.js hosting with global CDN and edge functions", color: "#ffffff" },
      { name: "GitHub Actions", icon: "", desc: "CI/CD automation triggered on every push", color: "#2088ff" },
      { name: "Cloudflare", icon: "", desc: "DNS + CDN + DDoS protection + edge computing", color: "#f38020" },
      { name: "Nginx", icon: "", desc: "High-performance reverse proxy and load balancer", color: "#009639" },
    ],
  },
  {
    label: "tools",
    title: "Design / Tools",
    items: [
      { name: "Figma", icon: "", desc: "Collaborative UI design tool for design systems and prototypes", color: "#a259ff" },
      { name: "ECharts", icon: "", desc: "Baidu open-source chart library for dashboards and BI", color: "#e43961" },
      { name: "Three.js", icon: "", desc: "WebGL 3D rendering engine for data viz and interactive experiences", color: "#049ef4" },
      { name: "Cocos Creator", icon: "", desc: "Cross-platform game engine for H5 and WeChat mini games", color: "#00ccff" },
      { name: "Unity", icon: "/images/tech/unity.svg", desc: "3D game engine with WebGL export for browser deployment", color: "#ffffff" },
    ],
  },
];

export default function TechStackPage() {
  const { locale } = useLocale();
  const categories = locale === "zh" ? CATEGORIES_ZH : CATEGORIES_EN;

  return (
    <div className="pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-28 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%)" }} />
          <div className="relative max-w-6xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.p variants={fadeInUp} className="font-mono text-sm tracking-[0.2em] uppercase text-neon-cyan/60 mb-4">// tech stack</motion.p>
              <motion.h1 variants={fadeInUp} className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-6">
                {locale === "zh" ? "技术栈" : "Tech Stack"}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                {locale === "zh"
                  ? "我们精选行业最佳技术组合，从前端渲染到 AI 推理、从数据库到部署，每一层都经过生产验证。"
                  : "A curated selection of industry-best technologies. From frontend rendering to AI inference, databases to deployment — every layer is production-proven."}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        {categories.map((cat) => (
          <section key={cat.label} className="py-12 md:py-16 px-6 border-t border-border-subtle">
            <div className="max-w-6xl mx-auto">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-8">
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-purple mb-2">// {cat.label}</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">{cat.title}</h2>
              </motion.div>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={fadeInUp}
                    className="group p-5 rounded-xl border border-border-subtle bg-bg-secondary/20 hover:border-border-default hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {item.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.icon} alt="" width={22} height={22} className="shrink-0" />
                      ) : (
                        <span className="w-[22px] h-[22px] rounded flex items-center justify-center text-[9px] font-mono font-bold shrink-0" style={{ backgroundColor: item.color + "20", color: item.color }}>
                          {item.name.slice(0, 2)}
                        </span>
                      )}
                      <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-neon-cyan transition-colors duration-200">{item.name}</h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        ))}
    </div>
  );
}
