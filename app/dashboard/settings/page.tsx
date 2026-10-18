"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Bell, Check, Loader2, Shield, Sliders, Tags, Trash2, Plus } from "lucide-react";
import { toast } from "@/lib/toast";
import { useCategories } from "@/components/layout/CategoriesProvider";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    currencyFormat: "PKR",
  });
  const [prefsSaving, setPrefsSaving] = useState(false);

  const { customCategories, addCategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState({ name: "", type: "EXPENSE" as "INCOME" | "EXPENSE" });
  const [catAdding, setCatAdding] = useState(false);

  const handleCategoryAdd = async () => {
    if (!newCategory.name.trim()) return;
    setCatAdding(true);
    const created = await addCategory(newCategory.name, newCategory.type);
    setCatAdding(false);
    if (created) {
      setNewCategory({ name: "", type: newCategory.type });
    }
  };

  // Load persisted preferences: currency from the profile API, notifications from localStorage
  useEffect(() => {
    fetch("/api/user/profile")
      .then(r => (r.ok ? r.json() : Promise.reject(new Error("unauthorized"))))
      .then(user =>
        setPreferences(p => ({
          ...p,
          currencyFormat: user.currency || "PKR",
        }))
      )
      .catch(() => { /* fall back to defaults */ });
    try {
      const saved = window.localStorage.getItem("fin:prefs:emailNotifications");
      if (saved !== null) setPreferences(p => ({ ...p, emailNotifications: saved === "true" }));
    } catch { /* ignore */ }
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        showMsg("success", "Profile updated");
        toast("Profile updated", { type: "success" });
        await update({ name: profile.name });
      } else {
        let text = "Failed to update";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") text = data.error;
        } catch { /* non-JSON body */
        }
        showMsg("error", text);
        toast(text, { type: "error" });
      }
    } catch {
      showMsg("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      showMsg("error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: password.current, newPassword: password.new }),
      });
      if (res.ok) {
        showMsg("success", "Password changed");
        toast("Password changed", { type: "success" });
        setPassword({ current: "", new: "", confirm: "" });
      } else {
        let text = "Failed to change password";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") text = data.error;
        } catch { /* non-JSON body */
        }
        showMsg("error", text);
      }
    } catch {
      showMsg("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setPrefsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: preferences.currencyFormat,
        }),
      });
      if (res.ok) {
        try {
          window.localStorage.setItem("fin:prefs:emailNotifications", String(preferences.emailNotifications));
        } catch { /* ignore */ }
        showMsg("success", "Preferences saved");
        toast("Preferences saved", { type: "success" });
        // Propagate the new currency to the client session immediately
        await update({ currency: preferences.currencyFormat });
      } else {
        let text = "Failed to save preferences";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") text = data.error;
        } catch { /* non-JSON body */
        }
        showMsg("error", text);
      }
    } catch {
      showMsg("error", "An error occurred");
    } finally {
      setPrefsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "categories", label: "Categories", icon: Tags },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="card p-1.5 flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              activeTab === id
                ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-slide-down ${
            message.type === "success"
              ? "bg-teal-500/10 border border-teal-500/20 text-teal-500"
              : "bg-coral-500/10 border border-coral-500/20 text-coral-500"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${message.type === "success" ? "bg-teal-500" : "bg-coral-500"}`} />
          {message.text}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="card p-6">
          <h2 className="font-display font-semibold text-[var(--text-primary)] mb-6">Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-md">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="input opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-[var(--text-tertiary)]">Email cannot be changed</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="card p-6 max-w-md">
          <h2 className="font-display font-semibold text-[var(--text-primary)] mb-6">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Current Password</label>
              <input
                type="password"
                value={password.current}
                onChange={e => setPassword({ ...password, current: e.target.value })}
                className="input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">New Password</label>
              <input
                type="password"
                value={password.new}
                onChange={e => setPassword({ ...password, new: e.target.value })}
                className="input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">Confirm Password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={e => setPassword({ ...password, confirm: e.target.value })}
                className="input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="card p-6">
          <h2 className="font-display font-semibold text-[var(--text-primary)] mb-6">Preferences</h2>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-card)]">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-[var(--text-tertiary)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Email Notifications</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Get updates about your finances</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 ${
                  preferences.emailNotifications ? "bg-indigo-500" : "bg-[var(--bg-hover)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-150 ${
                    preferences.emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border-card)] space-y-2">
              <label className="block text-sm font-medium text-[var(--text-primary)]">Currency Format</label>
              <select
                value={preferences.currencyFormat}
                onChange={e => setPreferences({ ...preferences, currencyFormat: e.target.value })}
                className="select"
              >
                <option value="PKR">Pakistan Rupee (PKR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
              <p className="text-xs text-[var(--text-tertiary)]">
                Applies to all amounts across the app
              </p>
            </div>

            <button type="button" onClick={handlePreferencesSave} disabled={prefsSaving} className="btn-primary">
              {prefsSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      )}
      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="card p-6">
          <h2 className="font-display font-semibold text-[var(--text-primary)] mb-1">Categories</h2>
          <p className="text-xs text-[var(--text-tertiary)] mb-6">
            Extension of the built-in Income/Expense categories. Existing transactions keep working if a category is deleted.
          </p>

          {/* Add form */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mb-8">
            <select
              value={newCategory.type}
              onChange={e => setNewCategory({ ...newCategory, type: e.target.value as "INCOME" | "EXPENSE" })}
              className="select w-auto"
              aria-label="Category type"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <input
              type="text"
              value={newCategory.name}
              onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleCategoryAdd(); } }}
              placeholder="Category name (e.g. Groceries)"
              className="input flex-1"
              maxLength={30}
            />
            <button
              type="button"
              onClick={handleCategoryAdd}
              disabled={catAdding || !newCategory.name.trim()}
              className="btn-primary whitespace-nowrap"
            >
              {catAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </button>
          </div>

          {customCategories.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)] py-6 text-center">
              No custom categories yet — you can also add them inline while logging a transaction
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {customCategories.map(cat => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between px-4 py-3 rounded-md border border-[var(--border-card)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-2xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                        cat.type === "INCOME"
                          ? "bg-teal-500/10 text-teal-500"
                          : "bg-coral-500/10 text-coral-500"
                      }`}
                    >
                      {cat.type === "INCOME" ? "Income" : "Expense"}
                    </span>
                    <span className="text-sm text-[var(--text-primary)] truncate">{cat.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat.id)}
                    aria-label={`Delete ${cat.name}`}
                    title="Delete category"
                    className="p-2 rounded-md text-[var(--text-tertiary)] hover:text-coral-500 hover:bg-coral-500/10 transition-all duration-150"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
