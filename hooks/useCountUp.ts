"use client";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function useCountUp(to: number, duration = 0.35) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        setDisplay(
          value >= 1000
            ? value.toLocaleString("en-US", { maximumFractionDigits: 0 })
            : value.toFixed(2)
        );
      },
    });

    return () => controls.stop();
  }, [isInView, to, duration]);

  return { ref, display };
}