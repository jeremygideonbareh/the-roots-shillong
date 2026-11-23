import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' });

/**
 * Reading pauses, in viewport heights. Every scene gets a hold so it can be read before it moves on.
 * Kept in one place so pacing can be tuned without hunting through components.
 */
export const SCROLL_MAP = {
  heroHold: 0.9, // hero stays put while the photo tiles drift out and the roots keep growing
  manifesto: 1.6, // quote pinned centred while its words light up
  branchesLead: 0.25, // first card sits still before the track starts moving
  branchesPerCard: 0.85, // travel per service card
  branchesTail: 0.3,
  stage: 1.4, // concert photo opening from a window to the full screen
};

// Max motion is the default for everyone; the footer switch is the opt-out (html.motion-off, set in index.html)
const MOTION_KEY = 'roots-motion';
export const motionOff = () => typeof document !== 'undefined' && document.documentElement.classList.contains('motion-off');
export const isTouch = () => typeof document !== 'undefined' && document.documentElement.classList.contains('touch');

export function setMotion(on: boolean) {
  try {
    localStorage.setItem(MOTION_KEY, on ? 'on' : 'off');
  } catch {
    // storage blocked: the choice lasts until the reload below
  }
  document.documentElement.classList.toggle('motion-off', !on);
  location.reload();
}

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function startSmoothScroll() {
  if (lenis || motionOff()) return () => {};
  // native touch scrolling on phones; smoothing only for wheels and trackpads
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, syncTouch: false });
  (window as unknown as { __lenis: Lenis }).__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToY(y: number) {
  if (lenis && Math.abs(y - window.scrollY) > innerHeight * 6) {
    // long trips cut through a brief cover instead of streaming every pinned scene past
    const cover = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'jump-cover' }));
    gsap.fromTo(cover, { opacity: 0 }, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        lenis?.scrollTo(y, { immediate: true, force: true });
        gsap.to(cover, { opacity: 0, duration: 0.6, delay: 0.2, onComplete: () => cover.remove() });
      },
    });
    return;
  }
  if (lenis) lenis.scrollTo(y, { force: true, duration: 1.6 });
  else window.scrollTo({ top: y, behavior: motionOff() ? 'auto' : 'smooth' });
}

/** In-page links land where each section reads, including pin spacing. */
export function scrollToAnchor(hash: string) {
  if (hash === '#' || hash === '#top') return scrollToY(0);
  const el = document.querySelector(hash);
  if (!el) return;
  scrollToY((el.closest('.pin-spacer') ?? el).getBoundingClientRect().top + window.scrollY);
}

export async function warmLazyImages() {
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
  const urls = new Set(Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'), (i) => i.src));
  for (const src of urls) {
    const image = new Image();
    image.src = src;
    await image.decode().catch(() => {});
  }
}

export const scrollVelocity = () => (lenis ? lenis.velocity : 0);

/** Word-by-word heading reveal, triggered as the heading enters. */
export function revealWords(scope: Element | null, selector = '[data-split]') {
  if (!scope || motionOff()) return;
  scope.querySelectorAll(selector).forEach((h) => {
    const words = h.querySelectorAll('.w > span');
    gsap.fromTo(
      words,
      { yPercent: 115, rotate: 4 },
      { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: h, start: 'top 86%', once: true } },
    );
  });
}

/** Lines of supporting copy rise after their heading. */
export function revealUp(scope: Element | null, selector = '[data-up]') {
  if (!scope || motionOff()) return;
  scope.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    gsap.fromTo(el, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: Number(el.dataset.up || 0), scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
}

/** Clip-path image reveal with the photo settling inside its frame. */
export function revealFrames(scope: Element | null, selector = '[data-frame]') {
  if (!scope || motionOff()) return;
  scope.querySelectorAll<HTMLElement>(selector).forEach((f) => {
    const from = f.dataset.frame === 'side' ? 'inset(0% 100% 0% 0% round 18px)' : 'inset(100% 0% 0% 0% round 18px)';
    const im = f.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 88%', once: true } });
    tl.fromTo(f, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.3, ease: 'expo.inOut' });
    if (im) tl.fromTo(im, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.1);
  });
}

/** Scrubbed inner-image drift so photos feel deeper than their frames. */
export function parallaxImages(scope: Element | null, selector = '[data-par] img', amount = 12) {
  if (!scope || motionOff()) return;
  scope.querySelectorAll<HTMLElement>(selector).forEach((im) => {
    const host = im.closest<HTMLElement>('[data-par]')!;
    const a = Number(host.dataset.par || amount);
    gsap.fromTo(im, { yPercent: -a, scale: 1.18 }, { yPercent: a, scale: 1.18, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
