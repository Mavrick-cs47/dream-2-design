import Layout from "@/components/layout/Layout";
import { useEffect, useMemo, useState } from "react";

interface DreamItem {
  id: string;
  text: string;
  summary: string;
  timestamp: string | Date;
  imageURL?: string;
}

export default function Journal() {
  const [loading, setLoading] = useState(true);
  const [dreams, setDreams] = useState<DreamItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("d2d_token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        } as HeadersInit;

        // 1) Load profile to get createdAt
        const profRes = await fetch("/api/auth/profile", { headers });
        if (!profRes.ok) throw new Error("Failed to load profile");
        const profile = await profRes.json();
        const createdAt = new Date(profile.createdAt);

        // 2) Load dreams and filter by createdAt
        const listRes = await fetch("/api/dream/list", { headers });
        if (!listRes.ok) throw new Error("Failed to load dreams");
        const list: DreamItem[] = await listRes.json();
        const filtered = list.filter((d) => new Date(d.timestamp) >= createdAt);
        if (mounted) setDreams(filtered);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load journal");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const empty = useMemo(() => !loading && !error && dreams.length === 0, [loading, error, dreams]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Dream Journal</h1>
          <p className="text-white/70 mt-2">Only dreams created after your signup are shown.</p>

          {loading && <div className="mt-6 text-white/70">Loading…</div>}
          {error && <div className="mt-6 text-red-400">{error}</div>}
          {empty && <div className="mt-6 text-white/60">No dreams yet after your signup.</div>}

          {!loading && !error && dreams.length > 0 && (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dreams.map((d) => (
                <div key={d.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <img
                    src={d.imageURL || "/placeholder.svg"}
                    alt={d.summary || "Dream image"}
                    className="w-full aspect-video object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="p-3">
                    <div className="text-sm font-semibold line-clamp-1">{d.summary || "Dream"}</div>
                    <div className="text-xs text-white/60">{new Date(d.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
