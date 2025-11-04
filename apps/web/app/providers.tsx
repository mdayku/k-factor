"use client";

/**
 * Providers Component
 * Wraps app with NextAuth SessionProvider
 */

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

