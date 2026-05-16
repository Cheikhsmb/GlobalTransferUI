import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';

const stats = [
  { value: 2.4, suffix: 'B+', label: 'Volume traité (XOF)', decimals: 1 },
  { value: 42, suffix: '', label: 'Pays couverts', decimals: 0 },
  { value: 1.2, suffix: 's', label: 'Latence moyenne', decimals: 1 },
  { value: 99.9, suffix: '%', label: 'Disponibilité', decimals: 1 },
];

function AnimatedStat({
  value,
  suffix,
  label,
  decimals,
}: (typeof stats)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800; // longer, more premium duration
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4); // Quartic ease out
      setDisplay(value * eased);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <div ref={ref} className="stats-strip__item">
      <p className="stats-strip__value">
        {display.toFixed(decimals)}
        <span>{suffix}</span>
      </p>
      <p className="stats-strip__label">{label}</p>
    </div>
  );
}

export function StatsStrip() {
  return (
    <ScrollReveal className="stats-strip" stagger={0.15}>
      {stats.map((stat) => (
        <AnimatedStat key={stat.label} {...stat} />
      ))}
    </ScrollReveal>
  );
}
