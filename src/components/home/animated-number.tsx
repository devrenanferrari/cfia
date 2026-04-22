"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  separator?: boolean;
}

export function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1800,
  separator = false,
}: Props) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(target);
    }

    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  let display: string;
  if (decimals > 0) {
    display = value.toFixed(decimals).replace(".", ",");
  } else if (separator) {
    display = Math.round(value).toLocaleString("pt-BR");
  } else {
    display = String(Math.round(value));
  }

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}
