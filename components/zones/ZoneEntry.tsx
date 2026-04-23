"use client";

import { motion } from "framer-motion";
import { ZoneShell } from "../ZoneShell";
import { useCanvas } from "../Canvas";

export default function ZoneEntry() {
  const { zoomToZone, reduceMotion } = useCanvas();
  return (
    <ZoneShell id="entry" marker="01 / вход">
      <div className="flex flex-col h-full gap-6">
        <div>
          <div className="font-serif text-[26px] tracking-tight text-cream-dim">
            Поле
          </div>
          <div className="hairline mt-3" />
        </div>

        <h1 className="font-serif text-[42px] leading-[1.05] tracking-[-0.015em] text-cream">
          Инструмент для книги{" "}
          <span className="relative inline-block">
            <span
              className="italic text-growth"
              style={{ letterSpacing: "-0.02em" }}
            >
              длиной в год.
            </span>
            {/* One-shot hairline underline that draws left→right on first
                paint, reinforcing the italic payoff of the hero. */}
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[1.5px] bg-growth origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: reduceMotion ? 0 : 1 }}
              transition={{
                duration: 0.9,
                delay: 1.6,
                ease: [0.22, 0.8, 0.26, 1],
              }}
              style={{ width: "100%" }}
            />
          </span>
        </h1>

        <p className="font-sans text-[15px] leading-[1.55] text-cream-dim max-w-[30ch]">
          Пространство для длинного нон-фикшн. Источники, аргумент,
          черновики глав и связи между ними — в одном холсте, который
          не распадётся за&nbsp;14&nbsp;месяцев работы.
        </p>

        <div className="mt-auto space-y-3">
          <motion.button
            data-no-pan
            onClick={() => zoomToZone("problem", 1)}
            whileHover={{ x: 4 }}
            className="group flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.2em] text-anchor"
          >
            <span className="transition-all group-hover:tracking-[0.26em]">
              → налево: проблема
            </span>
          </motion.button>
          <div className="font-mono text-[11px] text-steel leading-relaxed">
            драгом — куда угодно.<br />
            колёсиком — масштаб.
          </div>
          <button
            data-no-pan
            onClick={() => zoomToZone("test", 1)}
            className="group block font-mono text-[10.5px] uppercase tracking-[0.18em] text-steel hover:text-cream-dim transition-colors text-left"
            aria-label="Перейти к зоне «Кейс Марии» справа-сверху"
          >
            или прочитайте историю Марии —{" "}
            <span className="text-steel-dim group-hover:text-growth">справа наверху</span>
          </button>
        </div>
      </div>
    </ZoneShell>
  );
}
