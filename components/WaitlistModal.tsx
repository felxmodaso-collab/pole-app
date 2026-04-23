"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Stage = "form" | "submitting" | "success";

/**
 * Waitlist-style email capture for the CTA. No backend — stores the email in
 * localStorage so a returning visitor sees the "уже в списке" state instead of
 * the form, which reads more real than a stateless dialog on a spec site.
 */
export default function WaitlistModal({
  open,
  onClose,
  source = "pricing",
}: {
  open: boolean;
  onClose: () => void;
  source?: string;
}) {
  const [stage, setStage] = useState<Stage>("form");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    try {
      const existing = localStorage.getItem("pole:waitlist");
      if (existing) setAlreadyEnrolled(true);
      else setAlreadyEnrolled(false);
    } catch {
      // localStorage unavailable — just show form
    }
    setStage("form");
    setErr(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setErr("Похоже, это не email.");
      return;
    }
    setErr(null);
    setStage("submitting");
    // Simulate a real network round-trip. A production build would POST here
    // to a waitlist service (Plunk / ConvertKit / internal).
    await new Promise((r) => setTimeout(r, 650));
    try {
      localStorage.setItem(
        "pole:waitlist",
        JSON.stringify({
          email: email.trim(),
          role: role || "",
          source,
          at: new Date().toISOString(),
        })
      );
    } catch {}
    setStage("success");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-no-pan
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-heading"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[11vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "rgba(22, 32, 31, 0.65)",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-[min(520px,92vw)] zone-card p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4 gap-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-steel mb-2">
                  ранний доступ · бета
                </div>
                <h2
                  id="waitlist-heading"
                  className="font-serif text-[24px] leading-[1.15] tracking-[-0.012em] text-cream"
                >
                  {stage === "success"
                    ? "Вы в списке."
                    : alreadyEnrolled && stage === "form"
                    ? "Вы уже подписаны."
                    : "Оставьте email — пришлём, как откроем."}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Закрыть"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel hover:text-cream transition-colors"
              >
                esc
              </button>
            </div>

            {stage === "form" && !alreadyEnrolled && (
              <form onSubmit={submit} noValidate>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
                    email
                  </span>
                  <input
                    ref={inputRef}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErr(null);
                    }}
                    required
                    placeholder="mary@university.edu"
                    className="mt-2 w-full bg-[rgba(22,32,31,0.5)] border border-[rgba(168,200,160,0.18)] px-3 py-2.5 font-serif text-[16px] text-cream outline-none focus:border-[rgba(168,200,160,0.55)] transition-colors"
                  />
                </label>

                <fieldset className="mt-4">
                  <legend className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
                    пишете что-то длинное? (опционально)
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      "нон-фикшн",
                      "диссертация",
                      "биография",
                      "эссе",
                      "другое",
                    ].map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(role === r ? "" : r)}
                        className={`px-3 py-1.5 border font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors ${
                          role === r
                            ? "bg-[rgba(168,200,160,0.14)] border-growth text-cream"
                            : "border-[rgba(168,200,160,0.16)] text-cream-dim hover:border-[rgba(168,200,160,0.32)]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {err && (
                  <p className="mt-3 font-mono text-[11px] text-anchor">
                    {err}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-anchor text-base-deep font-mono text-[11.5px] uppercase tracking-[0.2em] hover:bg-[rgb(196,140,140)] transition-colors"
                  >
                    → записать
                  </button>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                    ни рассылки. ни напоминаний. одно письмо на старте.
                  </p>
                </div>
              </form>
            )}

            {stage === "submitting" && (
              <div className="py-6">
                <div className="h-[2px] w-full bg-[rgba(168,200,160,0.12)] overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-full w-[40%] bg-growth"
                  />
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-steel">
                  записываем…
                </p>
              </div>
            )}

            {(stage === "success" || (alreadyEnrolled && stage === "form")) && (
              <div className="py-2">
                <p className="font-sans text-[14px] leading-[1.55] text-cream-dim">
                  Проверьте inbox в{" "}
                  <span className="text-cream">конце недели</span>. Если Поле
                  переносится — напишем заранее. Ничего не значит, кроме того,
                  что мы помним, что вы здесь были.
                </p>
                <div className="mt-5 pt-5 border-t border-[rgba(168,200,160,0.12)] flex items-center justify-between gap-4">
                  <a
                    href="mailto:hello@pole.app"
                    className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-cream-dim hover:text-growth transition-colors"
                  >
                    написать нам →
                  </a>
                  <button
                    onClick={onClose}
                    className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-steel hover:text-cream transition-colors"
                  >
                    закрыть
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
