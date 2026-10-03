"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef } from "react";
import {
  BookOpen,
  CalendarDays,
  CircleUser,
  HandCoins,
  Home,
  Megaphone,
  Menu,
  MessageSquareWarning,
  PiggyBank,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Primary destinations. Five is the ceiling for a bottom bar — anything more
 * pushes targets below a comfortable thumb reach, so the remaining modules
 * live behind "Lainnya".
 */
const TABS = [
  { href: "/", label: "Beranda", Icon: Home },
  { href: "/iuran", label: "Iuran", Icon: HandCoins },
  { href: "/keluhan", label: "Keluhan", Icon: MessageSquareWarning },
  { href: "/direktori", label: "Direktori", Icon: Users },
] as const;

/** Everything else, reachable from the mobile "Lainnya" menu. */
const SECONDARY = [
  { href: "/pengumuman", label: "Pengumuman", Icon: Megaphone },
  { href: "/agenda", label: "Agenda", Icon: CalendarDays },
  { href: "/arisan", label: "Arisan", Icon: PiggyBank },
  { href: "/keamanan", label: "Keamanan", Icon: ShieldCheck },
  { href: "/laporan-kas", label: "Laporan Kas", Icon: BookOpen },
  { href: "/admin", label: "Admin", Icon: CircleUser },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openMenu = useCallback(() => dialogRef.current?.showModal(), []);
  const closeMenu = useCallback(() => dialogRef.current?.close(), []);

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────── */}
      <nav
        aria-label="Navigasi utama"
        className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:gap-tight lg:border-r lg:border-stone lg:bg-paper lg:px-snug lg:py-block"
      >
        <Link
          href="/"
          className="mb-block flex min-h-11 items-center gap-tight rounded-md px-tight font-display text-lg text-evergreen-deep"
        >
          <span aria-hidden="true" className="text-brass">
            ❀
          </span>
          Camellians
        </Link>

        {[...TABS, ...SECONDARY].map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-tight rounded-md px-tight text-sm transition-colors duration-200",
              isActive(pathname, href)
                ? "bg-mist font-medium text-evergreen-deep"
                : "text-ink hover:bg-mist",
            )}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      {/* ── Mobile bottom tabs ────────────────────────────────────── */}
      <nav
        aria-label="Navigasi utama"
        className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-stone bg-paper lg:hidden"
      >
        <ul className="flex items-stretch justify-around">
          {TABS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-hair px-hair py-tight text-xs",
                    active ? "font-medium text-evergreen" : "text-slate-muted",
                  )}
                >
                  <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
                  {label}
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={openMenu}
              className="flex min-h-14 w-full flex-col items-center justify-center gap-hair px-hair py-tight text-xs text-slate-muted"
            >
              <Menu aria-hidden="true" size={20} strokeWidth={1.5} />
              Lainnya
            </button>
          </li>
        </ul>
      </nav>

      {/* ── "Lainnya" sheet ───────────────────────────────────────── */}
      {/* Native <dialog> gives Escape-to-dismiss and focus containment for
          free, which is what SC 1.4.13 and 2.1.2 require. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="lainnya-judul"
        className="m-auto w-11/12 max-w-sm rounded-2xl bg-paper p-card backdrop:bg-ink/40"
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) dismisses.
          if (event.target === dialogRef.current) closeMenu();
        }}
      >
        <div className="mb-snug flex items-center justify-between gap-snug">
          <h2 id="lainnya-judul" className="text-lg">
            Menu Lainnya
          </h2>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Tutup menu"
            className="flex size-11 items-center justify-center rounded-md text-slate-muted hover:bg-mist"
          >
            <X aria-hidden="true" size={20} strokeWidth={1.5} />
          </button>
        </div>
        <ul className="space-y-hair">
          {SECONDARY.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={closeMenu}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-tight rounded-md px-tight text-sm",
                  isActive(pathname, href)
                    ? "bg-mist font-medium text-evergreen-deep"
                    : "text-ink hover:bg-mist",
                )}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={1.5} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
