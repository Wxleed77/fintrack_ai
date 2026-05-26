import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "PKR"): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" });
}

export function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Bills", "Entertainment",
  "Shopping", "Healthcare", "Education", "Other",
];

export const INCOME_CATEGORIES = [
  "Salary", "Freelancing", "Business", "Investment", "Gift", "Other",
];

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "easypaisa", label: "EasyPaisa" },
  { value: "jazzcash", label: "JazzCash" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#1D9E75", Transport: "#EF9F27", Bills: "#378ADD",
  Entertainment: "#D4537E", Shopping: "#7F77DD", Healthcare: "#D85A30",
  Education: "#0F6E56", Salary: "#1D9E75", Freelancing: "#378ADD",
  Business: "#7F77DD", Investment: "#EF9F27", Other: "#888780",
};
