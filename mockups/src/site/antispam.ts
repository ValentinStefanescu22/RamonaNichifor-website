import { useRef } from "react";

/**
 * Two quiet spam guards for forms, the same ones the real site repeats on the server:
 * a honeypot field people never see (bots fill it) and a time trap (bots submit instantly).
 * A message caught by either is answered with the normal success state and silently dropped.
 */
export function useAntiSpam(minSeconds = 3) {
  const openedAt = useRef(Date.now());
  const trap = useRef<HTMLInputElement>(null);
  const isSpam = () => Boolean(trap.current?.value) || Date.now() - openedAt.current < minSeconds * 1000;
  const reset = () => {
    openedAt.current = Date.now();
    if (trap.current) trap.current.value = "";
  };
  return { trap, isSpam, reset };
}
