Dream to Design (D2D)
Turn written dreams into visuals and a storyboard. Secure JWT auth, optional Clerk UI, serverless API on Netlify.
Features
•	Dream analysis → keywords, basic emotion scores
•	AI image generation with graceful fallback (Pollinations if no key)
•	6 scene “Dream Story” storyboard
•	Journal shows only dreams created after the user’s signup date
•	JWT auth (local signup/login, optional Google OAuth)
•	Serverless API via Netlify Functions; SPA routing
Tech Stack
•	Vite + React, TypeScript, Tailwind, Radix UI
•	React Router, TanStack Query
•	Express (wrapped by serverless-http) for Netlify Functions
•	MongoDB (optional) with Mongoose; in memory fallback
•	Clerk (optional) for auth UI
Project Structure
•	client/ … React app (App.tsx, pages, components)
•	server/ … Express routes, services, repositories
•	netlify/functions/api.ts … Netlify entry → server/createServer()
•	netlify.toml … build, redirects, functions config
•	shared/ … shared types
•	public/ … static assets
Environment Variables
Set these in Netlify (Site settings → Environment variables) and locally in your shell (do not commit secrets).
•	JWT_SECRET = strong random string (required)
•	MONGODB_URI = mongodb+srv://... (optional; else in memory)
•	DEMO_MODE = true|false (optional; true bypasses auth; not for prod)
•	VITE_CLERK_PUBLISHABLE_KEY = pk_live_... (optional; if using Clerk UI)
•	GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OAUTH_SUCCESS_REDIRECT (optional; Google OAuth)
•	IMAGE_API_KEY (optional) with IMAGE_API_PROVIDER = stability|openai|replicate
•	REPLICATE_MODEL / REPLICATE_MODEL_VERSION (optional)
•	DEFAULT_PLACEHOLDER_IMAGE (optional)
Local Development
•	Install: pnpm i (or npm i)
•	Dev: pnpm dev (Vite)
•	Typecheck: pnpm typecheck
•	Tests: pnpm test
Build
•	Client: pnpm build:client → dist/spa
•	Server: pnpm build:server → dist/server
•	Full: pnpm build
Deployment (Netlify)
1.	Push repo to GitHub.
2.	Netlify → New site from Git → pick repo.
3.	Netlify will use netlify.toml:
o	command: npm run build:client
o	publish: dist/spa
o	functions: netlify/functions
o	redirects: /api/* → .netlify/functions/api/:splat (200)
4.	Add env vars (see above) → Deploy.
5.	Verify:
o	https:///api/ping
o	App loads at root route
o	If blank: ensure VITE_CLERK_PUBLISHABLE_KEY is set or remove Clerk usage.
Authentication Flow
•	Local email/password:
o	POST /api/auth/signup → returns JWT
o	POST /api/auth/login → returns JWT
•	Google OAuth (optional):
o	GET /api/auth/google → OAuth → redirects back to OAUTH_SUCCESS_REDIRECT with ?token=
•	Frontend stores token in localStorage as d2d_token.
•	Protected endpoints require Authorization: Bearer .
API Endpoints
•	GET /api/ping → { message }
•	POST /api/dream/analyze → { id, title, keywords, emotions, timestamp }
•	POST /api/dream/render → { success, imageURL }
•	POST /api/dream/story → { success, storyImages[] }
•	GET /api/dream/list → user’s dreams (server filters by user; Journal filters by signup date)
•	GET /api/dream/:id → specific dream
•	GET /api/dream/audio/:id → placeholder response
•	POST /api/auth/signup|login → { token, user }
•	GET /api/auth/profile → { id, name, email, createdAt } (auth required)
•	GET /api/auth/google, /api/auth/google/callback (optional)
Data Layer
•	Repos abstraction with memory and Mongo implementations.
•	If MONGODB_URI missing/unreachable, logs a warning and uses in memory (non persistent).
Image & Story Generation
•	server/services/image.ts builds a cinematic prompt; if IMAGE_API_KEY missing, falls back to Pollinations URL so visuals still work.
•	server/services/story.ts splits dream into six scenes and generates one image per scene using the same pipeline.
Journal Rule
•	Frontend fetches /api/auth/profile to read createdAt, then GET /api/dream/list and shows only dreams with timestamp ≥ createdAt.
Branding
•	Navbar uses your provided logo image; favicon set to same image.
•	Footer: “Created by Chirag Sharma — All rights reserved 2025”.
Troubleshooting
•	Blank screen: set VITE_CLERK_PUBLISHABLE_KEY (or remove Clerk usage), hard refresh.
•	401s: ensure JWT_SECRET set and client sends Authorization header.
•	No images: set IMAGE_API_KEY or rely on fallback (Pollinations).
•	No persistence: set MONGODB_URI.
Security Notes
•	Always set a strong JWT_SECRET in production; never commit secrets.
•	Prefer Netlify env vars; rotate secrets periodically.
License
•	Add your chosen license here.
