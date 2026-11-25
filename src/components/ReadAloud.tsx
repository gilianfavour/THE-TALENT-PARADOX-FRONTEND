"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

type State = "idle" | "playing" | "paused";

function getPageText(): string {
  const main = document.querySelector("main");
  if (!main) return "";
  // Clone so we can strip unwanted nodes without touching the DOM
  const clone = main.cloneNode(true) as HTMLElement;
  // Remove scripts, styles, hidden elements, and anything marked to skip
  clone
    .querySelectorAll(
      "script,style,noscript,[aria-hidden='true'],[data-no-read],[hidden]"
    )
    .forEach((el) => el.remove());
  // Collapse whitespace and return plain text
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

export default function ReadAloud() {
  const [state, setState] = useState<State>("idle");
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Stop reading when the user navigates to a new page
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }, [pathname]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    const synth = window.speechSynthesis;

    if (state === "paused") {
      synth.resume();
      setState("playing");
      return;
    }

    // Fresh start
    synth.cancel();
    const text = getPageText();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Pick a natural-sounding voice if available (prefer Google voices in Chrome)
    const voices = synth.getVoices();
    const preferred =
      voices.find((v) => v.name.toLowerCase().includes("google") && v.lang.startsWith("en")) ??
      voices.find((v) => v.lang.startsWith("en") && !v.localService === false) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null;
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    utteranceRef.current = utterance;

    synth.speak(utterance);
    setState("playing");
  }, [state]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setState("paused");
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState("idle");
  }, []);

  if (!supported) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      role="region"
      aria-label="Read aloud controls"
    >
      {/* Stop button — only visible while active */}
      {state !== "idle" && (
        <button
          onClick={stop}
          aria-label="Stop reading"
          title="Stop"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:bg-slate-100 hover:text-red-500"
        >
          {/* Stop square */}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <rect x="5" y="5" width="14" height="14" rx="2" />
          </svg>
        </button>
      )}

      {/* Play / Pause toggle */}
      <button
        onClick={state === "playing" ? pause : speak}
        aria-label={
          state === "playing"
            ? "Pause reading"
            : state === "paused"
            ? "Resume reading"
            : "Read page aloud"
        }
        title={
          state === "playing"
            ? "Pause"
            : state === "paused"
            ? "Resume"
            : "Read aloud"
        }
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
          state !== "idle"
            ? "bg-brand-600 text-white hover:bg-brand-700"
            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-brand-600"
        }`}
      >
        {state === "playing" ? (
          // Pause icon
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1.5" />
            <rect x="14" y="5" width="4" height="14" rx="1.5" />
          </svg>
        ) : state === "paused" ? (
          // Resume / play icon
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M6 4.75v14.5a.75.75 0 0 0 1.14.638l11-7.25a.75.75 0 0 0 0-1.276l-11-7.25A.75.75 0 0 0 6 4.75z" />
          </svg>
        ) : (
          // Speaker / read aloud icon
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5z" />
            <path strokeLinecap="round" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path strokeLinecap="round" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Tooltip label — only shown in idle so users know what the button does */}
      {state === "idle" && (
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 select-none">
          Read aloud
        </span>
      )}
    </div>
  );
}
