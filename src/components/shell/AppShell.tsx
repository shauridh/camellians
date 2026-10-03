import type { ReactNode } from "react";

import { AppNav } from "@/components/shell/AppNav";

interface AppShellProps {
  children: ReactNode;
}

/**
 * The application chrome.
 *
 * `pb-tabbar` reserves room for the fixed mobile tab bar so the last item on
 * a page is never hidden behind it — that is what keeps SC 2.4.11 Focus Not
 * Obscured true for keyboard users, and it is asserted by the e2e suite.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* SC 2.4.1 Bypass Blocks: the first Tab stop skips the navigation. */}
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:left-gutter focus:top-gutter focus:z-50 focus:rounded-md focus:bg-evergreen focus:px-card focus:py-tight focus:text-ivory"
      >
        Lewati ke konten
      </a>

      <AppNav />

      <main
        id="konten-utama"
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl grow px-gutter pt-block pb-tabbar md:px-gutter-lg lg:pb-section-lg"
      >
        {children}
      </main>
    </div>
  );
}
