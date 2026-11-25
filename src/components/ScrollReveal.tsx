"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide scroll reveal. Finds cards (direct children of grids) and content blocks
 * inside <main> that start below the fold, and fades them up as they enter the viewport.
 * Cards in the same grid are staggered. Anything already on screen is left untouched,
 * so there is no flash on load. Add data-no-reveal to opt an area out.
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
    let io: IntersectionObserver | null = null;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const frame = requestAnimationFrame(() => {
      const main = document.querySelector("main");
      if (!main) return;
      const fold = window.innerHeight * 0.92;
      const skip = (el: Element) => !!el.closest("[data-no-reveal], .anim-fade-up, [data-reveal]");

      const cards = Array.from(main.querySelectorAll<HTMLElement>(".grid > *")).filter(
        (el) => !skip(el) && el.getBoundingClientRect().height > 0
      );
      let blocks = Array.from(main.querySelectorAll<HTMLElement>("section, article, h2, details, table")).filter(
        (el) => !skip(el) && !cards.some((c) => c.contains(el) || el.contains(c))
      );
      blocks = blocks.filter((el) => !blocks.some((o) => o !== el && o.contains(el)));

      const targets = [...cards, ...blocks].filter((el) => el.getBoundingClientRect().top > fold);
      if (!targets.length) return;

      targets.forEach((el) => {
        el.dataset.reveal = "";
        if (cards.includes(el) && el.parentElement) {
          const i = Array.from(el.parentElement.children).indexOf(el);
          el.style.transitionDelay = `${(i % 6) * 70}ms`;
        }
      });

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            io?.unobserve(el);
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
      targets.forEach((el) => io!.observe(el));
    });

    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [path]);

  return null;
}
