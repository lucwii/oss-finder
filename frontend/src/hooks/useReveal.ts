"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement>(margin = "-80px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px`, threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, inView };
}
