"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Button } from "@/components/ui/button";

/* --- Animated counter card ------------------------------------------------ */

function AnimatedStatCard({
  numericTarget,
  suffix,
  label,
  duration = 2000,
}: {
  numericTarget: number;
  suffix: string;
  label: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const startAnimation = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericTarget));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [numericTarget, duration]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startAnimation]);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeInUp}
      className="group relative"
    >
      {/* Stat value */}
      <div className="flex items-baseline gap-1">
        <span
          className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#00e5ff] to-[#00b8d4] bg-clip-text text-transparent"
        >
          {count}
        </span>
        <span
          className="font-display text-xl md:text-2xl font-bold"
          style={{ color: "rgba(0, 229, 255, 0.6)" }}
        >
          {suffix}
        </span>
      </div>
      {/* Label */}
      <div
        className="mt-1 text-xs font-mono uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      {/* Underline accent */}
      <div
        className="mt-3 h-px w-8 group-hover:w-12 transition-all duration-500"
        style={{ backgroundColor: "rgba(0, 229, 255, 0.2)" }}
      />
    </motion.div>
  );
}

/* --- Dot grid background -------------------------------------------------- */

function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 229, 255, 0.07) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 30% 40%, black 20%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 30% 40%, black 20%, transparent 70%)",
      }}
    />
  );
}

/* --- Scroll indicator ----------------------------------------------------- */

function ScrollIndicator() {
  return (
    <motion.div
      className="hidden lg:flex flex-col items-center gap-3 absolute right-10 top-1/2 -translate-y-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-[0.25em] whitespace-nowrap"
        style={{
          color: "var(--text-muted)",
          writingMode: "vertical-rl",
        }}
      >
        Scroll
      </span>
      <div className="relative w-px h-16 overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}>
        <motion.div
          className="absolute top-0 left-0 w-full"
          style={{ backgroundColor: "#00e5ff", height: "40%" }}
          animate={{ y: ["0%", "150%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

/* --- Hero Section --------------------------------------------------------- */

export default function HeroSection() {
  const { t } = useLocale();

  const stats = [
    { numericTarget: 50, suffix: "+", label: t.hero.stats.projects },
    { numericTarget: 99, suffix: "%", label: t.hero.stats.satisfaction },
    { numericTarget: 24, suffix: "h", label: t.hero.stats.response },
    { numericTarget: 0, suffix: "", label: t.hero.stats.employees },
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-deep)" }}
    >
      {/* Dot grid */}
      <DotGrid />

      {/* Green glow behind title area */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "15%",
          left: "5%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(ellipse at center, rgba(0, 229, 255, 0.04) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* Secondary ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%",
          right: "15%",
          width: "35%",
          height: "35%",
          background: "radial-gradient(ellipse at center, rgba(0, 229, 255, 0.02) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-6xl w-full mx-auto px-6 pt-24 pb-12 lg:pt-28 lg:pb-20"
          >
            {/* Tag line */}
            <motion.div
              variants={fadeInUp}
              className="mb-6 lg:mb-8"
            >
              <span
                className="inline-flex items-center gap-3 text-sm md:text-base font-mono uppercase tracking-[0.2em]"
                style={{ color: "var(--text-muted)" }}
              >
                <span
                  className="inline-block w-8 h-px"
                  style={{ backgroundColor: "#00e5ff" }}
                />
                {t.hero.titleAccent}
              </span>
            </motion.div>

            {/* Main title -- gradient text effect */}
            <motion.h1
              variants={fadeInUp}
              className="font-display font-bold tracking-tight leading-[0.95] mb-8 lg:mb-10 max-w-5xl"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
              }}
            >
              <span className="bg-gradient-to-r from-white via-white to-[rgba(255,255,255,0.7)] bg-clip-text text-transparent">
                {t.hero.titleMain}
              </span>
              <span
                className="inline-block ml-[0.15em] w-[0.15em] h-[0.6em] -translate-y-[0.05em] animate-pulse"
                style={{ backgroundColor: "#00e5ff" }}
              />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-base md:text-lg leading-relaxed max-w-xl mb-8 lg:mb-10"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTA buttons -- using shadcn Button */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12 lg:mb-0"
            >
              {/* Primary CTA */}
              <a
                href="#chat-demo"
                onClick={(e) => { e.preventDefault(); document.getElementById("chat-demo")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <Button
                  className="inline-flex items-center gap-3 px-8 py-3.5 text-sm font-display font-bold tracking-wide rounded-md bg-[#00e5ff] text-[#050a15] hover:bg-[#33ecff] hover:shadow-[0_0_30px_rgba(0,229,255,0.3),0_0_60px_rgba(0,229,255,0.1)] transition-all duration-300 border-transparent"
                >
                  {t.hero.ctaPrimary}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M1 7h12M8 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </a>

              {/* Secondary CTA */}
              <a
                href="#portfolio"
                onClick={(e) => { e.preventDefault(); document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-3 px-8 py-3.5 text-sm font-display font-bold tracking-wide rounded-md text-[var(--text-secondary)] border-[rgba(255,255,255,0.1)] bg-transparent hover:border-[rgba(0,229,255,0.3)] hover:text-[#00e5ff] transition-all duration-300"
                >
                  {t.hero.ctaSecondary}
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar - pinned at bottom */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative z-10 border-t"
          style={{ borderColor: "rgba(255, 255, 255, 0.04)" }}
        >
          <div className="max-w-6xl mx-auto px-6 py-10 lg:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
              {stats.map((stat) => (
                <AnimatedStatCard
                  key={stat.label}
                  numericTarget={stat.numericTarget}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
