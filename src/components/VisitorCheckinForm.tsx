"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import CameraCapture from "@/components/CameraCapture";

type Employee = { id: string; name: string; department: string };

const PURPOSES = ["Delivery", "Meeting", "Contractor / Maintenance", "Inspection", "Other"];

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-port-500 focus:outline-none focus:ring-2 focus:ring-port-100";

export default function VisitorCheckinForm({
  employees,
  initialPlate,
}: {
  employees: Employee[];
  initialPlate?: string;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [hostEmployeeId, setHostEmployeeId] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState(initialPlate ? initialPlate.toUpperCase() : "");
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pass, setPass] = useState<{ passCode: string; qr: string; hostName?: string } | null>(null);

  const host = employees.find((e) => e.id === hostEmployeeId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Visitor name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          purpose,
          hostEmployeeId: hostEmployeeId || undefined,
          vehiclePlate: vehiclePlate || undefined,
          idPhotoDataUrl: idPhoto || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check-in failed");
      const qr = await QRCode.toDataURL(data.visitor.passCode, { margin: 1, width: 200 });
      setPass({ passCode: data.visitor.passCode, qr, hostName: host?.name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (pass) {
    return (
      <div className="max-w-md space-y-4 rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-card sm:p-8">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white">
          ✓
        </span>
        <p className="text-lg font-semibold text-green-900">You&apos;re checked in, {name}!</p>
        {pass.hostName && (
          <p className="text-sm text-green-800">{pass.hostName} has been notified you&apos;re here.</p>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pass.qr}
          alt="Visitor pass QR"
          className="mx-auto rounded-lg border border-green-200 bg-white p-2 shadow-card"
        />
        <p className="inline-block rounded bg-white px-2.5 py-1 font-mono text-sm text-green-900 shadow-card">
          {pass.passCode}
        </p>
        <p className="text-xs text-green-700">Keep this pass — scan it on the Visitor Check-Out page when you leave.</p>
        <button
          type="button"
          onClick={() => {
            setPass(null);
            setName("");
            setCompany("");
            setVehiclePlate("");
            setIdPhoto(null);
          }}
          className="mt-2 rounded-md bg-port-950 px-4 py-2 text-sm font-medium text-white shadow-card hover:bg-slate-900"
        >
          Check in another visitor
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Purpose of visit</label>
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className={inputClass}>
            {PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Host / employee visiting</label>
          <select value={hostEmployeeId} onChange={(e) => setHostEmployeeId(e.target.value)} className={inputClass}>
            <option value="">— None / not applicable —</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Vehicle plate (if driving in)</label>
        <input
          value={vehiclePlate}
          onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
          placeholder="e.g. KA01ZZ9999"
          className={`${inputClass} font-mono`}
        />
        {initialPlate && (
          <p className="mt-1.5 text-xs text-amber-600">Pre-filled from the gate scan — correct it if needed.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">ID photo (optional)</label>
        <div className="mt-1.5">
          <CameraCapture onCapture={setIdPhoto} label="Capture ID photo" />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-100">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-green-700 px-4 py-2.5 text-sm font-medium text-white shadow-card hover:bg-green-800 disabled:opacity-50"
      >
        {submitting ? "Checking in..." : "Check in"}
      </button>
    </form>
  );
}
