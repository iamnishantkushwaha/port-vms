"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo convenience: these match the SITE_USER / SITE_PASSWORD env vars
  // you set. Clicking the hint below the form fills the fields in for you.
  const DEMO_ID = "admin";
  const DEMO_PASSWORD = "Admin@123";

  function fillDemoCredentials() {
    setUserId(DEMO_ID);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      if (res.ok) {
        const next = params.get("next") || "/";
        router.push(next);
        router.refresh();
      } else {
        setError("Incorrect ID or password. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-port-950 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-popover">
        <h1 className="text-lg font-semibold text-slate-900">Port VMS — Demo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="userId" className="mb-1 block text-xs font-medium text-slate-600">
              ID
            </label>
            <input
              id="userId"
              type="text"
              autoFocus
              autoComplete="username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Your ID"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-port-500 focus:outline-none focus:ring-1 focus:ring-port-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-port-500 focus:outline-none focus:ring-1 focus:ring-port-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-port-600 px-3 py-2 text-sm font-medium text-white shadow-card hover:bg-port-700 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="mt-5 w-full rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-left text-xs text-slate-500 hover:border-port-300 hover:bg-slate-100"
        >
          Demo credentials — ID: <span className="font-medium text-slate-700">{DEMO_ID}</span>{" "}
          · Password: <span className="font-medium text-slate-700">{DEMO_PASSWORD}</span>{" "}
          <span className="text-port-600">(click to fill in)</span>
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
