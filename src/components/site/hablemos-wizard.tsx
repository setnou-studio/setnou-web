"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Gamepad2,
  Loader2,
  MessageCircle,
  Plus,
  Send,
} from "lucide-react";
import { openGameModal } from "@/components/game/game-events";

/* ── Opciones ── */

type Estilo = {
  id: string;
  nombre: string;
  desc: string;
  fuente: string;
  peso: number;
  radio: string;
  centrado: boolean;
  /** Hero con fondo de color principal (true) o sobre el fondo claro (false). */
  heroColor: boolean;
};

const ESTILOS: Estilo[] = [
  { id: "minimal", nombre: "Minimalista", desc: "Limpio, mucho aire, poco ruido.", fuente: "var(--font-sans), system-ui, sans-serif", peso: 600, radio: "6px", centrado: false, heroColor: false },
  { id: "atrevido", nombre: "Atrevido", desc: "Colores fuertes y titulares grandes.", fuente: "var(--font-display), sans-serif", peso: 800, radio: "14px", centrado: false, heroColor: true },
  { id: "elegante", nombre: "Elegante", desc: "Sobrio, con serifa, aire premium.", fuente: "Georgia, 'Times New Roman', serif", peso: 500, radio: "0px", centrado: true, heroColor: false },
  { id: "cercano", nombre: "Cercano", desc: "Cálido, redondeado y amable.", fuente: "ui-rounded, 'Arial Rounded MT Bold', var(--font-sans), sans-serif", peso: 700, radio: "999px", centrado: true, heroColor: true },
];

type Paleta = {
  id: string;
  nombre: string;
  /** [principal, acento, fondo] — null: que lo decida Setnou. */
  colores: [string, string, string] | null;
};

const PALETAS: Paleta[] = [
  { id: "azul", nombre: "Azul confianza", colores: ["#0B3D91", "#4F8FE8", "#F4F7FC"] },
  { id: "verde", nombre: "Verde natural", colores: ["#2F5D3A", "#9BC53D", "#F6F4EC"] },
  { id: "terracota", nombre: "Terracota cálido", colores: ["#B5502D", "#E9B872", "#FBF5EE"] },
  { id: "bn", nombre: "Blanco y negro", colores: ["#111111", "#8A8A8A", "#FFFFFF"] },
  { id: "pop", nombre: "Pop vibrante", colores: ["#6C2BD9", "#FF4FD8", "#FFF8FD"] },
  { id: "libre", nombre: "Que lo decidáis vosotros", colores: null },
];

const PESTANAS_SUGERIDAS = [
  "Inicio",
  "Servicios",
  "Sobre nosotros",
  "Proyectos",
  "Tienda",
  "Blog",
  "Preguntas frecuentes",
  "Contacto",
];

const DOMINIO_OPCIONES = ["Sí, ya lo tengo", "No, aún no", "No lo sé"] as const;

const PASOS = ["Tu negocio", "Estilo", "Colores", "Menú", "Contacto"] as const;

const WHATSAPP = "34627411942";

type Datos = {
  empresa: string;
  actividad: string;
  dominio: (typeof DOMINIO_OPCIONES)[number] | "";
  dominioCual: string;
  estilo: string;
  paleta: string;
  coloresMarca: string;
  sabeMenu: "si" | "no" | "";
  pestanas: string[];
  nombre: string;
  email: string;
  telefono: string;
  comentario: string;
};

const INICIAL: Datos = {
  empresa: "",
  actividad: "",
  dominio: "",
  dominioCual: "",
  estilo: "",
  paleta: "",
  coloresMarca: "",
  sabeMenu: "",
  pestanas: [],
  nombre: "",
  email: "",
  telefono: "",
  comentario: "",
};

type Estado = "idle" | "enviando" | "ok" | "error";

/** Qué falta para poder pasar del paso `paso` (null = todo listo). */
function faltaEnPaso(paso: number, d: Datos): string | null {
  if (paso === 0 && !d.empresa.trim()) return "Dinos cómo se llama tu negocio.";
  if (paso === 1 && !d.estilo) return "Elige el estilo que más te guste.";
  if (paso === 2 && !d.paleta) return "Elige unos colores (o deja que lo decidamos).";
  if (paso === 3 && !d.sabeMenu) return "Dinos si ya sabes qué pestañas quieres.";
  if (paso === 3 && d.sabeMenu === "si" && d.pestanas.length === 0)
    return "Marca al menos una pestaña.";
  return null;
}

/** Dominio que se enseña en la barra del navegador de la vista previa. */
function dominioPreview(d: Datos) {
  if (d.dominio === "Sí, ya lo tengo" && d.dominioCual.trim())
    return d.dominioCual.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const slug = d.empresa
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");
  return `${slug || "tuempresa"}.com`;
}

export function HablemosWizard() {
  const [paso, setPaso] = useState(0);
  const [d, setD] = useState<Datos>(INICIAL);
  const [aviso, setAviso] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensajeError, setMensajeError] = useState("");
  const [nuevaPestana, setNuevaPestana] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Datos>(k: K, v: Datos[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setAviso("");
  };

  function togglePestana(p: string) {
    set("pestanas", d.pestanas.includes(p) ? d.pestanas.filter((x) => x !== p) : [...d.pestanas, p]);
  }

  function anadirPestana() {
    const p = nuevaPestana.trim();
    if (p && !d.pestanas.includes(p)) set("pestanas", [...d.pestanas, p]);
    setNuevaPestana("");
  }

  const ultimo = paso === PASOS.length - 1;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const falta = faltaEnPaso(paso, d);
    if (falta) {
      setAviso(falta);
      return;
    }
    if (!ultimo) {
      setPaso(paso + 1);
      return;
    }
    const form = formRef.current;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const estilo = ESTILOS.find((x) => x.id === d.estilo);
    const paleta = PALETAS.find((x) => x.id === d.paleta);
    const dominio =
      d.dominio === "Sí, ya lo tengo"
        ? `Ya lo tiene: ${d.dominioCual.trim() || "(sin especificar)"}`
        : d.dominio;

    // Pares vacíos fuera: el CRM muestra solo lo que el cliente ha contestado.
    const respuestas = Object.fromEntries(
      Object.entries({
        Origen: "Asistente «Hablemos» de la web",
        "Nombre del negocio": d.empresa.trim(),
        "A qué se dedica": d.actividad.trim(),
        Dominio: dominio,
        "Estilo de web (orientativo)": estilo ? `${estilo.nombre} — ${estilo.desc}` : "",
        "Colores (orientativo)": paleta
          ? paleta.colores
            ? `${paleta.nombre} (${paleta.colores.join(", ")})`
            : paleta.nombre
          : "",
        "Colores de marca propios": d.coloresMarca.trim(),
        "Pestañas del menú":
          d.sabeMenu === "si" ? d.pestanas : "Aún no lo sabe: que Setnou lo aconseje",
        Comentarios: d.comentario.trim(),
      }).filter(([, v]) => (Array.isArray(v) ? v.length > 0 : v !== "")),
    );

    setEstado("enviando");
    setMensajeError("");
    try {
      const res = await fetch("/api/enviar-briefing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombreContacto: d.nombre.trim(),
          email: d.email.trim(),
          telefono: d.telefono.trim() || undefined,
          empresaCliente: d.empresa.trim(),
          respuestas,
        }),
      });
      if (res.ok) {
        setEstado("ok");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json().catch(() => ({}));
        setMensajeError(data?.error?.message || "No se ha podido enviar. Inténtalo de nuevo.");
        setEstado("error");
      }
    } catch {
      setMensajeError("Fallo de conexión. Revisa tu red e inténtalo de nuevo.");
      setEstado("error");
    }
  }

  /* ── Pantalla de éxito ── */
  if (estado === "ok") {
    return (
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border-2 border-ink bg-paper p-8 shadow-[8px_8px_0_0_var(--color-ink)] md:p-10">
          <span className="mb-6 flex size-16 items-center justify-center rounded-full border-2 border-ink bg-magenta">
            <Check className="size-8" strokeWidth={2.5} />
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            ¡Recibido, {d.nombre.trim().split(" ")[0]}!
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Ya tenemos la idea de {d.empresa.trim()}. Te escribimos en menos de 24 h
            con una propuesta de diseño, gratis y sin compromiso.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openGameModal("post-envio")}
              className="btn-pop inline-flex items-center gap-2 rounded-full bg-magenta px-7 py-3.5 text-base font-semibold text-ink"
            >
              <Gamepad2 className="size-5" /> Juega 45 segundos
            </button>
            <Link
              href="/"
              className="btn-pop inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper"
            >
              <ArrowLeft className="size-5" /> Volver al inicio
            </Link>
          </div>
        </div>
        <VistaPrevia d={d} />
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      {/* Vista previa: arriba en móvil, a la derecha (fija) en escritorio */}
      <div className="lg:sticky lg:top-24 lg:order-2">
        <VistaPrevia d={d} />
      </div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 lg:order-1">
        {/* Progreso */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Paso {paso + 1} de {PASOS.length} · {PASOS[paso]}
          </p>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {PASOS.map((p, i) => (
              <span
                key={p}
                className={`h-2 flex-1 rounded-full border-2 border-ink transition-colors ${
                  i <= paso ? "bg-magenta" : "bg-card"
                }`}
              />
            ))}
          </div>
        </div>

        <section className="rounded-3xl border-2 border-ink bg-card p-6 md:p-8">
          {paso === 0 && (
            <>
              <Titulo>Empecemos por tu negocio</Titulo>
              <div className="flex flex-col gap-4">
                <Campo label="¿Cómo se llama tu negocio?" requerido>
                  <input
                    autoFocus
                    value={d.empresa}
                    onChange={(e) => set("empresa", e.target.value)}
                    placeholder="Ej.: Panadería Lola"
                    className={inputClass}
                  />
                </Campo>
                <Campo label="¿A qué te dedicas? (en una frase)">
                  <input
                    value={d.actividad}
                    onChange={(e) => set("actividad", e.target.value)}
                    placeholder="Ej.: pan artesano de masa madre en Gràcia"
                    className={inputClass}
                  />
                </Campo>
                <p className="mt-2 text-sm font-medium">¿Tienes ya un dominio (tuempresa.com)?</p>
                <div className="flex flex-wrap gap-2.5">
                  {DOMINIO_OPCIONES.map((o) => (
                    <Chip key={o} activo={d.dominio === o} onClick={() => set("dominio", o)}>
                      {o}
                    </Chip>
                  ))}
                </div>
                {d.dominio === "Sí, ya lo tengo" && (
                  <Campo label="¿Cuál es?">
                    <input
                      value={d.dominioCual}
                      onChange={(e) => set("dominioCual", e.target.value)}
                      placeholder="tuempresa.com"
                      className={inputClass}
                    />
                  </Campo>
                )}
              </div>
            </>
          )}

          {paso === 1 && (
            <>
              <Titulo>¿Qué estilo de web te gusta?</Titulo>
              <Nota>
                Es solo para orientarnos sobre el estilo: tu web será única y
                diseñada para ti.
              </Nota>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ESTILOS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={d.estilo === e.id}
                    onClick={() => set("estilo", e.id)}
                    className={`flex flex-col items-start gap-3 rounded-2xl border-2 border-ink p-4 text-left transition-colors ${
                      d.estilo === e.id ? "bg-magenta/20 shadow-[4px_4px_0_0_var(--color-ink)]" : "bg-card hover:bg-secondary"
                    }`}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className="text-3xl leading-none" style={{ fontFamily: e.fuente, fontWeight: e.peso }}>
                        Aa
                      </span>
                      <span className="h-6 w-14 border-2 border-ink bg-ink/80" style={{ borderRadius: e.radio }} />
                    </span>
                    <span>
                      <span className="block font-semibold">{e.nombre}</span>
                      <span className="block text-sm text-muted-foreground">{e.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {paso === 2 && (
            <>
              <Titulo>¿Con qué colores te ves?</Titulo>
              <Nota>También es orientativo: lo afinamos contigo después.</Nota>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PALETAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={d.paleta === p.id}
                    onClick={() => set("paleta", p.id)}
                    className={`flex items-center gap-3 rounded-2xl border-2 border-ink p-3.5 text-left transition-colors ${
                      d.paleta === p.id ? "bg-magenta/20 shadow-[4px_4px_0_0_var(--color-ink)]" : "bg-card hover:bg-secondary"
                    }`}
                  >
                    <span className="flex shrink-0 overflow-hidden rounded-lg border-2 border-ink">
                      {p.colores ? (
                        p.colores.map((c) => <span key={c} className="size-7" style={{ background: c }} />)
                      ) : (
                        <span className="flex h-7 w-21 items-center justify-center bg-secondary text-xs font-bold">?</span>
                      )}
                    </span>
                    <span className="text-sm font-semibold">{p.nombre}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <Campo label="¿Ya tienes colores de marca? (opcional)">
                  <input
                    value={d.coloresMarca}
                    onChange={(e) => set("coloresMarca", e.target.value)}
                    placeholder="Ej.: el verde de mi logo, #2F5D3A"
                    className={inputClass}
                  />
                </Campo>
              </div>
            </>
          )}

          {paso === 3 && (
            <>
              <Titulo>¿Sabes qué pestañas quieres en el menú?</Titulo>
              <div className="flex flex-wrap gap-2.5">
                <Chip activo={d.sabeMenu === "si"} onClick={() => set("sabeMenu", "si")}>
                  Sí, las tengo claras
                </Chip>
                <Chip activo={d.sabeMenu === "no"} onClick={() => set("sabeMenu", "no")}>
                  No, aconsejadme
                </Chip>
              </div>
              {d.sabeMenu === "si" && (
                <>
                  <p className="mb-3 mt-6 text-sm font-medium">¿Cuáles? Marca las que quieras.</p>
                  <div className="flex flex-wrap gap-2.5">
                    {[...PESTANAS_SUGERIDAS, ...d.pestanas.filter((p) => !PESTANAS_SUGERIDAS.includes(p))].map((p) => (
                      <Chip key={p} activo={d.pestanas.includes(p)} onClick={() => togglePestana(p)}>
                        {p}
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      value={nuevaPestana}
                      onChange={(e) => setNuevaPestana(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          anadirPestana();
                        }
                      }}
                      placeholder="Otra pestaña…"
                      maxLength={30}
                      className={`${inputClass} min-w-0 flex-1`}
                    />
                    <button
                      type="button"
                      onClick={anadirPestana}
                      aria-label="Añadir pestaña"
                      className="flex size-12.5 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-card hover:bg-secondary"
                    >
                      <Plus className="size-5" />
                    </button>
                  </div>
                </>
              )}
              {d.sabeMenu === "no" && (
                <Nota>
                  Perfecto, es lo más habitual. Te proponemos el menú según tu
                  negocio.
                </Nota>
              )}
            </>
          )}

          {paso === 4 && (
            <>
              <Titulo>¿A quién le enviamos la propuesta?</Titulo>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Campo label="Nombre" requerido>
                  <input
                    autoFocus
                    required
                    autoComplete="name"
                    value={d.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    placeholder="Tu nombre"
                    className={inputClass}
                  />
                </Campo>
                <Campo label="Email" requerido>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={d.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="tu@email.com"
                    className={inputClass}
                  />
                </Campo>
                <Campo label="Teléfono">
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={d.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    placeholder="Tu teléfono"
                    className={inputClass}
                  />
                </Campo>
              </div>
              <div className="mt-4">
                <Campo label="¿Algo más que quieras contarnos? (opcional)">
                  <textarea
                    rows={3}
                    value={d.comentario}
                    onChange={(e) => set("comentario", e.target.value)}
                    placeholder="Plazos, ideas, webs que te gustan…"
                    className={`${inputClass} resize-none`}
                  />
                </Campo>
              </div>
            </>
          )}
        </section>

        {(aviso || estado === "error") && (
          <p role="alert" className="rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {aviso || mensajeError}
          </p>
        )}

        {/* Navegación */}
        <div className="flex items-center justify-between gap-3">
          {paso > 0 ? (
            <button
              type="button"
              onClick={() => {
                setAviso("");
                setPaso(paso - 1);
              }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-3 text-sm font-semibold hover:bg-secondary"
            >
              <ArrowLeft className="size-4" /> Atrás
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={estado === "enviando"}
            className="btn-pop inline-flex items-center gap-2 rounded-full bg-magenta px-7 py-3.5 text-base font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-70"
          >
            {estado === "enviando" ? (
              <><Loader2 className="size-5 animate-spin" /> Enviando…</>
            ) : ultimo ? (
              <><Send className="size-5" /> Enviar</>
            ) : (
              <>Siguiente <ArrowRight className="size-5" /></>
            )}
          </button>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 self-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
        >
          <MessageCircle className="size-4" /> ¿Prefieres hablar por WhatsApp?
        </a>
      </form>
    </div>
  );
}

/* ── Vista previa de la web ── */

function VistaPrevia({ d }: { d: Datos }) {
  const estilo = ESTILOS.find((x) => x.id === d.estilo);
  const paleta = PALETAS.find((x) => x.id === d.paleta)?.colores;
  // Sin elegir todavía: tonos neutros para que se note que "falta color".
  const [principal, acento, fondo] = paleta ?? ["#3A3B45", "#A0A1AE", "#FFFFFF"];
  const fuente = estilo?.fuente ?? "var(--font-sans), sans-serif";
  const peso = estilo?.peso ?? 700;
  const radio = estilo?.radio ?? "10px";
  const centrado = estilo?.centrado ?? false;
  const heroColor = estilo?.heroColor ?? false;

  const nombre = d.empresa.trim() || "Tu empresa";
  const menu =
    d.sabeMenu === "si" && d.pestanas.length > 0 ? d.pestanas : ["Inicio", "Servicios", "Contacto"];
  const menuProvisional = d.sabeMenu !== "si" || d.pestanas.length === 0;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-card shadow-[8px_8px_0_0_var(--color-ink)]">
      {/* Barra del navegador */}
      <div className="flex items-center gap-3 border-b-2 border-ink bg-secondary px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-magenta" />
          <span className="size-2.5 rounded-full bg-gold" />
          <span className="size-2.5 rounded-full bg-sky" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full border-2 border-ink/20 bg-card px-3 py-0.5 text-xs text-muted-foreground">
          {dominioPreview(d)}
        </span>
      </div>

      {/* La "web" */}
      <div
        aria-label="Vista previa de tu web"
        className="transition-colors duration-500"
        style={{ background: fondo, color: "#1A1B25" }}
      >
        {/* Cabecera: nombre a la izquierda, menú a la derecha */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5" style={{ borderBottom: `1px solid ${principal}22` }}>
          <span className="truncate text-base" style={{ fontFamily: fuente, fontWeight: peso, color: principal }}>
            {nombre}
          </span>
          <ul className={`flex shrink-0 gap-3 text-[11px] font-medium ${menuProvisional ? "opacity-40" : ""}`}>
            {menu.slice(0, 4).map((m) => (
              <li key={m} className="whitespace-nowrap">{m}</li>
            ))}
            {menu.length > 4 && <li>+{menu.length - 4}</li>}
          </ul>
        </div>

        {/* Hero */}
        <div
          className={`px-6 py-10 transition-colors duration-500 md:py-14 ${centrado ? "text-center" : ""}`}
          style={heroColor ? { background: principal, color: "#FFFFFF" } : undefined}
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: heroColor ? acento : principal }}>
            Bienvenido
          </p>
          <h2
            className="text-2xl leading-tight md:text-3xl"
            style={{ fontFamily: fuente, fontWeight: peso, color: heroColor ? "#FFFFFF" : principal }}
          >
            {nombre}
          </h2>
          <p className={`mt-3 max-w-sm text-sm opacity-80 ${centrado ? "mx-auto" : ""}`}>
            {d.actividad.trim() || "Aquí contaremos lo que hace único a tu negocio."}
          </p>
          <span
            className="mt-5 inline-block px-4 py-2 text-xs font-semibold"
            style={{
              borderRadius: radio,
              background: heroColor ? "#FFFFFF" : principal,
              color: heroColor ? principal : "#FFFFFF",
            }}
          >
            {menu.includes("Contacto") ? "Contacta" : "Descubre más"}
          </span>
        </div>

        {/* Bloques de contenido (solo en pantallas medianas para no alargar el móvil) */}
        <div className="hidden grid-cols-3 gap-3 px-5 pb-6 pt-5 sm:grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-3" style={{ borderRadius: radio === "999px" ? "16px" : radio, background: `${acento}26` }}>
              <span className="mb-2 block size-5" style={{ borderRadius: radio === "0px" ? "0px" : "999px", background: acento }} />
              <span className="mb-1.5 block h-2 w-3/4 rounded-full" style={{ background: `${principal}55` }} />
              <span className="block h-2 w-1/2 rounded-full" style={{ background: `${principal}30` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Subcomponentes ── */

const inputClass =
  "w-full rounded-xl border-2 border-ink bg-card px-4 py-3 text-base font-normal outline-none transition-colors focus:border-magenta";

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-4 py-2 text-sm font-medium transition-colors ${
        activo ? "bg-magenta text-ink" : "bg-card hover:bg-secondary"
      }`}
    >
      {activo && <Check className="size-3.5" strokeWidth={3} />}
      {children}
    </button>
  );
}

function Titulo({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-5 font-display text-2xl font-extrabold tracking-tight md:text-3xl">{children}</h1>;
}

function Nota({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-xl border-2 border-dashed border-ink/30 bg-secondary px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function Campo({ label, requerido, children }: { label: string; requerido?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      <span>
        {label}
        {requerido && <span className="text-magenta"> *</span>}
      </span>
      {children}
    </label>
  );
}
