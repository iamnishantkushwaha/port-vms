"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/gate": "Gate — vehicle entry (ANPR)",
  "/employees/signin": "Employee sign-in",
  "/employees": "Employee directory",
  "/visitors/checkin": "Visitor check-in",
  "/visitors/checkout": "Visitor check-out",
  "/logs/vehicles": "Vehicle log",
  "/logs/access": "Access log",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Port Visitor Management System";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 bg-white/85 px-4 py-3.5 backdrop-blur sm:gap-4 sm:px-5 sm:py-4 lg:px-8">
      <div className="flex min-w-0 items-center gap-2.5">
        <MobileMenu />
        <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base lg:text-lg">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200 sm:px-3 sm:text-xs">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          <span className="hidden sm:inline">Demo environment</span>
          <span className="sm:hidden">Demo</span>
        </span>
        <Link
          href="/"
          className="hidden rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 md:inline-block"
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
}
