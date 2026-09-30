import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; r: number; vx: number; vy: number; phase: number; warm: boolean };

/**
 * Drifting pollen and light motes over a sky. Pauses off-screen; static under reduced motion.
 * `colors` are two "r, g, b" strings (warm, cool); `strength` scales opacity for light skies.
 */
export function Pollen({
  className = "",
  colors = ["246, 217, 143", "243, 198, 214"],
  strength = 1,
}: {
  className?: string;
  colors?: [string, string];
  strength?: number;
}) {
  const [warmColor, coolColor] = colors;
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let motes: Mote[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const seed = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.round((w * h) / 9000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.9,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.04 + Math.random() * 0.14),
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.35,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const twinkle = 0.45 + 0.55 * Math.sin(t / 900 + m.phase);
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
        const c = m.warm ? warmColor : coolColor;
        g.addColorStop(0, `rgba(${c}, ${0.9 * twinkle * strength})`);
        g.addColorStop(0.35, `rgba(${c}, ${0.28 * twinkle * strength})`);
        g.addColorStop(1, `rgba(${c}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      for (const m of motes) {
        m.x += (m.vx + Math.sin(now / 2400 + m.phase) * 0.04) * dt;
        m.y += m.vy * dt * 0.6;
        if (m.y < -10) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;
      }
      draw(now);
      if (visible) raf = requestAnimationFrame(step);
    };

    seed();
    draw(0);
    const ro = new ResizeObserver(() => {
      seed();
      draw(performance.now());
    });
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (!reduce) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) {
          last = performance.now();
          raf = requestAnimationFrame(step);
        }
      });
      io.observe(canvas);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
    };
  }, [warmColor, coolColor, strength]);

  return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden="true" />;
}
