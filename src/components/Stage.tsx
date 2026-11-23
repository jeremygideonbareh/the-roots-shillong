import { useRef } from 'react';
import { gsap, useGSAP, motionOff, isTouch, SCROLL_MAP, revealWords, revealUp, revealFrames, parallaxImages } from '../lib/motion';
import { LIVE, SIFF, img, post, srcset, thumb } from '../data/content';
import Split from './Split';

/**
 * Stage & screen. The concert photo opens from a small window to the whole screen like house lights
 * dropping, then the festival set and the live work follow.
 */
export default function Stage() {
  const root = useRef<HTMLElement>(null);
  const window_ = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      revealWords(root.current);
      revealUp(root.current);
      revealFrames(root.current);
      parallaxImages(root.current);
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      const touch = isTouch();
      const open = gsap.timeline({
        scrollTrigger: touch
          ? { trigger: window_.current, start: 'top 85%', end: 'top 15%', scrub: true }
          : { trigger: window_.current, start: 'top top', end: () => `+=${innerHeight * SCROLL_MAP.stage}`, scrub: true, pin: true, anticipatePin: 1 },
      });
      open
        .fromTo(q('[data-window]'), { clipPath: touch ? 'inset(8% 6% 8% 6% round 24px)' : 'inset(14% 22% 14% 22% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 })
        .fromTo(q('[data-window] img'), { scale: 1.45 }, { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(q('[data-stage-line]'), { yPercent: 110 }, { yPercent: 0, stagger: 0.08, duration: 0.4, ease: 'power3.out' }, 0.55)
        .fromTo(q('[data-stage-side]'), { xPercent: 0 }, { xPercent: (i) => (i ? 140 : -140), autoAlpha: 0, ease: 'power2.in', duration: 0.6 }, 0)
        .to({}, { duration: 0.35 });

      // live cards rise and tip back like screens being raised
      gsap.fromTo(q('[data-live]'), { rotateX: 28, y: 80, autoAlpha: 0 }, { rotateX: 0, y: 0, autoAlpha: 1, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: q('[data-live-row]')[0], start: 'top 85%', once: true } });

      if (!touch) {
        const cleanups: (() => void)[] = [];
        (q('[data-live]') as HTMLElement[]).forEach((card) => {
          const rx = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
          const ry = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });
          const move = (e: PointerEvent) => {
            const b = card.getBoundingClientRect();
            ry(((e.clientX - b.left) / b.width - 0.5) * 12);
            rx(-((e.clientY - b.top) / b.height - 0.5) * 12);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
          });
        });
        return () => cleanups.forEach((c) => c());
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id="events" data-tone="#ece5e2" className="relative overflow-hidden pb-28 sm:pb-36">
      <div ref={window_} className="relative h-[100svh] overflow-hidden">
        <p data-stage-side className="font-display absolute left-5 top-[calc(50%-0.5em)] z-0 text-[clamp(2.5rem,7vw,7rem)] italic leading-none text-plum/70 sm:left-10">
          Stage
        </p>
        <p data-stage-side className="font-display absolute right-5 top-[calc(50%-0.5em)] z-0 text-[clamp(2.5rem,7vw,7rem)] italic leading-none text-plum/70 sm:right-10">
          Screen
        </p>
        <div data-window className="absolute inset-0 z-10">
          <img src={img('DSOAJH6k9fC_01')} srcSet={srcset('DSOAJH6k9fC_01')} sizes="100vw" alt="Akcent performing under flame jets and arched stage lights at a Shillong concert" loading="lazy" className="h-full w-full object-cover object-[50%_40%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-10 text-oat sm:px-10 sm:pb-14">
            <p className="label mb-4 overflow-hidden text-oat/80">
              <span data-stage-line className="block">05 — Events · Live</span>
            </p>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,5.6vw,5.4rem)] leading-[0.98]" aria-label="When the lights go up, we are already there.">
              <span className="block overflow-hidden" aria-hidden="true">
                <span data-stage-line className="block">When the lights go up,</span>
              </span>
              <span className="block overflow-hidden" aria-hidden="true">
                <span data-stage-line className="block italic">we’re already there.</span>
              </span>
            </h2>
            <p className="mt-4 overflow-hidden text-sm text-oat/80">
              <a data-stage-line href={post('DSOAJH6k9fC')} target="_blank" rel="noreferrer" className="block hover:text-oat">
                Akcent with Deepside Deejays, Shillong — “You were Magical ✨” ↗
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-7xl px-5 sm:mt-32 sm:px-10">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="label mb-4 text-plum">Shillong International Film Festival 2026</p>
            <Split text="A set made to enjoy." className="font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.98]" em={['enjoy.']} />
          </div>
          <blockquote data-up className="border-l-2 border-clay pl-5 text-[1.02rem] text-ink/80">
            “Proud to have brought the space to life and to have played a part in the successful completion of the Shillong International Film Festival.”
            <footer className="label mt-3 text-ink/55">
              The Roots ·{' '}
              <a href={post('DXJqCPyielC')} target="_blank" rel="noreferrer" className="underline decoration-clay underline-offset-4 hover:text-clay">
                #siff2026 ↗
              </a>
            </footer>
          </blockquote>
        </div>

        <div className="siff-grid mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-6">
          {SIFF.map((s, i) => (
            <figure key={s.id} data-frame={i % 2 ? 'side' : undefined} data-par="8" className={`relative overflow-hidden rounded-[18px] siff-${i}`}>
              <img src={thumb(s.id)} alt={s.alt} loading="lazy" className="h-full w-full object-cover" />
            </figure>
          ))}
        </div>

        <div className="mt-28 sm:mt-36">
          <p className="label mb-4 text-plum">Live streaming · LED screens · Concerts</p>
          <Split text="From Kohima to the Khasi hills, live." className="font-display max-w-[18ch] text-[clamp(2rem,4.4vw,4rem)] leading-[1]" em={['live.']} />
          <div data-live-row className="mt-12 grid grid-cols-1 gap-5 [perspective:1200px] sm:grid-cols-3">
            {LIVE.map((l) => (
              <a key={l.id} href={post(l.sc)} target="_blank" rel="noreferrer" data-live data-cursor="View" className="group block [transform-style:preserve-3d]">
                <figure className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                  <img src={thumb(l.id)} alt={l.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="label absolute left-3 top-3 flex items-center gap-2 rounded-full bg-oat/90 px-3 py-1.5 text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-clay" /> Streamed
                  </span>
                </figure>
                <p className="font-display mt-3 text-xl">{l.place}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
