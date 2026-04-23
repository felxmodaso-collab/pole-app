import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Условия пользования Поле — короткая человеческая версия.",
};

export default function TermsPage() {
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
          Terms
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-steel-dim">
          версия 1.0 · апрель 2026 · юрисдикция ЕС
        </p>

        <p className="mt-8 font-sans text-[15px] leading-[1.65] text-cream-dim">
          Это короткая человеческая версия. Юридически эквивалентная длинная
          версия — по запросу на{" "}
          <a
            href="mailto:legal@pole.app"
            className="text-growth hover:underline"
          >
            legal@pole.app
          </a>
          . Мы намеренно держим основные условия в одной странице, потому что
          длинные ToS никто не читает.
        </p>

        <Section title="Что вы получаете">
          <ul className="mt-3 space-y-2.5 list-disc list-outside pl-5 marker:text-growth">
            <li>
              Доступ к продукту на срок оплаченной подписки ($12/мес Personal,
              $60/год Academic) или 14 дней Trial без карты.
            </li>
            <li>
              Ваше содержимое — ваше. Лицензии на него не даёте, не переуступаете.
              Мы храним и отображаем — и только.
            </li>
            <li>
              Экспорт без ограничений (Markdown, DOCX, EPUB). Вы можете уйти
              в любой момент — и забрать всё.
            </li>
          </ul>
        </Section>

        <Section title="Что вы обязуетесь">
          <ul className="mt-3 space-y-2.5 list-disc list-outside pl-5 marker:text-anchor">
            <li>
              Не использовать Поле для незаконного содержимого (детская
              эксплуатация, доксинг, подстрекательство — нарушает законодательство
              ЕС).
            </li>
            <li>
              Не ретранслировать наш продукт третьим лицам под видом своего.
              Self-host разрешён после open-source релиза (см. ниже).
            </li>
            <li>
              Не нагружать API выше разумного — если шлёте &gt;500 req/min, мы
              попросим уменьшить.
            </li>
          </ul>
        </Section>

        <Section title="Отмена подписки">
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            В любой момент в разделе <span className="text-cream">Биллинг</span>.
            Без «позвоните в поддержку», без «подтвердите 3 раза». Нажали — деньги
            не списываются со следующего месяца, данные остаются 30 дней на случай
            если передумали. После 30 дней — автоматический экспорт на email и
            удаление.
          </p>
        </Section>

        <Section title="Если мы закрываемся">
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            Обязательство, закреплённое договором:
          </p>
          <ul className="mt-3 space-y-2.5 list-disc list-outside pl-5 marker:text-growth">
            <li>За 90 дней до shutdown — публикуем исходный код под MIT.</li>
            <li>За 60 дней — self-host инструкции и Docker-образ.</li>
            <li>
              За 30 дней — напоминание всем активным пользователям, последний
              экспорт.
            </li>
            <li>Возврат пропорциональной части подписки.</li>
          </ul>
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            Это не маркетинговое обещание — это пункт 7 договора.
          </p>
        </Section>

        <Section title="Ответственность">
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            Поле — инструмент. За содержимое книги отвечаете вы. Мы делаем
            бэкапы каждый час, но рекомендуем хранить собственные локальные
            копии через Export (Markdown). Максимальная ответственность с нашей
            стороны ограничена суммой последнего годового платежа — это
            стандарт для SaaS, но мы упоминаем открыто.
          </p>
        </Section>

        <Section title="Юрисдикция">
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            Pole OÜ, Эстония (регистрационный номер появится здесь после
            инкорпорации, ориентировочно май 2026). Споры — через Harju Maakohus
            (Таллинн). GDPR применяется по умолчанию ко всем пользователям,
            независимо от страны.
          </p>
        </Section>

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
            <Link
              href="/changelog"
              className="hover:text-growth transition-colors"
            >
              changelog
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-[22px] tracking-tight text-cream">
        {title}
      </h2>
      <div className="mt-1 font-sans text-[15px] leading-[1.65] text-cream-dim">
        {children}
      </div>
    </section>
  );
}
