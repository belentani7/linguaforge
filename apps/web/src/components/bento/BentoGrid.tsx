"use client";

import type { ReactNode, PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BentoItem {
  id: string;
  title: string;
  body: string;
  icon: ReactNode;
  /** Clases de tamaño en la cuadrícula de 6 columnas (md+). */
  span: string;
  visual?: ReactNode;
}

/** Tarjeta con foco de luz que sigue al cursor y inclinación elástica (física de resorte). */
function BentoCard({ item }: { item: BentoItem }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 180, damping: 22, mass: 0.6 });
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const sxPct = useTransform(sx, (v) => v * 100);
  const syPct = useTransform(sy, (v) => v * 100);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sxPct}% ${syPct}%, rgb(167 139 250 / 0.22), transparent 60%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(x);
    py.set(y);
    rotateY.set((x - 0.5) * 8);
    rotateX.set((0.5 - y) * 8);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "glass grid-noise group relative isolate overflow-hidden rounded-3xl p-6 transition-colors duration-500 hover:border-white/20",
        item.span,
      )}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: spotlight }} />
      <div className="mb-4 grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
        {item.icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-white">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
      {item.visual && <div className="mt-5">{item.visual}</div>}
    </motion.article>
  );
}

export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(190px,auto)]">
      {items.map((item) => (
        <BentoCard key={item.id} item={item} />
      ))}
    </div>
  );
}
