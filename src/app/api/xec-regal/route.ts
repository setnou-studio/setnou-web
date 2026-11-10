/**
 * Canje del xec regal de Nadal 2026.
 *
 *   navegador ──POST /api/xec-regal { pas: "validar", butlleta, codi }──▶ comprueba el cheque
 *   navegador ──POST /api/xec-regal { pas: "enviar", butlleta, codi, ...dades }──▶
 *        vuelve a comprobar el cheque ──POST /api/briefings──▶ Yude
 *        (alta del contacto en Setnou Studio + aviso por correo a Setnou)
 *
 * Variables de entorno:
 *   XEC_REGAL_CODI       código impreso en el cheque (obligatoria; el repo es público).
 *   XEC_REGAL_BUTLLETA   número premiado (opcional; si está, solo esa butlleta canjea).
 *   CRM_BRIEFING_TOKEN   la misma clave que usa /api/enviar-briefing.
 *   CRM_BRIEFING_URL     opcional, por defecto app.yude.es.
 */
import { validaXec, MISSATGES, errorDades, cosBriefing, type Dades } from "@/lib/xec-regal";

export const dynamic = "force-dynamic";

const CRM_URL = process.env["CRM_BRIEFING_URL"] ?? "https://app.yude.es/api/briefings";

const error = (message: string, status: number) => Response.json({ error: { message } }, { status });

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object" || Array.isArray(body)) return error("Petició no vàlida.", 400);

  // Antispam (honeypot): respondemos OK para no dar pistas y no enviamos nada.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const v = validaXec(body, {
    codi: process.env["XEC_REGAL_CODI"],
    butlleta: process.env["XEC_REGAL_BUTLLETA"],
  });
  if (!v.ok) return error(MISSATGES[v.motiu], v.status);

  if (body.pas === "validar") return Response.json({ ok: true });
  if (body.pas !== "enviar") return error("Petició no vàlida.", 400);

  const problema = errorDades(body);
  if (problema) return error(problema, 400);

  const token = process.env["CRM_BRIEFING_TOKEN"];
  if (!token) return error(MISSATGES.no_configurat, 503);

  const cos = cosBriefing(body.butlleta as string, body.codi as string, body as unknown as Dades);
  let r: Response;
  try {
    r = await fetch(CRM_URL, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(cos),
    });
  } catch {
    return error("No hem pogut enviar les dades. Torna-ho a provar d'aquí a una estona.", 502);
  }
  if (!r.ok) {
    console.error("xec-regal: Yude respondió", r.status, await r.text().catch(() => ""));
    return error("No hem pogut enviar les dades. Torna-ho a provar o escriu-nos a cristian@setnou.com.", 502);
  }
  return Response.json({ ok: true });
}
