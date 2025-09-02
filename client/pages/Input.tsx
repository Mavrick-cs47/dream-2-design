import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function InputPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { summary: string; imageUrl: string; emotions: Record<string, number> }>(null);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">Describe Your Dream</h1>
          <p className="text-white/70 mb-4">Type or record your dream. We will analyze and visualize it using AI.</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Last night I found myself in a city of floating lights..."
            className="w-full min-h-[160px] md:min-h-[220px] resize-y rounded-xl bg-black/30 border border-white/10 p-4 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
          />
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <VoiceRecorder />
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
                  setResult(data);
                } catch (e) {
                  console.error(e);
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
            <Spinner /> <span className="text-white/80">AI is processing your dream...</span>
          </div>
        )}

        {result && (
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-2">Preview</h2>
            <p className="text-white/70 mb-4">{result.summary}</p>
            <img src={result.imageUrl} alt="Dream visualization" className="w-full aspect-video object-cover rounded-xl border border-white/10" />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(result.emotions).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-white/5 border border-white/10 p-3 text-sm">
                  <div className="flex justify-between"><span className="text-white/70">{k}</span><span>{Math.round(v * 100)}%</span></div>
                  <div className="h-1 rounded bg-white/10 mt-2">
                    <div className="h-1 rounded bg-brand-cyan" style={{ width: `${v * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-6 w-6 text-brand-cyan" viewBox="0 0 50 50">
      <circle className="opacity-20" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
      <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="100" strokeDashoffset="75" />
    </svg>
  );
}

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    setDuration(0);
    timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      // Placeholder: attach to request if needed in the future
      void blob;
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stop : start}
      className={`px-6 py-3 rounded-full border ${
        recording
          ? "bg-brand-purple/30 border-brand-purple/50 text-white"
          : "bg-white/5 border-white/10 text-white/90 hover:text-white hover:bg-white/10"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          {recording ? (
            <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
          ) : (
            <path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z M19 11a7 7 0 01-14 0m7 7v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
        {recording ? `Recording... ${duration}s` : "Record Voice"}
      </span>
    </button>
  );
}
