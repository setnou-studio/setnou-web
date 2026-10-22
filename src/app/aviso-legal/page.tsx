import type { Metadata } from "next";
import { LegalShell, TITULAR } from "@/components/site/legal-shell";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de Setnou Studio (SETNOU GLOBAL GROUP, S.L.).",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: false, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <LegalShell title="Aviso legal" updated="octubre de 2026">
      <h2>1. Datos del titular</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de los datos
        del titular de este sitio web:
      </p>
      <ul>
        <li>Titular: {TITULAR.nombre}</li>
        <li>NIF: {TITULAR.nif}</li>
        <li>Domicilio: {TITULAR.direccion}</li>
        <li>
          Correo electrónico:{" "}
          <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>
        </li>
        <li>Datos registrales: Registro Mercantil de Barcelona (pendiente de completar).</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        El presente aviso legal regula el uso del sitio web{" "}
        <a href={TITULAR.web}>www.setnoustudio.com</a>, cuya finalidad es
        informar sobre los servicios de diseño web, SEO y estrategia digital que
        presta el titular.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso del sitio atribuye la condición de usuario e implica la
        aceptación de las condiciones recogidas en este aviso legal. El usuario
        se compromete a hacer un uso adecuado de los contenidos y a no
        emplearlos para actividades ilícitas o contrarias a la buena fe.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del sitio (textos, imágenes, logotipos, diseño y
        código) son titularidad del titular o de terceros que han autorizado su
        uso, y están protegidos por los derechos de propiedad intelectual e
        industrial. Queda prohibida su reproducción sin autorización.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        El titular no se hace responsable de los daños derivados del uso
        indebido del sitio ni de la indisponibilidad temporal por causas
        técnicas. Los enlaces a sitios de terceros se ofrecen solo a título
        informativo.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para la
        resolución de cualquier controversia, las partes se someten a los
        juzgados y tribunales que correspondan conforme a derecho.
      </p>
    </LegalShell>
  );
}
