import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Short headline naming what is missing. */
  judul: string;
  /** One sentence telling the reader what will appear here. */
  keterangan: string;
  /** Optional action, e.g. a button. */
  aksi?: ReactNode;
  className?: string;
}

/**
 * Empty states are an invitation, never a dead end: they say what belongs
 * here and what to do next, in the interface's own voice — no apologies.
 */
export function EmptyState({ judul, keterangan, aksi, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-snug rounded-lg border border-dashed border-stone bg-paper px-card py-block text-center",
        className,
      )}
    >
      <p className="font-display text-lg text-evergreen-deep">{judul}</p>
      <p className="max-w-sm text-sm text-slate-muted">{keterangan}</p>
      {aksi}
    </div>
  );
}
