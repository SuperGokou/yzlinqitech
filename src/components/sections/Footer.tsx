"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* --- Reveal --------------------------------------------------------------- */

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

/* --- Social icon SVGs ---------------------------------------------------- */

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WeChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.109.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.492.492 0 01.177-.554C23.197 18.437 24 16.837 24 15.065c0-3.384-3.09-6.16-7.062-6.207zm-2.87 2.905c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.37 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, { icon: () => React.ReactNode; label: string }> = {
  github: { icon: GitHubIcon, label: "GitHub" },
  twitter: { icon: TwitterIcon, label: "Twitter" },
  wechat: { icon: WeChatIcon, label: "WeChat" },
};

/* --- Component ----------------------------------------------------------- */

export default function Footer() {
  const { t, locale } = useLocale();
  const pathname = usePathname();
  const { content: socialContent } = useSiteContent("social");
  const { content: footerContent } = useSiteContent("footer");

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

  // Dynamic contact info with fallbacks
  const email = footerContent["email"]
    ? (locale === "zh" ? footerContent["email"].value_zh : footerContent["email"].value_en) || t.footer.email
    : t.footer.email;

  const location = footerContent["location"]
    ? (locale === "zh" ? footerContent["location"].value_zh : footerContent["location"].value_en) || t.footer.location
    : t.footer.location;

  // Build social links from dynamic content -- only show when URL is configured
  const socialLinks = Object.entries(SOCIAL_ICONS)
    .map(([key, { icon, label }]) => {
      const entry = socialContent[key];
      const url = entry
        ? (locale === "zh" ? entry.value_zh : entry.value_en) || null
        : null;
      return { key, icon, label, url };
    })
    .filter((s) => s.url && s.url !== "#");

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
      {/* ====== CONTACT CTA ====== */}
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

              {/* CTA buttons */}
              <Reveal delay={0.14}>
                <div className="flex flex-wrap items-center gap-3">
                  <a href={`mailto:${email}`}>
                    <Button
                      className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-neon-cyan to-neon-blue text-[var(--bg-deep)] hover:shadow-glow-cyan-md transition-all duration-300 text-sm border-transparent"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{locale === "zh" ? "发送邮件" : "Send Email"}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:translate-x-0.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </a>
                  <a
                    href="#chat-demo"
                    onClick={(e) => { e.preventDefault(); document.getElementById("chat-demo")?.scrollIntoView({ behavior: "smooth" }); }}
                  >
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] border-[var(--border-strong)] bg-transparent hover:border-neon-cyan/30 hover:text-neon-cyan transition-all duration-300"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                      </svg>
                      <span>{locale === "zh" ? "AI 在线咨询" : "Chat with AI"}</span>
                    </Button>
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
                    href={`mailto:${email}`}
                    className="text-text-primary text-base hover:text-neon-cyan transition-colors duration-200"
                  >
                    {email}
                  </a>
                </div>

                {/* Location */}
                <div>
                  <p className="font-mono text-[11px] tracking-widest uppercase text-text-muted mb-2">
                    {locale === "zh" ? "地点" : "Location"}
                  </p>
                  <p className="text-text-secondary text-sm">{location}</p>
                </div>

                {/* Separator */}
                <Separator className="bg-[var(--border-subtle)]" />

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

                {/* Separator */}
                <Separator className="bg-[var(--border-subtle)]" />

                {/* Social -- only show icons with configured URLs */}
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-3">
                    {socialLinks.map(({ key, icon: SocialIcon, label, url }) => (
                      <a
                        key={key}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted border border-border-subtle hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-200"
                      >
                        <SocialIcon />
                      </a>
                    ))}
                    <span className="text-text-muted text-xs ml-2">
                      {locale === "zh" ? "关注我们" : "Follow us"}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== FOOTER LINKS ====== */}
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

            {/* Resources -- FIXED LINKS */}
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

            {/* Company -- FIXED LINKS */}
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
                  <a href={`mailto:${email}`} className="text-xs text-text-secondary hover:text-neon-cyan transition-colors duration-200">{email}</a>
                </li>
                <li className="text-xs text-text-muted">{location}</li>
              </ul>
            </div>
          </div>

          {/* Bottom -- shadcn Separator */}
          <Separator className="mb-6 bg-[var(--border-subtle)]" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
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
