"use client";

import React, { useCallback, useRef, useState } from "react";
import QrScanner from "@/components/QrScanner";
import TypeBadge from "@/components/TypeBadge";

type ScanState = {
  status: "idle" | "success" | "error";
  message: string;
  direction?: "in" | "out";
};

export default function EmployeeSignInPage() {
  const [state, setState] = useState<ScanState>({ status: "idle", message: "Point a badge QR at the camera." });
  const [paused, setPaused] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const processingRef = useRef(false);

  const handleBadge = useCallback(async (badgeCode: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setPaused(true);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ status: "error", message: data.error || "Badge not recognized." });
      } else {
        const emp = data.log.employee;
        setState({
          status: "success",
          message: `${emp.name} (${emp.department}) signed ${data.log.direction.toUpperCase()}`,
          direction: data.log.direction,
        });
      }
    } catch {
      setState({ status: "error", message: "Network error — could not reach the server." });
    } finally {
      setTimeout(() => {
        processingRef.current = false;
        setPaused(false);
      }, 2500);
    }
  }, []);

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await handleBadge(manualCode.trim().toUpperCase());
    setManualCode("");
  }

  return (
    <div className="max-w-xl space-y-6">
      <p className="text-sm text-slate-500">
        Scan a badge QR code to sign in or out. The same scan toggles direction automatically based on the
        employee&apos;s last event.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <QrScanner onScan={handleBadge} paused={paused} />
      </div>

      <div
        className={`rounded-xl border p-4 shadow-card ${
          state.status === "success"
            ? "border-green-200 bg-green-50"
            : state.status === "error"
              ? "border-red-200 bg-red-50"
              : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {state.direction && <TypeBadge value={state.direction} />}
          <p
            className={`text-sm ${
              state.status === "success"
                ? "text-green-900"
                : state.status === "error"
                  ? "text-red-700"
                  : "text-slate-500"
            }`}
          >
            {state.message}
          </p>
        </div>
      </div>

      <form onSubmit={submitManual} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <label className="block text-sm font-medium text-slate-700">Manual badge entry (fallback)</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="e.g. EMP-1001"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 font-mono focus:border-port-500 focus:outline-none focus:ring-2 focus:ring-port-100"
          />
          <button
            type="submit"
            className="rounded-md bg-port-950 px-4 py-2 text-sm font-medium text-white shadow-card hover:bg-slate-900"
          >
            Sign in/out
          </button>
        </div>
      </form>
    </div>
  );
}
