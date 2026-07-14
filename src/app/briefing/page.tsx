import type { Metadata } from "next";
import { Logo } from "@/components/site/logo";
import { BriefingForm } from "@/components/site/briefing-form";

export const metadata: Metadata = {
  title: "Briefing de tu proyecto",
  description:
    "Cuéntanos los detalles de tu proyecto web. Cuanto más nos cuentes, mejor será la propuesta. Te respondemos en menos de 24 h.",
  alternates: { canonical: "/briefing" },
  // Página de captación privada: fuera del índice de buscadores.
  robots: { index: false, follow: false },
};

export default function BriefingPage() {
  return (
    <>
      {/* Cabecera simple: logo → inicio */}
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-4xl items-center justify-between px-5 py-3.5">
          <a href="/" aria-label="Setnou Studio — inicio" className="shrink-0">
            <Logo className="h-7 md:h-8" />
          </a>
          <span className="hidden items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-medium sm:inline-flex">
            <span className="size-2 rounded-full bg-magenta" />
            Briefing de proyecto
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-14 md:pt-20">
        {/* Intro */}
        <div className="relative mb-12 md:mb-16">
          <div aria-hidden className="pointer-events-none absolute right-[-40px] top-[-20px] hidden size-28 rotate-12 rounded-3xl bg-sky/30 md:block" />
          <span aria-hidden className="mb-6 flex gap-1.5">
            <span className="size-3.5 rounded-sm bg-electric" />
            <span className="size-3.5 rounded-sm bg-sky" />
            <span className="size-3.5 rounded-sm bg-magenta" />
            <span className="size-3.5 rounded-sm bg-gold" />
            <span className="size-3.5 rounded-sm bg-ink" />
          </span>
          <h1 className="max-w-3xl font-display text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[1.03] tracking-[-0.03em]">
            Cuéntanos tu proyecto y{" "}
            <span className="highlight inline-block rounded-md bg-magenta text-ink">
              lo hacemos realidad.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Rellena este briefing con calma — no hay respuestas malas. Cuanto mejor
            te conozcamos, más a medida será tu web. Te llevará unos minutos.
          </p>
        </div>

        <BriefingForm />
      </main>

      {/* Pie */}
      <footer className="mt-auto bg-ink text-paper">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Logo variant="dark" className="h-8" />
          <p className="text-xs text-paper/50">© 2026 Setnou Studio · Barcelona</p>
        </div>
      </footer>
    </>
  );
}
