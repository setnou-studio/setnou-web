/**
 * Ruta servidor: recibe el briefing del navegador y lo reenvía al CRM con el
 * token Bearer. El token (CRM_BRIEFING_TOKEN = valor de CRM_API_KEY) es un
 * secreto y SOLO vive aquí, en el servidor — nunca en el código del navegador.
 *
 *   navegador (form) ──POST /api/enviar-briefing──▶ esta ruta (tiene el token)
 *                                                        │
 *                                                        ▼ POST /api/briefings
 *                                                       CRM (guarda + emails)
 */

// El briefing es una acción de envío: nunca cachear.
export const dynamic = "force-dynamic";

const CRM_URL =
  process.env["CRM_BRIEFING_URL"] ?? "https://crm.setnou.com/api/briefings";

export async function POST(req: Request) {
  const token = process.env["CRM_BRIEFING_TOKEN"];
  if (!token) {
    return Response.json(
      { error: { message: "El envío de briefings no está configurado todavía." } },
      { status: 500 },
    );
  }

  const datos = await req.json().catch(() => null);
  if (!datos || typeof datos !== "object") {
    return Response.json(
      { error: { message: "Petición inválida." } },
      { status: 400 },
    );
  }

  let r: Response;
  try {
    r = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...datos, lineaSlug: "setnou-studio" }),
    });
  } catch {
    return Response.json(
      { error: { message: "No hemos podido conectar con el CRM. Inténtalo de nuevo." } },
      { status: 502 },
    );
  }

  const json = await r.json().catch(() => ({}));
  return Response.json(json, { status: r.status });
}
