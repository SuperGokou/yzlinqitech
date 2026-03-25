"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  staggerContainerSlow,
  viewportOnce,
} from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  University color mapping                                           */
/* ------------------------------------------------------------------ */
const UNI_COLORS: Record<string, string> = {
  Harvard: "#A51C30",
  MIT: "#00e5ff",
  UPenn: "#011F5B",
  Stanford: "#8B0000",
  Princeton: "#FF6600",
};

/* Normalise visual shield size — wider images with more padding need a bigger box */
const UNI_LOGO_CLASS: Record<string, string> = {
  Harvard:   "w-9 h-9",       // square SVG, shield fills well
  MIT:       "w-9 h-9",
  UPenn:     "w-14 h-10",     // 3:2 landscape PNG, needs wider box
  Stanford:  "w-9 h-9",
  Princeton: "w-14 h-10",     // 16:9 landscape PNG, needs wider box
};

/* ------------------------------------------------------------------ */
/*  Strength icons (Heroicons outline, 24×24)                          */
/* ------------------------------------------------------------------ */
const strengthIcons = [
  // Academic cap
  <svg key="cap" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  </svg>,
  // Briefcase
  <svg key="brief" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
  </svg>,
  // Sparkles
  <svg key="spark" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>,
  // Rocket
  <svg key="rocket" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
  </svg>,
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function TeamPage() {
  const { t } = useLocale();
  const team = t.team;

  return (
    <div id="main-content" role="main" className="pt-16">
        {/* ── Hero ───────────────────────────────────────── */}
        <section className="relative py-20 md:py-28 px-6 overflow-hidden">
          {/* Subtle radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-[1440px] mx-auto text-center">
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="font-mono text-xs tracking-[0.25em] uppercase text-neon-cyan/60 mb-6"
            >
              {team.sectionLabel}
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-6"
            >
              {team.title.split("，").length > 1 ? (
                <>
                  {team.title.split("，")[0]}
                  {"，"}
                  <span className="gradient-neon-text">{team.title.split("，")[1]}</span>
                </>
              ) : (
                <>
                  {team.title.split(",")[0]}
                  {team.title.includes(",") && ","}
                  {team.title.split(",").length > 1 && (
                    <span className="gradient-neon-text">{team.title.split(",").slice(1).join(",")}</span>
                  )}
                </>
              )}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="max-w-2xl mx-auto text-text-secondary text-lg leading-relaxed"
            >
              {team.subtitle}
            </motion.p>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────── */}
        <section className="relative py-12 border-y border-border-subtle bg-bg-secondary/50">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {team.stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-glow-cyan text-neon-cyan mb-2">
                  {stat.value}
                </div>
                <div className="font-mono text-xs tracking-wider text-text-muted uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── University Ribbon ──────────────────────────── */}
        <section className="py-12 px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-5 md:gap-8"
          >
            {team.universities.map((uni) => {
              const logoFile = uni.toLowerCase().replace(/\s+/g, "") as string;
              const pngLogos = ["upenn", "princeton"];
              const ext = pngLogos.includes(logoFile) ? "png" : "svg";
              return (
                <motion.div
                  key={uni}
                  variants={fadeInUp}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border-subtle bg-bg-secondary/30 hover:border-border-glow-cyan hover:bg-bg-secondary/50 transition-all duration-300"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/universities/${logoFile}.${ext}`}
                    alt={`${uni} logo`}
                    className={`shrink-0 object-contain ${UNI_LOGO_CLASS[uni] ?? "w-9 h-9"}`}
                  />
                  <span className="font-mono text-sm text-text-secondary tracking-wider">
                    {uni}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ── Team Grid ──────────────────────────────────── */}
        <section className="py-16 md:py-20 px-6">
          <div className="max-w-[1440px] mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="text-center mb-12"
            >
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-neon-cyan/60 mb-4">
                {team.gridLabel}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                {team.gridLabel.replace("// ", "")}
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {team.members.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("");

                return (
                  <motion.div
                    key={member.name}
                    variants={fadeInUp}
                    className="group relative gradient-card rounded-2xl p-6 border border-border-subtle hover:border-border-glow-cyan transition-all duration-300"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse at center, rgba(0,229,255,0.04) 0%, transparent 70%)",
                      }}
                    />

                    <div className="relative z-10">
                      {/* Avatar + name */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-display font-bold border-2 shrink-0 border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-neon-cyan transition-colors duration-200">
                            {member.name}
                          </h3>
                          <p className="text-accent-gold text-sm font-medium">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* University badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            background:
                              UNI_COLORS[member.university.split(" / ")[0]] ?? "#00e5ff",
                          }}
                        />
                        <span className="font-mono text-xs tracking-wider text-text-secondary">
                          {member.university}
                        </span>
                        <span className="text-border-subtle">|</span>
                        <span className="font-mono text-xs text-text-muted">
                          {member.degree}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {member.bio}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {member.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-mono border border-border-subtle text-text-muted hover:border-border-glow-cyan hover:text-neon-cyan transition-colors duration-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── Strengths ──────────────────────────────────── */}
        <section className="py-16 md:py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="text-center mb-14"
            >
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-neon-cyan/60 mb-4">
                {team.strengthsLabel}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                {team.strengthsTitle}
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainerSlow}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {team.strengths.map((s, i) => (
                <motion.div
                  key={s.title}
                  variants={fadeInUp}
                  className="gradient-card rounded-2xl p-6 border border-border-subtle hover:border-border-glow-purple transition-all duration-300"
                >
                  <div className="text-neon-purple mb-4">{strengthIcons[i]}</div>
                  <h3 className="font-display text-xl font-bold text-text-primary mb-3">
                    {s.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {s.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────── */}
        <section className="py-20 px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {team.ctaTitle}
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              {team.ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@lingqitech.com"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-sm bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:shadow-glow-cyan-sm transition-all duration-200"
              >
                {team.ctaPrimary}
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-sm border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-200"
              >
                {team.ctaSecondary}
              </Link>
            </div>
          </motion.div>
        </section>
    </div>
  );
}
