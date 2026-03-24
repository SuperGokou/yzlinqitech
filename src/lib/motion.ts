/**
 * Framer Motion reusable animation variants and spring presets.
 * Consumed by all animated section components.
 */
import type { Variants, Transition } from "framer-motion";

/* ─── SPRING PRESETS ──────────────────────────────────────────── */

export const springs = {
  snappy: { type: "spring", stiffness: 300, damping: 24 } as Transition,
  gentle: { type: "spring", stiffness: 200, damping: 20 } as Transition,
  bouncy: { type: "spring", stiffness: 400, damping: 15 } as Transition,
  chat: { type: "spring", stiffness: 280, damping: 26 } as Transition,
};

/* ─── BASIC VARIANTS ──────────────────────────────────────────── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.snappy,
  },
};

/* ─── STAGGER CONTAINERS ─────────────────────────────────────── */

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/* ─── HOVER & TAP ─────────────────────────────────────────────── */

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const hoverScale = {
  whileHover: { scale: 1.02, transition: springs.snappy },
  whileTap: { scale: 0.98 },
};

export const hoverGlow = {
  whileHover: {
    scale: 1.02,
    boxShadow: "0 0 20px rgba(0, 229, 255, 0.35), 0 0 40px rgba(0, 229, 255, 0.15)",
    transition: { duration: 0.2 },
  },
};

/* ─── VIEWPORT OPTIONS ────────────────────────────────────────── */

export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};
