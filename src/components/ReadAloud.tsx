"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

type State = "idle" | "playing" | "paused";

function getPageText(): string {
  const main = document.querySelector("main");
  if (!main) return "";
  const clone = main.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll("script,style,noscript,[aria-hidden='true'],[data-no-read],[hidden]")
    .forEach((el) => el.remove());
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

  // Stop when navigating to a new page
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setState("idle");
  }, [pathname]);

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

    synth.cancel();
    const text = getPageText();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    const voices = synth.getVoices();
    const preferred =
      voices.find((v) => v.name.toLowerCase().includes("google") && v.lang.startsWith("en")) ??
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

  const isActive = state !== "idle";

  return (
    <div className="ml-1 hidden items-center gap-1 sm:flex">
      {/* Play / Pause button */}
      <button
        onClick={state === "playing" ? pause : speak}
        aria-label={
          state === "playing" ? "Pause reading" : state === "paused" ? "Resume reading" : "Read page aloud"
        }
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-ink"
        }`}
      >
        {/* Speaker / pause / resume icon */}
        {state === "playing" ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1.5" />
            <rect x="14" y="5" width="4" height="14" rx="1.5" />
          </svg>
        ) : state === "paused" ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
            <path d="M6 4.75v14.5a.75.75 0 0 0 1.14.638l11-7.25a.75.75 0 0 0 0-1.276l-11-7.25A.75.75 0 0 0 6 4.75z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5z" />
            <path strokeLinecap="round" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path strokeLinecap="round" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
        <span>
          {state === "playing" ? "Pause" : state === "paused" ? "Resume" : "Read aloud"}
        </span>
      </button>

      {/* Stop button — only while active */}
      {isActive && (
        <button
          onClick={stop}
          aria-label="Stop reading"
          title="Stop reading"
          className="flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <rect x="5" y="5" width="14" height="14" rx="2" />
          </svg>
        </button>
      )}
    </div>
  );
}
