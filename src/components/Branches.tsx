import { useEffect, useRef } from 'react';
import { gsap, useGSAP, motionOff, SCROLL_MAP, revealWords, getLenis } from '../lib/motion';
import { BRANCHES, img, post, srcset } from '../data/content';
import Split from './Split';

/**
 * Six branches, one team: a pinned horizontal track. The root line under the cards grows as
 * you travel, and each photo drifts inside its frame against the direction of travel.
 */
export default function Branches() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);

  // cards are sized from the room left under the heading, so short laptop screens never overlap it
  useEffect(() => {
    const h = head.current;
    const sec = root.current;
    if (!h || !sec) return;
    const set = () => sec.style.setProperty('--head-h', `${h.offsetTop + h.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(h);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      revealWords(root.current);
      if (motionOff() || !track.current) return;
      const q = gsap.utils.selector(root);
      const line = q<SVGPathElement>('[data-track-line]')[0];
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });

      const distance = () => track.current!.scrollWidth - innerWidth;
      const total = SCROLL_MAP.branchesLead + SCROLL_MAP.branchesPerCard * BRANCHES.length + SCROLL_MAP.branchesTail;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${innerHeight * total}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(q('[data-progress]'), { scaleX: self.progress }),
        },
      });
      const move = gsap.to(track.current, { x: () => -distance(), ease: 'none', duration: SCROLL_MAP.branchesPerCard * BRANCHES.length });
      tl.to({}, { duration: SCROLL_MAP.branchesLead })
        .add(move)
        .to(line, { strokeDashoffset: 0, ease: 'none', duration: SCROLL_MAP.branchesPerCard * BRANCHES.length }, '<')
        .to({}, { duration: SCROLL_MAP.branchesTail });

      // Tab into a card: scroll the page to where the timeline shows that card, and never let the
      // browser scroll the clipped section sideways on its own
      const sec = root.current!;
      const onFocus = (e: FocusEvent) => {
        const card = (e.target as Element).closest<HTMLElement>('[data-card]');
        const st = tl.scrollTrigger;
        if (!card || !st) return;
        sec.scrollLeft = 0;
        const pad = parseFloat(getComputedStyle(track.current!).paddingLeft) || 0;
        const frac = Math.min(1, Math.max(0, (card.offsetLeft - pad) / Math.max(1, distance())));
        const p = (SCROLL_MAP.branchesLead + frac * SCROLL_MAP.branchesPerCard * BRANCHES.length) / total;
        const y = st.start + (st.end - st.start) * p;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      };
      const noSideScroll = () => {
        if (sec.scrollLeft) sec.scrollLeft = 0;
      };
      sec.addEventListener('focusin', onFocus);
      sec.addEventListener('scroll', noSideScroll);

      // inside the moving track: photos counter-drift, numbers slide, nodes pop as their card arrives
      q('[data-card]').forEach((card) => {
        const im = card.querySelector('img');
        const st = { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true };
        if (im) gsap.fromTo(im, { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: st });
        const num = card.querySelector('[data-num]');
        if (num) gsap.fromTo(num, { xPercent: 25 }, { xPercent: -10, ease: 'none', scrollTrigger: st });
        const node = card.querySelector('[data-node]');
        if (node) gsap.fromTo(node, { scale: 0 }, { scale: 1, ease: 'back.out(3)', duration: 0.6, scrollTrigger: { trigger: card, containerAnimation: move, start: 'left 70%', toggleActions: 'play none none reverse' } });
        gsap.fromTo(card, { rotate: 2.5, y: 30 }, { rotate: 0, y: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'left 40%', scrub: true } });
      });
      return () => {
        sec.removeEventListener('focusin', onFocus);
        sec.removeEventListener('scroll', noSideScroll);
      };
    },
    { scope: root },
  );


  return (
    <section ref={root} id="work" data-tone="#ebe4e6" className="relative h-[100svh] overflow-clip">
      <div ref={head} className="branches-head absolute inset-x-0 top-0 z-10 flex items-end justify-between gap-6 px-5 pt-20 sm:px-10 sm:pt-24">
        <div>
          <p className="label mb-3 text-plum">02 — Six branches, one team</p>
          <Split text="What grows from the roots" className="font-display text-[clamp(2rem,4.6vw,4.4rem)] leading-none" em={['roots']} />
        </div>
        <p className="hidden max-w-xs text-sm text-ink/70 md:block">One crew from the first plan to the last print. Keep scrolling to walk the branches.</p>
      </div>

      <div ref={track} className="branches-track absolute bottom-[7svh] left-0 flex items-end gap-[4vw] pl-5 pr-[10vw] sm:pl-10">
        {BRANCHES.map((b) => (
          <article key={b.n} data-card className="track-card relative grid grid-rows-[1fr_auto] gap-5 md:grid-cols-[1.15fr_0.85fr] md:grid-rows-1 md:gap-8">
            <div className="relative order-2 flex flex-col justify-end">
              <span data-node className="absolute -bottom-[3.4svh] left-0 hidden h-3 w-3 rounded-full bg-clay md:block" aria-hidden="true" />
              <p data-num className="font-display text-[clamp(4rem,11vw,10rem)] leading-[0.8] text-plum/15" aria-hidden="true">
                {b.n}
              </p>
              <h3 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,3.2rem)] leading-none">{b.name}</h3>
              <p className="mt-3 max-w-sm text-[0.98rem] text-ink/75">{b.line}</p>
              <a href={post(b.sc)} target="_blank" rel="noreferrer" className="label mt-5 inline-flex min-h-11 items-center gap-2 text-ink/80 underline decoration-clay/60 underline-offset-4 hover:text-clay" data-cursor="View">
                {b.work} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <figure className="relative order-1 overflow-hidden rounded-[18px]">
              <img src={img(b.id)} srcSet={srcset(b.id)} sizes="(max-width: 767px) 84vw, 45vw" alt={b.alt} loading="lazy" className="h-full w-full scale-[1.12] object-cover" />
            </figure>
          </article>
        ))}
      </div>

      <svg className="pointer-events-none absolute bottom-[3.5svh] left-0 hidden h-6 w-full md:block" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
        <path data-track-line className="root-line" strokeWidth="1.4" vectorEffect="non-scaling-stroke" d="M0 10 C 120 2, 200 18, 330 10 S 560 2, 680 12 S 880 18, 1000 8" />
      </svg>
      <div className="absolute inset-x-5 bottom-[1.6svh] h-px bg-ink/10 sm:inset-x-10">
        <div data-progress className="h-full origin-left scale-x-0 bg-ink" />
      </div>
    </section>
  );
}
