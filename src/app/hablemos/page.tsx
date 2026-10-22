import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { HablemosWizard } from "@/components/site/hablemos-wizard";
import { GameModal } from "@/components/game/game-modal";

const HABLEMOS_DESC =
  "Cuéntanos tu negocio en cuatro pasos y mira cómo va tomando forma tu web. Sin compromiso.";

export const metadata: Metadata = {
  title: "Hablemos de tu web",
  description: HABLEMOS_DESC,
  alternates: { canonical: "/hablemos" },
  openGraph: {
    title: "Hablemos de tu web · Setnou Studio",
    description: HABLEMOS_DESC,
    url: "/hablemos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hablemos de tu web · Setnou Studio",
    description: HABLEMOS_DESC,
  },
};

export default function HablemosPage() {
  return (
    <>
      {/* Cabecera simple: logo → inicio */}
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/" aria-label="Setnou Studio — inicio" className="shrink-0">
            <Logo className="h-7 md:h-8" />
          </Link>
          <span className="hidden items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-medium sm:inline-flex">
            <span className="size-2 rounded-full bg-magenta" />
            Te respondemos en menos de 24 h
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:pt-14">
        <HablemosWizard />
      </main>

      <GameModal />
    </>
  );
}
