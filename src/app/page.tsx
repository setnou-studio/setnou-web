import { Monitor, Search, Zap, LineChart, ArrowRight, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Stats } from "@/components/site/stats";
import { ContactButton } from "@/components/site/contact-button";
import { ContactModal, ContactTrigger } from "@/components/site/contact-modal";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { Logo } from "@/components/site/logo";

/* ── Datos (clases de color literales para que Tailwind las incluya) ── */
const SERVICIOS = [
  {
    icon: Monitor,
    title: "Diseño web",
    desc: "Webs rápidas, limpias y con personalidad. Nada de plantillas genéricas.",
    chip: "bg-electric text-paper",
    hover: "hover:bg-electric hover:text-paper",
  },
  {
    icon: Search,
    title: "SEO",
    desc: "Posicionamiento orgánico real. Apareces donde tus clientes te buscan.",
    chip: "bg-magenta text-ink",
    hover: "hover:bg-magenta hover:text-ink",
  },
  {
    icon: Zap,
    title: "Optimización",
    desc: "Core Web Vitals y velocidad de carga que Google premia. Sin grasa.",
    chip: "bg-sky text-ink",
    hover: "hover:bg-sky hover:text-ink",
  },
  {
    icon: LineChart,
    title: "Estrategia digital",
    desc: "Analizamos tu mercado y trazamos el camino más directo a tus objetivos.",
    chip: "bg-gold text-ink",
    hover: "hover:bg-gold hover:text-ink",
  },
];

const PROYECTOS = [
  {
    pill: "Diseño + SEO",
    title: "Mirall Blau",
    desc: "Web accesible y posicionamiento local para un centro de actividades para personas con discapacidad.",
    block: "bg-electric",
  },
  {
    pill: "Diseño web",
    title: "Jenifer Quiroterapias",
    desc: "Web con sistema de reservas online y posicionamiento local para un centro de quiromasaje y terapias.",
    block: "bg-magenta",
  },
  {
    pill: "SEO · Optimización",
    title: "Projecting",
    desc: "Rediseño y arquitectura SEO para un estudio de proyectos de ingeniería y construcción.",
    block: "bg-gold",
  },
];

const VALORES = [
  { num: "01", title: "Atención real", desc: "Respondemos en el día. Siempre sabes en qué punto está tu proyecto.", color: "text-electric" },
  { num: "02", title: "Resultados medibles", desc: "Ponemos métricas desde el día uno. Si no se puede medir, no cuenta.", color: "text-magenta" },
  { num: "03", title: "Transparencia total", desc: "Desde el día 1 ya sabes lo que vas a pagar. Sin retrasos sospechosos, sin malicias y sin letra pequeña.", color: "text-sky" },
];

const MARQUEE = [
  "Diseño web",
  "SEO",
  "Optimización",
  "Estrategia digital",
  "Branding",
  "Tiendas online",
];

// Datos estructurados (Schema.org) para SEO local y rich results
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Setnou Studio",
  description:
    "Estudio de diseño web, SEO y estrategia digital en Barcelona. Webs a medida que convierten visitas en clientes.",
  url: "https://setnou.studio",
  email: "hola@setnou.studio",
  image: "https://setnou.studio/logo.svg",
  logo: "https://setnou.studio/logo.svg",
  priceRange: "€€",
  areaServed: { "@type": "Country", name: "España" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Barcelona",
    addressRegion: "Barcelona",
    addressCountry: "ES",
  },
  knowsAbout: [
    "Diseño web",
    "SEO",
    "Optimización web",
    "Estrategia digital",
    "Tiendas online",
  ],
  makesOffer: {
    "@type": "Offer",
    name: "Diseño web sin riesgo",
    description: "El diseño de tu web, gratis. Solo pagas si te gusta.",
  },
  slogan: "Tu web debería trabajar tanto como tú.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <span id="top" />
      <Nav />

      <main>
        {/* ════ Hero ════ */}
        <section className="relative overflow-hidden">
          {/* Bloques de color decorativos */}
          <div aria-hidden className="pointer-events-none absolute right-[-60px] top-24 hidden size-40 rotate-12 rounded-3xl bg-sky/30 md:block" />
          <div aria-hidden className="pointer-events-none absolute bottom-10 left-[-40px] hidden size-28 rounded-full bg-gold/40 md:block" />

          <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pt-24">
            {/* Eyebrow + paleta */}
            <div className="reveal mb-7 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-medium">
                <span className="size-2 rounded-full bg-magenta" />
                Estudio de diseño web · Barcelona
              </span>
              <span aria-hidden className="flex gap-1.5">
                <span className="size-3.5 rounded-sm bg-electric" />
                <span className="size-3.5 rounded-sm bg-sky" />
                <span className="size-3.5 rounded-sm bg-magenta" />
                <span className="size-3.5 rounded-sm bg-gold" />
                <span className="size-3.5 rounded-sm bg-ink" />
              </span>
            </div>

            <h1 className="reveal max-w-4xl font-display text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-[1.04] tracking-[-0.03em]">
              Tu web debería trabajar{" "}
              <span className="highlight inline-block rounded-md bg-magenta text-ink">
                tanto como tú.
              </span>
            </h1>

            <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Convertimos visitas en clientes y te ponemos donde te buscan. Sin
              rodeos, sin humo.
            </p>

            <div className="reveal mt-9 flex flex-wrap gap-4">
              <ContactTrigger className="btn-pop inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper">
                Empecemos tu proyecto <ArrowRight className="size-5" />
              </ContactTrigger>
              <a href="#portfolio" className="btn-pop inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-base font-semibold text-ink">
                Ver trabajos
              </a>
            </div>
          </div>
        </section>

        {/* ════ Marquee ════ */}
        <div className="overflow-hidden border-y-2 border-ink bg-ink py-4 text-paper">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="flex items-center gap-8 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {item}
                <span className="size-2.5 rounded-full bg-magenta" />
              </span>
            ))}
          </div>
        </div>

        {/* ════ Stats ════ */}
        <Stats />

        {/* ════ Servicios ════ */}
        <section id="servicios" className="mx-auto max-w-6xl px-5 py-24 md:py-28">
          <div className="reveal mb-14 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-magenta">Servicios</p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
              Todo lo que tu marca necesita online.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICIOS.map(({ icon: Icon, title, desc, chip, hover }) => (
              <article
                key={title}
                className={`reveal card-pop group flex flex-col gap-5 rounded-2xl bg-card p-7 ${hover}`}
              >
                <span className={`inline-flex size-12 items-center justify-center rounded-xl ${chip} transition-colors group-hover:bg-ink group-hover:text-paper`}>
                  <Icon className="size-6" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-current">
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ════ Oferta destacada: diseño gratis ════ */}
        <section className="border-y-2 border-ink bg-magenta text-ink">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-7 px-5 py-20 md:py-24">
            <span className="reveal inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold">
              <span className="size-2 rounded-full bg-ink" />
              Sin riesgo para ti
            </span>
            <h2 className="reveal max-w-4xl font-display text-[clamp(2.5rem,7vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
              El diseño de tu web,{" "}
              <span className="highlight inline-block rounded-md bg-ink text-paper">
                gratis.
              </span>
            </h2>
            <p className="reveal max-w-2xl text-lg leading-relaxed text-ink/80 md:text-xl">
              Estamos tan seguros de que te va a encantar nuestro trabajo que el
              diseño de tu web lo hacemos gratis. Lo ves, lo tocas y solo si te
              gusta, lo pagas. Así de simple.
            </p>
            <ContactTrigger className="btn-pop inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-lg font-semibold text-paper">
              Quiero mi diseño gratis <ArrowRight className="size-5" />
            </ContactTrigger>
          </div>
        </section>

        {/* ════ Portfolio ════ */}
        <section id="portfolio" className="border-b-2 border-ink bg-secondary py-24 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="reveal mb-14 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-electric">Portfolio</p>
                <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  Proyectos que hablan por sí solos.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {PROYECTOS.map((p) => (
                <article key={p.title} className="reveal card-pop group flex flex-col overflow-hidden rounded-2xl bg-card">
                  <div className={`relative h-52 ${p.block}`}>
                    <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink">
                      {p.pill}
                    </span>
                    <ArrowUpRight className="absolute bottom-4 right-4 size-7 text-paper transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ════ Nosotros ════ */}
        <section id="nosotros" className="mx-auto max-w-6xl px-5 py-24 md:py-28">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
            <div className="reveal flex flex-col gap-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky">Nosotros</p>
              <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.04] tracking-[-0.03em]">
                Un equipo pequeño para grandes{" "}
                <span className="highlight inline-block rounded-md bg-magenta text-ink">
                  resultados
                </span>
                .
              </h2>
              <p className="max-w-lg leading-relaxed text-muted-foreground">
                Somos un estudio joven con sede en Barcelona, pero trabajamos con clientes de toda España. El tamaño no define la calidad — la define la atención que pones en cada proyecto.
              </p>
              <p className="max-w-lg leading-relaxed text-muted-foreground">
                No hay cuentas de marca con cien personas detrás. Hablas directamente con quien hace el trabajo. Sin intermediarios, sin sorpresas.
              </p>
              <p className="max-w-lg leading-relaxed text-muted-foreground">
                Cada proyecto empieza por entender tu negocio de verdad. Solo así diseñamos una estrategia que funciona a largo plazo, no solo en el lanzamiento.
              </p>
            </div>

            <ol className="flex flex-col">
              {VALORES.map((v) => (
                <li key={v.num} className="reveal flex items-start gap-6 border-b-2 border-ink py-8 first:border-t-2">
                  <span className={`font-display text-4xl font-extrabold leading-none ${v.color}`}>{v.num}</span>
                  <div>
                    <h3 className="mb-1.5 font-display text-xl font-bold">{v.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{v.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ════ CTA final ════ */}
        <section id="contacto" className="border-y-2 border-ink bg-electric text-paper">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-24 md:py-28">
            <h2 className="max-w-3xl font-display text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-paper/85">
              Cuéntanos qué necesitas. La primera consulta es gratis y sin compromiso.
            </p>
            <ContactTrigger className="btn-pop inline-flex items-center gap-2 rounded-full bg-magenta px-8 py-4 text-lg font-semibold text-ink">
              Hablemos <ArrowRight className="size-5" />
            </ContactTrigger>
          </div>
        </section>
      </main>

      {/* ════ Footer ════ */}
      <footer className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pt-14 pb-28">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Logo variant="dark" className="h-9" />
            <nav aria-label="Enlaces de pie" className="flex flex-wrap gap-6 text-sm text-paper/70">
              <a href="#servicios" className="transition-colors hover:text-magenta">Servicios</a>
              <a href="#portfolio" className="transition-colors hover:text-magenta">Portfolio</a>
              <a href="#nosotros" className="transition-colors hover:text-magenta">Nosotros</a>
              <a href="mailto:hola@setnou.studio" className="transition-colors hover:text-magenta">hola@setnou.studio</a>
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-paper/50">
            <p>© 2026 Setnou Studio · Barcelona</p>
            <p className="flex items-center gap-2">
              Hecho con actitud
              <span className="size-2 rounded-full bg-magenta" />
            </p>
          </div>
        </div>
      </footer>

      <ScrollReveal />
      <ContactButton />
      <ContactModal />
    </>
  );
}
