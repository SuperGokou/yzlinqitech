# 🤖 凌柒科技 — Multi-Agent Build Prompt (Claude Code / Opus)

> **使用方法**: 将此文件放到项目根目录，在 Claude Code 中执行下方的 Master Prompt。
> **前置要求**: 确保 `Bluesoft platform plan.md` 已在项目根目录。

---

## 📋 Master Prompt（粘贴到 Claude Code 执行）

```
读取项目根目录的 "Bluesoft platform plan.md" 和 "LINGQI-AGENTS.md"，严格按照 Bluesoft platform plan 的规范和流程，以 LINGQI-AGENTS.md 中定义的 4 个 Agent 角色分阶段执行凌柒科技商业官网的开发。

项目概述：
- 公司：凌柒科技有限公司
- 定位：纯 AI 驱动的软件开发公司，0 员工，客户与 AI 机器人对话即可获得网页/小程序/游戏等数字产品
- 核心功能：AI 聊天机器人（DeepSeek API + RAG 架构）、作品展示、中英文双语（默认中文）、创始人介绍
- Logo 文件：logo.jpg（不是 png）
- 目标：商业化标准，可直接部署上线

严格按照以下 4 个 Agent 角色依次执行每个阶段，每个阶段完成后自我审查，不合格则重做：

---

### Agent 1: 🎨 UI 设计师 (UI Architect)
负责范围：视觉设计系统、配色方案、字体排版、组件规范、动效规范
执行标准：
- 定义完整 Design Token（颜色、间距、圆角、阴影、动效曲线）
- 设计系统必须导出为 CSS 变量 + Tailwind 配置
- 所有页面区块出 wireframe → 高保真规范
- 风格方向：暗色赛博朋克 + 玻璃拟态 + 霓虹点缀，但保持商业级克制感
- 响应式断点规范：mobile 375px / tablet 768px / desktop 1280px / wide 1440px
- 动效规范：进场动画、hover 状态、滚动触发、加载状态全部定义
- Logo 使用 logo.jpg，设计 logo 在导航栏和 footer 的展示规范
- 交付物：design-system.css、tailwind.config 扩展、组件规范文档

### Agent 2: 🖥️ 前端工程师 (Frontend Engineer)
负责范围：所有前端代码实现
执行标准：
- 框架：Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- 严格按照 Agent 1 的设计规范实现，像素级还原
- 页面结构：
  - Hero 主视觉（公司 slogan + 核心数据 + CTA）
  - 工作流程（3 步流程卡片）
  - 服务介绍（网站/小程序/游戏/AI定制 四大板块）
  - 作品展示（6+ 项目卡片，支持点击展开详情或跳转）
  - AI 对话体验区（嵌入 AI 聊天组件，接 Agent 3 的后端 API）
  - 创始人介绍（头像 + 简介 + 愿景引用）
  - 技术栈走马灯
  - Footer（导航 + 版权 + 联系方式）
- 中英文切换：使用 next-intl 或 i18next，默认 zh-CN，支持 en
- SEO：每个页面完整 meta tags、Open Graph、structured data
- 性能：Lighthouse 评分 > 90（Performance/Accessibility/SEO/Best Practices）
- 动效：使用 Framer Motion，所有 scroll reveal + hover + page transition
- AI 聊天组件：
  - 独立 React 组件 <AIChatWidget />
  - 支持流式输出（SSE）
  - 打字机效果
  - 对话历史保持
  - 输入框 + 发送按钮 + 加载状态
  - 调用 Agent 3 提供的 /api/chat 端点
- 交付物：完整前端代码、README 部署文档

### Agent 3: ⚙️ 后端工程师 (Backend & AI Engineer)
负责范围：API 服务、AI 聊天机器人、RAG 系统、部署
执行标准：
- 框架：FastAPI (Python) 或 Next.js API Routes（与前端统一）
- AI 聊天机器人架构：

  ```
  用户输入
    ↓
  意图识别（DeepSeek API）
    ↓
  RAG 检索（向量数据库查询相关文档/案例）
    ↓
  Prompt 组装（系统提示 + 检索上下文 + 用户消息）
    ↓
  DeepSeek API 生成回复（流式 SSE）
    ↓
  前端展示
  ```

- DeepSeek API 集成：
  - 使用 DeepSeek Chat API（兼容 OpenAI SDK 格式）
  - 端点：https://api.deepseek.com/v1/chat/completions
  - 模型：deepseek-chat（或 deepseek-reasoner 用于复杂需求分析）
  - API Key 通过环境变量 DEEPSEEK_API_KEY 配置
  - 实现流式响应（stream: true）
  - System Prompt 定义凌柒 AI 助手人设：
    - 角色：凌柒科技的 AI 产品顾问
    - 能力：需求分析、方案设计、报价估算、技术选型建议
    - 风格：专业友善、主动引导、中英文自适应

- RAG 知识库：
  - 向量数据库：选用 ChromaDB（轻量本地）或 Pinecone（云端生产）
  - Embedding 模型：DeepSeek Embedding API 或 sentence-transformers
  - 知识源文档：
    - 公司介绍和服务说明
    - 历史项目案例库（作品集详细信息）
    - 定价方案和交付流程
    - 常见问题 FAQ
    - 技术栈和能力说明
  - 检索策略：Top-K 相似度检索 (k=3-5) + 相关度阈值过滤
  - Chunk 策略：512 tokens，overlap 50 tokens

- API 端点设计：
  - POST /api/chat — AI 对话（SSE 流式）
  - GET /api/portfolio — 获取作品列表
  - POST /api/contact — 联系表单提交
  - GET /api/health — 健康检查

- 部署方案：
  - 前端：Vercel（Next.js 原生支持）
  - 后端 API（如独立 FastAPI）：Railway / Fly.io / 云服务器
  - 向量数据库：ChromaDB Docker 或 Pinecone 云
  - 域名 + SSL + CDN 配置文档
  - 环境变量清单和 .env.example

- 安全：
  - API Rate Limiting（每 IP 每分钟 20 次对话请求）
  - 输入清洗和 XSS 防护
  - DeepSeek API Key 不暴露到前端
  - CORS 白名单配置

- 交付物：完整后端代码、API 文档、部署脚本、docker-compose.yml

### Agent 4: 🧭 技术总监 (Tech Lead & Coordinator)
负责范围：架构决策、质量审查、集成测试、商业化验收
执行标准：
- 在每个 Agent 完成阶段任务后，执行 Code Review：
  - [ ] 代码规范：ESLint/Prettier 零错误
  - [ ] TypeScript 严格模式，无 any 类型
  - [ ] 所有 API 调用有错误处理和 loading 状态
  - [ ] 响应式在 375px / 768px / 1280px / 1440px 全部验证
  - [ ] 中英文切换无遗漏、无布局破裂
  - [ ] AI 聊天功能端到端可用（含降级处理：API 不可用时的友好提示）
  - [ ] Lighthouse 全项 > 90
  - [ ] 所有图片使用 next/image 优化，logo.jpg 正确引用
  - [ ] 无 console.log / 硬编码密钥 / TODO 遗留
  - [ ] Git commit message 规范（conventional commits）
- 集成测试：
  - 前后端联调：聊天功能、作品展示、语言切换
  - 跨浏览器测试：Chrome / Safari / Firefox
  - 移动端触控和滚动体验
- 商业化 Checklist：
  - [ ] 首屏加载 < 2秒
  - [ ] 核心 Web Vitals 达标（LCP < 2.5s, FID < 100ms, CLS < 0.1）
  - [ ] favicon + apple-touch-icon + social preview image 完整
  - [ ] robots.txt + sitemap.xml 生成
  - [ ] Google Analytics / 百度统计 埋点预留
  - [ ] 404 页面设计
  - [ ] 隐私政策 / 使用条款页面（框架）
  - [ ] 无障碍 a11y 基础合规（键盘导航、aria 标签、对比度）
- 不合格项必须退回对应 Agent 重做，直到通过全部 checklist

---

执行顺序：
Phase 1 → Agent 1 出设计系统 → Agent 4 审查
Phase 2 → Agent 2 前端开发 + Agent 3 后端开发（可并行）→ Agent 4 审查
Phase 3 → Agent 4 主导集成测试 + 商业化验收
Phase 4 → Agent 3 部署上线 → Agent 4 最终验收

每个 Phase 完成后暂停，向我报告进度和 checklist 通过情况，等我确认后再进入下一阶段。

开始执行 Phase 1。
```

---

## 🗂️ 项目结构参考

```
lingqi-tech/
├── Bluesoft platform plan.md    ← 你的平台规范文档
├── LINGQI-AGENTS.md             ← 本文件
├── public/
│   ├── logo.jpg                 ← Logo 文件（jpg 格式）
│   ├── favicon.ico
│   └── images/
│       └── portfolio/           ← 作品截图
├── src/
│   ├── app/                     ← Next.js App Router
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── chat/route.ts    ← AI 聊天 SSE 端点
│   │       ├── portfolio/route.ts
│   │       └── contact/route.ts
│   ├── components/
│   │   ├── ui/                  ← 基础 UI 组件
│   │   ├── sections/            ← 页面区块
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── ChatDemo.tsx
│   │   │   ├── Founder.tsx
│   │   │   └── TechMarquee.tsx
│   │   └── chat/
│   │       └── AIChatWidget.tsx ← AI 聊天组件
│   ├── lib/
│   │   ├── deepseek.ts          ← DeepSeek API 封装
│   │   ├── rag.ts               ← RAG 检索逻辑
│   │   └── vectordb.ts          ← 向量数据库连接
│   ├── i18n/
│   │   ├── zh.json
│   │   └── en.json
│   └── styles/
│       └── design-tokens.css    ← Agent 1 输出的设计变量
├── knowledge/                   ← RAG 知识库文档
│   ├── company-intro.md
│   ├── services.md
│   ├── portfolio-cases.md
│   ├── pricing.md
│   └── faq.md
├── scripts/
│   ├── seed-vectordb.ts         ← 知识库入库脚本
│   └── deploy.sh
├── docker-compose.yml
├── .env.example
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 🔑 环境变量模板 (.env.example)

```env
# DeepSeek API
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# Vector Database (ChromaDB local or Pinecone cloud)
VECTOR_DB_TYPE=chroma          # chroma | pinecone
CHROMA_PERSIST_DIR=./data/chroma
# PINECONE_API_KEY=
# PINECONE_INDEX=lingqi-knowledge

# App
NEXT_PUBLIC_SITE_URL=https://lingqitech.com
NEXT_PUBLIC_DEFAULT_LOCALE=zh

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_BAIDU_ID=xxxxxxxxxx
```

---

## 📌 关键提醒

1. **Logo 格式**：全项目使用 `logo.jpg`，所有引用路径确认无误
2. **Bluesoft 规范优先**：任何与本文件冲突的地方，以 `Bluesoft platform plan.md` 为准
3. **DeepSeek API 兼容 OpenAI SDK**：可直接用 `openai` npm 包，改 baseURL 即可
4. **分阶段暂停**：每阶段完成后等待确认，不要一口气跑完
5. **商业化标准**：这不是 demo，是要直接上线的产品
