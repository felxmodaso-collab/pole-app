"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ZoneShell } from "../ZoneShell";

/** Illustrations: NanoBanana-generated, palette-locked to the site scheme.
 *  Falls back to an inline SVG if the raster asset is missing (404) so the
 *  site never shows a broken image during iterative asset generation. */
function RasterIllustration({
  src,
  alt,
  fallback,
  aspectRatio = "16/9",
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
  aspectRatio?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="relative w-full overflow-hidden border border-[rgba(168,200,160,0.08)] bg-base-deep"
        style={{ aspectRatio }}
      >
        {fallback}
      </div>
    );
  }
  return (
    <div
      className="relative w-full overflow-hidden bg-base-deep border border-[rgba(168,200,160,0.1)]"
      style={{ aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 300px"
        className="object-cover"
        style={{
          filter:
            "brightness(0.72) saturate(0.7) contrast(1.05) hue-rotate(-8deg)",
        }}
        onError={() => setFailed(true)}
      />
      {/* Palette-lock: tint the raster toward the teal base scheme. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,42,46,0.35) 0%, rgba(30,42,46,0.18) 50%, rgba(30,42,46,0.55) 100%)",
        }}
      />
      {/* Edge fade — lets the illustration dissolve into the zone card. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(22,32,31,0.65) 100%)",
        }}
      />
    </div>
  );
}

// Legacy inline fallback — retained so the zone renders if a raster asset is
// missing. Live site prefers RasterIllustration.
function BookViewIllustrationFallback() {
  return (
    <svg viewBox="0 0 220 80" className="w-full h-[80px]">
      {/* Left: canvas miniature */}
      <g>
        <rect x="6"  y="12" width="80" height="58" fill="rgba(22,32,31,0.6)" stroke="rgba(168,200,160,0.22)" strokeWidth="0.5" />
        {[
          { x: 12, y: 18, w: 20, h: 14 },
          { x: 36, y: 20, w: 18, h: 12 },
          { x: 58, y: 28, w: 22, h: 14 },
          { x: 16, y: 40, w: 24, h: 14 },
          { x: 48, y: 48, w: 28, h: 16 },
        ].map((r, i) => (
          <rect key={i} {...r} fill="rgba(168,200,160,0.1)" stroke="rgba(168,200,160,0.35)" strokeWidth="0.4" />
        ))}
      </g>
      {/* Arrow transformation */}
      <g>
        <path d="M 92 42 L 118 42" stroke="rgba(212,165,165,0.75)" strokeWidth="0.8" fill="none" />
        <path d="M 114 39 L 118 42 L 114 45" stroke="rgba(212,165,165,0.75)" strokeWidth="0.8" fill="none" />
        <text x="105" y="36" fill="rgba(212,165,165,0.85)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">compile</text>
      </g>
      {/* Right: manuscript page */}
      <g>
        <rect x="124" y="8" width="90" height="66" fill="rgba(240,230,210,0.06)" stroke="rgba(240,230,210,0.22)" strokeWidth="0.4" />
        {/* title */}
        <text x="130" y="16" fill="rgba(240,230,210,0.75)" fontSize="5" fontFamily="serif">Глава 1</text>
        <line x1="128" y1="18" x2="168" y2="18" stroke="rgba(240,230,210,0.22)" strokeWidth="0.3" />
        {/* paragraph lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1="130"
            y1={22 + i * 4.6}
            x2={130 + 78 - (i === 9 ? 22 : 0)}
            y2={22 + i * 4.6}
            stroke="rgba(240,230,210,0.28)"
            strokeWidth="0.3"
          />
        ))}
      </g>
    </svg>
  );
}

function CitationIllustrationFallback() {
  return (
    <svg viewBox="0 0 220 80" className="w-full h-[80px]">
      {/* Paragraph of chapter */}
      <g>
        {Array.from({ length: 4 }).map((_, i) => (
          <line
            key={i}
            x1="8"
            y1={14 + i * 6}
            x2={i === 1 ? 94 : 88}
            y2={14 + i * 6}
            stroke={i === 1 ? "rgba(212,165,165,0.85)" : "rgba(240,230,210,0.3)"}
            strokeWidth={i === 1 ? "0.6" : "0.3"}
          />
        ))}
      </g>
      {/* Connector line */}
      <path
        d="M 96 20 Q 120 20, 128 40"
        stroke="rgba(168,200,160,0.55)"
        strokeWidth="0.55"
        fill="none"
        strokeDasharray="3 2"
      />
      {/* PDF thumbnail with highlighted line */}
      <g>
        <rect x="130" y="30" width="76" height="42" fill="rgba(22,32,31,0.8)" stroke="rgba(168,200,160,0.35)" strokeWidth="0.4" />
        <text x="134" y="36" fill="rgba(168,200,160,0.75)" fontSize="4" fontFamily="monospace">PDF</text>
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1="134"
            y1={40 + i * 4.5}
            x2={134 + 66 - (i === 3 ? 14 : 0)}
            y2={40 + i * 4.5}
            stroke={i === 2 ? "rgba(212,165,165,0.9)" : "rgba(240,230,210,0.28)"}
            strokeWidth={i === 2 ? "0.6" : "0.3"}
          />
        ))}
      </g>
    </svg>
  );
}

const CARDS = [
  {
    num: "1",
    title: "Session Recall",
    body:
      "Когда возвращаетесь после 2–3 недель, Поле показывает: вот последняя зона, где вы работали. Вот три карточки, которые редактировали последними. Вот связи, которые добавили.",
    tagline: "Не надо вспоминать, где вы были.",
    art: (
      <RasterIllustration
        src="/images/timeline-recall.webp"
        alt="Горизонтальная временная шкала с точками правок за 60 дней; последняя сессия подсвечена"
        fallback={<BookViewIllustrationFallback />}
      />
    ),
  },
  {
    num: "2",
    title: "Book View",
    body:
      "Кнопка сверху справа. Один клик — холст компилируется в manuscript: главы по порядку, текст без UI, сноски в конце каждой главы. Экспорт Markdown, DOCX, EPUB.",
    tagline: "Холст — когда думаете. Прямоугольник — когда отдаёте редактору.",
    art: (
      <RasterIllustration
        src="/images/bookview-compile.webp"
        alt="Переход: 2D-холст → линейная страница манускрипта"
        fallback={<BookViewIllustrationFallback />}
      />
    ),
  },
  {
    num: "3",
    title: "Citation-aware sources",
    body:
      "Источники прикреплены к карточкам. В тексте главы ⌘-F — и вас кидает на источник, из которого этот параграф. Редактор спрашивает «откуда этот факт?» — отвечаете за 3 секунды.",
    tagline: "От параграфа к источнику одним нажатием.",
    art: (
      <RasterIllustration
        src="/images/citation-link.webp"
        alt="Параграф главы связан пунктирной дугой с источником на PDF"
        fallback={<CitationIllustrationFallback />}
      />
    ),
  },
];

export default function ZoneMechanisms() {
  return (
    <ZoneShell id="mechanisms" marker="04 / механики">
      <h2 className="font-serif text-[30px] leading-[1.08] tracking-[-0.012em] text-cream">
        Три механики, <span className="italic text-growth">которые держат книгу.</span>
      </h2>

      <div className="mt-8 grid grid-cols-3 gap-5" data-no-pan>
        {CARDS.map((c) => (
          <motion.div
            key={c.num}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 0.8, 0.26, 1] }}
            className="group relative p-5 border border-[rgba(168,200,160,0.16)] bg-[rgba(22,32,31,0.55)] hover:border-[rgba(168,200,160,0.4)] transition-colors flex flex-col"
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-[11px] text-anchor tracking-[0.2em]">
                0{c.num}
              </span>
              <span className="hairline flex-1 opacity-40" />
            </div>
            <h3 className="font-serif text-[20px] tracking-tight text-cream mb-3">
              {c.title}
            </h3>
            <div className="mb-5 opacity-90">{c.art}</div>
            <p className="font-sans text-[12.5px] leading-[1.55] text-cream-dim mb-4 flex-1">
              {c.body}
            </p>
            <p className="font-serif italic text-[13.5px] leading-[1.4] text-cream border-t border-[rgba(168,200,160,0.12)] pt-3">
              {c.tagline}
            </p>
          </motion.div>
        ))}
      </div>
    </ZoneShell>
  );
}
