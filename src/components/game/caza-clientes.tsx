"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { irAHablemos } from "@/components/site/hablemos-link";
import {
  crearJuego, reiniciar, paso, palaY, restanteDe,
  DURACION, PALA_ANCHO, PALA_ALTO, BLOQUE, PALETA,
  type Juego, type Item,
} from "@/components/game/motor";

/* ════════════════════════════════════════════════════════════
   Caza Clientes — minijuego de marca de Setnou Studio

   Los clientes caen. Los atrapas con tu web. Los que se te
   escapan se van a la competencia. El marcador no cuenta
   puntos: cuenta clientes captados, para que el cierre duela
   donde toca.

   Aquí solo viven el lienzo, los controles y el pintado.
   La simulación está en motor.ts, que se prueba en Node.
   ════════════════════════════════════════════════════════════ */

const RECORD_KEY = "setnou:caza-clientes:record";

type Estado = "inicio" | "jugando" | "fin";

export default function CazaClientes({
  contexto = "frio",
}: {
  contexto?: "frio" | "post-envio";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* El juego vive en un ref: cambiarlo no debe re-renderizar React. */
  const juegoRef = useRef<Juego | null>(null);
  if (juegoRef.current === null) juegoRef.current = crearJuego();

  const [estado, setEstado] = useState<Estado>("inicio");
  const [captados, setCaptados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  const [restante, setRestante] = useState(DURACION);
  const [pausado, setPausado] = useState(false);
  /* Se leen una sola vez al montar. El componente solo corre en cliente
     (se importa con ssr:false), así que window existe ya en el primer render. */
  const [record, setRecord] = useState<number | null>(() => {
    try {
      const v = window.localStorage.getItem(RECORD_KEY);
      return v ? Number(v) || 0 : null;
    } catch {
      return null; // modo privado o cookies bloqueadas: se juega igual, sin récord
    }
  });
  const [reducido] = useState(() => {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });

  /* Espejos de lo mostrado: solo tocamos React cuando el número cambia. */
  const vistos = useRef({ captados: 0, perdidos: 0, restante: DURACION });

  /* ── Tamaño del lienzo, responsive y nítido en pantallas retina ── */
  const medir = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const g = juegoRef.current;
    if (!wrap || !canvas || !g) return;

    const w = Math.max(280, Math.min(440, wrap.clientWidth));
    const h = Math.max(360, Math.min(560, Math.round(w * 1.32)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);

    g.w = w;
    g.h = h;
    g.palaX = Math.min(Math.max(g.palaX, PALA_ANCHO / 2), w - PALA_ANCHO / 2);
    g.destinoX = g.palaX;
  }, []);

  useEffect(() => {
    medir();
    const ro = new ResizeObserver(medir);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [medir]);

  /* ── Arrancar partida ── */
  const empezar = useCallback(() => {
    const g = juegoRef.current!;
    reiniciar(g);
    vistos.current = { captados: 0, perdidos: 0, restante: DURACION };
    setCaptados(0);
    setPerdidos(0);
    setRestante(DURACION);
    setPausado(false);
    setEstado("jugando");
  }, []);

  const reanudar = useCallback(() => {
    juegoRef.current!.pausado = false;
    setPausado(false);
  }, []);

  /* ── Guardar récord al terminar ── */
  const terminarPartida = useCallback(() => {
    const g = juegoRef.current!;
    setEstado("fin");
    setRecord((prev) => {
      const mejor = Math.max(prev ?? 0, g.captados);
      try {
        window.localStorage.setItem(RECORD_KEY, String(mejor));
      } catch {
        /* sin persistencia: el marcador de esta partida ya se ve igual */
      }
      return mejor;
    });
  }, []);

  /* ── Control: puntero y teclado ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mover = (clienteX: number) => {
      const rect = canvas.getBoundingClientRect();
      juegoRef.current!.destinoX = clienteX - rect.left;
    };

    const onPointer = (e: PointerEvent) => mover(e.clientX);
    const onTouch = (e: TouchEvent) => {
      // Sin esto, arrastrar el dedo sobre el tablero hace scroll de la página.
      if (juegoRef.current!.activo) e.preventDefault();
      if (e.touches[0]) mover(e.touches[0].clientX);
    };
    const onTecla = (e: KeyboardEvent) => {
      const g = juegoRef.current!;
      if (!g.activo) return;
      if (e.key === "ArrowLeft") { g.destinoX -= 34; e.preventDefault(); }
      if (e.key === "ArrowRight") { g.destinoX += 34; e.preventDefault(); }
    };

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("keydown", onTecla);
    return () => {
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onTecla);
    };
  }, []);

  /* ── Pausa al cambiar de pestaña: nadie pierde una partida por alt-tab ── */
  useEffect(() => {
    const onVis = () => {
      const g = juegoRef.current!;
      if (document.hidden && g.activo) {
        g.pausado = true;
        setPausado(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* ── Bucle: avanzar el motor y pintar ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let anterior = performance.now();

    const dibujarFondo = (g: Juego) => {
      ctx.fillStyle = PALETA.paper;
      ctx.fillRect(0, 0, g.w, g.h);
      // Retícula de puntos: da profundidad sin competir con los bloques.
      ctx.fillStyle = "rgba(26, 27, 37, 0.10)";
      for (let y = 24; y < g.h; y += 32) {
        for (let x = 24; x < g.w; x += 32) ctx.fillRect(x, y, 2, 2);
      }
    };

    const dibujarItem = (it: Item) => {
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.giro);
      ctx.fillStyle = it.resuelto ? "rgba(91, 92, 107, 0.35)" : it.color;
      ctx.strokeStyle = it.resuelto ? "rgba(26, 27, 37, 0.25)" : PALETA.ink;
      ctx.lineWidth = 2;
      const m = BLOQUE / 2;
      ctx.beginPath();
      ctx.roundRect(-m, -m, BLOQUE, BLOQUE, 6);
      ctx.fill();
      ctx.stroke();

      // El spam lleva aspa: "los clientes tienen color, el spam es gris".
      if (it.spam && !it.resuelto) {
        ctx.strokeStyle = PALETA.paper;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-5, -5); ctx.lineTo(5, 5);
        ctx.moveTo(5, -5); ctx.lineTo(-5, 5);
        ctx.stroke();
      }
      ctx.restore();
    };

    const bucle = (ahora: number) => {
      raf = requestAnimationFrame(bucle);
      const g = juegoRef.current!;

      // dt acotado: si la pestaña se congela, no queremos un salto gigante.
      const dt = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;

      const estabaActivo = g.activo;
      paso(g, dt, !reducido);

      /* Sincronizar con React solo cuando cambia algo visible. */
      const v = vistos.current;
      if (g.captados !== v.captados) { v.captados = g.captados; setCaptados(g.captados); }
      if (g.perdidos !== v.perdidos) { v.perdidos = g.perdidos; setPerdidos(g.perdidos); }
      const seg = restanteDe(g);
      if (seg !== v.restante) { v.restante = seg; setRestante(seg); }
      if (estabaActivo && !g.activo) terminarPartida();

      /* Pintado */
      ctx.save();
      if (g.sacudida > 0) {
        ctx.translate((Math.random() - 0.5) * g.sacudida, (Math.random() - 0.5) * g.sacudida);
      }

      dibujarFondo(g);
      for (const it of g.items) dibujarItem(it);

      for (const p of g.particulas) {
        ctx.globalAlpha = Math.max(0, p.vida / 0.5);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
      }
      ctx.globalAlpha = 1;

      // La pala: tu web. Tinta con canto magenta, como los botones del sitio.
      const py = palaY(g);
      ctx.fillStyle = PALETA.ink;
      ctx.beginPath();
      ctx.roundRect(g.palaX - PALA_ANCHO / 2, py, PALA_ANCHO, PALA_ALTO, 8);
      ctx.fill();
      ctx.fillStyle = PALETA.magenta;
      ctx.beginPath();
      ctx.roundRect(g.palaX - PALA_ANCHO / 2 + 8, py + 3, PALA_ANCHO - 16, 3, 2);
      ctx.fill();

      ctx.restore();
    };

    raf = requestAnimationFrame(bucle);
    return () => cancelAnimationFrame(raf);
  }, [reducido, terminarPartida]);

  /* ── Copys del cierre según de dónde venga el jugador ── */
  const cierre =
    contexto === "post-envio"
      ? {
          titulo: "Tu presupuesto ya está en camino.",
          gancho:
            "Esto que acabas de jugar lo montamos nosotros. Lo mismo podemos hacer en tu web.",
          // Ya ha convertido: aquí no se vende otra vez.
          cta: null as string | null,
        }
      : {
          titulo: "¿Y tu web, cuántos captó el mes pasado?",
          gancho:
            "Tú has captado clientes durante 45 segundos. Tu web tiene que hacerlo los 30 días.",
          cta: "Quiero que mi web cace clientes",
        };

  return (
    <div ref={wrapRef} className="flex w-full flex-col items-center gap-4">
      {/* ── Marcador ── */}
      <div className="flex w-full max-w-[440px] items-center justify-between gap-3 font-display">
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold leading-none tracking-tight text-electric">
            {captados}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Captados
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span
            className={`text-3xl font-extrabold leading-none tracking-tight ${
              restante <= 10 && estado === "jugando" ? "text-magenta" : "text-ink"
            }`}
          >
            {restante}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Segundos
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-3xl font-extrabold leading-none tracking-tight text-muted-foreground">
            {perdidos}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Escapados
          </span>
        </div>
      </div>

      {/* ── Tablero ── */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-ink">
        <canvas
          ref={canvasRef}
          className="block touch-none"
          aria-label="Tablero del juego Caza Clientes"
          role="img"
        />

        {pausado && estado === "jugando" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/92 px-6 text-center text-paper">
            <h3 className="font-display text-2xl font-extrabold tracking-tight">
              Partida en pausa
            </h3>
            <p className="max-w-[16rem] text-sm text-paper/70">
              Saliste de la pestaña. Tu marcador sigue intacto.
            </p>
            <button
              type="button"
              onClick={reanudar}
              className="btn-pop inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-3 font-semibold text-ink"
            >
              Seguir <ArrowRight className="size-5" />
            </button>
          </div>
        ) : null}

        {estado === "jugando" ? null : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/92 px-6 text-center text-paper">
            {estado === "inicio" ? (
              <>
                <h3 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight">
                  Caza Clientes
                </h3>
                <p className="max-w-[17rem] text-sm leading-relaxed text-paper/80">
                  Los clientes caen. Atrápalos con tu web. Los que se te escapan se
                  los queda la competencia.
                </p>
                <p className="max-w-[17rem] text-sm leading-relaxed text-paper/60">
                  Los clientes tienen color. El spam es gris: si lo atrapas, te resta
                  un cliente.
                </p>
                <button
                  type="button"
                  onClick={empezar}
                  className="btn-pop mt-1 inline-flex items-center gap-2 rounded-full bg-magenta px-7 py-3 font-semibold text-ink"
                >
                  Jugar <ArrowRight className="size-5" />
                </button>
                <p className="text-xs text-paper/50">
                  Mueve el dedo o el ratón. También van las flechas.
                </p>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-2 rounded-full bg-magenta px-4 py-1.5 text-sm font-semibold text-ink">
                  Has captado {captados} {captados === 1 ? "cliente" : "clientes"} en 45 s
                </span>
                <h3 className="max-w-[19rem] font-display text-2xl font-extrabold leading-[1.1] tracking-tight">
                  {cierre.titulo}
                </h3>
                <p className="max-w-[18rem] text-sm leading-relaxed text-paper/75">
                  {cierre.gancho}
                </p>
                {perdidos > 0 ? (
                  <p className="text-sm text-paper/55">
                    Se te escaparon {perdidos}. Eso, en tu negocio, son facturas.
                  </p>
                ) : null}
                {record !== null && record > captados ? (
                  <p className="text-xs text-paper/45">Tu récord: {record}</p>
                ) : null}

                <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
                  {cierre.cta ? (
                    <button
                      type="button"
                      onClick={() => irAHablemos()}
                      className="btn-pop inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-ink"
                    >
                      {cierre.cta} <ArrowRight className="size-4" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={empezar}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-paper/30 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:border-paper"
                  >
                    <RotateCcw className="size-4" /> Otra
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
