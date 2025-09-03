import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DreamStoryViewer({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<number | null>(null);
  const imgs = useMemo(() => images.filter(Boolean), [images]);

  useEffect(() => {
    if (!playing || imgs.length === 0) return;
    timer.current = window.setInterval(
      () => setI((p) => (p + 1) % imgs.length),
      3500,
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, imgs.length]);

  if (imgs.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {imgs.slice(0, 6).map((src, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 aspect-video"
          >
            <img
              src={src}
              alt={`Dream scene ${idx + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
