"use client";

import { useState, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/* --- Project data -------------------------------------------------------- */

type FilterCategory = "all" | "web" | "miniapp" | "game" | "ai";

interface Project {
  name: string;
  slug: string;
  filterKey: FilterCategory;
  tags: string[];
  gradientFrom: string;
  gradientTo: string;
}

const FILTER_KEYS: FilterCategory[] = ["all", "web", "miniapp", "game", "ai"];

const PROJECTS: Project[] = [
  {
    name: "\u667a\u6167\u7a0e\u52a1\u5e73\u53f0",
    slug: "smart-tax-platform",
    filterKey: "ai",
    tags: ["Next.js", "Python", "AI"],
    gradientFrom: "from-neon-purple/30",
    gradientTo: "to-neon-blue/20",
  },
  {
    name: "\u7f8e\u98df\u63a2\u5e97\u5c0f\u7a0b\u5e8f",
    slug: "food-explorer-miniapp",
    filterKey: "miniapp",
    tags: ["\u5fae\u4fe1", "React"],
    gradientFrom: "from-neon-cyan/30",
    gradientTo: "to-neon-blue/10",
  },
  {
    name: "\u4f01\u4e1a\u7ba1\u7406\u7cfb\u7edf",
    slug: "enterprise-management",
    filterKey: "web",
    tags: ["Vue", "Node.js"],
    gradientFrom: "from-neon-cyan/30",
    gradientTo: "to-neon-blue/20",
  },
  {
    name: "\u50cf\u7d20\u5192\u9669",
    slug: "pixel-adventure",
    filterKey: "game",
    tags: ["Unity", "C#"],
    gradientFrom: "from-neon-purple/20",
    gradientTo: "to-neon-blue/20",
  },
  {
    name: "AI \u5ba2\u670d\u52a9\u624b",
    slug: "ai-customer-assistant",
    filterKey: "ai",
    tags: ["DeepSeek", "RAG"],
    gradientFrom: "from-neon-blue/30",
    gradientTo: "to-neon-purple/20",
  },
  {
    name: "\u7535\u5546\u76f4\u64ad\u5e73\u53f0",
    slug: "ecommerce-livestream",
    filterKey: "web",
    tags: ["Next.js", "Stripe"],
    gradientFrom: "from-neon-cyan/20",
    gradientTo: "to-neon-blue/20",
  },
];

/* --- Decorative mesh patterns per project -------------------------------- */

const MESH_PATTERNS: Record<number, ReactNode> = {
  0: (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="mesh0a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="60" r="120" fill="url(#mesh0a)" />
      <circle cx="320" cy="220" r="90" fill="var(--neon-blue)" fillOpacity="0.15" />
      <path d="M0 200 Q100 120 200 180 T400 140" stroke="var(--neon-purple)" strokeOpacity="0.2" strokeWidth="1" fill="none" />
      <path d="M0 240 Q150 180 300 230 T400 200" stroke="var(--neon-cyan)" strokeOpacity="0.1" strokeWidth="1" fill="none" />
    </svg>
  ),
  1: (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
      <defs>
        <radialGradient id="mesh1a" cx="70%" cy="30%">
          <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" fill="url(#mesh1a)" />
      <circle cx="100" cy="250" r="60" fill="var(--neon-cyan)" fillOpacity="0.1" />
      <path d="M50 50 L350 50 L200 250 Z" stroke="var(--neon-cyan)" strokeOpacity="0.12" strokeWidth="1" fill="none" />
    </svg>
  ),
  2: (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
      <circle cx="200" cy="150" r="140" stroke="var(--neon-cyan)" strokeOpacity="0.15" strokeWidth="1" fill="none" />
      <circle cx="200" cy="150" r="100" stroke="var(--neon-cyan)" strokeOpacity="0.1" strokeWidth="1" fill="none" />
      <circle cx="200" cy="150" r="60" stroke="var(--neon-blue)" strokeOpacity="0.2" strokeWidth="1" fill="none" />
      <circle cx="200" cy="150" r="8" fill="var(--neon-cyan)" fillOpacity="0.3" />
      <line x1="60" y1="150" x2="340" y2="150" stroke="var(--neon-cyan)" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="200" y1="10" x2="200" y2="290" stroke="var(--neon-cyan)" strokeOpacity="0.06" strokeWidth="1" />
    </svg>
  ),
  3: (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 50 + 10}
            y={row * 50 + 10}
            width="8"
            height="8"
            rx="2"
            fill={(row + col) % 3 === 0 ? "var(--neon-cyan)" : "var(--neon-purple)"}
            fillOpacity={(row + col) % 3 === 0 ? 0.3 : 0.12}
          />
        ))
      )}
    </svg>
  ),
  4: (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="mesh4a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--neon-blue)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d="M0 150 C100 50, 200 250, 300 100 S400 200, 400 150" stroke="var(--neon-blue)" strokeOpacity="0.25" strokeWidth="2" fill="none" />
      <path d="M0 180 C80 80, 220 280, 320 130 S400 230, 400 180" stroke="var(--neon-purple)" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
      <circle cx="300" cy="80" r="50" fill="url(#mesh4a)" />
    </svg>
  ),
  5: (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
      <defs>
        <radialGradient id="mesh5a" cx="30%" cy="40%">
          <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" fill="url(#mesh5a)" />
      <path d="M40 260 L180 40 L320 260 Z" stroke="var(--neon-purple)" strokeOpacity="0.15" strokeWidth="1" fill="none" />
      <path d="M80 260 L200 70 L320 260" stroke="var(--neon-cyan)" strokeOpacity="0.08" strokeWidth="1" fill="none" />
    </svg>
  ),
};

/* --- Component ----------------------------------------------------------- */

const INITIAL_VISIBLE = 4;

export default function PortfolioSection() {
  const { t, locale } = useLocale();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.filterKey === activeFilter);
  }, [activeFilter]);

  const visibleItems = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hasMore = filtered.length > INITIAL_VISIBLE;

  // Map filter keys to localized labels
  const filterLabels: Record<FilterCategory, string> = useMemo(() => {
    const labels = t.portfolio.filters;
    return {
      all: labels[0],
      web: labels[1],
      miniapp: labels[2],
      game: labels[3],
      ai: labels[4],
    };
  }, [t.portfolio.filters]);

  return (
    <section id="portfolio" className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-neon-purple/[0.03] blur-[120px]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-neon-cyan/60 mb-4">
            // Portfolio
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary">
            {t.portfolio.title}
          </h2>
        </motion.div>

        {/* Filter tabs -- shadcn Tabs */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex items-center justify-center mb-14"
        >
          <Tabs
            defaultValue="all"
            onValueChange={(val: unknown) => {
              setActiveFilter(val as FilterCategory);
              setExpanded(false);
            }}
            className="flex-col items-center"
          >
            <TabsList className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)]/60 backdrop-blur-sm border border-[var(--border-subtle)] p-1 h-auto">
              {FILTER_KEYS.map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200 data-active:bg-neon-cyan data-active:text-[var(--bg-deep)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {filterLabels[key]}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Render all tab content panels (each shows the same grid, filtered differently) */}
            {FILTER_KEYS.map((key) => (
              <TabsContent key={key} value={key} className="w-full" />
            ))}
          </Tabs>
        </motion.div>

        {/* Project grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((project, i) => {
              const globalIndex = PROJECTS.indexOf(project);
              return (
                <motion.div
                  key={project.name}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.97 }}
                  transition={{
                    duration: 0.4,
                    delay: i >= INITIAL_VISIBLE ? (i - INITIAL_VISIBLE) * 0.08 : 0,
                    ease: [0.25, 0.8, 0.25, 1],
                  }}
                  className="group"
                >
                  <Link href={`/portfolio/${project.slug}`} className="block cursor-pointer">
                    <div className="relative rounded-2xl overflow-hidden border border-border-subtle bg-bg-secondary/50 backdrop-blur-sm transition-all duration-500 hover:border-neon-cyan/25 hover:shadow-[0_0_30px_rgba(0,229,255,0.08),0_8px_32px_rgba(0,0,0,0.3)]">
                      {/* Gradient hero area */}
                      <div
                        className={`relative h-56 md:h-64 bg-gradient-to-br ${project.gradientFrom} ${project.gradientTo} overflow-hidden`}
                      >
                        {/* Decorative mesh SVG */}
                        {MESH_PATTERNS[globalIndex % 6]}

                        {/* Grid overlay for texture */}
                        <div
                          className="absolute inset-0 opacity-[0.04]"
                          style={{
                            backgroundImage:
                              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                          }}
                        />

                        {/* Project name centered in hero */}
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <span className="font-display text-xl md:text-2xl font-bold text-text-primary/90 text-center drop-shadow-lg tracking-wide">
                            {project.name}
                          </span>
                        </div>

                        {/* Hover overlay with "View Details" */}
                        <div className="absolute inset-0 bg-bg-deep/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                          <motion.span
                            initial={false}
                            className="flex items-center gap-2 text-sm font-medium text-neon-cyan tracking-wide"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>{locale === "zh" ? "查看详情" : "View Details"}</span>
                          </motion.span>
                        </div>

                        {/* Subtle bottom fade into card body */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-secondary/80 to-transparent" />
                      </div>

                      {/* Card body */}
                      <div className="relative px-6 py-5 bg-bg-secondary/40">
                        <h3 className="font-display text-base font-semibold text-text-primary mb-3 tracking-wide group-hover:text-neon-cyan transition-colors duration-300">
                          {project.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-text-secondary border border-border-subtle font-mono tracking-wide"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover border glow line at top */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Expand / Collapse */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="group/btn flex items-center gap-2.5 px-7 py-3 rounded-full border border-border-strong/60 text-text-secondary bg-bg-elevated/40 backdrop-blur-sm hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/[0.04] transition-all duration-300"
            >
              <span className="text-sm font-medium tracking-wide">
                {expanded
                  ? locale === "zh"
                    ? "\u6536\u8d77\u4f5c\u54c1"
                    : "Show Less"
                  : locale === "zh"
                    ? `\u67e5\u770b\u5168\u90e8 ${filtered.length} \u4e2a\u4f5c\u54c1`
                    : `View All ${filtered.length} Projects`}
              </span>
              <motion.svg
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
