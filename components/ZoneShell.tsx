"use client";

import { motion, useTransform } from "framer-motion";
import { useCanvas } from "./Canvas";
import { getZone, ZoneId } from "@/lib/zones";
import clsx from "clsx";

interface ZoneShellProps {
  id: ZoneId;
  parallax?: number;
  children: React.ReactNode;
  className?: string;
  marker?: string;
}

/**
 * Wrapper for every zone.
 *
 * Viewport-focus effect (per spec §2): zone in viewport center = sharp + full
 * opacity; zones near the edge = mild blur, reduced opacity. Creates a sense
 * of reading focus without hiding content.
 *
 * When a zone is hovered or active, its z-index bumps above siblings and
 * filters reset to 0 regardless of position.
 */
export function ZoneShell({
  id,
  parallax = 10,
  children,
  className,
  marker,
}: ZoneShellProps) {
  const {
    tx,
    ty,
    scale,
    viewport,
    mouseX,
    mouseY,
    setHovered,
    zoomToZone,
    hovered,
    active,
    reduceMotion,
  } = useCanvas();

  const z = getZone(id);
  const cx = z.x + z.width / 2;
  const cy = z.y + z.height / 2;

  // Parallax gated by reduce-motion preference — this is the most jarring
  // cursor-driven motion for vestibular-sensitive users.
  const effectiveParallax = reduceMotion ? 0 : parallax;
  const dx = useTransform(mouseX, (v) => v * effectiveParallax);
  const dy = useTransform(mouseY, (v) => v * effectiveParallax);

  const isFocus = hovered === id || active === id;

  // Viewport-focus — distance from screen center in screen pixels
  const distance = useTransform(
    [tx, ty, scale],
    ([txv, tyv, sv]: number[]) => {
      if (!viewport.w) return 0;
      const screenX = cx * sv + txv;
      const screenY = cy * sv + tyv;
      const ddx = screenX - viewport.w / 2;
      const ddy = screenY - viewport.h / 2;
      return Math.hypot(ddx, ddy);
    }
  );

  const blurPx = useTransform(distance, [0, 380, 900], [0, 0.6, 1.8]);
  const viewOpacity = useTransform(distance, [0, 420, 1100], [1, 0.95, 0.72]);

  // When focused, kill the blur entirely
  const filter = useTransform(blurPx, (b) =>
    isFocus ? "blur(0px)" : `blur(${b.toFixed(2)}px)`
  );
  const effectiveOpacity = useTransform(viewOpacity, (o) => (isFocus ? 1 : o));

  return (
    <motion.article
      style={{
        position: "absolute",
        left: z.x,
        top: z.y,
        width: z.width,
        minHeight: z.height,
        x: dx,
        y: dy,
        filter,
        opacity: effectiveOpacity,
        zIndex: isFocus ? 30 : 20,
      }}
      className={clsx("zone-card p-8 flex flex-col", className)}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      onDoubleClick={() => zoomToZone(id, 1)}
      animate={{
        borderColor: isFocus
          ? "rgba(168, 200, 160, 0.38)"
          : "rgba(168, 200, 160, 0.12)",
        boxShadow: isFocus
          ? "0 1px 0 rgba(240,230,210,0.04) inset, 0 30px 90px -28px rgba(0,0,0,0.7), 0 8px 30px -10px rgba(168,200,160,0.08)"
          : "0 1px 0 rgba(240,230,210,0.03) inset, 0 20px 60px -20px rgba(0,0,0,0.6), 0 4px 18px -8px rgba(0,0,0,0.4)",
      }}
      transition={{ duration: 0.38, ease: [0.22, 0.8, 0.26, 1] }}
      aria-label={z.label}
      role="region"
    >
      <header
        aria-hidden
        className="flex items-center justify-between mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-steel"
      >
        <span>{marker ?? `zone / ${id}`}</span>
        <motion.span
          animate={{ color: isFocus ? "#a8c8a0" : "#6a7a88" }}
          transition={{ duration: 0.25 }}
        >
          ↦ {z.shortLabel.toLowerCase()}
        </motion.span>
      </header>
      <div className="flex-1">{children}</div>
    </motion.article>
  );
}
