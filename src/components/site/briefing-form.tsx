"use client";

import { useRef, useState } from "react";
import { Send, Check, ArrowLeft, Loader2, Globe, ShieldCheck } from "lucide-react";

/* ── Opciones de selección múltiple (chips) ── */
const SECCIONES = [
  "Inicio",
  "Sobre mí / Nosotros",
  "Servicios",
  "Proyectos / Portfolio",
  "Tienda online",
  "Blog",
  "Contacto",
  "Preguntas frecuentes",
  "Testimonios / Reseñas",
];

const FUNCIONALIDADES = [
  "Formulario de contacto",
  "Reservas / Citas online",
  "Tienda / Pagos",
  "Blog / Noticias",
  "Galería de fotos",
  "Multi-idioma",
  "Área de clientes",
  "Integración con redes",
  "Newsletter",
];

const DOMINIO_OPCIONES = [
  "Ya lo tengo",
  "Quiero que me lo consigáis vosotros",
  "Aún no lo sé",
];

const TIPO_CLIENTE_OPCIONES = ["Autónomo", "Empresa"];

/* Acento de color por bloque, para dar el aire "Candy Pop" de la web */
const ACENTOS = ["text-electric", "text-magenta", "text-sky", "text-gold"];

type Estado = "idle" | "enviando" | "ok" | "error";

/** Chip seleccionable (borde grueso; magenta al elegir). */
function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-medium transition-colors ${
        activo ? "bg-magenta text-ink" : "bg-card hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

const inputClass =
  "rounded-xl border-2 border-ink bg-card px-4 py-3 text-base font-normal outline-none transition-colors focus:border-magenta";

export function BriefingForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensajeError, setMensajeError] = useState("");
  const [secciones, setSecciones] = useState<string[]>([]);
  const [funciones, setFunciones] = useState<string[]>([]);
  const [dominio, setDominio] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");

  function toggle(lista: string[], set: (v: string[]) => void, valor: string) {
    set(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fd = new FormData(form);
    const texto = (k: string) => String(fd.get(k) || "").trim();

    // Construye un bloque de texto multilínea a partir de pares [etiqueta, valor],
    // saltándose los vacíos (el CRM muestra las respuestas respetando los saltos).
    const bloque = (pares: [string, string][]) =>
      pares
        .filter(([, v]) => v.trim() !== "")
        .map(([l, v]) => `${l}: ${v.trim()}`)
        .join("\n");

    const datosFiscales =
      tipoCliente === "Empresa"
        ? bloque([
            ["Razón social", texto("razon_social")],
            ["CIF", texto("cif")],
            ["Domicilio fiscal", texto("domicilio")],
          ])
        : tipoCliente === "Autónomo"
          ? bloque([
              ["Nombre y apellidos", texto("nombre")],
              ["NIF / DNI", texto("nif")],
              ["Domicilio fiscal", texto("domicilio")],
            ])
          : "";

    const dominioResp =
      dominio === "Ya lo tengo"
        ? `Ya lo tengo: ${texto("dominio_cual") || "(sin especificar)"}`
        : dominio === "Quiero que me lo consigáis vosotros"
          ? `Quiero que me lo consigáis. Nombre deseado: ${texto("dominio_deseado") || "(sin especificar)"}`
          : dominio;

    const payload = {
      nombreContacto: texto("nombre"),
      email: texto("email"),
      telefono: texto("telefono") || undefined,
      empresaCliente: texto("proyecto") || undefined,
      respuestas: {
        "Tipo de cliente": tipoCliente,
        "Datos fiscales": datosFiscales,
        "Cargo del contacto": tipoCliente === "Empresa" ? texto("cargo") : "",
        "Marca y voz": texto("marca"),
        "A quién le hablas": texto("publico"),
        "Contenido y secciones": secciones,
        "Otras secciones": texto("secciones_otras"),
        Funcionalidades: funciones,
        "Imágenes y materiales": texto("materiales"),
        Dominio: dominioResp,
        Hosting: "Gestionado por Setnou (somos el proveedor de hosting)",
        Inspiración: texto("inspiracion"),
      },
    };

    setEstado("enviando");
    setMensajeError("");
    try {
      const res = await fetch("/api/enviar-briefing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="mx-auto max-w-2xl rounded-3xl border-2 border-ink bg-paper p-8 text-center shadow-[8px_8px_0_0_var(--color-ink)] md:p-12">
        <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border-2 border-ink bg-magenta">
          <Check className="size-8" strokeWidth={2.5} />
        </span>
        <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          ¡Briefing recibido!
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Gracias por el detalle. Lo revisamos y te escribimos en menos de 24 h con
          los siguientes pasos.
        </p>
        <a
          href="/"
          className="btn-pop mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper"
        >
          <ArrowLeft className="size-5" /> Volver al inicio
        </a>
      </div>
    );
  }

  /* ── Formulario ── */
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Bloque 0 · Datos de contacto y fiscales */}
      <Seccion n="00" titulo="Tus datos" acento={ACENTOS[0]}>
        {/* Autónomo o empresa */}
        <p className="mb-3 text-sm font-medium">¿Eres autónomo o empresa?</p>
        <div className="mb-6 flex flex-wrap gap-2.5">
          {TIPO_CLIENTE_OPCIONES.map((t) => (
            <Chip key={t} activo={tipoCliente === t} onClick={() => setTipoCliente(t)}>
              {t}
            </Chip>
          ))}
        </div>

        {/* Persona de contacto */}
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Persona de contacto
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Nombre y apellidos" requerido>
            <input name="nombre" type="text" required autoComplete="name" placeholder="Tu nombre" className={inputClass} />
          </Campo>
          <Campo label="Email" requerido>
            <input name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className={inputClass} />
          </Campo>
          <Campo label="Teléfono">
            <input name="telefono" type="tel" autoComplete="tel" placeholder="Tu teléfono" className={inputClass} />
          </Campo>
          {tipoCliente === "Empresa" && (
            <Campo label="Tu cargo en la empresa">
              <input name="cargo" type="text" placeholder="Ej.: gerente, socia…" className={inputClass} />
            </Campo>
          )}
        </div>

        {/* Datos fiscales (según tipo) */}
        {tipoCliente === "Autónomo" && (
          <>
            <p className="mb-3 mt-7 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Datos fiscales (para la facturación)
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Campo label="NIF / DNI">
                <input name="nif" type="text" placeholder="12345678A" className={inputClass} />
              </Campo>
              <Campo label="Domicilio fiscal">
                <input name="domicilio" type="text" placeholder="Calle, nº, CP, población" className={inputClass} />
              </Campo>
            </div>
          </>
        )}
        {tipoCliente === "Empresa" && (
          <>
            <p className="mb-3 mt-7 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Datos fiscales de la empresa (para la facturación)
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Campo label="Razón social (nombre fiscal)">
                <input name="razon_social" type="text" placeholder="Ej.: Mi Empresa, S.L." className={inputClass} />
              </Campo>
              <Campo label="CIF">
                <input name="cif" type="text" placeholder="B12345678" className={inputClass} />
              </Campo>
              <Campo label="Domicilio fiscal">
                <input name="domicilio" type="text" placeholder="Calle, nº, CP, población" className={inputClass} />
              </Campo>
            </div>
          </>
        )}

        {/* Nombre comercial */}
        <div className="mt-7">
          <Campo label="Nombre comercial (con el que te conocen tus clientes)">
            <input name="proyecto" type="text" placeholder="Puede ser distinto del nombre fiscal" className={inputClass} />
          </Campo>
        </div>
      </Seccion>

      {/* Bloque 1 · Marca y voz */}
      <Seccion n="01" titulo="Tu marca y tu voz" acento={ACENTOS[1]}>
        <Campo label="¿Cómo describirías tu marca? Tono, valores, qué te hace diferente.">
          <textarea name="marca" rows={4} placeholder="Ej.: cercana y profesional, para un público joven; nos diferencia el trato personal…" className={`${inputClass} resize-none`} />
        </Campo>
        <p className="mt-3 rounded-xl border-2 border-dashed border-ink/30 bg-secondary px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          ¿No se te ocurre qué poner? Escríbelo como si se lo explicaras a un amigo:
          cómo es tu empresa o cómo te gustaría que fuese. Ya nos encargamos nosotros
          de pulirlo.
        </p>
      </Seccion>

      {/* Bloque 2 · Público */}
      <Seccion n="02" titulo="A quién le hablas" acento={ACENTOS[2]}>
        <Campo label="Tu cliente ideal: quién es, qué busca y qué le preocupa.">
          <textarea name="publico" rows={4} placeholder="Ej.: empresas locales que necesitan más visibilidad; les preocupa el precio y la confianza…" className={`${inputClass} resize-none`} />
        </Campo>
      </Seccion>

      {/* Bloque 3 · Secciones */}
      <Seccion n="03" titulo="Contenido y secciones" acento={ACENTOS[3]}>
        <p className="mb-3 text-sm font-medium">¿Qué páginas necesita tu web? Marca las que quieras.</p>
        <div className="flex flex-wrap gap-2.5">
          {SECCIONES.map((s) => (
            <Chip key={s} activo={secciones.includes(s)} onClick={() => toggle(secciones, setSecciones, s)}>
              {s}
            </Chip>
          ))}
        </div>
        <div className="mt-4">
          <Campo label="¿Alguna otra sección que tengas en mente?">
            <input name="secciones_otras" type="text" placeholder="Ej.: casos de éxito, zona de descargas…" className={inputClass} />
          </Campo>
        </div>
      </Seccion>

      {/* Bloque 4 · Funcionalidades */}
      <Seccion n="04" titulo="Funcionalidades" acento={ACENTOS[0]}>
        <p className="mb-3 text-sm font-medium">¿Qué tiene que poder hacer la web?</p>
        <div className="flex flex-wrap gap-2.5">
          {FUNCIONALIDADES.map((f) => (
            <Chip key={f} activo={funciones.includes(f)} onClick={() => toggle(funciones, setFunciones, f)}>
              {f}
            </Chip>
          ))}
        </div>
      </Seccion>

      {/* Bloque 5 · Materiales (enlaces) */}
      <Seccion n="05" titulo="Imágenes y materiales" acento={ACENTOS[1]}>
        <Campo label="¿Tienes logo, fotos o textos? Pega aquí los enlaces (Drive, Dropbox, WeTransfer…).">
          <textarea name="materiales" rows={3} placeholder="https://drive.google.com/…  ·  o cuéntanos qué tienes y qué te falta" className={`${inputClass} resize-none`} />
        </Campo>
      </Seccion>

      {/* Bloque 6 · Dominio y hosting */}
      <Seccion n="06" titulo="Dominio y hosting" acento={ACENTOS[2]}>
        {/* Dominio */}
        <p className="mb-3 flex items-center gap-2 text-sm font-medium">
          <Globe className="size-4" /> ¿Tienes ya un dominio (p. ej. tuempresa.com)?
        </p>
        <div className="flex flex-wrap gap-2.5">
          {DOMINIO_OPCIONES.map((o) => (
            <Chip key={o} activo={dominio === o} onClick={() => setDominio(o)}>
              {o}
            </Chip>
          ))}
        </div>
        {dominio === "Ya lo tengo" && (
          <div className="mt-4">
            <Campo label="¿Cuál es?">
              <input name="dominio_cual" type="text" placeholder="tuempresa.com" className={inputClass} />
            </Campo>
          </div>
        )}
        {dominio === "Quiero que me lo consigáis vosotros" && (
          <div className="mt-4">
            <Campo label="¿Qué nombre de empresa te gustaría tener en el dominio?">
              <input name="dominio_deseado" type="text" placeholder="Ej.: mimarca (para mimarca.com)" className={inputClass} />
            </Campo>
          </div>
        )}

        {/* Hosting: informativo — el hosting lo gestiona Setnou */}
        <div className="mt-6 flex gap-3 rounded-2xl border-2 border-ink bg-secondary p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-electric" />
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">Del hosting nos encargamos nosotros.</span>{" "}
            Para darte un mejor servicio y poder resolver cualquier problema al
            momento, seremos tu proveedor de hosting. Así no tienes que preocuparte
            de nada técnico: nosotros lo mantenemos todo funcionando.
          </p>
        </div>
      </Seccion>

      {/* Bloque 7 · Inspiración */}
      <Seccion n="07" titulo="Inspiración" acento={ACENTOS[3]}>
        <Campo label="Webs que te gustan (aunque no sean de tu sector) y qué te gusta de ellas.">
          <textarea name="inspiracion" rows={3} placeholder="https://webquemegusta.com — me encanta lo limpia que es…" className={`${inputClass} resize-none`} />
        </Campo>
      </Seccion>

      {/* Envío */}
      <div className="flex flex-col gap-4 border-t-2 border-ink pt-8">
        {estado === "error" && (
          <p role="alert" className="rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {mensajeError}
          </p>
        )}
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="btn-pop inline-flex w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-4 text-base font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:self-start sm:px-10"
        >
          {estado === "enviando" ? (
            <><Loader2 className="size-5 animate-spin" /> Enviando…</>
          ) : (
            <><Send className="size-5" /> Enviar briefing</>
          )}
        </button>
        <p className="text-sm text-muted-foreground">
          Te respondemos en menos de 24 h. Sin compromiso.
        </p>
      </div>
    </form>
  );
}

/* ── Subcomponentes de maquetación ── */
function Seccion({
  n,
  titulo,
  acento,
  children,
}: {
  n: string;
  titulo: string;
  acento: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border-2 border-ink bg-card p-6 md:p-8">
      <div className="mb-5 flex items-baseline gap-4">
        <span className={`font-display text-2xl font-extrabold leading-none ${acento}`}>{n}</span>
        <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">{titulo}</h2>
      </div>
      {children}
    </section>
  );
}

function Campo({
  label,
  requerido,
  children,
}: {
  label: string;
  requerido?: boolean;
  children: React.ReactNode;
}) {
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
