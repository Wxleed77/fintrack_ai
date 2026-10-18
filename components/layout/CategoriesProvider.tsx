"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { CustomCategory } from "@/types";

interface CategoriesContextValue {
  /** Built-in + user-created categories merged and sorted */
  expenseCategories: string[];
  incomeCategories: string[];
  customCategories: CustomCategory[];
  addCategory: (name: string, type: "INCOME" | "EXPENSE") => Promise<string | null>;
  deleteCategory: (id: string) => Promise<boolean>;
}

const CategoriesContext = createContext<CategoriesContextValue>({
  expenseCategories: EXPENSE_CATEGORIES,
  incomeCategories: INCOME_CATEGORIES,
  customCategories: [],
  addCategory: async () => null,
  deleteCategory: async () => false,
});

function merge(base: string[], extra: CustomCategory[]): string[] {
  const seen = new Set(base.map(c => c.toLowerCase()));
  const merged = [...base];
  for (const c of extra) {
    if (!seen.has(c.name.toLowerCase())) {
      merged.push(c.name);
      seen.add(c.name.toLowerCase());
    }
  }
  // Case-insensitive alphabetical sort so the dropdown is easy to scan
  return merged.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) setCustomCategories(await res.json());
    } catch {
      /* built-in categories still work if this call fails */
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const expenseCategories = useMemo(
    () => merge(EXPENSE_CATEGORIES, customCategories.filter(c => c.type === "EXPENSE")),
    [customCategories]
  );
  const incomeCategories = useMemo(
    () => merge(INCOME_CATEGORIES, customCategories.filter(c => c.type === "INCOME")),
    [customCategories]
  );

  const addCategory = useCallback(async (name: string, type: "INCOME" | "EXPENSE") => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, type }),
      });
      if (!res.ok) {
        let message = "Failed to create category";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") message = data.error;
        } catch { /* non-JSON body */
        }
        toast(message, { type: "error" });
        return null;
      }
      const created: CustomCategory = await res.json();
      setCustomCategories(list => [...list, created]);
      return created.name;
    } catch {
      toast("Failed to create category", { type: "error" });
      return null;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    const target = customCategories.find(c => c.id === id);
    setCustomCategories(list => list.filter(c => c.id !== id));
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast("Failed to delete category", { type: "error" });
      load();
      return false;
    }
    toast(`Category "${target?.name}" deleted`, { type: "info" });
    return true;
  }, [customCategories, load]);

  const value = useMemo(
    () => ({ expenseCategories, incomeCategories, customCategories, addCategory, deleteCategory }),
    [expenseCategories, incomeCategories, customCategories, addCategory, deleteCategory]
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  return useContext(CategoriesContext);
}
