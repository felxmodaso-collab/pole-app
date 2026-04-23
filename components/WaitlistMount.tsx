"use client";

import { useEffect, useState } from "react";
import WaitlistModal from "./WaitlistModal";
import { WAITLIST_OPEN_EVT, WaitlistOpenDetail } from "@/lib/waitlist";

export default function WaitlistMount() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("pricing");

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<WaitlistOpenDetail>).detail ?? {};
      setSource(detail.source ?? "pricing");
      setOpen(true);
    };
    window.addEventListener(WAITLIST_OPEN_EVT, onOpen);
    return () => window.removeEventListener(WAITLIST_OPEN_EVT, onOpen);
  }, []);

  return <WaitlistModal open={open} onClose={() => setOpen(false)} source={source} />;
}
