"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "setnou-cookies";
const PREFS_EVENT = "setnou:cookie-prefs";
const CONSENT_EVENT = "setnou:consent";

/** Reabre el banner para cambiar las preferencias de cookies. */
export function openCookiePrefs() {
  window.dispatchEvent(new CustomEvent(PREFS_EVENT));
}

/** Enlace "Preferencias de cookies" para el pie. */
export function CookiePrefsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openCookiePrefs()}
      className={className ?? "transition-colors hover:text-magenta"}
    >
      Preferencias de cookies
    </button>
  );
}

/** Avisa al resto de la app (p. ej. Analytics) del consentimiento elegido. */
function emitConsent(granted: boolean) {
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: { analytics: granted } })
  );
  // Consent Mode v2 (si Google Analytics está cargado)
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}

/**
 * Aviso de cookies. Aparece en la primera visita y cuando el usuario pulsa
 * "Preferencias de cookies". La elección se guarda en localStorage y se
 * comunica a Analytics (Consent Mode v2): no se mide nada sin aceptar.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
    const reopen = () => setVisible(true);
    window.addEventListener(PREFS_EVENT, reopen);
    return () => window.removeEventListener(PREFS_EVENT, reopen);
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* almacenamiento no disponible */
    }
    emitConsent(value === "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-6 left-6 z-[60] w-[calc(100%-3rem)] max-w-sm rounded-2xl border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <p className="text-sm font-semibold">🍪 Usamos cookies</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Usamos cookies propias necesarias para que la web funcione. Con tu
        permiso, también usaremos cookies de análisis para entender cómo se usa
        y mejorarla. Más información en nuestra{" "}
        <a href="/cookies" className="font-medium text-ink underline underline-offset-2">
          política de cookies
        </a>
        .
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
