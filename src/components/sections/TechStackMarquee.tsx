"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/motion";

/* --- Tech items --------------------------------------------------------- */

interface TechItem {
  name: string;
  color: string;
  icon?: string;   // path to SVG logo
  badge?: string;  // fallback letter badge if no icon
}

const ROW_1: TechItem[] = [
  { name: "Next.js", color: "#00e5ff", icon: "/images/tech/nextjs.svg" },
  { name: "React", color: "#61dafb", icon: "/images/tech/react.svg" },
  { name: "TypeScript", color: "#3178c6", icon: "/images/tech/typescript.svg" },
  { name: "Python", color: "#3776ab", icon: "/images/tech/python.svg" },
  { name: "FastAPI", color: "#009688", icon: "/images/tech/fastapi.svg" },
  { name: "DeepSeek", color: "#b44aff", badge: "DS" },
  { name: "PostgreSQL", color: "#336791", icon: "/images/tech/postgresql.svg" },
  { name: "Redis", color: "#dc382d", icon: "/images/tech/redis.svg" },
];

const ROW_2: TechItem[] = [
  { name: "Docker", color: "#2496ed", icon: "/images/tech/docker.svg" },
  { name: "Vercel", color: "#e8ecf4", icon: "/images/tech/vercel.svg" },
  { name: "Tailwind CSS", color: "#06b6d4", icon: "/images/tech/tailwindcss.svg" },
  { name: "Framer Motion", color: "#00e5ff", icon: "/images/tech/framer.svg" },
  { name: "ChromaDB", color: "#ff6f00", badge: "Ch" },
  { name: "Node.js", color: "#339933", icon: "/images/tech/nodejs.svg" },
  { name: "Vue.js", color: "#42b883", icon: "/images/tech/vuejs.svg" },
  { name: "Unity", color: "#8b95a8", icon: "/images/tech/unity.svg" },
];

/* --- Single pill --------------------------------------------------------- */

function TechPill({ item }: { item: TechItem }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border-subtle bg-white/[0.03] text-sm text-text-secondary whitespace-nowrap select-none shrink-0 transition-colors duration-200 hover:border-border-default hover:text-text-primary">
      {item.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.icon} alt="" width={18} height={18} className="shrink-0" />
      ) : (
        <span
          className="w-[18px] h-[18px] rounded flex items-center justify-center text-[9px] font-mono font-bold shrink-0"
          style={{
            backgroundColor: `${item.color}20`,
            color: item.color,
          }}
        >
          {item.badge}
        </span>
      )}
      <span>{item.name}</span>
    </div>
  );
}

/* --- Marquee row --------------------------------------------------------- */

function MarqueeRow({
  items,
  reverse,
}: {
  items: TechItem[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden group">
      {/* Left fade mask */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      {/* Right fade mask */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-3 animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          width: "max-content",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((item, i) => (
          <TechPill key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/* --- Component ----------------------------------------------------------- */

export default function TechStackMarquee() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden border-t border-border-subtle border-b border-b-border-subtle">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="space-y-3"
      >
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </motion.div>
    </section>
  );
}
