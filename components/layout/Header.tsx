"use client";
import { signOut } from "next-auth/react";
import { Bell, LogOut, User, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { AddTransactionModal } from "@/components/forms/AddTransactionModal";

interface HeaderProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function Header({ user }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium text-gray-900 dark:text-white">
            Good morning, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add Transaction
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-100 dark:border-gray-800">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {initials}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
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
