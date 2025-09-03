import { Router } from "express";
import { requireAuth } from "../auth/jwt";
import { getRepos } from "../db";
import { z } from "zod";
import rateLimit from "express-rate-limit";

const router = Router();
const limiter = rateLimit({ windowMs: 60_000, max: 20 });
const DEMO = process.env.DEMO_MODE === "true";
const auth = DEMO ? (_req: any, _res: any, next: any) => next() : requireAuth;

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-zA-Z']+/g) || [];
  const stop = new Set(["the","and","a","to","of","in","it","i","was","that","with","on","for","as","is","at","my","we","you"]);
  const freq = new Map<string, number>();
  for (const w of words) {
    if (stop.has(w) || w.length < 3) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return Array.from(freq.entries()).sort((a,b)=>b[1]-a[1]).slice(0, 12).map(([w])=>w);
}

function analyzeEmotions(text: string): Record<string, number> {
  const lex: Record<string, string> = {
    joy: "happy joy love wonderful delight",
    fear: "fear afraid scary dark chased monster",
    mystery: "mystery unknown fog shadow secret",
    anxiety: "anxious stress worry nervous late exam",
  };
  const counts: Record<string, number> = {};
  const words = text.toLowerCase();
  for (const [emo, list] of Object.entries(lex)) {
    counts[emo] = list.split(" ").reduce((acc, k) => acc + (words.includes(k) ? 1 : 0), 0);
  }
  const total = Object.values(counts).reduce((a,b)=>a+b, 0) || 1;
  const scores: Record<string, number> = {};
  for (const [k, v] of Object.entries(counts)) scores[k] = Math.min(1, v / total);
  return scores;
}

router.post("/analyze", limiter, auth, async (req, res) => {
  const schema = z.object({ text: z.string().min(10) });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });
  const { text } = p.data;
  const keywords = extractKeywords(text);
  const emotions = analyzeEmotions(text);
  const summary = text.split(/[.!?]/)[0]?.slice(0, 80) || keywords.slice(0,3).join(", ");

  if (DEMO) {
    return res.json({ id: `demo-${Date.now()}`, title: summary, keywords, emotions, timestamp: new Date() });
  }

  const repos = await getRepos();
  const dream = await repos.dreams.create({
    userId: (req as any).user.sub,
    text,
    summary,
    keywords,
    emotions,
    timestamp: new Date(),
    analysisJSON: { keywords, emotions },
  });
  return res.json({ id: dream.id, title: summary, keywords, emotions, timestamp: dream.timestamp });
});

router.get("/list", auth, async (req, res) => {
  if (DEMO) return res.json([]);
  const repos = await getRepos();
  const list = await repos.dreams.listByUser((req as any).user.sub);
  return res.json(list);
});

router.get("/:id", auth, async (req, res) => {
  if (DEMO) return res.status(404).json({ error: "Not found in demo mode" });
  const repos = await getRepos();
  const d = await repos.dreams.getByIdOwned((req as any).user.sub, req.params.id);
  if (!d) return res.status(404).json({ error: "Not found" });
  return res.json(d);
});

router.get("/render/:id", limiter, auth, async (req, res) => {
  const imageURL = process.env.DEFAULT_PLACEHOLDER_IMAGE || "/placeholder.svg";
  if (DEMO) return res.json({ imageURL, updated: false });
  const repos = await getRepos();
  const d = await repos.dreams.getByIdOwned((req as any).user.sub, req.params.id);
  if (!d) return res.status(404).json({ error: "Not found" });
  const updated = await repos.dreams.update(d.id, { imageURL });
  return res.json({ imageURL, updated: !!updated });
});

router.post("/render", limiter, auth, async (req, res) => {
  const schema = z.object({ dreamText: z.string().min(5), id: z.string().optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ success: false, error: "Dream text required" });

  // Demo fallback or missing API key is handled inside service
  try {
    const { generateDreamImage } = await import("../services/image");
    const result = await generateDreamImage(p.data.dreamText);
    if (!result.success) return res.status(500).json(result);

    if (!DEMO && p.data.id) {
      const repos = await getRepos();
      await repos.dreams.update(p.data.id, { imageURL: result.imageURL });
    }
    return res.json({ success: true, imageURL: result.imageURL });
  } catch (e) {
    return res.status(500).json({ success: false, error: "Image generation failed" });
  }
});

router.post("/remix/:id", limiter, auth, async (req, res) => {
  const schema = z.object({ prompt: z.string().min(3) });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });

  if (DEMO) {
    const text = `Remix: ${p.data.prompt}`;
    const keywords = extractKeywords(text);
    const emotions = analyzeEmotions(text);
    const summary = text.split(/[.!?]/)[0]?.slice(0, 80) || keywords.slice(0,3).join(", ");
    return res.json({ id: `demo-${Date.now()}`, title: summary, keywords, emotions, timestamp: new Date() });
  }

  const repos = await getRepos();
  const base = await repos.dreams.getByIdOwned((req as any).user.sub, req.params.id);
  if (!base) return res.status(404).json({ error: "Not found" });
  const text = `${base.text}\nRemix: ${p.data.prompt}`;
  const keywords = extractKeywords(text);
  const emotions = analyzeEmotions(text);
  const summary = text.split(/[.!?]/)[0]?.slice(0, 80) || keywords.slice(0,3).join(", ");
  const dream = await repos.dreams.create({
    userId: base.userId,
    text,
    summary,
    keywords,
    emotions,
    timestamp: new Date(),
    analysisJSON: { baseId: base.id, remixPrompt: p.data.prompt, keywords, emotions },
  });
  return res.json({ id: dream.id, title: summary, keywords, emotions, timestamp: dream.timestamp });
});

router.get("/audio/:id", auth, async (_req, res) => {
  return res.status(202).json({ audioUrl: null, message: DEMO ? "Demo mode: TTS disabled" : "Text-to-Speech not configured yet" });
});

export default router;
