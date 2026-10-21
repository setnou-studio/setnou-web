import type { Metadata } from "next";
import { LegalShell, TITULAR } from "@/components/site/legal-shell";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Setnou Studio (SETNOU GLOBAL GROUP, S.L.).",
  alternates: { canonical: "/privacidad" },
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
  return (
    <LegalShell title="Política de privacidad" updated="octubre de 2026">
      <p>
        En {TITULAR.nombre} tratamos tus datos personales conforme al Reglamento
        (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD). Esta política
        explica qué datos recogemos, para qué y qué derechos tienes.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Responsable: {TITULAR.nombre}</li>
        <li>NIF: {TITULAR.nif}</li>
        <li>Domicilio: {TITULAR.direccion}</li>
        <li>
          Contacto: <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>
        </li>
      </ul>

      <h2>2. Qué datos tratamos y con qué finalidad</h2>
      <p>
        Cuando rellenas el formulario de contacto o de briefing, tratamos los
        datos que nos facilitas (como nombre, teléfono, correo electrónico e
        información sobre tu proyecto) con la finalidad de responder a tu
        solicitud y prepararte una propuesta.
      </p>

      <h2>3. Legitimación</h2>
      <p>
        La base legal es tu consentimiento, que otorgas al enviar el formulario
        marcando la casilla de aceptación de esta política, así como la
        aplicación de medidas precontractuales a petición tuya.
      </p>

      <h2>4. Conservación</h2>
      <p>
        Conservaremos tus datos durante el tiempo necesario para atender tu
        solicitud y, en su caso, durante los plazos legalmente exigibles. Después
        serán suprimidos.
      </p>

      <h2>5. Destinatarios</h2>
      <p>
        No cedemos tus datos a terceros salvo obligación legal. Podemos usar
        proveedores de servicios (como alojamiento o herramientas de gestión de
        contactos) que actúan como encargados del tratamiento con las garantías
        exigidas por el RGPD.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión,
        oposición, limitación y portabilidad escribiendo a{" "}
        <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>. También puedes
        reclamar ante la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          aepd.es
        </a>
        ).
      </p>

      <h2>7. Cookies</h2>
      <p>
        El uso de cookies se detalla en nuestra{" "}
        <a href="/cookies">política de cookies</a>.
      </p>
    </LegalShell>
  );
}
