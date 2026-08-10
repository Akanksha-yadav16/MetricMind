"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

const DEFAULT_SETTINGS = {
  name: "MetricMind User",
  email: "user@example.com",
  darkMode: false,
  notifications: true,
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
};

const SETTINGS_KEY = "metricmind_settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        // Browser-only preferences are hydrated after the initial render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error("Settings load error:", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [ready, settings.darkMode]);

  function update(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      document.documentElement.classList.toggle("dark", settings.darkMode);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Settings save error:", error);
    }
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(SETTINGS_KEY);
    document.documentElement.classList.remove("dark");
    setSaved(false);
  }

  const fieldClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your MetricMind preferences.</p>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                <p className="mt-1 text-sm text-gray-600">Your local profile information for this browser.</p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-800">Name</span>
                  <input value={settings.name} onChange={(e) => update("name", e.target.value)} className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-800">Email</span>
                  <input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} className={fieldClass} />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                <p className="mt-1 text-sm text-gray-600">Customize how MetricMind looks.</p>
              </div>
              <ToggleRow
                title="Dark Mode"
                description="Use a darker interface for low-light environments."
                checked={settings.darkMode}
                onChange={(value) => update("darkMode", value)}
              />
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
                <p className="mt-1 text-sm text-gray-600">Configure dashboard display preferences.</p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-800">Dataset Currency</span>
                  <select value={settings.currency} onChange={(e) => update("currency", e.target.value)} className={fieldClass}>
                    <option value="INR">₹ Indian Rupee (INR)</option>
                  </select>
                  <span className="mt-2 block text-xs text-gray-500">The current MetricMind dataset is stored in INR.</span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-800">Date Format</span>
                  <select value={settings.dateFormat} onChange={(e) => update("dateFormat", e.target.value)} className={fieldClass}>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="mt-1 text-sm text-gray-600">Control local notification preferences.</p>
              </div>
              <ToggleRow
                title="Enable Notifications"
                description="Keep notification preferences enabled for future MetricMind alerts."
                checked={settings.notifications}
                onChange={(value) => update("notifications", value)}
              />
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div aria-live="polite" className="min-h-6">
                {saved && <p className="font-semibold text-green-600">✓ Settings saved successfully</p>}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleReset} className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-50">Reset</button>
                <button type="button" onClick={handleSave} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">Save Changes</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
