export const WAITLIST_OPEN_EVT = "pole:waitlist:open";

export type WaitlistOpenDetail = { source?: string };

/**
 * Fire from any zone CTA. A single <WaitlistModal /> in the root layout
 * listens and opens. Keeps call-sites trivial and avoids context boilerplate.
 */
export function openWaitlist(source?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<WaitlistOpenDetail>(WAITLIST_OPEN_EVT, {
      detail: { source },
    })
  );
}
