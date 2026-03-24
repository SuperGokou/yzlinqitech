"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import {
  fadeInUp,
  staggerContainer,
  hoverGlow,
  viewportOnce,
} from "@/lib/motion";

/* ---- Service icons (inline SVG) --------------------------------------- */

function WebIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function MiniAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function GameIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <path d="M10 21h4" />
    </svg>
  );
}

function FactoryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20V8l5 4V8l5 4V4h10v16H2z" />
      <path d="M17 8h.01M17 12h.01M17 16h.01" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="1" width="10" height="22" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
      <line x1="10" y1="5" x2="14" y2="5" />
    </svg>
  );
}

const SERVICE_ICONS = [WebIcon, MiniAppIcon, GameIcon, AIIcon, FactoryIcon, DesignIcon, ChartIcon, MobileIcon];

const ICON_COLORS = [
  "text-neon-cyan",
  "text-neon-blue",
  "text-neon-purple",
  "text-neon-cyan",
  "text-neon-purple",
  "text-neon-cyan",
  "text-neon-blue",
  "text-neon-purple",
];

const GLOW_BORDERS = [
  "hover:border-t-[var(--neon-cyan)] hover:shadow-[0_-2px_24px_rgba(0,229,255,0.25)]",
  "hover:border-t-[var(--neon-blue)] hover:shadow-[0_-2px_24px_rgba(59,130,246,0.25)]",
  "hover:border-t-[var(--neon-purple)] hover:shadow-[0_-2px_24px_rgba(180,74,255,0.25)]",
  "hover:border-t-[var(--neon-cyan)] hover:shadow-[0_-2px_24px_rgba(0,229,255,0.25)]",
  "hover:border-t-[var(--neon-purple)] hover:shadow-[0_-2px_24px_rgba(180,74,255,0.25)]",
  "hover:border-t-[var(--neon-cyan)] hover:shadow-[0_-2px_24px_rgba(0,229,255,0.25)]",
  "hover:border-t-[var(--neon-blue)] hover:shadow-[0_-2px_24px_rgba(59,130,246,0.25)]",
  "hover:border-t-[var(--neon-purple)] hover:shadow-[0_-2px_24px_rgba(180,74,255,0.25)]",
];

const NUMBER_COLORS = [
  "text-neon-cyan/20",
  "text-neon-blue/20",
  "text-neon-purple/20",
  "text-neon-cyan/20",
  "text-neon-purple/20",
  "text-neon-cyan/20",
  "text-neon-blue/20",
  "text-neon-purple/20",
];

/* Default: show first 4, expand to show all */
const INITIAL_VISIBLE = 4;

/**
 * Returns the asymmetric grid span class for each card index.
 * Pattern:  wide  narrow  narrow  wide  wide  narrow  narrow  wide ...
 * "wide" = md:col-span-2, "narrow" = md:col-span-1
 * This creates a repeating 2+1 / 1+2 row rhythm on a 3-col grid.
 */
function getSpanClass(index: number): string {
  const pattern = index % 4;
  // 0: wide, 1: narrow, 2: narrow, 3: wide
  return pattern === 0 || pattern === 3 ? "md:col-span-2" : "md:col-span-1";
}

/* ---- Detail Modal ----------------------------------------------------- */

function ServiceModal({
  service,
  index,
  onClose,
}: {
  service: { title: string; desc: string; tags: string[]; detail: string; features: string[] };
  index: number;
  onClose: () => void;
}) {
  const { locale } = useLocale();
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
  const iconColor = ICON_COLORS[index % ICON_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border-subtle bg-bg-secondary/95 backdrop-blur-xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 px-6 pt-6 pb-4 bg-bg-secondary/95 backdrop-blur-xl border-b border-border-subtle/50">
          <div className={`flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.06] border border-border-subtle ${iconColor}`}>
            <Icon />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold text-text-primary">{service.title}</h3>
            <p className="text-sm text-text-muted">{service.desc}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Detail paragraph */}
          <p className="text-sm text-text-secondary leading-relaxed">{service.detail}</p>

          {/* Features list */}
          <div className="space-y-2.5">
            {service.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-neon-cyan">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-text-secondary">{feat}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {service.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full bg-white/[0.04] text-text-muted border border-border-subtle">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6 pt-2">
          <a
            href="#chat-demo"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-display font-bold tracking-wide transition-all duration-300"
            style={{ color: "#050a15", backgroundColor: "#00e5ff" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{locale === "zh" ? "立即咨询" : "Get Started"}</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---- Component -------------------------------------------------------- */

export default function ServicesSection() {
  const { t, locale } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const visibleItems = expanded
    ? t.services.items
    : t.services.items.slice(0, INITIAL_VISIBLE);

  return (
    <section id="services" className="relative py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label + title */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-cyan mb-4">
            // capabilities
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary leading-tight">
            {t.services.title}
          </h2>
        </motion.div>

        {/* Asymmetric grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map((service, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              const iconColor = ICON_COLORS[i % ICON_COLORS.length];
              const glowBorder = GLOW_BORDERS[i % GLOW_BORDERS.length];
              const numColor = NUMBER_COLORS[i % NUMBER_COLORS.length];
              const spanClass = getSpanClass(i);
              const num = String(i + 1).padStart(2, "0");

              return (
                <motion.div
                  key={service.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.4,
                    delay: i >= INITIAL_VISIBLE ? (i - INITIAL_VISIBLE) * 0.08 : 0,
                  }}
                  {...hoverGlow}
                  className={`
                    ${spanClass}
                    group relative rounded-xl overflow-hidden cursor-pointer
                    bg-[var(--bg-glass)] backdrop-blur-md
                    border border-border-subtle border-t-2 border-t-transparent
                    transition-all duration-300
                    hover:-translate-y-1
                    ${glowBorder}
                  `}
                >
                  <div className="relative p-6 lg:p-8 flex flex-col gap-5 h-full">
                    {/* Top row: number + icon */}
                    <div className="flex items-start justify-between">
                      <span className={`font-mono text-4xl lg:text-5xl font-extrabold ${numColor} select-none leading-none`}>
                        {num}
                      </span>
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-lg bg-white/[0.04] border border-border-subtle ${iconColor} transition-colors duration-300 group-hover:border-white/10`}
                      >
                        <Icon />
                      </div>
                    </div>

                    {/* Title + description */}
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-2 group-hover:text-white transition-colors duration-200">
                        {service.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full bg-white/[0.04] text-text-secondary border border-border-subtle transition-colors duration-200 group-hover:border-white/10 group-hover:text-text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Learn more */}
                    <button
                      onClick={() => setSelectedService(i)}
                      className="flex items-center gap-2 mt-auto"
                    >
                      <span className="text-sm text-text-muted group-hover:text-neon-cyan transition-colors duration-200">
                        {t.services.learnMore}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-text-muted group-hover:text-neon-cyan group-hover:translate-x-1 transition-all duration-200"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                    {/* Hover glow line at top (faux border glow overlay) */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/0 to-transparent group-hover:via-neon-cyan/60 transition-all duration-500" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Expand / Collapse button */}
        {t.services.items.length > INITIAL_VISIBLE && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            className="flex justify-center mt-14"
          >
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="group flex items-center gap-3 px-7 py-3.5 rounded-lg border border-border-strong bg-white/[0.02] text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <span className="font-mono text-sm tracking-wide">
                {expanded
                  ? locale === "zh"
                    ? "收起服务"
                    : "Show Less"
                  : locale === "zh"
                    ? `查看全部 ${t.services.items.length} 项服务`
                    : `View All ${t.services.items.length} Services`}
              </span>
              <motion.svg
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>
          </motion.div>
        )}
      </div>

      {/* Service detail modal */}
      <AnimatePresence>
        {selectedService !== null && (
          <ServiceModal
            service={t.services.items[selectedService]}
            index={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
