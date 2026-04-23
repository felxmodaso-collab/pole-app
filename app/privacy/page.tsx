import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Что Поле собирает, что не собирает, где хранит. Короткая честная страница.",
};

export default function PrivacyPage() {
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
          Privacy
        </h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-steel-dim">
          последнее обновление — апрель 2026
        </p>

        <p className="mt-8 font-sans text-[15px] leading-[1.65] text-cream-dim">
          Поле — инструмент, на котором вы пишете книгу в течение многих
          месяцев. Ваши данные важнее любых наших метрик. Эта страница — не
          формальность, а обязательство.
        </p>

        <Section title="Что мы собираем">
          <ul className="mt-3 space-y-2.5 list-disc list-outside pl-5 marker:text-growth">
            <li>
              <b className="text-cream">Email</b> — только если вы оставили его
              в waitlist или зарегистрировались. Используется для писем, напрямую
              связанных с аккаунтом. Ни одного маркетингового письма вы не получите.
            </li>
            <li>
              <b className="text-cream">Содержимое холста</b> — ваши карточки,
              тексты глав, источники. Хранится зашифрованным at-rest на наших
              серверах в EU (Hetzner Falkenstein). Мы не читаем, не анализируем,
              не используем для тренировки моделей.
            </li>
            <li>
              <b className="text-cream">Технические логи</b> — время запроса,
              статус-код, тип устройства. Хранятся 30 дней, затем удаляются. Нужны
              для отладки, не для профилирования.
            </li>
          </ul>
        </Section>

        <Section title="Что мы не собираем">
          <ul className="mt-3 space-y-2.5 list-disc list-outside pl-5 marker:text-anchor">
            <li>Никаких сторонних трекеров (Google Analytics, Meta Pixel, Hotjar).</li>
            <li>Никаких куки, кроме технического session-token.</li>
            <li>Не продаём и не передаём данные третьим сторонам — точка.</li>
            <li>Не делаем A/B-тесты на вашем тексте.</li>
            <li>
              Не используем ваши тексты для обучения AI-моделей. Никогда, никаких{" "}
              <span className="text-cream">opt-in</span>.
            </li>
          </ul>
        </Section>

        <Section title="Экспорт и удаление">
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            В любой момент в разделе <span className="text-cream">Настройки</span>
            {" "}→ <span className="text-cream">Данные</span> можно:
          </p>
          <ul className="mt-3 space-y-2.5 list-disc list-outside pl-5 marker:text-growth">
            <li>Скачать всё ваше содержимое (Markdown + JSON, zip-архив).</li>
            <li>Удалить аккаунт полностью, без подтверждений через поддержку.</li>
          </ul>
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            После удаления все ваши данные стираются с production-базы в течение
            24 часов. Бэкапы последних 30 дней ротируются автоматически — после
            этого данные физически недоступны.
          </p>
        </Section>

        <Section title="Если Поле закроется">
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            Мы обязались: за 90 дней до закрытия — исходный код уходит в
            open-source (MIT), вы получите self-host инструкцию и 6 месяцев на
            экспорт. Это записано в{" "}
            <Link href="/terms" className="text-growth hover:underline">
              Terms
            </Link>
            , не просто маркетинг.
          </p>
        </Section>

        <Section title="Контакт">
          <p className="mt-3 font-sans text-[15px] leading-[1.65] text-cream-dim">
            Вопрос о данных — пишите{" "}
            <a
              href="mailto:privacy@pole.app"
              className="text-growth hover:underline"
            >
              privacy@pole.app
            </a>
            . Отвечает Игорь в течение 48 часов.
          </p>
        </Section>

        <div className="mt-16 pt-8 border-t border-[rgba(168,200,160,0.14)] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
          <Link href="/" className="hover:text-growth transition-colors">
            ← на холст
          </Link>
          <div className="flex gap-5 text-steel-dim">
            <Link href="/terms" className="hover:text-growth transition-colors">
              terms
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
