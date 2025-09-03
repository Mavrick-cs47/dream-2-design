import Layout from "@/components/layout/Layout";
import { useMemo, useState } from "react";

export default function Visualizer() {
  const [seed, setSeed] = useState(42);
  const prompt = "surreal neon city in the clouds, cinematic, fantasy, ultra-detailed";
  const url = useMemo(() => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${seed}`, [seed]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Dream Visualizer</h1>
          <p className="text-white/70 mt-2">Auto-fetched placeholder art while your own visuals are being created.</p>
          <div className="mt-6">
            <img src={url} alt="Visualizer" className="w-full aspect-video rounded-xl border border-white/10 object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder.svg'}} />
            <div className="mt-3 flex gap-2">
              <button onClick={()=>setSeed(Math.floor(Math.random()*100000))} className="px-4 py-2 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-white">Regenerate</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
