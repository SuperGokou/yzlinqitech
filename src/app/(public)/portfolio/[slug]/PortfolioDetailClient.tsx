"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import type { Database } from "@/lib/supabase/types";

type PortfolioRow = Database["public"]["Tables"]["portfolio_items"]["Row"];

/* ---- Bilingual labels ---- */

const labels = {
  zh: {
    backToPortfolio: "返回作品集",
    techStack: "技术栈",
    category: "类别",
    gallery: "项目截图",
    noImages: "暂无项目截图",
    noImagesDesc: "该项目的截图正在准备中。",
    notFound: "未找到该项目",
    notFoundDesc: "请检查链接或返回首页浏览我们的作品。",
    backHome: "返回首页",
    prevImage: "上一张",
    nextImage: "下一张",
  },
  en: {
    backToPortfolio: "Back to Portfolio",
    techStack: "Tech Stack",
    category: "Category",
    gallery: "Project Screenshots",
    noImages: "No screenshots available",
    noImagesDesc: "Screenshots for this project are being prepared.",
    notFound: "Project Not Found",
    notFoundDesc: "Please check the URL or go back to browse our portfolio.",
    backHome: "Back to Home",
    prevImage: "Previous",
    nextImage: "Next",
  },
} as const;

/* ---- Category badge color mapping ---- */

function getCategoryColor(category: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    web: { bg: "bg-neon-cyan/10", text: "text-neon-cyan", border: "border-neon-cyan/20" },
    miniapp: { bg: "bg-neon-blue/10", text: "text-neon-blue", border: "border-neon-blue/20" },
    game: { bg: "bg-neon-purple/10", text: "text-neon-purple", border: "border-neon-purple/20" },
    ai: { bg: "bg-[var(--accent-gold)]/10", text: "text-[var(--accent-gold)]", border: "border-[var(--accent-gold)]/20" },
    mobile: { bg: "bg-neon-cyan/10", text: "text-neon-cyan", border: "border-neon-cyan/20" },
  };
  return map[category.toLowerCase()] ?? { bg: "bg-white/[0.04]", text: "text-text-secondary", border: "border-border-subtle" };
}

/* ---- Props ---- */

interface PortfolioDetailClientProps {
  item: PortfolioRow | null;
  slug?: string;
}

/* ---- Component ---- */

export default function PortfolioDetailClient({ item, slug }: PortfolioDetailClientProps) {
  const { locale } = useLocale();
  const t = labels[locale];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fallback: item not found or Supabase unavailable
  if (!item) {
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
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
                  href="/#portfolio"
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

  const title = locale === "zh" ? item.title_zh : item.title_en;
  const description = locale === "zh"
    ? (item.description_zh ?? "")
    : (item.description_en ?? "");
  const categoryColors = getCategoryColor(item.category);
  const images = item.images;
  const hasImages = images.length > 0;

  function handlePrevImage() {
    setActiveImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  function handleNextImage() {
    setActiveImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <div className="pt-20">
      <article className="relative py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            {/* Back link */}
            <motion.div variants={fadeInUp} className="mb-10">
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-cyan transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                {t.backToPortfolio}
              </Link>
            </motion.div>

            {/* Title + category badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border}`}
                >
                  {item.category}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                {title}
              </h1>
            </motion.div>

            {/* Description */}
            {description && (
              <motion.div variants={fadeInUp} className="mb-10">
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  {description}
                </p>
              </motion.div>
            )}

            {/* Image gallery */}
            <motion.div variants={fadeInUp} className="mb-10">
              <h2 className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">
                // {t.gallery}
              </h2>

              {hasImages ? (
                <div className="space-y-4">
                  {/* Main image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-border-subtle bg-bg-secondary">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={images[activeImageIndex]}
                          alt={`${title} - ${activeImageIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 896px"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Nav arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-deep/70 backdrop-blur-sm border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white hover:bg-bg-deep/90 transition-all duration-200"
                          aria-label={t.prevImage}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-deep/70 backdrop-blur-sm border border-border-subtle flex items-center justify-center text-text-secondary hover:text-white hover:bg-bg-deep/90 transition-all duration-200"
                          aria-label={t.nextImage}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-bg-deep/70 backdrop-blur-sm border border-border-subtle text-[11px] font-mono text-text-muted">
                        {activeImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                            i === activeImageIndex
                              ? "border-neon-cyan/60 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                              : "border-border-subtle opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* No images placeholder */
                <div className="aspect-video rounded-xl border border-border-subtle border-dashed bg-white/[0.01] flex flex-col items-center justify-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted/40">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="text-sm text-text-muted">{t.noImages}</p>
                  <p className="text-xs text-text-muted/60">{t.noImagesDesc}</p>
                </div>
              )}
            </motion.div>

            {/* Tech stack */}
            {item.tech_stack.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-12">
                <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">
                  // {t.techStack}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono tracking-wide px-3 py-1.5 rounded-full bg-white/[0.04] text-text-secondary border border-border-subtle hover:border-neon-cyan/20 hover:text-text-primary transition-all duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Footer nav */}
            <motion.div
              variants={fadeInUp}
              viewport={viewportOnce}
              className="mt-16 pt-8 border-t border-border-subtle flex items-center justify-between"
            >
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-neon-cyan transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                {t.backToPortfolio}
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
