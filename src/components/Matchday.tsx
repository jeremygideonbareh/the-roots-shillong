import { useRef } from 'react';
import { gsap, useGSAP, motionOff, isTouch, revealWords, revealUp, touchReelDrift } from '../lib/motion';
import { MATCHDAY_A, MATCHDAY_B, post, thumb, type Shot } from '../data/content';
import Split from './Split';
import Marquee from './Marquee';

function Reel({ shots, dir }: { shots: Shot[]; dir: 'l' | 'r' }) {
  return (
    <div className="reel-scroller" data-reel={dir}>
      <div className="reel-row py-2">
        {shots.map((s, i) => (
          <figure key={s.id} className={`relative shrink-0 overflow-hidden rounded-[16px] ${i % 3 === 1 ? 'reel-frame-wide' : 'reel-frame'}`}>
            <img src={thumb(s.id)} alt={s.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Matchday: two rows of IFL photos running against each other, with the floodlit band between. */
export default function Matchday() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      revealWords(root.current);
      revealUp(root.current);
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      if (isTouch()) {
        const offs = (q('[data-reel]') as HTMLElement[]).map((s) => touchReelDrift(s, root.current!, s.dataset.reel === 'r'));
        return () => offs.forEach((o) => o());
      }
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true };
      const a = q('[data-reel="l"] .reel-row')[0] as HTMLElement;
      const b = q('[data-reel="r"] .reel-row')[0] as HTMLElement;
      gsap.fromTo(a, { x: () => innerWidth * 0.05 }, { x: () => -(a.scrollWidth - innerWidth * 0.95), ease: 'none', scrollTrigger: { ...st, invalidateOnRefresh: true } });
      gsap.fromTo(b, { x: () => -(b.scrollWidth - innerWidth * 0.95) }, { x: () => innerWidth * 0.05, ease: 'none', scrollTrigger: { ...st, invalidateOnRefresh: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="matchday" data-tone="#e9e3dc" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto mb-12 flex max-w-7xl flex-col gap-6 px-5 sm:mb-16 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-4 text-plum">04 — Photo · Matchday</p>
          <Split text="Shadows, sweat and stadium lights." className="font-display max-w-[14ch] text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98]" em={['stadium', 'lights.']} />
        </div>
        <p data-up className="max-w-sm text-[0.98rem] text-ink/75">
          Pitch-side with Shillong Lajong through the Indian Football League season — frames co-published with photographer{' '}
          <a href={post('DXcFhjcj2wa')} target="_blank" rel="noreferrer" className="underline decoration-clay underline-offset-4 hover:text-clay">
            Owen Khongsit ↗
          </a>
        </p>
      </div>

      <Reel shots={MATCHDAY_A} dir="l" />
      <Marquee text="Matchday · Live · Lit · Shot" className="font-display my-6 text-[clamp(3rem,9vw,8.5rem)] italic leading-none text-plum/80" />
      <Reel shots={MATCHDAY_B} dir="r" />
      <p className="touch-only label mt-6 px-5 text-ink/50" aria-hidden="true">
        Swipe →
      </p>
    </section>
  );
}
