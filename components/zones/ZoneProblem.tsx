"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ZoneShell } from "../ZoneShell";

const TOOLS = [
  { id: "notion",    name: "Notion",    crit: "хорош для базы данных — но плохо держит аргумент" },
  { id: "obsidian",  name: "Obsidian",  crit: "хорош для заметок — но плоскую сеть ссылок трудно читать как книгу" },
  { id: "scrivener", name: "Scrivener", crit: "хорош для структуры — но источники живут отдельно" },
  { id: "zotero",    name: "Zotero",    crit: "хорош для цитат — но не знает, в какой абзац какая цитата должна войти" },
];

export default function ZoneProblem() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <ZoneShell id="problem" marker="02 / проблема">
      <h2 className="font-serif text-[30px] leading-[1.08] tracking-[-0.012em] text-cream">
        Чем длиннее книга, тем больше вы забываете,{" "}
        <span className="italic text-anchor">что уже решили.</span>
      </h2>

      {/* Desk snapshot — overhead illustration of a writer's workspace chaos */}
      <div className="mt-7 relative" data-no-pan>
        <motion.div
          className="relative w-full aspect-[16/9] border border-[rgba(168,200,160,0.14)] overflow-hidden bg-base-deep"
          initial={false}
          animate={
            activeTool
              ? { scale: 1.015, borderColor: "rgba(168,200,160,0.3)" }
              : { scale: 1, borderColor: "rgba(168,200,160,0.14)" }
          }
          transition={{ duration: 0.5, ease: [0.22, 0.8, 0.26, 1] }}
        >
          <Image
            src="/images/desk-problem.webp"
            alt="Рабочий стол автора на 14-й месяц — пять наложенных окон приложений, рукописная тетрадь, кофе"
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="object-cover"
            style={{
              filter: "brightness(0.82) saturate(0.85) contrast(1.05)",
            }}
          />
          {/* Palette-lock gradient — gently pulls the raster illustration
              into the site's teal/cream range when hovered. */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
            animate={{
              opacity: activeTool ? 0.7 : 0.45,
              backgroundColor: activeTool
                ? activeTool === "notion"
                  ? "#f0e6d2"
                  : activeTool === "obsidian"
                  ? "#d4a5a5"
                  : activeTool === "scrivener"
                  ? "#a8c8a0"
                  : "#6a7a88"
                : "#1e2a2e",
            }}
            transition={{ duration: 0.45 }}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-base-deep/70 via-transparent to-base-deep/30" />
        </motion.div>

        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-steel-dim">
          рабочий стол автора — 14-й месяц
        </div>
      </div>

      {/* Tool critique list */}
      <ul className="mt-10 space-y-3">
        {TOOLS.map((t) => {
          const active = activeTool === t.id;
          return (
            <li
              key={t.id}
              data-no-pan
              onMouseEnter={() => setActiveTool(t.id)}
              onMouseLeave={() => setActiveTool(null)}
              className="flex items-baseline gap-3 cursor-default transition-colors"
            >
              <motion.span
                animate={{
                  color: active ? "#a8c8a0" : "#f0e6d2",
                  borderColor: active ? "#a8c8a0" : "rgba(168,200,160,0.18)",
                }}
                className="font-serif text-[15px] tracking-tight px-2 py-0.5 border inline-block min-w-[88px] text-center"
              >
                {t.name}
              </motion.span>
              <span className="font-sans text-[14px] leading-[1.5] text-cream-dim flex-1">
                {t.crit}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 font-serif text-[18px] leading-[1.35] text-cream">
        Четыре инструмента.{" "}
        <span className="italic text-anchor">Одна забывчивость.</span>
      </p>

      {/* Maria quote block */}
      <blockquote className="mt-8 pl-5 border-l-2 border-anchor-muted">
        <p className="font-serif italic text-[16px] leading-[1.55] text-cream">
          «Я открыла черновик третьей главы после двух недель отпуска и не
          помнила, почему этот источник должен идти после этого абзаца. Потратила
          три дня, восстанавливая собственную логику.»
        </p>
        <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
          — Мария Л., журналистка · биография в работе
        </footer>
      </blockquote>

      <p className="mt-7 font-sans text-[14px] leading-[1.55] text-cream-dim">
        Поле создано для этого конкретного момента. Не для «capture thoughts», не
        для «second brain» — для{" "}
        <span className="text-cream">не забыть, что уже придумано</span>.
      </p>
    </ZoneShell>
  );
}
