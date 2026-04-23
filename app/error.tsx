"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Would normally report to monitoring
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-steel mb-6">
          ошибка · что-то пошло не так
        </div>
        <h1 className="font-serif text-[44px] leading-[1.05] tracking-[-0.015em] text-cream">
          Холст не загрузился{" "}
          <span className="italic text-anchor">до конца.</span>
        </h1>
        <p className="mt-5 font-sans text-[15px] leading-[1.55] text-cream-dim">
          Попробуйте перезагрузить. Если повторится —{" "}
          <span className="text-cream">hello@pole.app</span>, приложите
          идентификатор:{" "}
          <span className="font-mono text-[12px] text-anchor">
            {error.digest ?? "no-digest"}
          </span>
        </p>
        <div className="mt-8 flex items-center gap-6">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-3 bg-anchor text-base-deep font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-anchor-muted transition-colors"
          >
            ↻ Попробовать снова
          </button>
        </div>
      </div>
    </main>
  );
}
