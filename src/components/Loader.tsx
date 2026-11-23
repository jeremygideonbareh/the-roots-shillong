import { useRef } from 'react';
import { gsap, useGSAP, motionOff } from '../lib/motion';
import { HERO_TILES, LOGO_INK, thumb } from '../data/content';

const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const i = new Image();
    i.onload = i.onerror = () => resolve();
    i.src = src;
  });

// Measured from the wordmark file (1563×660): the "THE" disc and the tagline band
const VB = { w: 1563, h: 660 };
const DISC = { cx: 582, cy: 309, r: 169 };
const TAG_TOP = 88; // tagline band starts at 88% height…
const TAG_LEFT = 52; // …and right of the R's tail

/**
 * The logo, assembled. The wordmark surfaces through a soft feathered sweep, a clay ring traces the
 * "THE" disc as the page loads, the tagline writes itself in, then the whole mark glides into its
 * place in the hero while the sand lifts away.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const off = motionOff();
      const seen = (() => {
        try {
          return sessionStorage.getItem('roots-seen') === '1';
        } catch {
          return false;
        }
      })();
      const k = off ? 0.25 : seen ? 0.55 : 1; // time scale

      let loaded = 0;
      const assets = HERO_TILES.map((t) => thumb(t.id)).concat(LOGO_INK);
      const ready = Promise.race([
        Promise.all(assets.map((a) => preload(a).then(() => loaded++))),
        new Promise<void>((r) => setTimeout(r, 2800)),
      ]);

      const mark = q('[data-mark]')[0] as HTMLElement;
      const word = q('[data-word]')[0] as HTMLElement;
      const tag = q('[data-tag]')[0] as HTMLElement;
      const ring = q<SVGCircleElement>('[data-ring]')[0];
      const count = q('[data-count]')[0] as HTMLElement;
      const len = ring.getTotalLength();
      gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });

      const intro = gsap.timeline();
      intro
        .from(q('[data-meta]'), { yPercent: 110, duration: 0.8 * k, ease: 'power3.out', stagger: 0.06 }, 0)
        // the wordmark rises out of a feathered sweep, sharpening as it lands
        .fromTo(word, { '--p': '-16%' }, { '--p': '118%', duration: 1.6 * k, ease: 'power2.inOut' }, 0.2)
        .fromTo(word, { y: 18, filter: 'blur(10px)' }, { y: 0, filter: 'blur(0px)', duration: 1.4 * k, ease: 'expo.out' }, 0.25)
        .fromTo(mark, { scale: 0.94 }, { scale: 1, duration: 2.2 * k, ease: 'expo.out' }, 0.2)
        // tagline writes in left to right
        .fromTo(
          tag,
          { clipPath: `inset(${TAG_TOP}% 100% 0% ${TAG_LEFT}%)`, autoAlpha: 0 },
          { clipPath: `inset(${TAG_TOP}% 0% 0% ${TAG_LEFT}%)`, autoAlpha: 1, duration: 0.9 * k, ease: 'power2.out' },
          1.25 * k,
        );

      // the ring is the progress bar: it never runs ahead of the real downloads
      const progress = { v: 0 };
      const fill = gsap.to(progress, {
        v: 1,
        duration: 2.1 * k,
        ease: 'power1.inOut',
        onUpdate: () => {
          const cap = 0.15 + (loaded / assets.length) * 0.85;
          const v = Math.min(progress.v, cap);
          gsap.set(ring, { strokeDashoffset: len * (1 - v) });
          count.textContent = String(Math.round(v * 100)).padStart(3, '0');
        },
      });

      Promise.all([ready, intro.then(), fill.then()]).then(() => {
        loaded = assets.length;
        count.textContent = '100';
        try {
          sessionStorage.setItem('roots-seen', '1');
        } catch {
          // storage blocked: the full intro plays again next time
        }

        // fly the mark onto the hero's logo, which waits hidden in exactly that spot
        const target = document.querySelector<HTMLElement>('[data-hero-logo] img')?.getBoundingClientRect();
        const box = mark.getBoundingClientRect();
        const fly =
          target && target.width && !off
            ? { x: target.left - box.left, y: target.top - box.top, scale: target.width / box.width }
            : { x: 0, y: 0, scale: 1 };

        gsap
          .timeline({
            onComplete: () => {
              window.dispatchEvent(new Event('roots:logo-landed'));
              onDone();
            },
          })
          .to(ring, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, 0)
          .to(q('[data-meta], [data-count-wrap]'), { autoAlpha: 0, y: -10, duration: 0.4, ease: 'power2.in', stagger: 0.03 }, 0)
          .to(q('[data-ring], [data-ring-track]'), { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.12)
          .to(mark, { ...fly, transformOrigin: '0% 0%', duration: off ? 0.01 : 1.15 * Math.max(k, 0.7), ease: 'expo.inOut' }, 0.22)
          .call(
            () => {
              document.documentElement.classList.remove('is-loading');
              window.dispatchEvent(new Event('roots:reveal'));
            },
            [],
            0.5,
          )
          .to(q('[data-sand]'), { autoAlpha: 0, duration: 0.9, ease: 'power2.inOut' }, 0.45);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-loader className="pointer-events-none fixed inset-0 z-[100] overflow-hidden text-ink">
      <div data-sand className="pointer-events-auto absolute inset-0 bg-sand" />

      <div className="absolute left-5 top-5 overflow-hidden sm:left-10 sm:top-8">
        <p data-meta className="label">Events · Photo / Video · Live · Social · Design · Print</p>
      </div>
      <div className="absolute right-5 top-5 hidden overflow-hidden sm:right-10 sm:top-8 sm:block">
        <p data-meta className="label">Shillong · Meghalaya</p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div data-mark className="relative w-[min(78vw,620px)]" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
          {/* wordmark without the tagline band, revealed through a feathered mask (--p) */}
          <img
            data-word
            src={LOGO_INK}
            alt="The Roots — Ki Thied Tynrai"
            className="loader-word absolute inset-0 h-full w-full"
            style={{ clipPath: `polygon(0 0, 100% 0, 100% ${TAG_TOP}%, ${TAG_LEFT}% ${TAG_TOP}%, ${TAG_LEFT}% 100%, 0 100%)` }}
          />
          {/* the tagline on its own */}
          <img data-tag src={LOGO_INK} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0" style={{ clipPath: `inset(${TAG_TOP}% 100% 0% ${TAG_LEFT}%)` }} />
          {/* progress ring around the THE disc */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${VB.w} ${VB.h}`} aria-hidden="true">
            <circle data-ring-track cx={DISC.cx} cy={DISC.cy} r={DISC.r + 28} fill="none" stroke="rgba(45,35,48,0.12)" strokeWidth="6" />
            <circle
              data-ring
              cx={DISC.cx}
              cy={DISC.cy}
              r={DISC.r + 28}
              fill="none"
              stroke="#a8674a"
              strokeWidth="7"
              strokeLinecap="round"
              transform={`rotate(-90 ${DISC.cx} ${DISC.cy})`}
            />
          </svg>
        </div>
      </div>

      <div data-count-wrap className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 sm:bottom-8" aria-hidden="true">
        <span className="label tabular-nums text-ink/70" data-count>
          000
        </span>
        <span className="label text-ink/40">Ki Thied Tynrai</span>
      </div>
    </div>
  );
}
