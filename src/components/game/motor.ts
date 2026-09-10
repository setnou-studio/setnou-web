/**
 * Motor de Caza Clientes: toda la simulación, sin DOM ni React.
 *
 * Está separado del componente a propósito: así se puede ejecutar en Node
 * y comprobar que la física y el marcador hacen lo que decimos, sin
 * depender de que un navegador pinte nada.
 */

export const DURACION = 45; // segundos por partida
export const PALA_ANCHO = 78;
export const PALA_ALTO = 16;
export const BLOQUE = 26;

export const PALETA = {
  electric: "#0075FF",
  sky: "#00C0FF",
  magenta: "#FF4FD8",
  gold: "#FFB703",
  ink: "#1A1B25",
  paper: "#FAFAFF",
  muted: "#5B5C6B",
} as const;

const COLORES_CLIENTE = [
  PALETA.electric,
  PALETA.sky,
  PALETA.magenta,
  PALETA.gold,
];

export type Item = {
  x: number;
  y: number;
  vy: number;
  color: string;
  spam: boolean;
  giro: number;
  vGiro: number;
  /** Ya resuelto (atrapado o escapado): sigue en pantalla pero no puntúa. */
  resuelto: boolean;
};

export type Particula = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  color: string;
};

export type Juego = {
  w: number;
  h: number;
  palaX: number;
  destinoX: number;
  items: Item[];
  particulas: Particula[];
  proximoSpawn: number;
  transcurrido: number;
  captados: number;
  perdidos: number;
  /** Spam atrapado: cada uno resta un cliente del marcador. */
  spamAtrapado: number;
  activo: boolean;
  pausado: boolean;
  sacudida: number;
  /** Inyectable para poder hacer pruebas deterministas. */
  rng: () => number;
};

export function crearJuego(w = 360, h = 480, rng: () => number = Math.random): Juego {
  return {
    w,
    h,
    palaX: w / 2,
    destinoX: w / 2,
    items: [],
    particulas: [],
    proximoSpawn: 0,
    transcurrido: 0,
    captados: 0,
    perdidos: 0,
    spamAtrapado: 0,
    activo: false,
    pausado: false,
    sacudida: 0,
    rng,
  };
}

/** Deja el juego listo para una partida nueva, conservando tamaño y rng. */
export function reiniciar(g: Juego) {
  g.items = [];
  g.particulas = [];
  g.proximoSpawn = 0;
  g.transcurrido = 0;
  g.captados = 0;
  g.perdidos = 0;
  g.spamAtrapado = 0;
  g.sacudida = 0;
  g.activo = true;
  g.pausado = false;
  g.palaX = g.w / 2;
  g.destinoX = g.w / 2;
}

/** Altura a la que vive la pala dentro del tablero. */
export function palaY(g: Juego) {
  return g.h - 46;
}

/**
 * ¿Se acabó? Solo por reloj.
 *
 * Hubo una versión con 3 vidas y murió en las pruebas: incluso un jugador
 * perfecto la perdía a los 40,6 s, así que nadie llegaba nunca a los 45 y el
 * cierre "has captado N clientes en 45 segundos" habría sido falso.
 * La partida dura lo que dice que dura.
 */
export function terminado(g: Juego) {
  return g.transcurrido >= DURACION;
}

/**
 * Avanza la simulación dt segundos. Muta `g`.
 * `efectos` desactiva partículas y sacudida para prefers-reduced-motion.
 */
export function paso(g: Juego, dt: number, efectos = true) {
  if (!g.activo || g.pausado) return;

  g.transcurrido += dt;

  // La dificultad sube con el reloj: caen más rápido y más seguidos.
  const avance = Math.min(g.transcurrido / DURACION, 1);
  const cadencia = 0.85 - avance * 0.45; // de 0.85 s a 0.40 s entre bloques
  const velocidad = 120 + avance * 190;

  g.proximoSpawn -= dt;
  if (g.proximoSpawn <= 0) {
    g.proximoSpawn = cadencia;
    const spam = g.rng() < 0.18 + avance * 0.12;
    g.items.push({
      x: BLOQUE + g.rng() * (g.w - BLOQUE * 2),
      y: -BLOQUE,
      vy: velocidad * (0.85 + g.rng() * 0.35),
      color: spam
        ? PALETA.muted
        : COLORES_CLIENTE[Math.floor(g.rng() * COLORES_CLIENTE.length)],
      spam,
      giro: (g.rng() - 0.5) * 0.4,
      vGiro: (g.rng() - 0.5) * 1.2,
      resuelto: false,
    });
  }

  // La pala persigue al puntero con inercia suave.
  const limite = PALA_ANCHO / 2;
  g.destinoX = Math.min(Math.max(g.destinoX, limite), g.w - limite);
  g.palaX += (g.destinoX - g.palaX) * Math.min(dt * 16, 1);

  const py = palaY(g);

  for (const it of g.items) {
    it.y += it.vy * dt;
    it.giro += it.vGiro * dt;

    if (it.resuelto) continue;

    const tocaAlto = it.y + BLOQUE / 2 >= py && it.y - BLOQUE / 2 <= py + PALA_ALTO;
    const tocaAncho = Math.abs(it.x - g.palaX) <= limite + BLOQUE / 2;

    if (tocaAlto && tocaAncho) {
      it.resuelto = true;
      it.y = g.h + 999; // fuera del tablero: se limpia abajo

      if (it.spam) {
        // Perseguir un lead malo cuesta negocio real: resta un cliente.
        g.spamAtrapado += 1;
        g.captados = Math.max(0, g.captados - 1);
        if (efectos) g.sacudida = 10;
      } else {
        g.captados += 1;
        if (efectos) {
          for (let i = 0; i < 8; i++) {
            g.particulas.push({
              x: it.x,
              y: py,
              vx: (g.rng() - 0.5) * 190,
              vy: -g.rng() * 190,
              vida: 0.5,
              color: it.color,
            });
          }
        }
      }
      continue;
    }

    // Se escapó por abajo: se lo lleva la competencia.
    //
    // No cuesta vida a propósito. Con la cadencia final caen ~3,5 bloques a la
    // vez y la pala solo puede estar en un sitio: si fallar matase, ni un
    // jugador perfecto llegaría a los 45 s (medido: moría en 40,6 s) y el
    // cierre "has captado N en 45 segundos" sería falso. Fallar duele donde
    // tiene que doler: no puntúas. Como en el negocio real.
    if (it.y - BLOQUE / 2 > g.h) {
      it.resuelto = true;
      if (!it.spam) {
        g.perdidos += 1;
        if (efectos) g.sacudida = 6;
      }
    }
  }

  g.items = g.items.filter((it) => it.y - BLOQUE / 2 <= g.h + 40);

  for (const p of g.particulas) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 620 * dt;
    p.vida -= dt;
  }
  g.particulas = g.particulas.filter((p) => p.vida > 0);

  if (g.sacudida > 0) g.sacudida = Math.max(0, g.sacudida - dt * 40);

  if (terminado(g)) g.activo = false;
}

/**
 * Segundos que quedan, tal y como se muestran en el marcador.
 * El épsilon evita que la coma flotante enseñe 41 cuando toca 40.
 */
export function restanteDe(g: Juego) {
  return Math.max(0, Math.ceil(DURACION - g.transcurrido - 1e-6));
}
