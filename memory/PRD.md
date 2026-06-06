# TZOUL BARBER — PRD

## Original Problem Statement
User asked to open and set up the GitHub project `https://github.com/g65102345-ux/tzoul1.git` — clone it and run it. No specific changes requested at this time.

## Project Overview
TZOUL BARBER is a premium barbershop booking website (Athens, Heraklion). React + FastAPI + MongoDB.

## Architecture
- **Frontend**: React 19 + CRACO + Tailwind + framer-motion + Radix UI (`/app/frontend`)
- **Backend**: FastAPI + Motor (MongoDB async) + JWT auth + Resend email (`/app/backend`)
- **Database**: MongoDB (DB: `tzoul_barber`, collections: `bookings`, `schedules`, `instagram_posts`)
- **Integrations**: Resend (email confirmations — key not provided, intentionally disabled)

## Core Features (implemented)
- Multi-step booking modal (service → barber → date/time → personal info → confirmation)
- Public APIs: services, barbers, availability, bookings, testimonials, business info, instagram-posts
- Admin panel with JWT auth: manage bookings, services, barbers, schedules, Instagram posts
- Booking confirmation emails via Resend (disabled until API key provided)
- Multilingual UI (EN/EL toggle in header)
- Animated intro, parallax images, ticker, music toggle
- Pages: Home, Style Finder, Services, Instagram, Gallery, About, Contact, Admin

## What was done (2026-06-06)
- Cloned `tzoul1.git` from GitHub into `/app`
- Installed all backend (pip install -r requirements.txt) and frontend (yarn install) dependencies
- Configured `/app/backend/.env` with MONGO_URL, DB_NAME=tzoul_barber, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, RESEND_API_KEY (empty), SENDER_EMAIL, CORS_ORIGINS
- Both frontend & backend services running via supervisor
- All 13 backend tests passed (100%), all frontend flows verified

## What's NOT yet configured
- `RESEND_API_KEY` is empty — booking confirmation emails won't send until user adds a real key
- Default admin credentials: `admin@tzoulbarber.com` / `admin123` — should be changed for production
- SERVICES and BARBERS are in-memory lists — admin CRUD changes are lost on server restart (consider persisting to MongoDB)

## Prioritized Backlog
- P1: Add real RESEND_API_KEY for email confirmations
- P1: Change production admin password
- P2: Persist services/barbers to MongoDB so admin changes survive restarts
- P2: Rate limiting on booking creation endpoint
- P3: Instagram post management flow end-to-end testing
