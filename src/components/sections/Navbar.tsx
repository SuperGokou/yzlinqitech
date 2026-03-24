"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInDown, springs } from "@/lib/motion";

const NAV_LINKS = [
  { key: "services", href: "/#services" },
  { key: "portfolio", href: "/#portfolio" },
  { key: "team", href: "/team" },
  { key: "about", href: "/#about" },
  { key: "contact", href: "/#contact" },
] as const;

export default function Navbar() {
  const { t, toggleLocale } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Track which section is in view */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href)
      .filter((h) => h.includes("#"))
      .map((h) => h.split("#")[1]);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLabels: Record<string, string> = {
    services: t.nav.services,
    portfolio: t.nav.portfolio,
    team: t.nav.team,
    about: t.nav.about,
    contact: t.nav.contact,
  };

  const isActive = (key: string) => activeSection === key;

  return (
    <>
      <motion.nav
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 backdrop-blur-2xl backdrop-saturate-150 ${
          scrolled
            ? "py-2 bg-[rgba(5,10,21,0.92)]"
            : "py-3 bg-[rgba(5,10,21,0.75)]"
        }`}
        style={{
          borderBottom: scrolled
            ? "1px solid rgba(0, 229, 255, 0.12)"
            : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-9 h-9 overflow-hidden rounded-lg ring-1 ring-neon-cyan/20 group-hover:ring-neon-cyan/50 group-hover:shadow-glow-cyan-sm transition-all duration-300">
              <Image
                src="/logo.avif"
                alt="软件加工厂"
                width={36}
                height={36}
                className="object-cover"
                priority
              />
            </div>
            <span className="font-display text-base font-bold tracking-widest uppercase text-glow-cyan text-neon-cyan">
              软件加工厂
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="relative px-4 py-2 text-sm font-display font-medium uppercase tracking-wider transition-colors duration-200 group"
                style={{
                  color: isActive(link.key) ? "#00e5ff" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.key)) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.key)) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }
                }}
              >
                {navLabels[link.key]}
                {/* Active indicator */}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                  style={{
                    width: isActive(link.key) ? "60%" : "0%",
                    backgroundColor: "#00e5ff",
                    boxShadow: isActive(link.key) ? "0 0 8px rgba(0,229,255,0.5)" : "none",
                  }}
                />
              </a>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Locale toggle */}
            <button
              onClick={toggleLocale}
              className="text-sm font-display font-medium uppercase tracking-wider px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              }}
              aria-label="Toggle language"
            >
              {t.nav.langToggle}
            </button>

            {/* Thin divider */}
            <div className="hidden sm:block w-px h-5 bg-white/10" />

            {/* CTA */}
            <a
              href="/#chat-demo"
              className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 text-sm font-display font-bold uppercase tracking-wider rounded-lg transition-all duration-300"
              style={{
                color: "#050a15",
                backgroundColor: "#00e5ff",
                boxShadow: "0 0 12px rgba(0, 229, 255, 0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#33ecff";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 24px rgba(0, 229, 255, 0.4), 0 0 48px rgba(0, 229, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#00e5ff";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(0, 229, 255, 0.2)";
              }}
            >
              {t.nav.cta}
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span
                className="block h-px w-5 transition-all duration-300 origin-center"
                style={{
                  backgroundColor: mobileOpen ? "#00e5ff" : "var(--text-primary)",
                  transform: mobileOpen
                    ? "rotate(45deg) translateY(0)"
                    : "translateY(-4px)",
                }}
              />
              <span
                className="block h-px w-5 transition-all duration-300"
                style={{
                  backgroundColor: "var(--text-primary)",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block h-px w-5 transition-all duration-300 origin-center"
                style={{
                  backgroundColor: mobileOpen ? "#00e5ff" : "var(--text-primary)",
                  transform: mobileOpen
                    ? "rotate(-45deg) translateY(0)"
                    : "translateY(4px)",
                }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: "rgba(5, 10, 21, 0.85)", backdropFilter: "blur(8px)" }}
              onClick={closeMobile}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={springs.snappy}
              className="fixed top-0 right-0 bottom-0 z-40 w-80 md:hidden flex flex-col"
              style={{
                background: "linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-primary) 100%)",
                borderLeft: "1px solid rgba(0, 229, 255, 0.08)",
              }}
            >
              {/* Close area at top */}
              <div className="h-20 shrink-0" />

              {/* Links */}
              <nav className="flex flex-col px-8">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.key}
                    href={link.href}
                    onClick={closeMobile}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    className="py-4 text-lg font-display font-medium tracking-wider transition-colors duration-200"
                    style={{
                      color: "var(--text-secondary)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#00e5ff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    <span className="font-mono text-xs mr-4" style={{ color: "var(--text-muted)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {navLabels[link.key]}
                  </motion.a>
                ))}
              </nav>

              {/* Bottom actions */}
              <div className="mt-auto px-8 pb-10 flex flex-col gap-4">
                <button
                  onClick={() => {
                    toggleLocale();
                    closeMobile();
                  }}
                  className="text-sm font-display uppercase tracking-wider text-left py-2 transition-colors duration-200"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t.nav.langToggle === "EN" ? "Switch to English" : "切换到中文"}
                </button>
                <a
                  href="/#chat-demo"
                  onClick={closeMobile}
                  className="flex items-center justify-center px-6 py-3 text-sm font-display font-bold uppercase tracking-wider rounded-lg transition-all duration-300"
                  style={{
                    color: "#050a15",
                    backgroundColor: "#00e5ff",
                  }}
                >
                  {t.nav.cta}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
