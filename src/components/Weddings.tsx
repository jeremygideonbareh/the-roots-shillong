import { useRef } from 'react';
import { gsap, useGSAP, motionOff, revealWords, revealUp } from '../lib/motion';
import { WEDDINGS, img, srcset } from '../data/content';
import Split from './Split';

/** Weddings as a stack of prints: each card settles on top of the last, which sinks back. */
export default function Weddings() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      revealWords(root.current);
      revealUp(root.current);
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      const cards = q('[data-stack]');
      cards.forEach((card, i) => {
        const inner = card.querySelector('[data-stack-inner]');
        const shade = card.querySelector('[data-shade]');
        const im = card.querySelector('img');
        if (im) gsap.fromTo(im, { scale: 1.25 }, { scale: 1.02, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 11%', scrub: true } });
        const next = cards[i + 1];
        if (!next || !inner) return;
        const st = { trigger: next, start: 'top bottom', end: 'top 11%', scrub: true };
        gsap.fromTo(inner, { scale: 1, rotate: 0 }, { scale: 0.9, rotate: i % 2 ? 1.5 : -1.5, ease: 'none', scrollTrigger: st });
        // a dimming layer rather than a CSS filter: cheaper to paint, and it starts from clear
        if (shade) gsap.fromTo(shade, { opacity: 0 }, { opacity: 0.22, ease: 'none', scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="weddings" data-tone="#f1e9e1" className="relative px-5 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="label mb-4 text-plum">06 — Photo / Video · Weddings</p>
            <Split text="Some days only happen once." className="font-display text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98]" em={['once.']} />
          </div>
          <p data-up className="text-[0.98rem] text-ink/75">
            Films, stills, reels and the paper that goes with them — invitations, welcome boards and signage, all from the same team.
          </p>
        </div>

        <div className="space-y-[8svh]">
          {WEDDINGS.map((w, i) => (
            <article key={w.id} data-stack className="stack-card" style={{ zIndex: i + 1 }}>
              <div data-stack-inner className="relative h-[74svh] origin-top overflow-hidden rounded-[24px] bg-sand shadow-[0_40px_80px_-40px_rgba(45,35,48,0.5)]">
                <img src={img(w.id)} srcSet={srcset(w.id)} sizes="(max-width: 767px) 92vw, 1150px" alt={w.alt} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div data-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-oat sm:p-10">
                  <div>
                    <p className="label text-oat/75">{String(i + 1).padStart(2, '0')} / {String(WEDDINGS.length).padStart(2, '0')}</p>
                    <h3 className="font-display mt-2 text-[clamp(1.9rem,4vw,3.6rem)] italic leading-none">{w.title}</h3>
                  </div>
                  <p className="hidden max-w-[16rem] text-right text-sm text-oat/85 sm:block">{w.note}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
