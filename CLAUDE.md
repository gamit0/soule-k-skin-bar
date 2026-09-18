# Soule K Skin Bar - Engineering Guide

## 🛠 Project Overview
E-commerce platform for personalized skincare. Architecture based on a deterministic scoring engine for skin diagnosis (Cocktails).

## 📐 Architecture Principles
- **Layered Architecture:** 
  - `app/`: Routing and UI entry points (Next.js App Router).
  - `components/`: Pure UI components. Divided into `ui/` (primitives) and feature-based folders (`marketing/`, `quiz/`, etc.).
  - `server/services/`: Business logic and orchestrators.
  - `server/repositories/`: Data access layer (Drizzle ORM).
  - `server/providers/`: Abstracted external integrations (Payments, Notifications).
- **Deterministic Logic:** AI is a presentation layer; the core diagnosis is rule-based and auditable.
- **Strict Typing:** All entities must have defined TypeScript interfaces in `src/types/index.ts`.

## 🎨 UI/UX Standards
- **Design Tokens:** Brand colors defined in `src/app/globals.css` using Tailwind v4 `@theme`.
- **Accessibility:** Semantic HTML, ARIA labels for interactive elements, and mobile-first responsiveness.
- **Visual Hierarchy:** Use of `Fraunces` for headings (serif, luxury feel) and `Inter` for body text (sans-serif, readability).

## 💻 Development Workflow
- **Build Commands:**
  - `npm run dev`: Local development.
  - `npm run build`: Production build.
  - `npm run typecheck`: Run TypeScript compiler.
  - `npm run lint`: Run ESLint.
- **Database:**
  - `npm run db:generate`: Create migrations.
  - `npm run db:migrate`: Apply migrations to DB.
  - `npm run db:seed`: Load mock data for development.
- **Git Convention:** Use imperative mood in commits (e.g., "Add checkout validation" instead of "Added checkout validation").

## 🚩 Critical Paths
- **Quiz Flow:** `QuizRunner` $\to$ `RecommendationEngine` $\to$ `RecommendationResult`.
- **Commerce Flow:** `CartContext` $\to$ `CheckoutService` $\to$ `PaymentProvider` $\to$ `Order`.
