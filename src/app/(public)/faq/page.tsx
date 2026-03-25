"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_ZH: FAQCategory[] = [
  {
    title: "合作流程",
    items: [
      { q: "项目从咨询到交付需要多长时间？", a: "取决于项目复杂度。简单企业官网 1-2 周，中等复杂度的小程序/Web 应用 3-4 周，复杂 SaaS 或 AI 系统 6-8 周。我们的 AI 工作流比传统开发快 3-5 倍。" },
      { q: "你们的开发流程是怎样的？", a: "四步流程：1) 描述需求 — 通过 AI 助手或直接沟通；2) AI 设计方案 — 自动生成方案和报价；3) 客户确认 — 审核并签约；4) 交付产品 — 按里程碑开发、测试、部署。全程保持透明沟通。" },
      { q: "可以先看设计稿再决定是否合作吗？", a: "可以。我们会先提供免费的初步方案概述。如果满意，签约后出完整设计稿。设计稿阶段有 2 次免费修改机会。" },
      { q: "项目交付后还提供支持吗？", a: "交付后 30 天内免费修复 bug。之后可签订月度/年度维护合同，包含 bug 修复、小功能迭代和技术支持。" },
    ],
  },
  {
    title: "费用与支付",
    items: [
      { q: "项目大概需要多少钱？", a: "企业官网 ¥8,000-25,000，小程序 ¥15,000-50,000，AI 系统 ¥30,000-100,000+。具体价格取决于功能复杂度、设计要求和技术栈。AI 助手可以给出初步估算。" },
      { q: "付款方式是怎样的？", a: "标准分三期：签约 40% + 中期 30% + 验收 30%。支持银行转账、支付宝、微信支付。大型项目可协商按里程碑付款。" },
      { q: "如果对结果不满意怎么办？", a: "每个里程碑都有验收环节，不满意可以提出修改。如果在设计阶段就无法达成一致，可协商终止合作，已完成工作的费用按比例结算。" },
    ],
  },
  {
    title: "技术相关",
    items: [
      { q: "你们用什么技术栈？", a: "前端：Next.js + React + TypeScript + Tailwind CSS。后端：Node.js / Python FastAPI。数据库：PostgreSQL + Redis。AI：DeepSeek API + RAG。部署：Vercel / Docker。具体项目会根据需求灵活选择。" },
      { q: "项目代码归谁所有？", a: "尾款结清后，定制开发的源代码完全归您所有。我们保留通用框架和组件库的使用权（非客户专属部分）。" },
      { q: "可以对接现有系统吗？", a: "可以。我们有丰富的 API 对接经验，支持与 ERP、CRM、支付系统、物流系统、企业微信等第三方平台集成。" },
      { q: "你们的 AI 助手（网站上的聊天机器人）是怎么实现的？", a: "基于 DeepSeek 大模型 + RAG 知识库检索。系统先从知识库中检索相关信息，再结合上下文生成回答。支持 SSE 流式传输实现逐字输出效果。" },
    ],
  },
  {
    title: "关于公司",
    items: [
      { q: "凌柒科技是一家什么样的公司？", a: "我们是 AI 驱动的软件开发公司，核心团队来自 UPenn、Stanford、Princeton 等世界名校。采用全远程协作模式，用 AI 工具链将开发效率提升 5 倍。" },
      { q: "「零员工」是什么意思？", a: "我们采用精英合伙人 + AI 协作模式，没有传统意义上的「员工」层级。每个人都是独立贡献者，AI 处理 60%+ 的常规工作，人类专注于创意和决策。" },
      { q: "你们在哪里办公？", a: "全球远程。核心团队分布在中国和美国，按项目组建跨时区协作团队。这意味着您的项目几乎可以 24 小时推进。" },
      { q: "如何联系你们？", a: "最快方式：使用网站右下角的 AI 助手。也可以发邮件到 contact@lingqitech.com，我们会在 24 小时内回复。" },
    ],
  },
];

const FAQ_EN: FAQCategory[] = [
  {
    title: "Process",
    items: [
      { q: "How long does a project take from consultation to delivery?", a: "Depends on complexity. Simple corporate websites: 1-2 weeks. Medium-complexity mini programs/web apps: 3-4 weeks. Complex SaaS or AI systems: 6-8 weeks. Our AI workflow is 3-5x faster than traditional development." },
      { q: "What is your development process?", a: "Four steps: 1) Describe needs — via AI assistant or direct communication; 2) AI designs proposal — auto-generates plan and quote; 3) Client confirms — review and sign; 4) Deliver — milestone-based development, testing, deployment. Transparent communication throughout." },
      { q: "Can I see designs before committing?", a: "Yes. We provide a free initial proposal overview. After signing, we deliver full design mockups with 2 free revision rounds." },
      { q: "Do you provide support after delivery?", a: "30-day free bug fixes after delivery. After that, monthly/annual maintenance contracts are available covering bug fixes, minor iterations, and technical support." },
    ],
  },
  {
    title: "Pricing & Payment",
    items: [
      { q: "How much does a project cost?", a: "Corporate websites: $1,000-3,500. Mini programs: $2,000-7,000. AI systems: $4,000-15,000+. Exact pricing depends on feature complexity, design requirements, and tech stack. Our AI assistant can provide preliminary estimates." },
      { q: "What are the payment terms?", a: "Standard three-phase: 40% at signing + 30% at midpoint + 30% at delivery. Bank transfer and PayPal accepted. Larger projects can negotiate milestone-based payments." },
      { q: "What if I'm not satisfied with the result?", a: "Each milestone includes an acceptance review where you can request changes. If we can't align during the design phase, we can negotiate termination with pro-rated billing for completed work." },
    ],
  },
  {
    title: "Technical",
    items: [
      { q: "What tech stack do you use?", a: "Frontend: Next.js + React + TypeScript + Tailwind CSS. Backend: Node.js / Python FastAPI. Database: PostgreSQL + Redis. AI: DeepSeek API + RAG. Deploy: Vercel / Docker. We choose the best fit for each project." },
      { q: "Who owns the project code?", a: "After full payment, all custom-developed source code is yours. We retain usage rights for general frameworks and component libraries (non-client-specific portions)." },
      { q: "Can you integrate with existing systems?", a: "Yes. We have extensive API integration experience, supporting ERP, CRM, payment systems, logistics, WeChat Work, and other third-party platforms." },
      { q: "How does your AI chatbot work?", a: "Built on DeepSeek LLM + RAG knowledge retrieval. The system retrieves relevant information from the knowledge base, then generates contextual responses. SSE streaming enables real-time token-by-token output." },
    ],
  },
  {
    title: "About Us",
    items: [
      { q: "What kind of company is LingQi Tech?", a: "We're an AI-driven software development company. Core team from UPenn, Stanford, Princeton. Fully remote collaboration model using AI toolchain for 5x development efficiency." },
      { q: "What does 'zero employees' mean?", a: "We operate as elite partners + AI collaboration — no traditional employee hierarchy. Everyone is an independent contributor. AI handles 60%+ of routine work while humans focus on creativity and decisions." },
      { q: "Where are you located?", a: "Fully remote worldwide. Core team spans China and the US, forming cross-timezone teams per project. This means your project can progress nearly 24/7." },
      { q: "How do I contact you?", a: "Fastest way: use the AI assistant at the bottom-right of the website. Or email contact@lingqitech.com — we respond within 24 hours." },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border-subtle rounded-xl overflow-hidden bg-bg-secondary/20 hover:border-border-default transition-colors duration-200">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="font-display text-sm font-semibold text-text-primary leading-snug">{item.q}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="shrink-0 text-text-muted"
        >
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border-subtle/50 pt-4">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const { locale } = useLocale();
  const categories = locale === "zh" ? FAQ_ZH : FAQ_EN;
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-28 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(180,74,255,0.05) 0%, transparent 70%)" }} />
          <div className="relative max-w-6xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.p variants={fadeInUp} className="font-mono text-sm tracking-[0.2em] uppercase text-neon-purple/60 mb-4">// faq</motion.p>
              <motion.h1 variants={fadeInUp} className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-6">
                {locale === "zh" ? "常见问题" : "FAQ"}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                {locale === "zh"
                  ? "关于合作流程、费用、技术栈和公司的常见疑问，都在这里。找不到答案？直接问我们的 AI 助手。"
                  : "Common questions about our process, pricing, tech stack, and company. Can't find your answer? Ask our AI assistant directly."}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Categories */}
        {categories.map((cat) => (
          <section key={cat.title} className="py-10 md:py-14 px-6 border-t border-border-subtle">
            <div className="max-w-4xl mx-auto">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-6">
                <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary">{cat.title}</h2>
              </motion.div>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="space-y-3">
                {cat.items.map((item) => {
                  const key = `${cat.title}-${item.q}`;
                  return (
                    <motion.div key={key} variants={fadeInUp}>
                      <AccordionItem item={item} isOpen={!!openMap[key]} onToggle={() => toggle(key)} />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-16 px-6 border-t border-border-subtle">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
                {locale === "zh" ? "还有其他问题？" : "Still have questions?"}
              </h2>
              <p className="text-text-secondary mb-6">
                {locale === "zh" ? "点击右下角的 AI 助手，随时为你解答" : "Click the AI assistant at the bottom-right for instant help"}
              </p>
              <a href="mailto:contact@lingqitech.com" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-display font-bold tracking-wide rounded-lg transition-all duration-300 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
                {locale === "zh" ? "发送邮件咨询" : "Email Us"}
              </a>
            </motion.div>
          </div>
        </section>
    </div>
  );
}
