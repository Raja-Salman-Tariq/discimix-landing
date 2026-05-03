import { useEffect, useRef } from "react";

const N = 48;
const DIST = 240;
const REPEL_R = 130;
const MAX_SPEED = 3.5;
/** Skip most (i,j,k) triples — keeps a hint of mesh fill without O(n³) cost. */
const TRIANGLE_STRIDE = 2;

function mkVert(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    bvx: 0, bvy: 0, // base velocity (preserved after repulsion)
  };
}

function rgb(t) {
  const r = Math.round(60  + t * 200);
  const g = Math.round(140 - t * 90);
  const b = Math.round(255 - t * 55);
  return `${r},${g},${b}`;
}

export default function HeroCanvas() {
  const ref = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let verts = [];
    let running = false;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      verts = Array.from({ length: N }, () => {
        const v = mkVert(canvas.width, canvas.height);
        v.bvx = v.vx; v.bvy = v.vy;
        return v;
      });
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onLeave() { mouse.current = { x: -9999, y: -9999 }; }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    function draw() {
      if (!running) return;

      const { width: w, height: h } = canvas;
      const { x: mx, y: my } = mouse.current;
      ctx.clearRect(0, 0, w, h);

      for (const v of verts) {
        // gentle damping toward base velocity
        v.vx += (v.bvx - v.vx) * 0.012;
        v.vy += (v.bvy - v.vy) * 0.012;

        // mouse repulsion
        const dx = v.x - mx, dy = v.y - my;
        const d  = Math.hypot(dx, dy);
        if (d < REPEL_R && d > 0) {
          const f = (1 - d / REPEL_R) * 2.2;
          v.vx += (dx / d) * f;
          v.vy += (dy / d) * f;
        }

        // cap speed
        const spd = Math.hypot(v.vx, v.vy);
        if (spd > MAX_SPEED) { v.vx = (v.vx / spd) * MAX_SPEED; v.vy = (v.vy / spd) * MAX_SPEED; }

        v.x += v.vx; v.y += v.vy;
        if (v.x < -60) v.x = w + 60;
        if (v.x > w + 60) v.x = -60;
        if (v.y < -60) v.y = h + 60;
        if (v.y > h + 60) v.y = -60;
      }

      ctx.shadowBlur = 0;

      // edges (+ sparse triangles)
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dij = Math.hypot(verts[i].x - verts[j].x, verts[i].y - verts[j].y);
          if (dij > DIST) continue;
          const aij = 1 - dij / DIST;
          const cij = rgb(((verts[i].x + verts[j].x) / 2) / w);

          const emx = (verts[i].x + verts[j].x) / 2;
          const emy = (verts[i].y + verts[j].y) / 2;
          const md  = Math.hypot(emx - mx, emy - my);
          const boost = Math.max(0, 1 - md / 180) * 0.7;

          // single stroke (replaces glow + crisp passes)
          ctx.beginPath();
          ctx.moveTo(verts[i].x, verts[i].y);
          ctx.lineTo(verts[j].x, verts[j].y);
          ctx.strokeStyle = `rgba(${cij},${(aij * 0.72) + boost * 0.22})`;
          ctx.lineWidth = 2.1 + boost * 1.4;
          ctx.stroke();

          for (let k = j + TRIANGLE_STRIDE; k < N; k += TRIANGLE_STRIDE) {
            const dik = Math.hypot(verts[i].x - verts[k].x, verts[i].y - verts[k].y);
            const djk = Math.hypot(verts[j].x - verts[k].x, verts[j].y - verts[k].y);
            if (dik > DIST || djk > DIST) continue;
            const a  = Math.min(aij, 1 - dik / DIST, 1 - djk / DIST);
            const cx = (verts[i].x + verts[j].x + verts[k].x) / 3;
            const cy = (verts[i].y + verts[j].y + verts[k].y) / 3;
            const tb = Math.max(0, 1 - Math.hypot(cx - mx, cy - my) / 200) * 0.25;
            ctx.beginPath();
            ctx.moveTo(verts[i].x, verts[i].y);
            ctx.lineTo(verts[j].x, verts[j].y);
            ctx.lineTo(verts[k].x, verts[k].y);
            ctx.closePath();
            ctx.fillStyle = `rgba(${rgb(cx / w)},${a * 0.22 + tb})`;
            ctx.fill();
          }
        }
      }

      // dots (no shadow — radius carries emphasis near cursor)
      for (const v of verts) {
        const c   = rgb(v.x / w);
        const dd  = Math.hypot(v.x - mx, v.y - my);
        const dot = Math.max(0, 1 - dd / REPEL_R) * 0.6;
        ctx.beginPath();
        ctx.arc(v.x, v.y, 3.2 + dot * 3.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},1)`;
        ctx.fill();
      }

      // cursor glow bloom
      if (mx > 0) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        g.addColorStop(0,   "rgba(190, 155, 255, 0.22)");
        g.addColorStop(0.4, "rgba(120, 80,  220, 0.10)");
        g.addColorStop(1,   "rgba(0,   0,   0,   0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      if (running) raf = requestAnimationFrame(draw);
    }

    function setRunning(next) {
      if (next === running) return;
      running = next;
      if (running) {
        raf = requestAnimationFrame(draw);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const hit = entries.some((e) => e.isIntersecting);
              setRunning(hit);
            },
            { root: null, rootMargin: "72px", threshold: 0 }
          )
        : null;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (io) {
      io.observe(canvas);
    } else {
      setRunning(true);
    }

    return () => {
      setRunning(false);
      ro.disconnect();
      io?.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        zIndex: 1,
      }}
    />
  );
}
