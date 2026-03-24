"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ─── TRANSLATION DEFINITIONS ────────────────────────────────── */

type Locale = "zh" | "en";

const translations: Record<Locale, Translations> = {
  zh: {
    nav: {
      services: "服务",
      portfolio: "作品",
      about: "关于",
      team: "团队",
      contact: "联系",
      cta: "开始对话",
      langToggle: "EN",
    },
    hero: {
      titleAccent: "AI 驱动",
      titleMain: "软件开发新范式",
      subtitle: "与 AI 对话，即可获得网站、小程序、游戏等数字产品。零员工，无限可能。",
      ctaPrimary: "免费咨询",
      ctaSecondary: "查看作品",
      stats: {
        projects: "交付项目",
        satisfaction: "客户满意度",
        response: "响应时间",
        employees: "人工员工",
      },
    },
    howItWorks: {
      title: "四步启动您的项目",
      steps: [
        { title: "描述需求", desc: "用自然语言告诉 AI 你想要什么" },
        { title: "AI 设计方案", desc: "AI 分析需求，生成设计方案和报价" },
        { title: "客户确认", desc: "审核方案细节，确认需求和报价" },
        { title: "交付产品", desc: "确认后 AI 自动开发并交付成品" },
      ],
    },
    services: {
      title: "我们的服务",
      items: [
        {
          title: "网站开发",
          desc: "企业官网、电商、SaaS平台",
          tags: ["响应式设计", "SEO优化", "CMS集成"],
          detail: "从品牌展示到复杂电商，我们使用 Next.js + Tailwind 构建高性能网站。支持 SSR/SSG 实现极致加载速度，内置 SEO 优化确保搜索引擎排名。所有网站均适配手机、平板和桌面端。",
          features: ["自适应多端布局", "Google Lighthouse 90+ 评分", "CMS 后台自主管理内容", "SSL 安全证书 + CDN 加速", "对接支付/物流/CRM 系统"],
        },
        {
          title: "小程序开发",
          desc: "微信/支付宝/抖音小程序",
          tags: ["跨平台", "云开发", "支付集成"],
          detail: "一套代码适配微信、支付宝、抖音多端小程序。基于 Taro/uni-app 跨平台框架，结合云开发能力快速上线，内置微信支付、会员体系、消息推送等核心功能。",
          features: ["微信/支付宝/抖音多端适配", "微信支付 + 支付宝支付对接", "云函数 + 云数据库无服务器架构", "模板消息 + 订阅通知", "分享裂变 + 数据埋点分析"],
        },
        {
          title: "游戏开发",
          desc: "H5游戏、微信小游戏",
          tags: ["2D/3D", "多人联机", "排行榜"],
          detail: "使用 Cocos Creator / Unity WebGL 构建轻量级 H5 游戏和微信小游戏。支持 2D/3D 渲染、物理引擎、多人实时对战，适合营销活动和社交裂变场景。",
          features: ["Cocos Creator / Unity 引擎", "WebSocket 多人实时联机", "全局排行榜 + 成就系统", "微信社交分享 + 裂变拉新", "低延迟优化 60fps 流畅体验"],
        },
        {
          title: "AI 定制",
          desc: "AI Agent、聊天机器人、RAG系统",
          tags: ["大模型", "知识库", "API集成"],
          detail: "基于 DeepSeek/GPT/Claude 大模型，构建企业级 AI 应用。RAG 知识库检索让 AI 精准回答业务问题，支持多轮对话、工具调用和企业知识管理。",
          features: ["DeepSeek / GPT / Claude 多模型支持", "RAG 私有知识库精准问答", "多轮对话 + 上下文记忆", "API/数据库工具调用能力", "对话历史分析 + 持续优化"],
        },
        {
          title: "工业软件定制",
          desc: "MES、ERP、SCADA、数据采集与监控",
          tags: ["工业4.0", "PLC对接", "实时看板"],
          detail: "为制造业提供数字化转型方案。MES 生产执行系统追踪工序流程，SCADA 实时采集设备数据并可视化展示，支持 Modbus/OPC-UA 协议对接各类 PLC 控制器。",
          features: ["MES 工单/质检/追溯全流程", "Modbus / OPC-UA 协议对接", "SCADA 实时数据采集与报警", "生产看板大屏实时展示", "ERP 进销存 + 财务对接"],
        },
        {
          title: "UI/UX 设计",
          desc: "品牌视觉、产品原型、交互设计",
          tags: ["Figma", "设计系统", "用户体验"],
          detail: "从用户调研到高保真原型，提供完整设计服务。构建可复用的设计系统和组件库，确保品牌一致性。支持 Figma 实时协作，设计稿可直接导出开发。",
          features: ["用户调研 + 竞品分析", "线框图 + 高保真原型", "完整设计系统与组件库", "Figma 实时协作交付", "可用性测试 + 迭代优化"],
        },
        {
          title: "数据可视化",
          desc: "BI 大屏、数据报表、实时监控面板",
          tags: ["ECharts", "3D可视化", "大屏适配"],
          detail: "将复杂数据转化为直观的可视化大屏。支持 ECharts / D3.js / Three.js 构建 2D/3D 图表，实时数据流接入，自适应 4K 大屏和多分辨率显示。",
          features: ["ECharts / D3.js 丰富图表库", "Three.js 3D 地图与模型展示", "WebSocket 实时数据流刷新", "4K 大屏自适应布局", "数据钻取 + 多维筛选交互"],
        },
        {
          title: "移动端开发",
          desc: "iOS/Android 原生应用、跨平台App",
          tags: ["Flutter", "React Native", "上架发布"],
          detail: "使用 Flutter 或 React Native 一套代码构建 iOS + Android 双端应用。原生性能体验，支持推送通知、相机、定位等设备能力，协助 App Store / Google Play 上架。",
          features: ["Flutter / React Native 跨平台开发", "iOS + Android 双端一致体验", "推送通知 + 离线缓存", "相机/定位/蓝牙等原生能力", "App Store + Google Play 上架支持"],
        },
      ],
      learnMore: "了解更多",
    },
    portfolio: {
      title: "精选作品",
      filters: ["全部", "网站", "小程序", "游戏", "AI"],
      viewProject: "查看项目 →",
    },
    chatDemo: {
      title: "体验 AI 对话",
      subtitle: "直接与我们的 AI 助手对话，描述您的项目需求",
      botName: "软件加工厂 AI 助手",
      placeholder: "输入您的项目需求...",
      quickReplies: ["我想做一个企业官网", "小程序开发报价", "AI能做什么"],
    },
    founder: {
      quote:
        "我相信 AI 不是替代人类的工具，而是释放无限创造力的伙伴。软件加工厂证明了一件事：当 AI 成为核心生产力，一个人也能创造一家公司。",
      name: "创始人",
      title: "软件加工厂 创始人",
    },
    team: {
      title: "顶尖团队，为您而战",
      subtitle: "我们的工程师和设计师均来自哈佛、MIT、宾大、斯坦福、普林斯顿等世界顶级学府，具备丰富的大厂实战经验。选择我们，就是选择一支精英团队为您的项目保驾护航。",
      sectionLabel: "// 为您打造的技术团队",
      gridLabel: "// 核心团队",
      strengthsLabel: "// 为什么选择我们",
      strengthsTitle: "与我们合作的优势",
      ctaTitle: "准备好开始了吗？",
      ctaSubtitle: "让我们的精英团队将您的想法变为现实。从AI平台到全栈应用，我们以创业速度交付企业级品质。",
      ctaPrimary: "开始项目",
      ctaSecondary: "了解更多",
      stats: [
        { value: "50+", label: "年综合经验" },
        { value: "5", label: "所世界顶级名校" },
        { value: "6", label: "位大厂资深专家" },
        { value: "3", label: "位连续创业者" },
      ],
      universities: ["Harvard", "MIT", "UPenn", "Stanford", "Princeton"],
      members: [
        {
          name: "Wilson Liu",
          role: "创始人 & CEO",
          university: "UPenn / Wharton",
          degree: "MBA, 金融与创业",
          bio: "连续创业者，精通AI与金融科技。负责产品愿景与客户战略，确保每个交付项目都达到最高品质标准。",
          tags: ["前高盛", "2次创业"],
        },
        {
          name: "David Chen",
          role: "CTO & 首席架构师",
          university: "MIT",
          degree: "计算机科学硕士",
          bio: "为每个客户项目设计技术架构。曾构建服务1亿+用户的分布式系统，全面把控代码质量、基础设施与安全。",
          tags: ["前Google Brain", "前Meta"],
        },
        {
          name: "Sarah Zhang",
          role: "AI工程负责人",
          university: "Stanford",
          degree: "机器学习博士",
          bio: "发表过多篇AI论文，将前沿ML技术转化为生产级解决方案。为客户设计智能聊天机器人、推荐引擎和NLP系统。",
          tags: ["前OpenAI", "15+论文"],
        },
        {
          name: "Marcus Williams",
          role: "产品与体验负责人",
          university: "Harvard",
          degree: "MBA, 技术与运营",
          bio: "将复杂需求转化为直觉化、高转化率的界面。曾服务数百万终端用户，每一个像素和交互流程都服务于战略目标。",
          tags: ["前Amazon", "前Shopify"],
        },
        {
          name: "Emily Park",
          role: "高级全栈工程师",
          university: "Princeton",
          degree: "计算机科学学士",
          bio: "端到端功能交付的核心构建者。曾开发处理5000万+美元交易的支付系统，负责从原型到生产的完整交付流程。",
          tags: ["前Stripe", "前Bloomberg"],
        },
        {
          name: "James Rivera",
          role: "战略与交付负责人",
          university: "Harvard",
          degree: "MBA, 战略与营销",
          bio: "确保每个项目按时交付且超出预期。曾将多家初创企业从零做到七位数收入，管理客户关系并推动业务成果。",
          tags: ["前McKinsey", "YC 校友"],
        },
      ],
      strengths: [
        {
          title: "顶级工程人才",
          description: "您项目的每位工程师都持有哈佛、MIT、斯坦福、宾大或普林斯顿学位。这意味着严谨的问题解决能力、深厚的技术专长，以及最高标准的交付。",
        },
        {
          title: "规模化实战经验",
          description: "我们的团队在Google、Amazon、Stripe和Meta交付过生产系统。同样的纪律应用于您的项目：稳健架构、整洁代码、完善测试、零妥协。",
        },
        {
          title: "真正有效的AI",
          description: "由前OpenAI博士领衔AI工程，我们构建的智能功能不止于噱头。从聊天机器人到推荐引擎，我们的AI方案为用户带来真实、可量化的价值。",
        },
        {
          title: "端到端交付",
          description: "从产品策略和UX设计到全栈开发和部署，我们全程负责。您获得的是一支专属团队，而非自由职业者。我们对结果负责，让您专注于业务增长。",
        },
      ],
    },
    footer: {
      description: "纯AI驱动的软件开发公司，用对话创造数字产品。",
      services: "服务",
      company: "公司",
      contactUs: "联系我们",
      aboutUs: "关于我们",
      blog: "博客",
      careers: "加入我们",
      email: "contact@lingqitech.com",
      location: "中国 - 远程办公",
      copyright: "软件加工厂",
      allRights: "保留所有权利",
      privacy: "隐私政策",
      terms: "服务条款",
    },
    chat: {
      tooltip: "与 AI 对话",
      botName: "软件加工厂 AI",
      placeholder: "输入消息...",
      poweredBy: "Powered by DeepSeek",
      greeting: "你好！我是软件加工厂 AI 助手。告诉我你想做什么项目，我来帮你分析和报价。",
      quickReplies: ["我想做一个企业官网", "小程序开发报价", "AI能做什么"],
    },
  },
  en: {
    nav: {
      services: "Services",
      portfolio: "Portfolio",
      about: "About",
      team: "Team",
      contact: "Contact",
      cta: "Start Chat",
      langToggle: "中",
    },
    hero: {
      titleAccent: "AI-Powered",
      titleMain: "Software Development Reimagined",
      subtitle:
        "Talk to AI to get websites, mini-programs, games and more. Zero employees, infinite possibilities.",
      ctaPrimary: "Free Consultation",
      ctaSecondary: "View Portfolio",
      stats: {
        projects: "Projects Delivered",
        satisfaction: "Client Satisfaction",
        response: "Response Time",
        employees: "Human Employees",
      },
    },
    howItWorks: {
      title: "Launch Your Project in 4 Steps",
      steps: [
        { title: "Describe", desc: "Tell AI what you want in plain language" },
        { title: "AI Designs", desc: "AI analyzes needs and generates a plan & quote" },
        { title: "Confirm", desc: "Review the proposal, confirm scope & pricing" },
        { title: "Deliver", desc: "After approval, AI develops and delivers" },
      ],
    },
    services: {
      title: "Our Services",
      items: [
        {
          title: "Web Development",
          desc: "Corporate sites, e-commerce, SaaS platforms",
          tags: ["Responsive", "SEO", "CMS"],
          detail: "We build high-performance websites using Next.js + Tailwind. SSR/SSG for blazing-fast load times, built-in SEO optimization for search ranking, and fully responsive across mobile, tablet, and desktop.",
          features: ["Responsive multi-device layouts", "Google Lighthouse 90+ scores", "CMS backend for self-managed content", "SSL certificates + CDN acceleration", "Payment / logistics / CRM integrations"],
        },
        {
          title: "Mini Programs",
          desc: "WeChat / Alipay / Douyin mini programs",
          tags: ["Cross-platform", "Cloud", "Payments"],
          detail: "One codebase for WeChat, Alipay, and Douyin mini programs. Built on Taro/uni-app cross-platform frameworks with cloud functions for rapid deployment, including payments, membership systems, and push notifications.",
          features: ["WeChat / Alipay / Douyin multi-platform", "WeChat Pay + Alipay integration", "Cloud functions + serverless architecture", "Template messages + subscription notifications", "Social sharing + analytics tracking"],
        },
        {
          title: "Game Development",
          desc: "H5 games, WeChat mini games",
          tags: ["2D/3D", "Multiplayer", "Leaderboards"],
          detail: "Lightweight H5 and WeChat mini games built with Cocos Creator or Unity WebGL. Support for 2D/3D rendering, physics engines, and real-time multiplayer — ideal for marketing campaigns and viral social sharing.",
          features: ["Cocos Creator / Unity engine", "WebSocket real-time multiplayer", "Global leaderboards + achievement systems", "Social sharing + viral growth mechanics", "60fps low-latency optimized experience"],
        },
        {
          title: "AI Custom",
          desc: "AI Agents, chatbots, RAG systems",
          tags: ["LLM", "Knowledge Base", "API"],
          detail: "Enterprise AI applications powered by DeepSeek/GPT/Claude. RAG knowledge retrieval for precise domain Q&A, multi-turn conversations, tool calling capabilities, and enterprise knowledge management.",
          features: ["DeepSeek / GPT / Claude multi-model support", "RAG private knowledge base Q&A", "Multi-turn conversation + context memory", "API / database tool calling", "Conversation analytics + continuous optimization"],
        },
        {
          title: "Industrial Software",
          desc: "MES, ERP, SCADA, data acquisition & monitoring",
          tags: ["Industry 4.0", "PLC", "Real-time Dashboard"],
          detail: "Digital transformation solutions for manufacturing. MES for production workflow tracking, SCADA for real-time data collection and visualization, with Modbus/OPC-UA protocol support for PLC controllers.",
          features: ["MES work orders / QC / full traceability", "Modbus / OPC-UA protocol integration", "SCADA real-time data collection & alerting", "Production dashboard large-screen display", "ERP inventory + financial integration"],
        },
        {
          title: "UI/UX Design",
          desc: "Brand visuals, prototypes, interaction design",
          tags: ["Figma", "Design Systems", "UX"],
          detail: "End-to-end design services from user research to hi-fi prototypes. We build reusable design systems and component libraries for brand consistency, with real-time Figma collaboration and developer-ready exports.",
          features: ["User research + competitive analysis", "Wireframes + hi-fi prototypes", "Complete design system & component library", "Real-time Figma collaboration delivery", "Usability testing + iterative refinement"],
        },
        {
          title: "Data Visualization",
          desc: "BI dashboards, reports, real-time monitoring panels",
          tags: ["ECharts", "3D Viz", "Large Screens"],
          detail: "Transform complex data into intuitive visual dashboards. ECharts / D3.js / Three.js for 2D/3D charts, real-time data streaming, and adaptive layouts for 4K displays and multi-resolution screens.",
          features: ["ECharts / D3.js rich chart library", "Three.js 3D maps & model rendering", "WebSocket real-time data streaming", "4K large-screen adaptive layout", "Data drill-down + multi-dimensional filtering"],
        },
        {
          title: "Mobile Development",
          desc: "iOS/Android native apps, cross-platform apps",
          tags: ["Flutter", "React Native", "App Store"],
          detail: "Single codebase iOS + Android apps using Flutter or React Native. Native performance with push notifications, camera, GPS, and other device APIs. We assist with App Store and Google Play submissions.",
          features: ["Flutter / React Native cross-platform", "iOS + Android consistent experience", "Push notifications + offline caching", "Camera / GPS / Bluetooth native APIs", "App Store + Google Play submission support"],
        },
      ],
      learnMore: "Learn More",
    },
    portfolio: {
      title: "Featured Work",
      filters: ["All", "Web", "Mini App", "Game", "AI"],
      viewProject: "View Project →",
    },
    chatDemo: {
      title: "Experience AI Chat",
      subtitle: "Talk directly to our AI assistant about your project",
      botName: "Software Factory AI Assistant",
      placeholder: "Describe your project...",
      quickReplies: ["I want a corporate website", "Mini program pricing", "What can AI do"],
    },
    founder: {
      quote:
        "I believe AI is not a tool to replace humans, but a partner to unleash infinite creativity. Software Factory Tech proves one thing: when AI becomes the core productivity, one person can build a company.",
      name: "Founder",
      title: "Founder, Software Factory Technology Co., Ltd.",
    },
    team: {
      title: "The Team Building Your Vision",
      subtitle: "Our engineers and designers come from Harvard, MIT, UPenn, Stanford, and Princeton — with deep experience at the world's leading tech companies. When you work with us, an elite team is dedicated to your project.",
      sectionLabel: "// The Team Behind Your Project",
      gridLabel: "// Core Team",
      strengthsLabel: "// Why Choose Us",
      strengthsTitle: "The Advantage of Working With Us",
      ctaTitle: "Ready to Build Something Great?",
      ctaSubtitle: "Let our elite team bring your vision to life. From AI-powered platforms to full-stack applications, we deliver enterprise-quality solutions with startup speed.",
      ctaPrimary: "Start a Project",
      ctaSecondary: "Learn More",
      stats: [
        { value: "50+", label: "Years Combined Experience" },
        { value: "5", label: "Top-Tier Universities" },
        { value: "6", label: "Ex-FAANG Experts" },
        { value: "3", label: "Serial Entrepreneurs" },
      ],
      universities: ["Harvard", "MIT", "UPenn", "Stanford", "Princeton"],
      members: [
        {
          name: "Wilson Liu",
          role: "Founder & CEO",
          university: "UPenn / Wharton",
          degree: "MBA, Finance & Entrepreneurship",
          bio: "Serial entrepreneur with deep expertise in AI and fintech. Leads overall product vision and client strategy. Ensures every project delivered meets the highest standard of quality and innovation.",
          tags: ["Ex-Goldman Sachs", "2x Founder"],
        },
        {
          name: "David Chen",
          role: "CTO & Lead Architect",
          university: "MIT",
          degree: "M.S. Computer Science & AI",
          bio: "Designs the technical architecture behind every client engagement. Built distributed systems at scale serving 100M+ users. Oversees code quality, infrastructure, and security for all projects.",
          tags: ["Ex-Google Brain", "Ex-Meta"],
        },
        {
          name: "Sarah Zhang",
          role: "Head of AI Engineering",
          university: "Stanford",
          degree: "Ph.D. Machine Learning",
          bio: "Published AI researcher who translates cutting-edge ML into production-ready solutions. Designs intelligent chatbots, recommendation engines, and NLP pipelines for clients across industries.",
          tags: ["Ex-OpenAI", "15+ Publications"],
        },
        {
          name: "Marcus Williams",
          role: "Head of Product & UX",
          university: "Harvard",
          degree: "MBA, Technology & Operations",
          bio: "Turns complex requirements into intuitive, conversion-optimized interfaces. Led product teams shipping to millions of users. Every pixel and user flow serves a strategic purpose.",
          tags: ["Ex-Amazon", "Ex-Shopify"],
        },
        {
          name: "Emily Park",
          role: "Senior Full-Stack Engineer",
          university: "Princeton",
          degree: "B.S.E. Computer Science",
          bio: "Core builder responsible for end-to-end feature delivery. Engineered payment systems processing $50M+ in transactions. Owns the entire delivery pipeline from prototype to production.",
          tags: ["Ex-Stripe", "Ex-Bloomberg"],
        },
        {
          name: "James Rivera",
          role: "Head of Strategy & Delivery",
          university: "Harvard",
          degree: "MBA, Strategy & Marketing",
          bio: "Ensures every project ships on time and exceeds expectations. Scaled multiple startups from zero to seven-figure revenue. Manages client relationships and aligns delivery with business outcomes.",
          tags: ["Ex-McKinsey", "YC Alum"],
        },
      ],
      strengths: [
        {
          title: "Top-Tier Engineering Talent",
          description: "Every engineer on your project holds a degree from Harvard, MIT, Stanford, UPenn, or Princeton. This means rigorous problem-solving, deep technical expertise, and solutions built to the highest standard.",
        },
        {
          title: "Proven at Scale",
          description: "Our team has shipped production systems at Google, Amazon, Stripe, and Meta. We bring that same discipline to your project: robust architecture, clean code, thorough testing, and zero shortcuts.",
        },
        {
          title: "AI That Actually Works",
          description: "With an ex-OpenAI PhD leading AI engineering, we build intelligent features that go beyond buzzwords. From chatbots to recommendation engines, our AI solutions deliver real, measurable value.",
        },
        {
          title: "End-to-End Delivery",
          description: "From product strategy and UX design to full-stack development and deployment, we handle it all. You get a dedicated team, not freelancers. We own the outcome, so you can focus on growing your business.",
        },
      ],
    },
    footer: {
      description:
        "Pure AI-driven software development company, creating digital products through conversation.",
      services: "Services",
      company: "Company",
      contactUs: "Contact Us",
      aboutUs: "About Us",
      blog: "Blog",
      careers: "Careers",
      email: "contact@lingqitech.com",
      location: "China - Remote",
      copyright: "Software Factory Technology Co., Ltd.",
      allRights: "All rights reserved",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    chat: {
      tooltip: "Chat with AI",
      botName: "Software Factory AI",
      placeholder: "Type a message...",
      poweredBy: "Powered by DeepSeek",
      greeting:
        "Hello! I'm the Software Factory AI assistant. Tell me about your project, and I'll help analyze and provide a quote.",
      quickReplies: ["I want a corporate website", "Mini program pricing", "What can AI do"],
    },
  },
};

/* ─── Derived types ───────────────────────────────────────────── */

type StepEntry = { title: string; desc: string };
type ServiceEntry = { title: string; desc: string; tags: string[]; detail: string; features: string[] };

interface TeamMemberT {
  name: string;
  role: string;
  university: string;
  degree: string;
  bio: string;
  tags: string[];
}

interface TeamT {
  title: string;
  subtitle: string;
  sectionLabel: string;
  gridLabel: string;
  strengthsLabel: string;
  strengthsTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: { value: string; label: string }[];
  universities: string[];
  members: TeamMemberT[];
  strengths: { title: string; description: string }[];
}

interface Translations {
  nav: {
    services: string;
    portfolio: string;
    about: string;
    team: string;
    contact: string;
    cta: string;
    langToggle: string;
  };
  hero: {
    titleAccent: string;
    titleMain: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      projects: string;
      satisfaction: string;
      response: string;
      employees: string;
    };
  };
  howItWorks: {
    title: string;
    steps: StepEntry[];
  };
  services: {
    title: string;
    items: ServiceEntry[];
    learnMore: string;
  };
  portfolio: {
    title: string;
    filters: string[];
    viewProject: string;
  };
  chatDemo: {
    title: string;
    subtitle: string;
    botName: string;
    placeholder: string;
    quickReplies: string[];
  };
  founder: {
    quote: string;
    name: string;
    title: string;
  };
  team: TeamT;
  footer: {
    description: string;
    services: string;
    company: string;
    contactUs: string;
    aboutUs: string;
    blog: string;
    careers: string;
    email: string;
    location: string;
    copyright: string;
    allRights: string;
    privacy: string;
    terms: string;
  };
  chat: {
    tooltip: string;
    botName: string;
    placeholder: string;
    poweredBy: string;
    greeting: string;
    quickReplies: string[];
  };
}

/* ─── CONTEXT ─────────────────────────────────────────────────── */

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/* ─── PROVIDER ────────────────────────────────────────────────── */

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "zh" ? "en" : "zh"));
  }, []);

  const value: LocaleContextValue = {
    locale,
    t: translations[locale],
    toggleLocale,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/* ─── HOOK ────────────────────────────────────────────────────── */

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
