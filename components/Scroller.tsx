"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ScrollerProps {
  items: any[];
  Component: ({ item }: { item: any }) => ReactNode;
}

export const AutoScroller = ({ items, Component }: ScrollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const direction = "left";
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let isPaused = false;
    let isInView = true;
    let lastTime = 2;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0.1, rootMargin: "-10% 0px -10% 0px" },
    );

    const container = el.closest("section");
    if (container) {
      observer.observe(container);
    }

    const step = (now: number) => {
      const isOkay = lastTime >= 4;
      if (isOkay) {
        lastTime = 0;
      } else {
        lastTime += 1;
      }

      if (!isPaused && isInView && isOkay) {
        const speed = direction === "left" ? 0.5 : -0.5;
        el.scrollLeft += speed;
        // el.style.transition = "10s";
        const scrollWidth = el.scrollWidth / 2;

        if (direction === "left" && el.scrollLeft >= scrollWidth) {
          el.scrollLeft = 0;
        }
        // else if (direction === "right" && el.scrollLeft <= 0) {
        //   el.scrollLeft = scrollWidth;
        // }
      }

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);

    const pause = () => (isPaused = true);
    const resume = () => (isPaused = false);

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      observer.disconnect();
    };
  }, []);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedItems = [...items, ...items];

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-hidden max-w-4xl mx-auto px-4"
      style={{ scrollBehavior: "auto" }}
    >
      {duplicatedItems.map((t, i) => (
        <div key={`${t._id}-${i}`} className="flex-shrink-0">
          <Component item={t} />
        </div>
      ))}
    </div>
  );
};
