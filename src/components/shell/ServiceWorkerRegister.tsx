"use client";

import { useEffect } from "react";

/**
 * Registers the service worker.
 *
 * Registration is skipped during development so hot reload is never served
 * from a stale cache; production builds register after `load` so the worker
 * never competes with the first paint.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {
          /* Registration is best-effort; the app works without it. */
        });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
