"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger position, in ms. */
  delay?: number;
  className?: string;
}

/**
 * Reveals content as it scrolls into view.
 *
 * Uses IntersectionObserver rather than a scroll listener so nothing runs on
 * the main thread during scrolling. Under `prefers-reduced-motion` the
 * element is shown immediately in its final state — the content is never
 * hidden from someone who has asked for no motion.
 *
 * The animation is strictly progressive enhancement: the markup is always
 * visible, so the content still reads with JavaScript disabled, and there is
 * no opacity-0 state that could strand it.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The markup is visible by default, so simply not observing means no
    // animation — which is exactly what reduced motion asks for. No state is
    // set, so nothing cascades on mount.
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={
        shown
          ? {
              animation: `rise-in 560ms cubic-bezier(0.32,0.72,0,1) ${delay}ms both`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
