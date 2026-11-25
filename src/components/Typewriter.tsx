"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

/** Types a phrase, holds, deletes it and moves to the next. Space is reserved for the longest phrase so nothing jumps. */
export function Typewriter({
  phrases,
  className = "",
  typeMs = 75,
  deleteMs = 38,
  holdMs = 2000,
  startDelay = 700,
}: {
  phrases: string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  startDelay?: number;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (reduced || !started) return;
    const full = phrases[index];
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < full.length) {
        t = setTimeout(() => setText(full.slice(0, text.length + 1)), typeMs + Math.random() * 40);
      } else {
        t = setTimeout(() => setPhase(phrases.length > 1 ? "holding" : "typing"), 50);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("deleting"), holdMs);
    } else if (text.length > 0) {
      t = setTimeout(() => setText(text.slice(0, -1)), deleteMs);
    } else {
      t = setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setPhase("typing");
      }, 250);
    }
    return () => clearTimeout(t);
  }, [text, phase, index, phrases, reduced, started, typeMs, deleteMs, holdMs]);

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");
  const shown = reduced ? phrases[0] : text;

  return (
    <span className={`inline-grid align-top ${className}`} aria-hidden>
      <span className="invisible col-start-1 row-start-1">{longest}</span>
      <span className="col-start-1 row-start-1">
        {shown}
        <span className="tb-caret" />
      </span>
    </span>
  );
}

/** Types a sentence once, after a delay, with the final height reserved up front. */
export function TypeOnce({ text, delay = 1200, speed = 22, className = "" }: { text: string; delay?: number; speed?: number; className?: string }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (reduced || !started || count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [count, started, reduced, speed, text.length]);

  const done = reduced || count >= text.length;
  return (
    <span className={`grid ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">{text}</span>
      <span aria-hidden className="col-start-1 row-start-1">
        {reduced ? text : text.slice(0, count)}
        {!done && started && <span className="tb-caret tb-caret-sm" />}
      </span>
    </span>
  );
}
