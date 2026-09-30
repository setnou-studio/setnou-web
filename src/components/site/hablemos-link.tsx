"use client";

import Link from "next/link";

/** Página del asistente "Hablemos" (sustituye al antiguo modal de contacto). */
export const HABLEMOS_URL = "/hablemos";

/** Para disparadores que no son enlaces (p. ej. el minijuego). */
export function irAHablemos() {
  window.location.assign(HABLEMOS_URL);
}

/** Enlace reutilizable al asistente. */
export function HablemosLink({
  className,
  children,
  ariaLabel,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={HABLEMOS_URL} aria-label={ariaLabel} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
