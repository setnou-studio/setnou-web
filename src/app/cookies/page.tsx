import type { Metadata } from "next";
import { LegalShell, TITULAR } from "@/components/site/legal-shell";
import { CookiePrefsButton } from "@/components/site/cookie-consent";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Política de cookies de Setnou Studio (SETNOU GLOBAL GROUP, S.L.).",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalShell title="Política de cookies" updated="octubre de 2026">
      <h2>1. Qué son las cookies</h2>
      <p>
        Una cookie es un pequeño archivo que se guarda en tu dispositivo al
        visitar una web y permite recordar información sobre tu navegación.
      </p>

      <h2>2. Cookies que usamos</h2>
      <p>
        <b>Cookies técnicas (necesarias).</b> Imprescindibles para que la web
        funcione y para recordar tu preferencia de consentimiento. No requieren
        tu permiso.
      </p>
      <p>
        <b>Cookies de análisis (opcionales).</b> Solo se activan si las aceptas.
        Nos ayudan a entender de forma agregada cómo se usa la web para
        mejorarla. Mientras no las aceptes, no se cargan.
      </p>

      <h2>3. Gestión del consentimiento</h2>
      <p>
        Al entrar en la web te mostramos un aviso para aceptar o rechazar las
        cookies opcionales. Puedes cambiar tu elección en cualquier momento
        desde aquí:
      </p>
      <p>
        <CookiePrefsButton className="btn-pop inline-flex items-center rounded-full border-2 border-ink bg-magenta px-5 py-2.5 text-sm font-semibold text-ink" />
      </p>
      <p>
        También puedes bloquear o eliminar las cookies desde la configuración de
        tu navegador.
      </p>

      <h2>4. Más información</h2>
      <p>
        Para cualquier duda sobre esta política, escríbenos a{" "}
        <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>. El tratamiento
        de tus datos se describe en la{" "}
        <a href="/privacidad">política de privacidad</a>.
      </p>
    </LegalShell>
  );
}
