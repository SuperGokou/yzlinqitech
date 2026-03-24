"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

/* ---- Step icons (inline SVG) ----------------------------------------- */

function ChatIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-neon-cyan"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-neon-purple"
    >
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <path d="M10 21h4" />
      <path d="M12 2v4" />
      <path d="M8 9h8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-neon-purple"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-neon-cyan"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const STEP_ICONS = [ChatIcon, BrainIcon, CheckIcon, RocketIcon];

const STEP_ACCENT_COLORS = [
  { border: "group-hover:border-t-neon-cyan", glow: "group-hover:shadow-[0_-2px_20px_rgba(0,229,255,0.3)]", number: "text-neon-cyan" },
  { border: "group-hover:border-t-neon-purple", glow: "group-hover:shadow-[0_-2px_20px_rgba(180,74,255,0.3)]", number: "text-neon-purple" },
  { border: "group-hover:border-t-neon-purple", glow: "group-hover:shadow-[0_-2px_20px_rgba(180,74,255,0.3)]", number: "text-neon-purple" },
  { border: "group-hover:border-t-neon-cyan", glow: "group-hover:shadow-[0_-2px_20px_rgba(0,229,255,0.3)]", number: "text-neon-blue" },
];

/* ---- Component -------------------------------------------------------- */

export default function HowItWorks() {
  const { t } = useLocale();

  return (
    <section id="how-it-works" className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section label + title */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-cyan mb-4">
            // process
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary leading-tight">
            {t.howItWorks.title}
          </h2>
        </motion.div>

        {/* Steps - horizontal on desktop */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-0"
        >
          {/* Connecting dashed line across all steps (desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] z-0">
            <div className="w-full border-t-2 border-dashed border-white/[0.08]" />
          </div>

          {t.howItWorks.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const accent = STEP_ACCENT_COLORS[i];
            const num = String(i + 1).padStart(2, "0");

            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative z-10 flex flex-col items-center text-center px-4 md:px-8"
              >
                {/* Icon circle */}
                <div className="relative mb-8">
                  <div className="w-[104px] h-[104px] rounded-full border border-border-default bg-bg-secondary/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:border-neon-cyan/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]">
                    <Icon />
                  </div>
                  {/* Step number badge */}
                  <span
                    className={`absolute -top-2 -right-2 font-mono text-sm font-bold ${accent.number} bg-bg-primary border border-border-default rounded-full w-9 h-9 flex items-center justify-center`}
                  >
                    {num}
                  </span>
                </div>

                {/* Large monospace number */}
                <span className={`font-mono text-5xl md:text-6xl font-extrabold ${accent.number} opacity-15 select-none leading-none mb-4`}>
                  {num}
                </span>

                {/* Title */}
                <h3 className="font-display text-lg md:text-xl font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
                  {step.desc}
                </p>

                {/* Vertical connector line between steps on mobile */}
                {i < 3 && (
                  <div className="md:hidden w-px h-12 border-l-2 border-dashed border-white/[0.08] my-6" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
