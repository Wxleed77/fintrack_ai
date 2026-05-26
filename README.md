# FinTrack AI — Personal Finance Tracker

A full-stack personal finance tracker built with Next.js 14, Prisma, PostgreSQL, and Claude AI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |
| Charts | Recharts |
| AI Insights | Anthropic Claude |
| State | Zustand + React state |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd fintrack-ai
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/fintrack_ai"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
ANTHROPIC_API_KEY="your-key-from-console.anthropic.com"
```

### 3. Setup the database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with demo data
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Visit http://localhost:3000

**Demo login:** demo@fintrack.ai / password123

---

## Project Structure

```
fintrack-ai/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Redirect to dashboard or login
│   ├── globals.css             # Tailwind base styles
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── dashboard/
│   │   ├── layout.tsx          # Protected layout with sidebar
│   │   └── page.tsx            # Main dashboard
│   ├── transactions/page.tsx   # All transactions with filters
│   ├── budgets/page.tsx        # Budget management
│   ├── goals/page.tsx          # Savings goals
│   ├── analytics/page.tsx      # Charts and reports
│   ├── subscriptions/page.tsx  # Subscription tracker
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/  # NextAuth handler
│       │   └── register/       # User registration
│       ├── transactions/       # CRUD transactions
│       ├── budgets/            # CRUD budgets
│       ├── goals/              # CRUD savings goals
│       ├── subscriptions/      # CRUD subscriptions
│       ├── analytics/          # Monthly stats + trend data
│       └── ai/                 # Claude AI insights
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Header.tsx          # Top bar with user info
│   │   └── Providers.tsx       # NextAuth SessionProvider
│   ├── dashboard/
│   │   ├── StatsCards.tsx      # Income/expenses/savings cards
│   │   ├── RecentTransactions.tsx
│   │   ├── BudgetOverview.tsx
│   │   ├── GoalsWidget.tsx
│   │   └── AIInsights.tsx      # Claude AI panel
│   ├── charts/
│   │   ├── SpendingChart.tsx   # Donut chart by category
│   │   └── TrendChart.tsx      # 6-month income vs expenses
│   ├── forms/
│   │   └── AddTransactionModal.tsx
│   └── ui/
│       └── toaster.tsx
│
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth config
│   └── utils.ts                # Helpers, formatters, constants
│
├── types/
│   └── index.ts                # TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Demo data seeder
│
├── middleware.ts               # Route protection
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## Features

- **Authentication** — Email/password + Google/GitHub OAuth via NextAuth
- **Dashboard** — Summary cards, spending chart, AI insights, goals, budget tracker
- **Transactions** — Add, filter, delete income/expenses with categories
- **Budgets** — Set monthly limits per category with visual progress
- **Savings Goals** — Track progress toward financial targets
- **Subscriptions** — Monitor recurring payments and monthly burn
- **Analytics** — 6-month trend charts, category breakdown
- **AI Insights** — Claude-powered personalized financial analysis
- **Multi-currency** — Defaults to PKR, configurable per user

---

## Deployment (Vercel)

1. Push to GitHub
2. Import into Vercel
3. Add all environment variables from `.env.example`
4. Add a Postgres database (Vercel Postgres or Neon)
5. Run `prisma db push` via Vercel CLI or build command

**Recommended build command:**
```bash
prisma generate && prisma db push && next build
```

---

## Development Phases

| Phase | Status | Features |
|-------|--------|---------|
| Phase 1 MVP | ✅ Complete | Auth, Transactions, Dashboard, Analytics |
| Phase 2 | ✅ Complete | Budgets, Goals, Subscriptions |
| Phase 3 AI | ✅ Complete | Claude insights, smart categorization |
| Phase 4 Scale | 🔜 Next | Redis cache, WebSockets, PDF export, multi-currency live rates |
