"use client";

import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

export type Proyecto = {
  pill: string;
  title: string;
  desc: string;
  url: string;
  block: string;
};

const VISIBLE = 9; // nº de proyectos mostrados antes de "Ver más"

function Card({ p }: { p: Proyecto }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver el proyecto ${p.title} (se abre en otra pestaña)`}
      className="reveal is-visible card-pop group flex flex-col overflow-hidden rounded-2xl bg-card"
    >
      <div
        className={`relative h-52 overflow-hidden border-b-2 border-ink bg-cover bg-top ${p.block}`}
        style={{
          backgroundImage: `url(https://s.wordpress.com/mshots/v1/${encodeURIComponent(
            p.url
          )}?w=900&h=700)`,
        }}
      >
        <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink shadow-sm">
          {p.pill}
        </span>
        <span className="absolute bottom-4 right-4 grid size-9 place-items-center rounded-full bg-ink text-paper transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
        <span className="mt-1 text-sm font-semibold text-electric">
          {p.url.replace("https://", "")}
        </span>
      </div>
    </a>
  );
}

export function PortfolioGrid({ projects }: { projects: Proyecto[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = projects.length > VISIBLE;
  const shown = expanded ? projects : projects.slice(0, VISIBLE);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {shown.map((p) => (
          <Card key={p.title} p={p} />
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="btn-pop inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-paper"
          >
            Ver más proyectos
            <span className="grid size-6 place-items-center rounded-full bg-paper text-ink">
              <Plus className="size-4" />
            </span>
          </button>
        </div>
      )}
    </>
  );
}
