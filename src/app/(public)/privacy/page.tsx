"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const SECTIONS_ZH = [
  {
    title: "1. 信息收集",
    content: "我们在您使用服务时可能收集以下信息：\n- 您主动提供的信息：姓名、邮箱、公司名称、项目需求描述\n- 自动收集的信息：IP 地址、浏览器类型、访问时间、页面浏览记录\n- AI 对话数据：您与 AI 助手的对话内容（用于提供服务和改善体验）",
  },
  {
    title: "2. 信息使用",
    content: "我们将收集的信息用于以下目的：\n- 提供、维护和改善我们的服务\n- 与您沟通项目需求和进展\n- 发送服务相关通知和更新\n- 分析和优化网站性能和用户体验\n- 遵守法律法规要求",
  },
  {
    title: "3. 信息共享",
    content: "我们不会出售您的个人信息。仅在以下情况下共享：\n- 经您明确同意\n- 与受信任的第三方服务提供商合作（如云服务、支付处理），且这些合作方受到严格的数据保护约束\n- 法律法规要求或政府机关依法请求",
  },
  {
    title: "4. 数据安全",
    content: "我们采取行业标准的安全措施保护您的数据：\n- 传输加密（TLS/SSL）\n- 数据存储加密\n- 访问控制和身份验证\n- 定期安全审计\n\n尽管我们努力保护您的信息安全，但互联网传输不存在绝对安全的方法。",
  },
  {
    title: "5. Cookie 政策",
    content: "我们使用 Cookie 和类似技术来：\n- 记住您的语言偏好\n- 分析网站流量和使用模式\n- 优化网站性能\n\n您可以通过浏览器设置管理 Cookie 偏好。禁用 Cookie 可能影响部分功能使用。",
  },
  {
    title: "6. 您的权利",
    content: "您有权：\n- 访问我们持有的您的个人信息\n- 要求更正不准确的信息\n- 要求删除您的个人信息\n- 撤回同意\n- 导出您的数据\n\n如需行使上述权利，请联系 contact@lingqitech.com。",
  },
  {
    title: "7. 政策更新",
    content: "我们可能不时更新本隐私政策。重大变更时将通过网站公告或邮件通知您。继续使用服务即表示您接受更新后的政策。",
  },
];

const SECTIONS_EN = [
  {
    title: "1. Information We Collect",
    content: "We may collect the following information when you use our services:\n- Information you provide: name, email, company name, project requirements\n- Automatically collected: IP address, browser type, access time, page views\n- AI conversation data: your conversations with our AI assistant (used to provide and improve services)",
  },
  {
    title: "2. How We Use Information",
    content: "We use collected information for:\n- Providing, maintaining, and improving our services\n- Communicating project requirements and progress\n- Sending service-related notifications and updates\n- Analyzing and optimizing website performance and user experience\n- Complying with legal requirements",
  },
  {
    title: "3. Information Sharing",
    content: "We do not sell your personal information. We share data only:\n- With your explicit consent\n- With trusted third-party providers (cloud services, payment processors) bound by strict data protection obligations\n- When required by law or government authorities",
  },
  {
    title: "4. Data Security",
    content: "We implement industry-standard security measures:\n- Transport encryption (TLS/SSL)\n- Encrypted data storage\n- Access controls and authentication\n- Regular security audits\n\nWhile we strive to protect your information, no method of internet transmission is 100% secure.",
  },
  {
    title: "5. Cookie Policy",
    content: "We use cookies and similar technologies to:\n- Remember your language preferences\n- Analyze website traffic and usage patterns\n- Optimize website performance\n\nYou can manage cookie preferences through your browser settings. Disabling cookies may affect some functionality.",
  },
  {
    title: "6. Your Rights",
    content: "You have the right to:\n- Access your personal information we hold\n- Request correction of inaccurate information\n- Request deletion of your personal information\n- Withdraw consent\n- Export your data\n\nTo exercise these rights, contact contact@lingqitech.com.",
  },
  {
    title: "7. Policy Updates",
    content: "We may update this privacy policy periodically. Significant changes will be communicated via website notice or email. Continued use of services constitutes acceptance of the updated policy.",
  },
];

export default function PrivacyPage() {
  const { locale } = useLocale();
  const sections = locale === "zh" ? SECTIONS_ZH : SECTIONS_EN;

  return (
    <div className="pt-20">
        <section className="relative py-20 md:py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.p variants={fadeInUp} className="font-mono text-sm tracking-[0.2em] uppercase text-neon-cyan/60 mb-4">// legal</motion.p>
              <motion.h1 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {locale === "zh" ? "隐私政策" : "Privacy Policy"}
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
    </div>
  );
}
