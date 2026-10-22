import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 text-center">
      <Logo className="h-9" />
      <div className="flex flex-col items-center gap-3">
        <span className="font-display text-[clamp(4rem,18vw,9rem)] font-extrabold leading-none tracking-[-0.04em] text-magenta">
          404
        </span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Esta página no existe.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Puede que el enlace esté roto o que la página se haya movido. Vuelve al
          inicio y sigue desde ahí.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="btn-pop inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper"
        >
          Volver al inicio
        </Link>
        <Link
          href="/hablemos"
          className="btn-pop inline-flex items-center rounded-full bg-paper px-7 py-3.5 text-base font-semibold text-ink"
        >
          Hablemos de tu web
        </Link>
      </div>
    </main>
  );
}
