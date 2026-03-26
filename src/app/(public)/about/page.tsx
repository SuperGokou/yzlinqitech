"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

const MILESTONES_ZH = [
  { year: "2024 Q1", title: "公司成立", desc: "凌柒科技在费城 314 Chandler St 成立，定位 AI 驱动软件工厂" },
  { year: "2024 Q2", title: "核心团队组建", desc: "汇聚 UPenn、Stanford、Princeton 等名校精英，搭建技术中台" },
  { year: "2024 Q3", title: "首批项目交付", desc: "完成 10+ 企业官网、小程序、AI 系统的开发与上线" },
  { year: "2024 Q4", title: "AI 工作流成熟", desc: "自研 AI 辅助开发流水线，开发效率提升 5 倍" },
  { year: "2025 Q1", title: "规模化扩展", desc: "服务客户覆盖中美两地，项目累计 50+" },
];

const MILESTONES_EN = [
  { year: "2024 Q1", title: "Founded", desc: "LingQi Tech established at 314 Chandler St, Philadelphia as an AI-driven software factory" },
  { year: "2024 Q2", title: "Core Team Built", desc: "Assembled elite talent from UPenn, Stanford, Princeton; built technical platform" },
  { year: "2024 Q3", title: "First Deliveries", desc: "Shipped 10+ corporate sites, mini programs, and AI systems" },
  { year: "2024 Q4", title: "AI Workflow Matured", desc: "Proprietary AI-assisted dev pipeline achieving 5x efficiency gains" },
  { year: "2025 Q1", title: "Scaling Up", desc: "Serving clients across US and China, 50+ projects delivered" },
];

const VALUES_ZH = [
  { icon: "01", title: "AI 优先", desc: "每一行代码都经过 AI 辅助审查和优化，确保最高质量和效率" },
  { icon: "02", title: "客户至上", desc: "深入理解需求，用最少的沟通成本交付最大的商业价值" },
  { icon: "03", title: "极致交付", desc: "不做「差不多」的产品，每个像素、每次交互都精益求精" },
  { icon: "04", title: "持续创新", desc: "紧跟前沿技术，将最新的 AI 能力转化为客户的竞争优势" },
];

const VALUES_EN = [
  { icon: "01", title: "AI First", desc: "Every line of code is AI-assisted, reviewed and optimized for maximum quality and efficiency" },
  { icon: "02", title: "Client Obsessed", desc: "Deep understanding of needs, delivering maximum business value with minimal communication overhead" },
  { icon: "03", title: "Pixel Perfect", desc: "No 'good enough' products — every pixel, every interaction is crafted with precision" },
  { icon: "04", title: "Always Innovating", desc: "Staying at the frontier, turning the latest AI capabilities into competitive advantages for clients" },
];

export default function AboutPage() {
  const { locale } = useLocale();
  const milestones = locale === "zh" ? MILESTONES_ZH : MILESTONES_EN;
  const values = locale === "zh" ? VALUES_ZH : VALUES_EN;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%)" }} />
        <div className="relative max-w-6xl mx-auto">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.p variants={fadeInUp} className="font-mono text-sm tracking-[0.2em] uppercase text-neon-cyan/60 mb-4">// about</motion.p>
            <motion.h1 variants={fadeInUp} className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-6">
              {locale === "zh" ? "关于凌柒科技" : "About LingQi Tech"}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary max-w-2xl leading-relaxed">
              {locale === "zh"
                ? "我们是一支由世界顶级名校精英组成的 AI 驱动软件开发团队。零冗余、全 AI 赋能，以 10 倍效率交付企业级数字产品。"
                : "We are an AI-driven software development team of elite talent from the world's top universities. Zero redundancy, fully AI-empowered, delivering enterprise-grade digital products at 10x efficiency."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-purple mb-4">// mission</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-6">
              {locale === "zh" ? "让 AI 重新定义软件开发" : "Redefining Software Development with AI"}
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              {locale === "zh"
                ? "传统软件开发需要庞大团队、漫长周期和高昂成本。我们用 AI 打破这一切——用对话代替需求文档，用智能流水线代替人海战术，将数月的开发周期压缩到数周。"
                : "Traditional software development requires large teams, long cycles, and high costs. We break this paradigm with AI — replacing requirement docs with conversations, human-wave tactics with intelligent pipelines, compressing months into weeks."}
            </p>
            <p className="text-text-secondary leading-relaxed">
              {locale === "zh"
                ? "Born at 314, Built for 360° — 我们追求全方位的完美，从设计到开发到部署，每一个环节都经过 AI 优化。"
                : "Born at 314, Built for 360° — We pursue all-around perfection. From design to development to deployment, every step is AI-optimized."}
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-2 gap-4">
            {[
              { value: "50+", label: locale === "zh" ? "项目交付" : "Projects Delivered" },
              { value: "5x", label: locale === "zh" ? "效率提升" : "Efficiency Gain" },
              { value: "99%", label: locale === "zh" ? "客户满意度" : "Client Satisfaction" },
              { value: "24h", label: locale === "zh" ? "响应时间" : "Response Time" },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/30">
                <div className="font-display text-2xl font-bold text-neon-cyan mb-1">{stat.value}</div>
                <div className="text-xs font-mono text-text-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-cyan mb-4">// values</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              {locale === "zh" ? "核心价值观" : "Core Values"}
            </h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <motion.div key={v.icon} variants={fadeInUp} className="p-6 rounded-xl border border-border-subtle bg-bg-secondary/20 hover:border-neon-cyan/20 transition-colors duration-300">
                <span className="font-mono text-3xl font-bold text-neon-cyan/20 mb-4 block">{v.icon}</span>
                <h3 className="font-display text-lg font-semibold text-text-primary mb-2">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 px-6 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-purple mb-4">// milestones</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              {locale === "zh" ? "发展历程" : "Our Journey"}
            </h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border-subtle" />
            {milestones.map((m, i) => (
              <motion.div key={m.year} variants={fadeInUp} className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : ""} hidden md:block`} />
                <div className="relative z-10 w-8 h-8 rounded-full border-2 border-neon-cyan bg-bg-primary flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                </div>
                <div className="flex-1 pb-2">
                  <span className="font-mono text-xs text-neon-cyan tracking-wider">{m.year}</span>
                  <h3 className="font-display text-lg font-semibold text-text-primary mt-1">{m.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
