# TZOUL BARBER — PRD

## Original Problem Statement
Open and set up the GitHub project `https://github.com/g65102345-ux/tzoul1.git`, run the services, and customize the website's aesthetic and booking form animations based on user requests.

## Project Overview
TZOUL BARBER is a premium barbershop booking website (Athens, Heraklion). React + FastAPI + MongoDB.

## Architecture
- **Frontend**: React 19 + CRACO + Tailwind + framer-motion (outer modal only) + Radix UI (`/app/frontend`)
- **Backend**: FastAPI + Motor (MongoDB async) + JWT auth + Resend email stub (`/app/backend`)
- **Database**: MongoDB (DB: `tzoul_barber`)
- **Integrations**: Resend email (disabled — no key provided, deferred by user)

## Design System — Active (Option F: Monochrome Apple, updated 2026-06-06)
- **Background**: Pure white `#FFFFFF`
- **Surface alt**: `#F5F5F7` (light grey cards/inputs)
- **Primary text**: `#1D1D1F` (near-black charcoal)
- **Muted text**: `#86868B` / `#A1A1A6`
- **Border**: `rgba(0,0,0,0.06)` — hairline
- **CTA/Active**: `#1D1D1F` background, white text
- **Font**: title-massive (display), font-mono (labels), font-display (uppercase UI)
- **Animations**: CSS `modal-step-fade` (0.16s fade) for step transitions; framer-motion opacity/y ONLY on outer modal backdrop container

## Core Features (implemented & tested)
- Multi-step booking modal (service → barber → date/time → personal info → confirmation)
  - CSS `modal-step-fade` transitions (no lag, no backdrop-blur, framer-motion stripped from inner steps)
- Public APIs: services, barbers, availability, bookings, testimonials, business info
- Admin panel with JWT auth: manage bookings, services, barbers, schedules
- Booking confirmation emails via Resend (DISABLED — no API key)
- Pages: Home, Style Finder, Services, Gallery, About, Contact, Admin

## What was done
### 2026-06-06
- Cloned `tzoul1.git`, installed all dependencies, seeded MongoDB
- Complete monochrome Apple aesthetic redesign (index.css, tailwind.config.js, all sections/components)
- Removed heavy framer-motion inner step animations and backdrop-blur from BookingModal for performance
- Replaced with lightweight CSS `modal-step-fade` keyframe
- Full e2e booking flow tested and validated (100% pass rate)

## What's NOT yet configured
- `RESEND_API_KEY` is empty — booking confirmation emails won't send (user deferred)
- Default admin credentials should be changed for production
- Services/barbers stored in memory — admin changes lost on server restart

## Prioritized Backlog
- P1: Add real `RESEND_API_KEY` for email confirmations (user to provide key when ready)
- P1: Change production admin password
- P2: Persist services/barbers to MongoDB (currently in-memory)
- P2: Rate limiting on booking endpoint
- P3: Expand Admin dashboard (manage barbers, services, schedules end-to-end)
- P3: Instagram post management flow end-to-end
