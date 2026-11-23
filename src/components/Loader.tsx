import { useRef } from 'react';
import { gsap, useGSAP, motionOff } from '../lib/motion';
import { HERO_TILES, LOGO_INK, SERVICES, thumb } from '../data/content';

const preload = (src: string) =>
  new Promise<void>((resolve) => {
    const i = new Image();
    i.onload = i.onerror = () => resolve();
    i.src = src;
  });

// a taproot that splits into six: one for each thing The Roots does
const BRANCH_PATHS = [
  'M300 210 C 300 250, 250 270, 150 300',
  'M300 210 C 300 260, 200 300, 120 380',
  'M300 210 C 300 280, 270 330, 240 420',
  'M300 210 C 300 280, 330 330, 360 420',
  'M300 210 C 300 260, 400 300, 480 380',
  'M300 210 C 300 250, 350 270, 450 300',
];
const ENDS = [
  [150, 300],
  [120, 380],
  [240, 420],
  [360, 420],
  [480, 380],
  [450, 300],
];

/**
 * Ki Thied Tynrai — "the roots". A taproot grows down, splits into six branches as the counter
 * names each service, the wordmark surfaces, and the soil lifts away to reveal the page.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduced = motionOff();
      const seen = (() => {
        try {
          return sessionStorage.getItem('roots-seen') === '1';
        } catch {
          return false;
        }
      })();
      const quick = reduced || seen;

      const ready = Promise.race([
        Promise.all(HERO_TILES.map((t) => preload(thumb(t.id)))),
        new Promise<void>((r) => setTimeout(r, 2600)),
      ]);

      const paths = q<SVGPathElement>('[data-branch]');
      const tap = q<SVGPathElement>('[data-tap]')[0];
      [tap, ...paths].forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(q('[data-node]'), { scale: 0, transformOrigin: 'center' });
      gsap.set(q('[data-svc]'), { yPercent: 110 });

      const count = q('[data-count]')[0] as HTMLElement;
      const svcLabel = q('[data-svclabel]')[0] as HTMLElement;
      const t = quick ? 0.35 : 0.75;

      const tl = gsap.timeline();
      tl.from(q('[data-meta]'), { yPercent: 120, duration: 0.8 * t, ease: 'expo.out', stagger: 0.05 })
        .to(tap, { strokeDashoffset: 0, duration: 0.9 * t, ease: 'power2.inOut' }, 0.1);
      paths.forEach((p, i) => {
        const at = 0.8 * t + i * 0.22 * t;
        tl.to(p, { strokeDashoffset: 0, duration: 0.7 * t, ease: 'power3.out' }, at)
          .to(q('[data-node]')[i], { scale: 1, duration: 0.5 * t, ease: 'back.out(3)' }, at + 0.45 * t)
          .call(() => {
            count.textContent = String(i + 1).padStart(2, '0');
            svcLabel.textContent = SERVICES[i];
          }, [], at);
      });
      tl.to(q('[data-svc]'), { yPercent: 0, duration: 0.6 * t, ease: 'expo.out' }, 0.8 * t)
        .fromTo(q('[data-logo]'), { clipPath: 'inset(100% 0% 0% 0%)', y: 30 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1 * t, ease: 'expo.out' }, '>-0.2');

      Promise.all([ready, tl.then()]).then(() => {
        try {
          sessionStorage.setItem('roots-seen', '1');
        } catch {
          // storage blocked: the full intro plays again next time
        }
        gsap
          .timeline({ onComplete: onDone })
          .to(q('[data-meta], [data-svc], [data-logo]'), { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: 'power3.in', stagger: 0.02 })
          .to(q('[data-tree]'), { scale: 0.6, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, '<')
          .call(() => {
            document.documentElement.classList.remove('is-loading');
            window.dispatchEvent(new Event('roots:reveal'));
          })
          .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' }, '<');
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-loader className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-sand text-ink" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      <div className="absolute left-5 top-5 overflow-hidden sm:left-10 sm:top-8">
        <p data-meta className="label">Ki Thied Tynrai</p>
      </div>
      <div className="absolute right-5 top-5 overflow-hidden sm:right-10 sm:top-8">
        <p data-meta className="label">Shillong · Meghalaya</p>
      </div>

      <div className="relative flex w-full max-w-[600px] flex-col items-center px-6">
        <svg data-tree viewBox="0 0 600 460" className="w-[min(86vw,520px)]" aria-hidden="true">
          <path data-tap className="root-line" strokeWidth="2.2" d="M300 120 C 300 150, 298 180, 300 210" />
          {BRANCH_PATHS.map((d, i) => (
            <path key={i} data-branch className="root-line" strokeWidth="1.6" d={d} />
          ))}
          {ENDS.map(([x, y], i) => (
            <circle key={i} data-node cx={x} cy={y} r="6" fill={i % 2 ? '#a8674a' : '#5e4467'} />
          ))}
        </svg>
        <img data-logo src={LOGO_INK} alt="The Roots — Ki Thied Tynrai" className="absolute -top-[2%] w-[min(60vw,340px)] rounded-2xl bg-sand px-4 py-3" style={{ clipPath: 'inset(100% 0% 0% 0%)' }} />
      </div>

      <div className="absolute bottom-5 left-5 overflow-hidden sm:bottom-8 sm:left-10">
        <p data-svc className="font-display text-2xl sm:text-3xl">
          <span data-svclabel>Rooting</span>
        </p>
      </div>
      <div className="absolute bottom-3 right-5 overflow-hidden sm:right-10">
        <p data-meta className="font-display text-[22vw] leading-none tabular-nums sm:text-[11vw]">
          <span data-count>00</span>
          <span className="text-[0.35em] text-ink/40">/06</span>
        </p>
      </div>
    </div>
  );
}
