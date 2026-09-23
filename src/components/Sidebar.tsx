"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconAnchor } from "@/components/icons";
import { navSections } from "@/lib/nav";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-port-900/60 bg-port-950 text-slate-300 lg:flex">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-port-700 text-white">
          <IconAnchor className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Port VMS</p>
          <p className="text-xs text-slate-400">Visitor management</p>
        </div>
      </div>

      <nav className="thin-scroll flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>
            <div className="mt-1.5 space-y-0.5">
              {section.links.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-port-700 text-white shadow-card"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-xs text-slate-500">Single-gate demo build</p>
        <p className="text-xs text-slate-600">v0.1 — local data only</p>
      </div>
    </aside>
  );
}
