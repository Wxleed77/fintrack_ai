"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";
import { CurrencyProvider } from "./CurrencyProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <CurrencyProvider>{children}</CurrencyProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
