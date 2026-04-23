"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ZoneShell } from "../ZoneShell";

const TEAM = [
  {
    id: "anna",
    name: "Анна К.",
    role: "designer · самоучка",
    bio:
      "8 лет писала документальную книгу про арт-рынок 90-х, бросила на 4-й год — потеряла нить. Поле — попытка сделать инструмент, которого ей не хватало тогда.",
    hue: "rgba(168,200,160,0.5)",
  },
  {
    id: "igor",
    name: "Игорь В.",
    role: "engineer · бывший power-user Scrivener",
    bio:
      "12 лет в software, пишет эссе про историю архитектуры — от 5k до 20k слов. Технический дизайн Поле.",
    hue: "rgba(212,165,165,0.5)",
  },
  {
    id: "semyon",
    name: "Семён П.",
    role: "part-time · ux-research",
    bio:
      "Провёл 42 интервью с авторами длинного нон-фикшн до написания первой строки кода.",
    hue: "rgba(240,230,210,0.5)",
  },
];

export default function ZoneAbout() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ZoneShell id="about" marker="08 / команда">
      <h2 className="font-serif text-[24px] leading-[1.08] tracking-[-0.012em] text-cream">
        Кто делает.
      </h2>

      {/* Team illustration — three-up portrait panel */}
      <div
        data-no-pan
        className="relative mt-5 w-full aspect-[16/9] border border-[rgba(168,200,160,0.14)] overflow-hidden bg-base-deep"
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/portrait-team.webp`}
          alt="Стилизованная групповая иллюстрация команды Поле — не фото"
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover"
          style={{
            filter: "brightness(0.82) saturate(0.82) contrast(1.03)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, rgba(30,42,46,0.15) 0%, rgba(30,42,46,0.1) 55%, rgba(22,32,31,0.55) 100%)",
          }}
        />
        <div className="absolute bottom-1.5 left-2 right-2 flex justify-between font-mono text-[8.5px] uppercase tracking-[0.22em] text-cream-dim opacity-80">
          <span>анна&nbsp;·&nbsp;игорь&nbsp;·&nbsp;семён</span>
          <span>репрезентация</span>
        </div>
      </div>

      <ul className="mt-6 space-y-4" data-no-pan>
        {TEAM.map((m) => {
          const on = hovered === m.id;
          return (
            <li
              key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-default border-l-2 pl-3 transition-colors"
              style={{
                borderColor: on ? m.hue : "rgba(168,200,160,0.18)",
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-serif text-[15.5px] text-cream">
                  {m.name}
                </div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-steel">
                  {m.role}
                </div>
              </div>
              <motion.p
                initial={false}
                animate={{
                  maxHeight: on ? 120 : 0,
                  opacity: on ? 1 : 0,
                  marginTop: on ? 6 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="font-sans text-[12px] leading-[1.5] text-cream-dim overflow-hidden"
              >
                {m.bio}
              </motion.p>
            </li>
          );
        })}
      </ul>

      <div className="hairline my-6" />

      <p className="font-sans text-[12.5px] leading-[1.55] text-cream-dim">
        Мы не venture-funded. Поле финансируется из подписок и пары частных
        инвесторов-книголюбов.
      </p>

      <p className="mt-3 font-sans text-[12.5px] leading-[1.55] text-cream-dim">
        Если Поле когда-нибудь закроется (постараемся не допустить), исходный код
        уходит в open-source за 90 дней.{" "}
        <span className="text-cream">
          У вас будет инструмент, даже если нас не будет.
        </span>
      </p>

      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-steel" data-no-pan>
        <div>
          pole.app ·{" "}
          <a
            href="mailto:hello@pole.app"
            className="text-cream-dim hover:text-growth transition-colors lowercase tracking-normal"
          >
            hello@pole.app
          </a>
        </div>
        <div className="mt-1">собираем из Тбилиси и Праги.</div>
        <div className="mt-1 text-steel-dim">
          не в YC, не в a16z, не в HN-рейтинге.
        </div>
        <div className="mt-3 flex gap-4 text-[9.5px] tracking-[0.2em]">
          <a href="/privacy" className="hover:text-growth transition-colors">
            privacy
          </a>
          <a href="/terms" className="hover:text-growth transition-colors">
            terms
          </a>
          <a href="/changelog" className="hover:text-growth transition-colors">
            changelog
          </a>
        </div>
      </div>
    </ZoneShell>
  );
}
