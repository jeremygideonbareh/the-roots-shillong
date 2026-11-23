import { useRef, useState } from 'react';
import { gsap, useGSAP, motionOff, ScrollTrigger, revealWords, revealUp } from '../lib/motion';
import { KIT, YT, img, post, srcset } from '../data/content';
import Split from './Split';

const STEPS = [
  { k: 'Home kit', d: 'Club red, with Khasi pattern drawn into the trim and crest.' },
  { k: 'Away kit', d: 'A cream shirt built from the same story, line by line.' },
  { k: 'Campaign', d: '“This is HOME” — tradition and the new kit side by side, then a launch reel.' },
];

/** Case study: the Shillong Lajong FC 2026 kits. Copy sticks while the design boards stack past. */
export default function Lajong() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      revealWords(root.current);
      revealUp(root.current);
      const q = gsap.utils.selector(root);
      q('[data-kit]').forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setActive(i) });
      });
      if (motionOff()) return;
      q('[data-kit]').forEach((el, i) => {
        const im = el.querySelector('img');
        gsap.fromTo(el, { clipPath: i % 2 ? 'inset(0% 0% 0% 100% round 22px)' : 'inset(100% 0% 0% 0% round 22px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 22px)',
          ease: 'expo.inOut',
          duration: 1.4,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
        if (im) gsap.fromTo(im, { yPercent: -8, scale: 1.2 }, { yPercent: 8, scale: 1.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        const tag = el.querySelector('[data-tag]');
        if (tag) gsap.from(tag, { xPercent: -120, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 60%', once: true } });
      });
      // the giant club name slides sideways under the boards as you read
      gsap.fromTo(q('[data-ghost]'), { xPercent: 10 }, { xPercent: -45, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="lajong" data-tone="#efe6dc" className="relative overflow-x-clip px-5 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-36">
      <p data-ghost className="font-display pointer-events-none absolute left-0 top-[38%] whitespace-nowrap text-[26vw] italic leading-none text-plum/[0.1]" aria-hidden="true">
        Shillong Lajong · Shillong Lajong
      </p>

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-[14svh] lg:self-start">
          <p className="label mb-4 text-plum">03 — Case study · Design</p>
          <Split text="Shillong Lajong FC, dressed from the roots." className="font-display text-[clamp(2.2rem,5vw,4.8rem)] leading-[0.98]" em={['roots.']} />
          <blockquote data-up className="mt-8 border-l-2 border-clay pl-5">
            <p className="font-display text-xl italic leading-snug sm:text-2xl">
              “Designed with meaning at its core, this jersey brings together ideas, inspiration, and identity — woven into every line and color.”
            </p>
            <footer className="label mt-3 text-ink/60">
              The Roots, on the 2026 away kit ·{' '}
              <a href={post('DW8gEneCbJb')} target="_blank" rel="noreferrer" className="underline decoration-clay underline-offset-4 hover:text-clay">
                Instagram ↗
              </a>
            </footer>
          </blockquote>

          <ol className="mt-10 space-y-1" aria-label="How the kit came together">
            {STEPS.map((s, i) => (
              <li key={s.k} className={`grid grid-cols-[2.4rem_1fr] items-baseline gap-2 border-t border-ink/10 py-3 transition-opacity duration-500 ${active === i ? 'opacity-100' : 'opacity-40'}`}>
                <span className="label text-clay">0{i + 1}</span>
                <span>
                  <span className="font-display text-xl">{s.k}</span>
                  <span className="mt-0.5 block text-sm text-ink/70">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p data-up className="mt-8 text-sm text-ink/70">
            Football runs deep here: The Roots made the{' '}
            <a href={YT} target="_blank" rel="noreferrer" className="underline decoration-clay underline-offset-4 hover:text-clay">
              Ryntih SC promo film for the 2021 I-League qualifiers ↗
            </a>
          </p>
        </div>

        <div className="space-y-10 sm:space-y-14">
          {KIT.map((k, i) => (
            <figure key={k.id} data-kit className={`relative overflow-hidden rounded-[22px] ${i === 2 ? 'aspect-[3/4] sm:mr-[12%]' : i === 1 ? 'aspect-[3/4] sm:ml-[8%]' : 'aspect-[3/4]'}`}>
              <img src={img(k.id)} srcSet={srcset(k.id)} sizes="(max-width: 1023px) 92vw, 48vw" alt={k.alt} loading="lazy" className="h-full w-full scale-110 object-cover" />
              <figcaption data-tag className="label absolute left-4 top-4 rounded-full bg-oat/90 px-3 py-2 text-ink">
                {k.tag}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
