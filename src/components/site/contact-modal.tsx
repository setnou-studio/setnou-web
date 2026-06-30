"use client";

import { useEffect, useRef, useState } from "react";
import { X, MessageCircle, Mail } from "lucide-react";

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

  // Datos de contacto de Setnou
  const WHATSAPP = "34674743999"; // +34 674 743 999
  const EMAIL = "hola@setnou.com";

  const formRef = useRef<HTMLFormElement>(null);

  function getData() {
    const fd = new FormData(formRef.current!);
    return {
      nombre: String(fd.get("nombre") || ""),
      tel: String(fd.get("tel") || ""),
      email: String(fd.get("email") || ""),
      empresa: String(fd.get("empresa") || ""),
    };
  }

  // Envío por WhatsApp (canal principal)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = getData();
    const msg = encodeURIComponent(
      `Hola Setnou 👋 Soy ${d.nombre}.\nTeléfono: ${d.tel}\nEmail: ${d.email}\n\nSobre mi empresa:\n${d.empresa}`
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank", "noopener");
    setSent(true);
  }

  // Envío por email (alternativa)
  function sendEmail() {
    const form = formRef.current;
    if (!form) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = getData();
    const body = encodeURIComponent(
      `Nombre: ${d.nombre}\nTeléfono: ${d.tel}\nEmail: ${d.email}\n\nSobre la empresa:\n${d.empresa}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      "Nuevo proyecto — " + d.nombre
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
              Hemos preparado tu mensaje con los datos. Termina de enviarlo en la
              ventana que se ha abierto y te contestamos enseguida.
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

            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                    placeholder="674 743 999"
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
                className="btn-pop mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-4 text-base font-semibold text-ink"
              >
                <MessageCircle className="size-5" /> Enviar por WhatsApp
              </button>
              <button
                type="button"
                onClick={sendEmail}
                className="-mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                <Mail className="size-4" /> Prefiero enviarlo por email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
