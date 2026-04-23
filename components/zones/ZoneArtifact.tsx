"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ZoneShell } from "../ZoneShell";

type Demo = null | "card" | "zone" | "link";

/**
 * Illustrated macro of the Пole UI. Three clickable elements:
 * - card «Диссидент Н., 1974» → side panel with 3 sources + chapter refs
 * - zone «Глава 5 — Процесс»  → inline editor with 3 paragraphs
 * - linked line                → floating annotation explaining the link
 */
export default function ZoneArtifact() {
  const [demo, setDemo] = useState<Demo>(null);

  // Reset after 8s of no interaction
  useEffect(() => {
    if (!demo) return;
    const t = setTimeout(() => setDemo(null), 8000);
    return () => clearTimeout(t);
  }, [demo]);

  return (
    <ZoneShell id="artifact" marker="03 / артефакт">
      <h2 className="font-serif text-[32px] leading-[1.08] tracking-[-0.012em] text-cream">
        Так выглядит <span className="italic text-growth">ваша книга</span> в Поле.
      </h2>
      <p className="mt-4 font-sans text-[14.5px] leading-[1.55] text-cream-dim max-w-[60ch]">
        Всё живёт в одном холсте. Карточка — идея. Зона — глава черновика. Линия —
        источник, который в эту главу войдёт. Zoom out — видна вся книга. Zoom in
        на зону — пишете одну сцену. Без переключения приложений.
      </p>

      {/* Illustrated UI macro */}
      <div
        data-no-pan
        className="mt-7 relative w-full border border-[rgba(168,200,160,0.14)] bg-[rgba(22,32,31,0.65)]"
        style={{ aspectRatio: "800 / 420" }}
      >
        {/* app chrome */}
        <div className="absolute top-0 left-0 right-0 h-6 flex items-center gap-2 px-3 border-b border-[rgba(168,200,160,0.1)]">
          <span className="w-2 h-2 rounded-full bg-anchor-muted" />
          <span className="w-2 h-2 rounded-full bg-growth-muted" />
          <span className="w-2 h-2 rounded-full bg-cream-dim opacity-50" />
          <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.22em] text-steel">
            pole · биография диссидента · 14 мес
          </span>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-steel-dim">
            book view ↗
          </span>
        </div>

        {/* canvas area */}
        <div className="absolute inset-0 top-6">
          <svg viewBox="0 0 800 394" className="w-full h-full" preserveAspectRatio="none">
            {/* background grid */}
            <defs>
              <pattern id="art-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168,200,160,0.05)" strokeWidth="0.5" />
              </pattern>
              <filter id="art-glow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="800" height="394" fill="url(#art-grid)" />

            {/* Radial glow for the highlighted chapter — so "focused right now"
                actually reads. */}
            <defs>
              <radialGradient id="art-chap-glow" cx="0.5" cy="0.5" r="0.6">
                <stop offset="0" stopColor="rgba(168,200,160,0.22)" />
                <stop offset="0.6" stopColor="rgba(168,200,160,0.06)" />
                <stop offset="1" stopColor="rgba(168,200,160,0)" />
              </radialGradient>
            </defs>

            {/* Chapter zones — wide rounded rects, hand-laid micro-rotations */}
            <g>
              {[
                { x: 40,  y: 80,  w: 160, h: 120, label: "Гл. 2 — Арест",    rot: -0.6 },
                { x: 60,  y: 230, w: 180, h: 130, label: "Гл. 5 — Процесс",  rot:  0.4, highlight: true },
                { x: 300, y: 50,  w: 190, h: 110, label: "Гл. 8 — Лагерь",   rot:  0.8 },
                { x: 530, y: 150, w: 180, h: 130, label: "Гл. 11 — Запад",   rot: -0.5 },
              ].map((z, i) => {
                const isHighlight = z.highlight;
                const clickable = z.label.startsWith("Гл. 5");
                const cxZ = z.x + z.w / 2;
                const cyZ = z.y + z.h / 2;
                const dashArr = [
                  "3 3",
                  "4 2",
                  "2 3",
                  "5 4",
                ][i];
                return (
                  <g
                    key={i}
                    style={{ cursor: clickable ? "pointer" : "default" }}
                    onClick={clickable ? () => setDemo("zone") : undefined}
                    transform={`rotate(${z.rot} ${cxZ} ${cyZ})`}
                  >
                    {isHighlight && (
                      <rect
                        x={z.x - 20}
                        y={z.y - 20}
                        width={z.w + 40}
                        height={z.h + 40}
                        fill="url(#art-chap-glow)"
                      />
                    )}
                    <rect
                      x={z.x}
                      y={z.y}
                      width={z.w}
                      height={z.h}
                      fill={
                        isHighlight
                          ? "rgba(168,200,160,0.10)"
                          : "rgba(240,230,210,0.02)"
                      }
                      stroke={
                        isHighlight
                          ? "rgba(168,200,160,0.55)"
                          : "rgba(168,200,160,0.2)"
                      }
                      strokeWidth={isHighlight ? "1.4" : "1"}
                      strokeDasharray={isHighlight ? undefined : dashArr}
                    />
                    <text
                      x={z.x + 10}
                      y={z.y + 18}
                      fill={
                        isHighlight
                          ? "rgba(240,230,210,0.92)"
                          : "rgba(240,230,210,0.6)"
                      }
                      fontSize="10"
                      fontFamily="monospace"
                      letterSpacing="0.08em"
                    >
                      {z.label.toUpperCase()}
                    </text>
                    {[0, 1, 2, 3].map((j) => (
                      <line
                        key={j}
                        x1={z.x + 10}
                        y1={z.y + 34 + j * 12}
                        x2={z.x + z.w - 14 - (j === 3 ? 40 : 0)}
                        y2={z.y + 34 + j * 12}
                        stroke={
                          isHighlight
                            ? "rgba(240,230,210,0.32)"
                            : "rgba(240,230,210,0.14)"
                        }
                        strokeWidth="0.8"
                      />
                    ))}
                  </g>
                );
              })}
            </g>

            {/* Concept cards */}
            {(() => {
              const cards = [
                { x: 230, y: 190, label: "Диссидент Н., 1974", pinned: true },
                { x: 360, y: 240, label: "Круг — 7 писем" },
                { x: 450, y: 300, label: "Статья в «Правде»" },
                { x: 560, y: 90,  label: "Амнистия 1982" },
                { x: 150, y: 40,  label: "Детство" },
                { x: 710, y: 60,  label: "Свидетели" },
                { x: 380, y: 170, label: "Процесс — стенограмма" },
                { x: 630, y: 320, label: "Мюнхен, 1984" },
              ];
              return cards.map((c, i) => {
                const isPinned = c.pinned;
                const clickable = isPinned;
                return (
                  <g
                    key={i}
                    style={{ cursor: clickable ? "pointer" : "default" }}
                    onClick={clickable ? () => setDemo("card") : undefined}
                  >
                    {/* Ambient pulse ring around the pinned card — one-off
                        teaches the user where to click. Stops once any demo
                        has been opened. */}
                    {isPinned && !demo && (
                      <motion.circle
                        cx={c.x + 53}
                        cy={c.y + 16}
                        r={24}
                        fill="none"
                        stroke="rgba(212,165,165,0.65)"
                        strokeWidth="1"
                        initial={{ opacity: 0, r: 10 }}
                        animate={{ opacity: [0, 0.9, 0], r: [18, 52, 52] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          repeatDelay: 2.4,
                          ease: "easeOut",
                        }}
                      />
                    )}
                    <rect
                      x={c.x}
                      y={c.y}
                      width="106"
                      height="32"
                      fill={isPinned ? "rgba(212,165,165,0.1)" : "rgba(22,32,31,0.8)"}
                      stroke={isPinned ? "rgba(212,165,165,0.6)" : "rgba(168,200,160,0.32)"}
                      strokeWidth="1"
                      rx="1"
                    />
                    <circle cx={c.x + 8} cy={c.y + 16} r="2.5" fill={isPinned ? "rgb(212,165,165)" : "rgba(168,200,160,0.55)"} />
                    <text
                      x={c.x + 15}
                      y={c.y + 19}
                      fill="rgba(240,230,210,0.9)"
                      fontSize="9"
                      fontFamily="serif"
                    >
                      {c.label}
                    </text>
                  </g>
                );
              });
            })()}

            {/* Connection lines — card «Диссидент Н., 1974» to chapters 2, 5, 11 */}
            <g filter="url(#art-glow)">
              {[
                { x1: 285, y1: 195, x2: 200, y2: 140, target: "Гл. 2" },
                { x1: 283, y1: 205, x2: 240, y2: 280, target: "Гл. 5", main: true },
                { x1: 336, y1: 200, x2: 620, y2: 215, target: "Гл. 11" },
              ].map((l, i) => (
                <path
                  key={i}
                  d={`M ${l.x1} ${l.y1} Q ${(l.x1 + l.x2) / 2} ${Math.min(l.y1, l.y2) - 30}, ${l.x2} ${l.y2}`}
                  stroke={l.main ? "rgba(212,165,165,0.85)" : "rgba(168,200,160,0.45)"}
                  strokeWidth={l.main ? "1.5" : "0.8"}
                  fill="none"
                  strokeDasharray={l.main ? undefined : "4 4"}
                  style={{ cursor: l.main ? "pointer" : "default" }}
                  onClick={l.main ? () => setDemo("link") : undefined}
                />
              ))}
            </g>

            {/* Minimap mock in corner */}
            <g transform="translate(700,330)">
              <rect width="90" height="56" fill="rgba(22,32,31,0.9)" stroke="rgba(168,200,160,0.25)" strokeWidth="0.6" />
              <rect x="12" y="8"  width="18" height="12" fill="rgba(168,200,160,0.1)" stroke="rgba(168,200,160,0.35)" strokeWidth="0.4" />
              <rect x="24" y="28" width="20" height="14" fill="rgba(212,165,165,0.15)" stroke="rgba(212,165,165,0.55)" strokeWidth="0.5" />
              <rect x="42" y="14" width="20" height="12" fill="rgba(168,200,160,0.1)" stroke="rgba(168,200,160,0.35)" strokeWidth="0.4" />
              <rect x="58" y="22" width="22" height="14" fill="rgba(168,200,160,0.1)" stroke="rgba(168,200,160,0.35)" strokeWidth="0.4" />
            </g>
          </svg>
        </div>

        {/* Demo panel — source list (clicked card) */}
        <AnimatePresence>
          {demo === "card" && (
            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 0.8, 0.26, 1] }}
              className="absolute top-6 right-0 bottom-0 w-[44%] bg-base-deep border-l border-[rgba(168,200,160,0.24)] p-4 overflow-hidden"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-anchor mb-3">
                источники · 3 / глава 3, 7, 11
              </div>
              <div className="font-serif text-[15px] text-cream mb-4">
                Диссидент Н., 1974
              </div>
              <ul className="space-y-3 text-cream-dim">
                <li className="flex items-start gap-2 font-sans text-[12px]">
                  <span className="mt-0.5 font-mono text-[9px] text-steel">PDF</span>
                  <span>«Процесс 1974» — скан Архива Самиздата, 38 с.</span>
                </li>
                <li className="flex items-start gap-2 font-sans text-[12px]">
                  <span className="mt-0.5 font-mono text-[9px] text-steel">TXT</span>
                  <span>Интервью с адвокатом защиты, 2018-11-04, 1ч 42 мин</span>
                </li>
                <li className="flex items-start gap-2 font-sans text-[12px]">
                  <span className="mt-0.5 font-mono text-[9px] text-steel">IMG</span>
                  <span>Фото рукописи письма — Мюнхен, 1984</span>
                </li>
              </ul>
              <div className="mt-5 pt-3 border-t border-[rgba(168,200,160,0.14)] font-mono text-[9.5px] uppercase tracking-[0.2em] text-steel">
                используется в · 3 · 7 · 11
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Demo panel — editor inside zone */}
        <AnimatePresence>
          {demo === "zone" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-[7%] bottom-[6%] w-[44%] bg-base-deep border border-anchor-muted/60 p-4"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-anchor mb-2">
                редактор · глава 5 · процесс
              </div>
              <div className="font-serif text-[13.5px] leading-[1.55] text-cream">
                <p>В зале суда Н. молчал почти до вечера. Первая реплика —</p>
                <p>через четыре часа после начала: «Я признаю факт, но не</p>
                <p>соглашаюсь с квалификацией.»<span className="inline-block w-[1px] h-4 bg-cream ml-0.5 animate-pulse" /></p>
              </div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-steel">
                <span className="inline-block w-1 h-1 rounded-full bg-anchor" />
                3 источника прикреплены
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo panel — link annotation */}
        <AnimatePresence>
          {demo === "link" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="absolute top-[40%] left-[32%] w-[34%] bg-base-deep border border-anchor-muted p-3 shadow-xl"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-anchor mb-1.5">
                почему связаны
              </div>
              <p className="font-serif text-[12.5px] leading-[1.5] text-cream">
                «Допрос длился 6 часов — эта деталь заходит во втором абзаце
                главы 5. Источник: PDF, с. 14.»
              </p>
              <div className="mt-2 font-mono text-[9px] text-steel">заметка автора · 2025-02-11</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint */}
        {!demo && (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-2 font-mono text-[10px] uppercase tracking-[0.22em] text-steel-dim"
          >
            ↓ кликните карточку, зону или линию
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-5 flex gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
        <span className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-anchor" /> карточка — идея
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-[2px] bg-growth/60" /> линия — связь
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-2 border border-growth" /> зона — глава
        </span>
      </div>
    </ZoneShell>
  );
}
