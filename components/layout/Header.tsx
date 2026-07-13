"use client";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Moon, Sun, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { AddTransactionModal } from "@/components/forms/AddTransactionModal";

interface HeaderProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function Header({ user }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  const handleSuccess = useCallback(() => {
    setShowModal(false);
    window.dispatchEvent(new CustomEvent("fin:data-change"));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--bg-card)] border-b border-[var(--border-card)] px-4 lg:px-6 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="hidden lg:block">
          <h2 className="text-sm font-medium text-[var(--text-primary)]">
            Good morning, {user.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-xs text-[var(--text-tertiary)]">
            {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 lg:gap-2.5 ml-auto">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary text-xs lg:text-sm px-3 lg:px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </button>

          <button className="btn-ghost p-2 rounded-xl relative">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl" title="Toggle theme">
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-[var(--border-card)]">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
              {initials}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="btn-ghost p-2 rounded-xl text-[var(--text-tertiary)] hover:text-rose-500"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </>
  );
}