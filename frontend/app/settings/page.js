"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // =========================================================
  // LOAD SETTINGS
  // =========================================================

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        });
      }
    } catch (error) {
      console.error("Settings load error:", error);
    } finally {
      setReady(true);
    }
  }, []);

  // =========================================================
  // APPLY DARK MODE
  // =========================================================

  useEffect(() => {
    if (!ready) return;

    document.documentElement.classList.toggle(
      "dark",
      settings.darkMode
    );
  }, [ready, settings.darkMode]);

  // =========================================================
  // UPDATE SETTINGS
  // =========================================================

  function update(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  function handleSave() {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
      );

      document.documentElement.classList.toggle(
        "dark",
        settings.darkMode
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Settings save error:", error);
    }
  }

  // =========================================================
  // RESET SETTINGS
  // =========================================================

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);

    localStorage.removeItem(SETTINGS_KEY);

    document.documentElement.classList.remove("dark");

    setSaved(false);
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    // This is the same key used by the login page
    localStorage.removeItem("metricmind_logged_in");

    // Remove stored user information
    localStorage.removeItem("metricmind_user");

    // Remove remember-me preference if present
    localStorage.removeItem("metricmind_remember");

    // Clear session authentication if it exists
    sessionStorage.removeItem("metricmind_logged_in");

    // Return to login page
    router.replace("/login");
  }

  // =========================================================
  // STYLES
  // =========================================================

  const fieldClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950";

  const pageBg = settings.darkMode
    ? "bg-gray-950"
    : "bg-gray-50";

  const cardBg = settings.darkMode
    ? "bg-gray-900"
    : "bg-white";

  const borderColor = settings.darkMode
    ? "border-gray-800"
    : "border-gray-200";

  const headingColor = settings.darkMode
    ? "text-white"
    : "text-gray-900";

  const secondaryText = settings.darkMode
    ? "text-gray-400"
    : "text-gray-600";

  const mutedText = settings.darkMode
    ? "text-gray-500"
    : "text-gray-400";

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${pageBg}`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8">
            <div className="flex items-center gap-3">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  settings.darkMode
                    ? "bg-blue-950 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                ⚙️
              </div>

              <div>
                <h1
                  className={`text-3xl font-bold md:text-4xl ${headingColor}`}
                >
                  Settings
                </h1>

                <p className={`mt-1 ${secondaryText}`}>
                  Manage your MetricMind account and preferences.
                </p>
              </div>

            </div>
          </div>

          <div className="space-y-6">

            {/* =================================================
                PROFILE
            ================================================= */}

            <section
              className={`rounded-2xl border ${borderColor} ${cardBg} p-6 shadow-sm`}
            >
              <div className="mb-6 flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                    settings.darkMode
                      ? "bg-purple-950 text-purple-400"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  👤
                </div>

                <div>
                  <h2
                    className={`text-xl font-bold ${headingColor}`}
                  >
                    Profile
                  </h2>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    Manage your MetricMind profile information.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-semibold ${headingColor}`}
                  >
                    Name
                  </span>

                  <input
                    value={settings.name}
                    onChange={(e) =>
                      update("name", e.target.value)
                    }
                    className={fieldClass}
                  />
                </label>

                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-semibold ${headingColor}`}
                  >
                    Email
                  </span>

                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      update("email", e.target.value)
                    }
                    className={fieldClass}
                  />
                </label>

              </div>
            </section>

            {/* =================================================
                APPEARANCE
            ================================================= */}

            <section
              className={`rounded-2xl border ${borderColor} ${cardBg} p-6 shadow-sm`}
            >
              <div className="mb-6 flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                    settings.darkMode
                      ? "bg-indigo-950 text-indigo-400"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  🎨
                </div>

                <div>
                  <h2
                    className={`text-xl font-bold ${headingColor}`}
                  >
                    Appearance
                  </h2>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    Customize the way MetricMind looks.
                  </p>
                </div>

              </div>

              <ToggleRow
                title="Dark Mode"
                description="Use a darker interface for low-light environments."
                checked={settings.darkMode}
                onChange={(value) =>
                  update("darkMode", value)
                }
                dark={settings.darkMode}
              />
            </section>

            {/* =================================================
                PREFERENCES
            ================================================= */}

            <section
              className={`rounded-2xl border ${borderColor} ${cardBg} p-6 shadow-sm`}
            >
              <div className="mb-6 flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                    settings.darkMode
                      ? "bg-green-950 text-green-400"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  🛠️
                </div>

                <div>
                  <h2
                    className={`text-xl font-bold ${headingColor}`}
                  >
                    Preferences
                  </h2>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    Configure how information is displayed.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-semibold ${headingColor}`}
                  >
                    Dataset Currency
                  </span>

                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      update("currency", e.target.value)
                    }
                    className={fieldClass}
                  >
                    <option value="INR">
                      ₹ Indian Rupee (INR)
                    </option>
                  </select>

                  <span className={`mt-2 block text-xs ${mutedText}`}>
                    Current MetricMind sales data uses INR.
                  </span>
                </label>

                <label className="block">
                  <span
                    className={`mb-2 block text-sm font-semibold ${headingColor}`}
                  >
                    Date Format
                  </span>

                  <select
                    value={settings.dateFormat}
                    onChange={(e) =>
                      update("dateFormat", e.target.value)
                    }
                    className={fieldClass}
                  >
                    <option value="DD/MM/YYYY">
                      DD/MM/YYYY
                    </option>

                    <option value="MM/DD/YYYY">
                      MM/DD/YYYY
                    </option>

                    <option value="YYYY-MM-DD">
                      YYYY-MM-DD
                    </option>
                  </select>
                </label>

              </div>
            </section>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <section
              className={`rounded-2xl border ${borderColor} ${cardBg} p-6 shadow-sm`}
            >
              <div className="mb-6 flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                    settings.darkMode
                      ? "bg-orange-950 text-orange-400"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  🔔
                </div>

                <div>
                  <h2
                    className={`text-xl font-bold ${headingColor}`}
                  >
                    Notifications
                  </h2>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    Manage your MetricMind notification preferences.
                  </p>
                </div>

              </div>

              <ToggleRow
                title="Enable Notifications"
                description="Keep notification preferences enabled for future MetricMind alerts."
                checked={settings.notifications}
                onChange={(value) =>
                  update("notifications", value)
                }
                dark={settings.darkMode}
              />
            </section>

            {/* =================================================
                SAVE / RESET
            ================================================= */}

            <section
              className={`flex flex-col gap-4 rounded-2xl border ${borderColor} ${cardBg} p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between`}
            >
              <div
                aria-live="polite"
                className="min-h-6"
              >
                {saved && (
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    ✓ Settings saved successfully
                  </p>
                )}
              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={handleReset}
                  className={`rounded-xl border px-5 py-3 font-semibold transition ${
                    settings.darkMode
                      ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Save Changes
                </button>

              </div>
            </section>

            {/* =================================================
                ACCOUNT / LOGOUT
            ================================================= */}

            <section
              className={`rounded-2xl border ${
                settings.darkMode
                  ? "border-red-900/70 bg-red-950/20"
                  : "border-red-200 bg-white"
              } p-6 shadow-sm`}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-4">

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                      settings.darkMode
                        ? "bg-red-950 text-red-400"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    🚪
                  </div>

                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        settings.darkMode
                          ? "text-red-300"
                          : "text-gray-900"
                      }`}
                    >
                      Account
                    </h2>

                    <p
                      className={`mt-1 text-sm ${
                        settings.darkMode
                          ? "text-red-400/80"
                          : "text-gray-600"
                      }`}
                    >
                      Sign out of your MetricMind account on this device.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setLogoutOpen(true)}
                  className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  Log Out
                </button>

              </div>
            </section>

          </div>
        </div>
      </main>

      {/* =====================================================
          LOGOUT CONFIRMATION MODAL
      ===================================================== */}

      {logoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
              settings.darkMode
                ? "bg-gray-900"
                : "bg-white"
            }`}
          >

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600 dark:bg-red-950 dark:text-red-400">
                🚪
              </div>

              <div>
                <h3
                  className={`text-xl font-bold ${headingColor}`}
                >
                  Log out?
                </h3>

                <p className={`mt-1 text-sm ${secondaryText}`}>
                  You will be returned to the MetricMind login page.
                </p>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className={`rounded-xl border px-5 py-3 font-semibold ${
                  settings.darkMode
                    ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
              >
                Yes, Log Out
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// TOGGLE COMPONENT
// =============================================================

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  dark,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div>
        <p
          className={`font-semibold ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-1 text-sm ${
            dark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : dark
            ? "bg-gray-700"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>

    </div>
  );
}