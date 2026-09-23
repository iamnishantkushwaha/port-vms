"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navSections } from "@/lib/nav";
import { IconAnchor } from "@/components/icons";
import LogoutButton from "@/components/LogoutButton";

function IconMenu({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function IconClose({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function DrawerContent({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50"
      />
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-port-950 text-slate-300 shadow-popover">
        <div className="flex items-center justify-between gap-2.5 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-port-700 text-white">
              <IconAnchor className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Port VMS</p>
              <p className="text-xs text-slate-400">Visitor management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <IconClose />
          </button>
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

        <div className="border-t border-white/10 px-3 py-3">
          <LogoutButton />
        </div>
        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-xs text-slate-500">Single-gate demo build</p>
        </div>
      </div>
    </div>
  );
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portals need a real document, which only exists client-side after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the drawer automatically whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
      >
        <IconMenu />
      </button>

      {mounted && open
        ? createPortal(<DrawerContent onClose={() => setOpen(false)} pathname={pathname} />, document.body)
        : null}
    </>
  );
}
