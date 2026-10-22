"use client";

import Script from "next/script";

/**
 * Google Analytics 4 con Consent Mode v2.
 * - Por defecto NO se mide nada (analytics_storage = denied).
 * - El banner de cookies, al aceptar, emite "setnou:consent" y/o llama a
 *   gtag('consent','update',...) para activar la medición.
 * - Solo se carga si existe NEXT_PUBLIC_GA_ID (configúralo en Vercel).
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-8HHEK238TT";

/** Registra un evento en GA4 si está cargado (no hace nada si no). */
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") w.gtag("event", event, params ?? {});
}

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script id="ga-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent','default',{
            ad_storage:'denied',
            ad_user_data:'denied',
            ad_personalization:'denied',
            analytics_storage:'denied'
          });
          try {
            if (localStorage.getItem('setnou-cookies') === 'accepted') {
              gtag('consent','update',{ analytics_storage:'granted' });
            }
          } catch (e) {}
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config','${GA_ID}',{ anonymize_ip:true });
        `}
      </Script>
    </>
  );
}
