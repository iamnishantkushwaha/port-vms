"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navSections } from "@/lib/nav";

export default function MobileNav() {
  const pathname = usePathname();
  const links = navSections.flatMap((s) => s.links);

  return (
    <nav className="thin-scroll flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2.5 lg:hidden">
      {links.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              active ? "bg-port-700 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
