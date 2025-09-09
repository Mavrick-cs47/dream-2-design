# Dream to Design (D2D)

Type your dream, get a faithful AI visual and a 6‑scene slideshow story with smooth transitions.

## What it does

- Dream input → shows emotion bars (joy, fear, mystery, anxiety).
- AI image for the main preview.
- 6‑image “story mode” slideshow (Back / Pause / Next) with smooth crossfade/morph effects.
- Mobile‑friendly UI, cosmic background, and footer credit.
- Serverless API (Express wrapped) running on Netlify Functions.

## Tech

- React + Vite + TypeScript + Tailwind
- React Router, TanStack Query, Framer Motion
- Express (serverless-http) for API/Netlify Functions
- Pollinations image fallback (works without paid keys)

## Project structure

- client/ — React app (pages, components, styles)
- server/ — API routes and services (analyze, render, story)
- netlify/functions/api.ts — Netlify Functions entry
- netlify.toml — build, redirects (includes SPA fallback)

## Environment variables

- DEMO_MODE=true (required for out‑of‑the‑box deploy)
- Optional (better images): IMAGE_API_PROVIDER and IMAGE_API_KEY
- Optional: DEFAULT_PLACEHOLDER_IMAGE
- Note: In demo mode, no login or database is needed.

## Run locally

- Install: pnpm i (or npm i)
- Dev: pnpm dev
- Typecheck: pnpm typecheck
- Build: pnpm build

## Deploy on Netlify

1. New site from Git → select repo.
2. Set Environment variables: DEMO_MODE=true (only this required for demo).
3. Build settings are read from netlify.toml:
   - Publish: dist/spa
   - Functions: netlify/functions
   - Redirects: /api/* → Functions, and /* → /index.html for SPA
4. Post processing: disable Asset Optimization.
5. Deploy → Clear cache and deploy → hard refresh (Ctrl/Cmd+Shift+R).

## How it works

- POST /api/dream/analyze: parses text; returns summary + basic emotions (client also computes a fallback to ensure bars always show).
- POST /api/dream/render: generates preview; falls back to Pollinations URL when no key/provider.
- POST /api/dream/story: returns 6 images; client guarantees 6 if needed.

## Notes

- No login, no database, no insights/journal/visualizer pages in demo mode.
- All UI elements are responsive, including the story slideshow controls.

## Credit

Created by Chirag Sharma — All rights reserved 2025.
