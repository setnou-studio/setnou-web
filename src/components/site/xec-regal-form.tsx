"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, Send, Ticket } from "lucide-react";
import { track } from "@/components/site/analytics";
import { IDIOMES, MAX_IDIOMES } from "@/lib/xec-regal";

type Pas = "validar" | "dades" | "fet";

const inputClass =
  "rounded-xl border-2 border-ink bg-card px-4 py-3 text-base font-normal outline-none transition-colors focus:border-magenta";

async function envia(cos: Record<string, unknown>): Promise<string | null> {
  try {
    const r = await fetch("/api/xec-regal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(cos),
    });
    if (r.ok) return null;
    const d = await r.json().catch(() => ({}));
    return d?.error?.message || "No s’ha pogut completar. Torna-ho a provar.";
  } catch {
    return "Error de connexió. Revisa la xarxa i torna-ho a provar.";
  }
}

export function XecRegalForm() {
  const [pas, setPas] = useState<Pas>("validar");
  const [enviant, setEnviant] = useState(false);
  const [error, setError] = useState("");
  const [butlleta, setButlleta] = useState("");
  const [codi, setCodi] = useState("");
  const [idiomes, setIdiomes] = useState<string[]>([]);
  const [domini, setDomini] = useState("");

  async function valida(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setEnviant(true);
    const err = await envia({ pas: "validar", butlleta, codi, website: new FormData(e.currentTarget).get("website") });
    setEnviant(false);
    if (err) return setError(err);
    setPas("dades");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function bescanvia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const t = (k: string) => String(f.get(k) ?? "").trim();
    setEnviant(true);
    const err = await envia({
      pas: "enviar", butlleta, codi, website: t("website"),
      nom: t("nom"), email: t("email"), telefon: t("telefon"),
      negoci: t("negoci"), projecte: t("projecte"), idiomes, domini,
    });
    setEnviant(false);
    if (err) return setError(err);
    track("generar_lead", { metodo: "xec_regal" });
    setPas("fet");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const avis = error && (
    <p role="alert" className="rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {error}
    </p>
  );
  const honeypot = (
    <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
      <label>No omplir<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );

  if (pas === "fet") {
    return (
      <div className="rounded-3xl border-2 border-ink bg-paper p-8 text-center shadow-[8px_8px_0_0_var(--color-ink)] md:p-12">
        <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border-2 border-ink bg-magenta">
          <Check className="size-8" strokeWidth={2.5} />
        </span>
        <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Xec bescanviat!</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Hem rebut les teves dades. Ens posarem en contacte amb tu aviat per començar la teva web.
          Si vols afegir alguna cosa, escriu-nos a{" "}
          <a href="mailto:cristian@setnou.com" className="font-medium text-electric underline underline-offset-2">cristian@setnou.com</a>.
        </p>
      </div>
    );
  }

  if (pas === "validar") {
    return (
      <form key="validar" onSubmit={valida} className="flex flex-col gap-6 rounded-3xl border-2 border-ink bg-card p-6 md:p-8">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-2xl font-extrabold leading-none text-electric">01</span>
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">Valida el teu xec</h2>
        </div>
        <p className="-mt-2 text-sm text-muted-foreground">
          Necessitem el número de la butlleta guanyadora i el codi que surt imprès al xec.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            <span>Número de butlleta <span className="text-magenta">*</span></span>
            <input name="butlleta" inputMode="numeric" pattern="[0-9]{1,6}" required autoComplete="off"
              value={butlleta} onChange={(e) => setButlleta(e.target.value)} placeholder="Ex.: 142" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            <span>Codi del xec <span className="text-magenta">*</span></span>
            <input name="codi" required autoComplete="off" autoCapitalize="characters" spellCheck={false}
              value={codi} onChange={(e) => setCodi(e.target.value)} placeholder="VOL26-XXXX-XXXX" className={`${inputClass} uppercase`} />
          </label>
        </div>
        {honeypot}
        {avis}
        <button type="submit" disabled={enviant}
          className="btn-pop inline-flex w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-4 text-base font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:self-start sm:px-10">
          {enviant ? <><Loader2 className="size-5 animate-spin" /> Comprovant…</> : <><Ticket className="size-5" /> Validar el xec <ArrowRight className="size-5" /></>}
        </button>
      </form>
    );
  }

  return (
    <form key="dades" onSubmit={bescanvia} className="flex flex-col gap-6 rounded-3xl border-2 border-ink bg-card p-6 md:p-8">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-2xl font-extrabold leading-none text-magenta">02</span>
        <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">Les teves dades</h2>
      </div>
      <p className="-mt-2 inline-flex items-center gap-2 text-sm font-medium text-electric">
        <Check className="size-4" /> Xec vàlid · butlleta {butlleta}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span>Nom i cognoms <span className="text-magenta">*</span></span>
          <input name="nom" required autoComplete="name" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span>Correu electrònic <span className="text-magenta">*</span></span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span>Telèfon <span className="text-magenta">*</span></span>
          <input name="telefon" type="tel" required autoComplete="tel" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <span>Nom del negoci o projecte</span>
          <input name="negoci" autoComplete="organization" placeholder="Si en tens" className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>Explica’ns breument la web que t’imagines</span>
        <textarea name="projecte" rows={4} maxLength={2000} placeholder="Per a què és, què hi vols explicar, alguna web que t’agradi…"
          className={`${inputClass} resize-none`} />
      </label>
      <div>
        <p className="mb-3 text-sm font-medium">Idiomes de la web (fins a {MAX_IDIOMES})</p>
        <div className="flex flex-wrap gap-2.5">
          {IDIOMES.map((i) => {
            const actiu = idiomes.includes(i);
            const ple = !actiu && idiomes.length >= MAX_IDIOMES;
            return (
              <button key={i} type="button" aria-pressed={actiu} disabled={ple}
                onClick={() => setIdiomes(actiu ? idiomes.filter((x) => x !== i) : [...idiomes, i])}
                className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${actiu ? "bg-magenta text-ink" : "bg-card hover:bg-secondary"}`}>
                {i}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium">Domini</p>
        <div className="flex flex-wrap gap-2.5">
          {["Ja en tinc un", "Encara no en tinc", "No ho sé"].map((o) => (
            <button key={o} type="button" aria-pressed={domini === o} onClick={() => setDomini(o)}
              className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-medium transition-colors ${domini === o ? "bg-magenta text-ink" : "bg-card hover:bg-secondary"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>
      {honeypot}
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="privacitat" required className="mt-1 size-4 shrink-0 accent-magenta" />
        <span>
          He llegit i accepto la{" "}
          <a href="/privacidad" target="_blank" className="font-medium text-electric underline underline-offset-2">política de privacitat</a>.
        </span>
      </label>
      {avis}
      <button type="submit" disabled={enviant}
        className="btn-pop inline-flex w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-4 text-base font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:self-start sm:px-10">
        {enviant ? <><Loader2 className="size-5 animate-spin" /> Enviant…</> : <><Send className="size-5" /> Bescanviar el xec</>}
      </button>
    </form>
  );
}
