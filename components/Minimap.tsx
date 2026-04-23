"use client";

import { useEffect, useRef, useState } from "react";
import { useCanvas } from "./Canvas";
import { WORLD, ZONES, ZoneId } from "@/lib/zones";
import { motion } from "framer-motion";

export default function Minimap() {
  const { tx, ty, scale, viewport, hovered, active, zoomToZone } = useCanvas();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverId, setHoverId] = useState<ZoneId | null>(null);
  const W = 188;
  const H = 126;
  const worldAspect = WORLD.width / WORLD.height;
  const mapAspect = W / H;

  // Fit world into W×H preserving aspect
  const { mw, mh, offX, offY } =
    worldAspect > mapAspect
      ? {
          mw: W,
          mh: W / worldAspect,
          offX: 0,
          offY: (H - W / worldAspect) / 2,
        }
      : {
          mw: H * worldAspect,
          mh: H,
          offX: (W - H * worldAspect) / 2,
          offY: 0,
        };

  const wx = (x: number) => offX + (x / WORLD.width) * mw;
  const wy = (y: number) => offY + (y / WORLD.height) * mh;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Frame
      ctx.fillStyle = "rgba(22, 32, 31, 0.8)";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(168, 200, 160, 0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

      // Zones as thin rects
      for (const z of ZONES) {
        const zx = wx(z.x);
        const zy = wy(z.y);
        const zw = (z.width / WORLD.width) * mw;
        const zh = (z.height / WORLD.height) * mh;
        const isActive = active === z.id;
        const isHovered = hovered === z.id || hoverId === z.id;
        ctx.strokeStyle = isActive
          ? "rgba(212, 165, 165, 0.9)"
          : isHovered
          ? "rgba(168, 200, 160, 0.85)"
          : "rgba(168, 200, 160, 0.32)";
        ctx.fillStyle = isActive
          ? "rgba(212, 165, 165, 0.12)"
          : isHovered
          ? "rgba(168, 200, 160, 0.08)"
          : "rgba(168, 200, 160, 0.04)";
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.fillRect(zx, zy, zw, zh);
        ctx.strokeRect(zx, zy, zw, zh);
      }

      // Viewport rectangle (inverse of world transform)
      const s = scale.get();
      const vx = (-tx.get()) / s;
      const vy = (-ty.get()) / s;
      const vw = viewport.w / s;
      const vh = viewport.h / s;

      ctx.strokeStyle = "rgba(240, 230, 210, 0.9)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(wx(vx), wy(vy), (vw / WORLD.width) * mw, (vh / WORLD.height) * mh);
      ctx.setLineDash([]);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [tx, ty, scale, viewport.w, viewport.h, hovered, active, hoverId, mw, mh, offX, offY]);

  const pickZone = (clientX: number, clientY: number): ZoneId | null => {
    const r = canvasRef.current!.getBoundingClientRect();
    const mx = clientX - r.left;
    const my = clientY - r.top;
    for (const z of ZONES) {
      const zx = wx(z.x);
      const zy = wy(z.y);
      const zw = (z.width / WORLD.width) * mw;
      const zh = (z.height / WORLD.height) * mh;
      if (mx >= zx && mx <= zx + zw && my >= zy && my <= zy + zh) return z.id;
    }
    return null;
  };

  return (
    <motion.div
      data-no-pan
      className="absolute bottom-6 right-6 select-none"
      style={{ zIndex: 20 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="block cursor-pointer"
          onMouseMove={(e) => setHoverId(pickZone(e.clientX, e.clientY))}
          onMouseLeave={() => setHoverId(null)}
          onClick={(e) => {
            const id = pickZone(e.clientX, e.clientY);
            if (id) zoomToZone(id, 1);
          }}
        />
        <div className="absolute -top-6 left-0 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
          карта · {ZONES.length} зон
        </div>
        <div className="absolute -bottom-5 left-0 right-0 font-mono text-[10px] text-steel">
          {hoverId
            ? ZONES.find((z) => z.id === hoverId)?.label
            : "клик — переход"}
        </div>
      </div>
    </motion.div>
  );
}
