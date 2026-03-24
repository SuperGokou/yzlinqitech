# 凌柒科技 - 官方网站

纯 AI 驱动的软件开发公司官网。与 AI 对话，即可获得网站、小程序、游戏等数字产品。

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + CSS Custom Properties
- **Animation**: Framer Motion
- **AI Chatbot**: DeepSeek API + RAG (keyword-based retrieval)
- **i18n**: Client-side zh/en toggle via React Context
- **Deploy**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key for AI chatbot |
| `DEEPSEEK_MODEL` | No | Model name (default: `deepseek-chat`) |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL (default: `https://lingqitech.com`) |

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set secrets
vercel env add DEEPSEEK_API_KEY
```

Or connect the GitHub repo to Vercel for automatic deployments.

## Project Structure

```
src/
  app/
    api/
      chat/route.ts        # AI chatbot SSE endpoint
      health/route.ts       # Health check
    globals.css             # Tailwind v4 theme + utilities
    layout.tsx              # Root layout, fonts, SEO
    page.tsx                # Home page (all sections)
    not-found.tsx           # 404 page
    error.tsx               # Error boundary
    sitemap.ts              # SEO sitemap
  components/
    sections/               # Page sections (Hero, Services, etc.)
    chat/                   # Floating AI chat widget
  contexts/
    LocaleContext.tsx        # zh/en translations
  lib/
    motion.ts               # Framer Motion presets
    types.ts                # Shared TypeScript types
    rag/
      knowledge.ts          # RAG knowledge base
      search.ts             # Keyword search engine
  styles/
    design-tokens.css       # CSS custom properties
```
