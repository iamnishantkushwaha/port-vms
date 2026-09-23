"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLogout } from "@/components/icons";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/login", { method: "DELETE" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-60 ${className}`}
    >
      <IconLogout className="h-4 w-4 shrink-0" />
      <span>{loading ? "Logging out…" : "Log out"}</span>
    </button>
  );
}
