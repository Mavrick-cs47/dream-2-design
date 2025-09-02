import { Router } from "express";
import { requireAuth } from "../auth/jwt";
import { getRepos } from "../db";

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {
  const repos = await getRepos();
  const dreams = await repos.dreams.listByUser((req as any).user.sub);
  const symbolFreq = new Map<string, number>();
  const emotionSum: Record<string, number> = {};
  for (const d of dreams) {
    for (const k of d.keywords) symbolFreq.set(k, (symbolFreq.get(k) || 0) + 1);
    for (const [k, v] of Object.entries(d.emotions || {})) emotionSum[k] = (emotionSum[k] || 0) + v;
  }
  const recurringSymbols = Array.from(symbolFreq.entries()).sort((a,b)=>b[1]-a[1]).slice(0, 20).map(([k, v]) => ({ symbol: k, count: v }));
  const topEmotions = Object.entries(emotionSum).map(([k,v])=>({ emotion:k, score:v })).sort((a,b)=>b.score-a.score).slice(0,5);
  const commonSettings = recurringSymbols.filter(s=>/city|forest|ocean|space|home|school/.test(s.symbol));
  return res.json({ recurringSymbols, topEmotions, commonSettings });
  /* sample
  { "recurringSymbols":[{"symbol":"flying","count":4}],"topEmotions":[{"emotion":"joy","score":2.4}],"commonSettings":[{"symbol":"city","count":3}] }
  */
});

router.get("/trends", requireAuth, async (req, res) => {
  const repos = await getRepos();
  const dreams = await repos.dreams.listByUser((req as any).user.sub);
  const since = Date.now() - 1000 * 60 * 60 * 24 * 30;
  const filtered = dreams.filter((d) => +new Date(d.timestamp) >= since);
  const timeline = filtered.map((d) => ({ t: d.timestamp, emotions: d.emotions }));
  const wordFreq: Record<string, number> = {};
  for (const d of filtered) for (const k of d.keywords) wordFreq[k] = (wordFreq[k] || 0) + 1;
  return res.json({ timeline, wordCloudData: Object.entries(wordFreq).map(([text, value])=>({ text, value })) });
  /* sample
  { "timeline":[{"t":"2025-01-01","emotions":{"joy":0.6}}],"wordCloudData":[{"text":"flying","value":3}] }
  */
});

export default router;
