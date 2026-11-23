import { Fragment, useEffect, useRef } from 'react';
import { gsap, useGSAP, motionOff, isTouch, SCROLL_MAP, ScrollTrigger } from '../lib/motion';
import { RootsCanvas } from '../lib/roots';
import { HERO_TILES, IG_DM, LOGO_INK, SERVICES, thumb } from '../data/content';

// where each tile drifts as the hero is scrolled away (vw, svh, deg)
const DRIFT = [
  [18, -40, 8],
  [-10, -55, -6],
  [24, 20, 10],
  [-26, 30, -9],
  [-6, 46, 5],
];
// pointer depth per tile
const DEPTH = [26, 14, 32, 18, 22];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const roots = useRef<RootsCanvas | null>(null);

  // the root network: a canvas that grows with the intro and the scroll
  useEffect(() => {
    if (!canvas.current || motionOff()) return;
    const rc = new RootsCanvas(canvas.current, isTouch() ? 1.25 : 1.5);
    roots.current = rc;
    rc.start();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? rc.start() : rc.stop()));
    io.observe(canvas.current);
    const move = (e: PointerEvent) => rc.setLean((e.clientX / innerWidth) * 2 - 1);
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', move);
      rc.destroy();
      roots.current = null;
    };
  }, []);

  useGSAP(
    () => {
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      const tiles = q('[data-tile]');
      const growth = { g: 0 };
      const setGrowth = () => roots.current?.setGrowth(growth.g);

      // first frame waits behind the loader
      gsap.set(q('[data-hero-word] .w > span'), { yPercent: 115 });
      gsap.set(q('[data-hero-up]'), { y: 30, autoAlpha: 0 });
      gsap.set(q('[data-hero-logo]'), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(tiles, { clipPath: 'inset(50% 50% 50% 50% round 18px)', scale: 0.7, rotate: (i) => (i % 2 ? -8 : 8) });

      const intro = () => {
        const tl = gsap.timeline();
        tl.to(growth, { g: 0.78, duration: 3.4, ease: 'power2.out', onUpdate: setGrowth }, 0)
          .to(q('[data-hero-logo]'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out' }, 0.15)
          .from(q('[data-hero-logo] img'), { yPercent: 30, duration: 1.4, ease: 'expo.out' }, 0.15)
          .to(q('[data-hero-word] .w > span'), { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05 }, 0.45)
          .to(tiles, { clipPath: 'inset(0% 0% 0% 0% round 18px)', scale: 1, rotate: (i) => [-3, 4, -2, 3, -4][i], duration: 1.4, ease: 'expo.out', stagger: 0.09 }, 0.35)
          .to(q('[data-hero-up]'), { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07 }, 0.9);
      };
      if (document.documentElement.classList.contains('is-loading')) window.addEventListener('roots:reveal', intro, { once: true });
      else intro();

      // scroll away: tiles scatter, the wordmark settles up, the roots finish growing
      const touch = isTouch();
      const out = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${innerHeight * (touch ? 0.9 : SCROLL_MAP.heroHold + 0.6)}`,
          scrub: true,
          pin: !touch,
          anticipatePin: 1,
        },
      });
      tiles.forEach((t, i) => {
        const [x, y, r] = DRIFT[i];
        out.to(t, { xPercent: x * 3, yPercent: y * 2, rotate: r, ease: 'none' }, 0);
      });
      out
        .to(q('[data-hero-copy]'), { yPercent: -18, autoAlpha: 0.15, ease: 'none' }, 0.25)
        .to(q('[data-hero-logo]'), { scale: 0.86, yPercent: -12, ease: 'none' }, 0)
        .to(growth, { g: 1, ease: 'none', onUpdate: setGrowth }, 0)
        .to(q('[data-scroll-cue]'), { autoAlpha: 0, ease: 'none', duration: 0.15 }, 0);

      // tiles lean with the pointer, each at its own depth
      if (!touch) {
        const movers = tiles.map((t, i) => ({
          x: gsap.quickTo(t.querySelector('img'), 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(t.querySelector('img'), 'y', { duration: 0.9, ease: 'power3.out' }),
          d: DEPTH[i],
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(-nx * m.d);
            m.y(-ny * m.d);
          });
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
      }
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  const menu = () => window.dispatchEvent(new Event('open-menu'));

  return (
    <section ref={root} id="top" data-tone="#efe8df" className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-10 sm:py-7">
        <p data-hero-up className="label">Ki Thied Tynrai · Shillong</p>
        <div data-hero-up className="flex items-center gap-2 sm:gap-4">
          <a href={IG_DM} target="_blank" rel="noreferrer" className="btn btn-ink hidden min-h-11 sm:inline-flex" data-cursor="DM">
            DM for bookings
          </a>
          <button type="button" onClick={menu} className="label flex min-h-11 items-center px-2 hover:opacity-60">
            Menu
          </button>
        </div>
      </header>

      {HERO_TILES.map((t, i) => (
        <figure key={t.id} data-tile className={`tile hero-tile-${i}`}>
          <img src={thumb(t.id)} alt={t.alt} className="scale-[1.12]" />
        </figure>
      ))}

      <div className="hero-copy-wrap absolute z-10">
        <div data-hero-logo className="hero-logo origin-left">
          <img src={LOGO_INK} alt="The Roots — Ki Thied Tynrai" className="w-full" />
        </div>
        <div data-hero-copy>
          <h1 data-hero-word className="font-display mt-5 max-w-[17ch] text-[clamp(1.9rem,4.3vw,4.3rem)] leading-[1.02]" aria-label="Your all-in-one creative & event partner.">
            {'Your all-in-one creative & event partner.'.split(' ').map((w, i, a) => (
              <Fragment key={i}>
                <span className="w" aria-hidden="true">
                  <span className={w === 'creative' || w === 'event' ? 'italic text-plum' : undefined}>{w}</span>
                </span>
                {i < a.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </h1>
          <p data-hero-up className="mt-5 flex max-w-[34rem] flex-wrap gap-x-3 gap-y-1 text-[0.95rem] text-ink/75">
            {SERVICES.map((s, i) => (
              <span key={s} className="flex items-center gap-3">
                {s}
                {i < SERVICES.length - 1 && <span className="h-1 w-1 rounded-full bg-clay" aria-hidden="true" />}
              </span>
            ))}
          </p>
          <div data-hero-up className="mt-7 flex flex-wrap gap-3">
            <a href={IG_DM} target="_blank" rel="noreferrer" className="btn btn-ink" data-cursor="DM">
              Plan your event
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#work" className="btn btn-line">
              See the work
            </a>
          </div>
        </div>
      </div>

      <div data-scroll-cue className="absolute bottom-5 right-5 z-10 flex items-center gap-3 sm:bottom-8 sm:right-10">
        <span className="label">Scroll — follow the roots</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ink/20">
          <span className="cue-drop absolute left-0 top-0 block h-1/2 w-px bg-ink" />
        </span>
      </div>
    </section>
  );
}
