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
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 aspect-video">
        <AnimatePresence mode="wait">
          <motion.img
            key={i}
            src={imgs[i]}
            alt={`Dream scene ${i + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </AnimatePresence>
      </div>
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {imgs.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 w-8 rounded ${idx === i ? "bg-brand-cyan" : "bg-white/20"}`}
              aria-label={`Go to scene ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setI((i - 1 + imgs.length) % imgs.length)}
            className="px-2 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80"
          >
            Back
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="px-2 sm:px-3 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-white"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setI((i + 1) % imgs.length)}
            className="px-2 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
