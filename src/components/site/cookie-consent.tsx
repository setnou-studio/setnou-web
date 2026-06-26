"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "setnou-cookies";

/**
 * Aviso de cookies. Aparece abajo a la izquierda hasta que el usuario
 * acepta o rechaza; la elección se guarda en localStorage.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* almacenamiento no disponible */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-6 left-6 z-50 w-[calc(100%-3rem)] max-w-sm rounded-2xl border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <p className="text-sm font-semibold">🍪 Usamos cookies</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Utilizamos cookies propias y de terceros para mejorar tu experiencia y
        analizar el tráfico. Puedes aceptarlas o rechazarlas.
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="btn-pop inline-flex flex-1 items-center justify-center rounded-full bg-magenta px-4 py-2.5 text-sm font-semibold text-ink"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => decide("rejected")}
          className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-ink px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
