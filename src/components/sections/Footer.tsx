"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";

/* ─── Reveal ───────────────────────────────────────────────────── */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Component ───────────────────────────────────────────────── */

export default function Footer() {
  const { t, locale } = useLocale();
  const pathname = usePathname();

  const handleHashClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      const hash = href.split("#")[1];
      if (hash && pathname === "/") {
        e.preventDefault();
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pathname],
  );

  const resourceLinks = locale === "zh"
    ? [
        { label: "开发流程", href: "/#how-it-works" },
        { label: "精选案例", href: "/#portfolio" },
        { label: "技术栈", href: "/tech-stack" },
        { label: "常见问题", href: "/faq" },
      ]
    : [
        { label: "Our Process", href: "/#how-it-works" },
        { label: "Portfolio", href: "/#portfolio" },
        { label: "Tech Stack", href: "/tech-stack" },
        { label: "FAQ", href: "/faq" },
      ];

  return (
    <footer id="contact" className="relative">
      {/* ═══════════ CONTACT CTA ═══════════ */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
            {/* Left: Headline + CTAs */}
            <div>
              <Reveal>
                <p className="font-mono text-xs tracking-[0.25em] uppercase text-neon-cyan mb-4">
                  // {t.footer.contactUs}
                </p>
              </Reveal>

              <Reveal delay={0.06}>
                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
                  <span className="gradient-neon-text">
                    {locale === "zh" ? "准备好开始了吗？" : "Ready to Start?"}
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-lg mb-8">
                  {locale === "zh"
                    ? "告诉我们您的想法，让 AI 将它变为现实。从构想到上线，一次对话搞定。"
                    : "Tell us your idea and let AI turn it into reality. From concept to launch, one conversation is all it takes."}
                </p>
              </Reveal>

              {/* CTA buttons — horizontal */}
              <Reveal delay={0.14}>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:contact@lingqitech.com"
                    className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-medium text-bg-deep bg-gradient-to-r from-neon-cyan to-neon-blue hover:shadow-glow-cyan-md transition-all duration-300 text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>{locale === "zh" ? "发送邮件" : "Send Email"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:translate-x-0.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a
                    href="#chat-demo"
                    onClick={(e) => { e.preventDefault(); document.getElementById("chat-demo")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-text-secondary border border-border-strong hover:border-neon-cyan/30 hover:text-neon-cyan transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                    </svg>
                    <span>{locale === "zh" ? "AI 在线咨询" : "Chat with AI"}</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: Contact info card */}
            <Reveal delay={0.12}>
              <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
                {/* Email */}
                <div>
                  <p className="font-mono text-[11px] tracking-widest uppercase text-text-muted mb-2">Email</p>
                  <a
                    href={`mailto:${t.footer.email}`}
                    className="text-text-primary text-base hover:text-neon-cyan transition-colors duration-200"
                  >
                    {t.footer.email}
                  </a>
                </div>

                {/* Location */}
                <div>
                  <p className="font-mono text-[11px] tracking-widest uppercase text-text-muted mb-2">
                    {locale === "zh" ? "地点" : "Location"}
                  </p>
                  <p className="text-text-secondary text-sm">{t.footer.location}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-border-subtle" />

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { val: "50+", label: locale === "zh" ? "项目" : "Projects" },
                    { val: "99%", label: locale === "zh" ? "满意度" : "Satisfaction" },
                    { val: "24h", label: locale === "zh" ? "响应" : "Response" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="font-display text-lg font-bold text-neon-cyan">{s.val}</div>
                      <div className="font-mono text-[10px] tracking-wider uppercase text-text-muted mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border-subtle" />

                {/* Social */}
                <div className="flex items-center gap-3">
                  {[
                    { name: "GitHub", letter: "G" },
                    { name: "Twitter", letter: "T" },
                    { name: "WeChat", letter: "W" },
                  ].map(({ name, letter }) => (
                    <a
                      key={name}
                      href="#"
                      aria-label={name}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono text-text-muted border border-border-subtle hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-200"
                    >
                      {letter}
                    </a>
                  ))}
                  <span className="text-text-muted text-xs ml-2">
                    {locale === "zh" ? "关注我们" : "Follow us"}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER LINKS ═══════════ */}
      <div className="bg-bg-deep border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Image src="/logo.avif" alt="Software Factory" width={24} height={24} className="rounded-md" />
                <span className="font-display text-xs font-bold text-text-primary tracking-wider uppercase">
                  {locale === "zh" ? "软件加工厂" : "Software Factory"}
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{t.footer.description}</p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted mb-3">{locale === "zh" ? "资源" : "Resources"}</h4>
              <ul className="space-y-1.5">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={(e) => handleHashClick(e, link.href)} className="text-xs text-text-secondary hover:text-neon-cyan transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted mb-3">{t.footer.company}</h4>
              <ul className="space-y-1.5">
                {[
                  { label: t.footer.aboutUs, href: "/about" },
                  { label: t.footer.blog, href: "/blog" },
                  { label: t.footer.careers, href: "/careers" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-text-secondary hover:text-neon-cyan transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted mb-3">{t.footer.contactUs}</h4>
              <ul className="space-y-1.5">
                <li>
                  <a href={`mailto:${t.footer.email}`} className="text-xs text-text-secondary hover:text-neon-cyan transition-colors duration-200">{t.footer.email}</a>
                </li>
                <li className="text-xs text-text-muted">{t.footer.location}</li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-text-muted">
              &copy; {new Date().getFullYear()} {t.footer.copyright}. {t.footer.allRights}.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="text-[11px] text-text-muted hover:text-text-secondary transition-colors duration-200">{t.footer.privacy}</Link>
              <Link href="/terms" className="text-[11px] text-text-muted hover:text-text-secondary transition-colors duration-200">{t.footer.terms}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
