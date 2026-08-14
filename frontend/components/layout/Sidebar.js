"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  BarChart3,
  MessageCircle,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "AI Chat",
      href: "/chat",
      icon: MessageCircle,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="sticky top-0 hidden min-h-screen w-64 shrink-0 bg-slate-900 text-white shadow-xl md:block">

      {/* =====================================================
          METRICMIND BRAND
      ===================================================== */}

      <div className="border-b border-slate-700 p-6">

        <div className="flex items-center gap-3">

          {/* MetricMind Project Emblem */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400 shadow-lg shadow-cyan-500/20">

            <div className="flex items-end gap-1">

              <span className="h-5 w-1.5 rounded-full bg-slate-950"></span>

              <span className="h-7 w-1.5 rounded-full bg-slate-950"></span>

              <span className="h-9 w-1.5 rounded-full bg-slate-950"></span>

            </div>

          </div>

          {/* Project Name */}

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              MetricMind
            </h1>

            <p className="mt-0.5 text-xs font-medium text-cyan-300">
              Business Analytics
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="mt-6 px-3">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        <div className="space-y-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                  active
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >

                <Icon
                  size={21}
                  strokeWidth={active ? 2.5 : 2}
                  className={`shrink-0 transition-transform duration-200 ${
                    active
                      ? ""
                      : "group-hover:scale-110"
                  }`}
                />

                <span className="font-medium">
                  {item.name}
                </span>

                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                )}

              </Link>
            );

          })}

        </div>

      </nav>


      {/* =====================================================
          BOTTOM BRAND AREA
      ===================================================== */}

      <div className="absolute bottom-0 left-0 w-64 border-t border-slate-800 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">

            <div className="flex items-end gap-0.5">

              <span className="h-3 w-1 rounded-full bg-cyan-400"></span>

              <span className="h-5 w-1 rounded-full bg-cyan-400"></span>

              <span className="h-7 w-1 rounded-full bg-cyan-400"></span>

            </div>

          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300">
              MetricMind
            </p>

            <p className="text-[11px] text-slate-500">
              Analytics Platform
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}