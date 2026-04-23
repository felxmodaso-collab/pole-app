"use client";

import { motion } from "framer-motion";
import { ZoneShell } from "../ZoneShell";
import { openWaitlist } from "@/lib/waitlist";

const PLANS = [
  {
    id: "personal",
    name: "Personal",
    price: "$12",
    period: "/ мес",
    alt: "или $120 / год",
    lines: [
      "Для одной книги",
      "Без ограничения на источники, зоны, карточки",
      "Full export: Markdown, DOCX, EPUB — в любое время",
    ],
  },
  {
    id: "academic",
    name: "Academic",
    price: "$60",
    period: "/ год",
    alt: "для студентов и независимых исследователей",
    lines: [
      "С подтверждением: .edu email или fellowship letter",
      "Всё то же, что Personal",
      "Годовой биллинг, без месячного",
    ],
  },
  {
    id: "trial",
    name: "Trial",
    price: "14",
    period: "дней",
    alt: "без карты",
    lines: [
      "Все функции, без ограничений",
      "Если не помогло — удаляете аккаунт",
      "Данные экспортируются автоматически",
    ],
  },
];

export default function ZonePricing() {
  return (
    <ZoneShell id="pricing" marker="06 / цены">
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="font-serif text-[28px] leading-[1.08] tracking-[-0.012em] text-cream">
          Сколько стоит.{" "}
          <span className="italic text-anchor">И почему столько.</span>
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel text-right max-w-[30ch]">
          нет бесплатного тира, который потом заберут<br />
          вы платите — ваши данные принадлежат вам
        </p>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-4" data-no-pan>
        {PLANS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={false}
            whileHover={{
              borderColor: "rgba(168, 200, 160, 0.5)",
              boxShadow: "0 0 0 4px rgba(168,200,160,0.06), 0 12px 40px -10px rgba(168,200,160,0.15)",
            }}
            transition={{ duration: 0.3 }}
            className="p-5 border border-[rgba(168,200,160,0.18)] bg-[rgba(22,32,31,0.65)] flex flex-col"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel mb-3">
              0{i + 1} · {p.id}
            </div>
            <div className="font-serif text-[20px] tracking-tight text-cream">
              {p.name}
            </div>
            <div className="mt-3 flex items-baseline gap-2 numset">
              <span className="font-serif text-[36px] tracking-tight text-cream leading-none">
                {p.price}
              </span>
              <span className="font-mono text-[10.5px] lowercase tracking-[0.12em] text-steel-dim">
                {p.period}
              </span>
            </div>
            <div className="font-mono text-[10px] text-steel mt-1.5">{p.alt}</div>
            <ul className="mt-5 space-y-2 font-sans text-[12.5px] leading-[1.5] text-cream-dim">
              {p.lines.map((l, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-growth-muted flex-shrink-0" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4" data-no-pan>
        <motion.button
          onClick={() => openWaitlist("pricing:desktop")}
          whileHover={{
            x: 4,
            // Hover DEEPENS, not lightens — lighter reads as disabled.
            backgroundColor: "rgb(196, 140, 140)",
            boxShadow:
              "inset 0 1px 0 rgba(240,230,210,0.28), 0 8px 24px -6px rgba(212,165,165,0.28)",
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            backgroundColor: "rgb(200, 148, 148)",
            boxShadow: "inset 0 1px 0 rgba(240,230,210,0.18)",
          }}
          className="group inline-flex items-center gap-2 px-6 py-3 text-base-deep font-mono text-[12px] uppercase tracking-[0.22em]"
        >
          <span>→ Начать 14 дней</span>
          <motion.span
            aria-hidden
            className="inline-block w-[2px] h-[14px] bg-base-deep ml-0.5"
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              duration: 1.05,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.5, 1],
            }}
          />
        </motion.button>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
          никаких апселлов, никаких надстроенных тарифов — это всё Поле.
        </span>
      </div>
    </ZoneShell>
  );
}
