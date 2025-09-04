

Dream to Design (D2D)
Type your dream, get an AI visual, and a 6‑scene slideshow story with smooth transitions.

What it does
Dream input → analyzes basic emotions (joy, fear, mystery, anxiety) and shows progress bars.
AI image generation for the main preview.
6‑image “story mode” slideshow with Back / Pause / Next and smooth crossfade/morph effects.
Mobile‑friendly UI, cosmic background, footer credit.
Serverless API (Express wrapped) running on Netlify Functions.
Tech
React + Vite + TypeScript + Tailwind
React Router, TanStack Query, Framer Motion
Express (serverless-http) for API
Pollinations fallback for images (works without paid keys)
Project structure
client/ … React app (pages, components, styles)
server/ … API routes and services (analyze, render, story)
netlify/functions/api.ts … Netlify Functions entry
netlify.toml … build, redirects (includes SPA fallback)
Environment variables
DEMO_MODE=true (required for the “works out of the box” mode)
Optional (better images): IMAGE_API_PROVIDER and IMAGE_API_KEY
Optional: DEFAULT_PLACEHOLDER_IMAGE
Note: In demo mode, no login or database is needed.

Run locally
Install: pnpm i (or npm i)
Dev: pnpm dev
Typecheck: pnpm typecheck
Build: pnpm build
Deploy on Netlify (exact same behavior as preview)
Push repo to GitHub.
Netlify → New site from Git → select repo.
Set Environment variables: DEMO_MODE=true (only this required).
Build settings auto‑read from netlify.toml:
Publish directory: dist/spa
Functions directory: netlify/functions
Redirects: /api/* → Functions, and /* → /index.html for SPA
Post processing: disable Asset Optimization.
Deploy → Clear cache and deploy site → hard refresh (Ctrl/Cmd+Shift+R).
How it works (high level)
POST /api/dream/analyze: parses your text, returns summary + basic emotions (client also computes a fallback to ensure bars always show).
POST /api/dream/render: generates a preview image; if no key, falls back to Pollinations URL.
POST /api/dream/story: returns 6 scene images; client guarantees 6 via fallback if the API can’t.
Notes
No login, no database, no insights/journal/visualizer pages.
All UI elements are responsive, including the story slideshow controls.
Credit
Created by Chirag Sharma — All rights reserved 2025.

