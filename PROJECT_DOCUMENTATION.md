# FinTrack AI - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Authentication](#authentication)
9. [Getting Started](#getting-started)
10. [Deployment](#deployment)
11. [Environment Variables](#environment-variables)
12. [Key Components](#key-components)
13. [Performance Optimizations](#performance-optimizations)
14. [Dark Mode](#dark-mode)

---

## 🎯 Project Overview

**FinTrack AI** is a comprehensive personal finance tracker application built with modern web technologies. It enables users to monitor income, expenses, budgets, savings goals, and subscriptions while leveraging AI-powered insights for better financial decision-making.

### Key Objectives:
- Track financial transactions in real-time
- Set and monitor monthly budgets
- Define and track savings goals
- Manage subscriptions
- Get AI-powered financial insights
- Responsive mobile-first design
- Dark mode support

---

## ✨ Features

### Core Features
- **Transaction Management**: Create, view, filter, and delete income/expense transactions
- **Budget Tracking**: Set category-wise budgets and monitor spending
- **Savings Goals**: Create, track, and manage savings goals with progress indicators
- **Subscription Management**: Track recurring subscriptions and monthly costs
- **Analytics Dashboard**: View financial trends, spending patterns, and key metrics
- **AI Insights**: OpenRouter AI-powered financial analysis and recommendations

### User Features
- **Secure Authentication**: NextAuth.js with JWT, email/password, and OAuth (Google, GitHub)
- **User Profile Management**: Update name, email, and preferences
- **Security Settings**: Password change with verification
- **Email Notifications**: Toggle notification preferences
- **Currency Preferences**: Support for PKR, USD, EUR, GBP
- **Dark Mode**: Full theme support with localStorage persistence

### UI/UX Features
- **Fully Responsive**: Mobile, tablet, and desktop layouts
- **Dark Mode Toggle**: Light and dark themes with system preference detection
- **Real-time Loading States**: Visual feedback during data fetching
- **Form Validation**: Client and server-side validation
- **Modal Forms**: Inline transaction creation without page navigation
- **Filter Options**: Filter transactions by type and category
- **Smooth Transitions**: Hover effects and page transitions

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.7
- **UI Components**: React 18 with Lucide icons
- **Form Management**: React Hook Form
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState, useContext)
- **Charts**: Recharts

### Backend
- **Framework**: Next.js 14 (API Routes)
- **Runtime**: Node.js (Vercel deployment)
- **Authentication**: NextAuth.js 4.24.7
- **Password Hashing**: bcryptjs
- **ORM**: Prisma 5.22.0
- **Database**: PostgreSQL with Supabase

### AI & Services
- **AI API**: OpenRouter (GPT-4o-mini model)
- **Deployment**: Vercel

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Build Tool**: Next.js built-in bundler
- **Type Checking**: TypeScript

---

## 🏗️ Architecture

### Application Architecture Pattern: **Layered Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                   Client Layer                          │
│  (Next.js Pages, Components, Hooks, Context)           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              API Layer (Next.js Routes)                 │
│  (/api/transactions, /api/budgets, /api/ai, etc.)      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         Business Logic & Data Access Layer              │
│  (Prisma ORM, Authentication, Validation)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Database Layer                             │
│  (PostgreSQL via Supabase)                             │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Request Flow:**
1. User interacts with React components
2. Components fetch data from API routes
3. API routes authenticate request using NextAuth
4. Data is processed and queried via Prisma ORM
5. Response is returned and cached client-side
6. UI updates with new data

**Session Flow:**
1. User logs in with email/password or OAuth
2. NextAuth creates JWT token
3. Token stored in HTTP-only cookie
4. Session info available in `useSession()` hook
5. Protected routes check session before rendering

---

## 📁 Project Structure

```
fintrack-ai/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   ├── api/                      # API Routes
│   │   ├── ai/route.ts           # AI insights endpoint
│   │   ├── analytics/route.ts    # Analytics data
│   │   ├── auth/                 # NextAuth configuration
│   │   ├── budgets/route.ts      # Budget CRUD operations
│   │   ├── goals/route.ts        # Savings goals CRUD
│   │   ├── subscriptions/route.ts# Subscriptions CRUD
│   │   ├── transactions/route.ts # Transactions CRUD
│   │   └── user/                 # User profile & settings
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Registration page
│   └── dashboard/                # Protected dashboard routes
│       ├── layout.tsx            # Dashboard layout (sidebar + header)
│       ├── page.tsx              # Main dashboard
│       ├── analytics/page.tsx    # Analytics page
│       ├── budgets/page.tsx      # Budgets page
│       ├── goals/page.tsx        # Savings goals page
│       ├── settings/page.tsx     # User settings
│       ├── subscriptions/page.tsx# Subscriptions page
│       └── transactions/page.tsx # Transactions page
│
├── components/                    # Reusable React components
│   ├── charts/
│   │   ├── SpendingChart.tsx     # Category breakdown pie chart
│   │   └── TrendChart.tsx        # Income vs expenses trend
│   ├── dashboard/
│   │   ├── AIInsights.tsx        # AI analysis insights
│   │   ├── BudgetOverview.tsx    # Budget summary cards
│   │   ├── GoalsWidget.tsx       # Savings goals widget
│   │   ├── RecentTransactions.tsx# Recent transactions list
│   │   └── StatsCards.tsx        # Income/expense/savings cards
│   ├── forms/
│   │   └── AddTransactionModal.tsx# Transaction creation form
│   ├── layout/
│   │   ├── Header.tsx            # Top navigation header
│   │   ├── Providers.tsx         # Context providers setup
│   │   ├── Sidebar.tsx           # Left navigation sidebar
│   │   └── ThemeProvider.tsx     # Dark mode theme context
│   └── ui/
│       └── toaster.tsx           # Toast notification component
│
├── hooks/                         # Custom React hooks
│
├── lib/                           # Utility functions & helpers
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # Helper functions (formatting, constants)
│
├── prisma/                        # Database schema & migrations
│   ├── schema.prisma             # Database models definition
│   ├── migrations/               # Database migration history
│   └── seed.ts                   # Database seed script
│
├── types/                         # TypeScript type definitions
│   ├── index.ts                  # Shared types
│   └── next-auth.d.ts            # NextAuth session extensions
│
├── public/                        # Static assets
│
├── styles/                        # Additional stylesheets
│
├── middleware.ts                  # Next.js middleware (auth check)
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
└── .env.local                    # Environment variables (local)
```

---

## 🗄️ Database Schema

### Users Table
```typescript
model User {
  id                    String    @id @default(cuid())
  name                  String?
  email                 String    @unique
  emailVerified         DateTime?
  password              String
  image                 String?
  currency              String    @default("PKR")
  notificationsEnabled  Boolean   @default(true)
  createdAt            DateTime   @default(now())
  updatedAt            DateTime   @updatedAt
  
  // Relations
  accounts              Account[]
  sessions              Session[]
  transactions          Transaction[]
  budgets               Budget[]
  savingsGoals          SavingsGoal[]
  subscriptions         Subscription[]
}
```

### Transactions Table
```typescript
model Transaction {
  id              String    @id @default(cuid())
  userId          String
  type            String    // "INCOME" | "EXPENSE"
  amount          Float
  category        String
  description     String
  date            DateTime
  paymentMethod   String    // "CASH" | "CARD" | "TRANSFER" | "OTHER"
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Budgets Table
```typescript
model Budget {
  id              String    @id @default(cuid())
  userId          String
  category        String
  limitAmount     Float
  month           Int
  year            Int
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### SavingsGoals Table
```typescript
model SavingsGoal {
  id              String    @id @default(cuid())
  userId          String
  name            String
  targetAmount    Float
  currentAmount   Float     @default(0)
  targetDate      DateTime
  category        String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Subscriptions Table
```typescript
model Subscription {
  id              String    @id @default(cuid())
  userId          String
  name            String
  amount          Float
  billingCycle    String    // "MONTHLY" | "YEARLY"
  category        String
  startDate       DateTime
  nextBillingDate DateTime
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Additional Tables
- **Account** - OAuth provider accounts (NextAuth)
- **Session** - User sessions (NextAuth)
- **VerificationToken** - Email verification tokens

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register              # Register new user
POST   /api/auth/[...nextauth]         # NextAuth routes (login, logout, session)
GET    /api/auth/session               # Get current session
```

### Transactions
```
GET    /api/transactions               # List user transactions (with filters)
POST   /api/transactions               # Create transaction
GET    /api/transactions/[id]          # Get transaction details
DELETE /api/transactions/[id]          # Delete transaction
```

### Budgets
```
GET    /api/budgets                    # List user budgets for month
POST   /api/budgets                    # Create budget
GET    /api/budgets/[id]               # Get budget details
DELETE /api/budgets/[id]               # Delete budget
```

### Savings Goals
```
GET    /api/goals                      # List user savings goals
POST   /api/goals                      # Create savings goal
PUT    /api/goals/[id]                 # Update goal progress
DELETE /api/goals/[id]                 # Delete goal
```

### Subscriptions
```
GET    /api/subscriptions              # List user subscriptions
POST   /api/subscriptions              # Create subscription
PUT    /api/subscriptions/[id]         # Update subscription
DELETE /api/subscriptions/[id]         # Delete subscription
```

### Analytics
```
GET    /api/analytics                  # Get analytics data (trends, breakdown)
```

### AI Insights
```
POST   /api/ai                         # Generate AI financial insights
```

### User Settings
```
PUT    /api/user/profile               # Update user profile
PUT    /api/user/password              # Change password
```

---

## 🔐 Authentication

### NextAuth.js Configuration
- **Provider Type**: JWT (JSON Web Tokens)
- **Session Strategy**: "jwt"
- **Authentication Methods**:
  - Credentials (email/password)
  - Google OAuth (optional)
  - GitHub OAuth (optional)

### Session Flow
1. User logs in with email/password or OAuth
2. NextAuth validates credentials against database
3. JWT token created and stored in HTTP-only cookie
4. Token contains user ID and expires after 30 days
5. Subsequent requests include token for authentication
6. Session information available via `useSession()` hook

### Protected Routes
- All `/dashboard/*` routes require valid session
- Unauthenticated users redirected to `/auth/login`
- Route protection handled by `getServerSession()` in layout

### Password Security
- Passwords hashed with bcryptjs (salt rounds: 10)
- Password change requires current password verification
- No plain text passwords stored in database

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud)
- Git

### Installation

1. **Clone repository**
```bash
git clone https://github.com/Wxleed77/fintrack_ai.git
cd fintrack-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and API keys
```

4. **Setup database**
```bash
npx prisma migrate dev
```

5. **Seed database (optional)**
```bash
npx prisma db seed
```

6. **Run development server**
```bash
npm run dev
```

7. **Open browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

---

## 📦 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Visit https://vercel.com
- Import repository
- Vercel auto-detects Next.js configuration

3. **Set Environment Variables**
In Vercel dashboard, add:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random 32-character secret
- `NEXTAUTH_URL` - Deployment URL (e.g., https://app.example.com)
- `OPENROUTER_API_KEY` - OpenRouter API key
- OAuth provider keys (if enabled)

4. **Deploy**
- Push to main branch triggers automatic deployment
- Build command: `prisma generate && next build`
- Output directory: `.next`

### Database Setup for Production
Use Supabase PostgreSQL:
1. Create Supabase project
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`
4. Add `DATABASE_URL` to Vercel environment variables

---

## 🔑 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# NextAuth
NEXTAUTH_SECRET=your-random-32-character-secret
NEXTAUTH_URL=http://localhost:3000

# AI API
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
```

### Optional OAuth Variables
```env
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

GITHUB_ID=xxx
GITHUB_SECRET=xxx
```

### Notes
- `.env` file used by Prisma CLI
- `.env.local` file used by Next.js runtime
- Never commit `.env` files to Git
- Environment variables must be set in Vercel dashboard for production

---

## 🧩 Key Components

### Layout Components

**Sidebar.tsx**
- Navigation menu for all dashboard routes
- Mobile-responsive hamburger menu
- Active route highlighting
- Icons for each section

**Header.tsx**
- Top navigation with user greeting
- Add transaction button
- Notifications bell
- Dark mode toggle (Moon/Sun icon)
- User avatar with sign-out button

**ThemeProvider.tsx**
- React Context for theme management
- Detects system preference on first load
- Persists theme choice to localStorage
- Provides `useTheme()` hook to components

**Providers.tsx**
- Wraps entire app with necessary providers
- SessionProvider for NextAuth
- ThemeProvider for dark mode

### Dashboard Components

**StatsCards.tsx**
- Displays key metrics (Income, Expenses, Savings, Savings Rate)
- Responsive 2x2 grid on mobile, 1x4 on desktop
- Loading skeleton support

**TrendChart.tsx**
- Area chart showing 6-month income vs expenses
- Recharts library
- Responsive container
- Currency formatting on hover

**SpendingChart.tsx**
- Pie chart for spending by category
- Color-coded categories
- Percentage display
- Legend with categories

**RecentTransactions.tsx**
- List of latest 5-10 transactions
- Transaction type icons (income/expense)
- Link to view all transactions
- Empty state message

**AIInsights.tsx**
- AI-powered financial analysis
- OpenRouter API integration
- Button to generate insights
- Displays insights with icons and colors

**BudgetOverview.tsx**
- Budget cards for each category
- Progress bar showing spent vs limit
- Color warning when over budget
- Link to budget details page

**GoalsWidget.tsx**
- Savings goal progress display
- Progress bars
- Target vs current amount
- Link to goals page

### Form Components

**AddTransactionModal.tsx**
- Modal form for adding transactions
- Type selector (Income/Expense)
- Category and amount inputs
- Payment method selector
- Date picker
- Form validation
- Loading state during submission

---

## ⚡ Performance Optimizations

### Client-Side Caching
- 5-minute cache duration for dashboard data
- Prevents unnecessary API calls
- Cache busted on form submissions
- Implemented via Map-based cache in dashboard page

### API Optimization
- `export const dynamic = 'force-dynamic'` on all data endpoints
- Prevents Vercel from pre-rendering dynamic routes
- Ensures fresh data on each request

### Code Splitting
- Next.js automatic route-based code splitting
- Dynamic imports for heavy components
- Each page loaded only when needed

### Image Optimization
- Next.js Image component for avatar
- Automatic optimization and lazy loading

### Database Queries
- Efficient Prisma queries with specific field selection
- Database indexes on frequently queried fields (userId, date)
- Pagination ready (not yet implemented)

### UI Performance
- React.memo for memoized components
- useCallback for callback functions
- Avoid unnecessary re-renders

---

## 🌙 Dark Mode

### Implementation
- Tailwind CSS class-based dark mode (`dark:` prefixes)
- Enabled in `tailwind.config.ts` via `darkMode: 'class'`
- Document element class toggle: `dark` class on `<html>`

### Theme Provider
- ThemeProvider context in `components/layout/ThemeProvider.tsx`
- Detects system preference via `window.matchMedia()`
- Stores preference in localStorage
- System preference is fallback if no saved preference

### Usage in Components
```tsx
// Light mode (default)
<div className="bg-white text-gray-900">

// Dark mode (with dark: prefix)
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Color Scheme
- **Light Mode**: White backgrounds, dark text
- **Dark Mode**: Gray-900 backgrounds, white text
- **Consistent**: All UI components support both themes

---

## 📈 Future Enhancements

- [ ] Recurring transaction automation
- [ ] Budget alerts and notifications
- [ ] Advanced analytics with forecasting
- [ ] Investment tracking
- [ ] Bank account integration (Plaid)
- [ ] Export to CSV/PDF
- [ ] Multi-currency support with real-time rates
- [ ] Collaborative budgets (family accounts)
- [ ] Mobile app (React Native)
- [ ] Cryptocurrency tracking

---

## 🐛 Known Limitations

- Pagination not yet implemented for large datasets
- File uploads for receipts not supported
- Limited historical data (6 months in analytics)
- Notifications are UI-only (no email sending yet)
- OAuth providers optional (disabled by default)

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- GitHub Issues: [Link to repo]
- Email: [Contact email if applicable]

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Status**: Production Ready
