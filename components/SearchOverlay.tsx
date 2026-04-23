"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCanvas } from "./Canvas";
import { ZONES } from "@/lib/zones";

const COMMANDS = [
  ...ZONES.map((z) => ({
    id: z.id,
    label: z.label,
    short: z.shortLabel,
    kind: "zone" as const,
    key: `zone:${z.id}`,
  })),
  {
    id: "__reset",
    label: "К входу",
    short: "Reset",
    kind: "action" as const,
    key: "action:reset",
  },
];

export default function SearchOverlay() {
  const { zoomToZone, reset } = useCanvas();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "/" && !open) {
        const t = e.target as HTMLElement;
        if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") {
          e.preventDefault();
          setOpen(true);
        }
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(s) ||
        c.short.toLowerCase().includes(s)
    );
  }, [q]);

  const go = (i: number) => {
    const item = filtered[i];
    if (!item) return;
    if (item.kind === "action") reset();
    else zoomToZone(item.id as any, 1);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-no-pan
          className="fixed inset-0 z-40 flex items-start justify-center pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{ background: "rgba(22, 32, 31, 0.55)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-[min(540px,92vw)] zone-card p-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(168,200,160,0.12)]">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-steel">
                перейти к
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIdx((i) => Math.min(filtered.length - 1, i + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIdx((i) => Math.max(0, i - 1));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    go(idx);
                  }
                }}
                placeholder="зона, тема…"
                className="flex-1 bg-transparent outline-none text-cream placeholder:text-steel font-serif text-[18px]"
              />
              <span className="font-mono text-[10px] text-steel-dim">esc</span>
            </div>
            <ul className="py-1 max-h-[48vh] overflow-auto">
              {filtered.map((c, i) => (
                <li key={c.key}>
                  <button
                    onClick={() => go(i)}
                    onMouseEnter={() => setIdx(i)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                      i === idx
                        ? "bg-[rgba(168,200,160,0.08)] text-cream"
                        : "text-cream-dim hover:bg-[rgba(168,200,160,0.04)]"
                    }`}
                  >
                    <span className="font-serif text-[16px]">{c.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
                      {c.kind === "zone" ? c.short : "action"}
                    </span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center font-mono text-xs text-steel">
                  ничего не найдено
                </li>
              )}
            </ul>
            <div className="px-4 py-2 border-t border-[rgba(168,200,160,0.08)] flex items-center justify-between font-mono text-[10px] text-steel-dim">
              <span>↑ ↓ · enter — перейти</span>
              <span>⌘K / ctrl-K — открыть</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
