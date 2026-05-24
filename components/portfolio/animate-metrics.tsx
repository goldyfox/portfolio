"use client";

import { useEffect, useRef, useState } from "react";

interface Metric {
  value: string;
  label: string;
}

export function AnimateMetrics({ metrics, className }: { metrics: Metric[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `grid gap-8 ${className}` : "grid grid-cols-2 gap-8 min-[768px]:grid-cols-4 min-[768px]:gap-10"}
    >
      {metrics.map((metric, i) => (
        <div
          key={metric.label}
          className="flex flex-col border-l-2 border-ethos-blue pl-4"
        >
          <span className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none font-light text-ethos-blue">
            <CountUp value={metric.value} visible={visible} delay={i * 120} />
          </span>
          <span className="mt-1 font-sans text-[11px] uppercase tracking-[0.1em] text-gray-500">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CountUp({
  value,
  visible,
  delay,
}: {
  value: string;
  visible: boolean;
  delay: number;
}) {
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!visible || hasAnimated.current) return;
    hasAnimated.current = true;

    const match = value.match(/^([+$]*)([\d.]+)([%MK+]*(?:\s+\w+)*)$/);

    if (!match) {
      setTimeout(() => setDisplay(value), delay);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);

    if (isNaN(target)) {
      setTimeout(() => setDisplay(value), delay);
      return;
    }

    const duration = target <= 10 ? 400 : 1200;
    const steps = target <= 10 ? 10 : 30;
    const stepTime = duration / steps;
    let step = 0;

    setDisplay(`${prefix}0${suffix}`);

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        const formatted = target >= 100
          ? Math.round(current).toString()
          : current.toFixed(target % 1 !== 0 ? 1 : 0);

        setDisplay(`${prefix}${formatted}${suffix}`);

        if (step >= steps) {
          clearInterval(interval);
          setDisplay(value);
        }
      }, stepTime);
    }, delay);

    return () => clearTimeout(timeout);
  }, [visible, value, delay]);

  return <>{display}</>;
}
