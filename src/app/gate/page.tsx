"use client";

import { useState } from "react";
import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";
import TypeBadge from "@/components/TypeBadge";

type LogResult = {
  plate: string;
  type: "employee" | "visitor" | "unknown";
  direction: "in" | "out";
  employee?: { name: string; department: string } | null;
  visitor?: { name: string; company: string | null } | null;
};

export default function GatePage() {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [direction, setDirection] = useState<"in" | "out">("in");
  const [plate, setPlate] = useState("");
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LogResult | null>(null);

  async function scanPlate() {
    if (!photoDataUrl) return;
    setScanning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: photoDataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OCR failed");
      setPlate(data.plate || "");
      if (!data.plate) {
        setError("Couldn't read a plate from that photo — type it in manually below.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR failed");
    } finally {
      setScanning(false);
    }
  }

  async function confirmEntry() {
    if (!plate.trim()) {
      setError("Enter or scan a plate number first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/vehicle-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate, direction, photoDataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not log entry");
      setResult({
        plate: data.log.plate,
        type: data.log.type,
        direction: data.log.direction,
        employee: data.log.employee,
        visitor: data.log.visitor,
      });
      setPhotoDataUrl(null);
      setPlate("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not log entry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm text-slate-500">
        Capture the plate as a vehicle arrives at the gate. The photo is read with real OCR — review the result
        before logging it, the same way an operator would double-check a misread plate.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-port-700 text-xs font-semibold text-white">
            1
          </span>
          <h2 className="text-sm font-semibold text-slate-900">Capture plate photo</h2>
        </div>
        <div className="p-5">
          <CameraCapture onCapture={setPhotoDataUrl} label="Capture plate photo" />

          {photoDataUrl && (
            <button
              type="button"
              onClick={scanPlate}
              disabled={scanning}
              className="mt-4 rounded-md bg-port-700 px-4 py-2 text-sm font-medium text-white shadow-card hover:bg-port-800 disabled:opacity-50"
            >
              {scanning ? "Reading plate..." : "Read plate (OCR)"}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-port-700 text-xs font-semibold text-white">
            2
          </span>
          <h2 className="text-sm font-semibold text-slate-900">Confirm &amp; log</h2>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Plate number</label>
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="e.g. GJ05AB1234"
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-lg tracking-wider text-slate-900 focus:border-port-500 focus:outline-none focus:ring-2 focus:ring-port-100"
            />
            <p className="mt-1.5 text-xs text-slate-400">Correct the OCR result here if it misread a character.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Direction</label>
            <div className="mt-1.5 inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
              {(["in", "out"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  className={`rounded px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    direction === d ? "bg-white text-port-700 shadow-card" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-100">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={confirmEntry}
            disabled={submitting}
            className="w-full rounded-md bg-port-950 px-4 py-2.5 text-sm font-medium text-white shadow-card hover:bg-slate-900 disabled:opacity-50 sm:w-auto"
          >
            {submitting ? "Logging..." : "Confirm & log entry"}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-card">
          <p className="font-medium text-green-900">Logged: {result.plate}</p>
          <div className="mt-2 flex items-center gap-2">
            <TypeBadge value={result.type} />
            <TypeBadge value={result.direction} />
          </div>
          {result.employee && (
            <p className="mt-2 text-sm text-green-800">
              Matched employee vehicle: {result.employee.name} ({result.employee.department})
            </p>
          )}
          {result.visitor && (
            <p className="mt-2 text-sm text-green-800">
              Matched visitor: {result.visitor.name} {result.visitor.company ? `(${result.visitor.company})` : ""}
            </p>
          )}
          {result.type === "unknown" && (
            <div className="mt-3 rounded-lg bg-amber-50 p-3 ring-1 ring-inset ring-amber-100">
              <p className="text-sm text-amber-800">No match found — this looks like a visitor vehicle.</p>
              <Link
                href={`/visitors/checkin?plate=${encodeURIComponent(result.plate)}`}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white shadow-card hover:bg-amber-700"
              >
                Register this visitor →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
