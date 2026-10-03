import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * The layered "double-bezel" card: a machined outer shell holding an inner
 * core, echoing the way camellia petals nest. Radii are concentric — the
 * inner core radius equals the outer radius minus the shell padding, which
 * `tests/unit/tokens.test.ts` asserts against the token values.
 */
export function CardShell({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("shell", className)} {...props} />;
}

export function CardCore({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("shell-core p-card md:p-card-lg", className)}
      {...props}
    />
  );
}

/** Convenience wrapper for the common shell + core pairing. */
export function Card({
  className,
  coreClassName,
  children,
  ...props
}: ComponentProps<"div"> & { coreClassName?: string }) {
  return (
    <CardShell className={className} {...props}>
      <CardCore className={coreClassName}>{children}</CardCore>
    </CardShell>
  );
}
