"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Bell, Check, Loader2, Shield, Sliders } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
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
      showMsg(res.ok ? "success" : "error", res.ok ? "Profile updated" : "Failed to update");
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
        setPassword({ current: "", new: "", confirm: "" });
      } else {
        showMsg("error", "Failed to change password");
      }
    } catch {
      showMsg("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Sliders },
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}