"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ZoneShell } from "../ZoneShell";

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "А чем Поле отличается от Notion / Obsidian / Scrivener?",
    a: (
      <>
        Три приложения — три сильных, но частичных ответа. Notion держит базу
        данных, но плоско. Obsidian сильный в связях, но не держит <i>аргумент
        длиной в главу</i>. Scrivener держит структуру, но источники живут отдельно.{" "}
        <span className="text-cream">
          Поле собрано вокруг одной задачи — не потерять нить за 14 месяцев работы.
        </span>{" "}
        Если вы пишете пост или статью — вам не нужно Поле.
      </>
    ),
  },
  {
    q: "Экспорт — правда в DOCX/EPUB, или только Markdown?",
    a: (
      <>
        Оба: Markdown (исходник со всеми ссылками на источники), DOCX (для
        редактора), EPUB (для авторских читок). Full-formatting: заголовки, сноски,
        изображения, библиография. Без «Premium export» — всё в базовой подписке,
        включая Trial.
      </>
    ),
  },
  {
    q: "Будет ли мобильное приложение? iPad?",
    a: (
      <>
        Web-версия работает на iPad в Safari, но это <i>не</i> полноценный опыт —
        канвас требует точного курсора. Нативный iPad — в roadmap на Q3 2026 (с
        Apple Pencil). Mobile iOS — нет: писать длинный нон-фикшн с телефона
        никто не пытается всерьёз.
      </>
    ),
  },
  {
    q: "Что с данными, если вы закроетесь?",
    a: (
      <>
        За 90 дней до shutdown — исходники в open-source (MIT). За 60 дней —
        self-host инструкции и Docker-образ. За 30 дней — автоматический экспорт
        всем. Это записано в{" "}
        <a href="/terms" className="text-growth hover:underline">
          Terms
        </a>{" "}
        пункт 7 — не просто пост в блоге.
      </>
    ),
  },
  {
    q: "Используете мои тексты для тренировки AI?",
    a: (
      <>
        <span className="text-cream">Нет.</span> Никогда. Никаких opt-in, никаких
        галочек в настройках. Ваш текст не передаётся OpenAI, Anthropic, Google, нам
        самим как «анонимизированные данные». Полный ответ — на странице{" "}
        <a href="/privacy" className="text-growth hover:underline">
          Privacy
        </a>
        .
      </>
    ),
  },
  {
    q: "Почему $12/мес, а не бесплатный тир?",
    a: (
      <>
        Бесплатные тиры — это обычно data hostage: через 2 года вам предложат
        платить, иначе экспорт закроется. Мы не идём в эту модель. Цена низкая
        (Netflix × 0.9), возврата нет — если Поле не подошло, просто отменяете.
        Trial 14 дней без карты — чтобы не было «не попробовал».
      </>
    ),
  },
  {
    q: "Можно self-host прямо сейчас?",
    a: (
      <>
        Пока нет — публичный код появится после alpha-релиза (~Q2 2026). Если
        нужен on-premise вариант для исследовательского института — пишите{" "}
        <a
          href="mailto:hello@pole.app"
          className="text-growth hover:underline"
        >
          hello@pole.app
        </a>
        , есть enterprise-путь для университетов.
      </>
    ),
  },
];

export default function ZoneFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <ZoneShell id="faq" marker="07 / вопросы">
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="font-serif text-[28px] leading-[1.08] tracking-[-0.012em] text-cream">
          Вопросы, которые{" "}
          <span className="italic text-anchor">уже задавали.</span>
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel text-right max-w-[24ch]">
          не нашли своего —<br />
          <a
            href="mailto:hello@pole.app"
            className="text-cream-dim hover:text-growth transition-colors lowercase tracking-normal"
          >
            hello@pole.app
          </a>
        </p>
      </div>

      <ul className="mt-7 divide-y divide-[rgba(168,200,160,0.12)]" data-no-pan>
        {FAQ.map((item, i) => {
          const open = openIdx === i;
          return (
            <li key={i}>
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-start gap-4 py-4 text-left group"
                aria-expanded={open}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel-dim mt-1 numset w-7 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-serif text-[16.5px] leading-[1.35] text-cream-dim group-hover:text-cream transition-colors">
                  {item.q}
                </span>
                <motion.span
                  aria-hidden
                  className="mt-1 text-steel font-mono text-[14px] shrink-0"
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.22 }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 0.8, 0.26, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-11 pr-4 pb-5 font-sans text-[13.5px] leading-[1.6] text-cream-dim">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </ZoneShell>
  );
}
