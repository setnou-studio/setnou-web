"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "@/components/ui/animated-number";

type Stat = {
  value: number;
  format: (n: number) => string;
  label: string;
  color: string; // clase de color de la paleta
};

const STATS: Stat[] = [
  { value: 40, format: (n) => `${Math.round(n)}+`, label: "Proyectos entregados", color: "text-electric" },
  { value: 180, format: (n) => `+${Math.round(n)}%`, label: "Tráfico orgánico medio", color: "text-magenta" },
  { value: 100, format: (n) => `${Math.round(n)}%`, label: "Proyectos a medida", color: "text-sky" },
  { value: 2, format: (n) => `<${Math.round(n)}`, label: "Semanas de media por entrega", color: "text-gold" },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section aria-label="Métricas principales" className="bg-ink text-paper">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4"
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-2 bg-ink px-6 py-10">
            <span
              className={`font-display text-5xl font-extrabold leading-none tracking-tight md:text-6xl ${s.color}`}
            >
              <AnimatedNumber
                value={active ? s.value : 0}
                format={s.format}
                stiffness={55}
                damping={18}
              />
            </span>
            <span className="text-sm leading-snug text-paper/70">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
