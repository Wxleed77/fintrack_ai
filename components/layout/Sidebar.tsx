"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ArrowLeftRight, Wallet, Target,
  BarChart3, RefreshCw, Settings, TrendingUp, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { href: "/dashboard/budgets", icon: Wallet, label: "Budgets" },
  { href: "/dashboard/goals", icon: Target, label: "Goals" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/subscriptions", icon: RefreshCw, label: "Subscriptions" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-card)]"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5 text-[var(--text-primary)]" /> : <Menu className="h-5 w-5 text-[var(--text-primary)]" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 h-screen w-60 flex-shrink-0 z-40 flex flex-col",
          "bg-[var(--bg-card)] border-r border-[var(--border-card)]",
          "transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[var(--border-card)]">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display font-semibold text-[var(--text-primary)]">FinTrack</span>
              <span className="font-display font-semibold text-indigo-500"> AI</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-indigo-500/10 text-indigo-500"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-card)]">
          <p className="text-2xs text-[var(--text-tertiary)] text-center">v1.0 · FinTrack AI</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}