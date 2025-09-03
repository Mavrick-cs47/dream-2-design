import { useState } from "react";
import Layout from "@/components/layout/Layout";
import DreamStoryViewer from "@/components/story/DreamStoryViewer";

export default function InputPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    summary: string;
    imageUrl: string;
    emotions: Record<string, number>;
    storyImages?: string[];
  }>(null);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">Describe Your Dream</h1>
          <p className="text-white/70 mb-4">
            Type your dream. We will analyze and visualize it using AI.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Last night I found myself in a city of floating lights..."
            className="w-full min-h-[160px] md:min-h-[220px] resize-y rounded-xl bg-black/30 border border-white/10 p-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
          />
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-start">
            <button
              disabled={!text.trim() || loading}
              onClick={async () => {
                setLoading(true);
                setResult(null);
                try {
                  const token = localStorage.getItem("d2d_token");
                  const res = await fetch("/api/dream/analyze", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ text }),
                  });
                  const data = await res.json();
                  const summary =
                    data.title ||
                    data.summary ||
                    text.slice(0, 80) ||
                    "Your dream preview";
                  let imageUrl = data.imageUrl as string | undefined;
                  try {
                    const imgRes = await fetch(`/api/dream/render`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({ dreamText: text, id: data.id }),
                    });
                    const img = await imgRes.json();
                    imageUrl = img.imageURL || imageUrl;
                  } catch {}
                  let storyImages: string[] | undefined;
                  try {
                    const storyRes = await fetch(`/api/dream/story`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({ dreamText: text, id: data.id }),
                    });
                    const sj = await storyRes.json();
                    storyImages = sj.storyImages;
                  } catch {}
                  setResult({
                    summary,
                    imageUrl: imageUrl || "/placeholder.svg",
                    emotions: data.emotions || {},
                    storyImages,
                  });
                } catch (e) {
                  console.error(e);
                  setResult({
                    summary: text.slice(0, 80) || "Your dream preview",
                    imageUrl: "/placeholder.svg",
                    emotions: {},
                  });
                } finally {
                  setLoading(false);
                }
              }}
              className="px-6 py-3 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 text-white hover:bg-brand-cyan/40 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Visualize Dream"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="glass-card p-6 flex items-center gap-4">
            <Spinner />{" "}
            <span className="text-white/80">
              AI is processing your dream...
            </span>
          </div>
        )}

        {result && (
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <p className="text-white/70 mb-4">{result.summary}</p>
            <img
              src={result.imageUrl}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
              alt="Dream visualization"
              className="w-full aspect-video object-cover rounded-xl border border-white/10"
            />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(result.emotions).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="text-white/70">{k}</span>
                    <span>{Math.round(v * 100)}%</span>
                  </div>
                  <div className="h-1 rounded bg-white/10 mt-2">
                    <div
                      className="h-1 rounded bg-brand-cyan"
                      style={{ width: `${v * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {result.storyImages?.length ? (
              <DreamStoryViewer images={result.storyImages} />
            ) : null}
          </div>
        )}
      </div>
    </Layout>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-6 w-6 text-brand-cyan" viewBox="0 0 50 50">
      <circle
        className="opacity-20"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset="75"
      />
    </svg>
  );
}
