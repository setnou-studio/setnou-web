"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { openContactModal } from "./contact-modal";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#nosotros", label: "Nosotros" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        "sticky top-0 z-50 bg-paper/90 backdrop-blur-md transition-[border-color,box-shadow]",
        scrolled
          ? "border-b-2 border-ink shadow-[0_4px_0_0_rgba(26,27,37,0.08)]"
          : "border-b-2 border-transparent"
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-3.5">
        {/* Logo */}
        <a href="#top" aria-label="Setnou Studio — inicio" className="shrink-0">
          <Logo className="h-7 md:h-8" />
        </a>

        {/* Links — centro (desktop) */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-[0.95rem] font-medium text-ink transition-colors"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-magenta transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openContactModal()}
            className="btn-pop hidden rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold text-ink md:inline-flex"
          >
            Hablemos →
          </button>

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 flex-col items-center justify-center gap-1.5 rounded-full border-2 border-ink md:hidden"
          >
            <span className={cn("block h-0.5 w-4 bg-ink transition-transform", open && "translate-y-[8px] rotate-45")} />
            <span className={cn("block h-0.5 w-4 bg-ink transition-opacity", open && "opacity-0")} />
            <span className={cn("block h-0.5 w-4 bg-ink transition-transform", open && "-translate-y-[8px] -rotate-45")} />
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <ul
        id="mobile-menu"
        className={cn(
          "absolute inset-x-0 top-full flex flex-col gap-1 border-b-2 border-ink bg-paper px-5 py-4 transition-transform md:hidden",
          open ? "translate-y-0" : "pointer-events-none -translate-y-[150%]"
        )}
      >
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-lg font-medium text-ink"
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openContactModal();
            }}
            className="mt-2 inline-flex rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Hablemos →
          </button>
        </li>
      </ul>
    </nav>
  );
}
