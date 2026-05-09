# Mergly — Project Context

## What is Mergly
A developer tool that helps programmers find open source 
repositories to contribute to, based on their skills and experience.
Not a generic repo finder — personalized matching based on
language, experience level, and interests.

## Tech Stack
Frontend:  Next.js (App Router), Tailwind CSS, TypeScript
Backend:   NestJS, TypeScript
Database:  Supabase (PostgreSQL)
Auth:      Supabase Auth
Icons:     Lucide React (already installed)
HTTP:      @nestjs/axios (backend)

## Project Structure
mergly/
frontend/    → Next.js app (port 3000)
backend/     → NestJS app (port 3001)
CLAUDE.md    → this file

## Color Palette (ALWAYS use these exact values)
Background:     #0a0a0a
Card/surface:   #111111
Card inner:     #1a1a1a
Accent green:   #22c55e
Accent dark:    #16a34a
Text primary:   #ffffff
Text secondary: #a1a1aa
Border:         #27272a
Error:          #ef4444
Green glow:     rgba(34, 197, 94, 0.15)

Additional (for variety — badges, stats, achievements):
Purple:  #a855f7
Blue:    #3b82f6
Orange:  #f97316
Pink:    #ec4899
Yellow:  #eab308
Cyan:    #06b6d4

## Typography
Font: Inter (Google Fonts, already loaded)
Mono: JetBrains Mono (for code/terminal elements)

## Design Principles
- Dark theme throughout, no exceptions
- Minimal and clean — no decorative elements that add no value
- Premium developer tool aesthetic (think Linear, Vercel, Raycast)
- Animations: CSS only (no Framer Motion)
- No component libraries — pure Tailwind CSS only
- Mobile responsive on every page
- Lucide React for ALL icons

## Language Badge Colors (consistent across all pages)
TypeScript:  bg #1e3a5f, text #3b82f6
JavaScript:  bg #3d3200, text #eab308
Python:      bg #1a2d4a, text #3b82f6
Rust:        bg #3d1a0e, text #f97316
Go:          bg #0e2d3d, text #06b6d4
Ruby:        bg #3d0e0e, text #ef4444
Java:        bg #3d2200, text #f97316
C#:          bg #2d1a3d, text #a855f7
PHP:         bg #1a1a3d, text #6366f1
C++:         bg #0e1a3d, text #3b82f6
Default:     bg #1a1a2e, text #a855f7

## Key Files
frontend/src/lib/supabase.ts        → Supabase client
frontend/src/context/AuthContext.tsx → Auth context (user, loading, signOut)
backend/src/auth/auth.guard.ts      → JWT validation guard
backend/src/supabase/supabase.service.ts → Supabase service

## API
Backend base URL (dev):  http://localhost:3001
Backend base URL (prod): https://mergly-backend.railway.app

Auth headers (always include for protected routes):
const { data: { session } } = await supabase.auth.getSession()
headers: { Authorization: `Bearer ${session.access_token}` }

## App Routes
/ → Landing page (public)
/login → Login page (redirect to /dashboard if logged in)
/register → Register page (redirect to /dashboard if logged in)
/onboarding → Onboarding flow (must be logged in)
/dashboard → Main dashboard (must be logged in + onboarding done)
/explore → Public repo explorer (10 results for guests)
/settings → User settings (must be logged in)
/profile → User profile (must be logged in)

## Backend Endpoints
GET  /github/recommendations          → public, guest users
GET  /github/recommendations/personalized → protected, logged in users
POST /onboarding/save                 → protected
GET  /onboarding/profile              → protected
GET  /dashboard                       → protected
POST /dashboard/track/repo            → protected
POST /dashboard/track/issue           → protected
GET  /settings/profile                → protected (not built yet)
PATCH /settings/profile               → protected (not built yet)
PATCH /settings/password              → protected (not built yet)
DELETE /settings/account              → protected (not built yet)

## Protected Route Logic
- No user → redirect to /login
- User + onboarding_completed false → redirect to /onboarding
- User + onboarding_completed true → allow access

## Important Conventions
- Never install new npm packages without mentioning it
- Always use existing Supabase client, never create new one
- All forms: React useState only, no form libraries
- All animations: CSS keyframes or Tailwind transitions only
- Always handle loading and error states
- Always mobile responsive
- Comment TODOs clearly: // TODO: Replace with API call

## Current MVP Status
✅ Landing page
✅ Login / Register pages
✅ Onboarding flow
✅ Dashboard (with mock data)
✅ Explore page
🔄 Settings page (in progress)
🔄 Profile page (in progress)
❌ Achievements (not built yet)
❌ Settings backend (not built yet)
❌ Deploy