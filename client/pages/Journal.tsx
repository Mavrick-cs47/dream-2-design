import Layout from "@/components/layout/Layout";
import { useMemo } from "react";

export default function Journal() {
  const samples = useMemo(() => {
    const base = [
      "floating neon city over the ocean, dreamlike, cinematic",
      "walking through an endless library, glowing books, magical",
      "starlit forest with bioluminescent trees, serene and surreal",
      "ancient ruins on a flying island, mysterious fog, epic scale",
      "crystal cave with refracted lights, fantasy, ethereal",
      "cosmic desert with two moons and glass dunes, wide angle",
    ];
    return base.map((p, i) => ({
      title: `Dream ${i + 1}`,
      date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=640&height=360&nologo=true&seed=${i + 11}`,
      summary: p,
    }));
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Dream Journal Dashboard</h1>
          <p className="text-white/70 mt-2">Recent dreams and visualizations (sample placeholders).</p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {samples.map((d) => (
              <div key={d.title} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <img src={d.url} alt={d.title} className="w-full aspect-video object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder.svg'}} />
                <div className="p-3">
                  <div className="text-sm font-semibold">{d.title}</div>
                  <div className="text-xs text-white/60">{d.date}</div>
                  <div className="mt-1 text-xs text-white/70 line-clamp-2">{d.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
