"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { GAME_EVENT, type ContextoJuego } from "@/components/game/game-events";

/**
 * El juego se carga solo cuando alguien lo abre. Hasta entonces no viaja
 * ni un byte de canvas al navegador: la home mantiene sus Core Web Vitals,
 * que es literalmente uno de los servicios que vendemos.
 */
const CazaClientes = dynamic(() => import("@/components/game/caza-clientes"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center">
      <span className="text-sm text-muted-foreground">Preparando el tablero…</span>
    </div>
  ),
});

/** Modal del minijuego. Se monta una sola vez por página. */
export function GameModal() {
  const [open, setOpen] = useState(false);
  const [contexto, setContexto] = useState<ContextoJuego>("frio");

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detalle = (e as CustomEvent<{ contexto?: ContextoJuego }>).detail;
      setContexto(detalle?.contexto ?? "frio");
      setOpen(true);
    };
    window.addEventListener(GAME_EVENT, onOpen);
    return () => window.removeEventListener(GAME_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Caza Clientes, el minijuego de Setnou Studio"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl border-2 border-ink bg-paper p-5 shadow-[8px_8px_0_0_var(--color-ink)]">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar el juego"
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border-2 border-ink bg-paper transition-colors hover:bg-magenta"
        >
          <X className="size-4" />
        </button>

        <div className="pt-2">
          <CazaClientes contexto={contexto} />
        </div>
      </div>
    </div>
  );
}
