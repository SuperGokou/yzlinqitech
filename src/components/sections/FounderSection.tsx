"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInLeft, fadeInRight, viewportOnce } from "@/lib/motion";
import { Separator } from "@/components/ui/separator";

export default function FounderSection() {
  const { t } = useLocale();

  return (
    <section id="about" className="relative py-20 md:py-28 px-6">
      {/* Subtle radial backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-purple/60 mb-4">
            // founder
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-12 md:gap-16">
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
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/10 blur-md" />

              {/* Avatar circle */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border border-neon-purple/25 overflow-hidden transition-all duration-500 hover:border-neon-purple/40 hover:shadow-[0_0_40px_rgba(180,74,255,0.15)]">
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
            <span className="text-7xl md:text-8xl leading-none font-serif text-neon-purple/20 select-none mb-1">
              &ldquo;
            </span>

            {/* Quote with left accent border */}
            <blockquote className="relative pl-6 md:pl-8 border-l-[3px] border-neon-purple/40">
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed text-text-primary/90 italic font-light tracking-wide">
                {t.founder.quote}
              </p>
            </blockquote>

            {/* Separator */}
            <Separator className="mt-8 mb-6 ml-6 md:ml-8 max-w-xs bg-neon-purple/20" />

            {/* Attribution */}
            <div className="pl-6 md:pl-8 flex items-center gap-4">
              <div className="w-10 h-px bg-gradient-to-r from-neon-purple/50 to-transparent" />
              <div>
                <p className="font-mono text-sm font-semibold text-text-primary tracking-wide">
                  {t.founder.name}
                </p>
                <p className="text-xs text-text-secondary mt-1">
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
