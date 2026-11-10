import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { XecRegalForm } from "@/components/site/xec-regal-form";

const DESC =
  "Bescanvia el xec regal de Setnou Studio: una pàgina web a mida valorada en 800 €. Sorteig solidari de Nadal 2026.";

export const metadata: Metadata = {
  title: "Bescanvia el teu xec regal",
  description: DESC,
  alternates: { canonical: "/xec-regal" },
  // Página privada del ganador: fuera de los buscadores.
  robots: { index: false, follow: false },
  openGraph: { title: "Xec regal · Setnou Studio", description: DESC, url: "/xec-regal", locale: "ca_ES" },
};

const INCLOU = ["Disseny a mida", "Adaptada a mòbil", "Fins a 5 pàgines", "2 idiomes", "SEO i GEO inclosos"];

export default function XecRegalPage() {
  return (
    // El layout raíz fija lang="es"; esta página entera está en catalán.
    <div lang="ca" className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-3xl items-center justify-between px-5 py-3.5">
          <Link href="/" aria-label="Setnou Studio — inici" className="shrink-0">
            <Logo className="h-7 md:h-8" />
          </Link>
          <span className="hidden items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-medium sm:inline-flex">
            <span className="size-2 rounded-full bg-magenta" />
            Xec regal · Nadal 2026
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-14 md:pt-20">
        <div className="mb-10 md:mb-14">
          <span aria-hidden className="mb-6 flex gap-1.5">
            <span className="size-3.5 rounded-sm bg-electric" />
            <span className="size-3.5 rounded-sm bg-sky" />
            <span className="size-3.5 rounded-sm bg-magenta" />
            <span className="size-3.5 rounded-sm bg-gold" />
            <span className="size-3.5 rounded-sm bg-ink" />
          </span>
          <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-extrabold leading-[1.03] tracking-[-0.03em]">
            Enhorabona! Has guanyat{" "}
            <span className="highlight inline-block rounded-md bg-magenta text-ink">una pàgina web.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            El teu xec regal val per una pàgina web feta a mida per al teu negoci o per a tu, valorada
            en 800 €. Bescanvia’l aquí en dos passos i ens posarem en contacte amb tu per començar.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {INCLOU.map((i) => (
              <li key={i} className="rounded-full border-2 border-ink bg-card px-3.5 py-1.5 text-sm font-medium">{i}</li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Domini inclòs el primer any. A partir del segon any el domini no està inclòs i costa 29 € l’any.
            Bescanviable fins al 30-06-2027.
          </p>
        </div>

        <XecRegalForm />

        <p className="mt-10 flex items-start gap-3 rounded-2xl border-2 border-ink bg-secondary p-4 text-sm leading-relaxed">
          <span aria-hidden className="text-lg leading-none text-magenta">♥</span>
          <span>
            <span className="font-semibold">Un regal solidari.</span> Aquest sorteig ajuda les alumnes i els alumnes
            de 6è de l’Escola Volerany a fer el seu viatge de final de curs. Gràcies per participar-hi!
          </span>
        </p>
      </main>

      <footer className="mt-auto bg-ink text-paper">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Logo variant="dark" className="h-8" />
          <p className="text-xs text-paper/50">© 2026 Setnou Studio · Barcelona</p>
        </div>
      </footer>
    </div>
  );
}
