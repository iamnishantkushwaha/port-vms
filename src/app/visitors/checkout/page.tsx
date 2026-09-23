"use client";

import React, { useCallback, useRef, useState } from "react";
import QrScanner from "@/components/QrScanner";

type State =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function VisitorCheckoutPage() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [paused, setPaused] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const processingRef = useRef(false);

  const handleScan = useCallback(async (passCode: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setPaused(true);
    try {
      const res = await fetch("/api/visitors/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ status: "error", message: data.error || "Pass not recognized." });
      } else {
        setState({ status: "success", message: `${data.visitor.name} checked out. Thanks for visiting!` });
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
    await handleScan(manualCode.trim().toUpperCase());
    setManualCode("");
  }

  return (
    <div className="max-w-xl space-y-6">
      <p className="text-sm text-slate-500">Scan the visitor&apos;s pass QR to close out their visit.</p>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <QrScanner onScan={handleScan} paused={paused} />
      </div>

      {state.status !== "idle" && (
        <div
          className={`rounded-xl border p-4 text-sm shadow-card ${
            state.status === "success" ? "border-green-200 bg-green-50 text-green-900" : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <form onSubmit={submitManual} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <label className="block text-sm font-medium text-slate-700">Manual pass entry (fallback)</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="e.g. VIS-AB12CD"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 font-mono focus:border-port-500 focus:outline-none focus:ring-2 focus:ring-port-100"
          />
          <button
            type="submit"
            className="rounded-md bg-port-950 px-4 py-2 text-sm font-medium text-white shadow-card hover:bg-slate-900"
          >
            Check out
          </button>
        </div>
      </form>
    </div>
  );
}
