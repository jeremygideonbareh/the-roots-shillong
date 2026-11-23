import { useEffect, useRef } from 'react';
import { gsap, motionOff, scrollVelocity } from '../lib/motion';

/**
 * Text band that runs on its own, speeds up with the scroll, flips direction when you scroll back,
 * and leans with the velocity. Ticks only while on screen.
 */
export default function Marquee({ text, className = '', speed = 0.6, reverse = false }: { text: string; className?: string; speed?: number; reverse?: boolean }) {
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = row.current;
    if (!el || motionOff()) return;
    let x = 0;
    let dir = reverse ? 1 : -1;
    let visible = false;
    const skew = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3.out' });
    const tick = () => {
      if (!visible) return;
      const v = scrollVelocity();
      if (Math.abs(v) > 0.4) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
      x += dir * (speed + Math.min(Math.abs(v) * 0.45, 14));
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(el, { x });
      skew(Math.max(-9, Math.min(9, -v * 0.5)));
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    gsap.ticker.add(tick);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [speed, reverse]);

  const chunk = (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap px-[2vw]">
          {text}
          <span className="ml-[4vw] inline-block h-[0.18em] w-[0.18em] rounded-full bg-clay" />
        </span>
      ))}
    </span>
  );
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={row} className="marquee-row">
        {chunk}
        {chunk}
      </div>
    </div>
  );
}
