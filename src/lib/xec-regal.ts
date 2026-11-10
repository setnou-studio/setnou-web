/**
 * Xec regal de Nadal 2026 (sorteig solidari de l'Escola Volerany).
 *
 * Lógica pura, sin Next ni red, para poder probarla con `npm test`:
 *   - normalizar y comparar el código del cheque sin filtrar tiempos,
 *   - validar el número de butlleta y la caducidad,
 *   - montar el cuerpo que se envía a Yude (/api/briefings).
 *
 * El código real NUNCA va en el repo (es público): llega por la variable de
 * entorno XEC_REGAL_CODI. Si además se fija XEC_REGAL_BUTLLETA (el número
 * premiado, tras el sorteo), solo esa butlleta puede canjear.
 */

/** Último día para canjear (incluido), hora de Madrid. */
export const CADUCA = "2027-06-30";
export const ORIGEN = "Xec regal Nadal 2026 · Sorteig Escola Volerany";
export const IDIOMES = ["Català", "Castellà", "Anglès", "Francès"] as const;
export const MAX_IDIOMES = 2;

export type Configuracio = { codi?: string; butlleta?: string };

export type Validacio =
  | { ok: true }
  | { ok: false; status: number; motiu: "no_configurat" | "caducat" | "dades" | "incorrecte" };

/** Mayúsculas y solo letras y números: «vol26 tpwc-fhfn» = «VOL26TPWCFHFN». */
export function normalitzaCodi(codi: string): string {
  return codi.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Butlleta: de 1 a 6 dígitos, sin ceros delante («007» = «7»). */
export function normalitzaButlleta(butlleta: string): string | null {
  const net = butlleta.trim();
  if (!/^\d{1,6}$/.test(net)) return null;
  return String(Number(net));
}

/** Comparación en tiempo constante respecto al contenido. */
export function igualSegur(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/** ¿Ha caducado en `ara`? Cuenta el día CADUCA entero en hora de Madrid. */
export function caducat(ara: Date): boolean {
  const avui = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(ara);
  return avui > CADUCA;
}

export function validaXec(
  entrada: { codi?: unknown; butlleta?: unknown },
  config: Configuracio,
  ara: Date = new Date(),
): Validacio {
  const codiReal = normalitzaCodi(config.codi ?? "");
  if (!codiReal) return { ok: false, status: 503, motiu: "no_configurat" };
  if (caducat(ara)) return { ok: false, status: 410, motiu: "caducat" };
  if (typeof entrada.codi !== "string" || typeof entrada.butlleta !== "string") {
    return { ok: false, status: 400, motiu: "dades" };
  }
  const butlleta = normalitzaButlleta(entrada.butlleta);
  const codi = normalitzaCodi(entrada.codi);
  if (!butlleta || !codi) return { ok: false, status: 400, motiu: "dades" };

  let correcte = igualSegur(codi, codiReal);
  const premiada = config.butlleta ? normalitzaButlleta(config.butlleta) : null;
  if (premiada && !igualSegur(butlleta, premiada)) correcte = false;
  return correcte ? { ok: true } : { ok: false, status: 403, motiu: "incorrecte" };
}

export const MISSATGES: Record<Exclude<Validacio, { ok: true }>["motiu"], string> = {
  no_configurat: "El bescanvi encara no està actiu. Torna-ho a provar més tard o escriu-nos a hola@setnou.com.",
  caducat: "Aquest xec es podia bescanviar fins al 30-06-2027.",
  dades: "Revisa el número de butlleta i el codi del xec.",
  incorrecte: "El número de butlleta o el codi del xec no són correctes.",
};

export type Dades = {
  nom: string;
  email: string;
  telefon: string;
  negoci?: string;
  projecte?: string;
  idiomes?: string[];
  domini?: string;
};

/** Valida los datos del ganador; devuelve el error en catalán o null. */
export function errorDades(d: Partial<Record<keyof Dades, unknown>>): string | null {
  const text = (v: unknown, max: number) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
  if (!text(d.nom, 200)) return "Escriu el teu nom i cognoms.";
  if (!text(d.email, 200) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email).trim())) return "Escriu un correu electrònic vàlid.";
  if (!text(d.telefon, 60)) return "Escriu un telèfon de contacte.";
  for (const camp of ["negoci", "projecte", "domini"] as const) {
    const v = d[camp];
    if (v !== undefined && (typeof v !== "string" || v.length > 2000)) return "Hi ha un camp massa llarg.";
  }
  if (d.idiomes !== undefined) {
    if (!Array.isArray(d.idiomes) || d.idiomes.length > MAX_IDIOMES) return `Tria com a màxim ${MAX_IDIOMES} idiomes.`;
    if (d.idiomes.some((i) => !(IDIOMES as readonly string[]).includes(i as string))) return "Idioma no vàlid.";
  }
  return null;
}

/** Cuerpo para POST /api/briefings de Yude (línea Setnou Studio). */
export function cosBriefing(butlleta: string, codi: string, d: Dades) {
  const respostes: Record<string, string | string[]> = {
    Origen: ORIGEN,
    "Número de butlleta": normalitzaButlleta(butlleta) ?? butlleta,
    "Codi del xec": normalitzaCodi(codi),
    "Idioma de contacte": "Català",
  };
  if (d.projecte?.trim()) respostes["Com imagina la web"] = d.projecte.trim();
  if (d.idiomes?.length) respostes["Idiomes de la web"] = d.idiomes;
  if (d.domini?.trim()) respostes["Domini"] = d.domini.trim();
  return {
    nombreContacto: d.nom.trim(),
    email: d.email.trim(),
    telefono: d.telefon.trim(),
    ...(d.negoci?.trim() ? { empresaCliente: d.negoci.trim() } : {}),
    respuestas: respostes,
    lineaSlug: "setnou-studio",
  };
}
