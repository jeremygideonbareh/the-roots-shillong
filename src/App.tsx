import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Branches from './components/Branches';
import Lajong from './components/Lajong';
import Matchday from './components/Matchday';
import Stage from './components/Stage';
import Weddings from './components/Weddings';
import Paper from './components/Paper';
import Archive from './components/Archive';
import Contact from './components/Contact';
import Chrome from './components/Chrome';
import { ScrollTrigger, getLenis, scrollToAnchor, startSmoothScroll, warmLazyImages, gsap } from './lib/motion';

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/**
 * The page never switches colour at a line. Each section names a tone of about the same lightness,
 * and the body blends between neighbours across a band of the viewport as you scroll.
 */
function useToneBlend() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'));
    if (!sections.length) return;
    const tones = sections.map((s) => hex(s.dataset.tone!));
    let last = '';
    const update = () => {
      const vh = innerHeight;
      const c = [...tones[0]];
      for (let i = 1; i < sections.length; i++) {
        const box = (sections[i].closest('.pin-spacer') ?? sections[i]).getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.8 - box.top) / (vh * 0.55)));
        if (p <= 0) break;
        for (let k = 0; k < 3; k++) c[k] += (tones[i][k] - c[k]) * p;
      }
      const v = `rgb(${c.map(Math.round).join(',')})`;
      if (v !== last) {
        document.body.style.backgroundColor = v;
        last = v;
      }
    };
    update();
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stop = startSmoothScroll();
    getLenis()?.stop();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', loading);
    document.body.style.overflow = loading ? 'hidden' : '';
    if (!loading) {
      getLenis()?.start();
      ScrollTrigger.refresh();
      warmLazyImages();
    }
  }, [loading]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const hash = link.getAttribute('href')!;
      scrollToAnchor(hash);
      const target = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useToneBlend();

  const done = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Loader onDone={done} />}
      <a href="#work" className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-sm text-oat focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to the work
      </a>
      <Chrome />
      <main>
        <Hero />
        <Manifesto />
        <Branches />
        <Lajong />
        <Matchday />
        <Stage />
        <Weddings />
        <Paper />
        <Archive />
        <Contact />
      </main>
    </>
  );
}
