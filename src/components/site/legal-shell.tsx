import Link from "next/link";
import { Logo } from "@/components/site/logo";

/** Datos del titular (reutilizados en las tres páginas legales). */
export const TITULAR = {
  nombre: "SETNOU GLOBAL GROUP, S.L.",
  nif: "B26916726",
  direccion: "C/ Casanova 48, ático 2, 08011 Barcelona",
  email: "hola@setnou.com",
  web: "https://www.setnoustudio.com",
};

/**
 * Cabecera + contenedor de lectura para las páginas legales.
 * Estilos de prosa básicos vía clases utilitarias.
 */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-3xl items-center justify-between px-5 py-3.5">
          <Link href="/" aria-label="Setnou Studio — inicio" className="shrink-0">
            <Logo className="h-7 md:h-8" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-ink"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Última actualización: {updated}
        </p>
        <div
          className="mt-10 flex flex-col gap-5 leading-relaxed [&_a]:font-medium [&_a]:text-electric [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_li]:ml-5 [&_li]:list-disc [&_p]:text-[0.975rem] [&_p]:text-foreground/90 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2"
        >
          {children}
        </div>
      </main>
    </>
  );
}
