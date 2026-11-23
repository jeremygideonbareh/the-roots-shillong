import { useRef, useState } from 'react';
import { gsap, useGSAP, motionOff, setMotion, revealWords, revealUp } from '../lib/motion';
import { CREDITS, IG, IG_DM, LOGO_INK, SERVICES, YT } from '../data/content';
import Split from './Split';

const WORD = 'Tynrai';

/**
 * Bookings happen in Instagram DMs, so the form doesn't pretend to send anything: it writes the
 * brief, copies it, and opens the chat with The Roots.
 */
export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [what, setWhat] = useState('');
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual' | 'empty'>('idle');
  const off = typeof document !== 'undefined' && document.documentElement.classList.contains('motion-off');

  useGSAP(
    () => {
      revealWords(root.current);
      revealUp(root.current);
      if (motionOff()) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(q('[data-letter]'), { yPercent: 105, rotate: (i) => (i % 2 ? 8 : -8) }, {
        yPercent: 0,
        rotate: 0,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: q('[data-word]')[0], start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
      gsap.fromTo(q('[data-chip]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: q('[data-chips]')[0], start: 'top 88%', once: true } });
    },
    { scope: root },
  );

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const brief = () =>
    [
      'Hi The Roots! I’d like to plan something with you.',
      picked.length ? `Services: ${picked.join(', ')}` : '',
      what ? `What: ${what}` : '',
      when ? `When: ${when}` : '',
      where ? `Where: ${where}` : '',
    ]
      .filter(Boolean)
      .join('\n');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!picked.length && !what) {
      setStatus('empty');
      return;
    }
    const text = brief();
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('manual');
    }
    window.open(IG_DM, '_blank', 'noopener');
  };

  return (
    <section ref={root} id="contact" data-tone="#efe8df" className="relative overflow-hidden px-5 pt-28 sm:px-10 sm:pt-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="label mb-4 text-plum">09 — Bookings</p>
          <Split text="Tell us what you’re planning." className="font-display text-[clamp(2.4rem,6vw,5.6rem)] leading-[0.96]" em={['planning.']} />
          <p data-up className="mt-6 max-w-md text-[1.02rem] text-ink/75">
            Bookings are by DM. Pick what you need, add a date and place, and we’ll copy your brief and open the chat with The Roots.
          </p>
          <div data-up className="mt-8 flex flex-wrap gap-3">
            <a href={IG_DM} target="_blank" rel="noreferrer" className="btn btn-ink" data-cursor="DM">
              DM on Instagram <span aria-hidden="true">↗</span>
            </a>
            <a href={YT} target="_blank" rel="noreferrer" className="btn btn-line">
              Watch on YouTube <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <form onSubmit={send} className="rounded-[24px] bg-linen/80 p-6 shadow-[0_30px_70px_-40px_rgba(45,35,48,0.45)] sm:p-9" noValidate>
          <fieldset>
            <legend className="label mb-4 text-ink/70">What do you need?</legend>
            <div data-chips className="flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const on = picked.includes(s);
                return (
                  <label key={s} data-chip className={`relative inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border px-4 text-sm transition-colors duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-clay ${on ? 'border-ink bg-ink text-oat' : 'border-ink/25 hover:border-ink'}`}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(s)} />
                    {on && <span className="mr-2" aria-hidden="true">✓</span>}
                    {s}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="label text-ink/70">The occasion</span>
              <input value={what} onChange={(e) => setWhat(e.target.value)} placeholder="Wedding, launch, concert, match…" className="mt-2 block min-h-12 w-full border-b border-ink/25 bg-transparent py-2 text-lg outline-none transition-colors placeholder:text-ink/35 focus:border-clay" />
            </label>
            <label>
              <span className="label text-ink/70">When</span>
              <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Date or month" className="mt-2 block min-h-12 w-full border-b border-ink/25 bg-transparent py-2 text-lg outline-none transition-colors placeholder:text-ink/35 focus:border-clay" />
            </label>
            <label>
              <span className="label text-ink/70">Where</span>
              <input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Shillong, Jowai, Kohima…" className="mt-2 block min-h-12 w-full border-b border-ink/25 bg-transparent py-2 text-lg outline-none transition-colors placeholder:text-ink/35 focus:border-clay" />
            </label>
          </div>
          <button type="submit" className="btn btn-ink mt-8 w-full justify-center" data-cursor="Send">
            Copy brief & open Instagram <span aria-hidden="true">↗</span>
          </button>
          <p className="mt-3 min-h-[1.5em] text-sm text-ink/70" role="status" aria-live="polite">
            {status === 'copied' && 'Brief copied — paste it into the chat that just opened.'}
            {status === 'manual' && 'Couldn’t copy automatically. Your brief: ' + brief().replace(/\n/g, ' · ')}
            {status === 'empty' && 'Pick at least one service or tell us the occasion.'}
          </p>
        </form>
      </div>

      <footer className="mx-auto mt-28 max-w-7xl pb-6 sm:mt-36">
        <div data-word className="flex justify-center overflow-hidden" aria-hidden="true">
          {WORD.split('').map((l, i) => (
            <span key={i} data-letter className="font-display inline-block text-[clamp(4.5rem,23vw,22rem)] italic leading-[0.85] text-plum">
              {l}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-8 border-t border-ink/15 pt-8 text-sm text-ink/70 md:grid-cols-[auto_1fr_auto] md:items-start">
          <img src={LOGO_INK} alt="The Roots — Ki Thied Tynrai" className="w-40" loading="lazy" />
          <div className="max-w-xl space-y-2">
            <p>
              Concept site built as a demo for The Roots (Ki Thied Tynrai), Shillong. Photos and captions from{' '}
              <a href={IG} target="_blank" rel="noreferrer" className="underline decoration-clay underline-offset-4">
                @therootsshillong
              </a>{' '}
              and the accounts that co-posted with them, used for this preview only:
            </p>
            <p className="text-ink/55">{CREDITS.join(' · ')}</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <button type="button" onClick={() => setMotion(off)} className="label inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/25 px-4 hover:border-ink" aria-pressed={!off}>
              Motion: {off ? 'Off' : 'On'}
            </button>
            <a href="#top" className="label inline-flex min-h-11 items-center hover:text-clay">
              Back to the top ↑
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
