"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInLeft, fadeInRight, viewportOnce } from "@/lib/motion";

export default function FounderSection() {
  const { t } = useLocale();

  return (
    <section id="about" className="relative py-16 md:py-24 px-6">
      {/* Subtle radial backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-10 md:gap-14">
          {/* Avatar column */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex justify-center md:justify-start"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/10 blur-sm" />

              {/* Avatar circle */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border border-neon-purple/25 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/30 via-bg-primary to-neon-cyan/15 flex items-center justify-center">
                  <span className="font-mono text-3xl md:text-4xl font-bold text-text-primary/80 tracking-widest select-none">
                    LQ
                  </span>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-neon-purple/40" />
              <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-neon-cyan/30" />
            </div>
          </motion.div>

          {/* Quote column */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col"
          >
            {/* Large opening quote mark */}
            <span className="text-6xl md:text-7xl leading-none font-serif text-neon-purple/20 select-none mb-2">
              &ldquo;
            </span>

            {/* Quote with left accent border */}
            <blockquote className="relative pl-6 md:pl-8 border-l-[3px] border-neon-purple/40">
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed text-text-primary/90 italic font-light tracking-wide">
                {t.founder.quote}
              </p>
            </blockquote>

            {/* Attribution */}
            <div className="mt-8 pl-6 md:pl-8 flex items-center gap-4">
              <div className="w-10 h-px bg-gradient-to-r from-neon-purple/50 to-transparent" />
              <div>
                <p className="font-mono text-sm font-semibold text-text-primary tracking-wide">
                  {t.founder.name}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {t.founder.title}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
