# BlueSoft 360° Platform — Development Plan

> **Born at 314, Built for 360.**
> Full-stack e-commerce + AI chatbot platform for BlueSoft Inc.

---

## Executive Summary

BlueSoft needs a production e-commerce platform that sells four product categories (physical merch, digital products, SaaS subscriptions, NFT collectibles) with an AI-powered chatbot assistant (the robot mascot) living in the bottom-right corner. The chatbot connects to Claude's API for customer support, product recommendations, and BlueSoft brand Q&A.

**Stack:** React (Next.js) frontend + Python FastAPI backend + PostgreSQL + Stripe + Claude API

**Total estimated time:** 8–12 weeks across 6 phases (working solo with Claude Code in director mode)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Shop    │ │ Product  │ │  Cart /  │ │  User     │  │
│  │  Pages   │ │  Detail  │ │ Checkout │ │  Dashboard│  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │         BluBot — AI Chat Widget (bottom-right)   │   │
│  │         logo.png + bounce animation + chat UI    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ REST + WebSocket
┌────────────────────────┴────────────────────────────────┐
│                  BACKEND (FastAPI)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Auth     │ │ Products │ │ Orders / │ │  Chat     │  │
│  │ (JWT)    │ │ (CRUD)   │ │ Payments │ │  (Claude) │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Subscr.  │ │ Digital  │ │  NFT     │ │  Admin    │  │
│  │ Manager  │ │ Delivery │ │ Metadata │ │  Panel    │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                   DATA & SERVICES                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │PostgreSQL│ │  Redis   │ │  Stripe  │ │  Claude   │  │
│  │ (main DB)│ │  (cache) │ │(payments)│ │   API     │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────────┐   │
│  │    S3    │ │ SendGrid │ │  Alchemy / Thirdweb   │   │
│  │ (files)  │ │ (email)  │ │    (NFT tooling)      │   │
│  └──────────┘ └──────────┘ └───────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Data Model (Core Tables)

### Users
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | String | Unique, indexed |
| hashed_password | String | bcrypt |
| display_name | String | |
| role | Enum | customer, admin |
| wallet_address | String? | Optional, for NFT |
| stripe_customer_id | String? | Created on first purchase |
| created_at | DateTime | |

### Products
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | String | |
| slug | String | URL-safe, unique |
| description | Text | Rich text / markdown |
| product_type | Enum | **physical, digital, subscription, nft** |
| price_cents | Integer | Price in cents |
| currency | String | Default USD |
| images | JSON | Array of image URLs |
| metadata | JSON | Type-specific data (see below) |
| is_active | Boolean | Soft publish toggle |
| stock_quantity | Integer? | Null = unlimited (digital/subscription) |
| created_at | DateTime | |

**Type-specific metadata patterns:**

- **physical**: `{ weight_oz, dimensions, shipping_class, variants: [{size, color, sku, stock}] }`
- **digital**: `{ file_url, file_size_mb, format, download_limit, preview_url }`
- **subscription**: `{ stripe_price_id, interval (monthly/yearly), features: [], tier_name }`
- **nft**: `{ chain, contract_address, token_id, token_standard, media_url, traits: [] }`

### Orders
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → Users |
| status | Enum | pending, paid, shipped, delivered, cancelled, refunded |
| total_cents | Integer | |
| stripe_payment_intent_id | String | |
| shipping_address | JSON? | Null for digital-only orders |
| tracking_number | String? | Physical orders |
| created_at | DateTime | |

### Order Items
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| order_id | UUID | FK → Orders |
| product_id | UUID | FK → Products |
| quantity | Integer | |
| unit_price_cents | Integer | Snapshot at time of purchase |
| variant_data | JSON? | Size, color, etc. |

### Subscriptions
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → Users |
| product_id | UUID | FK → Products |
| stripe_subscription_id | String | |
| status | Enum | active, past_due, cancelled, trialing |
| current_period_end | DateTime | |

### Chat Sessions
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID? | Nullable (anonymous users can chat) |
| messages | JSON | `[{role, content, timestamp}]` |
| context | JSON | Current page, cart contents, viewed products |
| created_at | DateTime | |

---

## Phase Breakdown

### Phase 0: Project Scaffolding
**Time estimate: 1–2 days**
**Goal:** Monorepo set up, both apps running locally, database initialized.

1. Create the monorepo structure:
   ```
   bluesoft-platform/
   ├── frontend/          # Next.js 14 (App Router)
   │   ├── src/
   │   │   ├── app/       # Pages & routes
   │   │   ├── components/ # Shared components
   │   │   ├── lib/       # Utils, API client, types
   │   │   └── styles/    # Global styles, Tailwind config
   │   ├── public/
   │   │   └── logo.png   # The robot mascot
   │   └── package.json
   ├── backend/           # FastAPI
   │   ├── app/
   │   │   ├── main.py
   │   │   ├── config.py
   │   │   ├── models/    # SQLAlchemy models
   │   │   ├── schemas/   # Pydantic schemas
   │   │   ├── routers/   # API route modules
   │   │   ├── services/  # Business logic
   │   │   └── middleware/ # Auth, CORS, rate limiting
   │   ├── alembic/       # Database migrations
   │   ├── tests/
   │   └── requirements.txt
   ├── docker-compose.yml # PostgreSQL + Redis
   ├── .env.example
   └── CLAUDE.md          # Project-specific Claude Code instructions
   ```

2. Set up Docker Compose with PostgreSQL 16 + Redis 7.

3. Initialize FastAPI with health check, CORS, and auto-docs.

4. Initialize Next.js 14 with Tailwind CSS, the BlueSoft color system from the brand deck (navy/cyan/gold palette), and Orbitron + Noto Sans TC fonts.

5. Create the project-level `CLAUDE.md` with codebase conventions.

6. Git init, first commit, push to GitHub.

**Claude Code prompt for this phase:**
```
Read CLAUDE.md first. Create a monorepo called bluesoft-platform with:
1. A Next.js 14 App Router frontend in /frontend with Tailwind CSS. 
   Set up the color theme using these CSS variables: navy #0a1628, 
   cyan #4ecdc4, gold #c8a255, white #e8edf5. Import Orbitron and 
   Noto Sans TC from Google Fonts. Add a basic layout.tsx with the 
   BlueSoft nav bar.
2. A FastAPI backend in /backend with SQLAlchemy async + Alembic. 
   Set up a /health endpoint. Use pydantic-settings for config with 
   .env support. Include CORS middleware allowing the frontend origin.
3. A docker-compose.yml with PostgreSQL 16 and Redis 7.
4. A .env.example with all required variables.
5. A CLAUDE.md for this project.
Don't skip any step. Run both apps to verify they start.
```

---

### Phase 1: Authentication & User System
**Time estimate: 2–3 days**
**Goal:** Users can register, login, and manage their profile. JWT auth protects API routes.

1. Backend: User model + Alembic migration.
2. Backend: Auth router — `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`.
3. Backend: JWT access + refresh token system using `python-jose` + `passlib[bcrypt]`.
4. Backend: Role-based middleware (customer vs admin).
5. Frontend: Auth context provider with token storage (httpOnly cookies preferred over localStorage).
6. Frontend: Login / Register pages with form validation.
7. Frontend: Protected route wrapper component.
8. Frontend: User profile/settings page (display name, email, wallet address).

**Why httpOnly cookies over localStorage:** Prevents XSS attacks from stealing tokens. This is the best practice even though localStorage is faster to implement. The refresh token lives in a secure httpOnly cookie, access token can be in memory.

**Claude Code prompt:**
```
Read CLAUDE.md. Phase 1: Build the auth system.

BACKEND:
- Create User model in app/models/user.py matching the data model 
  in the plan (UUID pk, email, hashed_password, display_name, role 
  enum, wallet_address nullable, stripe_customer_id nullable, timestamps).
- Create Alembic migration and apply it.
- Create auth router at app/routers/auth.py with: POST /register, 
  POST /login (returns JWT), POST /refresh, GET /me (protected).
- Use python-jose for JWT, passlib[bcrypt] for password hashing.
- Access token: 15min expiry, in response body.
- Refresh token: 7 day expiry, set as httpOnly secure cookie.
- Create a dependency get_current_user that extracts + validates JWT.
- Create a dependency require_admin that checks role.

FRONTEND:
- Create AuthContext provider that stores access token in memory 
  (not localStorage), auto-refreshes via the cookie.
- Build /login and /register pages with email/password forms.
- Build a ProtectedRoute wrapper component.
- Build /profile page showing user info with edit capability.

Test everything end-to-end: register → login → access /me → refresh.
```

---

### Phase 2: Product Catalog & Admin
**Time estimate: 3–4 days**
**Goal:** Admin can CRUD all four product types. Public users can browse/search/filter.

1. Backend: Product model + migration (with the polymorphic metadata JSON approach).
2. Backend: Product CRUD router — admin-only for create/update/delete, public for list/detail.
3. Backend: Search & filter endpoint — by type, price range, keyword, sort options.
4. Backend: Image upload endpoint (S3 or local filesystem for dev).
5. Frontend: Product listing page with filters (type tabs: All / Merch / Digital / SaaS / NFT).
6. Frontend: Product detail page with type-specific rendering:
   - Physical: variant selector (size/color), stock indicator
   - Digital: preview, file format badge, instant delivery note
   - Subscription: feature comparison, interval toggle (monthly/yearly)
   - NFT: chain badge, trait display, blockchain verification link
7. Frontend: Admin panel — product creation form with dynamic fields per type.
8. Frontend: Admin product list with edit/delete/toggle-active controls.

**Claude Code prompt:**
```
Read CLAUDE.md. Phase 2: Product catalog system.

BACKEND:
- Create Product model matching the plan's data model. Use a JSON 
  column for metadata (type-specific fields). Add proper indexes 
  on slug, product_type, is_active.
- Alembic migration.
- Create product router: 
  GET /products (public, paginated, filterable by type/price/keyword)
  GET /products/{slug} (public, single product)
  POST /products (admin only)
  PUT /products/{id} (admin only)  
  DELETE /products/{id} (admin only, soft delete via is_active)
  POST /products/{id}/images (admin, upload images)
- Create Pydantic schemas with discriminated unions for the metadata 
  field based on product_type.
- For image upload: store locally in /uploads for now (we'll switch 
  to S3 later). Serve via a static files mount.

FRONTEND:
- Build /shop page with a product grid. Add filter tabs across the 
  top: All | Merch | Digital | SaaS | NFTs. Add sort dropdown 
  (price low/high, newest). Add price range filter.
- Build /shop/[slug] product detail page. Render differently based 
  on product_type:
  - physical: size/color variant picker, "Add to Cart" button, 
    stock count
  - digital: file format badge, preview button, "Buy Now"
  - subscription: monthly/yearly toggle, feature list, "Subscribe"
  - nft: chain/standard badges, traits grid, "Mint / Buy"
- Build /admin/products CRUD interface (protected, admin only).
  - Product form with a type selector that shows different fields.
  - Image upload with drag-and-drop.
  - Product table with quick actions.

Use the BlueSoft design system: navy bg, cyan accents for interactive 
elements, gold for CTAs and premium items.
```

---

### Phase 3: Cart, Checkout & Payments
**Time estimate: 3–4 days**
**Goal:** Full shopping cart, Stripe checkout for one-time purchases, Stripe billing for subscriptions.

1. Backend: Cart stored in Redis (session-based for guests, user-linked for logged-in).
2. Backend: Cart router — add/remove/update/clear, auto-merge on login.
3. Backend: Order + OrderItem models + migration.
4. Backend: Checkout router — creates Stripe Payment Intent (one-time) or Stripe Subscription.
5. Backend: Stripe webhook handler — `payment_intent.succeeded`, `invoice.paid`, `customer.subscription.updated`, etc.
6. Backend: Digital delivery — generate signed download URLs on payment success.
7. Backend: Subscription model + migration, sync with Stripe events.
8. Frontend: Cart drawer/sidebar component with quantity controls.
9. Frontend: Checkout page — shipping form (physical items only), payment via Stripe Elements.
10. Frontend: Order confirmation page with download links (digital) / tracking info (physical).
11. Frontend: User dashboard — order history, active subscriptions, downloads.

**Why Stripe Payment Intents over Checkout Sessions:** Payment Intents give you full control over the UI and let you keep users on your site. Checkout Sessions redirect to Stripe's hosted page, which breaks the BlueSoft brand experience. Best practice for a custom storefront.

**Claude Code prompt:**
```
Read CLAUDE.md. Phase 3: Cart and payment system.

BACKEND:
- Cart service using Redis. Key pattern: cart:{user_id} or 
  cart:{session_id}. Store as JSON array of {product_id, quantity, 
  variant_data}. TTL 7 days for guest carts.
- Cart router: GET /cart, POST /cart/items, PUT /cart/items/{product_id}, 
  DELETE /cart/items/{product_id}, DELETE /cart (clear).
- POST /cart/merge endpoint — merges guest cart into user cart on login.
- Order + OrderItem models from the plan. Alembic migration.
- Subscription model from the plan. Alembic migration.
- Checkout router:
  POST /checkout — validates cart, creates Stripe PaymentIntent for 
  one-time items + Stripe Subscription for subscription items. Returns 
  client_secret for frontend.
  POST /checkout/webhook — Stripe webhook handler. Verify signature. 
  Handle: payment_intent.succeeded (create order, send receipt, 
  generate download URLs for digital items), 
  customer.subscription.created/updated/deleted (sync subscription table).
- Digital delivery service: generate pre-signed S3 URLs with 24hr expiry.

FRONTEND:
- Cart context provider — syncs with backend, persists session_id 
  for guest users.
- CartDrawer component — slides in from right, shows items, quantities, 
  subtotal, "Proceed to Checkout" button.
- /checkout page:
  - If cart has physical items: show shipping address form.
  - Stripe Elements card input (use the navy/gold theme).
  - Order summary sidebar.
  - Submit creates PaymentIntent, confirms with stripe.js.
- /orders page — list past orders with status badges.
- /orders/[id] page — order detail with:
  - Download buttons for digital items
  - Tracking info for physical items
  - Subscription management (cancel/resume) for SaaS items

Set up Stripe in test mode. Use stripe-python on backend, 
@stripe/react-stripe-js on frontend.
```

---

### Phase 4: BluBot — AI Chat Widget
**Time estimate: 3–4 days**
**Goal:** The robot logo lives in the bottom-right corner with idle animation. Clicking it opens a chat panel powered by Claude API. It knows about BlueSoft, can recommend products, and helps with support.

1. Backend: Chat service — manages conversation history, system prompt, context injection.
2. Backend: Chat router — `POST /chat/message` (streams response via SSE), `GET /chat/history`.
3. Backend: System prompt engineering — BlueSoft brand knowledge, product catalog awareness, order lookup capability.
4. Backend: Tool use — give Claude tools to: search products, check order status, look up FAQ answers.
5. Frontend: BluBot widget component with three states:
   - **Idle:** Robot logo (logo.png) with gentle floating/breathing animation, subtle glow pulse.
   - **Hover:** Logo scales up slightly, tooltip "Chat with BluBot".
   - **Open:** Smooth expand animation into a chat panel (400×600px) anchored to bottom-right.
6. Frontend: Chat panel UI — message bubbles, typing indicator, quick-reply suggestions.
7. Frontend: Context awareness — automatically sends current page URL, cart contents, and viewed products as context.
8. Frontend: SSE streaming — responses stream in token by token for a natural feel.

**BluBot System Prompt (embedded in backend):**
```
You are BluBot, the AI assistant for BlueSoft — a company born at 
314 Chandler, Philadelphia, built for 360° completeness. 

Your personality: warm, knowledgeable, slightly playful. You embody 
the brand's philosophy that AI should be "Aware Intelligence" with 
love (愛), not cold automation.

You can help with:
- Product questions and recommendations
- Order status inquiries  
- BlueSoft brand story and philosophy
- TaxBot product details
- General support

You have access to the product catalog and can search it. When 
recommending products, be specific and link to them.

Keep responses concise (2-3 sentences unless the user asks for detail).
Use the brand voice: confident but warm, technical but accessible.
```

**Claude Code prompt:**
```
Read CLAUDE.md. Phase 4: BluBot AI chat widget.

BACKEND:
- Create ChatSession model from the plan. Migration.
- Create chat service in app/services/chat.py:
  - Manages conversation history per session
  - Builds system prompt with BlueSoft brand context
  - Injects page context (current URL, cart, viewed products) 
  - Calls Claude API (anthropic python SDK) with streaming
  - Implements tool_use for: search_products (queries the DB), 
    check_order_status (looks up by order ID), get_faq_answer 
    (searches a FAQ table or hardcoded FAQ dict)
- Create chat router at app/routers/chat.py:
  POST /chat/message — accepts {message, session_id, context}. 
  Returns SSE stream (text/event-stream). Creates session if new.
  GET /chat/sessions/{id}/history — returns past messages.
- Use anthropic SDK with claude-sonnet-4-20250514 model.
- Rate limit: 20 messages per minute per session.

FRONTEND:
- Create BluBotWidget component with three states:
  STATE 1 — IDLE (default):
    - Position: fixed, bottom-right (bottom: 24px, right: 24px)
    - Show logo.png (60×60px) in a circular container
    - Animation: gentle up-down float (3s ease-in-out infinite), 
      plus a subtle cyan glow pulse on the border
    - On hover: scale to 1.1, show tooltip "Chat with BluBot"
    
  STATE 2 — OPEN:
    - Click logo → logo morphs/expands into a 400×600 chat panel
    - Animation: the circle expands outward, corners square off, 
      panel slides up. Use framer-motion spring animation.
    - Chat panel: dark navy background, header with "BluBot" + 
      minimize button, message area, input bar at bottom.
    - The robot logo stays visible as a small avatar in the header.
    
  STATE 3 — MINIMIZED:
    - Click minimize → panel shrinks back to the logo circle
    - If there are unread messages, show a cyan notification dot
    
- Message bubbles: 
  - User messages: gold background, right-aligned
  - BluBot messages: navy-light background, left-aligned with 
    small robot avatar
  - Typing indicator: three dots bouncing animation
  
- Quick replies: show 2-3 suggested questions on first open:
  "What is BlueSoft?", "Show me products", "Track my order"
  
- SSE streaming: use EventSource or fetch with ReadableStream 
  to display tokens as they arrive.
  
- Context injection: on each message, include 
  {current_path, cart_items, last_viewed_product} in the request.

- Persist session_id in sessionStorage so conversation survives 
  page navigation.

Place the widget in the root layout so it appears on every page.
```

---

### Phase 5: NFT Integration & Digital Delivery
**Time estimate: 2–3 days**
**Goal:** NFT minting/claiming for collectibles, secure digital file delivery, subscription management portal.

1. Backend: NFT metadata API — serves token metadata in OpenSea-compatible format.
2. Backend: Integration with Thirdweb SDK or Alchemy for on-chain minting (lazy mint pattern — mint on purchase, not upfront).
3. Backend: Digital file delivery service — signed URLs, download counting, expiry management.
4. Backend: Subscription lifecycle hooks — trial start, renewal, cancellation, dunning emails.
5. Frontend: NFT product page enhancements — wallet connect (RainbowKit or wagmi), mint button, gallery view.
6. Frontend: User dashboard — NFT collection viewer, download manager, subscription portal.
7. Frontend: Email templates — order confirmation, digital delivery, subscription reminders.

**Claude Code prompt:**
```
Read CLAUDE.md. Phase 5: NFT, digital delivery, and subscriptions.

BACKEND:
- NFT metadata endpoint: GET /nft/{contract}/{token_id}/metadata 
  Returns OpenSea-compatible JSON (name, description, image, 
  attributes array).
- Integrate thirdweb-sdk for lazy minting. On successful payment, 
  call mint-to with buyer's wallet address. Store tx_hash in order.
- Digital delivery service:
  - Generate pre-signed S3 download URLs (24hr expiry)
  - Track download count per user per product
  - Enforce download_limit from product metadata
  - Endpoint: GET /downloads/{order_item_id} (authenticated)
- Subscription management endpoints:
  - POST /subscriptions/{id}/cancel (sets cancel_at_period_end)
  - POST /subscriptions/{id}/resume (removes cancel_at_period_end)
  - PUT /subscriptions/{id}/plan (upgrade/downgrade)
  - Webhook handlers for invoice.payment_failed (dunning flow)
- Email service using SendGrid:
  - order_confirmation template
  - digital_delivery template (with download links)
  - subscription_renewal_reminder template

FRONTEND:
- Add wallet connect using @rainbow-me/rainbowkit + wagmi.
  - "Connect Wallet" button in user profile
  - Wallet address auto-saves to user profile
- NFT product detail: show "Mint" button (requires wallet), 
  show chain badge, trait grid, owned-by-you indicator.
- User dashboard tabs:
  - Orders: list with status
  - Downloads: grid of digital products with download buttons + 
    remaining download count
  - Subscriptions: active plans with cancel/resume/upgrade
  - NFTs: gallery grid showing owned tokens with metadata
- Email templates: use React Email or MJML for responsive templates.
```

---

### Phase 6: Polish, Deploy & Launch
**Time estimate: 2–3 days**
**Goal:** Production deployment, performance optimization, SEO, monitoring.

1. Frontend: SEO — metadata, Open Graph tags, structured data (Product schema), sitemap.
2. Frontend: Performance — image optimization (Next.js Image), lazy loading, code splitting.
3. Frontend: Responsive design audit — mobile-first for all pages.
4. Frontend: Loading states, error boundaries, 404/500 pages.
5. Backend: Rate limiting (slowapi), request validation, error handling standardization.
6. Backend: Logging (structlog), health checks, readiness probes.
7. Infrastructure: Docker multi-stage builds for both services.
8. Infrastructure: Deploy — Vercel (frontend) + Railway or Fly.io (backend + DB + Redis).
9. Infrastructure: Environment management — staging vs production.
10. Monitoring: Sentry for error tracking, basic analytics.
11. Security audit: HTTPS, CSP headers, input sanitization, SQL injection prevention check.

**Claude Code prompt:**
```
Read CLAUDE.md. Phase 6: Production polish and deployment.

FRONTEND:
- Add SEO: page-level metadata for all routes, Open Graph images, 
  JSON-LD Product schema on product pages, robots.txt, sitemap.xml.
- Add Next.js Image component everywhere, set up image optimization.
- Responsive audit: ensure all pages work at 375px (mobile), 
  768px (tablet), 1024px+ (desktop).
- Add loading.tsx skeletons for all route segments.
- Add error.tsx error boundaries for all route segments.
- Add not-found.tsx custom 404 page with BlueSoft branding.
- Add global-error.tsx for 500-level errors.

BACKEND:
- Add slowapi rate limiting: 100 req/min general, 20 req/min for 
  chat, 10 req/min for auth endpoints.
- Standardize error responses: {detail, error_code, timestamp}.
- Add structlog for structured JSON logging.
- Add /health and /ready endpoints for container orchestration.
- Security: verify all inputs via Pydantic, ensure parameterized 
  queries (SQLAlchemy handles this), add CSP headers via middleware.

DEPLOYMENT:
- Create Dockerfile for backend (multi-stage: build deps → slim runtime).
- Set up fly.toml for Fly.io deployment (backend + PostgreSQL + Redis).
- Configure Vercel for frontend with environment variables.
- Set up Sentry for both frontend and backend.
- Create a deploy script that handles both services.

Test the full user journey: browse → add to cart → checkout → 
receive order → chat with BluBot → download digital product.
```

---

## Tech Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend Framework | Next.js 14 (App Router) | SSR for SEO, React Server Components, Image optimization |
| Styling | Tailwind CSS + CSS Variables | Matches the BlueSoft design system, rapid iteration |
| UI Animation | Framer Motion | Smooth BluBot transitions, page animations |
| State Management | React Context + TanStack Query | Context for auth/cart, TanStack for server state caching |
| Backend Framework | FastAPI | Async, auto-docs, Pydantic validation, your strongest stack |
| ORM | SQLAlchemy 2.0 (async) | Industry standard, great migration support via Alembic |
| Database | PostgreSQL 16 | Robust, JSON column support for product metadata |
| Cache | Redis 7 | Cart storage, rate limiting, session management |
| Payments | Stripe (Payment Intents + Billing) | Industry standard, handles subscriptions natively |
| AI Chatbot | Claude API (Sonnet) | Tool use for product search, streaming for UX |
| NFT | Thirdweb SDK | Simplified minting, no raw Solidity needed |
| Wallet Connect | RainbowKit + wagmi | Standard React wallet connection |
| Email | SendGrid | Transactional email with templates |
| File Storage | AWS S3 (or Cloudflare R2) | Digital product delivery, images |
| Auth | JWT (access) + httpOnly Cookie (refresh) | Secure, stateless |
| Deployment (FE) | Vercel | Zero-config Next.js hosting |
| Deployment (BE) | Fly.io or Railway | Container hosting with managed Postgres |
| Monitoring | Sentry | Error tracking both sides |

---

## Key Design Decisions & Best Practices

### 1. Polymorphic Products via JSON Metadata
Instead of separate tables for each product type (which creates JOIN hell), we use a single `products` table with a `product_type` enum and a `metadata` JSON column. Pydantic discriminated unions validate the metadata shape per type. This is simpler to query, easier to extend, and avoids the "table-per-type" explosion.

### 2. Stripe Payment Intents over Checkout Sessions
Payment Intents keep users on your site (no redirect to Stripe). This preserves the BlueSoft brand experience and gives full UI control. The trade-off is more frontend code, but it's the professional approach for a custom storefront.

### 3. Redis Cart over Database Cart
Carts are ephemeral and high-frequency. Redis with TTL handles this perfectly — no need to pollute the database with abandoned carts. Guest carts merge into user carts on login.

### 4. SSE for Chat Streaming (not WebSocket)
Server-Sent Events are simpler than WebSockets for one-way streaming (which is all chat needs — the user sends HTTP POST, the server streams back). Fewer moving parts, works through more proxies, and Claude's API itself uses SSE.

### 5. Lazy Minting for NFTs
Don't mint tokens upfront (wastes gas on unsold items). Instead, mint on purchase — the buyer pays gas implicitly through the product price. Thirdweb's lazy mint pattern handles this cleanly.

---

## BluBot Animation Spec (for the frontend developer — you)

```
IDLE STATE:
├── Container: fixed, bottom: 24px, right: 24px, z-index: 9999
├── Logo circle: 60px, border: 2px solid cyan, border-radius: 50%
├── Float animation: translateY(-6px) over 3s ease-in-out infinite
├── Glow pulse: box-shadow cycles between 0 0 0 and 0 0 20px cyan/40%
└── Notification dot: 12px red circle, top-right, scale-in when unread

HOVER STATE:
├── Scale: 1.0 → 1.12 over 200ms
├── Glow intensifies: 0 0 30px cyan/60%
└── Tooltip: "Chat with BluBot" fades in above

OPEN TRANSITION (click):
├── Circle expands: 60px → 400×600px (spring animation, 500ms)
├── Border-radius morphs: 50% → 12px
├── Background fades: transparent → navy-mid
├── Content fades in: 200ms delay after expansion starts
└── Logo shrinks into header avatar: 60px → 32px

CLOSE TRANSITION (minimize):
├── Content fades out: 150ms
├── Panel shrinks: 400×600 → 60px circle (spring, 400ms)
├── Border-radius morphs: 12px → 50%
└── Resume float animation
```

---

## Environment Variables (.env)

```bash
# Database
DATABASE_URL=postgresql+asyncpg://bluesoft:password@localhost:5432/bluesoft
REDIS_URL=redis://localhost:6379/0

# Auth
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Claude API (for BluBot)
ANTHROPIC_API_KEY=sk-ant-...

# S3 / File Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=bluesoft-files
AWS_REGION=us-east-1

# Email
SENDGRID_API_KEY=SG....

# NFT (Thirdweb)
THIRDWEB_CLIENT_ID=...
THIRDWEB_SECRET_KEY=...

# App
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
ENVIRONMENT=development
```

---

## Development Order of Operations

Start Phase 0 immediately. Each subsequent phase builds on the previous. Do not skip phases.

| Phase | Depends On | Est. Time | Can Parallelize? |
|-------|-----------|-----------|-----------------|
| 0: Scaffolding | Nothing | 1–2 days | — |
| 1: Auth | Phase 0 | 2–3 days | — |
| 2: Products | Phase 1 | 3–4 days | — |
| 3: Cart & Payments | Phase 2 | 3–4 days | — |
| 4: BluBot | Phase 2 (needs product data) | 3–4 days | Can start after Phase 2 |
| 5: NFT & Digital | Phase 3 | 2–3 days | — |
| 6: Polish & Deploy | All above | 2–3 days | — |

**Total: 8–12 weeks working solo with Claude Code**

---

## Next Step

Upload `logo.png` to this chat, then paste the **Phase 0 Claude Code prompt** into your terminal. That gets the monorepo scaffolded and both apps running. Once that's green, move to Phase 1.
