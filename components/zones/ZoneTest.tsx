"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ZoneShell } from "../ZoneShell";

// Heroic stats (the point of the case) are typeset larger than secondary ones.
const STATS = [
  { k: "14",     label: "месяцев",         hero: false },
  { k: "380",    label: "источников",      hero: true  },
  { k: "92 000", label: "слов",            hero: true  },
  { k: "31",     label: "вопрос редактора", hero: false },
  { k: "2",      label: "мин на ответ",     hero: false },
];

// Kept for reference — live site uses the NanoBanana portrait below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PortraitIllustrationFallback() {
  // Stylised side-profile, desk-reading posture.
  return (
    <svg viewBox="0 0 180 230" className="w-full h-full">
      <defs>
        <linearGradient id="p-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(36,50,53,0.9)" />
          <stop offset="1" stopColor="rgba(22,32,31,1)" />
        </linearGradient>
        <linearGradient id="p-skin" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(240,230,210,0.35)" />
          <stop offset="1" stopColor="rgba(212,165,165,0.25)" />
        </linearGradient>
      </defs>
      <rect width="180" height="230" fill="url(#p-bg)" />
      {/* Window outline hint */}
      <rect x="18" y="18" width="56" height="62" fill="none" stroke="rgba(168,200,160,0.14)" strokeWidth="0.5" strokeDasharray="2 3" />
      <line x1="46" y1="18" x2="46" y2="80" stroke="rgba(168,200,160,0.12)" strokeWidth="0.5" strokeDasharray="2 3" />
      {/* Desk lamp glow */}
      <circle cx="145" cy="55" r="40" fill="rgba(240,230,210,0.05)" />
      <circle cx="145" cy="55" r="22" fill="rgba(240,230,210,0.07)" />
      {/* Hair bun */}
      <path d="M 78 62 Q 92 48, 112 58 Q 120 70, 110 82 Q 92 78, 78 76 Z" fill="rgba(106,122,136,0.55)" />
      {/* Head in profile */}
      <path
        d="M 76 76 Q 76 62, 94 58 Q 116 58, 118 82 Q 120 104, 108 110 Q 100 115, 96 110 Q 92 118, 86 120 Q 80 120, 78 108 Q 74 98, 76 76 Z"
        fill="url(#p-skin)"
        stroke="rgba(168,200,160,0.35)"
        strokeWidth="0.6"
      />
      {/* Eye hint */}
      <circle cx="112" cy="84" r="1.3" fill="rgba(22,32,31,0.9)" />
      {/* Neck */}
      <path d="M 86 118 Q 86 132, 94 138 L 108 138 Q 108 126, 106 118 Z" fill="url(#p-skin)" stroke="rgba(168,200,160,0.3)" strokeWidth="0.5" />
      {/* Shoulders + sweater */}
      <path
        d="M 42 162 Q 60 142, 90 140 Q 120 138, 144 156 Q 156 172, 160 210 L 28 212 Q 30 180, 42 162 Z"
        fill="rgba(106,122,136,0.5)"
        stroke="rgba(168,200,160,0.25)"
        strokeWidth="0.5"
      />
      {/* Desk surface */}
      <path d="M 0 210 L 180 212 L 180 230 L 0 230 Z" fill="rgba(36,50,53,0.9)" />
      {/* Coffee cup */}
      <g>
        <rect x="34" y="192" width="14" height="18" rx="1" fill="rgba(240,230,210,0.18)" stroke="rgba(168,200,160,0.25)" strokeWidth="0.4" />
        <ellipse cx="41" cy="193" rx="7" ry="1.4" fill="rgba(22,32,31,0.85)" />
      </g>
      {/* Open notebook */}
      <g>
        <path d="M 78 198 L 154 200 L 152 216 L 76 214 Z" fill="rgba(240,230,210,0.08)" stroke="rgba(240,230,210,0.2)" strokeWidth="0.4" />
        <line x1="114" y1="199" x2="114" y2="215" stroke="rgba(240,230,210,0.2)" strokeWidth="0.35" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="82" y1={203 + i * 3.6} x2={110} y2={203 + i * 3.6} stroke="rgba(240,230,210,0.22)" strokeWidth="0.3" />
        ))}
        {[0, 1, 2].map((i) => (
          <line key={`r${i}`} x1="118" y1={203 + i * 3.6} x2={146 - i * 4} y2={203 + i * 3.6} stroke="rgba(240,230,210,0.22)" strokeWidth="0.3" />
        ))}
      </g>
      {/* Warm hair highlight */}
      <path d="M 78 62 Q 90 50, 108 58" fill="none" stroke="rgba(212,165,165,0.5)" strokeWidth="0.8" />
    </svg>
  );
}

export default function ZoneTest() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ZoneShell id="test" marker="05 / кейс">
      <div className="grid grid-cols-[180px_1fr] gap-7 h-full">
        <div className="relative w-[180px] h-[230px] border border-[rgba(168,200,160,0.18)] overflow-hidden bg-base-deep">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/portrait-maria.webp`}
            alt="Стилизованный портрет Марии — репрезентативное изображение, не фото реального человека"
            fill
            sizes="180px"
            className="object-cover"
            style={{
              filter: "brightness(0.82) saturate(0.85) contrast(1.03)",
            }}
            priority={false}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-multiply"
            style={{
              background:
                "linear-gradient(180deg, rgba(30,42,46,0.22) 0%, rgba(30,42,46,0.15) 55%, rgba(22,32,31,0.7) 100%)",
            }}
          />
          <div className="absolute bottom-1.5 left-2 font-mono text-[8.5px] uppercase tracking-[0.22em] text-cream-dim opacity-80">
            репрезентация · не фото
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="font-serif text-[24px] leading-[1.15] tracking-[-0.012em] text-cream">
            Случай: биография,{" "}
            <span className="italic text-growth">14 месяцев, 380 источников, 92 000 слов.</span>
          </h2>

          <div
            className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-3 font-mono uppercase tracking-[0.18em] numset"
            data-no-pan
          >
            {STATS.map((s, i) => (
              <motion.span
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                animate={
                  hovered === i
                    ? { scale: 1.06, color: "#f0e6d2" }
                    : { scale: 1, color: "#8897a2" }
                }
                transition={{ duration: 0.22 }}
                className="inline-flex items-baseline gap-2 cursor-default"
                style={{
                  filter:
                    hovered === i
                      ? "drop-shadow(0 0 8px rgba(212,165,165,0.55))"
                      : "none",
                }}
              >
                <span
                  className={`font-serif text-cream ${
                    s.hero ? "text-[30px] leading-none" : "text-[17px]"
                  }`}
                >
                  {s.k}
                </span>
                <span className={s.hero ? "text-[10.5px]" : "text-[11px]"}>
                  {s.label}
                </span>
              </motion.span>
            ))}
          </div>

          <p className="mt-5 font-sans text-[13.5px] leading-[1.6] text-cream-dim">
            Мария Лукьянова писала биографию диссидента 1970-х. 380 источников:
            транскрипты КГБ, письма родственников, архивные публикации, 40 интервью
            с выжившими современниками.
          </p>

          <p className="mt-3 font-sans text-[13.5px] leading-[1.6] text-cream-dim">
            <span className="text-steel">До Поле:</span>{" "}
            Notion + Scrivener + Zotero + папка PDF. После 8 месяцев — путаница.{" "}
            <br />
            <span className="text-growth">С Поле:</span> один холст, 7 концептов, 12 зон-глав,
            380 источников прикреплены к карточкам — в среднем 4 источника на концепт.
          </p>

          <p className="mt-3 font-sans text-[13.5px] leading-[1.6] text-cream-dim">
            Редактор задал 31 вопрос во время прочтения черновика. Мария ответила на
            каждый ссылкой на источник{" "}
            <span className="text-cream">за 2 минуты</span>.
          </p>

          <blockquote className="mt-5 pt-4 border-t border-[rgba(168,200,160,0.14)]">
            <p className="font-serif italic text-[17px] leading-[1.35] text-cream">
              «Я первый раз писала книгу, не теряя её.»
            </p>
            <footer className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-steel">
              — Мария Л., 2025
            </footer>
          </blockquote>
        </div>
      </div>
    </ZoneShell>
  );
}
