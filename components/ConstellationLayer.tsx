"use client";

import { useEffect, useRef } from "react";
import { useCanvas } from "./Canvas";
import {
  CONNECTIONS,
  ZONES,
  ZoneId,
  getConnectionsFor,
  getZone,
  zoneCenter,
} from "@/lib/zones";

interface Pulse {
  key: string;
  from: ZoneId;
  to: ZoneId;
  t: number; // 0..1
  speed: number;
  size: number;
  hue: number; // 0 = growth, 1 = anchor
}

export default function ConstellationLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tx, ty, scale, viewport, hovered, active, reduceMotion } =
    useCanvas();

  // Pulses — created on hover, travel along a line
  const pulsesRef = useRef<Pulse[]>([]);
  // Continuous ambient pulses on random connections
  const ambientTimerRef = useRef(0);
  const hoveredRef = useRef<ZoneId | null>(null);
  const activeRef = useRef<ZoneId | null>(null);
  const connCacheRef = useRef(new Map<ZoneId, ZoneId[]>());
  const firstMoveRef = useRef(false);

  // First genuine mouse-move — teach the mechanic by sending a single pulse
  // from Entry to Problem. Fires once, then detaches.
  useEffect(() => {
    if (reduceMotion) return;
    const onFirstMove = () => {
      if (firstMoveRef.current) return;
      firstMoveRef.current = true;
      window.setTimeout(() => {
        pulsesRef.current.push({
          key: `first-move-${Math.random()}`,
          from: "entry",
          to: "problem",
          t: 0,
          speed: 0.38,
          size: 2.4,
          hue: 0,
        });
      }, 650);
      window.removeEventListener("mousemove", onFirstMove);
    };
    window.addEventListener("mousemove", onFirstMove);
    return () => window.removeEventListener("mousemove", onFirstMove);
  }, [reduceMotion]);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!connCacheRef.current.size) {
      for (const z of ZONES) {
        connCacheRef.current.set(z.id, getConnectionsFor(z.id));
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = viewport.w * dpr;
      canvas.height = viewport.h * dpr;
      canvas.style.width = `${viewport.w}px`;
      canvas.style.height = `${viewport.h}px`;
    };
    resize();

    const spawnPulse = (from: ZoneId, to: ZoneId, hue = 0) => {
      pulsesRef.current.push({
        key: `${from}-${to}-${Math.random()}`,
        from,
        to,
        t: 0,
        speed: 0.3 + Math.random() * 0.25,
        size: 1.4 + Math.random() * 0.9,
        hue,
      });
    };

    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const s = scale.get();
      const dx = tx.get();
      const dy = ty.get();

      // Transform world (x,y) -> screen (px,py)
      const w2s = (wx: number, wy: number) => [
        (wx * s + dx) * dpr,
        (wy * s + dy) * dpr,
      ];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hoveredId = hoveredRef.current;
      const activeId = activeRef.current;
      const highlightIds = new Set<ZoneId>();
      const focus = hoveredId ?? activeId;
      if (focus) {
        highlightIds.add(focus);
        for (const c of connCacheRef.current.get(focus) ?? []) {
          highlightIds.add(c);
        }
      }

      // Draw base constellation lines
      ctx.lineCap = "round";
      for (const [a, b] of CONNECTIONS) {
        const za = getZone(a);
        const zb = getZone(b);
        const ca = zoneCenter(za);
        const cb = zoneCenter(zb);
        const [ax, ay] = w2s(ca.x, ca.y);
        const [bx, by] = w2s(cb.x, cb.y);

        const isFocus = focus && (a === focus || b === focus);
        const alpha = isFocus ? 0.42 : 0.14;
        const width = (isFocus ? 1.3 : 0.7) * dpr;

        // Slight curve — control point perpendicular-ish offset
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dxl = bx - ax;
        const dyl = by - ay;
        const perpLen = Math.hypot(dxl, dyl);
        const nx = perpLen ? -dyl / perpLen : 0;
        const ny = perpLen ? dxl / perpLen : 0;
        const curveAmp = Math.min(60, perpLen * 0.06) * dpr;
        const cx = mx + nx * curveAmp;
        const cy = my + ny * curveAmp;

        const grad = ctx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, `rgba(168, 200, 160, ${alpha * 0.6})`);
        grad.addColorStop(0.5, `rgba(168, 200, 160, ${alpha})`);
        grad.addColorStop(1, `rgba(212, 165, 165, ${alpha * 0.7})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(cx, cy, bx, by);
        ctx.stroke();

        // Zone endpoints — subtle dots
        if (isFocus) {
          ctx.fillStyle = `rgba(168, 200, 160, 0.7)`;
          ctx.beginPath();
          ctx.arc(ax, ay, 2 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bx, by, 2 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Ambient pulses — spawn occasionally
      ambientTimerRef.current -= dt;
      if (ambientTimerRef.current <= 0 && !reduceMotion) {
        ambientTimerRef.current = 1.8 + Math.random() * 2.4;
        const [a, b] =
          CONNECTIONS[Math.floor(Math.random() * CONNECTIONS.length)];
        if (Math.random() > 0.5) spawnPulse(a, b);
        else spawnPulse(b, a);
      }
      // On hover — guarantee at least one pulse per highlighted connection
      if (focus && !reduceMotion && pulsesRef.current.length < 8) {
        for (const c of connCacheRef.current.get(focus) ?? []) {
          if (
            !pulsesRef.current.some(
              (p) =>
                (p.from === focus && p.to === c) ||
                (p.from === c && p.to === focus)
            ) &&
            Math.random() < 0.12
          ) {
            spawnPulse(focus, c, Math.random() < 0.3 ? 1 : 0);
          }
        }
      }

      // Draw pulses
      const next: Pulse[] = [];
      for (const p of pulsesRef.current) {
        p.t += dt * p.speed;
        if (p.t >= 1) continue;
        next.push(p);

        const za = getZone(p.from);
        const zb = getZone(p.to);
        const ca = zoneCenter(za);
        const cb = zoneCenter(zb);
        const [ax, ay] = w2s(ca.x, ca.y);
        const [bx, by] = w2s(cb.x, cb.y);
        // Quadratic curve same as line
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dxl = bx - ax;
        const dyl = by - ay;
        const perpLen = Math.hypot(dxl, dyl);
        const nx = perpLen ? -dyl / perpLen : 0;
        const ny = perpLen ? dxl / perpLen : 0;
        const curveAmp = Math.min(60, perpLen * 0.06) * dpr;
        const cx = mx + nx * curveAmp;
        const cy = my + ny * curveAmp;

        // Quadratic bezier point
        const u = 1 - p.t;
        const px = u * u * ax + 2 * u * p.t * cx + p.t * p.t * bx;
        const py = u * u * ay + 2 * u * p.t * cy + p.t * p.t * by;

        const fade = 1 - Math.pow(2 * p.t - 1, 2); // 0 → 1 → 0
        const color =
          p.hue === 1
            ? `rgba(212, 165, 165, ${0.85 * fade})`
            : `rgba(168, 200, 160, ${0.9 * fade})`;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 * dpr * fade;
        ctx.beginPath();
        ctx.arc(px, py, p.size * dpr * (0.8 + fade * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      pulsesRef.current = next;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [tx, ty, scale, viewport.w, viewport.h, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden
    />
  );
}
