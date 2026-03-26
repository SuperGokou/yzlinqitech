"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import type { Database } from "@/lib/supabase/types";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

/* ---- Slug-to-index mapping for icon selection ---- */

const SERVICE_SLUGS = [
  "web-development",
  "mini-programs",
  "game-development",
  "ai-custom",
  "industrial-software",
  "ui-ux-design",
  "data-visualization",
  "mobile-development",
] as const;

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

const GLOW_COLORS = [
  "rgba(0, 229, 255, 0.15)",
  "rgba(59, 130, 246, 0.15)",
  "rgba(180, 74, 255, 0.15)",
  "rgba(0, 229, 255, 0.15)",
  "rgba(180, 74, 255, 0.15)",
  "rgba(0, 229, 255, 0.15)",
  "rgba(59, 130, 246, 0.15)",
  "rgba(180, 74, 255, 0.15)",
];

/* ---- Service icons ---- */

function WebIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function MiniAppIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function GameIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <path d="M10 21h4" />
    </svg>
  );
}

function FactoryIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20V8l5 4V8l5 4V4h10v16H2z" />
      <path d="M17 8h.01M17 12h.01M17 16h.01" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="1" width="10" height="22" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
      <line x1="10" y1="5" x2="14" y2="5" />
    </svg>
  );
}

const SERVICE_ICONS = [WebIcon, MiniAppIcon, GameIcon, AIIcon, FactoryIcon, DesignIcon, ChartIcon, MobileIcon];

/* ---- Bilingual labels ---- */

const labels = {
  zh: {
    backToServices: "返回服务",
    features: "核心功能",
    techTags: "技术标签",
    ctaPrimary: "开始项目",
    ctaSecondary: "免费咨询",
    notFound: "未找到该服务",
    notFoundDesc: "请检查链接或返回首页浏览我们的服务。",
    backHome: "返回首页",
  },
  en: {
    backToServices: "Back to Services",
    features: "Core Features",
    techTags: "Tech Tags",
    ctaPrimary: "Start a Project",
    ctaSecondary: "Free Consultation",
    notFound: "Service Not Found",
    notFoundDesc: "Please check the URL or go back to browse our services.",
    backHome: "Back to Home",
  },
} as const;

/* ---- Props ---- */

interface ServiceDetailClientProps {
  service: ServiceRow | null;
  slug?: string;
}

/* ---- Component ---- */

export default function ServiceDetailClient({ service, slug }: ServiceDetailClientProps) {
  const { locale } = useLocale();
  const t = labels[locale];

  // Fallback: service not found or Supabase unavailable
  if (!service) {
    return (
      <div className="pt-20">
        <div className="relative py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] border border-border-subtle flex items-center justify-center text-text-muted mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h1 className="font-display text-3xl font-bold text-text-primary mb-4">
                  {t.notFound}
                </h1>
                <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto mb-8">
                  {t.notFoundDesc}
                  {slug && (
                    <span className="block mt-2 text-text-muted font-mono text-xs">
                      slug: {slug}
                    </span>
                  )}
                </p>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-display font-bold tracking-wide transition-all duration-300 text-[var(--bg-deep)] bg-[var(--neon-cyan)] hover:opacity-90"
                >
                  {t.backHome}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const slugIndex = SERVICE_SLUGS.indexOf(service.slug as typeof SERVICE_SLUGS[number]);
  const iconIndex = slugIndex >= 0 ? slugIndex : 0;
  const Icon = SERVICE_ICONS[iconIndex];
  const iconColor = ICON_COLORS[iconIndex];
  const glowColor = GLOW_COLORS[iconIndex];

  const title = locale === "zh" ? service.title_zh : service.title_en;
  const description = locale === "zh"
    ? (service.description_zh ?? "")
    : (service.description_en ?? "");
  const features = locale === "zh" ? service.features_zh : service.features_en;

  return (
    <div className="pt-20">
      <article className="relative py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            {/* Back link */}
            <motion.div variants={fadeInUp} className="mb-10">
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-cyan transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                {t.backToServices}
              </Link>
            </motion.div>

            {/* Icon + Title header */}
            <motion.div variants={fadeInUp} className="mb-10">
              <div className="flex items-start gap-5 mb-6">
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.04] border border-border-subtle ${iconColor} shrink-0`}
                  style={{ boxShadow: `0 0 30px ${glowColor}` }}
                >
                  <Icon />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-2">
                    {title}
                  </h1>
                  {service.icon && (
                    <span className="text-xs font-mono text-text-muted">
                      {service.icon}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {description && (
              <motion.div variants={fadeInUp} className="mb-10">
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  {description}
                </p>
              </motion.div>
            )}

            {/* Divider */}
            <motion.div variants={fadeInUp} className="h-px bg-border-subtle mb-10" />

            {/* Features */}
            {features.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-10">
                <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-6">
                  {t.features}
                </h2>
                <div className="space-y-4">
                  {features.map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-border-subtle/50 hover:border-border-subtle hover:bg-white/[0.04] transition-all duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-neon-cyan">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm text-text-secondary leading-relaxed">{feat}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {service.tags.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-12">
                <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">
                  {t.techTags}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono tracking-wide px-3 py-1.5 rounded-full bg-white/[0.04] text-text-secondary border border-border-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-display font-bold tracking-wide transition-all duration-300 text-[var(--bg-deep)] bg-[var(--neon-cyan)] hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,229,255,0.35)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {t.ctaPrimary}
              </Link>
              <a
                href="/#chat-demo"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-display font-bold tracking-wide border border-border-strong text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {t.ctaSecondary}
              </a>
            </motion.div>

            {/* Footer nav */}
            <motion.div
              variants={fadeInUp}
              viewport={viewportOnce}
              className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between"
            >
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-cyan transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                {t.backToServices}
              </Link>
              <Link
                href="/#chat-demo"
                className="inline-flex items-center gap-2 text-sm text-neon-cyan/70 hover:text-neon-cyan transition-colors duration-200"
              >
                {locale === "zh" ? "有问题？问 AI" : "Questions? Ask AI"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </article>
    </div>
  );
}
