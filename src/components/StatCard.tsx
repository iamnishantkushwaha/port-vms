import type { ComponentType } from "react";

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "port",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: "port" | "amber" | "green" | "slate";
}) {
  const tones: Record<string, string> = {
    port: "bg-port-50 text-port-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
