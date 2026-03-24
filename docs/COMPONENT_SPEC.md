# Component Specification - 凌柒科技

> Agent 1 (UI Architect) Deliverable
> Style: Dark Cyberpunk + Glassmorphism + Neon Accents, Commercial Restraint

---

## Design Principles

1. **Dark Immersion** - Deep navy/black backgrounds create depth and focus
2. **Neon Restraint** - Cyan and purple neon used sparingly as accents, not flooding
3. **Glass Layers** - Glassmorphism for elevated surfaces, creating depth hierarchy
4. **Motion with Purpose** - Every animation serves UX, never decorative-only
5. **Commercial Polish** - This ships to clients, not a demo

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 375px | Mobile (iPhone SE+) |
| md | 768px | Tablet (iPad portrait) |
| lg | 1280px | Desktop |
| xl | 1440px | Wide desktop |

---

## Page Sections (Top to Bottom)

### 1. Navbar (Fixed)
```
Height: 64px
Background: glass (blur 16px, bg-glass)
Border-bottom: 1px solid var(--border-subtle)
Container: max-w-1440px, centered
Layout:
  Left: Logo (36px rounded-lg) + "凌柒科技" (Orbitron, text-glow-cyan)
  Center (md+): Nav links (服务/作品/关于/联系) - text-secondary, hover:text-neon-cyan
  Right: Language toggle (EN/中) + CTA button "开始对话"
Mobile: Hamburger menu → slide-in panel from right
Z-index: 50
```

### 2. Hero Section
```
Padding: pt-32 pb-20 (desktop), pt-24 pb-16 (mobile)
Background: gradient-hero + noise-overlay
Layout: Centered text

H1: Orbitron, 72px(xl)/60px(lg)/48px(md)/36px(sm)
  Line 1: "AI 驱动" - gradient-neon-text
  Line 2: "软件开发新范式" - text-primary

Subtitle: Inter, 20px(md+)/18px(sm), text-secondary, max-w-2xl
  "与 AI 对话，即可获得网站、小程序、游戏等数字产品。零员工，无限可能。"

CTA buttons: flex row (sm+) / stack (mobile)
  Primary: gradient cyan→blue, text-dark, rounded-xl, glow-cyan on hover
  Secondary: border-strong, text-primary, hover:border-purple, glow-purple on hover

Stats grid: 4-col(md+) / 2-col(sm), glass cards
  Each: font-display value (neon-cyan) + label (text-secondary)
  Values: "50+ 交付项目" | "99% 客户满意度" | "24h 响应时间" | "0 人工员工"

Animation: fade-in-up staggered (200ms delay between elements)
```

### 3. How It Works (3-Step Flow)
```
Section padding: py-24
Background: bg-primary

Title: "三步启动您的项目" - Orbitron, text-3xl, centered
Subtitle: text-secondary, centered

3 cards in a row (md+) / stack (mobile):
  Each card: glass, rounded-xl, p-8
  Step number: font-display, text-6xl, neon-cyan/10 opacity (watermark)
  Icon: 48px, neon-cyan
  Title: font-display, text-xl
  Description: text-secondary, text-sm

  Card 1: "描述需求" - Chat icon - "用自然语言告诉 AI 你想要什么"
  Card 2: "AI 设计方案" - Sparkles icon - "AI 分析需求，生成设计方案和报价"
  Card 3: "交付产品" - Rocket icon - "确认方案后，AI 自动开发并交付"

Connection line between cards (md+): dashed, neon-cyan/20
Hover: card lifts 4px, border-glow-cyan appears

Animation: scroll-triggered fade-in-up per card, staggered 150ms
```

### 4. Services Section
```
Section padding: py-24
Background: bg-deep

Title: "我们的服务" - centered
4 service blocks in 2x2 grid (lg+) / stack (mobile):

Each service card: glass-strong, rounded-2xl, p-8, min-h-280px
  Icon area: 64px circle, gradient-neon bg at 10% opacity
  Title: font-display, text-xl
  Description: text-secondary, 2-3 lines
  Feature tags: small pills, bg-neon-cyan/8, text-neon-cyan
  CTA: "了解更多 →" text link, neon-cyan

Services:
  1. "网站开发" - Globe icon - 企业官网、电商、SaaS平台
  2. "小程序开发" - Smartphone icon - 微信/支付宝/抖音小程序
  3. "游戏开发" - Gamepad icon - H5游戏、微信小游戏
  4. "AI 定制" - Brain icon - AI Agent、聊天机器人、RAG系统

Hover: scale(1.02), shadow-glow-cyan-sm
Animation: scroll-triggered, staggered grid reveal
```

### 5. Portfolio Showcase
```
Section padding: py-24
Background: bg-primary

Title: "精选作品" - centered
Filter tabs: "全部 | 网站 | 小程序 | 游戏 | AI" - underline style, neon-cyan active

6+ project cards in 3-col grid (lg) / 2-col (md) / 1-col (sm):
  Each card: group, rounded-xl, overflow-hidden
  Image: aspect-video, object-cover, grayscale(20%) default
  Overlay on hover: bg-gradient dark → transparent from bottom
  Title overlay: bottom-left, font-display
  Tech tags: small pills at bottom
  Click: expand modal or navigate to detail

Card hover:
  - Image: grayscale(0%), scale(1.05)
  - Overlay fades in
  - Title slides up
  - Border: 1px neon-cyan/30

Animation: scroll-triggered grid, staggered 100ms per card
```

### 6. AI Chat Demo Section
```
Section padding: py-24
Background: gradient from bg-deep to bg-primary with neon-cyan/3 tint

Title: "体验 AI 对话" - centered
Subtitle: "直接与我们的 AI 助手对话，描述您的项目需求"

Embedded chat widget (not the floating one):
  Container: max-w-2xl, centered, glass-strong, rounded-2xl
  Height: 500px (desktop) / 400px (mobile)
  Header: logo avatar + "凌柒 AI 助手" + status dot (green)
  Messages area: scrollable
  Input: bottom-fixed within container
  Pre-loaded quick replies: "我想做一个企业官网" | "小程序开发报价" | "AI能做什么"

This section embeds the same chat logic as the floating widget.
```

### 7. Founder Section
```
Section padding: py-24
Background: bg-secondary

Layout: flex row (md+) / stack (mobile)
  Left (40%): Founder photo/avatar, rounded-2xl, border-glow-purple
  Right (60%):
    Quote: italic, text-xl, text-text-primary, neon-purple left border
    Name: font-display, text-lg
    Title: text-secondary
    Vision text: text-secondary, 2-3 sentences

Background: subtle grid pattern or particles (optional, low-key)
```

### 8. Tech Stack Marquee
```
Section padding: py-16
Background: bg-deep
Border top/bottom: 1px border-subtle

Infinite scrolling marquee (CSS animation, no JS):
  Two rows, opposite directions
  Items: tech logos/icons with labels
  Technologies: Next.js, React, TypeScript, Python, FastAPI, DeepSeek,
    PostgreSQL, Redis, Docker, Vercel, Tailwind CSS, Framer Motion,
    ChromaDB, Node.js, etc.

Each item: glass pill, rounded-full, px-6 py-3
  Icon (24px) + Name (text-sm)
  Hover: glow-cyan-sm, scale(1.05)

Pause on hover (the whole marquee)
```

### 9. Footer
```
Padding: py-16
Background: bg-deep
Border-top: 1px border-subtle

Layout: 4-col grid (md+) / stack (mobile)
  Col 1: Logo + company description + social links
  Col 2: "服务" - link list
  Col 3: "公司" - link list
  Col 4: "联系我们" - email, phone, address

Bottom bar: flex between
  Left: "2024 凌柒科技有限公司. All rights reserved."
  Right: "隐私政策 | 使用条款"
```

---

## Floating AI Chat Widget (Global)

```
Position: fixed, bottom-24px, right-24px, z-9999

IDLE STATE:
  Container: 60px circle
  Image: logo.jpg, 60x60, rounded-full, overflow-hidden
  Border: 2px solid neon-cyan
  Animation: float (translateY -8px, 3s loop) + glow-pulse (2s loop)
  Shadow: shadow-lg + glow-cyan-sm
  Badge: notification dot (12px, error red) when unread, scale-in

HOVER STATE:
  Scale: 1.0 → 1.12 (200ms spring)
  Glow: intensify to glow-cyan-md
  Cursor: pointer
  Tooltip: "与 AI 对话" pill above, fade-in, arrow pointing down

OPEN STATE (Framer Motion layoutId morph):
  Size: 400w x 600h (desktop) / 100vw x 85vh (mobile)
  Position: bottom-right (desktop) / bottom-center full-width (mobile)
  Border-radius: 50% → 16px (spring: stiffness 280, damping 26)
  Background: bg-secondary
  Border: 1px border-default

  Header: h-14, flex between
    Left: logo (32px avatar) + "凌柒 AI" (Orbitron)
    Right: minimize (—) + close (x) buttons

  Messages: flex-1, overflow-y-auto, p-4
    User bubble: bg accent-gold/15, text-primary, right-aligned, rounded-2xl
    Bot bubble: bg bg-elevated, text-primary, left-aligned, rounded-2xl, with avatar
    Typing: 3 dots, staggered bounce (0ms, 150ms, 300ms)

  Quick replies (first open only):
    3 pill buttons, glass, rounded-full
    "凌柒做什么?" | "我要做网站" | "看看作品"

  Input bar: h-14, bg-bg-elevated, rounded-xl
    Input: flex-1, text-sm, placeholder "输入您的需求..."
    Send button: neon-cyan circle, arrow icon, pulse when text entered

  Footer: "Powered by DeepSeek" tiny text, text-muted

CLOSE/MINIMIZE:
  Content fades out (150ms)
  Panel shrinks: 400x600 → 60px circle (spring, 400ms)
  Border-radius: 16px → 50%
  Resume float + glow animations
```

---

## UI Component Library

### Button
```
Variants: primary / secondary / ghost / danger / gold
Sizes: sm (h-8 px-3 text-xs) / md (h-10 px-5 text-sm) / lg (h-12 px-8 text-base)

primary: bg-neon-cyan, text-bg-primary, hover:shadow-glow-cyan-sm
secondary: border border-border-strong, text-primary, hover:border-neon-cyan/40
ghost: text-secondary, hover:text-primary, hover:bg-bg-hover
danger: bg-error, text-white, hover:bg-error-dim
gold: bg-accent-gold, text-bg-primary, hover:shadow-glow-gold-sm

All: rounded-lg, font-medium, transition-all 200ms
Disabled: opacity-50, cursor-not-allowed
Loading: spinner icon replaces content
```

### Input
```
Height: h-10 (default), h-12 (lg)
Background: bg-bg-elevated
Border: 1px border-subtle
Border-radius: rounded-lg
Focus: border-neon-cyan, ring-1 ring-neon-cyan/30
Error: border-error, ring-1 ring-error/30
Placeholder: text-muted
Label: text-sm text-secondary, above input
```

### Card
```
Background: glass (default) or gradient-card
Border: 1px border-subtle
Border-radius: rounded-xl
Padding: p-6 (default)
Hover: shadow-glow-cyan-sm, border-border-glow-cyan, translate-y(-2px)
Transition: all 300ms ease-snappy
```

### Badge
```
Sizes: sm (h-5 px-2 text-xs) / md (h-6 px-3 text-xs)
Variants:
  cyan: bg-neon-cyan/10, text-neon-cyan, border-neon-cyan/20
  purple: bg-neon-purple/10, text-neon-purple, border-neon-purple/20
  gold: bg-accent-gold/10, text-accent-gold, border-accent-gold/20
  success: bg-success/10, text-success
  error: bg-error/10, text-error
All: rounded-full, font-medium
```

### Modal
```
Overlay: bg-bg-deep/80, backdrop-blur-sm
Container: glass-strong, rounded-2xl, max-w-lg, mx-auto
Animation: overlay fade-in, content scale-in (spring)
Close: top-right x button, or click overlay
```

### Toast
```
Position: fixed top-6 right-6, z-toast
Background: glass-strong, rounded-lg
Border-left: 3px solid (success/error/info color)
Animation: slide-in-right, auto-dismiss 5s
Variants: success (green), error (red), info (blue)
```

### Skeleton
```
Background: shimmer animation
Border-radius: matches target component
Variants: text (h-4), heading (h-8), image (aspect-video), card (full card shape)
```

---

## Animation Specifications

### Page Load
- Navbar: instant (no animation, always visible)
- Hero H1: fade-in-up, 600ms, delay 100ms
- Hero subtitle: fade-in-up, 600ms, delay 300ms
- Hero CTAs: fade-in-up, 600ms, delay 500ms
- Hero stats: fade-in-up staggered, 400ms each, delay 700ms start

### Scroll Reveals (IntersectionObserver + Framer Motion)
- Trigger: element enters viewport at 20% threshold
- Animation: fade-in-up, 600ms, ease-out
- Stagger: 100-200ms between siblings
- Once: true (don't re-animate on scroll up)

### Hover States
- All interactive: transition-all 200ms ease-snappy
- Cards: translate-y(-2px) + shadow increase + border glow
- Buttons: shadow-glow + slight brightness increase
- Links: color transition to neon-cyan

### Page Transitions (if using)
- Exit: fade-out 150ms
- Enter: fade-in 300ms

### Framer Motion Spring Presets
```typescript
export const springs = {
  snappy: { type: "spring", stiffness: 300, damping: 24 },
  gentle: { type: "spring", stiffness: 200, damping: 20 },
  bouncy: { type: "spring", stiffness: 400, damping: 15 },
  chat:   { type: "spring", stiffness: 280, damping: 26 },
};
```

---

## Logo Usage Specification

- **File**: `public/logo.jpg` (NEVER use .png)
- **Navbar**: 36x36px, rounded-lg (border-radius: 8px)
- **Chat widget idle**: 60x60px, rounded-full, with cyan border
- **Chat widget header**: 32x32px, rounded-full
- **Footer**: 40x40px, rounded-lg
- **Favicon**: Generate from logo.jpg, 32x32 and 16x16
- **Always use**: next/image with proper width/height/alt="凌柒科技"
