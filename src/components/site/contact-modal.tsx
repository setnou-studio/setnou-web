"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";

const EVENT = "setnou:open-contact";

/** Llama a esto desde cualquier componente cliente para abrir el formulario. */
export function openContactModal() {
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Disparador reutilizable (botón) que abre el formulario. */
export function ContactTrigger({
  className,
  children,
  ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => openContactModal()}
      className={className}
    >
      {children}
    </button>
  );
}

/** Modal con el formulario. Se monta una sola vez en la página. */
export function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Abrir al recibir el evento global
  useEffect(() => {
    const onOpen = () => {
      setSent(false);
      setOpen(true);
    };
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  // Cerrar con Escape + bloquear scroll del fondo + foco inicial
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nombre = String(fd.get("nombre") || "");
    const tel = String(fd.get("tel") || "");
    const email = String(fd.get("email") || "");
    const empresa = String(fd.get("empresa") || "");

    // Sin backend: componemos un email con los datos del lead.
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nTeléfono: ${tel}\nEmail: ${email}\n\nSobre la empresa:\n${empresa}`
    );
    window.location.href = `mailto:hola@setnou.studio?subject=${encodeURIComponent(
      "Nuevo proyecto — " + nombre
    )}&body=${body}`;
    setSent(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
    >
      {/* Fondo */}
      <button
        type="button"
        aria-label="Cerrar formulario"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      {/* Tarjeta */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg rounded-3xl border-2 border-ink bg-paper p-7 shadow-[8px_8px_0_0_var(--color-ink)] md:p-9"
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setOpen(false)}
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full border-2 border-ink transition-colors hover:bg-magenta"
        >
          <X className="size-4" />
        </button>

        {sent ? (
          <div className="py-6">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-magenta px-4 py-1.5 text-sm font-semibold text-ink">
              ¡Recibido!
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              Gracias, te escribimos enseguida.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hemos abierto tu correo con los datos. Si prefieres, escríbenos por
              WhatsApp y empezamos hoy mismo.
            </p>
          </div>
        ) : (
          <>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 text-xs font-semibold">
              <span className="size-2 rounded-full bg-magenta" />
              Diseño gratis, sin compromiso
            </span>
            <h2
              id="contact-title"
              className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight"
            >
              Estás a un paso de ganar dinero de verdad
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Te respondemos en menos de 24 h con los siguientes pasos.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Nombre
                <input
                  ref={firstFieldRef}
                  name="nombre"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className="rounded-xl border-2 border-ink bg-card px-4 py-3 text-base font-normal outline-none focus:border-magenta"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Teléfono
                  <input
                    name="tel"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="600 000 000"
                    className="rounded-xl border-2 border-ink bg-card px-4 py-3 text-base font-normal outline-none focus:border-magenta"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@email.com"
                    className="rounded-xl border-2 border-ink bg-card px-4 py-3 text-base font-normal outline-none focus:border-magenta"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-sm font-medium">
                ¿De qué va tu empresa?
                <textarea
                  name="empresa"
                  required
                  rows={4}
                  placeholder="Cuéntanos a qué os dedicáis y qué necesitáis de vuestra web…"
                  className="resize-none rounded-xl border-2 border-ink bg-card px-4 py-3 text-base font-normal outline-none focus:border-magenta"
                />
              </label>

              <button
                type="submit"
                className="btn-pop mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper"
              >
                Enviar <ArrowRight className="size-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
