import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, getLenis, motionOff, setMotion } from '../lib/motion';
import { IG, IG_DM, LOGO_INK, YT } from '../data/content';

const SCENES = [
  { id: 'about', label: 'The roots' },
  { id: 'work', label: 'Branches' },
  { id: 'lajong', label: 'Lajong kits' },
  { id: 'matchday', label: 'Matchday' },
  { id: 'events', label: 'Stage & screen' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'print', label: 'Design & print' },
  { id: 'archive', label: 'Archive' },
  { id: 'contact', label: 'Bookings' },
];

const MENU = [
  { label: 'What we do', href: '#work' },
  { label: 'Lajong kits', href: '#lajong' },
  { label: 'Stage & screen', href: '#events' },
  { label: 'Weddings', href: '#weddings' },
  { label: 'Design & print', href: '#print' },
  { label: 'Bookings', href: '#contact' },
];

const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

/** Fixed layer: grain, cursor, the bar that takes over from the hero, a root-shaped progress rail, and the menu. */
export default function Chrome() {
  const bar = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [scene, setScene] = useState(-1);
  const [label, setLabel] = useState('');
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(false);
  const off = typeof document !== 'undefined' && document.documentElement.classList.contains('motion-off');

  // motion stays on for everyone; people whose system asks for less get one quiet way out
  useEffect(() => {
    if (off || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (localStorage.getItem('roots-motion-note')) return;
    } catch {
      return;
    }
    const t = setTimeout(() => {
      setNote(true);
      try {
        localStorage.setItem('roots-motion-note', '1');
      } catch {
        // fine: it may show once more next visit
      }
    }, 6000);
    const onScroll = () => {
      if (window.scrollY > innerHeight * 3) setNote(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, [off]);

  useGSAP(() => {
    // while tucked away the bar is inert, so keyboard focus never lands on something off-screen
    gsap.set(bar.current, { yPercent: -130 });
    if (bar.current) bar.current.inert = true;
    ScrollTrigger.create({
      start: () => innerHeight * 0.35,
      end: 'max',
      onEnter: () => {
        if (bar.current) bar.current.inert = false;
        gsap.to(bar.current, { yPercent: 0, duration: 0.8, ease: 'expo.out' });
      },
      onLeaveBack: () => {
        if (bar.current) bar.current.inert = true;
        gsap.to(bar.current, { yPercent: -130, duration: 0.5, ease: 'expo.in' });
      },
    });
    const fill = rail.current?.querySelector<HTMLElement>('[data-rail-fill]');
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (fill) gsap.set(fill, { scaleY: self.progress });
        // pinned sections move in and out of pin-spacers, so read the scene from layout
        const mid = innerHeight / 2;
        let cur = -1;
        SCENES.forEach((s, i) => {
          const el = document.getElementById(s.id);
          const box = (el?.closest('.pin-spacer') ?? el)?.getBoundingClientRect();
          if (box && box.top <= mid && box.bottom > mid) cur = i;
        });
        setScene(cur);
      },
    });
  });

  useEffect(() => {
    const onOpen = () => {
      opener.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener('open-menu', onOpen);
    return () => window.removeEventListener('open-menu', onOpen);
  }, []);

  useEffect(() => {
    if (drawer.current) drawer.current.inert = !open;
  }, [open]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    const main = document.querySelector('main');
    if (main) main.inert = open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      getLenis()?.stop();
      drawer.current?.querySelector<HTMLElement>('a, button')?.focus();
    } else {
      getLenis()?.start();
      opener.current?.focus?.();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false);
      if (e.key !== 'Tab' || !drawer.current) return;
      const items = drawer.current.querySelectorAll<HTMLElement>('a, button');
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // cursor: a small dot that becomes a labelled disc over [data-cursor] targets and a ring over links
  useEffect(() => {
    const el = cursor.current;
    if (!el || motionOff() || !window.matchMedia('(pointer: fine)').matches) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.18 });
    let shown = false;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    const last = { x: -1, y: -1 };
    const probe = (node: Element | null) => {
      const t = node?.closest<HTMLElement>('a, button, label, [data-cursor]');
      const text = t?.dataset.cursor ?? '';
      setLabel(text);
      el.dataset.mode = text ? 'label' : t ? 'ring' : 'dot';
      gsap.to(el, { scale: text ? 1 : t ? 0.55 : 0.18, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    };
    const move = (e: PointerEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      probe(e.target as Element);
    };
    const onScroll = () => last.x >= 0 && probe(document.elementFromPoint(last.x, last.y));
    const leave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
    };
  }, []);

  const item = (delay: number) => ({
    className: `transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`,
    style: { transitionDelay: open ? `${delay}ms` : '0ms', transitionTimingFunction: EASE },
  });

  return (
    <>
      <div className="grain pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true" />

      <div ref={cursor} data-mode="dot" className="roots-cursor pointer-events-none fixed left-0 top-0 z-[95] hidden h-20 w-20 items-center justify-center rounded-full text-[11px] font-medium uppercase tracking-[0.14em] [@media(pointer:fine)]:flex" aria-hidden="true">
        <span className={label ? 'opacity-100' : 'opacity-0'}>{label}</span>
      </div>

      <div ref={bar} className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="no-blur-touch flex items-center justify-between rounded-full bg-oat/80 py-2 pl-5 pr-2 shadow-[0_10px_30px_-18px_rgba(45,35,48,0.5)] backdrop-blur-md">
          <a href="#top" aria-label="The Roots — back to top" className="flex min-h-10 items-center">
            <img src={LOGO_INK} alt="" className="h-7 w-auto sm:h-8" />
          </a>
          <p className="label hidden items-center gap-3 lg:flex" aria-live="off">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" />
            <span>{scene >= 0 ? `${String(scene + 1).padStart(2, '0')} · ${SCENES[scene].label}` : 'Ki Thied Tynrai'}</span>
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href={IG_DM} target="_blank" rel="noreferrer" className="btn btn-ink min-h-10 px-4 text-sm" data-cursor="DM">
              <span className="sm:hidden">DM</span>
              <span className="hidden sm:inline">DM for bookings</span>
            </a>
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(true);
              }}
              aria-expanded={open}
              className="label flex min-h-10 items-center px-3 hover:opacity-60"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      <div ref={rail} className="fixed right-4 top-1/2 z-[50] hidden h-[44svh] -translate-y-1/2 lg:block" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-full w-px bg-ink/15" />
        <div data-rail-fill className="absolute left-1/2 top-0 h-full w-px origin-top scale-y-0 bg-plum" />
        {SCENES.map((s, i) => (
          <span
            key={s.id}
            className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full transition-all duration-500 ${i <= scene ? 'scale-100 bg-clay' : 'scale-50 bg-ink/30'}`}
            style={{ top: `calc(${(i / (SCENES.length - 1)) * 100}% - 4px)` }}
          />
        ))}
      </div>

      <div className={`fixed inset-0 z-[70] bg-ink/30 transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside
        ref={drawer}
        className={`fixed inset-y-0 right-0 z-[75] flex w-[86%] max-w-md flex-col bg-sand px-8 py-10 transition-transform duration-[650ms] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ transitionTimingFunction: EASE }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Site menu"
      >
        <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="label absolute right-5 top-5 flex min-h-11 items-center px-3">
          Close ✕
        </button>
        <nav className="mt-14 flex flex-col">
          {MENU.map(({ label: l, href }, i) => {
            const it = item(200 + i * 60);
            return (
              <a key={l} href={href} onClick={() => setOpen(false)} className={`font-display py-1.5 text-4xl hover:text-plum ${it.className}`} style={it.style}>
                {l}
              </a>
            );
          })}
        </nav>
        <div className={`mt-auto ${item(620).className}`} style={item(620).style}>
          <p className="label text-ink/55">Find The Roots</p>
          <div className="mt-2 flex flex-wrap gap-x-6">
            <a href={IG} target="_blank" rel="noreferrer" className="py-2 text-sm">Instagram ↗</a>
            <a href={YT} target="_blank" rel="noreferrer" className="py-2 text-sm">YouTube ↗</a>
          </div>
          <a href={IG_DM} target="_blank" rel="noreferrer" className="btn btn-ink mt-6">
            DM for bookings ↗
          </a>
          <button type="button" onClick={() => setMotion(off)} className="label mt-6 flex min-h-11 items-center gap-2 text-ink/70 hover:text-ink" aria-pressed={!off}>
            Motion: {off ? 'Off' : 'On'} — tap to turn {off ? 'on' : 'off'}
          </button>
        </div>
      </aside>

      <div role="status" className={`fixed bottom-4 left-4 z-[65] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full bg-ink px-4 py-2 text-sm text-oat shadow-lg transition-all duration-500 ${note ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}>
        Motion is on.
        <button type="button" onClick={() => setMotion(false)} className="min-h-9 underline decoration-clay underline-offset-4" tabIndex={note ? 0 : -1}>
          Turn it off
        </button>
        <button type="button" onClick={() => setNote(false)} aria-label="Keep motion on and close" className="min-h-9 px-1 text-oat/70 hover:text-oat" tabIndex={note ? 0 : -1}>
          ✕
        </button>
      </div>
    </>
  );
}
