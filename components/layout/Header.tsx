"use client";
import { signOut } from "next-auth/react";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { AddTransactionModal } from "@/components/forms/AddTransactionModal";

interface HeaderProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function Header({ user }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  return (
    <>
      <header className="fixed lg:static top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 lg:px-6 py-2 lg:py-3 flex items-center justify-between">
        <div className="hidden lg:block">
          <h1 className="text-sm font-medium text-gray-900 dark:text-white">
            Good morning, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 ml-auto">
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs lg:text-sm px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            + Add
          </button>
          <button className="p-1.5 lg:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 lg:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 lg:h-5 lg:w-5" />
            ) : (
              <Sun className="h-4 w-4 lg:h-5 lg:w-5" />
            )}
          </button>
          <div className="flex items-center gap-1 lg:gap-2 pl-2 lg:pl-3 border-l border-gray-100 dark:border-gray-800">
            <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {initials}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); window.location.reload(); }} />}
    </>
  );
}
