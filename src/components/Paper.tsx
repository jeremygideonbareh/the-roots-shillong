import { useRef, useState } from 'react';
import { gsap, useGSAP, motionOff, isTouch, revealWords, revealUp } from '../lib/motion';
import { PAPER, SCREEN, thumb } from '../data/content';
import Split from './Split';

/**
 * Design & print, then screen work. The paper pieces start as one neat pile and are dealt across
 * the table as you scroll; the screen list shows each title's frame beside the pointer.
 */
export default function Paper() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(-1);

  useGSAP(
    () => {
      revealWords(root.current);
      revealUp(root.current);
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      const table = q('[data-table]')[0] as HTMLElement;
      const cards = q('[data-paper]');
      const narrow = () => table.clientWidth < 760;
      gsap.fromTo(
        cards,
        { x: 0, y: (i) => i * -6, rotate: (i) => [-4, 3, -2, 5][i], scale: 0.86 },
        {
          x: (i) => (narrow() ? (i % 2 ? 1 : -1) * table.clientWidth * 0.235 : (i - 1.5) * table.clientWidth * 0.245),
          y: (i) => (narrow() ? (i < 2 ? -1 : 1) * table.clientHeight * 0.24 : Math.abs(i - 1.5) * 26),
          rotate: (i) => (narrow() ? [-3, 3, 2, -2][i] : (i - 1.5) * 4.5),
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: table, start: 'top 85%', end: 'center 50%', scrub: true, invalidateOnRefresh: true },
        },
      );

      if (!isTouch() && preview.current) {
        const p = preview.current;
        gsap.set(p, { xPercent: 12, yPercent: -62, scale: 0, autoAlpha: 0 });
        const xTo = gsap.quickTo(p, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(p, 'y', { duration: 0.6, ease: 'power3.out' });
        const rTo = gsap.quickTo(p, 'rotate', { duration: 0.8, ease: 'power3.out' });
        let lastX = 0;
        const list = q('[data-screen-list]')[0] as HTMLElement;
        const move = (e: PointerEvent) => {
          const b = list.getBoundingClientRect();
          xTo(e.clientX - b.left + 40);
          yTo(e.clientY - b.top);
          rTo(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)));
          lastX = e.clientX;
        };
        const enter = () => gsap.to(p, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'expo.out' });
        const leave = () => gsap.to(p, { scale: 0, autoAlpha: 0, duration: 0.4, ease: 'power3.in' });
        list.addEventListener('pointermove', move);
        list.addEventListener('pointerenter', enter);
        list.addEventListener('pointerleave', leave);
        return () => {
          list.removeEventListener('pointermove', move);
          list.removeEventListener('pointerenter', enter);
          list.removeEventListener('pointerleave', leave);
        };
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id="print" data-tone="#ebe2d7" className="relative overflow-hidden px-5 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="label mb-4 text-plum">07 — Design & Print</p>
            <Split text="Paper you can hold on to." className="font-display text-[clamp(2.2rem,5.4vw,5rem)] leading-[0.98]" em={['hold']} />
          </div>
          <p data-up className="text-[0.98rem] text-ink/75">
            Invitation suites, signage, conference IDs and booklets — designed, printed and bound. For MMUN 2026 they were the printing partners alongside Megha Print Xpress.
          </p>
        </div>

        <div data-table className="paper-table relative mt-14 h-[78svh] min-h-[520px] sm:h-[70svh]">
          {PAPER.map((p, i) => (
            <figure key={p.id} data-paper className="paper-card absolute overflow-hidden rounded-[14px] bg-linen p-2 shadow-[0_30px_60px_-28px_rgba(45,35,48,0.55)]" style={{ zIndex: i + 1 }}>
              <img src={thumb(p.id)} alt={p.alt} loading="lazy" className="aspect-[3/4] w-full rounded-[8px] object-cover" />
              <figcaption className="px-1 pb-1 pt-2">
                <span className="block text-[0.82rem] font-medium leading-tight">{p.title}</span>
                <span className="label text-[0.7rem] text-ink/65">{p.who}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-24 sm:mt-32">
          <p className="label mb-6 text-plum">On screen — music videos, reels & booths</p>
          <div data-screen-list className="relative border-t border-ink/15">
            {SCREEN.map((s, i) => (
              <div
                key={s.id}
                className="group relative grid grid-cols-[3.5rem_1fr] items-center gap-3 border-b border-ink/15 py-5 sm:grid-cols-[5rem_1fr_auto] sm:py-7"
                onPointerEnter={() => setHover(i)}
              >
                <span className="label text-clay">0{i + 1}</span>
                <div className="flex items-center gap-4">
                  <img src={thumb(s.id)} alt="" aria-hidden="true" loading="lazy" className="h-16 w-12 shrink-0 rounded-md object-cover [html:not(.touch)_&]:hidden" />
                  <h3 className="font-display text-[clamp(1.6rem,4vw,3.4rem)] leading-none transition-transform duration-500 group-hover:translate-x-3">{s.title}</h3>
                </div>
                <p className="col-span-2 text-sm text-ink/65 sm:col-span-1 sm:text-right">{s.who}</p>
              </div>
            ))}
            <div ref={preview} className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[15rem] overflow-hidden rounded-[14px] shadow-2xl [html:not(.touch):not(.motion-off)_&]:block" aria-hidden="true">
              {SCREEN.map((s, i) => (
                <img key={s.id} src={thumb(s.id)} alt="" className={`aspect-[3/4] w-full object-cover ${hover === i ? 'block' : 'hidden'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
