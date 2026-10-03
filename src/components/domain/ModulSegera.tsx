import { PageHeader } from "@/components/shell/PageHeader";
import { Card } from "@/components/ui/card";

interface ModulSegeraProps {
  eyebrow: string;
  judul: string;
  keterangan: string;
  /** What this module will do once it is built. */
  rencana: string[];
  /** What a resident can already do today instead. */
  sementara: string;
}

/**
 * A module that is designed but not yet built.
 *
 * Deliberately not a blank page: it states what will live here, what works
 * today, and why. A resident who taps the wrong tab learns something instead
 * of hitting a dead end.
 */
export function ModulSegera({
  eyebrow,
  judul,
  keterangan,
  rencana,
  sementara,
}: ModulSegeraProps) {
  return (
    <div className="space-y-section">
      <PageHeader eyebrow={eyebrow} judul={judul} keterangan={keterangan} />

      <Card coreClassName="space-y-snug">
        <p className="eyebrow">Yang akan ada di sini</p>
        <ul className="space-y-hair">
          {rencana.map((item) => (
            <li key={item} className="flex items-start gap-tight text-sm">
              <span aria-hidden="true" className="mt-1 text-brass">
                ❀
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card coreClassName="space-y-hair">
        <p className="eyebrow">Sementara ini</p>
        <p className="text-sm text-slate-muted">{sementara}</p>
      </Card>
    </div>
  );
}
