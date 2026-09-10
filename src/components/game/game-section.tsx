"use client";

import { Gamepad2, ArrowRight } from "lucide-react";
import { openGameModal } from "@/components/game/game-events";

/**
 * Entrada al minijuego desde la home: el arma de canal frío.
 * Quien llega sin conocernos juega 45 segundos y se lleva el gancho.
 * Es opt-in a propósito — nada se abre solo.
 */
export function GameSection() {
  return (
    <section
      id="desafio"
      className="border-b-2 border-ink bg-gold text-ink"
      aria-labelledby="desafio-titulo"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="reveal inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold">
            <Gamepad2 className="size-4" aria-hidden />
            El desafío Setnou
          </span>

          <h2
            id="desafio-titulo"
            className="reveal max-w-2xl font-display text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[1.0] tracking-[-0.03em]"
          >
            ¿Tienes{" "}
            <span className="highlight inline-block rounded-md bg-ink text-paper">
              45 segundos
            </span>
            ?
          </h2>

          <p className="reveal max-w-lg text-lg leading-relaxed text-ink/80">
            Los clientes caen. Atrápalos con tu web. Los que se te escapan se los
            queda la competencia. Es un juego, pero ya sabes de qué va.
          </p>

          <p className="reveal max-w-lg leading-relaxed text-ink/65">
            Lo hemos montado para nuestra propia web. Si te parece guapo, imagina
            lo que podemos hacer con la tuya.
          </p>

          <button
            type="button"
            onClick={() => openGameModal("frio")}
            className="btn-pop reveal inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-lg font-semibold text-paper"
          >
            Jugar a Caza Clientes <ArrowRight className="size-5" />
          </button>
        </div>

        {/* Guiño visual: los mismos bloques que caen en el juego. */}
        <div aria-hidden className="reveal hidden justify-center md:flex">
          <div className="grid grid-cols-3 gap-4">
            {[
              "bg-electric",
              "bg-paper",
              "bg-magenta",
              "bg-sky",
              "bg-ink",
              "bg-paper",
              "bg-paper",
              "bg-magenta",
              "bg-electric",
            ].map((c, i) => (
              <span
                key={i}
                className={`size-16 rounded-xl border-2 border-ink ${c}`}
                style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
