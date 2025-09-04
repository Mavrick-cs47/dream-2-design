# Dream to Design (D2D)

Type your dream, get a faithful AI visual and a 6‑scene slideshow story with smooth transitions.

## What it does

- Dream input → shows emotion bars (joy, fear, mystery, anxiety).
- AI image for the main preview.
- 6‑image “story mode” slideshow (Back / Pause / Next) with crossfade/morph.
- Mobile‑friendly UI and footer credit.

## Tech

- React + Vite + TypeScript + Tailwind
- React Router, TanStack Query, Framer Motion
- Express (serverless-http) for Netlify Functions
- Pollinations image fallback (works without paid keys)

## Environment variables

- DEMO_MODE=true (required for out‑of‑the‑box deploy)
- Optional: IMAGE_API_PROVIDER and IMAGE_API_KEY for higher‑quality providers

## Run locally

- Install: pnpm i (or npm i)
- Dev: pnpm dev
- Build: pnpm build

## Deploy on Netlify

1. New site from Git → select repo.
2. Env vars: DEMO_MODE=true.
3. netlify.toml already sets:
   - Publish: dist/spa
   - Functions: netlify/functions
   - Redirects: /api/_ → function, and SPA fallback /_ → /index.html
4. Deploy → Clear cache and deploy → hard refresh (Ctrl/Cmd+Shift+R).

## How it works

- POST /api/dream/analyze: parses text; client guarantees emotion bars.
- POST /api/dream/render: generates preview; falls back to Pollinations URL.
- POST /api/dream/story: returns 6 images; client guarantees 6 if needed.

## Credit

Created by Chirag Sharma — All rights reserved 2025.
