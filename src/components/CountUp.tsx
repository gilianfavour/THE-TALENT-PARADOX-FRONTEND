"use client";

import { useEffect, useRef } from "react";

/** Counts from 0 to `to` when scrolled into view. Server HTML shows the final number. */
export default function CountUp({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = `0${suffix}`;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = `${Math.round(to * (1 - Math.pow(1 - p, 3)))}${suffix}`;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = `${to}${suffix}`;
    };
  }, [to, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {to}
      {suffix}
    </span>
  );
}
