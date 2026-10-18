"use client";
import { createContext, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";

interface CurrencyContextValue {
  currency: string;
  fmt: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "PKR",
  fmt: (amount: number) => formatCurrency(amount, "PKR"),
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const currency = session?.user?.currency || "PKR";
  const value = useMemo(
    () => ({ currency, fmt: (amount: number) => formatCurrency(amount, currency) }),
    [currency]
  );
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
