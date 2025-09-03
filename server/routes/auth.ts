import { Router } from "express";
import { getRepos } from "../db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signToken, requireAuth } from "../auth/jwt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const router = Router();

// Passport Google Strategy (enabled only if envs are present)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const OAUTH_CALLBACK_URL =
  process.env.OAUTH_CALLBACK_URL || "/api/auth/google/callback";

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: OAUTH_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const repos = await getRepos();
          const email =
            profile.emails?.[0]?.value || `${profile.id}@googleuser.com`;
          const user = await repos.users.findOrCreateGoogle({
            googleId: profile.id,
            name: profile.displayName || "Google User",
            email,
          });
          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
          });
        } catch (e) {
          done(e as any, undefined);
        }
      },
    ),
  );
}

router.post("/signup", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, password } = parsed.data;
  const repos = await getRepos();
  const existing = await repos.users.findByEmail(email);
  if (existing) return res.status(409).json({ error: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await repos.users.createLocalUser({ name, email, passwordHash });
  const token = signToken({ sub: user.id, email: user.email, name: user.name });
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
  /* sample response
  { "token":"...", "user": {"id":"abc","name":"Chirag","email":"c@example.com"} }
  */
});

router.post("/login", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const repos = await getRepos();
  const user = await repos.users.findByEmail(email);
  if (!user || !user.passwordHash)
    return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ sub: user.id, email: user.email, name: user.name });
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

router.get("/google", (req, res, next) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET)
    return res.status(501).json({ error: "Google OAuth not configured" });
  return passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
});

router.get("/google/callback", (req, res, next) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET)
    return res.status(501).json({ error: "Google OAuth not configured" });
  passport.authenticate("google", { session: false }, (err: any, user: any) => {
    if (err || !user) return res.status(401).json({ error: "OAuth failed" });
    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    // Redirect back to frontend with token
    const redirectUrl = new URL(
      process.env.OAUTH_SUCCESS_REDIRECT || "http://localhost:8080/auth",
    );
    redirectUrl.searchParams.set("token", token);
    return res.redirect(302, redirectUrl.toString());
  })(req, res, next);
});

router.get("/me", async (_req, res) => {
  return res.status(200).json({ ok: true });
});

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const repos = await getRepos();
    const user = await repos.users.findById((req as any).user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { id, name, email, createdAt } = user;
    return res.json({ id, name, email, createdAt });
  } catch (e) {
    return res.status(500).json({ error: "Failed to load profile" });
  }
});

export default router;
