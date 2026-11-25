"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide scroll reveal. Finds cards (direct children of grids) and content blocks
 * inside <main> that start below the fold, and fades them up as they enter the viewport.
 * Cards in the same grid are staggered. Anything already on screen is left untouched,
 * so there is no flash on load. Re-scans when streamed content arrives (loading states).
 * Add data-no-reveal to opt an area out.
 */
export default function ScrollReveal() {
  const path = usePathname();

  // header shadow once the page scrolls
  useEffect(() => {
    const header = document.querySelector("body > header") as HTMLElement | null;
    if (!header) return;
    const on = () => {
      if (window.scrollY > 8) header.dataset.scrolled = "";
      else delete header.dataset.scrolled;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    const seen = new WeakSet<Element>();
    const timers: ReturnType<typeof setTimeout>[] = [];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.dataset.revealed = "";
          // hand control back to the element's own hover transitions once revealed
          timers.push(
            setTimeout(() => {
              delete el.dataset.reveal;
              delete el.dataset.revealed;
              el.style.transitionDelay = "";
            }, 1200)
          );
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    let pending = 0;
    function schedule() {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(scan);
    }

    // only touch elements React has already hydrated, otherwise React reports an attribute mismatch
    const hydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));
    let retries = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const scan = () => {
      const fold = window.innerHeight * 0.92;
      let waiting = false;
      const skip = (el: Element) => {
        if (seen.has(el) || el.closest("[data-no-reveal], .anim-fade-up, [data-reveal]")) return true;
        if (!hydrated(el)) {
          waiting = true;
          return true;
        }
        return false;
      };

      const cards = Array.from(main.querySelectorAll<HTMLElement>(".grid > *")).filter(
        (el) => !skip(el) && el.getBoundingClientRect().height > 0
      );
      let blocks = Array.from(main.querySelectorAll<HTMLElement>("section, article, h2, details, table")).filter(
        (el) => !skip(el) && !cards.some((c) => c.contains(el) || el.contains(c))
      );
      blocks = blocks.filter((el) => !blocks.some((o) => o !== el && o.contains(el)));

      [...cards, ...blocks].forEach((el) => {
        seen.add(el);
        if (el.getBoundingClientRect().top <= fold) return; // already visible: leave it alone
        el.dataset.reveal = "";
        if (cards.includes(el) && el.parentElement) {
          const i = Array.from(el.parentElement.children).indexOf(el);
          el.style.transitionDelay = `${(i % 6) * 70}ms`;
        }
        io.observe(el);
      });

      if (waiting && retries < 40) {
        retries++;
        clearTimeout(retryTimer);
        retryTimer = setTimeout(schedule, 150);
      }
    };

    schedule();

    // streamed or client-rendered content (loading.tsx, Suspense) arrives after mount
    const mo = new MutationObserver((records) => {
      if (records.some((r) => Array.from(r.addedNodes).some((n) => n.nodeType === 1))) schedule();
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(pending);
      clearTimeout(retryTimer);
      mo.disconnect();
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [path]);

  return null;
}
