import { useCallback, useRef } from "react";

// Small WebAudio-based sfx for hover/click without assets
export function useSfx() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current;
  };

  const ping = useCallback((freq = 660) => {
    const ctx = ensureCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = 0.0001;
    o.connect(g).connect(ctx.destination);
    o.start();
    // quick attack/decay
    g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
    o.stop(ctx.currentTime + 0.16);
  }, []);

  const click = useCallback(() => ping(520), [ping]);
  const hover = useCallback(() => ping(740), [ping]);

  return { click, hover };
}
