# TZOUL BARBER — PRD

## Original Problem Statement
User asked to open and set up the GitHub project `https://github.com/g65102345-ux/tzoul1.git` and then requested a style/vibe change: **modern, clean look with baby blue color and colorful accents**.

## Project Overview
TZOUL BARBER is a premium barbershop booking website (Athens, Heraklion). React + FastAPI + MongoDB.

## Architecture
- **Frontend**: React 19 + CRACO + Tailwind + framer-motion + Radix UI (`/app/frontend`)
- **Backend**: FastAPI + Motor (MongoDB async) + JWT auth + Resend email (`/app/backend`)
- **Database**: MongoDB (DB: `tzoul_barber`)
- **Integrations**: Resend email (disabled — no key provided)

## Design System (Updated 2026-06-06)
- **Primary**: Baby Blue `#38BDF8`
- **CTA/Action**: Orange `#F97316`
- **Ink/Text**: `#0F172A` (deep slate)
- **Background**: `#F8FAFC` (near white)
- **Surface alt**: `#E0F2FE` (light blue tint — Manifesto section)
- **Dark accent**: `#0F172A` (Style Finder section, Footer)
- **Font**: Outfit (headings/display) + Manrope (body) + JetBrains Mono (labels)
- **Card style**: Neo-brutalist — `border-2 border-[#0F172A]` + `shadow-[3px_3px_0px_#0F172A]`
- **Button style**: Orange pill with neo-brutalist shadow

## Core Features (implemented)
- Multi-step booking modal (service → barber → date/time → personal info → confirmation)
  - Spring entrance animation + staggered inner content + step slide transitions
- Public APIs: services, barbers, availability, bookings, testimonials, business info, instagram-posts
- Admin panel with JWT auth: manage bookings, services, barbers, schedules, Instagram posts
- Booking confirmation emails via Resend (disabled until API key provided)
- Multilingual UI (EN/EL toggle in header)
- Animated intro, parallax images, ticker, music toggle
- Pages: Home, Style Finder, Services, Instagram, Gallery, About, Contact, Admin

## What was done (2026-06-06)
### Initial setup
- Cloned `tzoul1.git` from GitHub, installed all dependencies
- Configured `/app/backend/.env` with MONGO_URL, DB_NAME=tzoul_barber, JWT_SECRET, admin credentials

### Style redesign (same session)
- Complete palette shift: dark red/black → modern clean baby blue + orange
- Updated: index.css, index.html (fonts), tailwind.config.js, Nav.jsx, Ticker.jsx
- Redesigned: Hero section, all Home sections, Layout.jsx, Footer.jsx, components/Footer.jsx
- Updated: Team.jsx, Gallery.jsx, sections/Footer.jsx
- Updated: BookingModal.jsx (step tabs, accents, CTA buttons)
- Updated: AdminLogin.jsx, AdminDashboard.jsx

## What's NOT yet configured
- `RESEND_API_KEY` is empty — booking confirmation emails won't send
- Default admin credentials should be changed for production
- SERVICES and BARBERS in-memory — admin changes lost on server restart

## Prioritized Backlog
- P1: Add real `RESEND_API_KEY` for email confirmations
- P1: Change production admin password
- P2: Persist services/barbers to MongoDB
- P2: Rate limiting on booking endpoint
- P3: Instagram post management flow end-to-end
