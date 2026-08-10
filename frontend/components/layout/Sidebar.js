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
      href: "/",
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

      {/* Logo */}

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-3xl font-bold">
          📊 MetricMind
        </h1>

      </div>

      {/* Navigation */}

      <nav className="mt-6">

        {menuItems.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all duration-200
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}