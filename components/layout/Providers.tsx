"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";
import { CurrencyProvider } from "./CurrencyProvider";
import { CategoriesProvider } from "./CategoriesProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <CurrencyProvider>
          <CategoriesProvider>{children}</CategoriesProvider>
        </CurrencyProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
