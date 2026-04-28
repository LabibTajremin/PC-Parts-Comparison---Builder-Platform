# 🖥️ PC Parts Comparison & Builder Platform — V1 (MVP)
## AI Agent Implementation Specification

---

## 📋 Overview

You are tasked with building the **MVP version** of a PC Parts Comparison & Custom PC Builder platform. This document is your complete implementation guide. Follow every section carefully. Do not skip architecture, testing, or AI integration sections.

**Core Purpose:** Allow users to browse PC components, compare prices across vendors, and build a custom PC configuration step-by-step.

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js with TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Cache:** Redis (for price data caching)
- **Queue:** Bull (for scheduled scraping jobs)
- **Validation:** Zod

### Infrastructure & DevOps
- **Containerization:** Docker + Docker Compose
- **Environment Management:** dotenv
- **API Documentation:** Swagger/OpenAPI 3.0
- **Logging:** Winston
- **Testing:** Vitest (unit), Supertest (integration), Playwright (E2E)

### AI Integration
- **Provider:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Use Cases:** Compatibility advisor, build suggestions, data normalization

---

## 📁 Project Structure

```
pc-builder/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   │   ├── (public)/
│   │   │   │   │   ├── page.tsx              # Homepage
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx          # Product listing
│   │   │   │   │   │   └── [id]/page.tsx     # Product detail
│   │   │   │   │   ├── builder/
│   │   │   │   │   │   └── page.tsx          # PC Builder
│   │   │   │   │   └── compare/
│   │   │   │   │       └── page.tsx          # Price comparison
│   │   │   │   ├── admin/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── products/page.tsx
│   │   │   │   │   └── vendors/page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── ui/               # shadcn/ui base components
│   │   │   │   ├── products/
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   ├── ProductGrid.tsx
│   │   │   │   │   ├── ProductFilter.tsx
│   │   │   │   │   └── PriceTable.tsx
│   │   │   │   ├── builder/
│   │   │   │   │   ├── BuilderStepper.tsx
│   │   │   │   │   ├── ComponentSelector.tsx
│   │   │   │   │   ├── BuildSummary.tsx
│   │   │   │   │   └── CompatibilityAlert.tsx
│   │   │   │   ├── ai/
│   │   │   │   │   └── AIAdvisor.tsx
│   │   │   │   └── layout/
│   │   │   │       ├── Header.tsx
│   │   │   │       ├── Footer.tsx
│   │   │   │       └── Sidebar.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   ├── useBuilder.ts
│   │   │   │   └── useCompatibility.ts
│   │   │   ├── stores/
│   │   │   │   └── builderStore.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   └── utils.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                          # Express backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── products/
│       │   │   │   ├── product.controller.ts
│       │   │   │   ├── product.service.ts
│       │   │   │   ├── product.repository.ts
│       │   │   │   ├── product.routes.ts
│       │   │   │   └── product.schema.ts
│       │   │   ├── vendors/
│       │   │   │   ├── vendor.controller.ts
│       │   │   │   ├── vendor.service.ts
│       │   │   │   ├── vendor.repository.ts
│       │   │   │   └── vendor.routes.ts
│       │   │   ├── pricing/
│       │   │   │   ├── pricing.controller.ts
│       │   │   │   ├── pricing.service.ts
│       │   │   │   ├── pricing.repository.ts
│       │   │   │   └── pricing.routes.ts
│       │   │   ├── builder/
│       │   │   │   ├── builder.controller.ts
│       │   │   │   ├── builder.service.ts
│       │   │   │   └── builder.routes.ts
│       │   │   ├── admin/
│       │   │   │   ├── admin.controller.ts
│       │   │   │   ├── admin.service.ts
│       │   │   │   └── admin.routes.ts
│       │   │   └── ai/
│       │   │       ├── ai.controller.ts
│       │   │       ├── ai.service.ts
│       │   │       └── ai.routes.ts
│       │   ├── scrapers/
│       │   │   ├── base.scraper.ts
│       │   │   ├── vendor-a.scraper.ts
│       │   │   ├── vendor-b.scraper.ts
│       │   │   └── scraper.manager.ts
│       │   ├── jobs/
│       │   │   ├── price-update.job.ts
│       │   │   └── job.scheduler.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   ├── validate.middleware.ts
│       │   │   └── rateLimit.middleware.ts
│       │   ├── shared/
│       │   │   ├── logger.ts
│       │   │   ├── redis.ts
│       │   │   ├── database.ts
│       │   │   └── constants.ts
│       │   ├── types/
│       │   │   └── index.ts
│       │   └── app.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── seed.ts
│       │   └── migrations/
│       ├── tests/
│       │   ├── unit/
│       │   └── integration/
│       └── package.json
│
├── packages/
│   └── shared-types/                 # Shared TypeScript types
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
└── package.json                      # Root workspace
```

---

## 🗄️ Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ComponentCategory {
  CPU
  GPU
  RAM
  STORAGE
  MOTHERBOARD
  PSU
  CASE
}

model Product {
  id            String            @id @default(cuid())
  name          String
  slug          String            @unique
  category      ComponentCategory
  brand         String
  model         String
  imageUrl      String?
  description   String?
  specifications Json              // Flexible spec storage
  isActive      Boolean           @default(true)
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  prices        VendorPrice[]
  compatibilities ProductCompatibility[] @relation("BaseProduct")
  compatibleWith  ProductCompatibility[] @relation("CompatibleProduct")

  @@index([category])
  @@index([slug])
}

model Vendor {
  id          String        @id @default(cuid())
  name        String        @unique
  slug        String        @unique
  websiteUrl  String
  logoUrl     String?
  isActive    Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  prices      VendorPrice[]
}

model VendorPrice {
  id            String    @id @default(cuid())
  productId     String
  vendorId      String
  price         Decimal   @db.Decimal(10, 2)
  currency      String    @default("BDT")
  vendorUrl     String    // Buy now link
  inStock       Boolean   @default(true)
  isLowest      Boolean   @default(false)
  lastUpdated   DateTime  @default(now())
  isStale       Boolean   @default(false) // true if update failed

  product       Product   @relation(fields: [productId], references: [id])
  vendor        Vendor    @relation(fields: [vendorId], references: [id])

  @@unique([productId, vendorId])
  @@index([productId])
  @@index([vendorId])
}

model ProductCompatibility {
  id                String            @id @default(cuid())
  baseProductId     String
  compatibleProductId String
  compatibilityType String            // e.g., "cpu_socket", "ram_type"
  isCompatible      Boolean
  notes             String?

  baseProduct       Product           @relation("BaseProduct", fields: [baseProductId], references: [id])
  compatibleProduct Product           @relation("CompatibleProduct", fields: [compatibleProductId], references: [id])

  @@unique([baseProductId, compatibleProductId, compatibilityType])
}

model AdminUser {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  createdAt    DateTime  @default(now())
  lastLogin    DateTime?
}

model PriceUpdateLog {
  id          String    @id @default(cuid())
  vendorId    String
  status      String    // SUCCESS | PARTIAL | FAILED
  productsUpdated Int   @default(0)
  errorMessage String?
  startedAt   DateTime
  completedAt DateTime?
}
```

---

## 🔌 API Design

All endpoints are prefixed with `/api/v1`.

### Products
```
GET    /api/v1/products                    - List all products (with filters)
GET    /api/v1/products/:id                - Get single product with prices
GET    /api/v1/products/:id/prices         - Get all vendor prices for product
GET    /api/v1/products/category/:category - List by category
GET    /api/v1/products/search?q=          - Search products
```

### Vendors
```
GET    /api/v1/vendors                     - List all vendors
GET    /api/v1/vendors/:id                 - Get vendor details
```

### Builder
```
POST   /api/v1/builder/validate            - Validate component compatibility
POST   /api/v1/builder/summary             - Get build summary with total price
```

### AI
```
POST   /api/v1/ai/advisor                  - Get AI build advice
POST   /api/v1/ai/compatibility-check      - AI-powered compatibility explanation
```

### Admin (protected)
```
POST   /api/v1/admin/auth/login
GET    /api/v1/admin/products
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id
GET    /api/v1/admin/vendors
POST   /api/v1/admin/vendors
PUT    /api/v1/admin/vendors/:id
POST   /api/v1/admin/prices/override       - Manually override a price
POST   /api/v1/admin/prices/trigger-update - Manually trigger price update
GET    /api/v1/admin/price-logs            - View update history
```

### Query Parameters for Product Listing
```
GET /api/v1/products?
  category=CPU
  brand=Intel
  minPrice=10000
  maxPrice=80000
  sortBy=price_asc|price_desc|name
  page=1
  limit=20
```

---

## ⚙️ Core Module Implementation

### Product Service (apps/api/src/modules/products/product.service.ts)
```typescript
// Key responsibilities:
// 1. Fetch products with their lowest prices
// 2. Enrich product data with vendor pricing
// 3. Mark lowest price vendor automatically
// 4. Handle stale price indication

interface ProductWithPrices {
  product: Product;
  prices: VendorPrice[];
  lowestPrice: VendorPrice | null;
}

// When returning product list, always include:
// - All vendor prices
// - lowestPrice highlighted
// - isStale flag if last update > 24 hours ago
```

### Compatibility Service (apps/api/src/modules/builder/builder.service.ts)
```typescript
// V1 Compatibility Rules:
// 1. CPU Socket ↔ Motherboard Socket must match
//    - Check product.specifications.socket field
// 2. Return: { isCompatible: boolean, issues: string[], warnings: string[] }

// Compatibility check flow:
// Input: { selectedComponents: { [category]: productId } }
// Output: {
//   isCompatible: boolean,
//   issues: CompatibilityIssue[],
//   totalEstimatedPrice: number,
//   lowestTotalPrice: number
// }
```

### Scraper Base (apps/api/src/scrapers/base.scraper.ts)
```typescript
// All scrapers must implement this interface:
interface IScraper {
  vendorId: string;
  vendorName: string;
  scrape(): Promise<ScrapedProduct[]>;
  scrapeProduct(url: string): Promise<ScrapedProduct | null>;
}

interface ScrapedProduct {
  externalId: string;      // Vendor's product ID
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
  productUrl: string;
  imageUrl?: string;
}

// Scraper Manager handles:
// 1. Running all scrapers
// 2. Matching scraped data to existing products (by name similarity)
// 3. Updating VendorPrice records
// 4. Logging success/failure
// 5. Marking prices as stale on failure (do NOT delete old data)
```

### Price Update Job (apps/api/src/jobs/price-update.job.ts)
```typescript
// Schedule: Every 12 hours using Bull + node-cron
// Flow:
// 1. Queue price update job
// 2. For each active vendor: run scraper
// 3. On success: update prices, set isStale=false
// 4. On failure: set isStale=true, keep old prices, log error
// 5. Recalculate lowest prices after update
// 6. Invalidate Redis cache for affected products
```

---

## 🤖 AI Integration

### Use Case 1: Build Advisor (Primary Feature)
**Endpoint:** `POST /api/v1/ai/advisor`

**Prompt Engineering:**
```typescript
const systemPrompt = `You are an expert PC building advisor for a Bangladeshi PC parts platform. 
You help users select compatible, value-for-money components.
Always respond in JSON format with this structure:
{
  "advice": "string - general advice",
  "suggestions": [{ "category": "CPU", "reason": "string", "priority": "high|medium|low" }],
  "warnings": ["string"],
  "estimatedBudgetRange": { "min": number, "max": number, "currency": "BDT" }
}
Keep advice concise, practical, and Bangladesh-market aware.`;

// User message includes:
// - Current build components
// - User's stated budget
// - User's use case (gaming, office, programming)
// - Available products from DB (passed as context)
```

### Use Case 2: Compatibility Explanation
**Endpoint:** `POST /api/v1/ai/compatibility-check`

```typescript
// When compatibility fails, AI explains WHY in plain language
// Input: { component1: Product, component2: Product, issue: string }
// Output: { explanation: string, suggestion: string }

// Example: "This CPU uses LGA1700 socket but your motherboard uses AM5.
// You need either an Intel motherboard or an AMD CPU like the Ryzen 5 7600X."
```

### Use Case 3: Data Normalization (Internal)
```typescript
// During scraping, use AI to normalize product names
// Map vendor product names to canonical product names in DB
// Run only when a scraped product cannot be matched automatically

// Input: { scrapedName: "Intel Core i5-13600KF Box Processor 14C/20T" }
// Output: { canonicalName: "Intel Core i5-13600KF", brand: "Intel", model: "i5-13600KF" }
```

### AI Service Implementation
```typescript
// apps/api/src/modules/ai/ai.service.ts

import Anthropic from "@anthropic-ai/sdk";

class AIService {
  private client: Anthropic;
  
  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async getBuildAdvice(params: BuildAdviceParams): Promise<BuildAdvice> {
    // Always wrap in try-catch
    // Implement exponential backoff on rate limit errors
    // Cache responses in Redis for identical inputs (TTL: 1 hour)
    // Log token usage for cost monitoring
  }

  async explainCompatibility(params: CompatibilityParams): Promise<string> {
    // Simpler call, no JSON output needed
    // Cache by component pair (TTL: 24 hours)
  }

  async normalizeProductName(rawName: string): Promise<NormalizedProduct> {
    // JSON output mode
    // Cache by raw name (TTL: 7 days)
  }
}
```

---

## 🎨 Frontend Implementation

### PC Builder Store (Zustand)
```typescript
// apps/web/src/stores/builderStore.ts

interface BuilderState {
  selectedComponents: Partial<Record<ComponentCategory, Product>>;
  totalPrice: number;
  lowestTotalPrice: number;
  compatibilityIssues: CompatibilityIssue[];
  
  // Actions
  selectComponent: (category: ComponentCategory, product: Product) => void;
  removeComponent: (category: ComponentCategory) => void;
  clearBuild: () => void;
  checkCompatibility: () => Promise<void>;
}

// Builder persists to localStorage so users don't lose their build on refresh
```

### Key UI Components

**ProductCard.tsx**
- Show product image, name, specs summary
- Show lowest price prominently with vendor badge
- Show price range (min-max across vendors)
- "View Prices" button opens price comparison table
- "Add to Build" button (context-aware to current builder step)

**PriceTable.tsx**
- Table with columns: Vendor | Price | Stock Status | Action
- Highlight lowest price row in green
- Show stale warning badge if data is outdated
- "Buy Now" opens vendor link in new tab

**BuilderStepper.tsx**
- Steps: CPU → Motherboard → RAM → GPU → Storage → PSU → Case
- Show compatibility status between steps
- Allow going back to change selections
- Show running total at bottom

**CompatibilityAlert.tsx**
- Red alert for hard incompatibilities (different CPU socket)
- Yellow warning for potential issues
- Include AI explanation button

---

## 🧪 Testing Requirements

### Unit Tests (Vitest)

**Backend — Must Cover:**
```
products/product.service.test.ts
  ✓ should return products with prices
  ✓ should mark lowest price correctly
  ✓ should mark prices as stale when older than 24h
  ✓ should filter by category
  ✓ should sort by price ascending
  ✓ should paginate results correctly

builder/builder.service.test.ts
  ✓ should detect CPU/Motherboard socket incompatibility
  ✓ should pass compatible CPU/Motherboard pair
  ✓ should calculate total estimated price
  ✓ should return empty issues for valid build

scrapers/scraper.manager.test.ts
  ✓ should handle scraper failure gracefully (mark stale, not delete)
  ✓ should match scraped product to existing product
  ✓ should update price on successful scrape
  ✓ should log scrape results

ai/ai.service.test.ts
  ✓ should return build advice in correct JSON format
  ✓ should use cached response for identical input
  ✓ should handle API rate limit with retry
  ✓ should handle API failure gracefully (return fallback)
```

**Frontend — Must Cover:**
```
stores/builderStore.test.ts
  ✓ should add component to build
  ✓ should remove component from build
  ✓ should calculate total price
  ✓ should persist to localStorage

components/PriceTable.test.tsx
  ✓ should render all vendor prices
  ✓ should highlight lowest price
  ✓ should show stale warning
  ✓ should open vendor link on "Buy Now" click
```

### Integration Tests (Supertest)

```
api/products.integration.test.ts
  ✓ GET /api/v1/products returns 200 with pagination
  ✓ GET /api/v1/products?category=CPU filters correctly
  ✓ GET /api/v1/products/:id returns product with prices
  ✓ GET /api/v1/products/:id returns 404 for unknown id

api/builder.integration.test.ts
  ✓ POST /api/v1/builder/validate returns compatibility result
  ✓ POST /api/v1/builder/validate with incompatible CPU+MB returns issues

api/admin.integration.test.ts
  ✓ POST /api/v1/admin/products requires auth token
  ✓ POST /api/v1/admin/products creates product successfully
  ✓ PUT /api/v1/admin/prices/override updates price correctly
```

### E2E Tests (Playwright)

```
e2e/product-browsing.spec.ts
  ✓ User can browse products by category
  ✓ User can search for a product
  ✓ User can view price comparison for a product
  ✓ Buy Now link opens in new tab

e2e/pc-builder.spec.ts
  ✓ User can complete full PC build flow
  ✓ Incompatible component triggers warning
  ✓ Build summary shows correct total
  ✓ Build persists on page refresh
```

### Test Configuration
```typescript
// vitest.config.ts
export default {
  test: {
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 70,
          functions: 80,
          lines: 80,
        }
      }
    }
  }
}
```

---

## 🐳 Docker Setup

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: pcbuilder
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build: ./apps/api
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/pcbuilder
      REDIS_URL: redis://redis:6379
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis

  web:
    build: ./apps/web
    environment:
      NEXT_PUBLIC_API_URL: http://api:4000
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

---

## 🔒 Security Requirements

1. **Admin Panel:** JWT-based authentication. Store hashed passwords with bcrypt (saltRounds: 12).
2. **Rate Limiting:** Apply to all public endpoints (100 req/min per IP). Stricter on AI endpoints (10 req/min).
3. **Input Validation:** All API inputs validated with Zod schemas before processing.
4. **Vendor Links:** Sanitize all external URLs before redirect. Only allow http/https protocols.
5. **Environment Variables:** Never expose API keys in frontend. All secrets via environment variables.
6. **CORS:** Whitelist only known frontend origin.
7. **SQL Injection:** Prisma ORM prevents SQL injection by default — never use raw queries with user input.

---

## 📊 Caching Strategy

```
Redis Cache Keys:
  products:list:{filters_hash}        TTL: 5 minutes
  products:detail:{productId}         TTL: 5 minutes
  products:prices:{productId}         TTL: 5 minutes
  ai:build-advice:{input_hash}        TTL: 60 minutes
  ai:compatibility:{product1}:{product2}  TTL: 24 hours

Invalidation:
  - On price update: invalidate all products:* keys for affected products
  - On product edit: invalidate products:detail:{id} and products:list:*
```

---

## 🌱 Seed Data Requirements

Create a seed script (`prisma/seed.ts`) that:
1. Creates 2-3 mock vendors (e.g., TechlandBD, StarTech, RyansComputers)
2. Seeds at least 5 products per category (7 categories = 35+ products)
3. Creates mock VendorPrice entries for each product × vendor
4. Sets up realistic BDT pricing
5. Creates one admin user with hashed password

---

## 📝 Environment Variables (.env.example)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pcbuilder
DB_USER=pcbuilder_user
DB_PASSWORD=securepassword

# Redis
REDIS_URL=redis://localhost:6379

# Auth
ADMIN_JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ADMIN_JWT_EXPIRES_IN=24h

# AI
ANTHROPIC_API_KEY=sk-ant-...

# App
NODE_ENV=development
API_PORT=4000
FRONTEND_URL=http://localhost:3000

# Scraper
SCRAPER_INTERVAL_HOURS=12
SCRAPER_TIMEOUT_MS=30000
```

---

## ✅ Definition of Done (V1)

The implementation is complete when:

- [ ] All API endpoints respond correctly per spec
- [ ] Product listing with category filter and pagination works
- [ ] Price comparison table renders with lowest price highlighted
- [ ] PC Builder completes full 7-step flow
- [ ] CPU ↔ Motherboard compatibility check works
- [ ] AI advisor returns build recommendations
- [ ] Price staleness is indicated when data > 24h old
- [ ] Admin can add/edit products and override prices
- [ ] Price update job runs every 12 hours
- [ ] All unit tests pass with ≥ 80% coverage
- [ ] All integration tests pass
- [ ] E2E builder flow passes
- [ ] Docker Compose brings up entire stack successfully
- [ ] Page load < 3 seconds on product listing
- [ ] No console errors in production build