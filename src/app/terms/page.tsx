"use client";

import { motion } from "framer-motion";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const SECTIONS_ZH = [
  {
    title: "1. 服务范围",
    content: "凌柒科技（以下简称「我们」）通过本网站及相关渠道提供软件开发服务，包括但不限于：\n- 网站开发（企业官网、电商平台、SaaS 系统）\n- 小程序开发（微信、支付宝、抖音）\n- 游戏开发（H5、微信小游戏）\n- AI 应用定制（Agent、聊天机器人、RAG 系统）\n- 工业软件开发（MES、ERP、SCADA）\n- UI/UX 设计、数据可视化、移动端开发",
  },
  {
    title: "2. 项目流程",
    content: "标准项目合作流程如下：\n- 需求沟通：通过 AI 助手或人工沟通确认需求\n- 方案报价：AI 生成设计方案和费用估算，经人工审核后发送\n- 客户确认：您审核方案并签署合作协议\n- 开发交付：按约定里程碑进行开发，定期同步进展\n- 验收上线：您验收成果并确认交付\n\n具体流程以双方签署的项目合同为准。",
  },
  {
    title: "3. 费用与支付",
    content: "- 项目报价根据需求复杂度、工期和技术栈确定\n- 通常采用分期付款：签约付 40%，中期付 30%，验收付 30%\n- 支持银行转账、支付宝、微信支付等方式\n- 已完成的开发工作对应的费用不予退还\n- 具体付款条款以项目合同约定为准",
  },
  {
    title: "4. 知识产权",
    content: "- 项目尾款全额结清后，定制开发的源代码和设计稿的知识产权归您所有\n- 我们保留使用通用框架、工具和组件库的权利（非客户专属部分）\n- 未经书面同意，我们不会将您的定制代码用于其他项目\n- 我们保留将项目纳入案例展示的权利（仅展示公开信息，不涉及源代码）",
  },
  {
    title: "5. 保密条款",
    content: "- 双方应对合作过程中获知的对方商业秘密和技术秘密严格保密\n- 保密期限为合作结束后 2 年\n- AI 对话数据仅用于服务提供和改善，不会泄露给第三方\n- 如需签署单独的保密协议（NDA），请在项目启动前提出",
  },
  {
    title: "6. 售后服务",
    content: "- 项目交付后提供 30 天免费 bug 修复期\n- Bug 定义：功能未按需求文档实现或出现运行错误\n- 新增功能、设计变更不在免费修复范围内\n- 30 天后可签订维护合同，按月或按年付费",
  },
  {
    title: "7. 免责声明",
    content: "- AI 助手提供的报价和方案为初步估算，最终以人工确认为准\n- 我们不保证网站/应用在所有网络环境下的可用性\n- 因客户提供的内容（文字、图片等）导致的法律纠纷由客户承担\n- 因不可抗力（自然灾害、政策变更、第三方服务中断等）导致的延期或损失，我们不承担责任",
  },
  {
    title: "8. 争议解决",
    content: "- 双方应首先通过友好协商解决争议\n- 协商不成的，任一方可向被告所在地有管辖权的人民法院提起诉讼\n- 本条款的解释和执行适用中华人民共和国法律",
  },
];

const SECTIONS_EN = [
  {
    title: "1. Scope of Services",
    content: "LingQi Tech (\"we\", \"us\") provides software development services through this website, including but not limited to:\n- Web development (corporate sites, e-commerce, SaaS)\n- Mini program development (WeChat, Alipay, Douyin)\n- Game development (H5, WeChat mini games)\n- AI application development (Agents, chatbots, RAG systems)\n- Industrial software (MES, ERP, SCADA)\n- UI/UX design, data visualization, mobile development",
  },
  {
    title: "2. Project Process",
    content: "Standard project workflow:\n- Requirements: Confirmed via AI assistant or direct communication\n- Proposal: AI generates design proposal and cost estimate, reviewed by our team\n- Client Confirmation: You review the proposal and sign the agreement\n- Development: Built according to agreed milestones with regular progress updates\n- Delivery: You accept deliverables and confirm completion\n\nSpecific processes are governed by the signed project contract.",
  },
  {
    title: "3. Fees & Payment",
    content: "- Project pricing is based on complexity, timeline, and tech stack\n- Standard payment schedule: 40% at signing, 30% at midpoint, 30% at delivery\n- Payment via bank transfer, PayPal, or other agreed methods\n- Fees for completed work are non-refundable\n- Specific payment terms are governed by the project contract",
  },
  {
    title: "4. Intellectual Property",
    content: "- Upon full payment, IP rights for custom-developed source code and designs transfer to you\n- We retain rights to use general frameworks, tools, and component libraries (non-client-specific portions)\n- We will not use your custom code for other projects without written consent\n- We reserve the right to showcase the project in our portfolio (public information only, no source code)",
  },
  {
    title: "5. Confidentiality",
    content: "- Both parties shall maintain strict confidentiality of business and technical secrets learned during collaboration\n- Confidentiality period: 2 years after project completion\n- AI conversation data is used solely for service provision and improvement\n- If a separate NDA is required, please request it before project kickoff",
  },
  {
    title: "6. After-Sales Support",
    content: "- 30-day free bug fix period after project delivery\n- Bug defined as: functionality not implemented per requirements or runtime errors\n- New features and design changes are not covered under free fixes\n- After 30 days, maintenance contracts available on monthly or annual basis",
  },
  {
    title: "7. Disclaimers",
    content: "- AI assistant quotes and proposals are preliminary estimates; final terms require human confirmation\n- We do not guarantee availability in all network environments\n- Legal disputes arising from client-provided content (text, images, etc.) are the client's responsibility\n- We are not liable for delays or losses due to force majeure (natural disasters, policy changes, third-party service interruptions)",
  },
  {
    title: "8. Dispute Resolution",
    content: "- Parties shall first attempt to resolve disputes through friendly negotiation\n- If negotiation fails, either party may file litigation in the competent court of the defendant's jurisdiction\n- These terms are governed by the laws of the People's Republic of China (for China-based services) or the State of Pennsylvania, USA (for US-based services)",
  },
];

function TermsContent() {
  const { locale } = useLocale();
  const sections = locale === "zh" ? SECTIONS_ZH : SECTIONS_EN;

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="relative py-20 md:py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.p variants={fadeInUp} className="font-mono text-sm tracking-[0.2em] uppercase text-neon-cyan/60 mb-4">// legal</motion.p>
              <motion.h1 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {locale === "zh" ? "服务条款" : "Terms of Service"}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm text-text-muted font-mono mb-12">
                {locale === "zh" ? "最后更新：2025 年 3 月 1 日" : "Last updated: March 1, 2025"}
              </motion.p>

              {sections.map((s) => (
                <motion.div key={s.title} variants={fadeInUp} className="mb-10">
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">{s.title}</h2>
                  <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{s.content}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function TermsPage() {
  return (
    <LocaleProvider>
      <TermsContent />
    </LocaleProvider>
  );
}
