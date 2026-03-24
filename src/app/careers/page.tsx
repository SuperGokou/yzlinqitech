"use client";

import { motion } from "framer-motion";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface JobPost {
  title: string;
  type: string;
  location: string;
  tags: string[];
  desc: string;
}

const JOBS_ZH: JobPost[] = [
  {
    title: "全栈工程师",
    type: "全职 / 远程",
    location: "中国 / 美国",
    tags: ["Next.js", "TypeScript", "Python", "FastAPI"],
    desc: "负责客户项目的全栈开发，从需求分析到部署上线。需要熟练掌握前后端技术栈，有 AI 工具使用经验优先。",
  },
  {
    title: "AI 应用工程师",
    type: "全职 / 远程",
    location: "中国 / 美国",
    tags: ["LLM", "RAG", "Python", "LangChain"],
    desc: "设计和构建 AI Agent、RAG 系统、智能客服等 AI 应用。需要对大模型 API、向量数据库、Prompt Engineering 有深入理解。",
  },
  {
    title: "UI/UX 设计师",
    type: "兼职 / 远程",
    location: "全球",
    tags: ["Figma", "设计系统", "动效设计", "暗色主题"],
    desc: "为客户项目提供高质量视觉设计。需要有 SaaS / 科技产品设计经验，熟悉设计系统搭建和 Figma 协作流程。",
  },
  {
    title: "商务拓展（BD）",
    type: "兼职 / 远程",
    location: "中国",
    tags: ["客户开发", "方案咨询", "合同谈判"],
    desc: "负责中国市场客户拓展，识别潜在需求并转化为项目合作。需要有 ToB 软件销售或咨询经验。",
  },
];

const JOBS_EN: JobPost[] = [
  {
    title: "Full-Stack Engineer",
    type: "Full-time / Remote",
    location: "US / China",
    tags: ["Next.js", "TypeScript", "Python", "FastAPI"],
    desc: "Own full-stack development for client projects, from requirements to deployment. Proficiency in frontend and backend stacks required; AI tooling experience preferred.",
  },
  {
    title: "AI Application Engineer",
    type: "Full-time / Remote",
    location: "US / China",
    tags: ["LLM", "RAG", "Python", "LangChain"],
    desc: "Design and build AI Agents, RAG systems, and intelligent assistants. Deep understanding of LLM APIs, vector databases, and prompt engineering required.",
  },
  {
    title: "UI/UX Designer",
    type: "Part-time / Remote",
    location: "Worldwide",
    tags: ["Figma", "Design Systems", "Motion", "Dark Theme"],
    desc: "Deliver high-quality visual design for client projects. SaaS/tech product design experience required; familiar with design system construction and Figma collaboration.",
  },
  {
    title: "Business Development",
    type: "Part-time / Remote",
    location: "China",
    tags: ["Client Acquisition", "Consulting", "Negotiation"],
    desc: "Drive client acquisition in the China market, identifying needs and converting them into project partnerships. ToB software sales or consulting experience required.",
  },
];

const PERKS_ZH = [
  { num: "01", title: "全球远程", desc: "不限地点，异步协作，以结果为导向" },
  { num: "02", title: "AI 工具全配", desc: "Claude、Cursor、GPT-4 等顶级 AI 工具账号全覆盖" },
  { num: "03", title: "项目分红", desc: "核心成员参与项目利润分成，多劳多得" },
  { num: "04", title: "技术成长", desc: "接触最前沿的 AI + 全栈技术，快速提升" },
  { num: "05", title: "弹性工作", desc: "自主安排时间，注重产出而非工时" },
  { num: "06", title: "创业氛围", desc: "扁平结构、快速决策、直接影响公司方向" },
];

const PERKS_EN = [
  { num: "01", title: "Fully Remote", desc: "Work from anywhere, async collaboration, results-driven" },
  { num: "02", title: "AI Tools Provided", desc: "Full access to Claude, Cursor, GPT-4 and top-tier AI tools" },
  { num: "03", title: "Profit Sharing", desc: "Core members participate in project profit sharing" },
  { num: "04", title: "Growth", desc: "Cutting-edge AI + full-stack tech, rapid skill development" },
  { num: "05", title: "Flexible Hours", desc: "Manage your own schedule, output over hours" },
  { num: "06", title: "Startup Culture", desc: "Flat structure, fast decisions, directly shape company direction" },
];

function CareersContent() {
  const { locale } = useLocale();
  const jobs = locale === "zh" ? JOBS_ZH : JOBS_EN;
  const perks = locale === "zh" ? PERKS_ZH : PERKS_EN;

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-28 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,229,255,0.06) 0%, transparent 70%)" }} />
          <div className="relative max-w-6xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.p variants={fadeInUp} className="font-mono text-sm tracking-[0.2em] uppercase text-neon-cyan/60 mb-4">// careers</motion.p>
              <motion.h1 variants={fadeInUp} className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-6">
                {locale === "zh" ? "加入我们" : "Join Our Team"}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                {locale === "zh"
                  ? "我们正在寻找对 AI 和技术充满热情的人才。无论你在哪里，只要你足够优秀，这里就是你的舞台。"
                  : "We're looking for passionate people who live and breathe AI and technology. Wherever you are, if you're exceptional, this is your stage."}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Perks */}
        <section className="py-16 md:py-24 px-6 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-purple mb-4">// why us</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                {locale === "zh" ? "为什么选择凌柒" : "Why LingQi"}
              </h2>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {perks.map((p) => (
                <motion.div key={p.title} variants={fadeInUp} className="p-6 rounded-xl border border-border-subtle bg-bg-secondary/20 hover:border-neon-cyan/20 transition-colors duration-300">
                  <span className="font-mono text-2xl font-bold text-neon-cyan/20 mb-3 block">{p.num}</span>
                  <h3 className="font-display text-base font-semibold text-text-primary mb-1">{p.title}</h3>
                  <p className="text-sm text-text-secondary">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 md:py-24 px-6 border-t border-border-subtle">
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-neon-cyan mb-4">// open positions</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                {locale === "zh" ? "在招职位" : "Open Positions"}
              </h2>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="space-y-4">
              {jobs.map((job) => (
                <motion.div
                  key={job.title}
                  variants={fadeInUp}
                  className="group p-6 rounded-xl border border-border-subtle bg-bg-secondary/20 hover:border-neon-cyan/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-neon-cyan transition-colors duration-200">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-text-muted font-mono">{job.type}</span>
                        <span className="w-1 h-1 rounded-full bg-border-subtle" />
                        <span className="text-xs text-text-muted font-mono">{job.location}</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-3">{job.desc}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.tags.map((tag) => (
                          <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] text-text-muted border border-border-subtle">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href="mailto:contact@lingqitech.com"
                      className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-display font-bold tracking-wide rounded-lg transition-all duration-300 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
                    >
                      {locale === "zh" ? "投递简历" : "Apply"}
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function CareersPage() {
  return (
    <LocaleProvider>
      <CareersContent />
    </LocaleProvider>
  );
}
