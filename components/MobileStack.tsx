"use client";

import { openWaitlist } from "@/lib/waitlist";

/**
 * Mobile fallback — vertical stacking of zones. On <768px the Canvas is hidden
 * (see Canvas.tsx: `hidden md:block`), and this component renders instead with
 * its own typography rhythm. Content reads as a long-form article.
 */
export default function MobileStack() {
  return (
    <div className="md:hidden relative">
      <header className="px-5 pt-8 pb-5 border-b border-[rgba(168,200,160,0.14)]">
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-[24px] tracking-tight text-cream">Поле</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-steel">
            v 0.1 · spec
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
          на десктопе — холст с драгом.<br />
          здесь — полотно линейное.
        </p>

        {/* Static snapshot of the desktop canvas so a mobile reader learns
            the site's premise before scrolling the linearized text. */}
        <figure className="mt-4 relative aspect-[16/10] w-full overflow-hidden border border-[rgba(168,200,160,0.14)] bg-base-deep">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/desktop-preview.jpg`}
            alt="Десктоп-версия — 8 зон Поле расположены пространственно на холсте, связаны тонкими конструкционными линиями"
            className="w-full h-full object-cover opacity-85"
            loading="eager"
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-gradient-to-b from-base-deep/15 via-transparent to-base-deep/70"
          />
          <figcaption className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.22em] text-cream-dim">
            <span>превью · 8 зон · drag / zoom</span>
            <span className="text-anchor">desktop</span>
          </figcaption>
        </figure>
      </header>

      <MobileZone
        number="01"
        title="Инструмент для книги длиной в год."
        italic="длиной в год."
      >
        <p>
          Поле — пространство для длинного нон-фикшн. Источники, аргумент,
          черновики глав и связи между ними — в одном холсте, который
          не распадётся за 14 месяцев работы.
        </p>
      </MobileZone>

      <MobileZone
        number="02"
        title="Чем длиннее книга, тем больше вы забываете, что уже решили."
        italic="что уже решили."
        italicClass="italic text-anchor"
      >
        <p>
          Notion хорош для базы данных — но плохо держит аргумент.<br />
          Obsidian хорош для заметок — но плоскую сеть ссылок трудно читать как книгу.<br />
          Scrivener хорош для структуры — но источники живут отдельно.<br />
          Zotero хорош для цитат — но не знает, в какой абзац какая цитата должна войти.
        </p>
        <p className="font-serif text-[16px] text-cream">
          Четыре инструмента.{" "}
          <span className="italic text-anchor">Одна забывчивость.</span>
        </p>
        <blockquote className="border-l-2 border-anchor-muted pl-4 font-serif italic text-cream">
          «Я открыла черновик третьей главы после двух недель отпуска и не
          помнила, почему этот источник должен идти после этого абзаца. Потратила
          три дня, восстанавливая собственную логику.»
          <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-steel not-italic">
            — Мария Л., журналистка
          </footer>
        </blockquote>
      </MobileZone>

      <MobileZone number="03" title="Так выглядит ваша книга в Поле.">
        <p>
          Всё живёт в одном холсте. Карточка — это идея. Зона — это глава
          черновика. Линия между карточкой и зоной — источник, который в эту
          главу войдёт.
        </p>
        <p>
          Zoom out — видна вся книга. Zoom in на зону — вы пишете одну сцену. Без
          переключения приложений.
        </p>
      </MobileZone>

      <MobileZone number="04" title="Три механики, которые держат книгу.">
        <MobileMechanic
          n="1"
          title="Session Recall"
          body="Когда возвращаетесь после 2–3 недель, Поле показывает последнюю зону, последние правки, новые связи. Не надо вспоминать, где вы были."
        />
        <MobileMechanic
          n="2"
          title="Book View"
          body="Один клик — холст компилируется в manuscript. Главы по порядку, сноски, экспорт Markdown / DOCX / EPUB. Холст — когда думаете. Прямоугольник — когда отдаёте редактору."
        />
        <MobileMechanic
          n="3"
          title="Citation-aware"
          body="Источники прикреплены к карточкам. В тексте главы ⌘-F — и вы на источнике. Редактор спросил — ответили за 3 секунды."
        />
      </MobileZone>

      <MobileZone number="05" title="Случай: биография, 14 месяцев, 380 источников, 92 000 слов.">
        <p>
          Мария Лукьянова писала биографию диссидента 1970-х. 380 источников:
          транскрипты КГБ, письма родственников, архивные публикации, 40 интервью
          с выжившими современниками.
        </p>
        <p>
          С Поле — один холст. 7 концептов. 12 зон-глав. 380 источников прикреплены
          к карточкам. Редактор задал 31 вопрос во время прочтения черновика.
          Мария ответила на каждый за 2 минуты.
        </p>
        <p className="font-serif italic text-cream">
          «Я первый раз писала книгу, не теряя её.»
        </p>
      </MobileZone>

      <MobileZone number="06" title="Сколько стоит.">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
          нет бесплатного тира с data hostage
        </p>
        <div className="space-y-5 mt-4">
          {[
            { name: "Personal", price: "$12 / мес", sub: "или $120 / год · для одной книги" },
            { name: "Academic", price: "$60 / год", sub: "для студентов и исследователей с proof" },
            { name: "Trial",    price: "14 дней",   sub: "без карты. все функции. экспорт при отказе." },
          ].map((p) => (
            <div key={p.name} className="border-t border-[rgba(168,200,160,0.14)] pt-3">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-[18px] text-cream">{p.name}</span>
                <span className="font-serif text-[18px] text-anchor numset">{p.price}</span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-steel mt-1">
                {p.sub}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => openWaitlist("pricing:mobile")}
          className="mt-6 w-full block py-3.5 bg-anchor text-base-deep font-mono text-[12px] uppercase tracking-[0.22em] text-center hover:bg-[rgb(196,140,140)] transition-colors"
        >
          → Начать 14 дней
        </button>
      </MobileZone>

      <MobileZone number="07" title="Вопросы, которые уже задавали." italic="уже задавали." italicClass="italic text-anchor">
        <MobileFaq />
      </MobileZone>

      <MobileZone number="08" title="Кто делает.">
        <p><span className="text-cream">Анна К.</span> — designer, auto-didact. 8 лет писала документальную книгу про арт-рынок 90-х, бросила на 4-й год.</p>
        <p><span className="text-cream">Игорь В.</span> — engineer, ex-Scrivener power-user. Технический дизайн Поле.</p>
        <p><span className="text-cream">Семён П.</span> — UX-research. 42 интервью до первой строки кода.</p>
        <p className="pt-4 border-t border-[rgba(168,200,160,0.12)]">
          Не venture-funded. Если Поле когда-нибудь закроется — исходный код уходит в open-source за 90 дней. У вас будет инструмент, даже если нас не будет.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
          pole.app ·{" "}
          <a
            href="mailto:hello@pole.app"
            className="text-cream-dim hover:text-growth transition-colors lowercase tracking-normal"
          >
            hello@pole.app
          </a>{" "}
          · не в YC, не в a16z, не в HN-рейтинге.
        </p>
        <nav className="mt-3 flex gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-dim">
          <a href="/privacy" className="hover:text-growth transition-colors">
            privacy
          </a>
          <a href="/terms" className="hover:text-growth transition-colors">
            terms
          </a>
          <a href="/changelog" className="hover:text-growth transition-colors">
            changelog
          </a>
        </nav>
      </MobileZone>

      <footer className="px-5 py-8 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-steel-dim border-t border-[rgba(168,200,160,0.1)]">
        spec portfolio · pole.app
      </footer>
    </div>
  );
}

// Mobile version of FAQ — always-open cards, no accordion state (no JS cost).
function MobileFaq() {
  const items: { q: string; a: React.ReactNode }[] = [
    {
      q: "Чем отличается от Notion / Obsidian / Scrivener?",
      a: "Не пытается быть всем. Только одна задача — не потерять нить длинного нон-фикшн. Если пишете посты или статьи — вам хватит Notion.",
    },
    {
      q: "Что с данными, если Поле закроется?",
      a: (
        <>
          За 90 дней — open-source. За 60 — self-host. За 30 — автоэкспорт. Записано
          в{" "}
          <a href="/terms" className="text-growth">
            Terms
          </a>
          .
        </>
      ),
    },
    {
      q: "Используете тексты для тренировки AI?",
      a: (
        <>
          Нет. Никогда. Подробно —{" "}
          <a href="/privacy" className="text-growth">
            Privacy
          </a>
          .
        </>
      ),
    },
    {
      q: "Будет ли iPad версия?",
      a: "Native iPad — Q3 2026 (с Pencil). Safari уже работает, но не идеально. iOS — нет.",
    },
    {
      q: "Экспорт — только Markdown?",
      a: "Markdown, DOCX, EPUB. Full-formatting. Включено во все тарифы — и в Trial тоже.",
    },
  ];
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="border-t border-[rgba(168,200,160,0.12)] pt-3">
          <div className="font-serif text-[15px] leading-[1.35] text-cream">
            {it.q}
          </div>
          <div className="mt-1.5 text-[13.5px] leading-[1.55] text-cream-dim">
            {it.a}
          </div>
        </div>
      ))}
      <p className="mt-4 pt-3 border-t border-[rgba(168,200,160,0.12)] font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
        не нашли ответ —{" "}
        <a
          href="mailto:hello@pole.app"
          className="text-cream-dim hover:text-growth transition-colors lowercase tracking-normal"
        >
          hello@pole.app
        </a>
      </p>
    </div>
  );
}

function MobileZone({
  number,
  title,
  italic,
  italicClass = "italic text-growth",
  children,
}: {
  number: string;
  title: string;
  italic?: string;
  italicClass?: string;
  children: React.ReactNode;
}) {
  const rendered = italic
    ? title.split(italic).reduce<React.ReactNode[]>((acc, part, i, arr) => {
        acc.push(part);
        if (i < arr.length - 1) acc.push(<span key={i} className={italicClass}>{italic}</span>);
        return acc;
      }, [])
    : title;

  return (
    <section className="px-5 py-10 border-b border-[rgba(168,200,160,0.1)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-steel mb-4">
        зона {number}
      </div>
      <h2 className="font-serif text-[24px] leading-[1.1] tracking-[-0.01em] text-cream mb-5">
        {rendered}
      </h2>
      <div className="space-y-4 font-sans text-[14px] leading-[1.6] text-cream-dim">
        {children}
      </div>
    </section>
  );
}

function MobileMechanic({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-4 py-3 border-t border-[rgba(168,200,160,0.1)] first:border-t-0">
      <div className="font-mono text-[11px] text-anchor tracking-[0.2em] mt-1">0{n}</div>
      <div>
        <div className="font-serif text-[16px] text-cream mb-1">{title}</div>
        <p className="font-sans text-[13px] leading-[1.55] text-cream-dim">{body}</p>
      </div>
    </div>
  );
}
