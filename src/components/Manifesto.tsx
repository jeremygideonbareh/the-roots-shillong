import { useRef } from 'react';
import { gsap, useGSAP, motionOff, isTouch, SCROLL_MAP } from '../lib/motion';

const QUOTE =
  'Every stage, every frame, every printed page starts in the same place — at the roots. We plan it, build it, shoot it, stream it, design it and print it, so on the day you only have to show up.';
const LIT = new Set(['roots.', 'plan', 'build', 'shoot', 'stream', 'design', 'print']);

/** The promise, pinned in the middle of the screen while it lights up word by word. */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      const words = q('[data-word]');
      const vine = q<SVGPathElement>('[data-vine]');
      vine.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 0 });
      });
      const touch = isTouch();
      const tl = gsap.timeline({
        scrollTrigger: touch
          ? { trigger: root.current, start: 'top 75%', end: 'bottom 60%', scrub: true }
          : { trigger: root.current, start: 'top top', end: () => `+=${innerHeight * SCROLL_MAP.manifesto}`, scrub: true, pin: true },
      });
      tl.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.06, ease: 'none', duration: 0.5 }, 0)
        .set(vine, { autoAlpha: 1 }, 0.001)
        .to(vine, { strokeDashoffset: 0, ease: 'none', duration: words.length * 0.06 + 0.5 }, 0)
        .fromTo(q('[data-gloss]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.4);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" data-tone="#f2ece5" className="relative flex min-h-[100svh] items-center overflow-hidden px-5 py-24 sm:px-10">
      <svg className="pointer-events-none absolute left-[3vw] top-0 h-full w-[8vw] min-w-[40px]" viewBox="0 0 80 800" preserveAspectRatio="none" aria-hidden="true">
        <path data-vine className="root-line" strokeWidth="1.6" vectorEffect="non-scaling-stroke" d="M40 0 C 20 120, 60 200, 40 320 S 10 520, 44 640 S 50 760, 36 800" />
        <path data-vine className="root-line" strokeWidth="1" vectorEffect="non-scaling-stroke" style={{ stroke: '#a8674a' }} d="M40 320 C 60 360, 70 400, 78 470" />
        <path data-vine className="root-line" strokeWidth="1" vectorEffect="non-scaling-stroke" d="M44 640 C 24 670, 12 700, 4 760" />
      </svg>

      <div className="mx-auto w-full max-w-6xl">
        <p className="label mb-8 text-plum">01 — Where it starts</p>
        <p className="font-display text-[clamp(1.7rem,4.1vw,4rem)] leading-[1.12]" aria-label={QUOTE}>
          {QUOTE.split(' ').map((w, i) => (
            <span key={i} data-word aria-hidden="true" className={`inline-block ${LIT.has(w.replace(',', '')) ? 'italic text-plum' : ''}`}>
              {w}&nbsp;
            </span>
          ))}
        </p>
        <div data-gloss className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-ink/15 pt-6">
          <p className="font-display text-2xl italic">Ki Thied Tynrai</p>
          <p className="text-sm text-ink/70">Khasi for “the roots”. Rooted in Shillong, working across the Northeast.</p>
        </div>
      </div>
    </section>
  );
}
