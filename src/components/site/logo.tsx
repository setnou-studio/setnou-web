/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

/**
 * Logo Setnou Studio (wordmark con la "o" magenta).
 * variant "dark" usa el texto en blanco para fondos carbón.
 */
export function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const src = variant === "dark" ? "/logo-white.svg" : "/logo.svg";
  return (
    <img
      src={src}
      alt="Setnou Studio"
      className={cn("h-8 w-auto", className)}
      width={120}
      height={44}
    />
  );
}
