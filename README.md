<p align="center">
  <img src="public/logo.avif" width="80" height="80" alt="LingQi Tech" style="border-radius: 16px;" />
</p>

<h1 align="center">LingQi Tech</h1>
<p align="center"><strong>AI-Powered Software Factory</strong></p>

<p align="center">
  <a href="https://lingqitech.com"><img src="https://img.shields.io/badge/Website-lingqitech.com-00e5ff?style=for-the-badge&logo=vercel&logoColor=white" alt="Website" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-00e5ff?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/DeepSeek-API-b44aff?style=flat-square&logo=openai&logoColor=white" alt="DeepSeek" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/i18n-zh_|_en-f59e0b?style=flat-square" alt="i18n" />
</p>

---

## Overview

Talk to AI, get production-ready software. LingQi Tech is a zero-employee, AI-driven software factory that delivers websites, mini programs, games, and enterprise systems.

**Key Features**

- 8 service categories with detailed modal breakdowns
- AI chatbot powered by DeepSeek + RAG knowledge retrieval
- Bilingual (Chinese / English) with seamless locale toggle
- 4-step animated process flow
- Team page with university credentials
- Tech stack marquee with official logos
- Fully responsive dark-theme UI with glassmorphism

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.9 |
| **UI** | React 19 + Tailwind CSS 4.2 |
| **Animation** | Framer Motion 12 |
| **AI** | DeepSeek API (OpenAI-compatible) |
| **Search** | RAG keyword retrieval engine |
| **i18n** | React Context (zh / en) |
| **Deploy** | Vercel |

---

## Quick Start

```bash
# Clone
git clone https://github.com/SuperGokou/linqiTech.git
cd linqiTech

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your DeepSeek API key

# Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `DEEPSEEK_API_KEY` | Yes | — | DeepSeek API key for AI chatbot |
| `DEEPSEEK_MODEL` | No | `deepseek-chat` | Model name |
| `NEXT_PUBLIC_SITE_URL` | No | `https://yzlinqitech.vercel.app` | Production URL |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chatbot SSE endpoint
│   │   └── health/route.ts        # Health check
│   ├── team/page.tsx              # Team page
│   ├── layout.tsx                 # Root layout + SEO
│   ├── page.tsx                   # Home (all sections)
│   └── sitemap.ts                 # Dynamic sitemap
├── components/
│   ├── sections/                  # 9 page sections
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── AIChatDemo.tsx
│   │   ├── FounderSection.tsx
│   │   ├── TechStackMarquee.tsx
│   │   └── Footer.tsx
│   └── chat/
│       └── ChatWidget.tsx         # Floating AI assistant
├── contexts/
│   └── LocaleContext.tsx          # zh/en translations
├── lib/
│   ├── motion.ts                  # Animation presets
│   ├── types.ts                   # Shared types
│   └── rag/                       # Knowledge retrieval
└── styles/
    └── design-tokens.css          # CSS custom properties
```

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
vercel env add DEEPSEEK_API_KEY
```

Or connect the GitHub repo for auto-deploy on push.

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
```

---

## License

MIT
