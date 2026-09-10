/**
 * Pruebas del motor de Caza Clientes.
 *
 *   npm test
 *
 * Node ejecuta este .ts directamente (type stripping nativo). Sin navegador,
 * sin framework: si la física o el marcador se rompen, esto falla.
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  crearJuego, reiniciar, paso, palaY, restanteDe, terminado,
  DURACION, BLOQUE, PALA_ANCHO,
  type Juego, type Item,
} from "./motor.ts";

/* RNG determinista (mulberry32): partidas reproducibles. */
function semilla(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DT = 1 / 60;

const nuevo = (sem: number) => {
  const g = crearJuego(360, 480, semilla(sem));
  reiniciar(g);
  return g;
};

const bloque = (g: Juego, x: number, spam: boolean, vy = 200): Item => ({
  x, y: palaY(g) - BLOQUE, vy, color: spam ? "#5B5C6B" : "#0075FF",
  spam, giro: 0, vGiro: 0, resuelto: false,
});

const avanzar = (g: Juego, frames: number) => {
  for (let i = 0; i < frames; i++) paso(g, DT, false);
};

/** Simula una partida entera con el jugador dado. */
function partida(sem: number, jugador?: (g: Juego) => void) {
  const g = nuevo(sem);
  let t = 0;
  while (g.activo && t < DURACION * 3) { jugador?.(g); paso(g, DT, false); t += DT; }
  return g;
}

/** Jugador ideal: va a por el cliente más bajo que no tenga spam pegado. */
function jugadorListo(g: Juego) {
  const spams = g.items.filter((it) => !it.resuelto && it.spam);
  const seguro = (it: Item) =>
    spams.every((s) => Math.abs(s.y - it.y) > 70 || Math.abs(s.x - it.x) > 55);
  const objetivo = g.items
    .filter((it) => !it.resuelto && !it.spam && seguro(it))
    .sort((a, b) => b.y - a.y)[0];
  if (objetivo) { g.palaX = objetivo.x; g.destinoX = objetivo.x; return; }
  if (spams.length) {
    const bajo = spams.sort((a, b) => b.y - a.y)[0];
    const refugio = bajo.x < g.w / 2 ? g.w - PALA_ANCHO / 2 : PALA_ANCHO / 2;
    g.palaX = refugio; g.destinoX = refugio;
  }
}

test("un cliente sobre la pala suma y no cuenta como perdido", () => {
  const g = nuevo(1);
  g.items.push(bloque(g, g.palaX, false));
  avanzar(g, 30);
  assert.equal(g.captados, 1);
  assert.equal(g.perdidos, 0);
});

test("atrapar spam resta un cliente y se contabiliza", () => {
  const g = nuevo(2);
  g.captados = 5;
  g.items.push(bloque(g, g.palaX, true));
  avanzar(g, 30);
  assert.equal(g.captados, 4);
  assert.equal(g.spamAtrapado, 1);
});

test("el marcador nunca baja de cero", () => {
  const g = nuevo(3);
  g.items.push(bloque(g, g.palaX, true));
  avanzar(g, 30);
  assert.equal(g.captados, 0);
});

test("un cliente que se escapa cuenta como perdido pero no resta", () => {
  const g = nuevo(4);
  g.captados = 3;
  g.items.push(bloque(g, 10, false, 400)); // lejos de la pala
  avanzar(g, 60);
  assert.equal(g.perdidos, 1);
  assert.equal(g.captados, 3);
});

test("esquivar el spam no cuesta nada", () => {
  const g = nuevo(5);
  g.captados = 3;
  g.items.push(bloque(g, 10, true, 400));
  avanzar(g, 60);
  assert.equal(g.captados, 3);
  assert.equal(g.perdidos, 0);
  assert.equal(g.spamAtrapado, 0);
});

test("la partida dura 45 s juegues como juegues", () => {
  // Este es el test que mató a la versión con vidas: un jugador perfecto
  // moría a los 40,6 s y el cierre "45 segundos" habría sido mentira.
  const quieto = partida(11);
  const listo = partida(7, jugadorListo);

  assert.ok(quieto.transcurrido >= DURACION, `quieto t=${quieto.transcurrido}`);
  assert.ok(listo.transcurrido >= DURACION, `listo t=${listo.transcurrido}`);
  assert.ok(!quieto.activo && terminado(quieto));
});

test("jugar bien puntúa mucho más que no jugar", () => {
  const quieto = partida(11);
  const listo = partida(7, jugadorListo);
  assert.ok(quieto.perdidos > 10, `perdidos=${quieto.perdidos}`);
  assert.ok(quieto.captados < 25, `quieto=${quieto.captados}`);
  assert.ok(listo.captados > 25, `listo=${listo.captados}`);
  assert.ok(listo.captados > quieto.captados * 2.5,
    `listo=${listo.captados} quieto=${quieto.captados}`);
});

test("el reloj cuenta de 45 a 0 sin errores de coma flotante", () => {
  const g = nuevo(8);
  assert.equal(restanteDe(g), DURACION);
  avanzar(g, 60 * 5);
  assert.equal(restanteDe(g), 40);
  while (g.activo) paso(g, DT, false);
  assert.equal(restanteDe(g), 0);
});

test("en pausa no corre el reloj ni aparecen bloques", () => {
  const g = nuevo(9);
  g.pausado = true;
  avanzar(g, 60 * 3);
  assert.equal(g.transcurrido, 0);
  assert.equal(g.items.length, 0);
});

test("la pala nunca se sale del tablero", () => {
  const g = nuevo(10);
  for (let i = 0; i < 300; i++) {
    g.destinoX = i % 2 ? -9999 : 9999; // el jugador empuja hacia fuera
    paso(g, DT, false);
    assert.ok(g.palaX >= PALA_ANCHO / 2 - 0.5 && g.palaX <= g.w - PALA_ANCHO / 2 + 0.5,
      `palaX=${g.palaX}`);
  }
});

test("los bloques se limpian al salir del tablero", () => {
  const g = partida(12);
  assert.ok(g.items.length < 15, `quedan ${g.items.length}`);
});

test("sobrevive a saltos de tiempo enormes (pestaña congelada)", () => {
  const g = nuevo(13);
  for (let i = 0; i < 10; i++) paso(g, 5, false);
  assert.ok(Number.isFinite(g.palaX));
  assert.ok(Number.isFinite(g.transcurrido));
  assert.ok(g.captados >= 0);
  assert.equal(g.activo, false);
});
