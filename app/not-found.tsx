import Link from "next/link";

export const metadata = {
  title: "За холстом ничего нет · Поле",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-steel mb-6">
          404 · зона не найдена
        </div>
        <h1 className="font-serif text-[52px] leading-[1.05] tracking-[-0.015em] text-cream">
          За краем холста{" "}
          <span className="italic text-growth">пусто.</span>
        </h1>
        <p className="mt-5 font-sans text-[15px] leading-[1.55] text-cream-dim">
          Вы зашли туда, где зон ещё не расставлено. Это нормально — холст
          бесконечный, но мы ещё не добрались досюда.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-anchor text-base-deep font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-anchor-muted transition-colors"
          >
            ← К входу
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
            pole.app
          </span>
        </div>
      </div>
    </main>
  );
}
