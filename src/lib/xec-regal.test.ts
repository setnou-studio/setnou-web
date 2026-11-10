/**
 * Pruebas del canje del xec regal.
 *
 *   npm test
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  validaXec, normalitzaCodi, normalitzaButlleta, igualSegur, caducat, errorDades, cosBriefing,
} from "./xec-regal.ts";

const CONFIG = { codi: "TEST-AAAA-BBBB" };
const ABANS = new Date("2026-12-26T10:00:00Z");

test("normaliza el código: mayúsculas, sin espacios ni guiones", () => {
  assert.equal(normalitzaCodi(" test aaaa-bbbb "), "TESTAAAABBBB");
});

test("normaliza la butlleta y rechaza lo que no son dígitos", () => {
  assert.equal(normalitzaButlleta("007"), "7");
  assert.equal(normalitzaButlleta(" 142 "), "142");
  assert.equal(normalitzaButlleta(""), null);
  assert.equal(normalitzaButlleta("12a"), null);
  assert.equal(normalitzaButlleta("-3"), null);
  assert.equal(normalitzaButlleta("1234567"), null);
});

test("igualSegur compara contenido y longitud", () => {
  assert.equal(igualSegur("ABC", "ABC"), true);
  assert.equal(igualSegur("ABC", "ABD"), false);
  assert.equal(igualSegur("ABC", "ABCD"), false);
  assert.equal(igualSegur("", ""), true);
});

test("código correcto, escrito de cualquier manera, pasa", () => {
  assert.deepEqual(validaXec({ codi: "test aaaa bbbb", butlleta: "57" }, CONFIG, ABANS), { ok: true });
});

test("código incorrecto no pasa", () => {
  const r = validaXec({ codi: "TEST-AAAA-BBBC", butlleta: "57" }, CONFIG, ABANS);
  assert.equal(r.ok, false);
  assert.equal(!r.ok && r.motiu, "incorrecte");
  assert.equal(!r.ok && r.status, 403);
});

test("sin código configurado no se puede canjear nada", () => {
  const r = validaXec({ codi: "", butlleta: "1" }, {}, ABANS);
  assert.equal(!r.ok && r.motiu, "no_configurat");
  const r2 = validaXec({ codi: "x", butlleta: "1" }, { codi: "  - " }, ABANS);
  assert.equal(!r2.ok && r2.motiu, "no_configurat");
});

test("datos vacíos o de otro tipo dan error de datos", () => {
  for (const entrada of [{}, { codi: "TEST-AAAA-BBBB" }, { codi: 1, butlleta: 2 }, { codi: "TEST-AAAA-BBBB", butlleta: "abc" }]) {
    const r = validaXec(entrada as { codi?: unknown; butlleta?: unknown }, CONFIG, ABANS);
    assert.equal(!r.ok && r.motiu, "dades", JSON.stringify(entrada));
  }
});

test("con butlleta premiada configurada, solo esa canjea", () => {
  const config = { ...CONFIG, butlleta: "142" };
  assert.deepEqual(validaXec({ codi: "TEST-AAAA-BBBB", butlleta: "0142" }, config, ABANS), { ok: true });
  const r = validaXec({ codi: "TEST-AAAA-BBBB", butlleta: "141" }, config, ABANS);
  assert.equal(!r.ok && r.motiu, "incorrecte");
});

test("caducidad: el 30-06-2027 entero vale (hora de Madrid), el 1-07 no", () => {
  assert.equal(caducat(new Date("2027-06-30T21:59:00Z")), false); // 23:59 en Madrid
  assert.equal(caducat(new Date("2027-06-30T22:01:00Z")), true);  // 00:01 del 1-07
  const r = validaXec({ codi: "TEST-AAAA-BBBB", butlleta: "1" }, CONFIG, new Date("2027-07-02T10:00:00Z"));
  assert.equal(!r.ok && r.motiu, "caducat");
});

test("errorDades exige nombre, email válido y teléfono", () => {
  const bo = { nom: "Anna Puig", email: "anna@example.com", telefon: "600000000" };
  assert.equal(errorDades(bo), null);
  assert.match(errorDades({ ...bo, nom: "  " }) ?? "", /nom/);
  assert.match(errorDades({ ...bo, email: "anna@" }) ?? "", /correu/);
  assert.match(errorDades({ ...bo, telefon: "" }) ?? "", /telèfon/);
  assert.match(errorDades({ ...bo, idiomes: ["Català", "Castellà", "Anglès"] }) ?? "", /màxim/);
  assert.match(errorDades({ ...bo, idiomes: ["Klingon"] }) ?? "", /Idioma/);
  assert.match(errorDades({ ...bo, projecte: "x".repeat(2001) }) ?? "", /llarg/);
});

test("cosBriefing manda butlleta y código normalizados y la línea de Setnou Studio", () => {
  const cos = cosBriefing("007", "test aaaa-bbbb", {
    nom: " Anna Puig ", email: "anna@example.com", telefon: "600", negoci: "", idiomes: ["Català"],
  });
  assert.equal(cos.nombreContacto, "Anna Puig");
  assert.equal(cos.lineaSlug, "setnou-studio");
  assert.equal("empresaCliente" in cos, false);
  assert.equal(cos.respuestas["Número de butlleta"], "7");
  assert.equal(cos.respuestas["Codi del xec"], "TESTAAAABBBB");
  assert.deepEqual(cos.respuestas["Idiomes de la web"], ["Català"]);
});
