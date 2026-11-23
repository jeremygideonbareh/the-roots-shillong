/**
 * Generative root system for the hero: a seeded branching network that grows down from the top
 * edge (growth 0..1), leans toward the pointer, and only redraws when something changed.
 * It is the brand's name made literal: tynrai, the roots.
 */
type Pt = { x: number; y: number; t: number };
type Line = { pts: Pt[]; depth: number; tip: boolean };

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export class RootsCanvas {
  private ctx: CanvasRenderingContext2D;
  private lines: Line[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private dirty = true;
  private running = false;
  growth = 0;
  private lean = 0;
  private leanTarget = 0;
  private onResize = () => this.resize();
  private onVis = () => (document.hidden ? this.stop() : this.start());

  constructor(private canvas: HTMLCanvasElement, private maxDpr = 1.5) {
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVis);
  }

  private build() {
    const r = rng(7);
    this.lines = [];
    const W = this.w;
    const H = this.h;
    const seeds = W < 700 ? 4 : 6;
    const grow = (x: number, y: number, a: number, len: number, depth: number, t0: number) => {
      const steps = 7;
      const pts: Pt[] = [{ x, y, t: t0 }];
      const span = 0.16 + depth * 0.012;
      let cx = x;
      let cy = y;
      let ca = a;
      for (let i = 1; i <= steps; i++) {
        ca += (r() - 0.5) * 0.35;
        // roots seek downward
        ca += (Math.PI / 2 - ca) * 0.08;
        cx += Math.cos(ca) * (len / steps);
        cy += Math.sin(ca) * (len / steps);
        pts.push({ x: cx, y: cy, t: t0 + span * (i / steps) });
      }
      const t1 = t0 + span;
      const done = depth >= 6 || cy > H * 1.05 || t1 > 0.98;
      this.lines.push({ pts, depth, tip: done });
      if (done) return;
      const kids = r() < 0.75 ? 2 : 3;
      for (let k = 0; k < kids; k++) {
        const spread = (k - (kids - 1) / 2) * (0.5 + r() * 0.35);
        grow(cx, cy, ca + spread, len * (0.68 + r() * 0.18), depth + 1, t1 - 0.01);
      }
    };
    for (let i = 0; i < seeds; i++) {
      const x = W * ((i + 0.5) / seeds) + (r() - 0.5) * W * 0.08;
      grow(x, -10, Math.PI / 2 + (r() - 0.5) * 0.4, H * (0.2 + r() * 0.07), 0, r() * 0.08);
    }
  }

  resize() {
    const box = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    this.w = Math.max(1, box.width);
    this.h = Math.max(1, box.height);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.build();
    this.dirty = true;
    if (!this.running) this.draw();
  }

  /** -1..1, from pointer x */
  setLean(v: number) {
    this.leanTarget = v;
  }

  setGrowth(g: number) {
    if (Math.abs(g - this.growth) > 0.0005) {
      this.growth = g;
      this.dirty = true;
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      const d = this.leanTarget - this.lean;
      if (Math.abs(d) > 0.001) {
        this.lean += d * 0.06;
        this.dirty = true;
      }
      if (this.dirty) this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  draw() {
    this.dirty = false;
    const { ctx, dpr, h } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const g = this.growth;
    const bend = this.lean * 26;
    for (const l of this.lines) {
      if (l.pts[0].t > g) continue;
      // collect the grown points, then draw a smooth curve through their midpoints
      const pts: [number, number][] = [];
      let reached = true;
      for (let i = 0; i < l.pts.length; i++) {
        const p = l.pts[i];
        let x = p.x + bend * (p.y / h) * (p.y / h);
        let y = p.y;
        if (p.t > g) {
          // partial last step, so tips grow smoothly instead of popping
          const prev = l.pts[i - 1];
          const [lx, ly] = pts[pts.length - 1];
          const f = (g - prev.t) / (p.t - prev.t);
          x = lx + (x - lx) * f;
          y = ly + (y - ly) * f;
          reached = false;
        }
        pts.push([x, y]);
        if (!reached) break;
      }
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2;
        const my = (pts[i][1] + pts[i + 1][1]) / 2;
        ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
      }
      const [lastX, lastY] = pts[pts.length - 1];
      ctx.lineTo(lastX, lastY);
      const alpha = 0.34 - l.depth * 0.03;
      ctx.strokeStyle = l.depth % 3 === 2 ? `rgba(168,103,74,${alpha})` : `rgba(94,68,103,${alpha})`;
      ctx.lineWidth = Math.max(0.6, 2.6 - l.depth * 0.36);
      ctx.stroke();
      if (l.tip && reached) {
        ctx.fillStyle = l.depth % 2 ? 'rgba(168,103,74,0.5)' : 'rgba(94,68,103,0.45)';
        ctx.beginPath();
        ctx.arc(lastX, lastY, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVis);
  }
}
