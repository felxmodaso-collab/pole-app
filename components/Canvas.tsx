"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";
import { WORLD, ZoneId, getZone, zoneCenter } from "@/lib/zones";

type CanvasCtx = {
  tx: MotionValue<number>;
  ty: MotionValue<number>;
  scale: MotionValue<number>;
  mouseX: MotionValue<number>; // -1..1 normalized, relative to viewport center
  mouseY: MotionValue<number>;
  viewport: { w: number; h: number };
  hovered: ZoneId | null;
  setHovered: (id: ZoneId | null) => void;
  active: ZoneId | null;
  setActive: (id: ZoneId | null) => void;
  zoomToZone: (id: ZoneId, zoom?: number) => void;
  reset: () => void;
  reduceMotion: boolean;
};

const Ctx = createContext<CanvasCtx | null>(null);
export const useCanvas = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCanvas must be inside <Canvas>");
  return c;
};

const entry = getZone("entry");
const entryCenter = zoneCenter(entry);

export default function Canvas({
  children,
  overlay,
}: {
  children: React.ReactNode;
  overlay?: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<ZoneId | null>(null);
  const [active, setActive] = useState<ZoneId | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);

  const scale = useMotionValue(1);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Measure viewport
  useEffect(() => {
    if (!outerRef.current) return;
    const update = () => {
      const r = outerRef.current!.getBoundingClientRect();
      setViewport({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);

  // Center on entry once viewport is known
  useEffect(() => {
    if (viewport.w === 0) return;
    tx.set(viewport.w / 2 - entryCenter.x);
    ty.set(viewport.h / 2 - entryCenter.y);
    setReady(true);
  }, [viewport.w, viewport.h, tx, ty]);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduceMotion(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  const clampPan = useCallback(
    (nextX: number, nextY: number, s: number) => {
      // Prevent user panning fully away from world
      const vw = viewport.w;
      const vh = viewport.h;
      const worldW = WORLD.width * s;
      const worldH = WORLD.height * s;
      const margin = 0.3; // fraction of viewport allowed as slack
      const minX = vw * (1 - margin) - worldW;
      const maxX = vw * margin;
      const minY = vh * (1 - margin) - worldH;
      const maxY = vh * margin;
      return {
        x: Math.min(maxX, Math.max(minX, nextX)),
        y: Math.min(maxY, Math.max(minY, nextY)),
      };
    },
    [viewport.w, viewport.h]
  );

  // Drag pan
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    let dragging = false;
    let sx = 0,
      sy = 0,
      stx = 0,
      sty = 0;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-no-pan]")) return;
      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      stx = tx.get();
      sty = ty.get();
      outer.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMove = (e: MouseEvent) => {
      // Normalized mouse for parallax
      if (viewport.w > 0) {
        const r = outer.getBoundingClientRect();
        mouseX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        mouseY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }
      if (!dragging) return;
      const s = scale.get();
      const nx = stx + (e.clientX - sx);
      const ny = sty + (e.clientY - sy);
      const clamped = clampPan(nx, ny, s);
      tx.set(clamped.x);
      ty.set(clamped.y);
    };
    const onUp = () => {
      dragging = false;
      outer.style.cursor = "grab";
    };

    outer.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      outer.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [tx, ty, scale, mouseX, mouseY, viewport.w, clampPan]);

  // Wheel zoom
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = scale.get();
      const factor = Math.exp(-e.deltaY * 0.0015);
      const newS = Math.max(0.45, Math.min(1.6, s * factor));
      const r = outer.getBoundingClientRect();
      const screenX = e.clientX - r.left;
      const screenY = e.clientY - r.top;
      const worldX = (screenX - tx.get()) / s;
      const worldY = (screenY - ty.get()) / s;
      const nx = screenX - worldX * newS;
      const ny = screenY - worldY * newS;
      const cl = clampPan(nx, ny, newS);
      scale.set(newS);
      tx.set(cl.x);
      ty.set(cl.y);
    };
    outer.addEventListener("wheel", onWheel, { passive: false });
    return () => outer.removeEventListener("wheel", onWheel);
  }, [scale, tx, ty, clampPan]);

  // Touch: one-finger pan, two-finger pinch
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    let panStart: { x: number; y: number; tx: number; ty: number } | null = null;
    let pinchStart: {
      d: number;
      s: number;
      cx: number;
      cy: number;
      tx: number;
      ty: number;
    } | null = null;

    const dist = (t: TouchList) => {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return Math.hypot(dx, dy);
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        panStart = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          tx: tx.get(),
          ty: ty.get(),
        };
      } else if (e.touches.length === 2) {
        panStart = null;
        pinchStart = {
          d: dist(e.touches),
          s: scale.get(),
          cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          tx: tx.get(),
          ty: ty.get(),
        };
      }
    };
    const onMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && panStart) {
        e.preventDefault();
        const s = scale.get();
        const nx = panStart.tx + (e.touches[0].clientX - panStart.x);
        const ny = panStart.ty + (e.touches[0].clientY - panStart.y);
        const cl = clampPan(nx, ny, s);
        tx.set(cl.x);
        ty.set(cl.y);
      } else if (e.touches.length === 2 && pinchStart) {
        e.preventDefault();
        const d = dist(e.touches);
        const s = Math.max(
          0.45,
          Math.min(1.6, pinchStart.s * (d / pinchStart.d))
        );
        const r = outer.getBoundingClientRect();
        const screenX = pinchStart.cx - r.left;
        const screenY = pinchStart.cy - r.top;
        const worldX = (screenX - pinchStart.tx) / pinchStart.s;
        const worldY = (screenY - pinchStart.ty) / pinchStart.s;
        const nx = screenX - worldX * s;
        const ny = screenY - worldY * s;
        const cl = clampPan(nx, ny, s);
        scale.set(s);
        tx.set(cl.x);
        ty.set(cl.y);
      }
    };
    const onEnd = () => {
      panStart = null;
      pinchStart = null;
    };

    outer.addEventListener("touchstart", onStart);
    outer.addEventListener("touchmove", onMove, { passive: false });
    outer.addEventListener("touchend", onEnd);
    outer.addEventListener("touchcancel", onEnd);
    return () => {
      outer.removeEventListener("touchstart", onStart);
      outer.removeEventListener("touchmove", onMove);
      outer.removeEventListener("touchend", onEnd);
      outer.removeEventListener("touchcancel", onEnd);
    };
  }, [scale, tx, ty, clampPan]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.tagName === "INPUT" ||
        (e.target as HTMLElement)?.tagName === "TEXTAREA"
      )
        return;
      const step = 100;
      const s = scale.get();
      let nx = tx.get();
      let ny = ty.get();
      if (e.key === "ArrowLeft") nx += step;
      else if (e.key === "ArrowRight") nx -= step;
      else if (e.key === "ArrowUp") ny += step;
      else if (e.key === "ArrowDown") ny -= step;
      else return;
      const cl = clampPan(nx, ny, s);
      animate(tx, cl.x, { duration: 0.25, ease: "easeOut" });
      animate(ty, cl.y, { duration: 0.25, ease: "easeOut" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tx, ty, scale, clampPan]);

  const zoomToZone = useCallback(
    (id: ZoneId, targetScale = 1) => {
      if (viewport.w === 0) return;
      const z = getZone(id);
      const c = zoneCenter(z);
      const targetTx = viewport.w / 2 - c.x * targetScale;
      const targetTy = viewport.h / 2 - c.y * targetScale;
      const dur = reduceMotion ? 0 : 1.0;
      const ease: [number, number, number, number] = [0.22, 0.8, 0.26, 1];
      animate(tx, targetTx, { duration: dur, ease });
      animate(ty, targetTy, { duration: dur, ease });
      animate(scale, targetScale, { duration: dur, ease });
      setActive(id);
    },
    [tx, ty, scale, viewport.w, viewport.h, reduceMotion]
  );

  const reset = useCallback(() => {
    zoomToZone("entry", 1);
  }, [zoomToZone]);

  const transform = useTransform(
    [tx, ty, scale],
    ([x, y, s]: number[]) => `translate3d(${x}px, ${y}px, 0) scale(${s})`
  );

  const ctxValue: CanvasCtx = {
    tx,
    ty,
    scale,
    mouseX,
    mouseY,
    viewport,
    hovered,
    setHovered,
    active,
    setActive,
    zoomToZone,
    reset,
    reduceMotion,
  };

  return (
    <Ctx.Provider value={ctxValue}>
      <div
        ref={outerRef}
        className="fixed inset-0 overflow-hidden canvas-grab select-none hidden md:block"
        style={{ touchAction: "none" }}
      >
        {/* Opening reveal wash */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={ready ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.3 }}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(30,42,46,0) 0%, rgba(30,42,46,0.9) 55%, rgba(22,32,31,1) 100%)",
            zIndex: 30,
          }}
        />
        <motion.div
          className="absolute top-0 left-0"
          style={{
            width: WORLD.width,
            height: WORLD.height,
            transform,
            transformOrigin: "0 0",
            willChange: "transform",
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          {children}
        </motion.div>
        {overlay}
      </div>
    </Ctx.Provider>
  );
}
