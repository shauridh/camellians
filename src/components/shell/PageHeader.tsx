import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Small mono label above the title, e.g. "Iuran Warga". */
  eyebrow: string;
  judul: string;
  keterangan?: string;
  aksi?: ReactNode;
}

export function PageHeader({ eyebrow, judul, keterangan, aksi }: PageHeaderProps) {
  return (
    <header className="mb-block flex flex-wrap items-start justify-between gap-snug">
      <div className="space-y-hair">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-3xl md:text-4xl">{judul}</h1>
        {keterangan && (
          <p className="max-w-prose text-sm text-slate-muted">{keterangan}</p>
        )}
      </div>
      {aksi}
    </header>
  );
}
