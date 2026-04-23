import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Что меняется в Поле — хронологически, без маркетинговой обёртки.",
};

const ENTRIES = [
  {
    v: "0.1.0",
    date: "апрель 2026",
    title: "Spec site",
    status: "pre-alpha",
    notes: [
      "Публичный спек-лендинг с интерактивным холстом.",
      "Waitlist запущен — первые 100 писем попадают в закрытую бету.",
      "Кодовая база не опубликована — будет после alpha.",
    ],
  },
  {
    v: "0.0.4",
    date: "март 2026",
    title: "Private alpha — 12 пользователей",
    status: "private",
    notes: [
      "Book View — компиляция холста в DOCX.",
      "Session Recall — подсветка последней зоны + 3 карточек.",
      "Добавили экспорт в EPUB (inspired by user feedback от Анастасии Б.).",
    ],
  },
  {
    v: "0.0.3",
    date: "февраль 2026",
    title: "Citations",
    status: "private",
    notes: [
      "Привязка источников к параграфам через selection → drop.",
      "PDF аннотации синхронизируются в панель карточки.",
      "42-е интервью с нон-фикшн автором: добавили «вопрос редактора» в UI.",
    ],
  },
  {
    v: "0.0.2",
    date: "январь 2026",
    title: "Пространственные зоны",
    status: "private",
    notes: [
      "Zone ≠ tag: зона — это область холста, а не метка.",
      "Zoom-in на зону → режим «одна сцена», без интерфейса.",
      "Первый dogfooding на внутренней биографии 50k слов.",
    ],
  },
  {
    v: "0.0.1",
    date: "ноябрь 2025",
    title: "Прототип",
    status: "internal",
    notes: [
      "Одна карточка + одна зона + одно соединение. Без persistence.",
      "Канвас на canvas API, без виртуализации, 60fps до 200 карточек.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-10 md:py-24">
      <article className="max-w-[64ch] mx-auto">
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel hover:text-growth transition-colors"
        >
          ← на холст
        </Link>

        <h1 className="mt-8 font-serif text-[38px] leading-[1.08] tracking-[-0.015em] text-cream">
          Changelog
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-steel-dim">
          что меняется · хронологически · без маркетинга
        </p>

        <p className="mt-8 font-sans text-[15px] leading-[1.65] text-cream-dim">
          Мы пишем changelog даже до публичного релиза — потому что то, чего нет в
          записях, легко забыть. Для вас — прозрачность темпа и решений. Для нас —
          память.
        </p>

        <div className="mt-12 space-y-12">
          {ENTRIES.map((e) => (
            <article
              key={e.v}
              className="grid grid-cols-[90px_1fr] gap-8 pt-6 border-t border-[rgba(168,200,160,0.12)] first:border-t-0 first:pt-0"
            >
              <div>
                <div className="font-serif text-[22px] tracking-tight text-cream numset">
                  {e.v}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
                  {e.date}
                </div>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] inline-block px-2 py-0.5 border border-[rgba(168,200,160,0.2)] text-cream-dim">
                  {e.status}
                </div>
              </div>
              <div>
                <h2 className="font-serif text-[20px] leading-[1.2] tracking-tight text-cream">
                  {e.title}
                </h2>
                <ul className="mt-3 space-y-2 font-sans text-[14px] leading-[1.55] text-cream-dim list-disc list-outside pl-5 marker:text-growth">
                  {e.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(168,200,160,0.14)] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
          <Link href="/" className="hover:text-growth transition-colors">
            ← на холст
          </Link>
          <div className="flex gap-5 text-steel-dim">
            <Link
              href="/privacy"
              className="hover:text-growth transition-colors"
            >
              privacy
            </Link>
            <Link href="/terms" className="hover:text-growth transition-colors">
              terms
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
