import { useRef } from 'react';
import { gsap, useGSAP, motionOff, isTouch, revealWords, scrollVelocity, touchReelDrift } from '../lib/motion';
import { ALL_A, ALL_B, ALT, IG, thumb } from '../data/content';
import Split from './Split';

/** The whole archive in two opposing reels that lean with your scroll speed. */
export default function Archive() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      revealWords(root.current);
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      if (isTouch()) {
        const offs = (q('.reel-scroller') as HTMLElement[]).map((s, i) => touchReelDrift(s, root.current!, i === 1));
        return () => offs.forEach((o) => o());
      }
      const rows = q('.reel-row') as HTMLElement[];
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
      gsap.fromTo(rows[0], { x: 0 }, { x: () => -(rows[0].scrollWidth - innerWidth), ease: 'none', scrollTrigger: st });
      gsap.fromTo(rows[1], { x: () => -(rows[1].scrollWidth - innerWidth) }, { x: 0, ease: 'none', scrollTrigger: st });
      const skews = rows.map((r) => gsap.quickTo(r, 'skewX', { duration: 0.6, ease: 'power3.out' }));
      const tick = () => {
        const v = Math.max(-8, Math.min(8, scrollVelocity() * 0.35));
        skews[0](-v);
        skews[1](v);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  const row = (ids: string[], key: string) => (
    <div className="reel-scroller" key={key}>
      <div className="reel-row py-2">
        {ids.map((id, i) => (
          <figure key={id} className={`relative shrink-0 overflow-hidden rounded-[14px] ${i % 2 ? 'archive-frame-tall' : 'archive-frame'}`}>
            <img src={thumb(id)} alt={ALT[id] ?? 'Work by The Roots'} loading="lazy" className="h-full w-full object-cover" />
          </figure>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={root} id="archive" data-tone="#ede6e4" className="relative overflow-hidden py-24 sm:py-32" aria-label="Photo archive">
      <div className="mx-auto mb-12 flex max-w-7xl flex-col gap-4 px-5 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-4 text-plum">08 — The archive</p>
          <Split text="Every frame here is ours." className="font-display text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98]" em={['ours.']} />
        </div>
        <a href={IG} target="_blank" rel="noreferrer" className="btn btn-line self-start md:self-auto" data-cursor="Follow">
          More on @therootsshillong <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="space-y-4">
        {row(ALL_A, 'a')}
        {row(ALL_B, 'b')}
      </div>
      <p className="touch-only label mt-5 px-5 text-ink/50" aria-hidden="true">
        Swipe →
      </p>
    </section>
  );
}
