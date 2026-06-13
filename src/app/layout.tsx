import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

// Cuerpo / UI
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Display / titulares — carácter moderno y atrevido
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Dominio canónico del sitio
const SITE_URL = "https://setnou.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Setnou Studio — Diseño web, SEO y estrategia digital en Barcelona",
    template: "%s · Setnou Studio",
  },
  description:
    "Estudio de diseño web en Barcelona. Creamos webs con actitud que convierten visitas en clientes y posicionan tu marca en Google. El diseño de tu web, gratis: solo pagas si te gusta.",
  keywords: [
    "diseño web Barcelona",
    "estudio de diseño web",
    "agencia diseño web Barcelona",
    "SEO Barcelona",
    "posicionamiento web",
    "estrategia digital",
    "diseño web a medida",
    "tiendas online",
    "Setnou Studio",
  ],
  authors: [{ name: "Setnou Studio", url: SITE_URL }],
  creator: "Setnou Studio",
  publisher: "Setnou Studio",
  applicationName: "Setnou Studio",
  category: "Diseño web",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Setnou Studio",
    title: "Setnou Studio — Diseño web, SEO y estrategia digital en Barcelona",
    description:
      "Webs con actitud que convierten visitas en clientes. El diseño de tu web, gratis: solo pagas si te gusta.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Setnou Studio — Diseño web atrevido en Barcelona",
    description:
      "Webs que convierten visitas en clientes. El diseño de tu web, gratis: solo pagas si te gusta.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAFF",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
