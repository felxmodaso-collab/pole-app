"use client";

import { motion, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useCanvas } from "./Canvas";
import { getZone } from "@/lib/zones";

export default function Hud() {
  const { scale, reset, active, hovered } = useCanvas();
  const [idleHintVisible, setIdleHintVisible] = useState(false);

  // Show "драг" hint if no input for 15s (spec §5 Zone 1)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const reset = () => {
      setIdleHintVisible(false);
      clearTimeout(t);
      t = setTimeout(() => setIdleHintVisible(true), 15000);
    };
    reset();
    const events = [
      "mousemove",
      "mousedown",
      "click",
      "wheel",
      "keydown",
      "touchstart",
    ];
    events.forEach((ev) => window.addEventListener(ev, reset));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, reset));
      clearTimeout(t);
    };
  }, []);

  const zoomPct = useTransform(scale, (v) => `${Math.round(v * 100)}%`);
  const activeLabel = active ? getZone(active).label : null;
  const hoveredLabel = hovered ? getZone(hovered).label : null;

  return (
    <>
      {/* Top-left brand */}
      <motion.div
        data-no-pan
        className="absolute top-6 left-6 flex items-baseline gap-3 select-none"
        style={{ zIndex: 20 }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <button
          onClick={reset}
          className="font-serif text-[22px] tracking-tight text-cream hover:text-growth transition-colors"
          aria-label="В начало"
        >
          Поле
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel">
          v 0.1 · spec
        </span>
      </motion.div>

      {/* Top-right controls hint */}
      <motion.div
        data-no-pan
        className="absolute top-6 right-6 select-none text-right"
        style={{ zIndex: 20 }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel leading-relaxed">
          <div>drag · pan</div>
          <div>wheel · zoom</div>
          <div>
            <kbd
              lang="en"
              className="px-1.5 py-0.5 border border-[rgba(168,200,160,0.2)] text-cream-dim rounded-sm font-mono"
            >
              ⌘ K
            </kbd>{" "}
            · поиск
          </div>
        </div>
      </motion.div>

      {/* Bottom-left: zoom + active zone */}
      <motion.div
        data-no-pan
        className="absolute bottom-6 left-6 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-steel"
        style={{ zIndex: 20 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-growth" />
          <motion.span className="numset text-cream-dim">{zoomPct}</motion.span>
        </span>
        {activeLabel && (
          <span className="text-cream-dim">
            в фокусе: <span className="text-cream">{activeLabel}</span>
          </span>
        )}
        {!activeLabel && hoveredLabel && (
          <span className="text-steel">
            соседняя: <span className="text-cream-dim">{hoveredLabel}</span>
          </span>
        )}
      </motion.div>

      {/* Idle hint above cursor — center bottom */}
      {idleHintVisible && (
        <motion.div
          data-no-pan
          className="absolute left-1/2 bottom-[18%] -translate-x-1/2 pointer-events-none font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 bg-[rgba(22,32,31,0.7)] border border-[rgba(168,200,160,0.18)] rounded-sm">
            драг — куда угодно
          </span>
        </motion.div>
      )}
    </>
  );
}
